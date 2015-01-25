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

    "accepted"       => ":attribute kabul edilmelidir.",
    "active_url"     => ":attribute geçerli bir URL olmalıdır.",
    "after"          => ":attribute şundan daha eski bir tarih olmalıdır :date.",
    "alpha"          => ":attribute sadece harflerden oluşmalıdır.",
    "alpha_dash"     => ":attribute sadece harfler, rakamlar ve tirelerden oluşmalıdır.",
    "alpha_num"      => ":attribute sadece harfler ve rakamlar içermelidir.",
    "array"          => ":attribute dizi olmalıdır.",
    "before"         => ":attribute şundan daha önceki bir tarih olmalıdır :date.",
    "between"        => array(
        "numeric" => ":attribute :min - :max arasında olmalıdır.",
        "file"    => ":attribute :min - :max arasındaki kilobayt değeri olmalıdır.",
        "string"  => ":attribute :min - :max arasında karakterden oluşmalıdır.",
        "array"   => ":attribute :min - :max arasında nesneye sahip olmalıdır."
    ),
    "confirmed"      => ":attribute tekrarı eşleşmiyor.",
    "date"            => ":attribute geçerli bir tarih olmalıdır.",
    "date_format"     => ":attribute :format biçimi ile eşleşmiyor.",
    "different"      => ":attribute ile :other birbirinden farklı olmalıdır.",
    "digits"          => ":attribute :digits rakam olmalıdır.",
    "digits_between"  => ":attribute :min ile :max arasında rakam olmalıdır.",
    "email"          => ":attribute biçimi geçersiz.",
    "exists"         => "Seçili :attribute geçersiz.",
    "image"          => ":attribute alanı resim dosyası olmalıdır.",
    "in"             => ":attribute değeri geçersiz.",
    "integer"        => ":attribute rakam olmalıdır.",
    "ip"             => ":attribute geçerli bir IP adresi olmalıdır.",
    "max"             => array(
        "numeric" => ":attribute değeri :max değerinden küçük olmalıdır.",
        "file"    => ":attribute değeri :max kilobayt değerinden küçük olmalıdır.",
        "string"  => ":attribute değeri :max karakter değerinden küçük olmalıdır.",
        "array"   => ":attribute değeri :max adedinden az nesneye sahip olmalıdır."
    ),
    "mimes"          => ":attribute dosya biçimi :values olmalıdır.",
    "min"            => array(
        "numeric" => ":attribute değeri :min değerinden büyük olmalıdır.",
        "file"    => ":attribute değeri :min kilobayt değerinden büyük olmalıdır.",
        "string"  => ":attribute değeri :min karakter değerinden büyük olmalıdır.",
        "array"   => ":attribute en az :min nesneye sahip olmalıdır."
    ),
    "not_in"         => "Seçili :attribute geçersiz.",
    "numeric"        => ":attribute rakam olmalıdır.",
    "regex"           => ":attribute biçimi geçersiz.",
    "required"       => ":attribute alanı gereklidir.",
    "required_if"      => ":attribute alanı, :other :value değerine sahip olduğunda zorunludur.",
    "required_with"   => ":attribute alanı :values varken zorunludur.",
    "required_with_all" => ":attribute alanı :values varken zorunludur.",
    "required_without" => ":attribute alanı :values yokken zorunludur.",
    "required_without_all" => ":attribute alanı :values yokken zorunludur.",
    "same"           => ":attribute ile :other eşleşmelidir.",
    "size"           => array(
        "numeric" => ":attribute :size olmalıdır.",
        "file"    => ":attribute :size kilobyte olmalıdır.",
        "string"  => ":attribute :size karakter olmalıdır.",
        "array"   => ":attribute :size nesneye sahip olmalıdır."
    ),
    "unique"         => ":attribute daha önceden kayıt edilmiş.",
    "url"            => ":attribute biçimi geçersiz.",

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