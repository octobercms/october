<?php namespace Cms\FormWidgets;

use Backend\FormWidgets\MediaFinder as BackendMediaFinder;

/**
 * Media Finder
 * Renders a record finder field.
 *
 *    image:
 *        label: Some image
 *        type: media
 *        prompt: Click the %s button to find a user
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 * @deprecated Use Backend\FormWidgets\MediaFinder. Remove if year >= 2020.
 */
class MediaFinder extends BackendMediaFinder
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        traceLog('FormWidget Cms\FormWidgets\MediaFinder has been deprecated, use ' . BackendMediaFinder::class . ' instead.');

        $this->assetPath = '/modules/backend/formwidgets/mediafinder/assets';
        $this->viewPath = base_path('/modules/backend/formwidgets/mediafinder/partials');

        parent::__construct(...func_get_args());
    }
}
