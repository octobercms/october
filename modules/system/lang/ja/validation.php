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

    "accepted"             => ":attributeを承認してください。",
    "active_url"           => ":attributeは、有効なURLではありません。",
    "after"                => ":attributeには、:date以降の日付を指定してください。",
    "alpha"                => ":attributeには、アルファベッドのみ使用できます。",
    "alpha_dash"           => ":attributeには、英数字('A-Z','a-z','0-9')とハイフンと下線('-','_')が使用できます。",
    "alpha_num"            => ":attributeには、英数字('A-Z','a-z','0-9')が使用できます。",
    "array"                => ":attributeには、配列を指定してください。",
    "before"               => ":attributeには、:date以前の日付を指定してください。",
    "between"              => [
        "numeric" => ":attributeには、:minから、:maxまでの数字を指定してください。",
        "file"    => ":attributeには、:min KBから:max KBまでのサイズのファイルを指定してください。",
        "string"  => ":attributeは、:min文字から:max文字にしてください。",
        "array"   => ":attributeの項目は、:min個から:max個にしてください。",
    ],
    "boolean"              => ":attributeには、'true'か'false'を指定してください。",
    "confirmed"            => ":attributeと:attribute確認が一致しません。",
    "date"                 => ":attributeは、正しい日付ではありません。",
    "date_format"          => ":attributeの形式は、':format'と合いません。",
    "different"            => ":attributeと:otherには、異なるものを指定してください。",
    "digits"               => ":attributeは、:digits桁にしてください。",
    "digits_between"       => ":attributeは、:min桁から:max桁にしてください。",
    "email"                => ":attributeは、有効なメールアドレス形式で指定してください。",
    "exists"               => "選択された:attributeは、有効ではありません。",
    "image"                => ":attributeには、画像を指定してください。",
    "in"                   => "選択された:attributeは、有効ではありません。",
    "integer"              => ":attributeには、整数を指定してください。",
    "ip"                   => ":attributeには、有効なIPアドレスを指定してください。",
    "max"                  => [
        "numeric" => ":attributeには、:max以下の数字を指定してください。",
        "file"    => ":attributeには、:max KB以下のファイルを指定してください。",
        "string"  => ":attributeは、:max文字以下にしてください。",
        "array"   => ":attributeの項目は、:max個以下にしてください。",
    ],
    "mimes"                => ":attributeには、:valuesタイプのファイルを指定してください。",
    "min"                  => [
        "numeric" => ":attributeには、:min以上の数字を指定してください。",
        "file"    => ":attributeには、:min KB以上のファイルを指定してください。",
        "string"  => ":attributeは、:min文字以上にしてください。",
        "array"   => ":attributeの項目は、:max個以上にしてください。",
    ],
    "not_in"               => "選択された:attributeは、有効ではありません。",
    "numeric"              => ":attributeには、数字を指定してください。",
    "regex"                => ":attributeには、有効な正規表現を指定してください。",
    "required"             => ":attributeは、必ず指定してください。",
    "required_if"          => ":otherが:valueの場合、:attributeを指定してください",
    "required_with"        => ":valuesが指定されている場合、:attributeも指定してください。",
    "required_with_all"    => ":valuesが全て指定されている場合、:attributeも指定してください。",
    "required_without"     => ":valuesが指定されていない場合、:attributeを指定してください。",
    "required_without_all" => ":valuesが全て指定されていない場合、:attributeを指定してください。",
    "same"                 => ":attributeと:otherが一致しません。",
    "size"                 => [
        "numeric" => ":attributeには、:sizeを指定してください。",
        "file"    => ":attributeには、:size KBのファイルを指定してください。",
        "string"  => ":attributeは、:size文字にしてください。",
        "array"   => ":attributeの項目は、:size個にしてください。",
    ],
    "unique"               => "指定の:attributeは既に使用されています。",
    "url"                  => ":attributeは、有効なURL形式で指定してください。",
    "timezone"             => ":attributeには、有効なタイムゾーンを指定してください。",

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
        'phone.regex' => '電話番号の形式が正しくありません。',
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

    'attributes' => [
        'name'    => '名前',
        'email'   => 'メールアドレス',
        'phone'   => '電話番号',
        'subject' => 'お申し込み・お問い合わせ内容',
        'body'    => 'メッセージ',
    ],

];
