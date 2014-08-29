<?php namespace Cms\Classes;

use Cms\Classes\Theme;
use System\Classes\ApplicationException;
use Cms\Classes\Layout;
use Lang;

/**
 * The CMS page class.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Page extends CmsCompoundObject
{
    protected $settingsValidationRules = [
        'title' => 'required',
        'url'   => ['required', 'regex:/^\/[a-z0-9\/\:_\-\*\[\]\+\?\|\.]*$/i']
    ];

    /**
     * Creates an instance of the object and associates it with a CMS theme.
     * @param \Cms\Classes\Theme $theme Specifies the theme the object belongs to.
     */
    public function __construct(Theme $theme = null)
    {
        parent::__construct($theme);

        $this->settingsValidationMessages = [
            'url.regex' => Lang::get('cms::lang.page.invalid_url')
        ];
    }

    protected function parseSettings() {}

    /**
     * Returns the directory name corresponding to the object type.
     * For pages the directory name is "pages", for layouts - "layouts", etc.
     * @return string
     */
    public static function getObjectTypeDirName()
    {
        return 'pages';
    }

    /**
     * Returns name of a PHP class to us a parent for the PHP class created for the object's PHP section.
     * @return mixed Returns the class name or null.
     */
    public function getCodeClassParent()
    {
        return '\Cms\Classes\PageCode';
    }

    /**
     * Returns a list of layouts available in the theme. 
     * This method is used by the form widget.
     * @return array Returns an array of strings.
     */
    public function getLayoutOptions()
    {
        if (!($theme = Theme::getEditTheme()))
            throw new ApplicationException(Lang::get('cms::lang.theme.edit.not_found'));

        $layouts = Layout::listInTheme($theme, true);
        $result = [];
        $result[null] = Lang::get('cms::lang.page.no_layout');
        foreach ($layouts as $layout) {
            $baseName = $layout->getBaseFileName();
            $result[$baseName] = strlen($layout->name) ? $layout->name : $baseName;
        }

        return $result;
    }

    /**
     * Helper that returns a nicer list of pages for use in dropdowns.
     * @return array
     */
    public static function getNameList()
    {
        $result = [];
        $pages = self::sortBy('baseFileName')->all();
        foreach ($pages as $page) {
            $result[$page->baseFileName] = $page->title.' ('.$page->baseFileName.')';
        }

        return $result;
    }

    /**
     * Helper that makes a URL for a page in the active theme.
     * @return string
     */
    public static function url($page, $params = [])
    {
        $controller = new Controller;
        return $controller->pageUrl($page, $params);
    }
}
