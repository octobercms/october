<?php namespace Cms\Classes;

use App;
use Lang;
use Event;
use Config;
use October\Rain\Halcyon\Model as HalcyonModel;
use Cms\Contracts\CmsObject as CmsObjectContract;
use ApplicationException;
use ValidationException;
use Exception;

/**
 * This is a base class for all CMS objects - content files, pages, partials and layouts.
 * The class implements basic operations with file-based templates.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class CmsObject extends HalcyonModel implements CmsObjectContract
{
    use \October\Rain\Halcyon\Traits\Validation;

    /**
     * @var array The rules to be applied to the data.
     */
    public $rules = [];

    /**
     * @var array The array of custom attribute names.
     */
    public $attributeNames = [];

    /**
     * @var array The array of custom error messages.
     */
    public $customMessages = [];

    /**
     * @var array The attributes that are mass assignable.
     */
    protected $fillable = [
        'content'
    ];

    /**
     * @var bool Model supports code and settings sections.
     */
    protected $isCompoundObject = false;

    /**
     * @var \Cms\Classes\Theme A reference to the CMS theme containing the object.
     */
    protected $themeCache;

    /**
     * The "booting" method of the model.
     * @return void
     */
    protected static function boot()
    {
        parent::boot();
        static::bootDefaultTheme();
    }

    /**
     * Boot all of the bootable traits on the model.
     * @return void
     */
    protected static function bootDefaultTheme()
    {
        $resolver = static::getDatasourceResolver();
        if ($resolver->getDefaultDatasource()) {
            return;
        }

        $defaultTheme = App::runningInBackend()
            ? Theme::getEditThemeCode()
            : Theme::getActiveThemeCode();

        Theme::load($defaultTheme);

        $resolver->setDefaultDatasource($defaultTheme);
    }

    /**
     * Loads the object from a file.
     * This method is used in the CMS back-end. It doesn't use any caching.
     * @param mixed $theme Specifies the theme the object belongs to.
     * @param string $fileName Specifies the file name, with the extension.
     * The file name can contain only alphanumeric symbols, dashes and dots.
     * @return mixed Returns a CMS object instance or null if the object wasn't found.
     */
    public static function load($theme, $fileName)
    {
        return static::inTheme($theme)->find($fileName);
    }

    /**
     * Loads the object from a cache.
     * This method is used by the CMS in the runtime. If the cache is not found, it is created.
     * @param \Cms\Classes\Theme $theme Specifies the theme the object belongs to.
     * @param string $fileName Specifies the file name, with the extension.
     * @return mixed Returns a CMS object instance or null if the object wasn't found.
     */
    public static function loadCached($theme, $fileName)
    {
        return static::inTheme($theme)
            ->remember(Config::get('cms.parsedPageCacheTTL', 1440))
            ->find($fileName)
        ;
    }

    /**
     * Returns the list of objects in the specified theme.
     * This method is used internally by the system.
     * @param \Cms\Classes\Theme $theme Specifies a parent theme.
     * @param boolean $skipCache Indicates if objects should be reloaded from the disk bypassing the cache.
     * @return Collection Returns a collection of CMS objects.
     */
    public static function listInTheme($theme, $skipCache = false)
    {
        $result = [];
        $instance = static::inTheme($theme);

        if ($skipCache) {
            $result = $instance->get();
        } else {
            $items = $instance->newQuery()->lists('fileName');

            $loadedItems = [];
            foreach ($items as $item) {
                $loadedItems[] = static::loadCached($theme, $item);
            }

            $result = $instance->newCollection($loadedItems);
        }

        /**
         * @event cms.object.listInTheme
         * Provides opportunity to filter the items returned by a call to CmsObject::listInTheme()
         *
         * Parameters provided are `$cmsObject` (the object being listed) and `$objectList` (a collection of the CmsObjects being returned).
         * > Note: The `$objectList` provided is an object reference to a CmsObjectCollection, to make changes you must use object modifying methods.
         *
         * Example usage (filters all pages except for the 404 page on the CMS Maintenance mode settings page):
         *
         *     // Extend only the Settings Controller
         *     \System\Controllers\Settings::extend(function ($controller) {
         *         // Listen for the cms.object.listInTheme event
         *         \Event::listen('cms.object.listInTheme', function ($cmsObject, $objectList) {
         *             // Get the current context of the Settings Manager to ensure we only affect what we need to affect
         *             $context = \System\Classes\SettingsManager::instance()->getContext();
         *             if ($context->owner === 'october.cms' && $context->itemCode === 'maintenance_settings') {
         *                 // Double check that this is a Page List that we're modifying
         *                 if ($cmsObject instanceof \Cms\Classes\Page) {
         *                     // Perform filtering with an original-object modifying method as $objectList is passed by reference (being that it's an object)
         *                     foreach ($objectList as $index => $page) {
         *                         if ($page->url !== '/404') {
         *                             $objectList->forget($index);
         *                         }
         *                     }
         *                 }
         *             }
         *         });
         *     });
         */
        Event::fire('cms.object.listInTheme', [$instance, $result]);

        return $result;
    }

    /**
     * Prepares the theme datasource for the model.
     * @param \Cms\Classes\Theme $theme Specifies a parent theme.
     * @return $this
     */
    public static function inTheme($theme)
    {
        if (is_string($theme)) {
            $theme = Theme::load($theme);
        }

        return static::on($theme->getDirName());
    }

    /**
     * Save the object to the theme.
     *
     * @param  array  $options
     * @return bool
     */
    public function save(array $options = null)
    {
        try {
            parent::save($options);
        }
        catch (Exception $ex) {
            $this->throwHalcyonSaveException($ex);
        }
    }

    /**
     * Returns the CMS theme this object belongs to.
     * @return \Cms\Classes\Theme
     */
    public function getThemeAttribute()
    {
        if ($this->themeCache !== null) {
            return $this->themeCache;
        }

        $themeName = $this->getDatasourceName()
            ?: static::getDatasourceResolver()->getDefaultDatasource();

        return $this->themeCache = Theme::load($themeName);
    }

    /**
     * Returns the full path to the template file corresponding to this object.
     * @param  string  $fileName
     * @return string
     */
    public function getFilePath($fileName = null)
    {
        if ($fileName === null) {
            $fileName = $this->fileName;
        }

        return $this->theme->getPath().'/'.$this->getObjectTypeDirName().'/'.$fileName;
    }

    /**
     * Returns the file name.
     * @return string
     */
    public function getFileName()
    {
        return $this->fileName;
    }

    /**
     * Returns the file name without the extension.
     * @return string
     */
    public function getBaseFileName()
    {
        $pos = strrpos($this->fileName, '.');
        if ($pos === false) {
            return $this->fileName;
        }

        return substr($this->fileName, 0, $pos);
    }

    /**
     * Helper for {{ page.id }} or {{ layout.id }} twig vars
     * Returns a unique string for this object.
     * @return string
     */
    public function getId()
    {
        return str_replace('/', '-', $this->getBaseFileName());
    }

    /**
     * Returns the file content.
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Returns the Twig content string.
     * @return string
     */
    public function getTwigContent()
    {
        return $this->content;
    }

    /**
     * Returns the key used by the Twig cache.
     * @return string
     */
    public function getTwigCacheKey()
    {
        $key = $this->getFilePath();

        if ($event = $this->fireEvent('cmsObject.getTwigCacheKey', compact('key'), true)) {
            $key = $event;
        }

        return $key;
    }

    //
    // Internals
    //

    /**
     * Converts an exception type thrown by Halcyon to a native CMS exception.
     * @param Exception $ex
     */
    protected function throwHalcyonSaveException(Exception $ex)
    {
        if ($ex instanceof \October\Rain\Halcyon\Exception\MissingFileNameException) {
            throw new ValidationException([
                'fileName' => Lang::get('cms::lang.cms_object.file_name_required')
            ]);
        }
        elseif ($ex instanceof \October\Rain\Halcyon\Exception\InvalidExtensionException) {
            throw new ValidationException(['fileName' =>
                Lang::get('cms::lang.cms_object.invalid_file_extension', [
                    'allowed' => implode(', ', $ex->getAllowedExtensions()),
                    'invalid' => $ex->getInvalidExtension()
                ])
            ]);
        }
        elseif ($ex instanceof \October\Rain\Halcyon\Exception\InvalidFileNameException) {
            throw new ValidationException([
               'fileName' => Lang::get('cms::lang.cms_object.invalid_file', ['name'=>$ex->getInvalidFileName()])
            ]);
        }
        elseif ($ex instanceof \October\Rain\Halcyon\Exception\FileExistsException) {
            throw new ApplicationException(
                Lang::get('cms::lang.cms_object.file_already_exists', ['name' => $ex->getInvalidPath()])
            );
        }
        elseif ($ex instanceof \October\Rain\Halcyon\Exception\CreateDirectoryException) {
            throw new ApplicationException(
                Lang::get('cms::lang.cms_object.error_creating_directory', ['name' => $ex->getInvalidPath()])
            );
        }
        elseif ($ex instanceof \October\Rain\Halcyon\Exception\CreateFileException) {
            throw new ApplicationException(
                Lang::get('cms::lang.cms_object.error_saving', ['name' => $ex->getInvalidPath()])
            );
        }
        else {
            throw $ex;
        }
    }
}
