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

    "accepted"         => "Het veld :attribute moet worden geaccepteerd.",
    "active_url"       => "De URL van :attribute is ongeldig.",
    "after"            => "De datum van :attribute moet een waarde zijn na :date.",
    "alpha"            => "Het veld :attribute mag enkel uit letters bestaan.",
    "alpha_dash"       => "Het veld :attribute mag enkel uit letters, cijfers en streepjes bestaan.",
    "alpha_num"        => "Het veld :attribute mag enkel uit letters en cijfers bestaan.",
    "array"            => "Het veld :attribute moet een array zijn.",
    "before"           => "De datum van :attribute moet een waarde zijn voor :date.",
    "between"          => array(
        "numeric" => "Het veld :attribute moet een waarde hebben tussen :min en :max.",
        "file"    => "De bestandsgrootte van :attribute moet tussen :min en :max kilobytes zijn.",
        "string"  => "Het aantal tekens van :attribute moet tussen de :min en :max zijn.",
        "array"   => "Het veld :attribute moet tussen de :min en :max objecten bevatten.",
    ),
    "confirmed"        => "De bevestiging van :attribute is ongeldig.",
    "date"             => "De datum van :attribute is ongeldig.",
    "date_format"      => "Het veld :attribute komt niet overeen met het formaat :format.",
    "different"        => "De velden :attribute en :other moeten verschillend zijn.",
    "digits"           => "Het veld :attribute moet uit :digits cijfers bestaan.",
    "digits_between"   => "Het veld :attribute moet tussen :min en :max tekens lang zijn.",
    "email"            => "Het e-mailadres van :attribute is ongeldig.",
    "exists"           => "De waarde van :attribute is ongeldig.",
    "image"            => "De afbeelding van :attribute is ongeldig.",
    "in"               => "De gekozen waarde van :attribute is ongeldig.",
    "integer"          => "De waarde van :attribute moet uit een heel getal bestaan.",
    "ip"               => "Het IP-adres van :attribute is ongeldig.",
    "max"              => array(
        "numeric" => "De waarde van :attribute mag niet hoger zijn dan :max.",
        "file"    => "De bestandsgrootte van :attribute mag niet groter zijn dan :max kilobytes.",
        "string"  => "Het aantal tekens van :attribute mag niet groter zijn dan :max tekens.",
        "array"   => "Het veld :attribute mag niet meer dan :max objecten bevatten.",
    ),
    "mimes"            => "Het bestand van :attribute mag enkel zijn van het type: :values.",
    "min"              => array(
        "numeric" => "De waarde van :attribute minimaal :min zijn.",
        "file"    => "De bestandsgrootte van :attribute moet minimaal :min kilobytes zijn.",
        "string"  => "Het aantal tekens van :attribute moet minimaal :min zijn.",
        "array"   => "Het veld :attribute moet minimaal :min objecten bevatten.",
    ),
    "not_in"           => "De gekozen waarde van :attribute is ongeldig.",
    "numeric"          => "De waarde van :attribute moet numeriek zijn.",
    "regex"            => "De opbouw van :attribute is ongeldig.",
    "required"         => "Het veld :attribute is verplicht.",
    "required_if"      => "Het veld :attribute is verplicht wanneer :other is :value.",
    "required_with"    => "Het veld :attribute is verplicht wanneer :values is gekozen.",
    "required_without" => "Het veld :attribute is verplicht wanneer :values niet is gekozen.",
    "same"             => "De velden :attribute en :other moeten overeen komen.",
    "size"             => array(
        "numeric" => "De waarde van :attribute moet exact :size zijn.",
        "file"    => "De bestandsgrootte van :attribute moet exact :size kilobytes zijn.",
        "string"  => "Het aantal tekens van :attribute moet exact :size zijn.",
        "array"   => "Het veld :attribute moet exact :size objecten bevatten.",
    ),
    "unique"           => "Het veld :attribute is al toegewezen.",
    "url"              => "De URL van :attribute is ongeldig.",

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
