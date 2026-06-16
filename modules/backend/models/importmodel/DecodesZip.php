<?php namespace Backend\Models\ImportModel;

use File;
use Storage;
use ApplicationException;

/**
 * DecodesZip format for import
 */
trait DecodesZip
{
    /**
     * @var string|null importFilesPath is the directory path containing
     * extracted files from a ZIP import
     */
    protected $importFilesPath;

    /**
     * @var string|null importDataFilePath caches the data file path from
     * a previously extracted ZIP to avoid re-extraction
     */
    protected $importDataFilePath;

    /**
     * @var string|null pathPrefix for resolving relative file paths in seed context
     */
    protected $pathPrefix;

    /**
     * extractImportZip extracts a ZIP archive and returns the path to the
     * data file inside. Also sets importFilesPath for file attachment resolution.
     */
    protected function extractImportZip($zipPath)
    {
        // Return cached result if already extracted
        if ($this->importDataFilePath !== null) {
            return $this->importDataFilePath;
        }

        $extractPath = temp_path('import/' . uniqid('oc'));

        $zip = new \ZipArchive;
        if ($zip->open($zipPath) !== true) {
            throw new ApplicationException(__("Failed to open the ZIP archive"));
        }

        $zip->extractTo($extractPath);
        $zip->close();

        $this->importFilesPath = $extractPath;

        // Look for data file in the ZIP root
        $dataFile = null;
        foreach (['data.json', 'data.csv'] as $candidate) {
            $candidatePath = $extractPath . '/' . $candidate;
            if (file_exists($candidatePath)) {
                $dataFile = $candidatePath;
                break;
            }
        }

        // Fallback: find any JSON or CSV file in the root
        if (!$dataFile) {
            foreach (File::files($extractPath) as $file) {
                if (in_array(strtolower(File::extension($file)), ['json', 'csv'])) {
                    $dataFile = $file;
                    break;
                }
            }
        }

        if (!$dataFile) {
            throw new ApplicationException(__("The ZIP archive does not contain a data file (data.json or data.csv)"));
        }

        // Auto-detect file format from the data file
        if (str_ends_with($dataFile, '.json')) {
            $this->file_format = 'json';
        }
        elseif (str_ends_with($dataFile, '.csv')) {
            $this->file_format = 'csv';
        }

        return $this->importDataFilePath = $dataFile;
    }

    /**
     * getImportFilesPath returns the directory path containing extracted
     * files from a ZIP import, or null if not a ZIP import
     */
    public function getImportFilesPath()
    {
        return $this->importFilesPath;
    }

    /**
     * decodeFileRelation creates file attachments from path references
     */
    protected function decodeFileRelation($model, $attr, $value, $sessionKey)
    {
        if (empty($value)) {
            return;
        }

        if ($model->isRelationTypeSingular($attr)) {
            $localPath = $this->resolveImportFilePath($value);
            if ($localPath) {
                $model->{$attr}()->createFromFile($localPath, [], $sessionKey);
            }
        }
        else {
            $values = is_array($value) ? $value : [$value];
            foreach ($values as $filePath) {
                $localPath = $this->resolveImportFilePath($filePath);
                if ($localPath) {
                    $model->{$attr}()->createFromFile($localPath, [], $sessionKey);
                }
            }
        }
    }

    /**
     * resolveImportFilePath resolves a file reference to a local filesystem path.
     * Supports: ZIP-relative paths (files/...), media library paths, and
     * source prefix paths (theme seed context).
     */
    protected function resolveImportFilePath($value)
    {
        if (!is_string($value) || $value === '') {
            return null;
        }

        // ZIP import: paths starting with "files/" resolve from extracted ZIP
        if (str_starts_with($value, 'files/') && $this->importFilesPath) {
            $path = $this->importFilesPath . '/' . $value;
            if (file_exists($path)) {
                return $path;
            }
        }

        // Source prefix: theme seed context (e.g. "seeds/files/hero.jpg")
        if ($this->pathPrefix) {
            $path = $this->pathPrefix . '/' . $value;
            if (file_exists($path)) {
                return $path;
            }
        }

        // Media library path (e.g. "photos/hero.jpg")
        $mediaDisk = Storage::disk('media');
        if ($mediaDisk->exists($value)) {
            return $mediaDisk->path($value);
        }

        return null;
    }

    /**
     * setSourcePrefix prefixes file paths with the provided path,
     * used in theme seed context
     */
    public function setSourcePrefix($pathPrefix)
    {
        $this->pathPrefix = $pathPrefix;
    }
}
