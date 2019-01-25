<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Compiler;

/**
 * Represents a flash node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class FlashNode extends Twig_Node
{
    public function __construct($name, Twig_Node $body, $lineno, $tag = 'flash')
    {
        parent::__construct(['body' => $body], ['name' => $name], $lineno, $tag);
    }

    /**
     * Compiles the node to PHP.
     *
     * @param Twig_Compiler $compiler A Twig_Compiler instance
     */
    public function compile(Twig_Compiler $compiler)
    {
        $attrib = $this->getAttribute('name');

        $compiler
            ->write('$_type = isset($context["type"]) ? $context["type"] : null;')
            ->write('$_message = isset($context["message"]) ? $context["message"] : null;')
        ;

        if ($attrib == 'all') {
           $compiler
                ->addDebugInfo($this)
                ->write('foreach (Flash::getMessages() as $type => $messages) {'.PHP_EOL)
                ->indent()
                    ->write('foreach ($messages as $message) {'.PHP_EOL)
                    ->indent()
                        ->write('$context["type"] = $type;')
                        ->write('$context["message"] = $message;')
                        ->subcompile($this->getNode('body'))
                    ->outdent()
                    ->write('}'.PHP_EOL)
                ->outdent()
                ->write('}'.PHP_EOL)
            ;
        }
        else {
            $compiler
                ->addDebugInfo($this)
                ->write('$context["type"] = ')
                ->string($attrib)
                ->write(';')
                ->write('foreach (Flash::')
                ->raw($attrib)
                ->write('() as $message) {'.PHP_EOL)
                ->indent()
                    ->write('$context["message"] = $message;')
                    ->subcompile($this->getNode('body'))
                ->outdent()
                ->write('}'.PHP_EOL)
            ;
        }

        $compiler
            ->write('$context["type"] = $_type;')
            ->write('$context["message"] = $_message;')
        ;
    }
}
