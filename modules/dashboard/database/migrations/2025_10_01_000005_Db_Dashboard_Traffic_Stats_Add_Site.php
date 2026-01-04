<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::table('dashboard_traffic_stats_pageviews', function (Blueprint $table) {
            $table->integer('site_id')->nullable()->index()->after('id');
        });
    }

    public function down()
    {
        Schema::table('dashboard_traffic_stats_pageviews', function (Blueprint $table) {
            $table->dropColumn('site_id');
        });
    }
};
