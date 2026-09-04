<?php namespace Cms\Classes;

use Event;

/**
 * LangScanner scans theme templates for translatable strings used with the
 * translation filters and functions
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class LangScanner
{
    /**
     * @var \Cms\Classes\Theme theme to scan
     */
    protected $theme;

    /**
     * __construct the scanner for a theme
     */
    public function __construct(Theme $theme)
    {
        $this->theme = $theme;
    }

    /**
     * scan is a helper method that returns the found messages for a theme
     */
    public static function scan(Theme $theme): array
    {
        return (new static($theme))->scanForMessages();
    }

    /**
     * scanForMessages in the theme layouts, pages and partials
     */
    public function scanForMessages(): array
    {
        $messages = [];

        foreach (Layout::listInTheme($this->theme, true) as $layout) {
            $messages = array_merge($messages, $this->parseContent($layout->markup));
        }

        foreach (Page::listInTheme($this->theme, true) as $page) {
            $messages = array_merge($messages, $this->parseContent($page->markup));
        }

        foreach (Partial::listInTheme($this->theme, true) as $partial) {
            $messages = array_merge($messages, $this->parseContent($partial->markup));
        }

        $messages = array_values(array_unique($messages));

        sort($messages);

        return $messages;
    }

    /**
     * parseContent extracts translatable strings from template markup
     */
    public function parseContent(?string $content): array
    {
        if (!$content) {
            return [];
        }

        $messages = $this->processTwigTags($content);

        /**
         * @event cms.langScanner.extractMessages
         * Fires when extracting messages from template content, listeners may return additional messages.
         *
         * Example usage:
         *
         *     Event::listen('cms.langScanner.extractMessages', function (string $content) {
         *         return ['Found message'];
         *     });
         *
         */
        $results = Event::fire('cms.langScanner.extractMessages', [$content]);

        if (is_array($results)) {
            foreach ($results as $result) {
                if (is_array($result) && $result) {
                    $messages = array_merge($messages, array_values($result));
                }
            }
        }

        return $messages;
    }

    /**
     * processTwigTags finds string literals passed to the translation filters
     * (|trans, |_, |__, |trans_choice, |transchoice) and functions (__, trans,
     * trans_choice) inside Twig expressions
     */
    protected function processTwigTags(string $content): array
    {
        $messages = [];

        // Collect Twig output and statement expressions
        preg_match_all('#{{.*?}}|{%.*?%}#s', $content, $twigTags);

        $filterNames = '(?:trans_choice|transchoice|trans|__|_)';
        $functionNames = '(?:__|trans_choice|trans)';

        $patterns = [
            "#'([^']+)'\s*\|\s*{$filterNames}(?![\w])#",
            "#\"([^\"]+)\"\s*\|\s*{$filterNames}(?![\w])#",
            "#(?<![\w]){$functionNames}\s*\(\s*'([^']+)'#",
            "#(?<![\w]){$functionNames}\s*\(\s*\"([^\"]+)\"#",
        ];

        foreach ($twigTags[0] as $tag) {
            foreach ($patterns as $pattern) {
                preg_match_all($pattern, $tag, $match);
                if (!empty($match[1])) {
                    $messages = array_merge($messages, $match[1]);
                }
            }
        }

        return $messages;
    }
}
