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
        'formatting' => 'قالب بندی',
        'quote' => 'نقل قول',
        'code' => 'کد',
        'header1' => 'سرخط 1',
        'header2' => 'سرخط 2',
        'header3' => 'سرخط 3',
        'header4' => 'سرخط 4',
        'header5' => 'سرخط 5',
        'header6' => 'سرخط 6',
        'bold' => 'ظخیم',
        'italic' => 'مورب',
        'unorderedlist' => 'لیست بدون ترتیب',
        'orderedlist' => 'لیست با ترتیب',
        'video' => 'ویدیو',
        'image' => 'تصویر',
        'link' => 'لینک',
        'horizontalrule' => 'درج خط افقی',
        'fullscreen' => 'تمام صفحه',
        'preview' => 'پیش نمایش',
    ],
    'mediamanager' => [
        'insert_link' => "درج آدرس رسانه",
        'insert_image' => "درج تصویر",
        'insert_video' => "درج ویدیو",
        'insert_audio' => "درج صوت",
        'invalid_file_empty_insert' => "لطفا فایلی را جهت درج لینک آن وارد نمایید",
        'invalid_file_single_insert' => "لطفا یک فایل را وارد نمایید",
        'invalid_image_empty_insert' => "لطفا تصویر(ها) را جهت درج انتخاب نمایید",
        'invalid_video_empty_insert' => "لطفا ویدیو را جهت درج انتخاب نمایید.",
        'invalid_audio_empty_insert' => "لطفا فایل صوتی را جهت درج انتخاب نمایید",
    ],
    'alert' => [
        'confirm_button_text' => 'تایید',
        'cancel_button_text' => 'انصراف',
        'widget_remove_confirm' => 'این ابزارک حذف شود؟'
    ],
'datepicker' => [
        'previousMonth' => 'ماه قبل',
        'nextMonth' => 'ماه بعذ',
        'months' => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        'weekdays' => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'weekdaysShort' => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    ],
    'filter' => [
        'group' => [
            'all' => 'همه'
        ],
        'dates' => [
            'all' => 'همه',
            'filter_button_text' => 'فیلتر',
            'reset_button_text'  => 'بازنشانی',
            'date_placeholder' => 'تاریخ',
            'after_placeholder' => 'بعد از',
            'before_placeholder' => 'قبل از'
        ]
    ],
    'eventlog' => [
        'show_stacktrace' => 'نمایش روند اجرا',
        'hide_stacktrace' => 'مخفی سازی روند اجرا',
        'tabs' => [
            'formatted' => 'قالب بندی شده',
            'raw' => 'خام',
        ],
        'editor' => [
            'title' => 'ویرایشگر کد',
            'description' => 'سیستم عامل شما باید برای یکی از این شمای آدرس ها پیکربندی شده باشد.',
            'openWith' => 'باز کردن توسط',
            'remember_choice' => 'گزینه انتخاب شده را به خاطر داشته باش',
            'open' => 'باز کردن',
            'cancel' => 'انصراف'
        ]
    ]
];
