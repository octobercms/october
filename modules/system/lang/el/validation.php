<?php
/* Greek Language Updated on 2015-07-06 v1.01 */
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

    "accepted"         => "Το :attribute πρέπει να γίνει αποδεκτό.",
    "active_url"       => "Το :attribute δεν είναι ένα έγκυρο URL.",
    "after"            => "Η :attribute πρέπει να είναι μια ημερομηνία μετρά την :date.",
    "alpha"            => "Το :attribute πρέπει να περιέχει μόνο γράμματα.",
    "alpha_dash"       => "Το :attribute πρέπει να περιέχει μόνο γράμματα, νούμερα, και παύλες.",
    "alpha_num"        => "Το :attribute πρέπει να περιέχει μόνο γράμματα και νούμερα.",
    "array"            => "Το :attribute πρέπει να είναι ένας πίνακας.",
    "before"           => "Η :attribute πρέπει να είναι μια ημερομηνία πριν την :date.",
    "between"          => [
        "numeric" => "Το :attribute πρέπει να είναι μεταξύ :min - :max.",
        "file"    => "Το :attribute πρέπει να είναι μεταξύ :min - :max kilobytes.",
        "string"  => "Το :attribute πρέπει να είναι μεταξύ :min - :max χαρακτήρες.",
        "array"   => "Ο :attribute πρέπει να εχει μεταξύ :min - :max αντικείμενα.",
    ],
    "confirmed"        => "Η επαλήθευση του :attribute δεν ταυτίζεται.",
    "date"             => "Η :attribute δεν είναι μια έγκυρη ημερομηνία.",
    "date_format"      => "Η :attribute δεν ταυτίζεται με την μορφοποίηση :format",
    "different"        => "Το :attribute και το :other πρέπει να είναι διαφορετικά.",
    "digits"           => "Το :attribute πρέπει να είναι :digits ψηφία.",
    "digits_between"   => "Το :attribute πρέπει να είναι μεταξύ :min και :max ψηφία.",
    "email"            => "Η μορφή του :attribute είναι μη έγκυρη.",
    "exists"           => "Η επιλεγμένη :attribute είναι μη έγκυρη.",
    "image"            => "Η :attribute πρέπει να είναι εικόνα.",
    "in"               => "Η επιλεγμένη :attribute είναι μη έγκυρη.",
    "integer"          => "Ο :attribute πρέπει να είναι ένας ακέραιος αριθμός.",
    "ip"               => "Η :attribute πρέπει να είναι μια έγκυρη IP διεύθυνση.",
    "max"              => [
        "numeric" => "Το :attribute δεν πρέπει να είναι μεγαλύτερο από :max.",
        "file"    => "Το :attribute δεν πρέπει να είναι μεγαλύτερο από :max kilobytes.",
        "string"  => "Το :attribute δεν πρέπει να είναι μεγαλύτερο από :max χαρακτήρες.",
        "array"   => "Το :attribute δεν πρέπει να είναι έχει περισσότερα από :max αντικείμενα.",
    ],
    "mimes"            => "Το :attribute πρέπει να είναι ένα αρχείο με τύπο: :values.",
    "extensions"       => "Το :attribute πρέπει να έχει μια επέκταση από: :values.",
    "min"              => [
        "numeric" => "Το :attribute πρέπει να είναι το λιγότερο :min.",
        "file"    => "Το :attribute πρέπει να είναι το λιγότερο :min kilobytes.",
        "string"  => "Το :attribute πρέπει να είναι το λιγότερο :min χαρακτήρες.",
        "array"   => "Το :attribute πρέπει να έχει το λιγότερο :min αντικείμενα.",
    ],
    "not_in"           => "Το επιλεγμένο :attribute είναι μη έγκυρο.",
    "numeric"          => "Το :attribute πρέπει να είναι ένας αριθμός.",
    "regex"            => "Η μορφοποίηση του :attribute είναι μη έγκυρη.",
    "required"         => "Το πεδίο :attribute απαιτείται.",
    "required_if"      => "Το πεδίο :attribute απαιτείται όταν το :other είναι :value.",
    "required_with"    => "Το πεδίο :attribute απαιτείται όταν οι :values είναι δηλωμένες.",
    "required_without" => "Το πεδίο :attribute απαιτείται όταν οι :values δεν είναι δηλωμένες. ",
    "same"             => "Το :attribute και το :other δεν ταυτίζονται.",
    "size"             => [
        "numeric" => "Το :attribute πρέπει να είναι :size.",
        "file"    => "Το :attribute πρέπει να είναι :size kilobytes.",
        "string"  => "Το :attribute πρέπει να είναι :size χαρακτήρες.",
        "array"   => "Το :attribute πρέπει να είναι :size αντικείμενα.",
    ],
    "unique"           => "Η :attribute έχει ήδη χρησιμοποιηθεί.",
    "url"              => "Η :attribute είναι μη έγκυρη.",
    
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
