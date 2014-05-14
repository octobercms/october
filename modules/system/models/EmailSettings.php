<?php namespace System\Models;

use App;
use Model;

class EmailSettings extends Model
{
    public $implement = ['System.Behaviors.SettingsModel'];

    public $settingsCode = 'system_email_settings';
    public $settingsFields = 'fields.yaml';

    const MODE_MAIL     = 'mail';
    const MODE_SENDMAIL = 'sendmail';
    const MODE_SMTP     = 'smtp';

    public function initSettingsData()
    {
        $config = App::make('config');
        $this->send_mode = $config->get('mail.driver', static::MODE_MAIL);
        $this->sender_name = $config->get('mail.from.name', 'Your Site');
        $this->sender_email = $config->get('mail.from.address', 'admin@admin.admin');
        $this->sendmail_path = $config->get('mail.sendmail', '/usr/sbin/sendmail');
        $this->smtp_address = $config->get('mail.host');
        $this->smtp_port = $config->get('mail.port', 587);
        $this->smtp_user = $config->get('mail.username');
        $this->smtp_password = $config->get('mail.password');
        $this->smtp_authorization = strlen($this->smtp_user);
    }

    public function getSendModeOptions()
    {
        return [
            static::MODE_MAIL     => 'PHP mail',
            static::MODE_SENDMAIL => 'Sendmail',
            static::MODE_SMTP     => 'SMTP',
        ];
    }

    public static function applyConfigValues()
    {
        $config = App::make('config');
        $settings = self::instance();
        $config->set('mail.driver', $settings->send_mode);
        $config->set('mail.from.name', $settings->sender_name);
        $config->set('mail.from.address', $settings->sender_email);

        switch ($settings->send_mode) {

            case self::MODE_SMTP:
                $config->set('mail.host', $settings->smtp_address);
                $config->set('mail.port', $settings->smtp_port);
                if ($settings->smtp_authorization) {
                    $config->set('mail.username', $settings->smtp_user);
                    $config->set('mail.password', $settings->smtp_password);
                }
                else {
                    $config->set('mail.username', null);
                    $config->set('mail.password', null);
                }
                break;

            case self::MODE_SENDMAIL:
                $config->set('mail.sendmail', $settings->sendmail_path);
                break;
        }
    }
}