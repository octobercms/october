<?php

use Backend\Models\UserRole;
use October\Rain\Database\Schema\Blueprint;
use October\Rain\Database\Updates\Migration;

class DbBackendUserRoles extends Migration
{
    public function up()
    {
        Schema::create('backend_user_roles', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id');
            $table->string('name')->unique('role_unique');
            $table->string('code')->nullable()->index('role_code_index');
            $table->text('description')->nullable();
            $table->text('permissions')->nullable();
            $table->boolean('is_system')->default(0);
            $table->timestamps();
        });

        // This detects older builds and performs a migration to include
        // the new role system. This column will exist for new installs
        // so this heavy migration process does not need to execute.
        $this->migratePreviousBuild();
    }

    public function down()
    {
        Schema::dropIfExists('backend_user_roles');
    }

    protected function migratePreviousBuild()
    {
        // Role not found in the users table, perform a complete migration.
        // Merging group permissions with the user and assigning the user
        // with the first available role.
        if (!Schema::hasColumn('backend_users', 'role_id')) {
            Schema::table('backend_users', function (Blueprint $table) {
                $table->integer('role_id')->unsigned()->nullable()->index('admin_role_index');
            });

            $this->createSystemUserRoles();
            $this->migratePermissionsFromGroupsToRoles();
        }

        // Drop permissions column on groups table as it is no longer needed.
        if (Schema::hasColumn('backend_user_groups', 'permissions')) {
            Schema::table('backend_user_groups', function (Blueprint $table) {
                $table->dropColumn('permissions');
            });
        }
    }

    protected function createSystemUserRoles()
    {
        Db::table('backend_user_roles')->insert([
            'name' => 'Publisher',
            'code' => UserRole::CODE_PUBLISHER,
            'description' => 'Site editor with access to publishing tools.',
        ]);

        Db::table('backend_user_roles')->insert([
            'name' => 'Developer',
            'code' => UserRole::CODE_DEVELOPER,
            'description' => 'Site administrator with access to developer tools.',
        ]);
    }

    protected function migratePermissionsFromGroupsToRoles()
    {
        $groups = Db::table('backend_user_groups')->get();
        $roles = [];
        $permissions = [];

        /*
         * Carbon copy groups to roles
         */
        foreach ($groups as $group) {
            if (!isset($group->name) || !$group->name) {
                continue;
            }

            try {
                $roles[$group->id] = Db::table('backend_user_roles')->insertGetId([
                    'name' => $group->name,
                    'description' => $group->description,
                    'permissions' => $group->permissions ?? null
                ]);
            }
            catch (Exception $ex) {
            }

            $permissions[$group->id] = $group->permissions ?? null;
        }

        /*
         * Assign a user with the first available role
         */
        $found = [];
        $joins = Db::table('backend_users_groups')->get();

        foreach ($joins as $join) {
            if (!$roleId = array_get($roles, $join->user_group_id)) {
                continue;
            }

            $userId = $join->user_id;

            if (!isset($found[$userId])) {
                Db::table('backend_users')->where('id', $userId)->update([
                    'role_id' => $roleId
                ]);
            }

            $found[$userId][] = $join->user_group_id;
        }

        /*
         * Merge group permissions in to user
         */
        foreach ($found as $userId => $groups) {
            $userPerms = [];

            foreach ($groups as $groupId) {
                if (!$permString = array_get($permissions, $groupId)) {
                    continue;
                }

                try {
                    $perms = json_decode($permString, true);
                    $userPerms = array_merge($userPerms, $perms);
                }
                catch (Exception $ex) {
                }
            }

            if (count($userPerms) > 0) {
                $this->splicePermissionsForUser($userId, $userPerms);
            }
        }
    }

    protected function splicePermissionsForUser($userId, $permissions)
    {
        /*
         * Look up user and splice the provided permissions in
         */
        $user = Db::table('backend_users')->where('id', $userId)->first();
        if (!$user) {
            return;
        }

        try {
            $currentPerms = $user->permissions ? json_decode($user->permissions, true) : [];
            $newPerms = array_merge($permissions, $currentPerms);

            Db::table('backend_users')->where('id', $userId)->update([
                'permissions' => json_encode($newPerms)
            ]);
        }
        catch (Exception $ex) {
        }
    }
}
