<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Compiler;
use Twig_NodeInterface;

/**
 * Represents a put node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PutNode extends Twig_Node
{
    public function __construct(Twig_NodeInterface $body, $name, $lineno, $tag = 'put')
    {
        parent::__construct(['body' => $body], ['name' => $name], $lineno, $tag);
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
            ->write("echo \$this->env->getExtension('CMS')->startBlock(")
            ->raw("'".$this->getAttribute('name')."'")
            ->write(");\n")
        ;

        $compiler->subcompile($this->getNode('body'));

        $compiler
            ->addDebugInfo($this)
            ->write("echo \$this->env->getExtension('CMS')->endBlock();\n")
        ;
    }
}