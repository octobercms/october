<?php namespace Backend\Classes;

use October\Rain\Html\Helper as HtmlHelper;
use October\Rain\Extension\Extendable;
use stdClass;

/**
 * Widget base class.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class WidgetBase extends Extendable
{
    use \System\Traits\ViewMaker;
    use \System\Traits\AssetMaker;
    use \System\Traits\ConfigMaker;
    use \System\Traits\EventEmitter;
    use \Backend\Traits\ErrorMaker;
    use \Backend\Traits\WidgetMaker;
    use \Backend\Traits\SessionMaker;

    /**
     * @var object Supplied configuration.
     */
    public $config;

    /**
     * @var \Backend\Classes\Controller Backend controller object.
     */
    protected $controller;

    /**
     * @var string Defined alias used for this widget.
     */
    public $alias;

    /**
     * @var string A unique alias to identify this widget.
     */
    protected $defaultAlias = 'widget';

    /**
     * Constructor
     * @param \Backend\Classes\Controller $controller
     * @param array $configuration Proactive configuration definition.
     */
    public function __construct($controller, $configuration = [])
    {
        $this->controller = $controller;
        $this->viewPath = $this->configPath = $this->guessViewPath('/partials');
        $this->assetPath = $this->guessViewPath('/assets', true);

        /*
         * Apply configuration values to a new config object, if a parent
         * constructor hasn't done it already.
         */
        if ($this->config === null) {
            $this->config = $this->makeConfig($configuration);
        }

        /*
         * If no alias is set by the configuration.
         */
        if (!isset($this->alias)) {
            $this->alias = $this->config->alias ?? $this->defaultAlias;
        }

        /*
         * Prepare assets used by this widget.
         */
        $this->loadAssets();

        parent::__construct();

        /*
         * Initialize the widget.
         */
        if (!$this->getConfig('noInit', false)) {
            $this->init();
        }
    }

    /**
     * Initialize the widget, called by the constructor and free from its parameters.
     * @return void
     */
    public function init()
    {
    }

    /**
     * Renders the widget's primary contents.
     * @return string HTML markup supplied by this widget.
     */
    public function render()
    {
    }

    /**
     * Adds widget specific asset files. Use $this->addJs() and $this->addCss()
     * to register new assets to include on the page.
     * @return void
     */
    protected function loadAssets()
    {
    }

    /**
     * Binds a widget to the controller for safe use.
     * @return void
     */
    public function bindToController()
    {
        if ($this->controller->widget === null) {
            $this->controller->widget = new stdClass;
        }

        $this->controller->widget->{$this->alias} = $this;
    }

    /**
     * Transfers config values stored inside the $config property directly
     * on to the root object properties. If no properties are defined
     * all config will be transferred if it finds a matching property.
     * @param array $properties
     * @return void
     */
    protected function fillFromConfig($properties = null)
    {
        if ($properties === null) {
            $properties = array_keys((array) $this->config);
        }

        foreach ($properties as $property) {
            if (property_exists($this, $property)) {
                $this->{$property} = $this->getConfig($property, $this->{$property});
            }
        }
    }

    /**
     * Returns a unique ID for this widget. Useful in creating HTML markup.
     * @param string $suffix An extra string to append to the ID.
     * @return string A unique identifier.
     */
    public function getId($suffix = null)
    {
        $id = class_basename(get_called_class());

        if ($this->alias != $this->defaultAlias) {
            $id .= '-' . $this->alias;
        }

        if ($suffix !== null) {
            $id .= '-' . $suffix;
        }

        return HtmlHelper::nameToId($id);
    }

    /**
     * Returns a fully qualified event handler name for this widget.
     * @param string $name The ajax event handler name.
     * @return string
     */
    public function getEventHandler($name)
    {
        return $this->alias . '::' . $name;
    }

    /**
     * Safe accessor for configuration values.
     * @param string $name Config name, supports array names like "field[key]"
     * @param string $default Default value if nothing is found
     * @return string
     */
    public function getConfig($name, $default = null)
    {
        /*
         * Array field name, eg: field[key][key2][key3]
         */
        $keyParts = HtmlHelper::nameToArray($name);

        /*
         * First part will be the field name, pop it off
         */
        $fieldName = array_shift($keyParts);
        if (!isset($this->config->{$fieldName})) {
            return $default;
        }

        $result = $this->config->{$fieldName};

        /*
         * Loop the remaining key parts and build a result
         */
        foreach ($keyParts as $key) {
            if (!array_key_exists($key, $result)) {
                return $default;
            }

            $result = $result[$key];
        }

        return $result;
    }

    /**
     * Returns the controller using this widget.
     */
    public function getController()
    {
        return $this->controller;
    }
}
