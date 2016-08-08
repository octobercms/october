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
        'formatting' => 'Formatando',
        'quote' => 'Citação',
        'code' => 'Código',
        'header1' => 'Cabeçalho 1',
        'header2' => 'Cabeçalho 2',
        'header3' => 'Cabeçalho 3',
        'header4' => 'Cabeçalho 4',
        'header5' => 'Cabeçalho 5',
        'header6' => 'Cabeçalho 6',
        'bold' => 'Negrito',
        'italic' => 'Itálico',
        'unorderedlist' => 'Lista não ordenada',
        'orderedlist' => 'Lista ordenada',
        'video' => 'Vídeo',
        'image' => 'Imagem',
        'link' => 'Link',
        'horizontalrule' => 'Inserir linha horizontal',
        'fullscreen' => 'Tela cheia',
        'preview' => 'Visualizar',
    ],

    'mediamanager' => [
        'insert_link' => "Inserir link",
        'insert_image' => "Inserir imagem",
        'insert_video' => "Inserir vídeo",
        'insert_audio' => "Inserir áudio",
        'invalid_file_empty_insert' => "Por favor, selecione o arquivo para criar o link.",
        'invalid_file_single_insert' => "Por favor, selecione apenas um arquivo.",
        'invalid_image_empty_insert' => "Por favor, selecione as imagens que deseja inserir.",
        'invalid_video_empty_insert' => "Por favor, selecione os vídeos que deseja inserir.",
        'invalid_audio_empty_insert' => "Por favor, selecione os áudios que deseja inserir.",
    ],

    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Cancelar',
    ],

    'datepicker' => [
        'previousMonth' => 'Mês anterior',
        'nextMonth' => 'Próximo mês',
        'months' => ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        'weekdays' => ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
        'weekdaysShort' => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    ],

    'filter' => [
        'group' => [
            'all' => 'todos'
        ],
        'dates' => [
            'all' => 'todas',
            'filter_button_text' => 'Filtro',
            'reset_button_text'  => 'Reiniciar',
            'date_placeholder' => 'Data',
            'after_placeholder' => 'Após',
            'before_placeholder' => 'Antes'
        ]
    ],

    'eventlog' => [
        'show_stacktrace' => 'Exibir o rastreamento',
        'hide_stacktrace' => 'Ocultar o rastreamento',
        'tabs' => [
            'formatted' => 'Formatado',
            'raw' => 'Bruto',
        ],
        'editor' => [
            'title' => 'Editor de código fonte',
            'description' => 'Seu sistema operacional deve ser configurado para ouvir um desses esquemas de URL.',
            'openWith' => 'Abrir com',
            'remember_choice' => 'Lembrar a opção selecionada nesta sessão',
            'open' => 'Abrir',
            'cancel' => 'Cancelar'
        ]
    ]
];
