<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbSystemRevisions extends Migration
{
    public function up()
    {
        Schema::create('system_revisions', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('user_id')->unsigned()->nullable()->index();
            $table->string('field')->nullable()->index();
            $table->string('cast')->nullable();
            $table->text('old_value')->nullable();
            $table->text('new_value')->nullable();
            $table->string('revisionable_type');
            $table->integer('revisionable_id');
            $table->timestamps();
            $table->index(['revisionable_id', 'revisionable_type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_revisions');
    }
}
