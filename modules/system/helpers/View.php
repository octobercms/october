<?php namespace System\Helpers;

use View as ViewFacade;

/**
 * This helper class is used to extract basic variables
 * (scalar or array) from the global `View` Facade.
 *
 * You can register these global variables with `View::share`.
 *
 *     View::share('siteName', 'OctoberCMS');
 *
 * Then available globally for use in the front-end and mail templates.
 */
class View
{
    /**
     * @var array Cache for global variables.
     */
    protected static $globalVarCache;

    /**
     * Returns shared view variables, this should be used for simple rendering cycles.
     * Such as content blocks and mail templates.
     *
     * @return array
     */
    public static function getGlobalVars()
    {
        if (static::$globalVarCache !== null) {
            return static::$globalVarCache;
        }

        $vars = array_filter(ViewFacade::getShared(), function ($var) {
            return is_scalar($var) || is_array($var);
        });

        return static::$globalVarCache = $vars;
    }
}
