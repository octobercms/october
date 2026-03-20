<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::create('system_translate_attributes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('model_type', 512);
            $table->integer('model_id');
            $table->string('locale', 16);
            $table->string('attribute', 128);
            $table->mediumText('value')->nullable();
            $table->index(
                ['model_type', 'model_id', 'locale'],
                'sys_translate_type_id_locale_index'
            );
            $table->unique(
                ['model_type', 'model_id', 'locale', 'attribute'],
                'sys_translate_unique_index'
            );
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_translate_attributes');
    }
};
