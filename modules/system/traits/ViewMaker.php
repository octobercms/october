<?php namespace System\Traits;

use File;
use Lang;
use Block;
use SystemException;
use Throwable;

/**
 * ViewMaker Trait adds view based methods to a class
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait ViewMaker
{
    /**
     * @var array vars is a list of variables to pass to the page
     */
    public $vars = [];

    /**
     * @var string|array viewPath specifies a path to the views directory
     */
    protected $viewPath;

    /**
     * @var string layoutPath specifies a path to the layout directory
     */
    protected $layoutPath;

    /**
     * @var string layout to use for the view
     */
    public $layout;

    /**
     * @var bool suppressLayout prevents the use of a layout
     */
    public $suppressLayout = false;

    /**
     * @var array viewPathGuessCache remembers path guesses for performance.
     */
    protected $viewPathGuessCache = [];

    /**
     * addViewPath prepends a path on the available view path locations
     * @param string|array $path
     * @return void
     */
    public function addViewPath($path, $append = false)
    {
        $this->viewPath = (array) $this->viewPath;

        if (is_array($path)) {
            $this->viewPath = $append
                ? array_merge($this->viewPath, $path)
                : array_merge($path, $this->viewPath);
        }
        else {
            $append
                ? array_push($this->viewPath, $path)
                : array_unshift($this->viewPath, $path);
        }
    }

    /**
     * getViewPaths returns the active view path locations
     * @return array
     */
    public function getViewPaths()
    {
        return (array) $this->viewPath;
    }

    /**
     * makePartial renders a partial file contents located in the views folder
     * @param string $partial The view to load.
     * @param array $params Parameter variables to pass to the view.
     * @param bool $throwException Throw an exception if the partial is not found.
     * @return mixed Partial contents or false if not throwing an exception.
     */
    public function makePartial($partial, $params = [], $throwException = true)
    {
        $notRealPath = realpath($partial) === false || is_dir($partial) === true;
        if (!File::isPathSymbol($partial) && $notRealPath) {
            $folder = strpos($partial, '/') !== false ? dirname($partial) . '/' : '';
            $partial = $folder . '_' . strtolower(basename($partial));
        }

        $partialPath = $this->getViewPath($partial);

        if (!$partialPath || !File::exists($partialPath)) {
            if ($throwException) {
                throw new SystemException(Lang::get('backend::lang.partial.not_found_name', ['name' => $partial]));
            }

            return false;
        }

        return $this->makeFileContents($partialPath, $params);
    }

    /**
     * makeView loads a view with the name specified. Applies layout if its name is provided
     * by the parent object. The view file must be situated in the views directory, and has
     * the extension "htm" or "php"
     * @param string $view Specifies the view name, without extension. Eg: "index".
     * @return string
     */
    public function makeView($view)
    {
        $viewPath = $this->getViewPath(strtolower($view));

        $contents = $this->makeFileContents($viewPath);

        return $this->makeViewContent($contents);
    }

    /**
     * makeViewContent renders supplied contents inside a layout
     * @param string $contents The inner contents as a string.
     * @param string $layout Specifies the layout name.
     * @return string
     */
    public function makeViewContent($contents, $layout = null)
    {
        if ($this->suppressLayout || !$this->layout) {
            return $contents;
        }

        // Append any undefined block content to the body block
        Block::set('undefinedBlock', $contents);
        Block::append('body', Block::get('undefinedBlock'));

        return $this->makeLayout($layout);
    }

    /**
     * makeLayout renders a layout
     * @param string $name Specifies the layout name.
     * If this parameter is omitted, the $layout property will be used.
     * @param array $params Parameter variables to pass to the view.
     * @param bool $throwException Throw an exception if the layout is not found
     * @return mixed The layout contents, or false.
     */
    public function makeLayout($name = null, $params = [], $throwException = true)
    {
        $layout = $name ?? $this->layout;
        if (!$layout) {
            return '';
        }

        $layoutPath = $this->getViewPath($layout, $this->layoutPath);

        if (!File::exists($layoutPath)) {
            if ($throwException) {
                throw new SystemException(Lang::get('cms::lang.layout.not_found_name', ['name' => $layoutPath]));
            }

            return false;
        }

        return $this->makeFileContents($layoutPath, $params);
    }

    /**
     * makeLayoutPartial renders a layout partial
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
     * getViewPath locates a file based on its definition. The file name can be prefixed
     * with a symbol (~|$) to return in context of the application or plugin base path,
     * otherwise it will be returned in context of this object view path.
     * @param string $fileName
     * @param mixed $viewPath
     * @return string
     */
    public function getViewPath($fileName, $viewPath = null)
    {
        $viewExtensions = ['php', 'htm'];

        if (!isset($this->viewPath)) {
            $this->viewPath = $this->guessViewPath();
        }

        if (!$viewPath) {
            $viewPath = $this->viewPath;
        }

        if (!is_array($viewPath)) {
            $viewPath = [$viewPath];
        }

        // Remove extension from path
        $fileName = File::anyname($fileName);

        // Check in view paths
        if (!File::isPathSymbol($fileName)) {
            foreach ($viewPath as $path) {
                $fullPath = File::symbolizePath($path);

                foreach ($viewExtensions as $extension) {
                    $_fileName = $fullPath . '/' . $fileName . '.' . $extension;
                    if (File::isFile($_fileName)) {
                        return $_fileName;
                    }
                }
            }
        }

        // Check in absolute
        $fileName = File::symbolizePath($fileName);
        if (strpos($fileName, '/') !== false) {
            foreach ($viewExtensions as $extension) {
                $_fileName = $fileName . '.' . $extension;
                if (File::checkBaseDir($_fileName)) {
                    return $_fileName;
                }
            }
        }

        return '';
    }

    /**
     * makeFileContents includes a file path using output buffering
     * @param string $filePath Absolute path to the view file.
     * @param array $extraParams Parameters that should be available to the view.
     * @return string
     */
    public function makeFileContents($filePath, $extraParams = [])
    {
        if (!strlen($filePath) || !File::isFile($filePath) || !File::checkBaseDir($filePath)) {
            return '';
        }

        if (!is_array($extraParams)) {
            $extraParams = [];
        }

        $vars = array_merge(
            $this->vars,
            $extraParams,
            ['_context' => $extraParams]
        );

        $obLevel = ob_get_level();

        ob_start();

        extract($vars);

        // We'll evaluate the contents of the view inside a try/catch block so we can
        // flush out any stray output that might get out before an error occurs or
        // an exception is thrown. This prevents any partial views from leaking.
        try {
            include $filePath;
        }
        catch (Throwable $e) {
            $this->handleViewException($e, $obLevel);
        }

        return ob_get_clean();
    }

    /**
     * handleViewException handles a view exception
     */
    protected function handleViewException(Throwable $e, int $obLevel): void
    {
        while (ob_get_level() > $obLevel) {
            ob_end_clean();
        }

        throw $e;
    }

    /**
     * guessViewPath guesses the package path for the called class
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
     * guessViewPathFrom guesses the package path from a specified class, including
     * an optional suffix to attach at the end, and the option to return a public
     * path instead of a local one.
     * @param string $class
     * @param string $suffix
     * @param bool $isPublic
     * @return string
     */
    public function guessViewPathFrom($class, $suffix = '', $isPublic = false)
    {
        // Pass to the controller to share the cache
        if (isset($this->controller) && method_exists($this->controller, 'guessViewPathFrom')) {
            return $this->controller->guessViewPathFrom($class, $suffix, $isPublic);
        }

        if (is_object($class)) {
            $class = get_class($class);
        }

        if (!array_key_exists($class, $this->viewPathGuessCache)) {
            $classFolder = strtolower(class_basename($class));
            $classFile = realpath(dirname(File::fromClass($class)));
            $this->viewPathGuessCache[$class] = $classFile ? $classFile . '/' . $classFolder : null;
        }

        $guessedPath = $this->viewPathGuessCache[$class];
        if ($guessedPath !== null) {
            $guessedPath .= $suffix;
        }

        return $isPublic ? File::localToPublic($guessedPath) : $guessedPath;
    }
}
