<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('cms_theme_templates')) {
            return;
        }

        Schema::rename('cms_theme_templates', 'cms_theme_files');

        Schema::table('cms_theme_files', function (Blueprint $table) {
            $table->longText('content')->nullable()->change();
        });
    }

    public function down()
    {
        if (!Schema::hasTable('cms_theme_files') || Schema::hasTable('cms_theme_templates')) {
            return;
        }

        Schema::table('cms_theme_files', function (Blueprint $table) {
            $table->longText('content')->nullable(false)->change();
        });

        Schema::rename('cms_theme_files', 'cms_theme_templates');
    }
};
