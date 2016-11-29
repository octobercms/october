<?php namespace ICTBelang\Test\Updates;

use Schema;
use October\Rain\Database\Updates\Migration;

class BuilderTableCreateIctbelangTestEntries extends Migration
{
    public function up()
    {
        Schema::create('ictbelang_test_entries', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->boolean('status')->nullable();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('ictbelang_test_entries');
    }
}
