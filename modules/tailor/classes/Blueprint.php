<?php namespace Tailor\Classes;

use Str;
use Arr;
use File;
use Yaml;
use Lang;
use Cms\Helpers\File as FileHelper;
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
     * getMtimeByName
     */
    public static function getMtimeByName(string $fileName): ?int
    {
        $obj = new static;
        $obj->validateFileName($fileName);

        $filePath = $obj->getFilePath($fileName);
        if (!file_exists($filePath)) {
            return null;
        }

        return File::lastModified($filePath);
    }

    /**
     * listInProject lists all blueprints in a project (app and plugins)
     */
    public static function listInProject(array $options = []): BlueprintCollection
    {
        $results = (new static)->get($options);

        $plugins = array_pull($options, 'plugins', self::getDefaultPlugins());

        foreach ($plugins as $path) {
            $results = array_merge(
                static::inDatasource($path)->get($options),
                $results,
            );
        }

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
     * getInternal helps the get method
     */
    protected function getInternal(string $path): array
    {
        if (!file_exists($path)) {
            return [];
        }

        $result = [];
        $iterator = new DirectoryIterator($path);

        foreach ($iterator as $fileInfo) {
            $fileName = $fileInfo->getFileName();
            if (substr($fileName, 0, 1) === '.') {
                continue;
            }

            if (!$fileInfo->isDir() && !$fileInfo->isFile()) {
                continue;
            }

            $fileName = $fileInfo->getFileName();
            $isFolder = $fileInfo->isDir();
            $filePath = $this->getRelativePath($fileInfo->getPathname());
            $isEditable = in_array(strtolower($fileInfo->getExtension()), $this->allowedExtensions);

            $template = [
                'fileName' => $fileName,
                'isFolder' => $isFolder ? 1 : 0,
                'isEditable' => $isEditable,
                'path' => ltrim(File::normalizePath($filePath), '/')
            ];

            $result[] = $template;
        }

        return $result;
    }

    /**
     * find a single template by its file name.
     */
    public function find(string $fileName)
    {
        $this->validateFileName($fileName);

        $filePath = $this->getFilePath($fileName);
        if (($content = @File::get($filePath)) === false) {
            return null;
        }

        $this->fileName = $fileName;
        $this->originalFileName = $fileName;
        $this->mtime = File::lastModified($filePath);
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
        // @deprecated this should be kebab_case in v4.1
        $this->attributes['handleSlug'] = snake_case(str_replace('\\', ' ', $this->handle));

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
     * save the object to the disk
     */
    public function save(?array $options = null)
    {
        $fileName = $this->fileName;
        $fullPath = $this->getFilePath();

        // Validate
        $forceSave = Arr::get($options, 'force', false);
        if ($forceSave) {
            $this->validateFileName($fileName);
        }
        else {
            $this->validate();
        }

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

        // Ensure blueprint has uuid
        if (!$this->uuid) {
            $this->uuid = Str::uuid()->toString();
            $newContent = 'uuid: ' . $this->uuid . PHP_EOL;
            $newContent .= $this->content;
            $this->content = $newContent;
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
     * forceSave
     */
    public function forceSave()
    {
        return $this->save(['force' => true]);
    }

    /**
     * delete template
     */
    public function delete()
    {
        $fileName = $this->fileName;
        $fullPath = $this->getFilePath($fileName);

        $this->validateFileName($fileName);

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

        if (!is_a($customModelClass, $modelClass)) {
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
