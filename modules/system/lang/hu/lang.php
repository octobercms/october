<?php

return [
    'app' => [
        'name' => 'October CMS',
        'tagline' => 'Visszatérés az alapokhoz',
    ],
    'locale' => [
        'en' => 'Angol',
        'de' => 'Német',
        'es' => 'Spanyol',
        'es-ar' => 'Spanyol (argentín)',
        'fa' => 'Perzsa',
        'fr' => 'Francia',
        'hu' => 'Magyar',
        'it' => 'Olasz',
        'ja' => 'Japán',
        'nl' => 'Holland',
        'pt-br' => 'Brazíliai portugál',
        'ro' => 'Román',
        'ru' => 'Orosz',
        'se' => 'Svéd',
        'tr' => 'Török',
    ],
    'directory' => [
        'create_fail' => "Nem hozható létre a könyvtár: :name",
    ],
    'file' => [
        'create_fail' => "Nem hozható létre a fájl: :name",
    ],
    'combiner' => [
        'not_found' => "A(z) ':name' egyesítőfájl nem található.",
    ],
    'system' => [
        'name' => 'Rendszer',
        'menu_label' => 'Rendszer',
        'categories' => [
            'cms' => 'CMS',
            'misc' => 'Egyebek',
            'logs' => 'Naplók',
            'mail' => 'Levelezés',
            'shop' => 'Bolt',
            'team' => 'Csapat',
            'users' => 'Felhasználók',
            'system' => 'Rendszer',
            'social' => 'Közösségi',
            'events' => 'Események',
            'customers' => 'Vevők',
            'my_settings' => 'Beállításaim',
        ],
    ],
    'plugin' => [
        'unnamed' => 'Névtelen bővítmény',
        'name' => [
            'label' => 'Bővítmény neve',
            'help' => 'Nevezze meg egyedi kódja alapján a bővítményt. Például: RainLab.Blog',
        ],
    ],
    'plugins' => [
        'manage' => 'Bővítmények kezelése',
        'enable_or_disable' => 'Engedélyezés vagy letiltás',
        'enable_or_disable_title' => 'Bővítmények engedélyezése vagy letiltása',
        'remove' => 'Eltávolítás',
        'refresh' => 'Frissítés',
        'disabled_label' => 'Letiltva',
        'disabled_help' => 'A letiltott bővítményeket az alkalmazás figelmen kívül hagyja.',
        'selected_amount' => 'Kijelölt bővítmények: :amount',
        'remove_confirm' => 'Biztos benne?',
        'remove_success' => "Ezek a bővítmények sikeresen eltávolításra kerültek a rendszerből.",
        'refresh_confirm' => 'Biztos benne?',
        'refresh_success' => "Ezek a bővítmények sikeresen frissítésre kerültek a rendszerben.",
        'disable_confirm' => 'Biztos benne?',
        'disable_success' => "Ezek a bővítmények sikeresen letiltásra kerültek.",
        'enable_success' => "Ezek a bővítmények sikeresen engedélyezésre kerültek.",
        'unknown_plugin' => "A bővítmények eltávolítása megtörtént a fájlrendszerből.",
    ],
    'project' => [
        'name' => 'Projekt',
        'owner_label' => 'Tulajdonos',
        'attach' => 'Projekt csatolása',
        'detach' => 'Projekt leválasztása',
        'none' => 'Nincs',
        'id' => [
            'label' => 'Projektazonosító',
            'help' => 'Hogyan található meg a projektazonosító',
            'missing' => 'Adjon meg egy használandó projektazonosítót.',
        ],
        'detach_confirm' => 'Biztosan le akarja választani ezt a projektet?',
        'unbind_success' => 'A projekt leválasztása sikerült.',
    ],
    'settings' => [
        'menu_label' => 'Beállítások',
        'not_found' => 'Nem találhatók a megadott beállítások.',
        'missing_model' => 'A beállítások lap egy modelldefiníciót hiányol.',
        'update_success' => 'A(z) :name beállításainak frissítése sikerült.',
        'return' => 'Vissza a rendszerbeállításokhoz',
        'search' => 'Keresés'
    ],
    'mail' => [
        'log_file' => 'Naplófájl',
        'menu_label' => 'Levelezés konfigurálása',
        'menu_description' => 'Az e-mail küldés konfigurációjának kezelése.',
        'general' => 'Általános',
        'method' => 'Levelezési módszer',
        'sender_name' => 'Feladó neve',
        'sender_email' => 'Feladó e-mail címe',
        'php_mail' => 'PHP mail',
        'sendmail' => 'Sendmail',
        'smtp' => 'SMTP',
        'smtp_address' => 'SMTP címe',
        'smtp_authorization' => 'SMTP hitelesítés szükséges',
        'smtp_authorization_comment' => 'Jelölje be ezt a jelölőnégyzetet, ha az SMTP-kiszolgálója hitelesítést igényel.',
        'smtp_username' => 'Felhasználónév',
        'smtp_password' => 'Jelszó',
        'smtp_port' => 'SMTP port',
        'smtp_ssl' => 'SSL-kapcsolat szükséges',
        'sendmail' => 'Sendmail',
        'sendmail_path' => 'Sendmail elérési útja',
        'sendmail_path_comment' => 'Adja meg a Sendmail program elérési útját.',
		'mailgun' => 'Mailgun',
        'mailgun_domain' => 'Mailgun tartomány',
        'mailgun_domain_comment' => 'Adja meg a Mailgun tartománynevét.',
        'mailgun_secret' => 'Mailgun Secret',
        'mailgun_domain_secret' => 'Adja meg Mailgun API-kulcsát.',
    ],
    'mail_templates' => [
        'menu_label' => 'Levélsablonok',
        'menu_description' => 'A felhasználóknak és a webhelygazdáknak küldendő levélsablonok módosítása, e-mail elrendezések kezelése.',
        'new_template' => 'Új sablon',
        'new_layout' => 'Új elrendezés',
        'template' => 'Sablon',
        'templates' => 'Sablonok',
        'menu_layouts_label' => 'Levélelrendezések',
        'layout' => 'Elrendezés',
        'layouts' => 'Elrendezések',
        'name' => 'Név',
        'name_comment' => 'Erre a sablonra való hivatkozásként használt egyedi név',
        'code' => 'Kód',
        'code_comment' => 'Erre a sablonra való hivatkozásként használt egyedi kód',
        'subject' => 'Tárgy',
        'subject_comment' => 'E-mail üzenet tárgya',
        'description' => 'Leírás',
        'content_html' => 'HTML',
        'content_css' => 'CSS',
        'content_text' => 'Egyszerű szöveg',
        'test_send' => 'Tesztüzenet küldése',
        'test_success' => 'A tesztüzenet elküldése sikerült.',
        'return' => 'Vissza a sablonlistához'
    ],
    'install' => [
        'project_label' => 'Csatolás projekthez',
        'plugin_label' => 'Bővítmény telepítése',
        'missing_plugin_name' => 'Adja meg egy telepítendő bővítmény nevét.',
        'install_completing' => 'A telepítési folyamat befejezése',
        'install_success' => 'A bővítmény telepítése sikerült.',
    ],
    'updates' => [
        'title' => 'Frissítések kezelése',
        'name' => 'Szoftverfrissítés',
        'menu_label' => 'Frissítések',
        'menu_description' => 'A rendszer frissítése, a bővítmények és a témák kezelése, illetve telepítése.',
        'check_label' => 'Frissítések keresése',
        'retry_label' => 'Új próba',
        'plugin_name' => 'Név',
        'plugin_description' => 'Leírás',
        'plugin_version' => 'Verzió',
        'plugin_author' => 'Szerző',
        'core_build' => 'Jelenlegi build',
        'core_build_old' => 'Jelenlegi :build build',
        'core_build_new' => 'Build :build',
        'core_build_new_help' => 'Elérhető a legújabb build.',
        'core_downloading' => 'Alkalmazásfájlok letöltése...',
        'core_extracting' => 'Alkalmazásfájlok kicsomagolása...',
        'plugins' => 'Bővítmények',
        'plugin_downloading' => 'Bővítmény letöltése: :name',
        'plugin_extracting' => 'Bővítmény kicsomagolása: :name',
        'plugin_version_none' => 'Új bővítmény',
        'plugin_version_old' => 'Jelenlegi verzió',
        'plugin_version_new' => 'v:version',
        'theme_label' => 'Téma',
        'theme_new_install' => 'Új téma telepítése.',
        'theme_downloading' => 'Letöltendő téma: :name',
        'theme_extracting' => 'Kicsomagolandó téma: :name',
        'update_label' => 'Szoftver frissítése',
        'update_completing' => 'Frissítési folyamat befejezése',
        'update_loading' => 'Elérhető frissítések betöltése...',
        'update_success' => 'A frissítési folyamat sikeresen végrehajtásra került.',
        'update_failed_label' => 'A frissítés nem sikerült',
        'force_label' => 'Frissítés kényszerítése',
        'found' => [
            'label' => 'Találhatók új frissítések!',
            'help' => 'Kattintson a Szoftver frissítése gombra a frissítési folyamat megkezdéséhez.',
        ],
        'none' => [
            'label' => 'Nincsenek frissítések',
            'help' => 'Nem található új frissítés.',
        ],
    ],
    'server' => [
        'connect_error' => 'Hiba a kiszolgálóhoz való csatlakozáskor.',
        'response_not_found' => 'A frissítési kiszolgáló nem található.',
        'response_invalid' => 'Érvénytelen válasz érkezett a kiszolgálóról.',
        'response_empty' => 'Üres válasz érkezett a kiszolgálóról.',
        'file_error' => 'Nem sikerült továbbítania a kiszolgálónak a csomagot.',
        'file_corrupt' => 'A kiszolgálóról letöltött fájl sérült.',
    ],
    'behavior' => [
        'missing_property' => 'A(z) :class osztálynak kell definiálnia a(z) :behavior viselkedés által használt $:property tulajdonságot.',
    ],
    'config' => [
        'not_found' => 'Nem található a(z) :location számára definiált :file konfigurációs fájl.',
        'required' => "A(z) :location helyen használt konfigurációnak meg kell adnia egy ':property' értéket.",
    ],
    'zip' => [
        'extract_failed' => "Nem nyerhető ki a(z) ':file' fő fájl.",
    ],
    'event_log' => [
        'hint' => 'Ez a napló a rendszerben történt lehetséges hibákat listázza ki, úgymint a kivételeket és a hibakeresési információkat.',
        'menu_label' => 'Eseménynapló',
        'menu_description' => 'A rendszernapló üzeneteinek megtekintése a rögzített idejükkel és részleteikkel.',
        'empty_link' => 'Eseménynapló kiürítése',
        'empty_loading' => 'Az eseménynapló kiürítése...',
        'empty_success' => 'Az eseménynapló kiürítése sikerült.',
        'return_link' => 'Vissza az eseménynaplóhoz',
        'id' => 'Azonosító',
        'id_label' => 'Eseményazonosító',
        'created_at' => 'Dátum és idő',
        'message' => 'Üzenet',
        'level' => 'Szint',
    ],
    'request_log' => [
        'hint' => 'Ez a napló a figyelmet követelhető böngészőkérelmeket listázza ki. Ha például egy látogató megnyit egy nem található CMS-lapot, egy 404-es állapotkódú rekord jön létre.',
        'menu_label' => 'Kérelemnapló',
        'menu_description' => 'Rossz vagy átirányított kérelmek megtekintése mint például A lap nem található (404).',
        'empty_link' => 'Kérelemnapló kiürítése',
        'empty_loading' => 'A kérelemnapló kiürítése...',
        'empty_success' => 'A kérelemnapló kiürítése megtörtént.',
        'return_link' => 'Vissza a kérelemnaplóhoz',
        'id' => 'Azonosító',
        'id_label' => 'Napló azonosító',
        'count' => 'Számláló',
        'referer' => 'Hivatkozók',
        'url' => 'URL-cím',
        'status_code' => 'Állapot',
    ],
    'permissions' => [
        'name' => 'Rendszer',
        'manage_system_settings' => 'Rendszerbeállítások kezelése',
        'manage_software_updates' => 'Szoftverfrissítések kezelése',
        'manage_mail_templates' => 'Levélsablonok kezelése',
        'manage_other_administrators' => 'Másik adminisztrátorok kezelése',
        'view_the_dashboard' => 'Az irányítópult megtekintése'
    ]
];
