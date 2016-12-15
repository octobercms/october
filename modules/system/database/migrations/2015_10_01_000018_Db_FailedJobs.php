<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbFailedJobs extends Migration
{
    public function up()
    {
        Schema::create(config('queue.failed.table'), function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->text('connection');
            $table->text('queue');
            $table->text('payload');
            $table->timestamp('failed_at')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists(config('queue.failed.table'));
    }
}
