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

    "accepted"         => ":attribute jābūt apstiprinātam.",
    "active_url"       => ":attribute nav derīga URL.",
    "after"            => ":attribute jābūt datumam pēc :date.",
    "alpha"            => ":attribute drīkst saturēt tikai burtus.",
    "alpha_dash"       => ":attribute drīkst saturēt tikai burtus, skaitļus un šķērssvītras.",
    "alpha_num"        => ":attribute drīkst saturēt tikai burtus un skaitļus.",
    "array"            => ":attribute jābūt masīvam.",
    "before"           => ":attribute jābūt datumam pirms :date.",
    "between"          => [
        "numeric" => ":attribute jābūt starp :min - :max.",
        "file"    => ":attribute jābūt no :min - :max kilobaitiem.",
        "string"  => ":attribute jābūt no :min - :max simboliem.",
        "array"   => ":attribute jābūt no :min - :max objektiem.",
    ],
    "confirmed"        => ":attribute apstiprinājums nesakrīt.",
    "date"             => ":attribute ir nederīgs datums.",
    "date_format"      => ":attribute nesakrīt ar formātu :format.",
    "different"        => ":attribute un :other ir jābūt atšķirīgiem.",
    "digits"           => ":attribute ir jābūt :digits skaitļiem.",
    "digits_between"   => ":attribute jābūt no :min līdz :max skaitļiem.",
    "email"            => ":attribute nederīgs formāts.",
    "exists"           => "Izvēlētais :attribute ir nederīgs.",
    "image"            => ":attribute ir jābūt attēlam.",
    "in"               => "Izvēlētais :attribute ir nederīgs.",
    "integer"          => ":attribute ir jābūt skaitlim.",
    "ip"               => ":attribute ir jābūt derīgai IP adresei.",
    "max"              => [
        "numeric" => ":attribute nedrīkst pārsniegt :max.",
        "file"    => ":attribute nedrīkst pārsniegt :max kilobaitus.",
        "string"  => ":attribute nedrīkst pārsniegt :max simbolus.",
        "array"   => ":attribute nedrīkst pārsniegt :max objektus.",
    ],
    "mimes"            => ":attribute jabūt failam ar tipu: :values.",
    "extensions"       => ":attribute jābūt ar paplašinājumu: :values.",
    "min"              => [
        "numeric" => ":attribute jābūt vismaz :min.",
        "file"    => ":attribute jabūt vismaz :min kilobaitiem.",
        "string"  => ":attribute jābūt vismaz :min simboliem.",
        "array"   => ":attribute jābūt vismaz :min objektiem.",
    ],
    "not_in"           => "Izvēlētais :attribute nav derīgs.",
    "numeric"          => ":attribute jabūt skaitlim.",
    "regex"            => ":attribute formāts nav derīgs.",
    "required"         => ":attribute lauks ir obligāts.",
    "required_if"      => ":attribute lauks ir obligāts, ja :other ir :value.",
    "required_with"    => ":attribute lauks ir obligāts, ja :values ir norādītas.",
    "required_without" => ":attribute lauks ir obligāts, ja :values nav norādītas.",
    "same"             => ":attribute un :other ir jāsakrīt.",
    "size"             => [
        "numeric" => ":attribute ir jābūt :size.",
        "file"    => ":attribute ir jābūt :size kilobaitiem.",
        "string"  => ":attribute ir jābūt :size simboliem.",
        "array"   => ":attribute ir jābūt :size objektiem.",
    ],
    "unique"           => ":attribute ir jau aizņemts.",
    "url"              => ":attribute nederīgs formāts.",

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
