<?php namespace System\Classes;

use Lang;
use Response;
use Exception;
use SystemException;
use ApplicationException;
use Illuminate\Routing\Controller as ControllerBase;

/**
 * The is the master controller for system related routing.
 * It is currently only responsible for serving up the asset combiner contents.
 *
 * @see System\Classes\CombineAssets Asset combiner class
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges, Luke Towers
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
        } catch (Exception $ex) {
            return Response::make('/* '.e($ex->getMessage()).' */', 500);
        }
    }

    /**
     * Resizes an image using the provided configuration
     * and returns a redirect to the resized image
     *
     * @param string $identifier The identifier used to retrieve the image configuration
     * @return RedirectResponse
     */
    public function resizer(string $identifier)
    {
        // The URL-encoded URL to the resized image has to be passed as a GET variable
        // because of Laravel rawurldecode's the requested URL before passing it to the routing engine
        // @see https://github.com/laravel/framework/pull/4338
        $encodedUrl = input('t');

        $resizedUrl = ImageResizer::getValidResizedUrl($identifier, $encodedUrl);
        if (empty($resizedUrl)) {
            return response('Invalid identifier or redirect URL', 400);
        }

        // Attempt to process the resize
        try {
            $resizer = ImageResizer::fromIdentifier($identifier);
            $resizer->resize();
        } catch (SystemException $ex) {
            // If the resizing failed it was most likely because it is in progress or has already finished
        }

        return redirect()->to($resizedUrl);
    }
}
