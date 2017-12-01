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
    "accepted"         => "Този :attribute трябва да се приеме.",
    "active_url"       => "Този :attribute не е валидно URL.",
    "after"            => "Този :attribute трябва да е дата след :date.",
    "alpha"            => "Този :attribute може само да съдържа букви.",
    "alpha_dash"       => "Този :attribute може само да съдържа букви, числа, и тирета.",
    "alpha_num"        => "Този :attribute може само да съдържа букви и числа.",
    "array"            => "Този :attribute трябва да е масив.",
    "before"           => "Този :attribute трябва да бъде дата преди :date.",
    "between"          => [
        "numeric" => "Този :attribute трябва да бъде между :min - :max.",
        "file"    => "Този :attribute трябва да бъде между :min - :max килобайта.",
        "string"  => "Този :attribute трябва да бъде между :min - :max знака.",
        "array"   => "Този :attribute must have between :min - :max елементи.",
    ],
    "confirmed"        => "Този :attribute потвърждението не съответства.",
    "date"             => "Този :attribute не е валидна дата.",
    "date_format"      => "Този :attribute не съответства на формата :format.",
    "different"        => "Този :attribute и :other трябва да бъдат различенни.",
    "digits"           => "Този :attribute трябва да е :digits цифри.",
    "digits_between"   => "Този :attribute трябва да бъде между :min and :max цифри.",
    "email"            => "Този :attribute е с невалиден формат.",
    "exists"           => "Този избран :attribute е невалиден.",
    "image"            => "Този :attribute трябва да е изображение.",
    "in"               => "Този избран :attribute е невалиден.",
    "integer"          => "Този :attribute трябва да е цяло число.",
    "ip"               => "Този :attribute трябва да е валиден IP адрес.",
    "max"              => [
        "numeric" => "Този :attribute не може да бъде по-голяма от :max.",
        "file"    => "Този :attribute не може да бъде по-голяма от :max килобайта.",
        "string"  => "Този :attribute не може да бъде по-голяма от :max знака.",
        "array"   => "Този :attribute не трябва да има повече :max елементи.",
    ],
    "mimes"            => "Този :attribute трябва да бъде файл от тип: :values.",
    "extensions"       => "Този :attribute трябва да има разширение: :values.",
    "min"              => [
        "numeric" => "Този :attribute трябва да е поне :min.",
        "file"    => "Този :attribute трябва да е поне :min килобайта.",
        "string"  => "Този :attribute трябва да е поне :min знака.",
        "array"   => "Този :attribute трябва да има поне :min елемента.",
    ],
    "not_in"           => "Този избран :attribute е невалиден.",
    "numeric"          => "Този :attribute трябва да е число.",
    "regex"            => "Този :attribute е с невалиден формат.",
    "required"         => "Този :attribute е задължително поле.",
    "required_if"      => "Този :attribute е задължително поле когато :other е :value.",
    "required_with"    => "Този :attribute е задължително поле когато :values е предоставен.",
    "required_without" => "Този :attribute е задължително поле когато :values не е предоставен.",
    "same"             => "Този :attribute и :other трябва да съвпадат.",
    "size"             => [
        "numeric" => "Този :attribute трябва да е :size.",
        "file"    => "Този :attribute трябва да е :size килобайта.",
        "string"  => "Този :attribute трябва да е :size знака.",
        "array"   => "Този :attribute трябва да съдържа :size елементи.",
    ],
    "unique"           => "Този :attribute е вече зает.",
    "url"              => "Този :attribute е с невалиден формат.",
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
