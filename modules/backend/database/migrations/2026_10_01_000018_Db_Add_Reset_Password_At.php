<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        Schema::table('backend_users', function (Blueprint $table) {
            $table->timestamp('reset_password_at')->nullable();
        });
    }

    public function down()
    {
        Schema::table('backend_users', function (Blueprint $table) {
            $table->dropColumn('reset_password_at');
        });
    }
};
