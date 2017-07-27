<?php namespace System\Models;

use App;
use Model;

/**
 * Mail settings
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailSetting extends Model
{
    use \October\Rain\Database\Traits\Validation;

    const MODE_LOG      = 'log';
    const MODE_MAIL     = 'mail';
    const MODE_SENDMAIL = 'sendmail';
    const MODE_SMTP     = 'smtp';
    const MODE_MAILGUN  = 'mailgun';
    const MODE_MANDRILL = 'mandrill';
    const MODE_SES      = 'ses';

    /**
     * @var array Behaviors implemented by this model.
     */
    public $implement = [
        \System\Behaviors\SettingsModel::class
    ];

    /**
     * @var string Unique code
     */
    public $settingsCode = 'system_mail_settings';

    /**
     * @var mixed Settings form field defitions
     */
    public $settingsFields = 'fields.yaml';

    /*
     * Validation rules
     */
    public $rules = [
        'sender_name'  => 'required',
        'sender_email' => 'required|email'
    ];

    /**
     * Initialize the seed data for this model. This only executes when the
     * model is first created or reset to default.
     * @return void
     */
    public function initSettingsData()
    {
        $config = App::make('config');
        $this->send_mode = $config->get('mail.driver', static::MODE_MAIL);
        $this->sender_name = $config->get('mail.from.name', 'Your Site');
        $this->sender_email = $config->get('mail.from.address', 'admin@domain.tld');
        $this->sendmail_path = $config->get('mail.sendmail', '/usr/sbin/sendmail');
        $this->smtp_address = $config->get('mail.host');
        $this->smtp_port = $config->get('mail.port', 587);
        $this->smtp_user = $config->get('mail.username');
        $this->smtp_password = $config->get('mail.password');
        $this->smtp_authorization = !!strlen($this->smtp_user);
        $this->smtp_encryption = $config->get('mail.encryption');
    }

    public function getSendModeOptions()
    {
        return [
            static::MODE_LOG      => 'system::lang.mail.log_file',
            static::MODE_MAIL     => 'system::lang.mail.php_mail',
            static::MODE_SENDMAIL => 'system::lang.mail.sendmail',
            static::MODE_SMTP     => 'system::lang.mail.smtp',
            static::MODE_MAILGUN  => 'system::lang.mail.mailgun',
            static::MODE_MANDRILL => 'system::lang.mail.mandrill',
            static::MODE_SES      => 'system::lang.mail.ses',
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
                if ($settings->smtp_encryption) {
                    $config->set('mail.encryption', $settings->smtp_encryption);
                }
                else {
                    $config->set('mail.encryption', null);
                }
                break;

            case self::MODE_SENDMAIL:
                $config->set('mail.sendmail', $settings->sendmail_path);
                break;

            case self::MODE_MAILGUN:
                $config->set('services.mailgun.domain', $settings->mailgun_domain);
                $config->set('services.mailgun.secret', $settings->mailgun_secret);
                break;

            case self::MODE_MANDRILL:
                $config->set('services.mandrill.secret', $settings->mandrill_secret);
                break;

            case self::MODE_SES:
                $config->set('services.ses.key', $settings->ses_key);
                $config->set('services.ses.secret', $settings->ses_secret);
                $config->set('services.ses.region', $settings->ses_region);
                break;
        }

    }


    /**
     * @return array smtp_encryption options values
     */
    public function getSmtpEncryptionOptions()
    {
        return [
            '' => 'system::lang.mail.smtp_encryption_none',
            'tls' => 'system::lang.mail.smtp_encryption_tls',
            'ssl' => 'system::lang.mail.smtp_encryption_ssl',
        ];
    }
}
