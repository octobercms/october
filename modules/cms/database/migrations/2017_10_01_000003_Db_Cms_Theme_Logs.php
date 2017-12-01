<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbCmsThemeLogs extends Migration
{
    public function up()
    {
        Schema::create('cms_theme_logs', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('type', 20)->index();
            $table->string('theme')->nullable()->index();
            $table->string('template')->nullable();
            $table->string('old_template')->nullable();
            $table->longText('content')->nullable();
            $table->longText('old_content')->nullable();
            $table->integer('user_id')->index()->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cms_theme_logs');
    }
}
