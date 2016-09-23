<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbBackendUserPreferences extends Migration
{
    public function up()
    {
        Schema::create('backend_user_preferences', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->string('namespace', 100);
            $table->string('group', 50);
            $table->string('item', 150);
            $table->text('value')->nullable();
            $table->index(['user_id', 'namespace', 'group', 'item'], 'user_item_index');
        });
    }

    public function down()
    {
        Schema::dropIfExists('backend_user_preferences');
    }
}
