<?php

use System\Models\MailSetting;

class MailSettingTest extends TestCase
{
    /**
     * @dataProvider sendmailPathProvider
     */
    public function testSendmailPathValidation(string $path, bool $expectValid)
    {
        $rules = (new ReflectionClass(MailSetting::class))->getDefaultProperties()['rules'];

        $validator = Validator::make(
            ['sendmail_path' => $path],
            ['sendmail_path' => $rules['sendmail_path']]
        );

        $this->assertSame($expectValid, $validator->passes());
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
        ];
    }
}
