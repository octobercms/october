<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Языковые ресурсы для проверки значений
    |--------------------------------------------------------------------------
    |
    | Последующие языковые строки содержат сообщения по-умолчанию, используемые
    | классом, проверяющим значения (валидатором).Некоторые из правил имеют
    | несколько версий, например, size. Вы можете поменять их на любые
    | другие, которые лучше подходят для вашего приложения.
    |
    */

    "accepted"             => "Вы должны принять :attribute.",
    "active_url"           => "Поле :attribute недействительный URL.",
    "after"                => "Поле :attribute должно быть датой после :date.",
    'after_or_equal'       => 'The :attribute must be a date after or equal to :date.',
    "alpha"                => "Поле :attribute может содержать только буквы.",
    "alpha_dash"           => "Поле :attribute может содержать только буквы, цифры и дефис.",
    "alpha_num"            => "Поле :attribute может содержать только буквы и цифры.",
    "array"                => "Поле :attribute должно быть массивом.",
    "before"               => "Поле :attribute должно быть датой перед :date.",
    'before_or_equal'      => 'The :attribute must be a date before or equal to :date.',
    "between"              => [
        "numeric" => "Поле :attribute должно быть между :min и :max.",
        "file"    => "Размер :attribute должен быть от :min до :max Килобайт.",
        "string"  => "Длина :attribute должна быть от :min до :max символов.",
        "array"   => "Поле :attribute должно содержать :min - :max элементов.",
    ],
    'boolean'              => 'The :attribute field must be true or false.',
    "confirmed"            => "Поле :attribute не совпадает с подтверждением.",
    "date"                 => "Поле :attribute не является датой.",
    "date_format"          => "Поле :attribute не соответствует формату :format.",
    "different"            => "Поля :attribute и :other должны различаться.",
    "digits"               => "Длина цифрового поля :attribute должна быть :digits.",
    "digits_between"       => "Длина цифрового поля :attribute должна быть между :min и :max.",
    'dimensions'           => 'The :attribute has invalid image dimensions.',
    'distinct'             => 'The :attribute field has a duplicate value.',
    "email"                => "Поле :attribute имеет ошибочный формат.",
    "exists"               => "Выбранное значение для :attribute уже существует.",
    'file'                 => 'The :attribute must be a file.',
    'filled'               => 'The :attribute field must have a value.',
    "image"                => "Поле :attribute должно быть изображением.",
    "in"                   => "Выбранное значение для :attribute ошибочно.",
    'in_array'             => 'The :attribute field does not exist in :other.',
    "integer"              => "Поле :attribute должно быть целым числом.",
    "ip"                   => "Поле :attribute должно быть действительным IP-адресом.",
    'ipv4'                 => 'The :attribute must be a valid IPv4 address.',
    'ipv6'                 => 'The :attribute must be a valid IPv6 address.',
    'json'                 => 'The :attribute must be a valid JSON string.',
    "max"                  => [
        "numeric" => "Поле :attribute должно быть не больше :max.",
        "file"    => "Поле :attribute должно быть не больше :max Килобайт.",
        "string"  => "Поле :attribute должно быть не длиннее :max символов.",
        "array"   => "Поле :attribute должно содержать не более :max элементов.",
    ],
    "mimes"                => "Поле :attribute должно быть файлом одного из типов: :values.",
    "mimetypes"            => "Поле :attribute должно иметь одно из расширений: :values.",
    "min"                  => [
        "numeric" => "Поле :attribute должно быть не менее :min.",
        "file"    => "Поле :attribute должно быть не менее :min Килобайт.",
        "string"  => "Поле :attribute должно быть не короче :min символов.",
        "array"   => "Поле :attribute должно содержать не менее :min элементов.",
    ],
    "not_in"               => "Выбранное значение для :attribute ошибочно.",
    "numeric"              => "Поле :attribute должно быть числом.",
    'present'              => 'The :attribute field must be present.',
    "regex"                => "Поле :attribute имеет ошибочный формат.",
    "required"             => "Поле :attribute обязательно для заполнения.",
    "required_if"          => "Поле :attribute обязательно для заполнения, когда :other равно :value.",
    'required_unless'      => 'The :attribute field is required unless :other is in :values.',
    "required_with"        => "Поле :attribute обязательно для заполнения, когда :values указано.",
    'required_with_all'    => 'The :attribute field is required when :values is present.',
    "required_without"     => "Поле :attribute обязательно для заполнения, когда :values не указано.",
    'required_without_all' => 'The :attribute field is required when none of :values are present.',
    "same"                 => "Значение :attribute должно совпадать с :other.",
    "size"                 => [
        "numeric" => "Поле :attribute должно быть :size.",
        "file"    => "Поле :attribute должно быть :size Килобайт.",
        "string"  => "Поле :attribute должно быть длиной :size символов.",
        "array"   => "Количество элементов в поле :attribute должно быть :size.",
    ],
    'string'               => 'The :attribute must be a string.',
    'timezone'             => 'The :attribute must be a valid zone.',
    "unique"               => "Такое значение поля :attribute уже существует.",
    'uploaded'             => 'The :attribute failed to upload.',
    "url"                  => "Поле :attribute имеет ошибочный формат.",

    /*
    |--------------------------------------------------------------------------
    | Собственные языковые ресурсы для проверки значений
    |--------------------------------------------------------------------------
    |
    | Здесь Вы можете указать собственные сообщения для атрибутов, используя
    | соглашение именования строк "attribute.rule". Это позволяет легко указать
    | свое сообщение для заданного правила атрибута.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Собственные названия атрибутов
    |--------------------------------------------------------------------------
    |
    | Последующие строки используются для подмены программных имен элементов
    | пользовательского интерфейса на удобочитаемые. Например, вместо имени
    | поля "email" в сообщениях будет выводиться "электронный адрес".
    |
    */

    'attributes' => [],

];
