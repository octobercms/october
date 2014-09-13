<?php

return [
    'field' => [
        'invalid_type' => 'Ongeldig type veld: :type.',
        'options_method_not_exists' => 'De modelklasse :model moet de methode :method() definiëren met daarin opties voor het veld ":field".',
    ],
    'widget' => [
        'not_registered' => "Een widget met klassenaam ':name' is niet geregistreerd",
        'not_bound' => "Een widget met klassenaam ':name' is niet gekoppeld aan de controller",
    ],
    'page' => [
        'untitled' => "Naamloos",
        'access_denied' => [
            'label' => "Toegang geweigerd",
            'help' => "Je hebt niet de benodigde rechten om deze pagina te bekijken.",
            'cms_link' => "Ga naar CMS",
        ],
    ],
    'partial' => [
        'not_found' => "Het sjabloon (partial) ':name' is niet gevonden.",
    ],
    'account' => [
        'sign_out' => 'Uitloggen',
        'login' => 'Inloggen',
        'reset' => 'Wissen',
        'restore' => 'Herstellen',
        'login_placeholder' => 'Gebruikersnaam',
        'password_placeholder' => 'Wachtwoord',
        'forgot_password' => "Wachtwoord vergeten?",
        'enter_email' => "Vul jouw e-mailadres in",
        'enter_login' => "Vul jouw gebruikersnaam in",
        'email_placeholder' => "E-mailadres",
        'enter_new_password' => "Vul een nieuw wachtwoord in",
        'password_reset' => "Herstel wachtwoord",
        'restore_success' => "Een e-mail met instructies om het wachtwoord te herstellen is verzonden naar jouw e-mailadres.",
        'restore_error' => "Een gebruiker met de gebruikersnaam ':login' is niet gevonden",
        'reset_success' => "Het wachtwoord is succesvol hersteld. Je kunt nu inloggen",
        'reset_error' => "Ongeldige herstelinformatie aangeboden. Probeer het opnieuw!",
        'reset_fail' => "Het is niet mogelijk het wachtwoord te herstellen!",
        'apply' => 'Toepassen',
        'cancel' => 'Annuleren',
        'delete' => 'Verwijderen',
        'ok' => 'OK',
    ],
    'dashboard' => [
        'menu_label' => 'Overzicht',
        'widget_label' => 'Widget',
        'widget_width' => 'Breedte',
        'full_width' => 'Volledige breedte',
        'add_widget' => 'Widget toevoegen',
        'widget_inspector_title' => 'Widget configuratie',
        'widget_inspector_description' => 'Configureer de rapportage widget',
        'widget_columns_label' => 'Breedte :columns',
        'widget_columns_description' => 'De widget breedte, een getal tussen 1 en 10.',
        'widget_columns_error' => 'Voer een getal tussen 1 en 10 in als widget breedte.',
        'columns' => '{1} kolom|[2,Inf] kolommen',
        'widget_new_row_label' => 'Forceer nieuwe rij',
        'widget_new_row_description' => 'Plaats de widget in een nieuwe rij.',
        'widget_title_label' => 'Widget titel',
        'widget_title_error' => 'Een widget title is verplicht.',
        'status' => [
            'widget_title_default' => 'Systeem status',
            'online' => 'online',
            'update_available' => '{0} updates beschikbaar!|{1} update beschikbaar!|[2,Inf] updates beschikbaar!',
        ]
    ],
    'user' => [
        'name' => 'Beheerder',
        'menu_label' => 'Beheerders',
        'menu_description' => 'Beheer beheerders, groepen en rechten.',
        'list_title' => 'Beheer beheerders',
        'new' => 'Nieuwe beheerder',
        'login' => "Gebruikersnaam",
        'first_name' => "Voornaam",
        'last_name' => "Achternaam",
        'full_name' => "Volledige naam",
        'email' => "E-mailadres",
        'groups' => "Groepen",
        'groups_comment' => "Selecteer de groepen waar deze gebruiker bij hoort.",
        'avatar' => "Avatar",
        'password' => "Wachtwoord",
        'password_confirmation' => "Bevestig wachtwoord",
        'superuser' => "Supergebruiker",
        'superuser_comment' => "Vink deze optie aan om de gebruiker volledige rechten tot het systeem te geven.",
        'send_invite' => 'Stuur uitnodiging per e-mail',
        'send_invite_comment' => 'Vink deze optie aan om de gebruiker een uitnodiging per e-mail te sturen',
        'delete_confirm' => 'Weet je zeker dat je deze beheerder wilt verwijderen?',
        'return' => 'Terug naar het beheerdersoverzicht',
        'allow' => 'Toestaat',
        'inherit' => 'Overerven',
        'deny' => 'Weigeren',
        'group' => [
            'name' => 'Groep',
            'name_field' => 'Naam',
            'menu_label' => 'Groepen',
            'list_title' => 'Beheer groepen',
            'new' => 'Nieuwe beheerdersgroep',
            'delete_confirm' => 'Weet je zeker dat je deze beheerdersgroep wilt verwijderen?',
            'return' => 'Terug naar het groepenoverzicht',
        ],
        'preferences' => [
            'not_authenticated' => 'Er is geen geauthenticeerde gebruiker om gegevens voor te laden of op te slaan.'
        ]
    ],
    'list' => [
        'default_title' => 'Lijst',
        'search_prompt' => 'Zoeken...',
        'no_records' => 'Er zijn geen resultaten gevonden.',
        'missing_model' => 'Geen model opgegeven voor het gedrag (behavior) van de lijst gebruikt in :class.',
        'missing_column' => 'Er zijn geen kolomdefinities voor :columns.',
        'missing_columns' => 'De gebruikte lijst in :class heeft geen kolommen gedefineerd.',
        'missing_definition' => "Het gedrag (behavior) van de lijst bevat geen kolom voor ':field'.",
        'behavior_not_ready' => 'Gedrag (behavior) van de lijst is niet geladen. Controleer of makeLists() in de controller is aangeroepen.',
        'invalid_column_datetime' => "De waarde van kolom ':column' is geen DateTime object, mist er een \$dates referentie in het Model?",
        'pagination' => 'Getoonde resultaten: :from-:to van :total',
        'prev_page' => 'Vorige pagina',
        'next_page' => 'Volgende pagina',
        'loading' => 'Laden...',
        'setup_title' => 'Lijst instellingen',
        'setup_help' => 'Selecteer door middel van vinkjes de kolommen welke je in de lijst wilt zien. Je kunt de volgorde van kolommen veranderen door ze omhoog of omlaag te slepen.',
        'records_per_page' => 'Resultaten per pagina',
        'records_per_page_help' => 'Selecteer het aantal resultaten dat per pagina getoond moet worden. Let op: een hoog getal kan voor prestatieproblemen zorgen.'
    ],
    'fileupload' => [
        'attachment' => 'Bijlage',
        'help' => 'Voeg een titel en omschrijving toe aan deze bijlage.',
        'title_label' => 'Titel',
        'description_label' => 'Omschrijving'
    ],
    'form' => [
        'create_title' => "Nieuwe :name",
        'update_title' => "Bewerk :name",
        'preview_title' => "Bekijk :name",
        'create_success' => ':name is succesvol aangemaakt',
        'update_success' => ':name is succesvol bijgewerkt',
        'delete_success' => ':name is succesvol verwijderd',
        'missing_id' => "Record ID van het formulier is niet opgegeven.",
        'missing_model' => 'Geen model opgegeven voor het gedrag (behavior) van het formulier gebruikt in :class.',
        'missing_definition' => "Het gedrag (behavior) van het formulier bevat geen kolom voor ':field'.",
        'not_found' => 'Het formulier met record ID :id is niet gevonden.',
        'create' => 'Maken',
        'create_and_close' => 'Maken en sluiten',
        'creating' => 'Maken...',
        'save' => 'Opslaan',
        'save_and_close' => 'Opslaan en sluiten',
        'saving' => 'Opslaan...',
        'delete' => 'Verwijderen',
        'deleting' => 'Verwijderen...',
        'undefined_tab' => 'Overig',
        'field_off' => 'Uit',
        'field_on' => 'Aan',
        'add' => 'Toevoegen',
        'apply' => 'Toepassen',
        'cancel' => 'Annuleren',
        'close' => 'Sluiten',
        'ok' => 'OK',
        'or' => 'of',
        'confirm_tab_close' => 'Weet je zeker dat je dit tabblad wilt sluiten? Niet opgeslagen wijzigingen gaan verloren.',
        'behavior_not_ready' => 'Gedrag (behavior) van het formulier is niet geladen. Controleer of initForm() in de controller is aangeroepen.',
        'preview_no_files_message' => 'Bestanden zijn niet geüploadet',
        'select' => 'Selecteer',
        'select_all' => 'alles',
        'select_none' => 'niets',
        'select_placeholder' => 'selecteer',
        'insert_row' => 'Rij invoegen',
        'delete_row' => 'Rij verwijderen'
    ],
    'relation' => [
        'missing_definition' => "Het gedrag (behavior) van de relatie bevat geen kolom voor ':field'.",
        'missing_model' => "Geen model opgegeven voor het gedrag (behavior) van relatie gebruikt in :class.",
        'invalid_action_single' => "Deze actie kan niet worden uitgevoerd op een enkele (singular) relatie.",
        'invalid_action_multi' => "Deze actie kan niet worden uitgevoerd op meerdere (multiple) relatie.",
        'help'	=> "Klik op een item om toe te voegen",
        'related_data' => "Gerelateerde :name data",
        'add' => "Toevoegen",
        'add_selected' => "Selectie toevoegen",
        'add_a_new' => "Nieuwe :name toevoegen",
        'cancel' => "Annuleer",
        'add_name' => ":name toevoegen",
        'create' => "Maken",
        'create_name' => "Maak :name",
        'update' => "Update",
        'update_name' => "Update :name",
        'remove' => "Verwijder",
        'remove_name' => "Verwijder :name",
        'delete' => "Wissen",
        'delete_name' => "Wis :name",
        'delete_confirm' => "Weet je het zeker?",
    ],
    'model' => [
        'name' => "Model",
        'not_found' => "Model ':class' met ID :id is niet gevonden",
        'missing_id' => "Record ID van het model is niet opgegeven.",
        'missing_relation' => "Model ':class' bevat geen definitie voor ':relation'.",
        'invalid_class' => "Model :model gebruikt in :class is ongeldig. Het moet de \Model klasse erven (inherit).",
        'mass_assignment_failed' => "Massa toewijzing voor Model attribute ':attribute' mislukt.",
    ],
    'warnings' => [
        'tips' => 'Systeem configuratie tips',
        'tips_description' => 'Er zijn problemen gevonden waar je aandacht aan moet besteden om uw systeem goed te configureren.',
        'permissions'  => 'De map :name of de submapen zijn niet schrijfbaar voor PHP. Zet de bijhorende rechten voor de webserver in deze map.',
        'extension' => 'De PHP extensie :name is niet geïnstalleerd. Installeer deze bibliotheek en activeer de extensie.'
    ],
    'editor' => [
        'menu_label' => 'Bewerker instellingen',
        'menu_description' => 'Beheer bewerker instellingen, zoals lettergrootte en kleurschema.',
        'font_size' => 'Lettergrootte',
        'tab_size' => 'Tab grootte',
        'use_hard_tabs' => 'Inspringen met tabs',
        'code_folding' => 'Code invouwing',
        'word_wrap' => 'Tekstterugloop',
        'highlight_active_line' => 'Markeer actieve lijnen',
        'show_invisibles' => 'Toon verborgen karakters',
        'show_gutter' => 'Toon "goot"',
        'theme' => 'Kleurschema',
    ],
    'tooltips' => [
        'preview_website' => 'Voorvertoning website'
    ],
    'mysettings' => [
        'menu_label' => 'Mijn instellingen',
        'menu_description' => 'Instellingen gerelateerd aan jouw beheeraccount',
    ],
    'myaccount' => [
        'menu_label' => 'Mijn account',
        'menu_description' => 'Werk accountinstellingen zoals naam, e-mailadres en wachtwoord bij.',
        'menu_keywords' => 'security login'
    ],
    'backend_preferences' => [
        'menu_label' => 'CMS voorkeuren',
        'menu_description' => 'Beheer taalvoorkeur en de weergave van het CMS.',
        'locale' => 'Taal',
        'locale_comment' => 'Selecteer jouw gewenste taal.',
    ],
    'access_log' => [
        'hint' => 'Dit logboek toont een lijst met succesvolle inlogpogingen door beheerders. Registraties blijven :days dagen bewaard..',
        'menu_label' => 'Toegangslogboek',
        'menu_description' => 'Bekijk een lijst met succesvolle inlogpogingen van gebruikers.',
        'created_at' => 'Datum & tijd',
        'login' => 'Gebruikersnaam',
        'ip_address' => 'IP-adres',
        'first_name' => 'Voornaam',
        'last_name' => 'Achternaam',
        'email' => 'E-mailadres',
    ],
    'layout' => [
        'direction' => 'ltr'
    ]
];
