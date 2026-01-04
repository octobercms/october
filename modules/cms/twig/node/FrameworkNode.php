<?php namespace Cms\Twig\Node;

use Twig\Node\Node as TwigNode;
use Twig\Compiler as TwigCompiler;

/**
 * FrameworkNode represents a "framework" node
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
#[\Twig\Attribute\YieldReady]
class FrameworkNode extends TwigNode
{
    /**
     * __construct
     */
    public function __construct(array $options, int $lineno)
    {
        parent::__construct([], ['options' => $options], $lineno);
    }

    /**
     * Compiles the node to PHP.
     */
    public function compile(TwigCompiler $compiler)
    {
        $options = $this->getAttribute('options');
        $includeExtras = in_array('extras', $options, true);
        $includeTurbo = in_array('turbo', $options, true);

        $compiler
            ->addDebugInfo($this)
            ->write("\$_minify = System\\Classes\\CombineAssets::instance()->useMinify;\n");

        // Default
        $cssFile = null;
        $jsScript = 'framework';

        // Options
        if ($includeExtras || $includeTurbo) {
            $jsScript = 'framework-bundle';
            $cssFile = 'framework-extras';
        }

        $compiler->write("yield '<script src=\"' . Request::getBasePath() . '/modules/system/assets/js/".$jsScript."'.(\$_minify ? '.min' : '').'.js\"></script>' . PHP_EOL;\n");

        if ($cssFile) {
            $compiler->write("yield '<link rel=\"stylesheet\" property=\"stylesheet\" href=\"' . Request::getBasePath() .'/modules/system/assets/css/".$cssFile.".css\">' . PHP_EOL;\n");
        }

        $compiler->write("unset(\$_minify);\n");
    }
}
