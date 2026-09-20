<?php

use Backend\Models\User;
use Backend\Models\UserGroup;
use Backend\Models\UserRole;
use Illuminate\Support\Facades\Artisan;

/**
 * OctoberAdminTest
 */
class OctoberAdminTest extends PluginTestCase
{
    protected function commandOptions(array $overrides = []): array
    {
        return array_merge([
            '--first-name' => 'Admin',
            '--last-name' => 'Person',
            '--email' => 'admin@example.com',
            '--login' => 'admin',
            '--password' => 'secret',
        ], $overrides);
    }

    public function testCommandCreatesBackendUser()
    {
        $exitCode = Artisan::call('october:admin', $this->commandOptions());

        $this->assertEquals(0, $exitCode);
        $this->assertStringContainsString('Administrator created successfully', Artisan::output());

        $user = User::where('login', 'admin')->first();
        $this->assertNotNull($user);
        $this->assertEquals('Admin', $user->first_name);
        $this->assertEquals('Person', $user->last_name);
        $this->assertEquals('admin@example.com', $user->email);
        $this->assertFalse((bool) $user->is_superuser);
    }

    public function testCommandCreatesADefaultAdmin()
    {
        $exitCode = Artisan::call('october:admin', $this->commandOptions([
            '--default' => true,
        ]));

        $this->assertEquals(0, $exitCode);

        $user = User::where('login', 'admin')->first();
        $developerRole = UserRole::where('code', UserRole::CODE_DEVELOPER)->first();
        $ownersGroup = UserGroup::where('code', UserGroup::CODE_OWNERS)->first();

        $this->assertNotNull($user);
        $this->assertTrue((bool) $user->is_superuser);
        $this->assertTrue((bool) $user->is_activated);
        $this->assertEquals($developerRole->id, $user->role_id);
        $this->assertTrue($user->groups->contains($ownersGroup));
    }

    public function testCommandReturnsErrorOnInvalidInput()
    {
        $exitCode = Artisan::call('october:admin', $this->commandOptions([
            '--email' => 'not-an-email',
        ]));

        $this->assertEquals(1, $exitCode);
        $this->assertEquals(0, User::count());
    }

    public function testCommandUsesPasswordConfirmationOption()
    {
        $exitCode = Artisan::call('october:admin', $this->commandOptions([
            '--password-confirmation' => 'different',
        ]));

        $this->assertEquals(1, $exitCode);
        $this->assertEquals(0, User::count());
    }
}
