<?php namespace System\Traits;

use File;
use Lang;
use Event;
use Block;
use SystemException;

/**
 * View Maker Trait
 * Adds view based methods to a class
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

trait ViewMaker
{
    /**
     * @var array A list of variables to pass to the page.
     */
    public $vars = [];

    /**
     * @var string Specifies a path to the views directory.
     */
    protected $viewPath;

    /**
     * @var string Specifies a path to the layout directory.
     */
    protected $layoutPath;

    /**
     * @var string Layout to use for the view.
     */
    public $layout;

    /**
     * @var bool Prevents the use of a layout.
     */
    public $suppressLayout = false;

    /**
     * Render a partial file contents located in the views folder.
     * @param string $partial The view to load.
     * @param array $params Parameter variables to pass to the view.
     * @param bool $throwException Throw an exception if the partial is not found.
     * @return mixed Partial contents or false if not throwing an exception.
     */
    public function makePartial($partial, $params = [], $throwException = true)
    {
        if (!File::isPathSymbol($partial) && realpath($partial) === false) {
            $folder = strpos($partial, '/') !== false ? dirname($partial) . '/' : '';
            $partial = $folder . '_' . strtolower(basename($partial)).'.htm';
        }

        $partialPath = $this->getViewPath($partial);

        if (!File::exists($partialPath)) {
            if ($throwException) {
                throw new SystemException(Lang::get('backend::lang.partial.not_found_name', ['name' => $partialPath]));
            }
            else {
                return false;
            }
        }

        return $this->makeFileContents($partialPath, $params);
    }

    /**
     * Loads a view with the name specified. Applies layout if its name is provided by the parent object.
     * The view file must be situated in the views directory, and has the extension "htm".
     * @param string $view Specifies the view name, without extension. Eg: "index".
     * @return string
     */
    public function makeView($view)
    {
        $viewPath = $this->getViewPath(strtolower($view) . '.htm');
        $contents = $this->makeFileContents($viewPath);
        return $this->makeViewContent($contents);
    }

    /**
     * Renders supplied contents inside a layout.
     * @param string $contents The inner contents as a string.
     * @param string $name Specifies the layout name.
     * If this parameter is omitted, the $layout property will be used.
     * @return string The layout contents
     */
    public function makeViewContent($contents, $layout = null)
    {
        if ($this->suppressLayout || $this->layout == '') {
            return $contents;
        }

        // Append any undefined block content to the body block
        Block::set('undefinedBlock', $contents);
        Block::append('body', Block::get('undefinedBlock'));
        return $this->makeLayout();
    }

    /**
     * Render a layout.
     * @param string $name Specifies the layout name.
     * If this parameter is omitted, the $layout property will be used.
     * @param array $params Parameter variables to pass to the view.
     * @param bool $throwException Throw an exception if the layout is not found
     * @return string The layout contents
     */
    public function makeLayout($name = null, $params = [], $throwException = true)
    {
        $layout = ($name === null) ? $this->layout : $name;
        if ($layout == '') {
            return;
        }

        $layoutPath = $this->getViewPath($layout . '.htm', $this->layoutPath);

        if (!File::exists($layoutPath)) {
            if ($throwException) {
                throw new SystemException(Lang::get('cms::lang.layout.not_found_name', ['name' => $layoutPath]));
            }
            else {
                return false;
            }
        }

        return $this->makeFileContents($layoutPath, $params);
    }

    /**
     * Renders a layout partial
     * @param string $partial The view to load.
     * @param array $params Parameter variables to pass to the view.
     * @return string The layout partial contents
     */
    public function makeLayoutPartial($partial, $params = [])
    {
        if (!File::isLocalPath($partial) && !File::isPathSymbol($partial)) {
            $folder = strpos($partial, '/') !== false ? dirname($partial) . '/' : '';
            $partial = $folder . '_' . strtolower(basename($partial));
        }

        return $this->makeLayout($partial, $params);
    }

    /**
     * Locates a file based on it's definition. If the file starts with
     * an "at symbol", it will be returned in context of the application base path,
     * otherwise it will be returned in context of the view path.
     * @param string $fileName File to load.
     * @param mixed $viewPath Explicitly define a view path.
     * @return string Full path to the view file.
     */
    public function getViewPath($fileName, $viewPath = null)
    {
        if (!isset($this->viewPath)) {
            $this->viewPath = $this->guessViewPath();
        }

        if (!$viewPath) {
            $viewPath = $this->viewPath;
        }

        $fileName = File::symbolizePath($fileName);

        if (File::isLocalPath($fileName) || realpath($fileName) !== false) {
            return $fileName;
        }

        if (!is_array($viewPath)) {
            $viewPath = [$viewPath];
        }

        foreach ($viewPath as $path) {
            $_fileName = File::symbolizePath($path) . '/' . $fileName;
            if (File::isFile($_fileName)) {
                break;
            }
        }

        return $_fileName;
    }

    /**
     * Includes a file path using output buffering.
     * Ensures that vars are available.
     * @param string $filePath Absolute path to the view file.
     * @param array $extraParams Parameters that should be available to the view.
     * @return string
     */
    public function makeFileContents($filePath, $extraParams = [])
    {
        if (!strlen($filePath) || !File::isFile($filePath)) {
            return;
        }

        if (!is_array($extraParams)) {
            $extraParams = [];
        }

        $vars = array_merge($this->vars, $extraParams);

        ob_start();
        extract($vars);
        include $filePath;
        return ob_get_clean();
    }

    /**
     * Guess the package path for the called class.
     * @param string $suffix An extra path to attach to the end
     * @param bool $isPublic Returns public path instead of an absolute one
     * @return string
     */
    public function guessViewPath($suffix = '', $isPublic = false)
    {
        $class = get_called_class();
        return $this->guessViewPathFrom($class, $suffix, $isPublic);
    }

    /**
     * Guess the package path from a specified class.
     * @param string $class Class to guess path from.
     * @param string $suffix An extra path to attach to the end
     * @param bool $isPublic Returns public path instead of an absolute one
     * @return string
     */
    public function guessViewPathFrom($class, $suffix = '', $isPublic = false)
    {
        $classFolder = strtolower(class_basename($class));
        $classFile = realpath(dirname(File::fromClass($class)));
        $guessedPath = $classFile ? $classFile . '/' . $classFolder . $suffix : null;
        return ($isPublic) ? File::localToPublic($guessedPath) : $guessedPath;
    }

    /**
     * Special event function used for extending within view files
     * @param string $event Event name
     * @param array $params Event parameters
     * @return string
     */
    public function fireViewEvent($event, $params = [])
    {
        // Add the local object to the first parameter always
        array_unshift($params, $this);

        if ($result = Event::fire($event, $params)) {
            return implode(PHP_EOL.PHP_EOL, (array) $result);
        }
    }
}
