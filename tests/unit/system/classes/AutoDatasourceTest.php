<?php

use Cms\Classes\AutoDatasource;
use October\Rain\Database\Model;
use October\Rain\Halcyon\Datasource\DbDatasource;
use October\Rain\Halcyon\Datasource\FileDatasource;

class CmsThemeTemplateFixture extends Model
{
    protected $guarded = [];

    public $timestamps = false;

    public $table = 'cms_theme_templates';
}

class AutoDatasourceTest extends PluginTestCase
{
    /**
     * Array of model fixtures.
     *
     * @var array
     */
    public $fixtures = [];

    /**
     * AutoDatasource object.
     *
     * @var Cms\Classes\AutoDatasource;
     */
    public $datasource;

    public function setUp(): void
    {
        parent::setUp();

        $this->fixtures = [];

        // Create fixtures of template data
        $this->fixtures[] = CmsThemeTemplateFixture::create([
            'source' => 'test',
            'path' => 'partials/page-partial.htm',
            'content' => 'AutoDatasource partials/page-partial.htm',
            'file_size' => 40
        ]);

        $this->fixtures[] = CmsThemeTemplateFixture::create([
            'source' => 'test',
            'path' => 'partials/testpost/default.htm',
            'content' => 'AutoDatasource partials/testpost/default.htm',
            'file_size' => 44
        ]);

        $this->fixtures[] = CmsThemeTemplateFixture::create([
            'source' => 'test',
            'path' => 'partials/subdir/test.htm',
            'content' => 'AutoDatasource partials/subdir/test.htm',
            'file_size' => 39
        ]);

        $this->fixtures[] = CmsThemeTemplateFixture::create([
            'source' => 'test',
            'path' => 'partials/nesting/level2.htm',
            'content' => 'AutoDatasource partials/nesting/level2.htm',
            'file_size' => 42,
            'deleted_at' => '2019-01-01 00:00:00'
        ]);

        // Create AutoDatasource
        $this->datasource = new AutoDatasource([
            'database' => new DbDatasource('test', 'cms_theme_templates'),
            'filesystem' => new FileDatasource(base_path('tests/fixtures/themes/test'), App::make('files')),
        ]);
    }

    public function tearDown(): void
    {
        foreach ($this->fixtures as $fixture) {
            $fixture->delete();
        }

        parent::tearDown();
    }

    public function testSelect()
    {
        $results = collect($this->datasource->select('partials'))
            ->keyBy('fileName')
            ->toArray();

        // Should be 14 partials in filesystem (tests/fixtures/themes/test), and 1 created directly in database.
        // 1 of the filesystem partials should be marked deleted in database.
        $this->assertCount(14, $results);

        // Database-only partial should be available
        $this->assertArrayHasKey('subdir/test.htm', $results);
        $this->assertEquals(
            'AutoDatasource partials/subdir/test.htm',
            $results['subdir/test.htm']['content']
        );

        // Two filesystem partials should be overriden by database
        $this->assertEquals(
            'AutoDatasource partials/page-partial.htm',
            $results['page-partial.htm']['content']
        );
        $this->assertEquals(
            'AutoDatasource partials/testpost/default.htm',
            $results['testpost/default.htm']['content']
        );

        // One filesystem partial should be marked deleted in database
        $this->assertArrayNotHasKey('nesting/level2.htm', $results);
    }
}
