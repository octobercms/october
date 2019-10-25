# Plugin testing

Plugin unit tests can be performed by running `phpunit` in the base plugin directory.

### Creating plugin tests

Plugins can be tested by creating a file called `phpunit.xml` in the base directory with the following content, for example, in a file **/plugins/acme/blog/phpunit.xml**:

    <?xml version="1.0" encoding="UTF-8"?>
    <phpunit backupGlobals="false"
             backupStaticAttributes="false"
             bootstrap="../../../tests/bootstrap.php"
             colors="true"
             convertErrorsToExceptions="true"
             convertNoticesToExceptions="true"
             convertWarningsToExceptions="true"
             processIsolation="false"
             stopOnFailure="false"
             syntaxCheck="false"
    >
        <testsuites>
            <testsuite name="Plugin Unit Test Suite">
                <directory>./tests</directory>
            </testsuite>
        </testsuites>
        <php>
            <env name="APP_ENV" value="testing"/>
            <env name="CACHE_DRIVER" value="array"/>
            <env name="SESSION_DRIVER" value="array"/>
        </php>
    </phpunit>

Then a **tests/** directory can be created to contain the test classes. The file structure should mimic the base directory with classes having a `Test` suffix. Using a namespace for the class is also recommended.

    <?php namespace Acme\Blog\Tests\Models;

    use Acme\Blog\Models\Post;
    use PluginTestCase;

    class PostTest extends PluginTestCase
    {
        public function testCreateFirstPost()
        {
            $post = Post::create(['title' => 'Hi!']);
            $this->assertEquals(1, $post->id);
        }
    }

The test class should extend the base class `PluginTestCase` and this is a special class that will set up the October database stored in memory, as part of the `setUp` method. It will also refresh the plugin being tested, along with any of the defined dependencies in the plugin registration file. This is the equivalent of running the following before each test:

    php artisan october:up
    php artisan plugin:refresh Acme.Blog
    [php artisan plugin:refresh <dependency>, ...]

> **Note:** If your plugin uses [configuration files](../plugin/settings#file-configuration), then you will need to run `System\Classes\PluginManager::instance()->registerAll(true);` in the `setUp` method of your tests. Below is an example of a base test case class that should be used if you need to test your plugin working with other plugins instead of in isolation.

    use System\Classes\PluginManager;

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

#### Changing database engine for plugins tests

By default OctoberCMS uses SQLite stored in memory for the plugin testing environment. If you want to override the default behavior set the `useConfigForTesting` config to `true` in your `/config/database.php` file. When the `APP_ENV` is `testing` and the `useConfigForTesting` is `true` database parameters will be taken from `/config/database.php`.

You can override the `/config/database.php` file by creating `/config/testing/database.php`. In this case variables from the latter file will be taken.

## System testing

To perform unit testing on the core October files, you should download a development copy using composer or cloning the git repo. This will ensure you have the `tests/` directory.

### Unit tests

Unit tests can be performed by running `phpunit` in the root directory or inside `/tests/unit`.

### Functional tests

Functional tests can be performed by running `phpunit` in the `/tests/functional` directory. Ensure the following configuration is met:

- Active theme is `demo`
- Language preference is `en`

#### Selenium set up

1. Download latest Java SE from http://java.sun.com/ and install
1. Download a distribution archive of [Selenium Server](http://seleniumhq.org/download/).
1. Unzip the distribution archive and copy selenium-server-standalone-2.42.2.jar (check the version suffix) to /usr/local/bin, for instance.
1. Start the Selenium Server server by running `java -jar /usr/local/bin/selenium-server-standalone-2.42.2.jar`.

#### Selenium configuration

Create a new file `selenium.php` in the root directory, add the following content:

    <?php

    // Selenium server details
    define('TEST_SELENIUM_HOST', '127.0.0.1');
    define('TEST_SELENIUM_PORT', 4444);
    define('TEST_SELENIUM_BROWSER', '*firefox');

    // Back-end URL
    define('TEST_SELENIUM_URL', 'http://localhost/backend/');

    // Active Theme
    define('TEST_SELENIUM_THEME', 'demo');

    // Back-end credentials
    define('TEST_SELENIUM_USER', 'admin');
    define('TEST_SELENIUM_PASS', 'admin');
