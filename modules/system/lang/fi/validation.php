<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | such as the size rules. Feel free to tweak each of these messages.
    |
    */

    "accepted"         => ":attribute on hyväksyttävä.",
    "active_url"       => ":attribute ei ole kelvollinen URL.",
    "after"            => ":attribute on oltava pvm :date jälkeen.",
    "alpha"            => ":attribute voi sisältää vain kirjaimia.",
    "alpha_dash"       => ":attribute voi sisältää vain kirjaimia, numeroita ja välimerkkejä.",
    "alpha_num"        => ":attribute voi sisältää vain kirjaimia ja numeroita.",
    "array"            => ":attribute on oltava array.",
    "before"           => ":attribute on oltava pvm ennen :date.",
    "between"          => [
        "numeric" => ":attribute on oltava väliltä :min - :max.",
        "file"    => ":attribute on oltava väliltä :min - :max kilotavua.",
        "string"  => ":attribute on oltava väliltä :min - :max kirjainta.",
        "array"   => ":attribute oltava väliltä :min - :max kohdetta.",
    ],
    "confirmed"        => ":attribute vahvistus ei vastaa toisiaan.",
    "date"             => ":attribute ei ole oikea pvm.",
    "date_format"      => ":attribute ei vastaa muotoa :format.",
    "different"        => ":attribute ja :other on oltava eri.",
    "digits"           => ":attribute on oltava :digits numeroa.",
    "digits_between"   => ":attribute on oltava väliltä :min ja :max numeroa.",
    "email"            => ":attribute muoto on virheellinen.",
    "exists"           => "valittu :attribute ei kelpaa.",
    "image"            => ":attribute on oltava kuva.",
    "in"               => "valittu :attribute ei kelpaa.",
    "integer"          => ":attribute on oltava kokonaisluku.",
    "ip"               => ":attribute on oltava kelvollinen IP-osoite.",
    "max"              => [
        "numeric" => ":attribute ei voi olla enempää kuin :max.",
        "file"    => ":attribute ei voi olla enempää kuin :max kilotavua.",
        "string"  => ":attribute ei voi olla enempää kuin :max kirjainta.",
        "array"   => ":attribute ei voi olla enempää kuin :max kohdetta.",
    ],
    "mimes"            => ":attribute on oltava tyypiltään: :values.",
    "extensions"       => ":attribute on oltava päätteeltään: :values.",
    "min"              => [
        "numeric" => ":attribute on oltava vähintään :min.",
        "file"    => ":attribute on oltava vähintään :min kilotavua.",
        "string"  => ":attribute on oltava vähintään :min merkkiä.",
        "array"   => ":attribute on oltava vähintään :min kohdetta.",
    ],
    "not_in"           => "valittu :attribute ei kelpaa.",
    "numeric"          => ":attribute on oltava numero.",
    "regex"            => ":attribute muoto ei kelpaa.",
    "required"         => ":attribute on pakollinen.",
    "required_if"      => ":attribute kenttä on pakollinen mikäli :other on :value.",
    "required_with"    => ":attribute kenttä on pakollinen mikäli :values on olemassa.",
    "required_without" => ":attribute kenttä on pakollinen mikäli :values ei ole olemassa.",
    "same"             => ":attribute ja :other on vastattava toisiaan",
    "size"             => [
        "numeric" => ":attribute on oltava :size.",
        "file"    => ":attribute oltava :size kilotavua.",
        "string"  => ":attribute on oltava :size merkkiä.",
        "array"   => ":attribute on sisällettävä :size kohdetta.",
    ],
    "unique"           => ":attribute on jo olemassa.",
    "url"              => ":attribute muoto ei kelpaa.",

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
    | following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of "email". This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [],

];
