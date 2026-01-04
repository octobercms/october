<?php namespace Cms\Twig\Node;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * ContentNode represents a `{% content %}` tag in Twig.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
#[\Twig\Attribute\YieldReady]
class ContentNode extends TwigNode
{
    /**
     * __construct
     */
    public function __construct(array $nodes, array $paramNames, int $lineno)
    {
        parent::__construct($nodes, ['paramNames' => $paramNames], $lineno);
    }

    /**
     * Compiles the node to PHP.
     */
    public function compile(TwigCompiler $compiler)
    {
        $compiler->addDebugInfo($this);

        // Initialize content parameters array
        $compiler->write("\$context['__cms_content_params'] = [];\n");

        // Process parameters
        foreach ($this->getAttribute('paramNames') as $paramName) {
            if ($this->hasNode($paramName)) {
                $compiler->write("\$context['__cms_content_params']['".$paramName."'] = ");
                $compiler->write('$this->env->getRuntime(\Twig\Runtime\EscaperRuntime::class)->escape(');
                $compiler->subcompile($this->getNode($paramName));
                $compiler->write(");\n");
            }
        }

        // Call the content function
        $compiler
            ->write("yield \$this->env->getExtension(\Cms\Twig\Extension::class)->contentFunction(")
            ->subcompile($this->getNode('__content_name')) // Get content name
            ->write(", \$context['__cms_content_params']")
            ->write(", true")
            ->write(");\n");

        // Cleanup
        $compiler->write("unset(\$context['__cms_content_params']);\n");
    }
}
