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
        'formatting' => 'Muotoilu',
        'quote' => 'Lainaus',
        'code' => 'Koodi',
        'header1' => 'Otsikko 1',
        'header2' => 'Otsikko 2',
        'header3' => 'Otsikko 3',
        'header4' => 'Otsikko 4',
        'header5' => 'Otsikko 5',
        'header6' => 'Otsikko 6',
        'bold' => 'Lihavointi',
        'italic' => 'Kursiivi',
        'unorderedlist' => 'Järjestämätön listaus',
        'orderedlist' => 'Järjestetty listaus',
        'video' => 'Video',
        'image' => 'Kuva',
        'link' => 'Linkki',
        'horizontalrule' => 'Lisää horisontaalinen jakaja',
        'fullscreen' => 'Täysinäyttö',
        'preview' => 'Esikatselu',
    ],
    'mediamanager' => [
        'insert_link' => 'Insert Media Link',
        'insert_image' => 'Insert Media Image',
        'insert_video' => 'Insert Media Video',
        'insert_audio' => 'Insert Media Audio',
        'invalid_file_empty_insert' => 'Please select file to insert a links to.',
        'invalid_file_single_insert' => 'Please select a single file.',
        'invalid_image_empty_insert' => 'Please select image(s) to insert.',
        'invalid_video_empty_insert' => 'Please select a video file to insert.',
        'invalid_audio_empty_insert' => 'Please select an audio file to insert.',
    ],
    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Peruuta',
        'widget_remove_confirm' => 'Poista tämä vimpain?'
    ],
    'datepicker' => [
        'previousMonth' => 'Previous Month',
        'nextMonth' => 'Next Month',
        'months' => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        'weekdays' => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'weekdaysShort' => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    ],
    'filter' => [
        'group' => [
            'all' => 'kaikki'
        ],
        'dates' => [
            'all' => 'kaikki',
            'filter_button_text' => 'Suodin',
            'reset_button_text'  => 'Nollaa',
            'date_placeholder' => 'PVM',
            'after_placeholder' => 'Jälkeen',
            'before_placeholder' => 'Ennen'
        ]
    ],
    'eventlog' => [
        'show_stacktrace' => 'Show the stacktrace',
        'hide_stacktrace' => 'Hide the stacktrace',
        'tabs' => [
            'formatted' => 'Formatted',
            'raw' => 'Raw',
        ],
        'editor' => [
            'title' => 'Source code editor',
            'description' => 'Your operating system should be configured to listen to one of these URL schemes.',
            'openWith' => 'Open with',
            'remember_choice' => 'Remember selected option for this session',
            'open' => 'Open',
            'cancel' => 'Cancel'
        ]
    ]
];
