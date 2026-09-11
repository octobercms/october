<?php

use Backend\Classes\WidgetManager;
use Backend\Classes\Controller;
use Backend\Widgets\Filter;
use Backend\Models\User;

require_once __DIR__.'/../fixtures/models/BackendUserFixture.php';

class FilterWidgetTest extends PluginTestCase
{
    /**
     * setUp test case
     */
    public function setUp(): void
    {
        parent::setUp();

        WidgetManager::instance()->registerFilterWidgets(function ($manager) {
            $manager->registerFilterWidget(\Backend\FilterWidgets\Text::class, 'text');
            $manager->registerFilterWidget(\Backend\FilterWidgets\Group::class, 'group');
        });
    }

    /**
     * A group scope's config label is developer-authored, so it reaches the AJAX response raw for the unescaped `{{{ name }}}` tag to render.
     */
    public function testGroupScopeOptionLabelPreservesRawHtml()
    {
        $rawLabel = "<span class='select-status status-indicator'></span> Active";

        $filter = $this->makeFilterWidget([
            'model' => new User,
            'arrayName' => 'array',
            'scopes' => [
                'status' => [
                    'type' => 'group',
                    'label' => 'Status',
                    'options' => [
                        'active' => $rawLabel,
                    ],
                ],
            ],
        ]);
        $filter->render();

        $widget = $filter->getFilterWidgets()['status'];
        $result = $widget->onGetGroupOptions();

        $this->assertSame($rawLabel, $result['options']['available'][0]['name']);
    }

    /**
     * A group scope label pulled from a model column is not developer-authored, so it stays HTML-escaped before the unescaped `{{{ name }}}` tag renders it.
     */
    public function testGroupScopeOptionLabelFromModelRelationIsEscaped()
    {
        $unsafeLogin = '<script>alert(1)</script>';

        $user = new User;
        $user->fill([
            'first_name' => 'Test',
            'last_name' => 'User',
            'login' => $unsafeLogin,
            'email' => 'grouptest@test.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);
        $user->save();

        $filter = $this->makeFilterWidget([
            'model' => new User,
            'arrayName' => 'array',
            'scopes' => [
                'status' => [
                    'type' => 'group',
                    'label' => 'Status',
                    'modelClass' => User::class,
                    'nameFrom' => 'login',
                ],
            ],
        ]);
        $filter->render();

        $widget = $filter->getFilterWidgets()['status'];
        $result = $widget->onGetGroupOptions();

        $names = array_column($result['options']['available'], 'name');

        $this->assertContains(e($unsafeLogin), $names);
        $this->assertNotContains($unsafeLogin, $names);
    }

    public function testFilterWidgetsAreRegistered()
    {
        $widgetManager = WidgetManager::instance();

        $widgetClass = $widgetManager->resolveFilterWidget('text');
        $this->assertTrue(class_exists($widgetClass));
    }

    public function testRestrictedScopeWithUserWithNoPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user);

        $filter = $this->restrictedFilterFixture();
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));

        // Expect an exception
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('No definition for scope [email] found');
        $filter->getScope('email');
    }

    public function testRestrictedScopeWithUserWithWrongPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.wrong_permission', true));

        $filter = $this->restrictedFilterFixture();
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));

        // Expect an exception
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('No definition for scope [email] found');
        $filter->getScope('email');
    }

    public function testRestrictedScopeWithUserWithRightPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $filter = $this->restrictedFilterFixture();
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));
        $this->assertNotNull($filter->getScope('email'));
    }

    public function testRestrictedScopeWithUserWithRightWildcardPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $filter = $this->makeFilterWidget([
            'model' => new User,
            'arrayName' => 'array',
            'scopes' => [
                'id' => [
                    'type' => 'text',
                    'label' => 'ID'
                ],
                'email' => [
                    'type' => 'text',
                    'label' => 'Email',
                    'permission' => 'test.*'
                ]
            ]
        ]);
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));
        $this->assertNotNull($filter->getScope('email'));
    }

    public function testRestrictedScopeWithSuperuser()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->asSuperUser());

        $filter = $this->restrictedFilterFixture();
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));
        $this->assertNotNull($filter->getScope('email'));
    }

    public function testRestrictedScopeSinglePermissionWithUserWithWrongPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.wrong_permission', true));

        $filter = $this->restrictedFilterFixture(true);
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));

        // Expect an exception
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('No definition for scope [email] found');
        $filter->getScope('email');
    }

    public function testRestrictedScopeSinglePermissionWithUserWithRightPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $filter = $this->restrictedFilterFixture(true);
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));
        $this->assertNotNull($filter->getScope('email'));
    }

    protected function restrictedFilterFixture(bool $singlePermission = false)
    {
        return $this->makeFilterWidget([
            'model' => new User,
            'arrayName' => 'array',
            'scopes' => [
                'id' => [
                    'type' => 'text',
                    'label' => 'ID'
                ],
                'email' => [
                    'type' => 'text',
                    'label' => 'Email',
                    'permissions' => ($singlePermission) ? 'test.access_field' : [
                        'test.access_field'
                    ]
                ]
            ]
        ]);
    }

    protected function makeFilterWidget($config)
    {
        return new Filter(new Controller, $config);
    }
}
