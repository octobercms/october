<?php

use Backend\Controllers\UserGroups;

require_once __DIR__.'/../fixtures/models/BackendUserFixture.php';

/**
 * ChangeMonitorTest covers the opt-in unsaved changes warning of form designs.
 */
class ChangeMonitorTest extends PluginTestCase
{
    /**
     * testBasicDesignOmitsChangeMonitorByDefault ensures existing forms keep their behavior.
     */
    public function testBasicDesignOmitsChangeMonitorByDefault()
    {
        $this->assertDoesNotMatchRegularExpression($this->formTagPattern(), $this->renderDesign());
    }

    /**
     * testBasicDesignEnablesChangeMonitorFromConfig ensures `changeMonitor: true` is applied to the form.
     */
    public function testBasicDesignEnablesChangeMonitorFromConfig()
    {
        $html = $this->renderDesign(true);

        $this->assertMatchesRegularExpression($this->formTagPattern(), $html);
        $this->assertStringContainsString('data-change-monitor-commit', $html);
    }

    /**
     * testChangeMonitorCanBeDisabledFromConfig ensures a design that enables it by default can opt out.
     */
    public function testChangeMonitorCanBeDisabledFromConfig()
    {
        $this->assertDoesNotMatchRegularExpression($this->formTagPattern(), $this->renderDesign(false, 'document'));
    }

    /**
     * formTagPattern matches the change monitor attribute on the opening form tag.
     */
    protected function formTagPattern(): string
    {
        return '/<form[^>]*\sdata-change-monitor[\s>=]/';
    }

    /**
     * renderDesign renders the create form of the user groups controller with the given design config.
     */
    protected function renderDesign(?bool $changeMonitor = null, string $displayMode = 'basic'): string
    {
        $this->actingAs((new BackendUserFixture)->asSuperUser());

        $controller = new UserGroups;
        $formController = $controller->asExtension('FormController');

        (function () use ($changeMonitor, $displayMode) {
            $this->config->design = ['displayMode' => $displayMode];
            if ($changeMonitor !== null) {
                $this->config->design['changeMonitor'] = $changeMonitor;
            }
        })->call($formController);

        $controller->create();

        return $controller->formRenderDesign();
    }
}
