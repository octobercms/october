<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbSystemSettings extends Migration 
{
    public function up()
    {
        Schema::create('system_settings', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('item');
            $table->text('value')->nullable();
            $table->index(['item']);
        });
    }

    public function down()
    {
        Schema::drop('system_settings');
    }
}
