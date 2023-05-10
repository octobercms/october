<?php return [
  'cms_object' => [
    'invalid_file' => 'Nom de fichier invalide : :name. Les noms de fichiers ne peuvent contenir que des caractères alphanumériques, des tirets bas, des tirets et des points. Voici des exemples de noms de fichiers valides : page.htm, ma-page, sous_repertoire/nouvelle.page',
    'invalid_file_inspector' => 'Nom de fichier invalide. Les noms de fichiers ne peuvent contenir seulement des caractères alphanumeriques, des sous-tirets, tirets and points. Quelques exemples de noms de fichiers valides: page.htm, page, subdirectory/page',
    'invalid_property' => 'L’attribut ":name" ne peut pas être défini',
    'file_already_exists' => 'Le fichier ":name" existe déjà.',
    'error_saving' => 'Erreur lors de l’enregistrement du fichier ":name". Veuillez vérifier les permissions en écriture.',
    'error_creating_directory' => 'Erreur lors de la création du répertoire :name. Veuillez vérifier les permissions en écriture.',
    'invalid_file_extension' => 'Extension de fichier invalide : :invalid. Les extensions autorisées sont : :allowed.',
    'error_deleting' => 'Erreur lors de la suppression du modèle ":name". Veuillez vérifier les permissions en écriture.',
    'delete_success' => 'Les modèles ont été supprimés avec succès : :count.',
    'file_name_required' => 'Le nom du fichier est requis.',
    'safe_mode_enabled' => 'Le mode protégé est activé.',
  ],
  'dashboard' => [
    'active_theme' => [
      'widget_title_default' => 'Site Web',
      'online' => 'En ligne',
      'maintenance' => 'En cours de maintenance',
      'manage_themes' => 'Gestion des thèmes',
      'customize_theme' => 'Personnaliser le thème',
    ],
  ],
  'theme' => [
    'active' => [
      'not_set' => 'Aucun thème n’est activé.',
      'not_found' => 'Le thème activé est introuvable.',
      'is_locked' => 'Le thème \':theme\' est verrouillé et ne peut pas être utilisé. Veuillez dupliquer ce thème ou créer un thème enfant.',
    ],
    'edit' => [
      'not_set' => 'Le thème à modifier n’est pas activé.',
      'not_found' => 'Le thème à modifier est introuvable.',
      'not_match' => 'L’objet auquel vous souhaitez accéder n’appartient pas au thème en cours de modification. Veuillez recharger la page.',
    ],
    'setting_edit_theme' => 'Changement de thème d’édition',
    'edit_theme_changed' => 'thème d’édition changé',
  ],
  'maintenance' => [],
  'page' => [
    'not_found_name' => 'La page ":name" est introuvable',
    'not_found' => [
      'label' => 'La page est introuvable',
      'help' => 'La page demandée est introuvable.',
    ],
    'custom_error' => [
      'label' => 'Erreur sur la page',
      'help' => 'Nous sommes désolés, un problème est survenu et la page ne peut être affichée.',
    ],
    'menu_label' => 'Pages',
    'unsaved_label' => 'Page(s) non enregistrée(s)',
    'no_list_records' => 'Aucune page n’a été trouvée',
    'new' => 'Nouvelle page',
    'invalid_url' => 'Format d’adresse URL invalide. L’adresse URL doit commencer par un / et ne peut contenir que des chiffres, des lettres et les symboles suivants : ._-[]:?|/+*^$',
    'delete_confirm_multiple' => 'Confirmer la suppression des pages sélectionnées ?',
    'delete_confirm_single' => 'Confirmer la suppression de cette page ?',
    'no_layout' => '-- aucune maquette --',
    'title' => 'Titre de la page',
    'url' => 'URL de la page',
    'url_required' => 'L’adresse URL de la page est requise.',
    'file_name' => 'Nom du fichier de la page',
    'editor_node_name' => 'Pages',
    'editor_sorting' => 'Trier les Pages',
    'editor_sort_by_url' => 'URL',
    'editor_sort_by_title' => 'Titre',
    'editor_sort_by_file_name' => 'Nom de fichier',
    'editor_grouping' => 'Grouper les Pages',
    'editor_group_by_filepath' => 'Emplacement du fichier',
    'editor_group_by_url' => 'URL',
    'editor_display' => 'Afficher',
    'editor_display_title' => 'Titre',
    'editor_display_url' => 'URL',
    'editor_display_file' => 'Emplacement du fichier',
    'editor_markup' => 'Styles',
    'editor_code' => 'Code',
    'description_hint' => 'Le description est optionelle et seulement visible dans l’interface d’administration.',
    'create_new' => 'Nouvelle Page',
  ],
  'layout' => [
    'not_found_name' => 'La maquette ":name" est introuvable',
    'menu_label' => 'Maquettes',
    'unsaved_label' => 'Maquette(s) non enregistrée(s)',
    'no_list_records' => 'Aucune maquette n’a été trouvée',
    'new' => 'Nouvelle maquette',
    'delete_confirm_multiple' => 'Confirmer la suppression des maquettes sélectionnées ?',
    'delete_confirm_single' => 'Confirmer la suppression de cette maquette ?',
    'editor_node_name' => 'Maquettes',
    'create_new' => 'Nouvelle Maquette',
  ],
  'partial' => [
    'not_found_name' => 'Le modèle partiel ":name" est introuvable.',
    'invalid_name' => 'Nom du modèle partiel invalide : :name.',
    'menu_label' => ' Modèles partiels',
    'unsaved_label' => 'Modèle(s) partiel(s) non enregistré(s)',
    'no_list_records' => 'Aucun modèle partiel n’a été trouvé',
    'delete_confirm_multiple' => 'Confirmer la suppression des modèles partiels sélectionnés ?',
    'delete_confirm_single' => 'Confirmer la suppression de ce modèle partiel ?',
    'editor_node_name' => 'Modèles partiels',
    'new' => 'Nouveau modèle partiel',
    'create_new' => 'Nouveau modèle partiel',
  ],
  'content' => [
    'not_found_name' => 'Le fichier de contenu ":name" est introuvable.',
    'menu_label' => 'Contenu',
    'unsaved_label' => 'Contenu non enregistré',
    'no_list_records' => 'Aucun fichier de contenu n’a été trouvé',
    'delete_confirm_multiple' => 'Confirmer la suppression des fichiers de contenu ou répertoires sélectionnés ?',
    'delete_confirm_single' => 'Confirmer la suppression de ce fichier de contenu ?',
    'editor_node_name' => 'Fichiers de contenu',
    'new' => 'Nouveau fichier de contenu',
    'editor_content' => 'Fichier de contenu',
  ],
  'ajax_handler' => [
    'invalid_name' => 'Nom du gestionnaire AJAX invalide : :name.',
    'not_found' => 'Le gestionnaire AJAX ":name" est introuvable.',
  ],
  'cms' => [
    'menu_label' => 'CMS',
  ],
  'sidebar' => [
    'add' => 'Ajouter',
    'search' => 'Rechercher…',
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
    'page' => 'Page CMS',
    'edit_theme' => 'Editer le Thème',
    'change_edit_theme' => 'Changer de thème d’édition',
    'edit_theme_saved_changed_tabs' => 'Vous avez des modifications non sauvegardées dans des onglets ouverts. Veuillez les enregistrer ou fermer ces onglets pour procéder.',
    'partial' => 'Modèle partiel CMS',
    'meta' => 'Meta',
    'meta_title' => 'Meta Titre',
    'meta_description' => 'Meta Description',
    'markup' => 'Balisage',
    'code' => 'Code',
    'content' => 'Contenu',
    'asset' => 'Fichiers sources',
    'hidden' => 'Masquée',
    'hidden_comment' => 'Les pages masquées sont seulement accessibles aux administrateurs connectés.',
    'priority' => 'Priorité',
    'priority_comment' => 'Les maquettes prioritaires chargent leurs contenus avant les contenus de la page.',
    'enter_fullscreen' => 'Activer le mode plein écran',
    'exit_fullscreen' => 'Annuler le mode plein écran',
    'open_searchbox' => 'Ouvrir la boîte de dialogue Rechercher',
    'open_replacebox' => 'Ouvrir la boîte de dialogue Remplacer',
    'commit' => 'Envoyer',
    'reset' => 'Rétablir',
    'commit_confirm' => 'Êtes-vous sûr de vouloir envoyer vos changements apportés à ce fichier au système de fichier ? Cela écrasera le fichier existant sur le système de fichier',
    'reset_confirm' => 'Êtes-vous sûr de vouloir rétablir ce fichier depuis la version présente sur le système de fichier ? Cela le remplacera totalement par la version présente sur le système de fichier',
    'committing' => 'Envoi',
    'resetting' => 'Rétablissement',
    'commit_success' => 'Le :type a été envoyé au système de fichier',
    'reset_success' => 'Le :type a été rétabli depuis la version du système de fichier',
    'error_loading_header' => 'Erreur en chargeant la maquette',
    'component_list' => 'Composants',
    'component_list_description' => 'Pour ajouter un composant, cliquez-le ou traînez-le dans l’éditeur.',
    'info' => 'Informations',
    'refresh' => 'Rafraîchir',
    'create' => 'Créer',
    'manage_themes' => 'Gérer les thèmes',
    'error_no_doctype_permissions' => 'Vous n’avez pas la permission de gérer ce type de documents: :doctype',
  ],
  'asset' => [
    'menu_label' => 'Assets',
    'unsaved_label' => 'Asset(s) non sauvegardé(s)',
    'drop_down_add_title' => 'Ajouter…',
    'drop_down_operation_title' => 'Action…',
    'upload_files' => 'Déposer des fichiers',
    'create_file' => 'Créer un fichier',
    'create_directory' => 'Créer un répertoire',
    'directory_popup_title' => 'Nouveau répertoire',
    'directory_name' => 'Nom du répertoire',
    'directory_name_required' => 'Le nom du répertoire est requis.',
    'rename_name_required' => 'Le nom est requis',
    'rename' => 'Renommer',
    'delete' => 'Supprimer',
    'move' => 'Déplacer',
    'moving' => 'Déplacement des éléments sélectionnés',
    'moved' => 'Déplacé avec succès',
    'saved' => 'Fichier enregistré',
    'deleted' => 'Fichier supprimé',
    'select' => 'Sélectionner',
    'new' => 'Nouveau fichier',
    'rename_popup_title' => 'Renommer',
    'rename_new_name' => 'Nouveau nom',
    'invalid_path' => 'Le chemin doit contenir uniquement des chiffres, des lettres, des espaces et les symboles suivants : ._-/',
    'error_deleting_file' => 'Erreur lors de la suppression du fichier :name.',
    'error_deleting_dir_not_empty' => 'Erreur lors de la suppression du répertoire :name. Le répertoire n’est pas vide.',
    'error_deleting_dir' => 'Erreur lors de la suppression du répertoire :name.',
    'invalid_name' => 'Le nom doit contenir uniquement des chiffres, des lettres, des espaces et les symboles suivants : ._-',
    'original_not_found' => 'Le fichier original ou son répertoire est introuvable',
    'already_exists' => 'Un fichier ou un répertoire avec le même nom existe déjà',
    'error_renaming' => 'Erreur lors du renommage du fichier ou du répertoire',
    'name_cant_be_empty' => 'Le nom ne peut être vide',
    'type_not_allowed' => 'Les types de fichiers autorisés sont les suivants : :allowed_types',
    'error_uploading_file' => 'Erreur lors du dépôt du fichier ":name" : :error',
    'move_please_select' => 'Faire une sélection',
    'move_destination' => 'Répertoire de destination',
    'move_popup_title' => 'Déplacer les assets',
    'move_button' => 'Déplacer',
    'no_list_records' => 'Aucun fichier trouvé',
    'path' => 'Chemin',
    'editor_node_name' => 'Sources',
    'open' => 'Ouvert',
  ],
  'component' => [
    'menu_label' => 'Composants',
    'invalid_request' => 'Le modèle ne peut être enregistré car les données d’un composant ne sont pas valides.',
    'no_records' => 'Aucun composant n’a été trouvé',
    'not_found' => 'Le composant ":name" est introuvable.',
    'method_not_found' => 'Le composant ":name" ne contient pas de méthode ":method".',
    'expand_or_collapse' => 'Ouvrir ou fermer la liste des composants',
    'remove' => 'Retirer le composant',
    'expand_partial' => 'Ouvrir le partiel du composant',
  ],
  'template' => [
    'invalid_type' => 'Type de modèle inconnu.',
    'not_found' => 'Le modèle est introuvable.',
    'saved' => 'Le modèle a été sauvegardé avec succès.',
    'saved_to_db' => 'Le modèle a été sauvegardé en base de données.',
    'file_updated' => 'Le modèle a été mis à jour.',
    'reset_from_template_success' => 'Le modèle a été réinitialisé à partir du fichier.',
    'reloaded' => 'Modèle rechargé.',
    'deleted' => 'Modèle supprimé.',
    'no_list_records' => 'Aucun enregistrement trouvé',
    'delete_confirm' => 'Supprimer les modèles sélectionnés ?',
    'order_by' => 'Trier par',
    'last_modified' => 'Modifié le',
    'storage' => 'Stockage',
    'template_file' => 'Fichier du modèle',
    'storage_filesystem' => 'Fichier système',
    'storage_database' => 'Base de données',
    'update_file' => 'Mettre à jour le fichier du modèle',
    'reset_from_file' => 'Réinitialiser à partir du fichier',
  ],
  'permissions' => [
    'name' => 'CMS',
    'manage_content' => 'Gérer le contenu du site web',
    'manage_assets' => 'Gérer les assets site web - images, fichiers JavaScript et CSS',
    'manage_pages' => 'Créer, modifier et supprimer des pages du site web',
    'manage_layouts' => 'Créer, modifier et supprimer des maquettes du CMS',
    'manage_partials' => 'Créer, modifier et supprimer des modèles partiels du CMS',
    'manage_themes' => 'Activer, désactiver et configurer les thèmes',
    'manage_theme_options' => 'Gérer les options de personnalisation du thème actif',
  ],
  'theme_log' => [
    'hint' => 'Ce journal affiche tous les changements faits sur le thème actif par les administrateurs via le panneau d’administration.',
    'menu_label' => 'Journal du thème',
    'menu_description' => 'Affiche la liste des modifications apportées au thème actif.',
    'empty_link' => 'Purger le journal du thème',
    'empty_loading' => 'Purge du journal du thème...',
    'empty_success' => 'Journal du thème purgé avec succès',
    'return_link' => 'Retourner au journal du thème',
    'id' => 'ID',
    'id_label' => 'ID du journal',
    'created_at' => 'Date & Heure',
    'user' => 'Utilisateur',
    'type' => 'Type',
    'type_create' => 'Créer',
    'type_update' => 'Modifier',
    'type_delete' => 'Supprimer',
    'theme_name' => 'Thème',
    'theme_code' => 'Code du thème',
    'old_template' => 'Modèle (Ancien)',
    'new_template' => 'Modèle (Nouveau)',
    'template' => 'Modèle',
    'diff' => 'Changements',
    'old_value' => 'Ancienne valeur',
    'new_value' => 'Nouvelle valeur',
    'preview_title' => 'Changement du modèle',
    'template_updated' => 'Le modèle a été modifié',
    'template_created' => 'Le modèle a été créé',
    'template_deleted' => 'Le modèle a été supprimé',
  ],
];
