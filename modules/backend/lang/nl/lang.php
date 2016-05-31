<?php

return [
    'auth' => [
        'title' => 'Beheeromgeving',
    ],
    'field' => [
        'invalid_type' => 'Ongeldig type veld: :type.',
        'options_method_not_exists' => 'De modelklasse :model moet de methode :method() definiëren met daarin opties voor het veld ":field".',
    ],
    'widget' => [
        'not_registered' => "Een widget met klassenaam ':name' is niet geregistreerd",
        'not_bound' => "Een widget met klassenaam ':name' is niet gekoppeld aan de controller",
    ],
    'page' => [
        'untitled' => 'Naamloos',
        'access_denied' => [
            'label' => 'Toegang geweigerd',
            'help' => 'Je hebt niet de benodigde rechten om deze pagina te bekijken.',
            'cms_link' => 'Terug naar CMS',
        ],
        'invalid_token' => [
            'label' => 'Ongeldig token',
        ],
    ],
    'partial' => [
        'not_found_name' => "Het sjabloon (partial) ':name' is niet gevonden.",
    ],
    'account' => [
        'sign_out' => 'Uitloggen',
        'login' => 'Inloggen',
        'reset' => 'Wissen',
        'restore' => 'Herstellen',
        'login_placeholder' => 'Gebruikersnaam',
        'password_placeholder' => 'Wachtwoord',
        'forgot_password' => 'Wachtwoord vergeten?',
        'enter_email' => 'Vul e-mailadres in',
        'enter_login' => 'Vul gebruikersnaam in',
        'email_placeholder' => 'E-mailadres',
        'enter_new_password' => 'Vul een nieuw wachtwoord in',
        'password_reset' => 'Herstel wachtwoord',
        'restore_success' => 'Een e-mail met instructies om het wachtwoord te herstellen is verzonden naar jouw e-mailadres.',
        'restore_error' => "Een gebruiker met de gebruikersnaam ':login' is niet gevonden",
        'reset_success' => 'Het wachtwoord is succesvol hersteld. Je kunt nu inloggen',
        'reset_error' => 'Ongeldige herstelinformatie aangeboden. Probeer het opnieuw!',
        'reset_fail' => 'Het is niet mogelijk het wachtwoord te herstellen!',
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
        'widget_title_error' => 'Een widget titel is verplicht.',
        'status' => [
            'widget_title_default' => 'Systeemstatus',
            'update_available' => '{0} updates beschikbaar!|{1} update beschikbaar!|[2,Inf] updates beschikbaar!',
        ],
    ],
    'user' => [
        'name' => 'Beheerder',
        'menu_label' => 'Beheerders',
        'menu_description' => 'Beheer beheerders, groepen en rechten.',
        'list_title' => 'Beheer beheerders',
        'new' => 'Nieuwe beheerder',
        'login' => 'Gebruikersnaam',
        'first_name' => 'Voornaam',
        'last_name' => 'Achternaam',
        'full_name' => 'Volledige naam',
        'email' => 'E-mailadres',
        'groups' => 'Groepen',
        'groups_comment' => 'Selecteer de groepen waar deze gebruiker bij hoort.',
        'avatar' => 'Avatar',
        'password' => 'Wachtwoord',
        'password_confirmation' => 'Bevestig wachtwoord',
        'permissions' => 'Rechten',
        'account' => 'Account',
        'superuser' => 'Supergebruiker',
        'superuser_comment' => 'Vink deze optie aan om de gebruiker volledige rechten tot het systeem te geven.',
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
            'description_field' => 'Omschrijving',
            'is_new_user_default_field' => 'Voeg nieuwe beheerders automatisch toe aan deze groep.',
            'code_field' => 'Code',
            'code_comment' => 'Voer een unieke code in als je deze met de API wilt gebruiken.',
            'menu_label' => 'Groepen',
            'list_title' => 'Beheer groepen',
            'new' => 'Nieuwe beheerdersgroep',
            'delete_confirm' => 'Weet je zeker dat je deze beheerdersgroep wilt verwijderen?',
            'return' => 'Terug naar het groepenoverzicht',
            'users_count' => 'Gebruikers',
        ],
        'preferences' => [
            'not_authenticated' => 'Er is geen geauthenticeerde gebruiker om gegevens voor te laden of op te slaan.',
        ],
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
        'refresh' => 'Vernieuwen',
        'updating' => 'Bijwerken...',
        'loading' => 'Laden...',
        'setup_title' => 'Lijst instellingen',
        'setup_help' => 'Selecteer door middel van vinkjes de kolommen welke je in de lijst wilt zien. Je kunt de volgorde van kolommen veranderen door ze omhoog of omlaag te slepen.',
        'records_per_page' => 'Resultaten per pagina',
        'records_per_page_help' => 'Selecteer het aantal resultaten dat per pagina getoond moet worden. Let op: een hoog getal kan voor prestatieproblemen zorgen.',
        'delete_selected' => 'Verwijder geselecteerde',
        'delete_selected_empty' => 'Geen geselecteerde records om te verwijderen.',
        'delete_selected_confirm' => 'Verwijder geselecteerde records?',
        'delete_selected_success' => 'De geselecteerde records zijn succesvol verwijderd.',
        'column_switch_true' => 'Ja',
        'column_switch_false' => 'Nee',
    ],
    'fileupload' => [
        'attachment' => 'Bijlage',
        'help' => 'Voeg een titel en omschrijving toe aan deze bijlage.',
        'title_label' => 'Titel',
        'description_label' => 'Omschrijving',
        'default_prompt' => 'Klik op %s of sleep hier een bestand naar toe om te uploaden',
        'attachment_url' => 'Bijlage URL',
        'upload_file' => 'Upload bestand',
        'upload_error' => 'Upload fout',
        'remove_confirm' => 'Weet je het zeker?',
        'remove_file' => 'Verwijder bestand',
    ],
    'form' => [
        'create_title' => 'Nieuwe :name',
        'update_title' => 'Bewerk :name',
        'preview_title' => 'Bekijk :name',
        'create_success' => ':name is succesvol aangemaakt',
        'update_success' => ':name is succesvol bijgewerkt',
        'delete_success' => ':name is succesvol verwijderd',
        'missing_id' => 'Record ID van het formulier is niet opgegeven.',
        'missing_model' => 'Geen model opgegeven voor het gedrag (behavior) van het formulier gebruikt in :class.',
        'missing_definition' => "Het gedrag (behavior) van het formulier bevat geen kolom voor ':field'.",
        'not_found' => 'Het formulier met record ID :id is niet gevonden.',
        'action_confirm' => 'Weet je het zeker?',
        'create' => 'Maken',
        'create_and_close' => 'Maken en sluiten',
        'creating' => 'Maken...',
        'creating_name' => ':name maken...',
        'save' => 'Opslaan',
        'save_and_close' => 'Opslaan en sluiten',
        'saving' => 'Opslaan...',
        'saving_name' => ':name opslaan...',
        'delete' => 'Verwijderen',
        'deleting' => 'Verwijderen...',
        'confirm_delete' => 'Weet je zeker dat je dit record wilt verwijderen?',
        'confirm_delete_multiple' => 'Weet je zeker dat je de geselecteerde records wilt verwijderen?',
        'deleting_name' => ':name verwijderen...',
        'reset_default' => 'Terug naar standaard instellingen',
        'resetting' => 'Bezig met terugzetten',
        'resetting_name' => ':name terugzetten',
        'undefined_tab' => 'Overig',
        'field_off' => 'Uit',
        'field_on' => 'Aan',
        'add' => 'Toevoegen',
        'apply' => 'Toepassen',
        'cancel' => 'Annuleren',
        'close' => 'Sluiten',
        'confirm' => 'Bevestigen',
        'reload' => 'Herladen',
        'complete' => 'Voltooid',
        'ok' => 'OK',
        'or' => 'of',
        'confirm_tab_close' => 'Weet je zeker dat je dit tabblad wilt sluiten? Niet opgeslagen wijzigingen gaan verloren.',
        'behavior_not_ready' => 'Gedrag (behavior) van het formulier is niet geladen. Controleer of initForm() in de controller is aangeroepen.',
        'preview_no_files_message' => 'Bestanden zijn niet geüpload.',
        'preview_no_record_message' => 'Er zijn geen records geselecteerd.',
        'select' => 'Selecteer',
        'select_all' => 'alles',
        'select_none' => 'niets',
        'select_placeholder' => 'selecteer',
        'insert_row' => 'Rij invoegen',
        'insert_row_below' => 'Rij onder invoegen',
        'delete_row' => 'Rij verwijderen',
        'concurrency_file_changed_title' => 'Bestand is gewijzigd',
        'concurrency_file_changed_description' => 'Heb bestand wat je aan het bewerken bent is gewijzigd door een andere gebruiker. Je kan het bestand opnieuw inladen (en wijzigingen verliezen) of het bestand te overschrijven.',
        'return_to_list' => 'Terug naar lijst',
    ],
    'recordfinder' => [
        'find_record' => 'Zoek record',
    ],
    'relation' => [
        'missing_config' => "Het gedrag (behavior) van deze relatie bevat geen instellingen voor ':config'.",
        'missing_definition' => "Het gedrag (behavior) van de relatie bevat geen kolom voor ':field'.",
        'missing_model' => 'Geen model opgegeven voor het gedrag (behavior) van relatie gebruikt in :class.',
        'invalid_action_single' => 'Deze actie kan niet worden uitgevoerd op een enkele (singular) relatie.',
        'invalid_action_multi' => 'Deze actie kan niet worden uitgevoerd op meerdere (multiple) relatie.',
        'help' => 'Klik op een item om toe te voegen',
        'related_data' => 'Gerelateerde :name data',
        'add' => 'Toevoegen',
        'add_selected' => 'Selectie toevoegen',
        'add_a_new' => 'Nieuwe :name toevoegen',
        'link_selected' => 'Koppel geselecteerde',
        'link_a_new' => 'Koppel een nieuwe :name',
        'cancel' => 'Annuleer',
        'close' => 'Sluiten',
        'add_name' => ':name toevoegen',
        'create' => 'Maken',
        'create_name' => 'Maak :name',
        'update' => 'Wijzigen',
        'update_name' => 'Wijzig :name',
        'preview' => 'Voorbeeldweergave',
        'preview_name' => 'Voorbeeldweergave :name',
        'remove' => 'Verwijder',
        'remove_name' => 'Verwijder :name',
        'delete' => 'Wissen',
        'delete_name' => 'Wis :name',
        'delete_confirm' => 'Weet je het zeker?',
        'link' => 'Koppel',
        'link_name' => 'Koppel :name',
        'unlink' => 'Ontkoppel',
        'unlink_name' => 'Ontkoppel :name',
        'unlink_confirm' => 'Weet je het zeker?',
    ],
    'reorder' => [
        'default_title' => 'Rangschik records',
        'no_records' => 'Er zijn geen records beschikbaar om te rangschikken.',
    ],
    'model' => [
        'name' => 'Model',
        'not_found' => "Model ':class' met ID :id is niet gevonden",
        'missing_id' => 'Record ID van het model is niet opgegeven.',
        'missing_relation' => "Model ':class' bevat geen definitie voor ':relation'.",
        'missing_method' => "Model ':class' bevat geen ':method' methode.",
        'invalid_class' => 'Model :model gebruikt in :class is ongeldig. Het moet van de \Model klasse erven (inherit).',
        'mass_assignment_failed' => "Massa toewijzing voor Model attribute ':attribute' mislukt.",
    ],
    'warnings' => [
        'tips' => 'Systeem configuratie tips',
        'tips_description' => 'Er zijn problemen gevonden waar je aandacht aan moet besteden om uw systeem goed te configureren.',
        'permissions' => 'De map :name of de submapen zijn niet schrijfbaar voor PHP. Zet de bijhorende rechten voor de webserver in deze map.',
        'extension' => 'De PHP extensie :name is niet geïnstalleerd. Installeer deze bibliotheek en activeer de extensie.',
    ],
    'editor' => [
        'menu_label' => 'Editor instellingen',
        'menu_description' => 'Beheer editor instellingen, zoals lettergrootte en kleurschema.',
        'font_size' => 'Lettergrootte',
        'tab_size' => 'Tab grootte',
        'use_hard_tabs' => 'Inspringen met tabs',
        'code_folding' => 'Code invouwing',
        'word_wrap' => 'Tekstterugloop',
        'highlight_active_line' => 'Markeer actieve lijnen',
        'auto_closing' => 'Sluit tags en speciale karakters automatisch',
        'show_invisibles' => 'Toon verborgen karakters',
        'show_gutter' => 'Toon "goot"',
        'theme' => 'Kleurschema',
    ],
    'tooltips' => [
        'preview_website' => 'Voorvertoning website',
    ],
    'mysettings' => [
        'menu_label' => 'Mijn instellingen',
        'menu_description' => 'Instellingen gerelateerd aan jouw beheeraccount',
    ],
    'myaccount' => [
        'menu_label' => 'Mijn account',
        'menu_description' => 'Werk accountinstellingen zoals naam, e-mailadres en wachtwoord bij.',
        'menu_keywords' => 'security login',
    ],
    'branding' => [
        'menu_label' => 'Aanpassen back-end',
        'menu_description' => 'Pas de beheeromgeving aan zoals de naam, kleuren en logo.',
        'brand' => 'Uitstraling',
        'logo' => 'Logo',
        'logo_description' => 'Upload een logo om te gebruiken in de beheeromgeving.',
        'app_name' => 'Applicatie naam',
        'app_name_description' => 'Deze naam wordt weergegeven bij de titel van de beheeromgeving.',
        'app_tagline' => 'Applicatie slogan',
        'app_tagline_description' => 'Deze slogan wordt weergegeven in het aanmeldvenster van de beheeromgeving.',
        'colors' => 'Kleuren',
        'primary_color' => 'Primair color',
        'secondary_color' => 'Secundair color',
        'accent_color' => 'Accent color',
        'styles' => 'Stijlen',
        'custom_stylesheet' => 'Aangepaste stylesheet',
    ],
    'backend_preferences' => [
        'menu_label' => 'CMS voorkeuren',
        'menu_description' => 'Beheer taalvoorkeur en de weergave van het CMS.',
        'locale' => 'Taal',
        'locale_comment' => 'Selecteer jouw gewenste taal.',
    ],
    'access_log' => [
        'hint' => 'Dit logboek toont een lijst met succesvolle inlogpogingen door beheerders. Registraties blijven :days dagen bewaard.',
        'menu_label' => 'Toegangslogboek',
        'menu_description' => 'Bekijk een lijst met succesvolle inlogpogingen van gebruikers.',
        'created_at' => 'Datum & tijd',
        'login' => 'Gebruikersnaam',
        'ip_address' => 'IP-adres',
        'first_name' => 'Voornaam',
        'last_name' => 'Achternaam',
        'email' => 'E-mailadres',
    ],
    'filter' => [
        'all' => 'alle',
    ],
    'import_export' => [
        'upload_csv_file' => '1. Upload een CSV bestand',
        'import_file' => 'Importeer bestand',
        'first_row_contains_titles' => 'De eerste regel bevat kolomtitels',
        'first_row_contains_titles_desc' => 'Vink aan als de eerste regel kolomtitels bevat die gebruikt moeten worden.',
        'match_columns' => '2. Vergelijk de kolommen met de database velden',
        'file_columns' => 'Bestand kolommen',
        'database_fields' => 'Database velden',
        'set_import_options' => '3. Importeer opties',
        'export_output_format' => '1. Export uitvoerformaat',
        'file_format' => 'Bestandsformaat',
        'standard_format' => 'Standaard formaat',
        'custom_format' => 'Aangepast formaat',
        'delimiter_char' => 'Scheidingsteken',
        'enclosure_char' => 'Tekstscheidingsteken',
        'escape_char' => 'Escape karakter',
        'select_columns' => '2. Selecteer kolommen om te exporteren',
        'column' => 'Kolom',
        'columns' => 'Kolommen',
        'set_export_options' => '3. Exporteer opties',
        'show_ignored_columns' => 'Toon genegeerde kolommen',
        'auto_match_columns' => 'Automatisch matchen van kolommen',
        'created' => 'Aangemaakt',
        'updated' => 'Bijgewerkt',
        'skipped' => 'Overgeslagen',
        'warnings' => 'Waarschuwingen',
        'errors' => 'Fouten',
        'skipped_rows' => 'Overgeslagen rijen',
        'import_progress' => 'Voortgang importeren',
        'processing' => 'Bezig met verwerken',
        'import_error' => 'Importeer fout',
        'upload_valid_csv' => 'Upload een geldig CSV bestand.',
        'drop_column_here' => 'Sleep kolom hierheen...',
        'ignore_this_column' => 'Negeer deze kolom',
        'processing_successful_line1' => 'Bestandsexport is succesvol voltooid!',
        'processing_successful_line2' => 'De browser zal je direct doorsturen naar de download.',
        'export_progress' => 'Voortgang exporteren',
        'export_error' => 'Fout bij exporteren',
        'column_preview' => 'Kolom voorbeeldweergave',
    ],
];
