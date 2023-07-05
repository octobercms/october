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

    'accepted' => ':attribute moet geaccepteerd zijn.',
    'accepted_if' => ':attribute moet geaccepteerd zijn als :other de waarde :value heeft.',
    'active_url' => ':attribute is geen geldige URL.',
    'after' => ':attribute moet een datum na :date zijn.',
    'after_or_equal' => ':attribute moet een datum na of gelijk aan :date zijn.',
    'alpha' => ':attribute mag alleen letters bevatten.',
    'alpha_dash' => ':attribute mag alleen letters, nummers, underscores (_) en streepjes (-) bevatten.',
    'alpha_num' => ':attribute mag alleen letters en nummers bevatten.',
    'array' => ':attribute moet geselecteerde elementen bevatten.',
    'ascii' => ':attribute mag alleen alfanumerieke karakters en symbolen bevatten.',
    'before' => ':attribute moet een datum voor :date zijn.',
    'before_or_equal' => ':attribute moet een datum voor of gelijk aan :date zijn.',
    'between' => [
        'numeric' => ':attribute moet tussen :min en :max zijn.',
        'file' => ':attribute moet tussen :min en :max kilobytes zijn.',
        'string' => ':attribute moet tussen :min en :max karakters zijn.',
        'array' => ':attribute moet tussen :min en :max items bevatten.',
    ],
    'boolean' => ':attribute moet ja of nee zijn.',
    'confirmed' => ':attribute bevestiging komt niet overeen.',
    'current_password' => 'Het wachtwoord is onjuist.',
    'date' => ':attribute moet een datum bevatten.',
    'date_equals' => ':attribute moet een datum zijn gelijk aan :date.',
    'date_format' => ':attribute moet een geldig datum formaat bevatten.',
    'decimal' => ':attribute moet :decimal decimalen bevatten.',
    'declined' => ':attribute moet zijn afgewezen.',
    'declined_if' => ':attribute moet afgewezen zijn als :other de waarde :value heeft.',
    'different' => ':attribute en :other moeten verschillend zijn.',
    'digits' => ':attribute moet bestaan uit :digits cijfers.',
    'digits_between' => ':attribute moet bestaan uit minimaal :min en maximaal :max cijfers.',
    'dimensions' => ':attribute heeft geen geldige afmetingen voor afbeeldingen.',
    'distinct' => ':attribute heeft een dubbele waarde.',
    'doesnt_end_with' => ':attribute mag niet eindigen met: :values.',
    'doesnt_start_with' => ':attribute mag niet starten met: :values.',
    'email' => ':attribute is geen geldig e-mailadres.',
    'ends_with' => ':attribute moet eindigen op een van de volgende waarden: :values.',
    'enum' => ':attribute is ongeldig.',
    'exists' => ':attribute bestaat niet.',
    'file' => ':attribute moet een bestand zijn.',
    'filled' => ':attribute is verplicht.',
    'gt' => [
        'numeric' => ':attribute moet groter zijn dan :value.',
        'file' => ':attribute moet groter zijn dan :value kilobyte.',
        'string' => ':attribute moet langer zijn dan :value karakters.',
        'array' => ':attribute moet meer dan :value items bevatten.',
    ],
    'gte' => [
        'numeric' => ':attribute moet groter of gelijk zijn aan :value.',
        'file' => ':attribute moet minstens :value kilobyte groot zijn.',
        'string' => ':attribute moet minstens :value karakters lang zijn.',
        'array' => ':attribute moet minstens :value items bevatten.',
    ],
    'image' => ':attribute moet een afbeelding zijn.',
    'in' => ':attribute is ongeldig.',
    'in_array' => ':attribute bestaat niet in :other.',
    'integer' => ':attribute moet een getal zijn.',
    'ip' => ':attribute moet een geldig IP-adres zijn.',
    'ipv4' => ':attribute moet een geldig IPv4-adres zijn.',
    'ipv6' => ':attribute moet een geldig IPv6-adres zijn.',
    'json' => ':attribute moet een geldige JSON-string zijn.',
    'lowercase' => ':attribute mag alleen kleine letters bevatten.',
    'lt' => [
        'array' => ':attribute moet minder dan :value items bevatten.',
        'file' => ':attribute moet kleiner zijn dan :value kilobyte.',
        'numeric' => ':attribute moet kleiner zijn dan :value.',
        'string' => ':attribute moet korter zijn dan :value karakters.',
    ],
    'lte' => [
        'array' => ':attribute mag hoogstens :value items bevatten.',
        'file' => ':attribute mag hoogstens :value kilobyte groot zijn.',
        'numeric' => ':attribute moet kleiner of gelijk zijn aan :value.',
        'string' => ':attribute mag hoogstens :value karakters lang zijn.',
    ],
    'mac_address' => ':attribute is geen geldig MAC-adres.',
    'max' => [
        'array' => ':attribute mag niet meer dan :max items bevatten.',
        'file' => ':attribute mag niet meer dan :max kilobytes zijn.',
        'numeric' => ':attribute mag niet hoger dan :max zijn.',
        'string' => ':attribute mag niet uit meer dan :max karakters bestaan.',
    ],
    'max_digits' => ':attribute mag niet meer dan :max cijfers bevatten.',
    'mimes' => ':attribute moet een bestand zijn van het bestandstype :values.',
    'mimetypes' => ':attribute moet een bestand zijn van het bestandstype :values.',
    'min' => [
        'array' => ':attribute moet minimaal :min items bevatten.',
        'file' => ':attribute moet minimaal :min kilobytes zijn.',
        'numeric' => ':attribute moet minimaal :min zijn.',
        'string' => ':attribute moet minimaal :min karakters zijn.',
    ],
    'min_digits' => ':attribute moet minstens :min cijfers bevatten.',
    'missing' => ':attribute mag niet aanwezig zijn.',
    'missing_if' => ':attribute mag niet aanwezig zijn als :other de waarde :value heeft.',
    'missing_unless' => ':attribute mag niet aanwezige zijn tenzij :other de waarde :value heeft.',
    'missing_with' => ':attribute mag niet aanwezig zijn als waarde :values aanwezig is.',
    'missing_with_all' => ':attribute mag niet aanwezig zijn als waarden :values aanwezig zijn.',
    'multiple_of' => ':attribute moet een meervoud zijn van :value.',
    'not_in' => 'De gekozen waarde van :attribute is ongeldig.',
    'not_regex' => 'Het formaat van :attribute is ongeldig.',
    'numeric' => ':attribute moet een nummer zijn.',
    'password' => [
        'letters' => ':attribute moet tenminste één letter bevatten.',
        'mixed' => ':attribute moet tenminste één hoofdletter en één kleine letter bevatten.',
        'numbers' => ':attribute moet tenminste één cijfer bevatten.',
        'symbols' => ':attribute moet tenminste één symbool bevatten.',
        'uncompromised' => ':attribute is voorgekomen in een datalek. Kies een ander :attribute.',
    ],
    'present' => ':attribute moet bestaan.',
    'prohibited' => ':attribute is niet toegestaan.',
    'prohibited_if' => ':attribute is niet toegestaan als :other de waarde :value heeft.',
    'prohibited_unless' => ':attribute is niet toegestaan tenzij :other de waarden :values bevat.',
    'prohibits' => ':attribute staat niet toe dat :other aanwezig is.',
    'regex' => ':attribute formaat is ongeldig.',
    'required' => ':attribute is verplicht.',
    'required_array_keys' => ':attribute moet waarden bevatten uit: :values.',
    'required_if' => ':attribute is verplicht indien :other gelijk is aan :value.',
    'required_if_accepted' => ':attribute is verplicht als :other is geaccepteerd.',
    'required_unless' => ':attribute is verplicht tenzij :other gelijk is aan :values.',
    'required_with' => ':attribute is verplicht i.c.m. :values',
    'required_with_all' => ':attribute is verplicht i.c.m. :values',
    'required_without' => ':attribute is verplicht als :values niet ingevuld is.',
    'required_without_all' => ':attribute is verplicht als :values niet ingevuld zijn.',
    'same' => ':attribute en :other moeten overeenkomen.',
    'size' => [
        'array' => ':attribute moet :size items bevatten.',
        'file' => ':attribute moet :size kilobyte zijn.',
        'numeric' => ':attribute moet :size zijn.',
        'string' => ':attribute moet :size karakters zijn.',
    ],
    'starts_with' => ':attribute moet beginnen met een van de volgende waarden: :values.',
    'string' => ':attribute moet een tekenreeks zijn.',
    'timezone' => ':attribute moet een geldige tijdzone zijn.',
    'unique' => ':attribute is al in gebruik.',
    'uploaded' => 'Het uploaden van :attribute is mislukt.',
    'uppercase' => ':attribute mag enkel hoofdletters bevatten.',
    'url' => ':attribute is geen geldige URL.',
    'ulid' => ':attribute moet een geldig ULID zijn.',
    'uuid' => ':attribute moet een geldig UUID zijn.',

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
            'rule-name' => 'custom-message',
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
