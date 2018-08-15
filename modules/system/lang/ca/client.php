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
        'formatting' => 'Formatar',
        'quote' => 'Quota',
        'code' => 'Codi',
        'header1' => 'Títol 1',
        'header2' => 'Títol 2',
        'header3' => 'Títol 3',
        'header4' => 'Títol 4',
        'header5' => 'Títol 5',
        'header6' => 'Títol 6',
        'bold' => 'Negreta',
        'italic' => 'Cursiva',
        'unorderedlist' => 'Llista desordenada',
        'orderedlist' => 'Llista ordenada',
        'video' => 'Vídeo',
        'image' => 'Imatge',
        'link' => 'Enllaç',
        'horizontalrule' => 'Insertar línia horitzontal',
        'fullscreen' => 'Pantalla completa',
        'preview' => 'Previsualitzar',
    ],
    'mediamanager' => [
        'insert_link' => 'Insertar enllaç a media',
        'insert_image' => 'Insertar imatge de media',
        'insert_video' => 'Insertar video de media',
        'insert_audio' => 'Insertar audio de media',
        'invalid_file_empty_insert' => "Siusplau sel·lecciona l'arxiu a enllaçar.",
        'invalid_file_single_insert' => 'Siusplau sel·lecciona un sol arxiu.',
        'invalid_image_empty_insert' => 'Siusplau sel·lecciona imatge(s) per insertar.',
        'invalid_video_empty_insert' => 'Siusplau sel·lecciona un arxiu de vídeo per insertar.',
        'invalid_audio_empty_insert' => "Siusplau sel·lecciona un arxiu d'audio per insertar.",
    ],
    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Cancel·lar',
        'widget_remove_confirm' => 'Eliminar aquest widget?'
    ],
    'datepicker' => [
        'previousMonth' => 'Mes anterior',
        'nextMonth' => 'Mes següent',
        'months' => ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'],
        'weekdays' => ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'],
        'weekdaysShort' => ['Dg', 'Dl', 'Dm', 'Dx', 'Dj', 'Dv', 'Ds']
    ],
    'colorpicker' => [
        'choose' => 'Ok',
    ],
    'filter' => [
        'group' => [
            'all' => 'tots'
        ],
        'dates' => [
            'all' => 'tots',
            'filter_button_text' => 'Filtrar',
            'reset_button_text'  => 'Reiniciar',
            'date_placeholder' => 'Data',
            'after_placeholder' => 'Després',
            'before_placeholder' => 'Abans'
        ],
        'numbers' => [
            'all' => 'tots',
            'filter_button_text' => 'Filtrar',
            'reset_button_text'  => 'Reiniciar',
            'min_placeholder' => 'Mín',
            'max_placeholder' => 'Màx'
        ]

    ],
    'eventlog' => [
        'show_stacktrace' => "Mostrar l'stacktrace",
        'hide_stacktrace' => "Ocultar l'stacktrace",
        'tabs' => [
            'formatted' => 'Formatat',
            'raw' => 'Cru',
        ],
        'editor' => [
            'title' => 'Editor de codi font',
            'description' => "El teu sistema operatiu hauria d'estar configurat per escoltar un d'aquests esquemes d'URL.",
            'openWith' => 'Obrir amb',
            'remember_choice' => "Recordar l'opció sel·leccionada durant aquesta sessió",
            'open' => 'Obrir',
            'cancel' => 'Cancel·lar'
        ]
    ]
];
