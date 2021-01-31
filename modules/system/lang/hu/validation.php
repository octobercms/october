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

    'accepted'       => 'A(z) :attribute-t el kell fogadni.',
    'active_url'     => 'A(z) :attribute nem érvényes webcím.',
    'after'          => 'A(z) :attribute :date utáni dátum kell legyen.',
    'after_or_equal' => 'A(z) :attribute :date utáni vagy vele egyenlő dátum kell legyen.',
    'alpha'          => 'A(z) :attribute csak betűket tartalmazhat.',
    'alpha_dash'     => 'A(z) :attribute csak betűket, számokat és kötőjeleket tartalmazhat.',
    'alpha_num'      => 'A(z) :attribute csak betűket és számokat tartalmazhat.',
    'array'          => 'A(z) :attribute tömb kell legyen.',
    'before'         => 'A(z) :attribute :date előtti dátum kell legyen.',
    'between'        => [
        'numeric' => 'A(z) :attribute :min - :max között kell legyen.',
        'file'    => 'A(z) :attribute :min - :max kilobájt között kell legyen.',
        'string'  => 'A(z) :attribute :min - :max karakter között kell legyen.',
        'array'   => 'A(z) :attribute :min - :max elem között kell legyen.',
    ],
    'boolean'        => 'A(z) :attribute igaz vagy hamis kell legyen.',
    'confirmed'      => 'A(z) :attribute megerősítés nem egyezik.',
    'date'           => 'A(z) :attribute nem érvényes dátum.',
    'date_equals'    => 'A(z) :attribute :date vele egyenlő dátum kell legyen.',
    'date_format'    => 'A(z) :attribute nem egyezik a(z) :format formátummal.',
    'different'      => 'A(z) :attribute és a(z) :other eltérő kell legyen.',
    'digits'         => 'A(z) :attribute :digits számból kell álljon.',
    'digits_between' => 'A(z) :attribute :min és :max közti számból kell álljon.',
    'dimensions'     => 'A(z) :attribute kép mérete helytelen.',
    'distinct'       => 'A(z) :attribute mező többször szerepel.',
    'email'          => 'A(z) :attribute formátuma érvénytelen.',
    'ends_with'      => 'A(z) :attribute végének ennek kell lennie: :values.',
    'exists'         => 'A kiválasztott :attribute érvénytelen.',
    'file'           => 'A(z) :attribute fájlnak kell lennie.',
    'filled'         => 'A(z) :attribute értéknek kell lennie.',
    'gt'             => [
        'numeric' => 'A(z) :attribute nagyobbnak kell lennie mint :value.',
        'file'    => 'A(z) :attribute nagyobbnak kell lennie mint :value kilobájt.',
        'string'  => 'A(z) :attribute nagyobbnak kell lennie mint :value karakter.',
        'array'   => 'A(z) :attribute többnek kell lennie mint :value elem.',
    ],
    'gte'            => [
        'numeric' => 'A(z) :attribute nagyobbnak vagy egyenlőnek kell lennie mint :value.',
        'file'    => 'A(z) :attribute nagyobbnak vagy egyenlőnek kell lennie mint :value kilobájt.',
        'string'  => 'A(z) :attribute nagyobbnak vagy egyenlőnek kell lennie mint :value karakter.',
        'array'   => 'A(z) :attribute többnek vagy egyenlőnek kell lennie mint :value elem.',
    ],
    'image'          => 'A(z) :attribute kép kell legyen.',
    'in'             => 'A kiválasztott :attribute érvénytelen.',
    'in_array'       => 'A(z) :attribute mező nem létezik itt: :other.',
    'integer'        => 'A(z) :attribute egész szám kell legyen.',
    'ip'             => 'A(z) :attribute érvényes IP cím kell legyen.',
    'ipv4'           => 'A(z) :attribute értéke IPv4 szabvány legyen.',
    'ipv6'           => 'A(z) :attribute értéke IPv6 szabvány legyen.',
    'json'           => 'A(z) :attribute értéke JSON formátum legyen.',
    'lt'             => [
        'numeric' => 'A(z) :attribute kisebbnek kell lennie mint :value.',
        'file'    => 'A(z) :attribute kisebbnek kell lennie mint :value kilobájt.',
        'string'  => 'A(z) :attribute kisebbnek kell lennie mint :value karakter.',
        'array'   => 'A(z) :attribute kevesebbnek kell lennie mint :value elem.',
    ],
    'lte'                  => [
        'numeric' => 'A(z) :attribute kisebbnek vagy egyenlőnek kell lennie mint :value.',
        'file'    => 'A(z) :attribute kisebbnek vagy egyenlőnek kell lennie mint :value kilobájt.',
        'string'  => 'A(z) :attribute kisebbnek vagy egyenlőnek kell lennie mint :value karakter.',
        'array'   => 'A(z) :attribute kevesebbnek vagy egyenlőnek kell lennie mint :value elem.',
    ],
    'max'              => [
        'numeric' => 'A(z) :attribute nem lehet nagyobb, mint :max.',
        'file'    => 'A(z) :attribute nem lehet nagyobb :max kilobájtnál.',
        'string'  => 'A(z) :attribute nem lehet nagyobb :max karakternél.',
        'array'   => 'A(z) :attribute tömbnek nem lehet több, mint :max eleme.',
    ],
    'mimes'          => 'A(z) :attribute fájltípus kell legyen: :values.',
    'mimetypes'      => 'A(z) :attribute fájltípus kell legyen: :values.',
    'min'            => [
        'numeric' => 'A(z) :attribute legalább :min kell legyen.',
        'file'    => 'A(z) :attribute legalább :min kilobájt kell legyen.',
        'string'  => 'A(z) :attribute legalább :min karakter kell legyen.',
        'array'   => 'A(z) :attribute tömbnek legalább :min eleme kell legyen.',
    ],
    'not_in'         => 'A kiválasztott :attribute érvénytelen.',
    'not_regex'      => 'A(z) :attribute formátuma érvénytelen.',
    'numeric'        => 'A(z) :attribute szám kell legyen.',
    'regex'          => 'A(z) :attribute formátuma érvénytelen.',
    'required'             => 'A(z) :attribute megadása kötelező.',
    'required_if'          => 'A(z) :attribute megadása kötelező, ha a(z) :other :value.',
    'required_unless'      => 'A(z) :attribute megadása kötelező, hacsak a(z) :other :value.',
    'required_with'        => 'A(z) :attribute megadása kötelező, ha a(z) :values jelen van.',
    'required_with_all'    => 'A(z) :attribute megadása kötelező, ha az összes :values jelen van.',
    'required_without'     => 'A(z) :attribute megadása kötelező, ha a(z) :values nincs jelen.',
    'required_without_all' => 'A(z) :attribute megadása kötelező, ha az összes :values nincs jelen.',
    'same'                 => 'A(z) :attribute és a(z) :other egyező kell legyen.',
    'size'                 => [
        'numeric' => 'A(z) :attribute :size kell legyen.',
        'file'    => 'A(z) :attribute :size kilobájt kell legyen.',
        'string'  => 'A(z) :attribute :size karakter kell legyen.',
        'array'   => 'A(z) :attribute :size elemeket kell tartalmazzon.',
    ],
    'starts_with'    => 'A(z) :attribute a következőkkel kell kezdődnie: :values.',
    'string'         => 'A(z) :attribute szövegnek kell lennie.',
    'timezone'       => 'A(z) :attribute időzónának kell lennie.',
    'unique'         => 'A(z) :attribute már foglalt.',
    'uploaded'       => 'A(z) :attribute feltöltése sikertelen.',
    'url'            => 'A(z) :attribute formátuma érvénytelen.',
    'uuid'           => 'A(z) :attribute formátuma UUID kell legyen.',

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
        'picture' => 'kép',
        'content' => 'tartalom',
        'text'    => 'szöveg',
        'summary' => 'összegzés',
        'email'   => 'e-mail cím',
        'subject' => 'tárgy',
        'message' => 'üzenet',
    ],

];
