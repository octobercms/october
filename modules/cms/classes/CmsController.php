<?php namespace Cms\Classes;

use App;
use Illuminate\Routing\Controller as ControllerBase;
use Closure;

/**
 * This is the master controller for all front-end pages.
 * All requests that have not been picked up already by the router will end up here,
 * then the URL is passed to the front-end controller for processing.
 *
 * @see Cms\Classes\Controller Front-end controller class
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class CmsController extends ControllerBase
{
    use \October\Rain\Extension\ExtendableTrait;

    /**
     * @var array Behaviors implemented by this controller.
     */
    public $implement;

    /**
     * Instantiate a new CmsController instance.
     */
    public function __construct()
    {
        $this->extendableConstruct();
    }

    /**
     * Extend this object properties upon construction.
     * @param Closure $callback
     */
    public static function extend(Closure $callback)
    {
        self::extendableExtendCallback($callback);
    }

    /**
     * Finds and serves the request using the primary controller.
     * @param string $url Specifies the requested page URL.
     * If the parameter is omitted, the current URL used.
     * @return string Returns the processed page content.
     */
    public function run($url = '/')
    {
        return App::make(Controller::class)->run($url);
    }
}
