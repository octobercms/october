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

    "accepted"         => ":attribute 必須被接受.",
    "active_url"       => ":attribute 不是一個有效的URL.",
    "after"            => ":attribute 必須是 :date 之後的一個日期.",
    "alpha"            => ":attribute 只能包含字母.",
    "alpha_dash"       => ":attribute 只能包含字母, 數字和-.",
    "alpha_num"        => ":attribute 只能包含字母和數字.",
    "array"            => ":attribute 只能是一個陣列.",
    "before"           => ":attribute 必須是 :date 之前的一個日期.",
    "between"          => [
        "numeric" => ":attribute 在 :min - :max 之間.",
        "file"    => ":attribute 在 :min - :max kilobytes之間.",
        "string"  => ":attribute 在 :min - :max 字元之間.",
        "array"   => ":attribute 在 :min - :max 個之間.",
    ],
    "confirmed"        => ":attribute 的確認不滿足.",
    "date"             => ":attribute 不是一個合法的日期.",
    "date_format"      => ":attribute 不符合 :format 格式.",
    "different"        => ":attribute 和 :other 必須不同.",
    "digits"           => ":attribute 必須是 :digits.",
    "digits_between"   => ":attribute 必須在 :min :max 之間.",
    "email"            => ":attribute 格式無效.",
    "exists"           => "選取的 :attribute 無效.",
    "image"            => ":attribute 必須是圖片.",
    "in"               => "選取的 :attribute 無效.",
    "integer"          => ":attribute 必須是數字.",
    "ip"               => ":attribute 必須是一個有效的IP地址.",
    "max"              => [
        "numeric" => ":attribute 不能大於 :max.",
        "file"    => ":attribute 不能大於 :max kilobytes.",
        "string"  => ":attribute 不能超過 :max 字元.",
        "array"   => ":attribute 不能超過 :max 個.",
    ],
    "mimes"            => ":attribute 必須是一個: :values 類型的檔案.",
    "min"              => [
        "numeric" => ":attribute 必須至少 :min.",
        "file"    => ":attribute 必須至少 :min kilobytes.",
        "string"  => ":attribute 必須至少 :min 字元.",
        "array"   => ":attribute 必須至少 :min 個.",
    ],
    "not_in"           => "選取的 :attribute 無效.",
    "numeric"          => ":attribute 必須是一個數字.",
    "regex"            => ":attribute 格式無效.",
    "required"         => "需要 :attribute 字串.",
    "required_if"      => "需要 :attribute 字串, 當 :other 是 :value.",
    "required_with"    => "需要 :attribute 字串, 當 :values 是目前值.",
    "required_without" => "需要 :attribute 字串, 當 :values 不是目前值.",
    "same"             => ":attribute 和 :other 必須相符.",
    "size"             => [
        "numeric" => ":attribute 必須是 :size.",
        "file"    => ":attribute 必須是 :size kilobytes.",
        "string"  => ":attribute 必須是 :size 字元.",
        "array"   => ":attribute 必須是 :size 個.",
    ],
    "unique"           => ":attribute 已使用.",
    "url"              => ":attribute 格式無效.",

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

    'custom' => [],

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
