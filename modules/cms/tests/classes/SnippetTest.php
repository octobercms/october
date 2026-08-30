<?php

use Cms\Classes\Snippet;
use Cms\Helpers\Component as ComponentHelpers;

/**
 * SnippetTest covers the snippet class inline behavior.
 */
class SnippetTest extends TestCase
{
    /**
     * setInline sets the protected inline property, mirroring initFromPartial.
     */
    protected function setInline(Snippet $snippet, $value): void
    {
        $property = new ReflectionProperty(Snippet::class, 'inline');
        $property->setAccessible(true);
        $property->setValue($snippet, $value);
    }

    public function testIsInlineDefaultsToFalse()
    {
        $snippet = new Snippet;

        $this->assertFalse($snippet->isInline());
    }

    public function testIsInlineReflectsPartialValue()
    {
        $snippet = new Snippet;
        $this->setInline($snippet, true);

        $this->assertTrue($snippet->isInline());
    }

    public function testIsInlinePartialValueFalse()
    {
        $snippet = new Snippet;
        $this->setInline($snippet, false);

        $this->assertFalse($snippet->isInline());
    }

    public function testGetComponentSnippetInlineTrue()
    {
        $component = new class {
            public function componentDetails()
            {
                return ['name' => 'Test', 'snippetInline' => true];
            }
        };

        $this->assertTrue(ComponentHelpers::getComponentSnippetInline($component));
    }

    public function testGetComponentSnippetInlineDefaultsToFalse()
    {
        $component = new class {
            public function componentDetails()
            {
                return ['name' => 'Test'];
            }
        };

        $this->assertFalse(ComponentHelpers::getComponentSnippetInline($component));
    }
}
