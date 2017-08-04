<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbDeferredBindingsAlterSlaveToIntAndAddUniqueSession extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deferred_bindings', function (Blueprint $table) {
            $table->integer('slave_id')->unsigned()->change();
            $table->index('session_key');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('deferred_bindings', function (Blueprint $table) {
            $table->string('slave_id')->change();
            $table->dropIndex(['session_key']);
        });
    }
}
