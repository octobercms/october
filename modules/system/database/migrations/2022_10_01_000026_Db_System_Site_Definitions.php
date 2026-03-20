<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::create('system_site_definitions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->nullable();
            $table->string('code')->index()->nullable();
            $table->integer('sort_order')->nullable();
            $table->boolean('is_custom_url')->default(0);
            $table->string('app_url')->nullable();
            $table->string('theme')->nullable();
            $table->string('locale')->nullable();
            $table->string('fallback_locale')->nullable();
            $table->string('timezone')->nullable();
            $table->boolean('is_host_restricted')->default(0);
            $table->mediumText('allow_hosts')->nullable();
            $table->boolean('is_prefixed')->default(0);
            $table->string('route_prefix')->nullable();
            $table->boolean('is_styled')->default(0);
            $table->string('color_foreground')->nullable();
            $table->string('color_background')->nullable();
            $table->boolean('is_role_restricted')->default(0);
            $table->mediumText('allow_roles')->nullable();
            $table->boolean('is_primary')->default(0);
            $table->boolean('is_enabled')->default(0);
            $table->boolean('is_enabled_edit')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('system_site_definitions');
    }
};
