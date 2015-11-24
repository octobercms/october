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

    "accepted"         => "El campo :attribute debe ser aceptado.",
    "active_url"       => "El campo :attribute no es una URL válida",
    "after"            => "El campo :attribute debe ser una fecha posterior a :date.",
    "alpha"            => "El campo :attribute sólo debe contener letras.",
    "alpha_dash"       => "El campo :attribute solo puede contener letras, numeros y barras.",
    "alpha_num"        => "El campo :attribute solo puede contener letras y números.",
    "array"            => "El campo :attribute debe ser un array.",
    "before"           => "El campo :attribute debe ser una fecha anterior a :date.",
    "between"          => [
        "numeric" => "El campo :attribute debe tener estar entre :min y :max.",
        "file"    => "El campo :attribute debe ocupar entre :min y :max kilobytes.",
        "string"  => "El campo :attribute debe tener entre :min y :max caracteres.",
        "array"   => "El campo :attribute debe tener entre :min y :max elementos."
    ],
    "confirmed"        => "La confirmación del campo:attribute es incorrecta.",
    "date"             => "El campo :attribute no es una fecha válida.",
    "date_format"      => "El campo :attribute no tiene el formato :format.",
    "different"        => "Los campos :attribute y :other debe ser distintos.",
    "digits"           => "El campo :attribute debe tener :digits dígitos.",
    "digits_between"   => "El campo :attribute debe tener entre :min y :max dígitos.",
    "email"            => "El campo :attribute tiene un formato incorrecto.",
    "exists"           => "El campo :attribute es incorrecto.",
    "image"            => "El campo :attribute debe ser una imagen.",
    "in"               => "El campo :attribute es incorrecto.",
    "integer"          => "El campo :attribute debe ser un entero.",
    "ip"               => "El campo :attribute debe ser una IP válida.",
    "max"              => [
        "numeric" => "El campo :attribute no debe ser mayor que :max.",
        "file"    => "El campo :attribute no debe ocupar más de :max kilobytes.",
        "string"  => "El campo :attribute no debe tener más de :max caracteres.",
        "array"   => "El campo :attribute no debe tener más de :max elementos."
    ],
    "mimes"            => "El campo :attribute debe ser un archivo del tipo: :values.",
    "extensions"       => "El campo :attribute debe tener una extensión de: :values.",	
    "min"              => [
        "numeric" => "El campo :attribute debe ser :min o más.",
        "file"    => "El campo :attribute debe ocupar :min kilobytes o más.",
        "string"  => "El campo :attribute debe tener :min caracteres o más.",
        "array"   => "El campo :attribute debe tener :min elementos o más."
    ],
    "not_in"           => "El campo :attribute es incorrecto.",
    "numeric"          => "El campo :attribute debe ser un número.",
    "regex"            => "El campo :attribute tiene un formato incorrecto.",
    "required"         => "El campo :attribute es obligatorio.",
    "required_if"      => "El campo :attribute es obligatorio si el campo :other es :value.",
    "required_with"    => "El campo :attribute es obligatorio cuando el campo :values está presente.",
    "required_without" => "El campo :attribute es obligatorio cuando el campo :values no está presente.",
    "same"             => "Los campos :attribute y :other deben ser iguales.",
    "size"             => [
        "numeric" => "El campo :attribute debe ser :size.",
        "file"    => "El campo :attribute debe ocupar :size kilobytes.",
        "string"  => "El campo :attribute debe tener :size caracteres.",
        "array"   => "El campo :attribute debe contener :size elementos."
    ],
    "unique"           => "El campo :attribute ya ha sido tomado.",
    "url"              => "El campo :attribute tiene un formato incorrecto.",

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

    'attributes' => []

];
