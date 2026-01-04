<?php

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| this application. We just need to utilize it! We'll simply require it
| into the script here so we don't need to manually load our classes.
|
*/

$vendorPath = __DIR__ . '/../vendor/autoload.php';

if (!file_exists($vendorPath)) {
    missingVendorGuard();
}

require $vendorPath;

/*
|--------------------------------------------------------------------------
| Include The Compiled Class File
|--------------------------------------------------------------------------
|
| To dramatically increase your application's performance, you may use a
| compiled class file which contains all of the classes commonly used
| by a request. The Artisan "optimize" is used to create this file.
|
*/

$compiledPath = __DIR__ . '/../storage/framework/compiled.php';

if (file_exists($compiledPath)) {
    require $compiledPath;
}

/*
|--------------------------------------------------------------------------
| Handle Missing Vendor Directory
|--------------------------------------------------------------------------
|
| This safeguard ensures the application fails gracefully when Composer
| dependencies have not been installed. If the "vendor/autoload.php" file
| is missing, a clear message is displayed to the user, and the process
| exits safely instead of triggering a fatal error.
|
| This helps developers identify incomplete deployments and guides them
| to run "composer install" before using the application.
|
*/

function missingVendorGuard()
{
    // Log for operators
    error_log('[BOOT] vendor/autoload.php missing. Run "composer install".');

    $isCli = PHP_SAPI === 'cli';

    if ($isCli) {
        // CLI output
        fwrite(STDERR, "Application not ready: vendor/autoload.php is missing.\n");
        fwrite(STDERR, "Fix: composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader\n");
        exit(1);
    }

    // HTTP response
    http_response_code(503);
    header('Content-Type: text/html; charset=utf-8');
    header('Retry-After: 120');

    echo <<<HTML
<!doctype html>
<meta charset="utf-8">
<title>Application not ready</title>
<style>
    body{font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:3rem;color:#222}
    code{background:#f4f4f4;padding:.15rem .35rem;border-radius:4px}
    .box{max-width:680px}
</style>
<div class="box">
    <h1>Application not ready</h1>
    <p>The application dependencies are not installed.</p>
    <p>On the server, run:</p>
    <pre><code>composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader</code></pre>
    <p>If you deploy build artifacts, ensure the <code>vendor/</code> directory is included or that your deploy step runs Composer before switching traffic.</p>
    <p>If you are using the <strong>Deploy</strong> plugin for this application, use the <strong>Check&nbsp;Beacon</strong>
  function now to verify the deployment.</p>
</div>
HTML;

    exit(1);
}
