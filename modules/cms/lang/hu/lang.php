<?php

return [
    'cms_object' => [
        'invalid_file' => 'Érvénytelen fájlnév. Csak latin betűt, számot, aláhúzásjelet, kötőjelet és pontot tartalmazhat. Néhány példa a megfelelő fájlnévre: kapcsolat.htm, impresszum, konyvtar/oldalnev',
        'invalid_property' => "A(z) ':name' tulajdonság nem állítható be.",
        'file_already_exists' => "Már létezik ':name' nevű fájl.",
        'error_saving' => "Hiba a(z) ':name' fájl mentésekor. Ellenőrizze az írási engedélyeket.",
        'error_creating_directory' => 'Hiba a(z) :name könyvtár létrehozásakor. Ellenőrizze az írási engedélyeket.',
        'invalid_file_extension'=>'Érvénytelen fájl kiterjesztés: :invalid. Az engedélyezett kiterjesztések: :allowed.',
        'error_deleting' => "Hiba a(z) ':name' sablonfájl törlésekor. Ellenőrizze az írási engedélyeket.",
        'delete_success' => 'A sablonok törlése sikerült: :count.',
        'file_name_required' => 'A Fájlnév mező kitöltése kötelező.',
        'safe_mode_enabled' => 'A biztonságos mód jelenleg engedélyezett.'
    ],
    'dashboard' => [
        'active_theme' => [
            'widget_title_default' => 'Honlap',
            'online' => 'Online',
            'maintenance' => 'Karbantartás alatt',
            'manage_themes' => 'Témák kezelése',
            'customize_theme' => 'Téma testreszabása'
        ]
    ],
    'theme' => [
        'not_found_name' => "A következő téma nem található: ':name'",
        'by' => 'Fejlesztő:',
        'active' => [
            'not_set' => 'Nincs beállítva az aktív téma.',
            'not_found' => 'Az aktív téma nem található.'
        ],
        'edit' => [
            'not_set' => 'Nincs beállítva a szerkesztés alatt lévő téma.',
            'not_found' => 'A szerkesztés alatt lévő téma nem található.',
            'not_match' => 'Az objektum melyhez hozzáférni próbál, nem a szerkesztés alatt lévő témához tartozik. Töltse be újra a lapot.'
        ],
        'settings_menu' => 'Dizájn',
        'settings_menu_description' => 'A telepített témák és a választható sablonok listája.',
        'default_tab' => 'Tulajdonságok',
        'name_label' => 'Név',
        'name_create_placeholder' => 'Az új téma neve',
        'author_label' => 'Szerző',
        'author_placeholder' => 'Magánszemély vagy cég neve',
        'description_label' => 'Leírás',
        'description_placeholder' => 'A téma ismertetője',
        'homepage_label' => 'Weboldal',
        'homepage_placeholder' => 'A honlap webcíme',
        'code_label' => 'Kód',
        'code_placeholder' => 'Egyedi azonosító ehhez a témához',
        'preview_image_label' => 'Előnézet',
        'preview_image_placeholder' => 'A téma előnézet képének elérési útvonala.',
        'dir_name_label' => 'Könyvtár',
        'dir_name_create_label' => 'A célkönyvtár',
        'theme_label' => 'Téma',
        'theme_title' => 'Témák',
        'activate_button' => 'Aktiválás',
        'active_button' => 'Aktiválva',
        'customize_theme' => 'Téma testreszabása',
        'customize_button' => 'Testreszabás',
        'duplicate_button' => 'Duplikálás',
        'duplicate_title' => 'Téma duplikálása',
        'duplicate_theme_success' => 'A téma duplikálása sikeresen megtörtént!',
        'manage_button' => 'Műveletek',
        'manage_title' => 'Téma menedzselése',
        'edit_properties_title' => 'Téma',
        'edit_properties_button' => 'Tulajdonságok',
        'save_properties' => 'Mentés',
        'import_button' => 'Importálás',
        'import_title' => 'Téma importálása',
        'import_theme_success' => 'A téma importálása sikeresen megtörtént!',
        'import_uploaded_file' => 'Téma archív fájl',
        'import_overwrite_label' => 'Létező fájlok felülírása',
        'import_overwrite_comment' => 'Ne jelölje be ezt a négyzetet, ha csak új fájlokat akar importálni.',
        'import_folders_label' => 'Könyvtárak',
        'import_folders_comment' => 'Válassza ki azokat a könyvtárakat, amiket importálni szeretne.',
        'export_button' => 'Exportálás',
        'export_title' => 'Téma exportálása',
        'export_folders_label' => 'Könyvtárak',
        'export_folders_comment' => 'Válassza ki azokat a könyvtárakat, amiket exportálni szeretne.',
        'delete_button' => 'Törlés',
        'delete_confirm' => 'Biztos, hogy törölni szeretné a témát?',
        'delete_active_theme_failed' => 'Nem lehet törölni a témát. Először aktiváljon egy másik témát.',
        'delete_theme_success' => 'A téma törlése sikeresen megtörtént!',
        'create_title' => 'Sablon létrehozása',
        'create_button' => 'Létrehozás',
        'create_new_blank_theme' => 'Üres téma létrehozása',
        'create_theme_success' => 'A téma létrehozása sikeresen megtörtént!',
        'create_theme_required_name' => 'Kérem adjon meg egy nevet a témának.',
        'new_directory_name_label' => 'Téma helye',
        'new_directory_name_comment' => 'Adjon meg egy új könyvtárat a duplikált témának.',
        'dir_name_invalid' => 'A név csak számokat, latin betűket és a következő szimbólumokat tartalmazhatja: _-',
        'dir_name_taken' => 'A megadott könyvtár név már létezik.',
        'find_more_themes' => 'További témák az OctoberCMS piacterén.',
        'saving' => 'Téma mentése...',
        'return' => 'Vissza a témákhoz'
    ],
    'maintenance' => [
        'settings_menu' => 'Karbantartás',
        'settings_menu_description' => 'Szolgáltatás aktiválása és testreszabása.',
        'is_enabled' => 'Karbantartás engedélyezése',
        'is_enabled_comment' => 'Aktiválása esetén a weboldal látogatói csak a kiválasztott lapot fogják látni.',
        'hint' => 'Karbantartás módban a lentebb megadott lap fog megjelenni azon látogatók számára, akik nincsenek bejelentkezve az admin felületre.'
    ],
    'page' => [
        'not_found_name' => "A következő lap nem található: ':name'",
        'not_found' => [
            'label' => 'A lap nem található',
            'help' => 'A kért lap nem található.'
        ],
        'custom_error' => [
            'label' => 'Laphiba',
            'help' => 'Sajnos valami elromlott, ezért a lap nem jeleníthető meg.'
        ],
        'menu_label' => 'Lapok',
        'unsaved_label' => 'Nem mentett lap(ok)',
        'no_list_records' => 'Nincs találat',
        'new' => 'Új lap',
        'invalid_url' => 'Érvénytelen a webcím formátuma. A webcímnek perjellel kell kezdődnie, és számokat, latin betűket, valamint a következő karaktereket tartalmazhatja: ._-[]:?|/+*',
        'delete_confirm_multiple' => 'Valóban törölni akarja a kijelölt lapokat?',
        'delete_confirm_single' => 'Valóban törölni akarja ezt a lapot?',
        'no_layout' => '-- nincs --',
        'cms_page' => 'Lapok',
        'title' => 'Elnevezés szerint',
        'url' => 'Webcím szerint',
        'file_name' => 'Fájlnév szerint'
    ],
    'layout' => [
        'not_found_name' => "A(z) ':name' elrendezés nem található",
        'menu_label' => 'Elrendezések',
        'unsaved_label' => 'Nem mentett elrendezés(ek)',
        'no_list_records' => 'Nincs találat',
        'new' => 'Új elrendezés',
        'delete_confirm_multiple' => 'Valóban törölni akarja a kijelölt elrendezéseket?',
        'delete_confirm_single' => 'Valóban törölni akarja ezt az elrendezést?'
    ],
    'partial' => [
        'not_found_name' => "A(z) ':name' részlap nem található.",
        'invalid_name' => 'Érvénytelen részlapnév: :name.',
        'menu_label' => 'Részlapok',
        'unsaved_label' => 'Nem mentett részlap(ok)',
        'no_list_records' => 'Nincs találat',
        'delete_confirm_multiple' => 'Valóban törölni akarja a kijelölt részlapokat?',
        'delete_confirm_single' => 'Valóban törölni akarja ezt a részlapot?',
        'new' => 'Új részlap'
    ],
    'content' => [
        'not_found_name' => "A(z) ':name' tartalomfájl nem található.",
        'menu_label' => 'Tartalom',
        'unsaved_label' => 'Nem mentett tartalom',
        'no_list_records' => 'Nincs találat',
        'delete_confirm_multiple' => 'Valóban törölni akarja a kijelölt tartalomfájlokat vagy könyvtárakat?',
        'delete_confirm_single' => 'Valóban törölni akarja ezt a tartalomfájlt?',
        'new' => 'Új tartalomfájl'
    ],
    'ajax_handler' => [
        'invalid_name' => 'Érvénytelen AJAX kezelő név: :name.',
        'not_found' => "A(z) ':name' AJAX kezelő nem található."
    ],
    'cms' => [
        'menu_label' => 'Testreszabás'
    ],
    'sidebar' => [
        'add' => 'Hozzáadás',
        'search' => 'Keresés...'
    ],
    'editor' => [
        'settings' => 'Beállítások',
        'title' => 'Elnevezés',
        'new_title' => 'Az új lap címe',
        'url' => 'Webcím',
        'filename' => 'Fájlnév',
        'layout' => 'Elrendezés',
        'description' => 'Leírás',
        'preview' => 'Előnézet',
        'meta' => 'Továbbiak',
        'meta_title' => 'Keresőbarát cím',
        'meta_description' => 'Keresőbarát leírás',
        'markup' => 'HTML',
        'code' => 'PHP',
        'content' => 'Tartalom',
        'hidden' => 'Rejtett',
        'hidden_comment' => 'Csak a bejelentkezett felhasználók láthatják.',
        'enter_fullscreen' => 'Váltás teljes képernyőre',
        'exit_fullscreen' => 'Kilépés a teljes képernyőből',
        'open_searchbox' => 'Keresési panel megnyitása',
        'close_searchbox'  => 'Keresési panel bezárása',
        'open_replacebox' => 'Cserepanel megnyitása',
        'close_replacebox'  => 'Cserepanel bezárása'
    ],
    'asset' => [
        'menu_label' => 'Fájlok',
        'unsaved_label' => 'Nem mentett fájl(ok)',
        'drop_down_add_title' => 'Hozzáadás...',
        'drop_down_operation_title' => 'Művelet...',
        'upload_files' => 'Fájl(ok) feltöltése',
        'create_file' => 'Fájl létrehozása',
        'create_directory' => 'Könyvtár létrehozása',
        'directory_popup_title' => 'Új könyvtár',
        'directory_name' => 'Könyvtár neve',
        'rename' => 'Átnevezés',
        'delete' => 'Törlés',
        'move' => 'Áthelyezés',
        'select' => 'Kijelölés',
        'new' => 'Új fájl',
        'rename_popup_title' => 'Átnevezés',
        'rename_new_name' => 'Új név',
        'invalid_path' => 'Az elérési út neve csak számokat, latin betűket, szóközöket és a következő szimbólumokat tartalmazhatja: ._-/',
        'error_deleting_file' => 'Hiba a(z) :name fájl törlésekor.',
        'error_deleting_dir_not_empty' => 'Hiba a(z) :name könyvtár törlésekor. A könyvtár nem üres.',
        'error_deleting_dir' => 'Hiba a(z) :name fájl törlésekor.',
        'invalid_name' => 'A név csak számokat, latin betűket, szóközöket és a következő szimbólumokat tartalmazhatja: ._-',
        'original_not_found' => 'Nem található az eredeti fájl vagy könyvtár.',
        'already_exists' => 'Már létezik ilyen nevű fájl vagy könyvtár.',
        'error_renaming' => 'Hiba a fájl vagy a könyvtár átnevezésekor.',
        'name_cant_be_empty' => 'A név nem lehet üres.',
        'too_large' => 'A feltöltött fájl túl nagy. A maximálisan engedélyezett fájlméret :max_size',
        'type_not_allowed' => 'Csak a következő fájltípusok engedélyezettek: :allowed_types',
        'file_not_valid' => 'A fájl nem érvényes.',
        'error_uploading_file' => "Hiba a(z) ':name' fájl feltöltésekor: :error",
        'move_please_select' => 'válasszon',
        'move_destination' => 'Célkönyvtár',
        'move_popup_title' => 'Fájl(ok) áthelyezése',
        'move_button' => 'Áthelyezés',
        'selected_files_not_found' => 'A kijelölt fájlok nem találhatók.',
        'select_destination_dir' => 'Válasszon egy célkönyvtárat.',
        'destination_not_found' => 'A célkönyvtár nem található.',
        'error_moving_file' => 'Hiba a(z) :file fájl áthelyezésekor.',
        'error_moving_directory' => 'Hiba a(z) :dir könyvtár áthelyezésekor.',
        'error_deleting_directory' => 'Hiba a(z) :dir eredeti könyvtár áthelyezésekor.',
        'no_list_records' => 'Nincs találat',
        'delete_confirm' => 'Valóban törölni akarja a kiválasztott fájlokat és könyvtárakat?',
        'path' => 'Elérési út'
    ],
    'component' => [
        'menu_label' => 'Komponensek',
        'unnamed' => 'Névtelen',
        'no_description' => 'Nincs megadott leírás',
        'alias' => 'Alias',
        'alias_description' => 'Ennek a komponensnek a lap vagy az elrendezés kódjában való használatkor adott egyedi név.',
        'validation_message' => 'A komponens aliasok kötelezőek, és csak latin szimbólumokat, számokat, valamint aláhúzás jeleket tartalmazhatnak. Az aliasoknak latin szimbólummal kell kezdődniük.',
        'invalid_request' => 'A sablon érvénytelen komponens adatok miatt nem menthető.',
        'no_records' => 'Nem találhatók komponensek',
        'not_found' => "A(z) ':name' komponens nem található.",
        'method_not_found' => "A(z) ':name' komponens nem tartalmaz egy ':method' metódust."
    ],
    'template' => [
        'invalid_type' => 'Ismeretlen sablon típus.',
        'not_found' => 'A kért sablon nem található.',
        'saved' => 'A módosítások sikeresen mentésre kerültek.',
        'no_list_records' => 'Nincs találat',
        'delete_confirm' => 'Valóban törölni akarja a témát?',
        'order_by' => 'Rendezés'
    ],
    'permissions' => [
        'name' => 'Testreszabás',
        'manage_content' => 'Tartalom kezelése',
        'manage_assets' => 'Fájlok kezelése',
        'manage_pages' => 'Lapok kezelése',
        'manage_layouts' => 'Elrendezések kezelése',
        'manage_partials' => 'Részlapok kezelése',
        'manage_themes' => 'Témák kezelése',
        'manage_media' => 'Média kezelése'
    ],
    'mediafinder' => [
        'label' => 'Média',
        'default_prompt' => 'Kattintson a(z) %s gombra új média fájl kereséséhez.'
    ],
    'media' => [
        'invalid_path' => "Érvénytelen elérési útvonal: ':path'",
        'menu_label' => 'Média',
        'upload' => 'Feltöltés',
        'move' => 'Áthelyezés',
        'delete' => 'Törlés',
        'add_folder' => 'Könyvtár létrehozása',
        'search' => 'Keresés...',
        'display' => 'Megjelenítés',
        'filter_everything' => 'Összes',
        'filter_images' => 'Kép',
        'filter_video' => 'Videó',
        'filter_audio' => 'Audió',
        'filter_documents' => 'Dokumentum',
        'library' => 'Média',
        'folder_size_items' => 'fájl',
        'size' => 'Méret',
        'title' => 'Név',
        'last_modified' => 'Módosítva',
        'public_url' => 'Webcím',
        'click_here' => 'Megtekintés',
        'thumbnail_error' => 'Hiba a bélyegkép létrehozásánál.',
        'return_to_parent' => 'Vissza a szülő könyvtárhoz',
        'return_to_parent_label' => 'Eggyel vissza ..',
        'nothing_selected' => 'Nincs kiválasztva fájl.',
        'multiple_selected' => 'Több fájl kiválasztva.',
        'uploading_file_num' => 'Feltöltve :number fájl...',
        'uploading_complete' => 'Feltöltés sikeresen befejezve',
        'uploading_error' => 'Feltöltés sikertelen',
        'type_blocked' => 'A fájltípus blokkolva lett biztonsági okokból.',
        'order_by' => 'Rendezés',
        'folder' => 'Könyvtárak',
        'no_files_found' => 'Nem található fájl a lekérésben.',
        'delete_empty' => 'Kérjük válassza ki a törölni kívánt fájlokat.',
        'delete_confirm' => 'Valóban törölni akarja a kiválasztott fájlokat?',
        'error_renaming_file' => 'Hiba a fájl átnevezésében.',
        'new_folder_title' => 'Új könyvtár',
        'folder_name' => 'Könyvtár neve',
        'error_creating_folder' => 'Hiba a könyvtár létrehozásánál',
        'folder_or_file_exist' => 'Már létezik ilyen nevű fájl vagy könyvtár.',
        'move_empty' => 'Kérjük válasszon ki fájlt az áthelyezéshez.',
        'move_popup_title' => 'Fájlok vagy könyvtárak áthelyezése',
        'move_destination' => 'Célkönyvtár',
        'please_select_move_dest' => 'Kérjük válasszon célkönyvtárat.',
        'move_dest_src_match' => 'Kérjük válasszon másik célkönyvtárat.',
        'empty_library' => 'Kezdésként hozzon létre könyvtárat és töltsön fel fájlokat.',
        'insert' => 'Beillesztés',
        'crop_and_insert' => 'Vágás és beillesztés',
        'select_single_image' => 'Kérjük válasszon ki egy képet.',
        'selection_not_image' => 'A kiválasztott fájl nem kép.',
        'restore' => 'Összes változtatás visszavonása',
        'resize' => 'Átméretezés...',
        'selection_mode_normal' => 'Normál',
        'selection_mode_fixed_ratio' => 'Rögzített képarány',
        'selection_mode_fixed_size' => 'Rögzített méret',
        'height' => 'Magasság',
        'width' => 'Szélesség',
        'selection_mode' => 'Kiválasztás módja',
        'resize_image' => 'Kép átméretezése',
        'image_size' => 'Kép mérete:',
        'selected_size' => 'Kiválasztva:'
    ],
    'theme_log' => [
        'hint' => 'Az adminisztrátorok által elvégzett módosítások az aktív téma fájlaiban, amiket az admin felületen keresztül hajtottak végre.',
        'menu_label' => 'Téma napló',
        'menu_description' => 'Változtatások listája az aktív témánál.',
        'empty_link' => 'Kiürítés',
        'empty_loading' => 'A kiürítés folyamatban...',
        'empty_success' => 'A téma napló kiürítése megtörtént.',
        'return_link' => 'Vissza a téma naplóhoz',
        'id' => 'ID',
        'id_label' => 'Napló ID',
        'created_at' => 'Dátum',
        'user' => 'Felhasználó',
        'type' => 'Művelet',
        'type_create' => 'Létrehozás',
        'type_update' => 'Módosítás',
        'type_delete' => 'Törlés',
        'theme_name' => 'Téma',
        'theme_code' => 'Kódnév',
        'old_template' => 'Fájl (régi)',
        'new_template' => 'Fájl (új)',
        'template' => 'Fájl',
        'diff' => 'Változtatások',
        'old_value' => 'Régi tartalom',
        'new_value' => 'Új tartalom',
        'preview_title' => 'Változtatások',
        'template_updated' => 'A fájl frissítve lett.',
        'template_created' => 'A fájl létre lett hozva.',
        'template_deleted' => 'A fájl törölve lett.',
    ]
];
