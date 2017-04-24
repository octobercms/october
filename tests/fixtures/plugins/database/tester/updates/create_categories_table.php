<?php namespace Database\Tester\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class CreateCategoriesTable extends Migration
{

    public function up()
    {
        Schema::create('database_tester_categories', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('parent_id')->nullable();
            $table->string('name')->nullable();
            $table->string('slug')->nullable()->index()->unique();
            $table->string('description')->nullable();
            $table->integer('company_id')->unsigned()->nullable();
            $table->string('language', 3)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('database_tester_categories_nested', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('parent_id')->nullable();
            $table->integer('nest_left')->nullable();
            $table->integer('nest_right')->nullable();
            $table->integer('nest_depth')->nullable();
            $table->string('name')->nullable();
            $table->string('slug')->nullable()->index()->unique();
            $table->string('description')->nullable();
            $table->integer('company_id')->unsigned()->nullable();
            $table->string('language', 3)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('database_tester_categories');
        Schema::dropIfExists('database_tester_categories_nested');
    }

}
