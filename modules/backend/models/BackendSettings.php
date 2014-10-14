<?php namespace Backend\Models;

use File;
use Lang;
use Model;
use Less_Parser;

/**
 * Backend settings that affect all users
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class BackendSettings extends Model
{
    use \System\Traits\ViewMaker;
    use \October\Rain\Database\Traits\Validation;

    public $implement = ['System.Behaviors.SettingsModel'];

    public $settingsCode = 'backend_settings';

    public $settingsFields = 'fields.yaml';

    public $attachOne = [
        'logo' => ['System\Models\File']
    ];

    /**
     * Validation rules
     */
    public $rules = [
        'app_name'     => 'required',
        'app_motto'    => 'required',
    ];

    public function initSettingsData()
    {
        $this->app_name = Lang::get('system::lang.app.name');
        $this->app_motto = Lang::get('system::lang.app.motto');

        // Carrot
        $this->primary_color_dark = '#d35400';

        // Pumpkin
        $this->primary_color_light = '#e67e22';

        // Midnight Blue
        $this->secondary_color_dark = '#2b3e50';

        // Wet Asphalt
        $this->secondary_color_light = '#34495e';
    }

    public static function getLogo()
    {
        $settings = self::instance();
        if (!$settings->logo)
            return null;

        return $settings->logo->getPath();
    }

    public function renderCss()
    {
        $parser = new Less_Parser(['compress' => true]);

        $parser->ModifyVars([
            'logo-image' => "'".self::getLogo()."'",
            'primary-color-light' => $this->primary_color_light,
            'primary-color-dark' => $this->primary_color_dark,
            'secondary-color-light' => $this->secondary_color_light,
            'secondary-color-dark' => $this->secondary_color_dark,
        ]);

        $parser->parse(File::get(__DIR__.'/backendsettings/custom.less'));

        $css = $parser->getCss();
        return $css;
    }

}