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

    "accepted"         => "O :attribute deve ser aceito.",
    "active_url"       => "O :attribute não é uma URL válida.",
    "after"            => "O :attribute deve ser uma data após :date.",
    "alpha"            => "O :attribute só pode conter letras.",
    "alpha_dash"       => "O :attribute só pode conter letras, números e traços.",
    "alpha_num"        => "O :attribute só pode conter letras e números.",
    "array"            => "O :attribute deve ser uma matriz.",
    "before"           => "O :attribute deve ser uma data antes :date.",
    "between"          => array(
        "numeric" => "O :attribute deve situar-se entre :min - :max.",
        "file"    => "O :attribute deve situar-se entre :min - :max kilobytes.",
        "string"  => "O :attribute deve situar-se entre :min - :max carácteres.",
        "array"   => "O :attribute tem de ter entre :min - :max itens.",
    ),
    "confirmed"        => "O :attribute confirmação não corresponde.",
    "date"             => "O :attribute não é uma data válida.",
    "date_format"      => "O :attribute não coincide com o formato :format.",
    "different"        => "O :attribute e :other deve ser diferente.",
    "digits"           => "O :attribute deve ser :digits dígitos.",
    "digits_between"   => "O :attribute deve situar-se entre :min e :max dígitos.",
    "email"            => "O :attribute formato é inválido.",
    "exists"           => "O :attribute selecioado é inválido.",
    "image"            => "O :attribute deve ser uma imagem.",
    "in"               => "O :attribute selecioado é inválido.",
    "integer"          => "O :attribute deve ser um número inteiro.",
    "ip"               => "O :attribute deve ser um endereço IP válido.",
    "max"              => array(
        "numeric" => "O :attribute não pode ser maior do que :max.",
        "file"    => "O :attribute não pode ser maior do que :max kilobytes.",
        "string"  => "O :attribute não pode ser maior do que :max carácteres.",
        "array"   => "O :attribute não podem ter mais do que :max itens.",
    ),
    "mimes"            => "O :attribute deve ser um arquivo do tipo: :values.",
    "min"              => array(
        "numeric" => "O :attribute deve ser de pelo menos :min.",
        "file"    => "O :attribute deve ser de pelo menos :min kilobytes.",
        "string"  => "O :attribute deve ser de pelo menos :min carácteres.",
        "array"   => "O :attribute deve ter pelo menos :min itens.",
    ),
    "not_in"           => "O :attribute selecionado é inválido.",
    "numeric"          => "O :attribute deve ser um número.",
    "regex"            => "O :attribute formato é inválido.",
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
