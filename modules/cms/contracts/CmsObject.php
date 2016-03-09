<?php namespace Cms\Contracts;

interface CmsObject
{

    /**
     * Loads the template.
     *
     * @param  string  $hostObj
     * @param  string  $fileName
     * @return mixed
     */
    public static function load($hostObj, $fileName);

    /**
     * Loads and caches the template.
     *
     * @param  string  $hostObj
     * @param  string  $fileName
     * @return mixed
     */
    public static function loadCached($hostObj, $fileName);

    /**
     * Returns the local file path to the template.
     *
     * @param  string  $fileName
     * @return string
     */
    // public static function getFilePath($fileName = null);

    /**
     * Returns the Twig content string.
     *
     * @return string
     */
    public function getTwigContent();

}