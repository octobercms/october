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
        'formatting' => 'Formatting',
        'quote' => 'Quote',
        'code' => 'Code',
        'header1' => 'Header 1',
        'header2' => 'Header 2',
        'header3' => 'Header 3',
        'header4' => 'Header 4',
        'header5' => 'Header 5',
        'header6' => 'Header 6',
        'bold' => 'Bold',
        'italic' => 'Italic',
        'unorderedlist' => 'Unordered List',
        'orderedlist' => 'Ordered List',
        'video' => 'Video',
        'image' => 'Image',
        'link' => 'Link',
        'horizontalrule' => 'Insert Horizontal Rule',
        'fullscreen' => 'Toàn màn hình',
        'preview' => 'Xem trước',
    ],
    'mediamanager' => [
        'insert_link' => 'Chèn Media Link',
        'insert_image' => 'Chèn Media Image',
        'insert_video' => 'Chèn Media Video',
        'insert_audio' => 'Chèn Media Audio',
        'invalid_file_empty_insert' => 'Vui lòng chọn file để chèn vào link.',
        'invalid_file_single_insert' => 'Chọn một file duy nhất.',
        'invalid_image_empty_insert' => 'Chọn một hoặc nhiều ảnh để chèn vào.',
        'invalid_video_empty_insert' => 'Chọn video để chèn vào.',
        'invalid_audio_empty_insert' => 'Chọn tệp tin audio để chèn vào.',
    ],
    'alert' => [
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Cancel',
        'widget_remove_confirm' => 'Đồng ý xóa widget này?'
    ],
    'datepicker' => [
        'previousMonth' => 'Tháng trước',
        'nextMonth' => 'Tháng tiếp theo',
        'months' => ['Tháng giêng', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        'weekdays' => ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
        'weekdaysShort' => ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    ],
    'colorpicker' => [
        'choose' => 'Ok',
    ],
    'filter' => [
        'group' => [
            'all' => 'tất cả'
        ],
        'dates' => [
            'all' => 'tất cả',
            'filter_button_text' => 'Lọc',
            'reset_button_text'  => 'Reset',
            'date_placeholder' => 'Ngày',
            'after_placeholder' => 'Sau ngày',
            'before_placeholder' => 'Trước ngày'
        ],
        'numbers' => [
            'all' => 'all',
            'filter_button_text' => 'Lọc',
            'reset_button_text'  => 'Reset',
            'min_placeholder' => 'Nhỏ nhất',
            'max_placeholder' => 'Lớn nhất'
        ]

    ],
    'eventlog' => [
        'show_stacktrace' => 'Show the stacktrace',
        'hide_stacktrace' => 'Hide the stacktrace',
        'tabs' => [
            'formatted' => 'Đã định dạng',
            'raw' => 'Raw',
        ],
        'editor' => [
            'title' => 'Source code editor',
            'description' => 'Your operating system should be configured to listen to one of these URL schemes.',
            'openWith' => 'Mở bằng',
            'remember_choice' => 'Nhớ lựa chọn này cho các lần tiếp theo',
            'open' => 'Open',
            'cancel' => 'Cancel'
        ]
    ]
];
