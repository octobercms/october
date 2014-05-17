<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Compiler;
use Twig_NodeInterface;

/**
 * Represents a placeholder node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PlaceholderNode extends Twig_Node
{
    public function __construct($name, $body, $lineno, $tag = 'placeholder')
    {
        $nodes = [];
        if ($body)
            $nodes['default'] = $body;

        parent::__construct($nodes, ['name'=>$name], $lineno, $tag);
    }

    /**
     * Compiles the node to PHP.
     *
     * @param Twig_Compiler $compiler A Twig_Compiler instance
     */
    public function compile(Twig_Compiler $compiler)
    {
        $hasBody = $this->hasNode('default');
        $varId = '__placeholder_'.$this->getAttribute('name').'_default_contents';
        $compiler
            ->addDebugInfo($this)
            ->write("\$context[")
            ->raw("'".$varId."'")
            ->raw("] = null;");

        if ($hasBody) {
            $compiler
                ->addDebugInfo($this)
                ->write('ob_start();')
                ->subcompile($this->getNode('default'))
                ->write("\$context[")
                ->raw("'".$varId."'")
                ->raw("] = ob_get_clean();");
        }

        $compiler
            ->addDebugInfo($this)
            ->write("echo \$this->env->getExtension('CMS')->displayBlock(")
            ->raw("'".$this->getAttribute('name')."', ")
            ->raw("\$context[")
            ->raw("'".$varId."'")
            ->raw("]")
            ->raw(");\n")
        ;

        $compiler
            ->addDebugInfo($this)
            ->write("unset(\$context[")
            ->raw("'".$varId."'")
            ->raw("]);");
    }
}