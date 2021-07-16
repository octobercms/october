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
        'insert_link' => 'Media Link invoegen',
        'insert_image' => 'Media Afbeelding invoegen',
        'insert_video' => 'Media Video invoegen',
        'insert_audio' => 'Media Audio invoegen',
        'invalid_file_empty_insert' => 'Selecteer bestand om een link naar te maken.',
        'invalid_file_single_insert' => 'Selecteer één bestand.',
        'invalid_image_empty_insert' => 'Selecteer afbeelding(en) om in te voegen.',
        'invalid_video_empty_insert' => 'Selecteer een video bestand om in te voegen.',
        'invalid_audio_empty_insert' => 'Selecteer een audio bestand om in te voegen.',
    ],
    'alert' => [
        'error' => 'Fout',
        'confirm' => 'Bevestigen',
        'dismiss' => 'Afwijzen',
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Annuleren',
        'widget_remove_confirm' => 'Deze widget verwijderen?',
    ],
    'datepicker' => [
        'previousMonth' => 'Vorige maand',
        'nextMonth' => 'Volgende maan',
        'months' => ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
        'weekdays' => ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
        'weekdaysShort' => ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za']
    ],
    'colorpicker' => [
        'choose' => 'OK',
    ],
    'filter' => [
        'group' => [
            'all' => 'alle',
        ],
        'scopes' => [
            'apply_button_text' => 'Toepassen',
            'clear_button_text' => 'Resetten',
        ],
        'dates' => [
            'all' => 'alle',
            'filter_button_text' => 'Filteren',
            'reset_button_text' => 'Resetten',
            'date_placeholder' => 'Datum',
            'after_placeholder' => 'Na',
            'before_placeholder' => 'Voor',
        ],
        'numbers' => [
            'all' => 'alle',
            'filter_button_text' => 'Filteren',
            'reset_button_text' => 'Resetten',
            'min_placeholder' => 'Minimum',
            'max_placeholder' => 'Maximum',
        ],
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
            'cancel' => 'Annuleren',
        ],
    ],
    'upload' => [
        'max_files' => 'Je kan niet meer bestanden uploaden.',
        'invalid_file_type' => 'Je kan geen bestanden van dit type uploaden.',
        'file_too_big' => 'Het bestand is te groot ({{filesize}}MB). Maximale bestandsgrootte: {{maxFilesize}}MB.',
        'response_error' => 'De server reageerde met de code {{statusCode}}.',
        'remove_file' => 'Verwijder bestand',
    ],
];
