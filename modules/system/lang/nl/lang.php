<?php

return [
    'app' => [
        'name' => 'October CMS',
        'motto' => 'Getting back to basics',
    ],
    'directory' => [
        'create_fail' => "Map aanmaken mislukt: :name",
    ],
    'file' => [
        'create_fail' => "Bestand aanmaken mislukt: :name",
    ],
    'system' => [
        'name' => 'Systeem',
        'menu_label' => 'Systeem',
    ],
    'plugin' => [
        'unnamed' => 'Naamloze plugin',
        'name' => [
            'label' => 'Plugin Naam',
            'help' => 'Gebruik bij het invoeren van de naam de unieke code van de plugin. Voorbeeld: RainLab.Blog',
        ],
    ],
    'project' => [
        'name' => 'Project',
        'owner_label' => 'Eigenaar',
        'id' => [
            'label' => 'Project ID',
            'help' => 'Hoe vind je jouw Project ID',
            'missing' => 'Voer een Project ID in.',
        ],
        'unbind_success' => 'Project is succesvol losgekoppeld.',
    ],
    'settings' => [
        'menu_label' => 'Instellingen',
        'missing_model' => 'De instellingenpagina mist de definitie van een Model.',
        'update_success' => 'Instellingen voor :name zijn succesvol bijgewerkt.',
    ],
    'install' => [
        'project_label' => 'Koppel aan Project',
        'plugin_label' => 'Installeer Plugin',
        'missing_plugin_name' => 'Voer een naam van een plugin in om deze te installeren.',
        'install_completing' => 'Afronden installatieproces',
        'install_success' => 'De plugin is succesvol geïnstalleerd.',
    ],
    'updates' => [
        'name' => 'Applicatie-update',
        'menu_label' => 'Updates',
        'check_label' => 'Controleer op updates',
        'retry_label' => 'Probeer nogmaals',
        'core_build' => 'Huidige build',
        'core_build_old' => 'Huidige build :build',
        'core_build_new' => 'Build :build',
        'core_build_new_help' => 'De meest recente versie is beschikbaar.',
        'core_downloading' => 'Applicatiebestanden downloaden',
        'core_extracting' => 'Applicatiebestanden uitpakken',
        'plugin_downloading' => 'Plugin downloaden: :name',
        'plugin_extracting' => 'Uitpakken plugin: :name',
        'plugin_version_none' => 'Nieuwe plugin',
        'plugin_version_old' => 'Huidig v:version',
        'plugin_version_new' => 'v:version',
        'update_label' => 'Applicatie bijwerken',
        'update_completing' => 'Afronden updateproces',
        'update_loading' => 'Beschikbare updates laden...',
        'update_success' => 'Het updateproces is succesvol afgerond.',
        'update_failed_label' => 'Update mislukt',
        'force_label' => 'Forceer update',
        'found' => [
            'label' => 'Nieuwe updates beschikbaar!',
            'help' => 'Klik op \'Applicatie bijwerken\' om het updateproces te starten.',
        ],
        'none' => [
            'label' => 'Geen updates',
            'help' => 'Er zijn geen nieuwe updates gevonden.',
        ],
    ],
    'server' => [
        'connect_error' => 'Fout tijdens het verbinden met de server.',
        'response_not_found' => 'De updateserver kan niet worden gevonden.',
        'response_invalid' => 'Ongeldige reactie van de server.',
        'response_empty' => 'Lege reactie van de server.',
        'file_error' => 'Fout tijdens aanleveren bestand door server.',
        'file_corrupt' => 'Door server aangeboden bestand is corrupt.',
    ],
    'behavior' => [
        'missing_property' => 'Klasse :class moet variabele $:property bevatten gebruikt door het gedag (behavior) :behavior.',
    ],
    'config' => [
        'not_found' => 'Kan het configuratiebestand :file gedefinieerd door :file niet vinden.',
        'required' => 'Configuratie gebruikt in :location moet de waarde :property toewijzen.',
    ],
    'zip' => [
        'extract_failed' => "Kan het corebestand ':file' niet uitpakken.",
    ],
];