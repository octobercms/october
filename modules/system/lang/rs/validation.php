<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted'             => 'Polje :attribute mora biti prihvaćeno.',
    'active_url'           => 'Polje :attribute mora sadržati validan URL.',
    'after'                => 'Polje :attribute mora sadržati datum koji je posle sledećeg: :date.',
    'after_or_equal'       => 'Polje :attribute mora sadržati datum koji je posle sledećeg ili: :date.',
    'alpha'                => 'Polje :attribute mora sadržati samo slova.',
    'alpha_dash'           => 'Polje :attribute može sadržati samo slova, brojeve, i povlake',
    'alpha_num'            => 'Polje :attribute može sadržati samo slova ili brojeve.',
    'array'                => 'Polje :attribute mora sadržati niz.',
    'before'               => 'Polje :attribute mora sadržati datum koji je pre sledećeg: :date.',
    'before_or_equal'      => 'Polje :attribute mora sadržati datum koji je pre sledećeg ili: :date.',
    'between'              => [
        'numeric' => 'Polje :attribute mora sadržati broj između :min i :max.',
        'file'    => 'Polje :attribute mora sadržati fajl veličine između :min i :max kilobajta.',
        'string'  => 'Polje :attribute mora sadržati tekst dužine između :min i :max karaktera.',
        'array'   => 'Polje :attribute mora imati između :min i :max elemenata.',
    ],
    'boolean'              => 'Polje :attribute mora imati vrednost tačno ili netačno.',
    'confirmed'            => 'Potvrda :attribute nije u odgovarajućem formatu.',
    'date'                 => 'Polje :attribute ne sadrži validan datum.',
    'date_format'          => 'Polje :attribute ne sadrži datum u odgovarajućem formatu :format.',
    'different'            => 'Polja :attribute i :other moraju imati različite vrednosti.',
    'digits'               => 'Polje :attribute mora sadržati :digits cifre.',
    'digits_between'       => 'Polje :attribute mora sadržati između :min i :max cifre.',
    'dimensions'           => 'Polje :attribute ne sadrži validne dimenzije.',
    'distinct'             => 'Polje :attribute sadrži vrednost koja je duplikat.',
    'email'                => 'Polje :attribute mora sadržati validnu email adresu.',
    'exists'               => 'Polje :attribute nema validnu vrednost.',
    'file'                 => 'Polje :attribute mora sadržati fajl.',
    'filled'               => 'Polje :attribute mora imati vrednost.',
    'image'                => 'Polje :attribute mora sadržati sliku.',
    'in'                   => 'Polje :attribute nema validnu vrednost.',
    'in_array'             => 'Polje :attribute ne sadrži vrednost koja postoji u polju :other.',
    'integer'              => 'Polje :attribute mora sadržati ceo broj.',
    'ip'                   => 'Polje :attribute mora sadržati validnu IP adresu.',
    'ipv4'                 => 'Polje :attribute mora sadržati validnu IPv4 adresu.',
    'ipv6'                 => 'Polje :attribute mora sadržati validnu IPv6 adresu.',
    'json'                 => 'Polje :attribute mora sadržati validan JSON objekat.',
    'max'                  => [
        'numeric' => 'Polje :attribute ne sme sadržati broj veći od :max.',
        'file'    => 'Polje :attribute ne sme sadržati fajl veći od :max kilobajta.',
        'string'  => 'Polje :attribute ne sme sadržati tekst duži od :max karaktera.',
        'array'   => 'Polje :attribute ne sme imati više od :max elemenata.',
    ],
    'mimes'                => 'Polje :attribute mora sadržati fajl tipa: :values.',
    'mimetypes'            => 'Polje :attribute mora sadržati fajl jednog od sledećih tipova: :values.',
    'min'                  => [
        'numeric' => 'Polje :attribute ne sme sadržati broj manji od :min.',
        'file'    => 'Polje :attribute ne sme sadržati fajl manji od :min kilobajta.',
        'string'  => 'Polje :attribute ne sme sadržati tekst manji od :min karaktera.',
        'array'   => 'Polje :attribute ne sme imati manje od :min elemenata.',
    ],
    'not_in'               => 'Polje :attribute nema validnu vrednost.',
    'numeric'              => 'Polje :attribute mora sadržati broj.',
    'present'              => 'Polje :attribute mora biti prisutno.',
    'regex'                => 'Format polja :attribute nije validan.',
    'required'             => 'Polje :attribute je obavezno.',
    'required_if'          => 'Polje :attribute je obavezno kada :other ima vrednost :value.',
    'required_unless'      => 'Polje :attribute je obavezno kada vrednost polja :other nije deo :values.',
    'required_with'        => 'Polje :attribute je obavezno kada su vrednosti :values prisutne.',
    'required_with_all'    => 'Polje :attribute je obavezno kada su vrednosti :values prisutne.',
    'required_without'     => 'Polje :attribute je obavezno kada vrednosti :values nisu prisutne.',
    'required_without_all' => 'Polje :attribute je obavezno kada nijedna od vrednosti :values nije prisutna.',
    'same'                 => 'Polja :attribute i :other moraju imati iste vrednosti.',
    'size'                 => [
        'numeric' => 'Polje :attribute mora sadržati broj :size.',
        'file'    => 'Polje :attribute mora sadržati fajl od :size kilobajta.',
        'string'  => 'Polje :attribute mora sadržati tekst od :size karaktera.',
        'array'   => 'Polje :attribute mora imati :size elemenata.',
    ],
    'string'               => 'Polje :attribute mora sadržati tekst.',
    'timezone'             => 'Polje :attribute mora sadržati validnu vremensku zonu.',
    'unique'               => 'Polje :attribute mora biti jedinstveno.',
    'uploaded'             => 'Otpremanje fajla iz polja :attribute je neuspešno.',
    'url'                  => 'Format polja :attribute nije validan.',

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
            'rule-name' => 'uobičajena-poruka',
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

    'attributes' => [
        'name' => 'ime',
        'password' => 'lozinka',
        'user' => 'korisnik',
    ],

];
