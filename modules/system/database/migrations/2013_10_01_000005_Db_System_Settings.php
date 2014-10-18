<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

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
