<?php namespace Cms\Models;

use Cms\Classes\ThemeManager;
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

    /**
     * boot the model and bust cached theme lang lines when a lang row changes.
     */
    public static function boot()
    {
        parent::boot();

        $clearLangCache = function (self $row) {
            if (str_ends_with((string) $row->source, '.lang')) {
                ThemeManager::clearDatabaseLangCache($row->source);
            }
        };

        static::saved($clearLangCache);
        static::deleted($clearLangCache);
    }
}
