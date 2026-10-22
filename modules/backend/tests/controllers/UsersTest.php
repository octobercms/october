<?php

use Backend\Models\User;
use Backend\Models\UserRole;
use Backend\Controllers\Users;

require_once __DIR__.'/../fixtures/models/BackendUserFixture.php';

/**
 * UsersTest covers credential field and rank authorization on the administrator controller.
 */
class UsersTest extends PluginTestCase
{
    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    /**
     * testPasswordFieldRemovedForExistingAdminWithoutOtherAdmins ensures a user lacking other_admins cannot keep the password field on an update.
     */
    public function testPasswordFieldRemovedForExistingAdminWithoutOtherAdmins()
    {
        $this->actingAsManager();
        $victim = $this->makeAdmin('victim');

        // A forged create context must not re-expose credential fields on an existing record
        $form = $this->makeUpdateForm($victim, ['form_context' => 'create']);

        $this->assertNull($form->getField('password'));
        $this->assertNull($form->getField('password_confirmation'));
        $this->assertTrue($form->getField('email')->disabled);
    }

    /**
     * testPasswordFieldKeptForNewAdminWithoutOtherAdmins ensures creating an admin still offers the password field.
     */
    public function testPasswordFieldKeptForNewAdminWithoutOtherAdmins()
    {
        $this->actingAsManager();

        $form = $this->makeCreateForm();

        $this->assertNotNull($form->getField('password'));
        $this->assertNotNull($form->getField('password_confirmation'));
    }

    /**
     * testPasswordFieldKeptForExistingAdminWithOtherAdmins ensures the gated permission still allows editing credentials.
     */
    public function testPasswordFieldKeptForExistingAdminWithOtherAdmins()
    {
        $this->actingAsManager(['admins.manage.other_admins' => 1]);
        $victim = $this->makeAdmin('victim');

        $form = $this->makeUpdateForm($victim, ['form_context' => 'create']);

        $this->assertNotNull($form->getField('password'));
        $this->assertFalse($form->getField('email')->disabled);
    }

    /**
     * testMyAccountFindsSuperUserImpersonatingRole ensures a super user viewing as a role can still load their own account.
     */
    public function testMyAccountFindsSuperUserImpersonatingRole()
    {
        $user = $this->actingAsSuperUserImpersonatingRole();

        $controller = new Users;
        self::setProtectedProperty($controller, 'action', 'myaccount');

        $this->assertEquals($user->id, $controller->formFindModelObject($user->id)->id);
    }

    /**
     * testRankQueryShowsOnlySelfWhileImpersonating ensures impersonation exposes the user's own record but no other super users.
     */
    public function testRankQueryShowsOnlySelfWhileImpersonating()
    {
        $user = $this->actingAsSuperUserImpersonatingRole();
        $otherSuperUser = $this->makeAdmin('othersuper', true);

        $ids = $this->getRankedUserIds();

        $this->assertContains($user->id, $ids);
        $this->assertNotContains($otherSuperUser->id, $ids);
    }

    /**
     * testRankQueryHidesSuperUsersFromManager ensures a super user is hidden even when their role ranks below the manager.
     */
    public function testRankQueryHidesSuperUsersFromManager()
    {
        $this->actingAsManager();
        $admin = $this->makeAdmin('regular');
        $superUser = $this->makeAdmin('lowsuper', true);

        $ids = $this->getRankedUserIds();

        $this->assertContains($admin->id, $ids);
        $this->assertNotContains($superUser->id, $ids);
    }

    /**
     * actingAsSuperUserImpersonatingRole signs in a saved super user who is viewing the backend as a lower role.
     */
    protected function actingAsSuperUserImpersonatingRole(): User
    {
        $user = $this->makeAdmin('superuser', true);

        $role = new UserRole;
        $role->name = 'Impersonated';
        $role->permissions = ['general.backend' => 1];
        $role->save();

        $user->setRoleImpersonation($role);
        $this->actingAs($user);

        return $user;
    }

    /**
     * getRankedUserIds returns the user IDs visible to the current user in the administrator list.
     */
    protected function getRankedUserIds(): array
    {
        $query = User::query();

        (new Users)->listExtendQuery($query);

        return $query->pluck('id')->all();
    }

    /**
     * actingAsManager signs in a non-superuser administrator holding admins.manage and an optional extra permission.
     */
    protected function actingAsManager(array $extraPermissions = []): void
    {
        $role = new UserRole;
        $role->name = 'Manager';
        $role->permissions = ['general.backend' => 1];
        $role->save();
        UserRole::where('id', $role->id)->update(['sort_order' => 50]);

        $user = new BackendUserFixture;
        $user->role_id = $role->id;
        $user->withPermission(['general.backend' => 1, 'admins.manage' => 1] + $extraPermissions);

        $this->actingAs($user);
    }

    /**
     * makeAdmin saves a lower-ranked administrator to act as the edit target.
     */
    protected function makeAdmin(string $login, bool $isSuperUser = false): User
    {
        $role = new UserRole;
        $role->name = $login.'-role';
        $role->permissions = ['general.backend' => 1];
        $role->save();
        UserRole::where('id', $role->id)->update(['sort_order' => 60]);

        $user = new User;
        $user->login = $login;
        $user->email = $login.'@test.com';
        $user->first_name = 'Test';
        $user->last_name = 'Admin';
        $user->password = 'secret99';
        $user->password_confirmation = 'secret99';
        $user->role_id = $role->id;
        $user->is_superuser = $isSuperUser;
        $user->save();

        return User::find($user->id);
    }

    /**
     * makeUpdateForm builds the administrator form widget for an existing record with the given postback.
     */
    protected function makeUpdateForm(User $model, array $postback): \Backend\Widgets\Form
    {
        $this->mergePostback($postback);

        $controller = new Users;
        self::setProtectedProperty($controller, 'action', 'update');
        self::setProtectedProperty($controller, 'params', [$model->id]);

        $controller->asExtension('FormController')->initForm($model);

        return $controller->formGetWidget();
    }

    /**
     * makeCreateForm builds the administrator form widget for a new record.
     */
    protected function makeCreateForm(): \Backend\Widgets\Form
    {
        $this->mergePostback(['form_context' => 'create']);

        $controller = new Users;
        self::setProtectedProperty($controller, 'action', 'create');
        self::setProtectedProperty($controller, 'params', []);

        $controller->asExtension('FormController')->initForm(new User);

        return $controller->formGetWidget();
    }

    /**
     * mergePostback adds data to the current request as a POST body.
     */
    protected function mergePostback(array $data): void
    {
        request()->setMethod('POST');
        request()->request->add($data);
    }

    /**
     * tearDown clears the postback between tests.
     */
    public function tearDown(): void
    {
        request()->request->replace();

        parent::tearDown();
    }
}
