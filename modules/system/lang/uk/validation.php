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

    "accepted"         => "Ви повинні прийняти :attribute.",
    "active_url"       => "Поле :attribute недійсний URL.",
    "after"            => "Поле :attribute має бути датою після :date.",
    "alpha"            => "Поле :attribute може містити тільки літери.",
    "alpha_dash"       => "Поле :attribute може містити тільки букви, цифри і дефіс.",
    "alpha_num"        => "Поле :attribute може містити тільки букви і цифри.",
    "array"            => "Поле :attribute має бути масивом.",
    "before"           => "Поле :attribute має бути датою перед :date.",
    "between"          => [
        "numeric" => "Поле :attribute має бути між :min и :max.",
        "file"    => "Размер :attribute повинен бути від :min до :max Килобайт.",
        "string"  => "Длина :attribute повинна бути від :min до :max символов.",
        "array"   => "Поле :attribute має містити :min - :max элементов.",
    ],
    "confirmed"        => "Поле :attribute не збігається з підтвердженням.",
    "date"             => "Поле :attribute не є датою.",
    "date_format"      => "Поле :attribute не відповідає формату :format.",
    "different"        => "Поля :attribute та :other повинні відрізнятися.",
    "digits"           => "Довжина цифрового поля :attribute повинна бути :digits.",
    "digits_between"   => "Довжина цифрового поля :attribute повинна бути між :min та :max.",
    "email"            => "Поле :attribute має хибний формат.",
    "exists"           => "Вибране значення для :attribute вже існує.",
    "image"            => "Поле :attribute має бути зображенням.",
    "in"               => "Вибране значення для :attribute помилково.",
    "integer"          => "Поле :attribute має бути цілим числом.",
    "ip"               => "Поле :attribute має бути дійсним IP-адресою.",
    "max"              => [
        "numeric" => "Поле :attribute має бути не більше :max.",
        "file"    => "Поле :attribute має бути не більше :max кілобайт.",
        "string"  => "Поле :attribute має бути не довше :max символів.",
        "array"   => "Поле :attribute має містити не більше :max елементів.",
    ],
    "mimes"            => "Поле :attribute має бути файлом одного з типів: :values.",
    "extensions"       => "Поле :attribute повинен мати одне з розширень: :values.",
    "min"              => [
        "numeric" => "Поле :attribute має бути не менше :min.",
        "file"    => "Поле :attribute має бути не менше :min кілобайт.",
        "string"  => "Поле :attribute має бути не коротшою :min символів.",
        "array"   => "Поле :attribute має містити не менше :min елементів.",
    ],
    "not_in"           => "Вибране значення для :attribute помилково.",
    "numeric"          => "Поле :attribute має бути числом.",
    "regex"            => "Поле :attribute має хибний формат.",
    "required"         => "Поле :attribute обов'язкове для заповнення.",
    "required_if"      => "Поле :attribute обов'язково для заповнення, коли :other дорівнює :value.",
    "required_with"    => "Поле :attribute обов'язково для заповнення, коли :values вказано.",
    "required_without" => "Поле :attribute обов'язково для заповнення, коли :values не вказано.",
    "same"             => "Значення :attribute має збігатися з :other.",
    "size"             => [
        "numeric" => "Поле :attribute повинно бути :size.",
        "file"    => "Поле :attribute повинно бути :size кілобайт.",
        "string"  => "Поле :attribute має бути довжиною :size символів.",
        "array"   => "Кількість елементів в поле :attribute повинно бути :size.",
    ],
    "unique"           => "Таке значення поля :attribute вже існує.",
    "url"              => "Поле :attribute має хибний формат.",

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

    'attributes' => []

];
