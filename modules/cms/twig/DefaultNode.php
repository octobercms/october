<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Compiler;

/**
 * Represents a "default" node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class DefaultNode extends Twig_Node
{
    public function __construct($lineno, $tag = 'default')
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
            ->write("echo '<!-- X_OCTOBER_DEFAULT_BLOCK_CONTENT -->';\n")
        ;
    }
}
