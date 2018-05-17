<?php namespace Cms\Models;

use File;
use Lang;
use Model;
use Response;
use ApplicationException;
use October\Rain\Filesystem\Zip;
use Cms\Classes\Theme as CmsTheme;
use Exception;

/**
 * Theme export model
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeExport extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'cms_theme_data';

    /**
     * @var array The rules to be applied to the data.
     */
    public $rules = [];

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [];

    /**
     * @var array Make the model's attributes public so behaviors can modify them.
     */
    public $attributes = [
        'theme' => null,
        'themeName' => null,
        'dirName' => null,
        'folders' => [
            'assets'   => true,
            'pages'    => true,
            'layouts'  => true,
            'partials' => true,
            'content'  => true,
        ]
    ];

    public function getFoldersOptions()
    {
        return [
            'assets'   => 'Assets',
            'pages'    => 'Pages',
            'layouts'  => 'Layouts',
            'partials' => 'Partials',
            'content'  => 'Content',
        ];
    }

    public function setThemeAttribute($theme)
    {
        if (!$theme instanceof CmsTheme) {
            return;
        }

        $this->attributes['themeName'] = $theme->getConfigValue('name', $theme->getDirName());
        $this->attributes['dirName'] = $theme->getDirName();
        $this->attributes['theme'] = $theme;
    }

    public function export($theme, $data = [])
    {
        $this->theme = $theme;
        $this->fill($data);

        try {
            $themePath = $this->theme->getPath();
            $tempPath = temp_path() . '/'.uniqid('oc');
            $zipName = uniqid('oc');
            $zipPath = temp_path().'/'.$zipName;

            if (!File::makeDirectory($tempPath)) {
                throw new ApplicationException('Unable to create directory '.$tempPath);
            }

            if (!File::makeDirectory($metaPath = $tempPath . '/meta')) {
                throw new ApplicationException('Unable to create directory '.$metaPath);
            }

            File::copy($themePath.'/theme.yaml', $tempPath.'/theme.yaml');
            File::copyDirectory($themePath.'/meta', $metaPath);

            foreach ($this->folders as $folder) {
                if (!array_key_exists($folder, $this->getFoldersOptions())) {
                    continue;
                }

                File::copyDirectory($themePath.'/'.$folder, $tempPath.'/'.$folder);
            }

            Zip::make($zipPath, $tempPath);
            File::deleteDirectory($tempPath);
        }
        catch (Exception $ex) {

            if (strlen($tempPath) && File::isDirectory($tempPath)) {
                File::deleteDirectory($tempPath);
            }

            if (strlen($zipPath) && File::isFile($zipPath)) {
                File::delete($zipPath);
            }

            throw $ex;
        }

        return $zipName;
    }

    public static function download($name, $outputName = null)
    {
        if (!preg_match('/^oc[0-9a-z]*$/i', $name)) {
            throw new ApplicationException('File not found');
        }

        $zipPath = temp_path() . '/' . $name;
        if (!file_exists($zipPath)) {
            throw new ApplicationException('File not found');
        }

        $headers = Response::download($zipPath, $outputName)->headers->all();
        $result = Response::make(File::get($zipPath), 200, $headers);

        @File::delete($zipPath);

        return $result;
    }
}
