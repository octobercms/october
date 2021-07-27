<?php namespace System\Console;

use Composer\Script\Event;
use Composer\Installer\PackageEvent;

/**
 * ComposerScript is a collection of composer script logic
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ComposerScript
{
    /**
     * postAutoloadDump
     */
    public static function postAutoloadDump(Event $event)
    {
        // passthru('php artisan package:discover');
    }

    /**
     * postUpdateCmd
     */
    public static function postUpdateCmd(Event $event)
    {
    }

    /**
     * prePackageUninstall
     */
    public static function prePackageUninstall(PackageEvent $event)
    {
    }
}
