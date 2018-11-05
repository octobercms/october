<?php namespace Cms\Classes;

use Cache;
use Exception;
use October\Rain\Halcyon\Processors\Processor;
use October\Rain\Halcyon\Datasource\Datasource;
use October\Rain\Halcyon\Exception\DeleteFileException;
use October\Rain\Halcyon\Datasource\DatasourceInterface;

/**
 * Datasource that loads from other data sources automatically
 * 
 * @Todo: Need to prevent softdeleted DB records from appearing, even if they exist in the filesystem
 */
class AutoDatasource extends Datasource implements DatasourceInterface
{
    /**
     * @var array The available datasource instances
     */
    protected $datasources = [];

    /**
     * @var array Local cache of paths available in the datasources
     */
    protected $pathCache = [];

    /**
     * Create a new datasource instance.
     * 
     * @param array $datasources Array of datasources to utilize. Lower indexes = higher priority
     * @return void
     */
    public function __construct($datasources)
    {
        $this->datasources = $datasources;

        $this->populateCache();
        
        $this->postProcessor = new Processor;
    }

    /**
     * Populate the local cache of paths available in each datasource
     *
     * @param boolean $refresh Default false, set to true to force the cache to be rebuilt
     * @return void
     */
    protected function populateCache($refresh = false)
    {
        $pathCache = [];
        foreach ($this->datasources as $datasource) {
            // Remove any existing cache data
            if ($refresh) {
                Cache::forget($datasource->getPathsCacheKey);
            }

            // Load the cache
            $pathCache[] = Cache::rememberForever($datasource->getPathsCacheKey(), function () use ($datasource) {
                return $datasource->getAvailablePaths();
            });
        }
        $this->pathCache = $pathCache;
    }

    /**
     * Returns the datasource instances being used internally
     *
     * @return array
     */
    public function getDatasources()
    {
        return $this->datasources;
    }

    /**
     * Get the appropriate datasource for the provided path
     * 
     * @param string $path
     * @return Datasource
     */
    protected function getDatasourceForPath($path)
    {
        // Default to the last datasource provided
        $datasourceIndex = count($this->datasources) - 1;

        $isDeleted = false;

        foreach ($this->pathCache as $i => $paths) {
            if (isset($paths[$path])) {
                $datasourceIndex = $i;
                
                // Set isDeleted to the inverse of the the path's existance flag 
                $isDeleted = !$paths[$path];
            }   
        }

        if ($isDeleted) {
            throw new Exception("$path is deleted");
        }

        return $this->datasources[$datasourceIndex];
    }

    /**
     * Helper to make file path.
     * 
     * @param string $dirName
     * @param string $fileName
     * @param string $extension
     * @return string
     */
    protected function makeFilePath($dirName, $fileName, $extension)
    {
        return $dirName . '/' . $fileName . '.' . $extension;
    }

    /**
     * Returns a single template.
     *
     * @param  string  $dirName
     * @param  string  $fileName
     * @param  string  $extension
     * @return mixed
     */
    public function selectOne($dirName, $fileName, $extension)
    {
        try {
            $result = $this->getDatasourceForPath($this->makeFilePath($dirName, $fileName, $extension))->selectOne($dirName, $fileName, $extension);
        } catch (Exception $ex) {
            $result = null;
        }
        
        return $result;
    }

    /**
     * Returns all templates.
     *
     * @param  string  $dirName
     * @param array $options Array of options, [
     *                          'columns'    => ['fileName', 'mtime', 'content'], // Only return specific columns
     *                          'extensions' => ['htm', 'md', 'twig'],            // Extensions to search for
     *                          'fileMatch'  => '*gr[ae]y',                       // Shell matching pattern to match the filename against using the fnmatch function
     *                          'orders'     => false                             // Not implemented
     *                          'limit'      => false                             // Not implemented
     *                          'offset'     => false                             // Not implemented
     *                      ];
     * @return array
     */
    public function select($dirName, array $options = [])
    {
        // Initialize result set
        $sourceResults = [];

        foreach ($this->datasources as $datasource) {
            $sourceResults = array_merge($sourceResults, $datasource->select($dirName, $options));
        }

        // Remove duplicate results prioritizing results from earlier datasources
        // Reverse the order of the source results so that keyBy prioritizes 
        // earlier results rather than later results
        $results = array_values(collect(array_reverse($sourceResults))->keyBy('fileName')->all());

        return $results;
    }

    /**
     * Creates a new template.
     *
     * @param  string  $dirName
     * @param  string  $fileName
     * @param  string  $extension
     * @param  string  $content
     * @return bool
     */
    public function insert($dirName, $fileName, $extension, $content)
    {
        // @TODO: Implement this
    }

    /**
     * Updates an existing template.
     *
     * @param  string  $dirName
     * @param  string  $fileName
     * @param  string  $extension
     * @param  string  $content
     * @param  string  $oldFileName Defaults to null
     * @param  string  $oldExtension Defaults to null
     * @return int
     */
    public function update($dirName, $fileName, $extension, $content, $oldFileName = null, $oldExtension = null)
    {
        // @TODO: Implement this
    }

    /**
     * Run a delete statement against the datasource.
     *
     * @param  string  $dirName
     * @param  string  $fileName
     * @param  string  $extension
     * @return int
     */
    public function delete($dirName, $fileName, $extension)
    {
        // Initial implementation, forces delete on every datasource
        $exceptionCount = 0;
        try {
            foreach ($this->datasources as $datasource) {
                $datasource->delete($dirName, $fileName, $extension);
            }

            // Refresh the cache
            $this->populateCache(true);
        }
        catch (Exception $ex) {
            // Only throw exception if content couldn't be removed from any datasource
            $exceptionCount++;
            if ($exceptionCount >= count($this->datasources)) {
                throw (new DeleteFileException)->setInvalidPath($this->makeFilePath($dirName, $fileName, $extension));
            }
        }
    }

    /**
     * Return the last modified date of an object
     *
     * @param  string  $dirName
     * @param  string  $fileName
     * @param  string  $extension
     * @return int
     */
    public function lastModified($dirName, $fileName, $extension)
    {
        return $this->getDatasourceForPath($this->makeFilePath($dirName, $fileName, $extension))->lastModified($dirName, $fileName, $extension);
    }

    /**
     * Generate a cache key unique to this datasource.
     *
     * @param  string  $name
     * @return string
     */
    public function makeCacheKey($name = '')
    {
        $key = '';
        foreach ($this->datasources as $datasource) {
            $key .= $datasource->makeCacheKey($name) . '-';
        }
        $key .= $name;

        return crc32($key);
    }

    /**
     * Generate a paths cache key unique to this datasource
     * 
     * @return string
     */
    public function getPathsCacheKey()
    {
        return 'halcyon-datastore-auto';
    }

    /**
     * Get all available paths within this datastore
     * 
     * @return array $paths ['path/to/file1.md', 'path/to/file2.md']
     */
    public function getAvailablePaths()
    {
        $paths = [];
        foreach ($this->datasources as $datasource) {
            $paths = array_merge($paths, $datasource->getAvailablePaths());
        }
        return array_unique($paths);
    }
}