<?php

use October\Rain\Database\Updates\Migration;

/**
 * This migration addresses a MySQL specific issue around STRICT MODE.
 * In past versions, Laravel would give timestamps a bad default value
 * of "0" considered invalid by MySQL. Strict mode is disabled and the
 * the timestamps are patched up. Credit for this work: Dave Shoreman.
 */
class DbCmsTimestampFix extends Migration
{
    public function up()
    {
        DbDongle::disableStrictMode();

        DbDongle::convertTimestamps('cms_theme_data');

        // Use this opportunity to patch the theme.yaml file for stable
        $demoTheme = base_path('themes/demo/theme.yaml');
        if (file_exists($demoTheme) && is_writable($demoTheme)) {
            $contents = file_get_contents($demoTheme);
            $search = "description: Demo OctoberCMS theme. Demonstrates the basic concepts of the front-end theming: layouts, pages, partials, components, content blocks, AJAX framework.";
            $replace = "description: 'Demo OctoberCMS theme. Demonstrates the basic concepts of the front-end theming: layouts, pages, partials, components, content blocks, AJAX framework.'";
            $contents = str_replace($search, $replace, $contents);
            file_put_contents($demoTheme, $contents);
        }
    }

    public function down()
    {
        // ...
    }
}
