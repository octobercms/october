<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Node_Expression;
use Twig_Compiler;

/**
 * Represents a component node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ComponentNode extends Twig_Node
{
    public function __construct(Twig_Node_Expression $name, $lineno, $tag = 'component')
    {
        parent::__construct(['name'=>$name], [], $lineno, $tag);
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
            ->write("echo \$this->env->getExtension('CMS')->componentFunction(")
            ->subcompile($this->getNode('name'))
            ->write(");\n")
        ;
    }
}