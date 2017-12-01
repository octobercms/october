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

    "accepted"             => "Isian :attribute harus diterima.",
    "active_url"           => "Isian :attribute bukan URL yang valid.",
    "after"                => "Isian :attribute harus tanggal setelah :date.",
    "alpha"                => "Isian :attribute hanya boleh berisi huruf.",
    "alpha_dash"           => "Isian :attribute hanya boleh berisi huruf, angka, dan strip.",
    "alpha_num"            => "Isian :attribute hanya boleh berisi huruf dan angka.",
    "array"                => "Isian :attribute harus berupa sebuah larik (array).",
    "before"               => "Isian :attribute harus tanggal sebelum :date.",
    "between"              => [
        "numeric" => "Isian :attribute harus antara :min dan :max.",
        "file"    => "Isian :attribute harus antara :min dan :max kilobita.",
        "string"  => "Isian :attribute harus antara :min dan :max karakter.",
        "array"   => "Isian :attribute harus antara :min dan :max butir.",
    ],
    "boolean"              => "Isian :attribute harus berupa true atau false",
    "confirmed"            => "Konfirmasi :attribute tidak cocok.",
    "date"                 => "Isian :attribute bukan tanggal yang valid.",
    "date_format"          => "Isian :attribute tidak sesuai dengan format :format.",
    "different"            => "Isian :attribute dan :other harus berbeda.",
    "digits"               => "Isian :attribute harus berupa angka :digits.",
    "digits_between"       => "Isian :attribute harus antara angka :min dan :max.",
    "email"                => "Isian :attribute harus berupa alamat surel yang valid.",
    "exists"               => "Isian :attribute yang dipilih tidak valid.",
    "image"                => "Isian :attribute harus berupa gambar.",
    "in"                   => "Isian :attribute yang dipilih tidak valid.",
    "integer"              => "Isian :attribute harus merupakan bilangan bulat.",
    "ip"                   => "Isian :attribute harus berupa alamat IP yang valid.",
    "max"                  => [
        "numeric" => "Isian :attribute tidak boleh lebih dari :max.",
        "file"    => "Isian :attribute tidak boleh lebih dari :max kilobita.",
        "string"  => "Isian :attribute tidak boleh lebih dari :max karakter.",
        "array"   => "Isian :attribute tidak boleh lebih dari :max butir.",
    ],
    "mimes"                => "Isian :attribute harus berkas berjenis : :values.",
    "min"                  => [
        "numeric" => "Isian :attribute minimal :min.",
        "file"    => "Isian :attribute minimal :min kilobita.",
        "string"  => "Isian :attribute minimal :min karakter.",
        "array"   => "Isian :attribute minimal :min butir.",
    ],
    "not_in"               => "Isian :attribute yang dipilih tidak valid.",
    "numeric"              => "Isian :attribute harus berupa angka.",
    "regex"                => "Format isian :attribute tidak valid.",
    "required"             => "Bidang isian :attribute wajib diisi.",
    "required_if"          => "Bidang isian :attribute wajib diisi bila :other adalah :value.",
    "required_with"        => "Bidang isian :attribute wajib diisi bila terdapat :values.",
    "required_with_all"    => "Bidang isian :attribute wajib diisi bila terdapat :values.",
    "required_without"     => "Bidang isian :attribute wajib diisi bila tidak terdapat :values.",
    "required_without_all" => "Bidang isian :attribute wajib diisi bila tidak terdapat ada :values.",
    "same"                 => "Isian :attribute dan :other harus sama.",
    "size"                 => [
        "numeric" => "Isian :attribute harus berukuran :size.",
        "file"    => "Isian :attribute harus berukuran :size kilobita.",
        "string"  => "Isian :attribute harus berukuran :size karakter.",
        "array"   => "Isian :attribute harus mengandung :size butir.",
    ],
    "unique"               => "Isian :attribute sudah ada sebelumnya.",
    "url"                  => "Format isian :attribute tidak valid.",

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

];
