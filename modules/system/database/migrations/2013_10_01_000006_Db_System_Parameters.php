<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbSystemParameters extends Migration
{
    public function up()
    {
        Schema::create('system_parameters', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('namespace', 100);
            $table->string('group', 50);
            $table->string('item', 150);
            $table->text('value')->nullable();
            $table->index(['namespace', 'group', 'item'], 'item_index');
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_parameters');
    }
}
