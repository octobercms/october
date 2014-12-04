<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbCmsThemeData extends Migration
{
    public function up()
    {
        Schema::create('cms_theme_data', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('theme')->nullable()->index();
            $table->mediumtext('data')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cms_theme_data');
    }
}
