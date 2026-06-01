<?php namespace Backend\Traits;

use Str;
use Request;
use SystemException;
use Backend\Classes\VueComponentBase;

/**
 * VueMaker Trait adds Vue based methods to a class
 *
 * To add a component call the `registerVueComponent` method:
 *
 *     $this->registerVueComponent('Plugin/VueComponents/MyComponent');
 *
 * This will automatically load the component's JavaScript definition,
 * component template, and CSS file.
 *
 * @see \Backend\Classes\VueComponentBase
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
trait VueMaker
{
    /**
     * @var array vueComponents contains Vue component classes
     */
    protected $vueComponents = [];

    /**
     * @var array vueComponentClasses tracks registered class names for O(1) lookup
     */
    protected $vueComponentClasses = [];

    /**
     * registerVueComponent to be loaded when the action view renders.
     * @param string $className
     */
    public function registerVueComponent($className)
    {
        if ($this->isVueComponentRegistered($className)) {
            return;
        }

        $component = $this->makeVueComponent($className);
        $this->vueComponents[] = $component;
        $this->vueComponentClasses[$className] = true;

        $requiredComponents = $component->getDependencies();
        if (!is_array($requiredComponents)) {
            throw new SystemException(sprintf('getDependencies() must return an array: %s', $className));
        }

        foreach ($requiredComponents as $className) {
            if (!$this->isVueComponentRegistered($className)) {
                $this->registerVueComponent($className);
            }
        }
    }

    /**
     * outputVueComponentTemplates outputs templates and ESM component registration.
     * This method:
     * 1. Renders text/template scripts for each component
     * 2. Imports ESM modules and registers them as Vue components with template injection
     */
    public function outputVueComponentTemplates()
    {
        $registrations = $this->getVueComponentRegistrations();

        if (empty($registrations)) {
            return '';
        }

        $result = [];

        // Output template script blocks
        foreach ($registrations as $reg) {
            $result[] = sprintf('<script type="text/template" id="%s">', $reg['templateId']);
            $result[] = $reg['template'];
            $result[] = '</script>';
        }

        // Output ESM imports and Vue component registration
        $result[] = '<script type="module">';
        $result[] = 'if (!window.oc) window.oc = {};';
        $result[] = 'if (!window.oc.vueComponents) window.oc.vueComponents = {};';

        foreach ($registrations as $reg) {
            $result[] = sprintf("import %s from '%s';", $reg['importName'], $reg['url']);
        }

        foreach ($registrations as $reg) {
            $result[] = sprintf(
                "window.oc.vueComponents['%s'] = { ...%s, template: document.getElementById('%s').innerHTML };",
                $reg['name'],
                $reg['importName'],
                $reg['templateId']
            );
        }

        $result[] = '</script>';

        return implode(PHP_EOL, $result);
    }

    /**
     * outputVueComponentsForAjax sends Vue component ESM files and registration
     * code through the AJAX response asset pipeline, so they are loaded and
     * registered before DOM patching occurs.
     */
    public function outputVueComponentsForAjax($response)
    {
        if (empty($this->vueComponents) || !Request::ajax()) {
            return $response;
        }

        $registrations = $this->getVueComponentRegistrations();

        if (empty($registrations)) {
            return $response;
        }

        // Load ESM files via asset pipeline
        foreach ($registrations as $reg) {
            $response->js($reg['url'], ['type' => 'module']);
        }

        // Generate inline registration module
        $lines = [];
        $lines[] = 'if (!window.oc) window.oc = {};';
        $lines[] = 'if (!window.oc.vueComponents) window.oc.vueComponents = {};';

        foreach ($registrations as $reg) {
            $lines[] = sprintf("import %s from '%s';", $reg['importName'], $reg['url']);
        }

        foreach ($registrations as $reg) {
            $escapedTemplate = str_replace(
                ['\\', '`', '${'],
                ['\\\\', '\\`', '\\${'],
                $reg['template']
            );
            $lines[] = sprintf(
                "window.oc.vueComponents['%s'] = { ...%s, template: `%s` };",
                $reg['name'],
                $reg['importName'],
                $escapedTemplate
            );
        }

        $response->jsInline(implode("\n", $lines), ['type' => 'module']);

        return $response;
    }

    /**
     * getVueComponentRegistrations builds a flat list of component registrations
     * including subcomponents, with ESM URLs, names, templates, and import aliases.
     */
    protected function getVueComponentRegistrations(): array
    {
        $registrations = [];
        $importIndex = 0;

        foreach ($this->vueComponents as $component) {
            $templateId = Str::getClassId($component);
            $registrations[] = [
                'url' => $this->getEsmModuleUrl($component->getEsmModulePath()),
                'name' => $component->getComponentName(),
                'template' => $component->render(),
                'templateId' => $templateId,
                'importName' => 'c' . $importIndex++,
            ];

            foreach ($component->getSubcomponents() as $subcomponent) {
                $subTemplateId = str_replace(['.', '-'], '_', $templateId . '_' . $subcomponent);
                $registrations[] = [
                    'url' => $this->getEsmModuleUrl($component->getSubcomponentEsmPath($subcomponent)),
                    'name' => $component->getSubcomponentName($subcomponent),
                    'template' => $component->renderSubcomponent($subcomponent),
                    'templateId' => $subTemplateId,
                    'importName' => 'c' . $importIndex++,
                ];
            }
        }

        return $registrations;
    }

    /**
     * getEsmModuleUrl converts a file path to a public URL
     */
    protected function getEsmModuleUrl(string $path): string
    {
        $basePath = base_path();

        if (str_starts_with($path, $basePath)) {
            $path = substr($path, strlen($basePath));
        }

        $path = str_replace('\\', '/', $path);

        return Request::getBasePath() . '/' . ltrim($path, '/');
    }

    /**
     * makeVueComponent
     */
    protected function makeVueComponent($className)
    {
        if (!class_exists($className)) {
            throw new SystemException(sprintf('Vue component class not found: %s', $className));
        }

        if (!is_subclass_of($className, VueComponentBase::class)) {
            throw new SystemException(
                sprintf('Vue component class must be a descendant of Backend\Classes\VueComponentBase: %s', $className)
            );
        }

        return new $className($this);
    }

    /**
     * isVueComponentRegistered
     */
    protected function isVueComponentRegistered($className)
    {
        return isset($this->vueComponentClasses[$className]);
    }
}
