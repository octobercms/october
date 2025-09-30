<?php namespace Cms\Twig\Node;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * DefaultNode represents a "default" node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
#[\Twig\Attribute\YieldReady]
class DefaultNode extends TwigNode
{
    /**
     * __construct
     */
    public function __construct(array $nodes = [], array $attributes = [], int $lineno = 0)
    {
        parent::__construct($nodes, $attributes, $lineno);
    }

    /**
     * Compiles the node to PHP.
     */
    public function compile(TwigCompiler $compiler)
    {
        $compiler
            ->addDebugInfo($this)
            ->write("yield '<!-- X_OCTOBER_DEFAULT_BLOCK_CONTENT -->';\n");
    }
}
