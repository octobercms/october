<?php

return [
    'cms_object' => [
        'invalid_file' => 'Felaktigt filnamn: :name. Filnamn kan endast innehålla alfanumeriska tecken, understreck, streck och punkter. Några exempel på korrekta filnamn är: sida.htm, sida, undermapp/sida',
        'invalid_property' => 'Egenskapen ":name" kunde inte sättas',
        'file_already_exists' => 'Filen ":name" finns redan',
        'error_saving' => 'Ett fel inträffade när ":name" skulle sparas',
        'error_creating_directory' => 'Ett fel inträffade när mappen :name skulle skapas',
        'invalid_file_extension'=>'Felaktig filändelse: :invalid. Tillåtna filändelser är: :allowed.',
        'error_deleting' => 'Det gick inte att radera mallfilen: ":name".',
        'delete_success' => 'Mallarna är nu raderade: :count.',
        'file_name_required' => 'Filnamnsfältet är obligatoriskt.'
    ],
    'theme' => [
        'active' => [
            'not_set' => "Ett aktivt tema är ej valt",
        ],
        'edit' => [
            'not_set' => "Redigeringstemat är ej valt",
            'not_found' => "Redigeringstemat kunde ej hittas",
            'not_match' => "Objektet du försöker komma åt tillhör inte det tema som för håller på att redigeras. Var god ladda om sidan",
        ]
    ],
    'page' => [
        'not_found' => [
            'label' => "Sidan kunde ej hittas",
            'help' => "Den begärda sidan kunde ej hittas",
        ],
        'custom_error' => [
            'label' => "Sidfel",
            'help' => "Tyvärr kan inte sidan visas",
        ],
        'menu_label' => 'Sidor',
        'no_list_records' => 'Inga sidor funna',
        'new' => 'Ny sida',
        'invalid_url' => 'Felaktigt URL-format. URLen skall starta med ett / och kan innehålla siffror, bokstäver och följande tecken: ._-[]:?|/+*^$',
        'delete_confirm_multiple' => 'Vill du verkligen radera markerade sidor?',
        'delete_confirm_single' => 'Vill du verkligen radera denna sida?',
        'no_layout' => '-- ingen layout --'
    ],
    'layout' => [
        'not_found_name' => "Layouten ':name' hittades ej",
        'menu_label' => 'Layouter',
        'no_list_records' => 'Inga layouter funna',
        'new' => 'Ny layout',
        'delete_confirm_multiple' => 'Vill du verkligen radera valda layouter?',
        'delete_confirm_single' => 'Vill du verkligen radera denna layouter?'
    ],
    'partial' => [
        'not_found_name' => "En partial med namnet ':name' kunde ej hittas",
        'invalid_name' => "Felaktigt partialnamn: :name",
        'menu_label' => 'Partials',
        'no_list_records' => 'Inga partials funna',
        'delete_confirm_multiple' => 'Vill du verkligen radera markerade partials?',
        'delete_confirm_single' => 'Vill du verkligen radera denna partial?',
        'new' => 'Ny partial'
    ],
    'content' => [
        'not_found_name' => "Innehållet ':name' kunde ej hittas",
        'menu_label' => 'Innehåll',
        'no_list_records' => 'Inga innehållsfiler funna',
        'delete_confirm_multiple' => 'Vill du verkligen radera markerade filer eller mappar?',
        'delete_confirm_single' => 'Vill du verkligen radera detta innehållsfil?',
        'new' => 'Ny innehållsfil'
    ],
    'ajax_handler' => [
        'invalid_name' => "Felaktig AJAX-hanterare: :name",
        'not_found' => "AJAX-hanterare ':name' kunde ej hittas",
    ],
    'cms' => [
        'menu_label' => "CMS"
    ],
    'sidebar' => [
        'add' => 'Lägg till',
        'search' => 'Sök...'
    ],
    'editor' => [
        'settings' => 'Inställningar',
        'title' => 'Titel',
        'new_title' => 'Ny sidtitel',
        'url' => 'URL',
        'filename' => 'Filnamn',
        'layout' => 'Layout',
        'description' => 'Beskrivning',
        'preview' => 'Förhandsgranska',
        'meta' => 'Meta',
        'meta_title' => 'Meta-titel',
        'meta_description' => 'Meta-beskrivning',
        'markup' => 'Markup',
        'code' => 'Kod',
        'content' => 'Innehåll',
    ],
    'asset' => [
        'menu_label' => "Filsystem",
        'drop_down_add_title' => 'Lägg till...',
        'drop_down_operation_title' => 'Åtgärd...',
        'upload_files' => 'Ladda upp fil(er)',
        'create_file' => 'Skapa fil',
        'create_directory' => 'Skapa mapp',
        'rename' => 'Döp om',
        'delete' => 'Radera',
        'move' => 'Flytta',
        'new' => 'Ny fil',
        'rename_popup_title' => 'Byt namn',
        'rename_new_name' => 'Nytt namn',
        'invalid_path' => 'Sökvägen kan endast innehålla siffror, bokstäver, mellanslag och följande tecken: ._-/',
        'error_deleting_file' => 'Kunde inte radera filen :name.',
        'error_deleting_dir_not_empty' => 'Ett fel uppstod vid försök att radera :name. Mappen är ej tom',
        'error_deleting_dir' => 'Kunde inte radera filen :name.',
        'invalid_name' => 'Namn kan endast innehålla siffror, bokstäver, mellanslag och följande tecken: ._-',
        'original_not_found' => 'Orginalfilen eller mappen kunde ej hittas',
        'already_exists' => 'En fil eller mapp med detta namn finns redan',
        'error_renaming' => 'Ett fel uppstod vid namnbyte på filen eller mappen',
        'name_cant_be_empty' => 'Namn får ej vara tomt',
        'too_large' => 'Den uppladdade filen är för stor. Tillåten filstorlek är :max_size',
        'type_not_allowed' => 'Endast följande filtyper är tillåtna: :allowed_types',
        'file_not_valid' => 'Filen är inte korrekt',
        'error_uploading_file' => 'Ett fel uppstod vid uppladdning av ":name" :error',
        'move_please_select' => 'Var god välj',
        'move_destination' => 'Destionationsmapp',
        'move_popup_title' => 'Flytta objekt',
        'move_button' => 'Flytta',
        'selected_files_not_found' => 'Valda filer kunde ej hittas',
        'select_destination_dir' => 'Var god välj en destinationsmapp',
        'destination_not_found' => 'Destinationsmappen kunde ej hittas',
        'error_moving_file' => 'Ett fel uppstod vid flytt av fil :file',
        'error_moving_directory' => 'Ett fel uppstod vid flytt av mapp :dir',
        'error_deleting_directory' => 'Ett fel uppstod vid radering av orginalmapp :dir',
        'path' => 'Sökväg'
    ],
    'component' => [
        'menu_label' => "Komponenter",
        'unnamed' => "Ej namngiven",
        'no_description' => "Ingen beskrivning",
        'alias' => "Alias",
        'alias_description' => "Ett unikt namn för denna komponent, när den skall användas i sid- eller layoutkod",
        'validation_message' => "Komponentalias är obligatoriska och får endast innehålla bokstäver, siffror, och understreck. De måste börja med en bokstav",
        'invalid_request' => "Mallen kunde inte sparas pga felaktig komponentdata",
        'no_records' => 'Inga komponenter funna',
        'not_found' => "Komponenten ':name' kunde ej hittas",
        'method_not_found' => "Komponenten ':name' saknar metoden ':method'",
    ],
    'template' => [
        'invalid_type' => "Felaktig malltyp",
        'not_found' => "Den angivna mallen kunde ej hittas",
        'saved'=> "Mallen har sparats"
    ]
];
