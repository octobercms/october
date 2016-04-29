<?php

use October\Rain\Database\Updates\Migration;

class DbBackendTimestampFix extends Migration
{
    protected $backendTables = [
        'backend_users',
        'backend_user_groups',
        'backend_access_log',
    ];

    public function up()
    {
        // Disable all special modes such as NO_ZERO_DATE to prevent any
        // errors from MySQL before we can update the timestamp columns.
        Db::statement("SET @@SQL_MODE=''");

        foreach ($this->backendTables as $table) {
            DbDongle::convertTimestamps($table);
        }
    }

    public function down()
    {
        // ...
    }
}
