<?php

use Tailor\Controllers\BulkActions;
use Tailor\Classes\BlueprintIndexer;

require_once __DIR__.'/../../../backend/tests/fixtures/models/BackendUserFixture.php';

class BulkActionsTest extends PluginTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->migrateTailor();
    }

    /**
     * testNonPublisherCannotImportUpdatesToDraftableSection ensures updating existing
     * records by import cannot bypass the draft workflow.
     */
    public function testNonPublisherCannotImportUpdatesToDraftableSection()
    {
        $controller = $this->makeImportController('UnitTest\Post', ['create']);

        request()->setMethod('POST');
        request()->request->add(['ImportOptions' => ['update_existing' => 1]]);

        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('You do not have permission to publish records.');

        $controller->onImport();
    }

    /**
     * makeImportController returns an import controller for a section acting as a user
     * with the base section permission plus any extra permissions.
     */
    protected function makeImportController(string $handle, array $extraPermissions = []): BulkActions
    {
        $section = BlueprintIndexer::instance()->findSectionByHandle($handle);

        $permissions = [$section->getPermissionCodeName() => 1];
        foreach ($extraPermissions as $name) {
            $permissions[$section->getPermissionCodeName($name)] = 1;
        }

        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission($permissions));

        $controller = new BulkActions;
        self::setProtectedProperty($controller, 'activeSource', $section);
        self::setProtectedProperty($controller, 'actionMethod', 'import');

        return $controller;
    }
}
