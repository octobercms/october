<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::create('system_site_groups', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('code')->index()->nullable();
            $table->timestamps();
        });

        // Seed the default group
        Db::table('system_site_groups')->insert([
            'name' => 'Default',
            'code' => 'default',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('system_site_groups');
    }
};
