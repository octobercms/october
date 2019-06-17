<?php namespace Backend\Controllers;

use BackendMenu;
use Backend\Classes\Controller;
use Backend\Widgets\MediaManager;

/**
 * Backend Media Manager
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Media extends Controller
{
    /**
     * @var array Permissions required to view this page.
     */
    public $requiredPermissions = ['media.*'];

    /**
     * @var Service Worker in backend
     */
    protected $serviceWorker = config('cms.enableBackendServiceWorkers');

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.Backend', 'media', true);
        $this->pageTitle = 'backend::lang.media.menu_label';

        $manager = new MediaManager($this, 'manager');
        $manager->bindToController();

        // Allow option to turn Service Workers on and off in the backend, see github: #4384
        if ($serviceWorker === 'true') {
            // Add JS File to un-install SW to avoid Cookie Cache Issues when Signin, see github issue: #3707
            $this->addJs(url("/modules/backend/assets/js/october.uninstall-sw.js"));
        }		
    }

    public function index()
    {
        $this->bodyClass = 'compact-container';
    }
}
