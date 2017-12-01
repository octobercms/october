<?php

use October\Rain\Database\Updates\Migration;

/**
 * This migration addresses a MySQL specific issue around STRICT MODE.
 * In past versions, Laravel would give timestamps a bad default value
 * of "0" considered invalid by MySQL. Strict mode is disabled and the
 * the timestamps are patched up. Credit for this work: Dave Shoreman.
 */
class DbSystemTimestampFix extends Migration
{
    public function up()
    {
        DbDongle::disableStrictMode();

        foreach ($this->getCoreTables() as $table => $columns) {
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

    protected function getCoreTables()
    {
        $failedJobsTable = Config::get('queue.failed.table', 'failed_jobs');

        return [
            'deferred_bindings',
            $failedJobsTable => 'failed_at',
            'system_files',
            'system_event_logs',
            'system_mail_layouts',
            'system_mail_templates',
            'system_plugin_history' => 'created_at',
            'system_plugin_versions' => 'created_at',
            'system_request_logs',
            'system_revisions',
        ];
    }
}
