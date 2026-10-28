<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->unique();
            $table->longText('value');
            $table->bigInteger('expiration');
        });
    }

    public function down()
    {
        Schema::dropIfExists('cache');
    }
};
