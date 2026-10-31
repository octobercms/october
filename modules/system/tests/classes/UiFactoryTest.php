<?php

use System\Classes\UiFactory;

/**
 * UiFactoryTest checks components made by the UI factory.
 */
class UiFactoryTest extends TestCase
{
    /**
     * testCalloutRendersClosureBody checks a closure passed to callout renders inside the callout.
     */
    public function testCalloutRendersClosureBody()
    {
        $html = (string) UiFactory::callout(function () {
            echo '<p>Callout body</p>';
        });

        $this->assertStringContainsString('<p>Callout body</p>', $html);
    }

    /**
     * testCalloutRendersStringBody checks a string passed to callout renders inside the callout.
     */
    public function testCalloutRendersStringBody()
    {
        $html = (string) UiFactory::callout('Plain callout body');

        $this->assertStringContainsString('Plain callout body', $html);
    }
}
