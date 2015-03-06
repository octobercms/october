<?php namespace System\Traits;

use Yaml;
use File;
use Lang;
use Event;
use SystemException;
use Backend\Classes\Controller;
use stdClass;

/**
 * Config Maker Trait
 * Adds configuration based methods to a class
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait ConfigMaker
{

    /**
     * @var string Specifies a path to the config directory.
     */
    protected $configPath;

    /**
     * Reads the contents of the supplied file and applies it to this object.
     */
    public function makeConfig($configFile = [], $requiredConfig = [])
    {
        if (!$configFile) {
            $configFile = [];
        }

        /*
         * Config already made
         */
        if (is_object($configFile)) {
            $config = $configFile;
        }
        /*
         * Embedded config
         */
        elseif (is_array($configFile)) {
            $config = $this->makeConfigFromArray($configFile);
        }
        /*
         * Process config from file contents
         */
        else {

            if (isset($this->controller) && method_exists($this->controller, 'getConfigPath')) {
                $configFile = $this->controller->getConfigPath($configFile);
            }
            else {
                $configFile = $this->getConfigPath($configFile);
            }

            if (!File::isFile($configFile)) {
                throw new SystemException(Lang::get(
                    'system::lang.config.not_found',
                    ['file' => $configFile, 'location' => get_called_class()]
                ));
            }

            $config = Yaml::parse(File::get($configFile));

            /*
             * Extensibility
             */
            $publicFile = File::localToPublic($configFile);
            if ($results = Event::fire('system.extendConfigFile', [$publicFile, $config])) {
                foreach ($results as $result) {
                    if (!is_array($result)) {
                        continue;
                    }
                    $config = array_merge($config, $result);
                }
            }

            $config = $this->makeConfigFromArray($config);
        }

        /*
         * Validate required configuration
         */
        foreach ($requiredConfig as $property) {
            if (!property_exists($config, $property)) {
                throw new SystemException(Lang::get(
                    'system::lang.config.required',
                    ['property' => $property, 'location' => get_called_class()]
                ));
            }
        }

        return $config;
    }

    /**
     * Makes a config object from an array, making the first level keys properties a new object. 
     * Property values are converted to camelCase and are not set if one already exists.
     * @param array $configArray Config array.
     * @return stdObject The config object
     */
    public function makeConfigFromArray($configArray = [])
    {
        $object = new stdClass();

        if (!is_array($configArray)) {
            return $object;
        }

        foreach ($configArray as $name => $value) {
            $_name = camel_case($name);
            $object->{$name} = $object->{$_name} = $value;
        }

        return $object;
    }

    /**
     * Locates a file based on it's definition. If the file starts with
     * an "at symbol", it will be returned in context of the application base path,
     * otherwise it will be returned in context of the config path.
     * @param string $fileName File to load.
     * @param mixed $configPath Explicitly define a config path.
     * @return string Full path to the config file.
     */
    public function getConfigPath($fileName, $configPath = null)
    {
        if (!isset($this->configPath)) {
            $this->configPath = $this->guessConfigPath();
        }

        if (!$configPath) {
            $configPath = $this->configPath;
        }

        $fileName = File::symbolizePath($fileName, $fileName);

        if (File::isLocalPath($fileName) || realpath($fileName) !== false) {
            return $fileName;
        }

        if (!is_array($configPath)) {
            $configPath = [$configPath];
        }

        foreach ($configPath as $path) {
            $_fileName = $path . '/' . $fileName;
            if (File::isFile($_fileName)) {
                break;
            }
        }

        return $_fileName;
    }

    /**
     * Guess the package path for the called class.
     * @param string $suffix An extra path to attach to the end
     * @return string
     */
    public function guessConfigPath($suffix = '')
    {
        $class = get_called_class();
        return $this->guessConfigPathFrom($class, $suffix);
    }

    /**
     * Guess the package path from a specified class.
     * @param string $class Class to guess path from.
     * @param string $suffix An extra path to attach to the end
     * @return string
     */
    public function guessConfigPathFrom($class, $suffix = '')
    {
        $classFolder = strtolower(class_basename($class));
        $classFile = realpath(dirname(File::fromClass($class)));
        $guessedPath = $classFile ? $classFile . '/' . $classFolder . $suffix : null;
        return $guessedPath;
    }
}
