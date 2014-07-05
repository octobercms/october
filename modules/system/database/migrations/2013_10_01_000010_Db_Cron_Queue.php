<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbCronQueue extends Migration
{

    public function up()
    {
        Schema::create('cron_queue', function(Blueprint $table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('delay')->default(0);
            $table->integer('status')->default(0);
            $table->integer('retries')->default(0);
            $table->text('payload')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cron_queue');
    }

}
