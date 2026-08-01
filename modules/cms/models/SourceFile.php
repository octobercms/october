<?php namespace Cms\Models;

use October\Rain\Halcyon\SourceFile as BaseSourceFile;

/**
 * SourceFile is the CMS-scoped source file model. It points at the
 * cms_source_files table and is the primitive used to persist non-template
 * file changes (language files, theme assets, etc.) across instances.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class SourceFile extends BaseSourceFile
{
    /**
     * @var string table associated with the model.
     */
    protected $table = 'cms_source_files';
}
