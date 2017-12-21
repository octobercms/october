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
        'bold' => 'Lihavoi',
        'italic' => 'Kursivoi',
        'unorderedlist' => 'Järjestämätön lista',
        'orderedlist' => 'Järjestetty lista',
        'video' => 'Video',
        'image' => 'Kuva',
        'link' => 'Linkki',
        'horizontalrule' => 'Aseta vaakasuuntainen viiva',
        'fullscreen' => 'Koko näyttö',
        'preview' => 'Esikatsele',
    ],
    'mediamanager' => [
        'insert_link' => 'Aseta medialinkki',
        'insert_image' => 'Aseta Media kuva',
        'insert_video' => 'Aseta Media video',
        'insert_audio' => 'Aseta Media audio',
        'invalid_file_empty_insert' => 'Valitse linkitettävä tiedosto.',
        'invalid_file_single_insert' => 'Valitse yksi tiedosto.',
        'invalid_image_empty_insert' => 'Valitse liitettävä(t) kuva(t).',
        'invalid_video_empty_insert' => 'Valitse liitettävä videotiedosto.',
        'invalid_audio_empty_insert' => 'Valitse liitettävä audiotiedosto.',
    ],
    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Peruuta',
        'widget_remove_confirm' => 'Poista tämä vekotin?'
    ],
    'datepicker' => [
        'previousMonth' => 'Edellinen kuukausi',
        'nextMonth' => 'Seuraava kuukausi',
        'months' => ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'toukokuu', 'lokakuu', 'marraskuu', 'joulukuu'],
        'weekdays' => ['Sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai'],
        'weekdaysShort' => ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la']
    ],
    'colorpicker' => [
        'choose' => 'Ok',
    ],
    'filter' => [
        'group' => [
            'all' => 'kaikki'
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
            'min_placeholder' => 'Vähintään',
            'max_placeholder' => 'Enintään'
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
            'openWith' => 'Avaa sovelluksella',
            'remember_choice' => 'Muista valittu vaihtoehto tälle istunnolle',
            'open' => 'Avaa',
            'cancel' => 'Peruuta'
        ]
    ]
];
