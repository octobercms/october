<?php

use October\Rain\Database\Updates\Migration;

class DbCache extends Migration
{
    public function up()
    {
        Schema::create('cache', function ($table) {
            $table->string('key')->unique();
            $table->text('value');
            $table->integer('expiration');
        });
    }

    public function down()
    {
        Schema::dropIfExists('cache');
    }
}
