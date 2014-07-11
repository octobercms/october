<?php namespace Backend\Classes;

use Str;
use File;
use stdClass;
use Session;

/**
 * Widget base class.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class WidgetBase
{

    use \System\Traits\AssetMaker;
    use \System\Traits\ConfigMaker;
    use \Backend\Traits\ViewMaker;
    use \Backend\Traits\WidgetMaker;
    use \October\Rain\Support\Traits\Emitter;

    /**
     * @var array Supplied configuration.
     */
    public $config;

    /**
     * @var Backend\Classes\Controller Backend controller object.
     */
    protected $controller;

    /**
     * @var string A unique alias to identify this widget.
     */
    public $defaultAlias = 'widget';

    /**
     * @var string Defined alias used for this widget.
     */
    public $alias;

    /**
     * Constructor
     * @param Backend\Classes\Controller $controller
     * @param array $configuration Proactive configuration definition.
     * @return void
     */
    public function __construct($controller, $configuration = [])
    {
        $this->controller = $controller;

        // Option A: (@todo Determine which is faster by benchmark)
        // $relativePath = strtolower(str_replace('\\', '/', get_called_class()));
        // $this->viewPath = $this->configPath = ['modules/' . $relativePath . '/partials', 'plugins/' . $relativePath . '/partials'];
        // $this->assetPath = ['modules/' . $relativePath . '/assets', 'plugins/' . $relativePath . '/assets'];

        // Option B:
        $this->viewPath = $this->configPath = $this->guessViewPath('/partials');
        $this->assetPath = $this->guessViewPath('/assets', true);

        /*
         * Apply configuration values to a new config object.
         */
        if (!$configuration)
            $configuration = [];

        $this->config = $this->makeConfig($configuration);

        /*
         * If no alias is set by the configuration.
         */
        if (!isset($this->alias))
            $this->alias = (isset($this->config->alias)) ? $this->config->alias : $this->defaultAlias;

        /*
         * Prepare assets used by this widget.
         */
        $this->loadAssets();

        /*
         * Initialize the widget.
         */
        if (!$this->getConfig('noInit', false))
            $this->init();
    }

    /**
     * Initialize the widget, called by the constructor and free from its parameters.
     * @return void
     */
    public function init(){}

    /**
     * Renders the widgets primary contents.
     * @return string HTML markup supplied by this widget.
     */
    public function render(){}

    /**
     * Adds widget specific asset files. Use $this->addJs() and $this->addCss()
     * to register new assets to include on the page.
     * @return void
     */
    protected function loadAssets(){}

    /**
     * Binds a widget to the controller for safe use.
     * @return void
     */
    public function bindToController()
    {
        if ($this->controller->widget === null)
            $this->controller->widget = new \stdClass();

        $this->controller->widget->{$this->alias} = $this;
    }

    /**
     * Returns a unique ID for this widget. Useful in creating HTML markup.
     * @param string $suffix An extra string to append to the ID.
     * @return string A unique identifier.
     */
    public function getId($suffix = null)
    {
        $id = Str::getRealClass(get_called_class());

        if ($this->alias != $this->defaultAlias)
            $id .= '-' . $this->alias;

        if ($suffix !== null)
            $id .= '-' . $suffix;

        return $id;
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
        $keyParts = Str::evalHtmlArray($name);

        /*
         * First part will be the field name, pop it off
         */
        $fieldName = array_shift($keyParts);
        if (!isset($this->config->{$fieldName}))
            return $default;

        $result = $this->config->{$fieldName};

        /*
         * Loop the remaining key parts and build a result
         */
        foreach ($keyParts as $key) {
            if (!array_key_exists($key, $result))
                return $default;

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

    //
    // Session management
    //

    /**
     * Saves a widget related key/value pair in to session data.
     * @param string $key Unique key for the data store.
     * @param string $value The value to store.
     * @return void
     */
    protected function putSession($key, $value)
    {
        $sessionId = $this->makeSessionId();

        $currentStore = $this->getSession();
        $currentStore[$key] = $value;

        Session::put($sessionId, serialize($currentStore));
    }

    /**
     * Retrieves a widget related key/value pair from session data.
     * @param string $key Unique key for the data store.
     * @param string $default A default value to use when value is not found.
     * @return string
     */
    protected function getSession($key = null, $default = null)
    {
        $sessionId = $this->makeSessionId();

        $currentStore = [];
        if (Session::has($sessionId))
            $currentStore = unserialize(Session::get($sessionId));

        if ($key === null)
            return $currentStore;

        return isset($currentStore[$key]) ? $currentStore[$key] : $default;
    }

    /**
     * Returns a unique session identifier for this widget and controller action.
     * @return string
     */
    protected function makeSessionId()
    {
        // Removes Class name and "Controllers" directory
        $rootNamespace = Str::getClassId(Str::getClassNamespace(Str::getClassNamespace($this->controller)));
        return 'widget.' . $rootNamespace . '-' . $this->controller->getId() . '-' . $this->getId();
    }

    /**
     * Resets all session data related to this widget.
     * @return void
     */
    public function resetSession()
    {
        $sessionId = $this->makeSessionId();
        Session::forget($sessionId);
    }

}