<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::create('dashboard_dashboards_roles', function(Blueprint $table) {
            $table->bigInteger('dashboard_id')->unsigned();
            $table->integer('role_id')->unsigned();
            $table->primary(['dashboard_id', 'role_id']);
        });

        Schema::table('dashboard_dashboards', function(Blueprint $table) {
            $table->boolean('is_hidden')->default(false);
        });
    }

    public function down()
    {
        Schema::dropIfExists('dashboard_dashboards_roles');

        if (Schema::hasColumn('dashboard_dashboards', 'is_hidden')) {
            Schema::dropColumns('dashboard_dashboards', 'is_hidden');
        }
    }
};
