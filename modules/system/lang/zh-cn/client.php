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
        'formatting' => '格式化',
        'quote' => '引用',
        'code' => '代码',
        'header1' => '标题 1',
        'header2' => '标题 2',
        'header3' => '标题 3',
        'header4' => '标题 4',
        'header5' => '标题 5',
        'header6' => '标题 6',
        'bold' => '粗体',
        'italic' => '斜体',
        'unorderedlist' => '无序列表',
        'orderedlist' => '有序列表',
        'video' => '视频',
        'image' => '图片',
        'link' => '链接',
        'horizontalrule' => '插入分割线',
        'fullscreen' => '全屏',
        'preview' => '预览',
    ],
    'mediamanager' => [
        'insert_link' => "插入链接",
        'insert_image' => "插入图片",
        'insert_video' => "插入视频",
        'insert_audio' => "插入音频",
        'invalid_file_empty_insert' => "请选择要插入的文件。",
        'invalid_file_single_insert' => "请选择要插入的文件。",
        'invalid_image_empty_insert' => "请选择要插入的图片文件。",
        'invalid_video_empty_insert' => "请选择要插入的视频文件。",
        'invalid_audio_empty_insert' => "请选择要插入的音频文件。",
    ],
    'alert' => [
        'error' => '错误',
        'confirm' => '确认',
        'dismiss' => '取消',
        'confirm_button_text' => '确定',
        'cancel_button_text' => '取消',
        'widget_remove_confirm' => '删除这个小部件?',
    ],
    'datepicker' => [
        'previousMonth' => '上一个月',
        'nextMonth' => '下一个月',
        'months' => ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        'weekdays' => ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        'weekdaysShort' => ['日', '一', '二', '三', '四', '五', '六']
    ],
    'colorpicker' => [
        'choose' => '好',
    ],
    'filter' => [
        'group' => [
            'all' => '全部',
        ],
        'scopes' => [
            'apply_button_text' => '应用',
            'clear_button_text' => '清除',
        ],
        'dates' => [
            'all' => '全部',
            'filter_button_text' => '筛选',
            'reset_button_text' => '重置',
            'date_placeholder' => '日期',
            'after_placeholder' => '之后',
            'before_placeholder' => '之前',
        ],
        'numbers' => [
            'all' => '全部',
            'filter_button_text' => '过滤器',
            'reset_button_text' => '重置',
            'min_placeholder' => '最小',
            'max_placeholder' => '最大',
        ],
    ],
    'eventlog' => [
        'show_stacktrace' => '显示堆栈',
        'hide_stacktrace' => '隐藏堆栈',
        'tabs' => [
            'formatted' => '格式化',
            'raw' => '原始',
        ],
        'editor' => [
            'title' => '源代码编辑器',
            'description' => '您的系统应配置一个侦听这些 URL 的方案',
            'openWith' => '打开方式',
            'remember_choice' => '记住本次会话选择的选项',
            'open' => '打开',
            'cancel' => '取消',
        ],
    ],
    'upload' => [
        'max_files' => '您不能上传任何文件',
        'invalid_file_type' => '您不能上传这种类型的文件',
        'file_too_big' => '文件太大 ({{filesize}}MB)。 最大文件大小：{{maxFilesize}}MB',
        'response_error' => '服务器响应 {{statusCode}} 代码',
        'remove_file' => '删除文件',
    ],
];
