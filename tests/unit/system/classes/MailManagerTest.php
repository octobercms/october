<?php

class MailManagerTest extends PluginTestCase
{

    public function setUp() : void
    {
        parent::setUp();

        Mail::fake();
    }

    //
    // Tests
    //

    public function testStringViews()
    {
        $views = 'html-view';

        Mail::assertNothingSent();

        Mail::send($views, [], function ($message) {
            $message->to = 'myself@octobercms.com';
            $message->subject = 'test mail';
        });

        Mail::assertSent('html-view', 1);
        Mail::assertNotSent('plain-view');
    }

    public function testIndexedArrayViews()
    {
        $views = ['html-view', 'plain-view'];

        Mail::assertNothingSent();

        Mail::send($views, [], function ($message) {
            $message->to = 'myself@octobercms.com';
            $message->subject = 'test mail';
        });

        Mail::assertSent('html-view', 1);
        Mail::assertSent('plain-view', 1);
    }

    public function testNamedArrayViews()
    {
        $views = [
            'html' => 'html-view',
            'text' => 'plain-view',
        ];

        Mail::assertNothingSent();

        Mail::send($views, [], function ($message) {
            $message->to = 'myself@octobercms.com';
            $message->subject = 'test mail';
        });

        Mail::assertSent('html-view', 1);
        Mail::assertSent('plain-view', 1);
    }
}
