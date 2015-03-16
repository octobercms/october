<?php namespace Cms\Models;

use File;
use Lang;
use Model;
use ApplicationException;
use October\Rain\Filesystem\Zip;
use Cms\Classes\Theme as CmsTheme;
use Exception;

/**
 * Theme import model
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeImport extends Model
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

    public $attachOne = [
        'uploaded_file' => ['System\Models\File']
    ];

    /**
     * @var array Make the model's attributes public so behaviors can modify them.
     */
    public $attributes = [
        'theme' => null,
        'themeName' => null,
        'dirName' => null,
        'overwrite' => true,
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
        if (!$theme instanceof CmsTheme) return;

        $this->attributes['themeName'] = $theme->getConfigValue('name', $theme->getDirName());
        $this->attributes['dirName'] = $theme->getDirName();
        $this->attributes['theme'] = $theme;
    }

    public function import($theme, $data = [], $sessionKey = null)
    {
        @set_time_limit(3600);

        $this->theme = $theme;
        $this->fill($data);

        try
        {
            $file = $this->uploaded_file()->withDeferred($sessionKey)->first();
            if (!$file) {
                throw new ApplicationException('There is no file attached to import!');
            }

            $themePath = $this->theme->getPath();
            $tempPath = temp_path() . '/'.uniqid('oc');
            $zipName = uniqid('oc');
            $zipPath = temp_path().'/'.$zipName;

            File::put($zipPath, $file->getContents());

            if (!@mkdir($tempPath))
                throw new ApplicationException('Unable to create directory '.$tempPath);

            Zip::extract($zipPath, $tempPath);

            // if (File::isFile($tempPath.'/theme.yaml')) {
            //     File::copy($tempPath.'/theme.yaml', $themePath.'/theme.yaml');
            // }

            if (File::isDirectory($tempPath.'/meta')) {
                File::copyDirectory($tempPath.'/meta', $themePath.'/meta');
            }

            foreach ($this->folders as $folder) {
                if (!array_key_exists($folder, $this->getFoldersOptions())) continue;
                File::copyDirectory($tempPath.'/'.$folder, $themePath.'/'.$folder);
            }

            File::deleteDirectory($tempPath);
            File::delete($zipPath);
            $file->delete();
        }
        catch (Exception $ex) {

            if (!empty($tempPath) && File::isDirectory($tempPath)) {
                File::deleteDirectory($tempPath);
            }

            if (!empty($zipPath) && File::isFile($zipPath)) {
                File::delete($zipPath);
            }

            throw $ex;
        }
    }

}