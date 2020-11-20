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
        $adminPassword = Str::random(22);

        Eloquent::unguarded(function () use ($adminPassword) {
            // Generate a random password for the seeded admin account
            $adminSeeder = new \Backend\Database\Seeds\SeedSetupAdmin;
            $adminSeeder->setDefaults([
                'password' => $adminPassword
            ]);
            $this->call($adminSeeder);
        });

        return 'The following password has been automatically generated for the "admin" account: '
            . "<fg=yellow;options=bold>${adminPassword}</>";
    }
}
