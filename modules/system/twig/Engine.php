<?php namespace System\Twig;

use Twig_Environment;
use Illuminate\View\Engines\EngineInterface;

/**
 * View engine used by the system, used for converting .htm files to twig.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class Engine implements EngineInterface
{
    /**
     * @var Twig_Environment
     */
    protected $environment;

    /**
     * Constructor
     */
    public function __construct(Twig_Environment $environment)
    {
        $this->environment = $environment;
    }

    public function get($path, array $vars = [])
    {
        $template = $this->environment->loadTemplate($path);
        return $template->render($vars);
    }
}
