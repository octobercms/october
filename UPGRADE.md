### Renamed classes:

    October\Rain\Support\Yaml -> Yaml
    October\Rain\Support\Markdown -> Markdown
    System\Classes\ApplicationException -> ApplicationException
    System\Classes\SystemException -> SystemException
    October\Rain\Support\ValidationException -> ValidationException

### File system changes

    [MOVE] /app/config -> /config
    [MOVE] /app/storage -> /storage
    [DELETE] /bootstrap/start.php
    [DELETE] /bootstrap/autoload.php
    [DELETE] /artisan
    [SPAWN] /bootstrap/app.php
    [SPAWN] /bootstrap/autoload.php
    [SPAWN] /artisan
    [SPAWN] /storage/cms/*.*
    [SPAWN] /storage/framework/*.*

*SPAWN* means to create a file using the git source.

### Cron job changes

Remove old cron jobs:

    * * * * * php /path/to/artisan queue:cron 1>> /dev/null 2>&1
    * * * * * php /path/to/artisan scheduled:run 1>> /dev/null 2>&1

Add new cron job:

    * * * * * php /path/to/artisan schedule:run 1>> /dev/null 2>&1

### Clean up

Optional things you can delete, if they do not contain anything custom.

    [DELETE] /app/start/artisan.php
    [DELETE] /app/start/global.php
    [DELETE] /app/filters.php
    [DELETE] /app/routes.php
    [DELETE] /app
    [DELETE] /storage/cache
    [DELETE] /storage/combiner
    [DELETE] /storage/twig

Tables that can be deleted:

    Schema::dropIfExists('cron_queue');

### Removed config

    cms.tempDir - use temp_path()

### Breaking code changes

#### Dispatcher has been removed

Dispatcher functionality is now baked in to Laravel, check the Plugin registration documentation for more information.

#### Removed PATH_* constants

- PATH_APP - use app_path()
- PATH_BASE - use base_path()
- PATH_PUBLIC - use public_path()
- PATH_STORAGE - use storage_path()
- PATH_PLUGINS  - use plugins_path()

#### Paginator / setCurrentPage

**App::make('paginator')->setCurrentPage(5);** should no longer be used, instead pass as the second argument with the `paginate()` method `$model->paginate(25, 5);`

Old code:

    App::make('paginator')->setCurrentPage($page);
    $model->paginate($perPage);

New code:

    $model->paginate($perPage, $page);

##### Paginator API changes

The following methods have changed:

    getTotal() -> total()
    getCurrentPage() -> currentPage()
    getLastPage() -> lastPage()
    getFrom() -> firstItem()
    getTo() -> lastItem()

### Things to do

- Remove "Cron" package, test new "jobs" table
- Test scheduler
- Remove deprecated code
- Fix unit tests