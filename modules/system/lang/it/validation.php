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

    "accepted"         => ":attribute deve essere accettato.",
    "active_url"       => ":attribute non è un URL valido.",
    "after"            => ":attribute deve essere una data maggiore di :date.",
    "alpha"            => ":attribute può contenere solo lettere.",
    "alpha_dash"       => ":attribute può contenere solo lettere, numeri e trattini.",
    "alpha_num"        => ":attribute può contenere solo lettere e numeri.",
    "array"            => ":attribute deve essere un array.",
    "before"           => ":attribute deve essere una data minore di :date.",
    "between"          => [
        "numeric" => ":attribute deve essere compreso tra :min e :max.",
        "file"    => ":attribute deve essere compreso tra :min e :max kilobytes.",
        "string"  => ":attribute deve essere compreso tra :min e :max caratteri.",
        "array"   => ":attribute deve avere tra :min e :max elementi.",
    ],
    "confirmed"        => "La conferma :attribute non corrisponde.",
    "date"             => ":attribute non è una data valida.",
    "date_format"      => ":attribute non corrisponde al formato :format.",
    "different"        => ":attribute e :other devono essere diversi.",
    "digits"           => ":attribute deve essere di :digits cifre.",
    "digits_between"   => ":attribute deve essere tra :min e :max cifre.",
    "email"            => "Il formato di :attribute non è valido.",
    "exists"           => "Il valore di :attribute non è valido.",
    "image"            => ":attribute deve essere un'immagine.",
    "in"               => "Il valore di  :attribute non è valido.",
    "integer"          => ":attribute deve essere un numero interno.",
    "ip"               => ":attribute deve essere un indirizzo IP valido.",
    "max"              => [
        "numeric" => ":attribute non può essere maggiore di :max.",
        "file"    => ":attribute non può essere maggiore di :max kilobytes.",
        "string"  => ":attribute non può essere maggiore di :max caratteri.",
        "array"   => ":attribute non può avere più di :max elementi.",
    ],
    "mimes"            => ":attribute deve essere un file di tipo: :values.",
    "extensions"       => ":attribute deve avere un estensione: :values.",
    "min"              => [
        "numeric" => ":attribute deve essere almeno :min.",
        "file"    => ":attribute deve essere almeno :min kilobytes.",
        "string"  => ":attribute deve essere almeno :min caratteri.",
        "array"   => ":attribute deve avere almeno :min elementi.",
    ],
    "not_in"           => "Il valore di :attribute non è valido.",
    "numeric"          => ":attribute deve essere un numero.",
    "regex"            => "Il formato di :attribute non è valido.",
    "required"         => "Il campo :attribute è obbligatorio.",
    "required_if"      => "Il campo :attribute è obbligatorio quando :other è :value.",
    "required_with"    => "Il campo :attribute è obbligatorio quando :values è presente.",
    "required_without" => "Il campo :attribute è obbligatorio quando :values non è presente.",
    "same"             => ":attribute e :other devono corrispondere.",
    "size"             => [
        "numeric" => ":attribute deve essere :size.",
        "file"    => ":attribute deve essere :size kilobytes.",
        "string"  => ":attribute deve essere :size caratteri.",
        "array"   => ":attribute deve contenere :size elementi.",
    ],
    "unique"           => ":attribute è già presente.",
    "url"              => "Il formato di :attribute non è valido.",

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
