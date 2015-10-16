<?php

use Carbon\Carbon;
use Database\Tester\Models\CategorySimple;

class SimpleTreeModelTest extends PluginTestCase
{
    public function setUp()
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Category.php';

        $this->runPluginRefreshCommand('Database.Tester');
        $this->seedSampleTree();
    }

    public function testGetChildren()
    {
        // Not eager loaded
        $item = CategorySimple::first();
        $this->assertEquals(6, $item->getChildren()->count());

        // Eager loaded
        $item = CategorySimple::make()->getAllRoot()->first();
        $this->assertEquals(6, $item->getChildren()->count());
    }

    public function testGetAllRoot()
    {
        $items = CategorySimple::make()->getAllRoot();
        $this->assertEquals(3, $items->count());
    }

    public function testGetChildCount()
    {
        // Not eager loaded
        $item = CategorySimple::first();
        $this->assertEquals(9, $item->getChildCount());

        // Eager loaded
        $item = CategorySimple::make()->getAllRoot()->first();
        $this->assertEquals(9, $item->getChildCount());
    }

    public function testGetAllChildren()
    {
        // Not eager loaded
        $item = CategorySimple::first();
        $this->assertEquals(9, $item->getAllChildren()->count());

        // Eager loaded
        $item = CategorySimple::make()->getAllRoot()->first();
        $this->assertEquals(9, $item->getAllChildren()->count());
    }

    public function seedSampleTree()
    {
        Model::unguard();

        $webdev = CategorySimple::create([
            'name' => 'Web development'
        ]);

        $webdev->children()->create(['name' => 'HTML5']);
        $webdev->children()->create(['name' => 'CSS3']);
        $webdev->children()->create(['name' => 'jQuery']);
        $webdev->children()->create(['name' => 'Bootstrap']);
        $webdev->children()->create(['name' => 'Laravel']);
        $october = $webdev->children()->create(['name' => 'OctoberCMS']);
        $october->children()->create(['name' => 'September']);
        $october->children()->create(['name' => 'October']);
        $october->children()->create(['name' => 'November']);

        $mobdev = CategorySimple::create([
            'name' => 'Mobile development'
        ]);

        $mobdev->children()->create(['name' => 'iOS']);
        $mobdev->children()->create(['name' => 'iPhone']);
        $mobdev->children()->create(['name' => 'iPad']);
        $mobdev->children()->create(['name' => 'Android']);

        $design = CategorySimple::create([
            'name' => 'Graphic design'
        ]);

        $design->children()->create(['name' => 'Photoshop']);
        $design->children()->create(['name' => 'Illustrator']);
        $design->children()->create(['name' => 'Fireworks']);

        Model::reguard();
    }
}
