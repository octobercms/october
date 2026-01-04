<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::table('dashboard_dashboards', function (Blueprint $table) {
            $table->boolean('is_interval_hidden')->default(false);
            $table->boolean('is_system')->default(false);
        });

        // Patch existing tables
        Db::table('dashboard_dashboards')
            ->whereNotNull('owner_field')
            ->update(['is_system' => true])
        ;
    }

    public function down()
    {
        if (Schema::hasColumn('dashboard_dashboards', 'is_interval_hidden')) {
            Schema::dropColumns('dashboard_dashboards', 'is_interval_hidden');
        }

        if (Schema::hasColumn('dashboard_dashboards', 'is_system')) {
            Schema::dropColumns('dashboard_dashboards', 'is_system');
        }
    }
};
