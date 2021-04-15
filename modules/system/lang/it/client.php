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
        'formatting' => 'Formattazione',
        'quote' => 'Citazione',
        'code' => 'Codice',
        'header1' => 'Titolo 1',
        'header2' => 'Titolo 2',
        'header3' => 'Titolo 3',
        'header4' => 'Titolo 4',
        'header5' => 'Titolo 5',
        'header6' => 'Titolo 6',
        'bold' => 'Grassetto',
        'italic' => 'Corsivo',
        'unorderedlist' => 'Elenco puntato',
        'orderedlist' => 'Elenco numerato',
        'video' => 'Video',
        'image' => 'Immagine',
        'link' => 'Collegamento',
        'horizontalrule' => 'Inserisci linea orizzontale',
        'fullscreen' => 'Schermo intero',
        'preview' => 'Anteprima',
    ],

    'mediamanager' => [
        'insert_link' => "Inserisci collegamento elemento multimediale",
        'insert_image' => "Inserisci immagine",
        'insert_video' => "Inserisci video",
        'insert_audio' => "Inserisci audio",
        'invalid_file_empty_insert' => "Si prega di selezionare un file di cui inserire il collegamento.",
        'invalid_file_single_insert' => "Si prega di selezionare un singolo file.",
        'invalid_image_empty_insert' => "Si prega di selezionare l\'immagine/le immagini da inserire.",
        'invalid_video_empty_insert' => "Si prega di selezionare un file video da inserire.",
        'invalid_audio_empty_insert' => "Si prega di selezionare un file audio da inserire.",
    ],

    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Annulla',
    ],

    'datepicker' => [
        'previousMonth' => 'Mese precedente',
        'nextMonth' => 'Mese successivo',
        'months' => ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        'weekdays' => ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
        'weekdaysShort' => ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']
    ],

    'filter' => [
        'group' => [
            'all' => 'tutti'
        ],
        'dates' => [
            'all' => 'tutte',
            'filter_button_text' => 'Filtra',
            'reset_button_text'  => 'Reimposta',
            'date_placeholder' => 'Data',
            'after_placeholder' => 'Dopo',
            'before_placeholder' => 'Prima'
        ]
    ],

    'eventlog' => [
        'show_stacktrace' => 'Visualizza la traccia dello stack',
        'hide_stacktrace' => 'Nascondi la traccia dello stack',
        'tabs' => [
            'formatted' => 'Formattato',
            'raw' => 'Grezzo',
        ],
        'editor' => [
            'title' => 'Editor codice sorgente',
            'description' => 'Il tuo sistema operativo deve essere configurato per ascoltare uno di questi schemi URL.',
            'openWith' => 'Apri con',
            'remember_choice' => 'Ricorda l\'opzione selezionata per questa sessione',
            'open' => 'Apri',
            'cancel' => 'Annulla'
        ]
    ]
];
