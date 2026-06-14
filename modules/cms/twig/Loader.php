<?php namespace Cms\Twig;

use Site;
use Event;
use Twig\Source as TwigSource;
use Twig\Loader\LoaderInterface as TwigLoaderInterface;
use Cms\Contracts\CmsObject;
use System\Twig\Loader as LoaderBase;
use Cms\Classes\Partial as CmsPartial;
use Exception;

/**
 * Loader implements a Twig template loader for the CMS.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Loader extends LoaderBase implements TwigLoaderInterface
{
    /**
     * @var \Cms\Classes\CmsCompoundObject obj is the CMS object to load the template from.
     */
    protected $obj;

    /**
     * @var array fallbackCache for fallback objects.
     */
    protected $fallbackCache = [];

    /**
     * setObject sets a CMS object to load the template from.
     */
    public function setObject(CmsObject $obj)
    {
        $this->obj = $obj;
    }

    /**
     * getSourceContext returns the Twig content string.
     * This step is cached internally by Twig.
     */
    public function getSourceContext(string $name): TwigSource
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
         *         $dataHolder->content = "New content";
         *     });
         *
         */
        $dataHolder = (object) ['content' => $content];
        Event::fire('cms.template.processTwigContent', [$this->obj, $dataHolder]);

        return new TwigSource((string) $dataHolder->content, $name);
    }

    /**
     * getCacheKey returns the Twig cache key.
     */
    public function getCacheKey(string $name): string
    {
        if (!$this->validateCmsObject($name)) {
            return parent::getCacheKey($name);
        }

        return $this->obj->getTwigCacheKey();
    }

    /**
     * isFresh determines if the content is fresh.
     */
    public function isFresh(string $name, int $time): bool
    {
        if (!$this->validateCmsObject($name)) {
            return parent::isFresh($name, $time);
        }

        return $this->obj->mtime <= $time;
    }

    /**
     * getFilename returns the file name of the loaded template.
     */
    public function getFilename($name)
    {
        if (!$this->validateCmsObject($name)) {
            return parent::getFilename($name);
        }

        return $this->obj->getFilePath();
    }

    /**
     * exists checks that the template exists.
     */
    public function exists(string $name)
    {
        if (!$this->validateCmsObject($name)) {
            return parent::exists($name);
        }

        return $this->obj->exists;
    }

    /**
     * validateCmsObject is an internal method that checks if the template name matches
     * the loaded object, with fallback support to partials.
     */
    protected function validateCmsObject($name): bool
    {
        if ($this->obj && $this->obj->getFilePath() === $name) {
            return true;
        }

        if ($fallbackObj = $this->findFallbackObject($name)) {
            $this->obj = $fallbackObj;
            return true;
        }

        return false;
    }

    /**
     * findFallbackObject looks up a fallback CMS partial object.
     * @return \Cms\Classes\Partial
     */
    protected function findFallbackObject($name)
    {
        if (strpos($name, '::') !== false) {
            return false;
        }

        if (array_key_exists($name, $this->fallbackCache)) {
            return $this->fallbackCache[$name];
        }

        try {
            if (($site = Site::getSiteFromContext()) && $site->theme) {
                return $this->fallbackCache[$name] = CmsPartial::inTheme($site->theme)->find($name);
            }
        }
        catch (Exception $ex) {
        }

        try {
            return $this->fallbackCache[$name] = CmsPartial::find($name);
        }
        catch (Exception $ex) {
        }

        return false;
    }
}
