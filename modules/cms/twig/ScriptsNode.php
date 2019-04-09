<?php namespace Cms\Twig;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * Represents a "scripts" node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ScriptsNode extends TwigNode
{
    public function __construct($lineno, $tag = 'scripts')
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
            ->write("echo \$this->env->getExtension('Cms\Twig\Extension')->assetsFunction('js');\n")
            ->write("echo \$this->env->getExtension('Cms\Twig\Extension')->displayBlock('scripts');\n")
        ;
    }
}
