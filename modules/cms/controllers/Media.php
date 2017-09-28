<?php namespace Cms\Controllers;

use Backend\Controllers\Media;

/**
 * CMS Media Manager
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 * @deprecated Use Backend\Controllers\Media. Remove if year >= 2020.
 */
class Media extends MediaController
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();
    }
}
