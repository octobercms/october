<?php

use Tailor\Classes\Blueprint;
use Tailor\Classes\BlueprintException;
use Tailor\Classes\BlueprintVerifier;
use Tailor\Classes\Blueprint\EntryBlueprint;

/**
 * BlueprintVerifierTest covers the source reference checks performed when a blueprint is verified.
 */
class BlueprintVerifierTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        Blueprint::setDefaultDatasource(base_path('modules/tailor/tests/fixtures/blueprints'));

        // Neutralize any ambient .env value, these tests cover the filesystem pathway
        Config::set('cms.database_templates', false);

        BlueprintVerifier::instance()->clearCache();
    }

    public function tearDown(): void
    {
        BlueprintVerifier::instance()->clearCache();
        Blueprint::resetDatasourceCache();

        parent::tearDown();
    }

    /**
     * testInvalidMixinSourceInRepeaterGroup checks a missing mixin source inside a repeater group is reported.
     */
    public function testInvalidMixinSourceInRepeaterGroup()
    {
        $blueprint = $this->makeBlueprint(<<<'YAML'
        uuid: 0b6f7c38-52a4-4d1e-9d55-6f0e0e7a1c01
        handle: Test\VerifierRepeater
        type: entry
        name: Verifier Repeater

        fields:
            content:
                label: Content
                type: repeater
                groups:
                    hero:
                        name: Hero
                        fields:
                            hero_content:
                                type: mixin
                                source: testMissingMixin
        YAML);

        $this->assertInvalidSourceReported($blueprint, 'testMissingMixin', 16);
    }

    /**
     * testInvalidMixinSourceInRepeaterGroupNestedForm checks a missing mixin source inside a nested form of a repeater group is reported.
     */
    public function testInvalidMixinSourceInRepeaterGroupNestedForm()
    {
        $blueprint = $this->makeBlueprint(<<<'YAML'
        uuid: 0b6f7c38-52a4-4d1e-9d55-6f0e0e7a1c02
        handle: Test\VerifierNestedRepeater
        type: entry
        name: Verifier Nested Repeater

        fields:
            content:
                label: Content
                type: repeater
                groups:
                    hero:
                        name: Hero
                        fields:
                            hero_details:
                                type: nestedform
                                form:
                                    fields:
                                        details_content:
                                            type: mixin
                                            source: testMissingMixin
        YAML);

        $this->assertInvalidSourceReported($blueprint, 'testMissingMixin', 20);
    }

    /**
     * testValidMixinSourceInRepeaterGroup checks an existing mixin source inside a repeater group passes verification.
     */
    public function testValidMixinSourceInRepeaterGroup()
    {
        $blueprint = $this->makeBlueprint(<<<'YAML'
        uuid: 0b6f7c38-52a4-4d1e-9d55-6f0e0e7a1c03
        handle: Test\VerifierValidRepeater
        type: entry
        name: Verifier Valid Repeater

        fields:
            content:
                label: Content
                type: repeater
                groups:
                    hero:
                        name: Hero
                        fields:
                            hero_content:
                                type: mixin
                                source: blogPostContent
                    details:
                        name: Details
                        fields:
                            details_form:
                                type: nestedform
                                form:
                                    fields:
                                        details_content:
                                            type: mixin
                                            source: blogPostContent
        YAML);

        BlueprintVerifier::instance()->verifyBlueprint($blueprint);

        $this->assertSame([], BlueprintVerifier::instance()->getWarnings());
    }

    /**
     * makeBlueprint returns an entry blueprint holding the supplied YAML content with the trailing newline of a file.
     */
    protected function makeBlueprint(string $content): EntryBlueprint
    {
        $blueprint = new EntryBlueprint;
        $blueprint->fileName = 'verifier-test.yaml';
        $blueprint->content = $content."\n";

        return $blueprint;
    }

    /**
     * assertInvalidSourceReported verifies the blueprint and checks the invalid source is reported on the expected line.
     */
    protected function assertInvalidSourceReported(EntryBlueprint $blueprint, string $source, int $lineNo): void
    {
        try {
            BlueprintVerifier::instance()->verifyBlueprint($blueprint);
        }
        catch (BlueprintException $ex) {
            $this->assertStringContainsString("Invalid source reference '{$source}'", $ex->getMessage());
            $this->assertSame($lineNo, $ex->getLine());
            return;
        }

        $this->fail("Invalid source reference '{$source}' was not reported.");
    }
}
