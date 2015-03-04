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
