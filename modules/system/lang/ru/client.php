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
        'formatting' => 'Форматирование',
        'quote' => 'Цитата',
        'code' => 'Код',
        'header1' => 'Заголовок 1',
        'header2' => 'Заголовок 2',
        'header3' => 'Заголовок 3',
        'header4' => 'Заголовок 4',
        'header5' => 'Заголовок 5',
        'header6' => 'Заголовок 6',
        'bold' => 'Жирный шрифт',
        'italic' => 'Курсив',
        'unorderedlist' => 'Ненумерованный список',
        'orderedlist' => 'Нумированный список',
        'video' => 'Видео',
        'image' => 'Изображение',
        'link' => 'Ссылка',
        'horizontalrule' => 'Вставить горизонтальную черту',
        'fullscreen' => 'Полный экран',
        'preview' => 'Предпросмотр',
    ],
    'mediamanager' => [
        'insert_link' => "Вставить медиа-ссылку",
        'insert_image' => "Вставить медиа-изображение",
        'insert_video' => "Вставить медиа-видео",
        'insert_audio' => "Вставить медиа-аудио",
        'invalid_file_empty_insert' => "Пожалуйста, выберите файл для вставки ссылки.",
        'invalid_file_single_insert' => "Пожалуйста, выберите один файл.",
        'invalid_image_empty_insert' => "Пожалуйста, выберите изображения для вставки.",
        'invalid_video_empty_insert' => "Пожалуйста, выберите видео для вставки.",
        'invalid_audio_empty_insert' => "Пожалуйста, выберите аудио для вставки.",
    ],
    'alert' => [
        'confirm_button_text' => 'Ок',
        'cancel_button_text' => 'Отмена',
        'widget_remove_confirm' => 'Удалить этот виджет?',
    ],
    'datepicker' => [
        'previousMonth' => 'Предыдущий месяц',
        'nextMonth' => 'Следующий месяц',
        'months' => ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        'weekdays' => ['Воскресение', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        'weekdaysShort' => ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    ],
    'colorpicker' => [
        'choose' => 'ОК',
    ],
    'filter' => [
        'group' => [
            'all' => 'все',
        ],
        'scopes' => [
            'apply_button_text' => 'Применить',
            'clear_button_text'  => 'Очистить',
        ],
        'dates' => [
            'all' => 'все',
            'filter_button_text' => 'Фильтр',
            'reset_button_text' => 'Сбросить',
            'date_placeholder' => 'Дата',
            'after_placeholder' => 'После',
            'before_placeholder' => 'До',
        ],
        'numbers' => [
            'all' => 'все',
            'filter_button_text' => 'Фильтр',
            'reset_button_text'  => 'Сброс',
            'min_placeholder' => 'Min',
            'max_placeholder' => 'Max',
        ],
    ],
    'eventlog' => [
        'show_stacktrace' => 'Показать трассировку стека',
        'hide_stacktrace' => 'Скрыть трассировку стека',
        'tabs' => [
            'formatted' => 'Форматированный',
            'raw' => 'Исходный',
        ],
        'editor' => [
            'title' => 'Редактор исходного кода',
            'description' => 'Ваша операционная система должна быть настроена на прослушивание к одной из этих схем URL.',
            'openWith' => 'Открыть с помощью',
            'remember_choice' => 'Запомнить выбранный вариант для этой сессии',
            'open' => 'Открыть',
            'cancel' => 'Отмена',
        ],
    ],
];
