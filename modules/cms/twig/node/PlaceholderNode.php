<?php namespace Cms\Twig\Node;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * PlaceholderNode represents a "placeholder" node.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
#[\Twig\Attribute\YieldReady]
class PlaceholderNode extends TwigNode
{
    /**
     * __construct
     */
    public function __construct(?TwigNode $body, string $name, array $paramValues, int $lineno)
    {
        $nodes = [];
        if ($body) {
            $nodes['default'] = $body;
        }

        $attributes = $paramValues;
        $attributes['name'] = $name;

        parent::__construct($nodes, $attributes, $lineno);
    }

    /**
     * Compiles the node to PHP.
     */
    public function compile(TwigCompiler $compiler)
    {
        $hasBody = $this->hasNode('default');
        $varId = '__placeholder_' . $this->getAttribute('name') . '_default_contents';

        $compiler
            ->addDebugInfo($this)
            ->write("\$context['" . $varId . "'] = null;\n");

        if ($hasBody) {
            $compiler
                ->write("\$context['" . $varId . "'] = implode('', iterator_to_array((function() use (\$context, \$blocks, \$macros) {\n")
                ->subcompile($this->getNode('default'))
                ->write(" return; yield ''; })()));\n");
        }

        $isText = $this->hasAttribute('type') && $this->getAttribute('type') === 'text';

        $compiler->addDebugInfo($this);
        if (!$isText) {
            $compiler->write("yield \$this->env->getExtension(\Cms\Twig\Extension::class)->displayBlock(");
        }
        else {
            $compiler->write("yield \$this->env->getRuntime(\Twig\Runtime\EscaperRuntime::class)->escape(\$this->env->getExtension(\Cms\Twig\Extension::class)->displayBlock(");
        }

        $compiler
            ->string($this->getAttribute('name'))
            ->write(", \$context['" . $varId . "']");

        if (!$isText) {
            $compiler->write(");\n");
        }
        else {
            $compiler->write("));\n");
        }

        $compiler
            ->addDebugInfo($this)
            ->write("unset(\$context['" . $varId . "']);\n");
    }
}
