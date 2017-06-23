<?php namespace System\Models;

use Model;
use ApplicationException;

/**
 * System log settings
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class LogSetting extends Model
{
    use \October\Rain\Database\Traits\Validation;

    public $implement = ['System.Behaviors.SettingsModel'];

    public $settingsCode = 'system_log_settings';

    public $settingsFields = 'fields.yaml';

    /**
     * Validation rules
     */
    public $rules = [];

    public static function filterSettingItems($manager)
    {
        if (!self::isConfigured()) {
            $manager->removeSettingItem('October.System', 'request_logs');
            $manager->removeSettingItem('October.Cms', 'theme_logs');
            return;
        }

        if (!self::get('log_events')) {
            $manager->removeSettingItem('October.System', 'event_logs');
        }

        if (!self::get('log_requests')) {
            $manager->removeSettingItem('October.System', 'request_logs');
        }

        if (!self::get('log_theme')) {
            $manager->removeSettingItem('October.Cms', 'theme_logs');
        }
    }

    public function initSettingsData()
    {
        $this->log_events = true;
        $this->log_requests = false;
        $this->log_theme = false;
    }
}
