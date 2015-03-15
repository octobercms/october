<?php

return [
    'cms_object' => [
        'invalid_file' => 'Érvénytelen fájlnév. Csak alfanumerikus szimbólumokat, aláhúzásjeleket, kötőjeleket és pontokat tartalmazhat. Néhány példa a megfelelő fájlnévre: kapcsolat.htm, impresszum, mappa/oldalnev',
        'invalid_property' => "A(z) ':name' tulajdonság nem állítható be",
        'file_already_exists' => "Már létezik ':name' nevű fájl.",
        'error_saving' => "Hiba a(z) ':name' fájl mentésekor. Ellenőrizze az írási engedélyeket.",
        'error_creating_directory' => 'Hiba a(z) :name könyvtár létrehozásakor. Ellenőrizze az írási engedélyeket.',
        'invalid_file_extension'=>'Érvénytelen fájlkiterjesztés: :invalid. Az engedélyezett kiterjesztések: :allowed.',
        'error_deleting' => "Hiba a(z) ':name' sablonfájl törlésekor. Ellenőrizze az írási engedélyeket.",
        'delete_success' => 'A sablonok törlése sikerült: :count.',
        'file_name_required' => 'A Fájlnév mező kitöltése kötelező.'
    ],
    'theme' => [
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
        'settings_menu_description' => 'Telepített témák és további választható sablonok listája.',
        'find_more_themes' => 'További témák az October CMS piacterén.',
        'activate_button' => 'Aktiválás',
        'active_button' => 'Aktiválva',
        'customize_button' => 'Testreszabás'
    ],
    'maintenance' => [
        'settings_menu' => 'Karbantartás',
        'settings_menu_description' => 'Szolgáltatás be / ki kapcsolása és testreszabása.',
        'is_enabled' => 'Karbantartási mód engedélyezése',
        'is_enabled_comment' => 'Aktiválása esetén a weboldal látogatói az alább kiválasztott lapot fogják látni.'
    ],
    'page' => [
        'not_found' => [
            'label' => 'A lap nem található',
            'help' => 'A kért lap nem található.',
        ],
        'custom_error' => [
            'label' => 'Laphiba',
            'help' => 'Sajnos valami elromlott, és a lap nem jeleníthető meg.'
        ],
        'menu_label' => 'Lapok',
        'unsaved_label' => 'Nem mentett lap(ok)',
        'no_list_records' => 'Nem találhatók lapok',
        'new' => 'Új lap',
        'invalid_url' => 'Érvénytelen URL címformátum. Az URL címnek perjellel kell kezdődnie, és számokat, latin betűket, valamint a következő számokat tartalmazhatja: ._-[]:?|/+*',
        'delete_confirm_multiple' => 'Valóban törölni akarja a kijelölt lapokat?',
        'delete_confirm_single' => 'Valóban törölni akarja ezt a lapot?',
        'no_layout' => '-- nincs elrendezés --'
    ],
    'layout' => [
        'not_found_name' => "A(z) ':name' elrendezés nem található",
        'menu_label' => 'Elrendezések',
        'unsaved_label' => 'Nem mentett elrendezés(ek)',
        'no_list_records' => 'Nem találhatók elrendezések',
        'new' => 'Új elrendezés',
        'delete_confirm_multiple' => 'Valóban törölni akarja a kijelölt elrendezéseket?',
        'delete_confirm_single' => 'Valóban törölni akarja ezt az elrendezést?'
    ],
    'partial' => [
        'not_found_name' => "A(z) ':name' részlap nem található.",
        'invalid_name' => 'Érvénytelen részlapnév: :name.',
        'menu_label' => 'Részlapok',
        'unsaved_label' => 'Nem mentett részlap(ok)',
        'no_list_records' => 'Nem találhatók részlapok',
        'delete_confirm_multiple' => 'Valóban törölni akarja a kijelölt részlapokat?',
        'delete_confirm_single' => 'Valóban törölni akarja ezt a részlapot?',
        'new' => 'Új részlap'
    ],
    'content' => [
        'not_found_name' => "A(z) ':name' tartalomfájl nem található.",
        'menu_label' => 'Tartalom',
        'unsaved_label' => 'Nem mentett tartalom',
        'no_list_records' => 'Nem találhatók tartalomfájlok',
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
        'title' => 'Cím',
        'new_title' => 'Új lap címe',
        'url' => 'URL cím',
        'filename' => 'Fájlnév',
        'layout' => 'Elrendezés',
        'description' => 'Leírás',
        'preview' => 'Előnézet',
        'meta' => 'Meta',
        'meta_title' => 'Meta cím',
        'meta_description' => 'Meta leírás',
        'markup' => 'Jelölés',
        'code' => 'Kód',
        'content' => 'Tartalom',
        'hidden' => 'Rejtett',
        'hidden_comment' => 'A rejtett lapok csak a bejelentkezett felhasználók által hozzáférhetők.',
        'enter_fullscreen' => 'Váltás teljes képernyős módra',
        'exit_fullscreen' => 'Kilépés a teljes képernyős módból'
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
        'original_not_found' => 'Nem található az eredeti fájl vagy könyvtár',
        'already_exists' => 'Már létezik ilyen nevű fájl vagy könyvtár',
        'error_renaming' => 'Hiba a fájl vagy a könyvtár átnevezésekor',
        'name_cant_be_empty' => 'A név nem lehet üres',
        'too_large' => 'A feltöltött fájl túl nagy. A maximálisan engedélyezett fájlméret :max_size',
        'type_not_allowed' => 'Csak a következő fájltípusok engedélyezettek: :allowed_types',
        'file_not_valid' => 'A fájl nem érvényes',
        'error_uploading_file' => "Hiba a(z) ':name' fájl feltöltésekor: :error",
        'move_please_select' => 'válasszon',
        'move_destination' => 'Célkönyvtár',
        'move_popup_title' => 'Fájl(ok) áthelyezése',
        'move_button' => 'Áthelyezés',
        'selected_files_not_found' => 'A kijelölt fájlok nem találhatók',
        'select_destination_dir' => 'Válasszon egy célkönyvtárat',
        'destination_not_found' => 'A célkönyvtár nem található',
        'error_moving_file' => 'Hiba a(z) :file fájl áthelyezésekor',
        'error_moving_directory' => 'Hiba a(z) :dir könyvtár áthelyezésekor',
        'error_deleting_directory' => 'Hiba a(z) :dir eredeti könyvtár áthelyezésekor',
        'path' => 'Elérési út'
    ],
    'component' => [
        'menu_label' => 'Komponensek',
        'unnamed' => 'Névtelen',
        'no_description' => 'Nincs megadott leírás',
        'alias' => 'Alias',
        'alias_description' => 'Ennek a komponensnek a lap vagy az elrendezés kódjában való használatkor adott egyedi név.',
        'validation_message' => 'A komponens aliasok kötelezőek, és csak latin szimbólumokat, számokat, valamint aláhúzásjeleket tartalmazhatnak. Az aliasoknak latin szimbólummal kell kezdődniük.',
        'invalid_request' => 'A sablon érvénytelen komponensadatok miatt nem menthető.',
        'no_records' => 'Nem találhatók komponensek',
        'not_found' => "A(z) ':name' komponens nem található.",
        'method_not_found' => "A(z) ':name' komponens nem tartalmaz egy ':method' metódust."
    ],
    'template' => [
        'invalid_type' => 'Ismeretlen sablontípus.',
        'not_found' => 'A kért sablon nem található.',
        'saved'=> 'A sablon mentése sikerült.'
    ],
    'permissions' => [
        'name' => 'Testreszabás',
        'manage_content' => 'Tartalom kezelése',
        'manage_assets' => 'Fájlok kezelése',
        'manage_pages' => 'Lapok kezelése',
        'manage_layouts' => 'Elrendezések kezelése',
        'manage_partials' => 'Részlapok kezelése',
        'manage_themes' => 'Témák kezelése'
    ]
];
