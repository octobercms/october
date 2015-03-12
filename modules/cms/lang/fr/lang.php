<?php

return [
    'cms_object' => [
        'invalid_file' => 'Nom de fichier invalide: :name. Les noms de fichiers ne peuvent contenir que des caractères alphanumériques, des underscores, des tirets et des points. Quelques exemples de noms de fichier valides: page.htm, page, subdirectory/page',
        'invalid_property' => 'L\'attribut ":name" ne peut pas être défini',
        'file_already_exists' => 'Le fichier ":name" existe déjà.',
        'error_saving' => 'Erreur lors de l\'enregistrement du fichier ":name".',
        'error_creating_directory' => 'Erreur lors de la création du répertoire :name',
        'invalid_file_extension' => 'Extension de fichier invalide: :invalid. Les extensions autorisées sont: :allowed.',
        'error_deleting' => 'Erreur lors de la suppression du template ":name".',
        'delete_success' => 'Les templates ont été supprimés avec succès: :count.',
        'file_name_required' => 'Le nom du fichier est requis.'
    ],
    'theme' => [
        'active' => [
            'not_set' => "Aucun thème activé.",
            'not_found' => "Thème activé introuvable.",
        ],
        'edit' => [
            'not_set' => "Le thème d'édition n'est pas activé.",
            'not_found' => "Thème d'édition introuvable.",
            'not_match' => "L'objet auquel vous essayez d'accéder n'appartient pas au thème en cours d'édition. Veuillez recharger la page."
        ],
        'settings_menu' => 'Front-end theme',
        'settings_menu_description' => 'Aperçu des thèmes installés et sélection du thème actif.',
        'find_more_themes' => 'Trouvez plus de thèmes sur le marketplace de OctoberCMS.',
        'activate_button' => 'Activer',
        'active_button' => 'Activer',
    ],
    'page' => [
        'not_found' => [
            'label' => "Page introuvable",
            'help' => "La page demandée est introuvable.",
        ],
        'custom_error' => [
            'label' => "Erreur sur la page",
            'help' => "Nous sommes désolés, un problème est survenu et la page ne peut être affichée.",
        ],
        'menu_label' => 'Pages',
        'no_list_records' => 'Aucune page trouvée',
        'new' => 'Nouvelle page',
        'invalid_url' => 'Format d\'URL invalide. L\'URL doit commencer par un / et peut contenit des chiffres, des lettres et les symboles suivants: ._-[]:?|/+*^$',
        'delete_confirm_multiple' => 'Voulez-vous vraiment supprimer les pages sélectionnées ?',
        'delete_confirm_single' => 'Voulez-vous vraiment supprimer cette page ?',
        'no_layout' => '-- aucun layout --'
    ],
    'layout' => [
        'not_found_name' => "Le layout ':name' est introuvable",
        'menu_label' => 'Layouts',
        'no_list_records' => 'Aucun layout trouvé',
        'new' => 'Nouveau layout',
        'delete_confirm_multiple' => 'Voulez-vous vraiment supprimer les layouts sélectionnés ?',
        'delete_confirm_single' => 'Voulez-vous vraiment supprimer ce layout ?'
    ],
    'partial' => [
        'not_found_name' => "Le partial ':name' est introuvable.",
        'invalid_name' => "nom de partial invalide: :name.",
        'menu_label' => 'Partials',
        'no_list_records' => 'Aucun partial trouvé',
        'delete_confirm_multiple' => 'Voulez-vous vraiment supprimer les partials sélectionnés ?',
        'delete_confirm_single' => 'Voulez-vous vraiment supprimer ce partial ?',
        'new' => 'Nouveau partial'
    ],
    'content' => [
        'not_found_name' => "Le fichier de contenu ':name' est introuvable.",
        'menu_label' => 'Contenu',
        'no_list_records' => 'Aucun fichier de contenu trouvé',
        'delete_confirm_multiple' => 'Voulez-vous vraiment supprimer les fichiers de contenu ou répertoires sélectionnés ?',
        'delete_confirm_single' => 'Voulez-vous vraiment supprimer ce fichier de contenu ?',
        'new' => 'Nouveau fichier de contenu'
    ],
    'ajax_handler' => [
        'invalid_name' => "Nom de gestionnaire AJAX invalide: :name.",
        'not_found' => "Le gestionnaire AJAX ':name' est introuvable.",
    ],
    'cms' => [
        'menu_label' => "CMS"
    ],
    'sidebar' => [
        'add' => 'Ajouter',
        'search' => 'Rechercher...'
    ],
    'editor' => [
        'settings' => 'Configuration',
        'title' => 'Titre',
        'new_title' => 'Nouveau titre de page',
        'url' => 'URL',
        'filename' => 'Nom de fichier',
        'layout' => 'Layout',
        'description' => 'Description',
        'preview' => 'Aperçu',
        'meta' => 'Meta',
        'meta_title' => 'Meta Titre',
        'meta_description' => 'Meta Description',
        'markup' => 'Markup',
        'code' => 'Code',
        'content' => 'Contenu',
        'hidden' => 'Caché',
        'hidden_comment' => 'Les pages cachées sont seulement accessibles par les administrateurs connectés.'
    ],
    'asset' => [
        'menu_label' => "Assets",
        'drop_down_add_title' => 'Ajouter...',
        'drop_down_operation_title' => 'Action...',
        'upload_files' => 'Uploader un fichier',
        'create_file' => 'Créer un fichier',
        'create_directory' => 'Créer un répertoire',
        'rename' => 'Renommer',
        'delete' => 'Supprimer',
        'move' => 'Déplacer',
        'new' => 'Nouveau fichier',
        'rename_popup_title' => 'Renommer',
        'rename_new_name' => 'Nouveau nom',
        'invalid_path' => 'Le chemin ne peut contenir que des chiffres, des lettres, des espaces et les symboles suivants: ._-/',
        'error_deleting_file' => 'Erreur lors de la suppression du fichier :name.',
        'error_deleting_dir_not_empty' => 'Erreur lors de la suppression du répertoire :name. Le répertoire n\'est pas vide.',
        'error_deleting_dir' => 'Erreur lors de la suppression du répertoire :name.',
        'invalid_name' => 'Le nom ne peut contenir que des chiffres, des lettres, des espaces et les symboles suivants: ._-',
        'original_not_found' => 'Le fichier original ou le répertoire est introuvable',
        'already_exists' => 'Un fichier ou un répertoire avec le même nom existe déjà',
        'error_renaming' => 'Erreur lors du renommage du fichier ou du répertoire',
        'name_cant_be_empty' => 'Le nom ne peut être vide',
        'too_large' => 'Le fichier uploadé est trop grand. La taille maximum autorisée est :max_size',
        'type_not_allowed' => 'Seuls les types de fichier suivants sont autorisés: :allowed_types',
        'file_not_valid' => 'Fichier invalide',
        'error_uploading_file' => 'Erreur lors de l\'upload du fichier ":name": :error',
        'move_please_select' => 'veuillez sélectionner',
        'move_destination' => 'Répertoire de destination',
        'move_popup_title' => 'Déplacer les assets',
        'move_button' => 'Déplacer',
        'selected_files_not_found' => 'Fichiers sélectionnés introuvables',
        'select_destination_dir' => 'Veuillez sélectionner un répertoire de destination',
        'destination_not_found' => 'Le répertoire de destination est introuvable',
        'error_moving_file' => 'Erreur lors du déplacement du fichier :file',
        'error_moving_directory' => 'Erreur lors du déplacement du répertoire :dir',
        'error_deleting_directory' => 'Erreur lors de la suppression du répertoire d\'origine :dir',
        'path' => 'Chemin'
    ],
    'component' => [
        'menu_label' => "Composants",
        'unnamed' => "Sans nom",
        'no_description' => "Aucune description fournie",
        'alias' => "Alias",
        'alias_description' => "Un nom unique donné lors de l\'utilisation du composant sur une page ou un layout.",
        'validation_message' => "Les alias de composant sont requis et ne peuvent contenit que des symboles latins, des chiffres et des underscores. Les alias devraient commencer par un symbole latin.",
        'invalid_request' => "Le template ne peut être enregistré à cause de données invalides d'un composant.",
        'no_records' => 'Aucun composant trouvé',
        'not_found' => "Le composant ':name' est introuvable.",
        'method_not_found' => "Le composant ':name' ne contient pas de méthode ':method'.",
    ],
    'template' => [
        'invalid_type' => "Type de template inconnu.",
        'not_found' => "Le template demandé est introuvable.",
        'saved'=> "Le template demandé a été sauvegardé avec succès."
    ]
];
