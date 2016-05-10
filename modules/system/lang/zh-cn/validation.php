<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | such as the size rules. Feel free to tweak each of these messages.
    |
    */

    "accepted"         => ":attribute 必须被接受.",
    "active_url"       => ":attribute 不是一个有效的URL.",
    "after"            => ":attribute 必须是 :date 之后的一个日期.",
    "alpha"            => ":attribute 只能包含字母.",
    "alpha_dash"       => ":attribute 只能包含字母, 数字和-.",
    "alpha_num"        => ":attribute 只能包含字母和数字.",
    "array"            => ":attribute 只能是一个数组.",
    "before"           => ":attribute 必须是 :date 之前的一个日期.",
    "between"          => [
        "numeric" => ":attribute 在 :min - :max 之间.",
        "file"    => ":attribute 在 :min - :max kilobytes之间.",
        "string"  => ":attribute 在 :min - :max 字符之间.",
        "array"   => ":attribute 在 :min - :max 个之间.",
    ],
    "confirmed"        => ":attribute 的确认不满足.",
    "date"             => ":attribute 不是一个合法的日期.",
    "date_format"      => ":attribute 不符合 :format 格式.",
    "different"        => ":attribute 和 :other 必须不同.",
    "digits"           => ":attribute 必须是 :digits.",
    "digits_between"   => ":attribute 必须在 :min :max 之间.",
    "email"            => ":attribute 格式无效.",
    "exists"           => "选中的 :attribute 无效.",
    "image"            => ":attribute 必须是图片.",
    "in"               => "选中的 :attribute 无效.",
    "integer"          => ":attribute 必须是数字.",
    "ip"               => ":attribute 必须是一个有效的IP地址.",
    "max"              => [
        "numeric" => ":attribute 不能大于 :max.",
        "file"    => ":attribute 不能大于 :max kilobytes.",
        "string"  => ":attribute 不能超过 :max 字符.",
        "array"   => ":attribute 不能超过 :max 个.",
    ],
    "mimes"            => ":attribute 必须是一个: :values 类型的文件.",
    "extensions"       => ":attribute 必须有一个扩展： :values.",
    "min"              => [
        "numeric" => ":attribute 必须至少 :min.",
        "file"    => ":attribute 必须至少 :min kilobytes.",
        "string"  => ":attribute 必须至少 :min 字符.",
        "array"   => ":attribute 必须至少 :min 个.",
    ],
    "not_in"           => "选中的 :attribute 无效.",
    "numeric"          => ":attribute 必须是一个数字.",
    "regex"            => ":attribute 格式无效.",
    "required"         => "需要 :attribute 字段.",
    "required_if"      => "需要 :attribute 字段, 当 :other 是 :value.",
    "required_with"    => "需要 :attribute 字段, 当 :values 是当前值.",
    "required_without" => "需要 :attribute 字段, 当 :values 不是当前值.",
    "same"             => ":attribute 和 :other 必须匹配.",
    "size"             => [
        "numeric" => ":attribute 必须是 :size.",
        "file"    => ":attribute 必须是 :size kilobytes.",
        "string"  => ":attribute 必须是 :size 字符.",
        "array"   => ":attribute 必须是 :size 个.",
    ],
    "unique"           => ":attribute 已占用.",
    "url"              => ":attribute 格式无效.",

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

    'custom' => array(),

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

    'attributes' => array(),

];
