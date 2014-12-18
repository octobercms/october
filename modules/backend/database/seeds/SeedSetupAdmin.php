<?php namespace Backend\Database\Seeds;

use Seeder;
use Backend\Models\User;
use Backend\Models\UserGroup;

class SeedSetupAdmin extends Seeder
{

    public static $email = 'admin@domain.tld';
    public static $login = 'admin';
    public static $password = 'admin';
    public static $firstName = 'Admin';
    public static $lastName = 'Person';

    public function setDefaults($values)
    {
        if (!is_array($values)) {
            return;
        }
        foreach ($values as $attribute => $value) {
            static::$$attribute = $value;
        }
    }

    public function run()
    {
        $group = UserGroup::create([
            'name' => 'Admins',
            'code' => 'admins',
            'description' => 'Default group for administrators',
            'is_new_user_default' => true
        ]);

        $user = User::create([
            'email'                 => static::$email,
            'login'                 => static::$login,
            'password'              => static::$password,
            'password_confirmation' => static::$password,
            'first_name'            => static::$firstName,
            'last_name'             => static::$lastName,
            'permissions'           => ['superuser' => 1],
            'is_activated'          => true
        ]);

        $user->addGroup($group);
    }

}
