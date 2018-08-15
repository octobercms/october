<?php namespace System\Classes;

use Lang;
use ApplicationException;
use Illuminate\Routing\Controller as ControllerBase;
use Exception;

/**
 * The is the master controller for system related routing.
 * It is currently only responsible for serving up the asset combiner contents.
 *
 * @see System\Classes\CombineAssets Asset combiner class
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SystemController extends ControllerBase
{
    /**
     * Combines JavaScript and StyleSheet assets.
     * @param string $name Combined file code
     * @return string Combined content.
     */
    public function combine($name)
    {
        try {

            if (!strpos($name, '-')) {
                throw new ApplicationException(Lang::get('system::lang.combiner.not_found', ['name' => $name]));
            }

            $parts = explode('-', $name);
            $cacheId = $parts[0];

            $combiner = CombineAssets::instance();
            return $combiner->getContents($cacheId);

        }
        catch (Exception $ex) {
            return '/* '.e($ex->getMessage()).' */';
        }
    }
}
