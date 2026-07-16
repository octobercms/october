<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    /**
     * up migration
     */
    public function up()
    {
        Schema::create('tailor_globals', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('site_id')->nullable()->index();
            $table->integer('site_root_id')->nullable()->index();
            $table->string('blueprint_uuid')->nullable()->index();
            $table->longText('content')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('tailor_global_joins', function (Blueprint $table) {
            $table->integer('parent_id')->nullable();
            $table->integer('relation_id')->nullable();
            $table->string('relation_type')->nullable();
            $table->string('field_name')->nullable()->index();
            $table->integer('site_id')->nullable()->index();

            $table->index(['relation_id', 'relation_type'], $table->getTable().'_idx');
        });

        Schema::create('tailor_global_repeaters', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('host_id')->nullable();
            $table->string('host_field')->nullable();
            $table->integer('site_id')->nullable()->index();
            $table->integer('site_root_id')->nullable()->index();
            $table->string('content_group')->nullable();
            $table->mediumText('content_value')->nullable();
            $table->text('content_spawn_path')->nullable();
            $table->integer('parent_id')->nullable();
            $table->integer('sort_order')->nullable();
            $table->timestamps();
            $table->index(['host_id', 'host_field'], $table->getTable().'_idx');
        });
    }

    /**
     * down migration
     */
    public function down()
    {
        Schema::dropIfExists('tailor_globals');
        Schema::dropIfExists('tailor_global_joins');
        Schema::dropIfExists('tailor_global_repeaters');
    }
};
