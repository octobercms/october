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
        'formatting' => 'Opmaak',
        'quote' => 'Quote',
        'code' => 'Code',
        'header1' => 'Koptekst 1',
        'header2' => 'Koptekst 2',
        'header3' => 'Koptekst 3',
        'header4' => 'Koptekst 4',
        'header5' => 'Koptekst 5',
        'header6' => 'Koptekst 6',
        'bold' => 'Vet',
        'italic' => 'Cursief',
        'unorderedlist' => 'Ongeordende lijst',
        'orderedlist' => 'Gerangschikte lijst',
        'video' => 'Video',
        'image' => 'Afbeelding',
        'link' => 'Hyperlink',
        'horizontalrule' => 'Invoegen horizontale lijn',
        'fullscreen' => 'Volledig scherm',
        'preview' => 'Voorbeeldweergave',
    ],
    'mediamanager' => [
        'insert_link' => 'Invoegen Media Link',
        'insert_image' => 'Invoegen Media Afbeelding',
        'insert_video' => 'Invoegen Media Video',
        'insert_audio' => 'Invoegen Media Audio',
        'invalid_file_empty_insert' => 'Selecteer bestand om een link naar te maken.',
        'invalid_file_single_insert' => 'Selecteer één bestand.',
        'invalid_image_empty_insert' => 'Selecteer afbeelding(en) om in te voegen.',
        'invalid_video_empty_insert' => 'Selecteer een video bestand om in te voegen.',
        'invalid_audio_empty_insert' => 'Selecteer een audio bestand om in te voegen.',
    ],
    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Annuleren',
        'widget_remove_confirm' => 'Deze widget verwijderen?'
    ],
    'datepicker' => [
        'previousMonth' => 'Vorige maand',
        'nextMonth' => 'Volgende maan',
        'months' => ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
        'weekdays' => ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
        'weekdaysShort' => ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za']
    ],
    'filter' => [
        'group' => [
            'all' => 'alle'
        ],
        'dates' => [
            'all' => 'alle',
            'filter_button_text' => 'Filteren',
            'reset_button_text'  => 'Resetten',
            'date_placeholder' => 'Datum',
            'after_placeholder' => 'Na',
            'before_placeholder' => 'Voor'
        ]
    ],
    'eventlog' => [
        'show_stacktrace' => 'Toon stacktrace',
        'hide_stacktrace' => 'Verberg stacktrace',
        'tabs' => [
            'formatted' => 'Geformatteerd',
            'raw' => 'Bronversie',
        ],
        'editor' => [
            'title' => 'Broncode editor',
            'description' => 'Je besturingssysteem moet in staat zijn om met deze URL-schema\'s om te kunnen gaan.',
            'openWith' => 'Openen met',
            'remember_choice' => 'Onthoudt de geselecteerde optie voor deze browser-sessie',
            'open' => 'Openen',
            'cancel' => 'Annuleren'
        ]
    ]
];
