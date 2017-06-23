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

    'accepted'         => 'A(z) :attribute-t el kell fogadni.',
    'active_url'       => 'A(z) :attribute nem érvényes webcím.',
    'after'            => 'A(z) :attribute :date utáni dátum kell, hogy legyen.',
    'alpha'            => 'A(z) :attribute csak betűket tartalmazhat.',
    'alpha_dash'       => 'A(z) :attribute csak betűket, számokat és kötőjeleket tartalmazhat.',
    'alpha_num'        => 'A(z) :attribute csak betűket és számokat tartalmazhat.',
    'array'            => 'A(z) :attribute tömb kell, hogy legyen.',
    'before'           => 'A(z) :attribute :date előtti dátum kell, hogy legyen.',
    'between'          => [
        'numeric' => 'A(z) :attribute :min - :max között kell, hogy legyen.',
        'file'    => 'A(z) :attribute :min - :max kilobájt között kell, hogy legyen.',
        'string'  => 'A(z) :attribute :min - :max karakter között kell, hogy legyen.',
        'array'   => 'A(z) :attribute :min - :max elem között kell, hogy legyen.',
    ],
    'confirmed'        => 'A(z) :attribute megerősítés nem egyezik.',
    'date'             => 'A(z) :attribute nem érvényes dátum.',
    'date_format'      => 'A(z) :attribute nem egyezik a(z) :format formátummal.',
    'different'        => 'A(z) :attribute és a(z) :other eltérő kell, hogy legyen.',
    'digits'           => 'A(z) :attribute :digits számból kell, hogy álljon.',
    'digits_between'   => 'A(z) :attribute :min és :max közti számból kell, hogy álljon.',
    'email'            => 'A(z) :attribute formátuma érvénytelen.',
    'exists'           => 'A kiválasztott :attribute érvénytelen.',
    'image'            => 'A(z) :attribute kép kell, hogy legyen.',
    'in'               => 'A kiválasztott :attribute érvénytelen.',
    'integer'          => 'A(z) :attribute egész szám kell, hogy legyen.',
    'ip'               => 'A(z) :attribute érvényes IP cím kell, legyen.',
    'max'              => [
        'numeric' => 'A(z) :attribute nem lehet nagyobb, mint :max.',
        'file'    => 'A(z) :attribute nem lehet nagyobb :max kilobájtnál.',
        'string'  => 'A(z) :attribute nem lehet nagyobb :max karakternél.',
        'array'   => 'A(z) :attribute tömbnek nem lehet több, mint :max eleme.',
    ],
    'mimes'            => 'A(z) :attribute fájltípus kell, hogy legyen: :values.',
    "extensions"       => 'A(z) :attribute kiterjesztés kell, hogy legyen: :values.',
    'min'              => [
        'numeric' => 'A(z) :attribute legalább :min kell, hogy legyen.',
        'file'    => 'A(z) :attribute legalább :min kilobájt kell, hogy legyen.',
        'string'  => 'A(z) :attribute legalább :min karakter kell, hogy legyen.',
        'array'   => 'A(z) :attribute tömbnek legalább :min eleme kell, hogy legyen.',
    ],
    'not_in'           => 'A kiválasztott :attribute érvénytelen.',
    'numeric'          => 'A(z) :attribute szám kell, hogy legyen.',
    'regex'            => 'A(z) :attribute formátuma érvénytelen.',
    'required'         => 'A(z) :attribute megadása kötelező.',
    'required_if'      => 'A(z) :attribute megadása kötelező, ha a(z) :other :value.',
    'required_with'    => 'A(z) :attribute megadása kötelező, ha a(z) :values jelen van.',
    'required_without' => 'A(z) :attribute megadása kötelező, ha a(z) :values nincs jelen.',
    'same'             => 'A(z) :attribute és a(z) :other egyező kell, hogy legyen.',
    'size'             => [
        'numeric' => 'A(z) :attribute :size kell, hogy legyen.',
        'file'    => 'A(z) :attribute :size kilobájt kell, hogy legyen.',
        'string'  => 'A(z) :attribute :size karakter kell, hogy legyen.',
        'array'   => 'A(z) :attribute :size elemeket kell, hogy tartalmazzon.',
    ],
    'unique'           => 'A(z) :attribute már foglalt.',
    'url'              => 'A(z) :attribute formátuma érvénytelen.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention 'attribute.rule' to name the lines. This makes it quick to
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
    | of 'email'. This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [
        'name'    => 'név',
        'title'   => 'cím',
        'slug'    => 'webcím',
        'image'   => 'kép',
        'content' => 'tartalom',
        'summary' => 'összegzés',
        'email'   => 'e-mail cím',
        'subject' => 'tárgy',
        'message' => 'üzenet',
    ],

];
