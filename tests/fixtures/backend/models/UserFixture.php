<?php

namespace October\Tests\Fixtures\Backend\Models;

use Backend\Models\User;

class UserFixture extends User
{
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->fill([
            'first_name' => 'Test',
            'last_name' => 'User',
            'login' => 'testuser',
            'email' => 'testuser@test.com',
            'password' => '',
            'activation_code' => null,
            'persist_code' => null,
            'reset_password_code' => null,
            'permissions' => null,
            'is_activated' => true,
            'role_id' => null,
            'activated_at' => null,
            'last_login' => '2019-09-27 12:00:00',
            'created_at' => '2019-09-27 12:00:00',
            'updated_at' => '2019-09-27 12:00:00',
            'deleted_at' => null,
            'is_superuser' => false
        ]);
    }

    public function asSuperUser()
    {
        $this->setAttribute('is_superuser', true);

        return $this;
    }

    public function asDeletedUser()
    {
        $this->setAttribute('deleted_at', date('Y-m-d H:i:s'));

        return $this;
    }

    public function withPermission($permission, bool $granted = true)
    {
        $currentPermissions = $this->getAttribute('permissions');

        if (is_string($permission)) {
            $permission = [
                $permission => (int) $granted
            ];
        }

        if (is_array($currentPermissions)) {
            $this->setAttribute('permissions', array_replace($currentPermissions, $permission));
        } else {
            $this->setAttribute('permissions', $permission);
        }

        return $this;
    }
}
