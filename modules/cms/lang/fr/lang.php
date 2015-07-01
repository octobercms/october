<?php

return [
    'cms_object' => [
        'invalid_file' => 'Nom de fichier invalide : :name. Les noms de fichiers ne peuvent contenir que des caractères alphanumériques, des tiret bas, des tirets et des points. Voir ces exemples de noms de fichiers valides : page.htm, page, subdirectory/page',
        'invalid_property' => 'L’attribut ":name" ne peut pas être défini',
        'file_already_exists' => 'Le fichier ":name" existe déjà.',
        'error_saving' => 'Erreur lors de l’enregistrement du fichier ":name".',
        'error_creating_directory' => 'Erreur lors de la création du répertoire :name',
        'invalid_file_extension' => 'Extension de fichier invalide : :invalid. Les extensions autorisées sont : :allowed.',
        'error_deleting' => 'Erreur lors de la suppression du modèle ":name".',
        'delete_success' => 'Les modèles ont été supprimés avec succès : :count.',
        'file_name_required' => 'Le nom du fichier est requis.'
    ],
    'theme' => [
        'active' => [
            'not_set' => 'Aucun thème n’est activé.',
            'not_found' => 'Le thème activé est introuvable.',
        ],
        'edit' => [
            'not_set' => 'Le thème de rédaction n’est pas activé.',
            'not_found' => 'Le thème de rédaction est introuvable.',
            'not_match' => 'L’objet actuellement ouvert n’appartient pas au thème en cours de modification. Merci de recharger la page.'
        ],
        'settings_menu' => 'Frontal du thème',
        'settings_menu_description' => 'Aperçu des thèmes installés et sélection du thème actif.',
        'find_more_themes' => 'Trouver davantage de thèmes sur le site du CMS October.',
        'activate_button' => 'Activer',
        'active_button' => 'Activer',
    ],
    'page' => [
        'not_found' => [
            'label' => 'La page est introuvable',
            'help' => 'La page demandée est introuvable.',
        ],
        'custom_error' => [
            'label' => 'Erreur sur la page',
            'help' => 'Nous sommes désolés, un problème est survenu et la page ne peut être affichée.',
        ],
        'menu_label' => 'Pages',
        'no_list_records' => 'Aucune page n’a été trouvée',
        'new' => 'Nouvelle page',
        'invalid_url' => 'Format d’adresse URL invalide. L’adresse URL doit commencer par un / et peut contenir des chiffres, des lettres et les symboles suivants : ._-[]:?|/+*^$',
        'delete_confirm_multiple' => 'Confirmer la suppression des pages sélectionnées ?',
        'delete_confirm_single' => 'Confirmer la suppression de cette page ?',
        'no_layout' => '-- aucune  maquette --'
    ],
    'layout' => [
        'not_found_name' => 'La maquette ":name" est introuvable',
        'menu_label' => 'Maquettes',
        'no_list_records' => 'Aucune maquette n’a été trouvée',
        'new' => 'Nouvelle maquette',
        'delete_confirm_multiple' => 'Confirmer la suppression des maquettes sélectionnées ?',
        'delete_confirm_single' => 'Confirmer la suppression de cette maquette ?'
    ],
    'partial' => [
        'not_found_name' => 'Le modèle partiel ":name" est introuvable.',
        'invalid_name' => 'Nom du modèle partiel invalide : :name.',
        'menu_label' => ' Modèles partiels',
        'no_list_records' => 'Aucun  modèle partiel n’a été trouvé',
        'delete_confirm_multiple' => 'Confirmer la suppression des modèles partiels sélectionnés ?',
        'delete_confirm_single' => 'Confirmer la suppression de ce modèle partiel ?',
        'new' => 'Nouveau modèle partiel'
    ],
    'content' => [
        'not_found_name' => 'Le fichier de contenu ":name" est introuvable.',
        'menu_label' => 'Contenu',
        'no_list_records' => 'Aucun fichier de contenu n’a été trouvé',
        'delete_confirm_multiple' => 'Confirmer la suppression des fichiers de contenu ou répertoires sélectionnés ?',
        'delete_confirm_single' => 'Confirmer la suppression de ce fichier de contenu ?',
        'new' => 'Nouveau fichier de contenu'
    ],
    'ajax_handler' => [
        'invalid_name' => 'Nom du gestionnaire AJAX invalide : :name.',
        'not_found' => 'Le gestionnaire AJAX ":name" est introuvable.',
    ],
    'cms' => [
        'menu_label' => 'CMS'
    ],
    'sidebar' => [
        'add' => 'Ajouter',
        'search' => 'Rechercher…'
    ],
    'editor' => [
        'settings' => 'Configuration',
        'title' => 'Titre',
        'new_title' => 'Nouveau titre de la page',
        'url' => 'Adresse URL',
        'filename' => 'Nom du fichier',
        'layout' => 'Maquette',
        'description' => 'Description',
        'preview' => 'Aperçu',
        'meta' => 'Meta',
        'meta_title' => 'Meta Titre',
        'meta_description' => 'Meta Description',
        'markup' => 'Balisage',
        'code' => 'Code',
        'content' => 'Contenu',
        'hidden' => 'Caché',
        'hidden_comment' => 'Les pages cachées sont seulement accessibles aux administrateurs connectés.'
    ],
    'asset' => [
        'menu_label' => 'Assets',
        'drop_down_add_title' => 'Ajouter…',
        'drop_down_operation_title' => 'Action…',
        'upload_files' => 'Télécharger un fichier',
        'create_file' => 'Créer un fichier',
        'create_directory' => 'Créer un répertoire',
        'rename' => 'Renommer',
        'delete' => 'Supprimer',
        'move' => 'Déplacer',
        'new' => 'Nouveau fichier',
        'rename_popup_title' => 'Renommer',
        'rename_new_name' => 'Nouveau nom',
        'invalid_path' => 'Le chemin doit contenir uniquement des chiffres, des lettres, des espaces et les symboles suivants : ._-/',
        'error_deleting_file' => 'Erreur lors de la suppression du fichier :name.',
        'error_deleting_dir_not_empty' => 'Erreur lors de la suppression du répertoire :name. Le répertoire n’est pas vide.',
        'error_deleting_dir' => 'Erreur lors de la suppression du répertoire :name.',
        'invalid_name' => 'Le nom doit contenir uniquement des chiffres, des lettres, des espaces et les symboles suivants : ._-',
        'original_not_found' => 'Le fichier original ou son répertoire est introuvable',
        'already_exists' => 'Un fichier ou un répertoire avec le même nom existe déjà',
        'error_renaming' => 'Erreur pour renommer le fichier ou le répertoire',
        'name_cant_be_empty' => 'Le nom ne peut être vide',
        'too_large' => 'Le fichier téléchargé est trop grand. La taille maximum autorisée est de :max_size',
        'type_not_allowed' => 'Les types de fichiers autorisés sont les suivants : :allowed_types',
        'file_not_valid' => 'Fichier invalide',
        'error_uploading_file' => 'Erreur lors du téléchargement du fichier ":name" : :error',
        'move_please_select' => 'Faire une sélection',
        'move_destination' => 'Répertoire de destination',
        'move_popup_title' => 'Déplacer les assets',
        'move_button' => 'Déplacer',
        'selected_files_not_found' => 'Les fichiers sélectionnés sont introuvables',
        'select_destination_dir' => 'Veuillez sélectionner un répertoire de destination',
        'destination_not_found' => 'Le répertoire de destination est introuvable',
        'error_moving_file' => 'Erreur lors du déplacement du fichier :file',
        'error_moving_directory' => 'Erreur lors du déplacement du répertoire :dir',
        'error_deleting_directory' => 'Erreur lors de la suppression du répertoire d’origine :dir',
        'path' => 'Chemin'
    ],
    'component' => [
        'menu_label' => 'Composants',
        'unnamed' => 'Sans nom',
        'no_description' => 'Aucune description n’a été fournie',
        'alias' => 'Alias',
        'alias_description' => 'Nom unique fourni lors de l’utilisation du composant sur une page ou une maquette.',
        'validation_message' => 'Les alias du composant sont requis et ne peuvent contenir uniquement des symboles latins, des chiffres et des tirets bas. Les alias doivent commencer par un symbole latin.',
        'invalid_request' => 'Le modèle ne peut être enregistré puisque les données d’un composant sont invalides.',
        'no_records' => 'Aucun composant n’a été trouvé',
        'not_found' => 'Le composant ":name" est introuvable.',
        'method_not_found' => 'Le composant ":name" ne contient pas de méthode ":method".',
    ],
    'template' => [
        'invalid_type' => 'Type de modèle inconnu.',
        'not_found' => 'Le modèle demandé est introuvable.',
        'saved'=> 'Le modèle demandé a été sauvegardé avec succès.'
    ]
];
