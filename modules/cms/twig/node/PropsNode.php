<?php namespace Cms\Twig\Node;

use Twig\Node\Node as TwigNode;
use Twig\Node\Expression\AbstractExpression;
use Twig\Compiler as TwigCompiler;

/**
 * PropsNode represents a "props" node that separates partial parameters
 * into props (template variables) and attributes (ComponentAttributeBag).
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
#[\Twig\Attribute\YieldReady]
class PropsNode extends TwigNode
{
    /**
     * __construct
     */
    public function __construct(AbstractExpression $propsExpression, int $lineno)
    {
        parent::__construct(['props_expression' => $propsExpression], [], $lineno);
    }

    /**
     * compile the node to PHP.
     */
    public function compile(TwigCompiler $compiler)
    {
        $compiler->addDebugInfo($this);

        // Evaluate the hash expression to get declared props with defaults
        $compiler
            ->write("\$__propsDefinition = ")
            ->subcompile($this->getNode('props_expression'))
            ->write(";\n");

        // Get all params the caller passed
        $compiler->write("\$__allParams = \$context['__cms_partial_params'] ?? [];\n");
        $compiler->write("\$__rawParams = \$__allParams['__cms_partial_raw_params'] ?? [];\n");
        $compiler->write("unset(\$__allParams['__cms_partial_raw_params']);\n");

        // Set props as context variables (caller value overrides default)
        // Wrap raw-marked props in Twig\Markup so {{ }} auto-escaping is skipped
        $compiler->write("foreach (\$__propsDefinition as \$__key => \$__default) {\n");
        $compiler->write("    \$__val = array_key_exists(\$__key, \$__allParams) ? \$__allParams[\$__key] : \$__default;\n");
        $compiler->write("    if (in_array(\$__key, \$__rawParams) && is_string(\$__val)) {\n");
        $compiler->write("        \$__val = new \\Twig\\Markup(\$__val, \$this->env->getCharset());\n");
        $compiler->write("    }\n");
        $compiler->write("    \$context[\$__key] = \$__val;\n");
        $compiler->write("}\n");

        // Create attribute bag from remaining params (exclude props, body, and internal keys)
        // Escape attribute values using Twig's escaper to prevent XSS, skip raw params
        $compiler->write("\$__attrValues = array_diff_key(\$__allParams, \$__propsDefinition);\n");
        $compiler->write("unset(\$__attrValues['body']);\n");
        $compiler->write("\$__escaper = \$this->env->getRuntime(\\Twig\\Runtime\\EscaperRuntime::class);\n");
        $compiler->write("foreach (\$__attrValues as \$__key => \$__val) {\n");
        $compiler->write("    if (!in_array(\$__key, \$__rawParams)) {\n");
        $compiler->write("        \$__attrValues[\$__key] = \$__escaper->escape(\$__val, 'html', null, true);\n");
        $compiler->write("    }\n");
        $compiler->write("}\n");
        $compiler->write("\$context['attributes'] = new \\Illuminate\\View\\ComponentAttributeBag(\$__attrValues);\n");

        // Cleanup temp variables
        $compiler->write("unset(\$__propsDefinition, \$__allParams, \$__attrValues, \$__key, \$__default, \$__val, \$__rawParams, \$__escaper);\n");
    }
}
