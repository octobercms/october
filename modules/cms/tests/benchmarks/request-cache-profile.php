<?php
/**
 * Counts the cache operations a single page request performs.
 *
 * Every rendered template costs its own cache reads, so the count grows with
 * the number of partials on the page. On a shared cache server each operation
 * is a network round trip, which is why the script can add artificial latency
 * to show what those round trips cost.
 *
 * The requests run in separate processes so nothing carries over between them
 * the way it would inside one PHP process, and the cache lives on disk so the
 * later requests see what the earlier ones stored.
 *
 * Usage: php modules/cms/tests/benchmarks/request-cache-profile.php [--partials=N] [--latency=US]
 */

$root = dirname(__DIR__, 4);
$options = getopt('', ['partials::', 'latency::', 'child::', 'dir::', 'url::']);

$workDir = $options['dir'] ?? sys_get_temp_dir() . '/october-request-profile';
$themesPath = $workDir . '/themes';
$themeName = 'benchmark';
$latency = (int) ($options['latency'] ?? 0);

//
// Parent process: build a theme, run the requests, report
//

if (!isset($options['child'])) {
    $partials = (int) ($options['partials'] ?? 20);

    exec('rm -rf ' . escapeshellarg($workDir));
    makeBenchmarkTheme($themesPath . '/' . $themeName, $partials);

    // Twig and the parsed PHP files are stored outside the cache, clear them so
    // the run does not inherit templates built for an earlier partial count
    foreach (['twig', 'cache'] as $dir) {
        foreach (glob($root . '/storage/cms/' . $dir . '/*', GLOB_ONLYDIR) ?: [] as $directory) {
            exec('rm -rf ' . escapeshellarg($directory));
        }
    }

    $url = '/section-0/page-0';
    $command = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg(__FILE__)
        . ' --dir=' . escapeshellarg($workDir)
        . ' --url=' . escapeshellarg($url);

    // The first requests populate the cache, the last one is measured
    foreach (['warm', 'warm', 'measured'] as $tag) {
        $latencyArg = $tag === 'measured' ? ' --latency=' . $latency : '';
        exec($command . ' --child=' . escapeshellarg($tag) . $latencyArg, $output, $status);

        if ($status !== 0) {
            fwrite(STDERR, implode(PHP_EOL, $output) . PHP_EOL);
            exit($status);
        }
    }

    $report = reportOperations($workDir . '/ops.log', 'measured', $partials, $latency);
    $report['request'] = trim((string) array_pop($output));

    echo json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;

    exit(0);
}

//
// Child process: handle one request
//

$tag = (string) $options['child'];
$url = $options['url'] ?? '/';

@mkdir($workDir . '/data', 0777, true);

foreach ([
    'APP_ENV' => 'testing',
    'APP_KEY' => 'base64:' . base64_encode(substr(str_repeat('october-benchmark-', 2), 0, 32)),
    'APP_LOCALE' => 'en',
    'APP_DEBUG' => 'false',
    'CACHE_DRIVER' => 'array',
    'CACHE_STORE' => 'array',
    'SESSION_DRIVER' => 'array',
    'ACTIVE_THEME' => $themeName,
    'CMS_SAFE_MODE' => 'false',
    'CMS_ROUTE_CACHE' => 'true',
    'CMS_TWIG_CACHE' => 'true',
    'PLUGINS_PATH' => 'modules/system/tests/fixtures/plugins',
    'THEMES_PATH' => $themesPath,
    'ENABLE_CSRF' => 'false',
    'DB_CONNECTION' => 'sqlite',
    'DB_DATABASE' => $workDir . '/db.sqlite',
] as $name => $value) {
    putenv("$name=$value");
    $_ENV[$name] = $_SERVER[$name] = $value;
}

chdir($root);

require $root . '/bootstrap/autoload.php';

October\Rain\Composer\ClassLoader::configure($root)
    ->withNamespace('App\\', '')
    ->withDirectories(['modules', 'plugins'])
    ->register();

/**
 * LoggingFileStore persists to disk so state survives between processes and
 * records every operation, optionally paying a round trip cost first
 */
class LoggingFileStore implements Illuminate\Contracts\Cache\Store
{
    public function __construct(
        protected string $dir,
        protected string $log,
        protected string $tag,
        protected int $latency
    ) {
    }

    protected function pathFor($key): string
    {
        return $this->dir . '/' . md5($key) . '.cache';
    }

    protected function record(string $op, string $key, int $bytes): void
    {
        if ($this->latency) {
            usleep($this->latency);
        }

        file_put_contents(
            $this->log,
            json_encode(['tag' => $this->tag, 'op' => $op, 'key' => $key, 'bytes' => $bytes]) . "\n",
            FILE_APPEND
        );
    }

    public function get($key)
    {
        $path = $this->pathFor($key);

        if (!is_file($path)) {
            $this->record('miss', $key, 0);
            return null;
        }

        $raw = file_get_contents($path);
        $this->record('get', $key, strlen($raw));

        $entry = @unserialize($raw);
        if (!is_array($entry)) {
            return null;
        }

        if ($entry['expires'] !== 0 && $entry['expires'] < time()) {
            @unlink($path);
            return null;
        }

        return unserialize($entry['value']);
    }

    public function many(array $keys)
    {
        $result = [];
        foreach ($keys as $key) {
            $result[$key] = $this->get($key);
        }
        return $result;
    }

    public function put($key, $value, $seconds)
    {
        $raw = serialize([
            'expires' => $seconds > 0 ? time() + $seconds : 0,
            'value' => serialize($value),
        ]);

        $this->record('put', $key, strlen($raw));
        file_put_contents($this->pathFor($key), $raw, LOCK_EX);

        return true;
    }

    public function putMany(array $values, $seconds)
    {
        foreach ($values as $key => $value) {
            $this->put($key, $value, $seconds);
        }
        return true;
    }

    public function increment($key, $value = 1)
    {
        $result = (int) $this->get($key) + $value;
        $this->put($key, $result, 0);
        return $result;
    }

    public function decrement($key, $value = 1)
    {
        return $this->increment($key, -$value);
    }

    public function forever($key, $value)
    {
        return $this->put($key, $value, 0);
    }

    public function forget($key)
    {
        $this->record('forget', $key, 0);
        @unlink($this->pathFor($key));
        return true;
    }

    public function flush()
    {
        foreach (glob($this->dir . '/*.cache') as $file) {
            @unlink($file);
        }
        return true;
    }

    public function getPrefix()
    {
        return '';
    }
}

$app = require $root . '/bootstrap/app.php';

$app->booting(function ($app) use ($workDir, $tag, $latency) {
    $app['config']->set('cache.stores.profiled', ['driver' => 'profiled']);
    $app['config']->set('cache.default', 'profiled');

    $app['cache']->extend('profiled', function () use ($app, $workDir, $tag, $latency) {
        return $app['cache']->repository(
            new LoggingFileStore($workDir . '/data', $workDir . '/ops.log', $tag, $latency)
        );
    });
});

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create($url, 'GET');

$start = hrtime(true);
$response = $kernel->handle($request);
$elapsed = (hrtime(true) - $start) / 1e6;

if ($response->getStatusCode() !== 200) {
    fwrite(STDERR, 'Request failed with status ' . $response->getStatusCode() . PHP_EOL);
    fwrite(STDERR, substr($response->getContent(), 0, 2000) . PHP_EOL);
    exit(1);
}

printf('status=%d time=%.1fms bytes=%d', $response->getStatusCode(), $elapsed, strlen($response->getContent()));

$kernel->terminate($request, $response);

//
// Helpers
//

/**
 * reportOperations summarises the operations logged by one request
 */
function reportOperations(string $log, string $tag, int $partials, int $latency): array
{
    $groups = [];
    $operations = 0;
    $bytes = 0;

    foreach (file($log, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $entry = json_decode($line, true);

        if (!is_array($entry) || ($entry['tag'] ?? null) !== $tag) {
            continue;
        }

        $group = 'other';
        foreach (['halcyon', 'cms_code_parser', 'cms_component_props', 'page-url-map', 'yaml::'] as $prefix) {
            if (str_contains($entry['key'], $prefix)) {
                $group = $prefix;
                break;
            }
        }

        $groups[$group] ??= ['operations' => 0, 'bytes' => 0];
        $groups[$group]['operations']++;
        $groups[$group]['bytes'] += $entry['bytes'];

        $operations++;
        $bytes += $entry['bytes'];
    }

    return [
        'partials' => $partials,
        'latency_us' => $latency,
        'cache_operations' => $operations,
        'cache_bytes' => $bytes,
        'by_group' => $groups,
    ];
}

/**
 * makeBenchmarkTheme writes a theme whose page pulls in a set of partials
 */
function makeBenchmarkTheme(string $base, int $partials): void
{
    foreach (['', '/pages', '/layouts', '/partials'] as $dir) {
        if (!is_dir($base . $dir)) {
            mkdir($base . $dir, 0755, true);
        }
    }

    file_put_contents($base . '/theme.yaml', "name: Benchmark\ndescription: Generated for benchmarking\n");

    $partialCalls = '';
    for ($i = 0; $i < $partials; $i++) {
        file_put_contents(
            $base . "/partials/block-{$i}.htm",
            "==\n<div class=\"block-{$i}\">{% for n in 1..3 %}<span>{{ n }}</span>{% endfor %}</div>\n"
        );

        $partialCalls .= "{% partial 'block-{$i}' %}\n";
    }

    file_put_contents(
        $base . '/layouts/default.htm',
        "==\n<html><body>\n{$partialCalls}{% page %}\n</body></html>\n"
    );

    file_put_contents($base . '/pages/page-0.htm', <<<'HTM'
    url = "/section-0/page-0"
    layout = "default"
    ==
    function onStart()
    {
        $this['pageIndex'] = 0;
    }
    ==
    <h1>Benchmark page</h1>
    HTM);
}
