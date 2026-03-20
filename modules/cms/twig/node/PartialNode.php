<?php namespace Cms\Twig\Node;

use Twig\Node\Node as TwigNode;
use Twig\Node\Expression\Filter\RawFilter;
use Twig\Compiler as TwigCompiler;

/**
 * PartialNode represents a "partial" node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
#[\Twig\Attribute\YieldReady]
class PartialNode extends TwigNode
{
    /**
     * __construct
     */
    public function __construct(array $nodes, ?TwigNode $body, array $options, int $lineno)
    {
        if ($body) {
            $nodes['__body'] = $body;
        }

        parent::__construct($nodes, ['options' => $options], $lineno);
    }

    /**
     * Compiles the node to PHP.
     */
    public function compile(TwigCompiler $compiler)
    {
        $options = $this->getAttribute('options');

        $compiler->addDebugInfo($this);

        // Initialize parameters array
        $compiler->write("\$cmsPartialParams = [];\n");

        // Handle body block
        if ($this->hasNode('__body')) {
            $compiler
                ->write("\$cmsPartialParams['body'] = implode('', iterator_to_array((function() use (\$context, \$blocks, \$macros) {")
                ->subcompile($this->getNode('__body'))
                ->write(" return; yield ''; })()));\n");
        }

        // Compile parameters, tracking which ones are marked as raw
        $rawParams = [];
        foreach ($options['paramNames'] as $paramName) {
            if ($this->hasNode($paramName)) {
                if ($this->getNode($paramName) instanceof RawFilter) {
                    $rawParams[] = $paramName;
                }
                $compiler
                    ->write("\$cmsPartialParams['" . $paramName . "'] = ")
                    ->subcompile($this->getNode($paramName))
                    ->write(";\n");
            }
        }

        if ($rawParams) {
            $compiler->write("\$cmsPartialParams['__cms_partial_raw_params'] = " . var_export($rawParams, true) . ";\n");
        }

        // Handle AJAX mode
        if ($options['isAjax']) {
            $compiler
                ->write("yield '<div data-ajax-partial=\"'.")
                ->subcompile($this->getNode('__partial_name'))
                ->write(".'\">';\n");
        }

        // Handle Lazy mode
        if ($options['hasLazy']) {
            $compiler->write("yield '<div data-request=\"onAjax\" data-request-update=\"_self: true\" data-auto-submit>'.(\$cmsPartialParams['body'] ?? '').'</div>';\n");
        }
        else {
            // Render Partial
            $compiler
                ->write("yield \$this->env->getExtension(\Cms\Twig\Extension::class)->partialFunction(")
                ->subcompile($this->getNode('__partial_name'));

            if ($options['hasOnly']) {
                $compiler->write(", array_merge(['__cms_partial_params' => \$cmsPartialParams], \$cmsPartialParams)");
            }
            else {
                $compiler->write(", array_merge(\$context, ['__cms_partial_params' => \$cmsPartialParams], \$cmsPartialParams)");
            }

            $compiler->write(", true);\n");
        }

        // Close AJAX wrapper
        if ($options['isAjax']) {
            $compiler->write("yield '</div>';\n");
        }
    }
}
