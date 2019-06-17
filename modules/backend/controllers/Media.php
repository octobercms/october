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
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.Backend', 'media', true);
        $this->pageTitle = 'backend::lang.media.menu_label';

        $manager = new MediaManager($this, 'manager');
        $manager->bindToController();
    }

    public function index()
    {
        $this->bodyClass = 'compact-container';
    }
}
