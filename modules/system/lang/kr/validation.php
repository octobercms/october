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

    "accepted"             => ":attribute을 승인해주세요.",
    "active_url"           => ":attribute은 유효한URL이 아닙니다.",
    "after"                => ":attribute은 :date이후의 일자를 설정해 주세요.",
    "alpha"                => ":attribute에는 알파벳만 사용해주세요.",
    "alpha_dash"           => ":attribute에는 영문자('A-Z','a-z','0-9')와 하이픈또는 언더스코어('-','_')만 사용할 수 있습니다.",
    "alpha_num"            => ":attribute에는 영문자('A-Z','a-z','0-9')만 사용할 수 있습니다.",
    "array"                => ":attribute에는 배열을 지정해주세요.",
    "before"               => ":attribute에는 :date이전의 일자를 설정해주세요.",
    "between"              => [
        "numeric" => ":attribute에는 :min부터 :max까지의 숫자를 설정해주세요.",
        "file"    => ":attribute에는 :min KB부터 :max KB까지의 사이즈에 파일만 지정해주세요.",
        "string"  => ":attribute는 :min에서 :max개의 문자로 해주세요.",
        "array"   => ":attribute 갯수는 :min개부터 :max개까지로 해주세요.",
    ],
    "boolean"              => ":attribute속성은 'true'나'false'을 선택해주세요.",
    "confirmed"            => ":attribute와 :attribute가 일치하지 않습니다.",
    "date"                 => ":attribute는 올바른 일자로 설정해주세요.",
    "date_format"          => ":attribute의 형식이 ':format'과 일치하지 않습니다.",
    "different"            => ":attribute와 :other는 달라야합니다.",
    "digits"               => ":attribute와 :digits자릿수로 해주세요.",
    "digits_between"       => ":attribute는 :min에서 :max까지의 자릿수로 해주세요.",
    "email"                => ":attribute는 유효한 메일주소 형식을 설정해주세요.",
    "exists"               => "선택하신:attribute은 유효하지 않습니다.",
    "image"                => ":attribute은 이미지를 선택해주세요.",
    "in"                   => "선택된:attribute은 유효하지 않습니다.",
    "integer"              => ":attribute에는 정수를 설정해주세요.",
    "ip"                   => ":attribute에는 유효한 IP주소를 설정해주세요.",
    "max"                  => [
        "numeric" => ":attribute에는 :max이하의 숫자를 설정해주세요.",
        "file"    => ":attribute에는 :max KB이하의 파일을 선택해주세요.",
        "string"  => ":attribute는 :max개문자 이하로 해주세요.",
        "array"   => ":attribute 갯수는 :max개 이하로 해주세요.",
    ],
    "mimes"                => ":attribute에는 :values타입의 파일을 선택해주세요.",
    "min"                  => [
        "numeric" => ":attribute에는 :min이상의 숫자를 설정해주세요.",
        "file"    => ":attribute에는 :min KB이상의 파일을 선택해주세요.",
        "string"  => ":attribute는 :min문자이상으로 해주세요.",
        "array"   => ":attribute 갯수는 :max개 이상으로 해주세요.",
    ],
    "not_in"               => "선택된:attribute는 유효하지 않습니다.",
    "numeric"              => ":attribute는 숫자만으로 설정해주세요.",
    "regex"                => ":attribute에는 유효한 정규표현식을 지정해주세요.",
    "required"             => ":attribute는 반드시 설정되어야 합니다.",
    "required_if"          => ":other가:value일경우 :attribute를 설정해야 합니다.",
    "required_with"        => ":values가 설정될경우 :attribute도 설정해야 합니다.",
    "required_with_all"    => ":values를 모두 설정했다면 :attribute도 설정해야 합니다.",
    "required_without"     => ":values가 설정되지 않았을경우 :attribute를 설정해야 합니다.",
    "required_without_all" => ":values가 모두 설정되지 않았다면 :attribute를 설정해야 합니다.",
    "same"                 => ":attribute와 :other가 일치해야 합니다.",
    "size"                 => [
        "numeric" => ":attribute는 :size로 설정해주세요.",
        "file"    => ":attribute를 :size KB파일로 설정해주세요.",
        "string"  => ":attribute는 :size문자로 해주세요.",
        "array"   => ":attribute 갯수는 :size개로 해주세요.",
    ],
    "unique"               => "설정된 :attribute는 이미사용되고 있습니다.",
    "url"                  => ":attribute는 유효한 URL형식으로 설정해주세요.",

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
