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
        'formatting' => 'Formateo',
        'quote' => 'Cita',
        'code' => 'Código',
        'header1' => 'Encabezado 1',
        'header2' => 'Encabezado 2',
        'header3' => 'Encabezado 3',
        'header4' => 'Encabezado 4',
        'header5' => 'Encabezado 5',
        'header6' => 'Encabezado 6',
        'bold' => 'Negrita',
        'italic' => 'Cursiva',
        'unorderedlist' => 'Lista Desordenada',
        'orderedlist' => 'Lista Ordenada',
        'video' => 'Video',
        'image' => 'Imagen',
        'link' => 'Vínculo',
        'horizontalrule' => 'Insertar Regla Horizontal',
        'fullscreen' => 'Pantalla completa',
        'preview' => 'Previsualizar'
    ],

    'mediamanager' => [
        'insert_link' => "Insertar Media Vínculo",
        'insert_image' => "Insertar Media Imagen",
        'insert_video' => "Insertar Media Video",
        'insert_audio' => "Insertar Media Audio",
        'invalid_file_empty_insert' => "Por favor seleccione archivo para insertar vínculo.",
        'invalid_file_single_insert' => "Por favor seleccione un solo archivo.",
        'invalid_image_empty_insert' => "Por favor seleccione una imagen(es) para insertar.",
        'invalid_video_empty_insert' => "Por favor seleccione un archivo de video para insertar.",
        'invalid_audio_empty_insert' => "Por favor seleccione un archivo de audio para insertar.",
    ],

    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Cancelar'
    ],

    'datepicker' => [
        'previousMonth' => 'Mes Anterior',
        'nextMonth' => 'Mes Siguiente',
        'months' => ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        'weekdays' => ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        'weekdaysShort' => ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    ],

    'filter' => [
        'group' => [
            'all' => 'todos'
        ],
        'dates' => [
            'all' => 'todos',
            'filter_button_text' => 'Filtro',
            'reset_button_text'  => 'Restablecer',
            'date_placeholder' => 'Fecha',
            'after_placeholder' => 'Despues',
            'before_placeholder' => 'Antes'
        ]
    ],

    'eventlog' => [
        'show_stacktrace' => 'Mostrar el seguimiento de la pila',
        'hide_stacktrace' => 'Ocultar el seguimiento de la pila',
        'tabs' => [
            'formatted' => 'Formateado',
            'raw' => 'Sin formato',
        ],
        'editor' => [
            'title' => 'Seleccione el editor de código fuente a usar',
            'description' => 'Su entorno de sistema operativo debe estar configurado para escuchar a uno de estos esquemas de URL.',
            'openWith' => 'Abrir con',
            'rememberChoice' => 'Recuerde que la opción seleccionada para esta sesión del navegador',
            'open' => 'Abrir',
            'cancel' => 'Cancelar'
        ]
    ]
];
