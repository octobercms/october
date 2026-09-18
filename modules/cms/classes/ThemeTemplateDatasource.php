<?php namespace Cms\Classes;

use October\Rain\Halcyon\Datasource\DbDatasource;

/**
 * ThemeTemplateDatasource pins Halcyon template storage to cms_theme_templates.
 *
 * The index cache lives on DbDatasource. This wrapper supplies that table so
 * callers only pass the theme source.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeTemplateDatasource
{
    /**
     * @var string table used for theme templates
     */
    const TABLE = 'cms_theme_templates';

    /**
     * make a datasource for a theme directory
     */
    public static function make(string $source): DbDatasource
    {
        return new DbDatasource($source, self::TABLE);
    }

    /**
     * clearCache forgets the template index for a theme source.
     * Deletes that skip the datasource never call flushCache().
     */
    public static function clearCache(string $source): void
    {
        DbDatasource::clearCache($source, self::TABLE);
    }
}
