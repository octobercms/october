<?php namespace Tailor\Classes\SchemaBuilder;

use Schema;

/**
 * HasRepeaterTable
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasRepeaterTable
{
    /**
     * migrateRepeaters
     */
    public function migrateRepeaters()
    {
        $tableName = $this->blueprint->getRepeaterTableName();
        $tableExists = Schema::hasTable($tableName);

        if ($tableExists) {
            Schema::table($tableName, function ($table) {
                $this->patchRepeaterTableColumns($table);
            });
            return;
        }

        Schema::create($tableName, function ($table) {
            $this->defineRepeaterTableColumns($table);
            $this->defineTableComment($table, "Repeaters for :name [:id].");
        });

        $this->actionCount++;
    }

    /**
     * patchRepeaterTableColumns
     */
    protected function patchRepeaterTableColumns($table)
    {
        $tableColumns = Schema::getColumnListing($table->getTable());

        // Patch missing columns
        if (!in_array('parent_id', $tableColumns)) {
            $table->integer('parent_id')->nullable();
        }

        if (!in_array('site_root_id', $tableColumns)) {
            $table->integer('site_root_id')->nullable()->index();
        }

        // Increment actions
        if ($table->getColumns() || $table->getCommands()) {
            $this->defineTableComment($table);
            $this->actionCount++;
        }
    }

    /**
     * defineRepeaterTableColumns
     */
    protected function defineRepeaterTableColumns($table)
    {
        $table->increments('id');
        $table->integer('host_id')->nullable();
        $table->string('host_field')->nullable();
        $table->integer('site_id')->nullable()->index();
        $table->string('content_group')->nullable();
        $table->mediumText('content_value')->nullable();
        $table->text('content_spawn_path')->nullable();
        $table->integer('parent_id')->nullable();
        $table->integer('site_root_id')->nullable()->index();
        $table->integer('sort_order')->nullable();
        $table->timestamps();
        $table->index(['host_id', 'host_field'], $table->getTable().'_idx');
    }
}
