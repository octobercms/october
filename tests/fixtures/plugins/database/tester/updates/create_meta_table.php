<?php namespace Database\Tester\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class CreateMetaTable extends Migration
{

    public function up()
    {
        Schema::create('database_tester_meta', function ($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned();
            $table->integer('taggable_id')->unsigned()->index()->nullable();
            $table->string('taggable_type')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('redirect_url')->nullable();
            $table->string('robot_index')->nullable();
            $table->string('robot_follow')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('database_tester_meta');
    }

}
