<?php namespace Backend\Classes;

use Validator;
use ValidationException;
use Backend\Models\User;

/**
 * UserFactory validates fields and creates a new backend user.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class UserFactory
{
    /**
     * create validates the given fields and inserts a new backend user
     */
    public static function create(array $data, bool $createDefaultAdmin = false): User
    {
        $rules = [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|between:6,255|email|unique:backend_users',
            'login' => 'required|between:2,255|unique:backend_users',
            'password' => 'required:create|between:4,255|confirmed',
            'password_confirmation' => 'required_with:password|between:4,255'
        ];

        $validation = Validator::make($data, $rules, [], [
            'first_name' => __('First name'),
            'last_name' => __('Last name'),
            'email' => __('Email'),
            'login' => __('Username'),
            'password' => __('Password'),
            'password_confirmation' => __('Confirm Password'),
        ]);

        if ($validation->fails()) {
            throw new ValidationException($validation);
        }

        (new User)->validatePasswordPolicy($data['password'] ?? '');

        if ($createDefaultAdmin) {
            return User::createDefaultAdmin($data);
        }

        $user = new User;
        $user->fill($data);
        $user->save();

        return $user;
    }
}
