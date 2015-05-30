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

    "accepted"         => ":attribute må aksepteres.",
    "active_url"       => ":attribute er ikke en gyldig URL.",
    "after"            => ":attribute må være en dato etter :date.",
    "alpha"            => ":attribute kan kun inneholde bokstaver.",
    "alpha_dash"       => ":attribute kan kun inneholde bokstaver, tall og bindestreker.",
    "alpha_num"        => ":attribute kan kun inneholde bokstaver og tall.",
    "array"            => ":attribute må være et array.",
    "before"           => ":attribute må være en dato før :date.",
    "between"          => [
        "numeric" => ":attribute må være mellom :min - :max.",
        "file"    => ":attribute må være mellom :min - :max kilobytes.",
        "string"  => ":attribute må være mellom :min - :max tegn.",
        "array"   => ":attribute må ha mellom :min - :max elementer.",
    ],
    "confirmed"        => ":attribute bekreftelse samsvarer ikke.",
    "date"             => ":attribute er ikke en gyldig dato.",
    "date_format"      => ":attribute samsvarer ikke med formatet :format.",
    "different"        => ":attribute og :other må være forskjellig.",
    "digits"           => ":attribute må være :digits tall.",
    "digits_between"   => ":attribute må være mellom :min og :max tall.",
    "email"            => ":attribute format ugyldig.",
    "exists"           => "Valgt :attribute er ugyldig.",
    "image"            => ":attribute må være et bilde.",
    "in"               => "Valgt :attribute er ugyldig.",
    "integer"          => ":attribute må være et heltall.",
    "ip"               => ":attribute må være en gyldig IP-adresse.",
    "max"              => [
        "numeric" => ":attribute kan ikke være større enn :max.",
        "file"    => ":attribute kan ikke være større enn :max kilobytes.",
        "string"  => ":attribute kan ikke inneholde mer enn :max tegn.",
        "array"   => ":attribute kan ikke ha mer enn :max elementer.",
    ],
    "mimes"            => ":attribute må være av filtype: :values.",
    "min"              => [
        "numeric" => ":attribute må være minst :min.",
        "file"    => ":attribute må være minst :min kilobytes.",
        "string"  => ":attribute må være minst :min tegn.",
        "array"   => ":attribute må ha minst :min elementer.",
    ],
    "not_in"           => "Valgt :attribute er ugyldig.",
    "numeric"          => ":attribute må være et tall.",
    "regex"            => ":attribute format er ugyldig.",
    "required"         => ":attribute felt kreves.",
    "required_if"      => ":attribute felt kreves når :other er :value.",
    "required_with"    => ":attribute felt kreves når :values er til stede.",
    "required_without" => ":attribute felt kreves når :values ikke er til stede.",
    "same"             => ":attribute og :other må samsvare.",
    "size"             => [
        "numeric" => ":attribute må være :size.",
        "file"    => ":attribute må være :size kilobytes.",
        "string"  => ":attribute må være :size tegn.",
        "array"   => " :attribute må inneholde :size elementer.",
    ],
    "unique"           => ":attribute er allerede i bruk.",
    "url"              => ":attribute format er ugyldig.",

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
