<?php namespace Database\Tester\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class CreateAuthorsTable extends Migration
{
    public function up()
    {
        Schema::create('database_tester_authors', function ($table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('user_id')->unsigned()->index()->nullable();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('database_tester_authors');
    }
}
