<?php namespace System\Twig;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * Represents a partial node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class MailPartialNode extends TwigNode
{
    public function __construct(TwigNode $nodes, $paramNames, $body, $lineno, $tag = 'partial')
    {
        $nodes = ['nodes' => $nodes];

        if ($body) {
            $nodes['body'] = $body;
        }

        parent::__construct($nodes, ['names' => $paramNames], $lineno, $tag);
    }

    /**
     * Compiles the node to PHP.
     *
     * @param TwigCompiler $compiler A TwigCompiler instance
     */
    public function compile(TwigCompiler $compiler)
    {
        $compiler->addDebugInfo($this);

        $compiler->write("\$context['__system_partial_params'] = [];\n");

        if ($this->hasNode('body')) {
            $compiler
                ->addDebugInfo($this)
                ->write('ob_start();')
                ->subcompile($this->getNode('body'))
                ->write("\$context['__system_partial_params']['body'] = ob_get_clean();");
        }

        for ($i = 1; $i < count($this->getNode('nodes')); $i++) {
            $compiler->write("\$context['__system_partial_params']['".$this->getAttribute('names')[$i-1]."'] = ");
            $compiler->subcompile($this->getNode('nodes')->getNode($i));
            $compiler->write(";\n");
        }

        $compiler
            ->write("echo \System\Classes\MailManager::instance()->renderPartial(")
            ->subcompile($this->getNode('nodes')->getNode(0))
            ->write(", \$context['__system_partial_params']")
            ->write(");\n")
        ;

        $compiler->write("unset(\$context['__system_partial_params']);\n");
    }
}
