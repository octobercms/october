<?php

return [
    'cms_object' => [
        'invalid_file' => 'Ongeldige bestandsnaam: :name. Bestandsnamen mogen enkel bestaan uit letters, cijfers, underscores, streepjes en punten. Voorbeelden van correcte bestandsnamen: pagina.htm, pagina, map/pagina',
        'invalid_property' => 'Parameter ":name" kan niet worden gewijzigd',
        'file_already_exists' => 'Bestand ":name" bestaat al.',
        'error_saving' => 'Bestand opslaan mislukt: ":name". Controleer de schrijfrechten.',
        'error_creating_directory' => 'Map aanmaken mislukt: ":name". Controleer de schrijfrechten.',
        'invalid_file_extension'=>'Ongeldige bestandsextensie: :invalid. Toegestane extensies zijn: :allowed.',
        'error_deleting' => 'Fout bij het verwijderen van template: ":name". Controleer de schrijfrechten.',
        'delete_success' => 'Templates zijn succesvol verwijderd: :count.',
        'file_name_required' => 'Het invullen van een bestandsnaam is verplicht.'
    ],
    'theme' => [
        'active' => [
            'not_set' => "Er is geen actief thema geselecteerd.",
            'not_found' => "Het actieve thema is niet gevonden.",
        ],
        'edit' => [
            'not_set' => "Er is geen thema ingesteld om te kunnen bewerken.",
            'not_found' => "Het te bewerken thema is niet gevonden.",
            'not_match' => "Het object dat je probeert te openen behoort niet tot het te bewerken thema. Herlaad de pagina."
        ],
        'settings_menu' => 'Front-end thema',
        'settings_menu_description' => 'Bekijk de lijst met geïnstalleerde themas en selecteer een beschikbaar thema.',
        'find_more_themes' => 'Vind meer thema\'s op de OctoberCMS thema marktplaats.',
        'activate_button' => 'Activeer',
        'active_button' => 'Activeer',
    ],
    'page' => [
        'not_found' => [
            'label' => "Pagina niet gevonden",
            'help' => "De opgevraagde pagina kan niet worden gevonden.",
        ],
        'custom_error' => [
            'label' => "Paginafout",
            'help' => "Onze excuses, er is iets mis gegaan. De opgevraagde pagina kan niet worden getoond.",
        ],
        'menu_label' => 'Pagina\'s',
        'no_list_records' => 'Geen pagina\'s gevonden',
        'new' => 'Nieuwe pagina',
        'invalid_url' => 'Ongeldig URL formaat. De URL moet beginnen met een schuine streep en mag enkel bestaan uit letters, cijfers en de volgende tekens: ._-[]:?|/+*^$',
        'delete_confirm_multiple' => 'Weet je zeker dat je de geselecteerde pagina\'s wilt verwijderen?',
        'delete_confirm_single' => 'Weet je zeker dat je deze pagina wilt verwijderen?',
        'no_layout' => '-- geen layout --'
    ],
    'layout' => [
        'not_found_name' => "De layout ':name' is niet gevonden",
        'menu_label' => 'Layouts',
        'no_list_records' => 'Geen layouts gevonden',
        'new' => 'Nieuwe layout',
        'delete_confirm_multiple' => 'Weet je zeker dat je de geselecteerde layouts wilt verwijderen?',
        'delete_confirm_single' => 'Weet je zeker dat je deze layout wilt verwijderen?'
    ],
    'partial' => [
        'not_found_name' => "Het sjabloon (partial) ':name' is niet gevonden.",
        'invalid_name' => "Ongeldige naam voor sjabloon (partial): :name.",
        'menu_label' => 'Sjablonen',
        'no_list_records' => 'Geen sjablonen (partial) gevonden',
        'delete_confirm_multiple' => 'Weet je zeker dat je de geselecteerde sjablonen wilt verwijderen?',
        'delete_confirm_single' => 'Weet je zeker dat je dit sjabloon wilt verwijderen?',
        'new' => 'Nieuw sjabloon'
    ],
    'content' => [
        'not_found_name' => "Het tekstblok (content) ':name' is niet gevonden.",
        'menu_label' => 'Tekstblokken',
        'no_list_records' => 'Geen tekstblokken (content) gevonden',
        'delete_confirm_multiple' => 'Weet je zeker dat je de geselecteerde tekstblokken of mappen wilt verwijderen?',
        'delete_confirm_single' => 'Weet je zeker dat je dit tekstblok wilt verwijderen?',
        'new' => 'Nieuw tekstblok'
    ],
    'ajax_handler' => [
        'invalid_name' => "Ongeldige AJAX handlernaam: :name.",
        'not_found' => "AJAX handler ':name' is niet gevonden.",
    ],
    'cms' => [
        'menu_label' => "CMS"
    ],
    'sidebar' => [
        'add' => 'Toevoegen',
        'search' => 'Zoeken...'
    ],
    'editor' => [
        'settings' => 'Instellingen',
        'title' => 'Titel',
        'new_title' => 'Nieuwe paginatitel',
        'url' => 'URL',
        'filename' => 'Bestandsnaam',
        'layout' => 'Layout',
        'description' => 'Omschrijving',
        'preview' => 'Voorbeeld',
        'meta' => 'Meta',
        'meta_title' => 'Meta titel',
        'meta_description' => 'Meta omschrijving',
        'markup' => 'Opmaak',
        'code' => 'Code',
        'content' => 'Content',
        'hidden' => 'Verborgen',
        'hidden_comment' => 'Verborgen pagina zijn alleen toegankelijk voor ingelogde gebruikers.',
        'enter_fullscreen' => 'Volledig scherm starten',
        'exit_fullscreen' => 'Volledig scherm afsluiten',
    ],
    'asset' => [
        'menu_label' => "Middelen",
        'drop_down_add_title' => 'Toevoegen...',
        'drop_down_operation_title' => 'Actie...',
        'upload_files' => 'Bestand(en) uploaden',
        'create_file' => 'Nieuw bestand',
        'create_directory' => 'Nieuwe map',
        'directory_popup_title' => 'Nieuwe map',
        'directory_name' => 'Mapnaam',
        'rename' => 'Hernoemen',
        'delete' => 'Verwijderen',
        'move' => 'Verplaatsen',
        'select' => 'Selecteren',
        'new' => 'Nieuw bestand',
        'rename_popup_title' => 'Hernoemen',
        'rename_new_name' => 'Nieuwe naam',
        'invalid_path' => 'Pad mag enkel bestaan uit letters, cijfers, spaties en de volgende tekens: ._-/',
        'error_deleting_file' => 'Fout bij verwijderen van het bestand :name.',
        'error_deleting_dir_not_empty' => 'Fout bij verwijderen van map :name. De map is niet leeg.',
        'error_deleting_dir' => 'Fout bij verwijderen van de map :name.',
        'invalid_name' => 'Naam mag enkel bestaan uit letters, cijfers, spaties en de volgende tekens: ._-',
        'original_not_found' => 'Oorspronkelijke bestand of map is niet gevonden',
        'already_exists' => 'Bestand of map met deze naam bestaat al',
        'error_renaming' => 'Fout bij hernoemen van bestand of map',
        'name_cant_be_empty' => 'De naam mag niet leeg zijn',
        'too_large' => 'Het geüploadete bestand is te groot. De maximaal toegestane bestandsgrootte is :max_size',
        'type_not_allowed' => 'Enkel de volgende bestandstypen zijn toegestaand: :allowed_types',
        'file_not_valid' => 'Bestand is ongeldig',
        'error_uploading_file' => 'Fout tijdens uploaden bestand ":name": :error',
        'move_please_select' => 'selecteer',
        'move_destination' => 'Doelmap',
        'move_popup_title' => 'Verplaats middelen',
        'move_button' => 'Verplaats',
        'selected_files_not_found' => 'Geselecteerde bestanden zijn niet gevonden',
        'select_destination_dir' => 'Selecteer een doelmap',
        'destination_not_found' => 'Doelmap is niet gevonden',
        'error_moving_file' => 'Fout bij verplaatsen bestand :file',
        'error_moving_directory' => 'Fout bij verplaatsen map :dir',
        'error_deleting_directory' => 'Fout bij het verwijderen van de oorspronkelijke map :dir',
        'path' => 'Pad'
    ],
    'component' => [
        'menu_label' => "Componenten",
        'unnamed' => "Naamloos",
        'no_description' => "Geen beschrijving opgegeven",
        'alias' => "Alias",
        'alias_description' => "Een unieke naam voor dit component voor gebruik in de code van een pagina of layout.",
        'validation_message' => "Een alias voor het component is verplicht en mag alleen bestaan uit letters, cijfers en underscores. De alias moet beginnen met een letter.",
        'invalid_request' => "De template kan niet worden opgeslagen vanwege ongeldige componentgegevens.",
        'no_records' => 'Geen componenten gevonden',
        'not_found' => "Het component ':name' is niet gevonden.",
        'method_not_found' => "Het component ':name' bevat geen ':method' methode.",
    ],
    'template' => [
        'invalid_type' => "Onbekend type template.",
        'not_found' => "De opgevraagde template is niet gevonden.",
        'saved'=> "De template is succesvol opgeslagen."
    ],
    'permissions' => [
        'manage_content' => 'Beheer inhoud',
        'manage_assets' => 'Beheer middelen',
        'manage_pages' => 'Beheer pagina\'s',
        'manage_layouts' => 'Beheer layouts',
        'manage_partials' => 'Beheer sjablonen',
        'manage_themes' => 'Beheer thema\'s'
    ]
];
