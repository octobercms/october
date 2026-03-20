<?php namespace Cms\Classes;

use File;
use Event;
use Cms\Classes\Theme;
use Cms\Models\PageLookupItem;
use Cms\Classes\Controller as CmsController;

/**
 * PageManager provides abstraction level for the page lookup operations.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PageManager
{
    /**
     * url is a helper that makes a URL for a page lookup item.
     * Optional params are merged and used during URL resolution.
     */
    public static function url($address, $params = []): string
    {
        return (string) (static::resolve($address, ['params' => $params])->url ?? '');
    }

    /**
     * resolve is a helper that makes a page lookup item from a schema.
     *
     * Supported options:
     * - nesting: Boolean value requesting nested items. Optional, false if omitted.
     */
    public static function resolve($address, array $options = []): ?PageLookupItem
    {
        if ($address instanceof PageLookupItem) {
            return $address;
        }

        return PageLookupItem::resolveFromSchema((string) $address, $options);
    }

    /**
     * processMarkup converts links and snippets
     */
    public static function processMarkup($markup): string
    {
        $markup = self::processLinks($markup);
        $markup = self::processSnippets($markup);

        /**
         * @event cms.content.postProcessMarkup
         * Provides opportunity to hook into the post-processing of content markup
         *
         * Example usage:
         *
         *     Event::listen('cms.content.postProcessMarkup', function ((string) &$content) {
         *         $content = str_replace('<a href=', '<a rel="nofollow" href=', $content);
         *     });
         *
         */
        Event::fire('cms.content.postProcessMarkup', [&$markup]);

        return $markup;
    }

    /**
     * processMarkup will replace links in content with resolved versions
     * For example: ="october://xxx" → ="https://..."
     */
    public static function processLinks($markup): string
    {
        $searches = $replaces = [];
        if (preg_match_all('/="(october:\/\/[^"#]+)(#[^"]+)?"/i', $markup, $matches)) {
            foreach ($matches[0] as $index => $search) {
                $ocUrl = $matches[1][$index] ?? null;
                if (!$ocUrl) {
                    continue;
                }

                $url = static::url($ocUrl);
                if (!$url) {
                    continue;
                }

                $fragment = $matches[2][$index] ?? '';

                if (in_array($search, $searches)) {
                    continue;
                }

                $searches[] = $search;
                $replaces[] = '="' . $url . $fragment . '"';
            }
        }

        if ($searches) {
            $markup = str_replace($searches, $replaces, $markup);
        }

        return (string) $markup;
    }

    /**
     * processSnippets will replace snippets in content
     */
    public static function processSnippets($markup): string
    {
        $searches = $replaces = [];

        $theme = Theme::getActiveTheme();

        $parsedSnippets = self::extractSnippetsFromMarkup($markup, $theme);

        $snippetMap = SnippetManager::instance()->getPartialSnippetMap($theme);

        foreach ($parsedSnippets as $snippetDeclaration => $snippetInfo) {
            $snippetCode = $snippetInfo['code'] ?? '';

            if ($snippetCode && isset($snippetInfo['component'])) {
                $generatedMarkup = self::generateMarkupForComponent($snippetInfo['component'], $snippetInfo);
            }
            elseif ($snippetCode && isset($snippetMap[$snippetCode])) {
                $generatedMarkup = self::generateMarkupForPartial($snippetMap[$snippetCode], $snippetInfo);
            }
            else {
                $generatedMarkup = '<!-- ' . __("Snippet with the requested code :code was not found in the theme.", ['code' => $snippetCode]) . ' -->';
            }

            $searches[] = $snippetDeclaration;
            $replaces[] = $generatedMarkup;
        }

        if ($searches) {
            $markup = str_replace($searches, $replaces, $markup);
        }

        return (string) $markup;
    }

    /**
     * generateMarkupForPartial
     */
    protected static function generateMarkupForPartial($partialName, $snippetInfo)
    {
        $controller = CmsController::getController();
        $partialName = File::anyname($partialName);
        $snippetAjax = $snippetInfo['useAjax'];

        $generatedMarkup = '';
        $generatedMarkup .= $snippetAjax ? '<div data-ajax-partial="'.e($partialName).'">' : '';
        $generatedMarkup .= $controller->renderPartial($partialName, $snippetInfo['properties']);
        $generatedMarkup .= $snippetAjax ? '</div>' : '';

        return $generatedMarkup;
    }

    /**
     * generateMarkupForPartial
     */
    protected static function generateMarkupForComponent($componentClass, $snippetInfo)
    {
        $controller = CmsController::getController();
        $snippetCode = $snippetInfo['code'];
        $snippetAjax = $snippetInfo['useAjax'];
        $snippetProperties = $snippetInfo['properties'] ?? [];

        if (!$controller->findComponentByName($snippetCode)) {
            $componentObj = $controller->addComponent($componentClass, $snippetCode, $snippetProperties);
            $componentObj->runLifeCycle();
        }

        $generatedMarkup = '';
        $generatedMarkup .= $snippetAjax ? '<div data-ajax-partial="'.e($snippetCode).'::default">' : '';
        $generatedMarkup .= $controller->renderComponent($snippetCode);
        $generatedMarkup .= $snippetAjax ? '</div>' : '';

        return $generatedMarkup;
    }

    /**
     * extractSnippetsFromMarkup
     */
    protected static function extractSnippetsFromMarkup(string $markup, $theme): array
    {
        $map = [];
        $matches = [];

        // Converts a json: payload from the inspector
        $processPropertyValue = function($value) {
            return str_starts_with($value, 'json:')
                ? json_decode(urldecode(substr($value, 5)), true)
                : $value;
        };

        if (preg_match_all('/\<figure\s+[^\>]+\>[^<]*\<\/figure\>/i', $markup, $matches)) {
            foreach ($matches[0] as $snippetDeclaration) {
                $nameMatch = [];
                if (!preg_match('/data\-snippet\s*=\s*"([^"]+)"/', $snippetDeclaration, $nameMatch)) {
                    continue;
                }

                $snippetCode = $nameMatch[1];
                $properties = [];
                $propertyMatches = [];
                if (preg_match_all('/data\-property-(?<property>[^=]+)\s*=\s*\"(?<value>[^\"]+)\"/i', $snippetDeclaration, $propertyMatches)) {
                    foreach ($propertyMatches['property'] as $index => $propertyName) {
                        $properties[$propertyName] = $processPropertyValue($propertyMatches['value'][$index]);
                    }
                }

                $componentMatch = [];
                $componentClass = null;
                if (preg_match('/data\-component\s*=\s*"([^"]+)"/', $snippetDeclaration, $componentMatch)) {
                    $componentClass = $componentMatch[1];
                }

                $snippetAjaxMatches = [];
                $snippetAjax = false;
                if (preg_match('/data\-ajax\s*=\s*"([^"]+)"/', $snippetDeclaration, $snippetAjaxMatches)) {
                    $snippetAjax = $snippetAjaxMatches[1] === 'true' || $snippetAjaxMatches[1] === '1';
                }

                // Apply default values for properties not defined in the markup
                // and normalize property code names.
                $properties = self::preprocessPropertyValues($theme, $snippetCode, $componentClass, $properties);
                $map[$snippetDeclaration] = [
                    'code' => $snippetCode,
                    'useAjax' => $snippetAjax,
                    'component' => $componentClass,
                    'properties' => $properties
                ];
            }
        }

        return $map;
    }

    /**
     * preprocessPropertyValues applies default property values and fixes property names.
     *
     * As snippet properties are defined with data attributes, they are lower case, whereas
     * real property names are case sensitive. This method finds original property names defined
     * in snippet classes or partials and replaces property names defined in the static page markup.
     */
    protected static function preprocessPropertyValues($theme, $snippetCode, $componentClass, $properties)
    {
        $manager = SnippetManager::instance();
        $snippet = $manager->findByCodeOrComponent($theme, $snippetCode, $componentClass, true);

        // Try without cache
        if (!$snippet) {
            $snippet = $manager->findByCodeOrComponent($theme, $snippetCode, $componentClass, false);
        }

        // Cannot proceed
        if (!$snippet) {
            return [];
        }

        $properties = array_change_key_case($properties);
        $snippetProperties = $snippet->getProperties();

        foreach ($snippetProperties as $propertyInfo) {
            $propertyCode = $propertyInfo['property'];
            $lowercaseCode = strtolower($propertyCode);

            if (!array_key_exists($lowercaseCode, $properties)) {
                if (array_key_exists('default', $propertyInfo)) {
                    $properties[$propertyCode] = $propertyInfo['default'];
                }
            }
            else {
                $markupPropertyInfo = $properties[$lowercaseCode];
                unset($properties[$lowercaseCode]);
                $properties[$propertyCode] = $markupPropertyInfo;
            }
        }

        return $properties;
    }
}
