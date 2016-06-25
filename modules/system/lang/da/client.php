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
        'quote' => 'Citat',
        'code' => 'Kode',
        'header1' => 'Overskrift 1',
        'header2' => 'Overskrift 2',
        'header3' => 'Overskrift 3',
        'header4' => 'Overskrift 4',
        'header5' => 'Overskrift 5',
        'header6' => 'Overskrift 6',
        'bold' => 'Fed',
        'italic' => 'Skrå',
        'unorderedlist' => 'Usorteret Liste',
        'orderedlist' => 'Nummereret Liste',
        'video' => 'Video',
        'image' => 'Billede',
        'link' => 'Link',
        'horizontalrule' => 'Indsæt horisontal streg',
        'fullscreen' => 'Fuld skærm',
        'preview' => 'Forhåndsvisning',
    ],

    'mediamanager' => [
        'insert_link' => "Indsæt Link",
        'insert_image' => "Indsæt Billede",
        'insert_video' => "Indsæt Video",
        'insert_audio' => "Indsæt Lyd",
        'invalid_file_empty_insert' => "Vælg venligst en fil, at indsætte et link til.",
        'invalid_file_single_insert' => "Vælg venligst en enkel fil.",
        'invalid_image_empty_insert' => "Vælg venligst et eller flere billeder, at indsætte.",
        'invalid_video_empty_insert' => "Vælg venligst en videofil, at indsætte.",
        'invalid_audio_empty_insert' => "Vælg venligst en lydfil, at indsætte.",
    ],

    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Fortryd',
    ],

    'datepicker' => [
        'previousMonth' => 'Sidste Måned',
        'nextMonth' => 'Næste Måned',
        'months' => ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'],
        'weekdays' => ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
        'weekdaysShort' => ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør']
    ],

    'filter' => [
        'group' => [
            'all' => 'Alle'
        ],
        'dates' => [
            'all' => 'alle',
            'filter_button_text' => 'Filter',
            'reset_button_text'  => 'Nulstil',
            'date_placeholder' => 'Dato',
            'after_placeholder' => 'Efter',
            'before_placeholder' => 'Før'
        ]
    ],

    'eventlog' => [
        'show_stacktrace' => 'Vis stacktracen',
        'hide_stacktrace' => 'Skjul stacktracen',
        'tabs' => [
            'formatted' => 'Formateret',
            'raw' => 'Rå',
        ],
        'editor' => [
            'title' => 'Kildekode redigeringsværktøj',
            'description' => 'Dit operativsystem bør konfigureres til at lytte til et af disse URL-skemaer.',
            'openWith' => 'Åben med',
            'remember_choice' => 'Husk valgte mulighed for denne session',
            'open' => 'Åben',
            'cancel' => 'Fortryd'
        ]
    ]
];
