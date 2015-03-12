<?php

return [
    'cms_object' => [
        'invalid_file' => 'Nome file non valido: :name. I nomi dei file possono contenere solo caratteri alfanumerici, underscores, trattini e punti. Alcuni esempi di nome di file corretti: page.htm, page, subdirectory/page',
        'invalid_property' => 'La proprietà ":name" non può essere impostata',
        'file_already_exists' => 'File ":name" già esistente.',
        'error_saving' => 'Errore nel salvataggio del file ":name". Verifica le autorizzazioni di scrittura.',
        'error_creating_directory' => 'Errore nella creazione della cartella :name. Verifica le autorizzazioni di scrittura.',
        'invalid_file_extension'=>'Estensione del file non valida: :invalid. Le estensioni consentite sono: :allowed.',
        'error_deleting' => 'Errore nella cancellazione del file ":name". Verifica le autorizzazioni di scrittura.',
        'delete_success' => 'File eliminati correttamente: :count.',
        'file_name_required' => 'Il campo Nome file è obbligatorio.'
    ],
    'theme' => [
        'active' => [
            'not_set' => "Il tema attivo non è impostato.",
            'not_found' => "Il tema attivo non è stato trovato.",
        ],
        'edit' => [
            'not_set' => "Il tema di modifica non è impostato.",
            'not_found' => "Il tema di modifica non è stato trovato.",
            'not_match' => "L'oggetto a cui stai cercando di accedere non appartiene al tema che stai modificando. Si prega di ricaricare la pagina."
        ],
        'settings_menu' => 'Tema del sito',
        'settings_menu_description' => 'Visualizza l\'anteprima dei temi installati e seleziona un tema attivo.',
        'find_more_themes' => 'Trova altri temi su OctoberCMS Theme Marketplace.',
        'activate_button' => 'Attiva',
        'active_button' => 'Attivo',
    ],
    'page' => [
        'not_found' => [
            'label' => "Pagina non trovata",
            'help' => "La pagina richiesta non è stata trovata.",
        ],
        'custom_error' => [
            'label' => "Errore nella pagina",
            'help' => "Siamo spiacenti, ma qualcosa è andato storto e la pagina non può essere visualizzata.",
        ],
        'menu_label' => 'Pagine',
        'no_list_records' => 'Pagine non trovate',
        'new' => 'Nuova pagina',
        'invalid_url' => 'Formato URL non valido. L\'URL deve iniziare con una barra e può contenere numeri, lettere e i seguenti simboli: ._-[]:?|/+*^$',
        'delete_confirm_multiple' => 'Sei sicuro di voler eliminare le pagine selezionate?',
        'delete_confirm_single' => 'Sei sicuro di voler eliminare questa pagina?',
        'no_layout' => '-- nessun layout --'
    ],
    'layout' => [
        'not_found_name' => "Il layout ':name' non è stato trovato",
        'menu_label' => 'Layouts',
        'no_list_records' => 'Nessun layout trovato',
        'new' => 'Nuovo layout',
        'delete_confirm_multiple' => 'Sei sicuro di voler eliminare i layouts selezionati?',
        'delete_confirm_single' => 'Sei sicuro di voler eliminare questo layout?'
    ],
    'partial' => [
        'not_found_name' => "La vista parziale ':name' non è stata trovata.",
        'invalid_name' => "Nome della vista parziale non valido: :name.",
        'menu_label' => 'Viste parziali',
        'no_list_records' => 'Nessuna vista parziale trovata',
        'delete_confirm_multiple' => 'Sei sicuro di voler eliminare le viste parziali selezionate?',
        'delete_confirm_single' => 'Sei sicuro di voler eliminare questa vista parziale?',
        'new' => 'Nuova vista parziale'
    ],
    'content' => [
        'not_found_name' => "Il file di contenuto ':name' non è stato trovato.",
        'menu_label' => 'Contenuti',
        'no_list_records' => 'Nessun file di contenuto trovato',
        'delete_confirm_multiple' => 'Sei sicuro di voler eliminare i file o le cartelle di contenuti selezionate?',
        'delete_confirm_single' => 'Sei sicuro di voler eliminare questo file di contenuti?',
        'new' => 'Nuovo file di contenuti'
    ],
    'ajax_handler' => [
        'invalid_name' => "Nome del gestore AJAX non valido: :name.",
        'not_found' => "Il gestore AJAX ':name' non è stato trovato.",
    ],
    'cms' => [
        'menu_label' => "CMS"
    ],
    'sidebar' => [
        'add' => 'Aggiungi',
        'search' => 'Cerca...'
    ],
    'editor' => [
        'settings' => 'Impostazioni',
        'title' => 'Titolo',
        'new_title' => 'Titolo nuova pagina',
        'url' => 'URL',
        'filename' => 'Nome file',
        'layout' => 'Layout',
        'description' => 'Descrizione',
        'preview' => 'Anteprima',
        'meta' => 'Metadati',
        'meta_title' => 'Meta Titolo',
        'meta_description' => 'Meta Descrizione',
        'markup' => 'Marcatore',
        'code' => 'Codice',
        'content' => 'Contenuto',
        'hidden' => 'Nascosto',
        'hidden_comment' => 'Le pagine nascoste sono accessibili sono dagli utenti registrati.',
        'enter_fullscreen' => 'Visualizza a schermo intero',
        'exit_fullscreen' => 'Esci dalla visualizzazione a schermo intero'
    ],
    'asset' => [
        'menu_label' => "Assets",
        'drop_down_add_title' => 'Agiungi...',
        'drop_down_operation_title' => 'Azioni...',
        'upload_files' => 'Carica file(s)',
        'create_file' => 'Crea file',
        'create_directory' => 'Crea cartella',
        'rename' => 'Rinomina',
        'delete' => 'Elimina',
        'move' => 'Sposta',
        'new' => 'Nuovo file',
        'rename_popup_title' => 'Rinomina',
        'rename_new_name' => 'Nuovo nome',
        'invalid_path' => 'Il percorso può contenere solo numeri, lettere, spazi e i simboli seguenti: ._-/',
        'error_deleting_file' => 'Errore durante l\'eliminazione del file :name.',
        'error_deleting_dir_not_empty' => 'Errore durante l\'eliminazione della cartella :name. La cartella non è vuota.',
        'error_deleting_dir' => 'Errore durante l\'eliminazinoe della cartella :name.',
        'invalid_name' => 'Il nome può contenere solo numeri, lettere, spazi e i simboli seguenti: ._-',
        'original_not_found' => 'Il file o la cartella originali non sono stati trovati',
        'already_exists' => 'Un file o cartella con questo nome è già esistente',
        'error_renaming' => 'Errore nella rinominazione del file o della cartella',
        'name_cant_be_empty' => 'Il nome non può essere vuoto',
        'too_large' => 'Il file caricato è troppo grande. La dimensione massima consentita è :max_size',
        'type_not_allowed' => 'Solo i seguenti tipi di file sono consentiti: :allowed_types',
        'file_not_valid' => 'File non valido',
        'error_uploading_file' => 'Errore durante il caricamento del file ":name": :error',
        'move_please_select' => 'Seleziona',
        'move_destination' => 'Cartella di destinazione',
        'move_popup_title' => 'Sposta assets',
        'move_button' => 'Sposta',
        'selected_files_not_found' => 'Files selezionati non trovati.',
        'select_destination_dir' => 'Seleziona una cartella di destinazione',
        'destination_not_found' => 'Cartella di destinazione non trovata',
        'error_moving_file' => 'Errore durante lo spostamento del file :file',
        'error_moving_directory' => 'Errore durante lo spostamento della cartella :dir',
        'error_deleting_directory' => 'Errore durante l\'eliminazione della cartella originale :dir',
        'path' => 'Percorso'
    ],
    'component' => [
        'menu_label' => "Componenti",
        'unnamed' => "Senza nome",
        'no_description' => "Nessuna descrizione fornita",
        'alias' => "Alias",
        'alias_description' => "Un nome univoco fornito a questo componente quando utilizzato nella pagina o nel layout.",
        'validation_message' => "L'alias del componente è obbligatorio e può contenere solo lettere, numeri e underscores. L'alias deve iniziare con una lettera.",
        'invalid_request' => "Il modello non può essere salvato a causa di dati dei componenti non validi.",
        'no_records' => 'Nessun componente trovato',
        'not_found' => "Il componente ':name' non è stato trovato.",
        'method_not_found' => "Il componente ':name' non contiene il metodo ':method'.",
    ],
    'template' => [
        'invalid_type' => "Tipo di modello non valido.",
        'not_found' => "Il modello richiesto non è stato trovato.",
        'saved'=> "Il modello è stato salvato con successo."
    ],
    'permissions' => [
        'manage_content' => 'Gestisci contenuti',
        'manage_assets' => 'Gestisci assets',
        'manage_pages' => 'Gestisci pagine',
        'manage_layouts' => 'Gesstisci layouts',
        'manage_partials' => 'Gestisci viste parziali',
        'manage_themes' => 'Gestisci temi'
    ]
];
