<?php namespace Backend\Models\ImportModel;

use File;
use Html;
use Config;
use Storage;
use October\Rain\Filesystem\Definitions as FileDefinitions;
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
            $this->attachImportFile($model, $attr, $value, $sessionKey);
        }
        else {
            $values = is_array($value) ? $value : [$value];
            foreach ($values as $filePath) {
                $this->attachImportFile($model, $attr, $filePath, $sessionKey);
            }
        }
    }

    /**
     * attachImportFile attaches a referenced file after checking its type against the field and cleaning vector content.
     */
    protected function attachImportFile($model, $attr, $value, $sessionKey)
    {
        $localPath = $this->resolveImportFilePath($value);
        if (!$localPath) {
            return;
        }

        $extension = strtolower(File::extension($localPath));
        $allowedTypes = $this->getImportFileTypes($model, $attr);
        if ($allowedTypes !== null && !in_array($extension, $allowedTypes, true)) {
            throw new ApplicationException(__("The file :name is not an allowed type for the :field field", [
                'name' => basename($localPath),
                'field' => $attr
            ]));
        }

        if ($extension !== 'svg' || !Config::get('media.clean_vectors', true)) {
            $model->{$attr}()->createFromFile($localPath, [], $sessionKey);
            return;
        }

        // Clean a copy so media library and seed source files are never modified
        $cleanDir = temp_path('import/' . uniqid('oc'));
        $cleanPath = $cleanDir . '/' . basename($localPath);

        try {
            File::makeDirectory($cleanDir, 0755, true, true);
            File::put($cleanPath, Html::cleanVector(File::get($localPath)));
            $model->{$attr}()->createFromFile($cleanPath, [], $sessionKey);
        }
        finally {
            File::deleteDirectory($cleanDir);
        }
    }

    /**
     * getImportFileTypes returns the lowercase extensions a file field accepts, or null when any type is accepted.
     */
    protected function getImportFileTypes($model, $attr): ?array
    {
        $field = method_exists($model, 'getFieldsetDefinition')
            ? $model->getFieldsetDefinition()->getField($attr)
            : null;

        $types = $field?->fileTypes ?: FileDefinitions::get('default_extensions');

        if ($types === '*') {
            return null;
        }

        if (!is_array($types)) {
            $types = explode(',', $types);
        }

        return array_map(fn ($type) => strtolower(trim($type, ' .')), $types);
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
            if ($path = $this->safeResolvePath($this->importFilesPath, $value)) {
                return $path;
            }
        }

        // Source prefix: theme seed context (e.g. "seeds/files/hero.jpg")
        if ($this->pathPrefix) {
            if ($path = $this->safeResolvePath($this->pathPrefix, $value)) {
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
     * safeResolvePath returns the resolved real path of $value joined to $base
     * only if the result is contained within $base. Returns null otherwise.
     * Prevents path traversal via .. segments or symlink escapes.
     */
    protected function safeResolvePath(string $base, string $value): ?string
    {
        $baseReal = realpath($base);
        if ($baseReal === false) {
            return null;
        }

        $pathReal = realpath($base . '/' . $value);
        if ($pathReal === false) {
            return null;
        }

        $baseReal = rtrim($baseReal, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
        if (!str_starts_with($pathReal . DIRECTORY_SEPARATOR, $baseReal)) {
            return null;
        }

        return $pathReal;
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
