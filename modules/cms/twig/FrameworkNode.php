<?php namespace Cms\Twig;

use Twig_Node;
use Twig_Compiler;

/**
 * Represents a "framework" node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class FrameworkNode extends Twig_Node
{
    public function __construct($name, $lineno, $tag = 'framework')
    {
        parent::__construct([], ['name' => $name], $lineno, $tag);
    }

    /**
     * Compiles the node to PHP.
     *
     * @param Twig_Compiler $compiler A Twig_Compiler instance
     */
    public function compile(Twig_Compiler $compiler)
    {
        $attrib = $this->getAttribute('name');
        $includeExtras = strtolower(trim($attrib)) == 'extras';

        $compiler
            ->addDebugInfo($this)
            ->write("echo '<script src=\"'. Request::getBasePath()
                .'/modules/system/assets/js/framework.js\"></script>'.PHP_EOL;" . PHP_EOL)
        ;

        if ($includeExtras) {
            $compiler
                ->write("echo '<script src=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.extras.js\"></script>'.PHP_EOL;" . PHP_EOL)
                ->write("echo '<link href=\"'. Request::getBasePath()
                    .'/modules/system/assets/css/framework.extras.css\" rel=\"stylesheet\">'.PHP_EOL;" . PHP_EOL)
            ;
        }
    }
}
