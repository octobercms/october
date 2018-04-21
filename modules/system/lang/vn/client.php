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
        'formatting' => 'Định dạng',
        'quote' => 'Đoạn trích dẫn',
        'code' => 'Code',
        'header1' => 'Tiêu đề 1',
        'header2' => 'Tiêu đề 2',
        'header3' => 'Tiêu đề 3',
        'header4' => 'Tiêu đề 4',
        'header5' => 'Tiêu đề 5',
        'header6' => 'Tiêu đề 6',
        'bold' => 'Chữ đậm',
        'italic' => 'Chữ nghiêng',
        'unorderedlist' => 'Danh sách không thứ tự',
        'orderedlist' => 'Danh sách có thứ tự',
        'video' => 'Video',
        'image' => 'Hình ảnh',
        'link' => 'Link',
        'horizontalrule' => 'Chèn dòng kẻ ngang',
        'fullscreen' => 'Toàn màn hình',
        'preview' => 'Xem trước',
    ],
    'mediamanager' => [
        'insert_link' => 'Chèn Link',
        'insert_image' => 'Chèn hình ảnh',
        'insert_video' => 'Chèn Video',
        'insert_audio' => 'Chèn tệp âm thanh',
        'invalid_file_empty_insert' => 'Vui lòng chọn file để chèn vào link.',
        'invalid_file_single_insert' => 'Chọn một file duy nhất.',
        'invalid_image_empty_insert' => 'Chọn một hoặc nhiều ảnh để chèn vào.',
        'invalid_video_empty_insert' => 'Chọn video để chèn vào.',
        'invalid_audio_empty_insert' => 'Chọn tệp tin audio để chèn vào.',
    ],
    'alert' => [
        'confirm_button_text' => 'Đồng ý',
        'cancel_button_text' => 'Bỏ qua',
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
        'choose' => 'Chọn',
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
        'show_stacktrace' => 'Hiển thị ngăn xếp',
        'hide_stacktrace' => 'Ẩn ngăn xếp',
        'tabs' => [
            'formatted' => 'Đã định dạng',
            'raw' => 'Raw',
        ],
        'editor' => [
            'title' => 'Trình soạn thảo code',
            'description' => 'Hệ thống của bạn cần được cấu hình để hiểu được một trong những cấu trúc URL này',
            'openWith' => 'Mở bằng',
            'remember_choice' => 'Nhớ lựa chọn này cho các lần tiếp theo',
            'open' => 'Mở ra',
            'cancel' => 'Bỏ qua'
        ]
    ]
];
