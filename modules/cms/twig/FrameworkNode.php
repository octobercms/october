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

        $compiler
            ->addDebugInfo($this)
            ->write("\$_minify = ".CombineAssets::class."::instance()->useMinify;" . PHP_EOL);

        if (strtolower(trim($attrib)) === 'jquery') {
            $compiler
                ->write("echo '<script src=\"'. Request::getBasePath()
                .'/modules/backend/assets/js/vendor/jquery.min.js\" integrity=\"sha384-JUMjoW8OzDJw4oFpWIB2Bu/c6768ObEthBMVSiIx4ruBIEdyNSUQAjJNFqT5pnJ6\" crossorigin=\"anonymous\"></script>'.PHP_EOL;" . PHP_EOL)
                ->write("echo '<script src=\"'. Request::getBasePath()
                .'/modules/backend/assets/js/vendor/jquery-migrate.min.js\" integrity=\"sha384-w5FBDpYZssTSnIDL59XH9TYLpEJ2dDP4RPhSPtJd2iLxUY5L8AATkjOsbM4Ohmax\" crossorigin=\"anonymous\"></script>'.PHP_EOL;" . PHP_EOL)
            ;
        }
        elseif (strtolower(trim($attrib)) === 'jquery_optimized') {
            $compiler
                ->write("echo '<script src=\"'. Request::getBasePath()
                .'/modules/backend/assets/js/vendor/jquery.min.js\" integrity=\"sha384-JUMjoW8OzDJw4oFpWIB2Bu/c6768ObEthBMVSiIx4ruBIEdyNSUQAjJNFqT5pnJ6\" crossorigin=\"anonymous\" importance=\"high\"></script>'.PHP_EOL;" . PHP_EOL)
                ->write("echo '<script src=\"'. Request::getBasePath()
                .'/modules/backend/assets/js/vendor/jquery-migrate.min.js\" integrity=\"sha384-w5FBDpYZssTSnIDL59XH9TYLpEJ2dDP4RPhSPtJd2iLxUY5L8AATkjOsbM4Ohmax\" crossorigin=\"anonymous\" importance=\"high\"></script>'.PHP_EOL;" . PHP_EOL)
                ->write("echo '<link rel=\"preload\" href=\"'. Request::getBasePath()
                .'/modules/backend/assets/js/vendor/jquery.min.js\" as=\"script\" importance=\"high\"></script>'.PHP_EOL;" . PHP_EOL)
                ->write("echo '<link rel=\"preload\" href=\"'. Request::getBasePath()
                .'/modules/backend/assets/js/vendor/jquery-migrate.min.js\" as=\"script\" importance=\"high\"></script>'.PHP_EOL;" . PHP_EOL)
            ;
        }
        elseif (strtolower(trim($attrib)) === 'extras') {
            $compiler
                ->write("if (\$_minify) {" . PHP_EOL)
                ->indent()
                    ->write("echo '<script async src=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.combined-min.js\" importance=\"low\"></script>'.PHP_EOL;" . PHP_EOL)
                    ->write("echo '<link rel=\"preload\" href=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.combined-min.js\" as=\"script\" importance=\"low\">'.PHP_EOL;" . PHP_EOL)

                ->outdent()
                ->write("}" . PHP_EOL)
                ->write("else {" . PHP_EOL)
                ->indent()
                    ->write("echo '<script async src=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.js\" importance=\"low\"></script>'.PHP_EOL;" . PHP_EOL)
                    ->write("echo '<script async src=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.extras.js\" importance=\"low\"></script>'.PHP_EOL;" . PHP_EOL)
                    ->write("echo '<link rel=\"preload\" href=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.js\" as=\"script\" importance=\"low\"></script>'.PHP_EOL;" . PHP_EOL)
                    ->write("echo '<link rel=\"preload\" href=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.extras.js\" as=\"script\" importance=\"low\"></script>'.PHP_EOL;" . PHP_EOL)

                ->outdent()
                ->write("}" . PHP_EOL)
                ->write("echo '<link rel=\"stylesheet\" property=\"stylesheet\" href=\"'. Request::getBasePath()
                    .'/modules/system/assets/css/framework.extras'.(\$_minify ? '-min' : '').'.css\" importance=\"low\">'.PHP_EOL;" . PHP_EOL)
                ->write("echo '<link rel=\"preload\" href=\"'. Request::getBasePath()
                    .'/modules/system/assets/css/framework.extras'.(\$_minify ? '-min' : '').'.css\" as=\"style\" importance=\"low\">'.PHP_EOL;" . PHP_EOL)
            ;
        }
        elseif (strtolower(trim($attrib)) === 'extras_optimized') {
            $compiler
                ->write("if (\$_minify) {" . PHP_EOL)
                ->indent()
                    ->write("echo '<script async src=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.combined-min.js\" importance=\"low\"></script>'.PHP_EOL;" . PHP_EOL)
                    ->write("echo '<link rel=\"preload\" href=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.combined-min.js\" as=\"script\" importance=\"low\">'.PHP_EOL;" . PHP_EOL)					
                ->outdent()
                ->write("}" . PHP_EOL)
                ->write("else {" . PHP_EOL)
                ->indent()
                    ->write("echo '<script async src=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.js\" importance=\"low\"></script>'.PHP_EOL;" . PHP_EOL)
                    ->write("echo '<script async src=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.extras.js\" importance=\"low\"></script>'.PHP_EOL;" . PHP_EOL)
                    ->write("echo '<link rel=\"preload\" href=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.js\" as=\"script\" importance=\"low\"></script>'.PHP_EOL;" . PHP_EOL)
                    ->write("echo '<link rel=\"preload\" href=\"'. Request::getBasePath()
                    .'/modules/system/assets/js/framework.extras.js\" as=\"script\" importance=\"low\"></script>'.PHP_EOL;" . PHP_EOL)					
                ->outdent()
                ->write("}" . PHP_EOL)
                ->write("echo '<link rel=\"stylesheet\" property=\"stylesheet\" href=\"'. Request::getBasePath()
                    .'/modules/system/assets/css/framework.extras'.(\$_minify ? '-min' : '').'.css\" importance=\"low\">'.PHP_EOL;" . PHP_EOL)
                ->write("echo '<link rel=\"preload\" href=\"'. Request::getBasePath()
                    .'/modules/system/assets/css/framework.extras'.(\$_minify ? '-min' : '').'.css\" as=\"style\" importance=\"low\">'.PHP_EOL;" . PHP_EOL)					
            ;
        }
        elseif (strtolower(trim($attrib)) === 'optimized') {
            $compiler
                ->write("echo '<script async src=\"'. Request::getBasePath()
                .'/modules/system/assets/js/framework'.(\$_minify ? '-min' : '').'.js\" importance=\"low\"></script>'.PHP_EOL;" . PHP_EOL)
                ->write("echo '<link rel=\"preload\" href=\"'. Request::getBasePath()
                .'/modules/system/assets/js/framework.js\" as=\"script\" importance=\"low\"></script>'.PHP_EOL;" . PHP_EOL)
            ;
        }		
        else {
            $compiler->write("echo '<script async src=\"'. Request::getBasePath()
                .'/modules/system/assets/js/framework'.(\$_minify ? '-min' : '').'.js\" importance=\"low\"></script>
                <link rel=\"preload\" href=\"'. Request::getBasePath()
                .'/modules/system/assets/js/framework'.(\$_minify ? '-min' : '').'.js\" as=\"script\" importance=\"low\">'.PHP_EOL;" . PHP_EOL)
            ;
        }

        $compiler->write('unset($_minify);' . PHP_EOL);
    }
}
