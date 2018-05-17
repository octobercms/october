<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Compiler;

/**
 * Represents a put node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PutNode extends Twig_Node
{
    public function __construct(Twig_Node $body, $name, $endType, $lineno, $tag = 'put')
    {
        parent::__construct(['body' => $body], ['name' => $name, 'endType' => $endType], $lineno, $tag);
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
            ->write("echo \$this->env->getExtension('Cms\Twig\Extension')->startBlock(")
            ->raw("'".$this->getAttribute('name')."'")
            ->write(");\n")
        ;

        $isOverwrite = strtolower($this->getAttribute('endType')) == 'overwrite';

        $compiler->subcompile($this->getNode('body'));

        $compiler
            ->addDebugInfo($this)
            ->write("echo \$this->env->getExtension('Cms\Twig\Extension')->endBlock(")
            ->raw($isOverwrite ? 'false' : 'true')
            ->write(");\n")
        ;
    }
}
