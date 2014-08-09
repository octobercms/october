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

    "accepted"         => "Le :attribute doit être accepté.",
    "active_url"       => "Le :attribute n'est pas une URL valide.",
    "after"            => "Le :attribute doit être une date après le :date.",
    "alpha"            => "Le :attribute ne peut contenir que des lettres.",
    "alpha_dash"       => "Le :attribute ne peut contenir que des lettres, des chiffres et des tirets.",
    "alpha_num"        => "Le :attribute ne peut contenir que des lettres et des chiffres.",
    "array"            => "Le :attribute doit être un groupe.",
    "before"           => "Le :attribute doit être une date avant le :date.",
    "between"          => array(
        "numeric" => "Le :attribute doit être compris entre :min - :max.",
        "file"    => "Le :attribute doit être compris entre :min - :max kilobytes.",
        "string"  => "Le :attribute doit être compris entre :min - :max caractères.",
        "array"   => "Le :attribute doit être compris entre :min - :max objets.",
    ),
    "confirmed"        => "Le :attribute de confirmation ne correspond pas.",
    "date"             => "Le :attribute n'est pas une date valide.",
    "date_format"      => "Le :attribute ne correspond pas au format :format.",
    "different"        => "Le :attribute et :other doivent être différents.",
    "digits"           => "Le :attribute doit être de :digits chiffres.",
    "digits_between"   => "Le :attribute doit être compris entre :min et :max chiffres.",
    "email"            => "Le format de l':attribute  n'est pas valide.",
    "exists"           => "Le :attribute sélectionné n'est pas valide.",
    "image"            => "Le :attribute doit être une image.",
    "in"               => "Le :attribute sélectionné n'est pas valide.",
    "integer"          => "Le :attribute doit être un entier.",
    "ip"               => "Le :attribute doit être une adresse IP valide.",
    "max"              => array(
        "numeric" => "Le :attribute ne peut pas être supérieure à :max.",
        "file"    => "Le :attribute ne peut pas être supérieure à :max kilobytes.",
        "string"  => "Le :attribute ne peut pas être supérieure à :max caractères.",
        "array"   => "Le :attribute ne peut pas être supérieure à :max objets.",
    ),
    "mimes"            => "Le :attribute doit être un fichier de type: :values.",
    "min"              => array(
        "numeric" => "Le :attribute doit être au minimum de :min.",
        "file"    => "Le :attribute doit être au minimum de :min kilobytes.",
        "string"  => "Le :attribute doit être au minimum de :min caractères.",
        "array"   => "Le :attribute doit être au minimum de :min objets.",
    ),
    "not_in"           => "Le :attribute sélectionné n'est pas valide.",
    "numeric"          => "Le :attribute doit être un nombre.",
    "regex"            => "Le format de l':attribute  n'est pas valide.",
    "required"         => "Le champ: :attribute est obligatoire.",
    "required_if"      => "Le champ: :attribute est obligatoire quand :other est :value.",
    "required_with"    => "Le champ: :attribute est obligatoire quand :values est présent.",
    "required_without" => "Le champ: :attribute est obligatoire quand :values est absent.",
    "same"             => "Le :attribute et :other doivent correspondre.",
    "size"             => array(
        "numeric" => "Le :attribute doit être de :size.",
        "file"    => "Le :attribute doit être de :size kilobytes.",
        "string"  => "Le :attribute doit être de :size caractères.",
        "array"   => "Le :attribute doit contenir :size objets.",
    ),
    "unique"           => "Le :attribute a déjà été pris.",
    "url"              => "Le format de l':attribute n'est pas valide.",

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
