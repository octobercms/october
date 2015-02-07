### Renamed classes:

    October\Rain\Support\Yaml -> Yaml
    October\Rain\Support\Markdown -> Markdown
    System\Classes\ApplicationException -> ApplicationException
    System\Classes\SystemException -> SystemException
    October\Rain\Support\ValidationException -> ValidationException

### File system changes

    [MOVE] /app/config -> /config
    [MOVE] /app/storage -> /storage
    [CREATE] /storage/framework
    [DELETE] /bootstrap/start.php
    [DELETE] /bootstrap/autoload.php
    [SPAWN] /bootstrap/app.php
    [SPAWN] /bootstrap/autoload.php

*SPAWN* means to create a file using the git source.

### Clean up

Optional things you can delete, if they do not contain anything custom.

    [DELETE] /app/start/artisan.php
    [DELETE] /app/start/global.php
    [DELETE] /app/filters.php
    [DELETE] /app/routes.php
    [DELETE] /app
    [DELETE] /storage/cache

### Remmoved config

    cms.tempDir - use temp_path()

### Breaking code changes

#### Removed PATH_* constants

PATH_APP - use app_path()
PATH_BASE - use base_path()
PATH_PUBLIC - use public_path()
PATH_STORAGE - use storage_path()
PATH_PLUGINS  - use plugins_path()

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

- Fix unit tests
- Dispatcher now native?
- Cron queue type now native?