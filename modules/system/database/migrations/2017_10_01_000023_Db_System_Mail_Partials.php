<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbSystemMailPartials extends Migration
{
    public function up()
    {
        Schema::create('system_mail_partials', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('code')->nullable();
            $table->text('content_html')->nullable();
            $table->text('content_text')->nullable();
            $table->boolean('is_custom')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_mail_partials');
    }
}
