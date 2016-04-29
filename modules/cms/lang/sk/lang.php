<?php

return [
    'cms_object' => [
        'invalid_file' => 'Invalid file name: :name. File names can contain only alphanumeric symbols, underscores, dashes and dots. Some examples of correct file names: page.htm, page, subdirectory/page',
        'invalid_property' => "The property ':name' cannot be set",
        'file_already_exists' => "File ':name' already exists.",
        'error_saving' => "Error saving file ':name'. Please check write permissions.",
        'error_creating_directory' => 'Error creating directory :name. Please check write permissions.',
        'invalid_file_extension'=>'Invalid file extension: :invalid. Allowed extensions are: :allowed.',
        'error_deleting' => "Error deleting the template file ':name'. Please check write permissions.",
        'delete_success' => 'Templates deleted: :count.',
        'file_name_required' => 'The File Name field is required.'
    ],
    'theme' => [
        'active' => [
            'not_set' => 'The active theme is not set.',
            'not_found' => 'The active theme is not found.'
        ],
        'edit' => [
            'not_set' => 'The edit theme is not set.',
            'not_found' => 'The edit theme is not found.',
            'not_match' => "The object you're trying to access doesn't belong to the theme being edited. Please reload the page."
        ],
        'settings_menu' => 'Front-end theme',
        'settings_menu_description' => 'Preview the list of installed themes and select an active theme.',
        'find_more_themes' => 'Find more themes on OctoberCMS Theme Marketplace.',
        'activate_button' => 'Activate',
        'active_button' => 'Activate',
        'customize_button' => 'Customize'
    ],
    'maintenance' => [
        'settings_menu' => 'Maintenance mode',
        'settings_menu_description' => 'Configure the maintenance mode page and toggle the setting.',
        'is_enabled' => 'Enable maintenance mode',
        'is_enabled_comment' => 'When activated website visitors will see the page chosen below.'
    ],
    'page' => [
        'not_found' => [
            'label' => 'Page not found',
            'help' => 'The requested page cannot be found.'
        ],
        'custom_error' => [
            'label' => 'Page error',
            'help' => "We're sorry, but something went wrong and the page cannot be displayed."
        ],
        'menu_label' => 'Pages',
        'unsaved_label' => 'Unsaved page(s)',
        'no_list_records' => 'No pages found',
        'new' => 'New page',
        'invalid_url' => 'Invalid URL format. The URL should start with the forward slash symbol and can contain digits, Latin letters and the following symbols: ._-[]:?|/+*^$',
        'delete_confirm_multiple' => 'Do you really want to delete selected pages?',
        'delete_confirm_single' => 'Do you really want delete this page?',
        'no_layout' => '-- no layout --'
    ],
    'layout' => [
        'not_found_name' => "The layout ':name' is not found",
        'menu_label' => 'Layouts',
        'unsaved_label' => 'Unsaved layout(s)',
        'no_list_records' => 'No layouts found',
        'new' => 'New layout',
        'delete_confirm_multiple' => 'Do you really want to delete selected layouts?',
        'delete_confirm_single' => 'Do you really want delete this layout?'
    ],
    'partial' => [
        'not_found_name' => "The partial ':name' is not found.",
        'invalid_name' => 'Invalid partial name: :name.',
        'menu_label' => 'Partials',
        'unsaved_label' => 'Unsaved partial(s)',
        'no_list_records' => 'No partials found',
        'delete_confirm_multiple' => 'Do you really want to delete selected partials?',
        'delete_confirm_single' => 'Do you really want delete this partial?',
        'new' => 'New partial'
    ],
    'content' => [
        'not_found_name' => "The content file ':name' is not found.",
        'menu_label' => 'Content',
        'unsaved_label' => 'Unsaved content',
        'no_list_records' => 'No content files found',
        'delete_confirm_multiple' => 'Do you really want to delete selected content files or directories?',
        'delete_confirm_single' => 'Do you really want delete this content file?',
        'new' => 'New content file'
    ],
    'ajax_handler' => [
        'invalid_name' => 'Invalid AJAX handler name: :name.',
        'not_found' => "AJAX handler ':name' was not found."
    ],
    'cms' => [
        'menu_label' => 'CMS'
    ],
    'sidebar' => [
        'add' => 'Add',
        'search' => 'Search...'
    ],
    'editor' => [
        'settings' => 'Settings',
        'title' => 'Title',
        'new_title' => 'New page title',
        'url' => 'URL',
        'filename' => 'File Name',
        'layout' => 'Layout',
        'description' => 'Description',
        'preview' => 'Preview',
        'meta' => 'Meta',
        'meta_title' => 'Meta Title',
        'meta_description' => 'Meta Description',
        'markup' => 'Markup',
        'code' => 'Code',
        'content' => 'Content',
        'hidden' => 'Hidden',
        'hidden_comment' => 'Hidden pages are accessible only by logged-in back-end users.',
        'enter_fullscreen' => 'Enter fullscreen mode',
        'exit_fullscreen' => 'Exit fullscreen mode'
    ],
    'asset' => [
        'menu_label' => 'Assets',
        'unsaved_label' => 'Unsaved asset(s)',
        'drop_down_add_title' => 'Add...',
        'drop_down_operation_title' => 'Action...',
        'upload_files' => 'Upload file(s)',
        'create_file' => 'Create file',
        'create_directory' => 'Create directory',
        'directory_popup_title' => 'New directory',
        'directory_name' => 'Directory name',
        'rename' => 'Rename',
        'delete' => 'Delete',
        'move' => 'Move',
        'select' => 'Select',
        'new' => 'New file',
        'rename_popup_title' => 'Rename',
        'rename_new_name' => 'New name',
        'invalid_path' => 'Path can contain only digits, Latin letters, spaces and the following symbols: ._-/',
        'error_deleting_file' => 'Error deleting file :name.',
        'error_deleting_dir_not_empty' => 'Error deleting directory :name. The directory is not empty.',
        'error_deleting_dir' => 'Error deleting file :name.',
        'invalid_name' => 'Name can contain only digits, Latin letters, spaces and the following symbols: ._-',
        'original_not_found' => 'Original file or directory not found',
        'already_exists' => 'File or directory with this name already exists',
        'error_renaming' => 'Error renaming the file or directory',
        'name_cant_be_empty' => 'The name cannot be empty',
        'too_large' => 'The uploaded file is too large. The maximum allowed file size is :max_size',
        'type_not_allowed' => 'Only the following file types are allowed: :allowed_types',
        'file_not_valid' => 'File is not valid',
        'error_uploading_file' => "Error uploading file ':name': :error",
        'move_please_select' => 'please select',
        'move_destination' => 'Destination directory',
        'move_popup_title' => 'Move assets',
        'move_button' => 'Move',
        'selected_files_not_found' => 'Selected files not found',
        'select_destination_dir' => 'Please select a destination directory',
        'destination_not_found' => 'Destination directory is not found',
        'error_moving_file' => 'Error moving file :file',
        'error_moving_directory' => 'Error moving directory :dir',
        'error_deleting_directory' => 'Error deleting the original directory :dir',
        'path' => 'Path'
    ],
    'component' => [
        'menu_label' => 'Components',
        'unnamed' => 'Unnamed',
        'no_description' => 'No description provided',
        'alias' => 'Alias',
        'alias_description' => 'A unique name given to this component when using it in the page or layout code.',
        'validation_message' => 'Component aliases are required and can contain only Latin symbols, digits, and underscores. The aliases should start with a Latin symbol.',
        'invalid_request' => 'The template cannot be saved because of invalid component data.',
        'no_records' => 'No components found',
        'not_found' => "The component ':name' is not found.",
        'method_not_found' => "The component ':name' does not contain a method ':method'."
    ],
    'template' => [
        'invalid_type' => 'Unknown template type.',
        'not_found' => 'Requested template not found.',
        'saved'=> 'Template saved.'
    ],
    'permissions' => [
        'name' => 'Cms',
        'manage_content' => 'Manage content',
        'manage_assets' => 'Manage assets',
        'manage_pages' => 'Manage pages',
        'manage_layouts' => 'Manage layouts',
        'manage_partials' => 'Manage partials',
        'manage_themes' => 'Manage themes'
    ]
];
