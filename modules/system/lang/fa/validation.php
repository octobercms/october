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

    "accepted"         => ":attribute باید مورد قبولتان باشد.",
    "active_url"       => ":attribute آدرس الکترونیکی معتبری نیست.",
    "after"            => ":attribute باید تاریخی بعد از :date باشد.",
    "alpha"            => ":attribute فقط میتواند حاوی حروف انگلیسی باشد.",
    "alpha_dash"       => ":attribute فقط میتواند شامل حروف انگلیسی، اعداد و خط تیره باشد.",
    "alpha_num"        => ":attribute فقط میتواند شامل حروف انگلیسی و عدد باشد.",
    "array"            => ":attribute باید یک آرایه باشد.",
    "before"           => ":attribute باید تاریخی قبل از :date باشد.",
    "between"          => array(
        "numeric" => ":attribute میتواند مابین :min و :max باشد.",
        "file"    => "اندازه ی :attribute بای مابین :min و :max کیلوبایت باشد.",
        "string"  => ":attribute باید مابین :min و :max کاراکتر باشد.",
        "array"   => ":attribute باید شامل :min تا :max مورد باشد.",
    ),
    "confirmed"        => "مقداری :attribute با تاییدیه اش یکسان نیست.",
    "date"             => ":attribute تاریخ معتبری نیست.",
    "date_format"      => "مقدار :attribute در قالب :format نمی باشد.",
    "different"        => "مقدار :attribute و :other نباید یکسان باشد.",
    "digits"           => "مقدار :attribute باید یم عدد :digits رقمی باشد.",
    "digits_between"   => "مقدار :attribute باید ما بین :min و :max باشد.",
    "email"            => "قالب :attribute نامعتبر است.",
    "exists"           => ":attribute انتخاب شده نامعتبر است.",
    "image"            => ":attribute باید یک تصویر باشد.",
    "in"               => ":attribute انتخاب شده نا معتبر است.",
    "integer"          => ":attribute باید یک عدد صحیح باشد.",
    "ip"               => ":attribute حاوی یک آدرس آی پی معتبر نیست.",
    "max"              => array(
        "numeric" => ":attribute نباید بیشتر از :max باشد.",
        "file"    => ":attribute نباید بیش از :max کیلوبایت باشد.",
        "string"  => ":attribute نباید بیش از :max کاراکتر باشد.",
        "array"   => ":attribute نباید بیش تر از :max مورد داشته باشد.",
    ),
    "mimes"            => ":attribute باید فایلی از نوع :values باشد.",
    "min"              => array(
        "numeric" => "مقدار :attribute باید حد اقل :min باشد.",
        "file"    => ":attribute باید حداقل :min کیلوبایت باشد.",
        "string"  => ":attribute باید شامل حداقل :min کاراکتر باشد.",
        "array"   => ":attribute باید شامل حد اقل :min مورد باشد.",
    ),
    "not_in"           => ":attribute انتخاب شده نا معتبر است.",
    "numeric"          => "مقدار :attribute باید یم مقدار عددی باشد.",
    "regex"            => "قالب :attribute نا معتبر است.",
    "required"         => "وارد کردن :attribute الزامیست.",
    "required_if"      => "اگر مقدار :other برابر با :value باشد وارد کردن :attribute الزامیست.",
    "required_with"    => "فیل :attribute در صورتی که :values موجود باشد مورد نیاز است.",
    "required_without" => "فیلد :attribute در صورتی که مقدار :values وجود نداشته باشد مورد نیاز است.",
    "same"             => ":attribute و :other باید مقدار یکسانی داشته باشند.",
    "size"             => array(
        "numeric" => ":attribute باید به اندازه ی :size باشد.",
        "file"    => ":attribute باید :size کیلوبایت باشد.",
        "string"  => ":attribute باید :size کاراکتر باشد.",
        "array"   => ":attribute باید شامل :size مورد باشد.",
    ),
    "unique"           => ":attribute استفاده شده تکراری می باشد.",
    "url"              => "قالب :attribute نا معتبر است.",

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
