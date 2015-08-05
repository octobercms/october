<?php namespace Cms\Twig;

use Event;
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

    /**
     * Returns the Twig content string.
     * This step is cached internally by Twig.
     */
    public function getSource($name)
    {
        $content = $this->obj->getTwigContent();

        /*
         * Extensibility
         */
        $dataHolder = (object) ['content' => $content];

        Event::fire('cms.template.processTwigContent', [$this->obj, $dataHolder]);

        return $dataHolder->content;
    }

    /**
     * Returns the Twig cache key.
     */
    public function getCacheKey($name)
    {
        return $this->obj->getFullPath();
    }

    /**
     * Determines if the content is fresh.
     */
    public function isFresh($name, $time)
    {
        return $this->obj->isLoadedFromCache();
    }
}
