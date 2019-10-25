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
        'formatting' => 'Forráskód',
        'quote' => 'Idézet',
        'code' => 'Kód',
        'header1' => 'Címsor 1',
        'header2' => 'Címsor 2',
        'header3' => 'Címsor 3',
        'header4' => 'Címsor 4',
        'header5' => 'Címsor 5',
        'header6' => 'Címsor 6',
        'bold' => 'Félkövér',
        'italic' => 'Dölt',
        'unorderedlist' => 'Rendezett lista',
        'orderedlist' => 'Számozott lista',
        'video' => 'Videó',
        'image' => 'Kép',
        'link' => 'Hivatkozás',
        'horizontalrule' => 'Vonal beszúrása',
        'fullscreen' => 'Teljes képernyő',
        'preview' => 'Előnézet'
    ],

    'mediamanager' => [
        'insert_link' => 'Hivatkozás beszúrása',
        'insert_image' => 'Kép beszúrása',
        'insert_video' => 'Videó beszúrása',
        'insert_audio' => 'Audió beszúrása',
        'invalid_file_empty_insert' => 'Hivatkozás készítéséhez jelöljön ki egy szövegrészt.',
        'invalid_file_single_insert' => 'Kérjük jelöljön ki egy fájlt.',
        'invalid_image_empty_insert' => 'Válasszon ki legalább egy képet a beszúráshoz.',
        'invalid_video_empty_insert' => 'Válasszon ki legalább egy videót a beszúráshoz.',
        'invalid_audio_empty_insert' => 'Válasszon ki legalább egy audiót a beszúráshoz.'
    ],

    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Mégsem',
        'widget_remove_confirm' => 'Valóban törölni akarja?'
    ],

    'datepicker' => [
        'previousMonth' => 'Előző hónap',
        'nextMonth' => 'Következő hónap',
        'months' => ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'],
        'weekdays' => ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'],
        'weekdaysShort' => ['va', 'hé', 'ke', 'sze', 'cs', 'pé', 'szo']
    ],

    'filter' => [
        'group' => [
            'all' => 'összes'
        ],
        'dates' => [
            'all' => 'összes',
            'filter_button_text' => 'Szűrés',
            'reset_button_text'  => 'Alaphelyzet',
            'date_placeholder' => 'Dátum',
            'after_placeholder' => 'Kezdete',
            'before_placeholder' => 'Vége'
        ],
        'numbers' => [
            'all' => 'összes',
            'filter_button_text' => 'Szűrés',
            'reset_button_text'  => 'Alaphelyzet',
            'min_placeholder' => 'Minimum',
            'max_placeholder' => 'Maximum'
        ]
    ],

    'eventlog' => [
        'show_stacktrace' => 'Részletek',
        'hide_stacktrace' => 'Rejtés',
        'tabs' => [
            'formatted' => 'Formázott',
            'raw' => 'Tömörített',
        ],
        'editor' => [
            'title' => 'Forráskód szerkesztő',
            'description' => 'Az operációs rendszert úgy kell beállítani, hogy figyelembe vegye az URL sémát.',
            'openWith' => 'Megnyitás mint',
            'remember_choice' => 'Kiválasztott beállítások megjegyzése ebben a munkamenetben',
            'open' => 'Megnyitás',
            'cancel' => 'Mégsem'
        ]
    ]
];
