<?php

use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('system_site_definitions', 'group_id')) {
            Schema::table('system_site_definitions', function (Blueprint $table) {
                $table->integer('group_id')->index()->nullable();
            });
        }

        // Assign existing sites to the default group
        if ($groupId = Db::table('system_site_groups')->orderBy('id')->value('id')) {
            Db::table('system_site_definitions')->whereNull('group_id')->update(['group_id' => $groupId]);
        }
    }

    public function down()
    {
        if (Schema::hasColumn('system_site_definitions', 'group_id')) {
            Schema::dropColumns('system_site_definitions', 'group_id');
        }
    }
};
