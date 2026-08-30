<?php
/**
 * Measures the cache traffic of CmsCompoundObject::getComponentProperties.
 *
 * Reads are what a request pays to look up one object's properties, writes are
 * what caching a newly seen object costs. Both are reported in bytes crossing
 * the wire, which is the cost that matters on a shared cache server.
 *
 * Usage: php modules/cms/tests/benchmarks/component-props-bench.php [--objects=N] [--iterations=N]
 */

use Cms\Classes\Theme;
use Cms\Classes\CmsCompoundObject;

$root = dirname(__DIR__, 4);
chdir($root);

foreach ([
    'APP_ENV' => 'testing',
    'APP_LOCALE' => 'en',
    'CACHE_DRIVER' => 'array',
    'CACHE_STORE' => 'array',
    'SESSION_DRIVER' => 'array',
    'ACTIVE_THEME' => 'test',
    'CMS_SAFE_MODE' => 'false',
    'PLUGINS_PATH' => 'modules/system/tests/fixtures/plugins',
    'THEMES_PATH' => 'modules/cms/tests/fixtures/themes',
    'DB_CONNECTION' => 'sqlite',
    'DB_DATABASE' => ':memory:',
] as $name => $value) {
    putenv("$name=$value");
    $_ENV[$name] = $_SERVER[$name] = $value;
}

require $root . '/bootstrap/autoload.php';

October\Rain\Composer\ClassLoader::configure($root)
    ->withNamespace('App\\', '')
    ->withDirectories(['modules', 'plugins'])
    ->register();

/**
 * CountingStore is an array store that records how many bytes cross the wire
 */
class CountingStore implements Illuminate\Contracts\Cache\Store
{
    public array $data = [];
    public int $bytesRead = 0;
    public int $bytesWritten = 0;
    public int $reads = 0;
    public int $writes = 0;
    public bool $recording = true;

    public function get($key)
    {
        if (!array_key_exists($key, $this->data)) {
            return null;
        }

        if ($this->recording) {
            $this->reads++;
            $this->bytesRead += strlen($this->data[$key]);
        }

        return unserialize($this->data[$key]);
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
        $payload = serialize($value);

        if ($this->recording) {
            $this->writes++;
            $this->bytesWritten += strlen($payload);
        }

        $this->data[$key] = $payload;
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
        unset($this->data[$key]);
        return true;
    }

    public function flush()
    {
        $this->data = [];
        return true;
    }

    public function getPrefix()
    {
        return '';
    }

    public function reset(): void
    {
        $this->bytesRead = $this->bytesWritten = $this->reads = $this->writes = 0;
    }

    public function storedBytes(): int
    {
        $total = 0;
        foreach ($this->data as $payload) {
            $total += strlen($payload);
        }
        return $total;
    }
}

/**
 * BenchCompoundObject reads the component fixtures used by the CMS test suite
 */
class BenchCompoundObject extends CmsCompoundObject
{
    protected $dirName = 'testobjects';
}

$app = require $root . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$app->setLocale('en');

$store = new CountingStore;

Cache::extend('bench', fn () => Cache::repository($store));
Config::set('cache.stores.bench', ['driver' => 'bench']);
Cache::setDefaultDriver('bench');

require_once $root . '/modules/system/tests/fixtures/plugins/october/tester/components/Archive.php';
require_once $root . '/modules/system/tests/fixtures/plugins/october/tester/components/Post.php';

$options = getopt('', ['objects::', 'iterations::']);
$objectCount = (int) ($options['objects'] ?? 500);
$iterations = (int) ($options['iterations'] ?? 200);

$theme = Theme::load('test');
$componentName = 'October\Tester\Components\Post';

$requestCache = (new ReflectionClass(CmsCompoundObject::class))->getProperty('objectComponentPropertyMap');
$requestCache->setAccessible(true);

/**
 * freshRequest drops everything a new process would not inherit, both the
 * request level map and the memoized reads held by Cache::memo()
 */
$emptyRequestCache = (new ReflectionClass(CmsCompoundObject::class))
    ->getDefaultProperties()['objectComponentPropertyMap'];

$freshRequest = function () use ($requestCache, $emptyRequestCache) {
    $requestCache->setValue(null, $emptyRequestCache);

    $memoStore = Cache::memo()->getStore();
    $memoCache = (new ReflectionClass($memoStore))->getProperty('cache');
    $memoCache->setAccessible(true);
    $memoCache->setValue($memoStore, []);
};

/**
 * makeObject clones the fixture under a distinct file name, standing in for
 * one of the many objects a real theme holds
 */
$makeObject = function (int $index) use ($theme) {
    $object = BenchCompoundObject::load($theme, 'components.htm');
    $object->fileName = 'bench-' . $index . '.htm';

    return $object;
};

// Warm the cache one object at a time, the way requests populate it
$store->recording = false;
$objects = [];
for ($i = 0; $i < $objectCount; $i++) {
    $objects[$i] = $object = $makeObject($i);
    $object->getComponentProperties($componentName);
}
$store->recording = true;

$results = [
    'branch' => trim((string) shell_exec('git rev-parse --abbrev-ref HEAD')),
    'revision' => trim((string) shell_exec('git rev-parse --short HEAD')),
    'objects' => $objectCount,
    'stored_bytes' => $store->storedBytes(),
    'stored_keys' => count($store->data),
];

// Read path, one object's properties looked up on a fresh request
$store->reset();
$start = hrtime(true);
for ($n = 0; $n < $iterations; $n++) {
    $freshRequest();
    $objects[intdiv($objectCount, 2)]->getComponentProperties($componentName);
}
$elapsed = (hrtime(true) - $start) / 1e6;

$results['read_ms_per_lookup'] = round($elapsed / $iterations, 4);
$results['read_bytes_per_lookup'] = intdiv($store->bytesRead, $iterations);
$results['reads_per_lookup'] = intdiv($store->reads, $iterations);

// Write path, an object seen for the first time
$store->reset();
$start = hrtime(true);
for ($n = 0; $n < $iterations; $n++) {
    $freshRequest();
    $makeObject($objectCount + $n)->getComponentProperties($componentName);
}
$elapsed = (hrtime(true) - $start) / 1e6;

$results['write_ms_per_object'] = round($elapsed / $iterations, 4);
$results['write_bytes_per_object'] = intdiv($store->bytesWritten, $iterations);

echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . PHP_EOL;
