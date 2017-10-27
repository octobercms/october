<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;



class DbSystemRequestLogs extends Migration
{
    const MAX_URL_LENGTH = 8000; //https://tools.ietf.org/html/rfc7230#section-3.1.1

    public function up()
    {
        Schema::create('system_request_logs', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('status_code')->nullable();
            $table->string('url', static::MAX_URL_LENGTH)->nullable();
            $table->text('referer')->nullable();
            $table->integer('count')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_request_logs');
    }
}
