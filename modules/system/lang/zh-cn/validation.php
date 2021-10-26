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

    "accepted"         => ":attribute 必须被接受。",
    "active_url"       => ":attribute 不是一个有效的URL。",
    "after"            => ":attribute 必须是 :date 之后的一个日期。",
    'after_or_equal'       => ':attribute 必须是等于 :date 或之后的一个日期。',
    "alpha"            => ":attribute 只能包含字母。",
    "alpha_dash"       => ":attribute 只能包含字母, 数字和-。",
    "alpha_num"        => ":attribute 只能包含字母和数字。",
    "array"            => ":attribute 只能是一个数组。",
    "before"           => ":attribute 必须是 :date 之前的一个日期。",
    'before_or_equal'      => ':attribute 必须是等于 :date 或之前的一个日期。',
    "between"          => [
        "numeric" => ":attribute 在 :min - :max 之间。",
        "file"    => ":attribute 在 :min - :max kilobytes之间。",
        "string"  => ":attribute 在 :min - :max 字符之间。",
        "array"   => ":attribute 在 :min - :max 个之间。",
    ],
    'boolean'              => ':attribute 字段必须为布尔型。',
    "confirmed"        => ":attribute 的确认不满足。",
    "date"             => ":attribute 不是一个合法的日期。",
    'date_equals'          => ':attribute 必须是等于 :date 的日期。',
    "date_format"      => ":attribute 不符合 :format 格式。",
    "different"        => ":attribute 和 :other 必须不同。",
    "digits"           => ":attribute 必须是 :digits。",
    "digits_between"   => ":attribute 必须在 :min :max 之间。",
    'dimensions'           => ':attribute 的图片尺寸无效。',
    'distinct'             => ':attribute 字段有重复值。',
    "email"            => ":attribute 格式无效。",
    'ends_with'            => ':attribute 必须以下列之一结束: :values。',
    "exists"           => "选中的 :attribute 无效。",
    'file' => ':attribute 必须是一个文件。',
    'fill' => ':attribute 字段必须有值。',
    'gt'                   => [
        'numeric' => ':attribute 必须大于 :value。',
        'file' => ':attribute 必须大于 :value 千字节。',
        'string' => ':attribute 必须大于 :value 字符。',
        'array' => ':attribute 必须大于:value 个。',
    ],
    'gte'                  => [
        'numeric' => ':attribute 必须大于或等于:value。',
        'file' => ':attribute 必须大于或等于 :value 千字节。',
        'string' => ':attribute 必须大于或等于:value 字符。',
        'array' => ':attribute 必须有 :value 个或更多。',
    ],
    "image"            => ":attribute 必须是图片。",
    "in"               => "选中的 :attribute 无效。",
    'in_array' => ':other 中不存在 :attribute 字段。',
    "integer"          => ":attribute 必须是数字。",
    "ip"               => ":attribute 必须是一个有效的IP地址。",
    'ipv4' => ':attribute 必须是一个有效的 IPv4 地址。',
    'ipv6' => ':attribute 必须是一个有效的 IPv6 地址。',
    'json' => ':attribute 必须是一个有效的 JSON 字符串。',
    'lt'                   => [
        'numeric' => ':attribute 必须小于:value。',
        'file' => ':attribute 必须小于 :value 千字节。',
        'string' => ':attribute 必须小于 :value 字符。',
        'array' => ':attribute 必须小于 :value 个。',
    ],
    'lte'                  => [
        'numeric' => ':attribute 必须小于或等于:value。',
         'file' => ':attribute 必须小于或等于 :value 千字节。',
         'string' => ':attribute 必须小于或等于:value 字符。',
         'array' => ':attribute 不能超过 :value 个。',
    ],
    "max"              => [
        "numeric" => ":attribute 不能大于 :max。",
        "file"    => ":attribute 不能大于 :max kilobytes。",
        "string"  => ":attribute 不能超过 :max 字符。",
        "array"   => ":attribute 不能超过 :max 个。",
    ],
    "mimes"            => ":attribute 必须是一个: :values 类型的文件。",
    'mimetypes'            => ':attribute 必须是一个类型为 :values 的文件。',
    "min"              => [
        "numeric" => ":attribute 必须至少 :min。",
        "file"    => ":attribute 必须至少 :min kilobytes。",
        "string"  => ":attribute 必须至少 :min 字符。",
        "array"   => ":attribute 必须至少 :min 个。",
    ],
    "not_in"           => "选中的 :attribute 无效。",
    'not_regex'            => ':attribute 格式无效。',
    "numeric"          => ":attribute 必须是一个数字。",
    'present'              => '必须存在 :attribute 字段。',
    "regex"            => ":attribute 格式无效。",
    "required"         => "需要 :attribute 字段。",
    "required_if"      => "需要 :attribute 字段, 当 :other 是 :value。",
    'required_unless'      => 'attribute 字段是必需的，除非 :other 在 :values 中。',
    "required_with"    => "需要 :attribute 字段, 当 :values 是当前值。",
    'required_with_all'    => '当 :values 存在时， :attribute 字段是必需的。',
    "required_without" => "需要 :attribute 字段, 当 :values 不是当前值。",
    'required_without_all' => '当 :values 都不存在时， :attribute 字段是必需的。',
    "same"             => ":attribute 和 :other 必须匹配。",
    "size"             => [
        "numeric" => ":attribute 必须是 :size。",
        "file"    => ":attribute 必须是 :size kilobytes。",
        "string"  => ":attribute 必须是 :size 字符。",
        "array"   => ":attribute 必须是 :size 个。",
    ],
    'starts_with'          => ':attribute 必须是以下之一开始: :values。',
    'string'               => ':attribute 必须是字符串。',
    'timezone'             => ':attribute 必须是一个有效的区域。',
    "unique"           => ":attribute 已占用。",
    'uploaded'             => ':attribute 上传失败。',
    "url"              => ":attribute 格式无效。",
    'uuid'                 => ':attribute 必须是有效的 UUID。',

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
