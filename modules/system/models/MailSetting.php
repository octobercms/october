<?php namespace System\Models;

use App;
use Site;
use Event;
use Config;
use System\Models\SettingModel;

/**
 * MailSetting model
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailSetting extends SettingModel
{
    use \October\Rain\Database\Traits\Multisite;
    use \October\Rain\Database\Traits\Validation;

    const MODE_LOG = 'log';
    const MODE_SENDMAIL = 'sendmail';
    const MODE_SMTP = 'smtp';
    const MODE_MAILGUN = 'mailgun';
    const MODE_SES = 'ses';
    const MODE_POSTMARK = 'postmark';

    /**
     * @var string settingsCode is a unique code for these settings
     */
    public $settingsCode = 'system_mail_settings';

    /**
     * @var mixed settingsFields definitions
     */
    public $settingsFields = 'fields.yaml';

    /**
     * @var array propagatable fields
     */
    protected $propagatable = [
        'sendmail_path',
        'smtp_address',
        'smtp_port',
        'smtp_user',
        'smtp_password',
        'smtp_authorization',
        'smtp_encryption',
        'smtp_timeout',
        'mailgun_domain',
        'mailgun_secret',
        'ses_key',
        'ses_secret',
        'ses_region',
        'postmark_token',
    ];

    /**
     * @var array rules for validation
     */
    public $rules = [
        'sender_name'  => 'required',
        'sender_email' => 'required|email'
    ];

    /**
     * initSettingsData for this model. This only executes when the
     * model is first created or reset to default.
     * @return void
     */
    public function initSettingsData()
    {
        $config = App::make('config');
        $this->send_mode = $config->get('mail.default', static::MODE_LOG);
        $this->sender_name = $config->get('mail.from.name', 'Your Site');
        $this->sender_email = $config->get('mail.from.address', 'admin@domain.tld');
        $this->sendmail_path = $config->get('mail.mailers.sendmail.path', '/usr/sbin/sendmail');
        $this->smtp_address = $config->get('mail.mailers.smtp.host');
        $this->smtp_port = $config->get('mail.mailers.smtp.port', 587);
        $this->smtp_user = $config->get('mail.mailers.smtp.username');
        $this->smtp_password = $config->get('mail.mailers.smtp.password');
        $this->smtp_authorization = !!strlen($this->smtp_user);
        $this->smtp_encryption = $config->get('mail.mailers.smtp.encryption');
        $this->smtp_timeout = $config->get('mail.mailers.smtp.timeout', 30);
        $this->mailgun_domain = $config->get('services.mailgun.domain');
        $this->mailgun_secret = $config->get('services.mailgun.secret');
        $this->ses_key = $config->get('services.ses.key');
        $this->ses_secret = $config->get('services.ses.secret');
        $this->ses_region = $config->get('services.ses.region');
        $this->postmark_token = $config->get('services.postmark.secret');
    }

    /**
     * getSendModeOptions
     */
    public function getSendModeOptions()
    {
        $options =  (array) Config::get('mail.send_mode_options', [
            static::MODE_LOG => "Log File",
            static::MODE_SENDMAIL => "Sendmail",
            static::MODE_SMTP => "SMTP",
            static::MODE_MAILGUN => "Mailgun",
            static::MODE_SES => "SES",
            static::MODE_POSTMARK => "Postmark",
        ]);

        /**
         * @event system.mail.getSendModeOptions
         * Add or remove mailer send mode options.
         *
         * The format of the $options variable can be found in
         * System\Models\MailSetting::getSendModeOptions()
         *
         * Example usage:
         *
         *     Event::listen('system.mail.getSendModeOptions', function(&$options) {
         *         $options['mydriver'] = 'My Driver';
         *     });
         *
         */
        Event::fire('system.mail.getSendModeOptions', [&$options]);

        return $options;
    }

    /**
     * enableMultisiteMailer uses a just-in-time mail driver to handle mail configuration
     * for multiple site definitions. A new driver is needed due to the Laravel internals
     * caching most of the configuration after resolving.
     */
    public static function enableMultisiteMailer()
    {
        Event::listen('mailer.buildQueueMailable', function ($mailer, $mailable) {
            $mailable->forceMailer('x_site_mailer_' . Site::getSiteIdFromContext());
        });

        Event::listen('mailer.beforeResolve', function ($mailer, $name) {
            if (!str_starts_with($name, 'x_site_mailer_')) {
                return;
            }

            // Assuming site context is applied
            if (static::isConfigured()) {
                static::applyConfigValues();
            }

            // Set the unique mailer just in time
            if ($activeMailer = Config::get('mail.default')) {
                Config::set("mail.mailers.{$name}", Config::get("mail.mailers.{$activeMailer}"));
            }
        });
    }

    /**
     * applyConfigValues
     */
    public static function applyConfigValues()
    {
        $config = App::make('config');
        $settings = self::instance();
        $config->set('mail.default', $settings->send_mode);
        $config->set('mail.from.name', $settings->sender_name);
        $config->set('mail.from.address', $settings->sender_email);

        switch ($settings->send_mode) {
            case self::MODE_SMTP:
                $config->set('mail.mailers.smtp.host', $settings->smtp_address);
                $config->set('mail.mailers.smtp.port', $settings->smtp_port);
                if ($settings->smtp_authorization) {
                    $config->set('mail.mailers.smtp.username', $settings->smtp_user);
                    $config->set('mail.mailers.smtp.password', $settings->smtp_password);
                }
                else {
                    $config->set('mail.mailers.smtp.username', null);
                    $config->set('mail.mailers.smtp.password', null);
                }
                if ($settings->smtp_encryption) {
                    $config->set('mail.mailers.smtp.encryption', $settings->smtp_encryption);
                }
                else {
                    $config->set('mail.mailers.smtp.encryption', null);
                }
                if ($settings->smtp_timeout) {
                    $config->set('mail.mailers.smtp.timeout', $settings->smtp_timeout);
                }
                break;

            case self::MODE_SENDMAIL:
                $config->set('mail.mailers.sendmail.path', $settings->sendmail_path);
                break;

            case self::MODE_MAILGUN:
                $config->set('services.mailgun.domain', $settings->mailgun_domain);
                $config->set('services.mailgun.secret', $settings->mailgun_secret);
                break;

            case self::MODE_SES:
                $config->set('services.ses.key', $settings->ses_key);
                $config->set('services.ses.secret', $settings->ses_secret);
                $config->set('services.ses.region', $settings->ses_region);
                break;

            case self::MODE_POSTMARK:
                $config->set('services.postmark.token', $settings->postmark_token);
                break;
        }

        /**
         * @event system.mail.applyConfigValues
         * Applies configuration values from mail settings
         *
         * Example usage:
         *
         *     Event::listen('system.mail.applyConfigValues', function($settings) {
         *         if ($settings->send_mode === 'mydriver') {
         *             Config::set('services.mydriver.secret', $settings->mydriver_secret);
         *         }
         *     });
         *
         */
        Event::fire('system.mail.applyConfigValues', [$settings]);
    }

    /**
     * getSmtpEncryptionOptions values
     * @return array
     */
    public function getSmtpEncryptionOptions()
    {
        return [
            '' => "No encryption",
            'tls' => "TLS",
        ];
    }

    /**
     * isMultisiteEnabled allows for programmatic toggling
     * @return bool
     */
    public function isMultisiteEnabled()
    {
        return Site::hasFeature('backend_mail_setting');
    }
}
