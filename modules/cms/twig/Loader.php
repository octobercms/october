<?php namespace Cms\Twig;

use Twig_LoaderInterface;
use Cms\Classes\CmsObject;

/**
 * This class implements a Twig template loader for the CMS.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Loader implements Twig_LoaderInterface
{
    /**
     * @var \Cms\Classes\CmsCompoundObject A CMS object to load the template from.
     */
    protected $obj;

    /**
     * Sets a CMS object to load the template from.
     * @param \Cms\Classes\CmsObject $obj Specifies the CMS object.
     */
    public function setObject(CmsObject $obj)
    {
        $this->obj = $obj;
    }

    public function getSource($name)
    {
        return $this->obj->getTwigContent();
    }

    public function getCacheKey($name)
    {
        return $this->obj->getFullPath();
    }

    public function isFresh($name, $time)
    {
        return $this->obj->isLoadedFromCache();
    }
}
