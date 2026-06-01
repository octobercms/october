<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::create($this->getTableName(), function (Blueprint $table) {
            $table->increments('id');
            $table->string('uuid')->unique()->nullable();
            $table->text('connection');
            $table->text('queue');
            $table->text('payload');
            $table->longText('exception')->nullable();
            $table->timestamp('failed_at')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists($this->getTableName());
    }

    protected function getTableName()
    {
        return Config::get('queue.failed.table', 'failed_jobs');
    }
};
