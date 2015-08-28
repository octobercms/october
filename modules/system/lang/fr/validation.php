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

    "accepted"         => 'Le champ :attribute doit être accepté.',
    "active_url"       => 'Le champ :attribute n’est pas une URL valide.',
    "after"            => 'Le champ :attribute doit être une date après le :date.',
    "alpha"            => 'Le champ :attribute ne peut contenir que des lettres.',
    "alpha_dash"       => 'Le champ :attribute ne peut contenir que des lettres, des chiffres et des tirets.',
    "alpha_num"        => 'Le champ :attribute ne peut contenir que des lettres et des chiffres.',
    "array"            => 'Le champ :attribute doit être un groupe.',
    "before"           => 'Le champ :attribute doit être une date avant le :date.',
    "between"          => array(
        "numeric" => 'Le champ :attribute doit être compris entre :min - :max.',
        "file"    => 'Le champ :attribute doit être compris entre :min - :max kilooctets.',
        "string"  => 'Le champ :attribute doit être compris entre :min - :max caractères.',
        "array"   => 'Le champ :attribute doit être compris entre :min - :max objets.',
    ),
    "confirmed"        => 'Le champ de confirmation :attribute ne correspond pas.',
    "date"             => 'Le champ :attribute n’est pas une date valide.',
    "date_format"      => 'Le champ :attribute ne correspond pas au format :format.',
    "different"        => 'Le champ :attribute et :other doivent être différents.',
    "digits"           => 'Le champ :attribute doit être de :digits chiffres.',
    "digits_between"   => 'Le champ :attribute doit être compris entre :min et :max chiffres.',
    "email"            => 'Le format du champ :attribute n’est pas valide.',
    "exists"           => 'Le champ :attribute sélectionné n’est pas valide.',
    "image"            => 'Le champ :attribute doit être une image.',
    "in"               => 'Le champ :attribute sélectionné n’est pas valide.',
    "integer"          => 'Le champ :attribute doit être un entier.',
    "ip"               => 'Le champ :attribute doit être une adresse IP valide.',
    "max"              => array(
        "numeric" => 'Le champ :attribute ne peut pas être supérieure à :max.',
        "file"    => 'Le champ :attribute ne peut pas être supérieure à :max kilooctets.',
        "string"  => 'Le champ :attribute ne peut pas être supérieure à :max caractères.',
        "array"   => 'Le champ :attribute ne peut pas être supérieure à :max objets.',
    ),
    "mimes"            => 'Le champ :attribute doit être un fichier de type : :values.',
    "extensions"       => 'Le champ :attribute doit être une extension de : :values.',
    "min"              => array(
        "numeric" => 'Le champ :attribute doit être au minimum de :min.',
        "file"    => 'Le champ :attribute doit être au minimum de :min kilooctets.',
        "string"  => 'Le champ :attribute doit être au minimum de :min caractères.',
        "array"   => 'Le champ :attribute doit être au minimum de :min objets.',
    ),
    "not_in"           => 'Le champ :attribute sélectionné n’est pas valide.',
    "numeric"          => 'Le champ :attribute doit être un nombre.',
    "regex"            => 'Le format du champ :attribute n’est pas valide.',
    "required"         => 'Le champ :attribute est obligatoire.',
    "required_if"      => 'Le champ :attribute est obligatoire quand :other est :value.',
    "required_with"    => 'Le champ :attribute est obligatoire quand :values est présent.',
    "required_without" => 'Le champ :attribute est obligatoire quand :values est absent.',
    "same"             => 'Le champ :attribute et :other doivent correspondre.',
    "size"             => array(
        "numeric" => 'Le champ :attribute doit être de :size.',
        "file"    => 'Le champ :attribute doit être de :size kilooctets.',
        "string"  => 'Le champ :attribute doit être de :size caractères.',
        "array"   => 'Le champ :attribute doit contenir :size objets.',
    ),
    "unique"           => 'Le champ :attribute doit être unique. La valeur renseignée est déjà utilisée.',
    "url"              => 'Le champ :attribute n’est pas une URL valide.',

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