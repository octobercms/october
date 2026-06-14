<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::table('dashboard_dashboards', function (Blueprint $table) {
            $table->string('default_start', 32)->nullable();
            $table->string('default_end', 32)->nullable();
            $table->string('default_interval', 32)->nullable();
            $table->string('default_compare', 32)->nullable();
        });
    }

    public function down()
    {
        if (Schema::hasColumn('dashboard_dashboards', 'default_start')) {
            Schema::dropColumns('dashboard_dashboards', 'default_start');
        }

        if (Schema::hasColumn('dashboard_dashboards', 'default_end')) {
            Schema::dropColumns('dashboard_dashboards', 'default_end');
        }

        if (Schema::hasColumn('dashboard_dashboards', 'default_interval')) {
            Schema::dropColumns('dashboard_dashboards', 'default_interval');
        }

        if (Schema::hasColumn('dashboard_dashboards', 'default_compare')) {
            Schema::dropColumns('dashboard_dashboards', 'default_compare');
        }
    }
};
