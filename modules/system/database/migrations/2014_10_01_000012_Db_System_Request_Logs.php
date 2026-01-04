<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::create('system_request_logs', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('status_code')->nullable();
            $table->text('url')->nullable();
            $table->text('referer')->nullable();
            $table->integer('count')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_request_logs');
    }
};
