<?php namespace Cms\Controllers;

use BackendMenu;
use Backend\Classes\Controller;
use Cms\Widgets\MediaManager;

/**
 * CMS Media Manager
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Media extends Controller
{
    public $requiredPermissions = ['media.*'];

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.Cms', 'media', true);
        $this->pageTitle = 'cms::lang.media.menu_label';

        $manager = new MediaManager($this, 'manager');
        $manager->bindToController();
    }

    public function index()
    {
        $this->bodyClass = 'compact-container';
    }
}