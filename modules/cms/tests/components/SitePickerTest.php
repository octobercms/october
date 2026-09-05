<?php

use Cms\Classes\Theme;
use Cms\Classes\Controller;
use Cms\Components\SitePicker;
use System\Classes\SiteCollection;
use System\Models\SiteDefinition;

class SitePickerTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        // A memoized site list, as the manager holds on an installed site
        self::setProtectedProperty(Site::getFacadeRoot(), 'sites', Model::unguarded(function () {
            return new SiteCollection([
                new SiteDefinition([
                    'id' => 1,
                    'name' => 'Primary',
                    'code' => 'primary',
                    'is_primary' => true,
                    'is_enabled' => true,
                    'is_enabled_edit' => true,
                ]),
            ]);
        }));
    }

    public function testPageSitesDoesNotLeakUrlOverrideIntoSharedSites()
    {
        $picker = new SitePicker;
        self::setProtectedProperty($picker, 'controller', new Controller(Theme::load('test')));

        $sites = $picker->pageSites('index');

        $this->assertCount(1, $sites);
        $this->assertNotNull(self::getProtectedProperty($sites->first(), 'urlOverride'));
        $this->assertNull(self::getProtectedProperty(Site::listEnabled()->first(), 'urlOverride'));
    }
}
