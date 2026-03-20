<?php namespace System\Models;

use October\Rain\Database\Models\TranslateAttribute as TranslateAttributeBase;

/**
 * TranslateAttribute model for system translations
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class TranslateAttribute extends TranslateAttributeBase
{
    /**
     * @var string table associated with the model
     */
    public $table = 'system_translate_attributes';
}
