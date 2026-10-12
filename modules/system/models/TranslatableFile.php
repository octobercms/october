<?php namespace System\Models;

/**
 * TranslatableFile is a file attachment with a translated title and description.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class TranslatableFile extends File
{
    use \October\Rain\Database\Traits\Translatable;

    /**
     * @var array translatable attribute names
     */
    public $translatable = [
        'title',
        'description',
    ];
}
