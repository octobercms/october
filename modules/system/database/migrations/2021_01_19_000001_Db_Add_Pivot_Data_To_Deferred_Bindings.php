<?php

use October\Rain\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbAddPivotDataToDeferredBindings extends Migration
{

    public function up()
    {
        Schema::table('deferred_bindings', function (Blueprint $table) {
            $table->mediumText('pivot_data')->nullable()->after('slave_id');
        });
    }

    public function down()
    {
        Schema::table('deferred_bindings', function (Blueprint $table) {
            $table->dropColumn('pivot_data');
        });
    }
}
