<?php namespace Backend\Skins;

use File;
use Backend\Classes\Skin;
use October\Rain\Router\Helper as RouterHelper;

/**
 * Standard skin information file.
 *
 * This skin uses the default paths always, there is no lookup required.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

class Standard extends Skin
{

    /**
     * {@inheritDoc}
     */
    public function __construct()
    {
        $this->skinPath = $this->defaultSkinPath = base_path() . '/modules/backend';
        $this->publicSkinPath = $this->defaultPublicSkinPath = File::localToPublic($this->skinPath);
    }

    /**
     * {@inheritDoc}
     */
    public function skinDetails()
    {
        return [
            'name' => 'Default Skin'
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function getPath($path = null, $isPublic = false)
    {
        $path = RouterHelper::normalizeUrl($path);

        return $isPublic
            ? $this->defaultPublicSkinPath . $path
            : $this->defaultSkinPath . $path;
    }

    /**
     * {@inheritDoc}
     */
    public function getLayoutPaths()
    {
        return [$this->skinPath.'/layouts'];
    }
}
