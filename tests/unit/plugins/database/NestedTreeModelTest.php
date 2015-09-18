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

    public function testGetAllRoot()
    {
        $items = CategoryNested::make()->getAllRoot();
        $this->assertEquals(2, $items->count());
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
