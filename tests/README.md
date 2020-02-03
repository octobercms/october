# Testing

October CMS has a suite of tools available for running automated tests on your October instance and plugins. To run tests, you must ensure that you have PHPUnit installed and can run the `phpunit` command from a command-line interface.

---

- [System Tests](#system-tests)
  - [Unit Tests](#unit-tests)
    - [Using a Custom Database Engine](#custom-database-engine)
  - [Browser Tests](#browser-tests)
    - [Testing Environment for Browser Tests](#testing-environment)
  - [JavaScript Tests](#javascript-tests)
- [Creating Tests for Plugins](#creating-plugin-tests)
  - [Unit Tests](#plugin-unit-tests)
  - [Browser Tests](#plugin-browser-tests)
---

<a name="system-tests"></a>
## System Tests

The system tests cover the tests that analyse the core functionality of October CMS. To run these tests, we recommend that you use Git to checkout a copy of the development version of October CMS and use Composer to install all necessary dependencies.

You can do this on command-line by simply running the following:

```bash
git checkout git@github.com:octobercms/october.git
cd october
composer install
```

<a name="unit-tests"></a>
### Unit Tests

The unit tests in October CMS can be found in the **tests/unit** folder and are executed through PHPUnit. You can run the tests by running the following command in the root folder of the October CMS installation:

```bash
./vendor/bin/phpunit
```

This will run tests for both October CMS and the Rain library. The Rain library tests can be found in the **vendor/october/rain/tests** folder.

Note that unit tests run in a special environment called `testing`. You may configure this environment by adding or modifying the configuration files in the **config/testing/** directory.

<a name="custom-database-engine"></a>
#### Using a Custom Database Engine

By default, OctoberCMS uses SQLite stored in memory for the `testing` environment. If you wish to override this with your own database configuration, set the `useConfigForTesting` config to `true` in your `/config/database.php` file.

When the `APP_ENV` is `testing` and the `useConfigForTesting` is `true` database parameters will be taken from `/config/database.php`.

You can override the `/config/database.php` file by creating `/config/testing/database.php`. In this case variables from the latter file will be taken.

<a name="browser-tests"></a>
### Browser Tests

Browsers tests are a more flexible type of automated test that run directly in a web browser. October CMS leverages the [Laravel Dusk](https://laravel.com/docs/6.x/dusk) framework to run these tests, which in turn uses Google Chrome and a ChromeDriver install to run the tests.

Running the browser tests will require Google Chrome to be installed on your machine. Once this is done, you may prepare your installation for running Browser tests by running the following in your project root folder:

```bash
php artisan dusk:chrome-driver
```

> **Note:** It is possible to use other browsers, or a standalone Selenium server, if you wish. Please see the [Laravel Dusk documentation](https://laravel.com/docs/6.x/dusk#using-other-browsers) for more information.

Once installed, you may run the browsers test by simply running the following command in the root folder of the October CMS installation:

```bash
php artisan dusk
```

If you have previously run the browser tests and want to re-run only the tests that failed, you may use this shortcut to run just the failed tests:

```bash
php artisan dusk:fails
```

Note that your October CMS installation must be web-accessible in order to run the browser tests. Please review the next section on setting up the testing environment.

<a name="testing-environment"></a>
#### Testing Environment for Browser Tests

The Browser tests in October CMS are, by default, set up to run within a special testing environment called `dusk`. This is configured to run October CMS via the inbuilt PHP web server, using an SQLite database to store the database temporarily.

You may start this web server before running the browser tests simply by running the following:

```bash
php artisan serve
```

This environment is configured in two places: the **.env.dusk** file available in the project root, and within the **config/dusk/** folder. You may modify either of these configuration files in order to configure the testing environment to your requirements.

When the browser tests are started, the **.env** file in your project (if any) is subtituted with **.env.dusk** for the duration of the tests. Once the tests end, the **.env** file is restored to its original content.

> **Note:** The system browser tests will need to be authenticated with a superuser-level user to run correctly. If you are using the default environment, this will happen automatically.<br><br>If you are custom settings however, you may need to provide authentication information to Dusk in order for it to run. You can specify the environment variables `DUSK_ADMIN_USER` and `DUSK_ADMIN_PASS` to use specific authentication credentials during testing. These are available in the `.env.dusk` file.

<a name="javascript-tests"></a>
### JavaScript Tests

In addition to the PHP-based tests above, we also have a suite of unit tests for our JavaScript libraries and functions. These run on an NodeJS-based environment, so you will need to [download and install](https://nodejs.org/en/download/) NodeJS and NPM in order to install the tools required for these tests.

Once installed, you may install the tools by running the following in the browser root:

```bash
npm install
```

Then, you may run the following command to run the JavaScript tests:

```bash
npm run test
```

<a name="creating-plugin-tests"></a>
## Creating Tests for Plugins

October CMS has made it easy for plugin developers to create unit and browser tests for their plugins.

Please read the sections below in order to configure your plugin for your required types of testing.

<a name="plugin-unit-tests"></a>
### Unit Tests

To allow unit testing in your plugin, you must first create a file called `phpunit.xml` in the plugin base directory with the following content - for example, in a file **/plugins/acme/blog/phpunit.xml**:

    <?xml version="1.0" encoding="UTF-8"?>
    <phpunit
        backupGlobals="false"
        backupStaticAttributes="false"
        bootstrap="../../../tests/bootstrap.php"
        colors="true"
        convertErrorsToExceptions="true"
        convertNoticesToExceptions="true"
        convertWarningsToExceptions="true"
        processIsolation="false"
        stopOnFailure="false"
    >
        <testsuites>
            <testsuite name="Plugin Unit Test Suite">
                <directory>./tests/unit</directory>
            </testsuite>
        </testsuites>
        <php>
            <env name="APP_ENV" value="testing"/>
            <env name="CACHE_DRIVER" value="array"/>
            <env name="SESSION_DRIVER" value="array"/>
        </php>
    </phpunit>

Then you may create a **tests/unit/** directory to contain the unit test classes.

Each unit test class file must match the following guidelines:

- Each file can be any number of folder levels deep, but must end with `Test.php`.
- Each test class must have a namespace that follows both your plugin name as well as the folder location of your test.
- Each test class must extend the `October\Core\Tests\PluginTestCase` class.

For example, if you have a plugin `Acme.Blog` that contained a `Post` model that you wanted to test, you would create the test class file in **tests/unit/models/PostTest.php**, with the test class code containing the following:

```php
<?php namespace Acme\Blog\Tests\Unit\Models;

use Acme\Blog\Models\Post;
use October\Core\Tests\PluginTestCase;

class PostTest extends PluginTestCase
{
    public function testCreateFirstPost()
    {
        $post = Post::create(['title' => 'Hi!']);
        $this->assertEquals(1, $post->id);
    }
}
```

The `October\Core\Tests\PluginTestCase` class takes care of ensuring that you have a clean database for each test, in order to run each test in isolation. If you need to run some code before, or after each test, you may overwrite the `setUp` and `tearDown` methods in your class. It is important, however, that you allow the parent methods to run too.

```php
public function setUp(): void
{
    parent::setUp();

    // Load necessary model fixture
    $this->postFixture = PostFixture::create(['title' => 'Test Post']);
}

public function tearDown(): void
{
    // Remove model fixtur
    unset($this->postFixture);

    parent::tearDown();
}
```

> **Note:** If your plugin uses [configuration files](../plugin/settings#file-configuration), then you will need to run `System\Classes\PluginManager::instance()->registerAll(true);` in the `setUp` method of your tests.<br><br>Below is an example of a base test case class that should be used if you need to test your plugin working with other plugins instead of in isolation.

    use System\Classes\PluginManager;
    use October\Core\Tests\PluginTestCase;

    class BaseTestCase extends PluginTestCase
    {
        public function setUp()
        {
            parent::setUp();

            // Get the plugin manager
            $pluginManager = PluginManager::instance();

            // Register the plugins to make features like file configuration available
            $pluginManager->registerAll(true);

            // Boot all the plugins to test with dependencies of this plugin
            $pluginManager->bootAll(true);
        }

        public function tearDown()
        {
            parent::tearDown();

            // Get the plugin manager
            $pluginManager = PluginManager::instance();

            // Ensure that plugins are registered again for the next test
            $pluginManager->unregisterAll();
        }
    }

To run the unit tests for your plugin, simply go to the base folder for your plugin, and run the following command:

```bash
../../../vendor/bin/phpunit
```

This will execute PHPUnit in the context of your plugin.

<a name="plugin-browser-tests"></a>
### Browsers Tests

Browser tests for plugins can be set up in much the same way as unit tests, with a small number of differences.

Browsers tests require their own PHPUnit XML configuration file. You should create a `phpunit.dusk.xml` file in your project base directory with the following content:

    <?xml version="1.0" encoding="UTF-8"?>
    <phpunit
        backupGlobals="false"
        backupStaticAttributes="false"
        bootstrap="../../../tests/bootstrap.php"
        colors="true"
        convertErrorsToExceptions="true"
        convertNoticesToExceptions="true"
        convertWarningsToExceptions="true"
        processIsolation="false"
        stopOnFailure="false"
    >
        <testsuites>
            <testsuite name="Plugin Browser Test Suite">
                <directory>./tests/browser</directory>
            </testsuite>
        </testsuites>
        <php>
            <env name="APP_ENV" value="dusk"/>
            <env name="CACHE_DRIVER" value="array"/>
            <env name="SESSION_DRIVER" value="array"/>
        </php>
    </phpunit>

Browser tests should be separate from unit tests - you can instead store browser tests within the **tests/browser/** directory.

Browser test files follow the same rules as unit test files, however, instead of extending the `October\Core\Tests\PluginTestCase` class, they should instead extend the `October\Core\Tests\BrowserTestCase` class.

To run the plugin browser tests, you must run the following command within the root folder of your *October CMS install*, not the plugin:

```bash
php artisan dusk -c plugins/acme/test/phpunit.dusk.xml
```
