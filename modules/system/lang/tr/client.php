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
        'formatting' => 'Formatlama',
        'quote' => 'Alıntı',
        'code' => 'Kod',
        'header1' => 'Başlık 1',
        'header2' => 'Başlık 2',
        'header3' => 'Başlık 3',
        'header4' => 'Başlık 4',
        'header5' => 'Başlık 5',
        'header6' => 'Başlık 6',
        'bold' => 'Kalın',
        'italic' => 'İtalik',
        'unorderedlist' => 'Sırasız Liste',
        'orderedlist' => 'Sıralı Liste',
        'video' => 'Video',
        'image' => 'Görsel/Resim',
        'link' => 'Link',
        'horizontalrule' => 'Yatay Çizgi Ekle',
        'fullscreen' => 'Tam Ekran',
        'preview' => 'Önizleme',
    ],
    'mediamanager' => [
        'insert_link' => "Medya Linki Ekle",
        'insert_image' => "Medya Resim Ekle",
        'insert_video' => "Medya Video Ekle",
        'insert_audio' => "Medya Ses Ekle",
        'invalid_file_empty_insert' => "Lütfen link verilecek dosyayı seçin.",
        'invalid_file_single_insert' => "Lütfen tek bir dosya seçin.",
        'invalid_image_empty_insert' => "Lütfen eklenecek resim(ler)i seçin.",
        'invalid_video_empty_insert' => "Lütfen eklenecek video dosyasını seçin.",
        'invalid_audio_empty_insert' => "Lütfen eklenecek ses dosyasını seçin.",
    ],
    'alert' => [
        'confirm_button_text' => 'Evet',
        'cancel_button_text' => 'İptal',
        'widget_remove_confirm' => 'Bu eklentiyi kaldırma istediğinize emin misiniz?',
    ],
    'datepicker' => [
        'previousMonth' => 'Önceki Ay',
        'nextMonth' => 'Sonraki Ay',
        'months' => ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        'weekdays' => ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
        'weekdaysShort' => ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
    ],
    'colorpicker' => [
        'choose' => 'Seç',
    ],
    'filter' => [
        'group' => [
            'all' => 'tümü',
        ],
        'scopes' => [
            'apply_button_text' => 'Uygula',
            'clear_button_text'  => 'Temizle',
        ],
        'dates' => [
            'all' => 'tümü',
            'filter_button_text' => 'Filtrele',
            'reset_button_text'  => 'Sıfırla',
            'date_placeholder' => 'Tarih',
            'after_placeholder' => 'Sonra',
            'before_placeholder' => 'Önce',
        ],
        'numbers' => [
            'all' => 'all',
            'filter_button_text' => 'Filtrele',
            'reset_button_text'  => 'Sıfırla',
            'min_placeholder' => 'Min',
            'max_placeholder' => 'Max',
        ],
    ],
    'eventlog' => [
        'show_stacktrace' => 'Veri yığınını göster',
        'hide_stacktrace' => 'Veri yığınını gizle',
        'tabs' => [
            'formatted' => 'Formatlı',
            'raw' => 'Ham Veri',
        ],
        'editor' => [
            'title' => 'Kaynak kod editörü',
            'description' => 'İşletim sisteminiz URL şemalarına yanıt verecek şekilde yapılandırılmalıdır.',
            'openWith' => 'Birlikte aç',
            'remember_choice' => 'Bu oturum için seçenekleri hatırla',
            'open' => 'Aç',
            'cancel' => 'İptal',
        ],
    ],
];
