<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DbDeferredBindingsAddIndexSession extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deferred_bindings', function (Blueprint $table) {
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
            $table->dropIndex(['session_key']);
        });
    }
}
