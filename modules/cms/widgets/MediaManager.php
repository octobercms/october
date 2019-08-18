<?php namespace Cms\Widgets;

use Backend\Widgets\MediaManager as BackendMediaManager;

/**
 * Media Manager widget.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 * @deprecated Use Backend\Widgets\MediaManager. Remove if year >= 2020.
 */
class MediaManager extends BackendMediaManager
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        traceLog('Widget Cms\Widgets\MediaManager has been deprecated, use ' . BackendMediaManager::class . ' instead.');

        $this->assetPath = '/modules/backend/widgets/mediamanager/assets';
        $this->viewPath = base_path('/modules/backend/widgets/mediamanager/partials');

        parent::__construct(...func_get_args());
    }
}
