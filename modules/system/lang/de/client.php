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
        'formatting' => 'Formatierung',
        'quote' => 'Zitat',
        'code' => 'Code',
        'header1' => 'Überschrift 1',
        'header2' => 'Überschrift 2',
        'header3' => 'Überschrift 3',
        'header4' => 'Überschrift 4',
        'header5' => 'Überschrift 5',
        'header6' => 'Überschrift 6',
        'bold' => 'Fett',
        'italic' => 'Kursiv',
        'unorderedlist' => 'Normale Liste',
        'orderedlist' => 'Nummerierte Liste',
        'video' => 'Video',
        'image' => 'Bild',
        'link' => 'Link',
        'horizontalrule' => 'Horizontale Linie',
        'fullscreen' => 'Vollbild',
        'preview' => 'Vorschau',
    ],

    'mediamanager' => [
        'insert_link' => "Link aus Medienbibliothek",
        'insert_image' => "Bild aus Medienbibliothek",
        'insert_video' => "Video aus Medienbibliothek",
        'insert_audio' => "Audio aus Medienbibliothek",
        'invalid_file_empty_insert' => "Bitte Datei auswählen.",
        'invalid_file_single_insert' => "Bitte nur eine Datei wählen.",
        'invalid_image_empty_insert' => "Bitte ein Bild auswählen.",
        'invalid_video_empty_insert' => "Bitte ein Video auswählen.",
        'invalid_audio_empty_insert' => "Bitte eine Audiodatei auswählen.",
    ],

    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Abbrechen',
    ],

    'datepicker' => [
        'previousMonth' => 'Vorheriger Monat',
        'nextMonth' => 'Nächsten Monat',
        'months' => ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
        'weekdays' => ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        'weekdaysShort' => ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    ],

    'filter' => [
        'group' => [
            'all' => 'all'
        ],
        'dates' => [
            'all' => 'all',
            'filter_button_text' => 'Filter',
            'reset_button_text'  => 'Reset',
            'date_placeholder' => 'Date',
            'after_placeholder' => 'After',
            'before_placeholder' => 'Before'
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
