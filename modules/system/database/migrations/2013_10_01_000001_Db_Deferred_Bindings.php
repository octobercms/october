<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbDeferredBindings extends Migration
{

    public function up()
    {
        Schema::create('deferred_bindings', function(Blueprint $table)
        {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('master_type')->index();
            $table->string('master_field')->index();
            $table->string('slave_type')->index();
            $table->string('slave_id')->index();
            $table->string('session_key');
            $table->boolean('is_bind')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('deferred_bindings');
    }

}
