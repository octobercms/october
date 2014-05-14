<?php namespace Backend\Skins;

use Backend\Classes\Skin;

/**
 * Standard skin information file
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

class Standard extends Skin
{

    /**
     * {@inheritDoc}
     */
    public function skinDetails()
    {
        return [
            'name' => 'Default Skin'
        ];
    }

}