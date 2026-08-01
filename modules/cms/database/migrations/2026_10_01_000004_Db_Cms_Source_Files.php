<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cms_source_files', function (Blueprint $table) {
            $table->increments('id');
            $table->string('source')->index();
            $table->string('path')->index();
            $table->longText('content')->nullable();
            $table->string('disk')->nullable();
            $table->string('disk_path')->nullable();
            $table->integer('file_size')->unsigned()->default(0);
            $table->string('mime_type')->nullable();
            $table->timestamps();
            $table->dateTime('deleted_at')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cms_source_files');
    }
};
