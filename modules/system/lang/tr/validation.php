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

    'accepted'        => ':attribute kabul edilmelidir.',
    'active_url'      => ':attribute geçerli bir URL olmalıdır.',
    'after'           => ':attribute şundan eski bir tarih olmalıdır :date.',
    'after_or_equal'  => ':attribute şundan eski veya aynı bir tarih olmalıdır :date.',
    'alpha'           => ':attribute sadece harflerden oluşmalıdır.',
    'alpha_dash'      => ':attribute sadece harfler, rakamlar ve tirelerden oluşmalıdır.',
    'alpha_num'       => ':attribute sadece harfler ve rakamlar içermelidir.',
    'array'           => ':attribute dizi olmalıdır.',
    'before'          => ':attribute şundan önceki bir tarih olmalıdır :date.',
    'before_or_equal' => ':attribute şundan önceki veya aynı bir tarih olmalıdır :date.',
    'between'         => [
        'numeric' => ':attribute :min - :max arasında olmalıdır.',
        'file'    => ':attribute :min - :max arasındaki kilobayt değeri olmalıdır.',
        'string'  => ':attribute :min - :max arasında karakterden oluşmalıdır.',
        'array'   => ':attribute :min - :max arasında nesneye sahip olmalıdır.',
    ],
    'boolean'           => ':attribute alanı true veya false olmalıdır.',
    'confirmed'         => ':attribute tekrarı eşleşmiyor.',
    'date'              => ':attribute geçerli bir tarih olmalıdır.',
    'date_format'       => ':attribute :format biçimi ile eşleşmiyor.',
    'different'         => ':attribute ile :other birbirinden farklı olmalıdır.',
    'digits'            => ':attribute :digits rakam olmalıdır.',
    'digits_between'    => ':attribute :min ile :max arasında rakam olmalıdır.',
    'dimensions'        => ':attribute geçersiz resim boyutlarına sahip.',
    'distinct'          => ':attribute alanı yinelenen bir değere sahip.',
    'email'             => ':attribute biçimi geçersiz.',
    'exists'            => 'Seçili :attribute geçersiz.',
    'file'              => ':attribute bir dosya olmalı.',
    'filled'            => ':attribute alanın bir değeri içermelidir.',
    'image'             => ':attribute alanı resim dosyası olmalıdır.',
    'in'                => ':attribute değeri geçersiz.',
    'in_array'          => ':attribute alanı, :other da bulunmuyor.',
    'integer'           => ':attribute rakam olmalıdır.',
    'ip'                => ':attribute geçerli bir IP adresi olmalıdır.',
    'ipv4'              => ':attribute geçerli bir IPv4 adresi olmalıdır.',
    'ipv6'              => ':attribute geçerli bir IPv6 adresi olmalıdır.',
    'json'              => ':attribute geçerli bir JSON string olmalıdır.',
    'max'               => [
        'numeric' => ':attribute değeri :max değerinden küçük olmalıdır.',
        'file'    => ':attribute değeri :max kilobayt değerinden küçük olmalıdır.',
        'string'  => ':attribute değeri :max karakter değerinden küçük olmalıdır.',
        'array'   => ':attribute değeri :max adedinden az nesneye sahip olmalıdır.',
    ],
    'mimes'         => ':attribute dosya biçimi :values olmalıdır.',
    'mimetypes'     => ':attribute dosya biçimi :values olmalıdır.',
    'min'           => [
        'numeric' => ':attribute değeri :min değerinden büyük olmalıdır.',
        'file'    => ':attribute değeri :min kilobayt değerinden büyük olmalıdır.',
        'string'  => ':attribute değeri :min karakter değerinden büyük olmalıdır.',
        'array'   => ':attribute en az :min nesneye sahip olmalıdır.',
    ],
    'not_in'               => 'Seçili :attribute geçersiz.',
    'numeric'              => ':attribute rakam olmalıdır.',
    'present'              => ':attribute alanı mevcut olmalı.',
    'regex'                => ':attribute biçimi geçersiz.',
    'required'             => ':attribute alanı zorunludur.',
    'required_if'          => ':attribute alanı, :other :value değerine sahip olduğunda zorunludur.',
    'required_unless'      => ':other değeri :values içinde olmadığı müddetçe :attribute alanı zorunludur.',
    'required_with'        => ':attribute alanı :values varken zorunludur.',
    'required_with_all'    => ':values değeri olduğu durumda :attribute alanı zorunludur.',
    'required_without'     => ':attribute alanı :values yokken zorunludur.',
    'required_without_all' => ':values değerleri olmadığı müddetçe :attribute alanı zorunludur.',
    'same'              => ':attribute ile :other eşleşmelidir.',
    'size'              => [
        'numeric' => ':attribute :size olmalıdır.',
        'file'    => ':attribute :size kilobyte olmalıdır.',
        'string'  => ':attribute :size karakter olmalıdır.',
        'array'   => ':attribute :size nesneye sahip olmalıdır.',
    ],
    'string'    => 'The :attribute must be a string.',
    'timezone'  => 'The :attribute must be a valid zone.',
    'unique'    => ':attribute daha önceden kayıt edilmiş.',
    'uploaded'  => 'The :attribute failed to upload.',
    'url'       => ':attribute biçimi geçersiz.',

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
    | of 'email'. This simply helps us make messages a little cleaner.
    |
    */

    'attributes' => [],

];
