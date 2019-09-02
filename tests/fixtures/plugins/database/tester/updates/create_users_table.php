<?php namespace Database\Tester\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class CreateUsersTable extends Migration
{

    public function up()
    {
        Schema::create('database_tester_users', function ($table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('database_tester_users');
    }
}
