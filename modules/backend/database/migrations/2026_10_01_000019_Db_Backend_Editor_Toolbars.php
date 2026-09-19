<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::create('backend_editor_toolbars', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('setting_id')->unsigned()->nullable()->index();
            $table->string('code')->index();
            $table->string('label')->nullable();
            $table->string('description')->nullable();
            $table->text('buttons')->nullable();
            $table->boolean('is_custom')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('backend_editor_toolbars');
    }
};
