<?php

return [
    'app' => [
        'name' => 'October CMS',
        'tagline' => 'Getting back to basics'
    ],
    'locale' => [
        'en' => 'Angielski',
        'de' => 'Niemiecki',
        'es' => 'Hiszpański',
        'es-ar' => 'Hiszpański (Argentyna)',
        'fa' => 'Perski',
        'fr' => 'Francuski',
        'hu' => 'Węgierski',
        'it' => 'Włoski',
        'ja' => 'Japoński',
        'nl' => 'Duński',
        'pt-br' => 'Brazylisjki Portugalski',
        'ro' => 'Rumuński',
        'ru' => 'Rosyjski',
        'se' => 'Szwedzki',
        'tr' => 'Turecki',
        'pl' => 'Polski'
    ],
    'directory' => [
        'create_fail' => 'Nie można stworzyć katalogu: :name'
    ],
    'file' => [
        'create_fail' => 'Nie można stworzyć pliku: :name'
    ],
    'combiner' => [
        'not_found' => "The combiner file ':name' is not found."
    ],
    'system' => [
        'name' => 'System',
        'menu_label' => 'System',
        'categories' => [
            'cms' => 'CMS',
            'misc' => 'Różne',
            'logs' => 'Logi',
            'mail' => 'Mail',
            'shop' => 'Sklep',
            'team' => 'Team',
            'users' => 'Użytkownicy',
            'system' => 'System',
            'social' => 'Społecznościowe',
            'events' => 'Events',
            'customers' => 'Klienci',
            'my_settings' => 'Moje ustawienia'
        ]
    ],
    'plugin' => [
        'unnamed' => 'Wtyczka bez nazwy',
        'name' => [
            'label' => 'Nazwa Wtyczki',
            'help' => 'Nazwij wtyczkę unikalny kodem, np. RainLab.Blog'
        ]
    ],
    'plugins' => [
        'manage' => 'Zarządzaj Wtyczkami',
        'enable_or_disable' => 'Włącz lub wyłącz',
        'enable_or_disable_title' => 'Włącz lub Wyłącz Wtyczki',
        'remove' => 'Usuń',
        'refresh' => 'Odśwież',
        'disabled_label' => 'Wyłączona',
        'disabled_help' => 'Wyłączone wtyczki są ignorowane przez aplikację.',
        'selected_amount' => 'Zaznaczono wtyczek: :amount',
        'remove_confirm' => 'Czy jesteś pewny?',
        'remove_success' => 'Skutecznie usunięto wtyczki z systemu.',
        'refresh_confirm' => 'Czy jesteś pewny?',
        'refresh_success' => 'Skutecznie odświeżono wtyczki przez system.',
        'disable_confirm' => 'Czy jesteś pewny?',
        'disable_success' => 'Skutecznie wyłączono wtyczki.',
        'enable_success' => 'Skutecznie włączono wtyczki.',
        'unknown_plugin' => 'Wtyczki zostały usunięte z systemu plików.'
    ],
    'project' => [
        'name' => 'Projekt',
        'owner_label' => 'Właściciel',
        'attach' => 'Podłącz Projekt',
        'detach' => 'Odłącz Projekt',
        'none' => 'żaden',
        'id' => [
            'label' => 'ID Projektu',
            'help' => 'Jak znaleźć ID Projektu',
            'missing' => 'Proszę sprecyzować ID projektu do użycia.'
        ],
        'detach_confirm' => 'Czy jesteś pewny, że chcesz odłaczyć ten projekt?',
        'unbind_success' => 'Projekt został skutecznie odłączony.'
    ],
    'settings' => [
        'menu_label' => 'Ustawienia',
        'not_found' => 'Nie można znaleźć określonych ustawień.',
        'missing_model' => 'The settings page is missing a Model definition.',
        'update_success' => 'Ustawienia dla :name zostały prawidłowo zaktualizowane.',
        'return' => 'Wróc do ustawień systemu',
        'search' => 'Szukaj'
    ],
    'mail' => [
        'log_file' => 'Logi',
        'menu_label' => 'Ustawienia wiadomości',
        'menu_description' => 'Zarządzaj ustawieniami email.',
        'general' => 'Ogólne',
        'method' => 'Metoda wiadomości',
        'sender_name' => 'Imię nadawcy',
        'sender_email' => 'Email nadawcy',
        'php_mail' => 'PHP mail',
        'sendmail' => 'Sendmail',
        'smtp' => 'SMTP',
        'smtp_address' => 'Adres serwera SMTP',
        'smtp_authorization' => 'Autoryzacja SMTP wymagana',
        'smtp_authorization_comment' => 'Zaznacz to pole jeżeli Twój serwer SMTP wymaga autoryzacji.',
        'smtp_username' => 'Użytkownik',
        'smtp_password' => 'Hasło',
        'smtp_port' => 'Port SMTP',
        'smtp_ssl' => 'Połączenie SSL wymagane',
        'sendmail' => 'Sendmail',
        'sendmail_path' => 'Ścieżka Sendmail',
        'sendmail_path_comment' => 'Proszę sprecyzować ścieżkę programu sendmail.',
        'mailgun' => 'Mailgun',
        'mailgun_domain' => 'Domena Mailgun',
        'mailgun_domain_comment' => 'Proszę sprecyzować nazwę domeny Mailgun.',
        'mailgun_secret' => 'Mailgun Secret',
        'mailgun_domain_secret' => 'Podaj klucz API Mailgun (Mailgun API key).'
    ],
    'mail_templates' => [
        'menu_label' => 'Szablony wiadomości email',
        'menu_description' => 'Modyfikuj szablony wiadomości wysyłanych do użytkowników, administratorów. Zmieniaj układy wiadomości.',
        'new_template' => 'Nowy Szablon',
        'new_layout' => 'Nowy Układ',
        'template' => 'Szablon',
        'templates' => 'Szablony',
        'menu_layouts_label' => 'Układy wiadomości email',
        'layout' => 'Układ',
        'layouts' => 'Układy',
        'name' => 'Nazwa',
        'name_comment' => 'Unikalna nazwa odwołująca się do tego szablonu',
        'code' => 'Kod',
        'code_comment' => 'Unikalny kod tego szablonu',
        'subject' => 'Temat',
        'subject_comment' => 'Temat wiadomości Email',
        'description' => 'Opis',
        'content_html' => 'HTML',
        'content_css' => 'CSS',
        'content_text' => 'Plaintext',
        'test_send' => 'Wyślij wiadomość testową',
        'test_success' => 'Wiadomość testowa wysłana prawidłowo.',
        'return' => 'Wróć do listy szablonów'
    ],
    'install' => [
        'project_label' => 'Podłącz do Projektu',
        'plugin_label' => 'Zainstaluj Wtyczkę',
        'missing_plugin_name' => 'Proszę sprecyzować nazwę Wtyczki do zainstalowania.',
        'install_completing' => 'Proces instalacji prawie zakończony.',
        'install_success' => 'Wtyczka została zainstalowana prawidłowo.'
    ],
    'updates' => [
        'title' => 'Zarządzaj Aktualizacjami',
        'name' => 'Software – aktualizacje',
        'menu_label' => 'Aktualizacje',
        'menu_description' => 'Aktualizacja systemu, zarządzaj i instaluj wtyczki oraz szablony.',
        'check_label' => 'Sprawdź aktualizacje',
        'retry_label' => 'Spróbuj ponownie',
        'plugin_name' => 'Nazwa wtyczki',
        'plugin_description' => 'Opis',
        'plugin_version' => 'Wersja',
        'plugin_author' => 'Autor',
        'core_build' => 'Aktualny build',
        'core_build_old' => 'Aktualny build :build',
        'core_build_new' => 'Build :build',
        'core_build_new_help' => 'Najnowszy build jest dostępny.',
        'core_downloading' => 'Pobieranie plików aplikacji',
        'core_extracting' => 'Rozpakowywanie plików aplikacji',
        'plugins' => 'Wtyczki',
        'plugin_downloading' => 'Pobieranie wtyczki: :name',
        'plugin_extracting' => 'Rozpakowywanie wtyczki: :name',
        'plugin_version_none' => 'Nowa wtyczka',
        'plugin_version_old' => 'Aktualna wersja:version',
        'plugin_version_new' => 'v:version',
        'theme_label' => 'Motyw',
        'theme_new_install' => 'Zainstaluj nowy motyw.',
        'theme_downloading' => 'Pobieranie nowego motywu: :name',
        'theme_extracting' => 'Rozpakowywanie motywu: :name',
        'update_label' => 'Software – aktualizacja',
        'update_completing' => 'Zakończenie procesu aktualizacji',
        'update_loading' => 'Wczytywanie dostępnych aktualizacji...',
        'update_success' => 'Proces aktualizacji został skutecznie zakończony.',
        'update_failed_label' => 'Aktualizacja nie powiodła się.',
        'force_label' => 'Zmuś do aktualizacji',
        'found' => [
            'label' => 'Znaleziono nowe aktualizacje!',
            'help' => 'Kliknij, aby rozpocząć proces aktualizacji.'
        ],
        'none' => [
            'label' => 'Brak aktualizacji',
            'help' => 'Brak nowych aktualizacji.'
        ]
    ],
    'server' => [
        'connect_error' => 'Błąd połączenia do serwera.',
        'response_not_found' => 'Serwer aktualizacji nie został odnaleziony.',
        'response_invalid' => 'Nieprawidłowa odpowiedź serwera.',
        'response_empty' => 'Pusta odpowiedź serwera.',
        'file_error' => 'Serwerowi nie udało się dostarczyć pakietu.',
        'file_corrupt' => 'Plik pobrany z serwera jest uszkodzony.'
    ],
    'behavior' => [
        'missing_property' => 'Class :class must define property $:property used by :behavior behavior.'
    ],
    'config' => [
        'not_found' => 'Plik konfiguracyjny :file nie zostały znaleziony w :location.',
        'required' => "Konfiguracja użyta w :location musi spełniać wartość ':property'."
    ],
    'zip' => [
        'extract_failed' => "Rozpakowywanie pliku jądra ':file' nie powiodło się."
    ],
    'event_log' => [
        'hint' => 'Ten log wyświetla listę potencjalnych błędów, które mogły wystąpić w aplikacji, takich jak wyjątki oraz informacje debugowania.',
        'menu_label' => 'Log wydarzenia',
        'menu_description' => 'Zobacz wiadomość logów systemu wraz z ich czasem oraz szczegółami.',
        'empty_link' => 'Pusty log zdarzeń',
        'empty_loading' => 'Opróżnianie logów zdarzeń...',
        'empty_success' => 'Prawidłowo opróżniono logi zdarzeń.',
        'return_link' => 'Powrót do logów zdarzeń',
        'id' => 'ID',
        'id_label' => 'ID Zdarzenia',
        'created_at' => 'Data & Czas',
        'message' => 'Wiadomośc',
        'level' => 'Poziom'
    ],
    'request_log' => [
        'hint' => 'Ten log wyświetla listę żądań przeglądarki, które mogą wymagać Twojej uwagi. Dla przykładu, jeżeli wizytor strony otworzony stronę CMS, której nie można odnaleźć, rekord zostanie stworzony z kodem błędu 404.',
        'menu_label' => 'Log żądań',
        'menu_description' => 'Zobacz złe lub przekierowane żądania, takie jak Strona nie została odnaleziona (404).',
        'empty_link' => 'Pusty log żądań',
        'empty_loading' => 'Opróżnianie logu żądań...',
        'empty_success' => 'Prawidłowo opróżniono logi żądań.',
        'return_link' => 'Powrót do logu żądań',
        'id' => 'ID',
        'id_label' => 'Log ID',
        'count' => 'Licznik',
        'referer' => 'Referers',
        'url' => 'URL',
        'status_code' => 'Status'
    ],
    'permissions' => [
        'name' => 'System',
        'manage_system_settings' => 'Zarządzaj ustawienia systemu',
        'manage_software_updates' => 'Zarządzaj aktualizacjami – software',
        'manage_mail_templates' => 'Zarządzaj szablonami wiadomości',
        'manage_mail_settings' => 'Zarządzaj ustawieniami wiadomości',
        'manage_other_administrators' => 'Zarządzaj innymi administratorami',
        'view_the_dashboard' => 'Zobacz kokpit'
    ]
];