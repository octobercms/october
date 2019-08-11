<?php

return [
    'auth' => [
        'title' => 'Beheeromgeving',
        'invalid_login' => 'De ingevoerde gegevens leveren geen resultaat. Controleer je invoer en probeer het opnieuw.'
    ],
    'aria-label' => [
        'footer'        => 'voettekst navigatie',
        'side_panel'    => 'zijpaneel',
        'breadcrumb'    => 'broodkruimel spoor',
        'main_content'  => 'hoofdgebied',
        'tabs'          => 'klikt op',
        'sidebar_menu'  => 'Zijbalkmenu'
    ],
    'field' => [
        'invalid_type' => 'Ongeldig type veld: :type.',
        'options_method_invalid_model' => "Het attribuut ':field' levert geen geldig model op. Probeer de opties methode expliciet te specifieren voor modelklasse :model.",
        'options_method_not_exists' => 'De modelklasse :model moet de methode :method() definiëren met daarin opties voor het veld ":field".',
        'colors_method_not_exists' => 'De modelklasse :model moet de methode :method() definiëren met daarin html HEX kleurcodes voor het veld ":field".',
    ],
    'widget' => [
        'not_registered' => "Een widget met klassenaam ':name' is niet geregistreerd",
        'not_bound' => "Een widget met klassenaam ':name' is niet gekoppeld aan de controller",
    ],
    'page' => [
        'untitled' => 'Naamloos',
        '404' => [
            'label'     => 'Sorry, we kunnen deze pagina niet meer vinden.',
            'help'      => "We hebben ons best gedaan, maar het lijkt erop dat deze pagina niet (meer) bestaat of misschien verhuisd is.",
            'back_link' => 'Terug naar de homepagina.',
        ],
        'access_denied' => [
            'label' => 'Toegang geweigerd',
            'help' => 'Je hebt niet de benodigde rechten om deze pagina te bekijken.',
            'cms_link' => 'Terug naar CMS',
        ],
        'no_database' => [
            'label' => 'Database niet gevonden',
            'help' => 'Een database is nodig om toegang te krijgen tot de back-end. Controleer of de database juist is geconfigureerd en probeer het opnieuw.',
            'cms_link' => 'Terug naar homepagina',
        ],
        'invalid_token' => [
            'label' => 'Ongeldig token',
        ],
    ],
    'partial' => [
        'not_found_name' => "Het sjabloon (partial) ':name' is niet gevonden.",
        'invalid_name' => 'Ongeldige sjabloon (partial) naam: :name.',
    ],
    'ajax_handler' => [
        'invalid_name' => 'Ongeldige AJAX verzoek met naam: :name.',
        'not_found' => "Het AJAX verzoek ':name' kon niet worden gevonden."
    ],
    'account' => [
        'signed_in_as' => 'Ingelogd als :full_name',
        'sign_out' => 'Uitloggen',
        'login' => 'Inloggen',
        'reset' => 'Wijzigen',
        'restore' => 'Herstellen',
        'login_placeholder' => 'Gebruikersnaam',
        'password_placeholder' => 'Wachtwoord',
        'remember_me' => 'Blijf ingelogd',
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
        'manage_widgets' => 'Beheer widgets',
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
        'reset_layout' => 'Layout resetten',
        'reset_layout_confirm' => 'Layout resetten naar standaard?',
        'reset_layout_success' => 'Layout is ge-reset',
        'make_default' => 'Als standaard instellen',
        'make_default_confirm' => 'Huidige layout als standaard instellen?',
        'make_default_success' => 'Huidige layout is nu als standaard ingesteld.',
        'collapse_all' => 'Alles inklappen',
        'expand_all' => 'Alles uitklappen',
        'status' => [
            'widget_title_default' => 'Systeemstatus',
            'update_available' => '{0} updates beschikbaar!|{1} update beschikbaar!|[2,Inf] updates beschikbaar!',
            'updates_pending' => 'Er staan updates klaar',
            'updates_nil' => 'De software is up-to-date',
            'updates_link' => 'Updates installeren',
            'warnings_pending' => 'Sommige problemen hebben aandacht nodig',
            'warnings_nil' => 'Alles OK',
            'warnings_link' => 'Weergeven',
            'core_build' => 'Systeem build',
            'event_log' => 'Gebeurtenis logboek',
            'request_log' => 'Verzoek logboek',
            'app_birthday' => 'Online sinds',
        ],
        'welcome' => [
            'widget_title_default' => 'Welkom',
            'welcome_back_name' => 'Welkom terug bij :app, :name.',
            'welcome_to_name' => 'Welkom bij :app, :name.',
            'first_sign_in' => 'Dit is de eerste keer dat je bent ingelogd.',
            'last_sign_in' => 'Je laatste login was',
            'view_access_logs' => 'Toon toegangslogboek',
            'nice_message' => 'Een fijne dag!',
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
        'role_field' => 'Rol',
        'role_comment' => 'Rollen definiëren gebruikerspermissies die overschreven kunnen worden op gebruikersniveau (zie tabblad Rechten).',
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
        'activated' => 'Geactiveerd',
        'last_login' => 'Laatste login',
        'created_at' => 'Aangemaakt op',
        'updated_at' => 'Gewijzigd op',
        'deleted_at' => 'Verwijderd op',
        'show_deleted' => 'Toon verwijderd',
        'group' => [
            'name' => 'Groep',
            'name_field' => 'Naam',
            'name_comment' => 'De naam die wordt weergegeven in de groepenlijst bij het aanmaken of bewerken van een beheerder.',
            'description_field' => 'Omschrijving',
            'is_new_user_default_field_label' => 'Standaard groep',
            'is_new_user_default_field_comment' => 'Voeg nieuwe beheerders automatisch toe aan deze groep.',
            'code_field' => 'Code',
            'code_comment' => 'Voer een unieke code in als je deze met de API wilt gebruiken.',
            'menu_label' => 'Groepen',
            'list_title' => 'Beheer groepen',
            'new' => 'Nieuwe beheerdersgroep',
            'delete_confirm' => 'Weet je zeker dat je deze beheerdersgroep wilt verwijderen?',
            'return' => 'Terug naar het groepenoverzicht',
            'users_count' => 'Gebruikers',
        ],
        'role' => [
            'name' => 'Rol',
            'name_field' => 'Naam',
            'name_comment' => 'De naam wordt weergegeven in de rollenlijst in het Beheerders formulier.',
            'description_field' => 'Omschrijving',
            'code_field' => 'Code',
            'code_comment' => 'Voer een unieke code in als je deze met de API wilt gebruiken.',
            'menu_label' => 'Beheer rollen',
            'list_title' => 'Beheer rollen',
            'new' => 'Nieuwe rol',
            'delete_confirm' => 'Verwijder deze beheerdersrol?',
            'return' => 'Terug naar het rollenoverzicht',
            'users_count' => 'Gebruikers',
        ],
        'preferences' => [
            'not_authenticated' => 'Er is geen geauthenticeerde gebruiker om gegevens voor te laden of op te slaan.',
        ],
        'trashed_hint_title' => 'Dit account is verwijderd',
        'trashed_hint_desc' => 'Dit account is verwijderd en kan dus niet meer op ingelogd worden. Klik op het icoontje rechts onderin als je het account te herstellen.',
    ],
    'list' => [
        'default_title' => 'Lijst',
        'search_prompt' => 'Zoeken...',
        'no_records' => 'Er zijn geen resultaten gevonden.',
        'missing_model' => 'Geen model opgegeven voor het gedrag (behavior) van de lijst gebruikt in :class.',
        'missing_column' => 'Er zijn geen kolomdefinities voor :columns.',
        'missing_columns' => 'De gebruikte lijst in :class heeft geen kolommen gedefineerd.',
        'missing_definition' => "De behavior van de lijst bevat geen kolom voor ':field'.",
        'missing_parent_definition' => "De lijst behavior bevat geen definitie voor ':definition'.",
        'behavior_not_ready' => 'Behavior van de lijst is niet geladen. Controleer of makeLists() in de controller is aangeroepen.',
        'invalid_column_datetime' => "De waarde van kolom ':column' is geen DateTime object, mist er een \$dates referentie in het Model?",
        'pagination' => 'Getoonde resultaten: :from-:to van :total',
        'first_page' => 'Eerste pagina',
        'last_page' => 'Laatste pagina',
        'prev_page' => 'Vorige pagina',
        'next_page' => 'Volgende pagina',
        'refresh' => 'Vernieuwen',
        'updating' => 'Bijwerken...',
        'loading' => 'Laden...',
        'setup_title' => 'Lijst instellingen',
        'setup_help' => 'Selecteer door middel van vinkjes de kolommen welke je in de lijst wilt zien. Je kunt de volgorde van kolommen veranderen door ze omhoog of omlaag te slepen.',
        'records_per_page' => 'Resultaten per pagina',
        'records_per_page_help' => 'Selecteer het aantal resultaten dat per pagina getoond moet worden. Let op: een hoog getal kan voor prestatieproblemen zorgen.',
        'check' => 'Ingeschakeld',
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
    'repeater' => [
        'min_items_failed' => ':name vereist minimaal :min items, er zijn :items opgegeven',
        'max_items_failed' => ':name vereist maximaal :max items, er zijn :items opgegeven',
    ],
    'form' => [
        'create_title' => 'Nieuwe :name',
        'update_title' => 'Bewerk :name',
        'preview_title' => 'Bekijk :name',
        'create_success' => ':name is succesvol aangemaakt',
        'update_success' => ':name is succesvol bijgewerkt',
        'delete_success' => ':name is succesvol verwijderd',
        'restore_success' => ':name is succesvol hersteld',
        'reset_success' => 'Resetten voltooid',
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
        'restore' => 'Herstellen',
        'restoring' => 'Herstellen...',
        'confirm_restore' => 'Weet je zeker dat je dit record wil herstellen?',
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
        'preview_no_media_message' => 'Er zijn geen media geselecteerd.',
        'preview_no_record_message' => 'Er zijn geen records geselecteerd.',
        'select' => 'Selecteer',
        'select_all' => 'alles',
        'select_none' => 'niets',
        'select_placeholder' => 'selecteer',
        'insert_row' => 'Rij invoegen',
        'insert_row_below' => 'Rij onder invoegen',
        'delete_row' => 'Rij verwijderen',
        'concurrency_file_changed_title' => 'Bestand is gewijzigd',
        'concurrency_file_changed_description' => 'Heb bestand wat je aan het bewerken bent is gewijzigd door een andere gebruiker. Je kunt het bestand opnieuw inladen (en wijzigingen verliezen) of het bestand te overschrijven.',
        'return_to_list' => 'Terug naar lijst',
    ],
    'recordfinder' => [
        'find_record' => 'Zoek record',
        'invalid_model_class' => 'Het opgegeven model klasse ":modelClass" voor de recordfinder is ongeldig',
        'cancel' => 'Annuleren',
    ],
    'pagelist' => [
        'page_link' => 'Pagina link',
        'select_page' => 'Selecteer een pagina...'
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
        'permissions' => 'De map :name of de submappen zijn niet schrijfbaar voor PHP. Zet de bijhorende rechten voor de webserver in deze map.',
        'extension' => 'De PHP extensie :name is niet geïnstalleerd. Installeer deze bibliotheek en activeer de extensie.',
        'plugin_missing' => 'De plugin :name is een afhankelijkheid maar is niet geïnstalleerd. Installeer deze plugin a.u.b.',
    ],
    'editor' => [
        'menu_label' => 'Editor instellingen',
        'menu_description' => 'Beheer editor instellingen, zoals lettergrootte en kleurschema.',
        'font_size' => 'Lettergrootte',
        'tab_size' => 'Tab grootte',
        'use_hard_tabs' => 'Inspringen met tabs',
        'code_folding' => 'Code invouwing',
        'code_folding_begin' => 'Markeer begin',
        'code_folding_begin_end' => 'Markeer begin en einde',
        'autocompletion' => 'Automatisch aanvullen',
        'word_wrap' => 'Tekstterugloop',
        'highlight_active_line' => 'Markeer actieve lijnen',
        'auto_closing' => 'Sluit tags en speciale karakters automatisch',
        'show_invisibles' => 'Toon verborgen karakters',
        'show_gutter' => 'Toon "goot"',
        'basic_autocompletion' => 'Basis automatische aanvulling (Ctrl + Spatie)',
        'live_autocompletion' => 'Live automatische aanvulling',
        'enable_snippets' => 'Inschakelen van code snippets (Tab)',
        'display_indent_guides' => 'Toon inspringing hulp',
        'show_print_margin' => 'Toon printmarges',
        'mode_off' => 'Uit',
        'mode_fluid' => 'Vloeiend',
        '40_characters' => '40 karakters',
        '80_characters' => '80 karakters',
        'theme' => 'Kleurschema',
        'markup_styles' => 'Opmaakstijlen',
        'custom_styles' => 'Eigen stylesheet',
        'custom styles_comment' => 'Eigen stijlen die in de HTML-editor gebruikt moeten worden.',
        'markup_classes' => 'Opmaak classes',
        'paragraph' => 'Paragraaf',
        'link' => 'Link',
        'table' => 'Tabel',
        'table_cell' => 'Tabel cel',
        'image' => 'Afbeelding',
        'label' => 'Label',
        'class_name' => 'Class naam',
        'markup_tags' => 'Opmaak HTML-tags',
        'allowed_empty_tags' => 'Toegestane lege HTML-tags',
        'allowed_empty_tags_comment' => 'Een lijst van HTML-tags die niet worden verwijderd als ze leeg zijn.',
        'allowed_tags' => 'Toegestane HTML-tags',
        'allowed_tags_comment' => 'Een lijst van toegestane HTML-tags.',
        'no_wrap' => 'HTML-tags niet afbreken',
        'no_wrap_comment' => 'Een lijst van tags die niet worden afgebroken.',
        'remove_tags' => 'Te verwijderen HTML-tags',
        'remove_tags_comment' => 'Een lijst van HTML-tags die samen met hun inhoud worden verwijderd.',
        'line_breaker_tags' => 'Line breaker tags',
        'line_breaker_tags_comment' => 'Een lijst van HTML-tags waartussen een line breaker element wordt geplaatst.',
        'toolbar_buttons' => 'Toolbar knoppen',
        'toolbar_buttons_comment' => 'De toolbar knoppen die standaard getoond worden door de Rich Editor. [fullscreen, bold, italic, underline, strikeThrough, subscript, superscript, fontFamily, fontSize, |, color, emoticons, inlineStyle, paragraphStyle, |, paragraphFormat, align, formatOL, formatUL, outdent, indent, quote, insertHR, -, insertLink, insertImage, insertVideo, insertAudio, insertFile, insertTable, undo, redo, clearFormatting, selectAll, html]',
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
        'favicon' => 'Favicon',
        'favicon_description' => 'Upload een favicon om te gebruiken in de beheeromgeving',
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
        'navigation' => 'Navigatie',
        'menu_mode' => 'Menustijl',
        'menu_mode_inline' => 'Inline-mode',
        'menu_mode_tile' => 'Tegels',
        'menu_mode_collapsed' => 'Ingeklapt',
    ],
    'backend_preferences' => [
        'menu_label' => 'CMS voorkeuren',
        'menu_description' => 'Beheer taalvoorkeur en de weergave van het CMS.',
        'region' => 'Regio',
        'code_editor' => 'Code editor',
        'timezone' => 'Tijdzone',
        'timezone_comment' => 'Weer te geven datums overal aanpassen naar deze tijdzone.',
        'locale' => 'Taal',
        'locale_comment' => 'Selecteer jouw gewenste taal.',
    ],
    'access_log' => [
        'hint' => 'Dit logboek toont een lijst met succesvolle inlogpogingen door beheerders. Registraties blijven :days dagen bewaard.',
        'menu_label' => 'Toegangslogboek',
        'menu_description' => 'Bekijk een lijst met succesvolle inlogpogingen van gebruikers.',
        'id' => 'ID',
        'created_at' => 'Datum & tijd',
        'type' => 'Type',
        'login' => 'Gebruikersnaam',
        'ip_address' => 'IP-adres',
        'first_name' => 'Voornaam',
        'last_name' => 'Achternaam',
        'email' => 'E-mailadres',
    ],
    'filter' => [
        'all' => 'alle',
        'options_method_not_exists' => "De model class :model moet de methode :method() gedefinieerd hebben die de opties voor de filter ':filter' teruggeeft.",
        'date_all' => 'alle periodes',
        'number_all' => 'alle nummers',
    ],
    'import_export' => [
        'upload_csv_file' => '1. Upload een CSV bestand',
        'import_file' => 'Importeer bestand',
        'row' => 'Rij :row',
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
        'file_not_found_error' => 'Bestand niet gevonden',
        'empty_error' => 'Er was geen data beschikbaar om te exporteren',
        'empty_import_columns_error' => 'Selecteer een aantal kolommen om te importeren.',
        'match_some_column_error' => 'Match eerst een aantal kolommen.',
        'required_match_column_error' => 'Specifieer een match voor het verplicht veld :label.',
        'empty_export_columns_error' => 'Selecteer een aantal kolommen om te exporteren.',
        'behavior_missing_uselist_error' => 'Je moet de controller behavior ListController implementeren met de export "useList" optie ingeschakeld.',
        'missing_model_class_error' => 'Specifieer de `modelClass` eigenschap voor type :type',
        'missing_column_id_error' => 'Kolom ID mist',
        'unknown_column_error' => 'Onbekende kolom',
        'encoding_not_supported_error' => 'De codering van bronbestand wordt niet herkend. Selecteer de juiste bestandscodering om het bestand te importeren.',
        'encoding_format' => 'Bestandscodering',
        'encodings' => [
            'utf_8' => 'UTF-8',
            'us_ascii' => 'US-ASCII',
            'iso_8859_1' => 'ISO-8859-1 (Latin-1, Western European)',
            'iso_8859_2' => 'ISO-8859-2 (Latin-2, Central European)',
            'iso_8859_3' => 'ISO-8859-3 (Latin-3, South European)',
            'iso_8859_4' => 'ISO-8859-4 (Latin-4, North European)',
            'iso_8859_5' => 'ISO-8859-5 (Latin, Cyrillic)',
            'iso_8859_6' => 'ISO-8859-6 (Latin, Arabic)',
            'iso_8859_7' => 'ISO-8859-7 (Latin, Greek)',
            'iso_8859_8' => 'ISO-8859-8 (Latin, Hebrew)',
            'iso_8859_0' => 'ISO-8859-9 (Latin-5, Turkish)',
            'iso_8859_10' => 'ISO-8859-10 (Latin-6, Nordic)',
            'iso_8859_11' => 'ISO-8859-11 (Latin, Thai)',
            'iso_8859_13' => 'ISO-8859-13 (Latin-7, Baltic Rim)',
            'iso_8859_14' => 'ISO-8859-14 (Latin-8, Celtic)',
            'iso_8859_15' => 'ISO-8859-15 (Latin-9, Western European revision with euro sign)',
            'windows_1251' => 'Windows-1251 (CP1251)',
            'windows_1252' => 'Windows-1252 (CP1252)'
        ]
    ],
    'permissions' => [
        'manage_media' => 'Beheer media',
    ],
    'mediafinder' => [
        'label' => 'Media zoeker',
        'default_prompt' => 'Klik op de %s knop om een media item te vinden',
    ],
    'media' => [
        'menu_label' => 'Media',
        'upload' => 'Uploaden',
        'move' => 'Verplaatsen',
        'delete' => 'Verwijderen',
        'add_folder' => 'Map toevoegen',
        'search' => 'Zoeken',
        'display' => 'Weergeven',
        'filter_everything' => 'Alles',
        'filter_images' => 'Afbeeldingen',
        'filter_video' => 'Video\'s',
        'filter_audio' => 'Audio',
        'filter_documents' => 'Documenten',
        'library' => 'Bibliotheek',
        'size' => 'Grootte',
        'title' => 'Titel',
        'last_modified' => 'Laatst gewijzigd',
        'public_url' => 'URL',
        'click_here' => 'Klik hier',
        'thumbnail_error' => 'Fout opgetreden bij genereren miniatuurweergave.',
        'return_to_parent' => 'Terug naar bovenliggende map',
        'return_to_parent_label' => 'Naar bovenliggende ...',
        'nothing_selected' => 'Er is niets geselecteerd.',
        'multiple_selected' => 'Meerdere items geselecteerd.',
        'uploading_file_num' => 'Uploaden van :number bestanden...',
        'uploading_complete' => 'Uploaden voltooid',
        'uploading_error' => 'Upload mislukt',
        'type_blocked' => 'Het bestandstype is i.v.m. veiligheidsredenen geblokkeerd.',
        'order_by' => 'Sorteer op',
        'direction' => 'Sorteervolgorde',
        'direction_asc' => 'Oplopend',
        'direction_desc' => 'Aflopend',
        'folder' => 'Map',
        'no_files_found' => 'Er zijn geen bestanden gevonden.',
        'delete_empty' => 'Selecteer items om te verwijderen.',
        'delete_confirm' => 'Weet je zeker dat je de geselecteerde items wilt verwijderen?',
        'error_renaming_file' => 'Fout bij wijzigen naam.',
        'new_folder_title' => 'Nieuwe map',
        'folder_name' => 'Mapnaam',
        'error_creating_folder' => 'Fout bij maken van map',
        'folder_or_file_exist' => 'Er bestaat reeds een map of bestand met deze naam.',
        'move_empty' => 'Selecteer de items om te verplaatsen.',
        'move_popup_title' => 'Verplaats bestanden of mappen',
        'move_destination' => 'Doelmap',
        'please_select_move_dest' => 'Selecteer een doelmap.',
        'move_dest_src_match' => 'Selecteer een andere doelmap.',
        'empty_library' => 'De media bibliotheek is leeg. Upload bestanden of maak mappen aan om te beginnen.',
        'insert' => 'Invoegen',
        'crop_and_insert' => 'Uitsnijden & Invoegen',
        'select_single_image' => 'Selecteer één afbeelding.',
        'selection_not_image' => 'Het geselecteerde item is geen afbeelding.',
        'restore' => 'Alle wijzigingen ongedaan maken',
        'resize' => 'Wijzig grootte...',
        'selection_mode_normal' => 'Normaal',
        'selection_mode_fixed_ratio' => 'Vaste ratio',
        'selection_mode_fixed_size' => 'Vaste grootte',
        'height' => 'Hoogte',
        'width' => 'Breedte',
        'selection_mode' => 'Selectie modus',
        'resize_image' => 'Wijzig grootte van afbeelding',
        'image_size' => 'Grootte afbeelding:',
        'selected_size' => 'Geselecteerd:',
    ],
];
