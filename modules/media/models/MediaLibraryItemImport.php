<?php namespace Media\Models;

use File;
use Storage;
use Backend\Models\ImportModel;
use October\Contracts\Element\ListElement;
use October\Contracts\Element\FormElement;
use Illuminate\Http\File as HttpFile;
use Media\Classes\MediaLibrary;

/**
 * MediaLibraryItemImport for importing media items
 *
 * @package october\media
 * @author Samuel Georges, Alexey Bobkov
 */
class MediaLibraryItemImport extends ImportModel
{
    /**
     * @var array rules for validation
     */
    public $rules = [];

    /**
     * @var ?string pathPrefix
     */
    protected $pathPrefix = null;

    /**
     * defineListColumns
     */
    public function defineListColumns(ListElement $host)
    {
        $host->defineColumn('type', 'Item Type');
        $host->defineColumn('path', 'Output Path');
        $host->defineColumn('source', 'Source Path');
    }

    /**
     * importData
     */
    public function importData($results, $sessionKey = null)
    {
        $disk = Storage::disk('media');

        foreach ($results as $row => $item) {
            if ($item['type'] === 'file') {
                $target = $item['path'];
                $target = MediaLibrary::validatePath($target);

                if ($disk->exists($target)) {
                    $this->logSkipped($row, "File already exists");
                    continue;
                }

                $disk->putFileAs(
                    dirname($target),
                    new HttpFile($this->baseSourcePath($item['source'])),
                    basename($target)
                );

                $this->logCreated();
            }

            if ($item['type'] === 'folder') {
                $files = File::allFiles($this->baseSourcePath($item['source']));

                foreach ($files as $iRow => $file) {
                    $relativePath = $file->getRelativePathname();
                    $target = $item['path'] . '/' . $relativePath;
                    $target = MediaLibrary::validatePath($target);

                    if ($disk->exists($target)) {
                        $this->logSkipped("{$row}.{$iRow}", "File already exists");
                        continue;
                    }

                    $disk->putFileAs(
                        $item['path'],
                        new HttpFile($file->getRealPath()),
                        $relativePath
                    );

                    $this->logCreated();
                }
            }
        }
    }

    /**
     * Returns a base source path for 'source' definitions
     */
    protected function baseSourcePath($path)
    {
        return $this->pathPrefix ?
            "{$this->pathPrefix}/{$path}"
            : $path;
    }

    /**
     * setSourcePrefix prefixes every source with the provided path
     */
    public function setSourcePrefix($pathPrefix)
    {
        $this->pathPrefix = $pathPrefix;
    }
}
