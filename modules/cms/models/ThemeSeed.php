<?php namespace Cms\Models;

use File;
use Yaml;
use Model;
use Cms\Classes\Theme as CmsTheme;
use Tailor\Classes\BlueprintIndexer;
use ApplicationException;
use SystemException;
use Exception;

/**
 * ThemeSeed model
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeSeed extends Model
{
    use \System\Traits\NoteMaker;

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
        'useRoot' => false,
        'folders' => [
            'blueprints',
            'data',
            'lang',
        ]
    ];

    /**
     * Import / Export model classes are helpers and are not to write to the database
     *
     * @return void
     */
    public function save(?array $options = null, $sessionKey = null)
    {
        throw new ApplicationException(sprintf("The % model is not intended to be saved, please use %s instead", get_class($this), 'ThemeData'));
    }

    /**
     * getFoldersOptions
     */
    public function getFoldersOptions()
    {
        return [
            'blueprints' => 'Blueprints',
            'data' => 'Data',
            'lang' => 'Translations',
        ];
    }

    /**
     * setThemeAttribute
     */
    public function setThemeAttribute($theme)
    {
        if (!$theme instanceof CmsTheme) {
            return;
        }

        $this->attributes['themeName'] = $theme->getConfigValue('name', $theme->getDirName());
        $this->attributes['dirName'] = $theme->getDirName();
        $this->attributes['themePath'] = $theme->getPath();
        $this->attributes['theme'] = $theme;
    }

    /**
     * seed
     */
    public function seed($theme, $data = [])
    {
        @set_time_limit(3600);

        $this->theme = $theme;
        $this->fill($data);

        foreach ($this->folders as $folder) {
            if (!array_key_exists($folder, $this->getFoldersOptions())) {
                continue;
            }

            $methodName = 'importSeed'.ucfirst($folder);
            $this->$methodName();
        }
    }

    /**
     * importSeedBlueprints
     */
    protected function importSeedBlueprints()
    {
        // Importing blueprints
        $appBpPath = $this->useRoot
            ? app_path('blueprints')
            : app_path('blueprints/' . $this->dirName);

        // Import and migrate blueprints
        $themeBpPath = $this->themePath . '/seeds/blueprints';
        if (File::isDirectory($themeBpPath)) {
            $this->note('Importing Blueprints');
            File::copyDirectory($themeBpPath, $appBpPath);

            BlueprintIndexer::instance()->setNotesOutput($this->getNotesOutput())->migrate();
        }
    }

    /**
     * importSeedData
     */
    protected function importSeedData()
    {
        // Importing seed data
        $importFile = $this->themePath . '/seeds/data.yaml';
        if (File::isFile($importFile)) {
            $this->note('Importing Data');
            $instructions = Yaml::parseFile($importFile);

            try {
                $this->processSeedInstructions($instructions);
            }
            catch (Exception $ex) {
                throw new SystemException("[{$importFile}] " . $ex->getMessage(), 0, $ex);
            }
        }
    }

    /**
     * importSeedLang
     */
    protected function importSeedLang()
    {
        // Import language files
        $themeLangPath = $this->themePath . '/seeds/lang';
        $appLangPath = app_path('lang');
        if (File::isDirectory($themeLangPath)) {
            $this->note('Importing Translations');

            if (!File::exists($appLangPath)) {
                File::makeDirectory($appLangPath);
            }

            foreach (File::files($themeLangPath) as $file) {
                $filename = $file->getFilename();
                $srcPath = $themeLangPath."/$filename";
                $destPath = $appLangPath."/$filename";
                if (File::exists($destPath)) {
                    $oldLang = json_decode(file_get_contents($destPath), true);
                    $newLang = json_decode(file_get_contents($srcPath), true);
                    $updated = array_merge($oldLang, $newLang);
                    File::put($destPath, json_encode($updated, JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
                }
                else {
                    File::copy($themeLangPath."/$filename", $destPath);
                }

                $this->note("- <info>Imported</info>: $filename");
            }
        }
    }

    /**
     * processSeedInstructions
     */
    protected function processSeedInstructions($instructions)
    {
        if (!is_array($instructions)) {
            return;
        }

        foreach ($instructions as $instruction) {
            $this->processSeedInstruction($instruction);
        }
    }

    /**
     * processSeedInstruction
     */
    protected function processSeedInstruction($instruction)
    {
        $importName = $instruction['name'] ?? 'Import Data';
        $className = $instruction['class'] ?? null;
        $fileName = $instruction['file'] ?? null;
        $attributes = $instruction['attributes'] ?? null;
        $matches = $instruction['matches'] ?? null;

        if (!$className) {
            throw new SystemException("Import script is missing definition for 'class'");
        }
        if (!$fileName) {
            throw new SystemException("Import script is missing definition for 'file'");
        }
        if (!$attributes || !is_array($attributes)) {
            throw new SystemException("Import script is missing definition for 'attributes'");
        }

        if (!class_exists($className)) {
            throw new SystemException("Import class '{$className}' does not exist.");
        }

        $importFile = $this->themePath . '/' . $fileName;
        if (!File::exists($importFile)) {
            throw new SystemException("Import file '{$fileName}' does not exist.");
        }

        $importModel = new $className;
        $importModel->forceFill($attributes);

        if (method_exists($importModel, 'setSourcePrefix')) {
            $importModel->setSourcePrefix($this->themePath);
        }

        $importModel->importFile($importFile, ['matches' => $matches, 'sessionKey' => str_random(40)]);

        $stats = $importModel->getResultStats();
        $this->note("- <info>{$importName}</info>: {$stats->created} Created / {$stats->updated} Updated / {$stats->skippedCount} Skipped");
    }
}
