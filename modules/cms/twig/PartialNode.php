<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Compiler;

/**
 * Represents a partial node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PartialNode extends Twig_Node
{
    public function __construct(Twig_Node $nodes, $paramNames, $lineno, $tag = 'partial')
    {
        parent::__construct(['nodes' => $nodes], ['names' => $paramNames], $lineno, $tag);
    }

    /**
     * Compiles the node to PHP.
     *
     * @param Twig_Compiler $compiler A Twig_Compiler instance
     */
    public function compile(Twig_Compiler $compiler)
    {
        $compiler->addDebugInfo($this);

        $compiler->write("\$context['__cms_partial_params'] = [];\n");

        for ($i = 1; $i < count($this->getNode('nodes')); $i++) {
            $compiler->write("\$context['__cms_partial_params']['".$this->getAttribute('names')[$i-1]."'] = ");
            $compiler->subcompile($this->getNode('nodes')->getNode($i));
            $compiler->write(";\n");
        }

        $compiler
            ->write("echo \$this->env->getExtension('Cms\Twig\Extension')->partialFunction(")
            ->subcompile($this->getNode('nodes')->getNode(0))
            ->write(", \$context['__cms_partial_params']")
            ->write(", true")
            ->write(");\n")
        ;

        $compiler->write("unset(\$context['__cms_partial_params']);\n");
    }
}
