<?php namespace Cms\Controllers;

use Backend\Controllers\Media as MediaController;

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
        traceLog('Controller Cms\Controllers\Media has been deprecated, use ' . MediaController::class . ' instead.');
        parent::__construct();
    }
}
