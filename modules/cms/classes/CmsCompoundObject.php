<?php namespace Cms\Classes;

use Ini;
use Cache;
use Config;
use Validator;
use SystemException;
use ValidationException;
use Cms\Classes\ViewBag;
use Cms\Classes\CodeBase;
use Cms\Twig\Loader as TwigLoader;
use Cms\Twig\Extension as CmsTwigExtension;
use System\Twig\Extension as SystemTwigExtension;
use Twig_Environment;

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
     * @var array INI settings defined in the template file.
     */
    public $settings = [];

    /**
     * @var string PHP code section of the template file.
     */
    public $code;

    /**
     * @var string Twig markup section of the template file.
     */
    public $markup;

    /**
     * @var array Contains the view bag properties.
     * This property is used by the page editor internally.
     */
    public $viewBag = [];

    /**
     * @var array Properties that can be set with fill()
     */
    protected static $fillable = [
        'markup',
        'settings',
        'code',
        'fileName'
    ];

    protected $settingsValidationRules = [];

    protected $settingsValidationMessages = [];

    protected $viewBagValidationRules = [];

    protected $viewBagValidationMessages = [];

    protected $viewBagCache = false;

    protected $originalData = [];

    protected static $objectComponentPropertyMap = null;

    /**
     * Loads the object from a file.
     * @param \Cms\Classes\Theme $theme Specifies the theme the object belongs to.
     * @param string $fileName Specifies the file name, with the extension.
     * The file name can contain only alphanumeric symbols, dashes and dots.
     * @return boolean Returns true if the object was successfully loaded. Otherwise returns false.
     */
    public static function load($theme, $fileName)
    {
        if (($obj = parent::load($theme, $fileName)) === null) {
            return null;
        }

        CmsException::mask($obj, 200);
        $parsedData = SectionParser::parse($obj->content);
        CmsException::unmask();

        $obj->settings = $parsedData['settings'];
        $obj->code = $parsedData['code'];
        $obj->markup = $parsedData['markup'];

        $obj->originalData['settings'] = $obj->settings;
        $obj->originalData['code'] = $obj->code;
        $obj->originalData['markup'] = $obj->markup;

        $obj->parseComponentSettings();
        $obj->parseSettings();

        return $obj;
    }

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
     * Determine if an attribute exists on the object.
     *
     * @param  string  $key
     * @return void
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
     * Runs components defined in the settings
     * Process halts if a component returns a value
     */
    public function runComponents()
    {
        foreach ($this->components as $component) {
            if ($result = $component->onRun()) {
                return $result;
            }
        }
    }

    /**
     * Parse component sections. 
     * Replace the multiple component sections with a single "components" 
     * element in the $settings property.
     */
    public function parseComponentSettings()
    {
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
     * Returns name of a PHP class to us a parent for the PHP class created for the object's PHP section.
     * @return mixed Returns the class name or null.
     */
    public function getCodeClassParent()
    {
        return null;
    }

    /**
     * Sets the PHP code content string.
     * @param string $value Specifies the PHP code string.
     * @return \Cms\Classes\CmsCompoundObject Returns the object instance.
     */
    public function setCode($value)
    {
        $value = trim($value);
        $this->code = $value;
    }

    /**
     * Saves the object to the disk.
     */
    public function save()
    {
        $this->code = trim($this->code);
        $this->markup = trim($this->markup);

        $trim = function (&$values) use (&$trim) {
            foreach ($values as &$value) {
                if (!is_array($value)) {
                    $value = trim($value);
                }
                else {
                    $trim($value);
                }
            }
        };

        $trim($this->settings);

        if (array_key_exists('components', $this->settings) && count($this->settings['components']) == 0) {
            unset($this->settings['components']);
        }

        $this->validate();

        $content = [];

        if ($this->settings) {
            $content[] = Ini::render($this->settings);
        }

        if ($this->code) {
            if ($this->wrapCodeToPhpTags() && array_get($this->originalData, 'code') != $this->code) {
                $code = preg_replace('/^\<\?php/', '', $this->code);
                $code = preg_replace('/^\<\?/', '', $code);
                $code = preg_replace('/\?>$/', '', $code);

                $content[] = '<?php'.PHP_EOL.$this->code.PHP_EOL.'?>';
            }
            else {
                $content[] = $this->code;
            }
        }

        $content[] = $this->markup;

        $this->content = trim(implode(PHP_EOL.'=='.PHP_EOL, $content));
        parent::save();
    }

    /**
     * Returns the configured view bag component.
     * This method is used only in the back-end and for internal system needs when 
     * the standard way to access components is not an option.
     * @return \Cms\Classes\ViewBag Returns the view bag component instance.
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
        $key = crc32($this->theme->getPath()).'component-properties';

        if (self::$objectComponentPropertyMap !== null) {
            $objectComponentMap = self::$objectComponentPropertyMap;
        }
        else {
            $cached = Cache::get($key, false);
            $unserialized = $cached ? @unserialize($cached) : false;
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

        Cache::put($key, serialize($objectComponentMap), Config::get('cms.parsedPageCacheTTL', 10));

        if (array_key_exists($componentName, $objectComponentMap[$objectCode])) {
            return $objectComponentMap[$objectCode][$componentName];
        }

        return [];
    }

    /**
     * Clears the object cache.
     */
    public static function clearCache($theme)
    {
        $key = crc32($theme->getPath()).'component-properties';
        Cache::forget($key);
    }

    /**
     * Parses the settings array.
     * Child classes can override this method in order to update
     * the content of the $settings property after the object
     * is loaded from a file.
     */
    protected function parseSettings()
    {
        $this->fillViewBagArray();
    }

    /*
     * Copies view bag properties to the view bag array.
     * This is required for the back-end editors.
     */
    protected function fillViewBagArray()
    {
        $viewBag = $this->getViewBag();
        foreach ($viewBag->getProperties() as $name => $value) {
            $this->viewBag[$name] = $value;
        }
    }

    /**
     * Initializes the object properties from the cached data.
     * @param array $cached The cached data array.
     */
    protected function initFromCache($cached)
    {
        $this->viewBag = array_get($cached, 'viewBag', []);
        $this->settings = array_get($cached, 'settings', []);
        $this->code = array_get($cached, 'code');
        $this->markup = array_get($cached, 'markup');
    }

    /**
     * Initializes a cache item.
     * @param array &$item The cached item array.
     */
    protected function initCacheItem(&$item)
    {
        $item['viewBag'] = $this->viewBag;
        $item['settings'] = $this->settings;
        $item['code'] = $this->code;
        $item['markup'] = $this->markup;
    }

    /**
     * Validates the object properties.
     * Throws a ValidationException in case of an error.
     */
    protected function validate()
    {
        $validation = Validator::make(
            $this->settings,
            $this->settingsValidationRules,
            $this->settingsValidationMessages
        );
        if ($validation->fails()) {
            throw new ValidationException($validation);
        }

        if ($this->viewBagValidationRules && isset($this->settings['viewBag'])) {
            $validation = Validator::make(
                $this->settings['viewBag'],
                $this->viewBagValidationRules,
                $this->viewBagValidationMessages
            );
            if ($validation->fails()) {
                throw new ValidationException($validation);
            }
        }
    }

    /**
     * Determines if the content of the code section should be wrapped to PHP tags.
     * @return boolean
     */
    protected function wrapCodeToPhpTags()
    {
        return true;
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
}
