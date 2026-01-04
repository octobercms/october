<?php namespace Cms\Twig\Node;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * ComponentNode represents a "component" node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
#[\Twig\Attribute\YieldReady]
class ComponentNode extends TwigNode
{
    /**
     * __construct
     */
    public function __construct(array $nodes, array $paramNames, int $lineno)
    {
        // Store each node individually, avoiding "nodes" wrapper issue
        parent::__construct($nodes, ['paramNames' => $paramNames], $lineno);
    }

    /**
     * compile the node to PHP.
     */
    public function compile(TwigCompiler $compiler)
    {
        $compiler->addDebugInfo($this);

        // Initialize component parameters array
        $compiler->write("\$context['__cms_component_params'] = [];\n");

        // Process parameters
        foreach ($this->getAttribute('paramNames') as $paramName) {
            if ($this->hasNode($paramName)) {
                $compiler->write("\$context['__cms_component_params']['".$paramName."'] = ");
                $compiler->subcompile($this->getNode($paramName));
                $compiler->write(";\n");
            }
        }

        // Call the component function
        $compiler
            ->write("yield \$this->env->getExtension(\Cms\Twig\Extension::class)->componentFunction(")
            ->subcompile($this->getNode('__component_name'))
            ->write(", \$context['__cms_component_params']")
            ->write(");\n");

        // Cleanup
        $compiler->write("unset(\$context['__cms_component_params']);\n");
    }
}
