<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbSystemTraceLog extends Migration
{

    public function up()
    {
        Schema::create('system_trace_log', function(Blueprint $table)
        {
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
        Schema::dropIfExists('system_trace_log');
    }

}
