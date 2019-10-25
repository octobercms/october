<?php namespace Cms\Twig;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * Represents a placeholder node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PlaceholderNode extends TwigNode
{
    public function __construct($name, $paramValues, $body, $lineno, $tag = 'placeholder')
    {
        $nodes = [];

        if ($body) {
            $nodes['default'] = $body;
        }

        $attributes = $paramValues;
        $attributes['name'] = $name;

        parent::__construct($nodes, $attributes, $lineno, $tag);
    }

    /**
     * Compiles the node to PHP.
     *
     * @param TwigCompiler $compiler A TwigCompiler instance
     */
    public function compile(TwigCompiler $compiler)
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

        $isText = $this->hasAttribute('type') && $this->getAttribute('type') == 'text';

        $compiler->addDebugInfo($this);
        if (!$isText) {
            $compiler->write("echo \$this->env->getExtension('Cms\Twig\Extension')->displayBlock(");
        }
        else {
            $compiler->write("echo twig_escape_filter(\$this->env, \$this->env->getExtension('Cms\Twig\Extension')->displayBlock(");
        }

        $compiler
            ->raw("'".$this->getAttribute('name')."', ")
            ->raw("\$context[")
            ->raw("'".$varId."'")
            ->raw("]")
            ->raw(")");

        if (!$isText) {
            $compiler->raw(";\n");
        }
        else {
            $compiler->raw(");\n");
        }

        $compiler
            ->addDebugInfo($this)
            ->write("unset(\$context[")
            ->raw("'".$varId."'")
            ->raw("]);");
    }
}
