<?php namespace Backend\Database\Seeds;

use Str;
use Seeder;
use Eloquent;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return string
     */
    public function run()
    {
        Eloquent::unguard();

        // Generate a random password for the seeded admin account
        $adminPassword = Str::random(22);
        $adminSeeder = new \Backend\Database\Seeds\SeedSetupAdmin;
        $adminSeeder->setDefaults([
            'password' => $adminPassword
        ]);
        $this->call($adminSeeder);

        return 'The following password has been automatically generated for the "admin" account: '
            . "<fg=yellow;options=bold>${adminPassword}</>";
    }
}
