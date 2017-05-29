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

    "accepted"         => ":attribute peab olema vastuvõetud.",
    "active_url"       => ":attribute ei ole korrektne URL.",
    "after"            => ":attribute peab olema hilisem kui :date.",
    "alpha"            => ":attribute võib sisaldada ainult täthi.",
    "alpha_dash"       => ":attribute võib sisaldada ainult tähti, numbreid ja sidekriipse.",
    "alpha_num"        => ":attribute võib sisaldada ainult tähti ja numbreid.",
    "array"            => ":attribute peab olema massiiv.",
    "before"           => ":attribute peab olema varasem kui :date.",
    "between"          => [
        "numeric" => ":attribute peab olema vahemikus :min - :max.",
        "file"    => ":attribute peab olema vahemikus :min - :max kb.",
        "string"  => ":attribute peab olema vahemikus :min - :max tähemärki.",
        "array"   => ":attribute sisaldama :min - :max elementi.",
    ],
    "confirmed"        => ":attribute kordus ei kattu.",
    "date"             => ":attribute pole korrektne kuupäev.",
    "date_format"      => ":attribute ei vasta vormingule :format.",
    "different"        => ":attribute ja :other peavad olema erinevad.",
    "digits"           => ":attribute peab olema :digits märgiline.",
    "digits_between"   => ":attribute peab olema vahemikus :min and :max märki.",
    "email"            => ":attribute vorming ei ole korrektne.",
    "exists"           => "Valitud :attribute pole korrektne.",
    "image"            => ":attribute peab olema pilt.",
    "in"               => "Valitud :attribute pole korrektne.",
    "integer"          => ":attribute peab olema täisarv.",
    "ip"               => ":attribute peab olema IP aadress.",
    "max"              => [
        "numeric" => ":attribute ei tohi olla täisarv suurem kui :max.",
        "file"    => ":attribute ei tohi olla suurem kui :max kb.",
        "string"  => ":attribute ei tohi olla suurem kui :max tähemärki.",
        "array"   => ":attribute ei tohi sisalda rohkem kui :max elementi.",
    ],
    "mimes"            => ":attribute peab olema fail tüübiga :values.",
    "extensions"       => ":attribute peab olema laiendiga :values.",
    "min"              => [
        "numeric" => ":attribute peab olema vähemalt :min.",
        "file"    => ":attribute peab olema vähemalt :min kb.",
        "string"  => ":attribute peab olema vähemalt :min tähemärki.",
        "array"   => ":attribute peab sisaldama vähemalt :min elementi.",
    ],
    "not_in"           => "Valitud :attribute pole korrektne.",
    "numeric"          => ":attribute peab olema number.",
    "regex"            => ":attribute vormin pole korrektne.",
    "required"         => ":attribute on kohustuslik.",
    "required_if"      => ":attribute on kohustuslik kui :other on :value.",
    "required_with"    => ":attribute on kohustuslik kui :values on olemas.",
    "required_without" => ":attribute on kohustuslik kui :values pole olemas.",
    "same"             => ":attribute ja :other peavad ühtima.",
    "size"             => [
        "numeric" => ":attribute peab olema :size.",
        "file"    => ":attribute peab olema :size kb.",
        "string"  => ":attribute peab olema :size tähemärki.",
        "array"   => ":attribute peab sialdama :size elementi.",
    ],
    "unique"           => ":attribute on juba võetud.",
    "url"              => ":attribute vorming ei ole korrektne.",

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
