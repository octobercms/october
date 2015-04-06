<?php

return array(

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

    "accepted"         => ":attribute deve ser aceito.",
    "active_url"       => ":attribute não é uma URL válida.",
    "after"            => ":attribute deve ser uma data após :date.",
    "alpha"            => ":attribute só pode conter letras.",
    "alpha_dash"       => ":attribute só pode conter letras, números e traços.",
    "alpha_num"        => ":attribute só pode conter letras e números.",
    "array"            => ":attribute deve ser uma matriz.",
    "before"           => ":attribute deve ser uma data antes de :date.",
    "between"          => array(
        "numeric" => ":attribute deve possuir entre :min - :max.",
        "file"    => ":attribute deve possuir entre :min - :max kilobytes.",
        "string"  => ":attribute deve possuir entre :min - :max carácteres.",
        "array"   => ":attribute tem de ter entre :min - :max itens.",
    ),
    "confirmed"        => "A confirmação de :attribute não corresponde.",
    "date"             => ":attribute não é uma data válida.",
    "date_format"      => ":attribute não coincide com o formato :format.",
    "different"        => ":attribute e :other devem ser diferentes.",
    "digits"           => ":attribute deve ter :digits dígitos.",
    "digits_between"   => ":attribute deve possuir entre :min e :max dígitos.",
    "email"            => "O formato de :attribute é inválido.",
    "exists"           => ":attribute selecioado é inválido.",
    "image"            => ":attribute deve ser uma imagem.",
    "in"               => ":attribute selecioado é inválido.",
    "integer"          => ":attribute deve ser um número inteiro.",
    "ip"               => ":attribute deve ser um endereço IP válido.",
    "max"              => array(
        "numeric" => ":attribute não pode ser maior do que :max.",
        "file"    => ":attribute não pode ser maior do que :max kilobytes.",
        "string"  => ":attribute não pode ser maior do que :max carácteres.",
        "array"   => ":attribute não podem ter mais do que :max itens.",
    ),
    "mimes"            => "O :attribute deve ser um arquivo do tipo: :values.",
    "min"              => array(
        "numeric" => ":attribute deve ser de pelo menos :min.",
        "file"    => ":attribute deve ser de pelo menos :min kilobytes.",
        "string"  => ":attribute deve ser de pelo menos :min carácteres.",
        "array"   => ":attribute deve ter pelo menos :min itens.",
    ),
    "not_in"           => ":attribute selecionado é inválido.",
    "numeric"          => ":attribute deve ser um número.",
    "regex"            => ":attribute formato é inválido.",
    "required"         => "O campo :attribute é obrigatório.",
    "required_if"      => "O campo :attribute é obrigatório quando :other é :value.",
    "required_with"    => "O campo :attribute é obrigatório quando :values está presente.",
    "required_without" => "O campo :attribute é obrigatório quando :values não está presente.",
    "same"             => "O campo :attribute e :other devem corresponder.",
    "size"             => array(
        "numeric" => "O :attribute deve ser :size.",
        "file"    => "O :attribute deve ser :size kilobytes.",
        "string"  => "O :attribute deve ser :size carácteres.",
        "array"   => "O :attribute deve conter :size itens.",
    ),
    "unique"           => "O :attribute já foi utilizado.",
    "url"              => "O :attribute formato é inválido.",

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

);
