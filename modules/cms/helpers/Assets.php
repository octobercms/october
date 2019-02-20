<?php namespace Cms\Helpers;

/**
 * Assets Helper
 *
 * @package october\cms
 * @see \Cms\Facades\Cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Assets
{
    const JS_TYPE_DEFAULT = 'text/javascript';

    /**
     * @param string $url
     * @param string $type
     * @param array  $attributes
     *
     * @return string
     */
    public static function renderJsAsset(string $url, string $type = self::JS_TYPE_DEFAULT, array $attributes = [])
    {
        return sprintf("<script type='%s' src='%s' %s></script>", $type, $url, implode(' ', $attributes));
    }

    /**
     * @param string $url
     * @param array  $attributes
     *
     * @return string
     */
    public static function renderCssAsset(string $url, array $attributes = [])
    {
        return sprintf("<link rel='stylesheet' href='%s' %s>", $url, implode(' ', $attributes));
    }
}
