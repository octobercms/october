<?php namespace Cms\Twig\Node;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * FlashNode represents a "flash" node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
#[\Twig\Attribute\YieldReady]
class FlashNode extends TwigNode
{
    /**
     * __construct
     */
    public function __construct(string $name, TwigNode $body, int $lineno)
    {
        parent::__construct(['body' => $body], ['name' => $name], $lineno);
    }

    /**
     * Compiles the node to PHP.
     */
    public function compile(TwigCompiler $compiler)
    {
        $attrib = $this->getAttribute('name');

        $compiler
            ->addDebugInfo($this)
            ->write("\$_type = \$context['type'] ?? null;\n")
            ->write("\$_message = \$context['message'] ?? null;\n");

        if ($attrib === 'all') {
            $compiler
                ->write("foreach (Flash::messages() as \$type => \$messages) {\n")
                ->indent()
                    ->write("foreach (\$messages as \$message) {\n")
                    ->indent()
                        ->write("\$context['type'] = \$type;\n")
                        ->write("\$context['message'] = \$message;\n")
                        ->subcompile($this->getNode('body'))
                    ->outdent()
                    ->write("}\n")
                ->outdent()
                ->write("}\n");
        }
        else {
            $compiler
                ->write("\$context['type'] = '")
                ->raw($attrib)
                ->write("';\n")
                ->write("foreach (Flash::")
                ->raw($attrib)
                ->write("() as \$message) {\n")
                ->indent()
                    ->write("\$context['message'] = \$message;\n")
                    ->subcompile($this->getNode('body'))
                ->outdent()
                ->write("}\n");
        }

        $compiler
            ->write("\$context['type'] = \$_type;\n")
            ->write("\$context['message'] = \$_message;\n");
    }
}
