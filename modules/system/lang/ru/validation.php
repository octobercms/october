<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted'             => 'Поле :attribute должно быть принято.',
    'active_url'           => 'Поле :attribute неправильный URL.',
    'after'                => 'Поле :attribute должно быть датой после :date.',
    'after_or_equal'       => 'Поле :attribute должно быть датой после или равно :date.',
    'alpha'                => 'Поле :attribute может содержать только буквы.',
    'alpha_dash'           => 'Поле :attribute может содержать только буквы, цифры и дефис.',
    'alpha_num'            => 'Поле :attribute может содержать только буквы и цифры.',
    'array'                => 'Поле :attribute должен быть массивом.',
    'before'               => 'Поле :attribute должно быть датой до :date.',
    'before_or_equal'      => 'Поле :attribute должно быть датой до или равно :date.',
    'between'              => [
        'numeric' => 'Поле :attribute должно быть между :min до :max.',
        'file'    => 'Поле :attribute должно быть между :min до :max килобайт.',
        'string'  => 'Поле :attribute должно быть от :min до :max символов(а).',
        'array'   => 'Поле :attribute должно иметь от :min до :max элементов(а).',
    ],
    'boolean'              => 'Поле :attribute должно быть true или false.',
    'confirmed'            => 'Поле :attribute не совпадает с подтверждением.',
    'date'                 => 'Поле :attribute имеет не правильный формат даты.',
    'date_equals'          => 'Поле :attribute должно быть датой и равно :date.',
    'date_format'          => 'Поле :attribute должно быть датой в формате :format.',
    'different'            => 'Поле :attribute и :other должны различаться.',
    'digits'               => 'Длина цифрового поля :attribute должна быть :digits.',
    'digits_between'       => 'Длина цифрового поля :attribute должна быть между :min и :max.',
    'dimensions'           => 'Поле :attribute имеет не верные размеры изображения.',
    'distinct'             => 'Поле :attribute имеет повторяющееся значение.',
    'email'                => 'Поле :attribute должно быть действительным адресом эл. почты.',
    'ends_with'            => 'Поле :attribute должно заканчиваться на: :values.',
    'exists'               => 'Выбранное значение для :attribute отсутствует.',
    'file'                 => 'Поле :attribute должно быть файлом.',
    'filled'               => 'Поле :attribute должно быть заполнено.',
    'gt'                   => [
        'numeric' => 'Поле :attribute должно быть больше :value.',
        'file'    => 'Поле :attribute должно быть больше :value килобайт.',
        'string'  => 'Поле :attribute должно быть длиннее :value символов(а).',
        'array'   => 'Поле :attribute должно иметь больше :value элементов(а).',
    ],
    'gte'                  => [
        'numeric' => 'Поле :attribute должно быть больше или равно :value.',
        'file'    => 'Поле :attribute должно быть больше или равно :value килобайт.',
        'string'  => 'Поле :attribute должно быть больше или равно :value символов(а).',
        'array'   => 'Поля :attribute должно содержать больше или равно :value элементов(а).',
    ],
    'image'                => 'Поле :attribute должно быть изображением.',
    'in'                   => 'Выбранное значение для :attribute ошибочно.',
    'in_array'             => 'Поле :attribute не существует в :other.',
    'integer'              => 'Поле :attribute должно быть цифрой.',
    'ip'                   => 'Поле :attribute должно быть действительным IP-адресом.',
    'ipv4'                 => 'Поле :attribute должно быть действительным IPv4-адресом.',
    'ipv6'                 => 'Поле :attribute должно быть действительным IPv6-адресом.',
    'json'                 => 'Поле :attribute должно быть корректной JSON строкой.',
    'lt'                   => [
        'numeric' => 'Поле :attribute должно быть меньше :value.',
        'file'    => 'Поле :attribute должно быть меньше :value килобайт.',
        'string'  => 'Поле :attribute должно быть меньше :value символов(а).',
        'array'   => 'Поле :attribute должно содержать меньше :value элементов(а).',
    ],
    'lte'                  => [
        'numeric' => 'Поле :attribute должно быть меньше или равно :value.',
        'file'    => 'Поле :attribute должно быть меньше или равно :value килобайт.',
        'string'  => 'Поле :attribute должно быть меньше или равно :value символов(а).',
        'array'   => 'Поле :attribute должно содержать меньше или равно :value элементов(а).',
    ],
    'max'                  => [
        'numeric' => 'Поле :attribute не может быть больше чем :max.',
        'file'    => 'Поле :attribute не может быть больше чем :max килобайт.',
        'string'  => 'Поле :attribute не может быть больше чем :max символов(а).',
        'array'   => 'Поле :attribute не может содержать больше чем :value элементов(а).',
    ],
    'mimes'                => 'Поле :attribute должен быть файлом типа: :values.',
    'mimetypes'            => 'Поле :attribute должен быть файлом типа: :values.',
    'min'                  => [
        'numeric' => 'Поле :attribute должно быть не менее :min.',
        'file'    => 'Поле :attribute должно быть не менее :min килобайт.',
        'string'  => 'Поле :attribute должно быть не менее :min символов(а).',
        'array'   => 'Поле :attribute должно содержать не менее :min элементов(а).',
    ],
    'not_in'               => 'Выбранное значение для :attribute ошибочно.',
    'not_regex'            => 'Поле :attribute имеет неправильный формат.',
    'numeric'              => 'Поле :attribute должно быть цифрой.',
    'present'              => 'Должно :attribute должно быть представлено.',
    'regex'                => 'Поле :attribute имеет неправильный формат.',
    'required'             => 'Поле :attribute обязательно.',
    'required_if'          => 'Поле :attribute обязательно если поле :other равно :value.',
    'required_unless'      => 'Поле :attribute обязательно если поле :other не имеет :values.',
    'required_with'        => 'Поле :attribute обязательно для заполнения, когда :values указано.',
    'required_with_all'    => 'Поле :attribute обязательно, когда все :values указаны.',
    'required_without'     => 'Поле :attribute обязательно, когда :values не указано.',
    'required_without_all' => 'Поле :attribute обязательно для заполнения, когда все :values не указаны.',
    'same'                 => 'Поле :attribute и :other должны совпадать.',
    'size'                 => [
        'numeric' => 'Поле :attribute должно быть :size.',
        'file'    => 'Поле :attribute должно быть :size килобайт.',
        'string'  => 'Поле :attribute должнол быть длиной в :size символов(а).',
        'array'   => 'Поле :attribute должно содержать :size элементов(а).',
    ],
    'starts_with'          => 'Поле :attribute должно начинаться с: :values.',
    'string'               => 'Поле :attribute должно быть символьной строкой.',
    'timezone'             => 'Поле :attribute должно быть часовым поясом.',
    'unique'               => 'Поле :attribute уже занято другой записью.',
    'uploaded'             => 'Поле :attribute неуспешно загрузилось.',
    'url'                  => 'Поле :attribute имеет ошибочный формат URL.',
    'uuid'                 => 'Поле :attribute должно быть правильным UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of "email". This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [],

];
