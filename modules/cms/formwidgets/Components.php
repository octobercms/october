<?php namespace Cms\FormWidgets;

use Backend\Classes\FormWidgetBase;
use Cms\Classes\ComponentManager;
use Cms\Classes\ComponentHelpers;
use Lang;

/**
 * Component Builder
 * Builds a collection of Cms components and configures them.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Components extends FormWidgetBase
{
    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $components = $this->listComponents();

        return $this->makePartial('formcomponents', ['components'=>$components]);
    }

    protected function listComponents()
    {
        $result = [];

        if (!isset($this->model->settings['components']))
            return $result;

        $manager = ComponentManager::instance();
        $manager->listComponents();
        foreach ($this->model->settings['components'] as $name=>$properties) {
            list($name, $alias) = strpos($name, ' ') ? explode(' ', $name) : [$name, $name];

            $componentObj = $manager->makeComponent($name, null, $properties);
            $componentObj->alias = $alias;
            $componentObj->pluginIcon = 'icon-puzzle-piece';

            $plugin = $manager->findComponentPlugin($componentObj);
            if ($plugin) {
                $pluginDetails = $plugin->pluginDetails();
                if (isset($pluginDetails['icon']))
                    $componentObj->pluginIcon = $pluginDetails['icon'];
            }

            $result[] = $componentObj;
        }

        return $result;
    }

    protected function getComponentName($component)
    {
        return ComponentHelpers::getComponentName($component);
    }

    protected function getComponentDescription($component)
    {
        return ComponentHelpers::getComponentDescription($component);
    }

    protected function getComponentsPropertyConfig($component)
    {
        return ComponentHelpers::getComponentsPropertyConfig($component);
    }

    protected function getComponentPropertyValues($component)
    {
        return ComponentHelpers::getComponentPropertyValues($component);
    }
}