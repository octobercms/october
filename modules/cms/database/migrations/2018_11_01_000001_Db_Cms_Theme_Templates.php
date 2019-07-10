<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbCmsThemeTemplates extends Migration
{
    public function up()
    {
        Schema::create('cms_theme_templates', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('source')->index();
            $table->string('path')->index();
            $table->longText('content');
            $table->integer('file_size')->unsigned();
            $table->dateTime('updated_at')->nullable();
            $table->dateTime('deleted_at')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cms_theme_templates');
    }
}
