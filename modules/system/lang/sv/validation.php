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

    "accepted"         => ":attribute måste accepteras.",
    "active_url"       => ":attribute är ej en korrekt URL.",
    "after"            => ":attribute måste vara ett datum efter :date.",
    "alpha"            => ":attribute får endast innehålla bokstäver.",
    "alpha_dash"       => ":attribute får endast innehålla bokstäver, nummer och streck.",
    "alpha_num"        => ":attribute får endast innehålla bokstäver och nummer",
    "array"            => ":attribute måste vara en array.",
    "before"           => ":attribute måste vara ett datum innan :date.",
    "between"          => [
        "numeric" => ":attribute måste vara mellan :min - :max.",
        "file"    => ":attribute måste vara mellan :min - :max kilobytes.",
        "string"  => ":attribute måste vara mellan :min - :max tecken.",
        "array"   => ":attribute måste ha mellan :min - :max objekt.",
    ],
    "confirmed"        => ":attribute bekräftelse matchar ej.",
    "date"             => ":attribute är inte ett korrekt datum.",
    "date_format"      => ":attribute matchar inte formatet :format.",
    "different"        => ":attribute och :other måste skilja sig åt.",
    "digits"           => ":attribute måste vara :digits siffror.",
    "digits_between"   => ":attribute måste vara between :min and :max siffror.",
    "email"            => ":attribute format är felaktigt.",
    "exists"           => "Valt :attribute är felaktigt.",
    "image"            => ":attribute måste vara en bild.",
    "in"               => "Valt :attribute är felaktigt.",
    "integer"          => ":attribute måste vara en siffra.",
    "ip"               => ":attribute måste vara en giltig epost-adress.",
    "max"              => [
        "numeric" => ":attribute får inte vara större än :max.",
        "file"    => ":attribute får inte vara större än :max kilobytes.",
        "string"  => ":attribute får inte vara större än :max tecken.",
        "array"   => ":attribute får inte innehålla mer än :max objekt.",
    ],
    "mimes"            => ":attribute måste vara en fil av typen: :values.",
    "extensions"       => ":attribute måste ha ett av följande filtillägg: :values.",
    "min"              => [
        "numeric" => ":attribute måste vara minst :min.",
        "file"    => ":attribute måste vara minst :min kilobytes.",
        "string"  => ":attribute måste vara minst :min tecken.",
        "array"   => ":attribute måste ha minst :min objekt.",
    ],
    "not_in"           => "Valt :attribute är felaktigt.",
    "numeric"          => ":attribute måste vara ett number.",
    "regex"            => ":attribute format är felaktigt.",
    "required"         => ":attribute är obligatoriskt.",
    "required_if"      => ":attribute är obligatoriskt när :other is :value.",
    "required_with"    => ":attribute är obligatoriskt när :values är satt.",
    "required_without" => ":attribute är obligatoriskt när :values ej är satt.",
    "same"             => ":attribute och :other måste matcha.",
    "size"             => [
        "numeric" => ":attribute måste vara :size.",
        "file"    => ":attribute måste vara :size kilobytes.",
        "string"  => ":attribute måste vara :size tecken.",
        "array"   => ":attribute måste innehålla :size objekt.",
    ],
    "unique"           => ":attribute är redan upptaget.",
    "url"              => "Formatet :attribute är felaktigt.",

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
