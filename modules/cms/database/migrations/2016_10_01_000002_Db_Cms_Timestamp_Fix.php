<?php

use October\Rain\Database\Updates\Migration;

class DbCmsTimestampFix extends Migration
{
    public function up()
    {
        // Disable all special modes such as NO_ZERO_DATE to prevent any
        // errors from MySQL before we can update the timestamp columns.
        Db::statement("SET @@SQL_MODE=''");
        DbDongle::convertTimestamps('cms_theme_data');
    }

    public function down()
    {
        // ...
    }
}
