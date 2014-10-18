<?php namespace System\Database\Seeds;

use Seeder;
use Eloquent;

class DatabaseSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Eloquent::unguard();

        $this->call('System\Database\Seeds\SeedSetupMailLayouts');
    }
}
