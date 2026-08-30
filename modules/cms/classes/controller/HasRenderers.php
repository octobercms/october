<?php namespace Cms\Classes\Controller;

use Lang;
use Config;
use Cms\Classes\Partial;
use Cms\Classes\Content;
use Cms\Classes\CodeParser;
use Cms\Classes\PartialStack;
use Cms\Classes\CmsException;
use Cms\Classes\ComponentPartial;
use Cms\Classes\ComponentManager;
use System\Helpers\View as ViewHelper;
use October\Rain\Parse\Bracket as TextParser;
use Exception;

/**
 * HasRenderers
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasRenderers
{
    /**
     * renderPage renders a requested page.
     * The framework uses this method internally.
     */
    public function renderPage()
    {
        // Prevents infinite loop by setting to empty string first
        if ($this->pageContents === null) {
            $this->pageContents = '';
            $this->pageContents = $this->renderPageContents();
        }

        $contents = $this->pageContents;

        /**
         * @event cms.page.render
         * Provides an opportunity to manipulate the page's rendered contents
         *
         * Example usage:
         *
         *     Event::listen('cms.page.render', function ((\Cms\Classes\Controller) $controller, (string) $pageContents) {
         *         return 'My custom contents';
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.render', function ((string) $pageContents) {
         *         return 'My custom contents';
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.page.render', [&$contents])) {
            return $event;
        }

        return $contents;
    }

    /**
     * renderLayoutContents
     */
    protected function renderLayoutContents()
    {
        CmsException::mask($this->layout, 400);
        $this->loader->setObject($this->layout);
        $template = $this->twig->load($this->layout->getFilePath());
        $result = $template->render($this->vars);
        CmsException::unmask();
        return $result;
    }

    /**
     * renderPageContents with exception masking
     */
    protected function renderPageContents()
    {
        CmsException::mask($this->page, 400);
        $this->loader->setObject($this->page);
        $template = $this->twig->load($this->page->getFilePath());
        $pageContents = $template->render($this->vars);
        CmsException::unmask();
        return $pageContents;
    }

    /**
     * loadPartialObject loads a partial for rendering.
     * @return Partial|false
     */
    public function loadPartialObject($name)
    {
        // Alias @ symbol for ::
        if (substr($name, 0, 1) === '@') {
            $name = '::' . substr($name, 1);
        }

        // Process Component partial
        if (strpos($name, '::') !== false) {
            [$componentAlias, $partialName] = explode('::', $name);

            // Component alias not supplied
            if (!strlen($componentAlias)) {
                if ($this->componentContext !== null) {
                    $componentObj = $this->componentContext;
                }
                elseif (($componentObj = $this->findComponentByPartial($partialName)) === null) {
                    return false;
                }
            }
            // Component alias is supplied
            elseif (($componentObj = $this->findComponentByName($componentAlias)) === null) {
                return false;
            }

            $this->componentContext = $componentObj;

            // Check if the theme has an override
            $partial = ComponentPartial::loadOverrideCached($this->theme, $componentObj, $partialName);

            // Check the component partial
            if ($partial === null) {
                $partial = ComponentPartial::loadCached($componentObj, $partialName);
            }

            if ($partial === null) {
                return false;
            }

            // Set context for self access
            $this->vars['__SELF__'] = $componentObj;
        }
        // Process theme partial
        elseif (($partial = Partial::loadCached($this->theme, $name)) === null) {
            return false;
        }

        return $partial;
    }

    /**
     * renderPartial renders a requested partial. The framework uses this method internally.
     * @param string $name The view to load.
     * @param array $parameters Parameter variables to pass to the view.
     * @param bool $throwException Throw an exception if the partial is not found.
     * @return mixed Partial contents or false if not throwing an exception.
     */
    public function renderPartial($name, $parameters = [], $throwException = true)
    {
        $vars = $this->vars;
        $this->vars = array_merge($this->vars, $parameters);

        /**
         * @event cms.page.beforeRenderPartial
         * Provides an opportunity to manipulate the name of the partial being rendered before it renders
         *
         * Example usage:
         *
         *     Event::listen('cms.page.beforeRenderPartial', function ((\Cms\Classes\Controller) $controller, (string) $partialName) {
         *         return Cms\Classes\Partial::loadCached($theme, 'custom-partial-name');
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.beforeRenderPartial', function ((string) $partialName) {
         *         return Cms\Classes\Partial::loadCached($theme, 'custom-partial-name');
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.page.beforeRenderPartial', [$name])) {
            $partial = $event;
        }
        else {
            $partial = $this->loadPartialObject($name, $throwException);
        }

        if ($partial === false) {
            if ($throwException) {
                throw new CmsException(Lang::get('cms::lang.partial.not_found_name', ['name'=>$name]));
            }
            else {
                return false;
            }
        }

        // Run functions for CMS partials only (Cms\Classes\Partial)
        if ($partial instanceof Partial) {
            if (!$this->partialStack) {
                $this->partialStack = new PartialStack;
            }
            $this->partialStack->stackPartial();

            foreach ($partial->settings['components'] as $component => $properties) {
                // Do not inject the viewBag component to the environment.
                // Not sure if they're needed there by the requirements,
                // but there were problems with array-typed properties used by Static Pages
                // snippets and parseRouteParamsOnComponent(). --ab
                // @deprecated check if this is still needed --sg
                if ($component === 'viewBag') {
                    continue;
                }

                [$componentName, $alias] = strpos($component, ' ')
                    ? explode(' ', $component)
                    : [$component, $component];

                $this->addPartialComponent($partial, $parameters, $componentName, $alias, $properties);
            }

            CmsException::mask($this->page, 300);
            $parser = new CodeParser($partial);
            $partialObj = $parser->source($this->page, $this->layout, $this);
            $this->partialStack->addPartialObj($partialObj);
            CmsException::unmask();

            CmsException::mask($partial, 300);
            $partialObj->onStart();
            $partial->runComponents();
            $partialObj->onEnd();
            CmsException::unmask();

            // This call intentionally placed after the lifecycle events to mimic
            // the page action call found in backend ajax. Often we will want the
            // state accessible after everything runs, instead of reverting state
            if ($this->partialWatcher && $this->partialWatcher->isWatchingHandler($name)) {
                try {
                    if ($result = $this->runAjaxHandler($this->getAjaxHandler())) {
                        $this->partialWatcher->setHandlerResponse($result);
                    }
                }
                catch (Exception $ex) {
                    $this->partialWatcher->setHandlerException($ex);
                }
            }
        }

        // Render the partial
        CmsException::mask($partial, 400);
        $this->loader->setObject($partial);
        $template = $this->twig->load($partial->getFilePath());
        $partialContent = $template->render(array_merge($this->vars, $parameters));
        CmsException::unmask();

        if ($partial instanceof Partial) {
            $this->partialStack->unstackPartial();
        }

        $this->vars = $vars;

        /**
         * @event cms.page.renderPartial
         * Provides an opportunity to manipulate the output of a partial after being rendered
         *
         * Example usage:
         *
         *     Event::listen('cms.page.renderPartial', function ((\Cms\Classes\Controller) $controller, (string) $partialName, (string) &$partialContent) {
         *         return "Overriding content";
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.renderPartial', function ((string) $partialName, (string) &$partialContent) {
         *         return "Overriding content";
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.page.renderPartial', [$name, &$partialContent])) {
            return $event;
        }

        // Record event
        if ($this->partialWatcher) {
            $this->partialWatcher->setPartialContents($name, $partialContent);
        }

        return $partialContent;
    }

    /**
     * loadContentObject loads content for rendering.
     * @return Content|false
     */
    public function loadContentObject($name)
    {
        // Load content from theme, matched to the site locale
        if (($content = Content::findLocalized($this->theme, $name)) === null) {
            return false;
        }

        return $content;
    }

    /**
     * renderContent renders a requested content file. The framework uses this method internally.
     * @param string $name The content view to load.
     * @param array $parameters Parameter variables to pass to the view.
     * @return mixed Contents or false if now throwing an exception.
     */
    public function renderContent($name, $parameters = [], $throwException = true)
    {
        /**
         * @event cms.page.beforeRenderContent
         * Provides an opportunity to manipulate the name of the content file being rendered before it renders
         *
         * Example usage:
         *
         *     Event::listen('cms.page.beforeRenderContent', function ((\Cms\Classes\Controller) $controller, (string) $contentName) {
         *         return Cms\Classes\Content::loadCached($theme, 'custom-content-name');
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.beforeRenderContent', function ((string) $contentName) {
         *         return Cms\Classes\Content::loadCached($theme, 'custom-content-name');
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.page.beforeRenderContent', [$name])) {
            $content = $event;
        }
        else {
            $content = $this->loadContentObject($name);
        }

        if ($content === false) {
            if ($throwException) {
                throw new CmsException(Lang::get('cms::lang.content.not_found_name', ['name'=>$name]));
            }
            else {
                return false;
            }
        }

        $fileContent = $content->parsedMarkup;

        // Inject global view variables
        $globalVars = ViewHelper::getGlobalVars();
        if (!empty($globalVars)) {
            $parameters = (array) $parameters + $globalVars;
        }

        // Parse basic template variables
        if (!empty($parameters)) {
            $fileContent = TextParser::parse($fileContent, $parameters);
        }

        /**
         * @event cms.page.renderContent
         * Provides an opportunity to manipulate the output of a content file after being rendered
         *
         * Example usage:
         *
         *     Event::listen('cms.page.renderContent', function ((\Cms\Classes\Controller) $controller, (string) $contentName, (string) &$fileContent) {
         *         return "Overriding content";
         *     });
         *
         * Or
         *
         *     $controller->bindEvent('page.renderContent', function ((string) $contentName, (string) &$fileContent) {
         *         return "Overriding content";
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.page.renderContent', [$name, &$fileContent])) {
            return $event;
        }

        return $fileContent;
    }

    /**
     * renderComponent renders a component's default content, preserves the previous component context.
     * @param $name
     * @param array $parameters
     * @return string Returns the component default contents.
     */
    public function renderComponent($name, $parameters = [])
    {
        $result = null;
        $previousContext = $this->componentContext;

        if ($componentObj = $this->findComponentByName($name)) {
            $componentObj->id = uniqid($name);
            $componentObj->setProperties(array_merge($componentObj->getProperties(), $parameters));
            $this->componentContext = $componentObj;
            $result = $componentObj->onRender();
        }

        if (!$result) {
            $result = $this->renderPartial($name.'::default', [], false);
        }

        $this->componentContext = $previousContext;
        return $result;
    }
}
