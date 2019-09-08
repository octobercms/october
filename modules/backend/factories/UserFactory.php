<?php
use Faker\Generator as Faker;
use Illuminate\Support\Facades\Hash;

$factory->define(Backend\Models\User::class, function (Faker $faker) {
    $hashedPassword = Hash::make($faker->password());

    return [
        'first_name' => $faker->firstName,
        'last_name' => $faker->lastName,
        'login' => $faker->userName,
        'email' => $faker->unique()->safeEmail,
        'password' => $hashedPassword,
        'password_confirmation' => $hashedPassword,
        'activation_code' => null,
        'persist_code' => null,
        'reset_password_code' => null,
        'permissions' => null,
        'is_activated' => true,
        'role_id' => null,
        'activated_at' => null,
        'last_login' => $faker->dateTimeThisMonth,
        'created_at' => $faker->dateTimeThisMonth,
        'updated_at' => $faker->dateTimeThisMonth,
        'deleted_at' => null,
        'is_superuser' => false
    ];
});

$factory->state(Backend\Models\User::class, 'superuser', [
    'is_superuser' => true
]);

$factory->state(Backend\Models\User::class, 'deleted', function ($faker) {
    return [
        'deleted_at' => $faker->dateTimeThisMonth
    ];
});
