<?php

use Backend\Models\UserRole;

class UserRoleTest extends PluginTestCase
{
    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    /**
     * testDuplicateRoleCopiesAttributesWithoutCode ensures the copy keeps permissions but drops the unique code.
     */
    public function testDuplicateRoleCopiesAttributesWithoutCode()
    {
        $role = new UserRole;
        $role->name = 'Project Manager';
        $role->code = 'project-manager';
        $role->description = 'Manages projects';
        $role->color_background = '#3498db';
        $role->permissions = ['general.backend' => 1, 'admins.roles' => 1];
        $role->save();

        $copy = $role->duplicateRole();

        $this->assertFalse($copy->exists);
        $this->assertEquals('Project Manager (Copy)', $copy->name);
        $this->assertNull($copy->code);
        $this->assertEquals('Manages projects', $copy->description);
        $this->assertEquals('#3498db', $copy->color_background);
        $this->assertEquals(['general.backend' => 1, 'admins.roles' => 1], $copy->permissions);

        $copy->save();

        $this->assertNotEquals($role->id, $copy->id);
        $this->assertEquals(0, $copy->users()->count());
    }

    /**
     * testDuplicateSystemRoleCopiesDefaultPermissions ensures a system role copy is editable and keeps its permissions.
     */
    public function testDuplicateSystemRoleCopiesDefaultPermissions()
    {
        $role = UserRole::where('code', UserRole::CODE_DEVELOPER)->first()
            ?: UserRole::create(['name' => 'Developer', 'code' => UserRole::CODE_DEVELOPER]);

        $role = UserRole::find($role->id);
        $this->assertNotEmpty($role->permissions);

        $copy = $role->duplicateRole();
        $copy->save();

        $copy = UserRole::find($copy->id);
        $this->assertFalse((bool) $copy->is_system);
        $this->assertEquals($role->permissions, $copy->permissions);
    }
}
