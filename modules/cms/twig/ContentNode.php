<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Compiler;
use Twig_NodeInterface;

/**
 * Represents a content node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ContentNode extends Twig_Node
{
    public function __construct(Twig_NodeInterface $nodes, $paramNames, $lineno, $tag = 'content')
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

        $compiler->write("\$context['__cms_content_params'] = [];\n");

        for ($i = 1; $i < count($this->getNode('nodes')); $i++) {
            $compiler->write("\$context['__cms_content_params']['".$this->getAttribute('names')[$i-1]."'] = ");
            $compiler->write('twig_escape_filter($this->env, ');
            $compiler->subcompile($this->getNode('nodes')->getNode($i));
            $compiler->write(")");
            $compiler->write(";\n");
        }

        $compiler
            ->write("echo \$this->env->getExtension('CMS')->contentFunction(")
            ->subcompile($this->getNode('nodes')->getNode(0))
            ->write(", \$context['__cms_content_params']")
            ->write(");\n")
        ;

        $compiler->write("unset(\$context['__cms_content_params']);\n");
    }
}
