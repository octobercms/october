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
        'snippet' => 'Snippet',
        'video' => 'Video',
        'image' => 'Imagen',
        'link' => 'Vínculo',
        'horizontalrule' => 'Insertar Regla Horizontal',
        'fullscreen' => 'Pantalla completa',
        'preview' => 'Previsualizar',
        'strikethrough' => 'Tachado',
        'cleanblock' => 'Bloque Limpio',
        'table' => 'Tabla',
        'sidebyside' => 'Lado a Lado'
    ],
    'mediamanager' => [
        'insert_link' => "Insertar enlace de media",
        'insert_image' => "Insertar imagen de media",
        'insert_video' => "Insertar video de media",
        'insert_audio' => "Insertar audio de media",
        'invalid_file_empty_insert' => "Por favor seleccione archivo para insertar enlace.",
        'invalid_file_single_insert' => "Por favor seleccione un solo archivo.",
        'invalid_image_empty_insert' => "Por favor seleccione imagen(es) para insertar.",
        'invalid_video_empty_insert' => "Por favor seleccione un archivo de video para insertar.",
        'invalid_audio_empty_insert' => "Por favor seleccione un archivo de audio para insertar.",
    ],
    'alert' => [
        'error' => 'Error',
        'confirm' => 'Confirmar',
        'dismiss' => 'Descartar',
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Cancelar',
        'widget_remove_confirm' => '¿Eliminar este widget?',
        'reload' => 'Recargar',
    ],
    'datepicker' => [
        'previousMonth' => 'Mes Anterior',
        'nextMonth' => 'Mes Siguiente',
        'months' => ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        'weekdays' => ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        'weekdaysShort' => ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
    ],
    'colorpicker' => [
        'choose' => 'OK',
    ],
    'filter' => [
        'group' => [
            'all' => 'todos',
        ],
        'scopes' => [
            'apply_button_text' => 'Aplicar',
            'clear_button_text' => 'Limpiar',
        ],
        'dates' => [
            'all' => 'todas',
            'filter_button_text' => 'Filtrar',
            'reset_button_text' => 'Restablecer',
            'date_placeholder' => 'Fecha',
            'after_placeholder' => 'Desde',
            'before_placeholder' => 'Hasta',
        ],
        'numbers' => [
            'all' => 'todos',
            'filter_button_text' => 'Filtrar',
            'reset_button_text' => 'Restablecer',
            'min_placeholder' => 'Mínimo',
            'max_placeholder' => 'Máximo',
        ],
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
            'rememberChoice' => 'Recuerde la opción seleccionada para esta sesión del navegador',
            'open' => 'Abrir',
            'cancel' => 'Cancelar',
        ],
    ],
    'upload' => [
        'max_files' => 'No se pueden subir más archivos.',
        'invalid_file_type' => 'No se pueden subir archivos de este tipo.',
        'file_too_big' => 'El archivo es demasiado grande ({{filesize}}MB). Tamaño máximo: {{maxFilesize}}MB.',
        'response_error' => 'El servidor respondió con el código {{statusCode}}.',
        'remove_file' => 'Eliminar archivo',
    ],
    'inspector' => [
        'add' => 'Agregar',
        'remove' => 'Eliminar',
        'key' => 'Clave',
        'value' => 'Valor',
        'ok' => 'Aceptar',
        'cancel' => 'Cancelar',
        'items' => 'Elementos',
    ],
];
