<?php

return [
    'app' => [
        'name' => 'October CMS',
        'tagline' => 'Getting back to basics'
    ],
    'locale' => [
        'en' => 'Engelsk',
        'de' => 'Tysk',
        'es' => 'Spansk',
        'es-ar' => 'Spansk (Argentina)',
        'fa' => 'Persisk',
        'fr' => 'Fransk',
        'hu' => 'Ungarsk',
        'id' => 'Indonesisk',
        'it' => 'Italiensk',
        'ja' => 'Japansk',
        'nl' => 'Nederlandsk',
        'pl' => 'Polsk',
        'pt-br' => 'Brasiliansk Portugisk',
        'ro' => 'Rumensk',
        'ru' => 'Russisk',
        'se' => 'Svensk',
        'sk' => 'Slovak (Slovakia)',
        'tr' => 'Tyrkisk',
        'nb-no' => 'Norsk (Bokmål)',
        'zh-cn' => 'Kinesisk (Kina)'
    ],
    'directory' => [
        'create_fail' => 'Kan ikke opprette mappen: :name'
    ],
    'file' => [
        'create_fail' => 'Kan ikke opprette filen: :name'
    ],
    'combiner' => [
        'not_found' => "Kombinasjonsfilen ':name' ble ikke funnet."
    ],
    'system' => [
        'name' => 'System',
        'menu_label' => 'System',
        'categories' => [
            'cms' => 'CMS',
            'misc' => 'Div.',
            'logs' => 'Logger',
            'mail' => 'E-post',
            'shop' => 'Shop',
            'team' => 'Team',
            'users' => 'Brukere',
            'system' => 'System',
            'social' => 'Sosialt',
            'events' => 'Hendelser',
            'customers' => 'Kunder',
            'my_settings' => 'Mine innstillinger'
        ]
    ],
    'theme' => [
        'unnamed' => 'Navnløst tema',
        'name' => [
            'label' => 'Tema-navn',
            'help' => 'Navngi temaet ved et unikt navn. For eksempel, RainLab.Vanilla'
        ]
    ],
    'themes' => [
        'install' => 'Installer tema',
        'search' => 'søk etter temaer å installere...',
        'installed' => 'Installerte temaer',
        'no_themes' => 'Det er ingen installerte temaer fra markedsplassen.',
        'recommended' => 'Anbefalt',
        'remove_confirm' => 'Vil du virkelig slette dette temaet?'
    ],
    'plugin' => [
        'unnamed' => 'Navnløs plugin',
        'name' => [
            'label' => 'Plugin-navn',
            'help' => 'Navngi pluginen ved et unikt navn. For eksempel, RainLab.Blog'
        ]
    ],
    'plugins' => [
        'manage' => 'Administrer plugins',
        'enable_or_disable' => 'Aktivere eller deaktivere',
        'enable_or_disable_title' => 'Aktivere eller deaktivere plugins',
        'install' => 'Installer plugins',
        'install_products' => 'Installer produkter',
        'search' => 'søk etter plugins å installere...',
        'installed' => 'Installerte plugins',
        'no_plugins' => 'Det er ingen installerte plugins fra markedsplassen.',
        'recommended' => 'Anbefalt',
        'remove' => 'Fjern',
        'refresh' => 'Oppdater',
        'disabled_label' => 'Deaktivert',
        'disabled_help' => 'Deaktiverte plugins blir ignorert av applikasjonen.',
        'selected_amount' => 'Valgte plugins: :amount',
        'remove_confirm' => 'Er du sikker?',
        'remove_success' => 'Plugins har blitt fjernet fra systemet.',
        'refresh_confirm' => 'Er du sikker?',
        'refresh_success' => 'Plugins har blitt oppdatert i systemet.',
        'disable_confirm' => 'Er du sikker?',
        'disable_success' => 'Plugins har blitt deaktivert.',
        'enable_success' => 'Plugins har blitt aktivert.',
        'unknown_plugin' => 'Plugins har blitt fjernet fra systemet.'
    ],
    'project' => [
        'name' => 'Prosjekt',
        'owner_label' => 'Eier',
        'attach' => 'Tilkoble prosjekt',
        'detach' => 'Avkoble prosjekt',
        'none' => 'Ingen',
        'id' => [
            'label' => 'Prosjekt-ID',
            'help' => 'Hvordan finne din prosjekt-ID',
            'missing' => 'Vennligst spesifiser en prosjekt-ID.'
        ],
        'detach_confirm' => 'Vil du virkelig avkoble dette prosjektet?',
        'unbind_success' => 'Prosjektet har blitt avkoblet.'
    ],
    'settings' => [
        'menu_label' => 'Innstillinger',
        'not_found' => 'Fant ikke spesifiserte innstilling.',
        'missing_model' => 'Innstillingssiden mangler en modell-definisjon.',
        'update_success' => 'Innstillingene for :name har blitt lagret.',
        'return' => 'Tilbake til systeminnstillinger',
        'search' => 'Søk'
    ],
    'mail' => [
        'log_file' => 'Loggfil',
        'menu_label' => 'E-postinnstillinger',
        'menu_description' => 'Administrere e-postinnstillinger.',
        'general' => 'Generelt',
        'method' => 'E-postmetode',
        'sender_name' => 'Avsendernavn',
        'sender_email' => 'Avsenderens e-postadresse',
        'php_mail' => 'PHP mail',
        'sendmail' => 'Sendmail',
        'smtp' => 'SMTP',
        'smtp_address' => 'SMTP-adresse',
        'smtp_authorization' => 'SMTP-autentisering kreves',
        'smtp_authorization_comment' => 'Kryss av dersom SMTP-tjeneren krever autentisering.',
        'smtp_username' => 'Brukernavn',
        'smtp_password' => 'Passord',
        'smtp_port' => 'SMTP-port',
        'smtp_ssl' => 'SSL-tilkobling påkrevd',
        'sendmail' => 'Sendmail',
        'sendmail_path' => 'Sendmail-sti',
        'sendmail_path_comment' => 'Vennligst oppgi stien til sendmail-programmet.',
        'mailgun' => 'Mailgun',
        'mailgun_domain' => 'Mailgun-domene',
        'mailgun_domain_comment' => 'Vennligst oppgi Mailgun-domenenavnet.',
        'mailgun_secret' => 'Mailgun Secret',
        'mailgun_secret_comment' => 'Oppgi din Mailgun-API-nøkkel.',
        'mandrill' => 'Mandrill',
        'mandrill_secret' => 'Mandrill Secret',
        'mandrill_secret_comment' => 'Enter your Mandrill API key.'
    ],
    'mail_templates' => [
        'menu_label' => 'E-postmaler',
        'menu_description' => 'Modifisere e-postmalene som blir sendt til brukere og administratorer, administrere e-postlayouts.',
        'new_template' => 'Ny mal',
        'new_layout' => 'Ny layout',
        'template' => 'Mal',
        'templates' => 'Maler',
        'menu_layouts_label' => 'E-postlayouts',
        'layout' => 'Layout',
        'layouts' => 'Layouts',
        'name' => 'Navn',
        'name_comment' => 'Unikt navn som tilknyttes denne layouten',
        'code' => 'Code',
        'code_comment' => 'Unik kode som tilknyttes denne malen',
        'subject' => 'Emne',
        'subject_comment' => 'Emnet til e-posten',
        'description' => 'Beskrivelse',
        'content_html' => 'HTML',
        'content_css' => 'CSS',
        'content_text' => 'Klartekst',
        'test_send' => 'Send testmelding',
        'test_success' => 'Testmeldingen har blitt sendt.',
        'return' => 'Tilbake til malliste'
    ],
    'install' => [
        'project_label' => 'Tilkoble prosjekt',
        'plugin_label' => 'Installér',
        'theme_label' => 'Installér tema',
        'missing_plugin_name' => 'Vennligst oppgi pluginens navn.',
        'missing_theme_name' => 'Oppgi tema-navn for å installere.',
        'install_completing' => 'Fullfører installasjonen',
        'install_success' => 'Plugin har blitt installert.'
    ],
    'updates' => [
        'title' => 'Administrer oppdateringer',
        'name' => 'Programvareoppdateringer',
        'menu_label' => 'Oppdateringer',
        'menu_description' => 'Oppdatere systemet, administrer og installere plugins og temaer.',
        'check_label' => 'Se etter oppdateringer',
        'retry_label' => 'Prøv igjen',
        'plugin_name' => 'Navn',
        'plugin_description' => 'Beskrivelse',
        'plugin_version' => 'Versjon',
        'plugin_author' => 'Utgiver',
        'core_build' => 'Nåværende build',
        'core_build_old' => 'Nåværende build :build',
        'core_build_new' => 'Build :build',
        'core_build_new_help' => 'Siste build er tilgjengelig.',
        'core_downloading' => 'Laster ned applikasjonsfiler',
        'core_extracting' => 'Pakker opp applikasjonsfiler',
        'plugins' => 'Plugins',
        'themes' => 'Teamer',
        'disabled' => 'Deaktivert',
        'plugin_downloading' => 'Laster ned plugin: :name',
        'plugin_extracting' => 'Pakker opp plugin: :name',
        'plugin_version_none' => 'Ny plugin',
        'plugin_version_old' => 'Nåværende v:version',
        'plugin_version_new' => 'v:version',
        'theme_label' => 'Tema',
        'theme_new_install' => 'Ny tema-installasjon.',
        'theme_downloading' => 'Laster ned tema: :name',
        'theme_extracting' => 'Pakker opp tema: :name',
        'update_label' => 'Oppdatér programvare',
        'update_completing' => 'Ferdiggjør oppdatering',
        'update_loading' => 'Henter tilgjengelige oppdateringer...',
        'update_success' => 'Oppdatering har fullført.',
        'update_failed_label' => 'Oppdateringen mislyktes',
        'force_label' => 'Tving update',
        'found' => [
            'label' => 'Fant nye oppdateringer!',
            'help' => 'Klikk på Oppdatér programvare for å oppdatere.'
        ],
        'none' => [
            'label' => 'Ingen oppdateringer',
            'help' => 'Ingen nye oppdateringer ble funnet.'
        ]
    ],
    'server' => [
        'connect_error' => 'Kunne ikke koble til serveren.',
        'response_not_found' => 'Oppdateringsserveren ble ikke funnet.',
        'response_invalid' => 'Feilaktig respons fra serveren.',
        'response_empty' => 'Tom respons fra serveren.',
        'file_error' => 'Serveren kunne ikke levere pakken.',
        'file_corrupt' => 'Pakken fra serveren er korrupt.'
    ],
    'behavior' => [
        'missing_property' => 'Klassen :class må definere egenskapen $:property som brukes av :behavior -egenskapen.'
    ],
    'config' => [
        'not_found' => 'Fant ikke konfigurasjonsfilen :file definert for for :location.',
        'required' => "Konfigurasjon brukt i :location må angi verdien ':property'."
    ],
    'zip' => [
        'extract_failed' => "Kunne ikke pakke opp core-fil ':file'."
    ],
    'event_log' => [
        'hint' => 'Denne loggen viser en liste over potensielle feilmeldinger som oppstår i applikasjonen, for eksempel unntak og debugginginformasjon.',
        'menu_label' => 'Hendelseslogg',
        'menu_description' => 'Se systemloggmeldinger med registrert tid og detaljer.',
        'empty_link' => 'Tøm hendelseslogg',
        'empty_loading' => 'Tømmer hendelseslogg...',
        'empty_success' => 'Hendelsesloggen er tømt.',
        'return_link' => 'Tilbake til hendelseslogg',
        'id' => 'ID',
        'id_label' => 'Hendelses-ID',
        'created_at' => 'Tid',
        'message' => 'Melding',
        'level' => 'Nivå'
    ],
    'request_log' => [
        'hint' => 'Denne loggen viser en liste over nettleserforespørsler som kan kreve oppmerksomhet. For eksempel, hvis en bruker besøker en side som ikke eksisterer, vil det bli oppført her med statuskode 404.',
        'menu_label' => 'Forespørselslogg',
        'menu_description' => 'Se feilaktige forespørsler, for eksempel Ikke funnet (404).',
        'empty_link' => 'Tøm forespørselslogg',
        'empty_loading' => 'Tømmer forespørselslogg...',
        'empty_success' => 'Forespørselsloggen er tømt.',
        'return_link' => 'Tilbake til forespørselslogg',
        'id' => 'ID',
        'id_label' => 'Logg-ID',
        'count' => 'Antall',
        'referer' => 'Referers',
        'url' => 'URL',
        'status_code' => 'Status'
    ],
    'permissions' => [
        'name' => 'System',
        'manage_system_settings' => 'Administrer systeminnstillinger',
        'manage_software_updates' => 'Administrer programvareoppdateringer',
        'access_logs' => 'Se systemlogger',
        'manage_mail_templates' => 'Administrer e-postmaler',
        'manage_mail_settings' => 'Administrer e-postinnstillinger',
        'manage_other_administrators' => 'Administrer andre administratorer',
        'view_the_dashboard' => 'Se dashboard',
        'manage_branding' => 'Tilpasse backend'
    ]
];
