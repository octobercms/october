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
        'horizontalrule' => 'Inserir línia horitzontal',
        'fullscreen' => 'Pantalla completa',
        'preview' => 'Previsualitzar',
    ],
    'mediamanager' => [
        'insert_link' => 'Inserir enllaç a mèdia',
        'insert_image' => 'Inserir imatge de mèdia',
        'insert_video' => 'Inserir vídeo de mèdia',
        'insert_audio' => 'Inserir àudio de mèdia',
        'invalid_file_empty_insert' => "Si us plau selecciona l'arxiu a enllaçar.",
        'invalid_file_single_insert' => 'Si us plau selecciona un sol arxiu.',
        'invalid_image_empty_insert' => 'Si us plau selecciona imatge(s) per inserir.',
        'invalid_video_empty_insert' => 'Si us plau selecciona un arxiu de vídeo per inserir.',
        'invalid_audio_empty_insert' => "Si us plau selecciona un arxiu d'àudio per inserir.",
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
            'remember_choice' => "Recordar l'opció seleccionada durant aquesta sessió",
            'open' => 'Obrir',
            'cancel' => 'Cancel·lar'
        ]
    ]
];
