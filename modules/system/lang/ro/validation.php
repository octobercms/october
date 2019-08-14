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

    "accepted"         => "Atributul :attribute trebuie sa fie acceptat.",
    "active_url"       => "Atributul :attribute nu este un URL valid.",
    "after"            => "Atributul :attribute trebuie sa fie o data dupa data de :date.",
    "alpha"            => "Atributul :attribute poate sa contina doar litere.",
    "alpha_dash"       => "Atributul :attribute poate sa contina doar litere, numere, si liniute.",
    "alpha_num"        => "Atributul :attribute poate sa contina doar litere si numere.",
    "array"            => "Atributul :attribute trebuie sa fie de tip array.",
    "before"           => "Atributul :attribute trebuie sa fie o data inainte de data de :date.",
    "between"          => [
        "numeric" => "Atributul :attribute trebuie sa fie intre :min - :max.",
        "file"    => "Atributul :attribute trebuie sa fie intre :min - :max kilobytes.",
        "string"  => "Atributul :attribute trebuie sa fie intre :min - :max caractere.",
        "array"   => "Atributul :attribute trebuie sa aiba intre :min - :max elemente.",
    ],
    "confirmed"        => "Atributul :attribute de confirmare nu se potriveste.",
    "date"             => "Atributul :attribute nu este o data valida.",
    "date_format"      => "Atributul :attribute nu se potriveste cu formatul :format.",
    "different"        => "Atributele :attribute si :other trebuie sa fie diferite.",
    "digits"           => "Atributul :attribute trebuie sa aiba :digits cifre.",
    "digits_between"   => "Atributul :attribute trebuie sa fie intre :min si :max cifre.",
    "email"            => "Formatul atributului :attribute este invalid.",
    "exists"           => "Atributul selectat :attribute este invalid.",
    "image"            => "Atributul :attribute trebuie sa fie o imagine.",
    "in"               => "Atributul selectat :attribute este invalid.",
    "integer"          => "Atributul :attribute trebuie sa fie un numar.",
    "ip"               => "Atributul :attribute trebuie sa fie o adresa IP valida.",
    "max"              => [
        "numeric" => "Atributul :attribute nu poate fi mai mare de :max.",
        "file"    => "Atributul :attribute nu poate fi mai mare de :max kilobytes.",
        "string"  => "Atributul :attribute nu poate fi mai mare de :max caractere.",
        "array"   => "Atributul :attribute nu poate avea mai mult de :max elemente.",
    ],
    "mimes"            => "Atributul :attribute trebuie sa fie un fisier de tipul: :values.",
    "min"              => [
        "numeric" => "Atributul :attribute trebuie sa aiba cel putin :min caractere",
        "file"    => "Atributul :attribute trebuie sa aiba cel putin :min kilobytes.",
        "string"  => "Atributul :attribute trebuie sa aiba cel putin :min caractere.",
        "array"   => "Atributul :attribute trebuie sa aiba cel putin :min elemente.",
    ],
    "not_in"           => "Atributul selectat :attribute este invalid.",
    "numeric"          => "Atributul :attribute trebuie sa fie un numar.",
    "regex"            => "Formatul atributului :attribute este invalid.",
    "required"         => "Campul atributului :attribute este necesar.",
    "required_if"      => "Campul atributului :attribute este necesar cand atributul :other are valoarea :value.",
    "required_with"    => "Campul atributului :attribute este necesar cand valorea :values este prezenta.",
    "required_without" => "Campul atributului :attribute este necesar cand valoarea :values nu este prezenta.",
    "same"             => "Atributele :attribute si :other trebuie sa corespunda.",
    "size"             => [
        "numeric" => "Atributul :attribute trebuie sa aiba dimensiunea :size.",
        "file"    => "Atributul :attribute trebuie sa aiba dimensiunea :size kilobytes.",
        "string"  => "Atributul :attribute trebuie sa aiba :size caractere.",
        "array"   => "Atributul :attribute trebuie sa contina :size elemente.",
    ],
    "unique"           => "Atributul :attribute exista deja.",
    "url"              => "Formatul atributului :attribute este invalid.",

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
