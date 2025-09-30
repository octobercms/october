<?php

use System\Classes\SiteManager;
use System\Classes\SiteCollection;
use System\Models\SiteDefinition;

class SiteManagerTest extends TestCase
{
    /**
     * testHostNameExactMatch
     */
    public function testHostNameExactMatch()
    {
        $fixture = Model::unguarded(function() {
            return new SiteCollection([
                new SiteDefinition([
                    'id' => 1,
                    'name' => 'Primary Site',
                    'code' => 'primary',
                    'is_primary' => true,
                    'is_enabled' => true,
                    'is_enabled_edit' => true,
                    'is_host_restricted' => true,
                    'allow_hosts' => [
                        ['hostname' => 'octobercms.test']
                    ]
                ]),
                new SiteDefinition([
                    'id' => 2,
                    'name' => 'English Site',
                    'code' => 'english',
                    'is_primary' => false,
                    'is_enabled' => true,
                    'is_enabled_edit' => true,
                    'is_host_restricted' => true,
                    'allow_hosts' => [
                        ['hostname' => 'en.octobercms.test'],
                        ['hostname' => '*.en.octobercms.test'],
                    ]
                ])
            ]);
        });

        // Testing higher qualified hostname
        $sites = $fixture->filter(function($site) {
            return $site->matchesHostname('en.octobercms.test');
        });

        $this->assertEquals(1, $sites->count());
        $this->assertEquals('english', $sites->first()->code);

        $manager = SiteManager::instance();
        $this->setProtectedProperty($manager, 'sites', $fixture);

        // Testing access to a hostname guarded site
        $site = $manager->getSiteFromRequest('https://bacon-cms.tld/', '/');
        $this->assertNull($site);

        // Remove guard and try again
        $primarySite = $manager->getPrimarySite();
        $primarySite->is_host_restricted = false;

        // Testing access to a hostname guarded site
        $site = $manager->getSiteFromRequest('https://bacon-cms.tld/', '/');
        $this->assertEquals(1, $site->id);
    }

    /**
     * testHostNameFallbackMatch
     */
    public function testHostNameFallbackMatch()
    {
        $fixture = Model::unguarded(function() {
            return new SiteCollection([
                new SiteDefinition([
                    'id' => 1,
                    'name' => 'Primary Site',
                    'code' => 'primary',
                    'is_primary' => true,
                    'is_enabled' => true,
                    'is_enabled_edit' => true,
                    'is_custom_url' => true,
                    'app_url' => 'https://bacon.octobercms.tld',
                    'allow_hosts' => [],
                ]),
                new SiteDefinition([
                    'id' => 2,
                    'name' => 'English Site',
                    'code' => 'english',
                    'is_primary' => false,
                    'is_enabled' => true,
                    'is_enabled_edit' => true,
                    'is_custom_url' => true,
                    'app_url' => 'https://eggs.octobercms.tld',
                    'is_prefixed' => true,
                    'route_prefix' => '/en',
                    'allow_hosts' => [],
                ]),
                new SiteDefinition([
                    'id' => 3,
                    'name' => 'French Site',
                    'code' => 'french',
                    'is_primary' => false,
                    'is_enabled' => true,
                    'is_enabled_edit' => true,
                    'is_custom_url' => true,
                    'app_url' => 'https://eggs.octobercms.tld',
                    'is_prefixed' => true,
                    'route_prefix' => '/fr',
                    'allow_hosts' => [],
                ])
            ]);
        });

        $manager = SiteManager::instance();
        $this->setProtectedProperty($manager, 'sites', $fixture);

        $site = $manager->getSiteFromRequest('https://bacon.octobercms.tld/', '/');
        $this->assertEquals(1, $site->id);
        $this->assertFalse($site->isFallbackMatch);

        $site = $manager->getSiteFromRequest('https://eggs.octobercms.tld/', '/en');
        $this->assertEquals(2, $site->id);
        $this->assertFalse($site->isFallbackMatch);

        $site = $manager->getSiteFromRequest('https://eggs.octobercms.tld/', '/fr');
        $this->assertEquals(3, $site->id);
        $this->assertFalse($site->isFallbackMatch);

        $site = $manager->getSiteFromRequest('https://eggs.octobercms.tld/', '');
        $this->assertTrue($site->isFallbackMatch);
        $this->assertTrue($site->is_prefixed);
    }
}
