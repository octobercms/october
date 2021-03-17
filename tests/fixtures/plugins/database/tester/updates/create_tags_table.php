<?php namespace Database\Tester\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class CreateTagsTable extends Migration
{

    public function up()
    {
        Schema::create('database_tester_tags', function ($table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('database_tester_taggables', function ($table) {
            $table->engine = 'InnoDB';
            $table->unsignedInteger('tag_id');
            $table->morphs('taggable', 'testings_taggable');
            $table->unsignedInteger('added_by')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('database_tester_taggables');
        Schema::dropIfExists('database_tester_tags');
    }
}
