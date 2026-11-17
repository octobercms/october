<?php

use System\Models\MailSetting;
use October\Rain\Exception\ValidationException;

class MailSettingTest extends TestCase
{
    /**
     * @dataProvider sendmailPathProvider
     */
    public function testSendmailPathValidation(string $path, bool $expectValid)
    {
        $this->assertSame($expectValid, MailSetting::isValidSendmailPath($path));
    }

    public function testBeforeValidateChecksTheSendmailPath()
    {
        $setting = new MailSetting;

        $setting->sendmail_path = '';
        $setting->beforeValidate();

        $setting->sendmail_path = null;
        $setting->beforeValidate();

        foreach (['/usr/sbin/sendmail -t; touch /tmp/x', ['/usr/sbin/sendmail']] as $path) {
            $setting->sendmail_path = $path;

            try {
                $setting->beforeValidate();
                $this->fail('An invalid sendmail path passed validation');
            }
            catch (ValidationException $ex) {
                $this->assertArrayHasKey('sendmail_path', $ex->errors());
            }
        }
    }

    public static function sendmailPathProvider(): array
    {
        return [
            ['/usr/sbin/sendmail', true],
            ['/usr/sbin/sendmail -bs', true],
            ['/usr/sbin/sendmail -bs -i', true],
            ['/usr/sbin/sendmail -t -i', true],
            ['/usr/sbin/sendmail -ti', true],
            ['/usr/sbin/sendmail -t -oi', true],
            ['/usr/sbin/sendmail -bs -f admin@example.com', true],
            ['/usr/sbin/sendmail -t -fadmin@example.com', true],
            ['/usr/bin/msmtp -t', true],
            ['/usr/sbin/exim -bs', true],
            ['/usr/sbin/exim4 -t', true],
            ['C:\\xampp\\sendmail\\sendmail.exe -t', true],
            ['C:/xampp/sendmail/sendmail.exe -t', true],
            ['C:\\php\\php.exe C:\\tmp\\sendmail -t', false],
            ['/usr/sbin/sendmail -t; touch /tmp/x', false],
            ['/usr/sbin/sendmail -t -X /tmp/log', false],
            ['/usr/sbin/sendmail -t -X/tmp/log', false],
            ['/usr/sbin/sendmail -tiX/tmp/log', false],
            ['/usr/sbin/sendmail -t -C /tmp/alt.cf', false],
            ['/usr/sbin/sendmail -t -iC/tmp/alt.cf', false],
            ['/usr/sbin/sendmail -t -OQueueDirectory=/tmp', false],
            ['/usr/sbin/sendmail -t -oQ/tmp', false],
            ['/usr/bin/php /tmp/notes.txt -t', false],
            ['/usr/bin/php /tmp/sendmail -t', false],
            ["/usr/sbin/sendmail -t\n", false],
            ['/usr/sbin/sendmail -t -f', false],
            ['\\\\attacker.example\\share\\sendmail.exe -t', false],
            ['//attacker.example/share/sendmail.exe -t', false],
            ['/\\attacker.example\\share\\sendmail.exe -t', false],
            ['\\\\.\\GLOBALROOT\\Device\\Mup\\attacker.example\\share\\sendmail.exe -t', false],
        ];
    }
}
