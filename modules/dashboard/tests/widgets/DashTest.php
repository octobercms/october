<?php

use Dashboard\Widgets\Dash;

class DashTest extends TestCase
{
    /**
     * makeDashWidget creates a Dash widget instance without running the constructor
     */
    protected function makeDashWidget(bool $canCreateAndEdit, bool $canMakeDefault = false): Dash
    {
        $widget = (new ReflectionClass(Dash::class))->newInstanceWithoutConstructor();
        $widget->canCreateAndEdit = $canCreateAndEdit;
        $widget->canMakeDefault = $canMakeDefault;

        return $widget;
    }

    public function testSaveDashboardRequiresEditPermission()
    {
        $this->expectException(ForbiddenException::class);

        $this->makeDashWidget(false)->onSaveDashboard();
    }

    public function testResetDashboardRequiresEditPermission()
    {
        $this->expectException(ForbiddenException::class);

        $this->makeDashWidget(false)->onResetDashboard();
    }

    public function testCommitDashboardRequiresEditPermission()
    {
        $this->expectException(ForbiddenException::class);

        $this->makeDashWidget(false, true)->onCommitDashboard();
    }

    public function testCommitDashboardRequiresMakeDefaultCapability()
    {
        $this->expectException(ForbiddenException::class);

        $this->makeDashWidget(true, false)->onCommitDashboard();
    }

    public function testSaveDashboardAllowedWithEditPermission()
    {
        $this->assertNull($this->makeDashWidget(true)->onSaveDashboard());
    }

    public function testCommitDashboardAllowedWithMakeDefaultCapability()
    {
        $this->assertNull($this->makeDashWidget(true, true)->onCommitDashboard());
    }
}
