<?php namespace Cms\Twig\Node;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * PutNode represents a "put" node.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
#[\Twig\Attribute\YieldReady]
class PutNode extends TwigNode
{
    /**
     * __construct
     */
    public function __construct(bool $capture, TwigNode $names, TwigNode $values, array $options, int $lineno)
    {
        parent::__construct(['names' => $names, 'values' => $values], ['capture' => $capture, 'options' => $options], $lineno);
    }

    /**
     * Compiles the node to PHP.
     */
    public function compile(TwigCompiler $compiler)
    {
        $names = $this->getNode('names');
        $values = $this->getNode('values');
        $isCapture = $this->getAttribute('capture');

        if ($isCapture) {
            $options = (array) $this->getAttribute('options');

            // @deprecated using "overwrite" is deprecated
            $isReplace = in_array('replace', $options, true) || in_array('overwrite', $options, true);
            $isOnce = in_array('once', $options, true);

            $blockName = $names->getNode(0);
            $compiler->addDebugInfo($this);

            if ($isOnce) {
                $compiler
                    ->write("\$this->env->getExtension(\Cms\Twig\Extension::class)->yieldBlockOnce(")
                    ->string($this->getTemplateName())
                    ->write(", ");
            }
            else {
                $compiler->write("\$this->env->getExtension(\Cms\Twig\Extension::class)->yieldBlock(");
            }

            $compiler
                ->string($blockName->getAttribute('name'))
                ->write(", function() use (\$context, \$blocks, \$macros) {\n")
                ->subcompile($this->getNode('values'))
                ->write("return; yield '';}, ")
                ->raw($isReplace ? 'false' : 'true')
                ->write(");\n");
        }
        else {
            foreach ($names as $key => $name) {
                if (!$values->hasNode($key)) {
                    continue;
                }

                $value = $values->getNode($key);

                $compiler
                    ->addDebugInfo($this)
                    ->write("\$this->env->getExtension(\Cms\Twig\Extension::class)->setBlock(")
                    ->string($name->getAttribute('name'))
                    ->write(", ")
                    ->subcompile($value)
                    ->write(");\n");
            }
        }
    }
}
