<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::create('system_plugin_site_groups', function (Blueprint $table) {
            $table->increments('id');
            $table->string('plugin_code')->index();
            $table->integer('site_id')->unsigned()->nullable()->index();
            $table->integer('site_group_id')->unsigned()->nullable()->index();
            $table->boolean('is_enabled')->default(true);
            $table->unique(['plugin_code', 'site_id', 'site_group_id'], 'plugin_site_group_unique');
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_plugin_site_groups');
    }
};
