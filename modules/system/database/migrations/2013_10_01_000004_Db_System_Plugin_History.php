<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbSystemPluginHistory extends Migration
{

    public function up()
    {
        Schema::create('system_plugin_history', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('code')->index();
            $table->string('type', 20)->index();
            $table->string('version', 50);
            $table->string('detail')->nullable();
            $table->timestamp('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_plugin_history');
    }
}
