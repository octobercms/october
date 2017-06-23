<?php namespace Cms\Classes;

use Ini;
use Lang;
use Cache;
use Config;
use Cms\Twig\Loader as TwigLoader;
use Cms\Twig\Extension as CmsTwigExtension;
use Cms\Components\ViewBag;
use System\Twig\Extension as SystemTwigExtension;
use October\Rain\Halcyon\Processors\SectionParser;
use Twig_Environment;
use ApplicationException;

/**
 * This is a base class for CMS objects that have multiple sections - pages, partials and layouts.
 * The class implements functionality for the compound object file parsing. It also provides a way
 * to access parameters defined in the INI settings section as the object properties.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class CmsCompoundObject extends CmsObject
{
    /**
     * @var array Initialized components defined in the template file.
     */
    public $components = [];

    /**
     * @var array INI settings defined in the template file. Not to be confused
     * with the attribute called settings. In this array, components are bumped
     * to their own array inside the 'components' key.
     */
    public $settings = [
        'components' => []
    ];

    /**
     * @var array Contains the view bag properties.
     * This property is used by the page editor internally.
     */
    public $viewBag = [];

    /**
     * @var array The attributes that are mass assignable.
     */
    protected $fillable = [
        'markup',
        'settings',
        'code'
    ];

    /**
     * The methods that should be returned from the collection of all objects.
     *
     * @var array
     */
    protected $passthru = [
        'lists',
        'where',
        'sortBy',
        'whereComponent',
        'withComponent'
    ];

    /**
     * @var bool Model supports code and settings sections.
     */
    protected $isCompoundObject = true;

    /**
     * @var array|null Cache for component properties.
     */
    protected static $objectComponentPropertyMap = null;

    /**
     * @var mixed Cache store for the getViewBag method.
     */
    protected $viewBagCache = false;

    /**
     * Triggered after the object is loaded.
     * @return void
     */
    public function afterFetch()
    {
        $this->parseComponentSettings();
        $this->validateSettings();
        $this->parseSettings();
    }

    /**
     * Triggered when the model is saved.
     * @return void
     */
    public function beforeSave()
    {
        $this->checkSafeMode();
    }

    /**
     * Create a new Collection instance.
     *
     * @param  array  $models
     * @return \October\Rain\Halcyon\Collection
     */
    public function newCollection(array $models = [])
    {
        return new CmsObjectCollection($models);
    }

    /**
     * If the model is loaded with an invalid INI section, the invalid content will be
     * passed as a special attribute. Look for it, then locate the failure reason.
     * @return void
     */
    protected function validateSettings()
    {
        if (isset($this->attributes[SectionParser::ERROR_INI])) {
            CmsException::mask($this, 200);
            Ini::parse($this->attributes[SectionParser::ERROR_INI]);
            CmsException::unmask();
        }
    }

    /**
     * Parses the settings array.
     * Child classes can override this method in order to update the content
     * of the $settings property after the object is loaded from a file.
     * @return void
     */
    protected function parseSettings()
    {
        $this->fillViewBagArray();
    }

    /**
     * This method checks if safe mode is enabled by config, and the code
     * attribute is modified and populated. If so an exception is thrown.
     * @return void
     */
    protected function checkSafeMode()
    {
        $safeMode = Config::get('cms.enableSafeMode', null);
        if ($safeMode === null) {
            $safeMode = !Config::get('app.debug', false);
        }

        if ($safeMode && $this->isDirty('code') && strlen(trim($this->code))) {
            throw new ApplicationException(Lang::get('cms::lang.cms_object.safe_mode_enabled'));
        }
    }

    //
    // Components
    //

    /**
     * Runs components defined in the settings
     * Process halts if a component returns a value
     * @return void
     */
    public function runComponents()
    {
        foreach ($this->components as $component) {
            if ($event = $component->fireEvent('component.beforeRun', [], true)) {
                return $event;
            }

            if ($result = $component->onRun()) {
                return $result;
            }

            if ($event = $component->fireEvent('component.run', [], true)) {
                return $event;
            }
        }
    }

    /**
     * Parse component sections.
     * Replace the multiple component sections with a single "components"
     * element in the $settings property.
     * @return void
     */
    protected function parseComponentSettings()
    {
        $this->settings = $this->getSettingsAttribute();

        $manager = ComponentManager::instance();
        $components = [];
        foreach ($this->settings as $setting => $value) {
            if (!is_array($value)) {
                continue;
            }

            $settingParts = explode(' ', $setting);
            $settingName = $settingParts[0];

            $components[$setting] = $value;
            unset($this->settings[$setting]);
        }

        $this->settings['components'] = $components;
    }

    /**
     * Returns a component by its name.
     * This method is used only in the back-end and for internal system needs when
     * the standard way to access components is not an option.
     * @param string $componentName Specifies the component name.
     * @return \Cms\Classes\ComponentBase Returns the component instance or null.
     */
    public function getComponent($componentName)
    {
        if (!($componentSection = $this->hasComponent($componentName))) {
            return null;
        }

        return ComponentManager::instance()->makeComponent(
            $componentName,
            null,
            $this->settings['components'][$componentSection]
        );
    }

    /**
     * Checks if the object has a component with the specified name.
     * @param string $componentName Specifies the component name.
     * @return mixed Return false or the full component name used on the page (it could include the alias).
     */
    public function hasComponent($componentName)
    {
        $componentManager = ComponentManager::instance();
        $componentName = $componentManager->resolve($componentName);

        foreach ($this->settings['components'] as $sectionName => $values) {

            $result = $sectionName;

            if ($sectionName == $componentName) {
                return $result;
            }

            $parts = explode(' ', $sectionName);
            if (count($parts) > 1) {
                $sectionName = trim($parts[0]);

                if ($sectionName == $componentName) {
                    return $result;
                }
            }

            $sectionName = $componentManager->resolve($sectionName);
            if ($sectionName == $componentName) {
                return $result;
            }

        }

        return false;
    }

    /**
     * Returns component property names and values.
     * This method implements caching and can be used in the run-time on the front-end.
     * @param string $componentName Specifies the component name.
     * @return array Returns an associative array with property names in the keys and property values in the values.
     */
    public function getComponentProperties($componentName)
    {
        $key = md5($this->theme->getPath()).'component-properties';

        if (self::$objectComponentPropertyMap !== null) {
            $objectComponentMap = self::$objectComponentPropertyMap;
        }
        else {
            $cached = Cache::get($key, false);
            $unserialized = $cached ? @unserialize(@base64_decode($cached)) : false;
            $objectComponentMap = $unserialized ? $unserialized : [];
            if ($objectComponentMap) {
                self::$objectComponentPropertyMap = $objectComponentMap;
            }
        }

        $objectCode = $this->getBaseFileName();

        if (array_key_exists($objectCode, $objectComponentMap)) {
            if (array_key_exists($componentName, $objectComponentMap[$objectCode])) {
                return $objectComponentMap[$objectCode][$componentName];
            }

            return [];
        }

        if (!isset($this->settings['components'])) {
            $objectComponentMap[$objectCode] = [];
        }
        else {
            foreach ($this->settings['components'] as $name => $settings) {
                $nameParts = explode(' ', $name);
                if (count($nameParts > 1)) {
                    $name = trim($nameParts[0]);
                }

                $component = $this->getComponent($name);
                if (!$component) {
                    continue;
                }

                $componentProperties = [];
                $propertyDefinitions = $component->defineProperties();
                foreach ($propertyDefinitions as $propertyName => $propertyInfo) {
                    $componentProperties[$propertyName] = $component->property($propertyName);
                }

                $objectComponentMap[$objectCode][$name] = $componentProperties;
            }
        }

        self::$objectComponentPropertyMap = $objectComponentMap;

        Cache::put($key, base64_encode(serialize($objectComponentMap)), Config::get('cms.parsedPageCacheTTL', 10));

        if (array_key_exists($componentName, $objectComponentMap[$objectCode])) {
            return $objectComponentMap[$objectCode][$componentName];
        }

        return [];
    }

    /**
     * Clears the object cache.
     * @param \Cms\Classes\Theme $theme Specifies a parent theme.
     * @return void
     */
    public static function clearCache($theme)
    {
        $key = md5($theme->getPath()).'component-properties';
        Cache::forget($key);
    }

    //
    // View Bag
    //

    /**
     * Returns the configured view bag component.
     * This method is used only in the back-end and for internal system needs when
     * the standard way to access components is not an option.
     * @return \Cms\Components\ViewBag Returns the view bag component instance.
     */
    public function getViewBag()
    {
        if ($this->viewBagCache !== false) {
            return $this->viewBagCache;
        }

        $componentName = 'viewBag';

        if (!isset($this->settings['components'][$componentName])) {
            $viewBag = new ViewBag(null, []);
            $viewBag->name = $componentName;

            return $this->viewBagCache = $viewBag;
        }

        return $this->viewBagCache = $this->getComponent($componentName);
    }

    /**
     * Copies view bag properties to the view bag array.
     * This is required for the back-end editors.
     * @return void
     */
    protected function fillViewBagArray()
    {
        $viewBag = $this->getViewBag();
        foreach ($viewBag->getProperties() as $name => $value) {
            $this->viewBag[$name] = $value;
        }

        $this->fireEvent('cmsObject.fillViewBagArray');
    }

    //
    // Twig
    //

    /**
     * Returns the Twig content string
     * @return string
     */
    public function getTwigContent()
    {
        return $this->markup;
    }

    /**
     * Returns Twig node tree generated from the object's markup.
     * This method is used by the system internally and shouldn't
     * participate in the front-end request processing.
     * @link http://twig.sensiolabs.org/doc/internals.html Twig internals
     * @param mixed $markup Specifies the markup content.
     * Use FALSE to load the content from the markup section.
     * @return Twig_Node_Module A node tree
     */
    public function getTwigNodeTree($markup = false)
    {
        $loader = new TwigLoader();
        $twig = new Twig_Environment($loader, []);
        $twig->addExtension(new CmsTwigExtension());
        $twig->addExtension(new SystemTwigExtension);

        $stream = $twig->tokenize($markup === false ? $this->markup : $markup, 'getTwigNodeTree');
        return $twig->parse($stream);
    }

    //
    // Magic
    //

    /**
     * Implements getter functionality for visible properties defined in
     * the settings section or view bag array.
     */
    public function __get($name)
    {
        if (is_array($this->settings) && array_key_exists($name, $this->settings)) {
            return $this->settings[$name];
        }

        if (is_array($this->viewBag) && array_key_exists($name, $this->viewBag)) {
            return $this->viewBag[$name];
        }

        return parent::__get($name);
    }

    /**
     * Dynamically set attributes on the model.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return void
     */
    public function __set($key, $value)
    {
        parent::__set($key, $value);

        if (array_key_exists($key, $this->settings)) {
            $this->settings[$key] = $this->attributes[$key];
        }
    }

    /**
     * Determine if an attribute exists on the object.
     *
     * @param  string  $key
     * @return bool
     */
    public function __isset($key)
    {
        if (parent::__isset($key) === true) {
            return true;
        }

        if (isset($this->viewBag[$key]) === true) {
            return true;
        }

        return isset($this->settings[$key]);
    }

    /**
     * Dynamically handle calls into the query instance.
     *
     * @param  string  $method
     * @param  array   $parameters
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        if (in_array($method, $this->passthru)) {
            $collection = $this->get();
            return call_user_func_array([$collection, $method], $parameters);
        }

        return parent::__call($method, $parameters);
    }
}
