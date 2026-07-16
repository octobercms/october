<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        if (Schema::hasColumn('tailor_global_repeaters', 'site_root_id')) {
            return;
        }

        Schema::table('tailor_global_repeaters', function (Blueprint $table) {
            $table->integer('site_root_id')->nullable()->index();
        });
    }

    public function down()
    {
    }
};
