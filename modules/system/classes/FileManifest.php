<?php namespace System\Classes;

use ApplicationException;
use Config;

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
     * @var string Modules to store in manifest.
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
            $path = $this->root . DIRECTORY_SEPARATOR . 'modules' . DIRECTORY_SEPARATOR . $module;

            if (!is_dir($path)) {
                continue;
            }

            foreach ($this->findFiles($path) as $file) {
                $files[$this->getFilename($file)] = md5_file($file);
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
            $module = explode(DIRECTORY_SEPARATOR, $path)[2];

            $modules[$module] .= $hash;
        }

        return array_map(function ($moduleSum) {
            return md5($moduleSum);
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
        $files = [];

        $iterator = function ($path) use (&$iterator, &$files, $basePath) {
            foreach (new \DirectoryIterator($path) as $item) {
                if ($item->isDot() === true) {
                    continue;
                }
                if ($item->isFile()) {
                    // Ignore hidden files
                    if (substr($item->getFilename(), 0, 1) === '.') {
                        continue;
                    }

                    // Check for specific extensions.
                    $validExtensions = ['php', 'js', 'css', 'less'];
                    $pathinfo = $item->getFileInfo();

                    if (!in_array(strtolower($pathinfo->getExtension()), $validExtensions)) {
                        continue;
                    }

                    $files[] = $item->getPathName();
                }
                if ($item->isDir()) {
                    // Ignore hidden directories
                    if (substr($item->getFilename(), 0, 1) === '.') {
                        continue;
                    }

                    $iterator($item->getPathname());
                }
            }
        };
        $iterator($basePath);

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
}
