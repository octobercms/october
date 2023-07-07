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
    'accepted_if'          => 'Le champ :attribute doit être accepté quand :other vaut :value.',
    'active_url'           => 'Le champ :attribute n’est pas une URL valide.',
    'after'                => 'Le champ :attribute doit être une date après le :date.',
    'after_or_equal'       => 'Le champ :attribute doit être une date après le ou égal à :date.',
    'alpha'                => 'Le champ :attribute ne peut contenir que des lettres.',
    'alpha_dash'           => 'Le champ :attribute ne peut contenir que des lettres, des chiffres et des tirets.',
    'alpha_num'            => 'Le champ :attribute ne peut contenir que des lettres et des chiffres.',
    'array'                => 'Le champ :attribute doit être un groupe.',
    'ascii'                => 'Le champ :attribute ne peut contenir que des lettres et des chiffres ASCII.',
    'before'               => 'Le champ :attribute doit être une date avant le :date.',
    'before_or_equal'      => 'Le champ :attribute doit être une date avant le ou égal à :date.',
    'between'              => [
        'numeric' => 'Le champ :attribute doit être compris entre :min - :max.',
        'file'    => 'Le champ :attribute doit être compris entre :min - :max kilooctets.',
        'string'  => 'Le champ :attribute doit être compris entre :min - :max caractères.',
        'array'   => 'Le champ :attribute doit être compris entre :min - :max objets.',
    ],
    'boolean'              => 'Le champ :attribute doit être vrai (true) ou faux (false).',
    'confirmed'            => 'Le champ de confirmation :attribute ne correspond pas.',
    'current_password'     => 'Le mot de passe est erroné.',
    'date'                 => 'Le champ :attribute n’est pas une date valide.',
    'date_equals'          => 'Le champ :attribute doit être une date égale à :date.',
    'date_format'          => 'Le champ :attribute ne correspond pas au format :format.',
    'decimal'              => 'Le champ :attribute doit avoir :decimal décimales.',
    'declined'             => 'Le champ :attribute doit être refusé.',
    'declined_if'          => 'Le champ :attribute doit être refusé quand :other vaut :value.',
    'different'            => 'Le champ :attribute et :other doivent être différents.',
    'digits'               => 'Le champ :attribute doit être de :digits chiffres.',
    'digits_between'       => 'Le champ :attribute doit être compris entre :min et :max chiffres.',
    'dimensions'           => 'Le champ :attribute a des dimensions d’image invalides.',
    'distinct'             => 'Le champ :attribute a une valeur en double..',
    'doesnt_end_with'      => 'Le champ :attribute ne doit pas se terminer par une des valeurs suivantes: :values.',
    'doesnt_start_with'    => 'Le champ :attribute ne doit pas commencer par une des valeurs suivantes: :values.',
    'email'                => 'Le format du champ :attribute n’est pas valide.',
    'ends_with'            => 'Le champ :attribute doit se terminer par une des valeurs suivantes: :values.',
    'enum'                 => 'Le champ :attribute n’a pas une valeur valide.',
    'exists'               => 'Le champ :attribute sélectionné n’est pas valide.',
    'file'                 => 'Le champ :attribute doit être un fichier.',
    'filled'               => 'Le champ :attribute doit avoir une valeur.',
    'gt' => [
        'array'   => 'Le champ :attribute doit avoir plus que :value éléments.',
        'file'    => 'Le champ :attribute doit être plus grand que :value kilobytes.',
        'numeric' => 'Le champ :attribute doit être supérieur à :value.',
        'string'  => 'Le champ :attribute doit avoir plus que :value caractères.',
    ],
    'gte' => [
        'array'   => 'Le champ :attribute doit avoir au moins :value éléments.',
        'file'    => 'Le champ :attribute doit faire au moins :value kilobytes.',
        'numeric' => 'Le champ :attribute doit être supérieur ou égal à :value.',
        'string'  => 'Le champ :attribute doit avoir au moins :value caractères.',
    ],
    'image'                => 'Le champ :attribute doit être une image.',
    'in'                   => 'Le champ :attribute sélectionné n’est pas valide.',
    'in_array'             => 'Le champ :attribute n’existe pas dans :other.',
    'integer'              => 'Le champ :attribute doit être un entier.',
    'ip'                   => 'Le champ :attribute doit être une adresse IP valide.',
    'ipv4'                 => 'Le champ :attribute doit être une adresse IPv4.',
    'ipv6'                 => 'Le champ :attribute doit être une adresse IPv6.',
    'json'                 => 'Le champ :attribute doit être une chaîne JSON.',
    'lowercase'            => 'Le champ :attribute doit être en minuscules.',
    'lt'                   => [
        'array'   => 'Le champ :attribute doit avoir moins de :value éléments.',
        'file'    => 'Le champ :attribute doit faire moins de :value kilobytes.',
        'numeric' => 'Le champ :attribute doit valoir moins de :value.',
        'string'  => 'Le champ :attribute doit faire moins de :value caractères.',
    ],
    'lte'                  => [
        'array'   => 'Le champ :attribute doit avoir au maximum :value éléments.',
        'file'    => 'Le champ :attribute doit faire au maximum :value kilobytes.',
        'numeric' => 'Le champ :attribute doit valoir au maximum :value.',
        'string'  => 'Le champ :attribute doit faire au maximum :value caractères.',
    ],
    'mac_address'          => 'Le champ :attribute doit être une adresse MAC valide.',
    'max'                  => [
        'numeric' => 'Le champ :attribute ne peut pas être supérieure à :max.',
        'file'    => 'Le champ :attribute ne peut pas être supérieure à :max kilooctets.',
        'string'  => 'Le champ :attribute ne peut pas être supérieure à :max caractères.',
        'array'   => 'Le champ :attribute ne peut pas être supérieure à :max objets.',
    ],
    'max_digits'           => 'Le champ :attribute ne doit pas avoir plus de :max décimales.',
    'mimes'                => 'Le champ :attribute doit être un fichier de type : :values.',
    'mimetypes'            => 'Le champ :attribute doit être un fichier de type : :values.',
    'min'                  => [
        'numeric' => 'Le champ :attribute doit être au minimum de :min.',
        'file'    => 'Le champ :attribute doit être au minimum de :min kilooctets.',
        'string'  => 'Le champ :attribute doit être au minimum de :min caractères.',
        'array'   => 'Le champ :attribute doit être au minimum de :min objets.',
    ],
    'min_digits'           => 'Le champ :attribute doit avoir au moins :min décimales.',
    'missing'              => 'Le champ :attribute ne doit pas être saisi.',
    'missing_if'           => 'Le champ :attribute ne doit pas être saisi quand :other vaut :value.',
    'missing_unless'       => 'Le champ :attribute ne doit pas être saisi sauf si :other vaut :value.',
    'missing_with'         => 'Le champ :attribute ne doit pas être saisi quand :values est présent.',
    'missing_with_all'     => 'Le champ :attribute ne doit pas être saisi quand :values sont présents.',
    'multiple_of'          => 'Le champ :attribute doit être un multiple de :value.',
    'not_in'               => 'Le champ :attribute sélectionné n’est pas valide.',
    'not_regex'            => 'Le format du champ :attribute n’est pas valide.',
    'numeric'              => 'Le champ :attribute doit être un nombre.',
    'password'             => [
        'letters'       => 'Le champ :attribute doit contenir au moins une lettre.',
        'mixed'         => 'Le champ :attribute doit contenir au moins une lettre majuscule et une lettre minuscule.',
        'numbers'       => 'Le champ :attribute doit contenir au moins un chiffre.',
        'symbols'       => 'Le champ :attribute doit contenir au moins un symbole.',
        'uncompromised' => 'La valeur choisie pour :attribute est apparue dans une fuite de données. Veuillez choisir un(e) :attribute différent.',
    ],
    'present'              => 'Le champ :attribute doit être présent.',
    'prohibited'           => 'Le champ :attribute est interdit.',
    'prohibited_if'        => 'Le champ :attribute est interdit quand :other vaut :value.',
    'prohibited_unless'    => 'Le champ :attribute est interdit sauf si :other est dans :values.',
    'prohibits'            => 'Le champ :attribute interdit :other d’être reseigné.',
    'regex'                => 'Le format du champ :attribute n’est pas valide.',
    'required'             => 'Le champ :attribute est obligatoire.',
    'required_array_keys'  => 'Le champ :attribute doit contenir des entrées pour: :values.',
    'required_if'          => 'Le champ :attribute est obligatoire quand :other est :value.',
    'required_if_accepted' => 'Le champ :attribute est obligatoire quand :other est accepté.',
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
    'starts_with'          => 'Le champ :attribute doit commencer par l’un des suivants: :values.',
    'string'               => 'La champ :attribute doit être une chaîne de caractères.',
    'timezone'             => 'La champ :attribute doit être une zone valide.',
    'unique'               => 'Le champ :attribute doit être unique. La valeur renseignée est déjà utilisée.',
    'uploaded'             => 'La champ :attribute n’a pas téléchargé de données.',
    'uppercase'            => 'Le champ :attribute doit être en majuscules.',
    'url'                  => 'Le champ :attribute n’est pas une URL valide.',
    'ulid'                 => 'Le champ :attribute doit être un ULID valide.',
    'uuid'                 => 'Le champ :attribute doit être un UUID valide.',

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
