<?php

use October\Rain\Database\Updates\Migration;

class DbSystemSessions extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sessions', function ($table) {
            $table->string('id')->unique();
            $table->text('payload')->nullable();
            $table->integer('last_activity')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sessions');
    }
}
