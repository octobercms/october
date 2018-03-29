<?php namespace System\Twig;

use App;
use File;
use Twig_Source;
use Twig_LoaderInterface;
use Exception;

/**
 * This class implements a Twig template loader for the core system and backend.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class Loader implements Twig_LoaderInterface
{
    /**
     * @var string Expected file extension
     */
    protected $extension = 'htm';

    /**
     * @var array Cache
     */
    protected $cache = [];

    /**
     * Gets the path of a view file
     * @param  string $name
     * @return string
     */
    protected function findTemplate($name)
    {
        $finder = App::make('view')->getFinder();

        if (isset($this->cache[$name])) {
            return $this->cache[$name];
        }

        if (File::isFile($name)) {
            return $this->cache[$name] = $name;
        }

        $view = $name;
        if (File::extension($view) === $this->extension) {
            $view = substr($view, 0, -strlen($this->extension));
        }

        $path = $finder->find($view);
        return $this->cache[$name] = $path;
    }

    public function getSourceContext($name)
    {
        return new Twig_Source(File::get($this->findTemplate($name)), $name);
    }

    public function getCacheKey($name)
    {
        return $this->findTemplate($name);
    }

    public function isFresh($name, $time)
    {
        return File::lastModified($this->findTemplate($name)) <= $time;
    }

    public function getFilename($name)
    {
        return $this->findTemplate($name);
    }

    public function exists($name)
    {
        try {
            $this->findTemplate($name);
            return true;
        }
        catch (Exception $exception) {
            return false;
        }
    }
}
