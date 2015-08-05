<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbSystemAddFrozenFlag extends Migration
{
    public function up()
    {
        Schema::table('system_plugin_versions', function (Blueprint $table) {
            $table->boolean('is_frozen')->default(0);
        });
    }

    public function down()
    {
        Schema::table('system_plugin_versions', function (Blueprint $table) {
            $table->dropColumn('is_frozen');
        });
    }
}
