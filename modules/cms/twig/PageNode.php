<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Compiler;

/**
 * Represents a page node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PageNode extends Twig_Node
{
    public function __construct($lineno, $tag = 'page')
    {
        parent::__construct([], [], $lineno, $tag);
    }

    /**
     * Compiles the node to PHP.
     *
     * @param Twig_Compiler $compiler A Twig_Compiler instance
     */
    public function compile(Twig_Compiler $compiler)
    {
        $compiler
            ->addDebugInfo($this)
            ->write("echo \$this->env->getExtension('CMS')->pageFunction();\n")
        ;
    }
}
