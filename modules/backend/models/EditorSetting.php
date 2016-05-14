<?php namespace Backend\Models;

use File;
use Model;
use Exception;

/**
 * Editor settings that affect all users
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class EditorSetting extends Model
{
    use \System\Traits\ViewMaker;
    use \October\Rain\Database\Traits\Validation;

    public $implement = ['System.Behaviors.SettingsModel'];

    public $settingsCode = 'backend_editor_settings';

    public $settingsFields = 'fields.yaml';

    protected $defaultParagraphStyles = [
        'oc-text-bordered' => 'Bordered',
        'oc-text-gray' => 'Gray',
        'oc-text-spaced' => 'Spaced',
        'oc-text-uppercase' => 'Uppercase',
    ];

    protected $defaultTableStyles = [
        'oc-table-dashed-borders' => 'Dashed Borders',
        'oc-table-alternate-rows' => 'Alternate Rows',
    ];

    protected $defaultTableCellStyles = [
        'oc-cell-highlighted' => 'Highlighted',
        'oc-cell-thick-border' => 'Thick Border',
    ];

    protected $defaultImageStyles = [
        'oc-img-rounded' => 'Rounded',
        'oc-img-bordered' => 'Bordered',
    ];

    protected $defaultLinkStyles = [
        'oc-link-green' => 'Green',
        'oc-link-strong' => 'Strong',
    ];

    /**
     * Validation rules
     */
    public $rules = [];

    public function initSettingsData()
    {
        $this->html_allow_empty_tags = 'figure, textarea, a, iframe, object, video, style, script';
        $this->html_allow_tags = 'a, abbr, address, area, article, aside, audio, b, base, bdi, bdo, blockquote, br, button, canvas, caption, cite, code, col, colgroup, datalist, dd, del, details, dfn, dialog, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, hr, i, iframe, img, input, ins, kbd, keygen, label, legend, li, link, main, map, mark, menu, menuitem, meter, nav, noscript, object, ol, optgroup, option, output, p, param, pre, progress, queue, rp, rt, ruby, s, samp, script, style, section, select, small, source, span, strike, strong, sub, summary, sup, table, tbody, td, textarea, tfoot, th, thead, time, title, tr, track, u, ul, var, video, wbr';
        $this->html_no_wrap_tags = 'figure, script, style';
        $this->html_remove_tags = 'script,style';

        $this->html_custom_styles = File::get(base_path().'/modules/backend/models/editorsetting/default_styles.less');
        $this->html_style_paragraph = $this->makeStylesForTable($this->defaultParagraphStyles);
        $this->html_style_table = $this->makeStylesForTable($this->defaultTableStyles);
        $this->html_style_table_cell = $this->makeStylesForTable($this->defaultTableCellStyles);
        $this->html_style_image = $this->makeStylesForTable($this->defaultImageStyles);
        $this->html_style_link = $this->makeStylesForTable($this->defaultLinkStyles);
    }

    protected function makeStylesForTable($arr)
    {
        $count = 0;
        return array_build($arr, function($key, $value) use (&$count) {
            return [$count++, ['class_label' => $value, 'class_name' => $key]];
        });
    }
}
