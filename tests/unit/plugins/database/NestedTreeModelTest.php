<?php

use Carbon\Carbon;
use Database\Tester\Models\CategoryNested;

class NestedTreeModelTest extends PluginTestCase
{
    public function setUp()
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Category.php';

        $this->runPluginRefreshCommand('Database.Tester');
        $this->seedSampleTree();
    }

    public function testGetNested()
    {
        $items = CategoryNested::getNested();

        // Eager loaded
        $items->each(function ($item) {
            $this->assertTrue($item->relationLoaded('children'));
        });

        $this->assertEquals(2, $items->count());
    }

    public function testGetAllRoot()
    {
        $items = CategoryNested::getAllRoot();

        // Not eager loaded
        $items->each(function ($item) {
            $this->assertFalse($item->relationLoaded('children'));
        });

        $this->assertEquals(2, $items->count());
    }

    public function testListsNested()
    {
        $array = CategoryNested::listsNested('name', 'id');
        $this->assertEquals([
            1 => 'Category Orange',
            2 => '&nbsp;&nbsp;&nbsp;Autumn Leaves',
            3 => '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;September',
            4 => '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;October',
            5 => '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;November',
            6 => '&nbsp;&nbsp;&nbsp;Summer Breeze',
            7 => 'Category Green',
            8 => '&nbsp;&nbsp;&nbsp;Winter Snow',
            9 => '&nbsp;&nbsp;&nbsp;Spring Trees'
        ], $array);

        $array = CategoryNested::listsNested('name', 'id', '--');
        $this->assertEquals([
            1 => 'Category Orange',
            2 => '--Autumn Leaves',
            3 => '----September',
            4 => '----October',
            5 => '----November',
            6 => '--Summer Breeze',
            7 => 'Category Green',
            8 => '--Winter Snow',
            9 => '--Spring Trees'
        ], $array);

        $array = CategoryNested::listsNested('description', 'name', '**');
        $this->assertEquals([
            'Category Orange' => 'A root level test category',
            'Autumn Leaves' => '**Disccusion about the season of falling leaves.',
            'September' => '****The start of the fall season.',
            'October' => '****The middle of the fall season.',
            'November' => '****The end of the fall season.',
            'Summer Breeze' => '**Disccusion about the wind at the ocean.',
            'Category Green' => 'A root level test category',
            'Winter Snow' => '**Disccusion about the frosty snow flakes.',
            'Spring Trees' => '**Disccusion about the blooming gardens.'
        ], $array);
    }

    public function testListsNestedFromCollection()
    {
        $array = CategoryNested::get()->listsNested('custom_name', 'id', '...');
        $this->assertEquals([
            1 => 'Category Orange (#1)',
            2 => '...Autumn Leaves (#2)',
            3 => '......September (#3)',
            4 => '......October (#4)',
            5 => '......November (#5)',
            6 => '...Summer Breeze (#6)',
            7 => 'Category Green (#7)',
            8 => '...Winter Snow (#8)',
            9 => '...Spring Trees (#9)'
        ], $array);
    }

    public function seedSampleTree()
    {
        Model::unguard();

        $orange = CategoryNested::create([
            'name' => 'Category Orange',
            'description' => 'A root level test category',
        ]);

        $autumn = $orange->children()->create([
            'name' => 'Autumn Leaves',
            'description' => 'Disccusion about the season of falling leaves.'
        ]);

        $autumn->children()->create([
            'name' => 'September',
            'description' => 'The start of the fall season.'
        ]);

        $october = $autumn->children()->create([
            'name' => 'October',
            'description' => 'The middle of the fall season.'
        ]);

        $autumn->children()->create([
            'name' => 'November',
            'description' => 'The end of the fall season.'
        ]);

        $orange->children()->create([
            'name' => 'Summer Breeze',
            'description' => 'Disccusion about the wind at the ocean.'
        ]);

        $green = CategoryNested::create([
            'name' => 'Category Green',
            'description' => 'A root level test category',
        ]);

        $green->children()->create([
            'name' => 'Winter Snow',
            'description' => 'Disccusion about the frosty snow flakes.'
        ]);

        $green->children()->create([
            'name' => 'Spring Trees',
            'description' => 'Disccusion about the blooming gardens.'
        ]);

        Model::reguard();
    }
}
