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
    "accepted"         => "Kenttä :attribute täytyy hyväksyä.",
    "active_url"       => "Kenttä :attribute ei ole kelvollinen URL.",
    "after"            => "Kentän :attribute täytyy olla päivämäärä :date jälkeen.",
    "alpha"            => "Kenttä :attribute voi sisältää vain kirjaimia.",
    "alpha_dash"       => "Kenttä :attribute voi sisältää vain kirjaimia, numeroita, ja viivoja.",
    "alpha_num"        => "Kenttä :attribute voi sisältää vain kirjaimia ja numeroita.",
    "array"            => "Kentän :attribute on oltava lista.",
    "before"           => "Kentän :attribute täytyy olla päivämäärä ennen :date.",
    "between"          => [
        "numeric" => "Kentän :attribute täytyy olla väliltä :min - :max.",
        "file"    => "Kentän :attribute täytyy olla väliltä :min - :max kilotavua.",
        "string"  => "Kentän :attribute täytyy olla väliltä :min - :max merkkiä.",
        "array"   => "Listan :attribute täytyy sisältää :min - :max väliltä kohdetta.",
    ],
    "confirmed"        => "Kentän :attribute vahvistus ei vastaa toisiaan.",
    "date"             => "Kenttä :attribute ei ole kelvollinen päivämäärä.",
    "date_format"      => "Kenttä :attribute ei vastaa päivämääräformaattia :format.",
    "different"        => "Kenttä :attribute ja :other täytyy olla erilaisia.",
    "digits"           => "Kentän :attribute on oltava :digits numeroa.",
    "digits_between"   => "Kentän :attribute on oltava väliltä :min ja :max.",
    "email"            => "Kentän :attribute muotoilu ei ole kelvollinen.",
    "exists"           => "Valittu kenttä :attribute ei ole kelvollinen.",
    "image"            => "Kentän :attribute on oltava kuva.",
    "in"               => "Valittu kenttä :attribute ei ole kelvollinen.",
    "integer"          => "Kentän :attribute on oltava kokonaisluku.",
    "ip"               => "Kentän :attribute on oltava kelvollin IP osoite.",
    "max"              => [
        "numeric" => "Kenttä :attribute ei voi olla suurempi kuin :max.",
        "file"    => "Kenttä :attribute ei voi olla suurempi kuin :max kilotavua.",
        "string"  => "Kenttä :attribute ei voi olla suurempi kuin :max merkkiä.",
        "array"   => "Lista :attribute ei saa sisältää enempää kuin :max kohdetta.",
    ],
    "mimes"            => "Kentän :attribute on oltava tiedostomuotoa: :values.",
    "extensions"       => "Kentän :attribute on oltava päätteellä: :values.",
    "min"              => [
        "numeric" => "Kentän :attribute on oltava vähintään :min.",
        "file"    => "Kentän :attribute on oltava vähintään :min kilotavua.",
        "string"  => "Kentän :attribute on oltava vähintään :min merkkiä.",
        "array"   => "Listassa :attribute on oltava vähintään :min kohdetta.",
    ],
    "not_in"           => "valittu kenttä :attribute ei ole kelvollinen.",
    "numeric"          => "Kentän :attribute on oltava numero.",
    "regex"            => "Kentän :attribute formaatti ei ole kelvollinen.",
    "required"         => "Kenttä :attribute on vaadittu.",
    "required_if"      => "Kettä :attribute on vaadittu kun kenttä :other on :value.",
    "required_with"    => "Kenttä :attribute on vaadittu kun :values on läsnä.",
    "required_without" => "Kenttä :attribute on vaadittu kun :values ei ole läsnä.",
    "same"             => "Kenttien :attribute ja :other täytyy vastata toisiaan.",
    "size"             => [
        "numeric" => "Kentän :attribute täytyy olla :size.",
        "file"    => "Kentän :attribute täytyy olla :size kilotavua.",
        "string"  => "Kentän :attribute täytyy olla :size merkkiä.",
        "array"   => "Listan :attribute täytyy sisältää :size kohdetta.",
    ],
    "unique"           => "Kenttä :attribute on jo varattu.",
    "url"              => "Kentän :attribute formaatti ei ole kelvollinen.",

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
