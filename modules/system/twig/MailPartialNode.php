<?php namespace System\Twig;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * MailPartialNode represents a "partial" node for email rendering.
 *
 * @package october\system
 * @package october\system
 */
#[\Twig\Attribute\YieldReady]
class MailPartialNode extends TwigNode
{
    /**
     * __construct
     */
    public function __construct(array $nodes, array $paramNames, ?TwigNode $body, int $lineno)
    {
        if ($body) {
            $nodes['body'] = $body;
        }

        parent::__construct($nodes, ['names' => $paramNames], $lineno);
    }

    /**
     * Compiles the node to PHP.
     */
    public function compile(TwigCompiler $compiler)
    {
        $compiler->addDebugInfo($this);
        $compiler->write("\$systemPartialParams = [];\n");

        // Handle body block
        if ($this->hasNode('body')) {
            $compiler
                ->write("\$systemPartialParams['body'] = implode('', iterator_to_array((function() use (\$context, \$blocks, \$macros) {\n")
                ->subcompile($this->getNode('body'))
                ->write(" return; yield ''; })()));\n");
        }

        // Compile parameters
        foreach ($this->getAttribute('names') as $paramName) {
            if ($this->hasNode($paramName)) {
                $compiler
                    ->write("\$systemPartialParams['" . $paramName . "'] = ")
                    ->subcompile($this->getNode($paramName))
                    ->write(";\n");
            }
        }

        // Render the mail partial
        $compiler
            ->write("yield \System\Classes\MailManager::instance()->renderPartial(")
            ->subcompile($this->getNode('__partial_name'))
            ->write(", array_merge(\$context, ['__system_partial_params' => \$systemPartialParams], \$systemPartialParams));\n");
    }
}
