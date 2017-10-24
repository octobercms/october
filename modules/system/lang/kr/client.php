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
        'formatting' => '서식',
        'quote' => '인용',
        'code' => '코도',
        'header1' => '헤더 1',
        'header2' => '헤더 2',
        'header3' => '헤더 3',
        'header4' => '헤더 4',
        'header5' => '헤더 5',
        'header6' => '헤더 6',
        'bold' => '진하게',
        'italic' => '이탤릭',
        'unorderedlist' => '비순차 목록',
        'orderedlist' => '순차 목록',
        'video' => '동영상',
        'image' => '이미지',
        'link' => '링크',
        'horizontalrule' => '가로선 삽입',
        'fullscreen' => '전체화면',
        'preview' => '미리보기',
    ],
    'mediamanager' => [
        'insert_link' => '미디어 링크 삽입',
        'insert_image' => '그림 삽입',
        'insert_video' => '동영상 삽입',
        'insert_audio' => '소리 삽입',
        'invalid_file_empty_insert' => '링크를 삽입할 파일을 선택해주세요.',
        'invalid_file_single_insert' => '한개의 파일을 선택해주세요.',
        'invalid_image_empty_insert' => '삽입할 그림을 선택해 주세요.',
        'invalid_video_empty_insert' => '삽입할 동영상을 선택해 주세요.',
        'invalid_audio_empty_insert' => '삽입할 소리파일을 선택해 주세요.',
    ],
    'alert' => [
        'confirm_button_text' => '확인',
        'cancel_button_text' => '취소',
        'widget_remove_confirm' => '이 위젯을 삭제하시겠습니까?'
    ],
    'datepicker' => [
        'previousMonth' => '지난 달',
        'nextMonth' => '다음 달',
        'months' => ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        'weekdays' => ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        'weekdaysShort' => ['일', '월', '화', '수', '목', '금', '토']
    ],
    'filter' => [
        'group' => [
            'all' => '전체'
        ],
        'dates' => [
            'all' => '전체',
            'filter_button_text' => '필터',
            'reset_button_text'  => '재설정',
            'date_placeholder' => '날짜',
            'after_placeholder' => '이후',
            'before_placeholder' => '이전'
        ]
    ],
    'eventlog' => [
        'show_stacktrace' => '스택 추적 보기',
        'hide_stacktrace' => '스택 추적 감추기',
        'tabs' => [
            'formatted' => '정리된로그',
            'raw' => '본래로그',
        ],
        'editor' => [
            'title' => '소스코드 편집기',
            'description' => '이런 URL 스키마를 받을 수 있도록 당신의 운영체제가 설정되어야 합니다.',
            'openWith' => '같이 열기',
            'remember_choice' => '이 세션의 옵션을 기억',
            'open' => '열기',
            'cancel' => '취소'
        ]
    ]
];
