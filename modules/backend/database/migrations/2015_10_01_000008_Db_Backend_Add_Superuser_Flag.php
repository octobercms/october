<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Backend\Models\User as AdminModel;

class DbBackendAddSuperuserFlag extends Migration
{
    public function up()
    {
        Schema::table('backend_users', function (Blueprint $table) {
            $table->boolean('is_superuser')->default(false);
        });

        AdminModel::all()->each(function($user) {
            if ($user->hasPermission('superuser')) {
                $user->is_superuser = true;
                $user->save();
            }
        });
    }

    public function down()
    {
        // Schema::table('backend_users', function (Blueprint $table) {
        //     $table->dropColumn('is_superuser');
        // });
    }
}
