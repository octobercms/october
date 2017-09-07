<?php namespace System\Database\Seeds;

use Seeder;
use System\Models\MailLayout;

class SeedSetupMailLayouts extends Seeder
{
    public function run()
    {
        MailLayout::createLayouts();
    }
}
