<?php namespace System\Helpers;

use View as ViewFacade;

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
