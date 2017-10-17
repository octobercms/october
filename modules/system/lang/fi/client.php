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
        'italic' => 'Kursiivi',
        'unorderedlist' => 'Järjestämätön listaus',
        'orderedlist' => 'Järjestetty listaus',
        'video' => 'Video',
        'image' => 'Kuva',
        'link' => 'Linkki',
        'horizontalrule' => 'Lisää horisontaalinen jakaja',
        'fullscreen' => 'Täysinäyttö',
        'preview' => 'Esikatselu',
    ],
    'mediamanager' => [
        'insert_link' => 'Lisää linkki Mediaan',
        'insert_image' => 'Lisää kuva',
        'insert_video' => 'Lisää video',
        'insert_audio' => 'Lisää äänitiedosto',
        'invalid_file_empty_insert' => 'Valitse liitettävä tiedosto.',
        'invalid_file_single_insert' => 'Valitse vain yksi tiedosto.',
        'invalid_image_empty_insert' => 'Valitse liitettävä(t) kuva(t).',
        'invalid_video_empty_insert' => 'Valitse liitettävä videotiedosto.',
        'invalid_audio_empty_insert' => 'Valitse liitettävä äänitiedosto.',
    ],
    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Peruuta',
        'widget_remove_confirm' => 'Poista tämä vimpain?'
    ],
    'datepicker' => [
        'previousMonth' => 'Edellinen kuukausi',
        'nextMonth' => 'Seuraava kuukausi',
        'months' => ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'],
        'weekdays' => ['Sunnutai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'],
        'weekdaysShort' => ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La']
    ],
    'filter' => [
        'group' => [
            'all' => 'kaikki'
        ],
        'dates' => [
            'all' => 'kaikki',
            'filter_button_text' => 'Suodin',
            'reset_button_text'  => 'Nollaa',
            'date_placeholder' => 'PVM',
            'after_placeholder' => 'Jälkeen',
            'before_placeholder' => 'Ennen'
        ]
    ],
    'eventlog' => [
        'show_stacktrace' => 'Show the stacktrace',
        'hide_stacktrace' => 'Hide the stacktrace',
        'tabs' => [
            'formatted' => 'Muotoiltu',
            'raw' => 'Raw',
        ],
        'editor' => [
            'title' => 'Lähdekoodin editori',
            'description' => 'Your operating system should be configured to listen to one of these URL schemes.',
            'openWith' => 'Avaa kohteessa',
            'remember_choice' => 'Remember selected option for this session',
            'open' => 'Avaa',
            'cancel' => 'Peruuta'
        ]
    ]
];
