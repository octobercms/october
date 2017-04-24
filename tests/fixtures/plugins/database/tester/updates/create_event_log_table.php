<?php namespace Database\Tester\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class CreateEventLogTable extends Migration
{

    public function up()
    {
        Schema::create('database_tester_event_log', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('action', 30)->nullable();
            $table->string('related_id')->index()->nullable();
            $table->string('related_type')->index()->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('database_tester_event_log');
    }

}
