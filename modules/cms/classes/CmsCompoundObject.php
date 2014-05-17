<?php namespace Cms\Classes;

use Validator;
use Cms\Classes\CodeBase;
use System\Classes\SystemException;
use Cms\Classes\FileHelper;
use October\Rain\Support\ValidationException;

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

    protected static $fillable = [
        'markup',
        'settings',
        'code',
        'fileName'
    ];

    protected $settingsValidationRules = [];

    protected $settingsValidationMessages = [];

    /**
     * Loads the object from a file.
     * @param \Cms\Classes\Theme $theme Specifies the theme the object belongs to.
     * @param string $fileName Specifies the file name, with the extension.
     * The file name can contain only alphanumeric symbols, dashes and dots.
     * @return boolean Returns true if the object was successfully loaded. Otherwise returns false.
     */
    public static function load($theme, $fileName)
    {
        if (($obj = parent::load($theme, $fileName)) === null)
            return null;

        $parsedData = CmsException::capture($obj, 200, function() use ($obj) {
             return SectionParser::parse($obj->content);
        });

        $obj->settings = $parsedData['settings'];
        $obj->code = $parsedData['code'];
        $obj->markup = $parsedData['markup'];

        $obj->parseComponentSettings();
        $obj->parseSettings();

        return $obj;
    }

    /**
     * Implements getter functionality for properties defined in the settings section.
     */
    public function __get($name)
    {
        if (is_array($this->settings) && array_key_exists($name, $this->settings))
            return $this->settings[$name];

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
        if (parent::__isset($key) === true)
            return true;

        return isset($this->settings[$key]);
    }

    /**
     * Returns the Twig content string
     */
    public function getTwigContent()
    {
        return $this->markup;
    }

    /**
     * Runs components defined in the settings
     * Process halts if a component returns a value
     */
    public function runComponents()
    {
        foreach ($this->components as $component) {
            if ($result = $component->onRun())
                return $result;
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
            if (!is_array($value))
                continue;

            $settingParts = explode(' ', $setting);
            $settingName = $settingParts[0];
            if (!$manager->hasComponent($settingName))
                continue;

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

        $trim = function(&$values) use (&$trim) {
            foreach ($values as &$value) {
                if (!is_array($value))
                    $value = trim($value);
                else $trim($value);
            }
        };

        $trim($this->settings);

        $this->validate();

        $content = [];

        if ($this->settings)
            $content[] = FileHelper::formatIniString($this->settings);

        if ($this->code) {
            $code = preg_replace('/^\<\?php/', '', $this->code);
            $code = preg_replace('/^\<\?/', '', $code);
            $code = preg_replace('/\?>$/', '', $code);

            $content[] = '<?php'.PHP_EOL.$this->code.PHP_EOL.'?>';
        }

        $content[] = $this->markup;

        $this->content = trim(implode(PHP_EOL.'=='.PHP_EOL, $content));
        parent::save();
    }

    /**
     * Parses the settings array.
     * Child classes can override this method in order to update
     * the content of the $settings property after the object
     * is loaded from a file.
     */
    protected function parseSettings() {}

    /**
     * Initializes the object properties from the cached data.
     * @param array $cached The cached data array.
     */
    protected function initFromCache($cached)
    {
        $this->settings = $cached['settings'];
        $this->code = $cached['code'];
        $this->markup = $cached['markup'];
    }

    /**
     * Initializes a cache item.
     * @param array &$item The cached item array.
     */
    protected function initCacheItem(&$item)
    {
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
        $validation = Validator::make($this->settings, $this->settingsValidationRules, $this->settingsValidationMessages);
        if ($validation->fails())
            throw new ValidationException($validation);
    }
}