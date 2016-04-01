<?php

use October\Rain\Database\Updates\Migration;

class DbSystemPluginVersions extends Migration
{

    public function up()
    {
        Schema::create('system_plugin_versions', function ($table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('code')->index();
            $table->string('version', 50);
            $table->timestamp('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_plugin_versions');
    }
}
