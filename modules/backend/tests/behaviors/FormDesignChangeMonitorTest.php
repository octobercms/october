<?php

use Backend\Models\UserGroup;
use Backend\Controllers\UserGroups;

require_once __DIR__.'/../fixtures/models/BackendUserFixture.php';

class FormDesignChangeMonitorTest extends PluginTestCase
{
    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    /**
     * testBasicDesignOmitsChangeMonitorByDefault ensures existing forms keep their behavior.
     */
    public function testBasicDesignOmitsChangeMonitorByDefault()
    {
        $html = $this->renderForm(['design' => ['displayMode' => 'basic']]);

        $this->assertFormHasChangeMonitor(false, $html);
    }

    /**
     * testDesignEnablesChangeMonitorFromConfig ensures the `changeMonitor` design config applies to each page design.
     * @dataProvider providePageDesigns
     */
    public function testDesignEnablesChangeMonitorFromConfig(string $displayMode)
    {
        $html = $this->renderForm(['design' => ['displayMode' => $displayMode, 'changeMonitor' => true]]);

        $this->assertFormHasChangeMonitor(true, $html);
    }

    /**
     * testDocumentDesignEnablesChangeMonitorByDefault ensures the document design keeps its warning.
     */
    public function testDocumentDesignEnablesChangeMonitorByDefault()
    {
        $html = $this->renderForm(['design' => ['displayMode' => 'document']]);

        $this->assertFormHasChangeMonitor(true, $html);
    }

    /**
     * testDocumentDesignCanDisableChangeMonitor ensures the document design warning can be turned off.
     */
    public function testDocumentDesignCanDisableChangeMonitor()
    {
        $html = $this->renderForm(['design' => ['displayMode' => 'document', 'changeMonitor' => false]]);

        $this->assertFormHasChangeMonitor(false, $html);
    }

    /**
     * testChangeMonitorPrefersContextConfig ensures a context design config overrides the global value.
     */
    public function testChangeMonitorPrefersContextConfig()
    {
        $config = [
            'design' => ['displayMode' => 'basic', 'changeMonitor' => false],
            'create' => ['design' => ['changeMonitor' => true]],
        ];

        $this->assertFormHasChangeMonitor(true, $this->renderForm($config));
        $this->assertFormHasChangeMonitor(false, $this->renderForm($config, $this->makeGroup()));
    }

    /**
     * testCreateButtonsCommitChanges ensures both create buttons commit changes but cancel keeps the warning.
     */
    public function testCreateButtonsCommitChanges()
    {
        $html = $this->renderForm(['design' => ['displayMode' => 'basic', 'changeMonitor' => true]]);

        $this->assertSame(2, $this->countCommitButtons($html));
        $this->assertMatchesRegularExpression('/<button[^>]*data-request="onCancel"[^>]*>/', $html);
        $this->assertDoesNotMatchRegularExpression('/<button[^>]*data-request="onCancel"[^>]*data-change-monitor-commit/', $html);
        $this->assertDoesNotMatchRegularExpression('/<button[^>]*data-change-monitor-commit[^>]*data-request="onCancel"/', $html);
    }

    /**
     * testUpdateButtonsCommitChanges ensures the save and delete buttons commit changes.
     */
    public function testUpdateButtonsCommitChanges()
    {
        $html = $this->renderForm(['design' => ['displayMode' => 'basic', 'changeMonitor' => true]], $this->makeGroup());

        $this->assertSame(3, $this->countCommitButtons($html));
        $this->assertMatchesRegularExpression('/<button[^>]*data-request="onDelete"[^>]*data-change-monitor-commit/', $html);
    }

    /**
     * providePageDesigns returns the page designs that support the change monitor.
     */
    public function providePageDesigns(): array
    {
        return [
            'basic' => ['basic'],
            'survey' => ['survey'],
            'sidebar' => ['sidebar'],
            'document' => ['document'],
        ];
    }

    /**
     * assertFormHasChangeMonitor checks for the change monitor attribute on the opening form tag.
     */
    protected function assertFormHasChangeMonitor(bool $expected, string $html): void
    {
        $this->assertMatchesRegularExpression('/<form[^>]*>/', $html);
        $this->assertSame($expected, (bool) preg_match('/<form[^>]*\sdata-change-monitor[\s>]/', $html));
    }

    /**
     * countCommitButtons returns the number of buttons that commit changes to the change monitor.
     */
    protected function countCommitButtons(string $html): int
    {
        return preg_match_all('/<button[^>]*\sdata-change-monitor-commit[=\s>]/', $html);
    }

    /**
     * renderForm renders the user groups form design with the given config, using the update context when a group is passed.
     */
    protected function renderForm(array $config, ?UserGroup $group = null): string
    {
        $this->actingAs((new BackendUserFixture)->asSuperUser());

        Block::reset();

        $controller = new UserGroups;
        $controller->asExtension('FormController')->setConfig($config + [
            'name' => 'Group',
            'form' => '~/modules/backend/models/usergroup/fields.yaml',
            'modelClass' => UserGroup::class,
        ]);

        if ($group) {
            $controller->update($group->id);
        }
        else {
            $controller->create();
        }

        // The sidebar design renders its form inside the body block
        return $controller->formRenderDesign() . Block::get('body');
    }

    /**
     * makeGroup saves a user group to open in the update context.
     */
    protected function makeGroup(): UserGroup
    {
        $group = new UserGroup;
        $group->name = 'Content Editors';
        $group->save();

        return $group;
    }

    /**
     * tearDown
     */
    public function tearDown(): void
    {
        Block::reset();

        parent::tearDown();
    }
}
