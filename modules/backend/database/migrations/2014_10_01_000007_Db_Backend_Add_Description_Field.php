<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbBackendAddDescriptionField extends Migration
{
    public function up()
    {
        Schema::table('backend_user_groups', function (Blueprint $table) {
            $table->string('code')->nullable()->index('code_index');
            $table->text('description')->nullable();
            $table->boolean('is_new_user_default')->default(false);
        });
    }

    public function down()
    {
        // Schema::table('backend_user_groups', function (Blueprint $table) {
        //     $table->dropColumn('code');
        //     $table->dropColumn('description');
        //     $table->dropColumn('is_new_user_default');
        // });
    }
}
