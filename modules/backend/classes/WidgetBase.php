<?php namespace Backend\Classes;

use October\Rain\Html\Helper as HtmlHelper;
use October\Rain\Extension\Extendable;
use Larajax\Contracts\ViewComponentInterface;
use stdClass;

/**
 * WidgetBase class
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class WidgetBase extends Extendable implements ViewComponentInterface
{
    use \System\Traits\ViewMaker;
    use \System\Traits\AssetMaker;
    use \System\Traits\ConfigMaker;
    use \System\Traits\EventEmitter;
    use \Backend\Traits\ErrorMaker;
    use \Backend\Traits\WidgetMaker;
    use \Backend\Traits\SessionMaker;
    use \Larajax\Traits\ViewComponent;

    /**
     * @var string defaultAlias to identify this widget.
     */
    protected $defaultAlias = 'widget';

    /**
     * __construct the widget
     * @param \Backend\Classes\Controller $controller
     * @param array $configuration Proactive configuration definition.
     */
    public function __construct($controller, $config = [])
    {
        $this->controller = $controller;
        $this->viewPath = $this->configPath = $this->guessViewPath('/partials');
        $this->assetPath = $this->guessViewPath('/assets', true);

        // Apply configuration values to a new config object, if a parent
        // constructor hasn't done it already.
        if ($this->config === null) {
            $this->config = $this->makeConfig($config);
        }

        // If no alias is set by the configuration.
        if (!isset($this->alias)) {
            $this->alias = $this->config->alias ?? $this->defaultAlias;
        }

        // Prepare assets used by this widget.
        $this->loadAssets();

        parent::__construct();

        // Initialize the widget.
        if (!$this->getConfig('noInit', false)) {
            $this->init();
        }
    }

    /**
     * init the widget, called by the constructor and free from its parameters.
     * @return void
     */
    public function init()
    {
    }

    /**
     * render the widget's primary contents.
     * @return string HTML markup supplied by this widget.
     */
    public function render()
    {
    }

    /**
     * loadAssets adds widget specific asset files. Use $this->addJs() and $this->addCss()
     * to register new assets to include on the page.
     * @return void
     */
    protected function loadAssets()
    {
    }

    /**
     * fillFromConfig transfers config values stored inside the $config property directly
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
     * getId returns a unique ID for this widget. Useful in creating HTML markup.
     * @param string $suffix An extra string to append to the ID.
     * @return string A unique identifier.
     */
    public function getId($suffix = null)
    {
        $id = class_basename(get_called_class());

        if ($this->alias !== $this->defaultAlias) {
            $id .= '-' . $this->alias;
        }

        if ($suffix !== null) {
            $id .= '-' . $suffix;
        }

        return HtmlHelper::nameToId($id);
    }

    /**
     * getEventHandler returns a fully qualified event handler name for this widget.
     * @param string $name The ajax event handler name.
     * @return string
     */
    public function getEventHandler($name)
    {
        return $this->alias . '::' . $name;
    }

    /**
     * getConfig is a safe accessor for configuration values
     * @param string $name Config name, supports array names like "field[key]"
     * @param mixed $default Default value if nothing is found
     * @return string
     */
    public function getConfig($name = null, $default = null)
    {
        if (!$this->config) {
            return $default;
        }

        return $this->getConfigValueFrom($this->config, $name, $default);
    }

    /**
     * getController returns the controller using this widget.
     */
    public function getController()
    {
        return $this->controller;
    }
}
