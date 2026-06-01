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
        'quote' => 'Trích dẫn',
        'code' => 'Mã',
        'header1' => 'Tiêu đề 1',
        'header2' => 'Tiêu đề 2',
        'header3' => 'Tiêu đề 3',
        'header4' => 'Tiêu đề 4',
        'header5' => 'Tiêu đề 5',
        'header6' => 'Tiêu đề 6',
        'bold' => 'In đậm',
        'italic' => 'In nghiêng',
        'unorderedlist' => 'Danh sách không thứ tự',
        'orderedlist' => 'Danh sách có thứ tự',
        'snippet' => 'Đoạn mã (Snippet)',
        'video' => 'Video',
        'image' => 'Hình ảnh',
        'link' => 'Liên kết',
        'horizontalrule' => 'Chèn đường kẻ ngang',
        'fullscreen' => 'Toàn màn hình',
        'preview' => 'Xem trước',
        'strikethrough' => 'Gạch ngang chữ',
        'cleanblock' => 'Xóa định dạng khối',
        'table' => 'Bảng',
        'sidebyside' => 'Chia đôi màn hình'
    ],
    'mediamanager' => [
        'insert_link' => 'Chèn liên kết phương tiện',
        'insert_image' => 'Chèn hình ảnh',
        'insert_video' => 'Chèn video',
        'insert_audio' => 'Chèn âm thanh',
        'invalid_file_empty_insert' => 'Vui lòng chọn tệp để chèn liên kết.',
        'invalid_file_single_insert' => 'Vui lòng chỉ chọn một tệp duy nhất.',
        'invalid_image_empty_insert' => 'Vui lòng chọn (các) hình ảnh để chèn.',
        'invalid_video_empty_insert' => 'Vui lòng chọn một tệp video để chèn.',
        'invalid_audio_empty_insert' => 'Vui lòng chọn một tệp âm thanh để chèn.',
    ],
    'alert' => [
        'error' => 'Lỗi',
        'confirm' => 'Xác nhận',
        'dismiss' => 'Bỏ qua',
        'confirm_button_text' => 'OK',
        'cancel_button_text' => 'Hủy bỏ',
        'widget_remove_confirm' => 'Xóa tiện ích này?',
        'reload' => 'Tải lại',
    ],
    'datepicker' => [
        'previousMonth' => 'Tháng trước',
        'nextMonth' => 'Tháng sau',
        'months' => ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        'weekdays' => ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
        'weekdaysShort' => ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    ],
    'colorpicker' => [
        'choose' => 'OK',
    ],
    'filter' => [
        'group' => [
            'all' => 'tất cả',
        ],
        'scopes' => [
            'apply_button_text' => 'Áp dụng',
            'clear_button_text' => 'Xóa',
        ],
        'dates' => [
            'all' => 'tất cả',
            'filter_button_text' => 'Lọc',
            'reset_button_text' => 'Khôi phục',
            'date_placeholder' => 'Ngày',
            'after_placeholder' => 'Sau',
            'before_placeholder' => 'Trước',
        ],
        'numbers' => [
            'all' => 'tất cả',
            'filter_button_text' => 'Lọc',
            'reset_button_text' => 'Khôi phục',
            'min_placeholder' => 'Tối thiểu',
            'max_placeholder' => 'Tối đa',
        ],
    ],
    'eventlog' => [
        'show_stacktrace' => 'Hiển thị stacktrace',
        'hide_stacktrace' => 'Ẩn stacktrace',
        'tabs' => [
            'formatted' => 'Đã định dạng',
            'raw' => 'Thô',
        ],
        'editor' => [
            'title' => 'Trình soạn thảo mã nguồn',
            'description' => 'Hệ điều hành của bạn cần được cấu hình để lắng nghe một trong các URL scheme này.',
            'openWith' => 'Mở bằng',
            'remember_choice' => 'Ghi nhớ lựa chọn cho phiên này',
            'open' => 'Mở',
            'cancel' => 'Hủy bỏ',
        ],
    ],
    'upload' => [
        'max_files' => 'Bạn không thể tải lên thêm tệp nào nữa.',
        'invalid_file_type' => 'Bạn không thể tải lên các tệp thuộc định dạng này.',
        'file_too_big' => 'Tệp quá lớn ({{filesize}}MB). Kích thước tối đa: {{maxFilesize}}MB.',
        'response_error' => 'Máy chủ phản hồi với mã lỗi {{statusCode}}.',
        'remove_file' => 'Xóa tệp',
    ],
    'inspector' => [
        'add' => 'Thêm',
        'remove' => 'Gỡ bỏ',
        'key' => 'Khóa',
        'value' => 'Giá trị',
        'ok' => 'OK',
        'cancel' => 'Hủy bỏ',
        'items' => 'Mục',
    ],
];
