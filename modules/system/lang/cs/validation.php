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

    "accepted"         => "The :attribute must be accepted.",
    "active_url"       => ":attribute není validní URL.",
    "after"            => ":attribute musí být datum po :date.",
    "alpha"            => ":attribute musí obsahovat pouze písmena.",
    "alpha_dash"       => ":attribute musí obsahovat pouze písmena, čísla, nebo pomlčky.",
    "alpha_num"        => ":attribute může obsahovat pouze písmena nebo čísla.",
    "array"            => ":attribute musí být pole.",
    "before"           => ":attribute musí být datum před :date.",
    "between"          => [
        "numeric" => ":attribute musí být mezi :min - :max.",
        "file"    => ":attribute musí být mezi :min - :max kilobytama.",
        "string"  => ":attribute musí být mezi :min - :max znaky.",
        "array"   => ":attribute musí být mezi :min - :max položkami.",
    ],
    "confirmed"        => ":attribute potvrzení nesouhlasí.",
    "date"             => ":attribute není validní datum.",
    "date_format"      => ":attribute neodpovídá formátu :format.",
    "different"        => ":attribute a :other musí být rozdílné.",
    "digits"           => ":attribute musí být :digits číslic.",
    "digits_between"   => ":attribute musí mít mezi :min a :max číslicemi.",
    "email"            => ":attribute má nesprávný formát.",
    "exists"           => "Vybraný atribut :attribute již existuje.",
    "image"            => ":attribute musí být obrázek.",
    "in"               => "Vybraný atribut :attribute není správný.",
    "integer"          => ":attribute musí být číslo.",
    "ip"               => ":attribute musí být validní IP adresa.",
    "max"              => [
        "numeric" => ":attribute nesmí být delší než :max.",
        "file"    => ":attribute nesmí být větší než :max kilobytes.",
        "string"  => ":attribute nesmí být větší než :max characters.",
        "array"   => ":attribute nesmí mít více než :max položek.",
    ],
    "mimes"            => ":attribute musí být soubor následujícího typu: :values.",
    "extensions"       => ":attribute musí mít některou z následujících přípon: :values.",
    "min"              => [
        "numeric" => ":attribute musí být alespoň číslo :min.",
        "file"    => ":attribute musí mít alespoň :min kilobytů.",
        "string"  => ":attribute musí mít alespoň :min znaků.",
        "array"   => ":attribute musí mít alespoň :min položek.",
    ],
    "not_in"           => "selected :attribute je nesprávný.",
    "numeric"          => ":attribute musí být číslo.",
    "regex"            => ":attribute formát není správný.",
    "required"         => ":attribute pole je povinné.",
    "required_if"      => ":attribute pole je povinné pokud :other je :value.",
    "required_with"    => ":attribute pole je povinné pokud :values je uvedeno.",
    "required_without" => ":attribute pole je povinné pokud :values není uvedeno.",
    "same"             => ":attribute a :other musí souhlasit.",
    "size"             => [
        "numeric" => ":attribute musí mít velikost :size.",
        "file"    => ":attribute musí mít :size kilobytů.",
        "string"  => ":attribute musí mít :size znaků.",
        "array"   => ":attribute musí obsahovat :size položek.",
    ],
    "unique"           => ":attribute je již použitý.",
    "url"              => ":attribute formát není správný.",

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
