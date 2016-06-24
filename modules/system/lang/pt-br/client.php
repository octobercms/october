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
        'formatting' => 'Formatação',
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
        'preview' => 'Visualização',
    ],

    'mediamanager' => [
        'insert_link' => "Inserir Endereço de Mídia",
        'insert_image' => "Inserir Imagem",
        'insert_video' => "Inserir Vídeo",
        'insert_audio' => "Inserir Áudio",
        'invalid_file_empty_insert' => "Por favor, selecione o arquivo a ter um link inserido.",
        'invalid_file_single_insert' => "Por favor, selecione um único arquivo.",
        'invalid_image_empty_insert' => "Por favor, selecione a(s) imagem(ns) a inserir.",
        'invalid_video_empty_insert' => "Por favor, selecione um arquivo de vídeo a inserir.",
        'invalid_audio_empty_insert' => "Por favor, selecione um arquivo de áudio a inserir.",
    ],

    'alert' => [
        'confirm_button_text' => 'Confirmar',
        'cancel_button_text' => 'Cancelar',
    ],

    'datepicker' => [
        'previousMonth' => 'Mês Anterior',
        'nextMonth' => 'Próximo Mês',
        'months' => ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        'weekdays' => ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
        'weekdaysShort' => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    ],

    'filter' => [
        'group' => [
            'all' => 'todos'
        ],
        'dates' => [
            'all' => 'todos',
            'filter_button_text' => 'Filtrar',
            'reset_button_text'  => 'Redefinir',
            'date_placeholder' => 'Data',
            'after_placeholder' => 'Depois',
            'before_placeholder' => 'Antes'
        ]
    ],

    'eventlog' => [
        'show_stacktrace' => 'Exibir o rastreamento da pilha',
        'hide_stacktrace' => 'Ocultar o rastreamento da pilha',
        'tabs' => [
            'formatted' => 'Formatado',
            'raw' => 'Sem formatação',
        ],
        'editor' => [
            'title' => 'Editor de código fonte',
            'description' => 'Seu sistema operacional deve estar configurado  para escutar um destes esquemas de URL.',
            'openWith' => 'Abrir com',
            'remember_choice' => 'Memorizar as opções selecionadas para esta sessão',
            'open' => 'Abrir',
            'cancel' => 'Cancelar'
        ]
    ]
];
