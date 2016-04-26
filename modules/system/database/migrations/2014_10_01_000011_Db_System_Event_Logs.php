<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbSystemEventLogs extends Migration
{
    public function up()
    {
        Schema::create('system_event_logs', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('level')->nullable()->index();
            $table->text('message')->nullable();
            $table->mediumtext('details')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_event_logs');
    }
}
