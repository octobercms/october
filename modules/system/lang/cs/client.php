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
        'formatting' => 'Formátování',
        'quote' => 'Citace',
        'code' => 'Kód',
        'header1' => 'Nadpis 1',
        'header2' => 'Nadpis 2',
        'header3' => 'Nadpis 3',
        'header4' => 'Nadpis 4',
        'header5' => 'Nadpis 5',
        'header6' => 'Nadpis 6',
        'bold' => 'Tučně',
        'italic' => 'Kurzívou',
        'unorderedlist' => 'Nečíslovaný seznam',
        'orderedlist' => 'Číslovaný seznam',
        'video' => 'Video',
        'image' => 'Obrázek',
        'link' => 'Odkaz',
        'horizontalrule' => 'Vložit horizontální linku',
        'fullscreen' => 'Celá obrazovka',
        'preview' => 'Náhled',
    ],

    'mediamanager' => [
        'insert_link' => "Vložit odkaz",
        'insert_image' => "Vložit obrázek",
        'insert_video' => "Vložit video",
        'insert_audio' => "Vložit zvuk",
        'invalid_file_empty_insert' => "Prosím vyberte soubor, na který se vloží odkaz.",
        'invalid_file_single_insert' => "Vyberte jeden soubor.",
        'invalid_image_empty_insert' => "Vyberte soubor(y) pro vložení.",
        'invalid_video_empty_insert' => "Vyberte video soubor pro vložení.",
        'invalid_audio_empty_insert' => "Vyberte audio soubor pro vložení.",
    ],

    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Zrušit',
        'widget_remove_confirm' => 'Odstranit widget?'
    ],
    'datepicker' => [
        'previousMonth' => 'Předchozí měsíc',
        'nextMonth' => 'Následující měsíc',
        'months' => ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'],
        'weekdays' => ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'],
        'weekdaysShort' => ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So']
    ],
    'colorpicker' => [
        'choose' => 'Ok',
    ],
    'filter' => [
        'group' => [
            'all' => 'Vše'
        ],
        'dates' => [
            'all' => 'Vše',
            'filter_button_text' => 'Filtrovat',
            'reset_button_text'  => 'Zrušit',
            'date_placeholder' => 'Datum',
            'after_placeholder' => 'Po',
            'before_placeholder' => 'Před'
        ]
    ],
    'eventlog' => [
        'show_stacktrace' => 'Zobrazit stacktrace',
        'hide_stacktrace' => 'Skrýt stacktrace',
        'tabs' => [
            'formatted' => 'Formátováno',
            'raw' => 'Původní (raw)',
        ],
        'editor' => [
            'title' => 'Editor zdrojového kódu',
            'description' => 'Váš operační systém by měl být konfigurován tak, aby naslouchal jednomu z těchto schémat adres URL.',
            'openWith' => 'Otevřít v',
            'remember_choice' => 'Zapamatovat si vybranou volbu pro tuto relaci',
            'open' => 'Otevřít',
            'cancel' => 'Zrušit'
        ]
    ]
];
