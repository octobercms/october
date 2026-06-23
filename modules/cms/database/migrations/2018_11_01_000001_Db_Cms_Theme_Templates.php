<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cms_theme_files', function (Blueprint $table) {
            $table->increments('id');
            $table->string('source')->index();
            $table->string('path')->index();
            $table->longText('content')->nullable();
            $table->integer('file_size')->unsigned();
            $table->dateTime('updated_at')->nullable();
            $table->dateTime('deleted_at')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cms_theme_files');
    }
};
