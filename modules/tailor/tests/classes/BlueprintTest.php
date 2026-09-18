<?php

use Tailor\Classes\Blueprint;
use Tailor\Classes\Blueprint\EntryBlueprint;
use Tailor\Classes\Blueprint\GlobalBlueprint;
use Tailor\Classes\Blueprint\MixinBlueprint;
use Tailor\Classes\Blueprint\SingleBlueprint;
use Tailor\Classes\Blueprint\StreamBlueprint;
use Tailor\Classes\Blueprint\StructureBlueprint;

class BlueprintTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        Blueprint::setDefaultDatasource(base_path('modules/tailor/tests/fixtures/blueprints'));
    }

    public function testLoadBlueprints()
    {
        $this->markTestSkipped('Needs refactor to isolate blueprint paths');
        return;

        $blueprint = Blueprint::load('blog/posts.yaml');

        $this->assertInstanceOf(\Tailor\Classes\Blueprint\EntryBlueprint::class, $blueprint);
        $this->assertEquals('Posts', $blueprint->name);
        $this->assertEquals('blog', $blueprint->handle);
        $this->assertEquals('blog/posts.yaml', $blueprint->fileName);
    }

    public function testListBlueprints()
    {
        $this->markTestSkipped('Needs refactor to isolate blueprint paths');
        return;

        $blueprints = Blueprint::listInProject();
        $this->assertArrayIsEqual([
            'author.yaml',
            'blog/authors.yaml',
            'blog/categories.yaml',
            'blog/config.yaml',
            'blog/post-content.yaml',
            'blog/posts.yaml',
            'category.yaml',
            'landing/blockbuilder.yaml',
            'landing/blockbuilder/call-to-action.yaml',
            'landing/blockbuilder/carousel.yaml',
            'landing/blockbuilder/common.yaml',
            'landing/blockbuilder/compare-table.yaml',
            'landing/blockbuilder/feature-table.yaml',
            'landing/blockbuilder/featurette.yaml',
            'landing/blockbuilder/headline-items.yaml',
            'landing/blockbuilder/headline.yaml',
            'landing/blockbuilder/pricing-table.yaml',
            'landing/landing-page.yaml',
            'october-test/collections/basic.yaml',
            'october-test/globals/basic.yaml',
            'october-test/mixins/collection-field.yaml',
            'october-test/mixins/entry-field.yaml',
            'october-test/sections/feed-basic.yaml',
            'october-test/sections/solo-basic.yaml',
            'october-test/sections/tree-basic.yaml',
            'post-content.yaml',
            'post.yaml',
            'wiki/wiki.yaml'
        ], $blueprints->pluck('fileName')->all());

        $blueprints = EntryBlueprint::listInProject();
        $this->assertArrayIsEqual([
            'author.yaml',
            'blog/authors.yaml',
            'blog/categories.yaml',
            'blog/posts.yaml',
            'category.yaml',
            'landing/landing-page.yaml',
            'post.yaml',
            'wiki/wiki.yaml'
        ], $blueprints->pluck('fileName')->all());

        $blueprints = GlobalBlueprint::listInProject();
        $this->assertArrayIsEqual([
            "blog/config.yaml"
        ], $blueprints->pluck('fileName')->all());

        $blueprints = MixinBlueprint::listInProject();
        $this->assertArrayIsEqual([
            "blog/post-content.yaml",
            "landing/blockbuilder/call-to-action.yaml",
            "landing/blockbuilder/carousel.yaml",
            "landing/blockbuilder/common.yaml",
            "landing/blockbuilder/compare-table.yaml",
            "landing/blockbuilder/feature-table.yaml",
            "landing/blockbuilder/featurette.yaml",
            "landing/blockbuilder/headline-items.yaml",
            "landing/blockbuilder/headline.yaml",
            "landing/blockbuilder/pricing-table.yaml",
            "landing/blockbuilder.yaml",
            "post-content.yaml"
        ], $blueprints->pluck('fileName')->all());

        $blueprints = SingleBlueprint::listInProject();
        $this->assertArrayIsEqual([
            "landing/landing-page.yaml"
        ], $blueprints->pluck('fileName')->all());

        $blueprints = StreamBlueprint::listInProject();
        $this->assertArrayIsEqual([
            "blog/posts.yaml",
            "post.yaml"
        ], $blueprints->pluck('fileName')->all());

        $blueprints = StructureBlueprint::listInProject();
        $this->assertArrayIsEqual([
            "category.yaml",
            "wiki/wiki.yaml"
        ], $blueprints->pluck('fileName')->all());
    }

    /**
     * testPermissionCodeName checks the default and custom permission code generation
     */
    public function testPermissionCodeName()
    {
        $blueprint = new EntryBlueprint(['uuid' => '6947ff28-b660-47d7-9240-24ca6d58aeae']);
        $this->assertEquals('tailor.entry.6947ff28b66047d7924024ca6d58aeae', $blueprint->getPermissionCodeName());
        $this->assertEquals('tailor.entry.6947ff28b66047d7924024ca6d58aeae.create', $blueprint->getPermissionCodeName('create'));

        $blueprint = new EntryBlueprint([
            'uuid' => '6947ff28-b660-47d7-9240-24ca6d58aeae',
            'permissions' => ['code' => 'blog_tags'],
        ]);
        $this->assertEquals('tailor.entry.blog_tags', $blueprint->getPermissionCodeName());
        $this->assertEquals('tailor.entry.blog_tags.delete', $blueprint->getPermissionCodeName('delete'));

        $blueprint = new GlobalBlueprint([
            'uuid' => '03ea35df-c3b6-4a35-b21c-979c9cf372a2',
            'permissions' => ['code' => 'blog_config'],
        ]);
        $this->assertEquals('tailor.global.blog_config', $blueprint->getPermissionCodeName());
    }

    public function testAssignUuid()
    {
        $this->markTestSkipped('Needs refactor to isolate blueprint paths');
        return;

        $fixturesPath = base_path('modules/tailor/tests/fixtures/blueprints/blog/comments.stub');
        $tempBlueprint = base_path('modules/tailor/tests/fixtures/blueprints/blog/comments.yaml');
        @unlink($tempBlueprint);

        try {
            copy($fixturesPath, $tempBlueprint);

            $blueprint = Blueprint::load('blog/comments.yaml');
            $this->assertEquals('Comments', $blueprint->name);
            $this->assertEquals('blog/comments.yaml', $blueprint->fileName);
            $this->assertNull($blueprint->uuid);
            $blueprint->save();

            $blueprint = Blueprint::load('blog/comments.yaml');
            $this->assertNotNull($blueprint->uuid);
        }
        finally {
            @unlink($tempBlueprint);
        }
    }

    /**
     * assertArrayIsEqual
     */
    protected function assertArrayIsEqual($arr, $exp)
    {
        sort($arr);
        sort($exp);

        $this->assertEquals($exp, $arr);
    }
}
