<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbSystemSettings extends Migration
{
    public function up()
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('item')->nullable()->index();
            $table->mediumtext('value')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_settings');
    }
}
