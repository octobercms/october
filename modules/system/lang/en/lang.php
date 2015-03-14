<?php

return [
    'app' => [
        'name' => 'October CMS',
        'tagline' => 'Getting back to basics'
    ],
    'locale' => [
        'en' => 'English',
        'de' => 'German',
        'es' => 'Spanish',
        'es-ar' => 'Spanish (Argentina)',
        'fa' => 'Persian',
        'fr' => 'French',
        'hu' => 'Hungarian',
        'id' => 'Bahasa Indonesia',
        'it' => 'Italian',
        'ja' => 'Japanese',
        'nl' => 'Dutch',
        'pl' => 'Polish',
        'pt-br' => 'Brazilian Portuguese',
        'ro' => 'Romanian',
        'ru' => 'Russian',
        'se' => 'Swedish',
        'sk' => 'Slovak (Slovakia)',
        'tr' => 'Turkish'
    ],
    'directory' => [
        'create_fail' => 'Cannot create directory: :name'
    ],
    'file' => [
        'create_fail' => 'Cannot create file: :name'
    ],
    'combiner' => [
        'not_found' => "The combiner file ':name' is not found."
    ],
    'system' => [
        'name' => 'System',
        'menu_label' => 'System',
        'categories' => [
            'cms' => 'CMS',
            'misc' => 'Misc',
            'logs' => 'Logs',
            'mail' => 'Mail',
            'shop' => 'Shop',
            'team' => 'Team',
            'users' => 'Users',
            'system' => 'System',
            'social' => 'Social',
            'events' => 'Events',
            'customers' => 'Customers',
            'my_settings' => 'My Settings'
        ]
    ],
    'plugin' => [
        'unnamed' => 'Unnamed plugin',
        'name' => [
            'label' => 'Plugin Name',
            'help' => 'Name the plugin by its unique code. For example, RainLab.Blog'
        ]
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
        'remove_confirm' => 'Are you sure?',
        'remove_success' => 'Successfully removed those plugins from the system.',
        'refresh_confirm' => 'Are you sure?',
        'refresh_success' => 'Successfully refreshed those plugins in the system.',
        'disable_confirm' => 'Are you sure?',
        'disable_success' => 'Successfully disabled those plugins.',
        'enable_success' => 'Successfully enabled those plugins.',
        'unknown_plugin' => 'Plugin has been removed from the file system.'
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
            'missing' => 'Please specify a Project ID to use.'
        ],
        'detach_confirm' => 'Are you sure you want to detach this project?',
        'unbind_success' => 'Project has been detached successfully.'
    ],
    'settings' => [
        'menu_label' => 'Settings',
        'not_found' => 'Unable to find the specified settings.',
        'missing_model' => 'The settings page is missing a Model definition.',
        'update_success' => 'Settings for :name have been updated successfully.',
        'return' => 'Return to system settings',
        'search' => 'Search'
    ],
    'mail' => [
        'log_file' => 'Log file',
        'menu_label' => 'Mail configuration',
        'menu_description' => 'Manage email configuration.',
        'general' => 'General',
        'method' => 'Mail Method',
        'sender_name' => 'Sender Name',
        'sender_email' => 'Sender Email',
        'php_mail' => 'PHP mail',
        'sendmail' => 'Sendmail',
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
        'mailgun' => 'Mailgun',
        'mailgun_domain' => 'Mailgun Domain',
        'mailgun_domain_comment' => 'Please specify the Mailgun domain name.',
        'mailgun_secret' => 'Mailgun Secret',
        'mailgun_secret_comment' => 'Enter your Mailgun API key.',
        'mandrill' => 'Mandrill',
        'mandrill_secret' => 'Mandrill Secret',
        'mandrill_secret_comment' => 'Enter your Mandrill API key.'
    ],
    'mail_templates' => [
        'menu_label' => 'Mail templates',
        'menu_description' => 'Modify the mail templates that are sent to users and administrators, manage email layouts.',
        'new_template' => 'New Template',
        'new_layout' => 'New Layout',
        'template' => 'Template',
        'templates' => 'Templates',
        'menu_layouts_label' => 'Mail Layouts',
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
        'test_send' => 'Send test message',
        'test_success' => 'The test message has been successfully sent.',
        'return' => 'Return to template list'
    ],
    'install' => [
        'project_label' => 'Attach to Project',
        'plugin_label' => 'Install Plugin',
        'missing_plugin_name' => 'Please specify a Plugin name to install.',
        'install_completing' => 'Finishing installation process',
        'install_success' => 'The plugin has been installed successfully.'
    ],
    'updates' => [
        'title' => 'Manage Updates',
        'name' => 'Software update',
        'menu_label' => 'Updates',
        'menu_description' => 'Update the system, manage and install plugins and themes.',
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
        'plugins' => 'Plugins',
        'disabled' => 'Disabled',
        'plugin_downloading' => 'Downloading plugin: :name',
        'plugin_extracting' => 'Unpacking plugin: :name',
        'plugin_version_none' => 'New plugin',
        'plugin_version_old' => 'Current v:version',
        'plugin_version_new' => 'v:version',
        'theme_label' => 'Theme',
        'theme_new_install' => 'New theme installation.',
        'theme_downloading' => 'Downloading theme: :name',
        'theme_extracting' => 'Unpacking theme: :name',
        'update_label' => 'Update software',
        'update_completing' => 'Finishing update process',
        'update_loading' => 'Loading available updates...',
        'update_success' => 'The update process was performed successfully.',
        'update_failed_label' => 'Update failed',
        'force_label' => 'Force update',
        'found' => [
            'label' => 'Found new updates!',
            'help' => 'Click Update software to begin the update process.'
        ],
        'none' => [
            'label' => 'No updates',
            'help' => 'No new updates were found.'
        ]
    ],
    'server' => [
        'connect_error' => 'Error connecting to the server.',
        'response_not_found' => 'The update server could not be found.',
        'response_invalid' => 'Invalid response from the server.',
        'response_empty' => 'Empty response from the server.',
        'file_error' => 'Server failed to deliver the package.',
        'file_corrupt' => 'File from server is corrupt.'
    ],
    'behavior' => [
        'missing_property' => 'Class :class must define property $:property used by :behavior behavior.'
    ],
    'config' => [
        'not_found' => 'Unable to find configuration file :file defined for :location.',
        'required' => "Configuration used in :location must supply a value ':property'."
    ],
    'zip' => [
        'extract_failed' => "Unable to extract core file ':file'."
    ],
    'event_log' => [
        'hint' => 'This log displays a list of potential errors that occur in the application, such as exceptions and debugging information.',
        'menu_label' => 'Event log',
        'menu_description' => 'View system log messages with their recorded time and details.',
        'empty_link' => 'Empty event log',
        'empty_loading' => 'Emptying event log...',
        'empty_success' => 'Successfully emptied the event log.',
        'return_link' => 'Return to event log',
        'id' => 'ID',
        'id_label' => 'Event ID',
        'created_at' => 'Date & Time',
        'message' => 'Message',
        'level' => 'Level'
    ],
    'request_log' => [
        'hint' => 'This log displays a list of browser requests that may require attention. For example, if a visitor opens a CMS page that cannot be found, a record is created with the status code 404.',
        'menu_label' => 'Request log',
        'menu_description' => 'View bad or redirected requests, such as Page not found (404).',
        'empty_link' => 'Empty request log',
        'empty_loading' => 'Emptying request log...',
        'empty_success' => 'Successfully emptied the request log.',
        'return_link' => 'Return to request log',
        'id' => 'ID',
        'id_label' => 'Log ID',
        'count' => 'Counter',
        'referer' => 'Referers',
        'url' => 'URL',
        'status_code' => 'Status'
    ],
    'permissions' => [
        'name' => 'System',
        'manage_system_settings' => 'Manage system settings',
        'manage_software_updates' => 'Manage software updates',
        'manage_mail_templates' => 'Manage mail templates',
        'manage_mail_settings' => 'Manage mail settings',
        'manage_other_administrators' => 'Manage other administrators',
        'view_the_dashboard' => 'View the dashboard'
    ]
];
