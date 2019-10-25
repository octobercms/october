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

    "accepted"         => ":attribute muss bestätigt werden.",
    "active_url"       => ":attribute ist keine gültige URL.",
    "after"            => ":attribute muss ein Datum nach :date sein.",
    "alpha"            => ":attribute darf nur Buchstaben enthalten.",
    "alpha_dash"       => ":attribute darf nur Buchstaben, Ziffern und Bindestriche enthalten.",
    "alpha_num"        => ":attribute darf nur Buchstaben und Ziffern enthalten.",
    "array"            => ":attribute muss ein Array sein.",
    "before"           => ":attribute muss ein Datum vor :date sein.",
    "between"          => [
        "numeric" => ":attribute muss zwischen :min und :max liegen.",
        "file"    => ":attribute muss zwischen :min und :max kilobytes groß sein.",
        "string"  => ":attribute-Zeichenanzahl muss zwischen :min und :max liegen.",
        "array"   => ":attribute-Elementanzahl muss zwischen :min und :max liegen.",
    ],
    "confirmed"        => "Bestätigung zu :attribute stimmt nicht überein",
    "date"             => ":attribute ist kein gültiges Datum.",
    "date_format"      => ":attribute hat kein gültiges Datumsformat :format.",
    "different"        => ":attribute und :other müssen sich unterscheiden.",
    "digits"           => "Das :attribute benötigt :digits Zeichen.",
    "digits_between"   => ":attribute-Zeichenanzahl muss zwischen :min und :max liegen.",
    "email"            => "Format von :attribute ist ungültig.",
    "exists"           => "Das ausgewählte Attribut :attribute ist ungültig.",
    "image"            => ":attribute muss ein Bild sein.",
    "in"               => "Das ausgewählte Attribut :attribute ist ungültig.",
    "integer"          => ":attribute muss eine Ganzzahl (integer) sein.",
    "ip"               => ":attribute muss eine gültige IP-Adresse sein.",
    "max"              => [
        "numeric" => ":attribute darf nicht größer als :max sein.",
        "file"    => ":attribute darf nicht größer als :max kilobytes sein.",
        "string"  => ":attribute darf nicht mehr als :max Zeichen haben.",
        "array"   => ":attribute darf nicht mehr als :max Elemente besitzen.",
    ],
    "mimes"            => ":attribute muss eine Datei des Typs: :values sein.",
    "min"              => [
        "numeric" => ":attribute muss mindestens :min sein.",
        "file"    => ":attribute darf nicht kleiner als :min kilobytes sein.",
        "string"  => ":attribute darf nicht weniger als :min Zeichen haben.",
        "array"   => ":attribute darf nicht weniger als :min Elemente besitzen.",
    ],
    "not_in"           => "Das ausgewählte Attribut :attribute ist ungültig.",
    "numeric"          => ":attribute muss eine Zahl sein.",
    "regex"            => "Format von :attribute ist ungültig.",
    "required"         => ":attribute wird benötigt.",
    "required_if"      => ":attribute wird benötigt, wenn :other den Wert :value hat.",
    "required_with"    => ":attribute wird benötigt, wenn :values existiert.",
    "required_without" => ":attribute wird benötigt, wenn :values nicht existiert.",
    "same"             => ":attribute und :other müssen übereinstimmen.",
    "size"             => [
        "numeric" => ":attribute muss :size groß sein.",
        "file"    => ":attribute muss :size kilobytes groß sein.",
        "string"  => "Name von :attribute muss :size Zeichen beinhalten.",
        "array"   => ":attribute muss :size Elemente beinhalten.",
    ],
    "unique"           => ":attribute muss eindeutig sein.",
    "url"              => "Format von :attribute ist ungültig.",

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
