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

    "accepted"         => ":attribute باید مورد قبولتان باشد.",
    "active_url"       => ":attribute آدرس سایت معتبری نیست.",
    "after"            => ":attribute باید تاریخی بعد از :date باشد.",
    'after_or_equal'       => ':attribute باید تاریخ :date و یا بعد از آن باشد.',
    "alpha"            => ":attribute فقط میتواند حاوی حروف انگلیسی باشد.",
    "alpha_dash"       => ":attribute فقط میتواند شامل حروف انگلیسی، اعداد و خط تیره باشد.",
    "alpha_num"        => ":attribute فقط میتواند شامل حروف انگلیسی و عدد باشد.",
    "array"            => ":attribute باید یک آرایه باشد.",
    "before"           => ":attribute باید تاریخی قبل از :date باشد.",
    'before_or_equal'      => ':attribute باید تاریخ :date و یا قبل از آن باشد.',
    "between"          => [
        "numeric" => ":attribute میتواند مابین :min و :max باشد.",
        "file"    => "اندازه ی :attribute بای مابین :min و :max کیلوبایت باشد.",
        "string"  => ":attribute باید مابین :min و :max کاراکتر باشد.",
        "array"   => ":attribute باید شامل :min تا :max مورد باشد.",
    ],
    'boolean'              => ':attribute باید صحیح یا غلط باشد.',
    "confirmed"        => "مقداری :attribute با تاییدیه اش یکسان نیست.",
    "date"             => ":attribute تاریخ معتبری نیست.",
    "date_format"      => "مقدار :attribute در قالب :format نمی باشد.",
    "different"        => "مقدار :attribute و :other نباید یکسان باشد.",
    "digits"           => "مقدار :attribute باید یک عدد :digits رقمی باشد.",
    "digits_between"   => "مقدار :attribute باید ما بین :min و :max باشد.",
    'dimensions'           => ':attribute اندازه صحیح تصویر نمی باشد.',
    'distinct'             => ':attribute دارای داده تکراری می باشد.',
    "email"            => "قالب :attribute نامعتبر است.",
    "exists"           => ":attribute انتخاب شده نامعتبر است.",
    'file'                 => ':attribute باید یک فایل باشد.',
    'filled'               => 'مقداری برای :attribute وارد نشده است.',
    'image'                => ':attribute باید یک تصویر باشد.',
    'in'                   => ':attribute انتخاب شده صحیح نمی باشد.',
    'in_array'             => 'مقدار :attribute در :other موجود نیست.',
    'integer'              => 'مقدار :attribute باید یک عدد صحیح باشد.',
    'ip'                   => ':attribute آدرس IP صحیحی نیست.',
    'ipv4'                 => ':attribute آدرس IPv4 صحیحی نمی باشد.',
    'ipv6'                 => ':attribute آدرس IPv6 صحیحی نمی باشد.',
    'json'                 => ':attribute باید شامل متن JSON معتبر باشد.',
    "max"              => [
        "numeric" => ":attribute نباید بیشتر از :max باشد.",
        "file"    => ":attribute نباید بیش از :max کیلوبایت باشد.",
        "string"  => ":attribute نباید بیش از :max کاراکتر باشد.",
        "array"   => ":attribute نباید بیش تر از :max مورد داشته باشد.",
    ],
    "mimes"            => ":attribute باید فایلی از نوع :values باشد.",
    "extensions"       => "پسوند :attribute باید :values باشد.",
    "min"              => [
        "numeric" => "مقدار :attribute باید حد اقل :min باشد.",
        "file"    => ":attribute باید حداقل :min کیلوبایت باشد.",
        "string"  => ":attribute باید شامل حداقل :min کاراکتر باشد.",
        "array"   => ":attribute باید شامل حد اقل :min مورد باشد.",
    ],
    "not_in"           => ":attribute انتخاب شده نا معتبر است.",
    "numeric"          =>  "مقدار :attribute باید یک مقدار عددی باشد.",
    'present'              => 'مقداری :attribute باید درصد باشد.',
    "regex"            => "قالب :attribute نا معتبر است.",
    "required"         => "وارد کردن :attribute الزامیست.",
    "required_if"      => "اگر مقدار :other برابر با :value باشد وارد کردن :attribute الزامیست.",
    'required_unless'      => 'وارد کردن گزینه :attribute تا زمانی که مقدار :other برابر با :values باشد اجباریست.',
    "required_with"    => "فیل :attribute در صورتی که :values موجود باشد مورد نیاز است.",
    'required_with_all'    => 'وارد کردن گزینه :attribute رمانی که :values باشد اجباریست.',
    "required_without" => "فیلد :attribute در صورتی که مقدار :values وجود نداشته باشد مورد نیاز است.",
    'required_without_all' => 'وارد کردن مقدار :attribute تا زمانی که هیچ یک از :values وارد نشده باشد اجباریست.',
    "same"             => ":attribute و :other باید مقدار یکسانی داشته باشند.",
    "size"             => [
        "numeric" => ":attribute باید به اندازه ی :size باشد.",
        "file"    => ":attribute باید :size کیلوبایت باشد.",
        "string"  => ":attribute باید :size کاراکتر باشد.",
        "array"   => ":attribute باید شامل :size مورد باشد.",
    ],
    'string'               => ':attribute یک رشته معتبر نمی باشد.',
    'timezone'             => ':attribute وارد شده یک منطقه معتبر نمی باشد.',
    "unique"           => ":attribute استفاده شده تکراری می باشد.",
    'uploaded'             => 'ارسال :attribute با خطا روبرو شده است..',
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

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'پیغام مورد دلخواه',
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
