<?php namespace Dashboard\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * Dashboard top-level component
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
class Dashboard extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'dashboard-component-dashboard';

    /**
     * @var array require other components
     */
    protected $require = [
        \Backend\VueComponents\DropdownMenu::class,
        \Backend\VueComponents\Modal::class,
        \Backend\VueComponents\LoadingIndicator::class
    ];

    /**
     * registerSubcomponents
     */
    protected function registerSubcomponents()
    {
        $this->registerSubcomponent('dashboard-selector');
        $this->registerSubcomponent('interval-selector');
        $this->registerSubcomponent('report');
        $this->registerSubcomponent('report-row');
        $this->registerSubcomponent('report-diff');
        $this->registerSubcomponent('report-widget');

        $this->registerSubcomponent('widget-static');
        $this->registerSubcomponent('widget-indicator');
        $this->registerSubcomponent('widget-chart');
        $this->registerSubcomponent('widget-table');
        $this->registerSubcomponent('widget-section-title');
        $this->registerSubcomponent('widget-text-notice');
        $this->registerSubcomponent('widget-error');
    }

    /**
     * loadAssets adds component specific asset files. Use $this->addJs() and $this->addCss()
     * to register new assets to include on the page.
     * The default component script and CSS file are loaded automatically.
     * @return void
     */
    protected function loadAssets()
    {
        $this->addJs('/modules/backend/assets/js/ph-icons-list.js', ['type' => 'module']);
        // $this->addJs('/modules/system/assets/vendor/chartjs/chart.umd.js');
        // $this->addJs('/modules/system/assets/vendor/chartjs/chartjs-adapter-moment.min.js');

        // $this->addJs('/modules/dashboard/assets/js/classes/Helpers.js', ['type' => 'module']);
        // $this->addJs('/modules/dashboard/assets/js/classes/DataSource.js', ['type' => 'module']);
        // $this->addJs('/modules/dashboard/assets/js/classes/Calendar.js', ['type' => 'module']);
        // $this->addJs('/modules/dashboard/assets/js/classes/InspectorConfigurator.js', ['type' => 'module']);
        // $this->addJs('/modules/dashboard/assets/js/classes/Sizing.js', ['type' => 'module']);
        // $this->addJs('/modules/dashboard/assets/js/classes/Dragging.js', ['type' => 'module']);
        // $this->addJs('/modules/dashboard/assets/js/classes/Reordering.js', ['type' => 'module']);
        // $this->addJs('/modules/dashboard/assets/js/classes/DataHelper.js', ['type' => 'module']);
        // $this->addJs('/modules/dashboard/assets/js/classes/WidgetManager.js', ['type' => 'module']);

        $this->addJs('js/widget-base.js', ['type' => 'module']);
    }
}
