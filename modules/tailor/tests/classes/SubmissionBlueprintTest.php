<?php

use Tailor\Classes\Blueprint\SubmissionBlueprint;

class SubmissionBlueprintTest extends TestCase
{
    public function testNotifyDefaults()
    {
        $blueprint = new SubmissionBlueprint;

        $this->assertNull($blueprint->getNotifyGroup());
        $this->assertEquals('tailor:submission', $blueprint->getNotifyTemplate());
        $this->assertEquals('email', $blueprint->getNotifyReplyTo());
    }

    public function testNotifyConfiguration()
    {
        $blueprint = new SubmissionBlueprint([
            'submission' => [
                'notifyGroup' => 'contact-team',
                'notifyTemplate' => 'backend:contact-form',
                'notifyReplyTo' => 'author_email',
            ]
        ]);

        $this->assertEquals('contact-team', $blueprint->getNotifyGroup());
        $this->assertEquals('backend:contact-form', $blueprint->getNotifyTemplate());
        $this->assertEquals('author_email', $blueprint->getNotifyReplyTo());
    }
}
