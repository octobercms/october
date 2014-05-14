<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbBackendUserThrottle extends Migration
{

    public function up()
    {
        Schema::create('backend_user_throttle', function($table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->string('ip_address')->nullable();
            $table->integer('attempts')->default(0);
            $table->boolean('suspended')->default(0);
            $table->boolean('banned')->default(0);
            $table->timestamp('last_attempt_at')->nullable();
            $table->timestamp('suspended_at')->nullable();
            $table->timestamp('banned_at')->nullable();
        });
    }

    public function down()
    {
        Schema::drop('backend_user_throttle');
    }

}
