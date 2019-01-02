<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbSystemMailLayoutsAddOptionsField extends Migration
{
    public function up()
    {
        Schema::table('system_mail_layouts', function (Blueprint $table) {
            $table->text('options')->nullable()->after('is_locked');
        });
    }
    
    public function down()
    {
        Schema::table('system_mail_layouts', function (Blueprint $table) {
           $table->dropColumn('options');
        });
    }
}
