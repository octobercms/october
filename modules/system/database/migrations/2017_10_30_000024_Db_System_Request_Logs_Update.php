<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbSystemRequestLogsUpdate extends Migration
{
    const MAX_URL_LENGTH = 8000; //https://tools.ietf.org/html/rfc7230#section-3.1.1

    public function up()
    {
        Schema::table('system_request_logs', function (Blueprint $table) {
            $table->string('url', static::MAX_URL_LENGTH)->change();
        });
    }

    public function down()
    {
        //this migration should not be downgraded.
    }
}
