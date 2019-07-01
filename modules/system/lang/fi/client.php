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
        'formatting' => 'Muotoilu',
        'quote' => 'Lainaus',
        'code' => 'Koodi',
        'header1' => 'Otsikko 1',
        'header2' => 'Otsikko 2',
        'header3' => 'Otsikko 3',
        'header4' => 'Otsikko 4',
        'header5' => 'Otsikko 5',
        'header6' => 'Otsikko 6',
        'bold' => 'Lihavointi',
        'italic' => 'Kursivointi',
        'unorderedlist' => 'Järjestämätön lista',
        'orderedlist' => 'Järjestetty lista',
        'video' => 'Video',
        'image' => 'Kuva',
        'link' => 'Linkki',
        'horizontalrule' => 'Lisää horisontaalinen jakaja',
        'fullscreen' => 'Kokonäyttö',
        'preview' => 'Esikatsele',
    ],
    'mediamanager' => [
        'insert_link' => 'Lisää linkki Mediaan',
        'insert_image' => 'Lisää kuva',
        'insert_video' => 'Lisää video',
        'insert_audio' => 'Lisää äänitiedosto',
        'invalid_file_empty_insert' => 'Valitse liitettävä tiedosto.',
        'invalid_file_single_insert' => 'Valitse vain yksi tiedosto.',
        'invalid_image_empty_insert' => 'Valitse linkitettävä(t) kuva(t).',
        'invalid_video_empty_insert' => 'Valitse linkitettävä videotiedosto.',
        'invalid_audio_empty_insert' => 'Valitse linkitettävä äänitiedosto.',
    ],
    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Peruuta',
        'widget_remove_confirm' => 'Poista tämä vimpain?'
    ],
    'datepicker' => [
        'previousMonth' => 'Edellinen kuukausi',
        'nextMonth' => 'Seuraava kuukausi',
        'months' => ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu'],
        'weekdays' => ['sunnutai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'],
        'weekdaysShort' => ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la']
    ],
    'colorpicker' => [
        'choose' => 'Ok',
    ],
    'filter' => [
        'group' => [
            'all' => 'kaikki'
        ],
        'scopes' => [
            'apply_button_text' => 'Ota käyttöön',
            'clear_button_text'  => 'Tyhjennä'            
        ], 
        'dates' => [
            'all' => 'kaikki',
            'filter_button_text' => 'Suodata',
            'reset_button_text'  => 'Palauta',
            'date_placeholder' => 'Päivä',
            'after_placeholder' => 'Jälkeen',
            'before_placeholder' => 'Ennen'
        ],
        'numbers' => [
            'all' => 'kaikki',
            'filter_button_text' => 'Suodata',
            'reset_button_text'  => 'Palauta',
            'min_placeholder' => 'Väh.',
            'max_placeholder' => 'Enint.'
        ]
    ],
    'eventlog' => [
        'show_stacktrace' => 'Näytä stacktrace',
        'hide_stacktrace' => 'Piilota stacktrace',
        'tabs' => [
            'formatted' => 'Muotoiltu',
            'raw' => 'Raaka',
        ],
        'editor' => [
            'title' => 'Lähdekoodieditori',
            'description' => 'Käyttöjärjestelmäsi pitäisi olla määritetty kuuntelemaan jotain näistä URL osoitteista.',
            'openWith' => 'Avaa sovelluksessa',
            'remember_choice' => 'Muista valittu vaihtoehto istunnon ajan',
            'open' => 'Avaa',
            'cancel' => 'Peruuta'
        ]
    ]
];
