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

    "accepted"         => "Атрыбут :attribute павінен быць прыняты",
    "active_url"       => "Атрыбут :attribute не правільны URL",
    "after"            => "Атрыбут :attribute павінен быць датай пасля даты :date",
    "alpha"            => "Атрыбут :attribute можа ўтрымліваць толькі літары",
    "alpha_dash"       => "Атрыбут :attribute можа ўтрымліваць толькі літары, лічбы і злучок",
    "alpha_num"        => "Атрыбут :attribute можа ўтрымліваць толькі літары і лічбы",
    "array"            => "Атрыбут :attribute павінен быць масівам",
    "before"           => "Атрыбут :attribute павінен быць датай перад датай :date",
    "between"          => [
        "numeric" => "Атрыбут :attribute павінен быць паміж :min - :max",
        "file"    => "Атрыбут :attribute павінен быць паміж :min - :max кілабайт",
        "string"  => "Атрыбут :attribute павінен быць паміж :min - :max сімвалаў",
        "array"   => "Атрыбут :attribute павінен мець паміж :min - :max прадметаў",
    ],
    "confirmed"        => "Пацверджанне атрыбута :attribute не супадае",
    "date"             => "Атрыбут :attribute не з'яўляецца правільнай датай",
    "date_format"      => "Фармат атрыбута :attribute не супадае з фарматам :format",
    "different"        => "Атрыбут :attribute і іншы атрыбут :other павінны быць рознымі",
    "digits"           => "Атрыбут :attribute павінен складацца з :digits лічбаў",
    "digits_between"   => "Атрыбут :attribute павінен быць паміж :min і :max лічбамі",
    "email"            => "Фармат атрыбуту :attribute няправільны",
    "exists"           => "Абраны атрыбут :attribute няправільны",
    "image"            => "Атрыбут :attribute павінен быць выявай",
    "in"               => "Абраны атрыбут :attribute няправільны",
    "integer"          => "Атрыбут :attribute павінен быць цэлым лікам",
    "ip"               => "Атрыбут :attribute павінен быць правільным IP адрасам",
    "max"              => [
        "numeric" => "Атрыбут :attribute не можа быць больш за :max",
        "file"    => "Атрыбут :attribute не можа быць больш за :max кілабайт",
        "string"  => "Атрыбут :attribute не можа быць больш за :max сімвалаў",
        "array"   => "Атрыбут :attribute не можа мець больш за :max элементаў",
    ],
    "mimes"            => "Атрыбут :attribute павінен быць файлам тыпу: :values",
    "extensions"       => "Атрыбут :attribute павінен мець пашырэнне: :values",
    "min"              => [
        "numeric" => "Атрыбут :attribute павінен быць меньш за :min",
        "file"    => "Атрыбут :attribute павінен быць меньш за :min кілабайт",
        "string"  => "Атрыбут :attribute павінен быць меньш чым :min сімвалаў",
        "array"   => "Атрыбут :attribute павінен мець меньш за :min элементаў",
    ],
    "not_in"           => "Абраны атрыбут :attribute няправільны",
    "numeric"          => "Атрыбут :attribute павінен быць лічбай",
    "regex"            => "Фармат атрыбуту :attribute няправільны",
    "required"         => "Атрыбут :attribute з'яўляецца абавязковым",
    "required_if"      => "Атрыбут :attribute патрабуецца, калі інша поле :other роўнае :value.",
    "required_with"    => "Атрыбут :attribute патрабуецца, калі ёсць :values",
    "required_without" => "Атрыбут :attribute патрабуецца, калі няма :values",
    "same"             => "Атрыбут :attribute і іншы атрыбут :other павінны супадаць",
    "size"             => [
        "numeric" => "Атрыбут :attribute павінен мець памер :size",
        "file"    => "Атрыбут :attribute павінен быць :size кілабайт",
        "string"  => "Атрыбут :attribute павінен быць :size сімвалаў",
        "array"   => "Атрыбут :attribute павінен мець :size элементаў",
    ],
    "unique"           => "Атрыбут :attribute ужо заняты",
    "url"              => "Фармат атрыбуту :attribute няправільны",

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
