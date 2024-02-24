<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default HTML Editor Settings
    |--------------------------------------------------------------------------
    |
    | The default editor settings. These values are all optional and remember to
    | set the enabled value to true. The `editor_options` provides defaults
    | for the `editorOptions` property.
    |
    | See https://docs.octobercms.com/3.x/element/form/widget-richeditor.html
    |
    */

    'html_defaults' => [
        'enabled' => false,
        'stylesheet_path' => '~/app/assets/css/editor_styles.css',
        'toolbar_buttons' => 'paragraphFormat, paragraphStyle, quote, bold, italic, align, formatOL, formatUL, insertTable, insertSnippet, insertPageLink, insertImage, insertVideo, insertAudio, insertFile, insertHR, fullscreen, html',
        'allow_tags' => 'a, abbr, address, area, article, aside, audio, b, base, bdi, bdo, blockquote, br, button, canvas, caption, cite, code, col, colgroup, datalist, dd, del, details, dfn, dialog, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, hr, i, iframe, img, input, ins, kbd, keygen, label, legend, li, link, main, map, mark, menu, menuitem, meter, nav, noscript, object, ol, optgroup, option, output, p, param, pre, progress, queue, rp, rt, ruby, s, samp, script, style, section, select, small, source, span, strike, strong, sub, summary, sup, table, tbody, td, textarea, tfoot, th, thead, time, title, tr, track, u, ul, var, video, wbr',
        'allow_empty_tags' => 'textarea, a, i, iframe, object, video, style, script, .icon, .bi, .fa, .fr-emoticon, .fr-inner, path, line',
        'no_wrap_tags' => 'figure, script, style',
        'remove_tags' => 'script, style',
        'line_breaker_tags' => 'figure, table, hr, iframe, form, dl',
        'allow_attrs' => '',
        'paragraph_formats' => [
            'N' => 'Normal',
            'H1' => 'Heading 1',
            'H2' => 'Heading 2',
            'H3' => 'Heading 3',
            'H4' => 'Heading 4',
            'PRE' => 'Code',
        ],
        'style_paragraph' => [
            'oc-text-bordered' => 'Bordered',
            'oc-text-gray' => 'Gray',
            'oc-text-spaced' => 'Spaced',
            'oc-text-uppercase' => 'Uppercase',
        ],
        'style_link' => [
            'oc-link-green' => 'Green',
            'oc-link-strong' => 'Strong',
        ],
        'style_table' => [
            'oc-dashed-borders' => 'Dashed Borders',
            'oc-alternate-rows' => 'Alternate Rows',
        ],
        'style_table_cell' => [
            'oc-cell-highlighted' => 'Highlighted',
            'oc-cell-thick-border' => 'Thick Border',
        ],
        'style_image' => [
            'oc-img-rounded' => 'Rounded',
            'oc-img-bordered' => 'Bordered',
        ],
        'editor_options' => [],
    ],

];
