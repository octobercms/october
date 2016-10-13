<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Client-side Language Lines
    |--------------------------------------------------------------------------
    |
    | These are messages made available to the client browser via JavaScript.
    | To compile this file run: php artisan october:util compile lang
    |
    */

    'markdowneditor' => [
        'formatting' => 'Formatering',
        'quote' => 'Sitat',
        'code' => 'Kode',
        'header1' => 'Overskrift 1',
        'header2' => 'Overskrift 2',
        'header3' => 'Overskrift 3',
        'header4' => 'Overskrift 4',
        'header5' => 'Overskrift 5',
        'header6' => 'Overskrift 6',
        'bold' => 'Fet',
        'italic' => 'Kursiv',
        'unorderedlist' => 'Punktliste',
        'orderedlist' => 'Nummerert liste',
        'video' => 'Video',
        'image' => 'Bilde',
        'link' => 'Lenke',
        'horizontalrule' => 'Sett inn horisontal linje',
        'fullscreen' => 'Fullskjerm',
        'preview' => 'Forhåndsvisning',
    ],

    'mediamanager' => [
        'insert_link' => 'Sett inn Media lenke',
        'insert_image' => 'Sett inn Media bilde',
        'insert_video' => 'Sett inn Media video',
        'insert_audio' => 'Sett inn Media lyd',
        'invalid_file_empty_insert' => 'Velg fil å sette lenken inn i.',
        'invalid_file_single_insert' => 'Vennligst velg én enkelt fil.',
        'invalid_image_empty_insert' => 'Velg bilde(r) å sette inn.',
        'invalid_video_empty_insert' => 'Velg en video å sette inn.',
        'invalid_audio_empty_insert' => 'Velg lyd å sette inn.',
    ],

    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Avbryt',
        'widget_remove_confirm' => 'Fjerne widget?'
    ],

    'datepicker' => [
        'previousMonth' => 'Forrige måned',
        'nextMonth' => 'Neste måned',
        'months' => ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'july', 'august', 'september', 'oktober', 'november', 'desember'],
        'weekdays' => ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
        'weekdaysShort' => ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør']
    ],

    'filter' => [
        'group' => [
            'all' => 'alle'
        ],
        'dates' => [
            'all' => 'alle',
            'filter_button_text' => 'Filter',
            'reset_button_text'  => 'Tilbakestill',
            'date_placeholder' => 'Dato',
            'after_placeholder' => 'Etter',
            'before_placeholder' => 'Før'
        ]
    ],

    'eventlog' => [
        'show_stacktrace' => 'Vis stacktrace',
        'hide_stacktrace' => 'Skjul stacktrace',
        'tabs' => [
            'formatted' => 'Formattert',
            'raw' => 'Raw',
        ],
        'editor' => [
            'title' => 'Kildekodeeditor',
            'description' => 'Ditt operativsystem bør være konfigurert for å åpne ett av disse URL-schemaene.',
            'openWith' => 'Åpne med',
            'remember_choice' => 'Husk valget for denne sesjonen',
            'open' => 'Åpne',
            'cancel' => 'Avbryt'
        ]
    ]
];
