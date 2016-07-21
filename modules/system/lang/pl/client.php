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
        'formatting' => 'Formaty',
        'quote' => 'Cytat',
        'code' => 'Widok kod',
        'header1' => 'Nagłówek 1',
        'header2' => 'Nagłówek 2',
        'header3' => 'Nagłówek 3',
        'header4' => 'Nagłówek 4',
        'header5' => 'Nagłówek 5',
        'header6' => 'Nagłówek 6',
        'bold' => 'Pogrubienie',
        'italic' => 'Kursywa',
        'unorderedlist' => '"Lista nieuporządkowana',
        'orderedlist' => 'Uporządkowana lista',
        'video' => 'Wideo',
        'image' => 'Obrazek',
        'link' => 'Link',
        'horizontalrule' => 'Wstaw linię poziomą',
        'fullscreen' => 'Pełny ekran',
        'preview' => 'Podgląd',
    ],

    'mediamanager' => [
        'insert_link' => "Wstaw Link",
        'insert_image' => "Wstaw Obraz",
        'insert_video' => "Wstaw Wideo",
        'insert_audio' => "Wstaw Audio",
        'invalid_file_empty_insert' => "Prosimy wybrać plik do podlinkowania.",
        'invalid_file_single_insert' => "Prosimy wybrać pojedynczy plik.",
        'invalid_image_empty_insert' => "Prosimy wybrać obrazy do wstawienia.",
        'invalid_video_empty_insert' => "Prosimy wybrać wideo do wstawienia.",
        'invalid_audio_empty_insert' => "Prosimy wybrać audio do wstawienia.",
    ],

    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Anuluj',
    ],

    'datepicker' => [
        'previousMonth' => 'Poprzedni miesiąc',
        'nextMonth' => 'Następny miesiąc',
        'months' => ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
        'weekdays' => ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
        'weekdaysShort' => ['Nie', 'Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'So']
    ],

    'filter' => [
        'group' => [
            'all' => 'wszystkie'
        ],
        'dates' => [
            'all' => 'wszystkie',
            'filter_button_text' => 'Filtruj',
            'reset_button_text'  => 'Resetuj',
            'date_placeholder' => 'Data',
            'after_placeholder' => 'Po',
            'before_placeholder' => 'Przed'
        ]
    ],

    'eventlog' => [
        'show_stacktrace' => 'Pokaż stos wywołań',
        'hide_stacktrace' => 'Ukryj stos wywołań',
        'tabs' => [
            'formatted' => 'Sformatowany',
            'raw' => 'Nieprzetworzony',
        ],
        'editor' => [
            'title' => 'Edytor kodu źródłowego',
            'description' => 'Twój system operacyjny powinien być skonfigurowany aby nasłuchiwać na jednym z podanych schematów URL.',
            'openWith' => 'Otwórz za pomocą',
            'remember_choice' => 'Zapamiętaj wybraną opcję dla tej sesji',
            'open' => 'Otwórz',
            'cancel' => 'Anuluj'
        ]
    ]
];
