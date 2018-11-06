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
                Cache::forget($datasource->getPathsCacheKey());
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

                // Break on first datasource that can handle the path
                break;
            }
        }

        if ($isDeleted) {
            throw new Exception("$path is deleted");
        }

        return $this->datasources[$datasourceIndex];
    }

    /**
     * Get all valid paths for the provided directory, removing any paths marked as deleted
     *
     * @param string $dirName
     * @param array $options Array of options, [
     *                          'extensions' => ['htm', 'md', 'twig'], // Extensions to search for
     *                          'fileMatch'  => '*gr[ae]y',            // Shell matching pattern to match the filename against using the fnmatch function
     *                      ];
     * @return array $paths ["$dirName/path/1.md", "$dirName/path/2.md"]
     */
    protected function getValidPaths($dirName, $options = [])
    {
        // Initialize result set
        $paths = [];

        // Reverse the order of the sources so that earlier
        // sources are prioritized over later sources
        $pathsCache = array_reverse($this->pathCache);

        // Get paths available in the provided dirName, allowing proper prioritization of earlier datasources
        foreach ($pathsCache as $sourcePaths) {
            $paths = array_merge($paths, array_filter($sourcePaths, function ($path) use ($dirName, $options) {
                $basePath = $dirName . '/';

                $inPath = starts_with($path, $basePath);

                // Check the fileMatch if provided as an option
                $fnMatch = !empty($options['fileMatch']) ? fnmatch($options['fileMatch'], str_after($path, $basePath)) : true;

                // Check the extension if provided as an option
                $validExt = is_array($options['extensions']) && !empty($options['extensions']) ? in_array(pathinfo($path, PATHINFO_EXTENSION), $options['extensions']) : true;

                return $inPath && $fnMatch && $validExt;
            }, ARRAY_FILTER_USE_KEY));
        }

        // Filter out 'deleted' paths:
        $paths = array_filter($paths, function ($value) { return (bool) $value; });

        // Return just an array of paths
        return array_keys($paths);
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
        // Handle fileName listings through just the cache
        if (@$options['columns'] === ['fileName']) {
            // Return just filenames of the valid paths for this directory
            $results = array_values(array_map(function ($path) use ($dirName) {
                return ['fileName' => str_after($path, $dirName . '/')];
            }, $this->getValidPaths($dirName, $options)));

        // Retrieve full listings from datasources directly
        } else {
            // Initialize result set
            $sourceResults = [];

            // Reverse the order of the sources so that earlier
            // sources are prioritized over later sources
            $datasources = array_reverse($this->datasources);

            foreach ($datasources as $datasource) {
                $sourceResults = array_merge($sourceResults, $datasource->select($dirName, $options));
            }

            // Remove duplicate results prioritizing results from earlier datasources
            $sourceResults = collect($sourceResults)->keyBy('fileName');

            // Get a list of valid filenames from the list of valid paths for this directory
            $validFiles = array_map(function ($path) use ($dirName) {
                return str_after($path, $dirName . '/');
            }, $this->getValidPaths($dirName, $options));

            // Filter out deleted paths
            $results = array_values($sourceResults->filter(function ($value, $key) use ($validFiles) {
                return in_array($key, $validFiles);
            })->all());
        }

        return $results;
    }

    /**
     * Creates a new template, only inserts to the first datasource
     *
     * @param  string  $dirName
     * @param  string  $fileName
     * @param  string  $extension
     * @param  string  $content
     * @return bool
     */
    public function insert($dirName, $fileName, $extension, $content)
    {
        $result = $this->datasources[0]->insert($dirName, $fileName, $extension, $content);

        // Refresh the cache
        $this->populateCache(true);

        return $result;
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
        $searchFileName = $oldFileName ?: $fileName;
        $searchExt = $oldExtension ?: $oldExtension;

        if (!empty($this->datasources[0]->selectOne($dirName, $searchFileName, $searchExt))) {
            $result = $this->datasources[0]->update($dirName, $fileName, $extension, $content, $oldFileName, $oldExtension);
        } else {
            $result = $this->datasources[0]->insert($dirName, $fileName, $extension, $content);
        }

        // Refresh the cache
        $this->populateCache(true);

        return $result;
    }

    /**
     * Run a delete statement against the datasource, only runs delete on first datasource
     *
     * @param  string  $dirName
     * @param  string  $fileName
     * @param  string  $extension
     * @return int
     */
    public function delete($dirName, $fileName, $extension)
    {
        try {
            // Delete from only the first datasource
            $this->datasources[0]->delete($dirName, $fileName, $extension);

            // Refresh the cache
            $this->populateCache(true);
        }
        catch (Exception $ex) {
            // Check to see if this is a valid path to delete
            $path = $this->makeFilePath($dirName, $fileName, $extension);

            if (in_array($path, $this->getValidPaths($dirName))) {
                // Retrieve the current record
                $record = $this->selectOne($dirName, $fileName, $extension);

                // Insert the current record into the first datasource so we can mark it as deleted
                $this->insert($dirName, $fileName, $extension, $record['content']);

                // Perform the deletion on the newly inserted record
                $this->delete($dirName, $fileName, $extension);
            } else {
                throw (new DeleteFileException)->setInvalidPath($path);
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
     * @return array $paths ['path/to/file1.md' => true (path can be handled and exists), 'path/to/file2.md' => false (path can be handled but doesn't exist)]
     */
    public function getAvailablePaths()
    {
        $paths = [];
        $datasources = array_reverse($this->datasources);
        foreach ($datasources as $datasource) {
            $paths = array_merge($paths, $datasource->getAvailablePaths());
        }
        return $paths;
    }
}