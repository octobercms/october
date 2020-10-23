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
        'formatting'     => 'Oblikovanje',
        'quote'          => 'Citat',
        'code'           => 'Koda',
        'header1'        => 'Naslov 1',
        'header2'        => 'Naslov 2',
        'header3'        => 'Naslov 3',
        'header4'        => 'Naslov 4',
        'header5'        => 'Naslov 5',
        'header6'        => 'Naslov 6',
        'bold'           => 'Krepko',
        'italic'         => 'Ležeče',
        'unorderedlist'  => 'Neoštevilčeni seznam',
        'orderedlist'    => 'Številčni seznam',
        'video'          => 'Video',
        'image'          => 'Slika',
        'link'           => 'Povezava',
        'horizontalrule' => 'Vstavi vodoravno črto',
        'fullscreen'     => 'Celozaslonski način',
        'preview'        => 'Predogled',
    ],
    'mediamanager'   => [
        'insert_link'                => 'Vstavi povezavo',
        'insert_image'               => 'Vstavi sliko',
        'insert_video'               => 'Vstavi video posnetek',
        'insert_audio'               => 'Vstavi zvočni posnetek',
        'invalid_file_empty_insert'  => 'Izberite datoteko, do katere želite vstaviti povezavo.',
        'invalid_file_single_insert' => 'Izberite eno samo datoteko.',
        'invalid_image_empty_insert' => 'Izberite slike za vstavljanje.',
        'invalid_video_empty_insert' => 'Izberite video posnetek za vstavljanje.',
        'invalid_audio_empty_insert' => 'Izberite zvočni posnetek za vstavljanje.',
    ],
    'alert'          => [
        'confirm_button_text'   => 'V redu',
        'cancel_button_text'    => 'Prekliči',
        'widget_remove_confirm' => 'Odstrani ta vtičnik?',
    ],
    'datepicker'     => [
        'previousMonth' => 'Prejšnji mesec',
        'nextMonth'     => 'Naslednji mesec',
        'months'        => [
            'Januar',
            'Februar',
            'Marec',
            'April',
            'Maj',
            'Junij',
            'Julij',
            'Avgust',
            'September',
            'Oktober',
            'November',
            'December',
        ],
        'weekdays'      => ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'],
        'weekdaysShort' => ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'],
    ],
    'colorpicker'    => [
        'choose' => 'Ok',
    ],
    'filter'         => [
        'group'   => [
            'all' => 'vsi',
        ],
        'scopes'  => [
            'apply_button_text' => 'Uporabi',
            'clear_button_text' => 'Počisti',
        ],
        'dates'   => [
            'all'                => 'vsi',
            'filter_button_text' => 'Filtriraj',
            'reset_button_text'  => 'Ponastavi',
            'date_placeholder'   => 'Datum',
            'after_placeholder'  => 'Po',
            'before_placeholder' => 'Pred',
        ],
        'numbers' => [
            'all'                => 'vsi',
            'filter_button_text' => 'Filtriraj',
            'reset_button_text'  => 'Ponastavi',
            'min_placeholder'    => 'Min',
            'max_placeholder'    => 'Max',
        ],
    ],
    'eventlog'       => [
        'show_stacktrace' => 'Prikaži sled dogodkov',
        'hide_stacktrace' => 'Skrij sled dogodkov',
        'tabs'            => [
            'formatted' => 'Oblikovano',
            'raw'       => 'Brez oblikovanja',
        ],
        'editor'          => [
            'title'           => 'Urejevalnik izvorne kode',
            'description'     => 'Vaš operacijski sistem mora biti nastavljen tako, da upošteva eno od teh URL shem.',
            'openWith'        => 'Za odpiranje uporabi',
            'remember_choice' => 'Zapomni si izbrane nastavitve za to sejo',
            'open'            => 'Odpri',
            'cancel'          => 'Prekliči',
        ],
    ],
];
