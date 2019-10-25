<?php namespace Cms\Twig;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * Represents a page node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PageNode extends TwigNode
{
    public function __construct($lineno, $tag = 'page')
    {
        parent::__construct([], [], $lineno, $tag);
    }

    /**
     * Compiles the node to PHP.
     *
     * @param TwigCompiler $compiler A TwigCompiler instance
     */
    public function compile(TwigCompiler $compiler)
    {
        $compiler
            ->addDebugInfo($this)
            ->write("echo \$this->env->getExtension('Cms\Twig\Extension')->pageFunction();\n")
        ;
    }
}
