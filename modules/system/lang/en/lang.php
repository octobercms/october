<?php

return [
    'app' => [
        'name' => 'October CMS',
        'motto' => 'Getting back to basics',
    ],
    'directory' => [
        'create_fail' => "Cannot create directory: :name",
    ],
    'file' => [
        'create_fail' => "Cannot create file: :name",
    ],
    'system' => [
        'name' => 'System',
        'menu_label' => 'System',
    ],
    'plugin' => [
        'unnamed' => 'Unnamed plugin',
        'name' => [
            'label' => 'Plugin Name',
            'help' => 'Name the plugin by its unique code. For example, RainLab.Blog',
        ],
    ],
    'plugins' => [
        'manage' => 'Manage plugins',
        'enable_or_disable' => 'Enable or disable',
        'enable_or_disable_title' => 'Enable or Disable Plugins',
        'remove' => 'Remove',
        'refresh' => 'Refresh',
        'disabled_label' => 'Disabled',
        'disabled_help' => 'Plugins that are disabled are ignored by the application.',
        'selected_amount' => 'Plugins selected: :amount',
        'remove_success' => "Successfully removed those plugins from the system.",
        'refresh_success' => "Successfully refreshed those plugins in the system.",
        'disable_success' => "Successfully disabled those plugins.",
        'enable_success' => "Successfully enabled those plugins.",
    ],
    'project' => [
        'name' => 'Project',
        'owner_label' => 'Owner',
        'attach' => 'Attach Project',
        'detach' => 'Detach Project',
        'none' => 'None',
        'id' => [
            'label' => 'Project ID',
            'help' => 'How to find your Project ID',
            'missing' => 'Please specify a Project ID to use.',
        ],
        'detach_confirm' => 'Are you sure you want to detach this project?',
        'unbind_success' => 'Project has been detached successfully.',
    ],
    'settings' => [
        'menu_label' => 'Settings',
        'missing_model' => 'The settings page is missing a Model definition.',
        'update_success' => 'Settings for :name have been updated successfully.',
        'return' => 'Return to system settings',
    ],
    'email' => [
        'menu_label' => 'Email Configuration',
        'menu_description' => 'Manage email configuration.',
        'general' => 'General',
        'method' => 'Email Method',
        'sender_name' => 'Sender Name',
        'sender_email' => 'Sender Email',
        'smtp' => 'SMTP',
        'smtp_address' => 'SMTP Address',
        'smtp_authorization' => 'SMTP authorization required',
        'smtp_authorization_comment' => 'Use this checkbox if your SMTP server requires authorization.',
        'smtp_username' => 'Username',
        'smtp_password' => 'Password',
        'smtp_port' => 'SMTP Port',
        'smtp_ssl' => 'SSL connection required',
        'sendmail' => 'Sendmail',
        'sendmail_path' => 'Sendmail Path',
        'sendmail_path_comment' => 'Please specify the path of the sendmail program.',
    ],
    'email_templates' => [
        'menu_label' => 'Email Templates',
        'menu_description' => 'Modify the email templates that are sent to users and administrators.',
        'new_template' => 'New Template',
        'new_layout' => 'New Layout',
        'template' => 'Template',
        'templates' => 'Templates',
        'menu_layouts_label' => 'Email Layouts',
        'layout' => 'Layout',
        'layouts' => 'Layouts',
        'name' => 'Name',
        'name_comment' => 'Unique name used to refer to this template',
        'code' => 'Code',
        'code_comment' => 'Unique code used to refer to this template',
        'subject' => 'Subject',
        'subject_comment' => 'Email message subject',
        'description' => 'Description',
        'content_html' => 'HTML',
        'content_css' => 'CSS',
        'content_text' => 'Plaintext',
    'editor' => [
        'menu_label' => 'Editor Configuration',
        'menu_description' => 'Manage editor configuration.',
        'font_size' => 'Font Size',
        'tab_size' => 'Indentation Width',
        'use_hard_tabs' => 'Indent Using Tabs',
        'use_hard_tabs_comment' => 'Use this checkbox if you would like to use hard tabs instead of spaces.',
        'use_wrap' => 'Enable Word Wrap',
        'use_wrap_comment' => 'Use this checkbox if you want your content to wrap instead of overflowing.',
        'theme' => 'Editor Color Scheme'
    ],
    'install' => [
        'project_label' => 'Attach to Project',
        'plugin_label' => 'Install Plugin',
        'missing_plugin_name' => 'Please specify a Plugin name to install.',
        'install_completing' => 'Finishing installation process',
        'install_success' => 'The plugin has been installed successfully.',
    ],
    'updates' => [
        'title' => 'Manage Updates',
        'name' => 'Software update',
        'menu_label' => 'Updates',
        'check_label' => 'Check for updates',
        'retry_label' => 'Try again',
        'plugin_name' => 'Name',
        'plugin_description' => 'Description',
        'plugin_version' => 'Version',
        'plugin_author' => 'Author',
        'core_build' => 'Current build',
        'core_build_old' => 'Current build :build',
        'core_build_new' => 'Build :build',
        'core_build_new_help' => 'Latest build is available.',
        'core_downloading' => 'Downloading application files',
        'core_extracting' => 'Unpacking application files',
        'plugin_downloading' => 'Downloading plugin: :name',
        'plugin_extracting' => 'Unpacking plugin: :name',
        'plugin_version_none' => 'New plugin',
        'plugin_version_old' => 'Current v:version',
        'plugin_version_new' => 'v:version',
        'update_label' => 'Update software',
        'update_completing' => 'Finishing update process',
        'update_loading' => 'Loading available updates...',
        'update_success' => 'The update process was performed successfully.',
        'update_failed_label' => 'Update failed',
        'force_label' => 'Force update',
        'found' => [
            'label' => 'Found new updates!',
            'help' => 'Click Update software to begin the update process.',
        ],
        'none' => [
            'label' => 'No updates',
            'help' => 'No new updates were found.',
        ],
    ],
    'server' => [
        'connect_error' => 'Error connecting to the server.',
        'response_not_found' => 'The update server could not be found.',
        'response_invalid' => 'Invalid response from the server.',
        'response_empty' => 'Empty response from the server.',
        'file_error' => 'Server failed to deliver the package.',
        'file_corrupt' => 'File from server is corrupt.',
    ],
    'behavior' => [
        'missing_property' => 'Class :class must define property $:property used by :behavior behavior.',
    ],
    'config' => [
        'not_found' => 'Unable to find configuration file :file defined for :location.',
        'required' => 'Configuration used in :location must supply a value :property.',
    ],
    'zip' => [
        'extract_failed' => "Unable to extract core file ':file'.",
    ],
];