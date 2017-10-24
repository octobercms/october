<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbSystemMailLayoutsInlineCss extends Migration
{
    public function up()
    {
        Schema::table('system_mail_layouts', function (Blueprint $table) {
            $table->boolean('inline_css')->default(true);
        });
    }
    
    public function down()
    {
        Schema::table('system_mail_layouts', function (Blueprint $table) {
           $table->dropColumn('inline_css');
        });
    }
}
