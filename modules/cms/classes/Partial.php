<?php namespace Cms\Classes;

/**
 * The CMS partial class.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Partial extends CmsCompoundObject
{
    /**
     * From david: I dont think this variable $maxNesting is still working
     * TODO: Make sure that we use this variable to control the max nesting level which allows us to have different max nesting possiablities in the different cms type(pages, partials ...)
     */
    protected $maxNesting = null;

    /**
     * @var string The container name associated with the model, eg: pages.
     */
    protected $dirName = 'partials';

    /**
     * Returns name of a PHP class to us a parent for the PHP class created for the object's PHP section.
     * @return string Returns the class name.
     */
    public function getCodeClassParent()
    {
        return PartialCode::class;
    }
}
