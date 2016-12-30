<?php namespace System\Traits;

use File;
use Lang;
use Event;
use Block;
use SystemException;
use Exception;
use Throwable;
use Symfony\Component\Debug\Exception\FatalThrowableError;

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
     * @var string|array Specifies a path to the views directory.
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
     * Prepends a path on the available view path locations.
     * @param string|array $path
     * @return void
     */
    public function addViewPath($path)
    {
        $this->viewPath = (array) $this->viewPath;

        if (is_array($path)) {
            $this->viewPath = array_merge($path, $this->viewPath);
        }
        else {
            array_unshift($this->viewPath, $path);
        }
    }

    /**
     * Returns the active view path locations.
     * @return array
     */
    public function getViewPaths()
    {
        return (array) $this->viewPath;
    }

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
     * @param string $layout Specifies the layout name.
     * @return string
     */
    public function makeViewContent($contents, $layout = null)
    {
        if ($this->suppressLayout || $this->layout == '') {
            return $contents;
        }

        // Append any undefined block content to the body block
        Block::set('undefinedBlock', $contents);
        Block::append('body', Block::get('undefinedBlock'));
        return $this->makeLayout($layout);
    }

    /**
     * Render a layout.
     * @param string $name Specifies the layout name.
     * If this parameter is omitted, the $layout property will be used.
     * @param array $params Parameter variables to pass to the view.
     * @param bool $throwException Throw an exception if the layout is not found
     * @return mixed The layout contents, or false.
     */
    public function makeLayout($name = null, $params = [], $throwException = true)
    {
        $layout = $name === null ? $this->layout : $name;
        if ($layout == '') {
            return '';
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
     * Locates a file based on its definition. The file name can be prefixed with a
     * symbol (~|$) to return in context of the application or plugin base path,
     * otherwise it will be returned in context of this object view path.
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
                return $_fileName;
            }
        }

        return $fileName;
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
            return '';
        }

        if (!is_array($extraParams)) {
            $extraParams = [];
        }

        $vars = array_merge($this->vars, $extraParams);

        $obLevel = ob_get_level();

        ob_start();

        extract($vars);

        // We'll evaluate the contents of the view inside a try/catch block so we can
        // flush out any stray output that might get out before an error occurs or
        // an exception is thrown. This prevents any partial views from leaking.
        try {
            include $filePath;
        }
        catch (Exception $e) {
            $this->handleViewException($e, $obLevel);
        }
        catch (Throwable $e) {
            $this->handleViewException(new FatalThrowableError($e), $obLevel);
        }

        return ob_get_clean();
    }

    /**
     * Handle a view exception.
     *
     * @param  \Exception  $e
     * @param  int  $obLevel
     * @return void
     *
     */
    protected function handleViewException($e, $obLevel)
    {
        while (ob_get_level() > $obLevel) {
            ob_end_clean();
        }

        throw $e;
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
}
