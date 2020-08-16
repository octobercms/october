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

    'accepted'             => 'Le champ :attribute doit être accepté.',
    'active_url'           => 'Le champ :attribute n’est pas une URL valide.',
    'after'                => 'Le champ :attribute doit être une date après le :date.',
    'after_or_equal'       => 'Le champ :attribute doit être une date après le ou égal à :date.',
    'alpha'                => 'Le champ :attribute ne peut contenir que des lettres.',
    'alpha_dash'           => 'Le champ :attribute ne peut contenir que des lettres, des chiffres et des tirets.',
    'alpha_num'            => 'Le champ :attribute ne peut contenir que des lettres et des chiffres.',
    'array'                => 'Le champ :attribute doit être un groupe.',
    'before'               => 'Le champ :attribute doit être une date avant le :date.',
    'before_or_equal'      => 'LE champ :attribute doit être une date avant le ou égal à :date.',
    'between'              => [
        'numeric' => 'Le champ :attribute doit être compris entre :min - :max.',
        'file'    => 'Le champ :attribute doit être compris entre :min - :max kilooctets.',
        'string'  => 'Le champ :attribute doit être compris entre :min - :max caractères.',
        'array'   => 'Le champ :attribute doit être compris entre :min - :max objets.',
    ],
    'boolean'              => 'Le champ :attribute doit être vrai (true) ou faux (false).',
    'confirmed'            => 'Le champ de confirmation :attribute ne correspond pas.',
    'date'                 => 'Le champ :attribute n’est pas une date valide.',
    'date_format'          => 'Le champ :attribute ne correspond pas au format :format.',
    'different'            => 'Le champ :attribute et :other doivent être différents.',
    'digits'               => 'Le champ :attribute doit être de :digits chiffres.',
    'digits_between'       => 'Le champ :attribute doit être compris entre :min et :max chiffres.',
    'dimensions'           => 'Le cahmp :attribute a des dimensions d’image invalides.',
    'distinct'             => 'Le cahmp :attribute a une valeur en double..',
    'email'                => 'Le format du champ :attribute n’est pas valide.',
    'exists'               => 'Le champ :attribute sélectionné n’est pas valide.',
    'file'                 => 'Le champ :attribute doit être un fichier.',
    'filled'               => 'Le champ :attribute doit avoir une valeur.',
    'image'                => 'Le champ :attribute doit être une image.',
    'in'                   => 'Le champ :attribute sélectionné n’est pas valide.',
    'in_array'             => 'Le champ :attribute n’existe pas dans :other.',
    'integer'              => 'Le champ :attribute doit être un entier.',
    'ip'                   => 'Le champ :attribute doit être une adresse IP valide.',
    'ipv4'                 => 'Le champ :attribute doit être une adresse IPv4.',
    'ipv6'                 => 'Le champ :attribute doit être une adresse IPv6.',
    'json'                 => 'Le champ :attribute doit être une chaîne JSON.',
    'max'                  => [
        'numeric' => 'Le champ :attribute ne peut pas être supérieure à :max.',
        'file'    => 'Le champ :attribute ne peut pas être supérieure à :max kilooctets.',
        'string'  => 'Le champ :attribute ne peut pas être supérieure à :max caractères.',
        'array'   => 'Le champ :attribute ne peut pas être supérieure à :max objets.',
    ],
    'mimes'                => 'Le champ :attribute doit être un fichier de type : :values.',
    'mimetypes'            => 'Le champ :attribute doit être un fichier de type : :values.',
    'min'                  => [
        'numeric' => 'Le champ :attribute doit être au minimum de :min.',
        'file'    => 'Le champ :attribute doit être au minimum de :min kilooctets.',
        'string'  => 'Le champ :attribute doit être au minimum de :min caractères.',
        'array'   => 'Le champ :attribute doit être au minimum de :min objets.',
    ],
    'not_in'               => 'Le champ :attribute sélectionné n’est pas valide.',
    'numeric'              => 'Le champ :attribute doit être un nombre.',
    'present'              => 'Le champ :attribute doit être présent.',
    'regex'                => 'Le format du champ :attribute n’est pas valide.',
    'required'             => 'Le champ :attribute est obligatoire.',
    'required_if'          => 'Le champ :attribute est obligatoire quand :other est :value.',
    'required_unless'      => 'Le champ :attribute est nécessaire à moins que :other soit dans :values.',
    'required_with'        => 'Le champ :attribute est obligatoire quand :values est présent.',
    'required_with_all'    => 'Le champ :attribute est requis lorsque :values est présent.',
    'required_without'     => 'Le champ :attribute est obligatoire quand :values est absent.',
    'required_without_all' => 'Le champ :attribute est requis lorsque aucun de :values n’est présent.',
    'same'                 => 'Le champ :attribute et :other doivent correspondre.',
    'size'             => [
        'numeric' => 'Le champ :attribute doit être de :size.',
        'file'    => 'Le champ :attribute doit être de :size kilooctets.',
        'string'  => 'Le champ :attribute doit être de :size caractères.',
        'array'   => 'Le champ :attribute doit contenir :size objets.',
    ],
    'string'               => 'La champ :attribute doit être une chaîne.',
    'timezone'             => 'La champ :attribute doit être une zone valide.',
    'unique'               => 'Le champ :attribute doit être unique. La valeur renseignée est déjà utilisée.',
    'uploaded'             => 'La champ :attribute n’a pas téléchargé de données.',
    'url'                  => 'Le champ :attribute n’est pas une URL valide.',

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

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

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
