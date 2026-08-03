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

    'accepted' => ':attribute ha de ser acceptat.',
    'accepted_if' => ':attribute ha de ser acceptat quan :other és :value.',
    'active_url' => ':attribute no és una URL vàlida.',
    'after' => ':attribute ha de ser una data posterior a :date.',
    'after_or_equal' => ':attribute ha de ser una data posterior o igual a :date.',
    'alpha' => ':attribute només pot contenir lletres.',
    'alpha_dash' => ':attribute només pot contenir lletres, números, i guions.',
    'alpha_num' => ':attribute només pot contenir lletres i números.',
    'array' => ':attribute ha de ser un array.',
    'ascii' => ':attribute només pot contenir caràcters alfanumèrics i símbols d\'un sol byte.',
    'before' => ':attribute ha de ser una data anterior a :date.',
    'before_or_equal' => ':attribute ha de ser una data anterior o igual a :date.',
    'between' => [
        'array' => ':attribute ha de tenir entre :min i :max elements.',
        'file' => ':attribute ha d\'estar entre :min i :max kilobytes.',
        'numeric' => ':attribute ha d\'estar entre :min i :max.',
        'string' => ':attribute ha d\'estar entre :min i :max caràcters.',
    ],
    'boolean' => ':attribute ha de ser cert o fals.',
    'confirmed' => ':attribute no coincideix amb la confirmació.',
    'current_password' => 'La contrasenya és incorrecta.',
    'date' => ':attribute no és una data vàlida.',
    'date_equals' => ':attribute ha de ser una data igual a :date.',
    'date_format' => ':attribute no quadra amb el format :format.',
    'decimal' => ':attribute ha de tenir :decimal decimals.',
    'declined' => ':attribute ha de ser rebutjat.',
    'declined_if' => ':attribute ha de ser rebutjat quan :other és :value.',
    'different' => ':attribute i :other han de ser diferents.',
    'digits' => ':attribute ha de tenir :digits digits.',
    'digits_between' => ':attribute ha de tenir entre :min i :max digits.',
    'dimensions' => ':attribute té dimensions d\'imatge invàlides.',
    'distinct' => ':attribute té un valor duplicat.',
    'doesnt_end_with' => ':attribute no pot acabar amb cap dels següents valors: :values.',
    'doesnt_start_with' => ':attribute no pot començar amb cap dels següents valors: :values.',
    'email' => ':attribute ha de ser una adreça d\'email vàlida.',
    'ends_with' => ':attribute ha de acabar amb un dels següents valors: :values.',
    'enum' => 'El valor de :attribute seleccionat és invàlid.',
    'exists' => 'El valor de :attribute seleccionat és invàlid.',
    'file' => ':attribute ha de ser un arxiu.',
    'filled'=> ':attribute ha de tenir un valor.',
    'gt' => [
        'array' => ':attribute ha de tenir més de :value elements.',
        'file' => ':attribute ha de ser més gran que :value kilobytes.',
        'numeric' => ':attribute ha de ser més gran que :value.',
        'string' => ':attribute ha de ser més gran que :value caràcters.',
    ],
    'gte' => [
        'array' => ':attribute ha de tenir :value elements o més.',
        'file' => ':attribute ha de ser més gran o igual a :value kilobytes.',
        'numeric' => ':attribute ha de ser més gran o igual a :value.',
        'string' => ':attribute ha de ser més gran o igual a :value caràcters.',
    ],
    'image' => ':attribute ha de ser una imatge.',
    'in' => 'El valor de :attribute és invàlid.',
    'in_array' => ':attribute no existeix a :other.',
    'integer' => ':attribute ha de ser un número enter.',
    'ip' => ':attribute ha de ser una adreça IP vàlida.',
    'ipv4' => ':attribute ha de ser una adreça IPv4 vàlida.',
    'ipv6' => ':attribute ha de ser una adreça IPv6 vàlida.',
    'json' => ':attribute ha de ser una cadena JSON vàlida.',
    'lowercase' => ':attribute ha de ser en minúscules.',
    'lt' => [
        'array' => ':attribute ha de tenir menys de :value elements.',
        'file' => ':attribute ha de ser menys de :value kilobytes.',
        'numeric' => ':attribute ha de ser menys de :value.',
        'string' => ':attribute ha de ser menys de :value caràcters.',
    ],
    'lte' => [
        'array' => ':attribute no pot tenir més de :value elements.',
        'file' => ':attribute ha de ser com a màxim de :value kilobytes.',
        'numeric' => ':attribute ha de ser com a màxim de :value.',
        'string' => ':attribute ha de ser com a màxim de :value caràcters.',
    ],
    'mac_address' => ':attribute ha de ser una adreça MAC vàlida.',
    'max' => [
        'array' => ':attribute no pot tenir més de :max elements.',
        'file' => ':attribute no pot ser més gran de :max kilobytes.',
        'numeric' => ':attribute no pot ser més gran de :max.',
        'string' => ':attribute no pot ser més gran de :max caràcters.',
    ],
    'max_digits' => ':attribute no pot tenir més de :max dígits.',
    'mimes' => ':attribute ha de ser un arxiu del tipus: :values.',
    'mimetypes' => ':attribute ha de ser un arxiu del tipus: :values.',
    'min' => [
        'array' => ':attribute ha de tenir al menys :min elements.',
        'file' => ':attribute ha de ser al menys de :min kilobytes.',
        'numeric' => ':attribute ha de ser al menys :min.',
        'string' => ':attribute ha de ser al menys de :min caràcters.',
    ],
    'min_digits' => ':attribute ha de contenir almenys :min dígits.',
    'missing' => ':attribute no pot estar present.',
    'missing_if' => ':attribute no pot estar present quan :other és :value.',
    'missing_unless' => ':attribute no pot estar present tret que :other sigui :value.',
    'missing_with' => ':attribute no pot estar present quan :values està present.',
    'missing_with_all' => ':attribute no pot estar present quan :values estan presents.',
    'multiple_of' => ':attribute ha de ser un múltiple de :value.',
    'not_in' => 'El valor de :attribute seleccionat és invàlid.',
    'not_regex' => 'El format de :attribute és invàlid.',
    'numeric' => ':attribute ha de ser un número.',
    'password' => [
        'letters' => ':attribute ha de contenir almenys una lletra.',
        'mixed' => ':attribute ha de contenir almenys una lletra majúscula i una minúscula.',
        'numbers' => ':attribute ha de contenir almenys un número.',
        'symbols' => ':attribute ha de contenir almenys un símbol.',
        'uncompromised' => 'El :attribute proporcionat ha aparegut en una filtració de dades. Si us plau, trieu un :attribute diferent.',
    ],
    'present' => ':attribute ha d\'estar present.',
    'prohibited' => ':attribute està prohibit.',
    'prohibited_if' => ':attribute està prohibit quan :other és :value.',
    'prohibited_unless' => ':attribute està prohibit tret que :other estigui a :values.',
    'prohibits' => ':attribute prohibeix que :other estigui present.',
    'regex' => 'El format de :attribute és invàlid.',
    'required' => ':attribute és obligatori.',
    'required_array_keys' => ':attribute ha de contenir entrades per a: :values.',
    'required_if' => ':attribute és obligatori quan :other és :value.',
    'required_if_accepted' => ':attribute és obligatori quan :other és acceptat.',
    'required_unless' => ':attribute és obligatori a menys que :other és un de :values.',
    'required_with' => ':attribute és obligatori quan :values està present.',
    'required_with_all' => ':attribute és obligatori quan :values estan presents.',
    'required_without' => ':attribute és obligatori quan :values no està present.',
    'required_without_all' => ':attribute és obligatori quan cap de :values estan presents.',
    'same' => ':attribute i :other han de ser iguals.',
    'size' => [
        'array' => ':attribute ha de tenir :size elements.',
        'file' => ':attribute ha de ser de :size kilobytes.',
        'numeric' => ':attribute ha de ser :size.',
        'string' => ':attribute ha de ser de :size caràcters.',
    ],
    'starts_with' => ':attribute ha de començar amb un dels següents valors: :values.',
    'string' => ':attribute ha de ser una cadena de text.',
    'timezone' => ':attribute ha de ser una zona vàlida.',
    'unique' => ':attribute ha de ser únic.',
    'uploaded' => ':attribute ha fallat al pujar.',
    'uppercase' => ':attribute ha de ser en majúscules.',
    'url' => ':attribute ha de ser una URL vàlida.',
    'ulid' => ':attribute ha de ser un ULID vàlid.',
    'uuid' => ':attribute ha de ser un UUID vàlid.',

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
