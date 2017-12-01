<?php namespace Database\Tester\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class CreatePhonesTable extends Migration
{

    public function up()
    {
        Schema::create('database_tester_phones', function ($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('number')->nullable();
            $table->integer('author_id')->unsigned()->index()->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('database_tester_phones');
    }

}
