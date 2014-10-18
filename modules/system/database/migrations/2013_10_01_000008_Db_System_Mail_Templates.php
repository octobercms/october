<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbSystemMailTemplates extends Migration
{

    public function up()
    {
        Schema::create('system_mail_templates', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('code')->nullable();
            $table->string('subject')->nullable();
            $table->text('description')->nullable();
            $table->text('content_html')->nullable();
            $table->text('content_text')->nullable();
            $table->integer('layout_id')->index()->nullable();
            $table->boolean('is_custom')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_mail_templates');
    }
}
