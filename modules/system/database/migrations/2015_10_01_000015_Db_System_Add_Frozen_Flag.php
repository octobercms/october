<?php

use October\Rain\Database\Updates\Migration;

class DbSystemAddFrozenFlag extends Migration
{
    public function up()
    {
        Schema::table('system_plugin_versions', function ($table) {
            $table->boolean('is_frozen')->default(0);
        });
    }

    public function down()
    {
        Schema::table('system_plugin_versions', function ($table) {
            $table->dropColumn('is_frozen');
        });
    }
}
