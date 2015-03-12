<?php

return [
    'cms_object' => [
        'invalid_file' => 'Nume de fisier invalid: :name. Numele de fisiere pot sa contina doar caractere alfanumerice, linii si puncte. Unele exemple de nume de fisiere corecte: pagina_1.htm, pagina-2, subdirector/pagina',
        'invalid_property' => 'Proprietatea ":name" nu poate fi setata',
        'file_already_exists' => 'Fisierul ":name" deja exista.',
        'error_saving' => 'Eroare la salvarea fisierului ":name". Verificati permisiunile de scriere.',
        'error_creating_directory' => 'Eroare la crearea directorului :name. Verificati permisiunile de scriere.',
        'invalid_file_extension'=>'Extensie de fisier invalida: :invalid. Extensiile permise sunt: :allowed.',
        'error_deleting' => 'Eroare la stergerea fisierului sablon ":name". Verificati permisiunile de scriere.',
        'delete_success' => 'Sabloanele au fost sterse cu succes, in total: :count.',
        'file_name_required' => 'Campul nume fisier este necesar.'
    ],
    'theme' => [
        'active' => [
            'not_set' => "Tema activa nu este setata.",
            'not_found' => "Tema activa nu a fost gasita.",
        ],
        'edit' => [
            'not_set' => "Tema de editare nu este setata.",
            'not_found' => "Tema de editare nu a fost gasita.",
            'not_match' => "Obiectul pe care incercati sa-l accesati nu apartine temei care este in curs de editare. Va rugam reincarcati pagina."
        ],
        'settings_menu' => 'Tema Front-end',
        'settings_menu_description' => 'Previzualizati lista de teme instalate si selectati o tema activa.',
        'find_more_themes' => 'Gasiti mai multe teme in "Piata OctoberCMS".',
        'activate_button' => 'Activare',
        'active_button' => 'Activare',
    ],
    'page' => [
        'not_found' => [
            'label' => "Pagina negasita",
            'help' => "Pagina cautata nu a putut fi gasita.",
        ],
        'custom_error' => [
            'label' => "Eroare pagina",
            'help' => "Ne cerem scuze, dar a aparut o problema si pagina nu poate fi afisata.",
        ],
        'menu_label' => 'Pagini',
        'no_list_records' => 'Nu au fost gasite pagini',
        'new' => 'Pagina noua',
        'invalid_url' => 'Format URL invalid. URL-ul ar trebui sa inceapa cu un slash ( / ) si poate sa contina cifre, caractere latine si urmatoarele simboluri: ._-[]:?|/+*^$',
        'delete_confirm_multiple' => 'Vreti sa stergeti paginile selectate?',
        'delete_confirm_single' => 'Vreti sa stergeti aceasta pagina?',
        'no_layout' => '-- fara macheta --'
    ],
    'layout' => [
        'not_found_name' => "Macheta ':name' nu a fost gasita",
        'menu_label' => 'Machete',
        'no_list_records' => 'Nu au fost gasite machete',
        'new' => 'Macheta noua',
        'delete_confirm_multiple' => 'Vreti sa stergeti machetele selectate?',
        'delete_confirm_single' => 'Vreti sa stergeti macheta selectata?'
    ],
    'partial' => [
        'not_found_name' => "Componenta partiala ':name' nu a fost gasita.",
        'invalid_name' => "Nume invalid pentru componenta partiala: :name.",
        'menu_label' => 'Componente partiale',
        'no_list_records' => 'Nu au fost gasite componente partiale',
        'delete_confirm_multiple' => 'Vreti sa stergeti componentele partiale selectate?',
        'delete_confirm_single' => 'Vreti sa stergeti aceasta componenta partiala?',
        'new' => 'Componenta partiala noua'
    ],
    'content' => [
        'not_found_name' => "Fisierul de continut ':name' nu a fost gasit.",
        'menu_label' => 'Continut',
        'no_list_records' => 'Nu au fost gasite fisiere de continut',
        'delete_confirm_multiple' => 'Vreti sa stergeti fisierele si directoarele cu continut?',
        'delete_confirm_single' => 'Vreti sa stergeti acest fisier cu continut?',
        'new' => 'Fisier nou cu continut'
    ],
    'ajax_handler' => [
        'invalid_name' => "Nume Functie AJAX invalid: :name.",
        'not_found' => "Functia AJAX ':name' nu a fost gasita.",
    ],
    'cms' => [
        'menu_label' => "CMS"
    ],
    'sidebar' => [
        'add' => 'Adaugare',
        'search' => 'Cautare...'
    ],
    'editor' => [
        'settings' => 'Setari',
        'title' => 'Titlu',
        'new_title' => 'Titlu de pagina noua',
        'url' => 'URL',
        'filename' => 'Nume fisier',
        'layout' => 'Macheta',
        'description' => 'Descriere',
        'preview' => 'Previzualizare',
        'meta' => 'Meta',
        'meta_title' => 'Titlu Meta',
        'meta_description' => 'Descriere Meta',
        'markup' => 'Markup',
        'code' => 'Cod',
        'content' => 'Continut',
        'hidden' => 'Ascuns',
        'hidden_comment' => 'Fisierele ascunse sunt vizibile doar administratorilor logati in sistem',
        'enter_fullscreen' => 'Intrare in mod ecran complet',
        'exit_fullscreen' => 'Iesire din mod ecran complet'
    ],
    'asset' => [
        'menu_label' => "Fisiere design",
        'drop_down_add_title' => 'Adaure...',
        'drop_down_operation_title' => 'Actiune...',
        'upload_files' => 'Incarcare fisier(e)',
        'create_file' => 'Creare fisier',
        'create_directory' => 'Creare director',
        'rename' => 'Redenumire',
        'delete' => 'Stergere',
        'move' => 'Mutare',
        'new' => 'Fisier nou',
        'rename_popup_title' => 'Redenumire',
        'rename_new_name' => 'Nume nou',
        'invalid_path' => 'Calea poate sa contina doar cifre, caractere latine, spatii si urmatoarele simboluri: ._-/',
        'error_deleting_file' => 'Eroare la stergerea fisierului :name.',
        'error_deleting_dir_not_empty' => 'Eroare la stergerea directorului :name. Directorul nu este gol.',
        'error_deleting_dir' => 'Eroare la stergerea fisierului :name.',
        'invalid_name' => 'Numele poate sa contina doar cifre, caractere latine si urmatoarele simboluri: ._-',
        'original_not_found' => 'Fisierul sau directorul original nu a fost gasit',
        'already_exists' => 'Fisierul sau directorul cu acest nume exista deja',
        'error_renaming' => 'Eroare la redenumirea fisierului sau directorului',
        'name_cant_be_empty' => 'Numele nu poate fi gol',
        'too_large' => 'Fisierul incarcat este prea mare. Dimensiunea maxima permisa este: :max_size',
        'type_not_allowed' => 'Doar urmatoarele tipuri de fisiere sunt permise: :allowed_types',
        'file_not_valid' => 'Fisierul nu este valid',
        'error_uploading_file' => 'Eroare la incarcarea fisierului ":name", eroare: :error',
        'move_please_select' => 'selectati',
        'move_destination' => 'Director destinatie',
        'move_popup_title' => 'Mutare fisiere',
        'move_button' => 'Mutare',
        'selected_files_not_found' => 'Fisierele selectate nu au fost gasite',
        'select_destination_dir' => 'Selectati un director pentru destinatie',
        'destination_not_found' => 'Directorul destinatie nu a fost gasit',
        'error_moving_file' => 'Eroare la mutarea fisierului :file',
        'error_moving_directory' => 'Eroare la mutarea directorului :dir',
        'error_deleting_directory' => 'Eroare la stergerea directorului original :dir',
        'path' => 'Cale'
    ],
    'component' => [
        'menu_label' => "Componente",
        'unnamed' => "Fara nume",
        'no_description' => "Nicio descriere furnizata",
        'alias' => "Alias",
        'alias_description' => "Numele unic dat acestei componente atunci cand este folosita intr-o pagina sau intr-o macheta.",
        'validation_message' => "Aliasul componentei este necesar si poate sa contina doar caractere latine, cifre si caractere underscore. Denumirile are trebui sa inceapa cu un caracter latin.",
        'invalid_request' => "Sablonul nu a putut fi salvat din cauza datelor invalide ale componentei.",
        'no_records' => 'Nicio componenta nu a fost gasita',
        'not_found' => "Componenta ':name' nu a fost gasita.",
        'method_not_found' => "Componenta ':name' nu contine nicio metoda ':method'.",
    ],
    'template' => [
        'invalid_type' => "Tip de sablon necunoscut.",
        'not_found' => "Sablonul solicitat nu a fost gasit.",
        'saved'=> "Sablonul a fost salvat cu succes."
    ],
    'permissions' => [
        'manage_content' => 'Gestioneaza continut',
        'manage_assets' => 'Gestioneaza fisiere design',
        'manage_pages' => 'Gestioneaza pagini',
        'manage_layouts' => 'Gestioneaza machete',
        'manage_partials' => 'Gestioneaza componente partiale',
        'manage_themes' => 'Gestioneaza teme'
    ]
];
