<?php

use Backend\Models\User;
use Backend\Models\UserRole;
use Backend\Behaviors\RelationController;

require_once __DIR__.'/../fixtures/models/BackendUserFixture.php';

/**
 * RelationManageScopeController manages the users of a role and the role of a user.
 */
class RelationManageScopeController extends \Backend\Classes\Controller
{
    public $implement = [RelationController::class];

    public $relationConfig = [
        'users' => [
            'label' => 'User',
            'view' => [
                'list' => ['columns' => ['login' => ['label' => 'Login']]],
                'toolbarButtons' => 'create|delete|remove',
            ],
            'manage' => [
                'form' => ['fields' => ['first_name' => ['label' => 'First name']]],
                'list' => ['columns' => ['login' => ['label' => 'Login']]],
            ],
        ],
        'role' => [
            'label' => 'Role',
            'view' => [
                'form' => ['fields' => ['name' => ['label' => 'Name']]],
                'toolbarButtons' => 'link|unlink',
            ],
            'manage' => [
                'form' => ['fields' => ['name' => ['label' => 'Name']]],
                'list' => ['columns' => ['name' => ['label' => 'Name']]],
            ],
        ],
    ];
}

/**
 * RelationControllerManageScopeTest ensures relation manage handlers only act on records that belong to the relation.
 */
class RelationControllerManageScopeTest extends PluginTestCase
{
    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    /**
     * @var UserRole ownRole is the parent record being edited.
     */
    protected $ownRole;

    /**
     * @var UserRole otherRole holds records unrelated to the parent.
     */
    protected $otherRole;

    /**
     * @var User relatedUser belongs to the parent role.
     */
    protected $relatedUser;

    /**
     * @var User unrelatedUser belongs to the other role.
     */
    protected $unrelatedUser;

    /**
     * setUp creates two roles with one user each.
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->actingAs((new BackendUserFixture)->asSuperUser());

        $this->ownRole = $this->makeRole('Own Role');
        $this->otherRole = $this->makeRole('Other Role');
        $this->relatedUser = $this->makeUser('related', $this->ownRole);
        $this->unrelatedUser = $this->makeUser('unrelated', $this->otherRole);
    }

    /**
     * testManageFormRejectsUnrelatedRecord ensures an unrelated ID cannot be loaded into the manage form.
     */
    public function testManageFormRejectsUnrelatedRecord()
    {
        $this->expectException(ApplicationException::class);

        $this->makeController($this->ownRole, 'users', ['manage_id' => $this->unrelatedUser->id]);
    }

    /**
     * testManageUpdateChangesRelatedRecord ensures a related record can still be updated.
     */
    public function testManageUpdateChangesRelatedRecord()
    {
        $controller = $this->makeController($this->ownRole, 'users', [
            'manage_id' => $this->relatedUser->id,
            'User' => ['first_name' => 'Changed'],
        ]);

        $controller->onRelationManageUpdate();

        $this->assertEquals('Changed', User::find($this->relatedUser->id)->first_name);
    }

    /**
     * testManageDeleteIgnoresUnrelatedRecords ensures checked IDs outside the relation are not deleted.
     */
    public function testManageDeleteIgnoresUnrelatedRecords()
    {
        $controller = $this->makeController($this->ownRole, 'users', [
            'checked' => [$this->unrelatedUser->id, $this->relatedUser->id],
        ]);

        $controller->onRelationManageDelete();

        $this->assertNotNull(User::find($this->unrelatedUser->id));
        $this->assertNull(User::find($this->relatedUser->id));
    }

    /**
     * testManageRemoveIgnoresUnrelatedRecords ensures an unrelated record is not detached from its own parent.
     */
    public function testManageRemoveIgnoresUnrelatedRecords()
    {
        $controller = $this->makeController($this->ownRole, 'users', [
            'checked' => [$this->unrelatedUser->id],
        ]);

        $controller->onRelationManageRemove();

        $this->assertEquals($this->otherRole->id, User::find($this->unrelatedUser->id)->role_id);
    }

    /**
     * testDeferredRecordCanBeManaged ensures a record bound in the current session counts as related.
     */
    public function testDeferredRecordCanBeManaged()
    {
        $sessionKey = 'relation-scope-test';
        $newRole = new UserRole;
        $newRole->users()->add($this->unrelatedUser, $sessionKey);

        $controller = $this->makeController($newRole, 'users', [
            '_session_key' => $sessionKey,
            'manage_id' => $this->unrelatedUser->id,
        ]);

        $this->assertEquals($this->unrelatedUser->id, $controller->vars['relationManageWidget']->model->id);
    }

    /**
     * testLinkStillFindsUnrelatedRecord ensures linking can still pick a record that is not yet related, while managing cannot.
     */
    public function testLinkStillFindsUnrelatedRecord()
    {
        $controller = $this->makeController($this->relatedUser, 'role', []);

        $linked = self::callProtectedMethod($controller, 'findLinkModelObject', [$this->otherRole->id]);
        $managed = self::callProtectedMethod($controller, 'findManageModelObject', [$this->otherRole->id]);
        $own = self::callProtectedMethod($controller, 'findManageModelObject', [$this->ownRole->id]);

        $this->assertEquals($this->otherRole->id, $linked->id);
        $this->assertNull($managed);
        $this->assertEquals($this->ownRole->id, $own->id);
    }

    /**
     * makeController initializes the relation behavior for a parent model and field with the given postback.
     */
    protected function makeController($model, string $field, array $postback): RelationController
    {
        request()->setMethod('POST');
        request()->request->add(['_relation_field' => $field] + $postback);

        $controller = new RelationManageScopeController;
        $behavior = $controller->asExtension('RelationController');
        $behavior->initRelation($model, $field);
        $behavior->prepareVars();

        return $behavior;
    }

    /**
     * makeRole saves a role.
     */
    protected function makeRole(string $name): UserRole
    {
        $role = new UserRole;
        $role->name = $name;
        $role->permissions = ['general.backend' => 1];
        $role->save();

        return $role;
    }

    /**
     * makeUser saves a user belonging to a role.
     */
    protected function makeUser(string $login, UserRole $role): User
    {
        $user = new User;
        $user->login = $login;
        $user->email = $login.'@test.com';
        $user->first_name = 'Test';
        $user->last_name = 'User';
        $user->password = 'secret99';
        $user->password_confirmation = 'secret99';
        $user->role_id = $role->id;
        $user->save();

        return User::find($user->id);
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
