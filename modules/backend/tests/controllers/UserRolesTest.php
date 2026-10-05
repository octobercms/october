<?php

use Backend\Models\UserRole;
use Backend\Controllers\UserRoles;
use October\Rain\Exception\ValidationException;

require_once __DIR__.'/../fixtures/models/BackendUserFixture.php';

class UserRolesTest extends PluginTestCase
{
    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    /**
     * testDuplicatePrefillsFormFromSourceRole ensures the duplicate page opens the create form with the source role values.
     */
    public function testDuplicatePrefillsFormFromSourceRole()
    {
        $source = $this->makeRole('Project Manager', ['general.backend' => 1, 'admins.roles' => 1]);

        $controller = $this->makeDuplicateController($source);
        $controller->duplicate($source->id);

        $model = $controller->formGetModel();

        $this->assertNull($controller->getFatalError());
        $this->assertFalse($model->exists);
        $this->assertEquals('create', $controller->formGetContext());
        $this->assertEquals('Project Manager (Copy)', $model->name);
        $this->assertEquals(['general.backend' => 1, 'admins.roles' => 1], $model->permissions);
    }

    /**
     * testDuplicateSaveCreatesIndependentRole ensures saving creates a new role and leaves the source role untouched.
     */
    public function testDuplicateSaveCreatesIndependentRole()
    {
        $source = $this->makeRole('Project Manager', ['general.backend' => 1, 'admins.roles' => 1]);

        $controller = $this->makeDuplicateController($source);
        $this->mergePostback(['UserRole' => [
            'name' => 'Sales Assistant',
            'code' => '',
            'permissions' => ['general.backend' => 1, 'admins.roles' => 0, 'media.library' => 1],
        ]]);

        $controller->duplicate_onSave($source->id);

        $copy = UserRole::where('name', 'Sales Assistant')->first();
        $this->assertNotNull($copy);
        $this->assertNotEquals($source->id, $copy->id);
        $this->assertEmpty($copy->code);
        $this->assertEquals(['general.backend' => 1, 'media.library' => 1], $copy->permissions);
        $this->assertEquals(0, $copy->users()->count());

        $source = UserRole::find($source->id);
        $this->assertEquals('Project Manager', $source->name);
        $this->assertEquals(['general.backend' => 1, 'admins.roles' => 1], $source->permissions);
    }

    /**
     * testDuplicateSaveRejectsExistingName ensures the copy cannot reuse the name of another role.
     */
    public function testDuplicateSaveRejectsExistingName()
    {
        $source = $this->makeRole('Project Manager', ['general.backend' => 1]);

        $controller = $this->makeDuplicateController($source);
        $this->mergePostback(['UserRole' => [
            'name' => 'Project Manager',
            'code' => '',
            'permissions' => ['general.backend' => 1],
        ]]);

        try {
            $controller->duplicate_onSave($source->id);
            $this->fail('Expected ValidationException was not thrown');
        }
        catch (ValidationException $ex) {
            $this->assertTrue($ex->getErrors()->has('name'));
        }

        $this->assertEquals(1, UserRole::where('name', 'Project Manager')->count());
    }

    /**
     * testDuplicateRequiresManageableSourceRole ensures admins can only duplicate roles ranked below their own.
     */
    public function testDuplicateRequiresManageableSourceRole()
    {
        $higherRole = $this->makeRole('Director', [], 40);
        $ownRole = $this->makeRole('Manager', [], 50);
        $lowerRole = $this->makeRole('Assistant', [], 60);

        $user = new BackendUserFixture;
        $user->role_id = $ownRole->id;

        $controller = $this->makeDuplicateController($lowerRole, $user);
        $controller->duplicate($lowerRole->id);
        $this->assertEquals('Assistant (Copy)', $controller->formGetModel()->name);

        $controller = $this->makeDuplicateController($higherRole, $user);
        $controller->duplicate($higherRole->id);
        $this->assertNotNull($controller->getFatalError());

        $this->mergePostback(['UserRole' => ['name' => 'Director Copy', 'code' => '']]);

        try {
            $controller->duplicate_onSave($higherRole->id);
            $this->fail('Expected ApplicationException was not thrown');
        }
        catch (ApplicationException) {
        }

        $this->assertEquals(0, UserRole::where('name', 'Director Copy')->count());
    }

    /**
     * makeDuplicateController returns a controller on the duplicate action for a source role.
     */
    protected function makeDuplicateController(UserRole $source, ?BackendUserFixture $user = null): UserRoles
    {
        $this->actingAs($user ?: (new BackendUserFixture)->asSuperUser());

        $controller = new UserRoles;
        self::setProtectedProperty($controller, 'action', 'duplicate');
        self::setProtectedProperty($controller, 'params', [$source->id]);

        return $controller;
    }

    /**
     * makeRole saves a role with permissions and an optional rank.
     */
    protected function makeRole(string $name, array $permissions, ?int $sortOrder = null): UserRole
    {
        $role = new UserRole;
        $role->name = $name;
        $role->permissions = $permissions;
        $role->save();

        if ($sortOrder !== null) {
            UserRole::where('id', $role->id)->update(['sort_order' => $sortOrder]);
        }

        return UserRole::find($role->id);
    }

    /**
     * mergePostback
     */
    protected function mergePostback(array $data): void
    {
        request()->setMethod('POST');
        request()->request->add($data);
    }

    /**
     * tearDown
     */
    public function tearDown(): void
    {
        request()->request->replace();

        parent::tearDown();
    }
}
