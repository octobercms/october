<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbJobsFailedJobsUpdate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table($this->getTableName(), function (Blueprint $table) {
            $table->dropColumn('reserved');
            $table->index(['queue', 'reserved_at']);
        });

        Schema::table($this->getFailedTableName(), function (Blueprint $table) {
            $table->longText('exception')->nullable()->after('payload');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table($this->getTableName(), function (Blueprint $table) {
            $table->tinyInteger('reserved')->unsigned()->default(0);
            $table->dropIndex('jobs_queue_reserved_at_index');
        });

        Schema::table($this->getFailedTableName(), function (Blueprint $table) {
            $table->dropColumn('exception');
        });
    }

    protected function getTableName()
    {
        return Config::get('queue.connections.database.table', 'jobs');
    }

    protected function getFailedTableName()
    {
        return Config::get('queue.failed.table', 'failed_jobs');
    }
}
