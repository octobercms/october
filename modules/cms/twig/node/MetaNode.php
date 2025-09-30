<?php namespace Cms\Twig\Node;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * MetaNode represents a "meta" node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
#[\Twig\Attribute\YieldReady]
class MetaNode extends TwigNode
{
    /**
     * __construct
     */
    public function __construct(int $lineno)
    {
        parent::__construct([], [], $lineno);
    }

    /**
     * Compiles the node to PHP.
     */
    public function compile(TwigCompiler $compiler)
    {
        $compiler
            ->addDebugInfo($this)
            ->write("yield \$this->env->getExtension(\Cms\Twig\Extension::class)->displayBlock('meta');\n");
    }
}
