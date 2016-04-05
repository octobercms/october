<?php

return [
    'cms_object' => [
        'invalid_file' => 'Ungültiger Dateiname: :name. Diese dürfen nur alphanumerische Symbole, Unter- und Bindestriche sowie Punkte enthalten. Beispiele: page.htm, page, subdirectory/page',
        'invalid_property' => 'Die Eigenschaft ":name" kann nicht angewendet werden',
        'file_already_exists' => 'Datei ":name" existiert bereits.',
        'error_saving' => 'Fehler beim Speichern von ":name".',
        'error_creating_directory' => 'Fehler beim Erstellen von Verzeichnis mit Namen :name',
        'invalid_file_extension'=>'Ungültige Dateiendung: :invalid. Erlaubt sind: :allowed.',
        'error_deleting' => 'Fehler beim Löschen der Template-Datei ":name".',
        'delete_success' => 'Templates wurden erfolgreich gelöscht: :count.',
        'file_name_required' => 'Ein Dateiname ist erforderlich.'
    ],
    'theme' => [
        'not_found_name' => "Das Theme ':name' konnte nicht gefunden werden.",
        'active' => [
            'not_set' => "Aktives Theme nicht definiert",
        ],
        'edit' => [
            'not_set' => "Edit Theme nicht definiert",
            'not_found' => "Edit Theme nicht gefunden.",
            'not_match' => "Das Objekt, das sie anzupassen versuchen gehört nicht zum Theme in Bearbeitung. Bitte laden Sie die Seite erneut."
        ],
        'settings_menu' => 'Frontend Theme',
        'settings_menu_description' => 'Rufe eine Liste installierter Themes auf und wähle ein aktives aus.',
        'default_tab' => 'Eigenschaften',
        'name_label' => 'Name',
        'name_create_placeholder' => 'Neuer Themename',
        'author_label' => 'Autor',
        'author_placeholder' => 'Autor- oder Firmenname',
        'description_label' => 'Beschreibung',
        'description_placeholder' => 'Themebeschreibung',
        'homepage_label' => 'Homepage',
        'homepage_placeholder' => 'Webseiten URL',
        'code_label' => 'Code',
        'code_placeholder' => 'Ein einzigartiger Code genutzt bei der Weiterverbreitung dieses Themes',
        'dir_name_label' => 'Verzeichnisname',
        'dir_name_create_label' => 'Name des Zielverzeichnisses',
        'theme_label' => 'Theme',
        'theme_title' => 'Themes',
        'activate_button' => 'Aktivieren',
        'active_button' => 'Aktivieren',
        'customize_theme' => 'Theme anpassen',
        'customize_button' => 'Anpassen',
        'duplicate_button' => 'Duplizieren',
        'duplicate_title' => 'Theme duplizieren',
        'duplicate_theme_success' => 'Theme erfolgreich dupliziert!',
        'manage_button' => 'Verwalten',
        'manage_title' => 'Theme verwalten',
        'edit_properties_title' => 'Theme',
        'edit_properties_button' => 'Eigenschaften bearbeiten',
        'save_properties' => 'Eigenschaften speichern',
        'import_button' => 'Importieren',
        'import_title' => 'Theme importieren',
        'import_theme_success' => 'Theme erfolgreich importiert!',
        'import_uploaded_file' => 'Theme Archivdatei',
        'import_overwrite_label' => 'Überschreibe existierende Dateien',
        'import_overwrite_comment' => 'Deaktiviere diese Option, um ausschließlich neue Dateien zu importieren',
        'import_folders_label' => 'Ordner',
        'import_folders_comment' => 'Bitte wähle die Theme-Ordner zum Importieren aus',
        'export_button' => 'Exportieren',
        'export_title' => 'Exportiere Theme',
        'export_folders_label' => 'Ordner',
        'export_folders_comment' => 'Bitte wählen Sie die Ordner des Themes, die Sie exportieren wollen, aus.',
        'delete_button' => 'Löschen',
        'delete_confirm' => 'Sind Sie sicher, dass Sie dieses Theme löschen wollen? Dies kann nicht rückgängig gemacht werden!',
        'delete_active_theme_failed' => 'Das aktive Theme kann nicht gelöscht werden, aktivieren Sie zunächst ein anderes Theme.',
        'delete_theme_success' => 'Theme wurde erfolgreich gelöscht!',
        'create_title' => 'Theme erstellen',
        'create_button' => 'Erstellen',
        'create_new_blank_theme' => 'Erstelle ein neues (leeres) Theme',
        'create_theme_success' => 'Theme erfolgreich erstellt!',
        'create_theme_required_name' => 'Bitte benennen Sie das Theme.',
        'new_directory_name_label' => 'Theme Verzeichnis',
        'new_directory_name_comment' => 'Stellen Sie einen neuen Verzeichnisnamen für das duplizierte Theme bereit.',
        'dir_name_invalid' => 'Verzeichnisnamen können nur Zahlen, lateinische Buchstaben und die folgenden Symbole enthalten: _-',
        'dir_name_taken' => 'Gewünschter Verzeichnisname existiert bereits.',
        'find_more_themes' => 'Finde weitere Themen',
        'saving' => 'Theme speichern...',
        'return' => 'Zur Themeliste zurückkehren',
    ],
    'maintenance' => [
        'settings_menu' => 'Wartungsmodus',
        'settings_menu_description' => 'Konfigurieren Sie den Wartungsmodus.',
        'is_enabled' => 'Wartungsmodus aktivieren',
        'is_enabled_comment' => 'Sobald aktiviert, werden Besucher die unten ausgewählte Seite sehen.'
    ],
    'page' => [
        'not_found_name' => "Die Seite ':name' konnte nicht gefunden werden",
        'not_found' => [
            'label' => "Seite nicht gefunden",
            'help' => "Die angeforderte Seite kann nicht gefunden werden.",
        ],
        'custom_error' => [
            'label' => "Seitenfehler",
            'help' => "Entschuldigung, ein Fehler trat auf, sodass die gewünschte Seite nicht angezeigt werden kann.",
        ],
        'menu_label' => 'Seiten',
        'no_list_records' => 'Keine Seiten gefunden',
        'new' => 'Neue Seite',
        'invalid_url' => 'Ungültiges URL-Format. Die URL muss mit einem Slash beginnen und darf nur Ziffern, lateinische Zeichen und die folgenden Symbole beinhalten: ._-[]:?|/+*^$',
        'delete_confirm_multiple' => 'Wollen Sie die ausgewählten Seiten wirklich löschen?',
        'delete_confirm_single' => 'Wollen Sie diese Seite wirklich löschen?',
        'no_layout' => '-- Kein Layout --'
    ],
    'layout' => [
        'not_found_name' => "Das Layout ':name' wurde nicht gefunden",
        'menu_label' => 'Layouts',
        'no_list_records' => 'Keine Layouts gefunden',
        'new' => 'Neues Layout',
        'delete_confirm_multiple' => 'Wollen Sie die ausgewählten Layouts wirklich löschen?',
        'delete_confirm_single' => 'Wollen Sie das ausgewählte Layout wirklich löschen?'
    ],
    'partial' => [
        'not_found_name' => "Das Partial ':name' wurde nicht gefunden.",
        'invalid_name' => "Ungültiger Partial-Name: :name.",
        'menu_label' => 'Partials',
        'no_list_records' => 'Keine Partials gefunden',
        'delete_confirm_multiple' => 'Wollen Sie die ausgewählten Partials wirklich löschen?',
        'delete_confirm_single' => 'Wollen Sie das ausgewählte Partial wirklich löschen?',
        'new' => 'Neues Partial'
    ],
    'content' => [
        'not_found_name' => "Die Inhaltsdatei ':name' wurde nicht gefunden.",
        'menu_label' => 'Inhalt',
        'no_list_records' => 'Keine Inhaltsdateien gefunden',
        'delete_confirm_multiple' => 'Wollen Sie die ausgewählten Inhalte und Verzeichnisse wirklich löschen?',
        'delete_confirm_single' => 'Wollen Sie diese Inhaltsdatei wirklich löschen?',
        'new' => 'Neue Inhaltsdatei'
    ],
    'ajax_handler' => [
        'invalid_name' => "Ungültiger Name für AJAX Handler: :name.",
        'not_found' => "AJAX Handler ':name' wurde nicht gefunden.",
    ],
    'cms' => [
        'menu_label' => "CMS"
    ],
    'sidebar' => [
        'add' => 'Hinzufügen',
        'search' => 'Suchen...'
    ],
    'editor' => [
        'settings' => 'Einstellungen',
        'title' => 'Titel',
        'new_title' => 'Neuer Seitentitel',
        'url' => 'URL',
        'filename' => 'Dateiname',
        'layout' => 'Layout',
        'description' => 'Beschreibung',
        'preview' => 'Vorschau',
        'meta' => 'Meta',
        'meta_title' => 'Meta Titel',
        'meta_description' => 'Meta Beschreibung',
        'markup' => 'Markup',
        'code' => 'Code',
        'content' => 'Inhalt',
        'hidden' => 'Versteckt',
        'hidden_comment' => 'Versteckte Seiten können nur von eingeloggten Backend-Benutzern genutzt werden.',
        'enter_fullscreen' => 'In den Vollbildmodus wechseln',
        'exit_fullscreen' => 'Vollbildmodus beenden'
    ],
    'asset' => [
        'menu_label' => "Assets",
        'drop_down_add_title' => 'Hinzufügen...',
        'drop_down_operation_title' => 'Aktion...',
        'upload_files' => 'Datei(en) hochladen',
        'create_file' => 'Datei erstellen',
        'create_directory' => 'Verzeichnis erstellen',
        'rename' => 'Umbenennen',
        'delete' => 'Löschen',
        'move' => 'Bewegen',
        'new' => 'Neue Datei',
        'rename_popup_title' => 'Umbenennen',
        'rename_new_name' => 'Neuer Name',
        'invalid_path' => 'Pfade dürfen ausschließlich Ziffern, lateinische Zeichen, Leerzeichen sowie die folgenden Symbole enthalten: ._-/',
        'error_deleting_file' => 'Fehler beim Löschen der Datei :name.',
        'error_deleting_dir_not_empty' => 'Fehler beim Löschen des Verzeichnisses :name, da es nicht leer ist.',
        'error_deleting_dir' => 'Fehler beim Löschen der Datei :name.',
        'invalid_name' => 'Asset-Name darf nur Ziffern, lateinische Zeichen, Leerzeichen sowie die folgenden Symbole enthalten: ._-',
        'original_not_found' => 'Originaldatei oder -verzeichnis wurde nicht gefunden',
        'already_exists' => 'Datei oder Verzeichnis mit diesem Namen existiert bereits',
        'error_renaming' => 'Fehler beim Umbenennen der Datei bzw. des Verzeichnisses',
        'name_cant_be_empty' => 'Es muss ein Name angegeben werden',
        'too_large' => 'Die hochzuladende Datei ist zu groß. Sie dürfen maximal Dateien der Größe :max_size hochladen',
        'type_not_allowed' => 'Es sind ausschließlich folgende Dateiendungen erlaubt: :allowed_types',
        'file_not_valid' => 'Datei ist ungültig',
        'error_uploading_file' => 'Fehler beim Hochladen der Datei ":name": :error',
        'move_please_select' => 'Bitte auswählen',
        'move_destination' => 'Zielverzeichnis',
        'move_popup_title' => 'Assets bewegen',
        'move_button' => 'Bewegen',
        'selected_files_not_found' => 'Ausgewählte Dateien nicht gefunden',
        'select_destination_dir' => 'Bitte wählen Sie ein Zielverzeichnis aus',
        'destination_not_found' => 'Zielverzeichnis wurde nicht gefunden',
        'error_moving_file' => 'Fehler beim Bewegen der Datei :file',
        'error_moving_directory' => 'Fehler beim Bewegen des Verzeichnisses :dir',
        'error_deleting_directory' => 'Fehler beim Löschen des Originalverzeichnisses :dir',
        'path' => 'Pfad'
    ],
    'component' => [
        'menu_label' => "Komponenten",
        'unnamed' => "Unbenannt",
        'no_description' => "Keine Beschreibung angegeben",
        'alias' => "Verknüpfung",
        'alias_description' => "Dieser Komponente wird ein eindeutiger Name gegeben, wenn sie im Code von Seite oder Layout benutzt wird.",
        'validation_message' => "Komponentenverknüpfungen werden benötigt und dürfen nur lateinische Zeichen, Ziffern und Unterstriche beinhalten. Die Verknüpfungen müssen mit einem lateinischen Zeichen beginnen.",
        'invalid_request' => "Aufgrund ungültiger Komponentendaten kann das Template nicht gespeichert werden.",
        'no_records' => 'Keine Komponenten gefunden',
        'not_found' => "Die Komponente ':name' wurde nicht gefunden.",
        'method_not_found' => "Die Komponente ':name' enthält keine Methode mit Namen ':method'.",
    ],
    'template' => [
        'invalid_type' => "Unbekannter Template-Typ.",
        'not_found' => "Das angeforderte Template wurde nicht gefunden.",
        'saved'=> "Das Template wurde erfolgreich gespeichert."
    ],
    'permissions' => [
        'name' => 'Cms',
        'manage_content' => 'Inhalt verwalten',
        'manage_assets' => 'Assets verwalten',
        'manage_pages' => 'Seiten verwalten',
        'manage_layouts' => 'Layouts verwalten',
        'manage_partials' => 'Partials verwalten',
        'manage_themes' => 'Themes verwalten'
    ],
    'media' => [
        'invalid_path' => "Ungültiger Dateipfad: ':path'.",
        'menu_label' => 'Medien',
        'upload' => 'Hochladen',
        'move' => 'Verschieben',
        'delete' => 'Löschen',
        'add_folder' => 'Ordner erstellen',
        'search' => 'Suchen',
        'display' => 'Anzeigen',
        'filter_everything' => 'Alles',
        'filter_images' => 'Bilder',
        'filter_video' => 'Video',
        'filter_audio' => 'Audio',
        'filter_documents' => 'Dokumente',
        'library' => 'Sammlung',
        'folder_size_items' => 'Datei(en)',
        'size' => 'Größe',
        'title' => 'Titel',
        'last_modified' => 'Zuletzt bearbeitet',
        'public_url' => 'Öffentliche URL',
        'click_here' => 'Hier drücken',
        'thumbnail_error' => 'Fehler beim Erstellen des Thumbnails.',
        'return_to_parent' => 'Zu oberem Ordner zurückkehren',
        'return_to_parent_label' => 'Stufe hoch ..',
        'nothing_selected' => 'Nichts ausgewählt.',
        'multiple_selected' => 'Mehrere Dateien ausgewählt.',
        'uploading_file_num' => 'Lade :number Datei(en)...',
        'uploading_complete' => 'Upload vollständig',
        'order_by' => 'Sortieren nach',
        'folder' => 'Ordner',
        'no_files_found' => 'Keine entsprechenden Dateien gefunden.',
        'delete_empty' => 'Bitte Wählen Sie Dateien zum Löschen aus.',
        'delete_confirm' => 'Wollen Sie wirklich die gewählte(n) Datei(en) löschen?',
        'error_renaming_file' => 'Fehler beim Umbenennen.',
        'new_folder_title' => 'Neuer Ordner',
        'folder_name' => 'Ordnername',
        'error_creating_folder' => 'Fehler beim Erstellen des Ordners',
        'folder_or_file_exist' => 'Ein Ordner oder eine Datei mit dem gewählten Namen existiert bereits.',
        'move_empty' => 'Bitte wählen Sie Dateien zum Verschieben aus',
        'move_popup_title' => 'Verschiebe Dateien oder Ordner',
        'move_destination' => 'Zielordner',
        'please_select_move_dest' => 'Bitte wählen Sie einen Zielordner.',
        'move_dest_src_match' => 'Bitte wählen Sie einen anderen Zielordner.',
        'empty_library' => 'Diese Medienbibliothek ist leer. Laden Sie Dateien hoch oder erstellen Sie Ordner!',
        'insert' => 'Einfügen',
        'crop_and_insert' => 'Zuschneiden und Einfügen',
        'select_single_image' => 'Bitte wählen Sie ein einzelnes Bild.',
        'selection_not_image' => 'Die gewählte Datei ist kein Bild.',
        'restore' => 'Alle Änderungen rückgängig machen',
        'resize' => 'Größe anpassen...',
        'selection_mode_normal' => 'Normal',
        'selection_mode_fixed_ratio' => 'Fixes Verhältnis',
        'selection_mode_fixed_size' => 'Fixe Größe',
        'height' => 'Höhe',
        'width' => 'Breite',
        'selection_mode' => 'Selection mode',
        'resize_image' => 'Bildgröße anpassen',
        'image_size' => 'Dimensionen:',
        'selected_size' => 'Ausgewählt:'
    ]
];
