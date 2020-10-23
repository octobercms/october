<?php namespace Cms\Twig;

use Event;
use Twig\Source as TwigSource;
use Twig\Loader\LoaderInterface as TwigLoaderInterface;
use Cms\Contracts\CmsObject;
use System\Twig\Loader as LoaderBase;
use Cms\Classes\Partial as CmsPartial;

/**
 * This class implements a Twig template loader for the CMS.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Loader extends LoaderBase implements TwigLoaderInterface
{
    /**
     * @var \Cms\Classes\CmsCompoundObject A CMS object to load the template from.
     */
    protected $obj;

    /**
     * @var array Cache
     */
    protected $fallbackCache = [];

    /**
     * Sets a CMS object to load the template from.
     *
     * @param \Cms\Contracts\CmsObject $obj Specifies the CMS object.
     * @return void
     */
    public function setObject(CmsObject $obj)
    {
        $this->obj = $obj;
    }

    /**
     * Returns the Twig content string.
     * This step is cached internally by Twig.
     *
     * @param string $name The template name
     * @return TwigSource
     */
    public function getSourceContext($name)
    {
        if (!$this->validateCmsObject($name)) {
            return parent::getSourceContext($name);
        }

        $content = $this->obj->getTwigContent();

        /**
         * @event cms.template.processTwigContent
         * Provides an opportunity to modify Twig content before being processed by Twig. `$dataHolder` = {content: $twigContent}
         *
         * Example usage:
         *
         *     Event::listen('cms.template.processTwigContent', function ((\Cms\Classes\CmsObject) $thisObject, (object) $dataHolder) {
         *         $dataHolder->content = "NO CONTENT FOR YOU!";
         *     });
         *
         */
        $dataHolder = (object) ['content' => $content];
        Event::fire('cms.template.processTwigContent', [$this->obj, $dataHolder]);

        return new TwigSource((string) $dataHolder->content, $name);
    }

    /**
     * Returns the Twig cache key.
     *
     * @param string $name The template name
     * @return string
     */
    public function getCacheKey($name)
    {
        if (!$this->validateCmsObject($name)) {
            return parent::getCacheKey($name);
        }

        return $this->obj->getTwigCacheKey();
    }

    /**
     * Determines if the content is fresh.
     *
     * @param string $name The template name
     * @param mixed $time The time to check against the template
     * @return bool
     */
    public function isFresh($name, $time)
    {
        if (!$this->validateCmsObject($name)) {
            return parent::isFresh($name, $time);
        }

        return $this->obj->mtime <= $time;
    }

    /**
     * Returns the file name of the loaded template.
     *
     * @param string $name The template name
     * @return string
     */
    public function getFilename($name)
    {
        if (!$this->validateCmsObject($name)) {
            return parent::getFilename($name);
        }

        return $this->obj->getFilePath();
    }

    /**
     * Checks that the template exists.
     *
     * @param string $name The template name
     * @return bool
     */
    public function exists($name)
    {
        if (!$this->validateCmsObject($name)) {
            return parent::exists($name);
        }

        return $this->obj->exists;
    }

    /**
     * Internal method that checks if the template name matches
     * the loaded object, with fallback support to partials.
     *
     * @param string $name The template name to validate
     * @return bool
     */
    protected function validateCmsObject($name)
    {
        if ($this->obj && $name === $this->obj->getFilePath()) {
            return true;
        }

        if ($fallbackObj = $this->findFallbackObject($name)) {
            $this->obj = $fallbackObj;
            return true;
        }

        return false;
    }

    /**
     * Looks up a fallback CMS partial object.
     *
     * @param string $name The filename to attempt to load a fallback CMS partial for
     * @return Cms\Classes\Partial|bool Returns false if a CMS partial can't be found
     */
    protected function findFallbackObject($name)
    {
        // Ignore Laravel views
        if (strpos($name, '::') !== false) {
            return false;
        }

        // Check the cache
        if (array_key_exists($name, $this->fallbackCache)) {
            return $this->fallbackCache[$name];
        }

        // Attempt to load the path as a CMS Partial object
        try {
            $partial = CmsPartial::find($name);
        } catch (\Exception $e) {
            return false;
        }

        return $this->fallbackCache[$name] = $partial;
    }
}
