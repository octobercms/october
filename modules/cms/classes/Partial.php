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
     * @var string The container name associated with the model, eg: pages.
     */
    protected $dirName = 'partials';

    /**
     * @var array collection of vars passed to partial
     */
     protected $vars = [];

    /**
     * Returns name of a PHP class to us a parent for the PHP class created for the object's PHP section.
     * @return string Returns the class name.
     */
    public function getCodeClassParent()
    {
        return '\Cms\Classes\PartialCode';
    }

    public function getParam( $var )
    {
        if(isset($this->vars[$var])) {
            return $this->vars[$var];
        } else {
            return null;
        }
    }

    public function getParams()
    {
      return $this->vars;
    }
}
