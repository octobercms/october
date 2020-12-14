<?php

use Illuminate\Mail\Message;
use System\Classes\MailManager;
use System\Models\MailTemplate;

class MailManagerTest extends PluginTestCase
{

    public function setUp() : void
    {
        parent::setUp();

        $swift = Mail::getSwiftMailer();
        $this->message = new Message($swift->createMessage('message'));

        foreach (['html', 'plain'] as $view) {
            $t = new MailTemplate();
            $t->is_custom = true;
            $t->code = "$view-view";
            $t->subject = "$view view [{{ mode }}]";
            $t->content_html = "my $view view content";
            $t->description = "my $view view description";
            $t->save();
        }
    }

    //
    // Tests
    //

    public function testAddContent_Html()
    {
        $plain = $raw = null;
        $html = 'html-view';
        $data = ['mode' => 'test'];

        $result = MailManager::instance()->addContent($this->message, $html, $plain, $raw, $data);
        $swiftMsg = $this->message->getSwiftMessage();

        $this->assertEquals('text/html', $swiftMsg->getBodyContentType());
        $this->assertEquals('html view [test]', $swiftMsg->getSubject());
    }

    public function testAddContent_Plain()
    {
        $html = $raw = null;
        $plain = 'plain-view';
        $data = ['mode' => 'test'];

        $result = MailManager::instance()->addContent($this->message, $html, $plain, $raw, $data);
        $swiftMsg = $this->message->getSwiftMessage();

        $this->assertTrue($result);
        $this->assertEquals('text/plain', $swiftMsg->getBodyContentType());
        $this->assertEquals('plain view [test]', $swiftMsg->getSubject());
        $this->assertEquals('my plain view content', $swiftMsg->getBody());
    }

    public function testAddContent_Raw()
    {
        $html = $plain = null;
        $raw = 'my raw content';
        $data = ['mode' => 'test'];

        $result = MailManager::instance()->addContent($this->message, $html, $plain, $raw, $data);
        $swiftMsg = $this->message->getSwiftMessage();

        $this->assertTrue($result);
        $this->assertEquals('text/plain', $swiftMsg->getBodyContentType());
        $this->assertEquals('No subject', $swiftMsg->getSubject());
        $this->assertEquals($raw, $swiftMsg->getBody());
    }

    public function testAddContent_Html_Plain()
    {
        $raw = null;
        $html = 'html-view';
        $plain = 'plain-view';
        $data = ['mode' => 'test'];

        $result = MailManager::instance()->addContent($this->message, $html, $plain, $raw, $data);
        $swiftMsg = $this->message->getSwiftMessage();
        $parts = $swiftMsg->getChildren();

        $this->assertTrue($result);
        $this->assertEquals('text/html', $swiftMsg->getBodyContentType());
        $this->assertEquals('html view [test]', $swiftMsg->getSubject());
        $this->assertTrue(str_contains($swiftMsg->getBody(), 'my html view content'));

        $this->assertEquals(1, count($parts));
        $this->assertEquals('text/plain', $parts[0]->getBodyContentType());
        $this->assertEquals('my plain view content', $parts[0]->getBody());
    }

    public function testAddContent_Html_Plain_Raw()
    {
        $html = 'html-view';
        $plain = 'plain-view';
        $raw = 'my raw content';
        $data = ['mode' => 'test'];

        $result = MailManager::instance()->addContent($this->message, $html, $plain, $raw, $data);
        $swiftMsg = $this->message->getSwiftMessage();
        $parts = $swiftMsg->getChildren();

        $this->assertTrue($result);
        $this->assertEquals('text/html', $swiftMsg->getBodyContentType());
        $this->assertEquals('html view [test]', $swiftMsg->getSubject());

        $this->assertEquals(1, count($parts));
        $this->assertEquals('text/plain', $parts[0]->getBodyContentType());
        $this->assertEquals($raw, $parts[0]->getBody());
    }
}
