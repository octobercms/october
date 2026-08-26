<?php namespace Tailor\Classes;

use App;
use Str;
use Arr;
use File;
use Yaml;
use Lang;
use Config;
use System;
use Cms\Helpers\File as FileHelper;
use Cms\Models\SourceFile;
use System\Classes\PluginManager;
use October\Rain\Extension\Extendable;
use DirectoryIterator;
use ApplicationException;
use ValidationException;
use SystemException;
use Exception;

/**
 * Blueprint represents a blueprint file object
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class Blueprint extends Extendable
{
    use \Tailor\Classes\Blueprint\HasDatasources;
    use \Tailor\Classes\Blueprint\HasOperations;

    /**
     * @var array attributes for the template, taken from the config
     */
    public $attributes = [];

    /**
     * @var string typeName of the blueprint
     */
    protected $typeName;

    /**
     * @var string fileName specifies the file name corresponding the Blueprint object
     */
    public $fileName;

    /**
     * @var string originalFileName specifies the file name that the template was originally loaded
     */
    protected $originalFileName;

    /**
     * @var string mtime last modified time
     */
    public $mtime;

    /**
     * @var string content of file
     */
    public $content;

    /**
     * @var array allowedExtensions for template files
     */
    protected $allowedExtensions = ['yaml'];

    /**
     * @var bool exists indicates if the model exists.
     */
    public $exists = false;

    /**
     * @var string defaultDatasource is used by unit tests.
     */
    protected static $defaultDatasource;

    /**
     * @var array booted models
     */
    protected static $booted = [];

    /**
     * __construct
     */
    public function __construct(array $attributes = [])
    {
        $this->attributes = $attributes;

        $this->bootIfNotBooted();
    }

    /**
     * bootIfNotBooted checks if the model needs to be booted and if so, do it.
     */
    protected function bootIfNotBooted()
    {
        $class = get_class($this);

        if (!isset(static::$booted[$class])) {
            static::$booted[$class] = true;
            static::boot();
        }
    }

    /**
     * boot is the "booting" method of the model.
     */
    protected static function boot()
    {
    }

    /**
     * load the object from a file
     */
    public static function load(string $fileName): ?Blueprint
    {
        return (new static)->find($fileName);
    }

    /**
     * getMtimeByName returns the last modified time using the same resolution
     * order as find, or null when the blueprint is missing or tombstoned.
     */
    public static function getMtimeByName(string $fileName): ?int
    {
        $obj = new static;
        $obj->validateFileName($fileName);

        if ($obj->databaseLayerEnabled()) {
            $source = $obj->getSourceIdentifier();

            if (SourceFile::onlyTrashed()->bySource($source)->byPath($fileName)->exists()) {
                return null;
            }

            if ($row = SourceFile::findByPath($source, $fileName)) {
                return $row->updated_at ? $row->updated_at->timestamp : null;
            }
        }

        $filePath = $obj->getFilePath($fileName);
        if (!file_exists($filePath)) {
            return null;
        }

        return File::lastModified($filePath);
    }

    /**
     * listInProject lists all blueprints in a project, loaded in priority order:
     * app, plugins, active theme, then other themes.
     */
    public static function listInProject(array $options = []): BlueprintCollection
    {
        // 1. App blueprints (highest priority)
        $results = (new static)->get($options);

        // 2. Plugin blueprints
        $plugins = array_pull($options, 'plugins', self::getDefaultPlugins());

        foreach ($plugins as $path) {
            $results = array_merge(
                static::inDatasource($path)->get($options),
                $results,
            );
        }

        // 3. Active theme blueprints
        $activeTheme = array_pull($options, 'activeTheme', self::getDefaultActiveTheme());

        foreach ($activeTheme as $dirName => $path) {
            $results = array_merge(
                static::inDatasource($path, $dirName)->get($options),
                $results,
            );
        }

        // 4. Other theme blueprints (lowest priority)
        $themes = array_pull($options, 'themes', self::getDefaultThemes());

        foreach ($themes as $dirName => $path) {
            $results = array_merge(
                static::inDatasource($path, $dirName)->get($options),
                $results,
            );
        }

        return static::hydrate($results);
    }

    /**
     * newFromIndexer creates a new instance from the indexer
     */
    public static function newFromIndexer(array $attributes = [])
    {
        $instance = new static($attributes);

        $instance->exists = true;

        $instance = static::blessBlueprint($instance);

        return $instance;
    }

    /**
     * hydrate a collection of templates from plain arrays
     */
    public static function hydrate(array $items): BlueprintCollection
    {
        $result = [];

        foreach ($items as $item) {
            if ($item['isFolder']) {
                continue;
            }

            if (isset($item['datasource'])) {
                $blueprint = static::inDatasource($item['datasource'], $item['datasourceTheme'] ?? null)->find($item['path']);
            }
            else {
                $blueprint = static::load($item['path']);
            }

            if ($blueprint !== null) {
                $result[] = $blueprint;
            }
        }

        return (new static)->newCollection($result);
    }

    /**
     * get all blueprints and uses simple objects
     *
     * Available options:
     * - recursive: search subfolders and place in 'templates' key
     * - flatten: produce a flat array instead of a recursive array
     * - filterPath: only include within an inner path
     * - filterFiles: only include files
     * - filterFolders: only include folders
     * - filterEditable: only show editable templates
     */
    public function get(array $options = []): array
    {
        extract(array_merge([
            'recursive' => true,
            'flatten' => true,
            'filterPath' => '',
            'filterFiles' => false,
            'filterFolders' => false,
            'filterEditable' => true,
        ], $options));

        $pathSuffix = $filterPath ? '/'.$filterPath : '';
        $path = $this->getBasePath().$pathSuffix;
        $files = $this->getInternal($path);

        $templates = [];
        foreach ($files as $template) {
            if ($recursive && $template['isFolder'] && $template['fileName']) {
                $newFilter = $pathSuffix ? $pathSuffix.'/'.$template['fileName'] : $template['fileName'];

                if ($flatten) {
                    $templates = array_merge($templates, $this->get(['filterPath' => $newFilter] + $options));
                }
                else {
                    $template['templates'] = $this->get(['filterPath' => $newFilter] + $options);
                }
            }

            if ($filterFolders && !$template['isFolder']) {
                continue;
            }

            if ($filterEditable && !$template['isEditable'] && !$template['isFolder']) {
                continue;
            }

            if ($filterFiles && $template['isFolder']) {
                continue;
            }

            if ($this->datasource) {
                $template['datasource'] = $this->datasource;
            }

            if ($this->datasourceTheme) {
                $template['datasourceTheme'] = $this->datasourceTheme;
            }

            $templates[] = $template;
        }

        return $templates;
    }

    /**
     * getInternal helps the get method. When the resolved datasource has the
     * database layer enabled, results are merged with active SourceFile rows
     * and filesystem entries whose paths are tombstoned in the database are
     * suppressed.
     */
    protected function getInternal(string $path): array
    {
        $dbLayerEnabled = $this->databaseLayerEnabled();
        $tombstoned = [];
        $dbRows = [];

        // Directory prefix relative to the base path, '' at the root
        $dirPrefix = ltrim(File::normalizePath($this->getRelativePath($path)), '/');

        if ($dbLayerEnabled) {
            $source = $this->getSourceIdentifier();

            $tombstoned = SourceFile::onlyTrashed()
                ->bySource($source)
                ->pluck('path')
                ->all();
            $tombstoned = array_flip($tombstoned);

            $dbRows = SourceFile::query()
                ->bySource($source)
                ->get()
                ->keyBy('path')
                ->all();
        }

        $result = [];
        $seen = [];

        if (file_exists($path)) {
            $iterator = new DirectoryIterator($path);

            foreach ($iterator as $fileInfo) {
                $fileName = $fileInfo->getFileName();
                if (substr($fileName, 0, 1) === '.') {
                    continue;
                }

                if (!$fileInfo->isDir() && !$fileInfo->isFile()) {
                    continue;
                }

                $isFolder = $fileInfo->isDir();
                $filePath = $this->getRelativePath($fileInfo->getPathname());
                $normalizedPath = ltrim(File::normalizePath($filePath), '/');
                $isEditable = in_array(strtolower($fileInfo->getExtension()), $this->allowedExtensions);

                if (!$isFolder && isset($tombstoned[$normalizedPath])) {
                    continue;
                }

                $result[] = [
                    'fileName' => $fileName,
                    'isFolder' => $isFolder ? 1 : 0,
                    'isEditable' => $isEditable,
                    'path' => $normalizedPath
                ];
                $seen[$normalizedPath] = true;
            }
        }

        foreach ($dbRows as $rowPath => $row) {
            // Scope rows to the directory being listed
            if ($dirPrefix !== '') {
                if (!str_starts_with($rowPath, $dirPrefix.'/')) {
                    continue;
                }
                $localPath = substr($rowPath, strlen($dirPrefix) + 1);
            }
            else {
                $localPath = $rowPath;
            }

            // Rows in deeper directories surface as a folder entry for their
            // next path segment, unless the filesystem already provides it
            if (($slashPos = strpos($localPath, '/')) !== false) {
                $folderName = substr($localPath, 0, $slashPos);
                $folderPath = $dirPrefix !== '' ? $dirPrefix.'/'.$folderName : $folderName;

                if (isset($seen[$folderPath])) {
                    continue;
                }

                $result[] = [
                    'fileName' => $folderName,
                    'isFolder' => 1,
                    'isEditable' => false,
                    'path' => $folderPath
                ];
                $seen[$folderPath] = true;
                continue;
            }

            if (isset($seen[$rowPath])) {
                continue;
            }

            $extension = strtolower(pathinfo($rowPath, PATHINFO_EXTENSION));
            $isEditable = in_array($extension, $this->allowedExtensions);

            $result[] = [
                'fileName' => basename($rowPath),
                'isFolder' => 0,
                'isEditable' => $isEditable,
                'path' => $rowPath
            ];
        }

        return $result;
    }

    /**
     * find a single template by its file name. When the resolved datasource
     * has the database layer enabled, a matching SourceFile row overrides the
     * filesystem copy and a soft-deleted row acts as a tombstone (the file is
     * reported as missing even when a filesystem copy exists).
     */
    public function find(string $fileName)
    {
        $this->validateFileName($fileName);

        $content = null;

        if ($this->databaseLayerEnabled()) {
            $source = $this->getSourceIdentifier();

            if (SourceFile::onlyTrashed()->bySource($source)->byPath($fileName)->exists()) {
                return null;
            }

            if ($row = SourceFile::findByPath($source, $fileName)) {
                $content = (string) $row->getContents();
                $this->mtime = $row->updated_at ? $row->updated_at->timestamp : null;
            }
        }

        if ($content === null) {
            $filePath = $this->getFilePath($fileName);
            if (($content = @File::get($filePath)) === false) {
                return null;
            }
            $this->mtime = File::lastModified($filePath);
        }

        $this->fileName = $fileName;
        $this->originalFileName = $fileName;
        $this->content = $content;
        $this->exists = true;

        try {
            $this->attributes = (array) Yaml::parse($content);
        }
        catch (Exception $ex) {
            $this->attributes = $this->invalidYamlParse($content);
        }

        // Filter types
        if ($this->typeName !== null) {
            if (!isset($this->attributes['type'])) {
                return null;
            }

            if ($this->attributes['type'] !== $this->typeName) {
                return null;
            }
        }

        // Default handle is filename
        if (!isset($this->attributes['handle'])) {
            $this->attributes['handle'] = File::name($fileName);
        }

        // Slugify handle for URLs
        $this->attributes['handleSlug'] = kebab_case(str_replace('\\', ' ', $this->handle));

        // Theme for filtering
        if ($this->datasourceTheme) {
            $this->attributes['_theme'] = $this->datasourceTheme;
        }

        return static::blessBlueprint($this);
    }

    /**
     * invalidYamlParse
     */
    protected function invalidYamlParse($content)
    {
        $attrs = [];
        $content = PHP_EOL.$content;

        // Look for uuid
        if (preg_match('/\nuuid:\s*(\w+)\s*\n/', $content, $matches)) {
            $attrs['uuid'] = $matches[1];
        }

        // Look for type
        if (preg_match('/\ntype:\s*(\w+)\s*\n/', $content, $matches)) {
            $attrs['type'] = $matches[1];
        }

        return $attrs;
    }

    /**
     * blessBlueprint promotes a blueprint class to its specific type, for example,
     * a global blueprint resolves to the GlobalBlueprint class object, and relevant
     * attributes are transferred to the new object.
     */
    public static function blessBlueprint($blueprint)
    {
        $className = null;
        switch ($blueprint->type) {
            case 'entry':
                $className = Blueprint\EntryBlueprint::class;
                break;
            case 'global':
                $className = Blueprint\GlobalBlueprint::class;
                break;
            case 'mixin':
                $className = Blueprint\MixinBlueprint::class;
                break;
            case 'single':
                $className = Blueprint\SingleBlueprint::class;
                break;
            case 'stream':
                $className = Blueprint\StreamBlueprint::class;
                break;
            case 'structure':
                $className = Blueprint\StructureBlueprint::class;
                break;
            case 'submission':
                $className = Blueprint\SubmissionBlueprint::class;
                break;
        }

        if ($className === null) {
            return $blueprint;
        }

        $newObj = $blueprint->datasource
            ? $className::inDatasource($blueprint->datasource, $blueprint->datasourceTheme)
            : new $className;

        $newObj->fileName = $blueprint->fileName;
        $newObj->originalFileName = $blueprint->originalFileName;
        $newObj->mtime = $blueprint->mtime;
        $newObj->content = $blueprint->content;
        $newObj->attributes = $blueprint->attributes;
        $newObj->exists = $blueprint->exists;

        return $newObj;
    }

    /**
     * save the object to the disk, or to the cms_source_files table when the
     * resolved datasource has the database layer enabled.
     */
    public function save(?array $options = null)
    {
        $fileName = $this->fileName;

        // Validate
        $forceSave = Arr::get($options, 'force', false);
        if ($forceSave) {
            $this->validateFileName($fileName);
        }
        else {
            $this->validate();
        }

        // Ensure blueprint has uuid (applies regardless of storage layer)
        if (!$this->uuid) {
            $this->uuid = Str::uuid()->toString();
            $newContent = 'uuid: ' . $this->uuid . PHP_EOL;
            $newContent .= $this->content;
            $this->content = $newContent;
        }

        if ($this->databaseLayerEnabled()) {
            $this->saveToDatabase($fileName);
            return;
        }

        $fullPath = $this->getFilePath();

        if (File::isFile($fullPath) && $this->originalFileName !== $fileName) {
            throw new ApplicationException(Lang::get(
                'cms::lang.cms_object.file_already_exists',
                ['name'=>$fileName]
            ));
        }

        $dirPath = $this->getBasePath();
        if (!file_exists($dirPath) || !is_dir($dirPath)) {
            if (!File::makeDirectory($dirPath, 0755, true, true)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.cms_object.error_creating_directory',
                    ['name'=>$dirPath]
                ));
            }
        }

        if (strpos($fileName, '/') !== false) {
            $dirPath = dirname($fullPath);

            if (!is_dir($dirPath) && !File::makeDirectory($dirPath, 0755, true, true)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.cms_object.error_creating_directory',
                    ['name'=>$dirPath]
                ));
            }
        }

        $newFullPath = $fullPath;
        if (@File::put($fullPath, $this->content) === false) {
            throw new ApplicationException(Lang::get(
                'cms::lang.cms_object.error_saving',
                ['name' => $fileName]
            ));
        }

        if (strlen($this->originalFileName) && $this->originalFileName !== $fileName) {
            $fullPath = $this->getFilePath($this->originalFileName);

            if (File::isFile($fullPath)) {
                @unlink($fullPath);
            }
        }

        clearstatcache();

        $this->mtime = @File::lastModified($newFullPath);
        $this->originalFileName = $fileName;
        $this->exists = true;
    }

    /**
     * saveToDatabase upserts the current content into a SourceFile row for
     * this blueprint's resolved datasource. When the filename has changed,
     * the old path is tombstoned so the rename propagates across instances.
     */
    protected function saveToDatabase(string $fileName): void
    {
        $source = $this->getSourceIdentifier();

        // Reject collisions when creating or renaming, mirroring the
        // filesystem branch's "file already exists" check
        if ($this->originalFileName !== $fileName) {
            $targetTaken = SourceFile::existsAt($source, $fileName)
                || (
                    File::isFile($this->getFilePath($fileName))
                    && !SourceFile::onlyTrashed()->bySource($source)->byPath($fileName)->exists()
                );

            if ($targetTaken) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.cms_object.file_already_exists',
                    ['name' => $fileName]
                ));
            }
        }

        $row = SourceFile::upsertAt($source, $fileName, (string) $this->content);

        if (strlen($this->originalFileName) && $this->originalFileName !== $fileName) {
            SourceFile::tombstoneAt($source, $this->originalFileName);
        }

        $this->mtime = $row->updated_at ? $row->updated_at->timestamp : null;
        $this->originalFileName = $fileName;
        $this->exists = true;
    }

    /**
     * forceSave
     */
    public function forceSave()
    {
        return $this->save(['force' => true]);
    }

    /**
     * delete template. When the resolved datasource has the database layer
     * enabled, a tombstone row is written and the filesystem is left alone so
     * the deletion propagates across instances even when the on-disk copy
     * cannot be removed.
     */
    public function delete()
    {
        $fileName = $this->fileName;

        $this->validateFileName($fileName);

        if ($this->databaseLayerEnabled()) {
            SourceFile::tombstoneAt($this->getSourceIdentifier(), $fileName);
            return;
        }

        $fullPath = $this->getFilePath($fileName);

        if (File::exists($fullPath)) {
            if (!@File::delete($fullPath)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.asset.error_deleting_file',
                    ['name' => $fileName]
                ));
            }
        }
    }

    /**
     * validateFileName, extension and path.
     * @param string $fileName
     */
    protected function validateFileName(?string $fileName = null): void
    {
        if ($fileName === null) {
            $fileName = $this->fileName;
        }

        $fileName = trim($fileName);

        if (!strlen($fileName)) {
            throw new ValidationException(['fileName' =>
                Lang::get('cms::lang.cms_object.file_name_required', [
                    'allowed' => implode(', ', $this->allowedExtensions),
                    'invalid' => pathinfo($fileName, PATHINFO_EXTENSION)
                ])
            ]);
        }

        if (!FileHelper::validateExtension($fileName, $this->allowedExtensions, false)) {
            throw new ValidationException(['fileName' =>
                Lang::get('cms::lang.cms_object.invalid_file_extension', [
                    'allowed' => implode(', ', $this->allowedExtensions),
                    'invalid' => pathinfo($fileName, PATHINFO_EXTENSION)
                ])
            ]);
        }

        if (!FileHelper::validatePath($fileName, null)) {
            throw new ValidationException(['fileName' =>
                Lang::get('tailor::lang.blueprint.invalid_file', [
                    'name' => $fileName
                ])
            ]);
        }
    }

    /**
     * validate the blueprint
     */
    public function validate()
    {
        $this->validateFileName();

        BlueprintVerifier::instance()->verifyBlueprint($this);
    }

    /**
     * getMetaData returns meta data for the content schema table
     */
    public function getMetaData(): array
    {
        return [
            'blueprint_uuid' => $this->uuid,
            'blueprint_type' => $this->type
        ];
    }

    /**
     * getMessage looks up a custom message from the blueprint
     */
    public function getMessage(string $name, ?string $default = null, array $vars = []): string
    {
        $foundKey = $this->customMessages[$name] ?? null;

        if ($foundKey === null) {
            $foundKey = $default;
        }

        if ($foundKey === null) {
            $foundKey = '???';
        }

        return Lang::get($foundKey, $vars);
    }

    /**
     * makeBlueprintTableName where type can be used for content, join or repeater
     */
    protected function makeBlueprintTableName($type = 'content'): string
    {
        return '';
    }

    /**
     * getContentTableName
     */
    public function getContentTableName(): string
    {
        return $this->makeBlueprintTableName('content');
    }

    /**
     * getJoinTableName
     */
    public function getJoinTableName(): string
    {
        return $this->makeBlueprintTableName('join');
    }

    /**
     * getRepeaterTableName
     */
    public function getRepeaterTableName(): string
    {
        return $this->makeBlueprintTableName('repeater');
    }

    /**
     * getModelClassName
     */
    public function getModelClassName()
    {
        throw new SystemException('Blueprint does not specify a model class to use');
    }

    /**
     * getPermissionCodeName
     */
    public function getPermissionCodeName($name = null): string
    {
        $code = str_replace('-', '', $this->uuid);

        if ($this instanceof \Tailor\Classes\Blueprint\GlobalBlueprint) {
            $prefix = 'tailor.global.';
        }
        else {
            $prefix = 'tailor.entry.';
        }

        $suffix = $name !== null ? '.' . $name : '';

        return $prefix . $code . $suffix;
    }

    /**
     * getNavigationCodeName
     */
    public function getNavigationCodeName(): string
    {
        if ($this instanceof \Tailor\Classes\Blueprint\GlobalBlueprint) {
            return "global_{$this->handleSlug}";
        }

        return "entry_{$this->handleSlug}";
    }

    /**
     * newModelInstance returns a new instance of the model associated with this blueprint
     */
    public function newModelInstance()
    {
        $modelClass = $this->getModelClassName();
        $customModelClass = $this->modelClass;

        if (!$customModelClass) {
            return new $modelClass;
        }

        if (!is_a($customModelClass, $modelClass, true)) {
            throw new SystemException("Blueprint Model class [{$customModelClass}] must extend the [{$modelClass}] base class");
        }

        return new $customModelClass;
    }

    /**
     * newCollection instance
     */
    public function newCollection(array $templates = []): BlueprintCollection
    {
        return new BlueprintCollection($templates);
    }

    /**
     * getRelativePath returns path relative to the theme template directory
     */
    protected function getRelativePath(string $path): string
    {
        $prefix = $this->getBasePath();

        if (substr($path, 0, strlen($prefix)) === $prefix) {
            $path = substr($path, strlen($prefix));
        }

        return $path;
    }

    /**
     * getFilePath returns the absolute file path of an template
     */
    public function getFilePath(?string $fileName = null): string
    {
        if ($fileName === null) {
            $fileName = $this->fileName;
        }

        return $this->getBasePath().'/'.$fileName;
    }

    /**
     * getBasePath returns the base path for these objects
     */
    public function getBasePath(): string
    {
        if (!static::$defaultDatasource) {
            static::$defaultDatasource = base_path('app/blueprints');
        }

        return $this->datasource ?: static::$defaultDatasource;
    }

    /**
     * setDefaultDatasource
     */
    public static function setDefaultDatasource(string $path)
    {
        static::$defaultDatasource = $path;
    }

    /**
     * databaseLayerEnabled returns true when DB-layered blueprints should be
     * consulted for this instance. For theme-scoped blueprints the theme's own
     * databaseLayerEnabled() flag is honored; for app and plugin blueprints
     * the global cms.database_templates config governs.
     */
    public function databaseLayerEnabled(): bool
    {
        // Theme flag includes the App::hasDatabase() check
        if ($this->datasourceTheme && System::hasModule('Cms')) {
            $theme = \Cms\Classes\Theme::load($this->datasourceTheme);
            return $theme ? $theme->databaseLayerEnabled() : false;
        }

        // Config first so a disabled feature never attempts a database connection
        return (bool) Config::get('cms.database_templates', false) && App::hasDatabase();
    }

    /**
     * getSourceIdentifier returns the cms_source_files source identifier for
     * this instance's resolved datasource. Encodes the origin so app, plugin
     * and theme blueprints can coexist in the same table without colliding.
     */
    public function getSourceIdentifier(): string
    {
        if ($this->datasourceTheme) {
            return 'theme.'.$this->datasourceTheme.'.blueprint';
        }

        if ($this->datasource) {
            if ($code = $this->resolvePluginCodeForDatasource($this->datasource)) {
                return 'plugin.'.$code.'.blueprint';
            }
        }

        return 'app.blueprint';
    }

    /**
     * resolvePluginCodeForDatasource walks the registered plugin paths to
     * find the one whose blueprints directory matches the given datasource
     * path. Returns null when the datasource is not a plugin path.
     */
    protected function resolvePluginCodeForDatasource(string $path): ?string
    {
        try {
            $plugins = PluginManager::instance()->getPluginPaths();
            foreach ($plugins as $code => $pluginPath) {
                if (rtrim($path, '/\\') === rtrim($pluginPath.'/blueprints', '/\\')) {
                    return $code;
                }
            }
        }
        catch (Exception $ex) {
        }

        return null;
    }

    /**
     * toArray converts this instance to an array
     */
    public function toArray(): array
    {
        return $this->attributes;
    }

    /**
     * __get attributes on the model
     */
    public function __get($key)
    {
        if (array_key_exists($key, $this->attributes)) {
            return $this->attributes[$key];
        }
    }

    /**
     * __set attributes on the model
     */
    public function __set($key, $value)
    {
        $this->attributes[$key] = $value;
    }

    /**
     * __isset determines if an attribute exists on the model
     */
    public function __isset($key)
    {
        return isset($this->attributes[$key]);
    }

    /**
     * __unset an attribute on the model
     */
    public function __unset($key)
    {
        unset($this->attributes[$key]);
    }
}
