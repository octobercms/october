<?php

return array(

    /*
    |--------------------------------------------------------------------------
    | Tłumaczenia Walidacji
    |--------------------------------------------------------------------------
    |
	| Następujące tłumaczenia zawierają domyślne komunikaty błędów używane 
	| przez klasę walidatora. Niektóre z nich mają wiele wersji, np. zasady 
	| rozmiaru. Nie krępuj się modyfikować tych komunikatów.
    |
    */

    "accepted"         => ":attribute musi zostać zaakceptowany.",
    "active_url"       => ":attribute jest nieprawidłowym adresem URL.",
    "after"            => ":attribute musi być datą późniejszą od :date.",
    "alpha"            => ":attribute może zawierać jedynie litery.",
    "alpha_dash"       => ":attribute może zawierać jedynie litery, cyfry i myślniki.",
    "alpha_num"        => ":attribute może zawierać jedynie litery i cyfry.",
    "array"            => ":attribute musi być tablicą.",
    "before"           => ":attribute musi być datą wcześniejszą od :date.",
    "between"          => array(
        "numeric" => ":attribute musi zawierać się w granicach :min - :max.",
        "file"    => ":attribute musi zawierać się w granicach :min - :max kilobajtów.",
        "string"  => ":attribute musi zawierać się w granicach :min - :max znaków.",
        "array"   => ":attribute musi składać się z :min - :max elementów.",
    ),
    "confirmed"        => "Potwierdzenie :attribute nie zgadza się.",
    "date"             => ":attribute nie jest prawidłową datą.",
    "date_format"      => ":attribute nie jest w formacie :format.",
    "different"        => ":attribute oraz :other muszą się różnić.",
    "digits"           => ":attribute musi składać się z :digits cyfr.",
    "digits_between"   => ":attribute musi mieć od :min do :max cyfr.",
    "email"            => "Format :attribute jest nieprawidłowy.",
    "exists"           => "Zaznaczony :attribute jest nieprawidłowy.",
    "image"            => ":attribute musi być obrazkiem.",
    "in"               => "Zaznaczony :attribute jest nieprawidłowy.",
    "integer"          => ":attribute musi być liczbą całkowitą.",
    "ip"               => ":attribute musi być prawidłowym adresem IP.",
    "max"              => array(
        "numeric" => ":attribute nie może być większy niż :max.",
        "file"    => ":attribute nie może być większy niż :max kilobajtów.",
        "string"  => ":attribute nie może być dłuższy niż :max znaków.",
        "array"   => ":attribute nie może mieć więcej niż :max elementów.",
    ),
    "mimes"            => ":attribute musi być plikiem typu :values.",
	"extensions"       => ":attribute musi być rozszerzeniem :values.",
    "min"              => array(
        "numeric" => ":attribute musi być nie mniejszy od :min.",
        "file"    => ":attribute musi mieć przynajmniej :min kilobajtów.",
        "string"  => ":attribute musi mieć przynajmniej :min znaków.",
        "array"   => ":attribute musi mieć przynajmniej :min elementów.",
    ),
    "not_in"           => "Zaznaczony :attribute jest nieprawidłowy.",
    "numeric"          => ":attribute musi być liczbą.",
    "regex"            => "Format :attribute jest nieprawidłowy.",
    "required"         => "Pole :attribute jest wymagane.",
    "required_if"      => "Pole :attribute jest wymagane gdy :other jest :value.",
    "required_with"    => "Pole :attribute jest wymagane gdy :values jest obecny.",
    "required_without" => "Pole :attribute jest wymagane gdy :values nie jest obecny.",
    "same"             => "Pole :attribute i :other muszą się zgadzać.",
    "size"             => array(
        "numeric" => ":attribute musi mieć :size.",
        "file"    => ":attribute musi mieć :size kilobajtów.",
        "string"  => ":attribute musi mieć :size znaków.",
        "array"   => ":attribute musi zawierać :size elementów.",
    ),
    "unique"           => "Taki :attribute już występuje.",
    "url"              => "Format :attribute jest nieprawidłowy.",

    /*
    |--------------------------------------------------------------------------
    | Własne Tłumaczenia Walidacji
    |--------------------------------------------------------------------------
    |
	| Tutaj możesz sprecyzować własne komunikaty walidacji dla atrybutów 
	| używających konwencji "attribute.rule" do nazwania linii. To ułatwia  
	| ustalenie specyficznego tłumaczenia dla wybranej zasady atrybutu.
    |
    */

    'custom' => array(),

    /*
    |--------------------------------------------------------------------------
    | Własne Atrybuty Walidacji
    |--------------------------------------------------------------------------
    |
    | Następujące tłumaczenia są używane do zamiany atrybutów zastępczych 
	| na coś bardziej przyjaznego czytelnikowi, np. "Adres email" zamiast
	| "email". To pomaga nam stwarzać komunikaty czytelniejszymi.
    |
    */

    'attributes' => array(),

);
