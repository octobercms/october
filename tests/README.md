# Plugin testing

Plugin unit tests can be performed by running `phpunit` in the base plugin directory.

### Creating plugin tests

Plugins can be tested by creating a creating a file called `phpunit.xml` in the base directory with the following content, for example, in a file **/plugins/acme/blog/phpunit.xml**:

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

The test class should extend the base class `PluginTestCase` and this is a special class that will set up the October database stored in memory, as part of the `setUp()` method. It will also refresh the plugin being testing, along with any of the defined dependencies in the plugin registration file. This is the equivalent of running the following before each test:

    php artisan october:up
    php artisan plugin:refresh Acme.Blog
    [php artisan plugin:refresh <dependency>, ...]

# System testing

### Unit tests

Unit tests can be performed by running `phpunit` in the root directory or inside `/tests/unit`.

### Functional tests with Laravel Dusk

Functional tests can be performed by running `php artisan dusk` in the root of the project. Ensure the following configuration is met:

- Active theme is `demo`
- Language preference is `en`
- A sqlite file located at 'storage/testing.sqlite'

> You will need a real sqlite database to perform the functional testing because Laravel Dusk use a different process to execute the tests.

To be able to run the `dusk` artisan command it's necessary to register the Laravel Dusk Provider, a dusk configuration was added to the `config` directory so you only need to create an enviroment file `.env` with the following line.

```
    APP_ENV=dusk
```

For more information about Laravel Dusk please read the [Docs](https://laravel.com/docs/5.4/dusk).