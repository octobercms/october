<?php namespace System\Facades;

use October\Rain\Support\Facade;

/**
 * System facade
 *
 * @method static bool hasModule(string $name)
 * @method static array listModules()
 * @method static bool hasDatabase()
 * @method static bool checkDebugMode()
 * @method static bool checkSafeMode()
 * @method static string composerToOctoberCode(string $name)
 * @method static string octoberToComposerCode(string $name, string $type, bool $prefix)
 *
 * @see \System\Helpers\System
 */
class System extends Facade
{
    /**
     * @var string VERSION for October CMS, including major and minor.
     */
    const VERSION = '4.1';

    /**
     * getFacadeAccessor returns the registered name of the component
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'system.helper';
    }
}
