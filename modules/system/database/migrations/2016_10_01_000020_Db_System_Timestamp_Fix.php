<?php

use October\Rain\Database\Updates\Migration;

class DbSystemTimestampFix extends Migration
{
    protected $coreTables = [
        'deferred_bindings',
        'failed_jobs' => 'failed_at',
        'system_files',
        'system_event_logs',
        'system_mail_layouts',
        'system_mail_templates',
        'system_plugin_history' => 'created_at',
        'system_plugin_versions' => 'created_at',
        'system_request_logs',
        'system_revisions',
    ];

    public function up()
    {
        // Disable all special modes such as NO_ZERO_DATE to prevent any
        // errors from MySQL before we can update the timestamp columns.
        Db::statement("SET @@SQL_MODE=''");

        foreach ($this->coreTables as $table => $columns) {
            if (is_int($table)) {
                $table = $columns;
                $columns = ['created_at', 'updated_at'];
            }

            DbDongle::convertTimestamps($table, $columns);
        }
    }

    public function down()
    {
        // ...
    }
}
