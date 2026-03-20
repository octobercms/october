<?php namespace System\Database\Seeds;

use Seeder;
use System\Models\SiteGroup;
use System\Models\SiteDefinition;

/**
 * SeedSetupPrimarySite
 */
class SeedSetupPrimarySite extends Seeder
{
    public function run()
    {
        SiteGroup::syncDefaultGroup();

        SiteDefinition::syncPrimarySite();
    }
}
