<?php namespace Cms\Twig;

use System\Classes\CombineAssets;
use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * Represents a "framework" node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class FrameworkNode extends TwigNode
{
    public function __construct($name, $lineno, $tag = 'framework')
    {
        parent::__construct([], ['name' => $name], $lineno, $tag);
    }

    /**
     * Compiles the node to PHP.
     *
     * @param TwigCompiler $compiler A TwigCompiler instance
     */
    public function compile(TwigCompiler $compiler)
    {
        $attrib = $this->getAttribute('name');
        $includeExtras = strtolower(trim($attrib)) == 'extras';

        $compiler
            ->addDebugInfo($this)
            ->write("\$_minify = ".CombineAssets::class."::instance()->useMinify;" . PHP_EOL);

        if ($includeExtras) {
            $compiler
                ->write("if (\$_minify) {" . PHP_EOL)
                ->indent()
                    ->write("echo '<script src=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.combined-min.js\"></script>'.PHP_EOL;" . PHP_EOL)
                ->outdent()
                ->write("}" . PHP_EOL)
                ->write("else {" . PHP_EOL)
                ->indent()
                    ->write("echo '<script src=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.js\"></script>'.PHP_EOL;" . PHP_EOL)
                    ->write("echo '<script src=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.extras.js\"></script>'.PHP_EOL;" . PHP_EOL)
                ->outdent()
                ->write("}" . PHP_EOL)
                ->write("echo '<link rel=\"stylesheet\" property=\"stylesheet\" href=\"'. Request::getBasePath()
                    .'/modules/system/assets/css/framework.extras'.(\$_minify ? '-min' : '').'.css\">'.PHP_EOL;" . PHP_EOL)
            ;
        }
        else {
            $compiler->write("echo '<script src=\"'. Request::getBasePath()
                .'/modules/system/assets/js/framework'.(\$_minify ? '-min' : '').'.js\"></script>'.PHP_EOL;" . PHP_EOL)
            ;
        }

        $compiler->write('unset($_minify);' . PHP_EOL);
    }
}
