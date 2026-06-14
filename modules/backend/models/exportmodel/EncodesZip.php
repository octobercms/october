<?php namespace Backend\Models\ExportModel;

use File;

/**
 * EncodesZip format for export
 */
trait EncodesZip
{
    /**
     * @var array exportedFiles collects file paths for ZIP packaging.
     * Format: ['files/name.jpg' => '/absolute/local/path.jpg']
     */
    protected $exportedFiles = [];

    /**
     * @var array exportedFileNames tracks used filenames to handle collisions
     */
    protected $exportedFileNames = [];

    /**
     * addExportedFile registers a file for inclusion in the exported
     * ZIP archive
     */
    public function addExportedFile($relativePath, $localPath)
    {
        $this->exportedFiles[$relativePath] = $localPath;
    }

    /**
     * encodeFileRelation returns file path(s) for a file attachment relation
     * and registers the files for inclusion in the exported ZIP archive
     */
    protected function encodeFileRelation($model, $attr)
    {
        if ($model->isRelationTypeSingular($attr)) {
            $file = $model->{$attr};
            return $file ? $this->encodeFileModel($file) : null;
        }

        $files = $model->{$attr};
        if (!$files || $files->isEmpty()) {
            return null;
        }

        $result = [];
        foreach ($files as $file) {
            $result[] = $this->encodeFileModel($file);
        }

        return $result;
    }

    /**
     * encodeFileModel returns a unique file path and registers the file
     * for ZIP export
     */
    protected function encodeFileModel($file)
    {
        $name = $file->file_name;
        $relativePath = 'files/' . $name;

        // Handle filename collisions
        if (isset($this->exportedFileNames[$relativePath])) {
            $extension = File::extension($name);
            $baseName = $extension ? substr($name, 0, -(strlen($extension) + 1)) : $name;

            $counter = 2;
            do {
                $candidateName = $extension
                    ? "{$baseName}_{$counter}.{$extension}"
                    : "{$baseName}_{$counter}";
                $relativePath = 'files/' . $candidateName;
                $counter++;
            } while (isset($this->exportedFileNames[$relativePath]));
        }

        $this->exportedFileNames[$relativePath] = true;
        $this->addExportedFile($relativePath, $file->getLocalPath());

        return $relativePath;
    }

    /**
     * processExportDataAsZip packages the data file and exported files
     * into a single ZIP archive
     */
    protected function processExportDataAsZip($zipPath, $dataFilePath, $dataFileName)
    {
        $zip = new \ZipArchive;
        $zip->open($zipPath, \ZipArchive::CREATE);

        // Add data file
        $zip->addFile($dataFilePath, $dataFileName);

        // Add exported files
        foreach ($this->exportedFiles as $relativePath => $localPath) {
            $zip->addFile($localPath, $relativePath);
        }

        $zip->close();
    }
}
