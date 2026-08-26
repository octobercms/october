<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Enable Multisite
    |--------------------------------------------------------------------------
    |
    | Allows the creation of multiple site definitions in the same installation.
    | Disabling this will lock any existing site definitions.
    |
    */

    'enabled' => true,

    /*
    |--------------------------------------------------------------------------
    | Multisite Features
    |--------------------------------------------------------------------------
    |
    | Use multisite for the features defined below. Be sure to clear the application
    | cache after modifying these settings.
    |
    |  - system_plugin_sites - Plugins can be enabled/disabled per site
    |  - system_plugin_site_groups - Plugins can be enabled/disabled per site group
    |  - system_asset_combiner - Asset combiner cache keys are unique to the site
    |  - cms_maintenance_setting - Maintenance Mode Settings are unique for each site
    |  - backend_mail_setting - Mail Settings are unique for each site
    |
    | There are also some known vendor implementations.
    |
    |  - rainlab_googleanalytics_setting - Google Analytics for each site
    |  - responsiv_campaign_message - Mailing list campaigns for each site
    |
    */

    'features' => [
        'system_plugin_sites' => false,
        'system_plugin_site_groups' => false,
        'system_asset_combiner' => false,
        'cms_maintenance_setting' => false,
        'backend_mail_setting' => false,
        'dashboard_traffic_statistics' => false,

        // Vendor
        'rainlab_googleanalytics_setting' => false,
        'responsiv_campaign_message' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Translation Features
    |--------------------------------------------------------------------------
    |
    | Controls how content is translated for sites configured with different
    | locales. These features activate when matching translations exist.
    | Be sure to clear the application cache after modifying these settings.
    |
    |  - cms_pages - translated page URLs and properties via the translatable component
    |  - cms_content - content files resolve from locale subdirectories (content/fr/)
    |  - cms_page_url_redirect - status code used when redirecting a default URL to
    |    its translated URL, use false to disable the redirect and respond 404 instead
    |  - system_mail_templates - mail templates translate via attributes and locale view directories
    |
    */

    'translate' => [
        'cms_pages' => true,
        'cms_content' => true,
        'cms_page_url_redirect' => 301,
        'system_mail_templates' => true,
    ],

];
