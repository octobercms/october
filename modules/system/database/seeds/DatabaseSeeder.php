<?php namespace System\Database\Seeds;

use Model;
use Seeder;

/**
 * DatabaseSeeder
 */
class DatabaseSeeder extends Seeder
{
    /**
     * run the database seeds.
     */
    public function run()
    {
        Model::unguard();

        $this->call(\System\Database\Seeds\SeedSetupMailLayouts::class, true);
        $this->call(\System\Database\Seeds\SeedArtisanAutoexec::class, true);
        $this->call(\System\Database\Seeds\SeedSetBuildNumber::class, true);

        Model::reguard();
    }
}
