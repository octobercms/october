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

    'accepted'             => ':attribute musí byť akceptovaný.',
    'active_url'           => ':attribute má neplatnú URL adresu.',
    'after'                => ':attribute musí byť dátum po :date.',
    'alpha'                => ':attribute môže obsahovať len písmená.',
    'alpha_dash'           => ':attribute môže obsahovať len písmená, čísla a pomlčky.',
    'alpha_num'            => ':attribute môže obsahovať len písmená, čísla.',
    'array'                => ':attribute musí byť pole.',
    'before'               => ':attribute musí byť dátum pred :date.',
    'before_or_equal'      => ':attribute musí byť dátum pred alebo rovný :date.',
    'between'              => [
        'numeric' => ':attribute musí mať rozsah :min - :max.',
        'file'    => ':attribute musí mať rozsah :min - :max kilobajtov.',
        'string'  => ':attribute musí mať rozsah :min - :max znakov.',
        'array'   => ':attribute musí mať rozsah :min - :max prvkov.',
    ],
    'boolean'              => ':attribute musí byť true alebo false.',
    'confirmed'            => ':attribute konfirmácia sa nezhoduje.',
    'date'                 => ':attribute má neplatný dátum.',
    'date_format'          => ':attribute sa nezhoduje s formátom :format.',
    'different'            => ':attribute a :other musia byť odlišné.',
    'digits'               => ':attribute musí mať :digits číslic.',
    'digits_between'       => ':attribute musí mať rozsah :min až :max číslic.',
    'dimensions'           => ':attribute má neplatné rozmery obrázka.',
    'distinct'             => ':attribute má duplicitné hodnoty.',
    'email'                => ':attribute má neplatný formát.',
    'exists'               => 'Označený :attribute je neplatný.',
    'file'                 => ':attribute musí byť súbor.',
    'filled'               => ':attribute je povinný.',
    'gt'                   => [
        'numeric' => ':attribute musí byť väčšia ako :value.',
        'file'    => ':attribute musí byť väčšia ako :value kilobajtov.',
        'string'  => ':attribute musí byť väčšia ako :value znakov.',
        'array'   => ':attribute musí mať viac ako :value položiek.',
    ],
    'gte'                  => [
        'numeric' => ':attribute musí byť väčšia alebo rovná :value.',
        'file'    => ':attribute musí byť väčšia alebo rovná :value kilobajtov.',
        'string'  => ':attribute musí byť väčšia alebo rovná :value znakov.',
        'array'   => ':attribute musí mať :value položiek alebo viac.',
    ],
    'image'                => ':attribute musí byť obrázok.',
    'in'                   => 'Označený :attribute je neplatný.',
    'in_array'             => ':attribute pole neexistuje v :other.',
    'integer'              => ':attribute musí byť celé číslo.',
    'ip'                   => ':attribute musí byť platná IP adresa.',
    'ipv4'                 => ':attribute musí byť platná IPv4 adresa.',
    'ipv6'                 => ':attribute musí byť platná IPv6 adresa.',
    'json'                 => ':attribute musí byť platný JSON.',
    'lt'                   => [
        'numeric' => ':attribute musí byť menšia ako :value.',
        'file'    => ':attribute musí byť menšia ako :value kilobajtov.',
        'string'  => ':attribute musí byť menšia ako :value znakov.',
        'array'   => ':attribute musí mať menej ako :value položiek.',
    ],
    'lte'                  => [
        'numeric' => ':attribute musí byť menšie alebo rovné :value.',
        'file'    => ':attribute musí byť menšie alebo rovné :value kilobajtov.',
        'string'  => ':attribute musí byť menšie alebo rovné :value znakov.',
        'array'   => ':attribute nesmie mať viac ako :value položiek.',
    ],
    'max'                  => [
        'numeric' => ':attribute nemôže byť väčší ako :max.',
        'file'    => ':attribute nemôže byť väčší ako :max kilobajtov.',
        'string'  => ':attribute nemôže byť väčší ako :max znakov.',
        'array'   => ':attribute nemôže mať viac ako :max prvkov.',
    ],
    'mimes'                => ':attribute musí byť súbor s koncovkou: :values.',
    'extensions'           => ':attribute musí mäť niektorú z nasledujúcich prípon: :values.',
    'min'                  => [
        'numeric' => ':attribute musí mať aspoň :min.',
        'file'    => ':attribute musí mať aspoň :min kilobajtov.',
        'string'  => ':attribute musí mať aspoň :min znakov.',
        'array'   => ':attribute musí mať aspoň :min prvkov.',
    ],
    'not_in'               => 'Označený :attribute je neplatný.',
    'not_regex'            => ':attribute má neplatný formát.',
    'numeric'              => ':attribute musí byť číslo.',
    'present'              => ':attribute pole musí byť prítomné.',
    'regex'                => ':attribute má neplatný formát.',
    'required'             => ':attribute je požadované.',
    'required_if'          => ':attribute je požadované keď :other je :value.',
    'required_unless'      => ':attribute pole je povinné, pokiaľ :other je v :values.',
    'required_with'        => ':attribute je požadované keď :values je prítomné.',
    'required_with_all'    => ':attribute pole je povinné, keď je :values.',
    'required_without'     => ':attribute je požadované keď :values nie je prítomné.',
    'required_without_all' => ':attribute pole je povinné, keď nie je prítomná žiadna z :values.',
    'same'                 => ':attribute a :other sa musia zhodovať.',
    'size'                 => [
        'numeric' => ':attribute musí byť :size.',
        'file'    => ':attribute musí mať :size kilobajtov.',
        'string'  => ':attribute musí mať :size znakov.',
        'array'   => ':attribute musí obsahovať :size prvkov.',
    ],
    'starts_with'          => ':attribute musí začínať jedným z nasledujúcich: :values.',
    'string'               => ':attribute musí byť reťazec.',
    'timezone'             => ':attribute musí byť platná časová zóna.',
    'unique'               => ':attribute už existuje.',
    'uploaded'             => ':attribute sa nepodarilo nahrať.',
    'url'                  => ':attribute musí mať formát URL.',
    'uuid'                 => ':attribute musí byť UUID.',

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
