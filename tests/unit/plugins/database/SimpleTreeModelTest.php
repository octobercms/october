<?php

use Carbon\Carbon;
use Database\Tester\Models\CategorySimple;

class SimpleTreeModelTest extends PluginTestCase
{
    public function setUp() : void
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/database/tester/models/Category.php';

        $this->runPluginRefreshCommand('Database.Tester');
        $this->seedSampleTree();
    }

    public function testGetNested()
    {
        $items = CategorySimple::getNested();

        // Eager loaded
        $items->each(function ($item) {
            $this->assertTrue($item->relationLoaded('children'));
        });

        $this->assertEquals(3, $items->count());
    }

    public function testGetAllRoot()
    {
        $items = CategorySimple::getAllRoot();

        // Not eager loaded
        $items->each(function ($item) {
            $this->assertFalse($item->relationLoaded('children'));
        });

        $this->assertEquals(3, $items->count());
    }

    public function testGetChildren()
    {
        // Not eager loaded
        $item = CategorySimple::first();
        $this->assertFalse($item->relationLoaded('children'));
        $this->assertEquals(6, $item->getChildren()->count());

        // Not eager loaded
        $item = CategorySimple::getAllRoot()->first();
        $this->assertFalse($item->relationLoaded('children'));
        $this->assertEquals(6, $item->getChildren()->count());

        // Eager loaded
        $item = CategorySimple::getNested()->first();
        $this->assertTrue($item->relationLoaded('children'));
        $this->assertEquals(6, $item->getChildren()->count());
    }

    public function testGetChildCount()
    {
        // Not eager loaded
        $item = CategorySimple::first();
        $this->assertFalse($item->relationLoaded('children'));
        $this->assertEquals(9, $item->getChildCount());

        // Not eager loaded
        $item = CategorySimple::getAllRoot()->first();
        $this->assertFalse($item->relationLoaded('children'));
        $this->assertEquals(9, $item->getChildCount());

        // Eager loaded
        $item = CategorySimple::getNested()->first();
        $this->assertTrue($item->relationLoaded('children'));
        $this->assertEquals(9, $item->getChildCount());
    }

    public function testGetAllChildren()
    {
        // Not eager loaded
        $item = CategorySimple::first();
        $this->assertFalse($item->relationLoaded('children'));
        $this->assertEquals(9, $item->getAllChildren()->count());

        // Not eager loaded
        $item = CategorySimple::getAllRoot()->first();
        $this->assertFalse($item->relationLoaded('children'));
        $this->assertEquals(9, $item->getAllChildren()->count());

        // Eager loaded
        $item = CategorySimple::getNested()->first();
        $this->assertTrue($item->relationLoaded('children'));
        $this->assertEquals(9, $item->getAllChildren()->count());
    }

    public function testListsNested()
    {
        $array = CategorySimple::listsNested('name', 'id');
        $this->assertEquals([
            1 => 'Web development',
            2 => '&nbsp;&nbsp;&nbsp;HTML5',
            3 => '&nbsp;&nbsp;&nbsp;CSS3',
            4 => '&nbsp;&nbsp;&nbsp;jQuery',
            5 => '&nbsp;&nbsp;&nbsp;Bootstrap',
            6 => '&nbsp;&nbsp;&nbsp;Laravel',
            7 => '&nbsp;&nbsp;&nbsp;OctoberCMS',
            8 => '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;September',
            9 => '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;October',
            10 => '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;November',
            11 => 'Mobile development',
            12 => '&nbsp;&nbsp;&nbsp;iOS',
            13 => '&nbsp;&nbsp;&nbsp;iPhone',
            14 => '&nbsp;&nbsp;&nbsp;iPad',
            15 => '&nbsp;&nbsp;&nbsp;Android',
            16 => 'Graphic design',
            17 => '&nbsp;&nbsp;&nbsp;Photoshop',
            18 => '&nbsp;&nbsp;&nbsp;Illustrator',
            19 => '&nbsp;&nbsp;&nbsp;Fireworks'
        ], $array);

        $array = CategorySimple::listsNested('name', 'id', '--');
        $this->assertEquals([
            1 => 'Web development',
            2 => '--HTML5',
            3 => '--CSS3',
            4 => '--jQuery',
            5 => '--Bootstrap',
            6 => '--Laravel',
            7 => '--OctoberCMS',
            8 => '----September',
            9 => '----October',
            10 => '----November',
            11 => 'Mobile development',
            12 => '--iOS',
            13 => '--iPhone',
            14 => '--iPad',
            15 => '--Android',
            16 => 'Graphic design',
            17 => '--Photoshop',
            18 => '--Illustrator',
            19 => '--Fireworks'
        ], $array);

        $array = CategorySimple::listsNested('id', 'name', '**');
        $this->assertEquals([
            'Web development' => '1',
            'HTML5' => '**2',
            'CSS3' => '**3',
            'jQuery' => '**4',
            'Bootstrap' => '**5',
            'Laravel' => '**6',
            'OctoberCMS' => '**7',
            'September' => '****8',
            'October' => '****9',
            'November' => '****10',
            'Mobile development' => '11',
            'iOS' => '**12',
            'iPhone' => '**13',
            'iPad' => '**14',
            'Android' => '**15',
            'Graphic design' => '16',
            'Photoshop' => '**17',
            'Illustrator' => '**18',
            'Fireworks' => '**19'
        ], $array);
    }

    public function testListsNestedUnknownColumn()
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Column mismatch in listsNested method');

        CategorySimple::listsNested('custom_name', 'id');
    }

    public function testListsNestedFromCollection()
    {
        $array = CategorySimple::get()->listsNested('custom_name', 'id', '...');

        $this->assertEquals([
            1 => 'Web development (#1)',
            2 => '...HTML5 (#2)',
            3 => '...CSS3 (#3)',
            4 => '...jQuery (#4)',
            5 => '...Bootstrap (#5)',
            6 => '...Laravel (#6)',
            7 => '...OctoberCMS (#7)',
            8 => '......September (#8)',
            9 => '......October (#9)',
            10 => '......November (#10)',
            11 => 'Mobile development (#11)',
            12 => '...iOS (#12)',
            13 => '...iPhone (#13)',
            14 => '...iPad (#14)',
            15 => '...Android (#15)',
            16 => 'Graphic design (#16)',
            17 => '...Photoshop (#17)',
            18 => '...Illustrator (#18)',
            19 => '...Fireworks (#19)'
        ], $array);
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
