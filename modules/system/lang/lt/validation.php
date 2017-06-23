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

    "accepted"         => "Atributas :attribute turi sutikti.",
    "active_url"       => "Atributas :attribute nėra tinkamas URL.",
    "after"            => "Atributas :attribute turi būti data po :date.",
    "alpha"            => "Atributą :attribute gali sudaryti tik raides.",
    "alpha_dash"       => "Atributą :attribute gali sudaryti tik raidės, skaičiai bei brūkšneliai.",
    "alpha_num"        => "Atributą :attribute gali sudaryti ti raidės ir skaičiai.",
    "array"            => "Atributas :attribute turi būti masyvas.",
    "before"           => "Atributas :attribute turi būti data prieš :date.",
    "between"          => [
        "numeric" => "Atributas :attribute turi būti tarp :min - :max.",
        "file"    => "Atributas :attribute turi būti tarp :min - :max kilobaitais.",
        "string"  => "Atributas :attribute turi būti tarp :min - :max simboliais.",
        "array"   => "Atributas :attribute privalo turėti tarp :min - :max elementais.",
    ],
    "confirmed"        => "Atributo :attribute patvirtinimas neatininka.",
    "date"             => "Atributas :attribute nėra galiojanti data.",
    "date_format"      => "Atributas :attribute neatitinka formato :format.",
    "different"        => "Atributas :attribute ir :other turi būti skirtingi.",
    "digits"           => "Atributas :attribute privalo turėti :digits skaitmenis.",
    "digits_between"   => "Atributas :attribute turi būti tarp :min ir :max skaitmenų.",
    "email"            => "Atributo :attribute formatas netinkamas.",
    "exists"           => "Pasirinktas :attribute yra netinkamas.",
    "image"            => "Atributas :attribute turi būti paveiksliukas.",
    "in"               => "Pasirinktas :attribute yra netinkamas.",
    "integer"          => "Atributas :attribute turi būti skaitmuo.",
    "ip"               => "Atributas :attribute turi būti galiojanti IP adresas.",
    "max"              => [
        "numeric" => "Atributas :attribute negali būti didesnis nei :max.",
        "file"    => "Atributas :attribute negali būti didesnis nei :max kilobaitais.",
        "string"  => "Atributas :attribute negali būti didesnis nei :max simboliais.",
        "array"   => "Atributas :attribute negali turėti daugiau nei :max elementais.",
    ],
    "mimes"            => "Atributas :attribute turi būti failo tipas: :values.",
    "extensions"       => "Atributas :attribute privalo turėti galūnę: :values.",
    "min"              => [
        "numeric" => "Atributas :attribute turi būti bent :min.",
        "file"    => "Atributas :attribute turi būti bent :min kilobaitais.",
        "string"  => "Atributas :attribute turi būti bent :min simboliais.",
        "array"   => "Atributas :attribute privalo turėti bent :min elementais.",
    ],
    "not_in"           => "Pasirinktas :attribute yra netinkamas.",
    "numeric"          => "Atributas :attribute turi būti skaitmuo.",
    "regex"            => "Atributo :attribute formatas yra netinkamas.",
    "required"         => ":attribute laukelis yra privalomas.",
    "required_if"      => ":attribute laukelis yra privalomas kai :other yra :value.",
    "required_with"    => ":attribute laukelis yra privalomas kai :values pateikti.",
    "required_without" => ":attribute laukelis yra privalomas kai :values nėra pateikti.",
    "same"             => ":attribute ir :other turi sutapti.",
    "size"             => [
        "numeric" => "Atributas :attribute turi būti :size.",
        "file"    => "Atributas :attribute turi būti :size kilobaitais.",
        "string"  => "Atributas :attribute turi būti :size simboliais.",
        "array"   => "Atributas :attribute privalo turėti :size elementais.",
    ],
    "unique"           => "Atributas :attribute jau yra naudojamas.",
    "url"              => "Atributas :attribute formatas yra netinkamas.",

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
