<?php

use Backend\Models\User;
use Backend\Widgets\Lists;
use October\Rain\Exception\ApplicationException;

require_once __DIR__.'/../fixtures/models/BackendUserFixture.php';

class ListsWidgetTest extends PluginTestCase
{
    public function testRestrictedColumnWithUserWithNoPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user);

        $list = $this->restrictedListsFixture();
        $list->render();

        $this->assertNotNull($list->getColumn('id'));

        // Expect an exception
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('No definition for column email');
        $column = $list->getColumn('email');
    }

    public function testRestrictedColumnWithUserWithWrongPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.wrong_permission', true));

        $list = $this->restrictedListsFixture();
        $list->render();

        $this->assertNotNull($list->getColumn('id'));

        // Expect an exception
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('No definition for column email');
        $column = $list->getColumn('email');
    }

    public function testRestrictedColumnWithUserWithRightPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $list = $this->restrictedListsFixture();
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));
    }

    public function testRestrictedColumnWithUserWithRightWildcardPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $list = new Lists(null, [
            'model' => new User,
            'arrayName' => 'array',
            'columns' => [
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
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));
    }

    public function testRestrictedColumnWithSuperuser()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->asSuperUser());

        $list = $this->restrictedListsFixture();
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));
    }

    public function testRestrictedColumnSinglePermissionWithUserWithWrongPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.wrong_permission', true));

        $list = $this->restrictedListsFixture(true);
        $list->render();

        $this->assertNotNull($list->getColumn('id'));

        // Expect an exception
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('No definition for column email');
        $column = $list->getColumn('email');
    }

    public function testRestrictedColumnSinglePermissionWithUserWithRightPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $list = $this->restrictedListsFixture(true);
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));
    }

    /**
     * @dataProvider linkageUrlProvider
     */
    public function testLinkageColumnOnlyLinksSafeSchemes(string $url, bool $expectLink)
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->asSuperUser());

        $list = new Lists(null, [
            'model' => new User,
            'arrayName' => 'array',
            'columns' => [
                'login' => [
                    'type' => 'linkage',
                    'label' => 'Link'
                ]
            ]
        ]);
        $list->render();

        $record = new User;
        $record->login = $url;

        $html = (string) $list->getColumnValue($record, $list->getColumn('login'));

        $this->assertSame($expectLink, str_contains($html, '<a href='));
    }

    public static function linkageUrlProvider(): array
    {
        return [
            ['https://octobercms.com', true],
            ['/relative/path', true],
            ['mailto:hello@example.com', true],
            ['javascript:alert(1)', false],
            ["java\tscript:alert(1)", false],
            [' JAVASCRIPT:alert(1)', false],
            ['data:text/html,x', false],
        ];
    }

    /**
     * testSelectableColumnEscapesOptionAttributes checks image and icon option values cannot break out of their attributes.
     * @dataProvider selectableOptionProvider
     */
    public function testSelectableColumnEscapesOptionAttributes(string $optionValue, string $expected)
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->asSuperUser());

        $list = new Lists(null, [
            'model' => new User,
            'arrayName' => 'array',
            'columns' => [
                'login' => [
                    'type' => 'selectable',
                    'label' => 'Login',
                    'options' => ['admin' => ['Admin', $optionValue]]
                ]
            ]
        ]);
        $list->render();

        $record = new User;
        $record->login = 'admin';

        $html = (string) $list->getColumnValue($record, $list->getColumn('login'));

        $this->assertStringContainsString($expected, $html);
        $this->assertStringNotContainsString('onerror="alert(1)"', $html);
    }

    /**
     * selectableOptionProvider returns option values for the image and icon branches with the escaped output.
     */
    public static function selectableOptionProvider(): array
    {
        return [
            ['/images/x.svg" onerror="alert(1)', '<img src="/images/x.svg&quot; onerror=&quot;alert(1)"'],
            ['ph ph-user" onerror="alert(1)', '<i class="ph ph-user&quot; onerror=&quot;alert(1)"'],
        ];
    }

    protected function restrictedListsFixture(bool $singlePermission = false)
    {
        return new Lists(null, [
            'model' => new User,
            'arrayName' => 'array',
            'columns' => [
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
}
