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

    "accepted"         => ":attribute skal afkrydses.",
    "active_url"       => ":attribute er ikke en fyldig URL.",
    "after"            => ":attribute skal være en dato efter :date.",
    "alpha"            => ":attribute må kun indeholder bogstaver.",
    "alpha_dash"       => ":attribute må kun indeholder bogstaver, tal og bindestreger.",
    "alpha_num"        => ":attribute må kun indeholde bogstaver og tal.",
    "array"            => ":attribute skal være en array.",
    "before"           => ":attribute skal være en dato før :date.",
    "between"          => [
        "numeric" => ":attribute skal være mellem :min og :max.",
        "file"    => ":attribute skal være :min og :max kilobytes.",
        "string"  => ":attribute skal være mellem :min og :max karakterer.",
        "array"   => ":attribute skal indeholde mellem :min og :max ting.",
    ],
    "confirmed"        => ":attribute bekræftelse matcher ikke.",
    "date"             => ":attribute er ikke en gyldig dato.",
    "date_format"      => ":attribute følger ikke formatet: :format.",
    "different"        => ":attribute og :other må ikke være ens.",
    "digits"           => ":attribute skal være :digits tal.",
    "digits_between"   => ":attribute skal være mellem :min og :max tal.",
    "email"            => ":attribute formatet er ikke en gyldig mail.",
    "exists"           => "Den valgte værdi :attribute er ikke gyldig.",
    "image"            => ":attribute skal være et billede.",
    "in"               => "Den valgte værdi :attribute er ikke gyldig.",
    "integer"          => ":attribute skal være et heltal.",
    "ip"               => ":attribute skal være en gyldig IP adresse.",
    "max"              => [
        "numeric" => ":attribute må ikke være større end :max.",
        "file"    => ":attribute må ikke være større end :max kilobytes.",
        "string"  => ":attribute må ikke være større end :max karakterer.",
        "array"   => ":attribute Må ikke indeholde mere end :max ting.",
    ],
    "mimes"            => ":attribute skal være en fil af typen: :values.",
    "extensions"       => ":attribute skal have en filendelse som: :values.",
    "min"              => [
        "numeric" => ":attribute skal mindst være :min.",
        "file"    => ":attribute skal mindst være :min kilobytes.",
        "string"  => ":attribute skal mindst være :min karakterer.",
        "array"   => ":attribute skal mindst indeholde :min ting.",
    ],
    "not_in"           => ":attribute er en ugyldig værdi.",
    "numeric"          => ":attribute skal være numerisk.",
    "regex"            => ":attribute formatet er ugyldigt.",
    "required"         => "Feltet :attribute skal udfyldes.",
    "required_if"      => "Feltet :attribute skal udfyldes når :other er :value.",
    "required_with"    => "Feltet :attribute er påkrævet når :values er til stede.",
    "required_without" => "Feltet :attribute er påkrævet når :values ikke er til stede.",
    "same"             => ":attribute og :other skal være ens.",
    "size"             => [
        "numeric" => ":attribute skal være :size.",
        "file"    => ":attribute skal være :size kilobytes.",
        "string"  => ":attribute skal være :size karakterer.",
        "array"   => ":attribute skal indeholde :size ting.",
    ],
    "unique"           => ":attribute er allerede taget.",
    "url"              => ":attribute formatet er ugyldigt.",

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
