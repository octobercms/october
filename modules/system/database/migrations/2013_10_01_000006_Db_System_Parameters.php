<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbSystemParameters extends Migration
{
    public function up()
    {
        Schema::create('system_parameters', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('namespace');
            $table->string('group');
            $table->string('item');
            $table->text('value')->nullable();
            $table->index(['namespace', 'group', 'item'], 'item_index');
        });
    }

    public function down()
    {
        Schema::drop('system_parameters');
    }
}
