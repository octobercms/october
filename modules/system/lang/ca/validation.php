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

    'accepted'             => ':attribute ha de ser acceptat.',
    'active_url'           => ':attribute no és una URL vàlida.',
    'after'                => ':attribute ha de ser una data posterior a :date.',
    'after_or_equal'       => ':attribute ha de ser una data posterior o igual a :date.',
    'alpha'                => ':attribute només pot contenir lletres.',
    'alpha_dash'           => ':attribute només pot contenir lletres, números, i guions.',
    'alpha_num'            => ':attribute només pot contenir lletres i números.',
    'array'                => ':attribute ha de ser un array.',
    'before'               => ':attribute ha de ser una data anterior a :date.',
    'before_or_equal'      => ':attribute ha de ser una data anterior o igual a :date.',
    'between'              => [
        'numeric' => ":attribute ha d'estar entre :min i :max.",
        'file'    => ":attribute ha d'estar entre :min i :max kilobytes.",
        'string'  => ":attribute ha d'estar entre :min i :max caràcters.",
        'array'   => ":attribute ha de tenir entre :min i :max elements.",
    ],
    'boolean'              => 'El camp :attribute ha de ser cert o fals.',
    'confirmed'            => 'La confirmació de :attribute no quadra.',
    'date'                 => ':attribute no és una data vàlida.',
    'date_format'          => ':attribute no quadra amb el format :format.',
    'different'            => ':attribute i :other han de ser diferents.',
    'digits'               => ':attribute ha de tenir :digits digits.',
    'digits_between'       => ':attribute ha de tenir entre :min i :max digits.',
    'dimensions'           => ":attribute té dimensions d'imatge invàlides.",
    'distinct'             => 'El camp :attribute té un valor duplicat.',
    'email'                => ":attribute ha de ser una adreça d'email vàlida.",
    'exists'               => 'El valor de :attribute seleccionat és invàlid.',
    'file'                 => ':attribute ha de ser un arxiu.',
    'filled'               => 'El camp :attribute ha de tenir un valor.',
    'image'                => ':attribute ha de ser una imatge.',
    'in'                   => 'El valor de :attribute és invàlid.',
    'in_array'             => 'El camp :attribute no existeix a :other.',
    'integer'              => ':attribute ha de ser un número enter.',
    'ip'                   => ':attribute ha de ser una adreça IP vàlida.',
    'ipv4'                 => ':attribute ha de ser una adreça IPv4 vàlida.',
    'ipv6'                 => ':attribute ha de ser una adreça IPv6 vàlida.',
    'json'                 => ':attribute ha de ser una cadena JSON vàlida.',
    'max'                  => [
        'numeric' => ':attribute no pot ser més gran de :max.',
        'file'    => ':attribute no pot ser més gran de :max kilobytes.',
        'string'  => ':attribute no pot ser més gran de :max caràcters.',
        'array'   => ':attribute no pot tenir més de :max elements.',
    ],
    'mimes'                => ':attribute ha de ser un arxiu del tipus: :values.',
    'mimetypes'            => ':attribute ha de ser un arxiu del tipus: :values.',
    'min'                  => [
        'numeric' => ':attribute ha de ser al menys :min.',
        'file'    => ':attribute ha de ser al menys de :min kilobytes.',
        'string'  => ':attribute ha de ser al menys de :min caràcters.',
        'array'   => ':attribute ha de tenir al menys :min elements.',
    ],
    'not_in'               => 'El valor de :attribute seleccionat és invàlid.',
    'numeric'              => ':attribute ha de ser un número.',
    'present'              => ":attribute ha d'estar present.",
    'regex'                => 'El format de :attribute és invàlid.',
    'required'             => 'El camp :attribute és obligatori.',
    'required_if'          => 'El camp :attribute és obligatori quan :other és :value.',
    'required_unless'      => 'El camp :attribute és obligatori a menys que :other és un de :values.',
    'required_with'        => 'El camp :attribute és obligatori quan :values està present.',
    'required_with_all'    => 'El camp :attribute és obligatori quan :values estan presents.',
    'required_without'     => 'El camp :attribute és obligatori quan :values no està present.',
    'required_without_all' => 'El camp :attribute és obligatori quan cap de :values estan presents.',
    'same'                 => 'El camp :attribute i :other han de ser iguals.',
    'size'                 => [
        'numeric' => ':attribute ha de ser :size.',
        'file'    => ':attribute ha de ser de :size kilobytes.',
        'string'  => ':attribute ha de ser de :size caràcters.',
        'array'   => ':attribute ha de tenir :size elements.',
    ],
    'string'               => ':attribute ha de ser una cadena de text.',
    'timezone'             => ':attribute ha de ser una zona vàlida.',
    'unique'               => ':attribute ha de ser únic.',
    'uploaded'             => ':attribute ha fallat al pujar.',
    'url'                  => 'El format de :attribute és invàlid.',

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
