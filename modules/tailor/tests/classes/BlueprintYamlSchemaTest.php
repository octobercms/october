<?php

use JsonSchema\Validator;

/**
 * BlueprintYamlSchemaTest covers blueprint keys validated by the YAML schema used in the blueprint editor.
 */
class BlueprintYamlSchemaTest extends TestCase
{
    /**
     * @var object schema decoded from the blueprint YAML schema file
     */
    protected $schema;

    public function setUp(): void
    {
        parent::setUp();

        $this->schema = json_decode(
            file_get_contents(base_path('modules/tailor/assets/js/blueprint-yaml-schema.json')),
            false,
            512,
            JSON_THROW_ON_ERROR
        );
    }

    /**
     * testRecordFinderFieldKeys checks the recordfinder field accepts maxItems and a scope string, object or false.
     */
    public function testRecordFinderFieldKeys()
    {
        $field = [
            'type' => 'recordfinder',
            'modelClass' => 'Backend\Models\User',
            'list' => '~/modules/backend/models/user/columns.yaml',
            'nameFrom' => 'login',
            'maxItems' => 1,
        ];

        $this->assertSame([], $this->validate($field, 'RecordFinderField'));
        $this->assertSame([], $this->validate(['scope' => ['label' => 'Author']] + $field, 'RecordFinderField'));
        $this->assertSame([], $this->validate(['scope' => false] + $field, 'RecordFinderField'));
        $this->assertSame([], $this->validate(['scope' => 'applyActive'] + $field, 'RecordFinderField'));

        $this->assertNotEmpty($this->validate(['maxItems' => 'one'] + $field, 'RecordFinderField'));
        $this->assertNotEmpty($this->validate(['scope' => true] + $field, 'RecordFinderField'));
    }

    /**
     * testNavigationKeys checks the navigation definition accepts the mode values used by navigation items.
     */
    public function testNavigationKeys()
    {
        foreach (['content', 'settings', 'primary', 'secondary'] as $mode) {
            $this->assertSame([], $this->validate(['label' => 'Authors', 'mode' => $mode], 'Navigation'));
        }

        $this->assertNotEmpty($this->validate(['label' => 'Authors', 'mode' => 'sidebar'], 'Navigation'));
    }

    /**
     * testPrimaryAndExtraNavigationKeys checks a blueprint accepts the primaryNavigation and extraNavigation properties.
     */
    public function testPrimaryAndExtraNavigationKeys()
    {
        $blueprint = [
            'handle' => 'Blog\Author',
            'name' => 'Author',
            'type' => 'stream',
            'primaryNavigation' => [
                'label' => 'Blog',
                'icon' => 'icon-copy',
                'order' => 500,
            ],
            'navigation' => [
                'label' => 'Authors',
                'parent' => 'Blog\Post',
                'icon' => 'icon-user',
                'order' => 230,
            ],
            'extraNavigation' => [
                '_authors_section' => [
                    'itemType' => 'section',
                    'label' => 'Authors',
                    'order' => 210,
                ],
                '_authors_ruler' => [
                    'itemType' => 'ruler',
                    'order' => 220,
                ],
                'testimonials' => [
                    'label' => 'Testimonials',
                    'order' => 210,
                    'icon' => 'icon-group',
                    'url' => 'acme/blog/posts',
                ],
            ],
        ];

        $this->assertSame([], $this->validate($blueprint));
        $this->assertSame([], $this->validate(['primaryNavigation' => false] + $blueprint));

        $this->assertNotEmpty($this->validate(['primaryNavigation' => true] + $blueprint));
        $this->assertNotEmpty($this->validate(['primaryNavigation' => ['order' => 'first']] + $blueprint));
        $this->assertNotEmpty($this->validate(['extraNavigation' => ['_ruler' => ['itemType' => 'divider']]] + $blueprint));
    }

    /**
     * validate returns the errors for the data checked against the blueprint schema, or one of its definitions.
     */
    protected function validate(array $data, ?string $definition = null): array
    {
        $schema = $this->schema;

        if ($definition !== null) {
            $schema = (object) [
                '$ref' => '#/definitions/'.$definition,
                'definitions' => $this->schema->definitions
            ];
        }

        $value = json_decode(json_encode($data));

        $validator = new Validator;
        $validator->validate($value, $schema);

        return $validator->getErrors();
    }
}
