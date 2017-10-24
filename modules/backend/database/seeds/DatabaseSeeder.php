<?php namespace Backend\Database\Seeds;

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

        $this->call('Backend\Database\Seeds\SeedSetupAdmin');
    }
}
