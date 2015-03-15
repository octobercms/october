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
        'active' => [
            'not_set' => "Aktives Theme nicht definiert",
        ],
        'edit' => [
            'not_set' => "Edit Theme nicht definiert",
            'not_found' => "Edit Theme nicht gefunden.",
            'not_match' => "Das Objekt, das sie anzupassen versuchen gehört nicht zum Theme in Bearbeitung. Bitte laden Sie die Seite erneut."
        ]
    ],
    'page' => [
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
        'not_found_name' => "Die Inhaltsdatei ':name' wurde nicht gefundne.",
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
        'add' => 'Add',
        'search' => 'Search...'
    ],
    'editor' => [
        'settings' => 'Settings',
        'title' => 'Title',
        'new_title' => 'New page title',
        'url' => 'URL',
        'filename' => 'File Name',
        'layout' => 'Layout',
        'description' => 'Description',
        'preview' => 'Preview',
        'meta' => 'Meta',
        'meta_title' => 'Meta Title',
        'meta_description' => 'Meta Description',
        'markup' => 'Markup',
        'code' => 'Code',
        'content' => 'Content',
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
    ]
];
