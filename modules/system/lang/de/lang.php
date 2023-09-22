<?php return [
  'app' => [
    'name' => 'October CMS',
    'tagline' => 'Zurück zum Wesentlichen',
  ],
  'directory' => [
    'create_fail' => 'Konnte Verzeichnis: :name nicht erstellen',
  ],
  'file' => [
    'create_fail' => 'Konnte Datei :name nicht erstellen',
  ],
  'page' => [
    'invalid_token' => [
      'label' => 'Ungültiges Sicherheitstoken',
    ],
  ],
  'combiner' => [
    'not_found' => 'Die combiner Datei \':name\' wurde nicht gefunden.',
  ],
  'system' => [
    'name' => 'System',
    'menu_label' => 'System',
    'categories' => [
      'cms' => 'CMS',
      'misc' => 'Verschiedenes',
      'logs' => 'Logs',
      'mail' => 'Mail',
      'shop' => 'Shop',
      'team' => 'Team',
      'users' => 'Benutzer',
      'system' => 'System',
      'social' => 'Social',
      'events' => 'Events',
      'customers' => 'Kunden',
      'my_settings' => 'Meine Einstellungen',
    ],
  ],
  'plugin' => [
    'unnamed' => 'Unbenanntes Plugin',
    'name' => [
      'label' => 'Plugin-Name',
      'help' => 'Benennen Sie das Plugin eindeutig, zum Beispiel RainLab.Blog',
    ],
  ],
  'project' => [
    'attach' => 'Projekt verbinden',
    'detach' => 'Projekt trennen',
    'none' => 'Keins',
    'id' => [
      'missing' => 'Bitte geben Sie eine Projekt-ID an.',
    ],
    'detach_confirm' => 'Möchtest du dieses Projekt wirklich trennen?',
    'unbind_success' => 'Projekt wurde erfolgreich getrennt (detached).',
  ],
  'settings' => [
    'search' => 'Suche',
  ],
  'mail' => [
    'smtp_ssl' => 'SSL Verbindung erforderlich',
  ],
  'mail_templates' => [
    'name_comment' => 'Eindeutiger Name um diese Vorlage zu referenzieren',
    'test_send' => 'Testnachricht senden',
    'test_confirm' => 'Eine Testnachricht wird an :email gesendet. Fortsetzen?',
    'creating' => 'Erstelle Vorlage...',
    'creating_layout' => 'Erstelle Layout...',
    'saving' => 'Speichere Vorlage...',
    'saving_layout' => 'Speichere Layout...',
    'delete_confirm' => 'Möchtest Du diese Vorlage wirklich löschen?',
    'delete_layout_confirm' => 'Möchtest Du dieses Layout wirklich löschen?',
    'deleting' => 'Lösche Vorlage...',
    'deleting_layout' => 'Lösche Layout...',
    'sending' => 'Sende Nachricht...',
    'return' => 'Zurück zur Vorlagen-Liste',
  ],
  'install' => [
    'plugin_label' => 'Plugin installieren',
  ],
  'updates' => [
    'plugin_author' => 'Autor',
    'plugin_not_found' => 'Plugin not found',
    'core_build' => 'Build :build',
    'core_build_help' => 'Aktuellster Build ist verfügbar.',
    'plugin_version_none' => 'Neues Plugin',
    'update_label' => 'Aktualisieren',
    'update_loading' => 'Lade verfügbare Aktualisierungen...',
    'force_label' => 'Aktualisierung erzwingen',
    'found' => [
      'label' => 'Neue Aktualisierungen gefunden!',
      'help' => '"Aktualisieren" wählen um Prozess zu starten ',
    ],
    'none' => [
      'label' => 'Keine Aktualisierungen',
      'help' => 'Es wurden keine Aktualisierungen gefunden.',
    ],
  ],
  'server' => [
    'connect_error' => 'Fehler beim Verbinden mit dem Server.',
    'response_not_found' => 'Der Aktualisierungs-Server kann nicht gefunden werden.',
    'response_invalid' => 'Ungültige Antwort vom Server.',
    'response_empty' => 'Ergebnislose Antwort vom Server.',
    'file_error' => 'Server konnte Paket nicht zur Verfügung stellen.',
    'file_corrupt' => 'Angelieferte Datei ist fehlerhaft.',
  ],
  'behavior' => [
    'missing_property' => 'Klasse :class muss Eingenschaft $:property besitzen, da sie von Verhalten (behaviour) :behavior benötigt wird.',
  ],
  'config' => [
    'not_found' => 'Konnte Konfigurationsdatei :file definiert für :location nicht finden.',
    'required' => 'Konfiguration, die in :location benutzt wird, muss den Wert :property zur Verfügung stellen.',
  ],
  'zip' => [
    'extract_failed' => 'Konnte Core-Datei \':file\' nicht entpacken.',
  ],
  'event_log' => [],
  'request_log' => [
    'empty_link' => 'Request-Log zurücksetzen',
    'empty_loading' => 'Request-Log wird zurückgesetzt...',
    'empty_success' => 'Request-Log erfolgreich zurückgesetzt.',
    'return_link' => 'Zurück zum Request-Log',
    'id' => 'ID',
  ],
  'permissions' => [
    'name' => 'System',
    'manage_system_settings' => 'Systemeinstellungen verwalten',
    'manage_software_updates' => 'Software-Updates verwalten',
    'access_logs' => 'Systemprotokolle einsehen',
    'manage_mail_templates' => 'Mail-Templates verwalten',
    'manage_mail_settings' => 'Mail-Einstellungen verwalten',
    'manage_other_administrators' => 'Andere Administratoren verwalten',
  ],
  'media' => [
    'invalid_path' => 'Ungültiger Dateipfad: \':path\'.',
    'folder_size_items' => 'Datei(en)',
  ],
];
