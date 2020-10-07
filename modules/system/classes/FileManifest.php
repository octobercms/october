<?php namespace System\Classes;

use ApplicationException;
use Config;
use October\Rain\Filesystem\Filesystem;
use October\Rain\Halcyon\Datasource\FileDatasource;

/**
 * Stores the file manifest for this October CMS installation.
 *
 * This manifest is a file checksum of all files within this October CMS installation. When compared to the source
 * manifest, this allows us to determine the current installation's build number.
 *
 * @package october\system
 * @author Ben Thomson
 */
class FileManifest
{
    /**
     * @var string Root folder of this installation.
     */
    protected $root;

    /**
     * @var array Modules to store in manifest.
     */
    protected $modules = ['system', 'backend', 'cms'];

    /**
     * @var array Files cache.
     */
    protected $files = [];

    /**
     * Constructor.
     *
     * @param string $root The root folder to get the file list from.
     * @param array $modules An array of modules to include in the file manifest.
     */
    public function __construct($root = null, array $modules = null)
    {
        if (isset($root)) {
            $this->setRoot($root);
        } else {
            $this->setRoot(base_path());
        }

        if (isset($modules)) {
            $this->setModules($modules);
        } else {
            $this->setModules(Config::get('cms.loadModules', ['System', 'Backend', 'Cms']));
        }
    }

    /**
     * Sets the root folder.
     *
     * @param string $root
     * @throws ApplicationException If the specified root does not exist.
     */
    public function setRoot($root)
    {
        if (is_string($root)) {
            $this->root = realpath($root);

            if ($this->root === false || !is_dir($this->root)) {
                throw new ApplicationException(
                    'Invalid root specified for the file manifest.'
                );
            }
        }

        return $this;
    }

    /**
     * Sets the modules.
     *
     * @param array $modules
     */
    public function setModules(array $modules)
    {
        $this->modules = array_map(function ($module) {
            return strtolower($module);
        }, $modules);

        return $this;
    }

    /**
     * Gets a list of files and their corresponding hashsums.
     *
     * @return array
     */
    public function getFiles()
    {
        if (count($this->files)) {
            return $this->files;
        }

        $files = [];

        foreach ($this->modules as $module) {
            $path = $this->root . '/modules/' . $module;

            if (!is_dir($path)) {
                continue;
            }

            foreach ($this->findFiles($path) as $file) {
                $files[$this->getFilename($file)] = hash('sha3-256', $this->normalizeFileContents($file));
            }
        }

        return $this->files = $files;
    }

    /**
     * Gets the checksum of a specific install.
     *
     * @return array
     */
    public function getModuleChecksums()
    {
        if (!count($this->files)) {
            $this->getFiles();
        }

        $modules = [];
        foreach ($this->modules as $module) {
            $modules[$module] = '';
        }

        foreach ($this->files as $path => $hash) {
            // Determine module
            $module = explode('/', $path)[2];

            $modules[$module] .= $hash;
        }

        return array_map(function ($moduleSum) {
            return hash('sha3-256', $moduleSum);
        }, $modules);
    }

    /**
     * Finds all files within the path.
     *
     * @param string $basePath The base path to look for files within.
     * @return array
     */
    protected function findFiles(string $basePath)
    {
        $datasource = new FileDatasource($basePath, new Filesystem);

        $files = array_map(function ($path) use ($basePath) {
            return $basePath . '/' . $path;
        }, array_keys($datasource->getAvailablePaths()));

        // Ensure files are sorted so they are in a consistent order, no matter the way the OS returns the file list.
        sort($files, SORT_NATURAL);

        return $files;
    }

    /**
     * Returns the filename without the root.
     *
     * @param string $file
     * @return string
     */
    protected function getFilename(string $file): string
    {
        return str_replace($this->root, '', $file);
    }

    /**
     * Normalises the file contents, irrespective of OS.
     *
     * @param string $file
     * @return string
     */
    protected function normalizeFileContents(string $file): string
    {
        if (!is_file($file)) {
            return '';
        }

        $contents = file_get_contents($file);

        return str_replace(PHP_EOL, "\n", $contents);
    }
}
