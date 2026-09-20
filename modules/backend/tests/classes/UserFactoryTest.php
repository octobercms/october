<?php

use Backend\Classes\UserFactory;
use Backend\Models\User;
use Backend\Models\UserGroup;
use Backend\Models\UserRole;
use October\Rain\Exception\ValidationException;

/**
 * UserFactoryTest
 */
class UserFactoryTest extends PluginTestCase
{
    protected function validUserData(array $overrides = []): array
    {
        return array_merge([
            'first_name' => 'Admin',
            'last_name' => 'Person',
            'email' => 'admin@example.com',
            'login' => 'admin',
            'password' => 'secret',
            'password_confirmation' => 'secret',
        ], $overrides);
    }

    public function testCreateInsertsABackendUser()
    {
        $user = UserFactory::create($this->validUserData());

        $this->assertInstanceOf(User::class, $user);
        $this->assertTrue($user->exists);
        $this->assertEquals('Admin', $user->first_name);
        $this->assertEquals('Person', $user->last_name);
        $this->assertEquals('admin@example.com', $user->email);
        $this->assertEquals('admin', $user->login);
        $this->assertFalse((bool) $user->is_superuser);
        $this->assertEquals(1, User::count());
    }

    public function testCreateDefaultAdminAssignsSuperuserRoleAndOwnersGroup()
    {
        $user = UserFactory::create($this->validUserData(), createDefaultAdmin: true);

        $developerRole = UserRole::where('code', UserRole::CODE_DEVELOPER)->first();
        $ownersGroup = UserGroup::where('code', UserGroup::CODE_OWNERS)->first();

        $this->assertTrue((bool) $user->is_superuser);
        $this->assertTrue((bool) $user->is_activated);
        $this->assertEquals($developerRole->id, $user->role_id);
        $this->assertTrue($user->groups->contains($ownersGroup));
    }

    public function testCreateRejectsInvalidEmail()
    {
        $this->expectException(ValidationException::class);

        UserFactory::create($this->validUserData(['email' => 'not-an-email']));
    }

    public function testCreateRejectsMismatchedPassword()
    {
        $this->expectException(ValidationException::class);

        UserFactory::create($this->validUserData([
            'password' => 'secret',
            'password_confirmation' => 'different',
        ]));
    }

    public function testCreateRejectsMissingRequiredFields()
    {
        $this->expectException(ValidationException::class);

        UserFactory::create([
            'email' => 'admin@example.com',
            'login' => 'admin',
            'password' => 'secret',
            'password_confirmation' => 'secret',
        ]);
    }

    public function testCreateRejectsDuplicateLogin()
    {
        UserFactory::create($this->validUserData());

        $this->expectException(ValidationException::class);

        UserFactory::create($this->validUserData([
            'email' => 'other@example.com',
            'login' => 'admin',
        ]));
    }

    public function testCreateRejectsPasswordThatFailsPolicy()
    {
        Config::set('backend.password_policy.min_length', 12);

        $this->expectException(ValidationException::class);

        UserFactory::create($this->validUserData());
    }
}
