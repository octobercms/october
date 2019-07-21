<?php namespace Database\Tester\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class CreateRolesTable extends Migration
{

    public function up()
    {
        Schema::create('database_tester_roles', function ($table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('database_tester_authors_roles', function ($table) {
            $table->engine = 'InnoDB';
            $table->integer('author_id')->unsigned();
            $table->integer('role_id')->unsigned();
            $table->primary(['author_id', 'role_id']);
            $table->string('clearance_level')->nullable();
            $table->boolean('is_executive')->default(false);
        });
    }

    public function down()
    {
        Schema::dropIfExists('database_tester_roles');
        Schema::dropIfExists('database_tester_authors_roles');
    }
}
