<?php namespace Backend\Models;

use File;
use Html;
use Cache;
use Config;
use Less_Parser;
use System\Models\SettingModel;
use Exception;

/**
 * EditorSetting that affect all users
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class EditorSetting extends SettingModel
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string settingsCode is a unique code for this object.
     */
    public $settingsCode = 'backend_editor_settings';

    /**
     * @var mixed settingsFields form fields
     */
    public $settingsFields = 'fields.yaml';

    /**
     * @var string The key to store rendered CSS in the cache under
     */
    public $cacheKey = 'backend::editor.custom_css';

    /**
     * @var string defaultHtmlAllowEmptyTags
     */
    protected $defaultHtmlAllowEmptyTags = 'textarea, a, i, iframe, object, video, style, script, .icon, .bi, .fa, .fr-emoticon, .fr-inner, path, line';

    /**
     * @var string defaultHtmlAllowTags
     */
    protected $defaultHtmlAllowTags = 'a, abbr, address, area, article, aside, audio, b, base, bdi, bdo, blockquote, br, button, canvas, caption, cite, code, col, colgroup, datalist, dd, del, details, dfn, dialog, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, hr, i, iframe, img, input, ins, kbd, keygen, label, legend, li, link, main, map, mark, menu, menuitem, meter, nav, noscript, object, ol, optgroup, option, output, p, param, pre, progress, queue, rp, rt, ruby, s, samp, script, style, section, select, small, source, span, strike, strong, sub, summary, sup, table, tbody, td, textarea, tfoot, th, thead, time, title, tr, track, u, ul, var, video, wbr';

    /**
     * @var string defaultHtmlAllowAttrs
     */
    protected $defaultHtmlAllowAttrs = '';

    /**
     * @var string defaultHtmlNoWrapTags
     */
    protected $defaultHtmlNoWrapTags = 'figure, script, style';

    /**
     * @var string defaultHtmlRemoveTags
     */
    protected $defaultHtmlRemoveTags = 'script, style';

    /**
     * @var string defaultHtmlLineBreakerTags
     */
    protected $defaultHtmlLineBreakerTags = 'figure, table, hr, iframe, form, dl';

    /**
     * @var array defaultHtmlStyleImage
     */
    protected $defaultHtmlStyleImage = [
        'oc-img-rounded' => 'Rounded',
        'oc-img-bordered' => 'Bordered',
    ];

    /**
     * @var array defaultHtmlStyleLink
     */
    protected $defaultHtmlStyleLink = [
        'oc-link-green' => 'Green',
        'oc-link-strong' => 'Strong',
    ];

    /**
     * @var array defaultHtmlStyleParagraph
     */
    protected $defaultHtmlStyleParagraph = [
        'oc-text-bordered' => 'Bordered',
        'oc-text-gray' => 'Gray',
        'oc-text-spaced' => 'Spaced',
        'oc-text-uppercase' => 'Uppercase',
    ];

    protected $defaultHtmlStyleInline = [
        'oc-class-code' => 'Code',
        'oc-class-highlighted' => 'Highlighted',
        'oc-class-transparency' => 'Transparent',
    ];

    /**
     * @var array defaultHtmlStyleTable
     */
    protected $defaultHtmlStyleTable = [
        'oc-dashed-borders' => 'Dashed Borders',
        'oc-alternate-rows' => 'Alternate Rows',
    ];

    /**
     * @var array defaultHtmlStyleTableCell
     */
    protected $defaultHtmlStyleTableCell = [
        'oc-cell-highlighted' => 'Highlighted',
        'oc-cell-thick-border' => 'Thick Border',
    ];

    /**
     * @var array defaultHtmlParagraphFormats
     */
    protected $defaultHtmlParagraphFormats = [
        'N' => 'Normal',
        'H1' => 'Heading 1',
        'H2' => 'Heading 2',
        'H3' => 'Heading 3',
        'H4' => 'Heading 4',
        'PRE' => 'Code',
    ];

    /**
     * @var array editorToolbarPresets for Froala
     */
    protected $editorToolbarPresets = [
        'default' => 'paragraphFormat, paragraphStyle, quote, bold, italic, align, formatOL, formatUL, insertTable,
                      insertSnippet, insertPageLink, insertImage, insertVideo, insertAudio, insertFile, insertHR, fullscreen, html',
        'minimal' => 'bold, italic, underline, |, insertSnippet, insertPageLink, insertImage, |, html',
        'full'    => 'undo, redo, |, bold, italic, underline, |, paragraphFormat, paragraphStyle, inlineStyle, |,
                      strikeThrough, subscript, superscript, clearFormatting, |, fontFamily, fontSize, |, color,
                      emoticons, icons, -, selectAll, |, align, formatOL, formatUL, outdent, indent, quote, |, insertHR,
                      insertSnippet, insertPageLink, insertImage, insertVideo, insertAudio, insertFile, insertTable, |, selectAll,
                      html, fullscreen',
    ];

    /**
     * Validation rules
     */
    public $rules = [];

    /**
     * Initialize the seed data for this model. This only executes when the
     * model is first created or reset to default.
     * @return void
     */
    public function initSettingsData()
    {
        $this->html_toolbar_buttons = static::getBaseConfig('toolbar_buttons', '');
        $this->html_allow_empty_tags = static::getBaseConfig('allow_empty_tags', $this->defaultHtmlAllowEmptyTags);
        $this->html_allow_tags = static::getBaseConfig('allow_tags', $this->defaultHtmlAllowTags);
        $this->html_no_wrap_tags = static::getBaseConfig('no_wrap_tags', $this->defaultHtmlNoWrapTags);
        $this->html_remove_tags = static::getBaseConfig('remove_tags', $this->defaultHtmlRemoveTags);
        $this->html_line_breaker_tags = static::getBaseConfig('line_breaker_tags', $this->defaultHtmlLineBreakerTags);
        $this->html_style_image = $this->makeStylesForTable(static::getBaseConfig('style_image', $this->defaultHtmlStyleImage));
        $this->html_style_link = $this->makeStylesForTable(static::getBaseConfig('style_link', $this->defaultHtmlStyleLink));
        $this->html_paragraph_formats = $this->makeFormatsForTable(static::getBaseConfig('paragraph_formats', $this->defaultHtmlParagraphFormats));
        $this->html_style_paragraph = $this->makeStylesForTable(static::getBaseConfig('style_paragraph', $this->defaultHtmlStyleParagraph));
        $this->html_style_inline = $this->makeStylesForTable(static::getBaseConfig('style_inline', $this->defaultHtmlStyleInline));
        $this->html_style_table = $this->makeStylesForTable(static::getBaseConfig('style_table', $this->defaultHtmlStyleTable));
        $this->html_style_table_cell = $this->makeStylesForTable(static::getBaseConfig('style_table_cell', $this->defaultHtmlStyleTableCell));

        // Attempt to load custom CSS
        $htmlCssPath = File::symbolizePath(self::getBaseConfig('stylesheet_path', '~/modules/backend/models/editorsetting/default_styles.less'));
        if ($htmlCssPath && File::exists($htmlCssPath)) {
            $this->html_custom_styles = File::get($htmlCssPath);
        }
    }

    /**
     * beforeSave
     */
    public function beforeSave()
    {
        if ($this->isDirty('html_custom_styles')) {
            $this->html_custom_styles = Html::clean($this->html_custom_styles);
        }
    }

    /**
     * clearCache
     */
    public function clearCache()
    {
        parent::clearCache();

        Cache::forget($this->cacheKey);
    }

    /**
     * makeStylesForTable
     */
    protected function makeStylesForTable($arr)
    {
        $count = 0;

        return array_build($arr, function ($key, $value) use (&$count) {
            return [$count++, ['class_label' => $value, 'class_name' => $key]];
        });
    }

    /**
     * makeFormatsForTable
     */
    protected function makeFormatsForTable($arr)
    {
        $count = 0;

        return array_build($arr, function ($key, $value) use (&$count) {
            return [$count++, ['format_label' => $value, 'format_tag' => $key]];
        });
    }

    /**
     * getConfiguredStyles same as getConfigured but uses special style structure.
     */
    public static function getConfiguredStyles($key, $default = null)
    {
        $instance = static::instance();

        $value = $instance->get($key);

        $defaultValue = $instance->getDefaultValue($key);

        if (is_array($value)) {
            $value = array_filter(array_build($value, function ($key, $value) {
                if (array_has($value, ['class_name', 'class_label'])) {
                    return [
                        array_get($value, 'class_name'),
                        array_get($value, 'class_label')
                    ];
                }
            }));
        }

        return $value != $defaultValue ? $value : $default;
    }

    /**
     * getConfiguredFormats same as getConfigured but uses a special structure for paragraph formats.
     */
    public static function getConfiguredFormats($key, $default = null)
    {
        $instance = static::instance();

        $value = $instance->get($key);

        $defaultValue = $instance->getDefaultValue($key);

        if (is_array($value)) {
            $value = array_filter(array_build($value, function ($key, $value) {
                if (array_has($value, ['format_tag', 'format_label'])) {
                    return [
                        array_get($value, 'format_tag'),
                        array_get($value, 'format_label')
                    ];
                }
            }));
        }

        return $value != $defaultValue ? $value : $default;
    }

    /**
     * getConfigured returns the value only if it differs from the default value.
     */
    public static function getConfigured($key, $default = null)
    {
        $instance = static::instance();

        $value = $instance->get($key);

        $defaultValue = $instance->getDefaultValue($key);

        return $value != $defaultValue ? $value : $default;
    }

    /**
     * getDefaultValue
     */
    public function getDefaultValue($attribute)
    {
        $property = 'default'.studly_case($attribute);

        return $this->$property;
    }

    /**
     * getEditorToolbarPresets returns the editor toolbar presets without line breaks.
     */
    public function getEditorToolbarPresets(): array
    {
        return array_map(function($value) {
            return preg_replace('/\s+/', ' ', $value);
        }, $this->editorToolbarPresets);
    }

    /**
     * renderCss
     */
    public static function renderCss()
    {
        $cacheKey = self::instance()->cacheKey;

        if ($cache = Cache::memo()->get($cacheKey)) {
            return $cache;
        }

        try {
            $customCss = self::compileCss();
            Cache::forever($cacheKey, $customCss);
        }
        catch (Exception $ex) {
            $customCss = '/* ' . $ex->getMessage() . ' */';
        }

        return $customCss;
    }

    /**
     * compileCss
     */
    public static function compileCss()
    {
        $parser = new Less_Parser(['compress' => true]);

        $customStyles = '.fr-view {';
        $customStyles .= self::get('html_custom_styles');
        $customStyles .= '}';

        $parser->parse($customStyles);

        return $parser->getCss();
    }

    //
    // Base line configuration
    //

    /**
     * getBaseConfig will only look at base config if the enabled flag is true
     */
    public static function getBaseConfig(string $value, $default = null)
    {
        if (!self::isBaseConfigured()) {
            return $default;
        }

        return Config::get('editor.html_defaults.'.$value, $default);
    }

    /**
     * isBaseConfigured checks if base brand settings found in config
     */
    public static function isBaseConfigured(): bool
    {
        return (bool) Config::get('editor.html_defaults.enabled', false);
    }
}
