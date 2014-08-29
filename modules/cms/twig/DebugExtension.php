<?php namespace Cms\Twig;

use Str;
use Twig_Extension;
use Twig_Environment;
use Twig_SimpleFunction;
use Cms\Classes\Controller;

class DebugExtension extends Twig_Extension
{
    /**
     * @var \Cms\Classes\Controller A reference to the CMS controller.
     */
    protected $controller;

    /**
     * @var integer Helper for rendering table row styles.
     */
    protected $zebra = 1;

    /**
     * @var boolean If no variable is passed, true.
     */
    protected $controllerMode = false;

    /**
     * Creates the extension instance.
     * @param \Cms\Classes\Controller $controller The CMS controller object.
     */
    public function __construct(Controller $controller)
    {
        $this->controller = $controller;
    }

    /**
     * Returns a list of global functions to add to the existing list.
     *
     * @return array An array of global functions
     */
    public function getFunctions()
    {
        return array(
            new Twig_SimpleFunction('dump', [$this, 'runDump'], array('is_safe' => ['html'], 'needs_context' => true, 'needs_environment' => true)),
        );
    }

    public function runDump(Twig_Environment $env, $context)
    {
        if (!$env->isDebug()) {
            return;
        }

        ob_start();

        $count = func_num_args();
        if (2 === $count) {
            $this->controllerMode = true;
            $vars = [];
            foreach ($context as $key => $value) {
                if (!$value instanceof Twig_Template) {
                    $vars[$key] = $value;
                }
            }

            $this->dump($vars);
        } else {
            for ($i = 2; $i < $count; $i++) {
                $this->dump(func_get_arg($i));
            }
        }

        return ob_get_clean();
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'debug';
    }

    /**
     * Dump information about a variable
     *
     * @param mixed $variable Variable to dump
     * @param string $caption Caption of the dump
     * @return void
     */
    public function dump($variables = null, $caption = 'Page variables')
    {
        $info = [];

        if (!is_array($variables))
            $variables = [$variables];

        $output = [];
        $output[] = '<table>';
        $output[] = $this->makeTableHeader($caption);
        foreach ($variables as $key => $item) {
            $output[] = $this->makeTableRow($key, $item);
        }
        $output[] = '</table>';

        $html = implode(PHP_EOL, $output);

        print '<pre style="' . $this->getContainerCss() . '">' . $html . '</pre>';
    }

    protected function makeTableHeader($caption)
    {
        $output = [];
        $output[] = '<tr>';
        $output[] = '<th colspan="100" style="'.$this->getHeaderCss().'">'.$caption.'</td>';
        $output[] = '</tr>';
        return implode(PHP_EOL, $output);
    }

    protected function makeTableRow($key, $variable)
    {
        $this->zebra = $this->zebra ? 0 : 1;
        $css = $this->getDataCss();
        $output = [];
        $output[] = '<tr>';

        if ($this->controllerMode)
            $output[] = '<td style="'.$css.'">{{<span> '.$key.' </span>}}</td>';
        else
            $output[] = '<td style="'.$css.'">'.$key.'</td>';

        $output[] = '<td style="'.$css.'">'.gettype($variable).'</td>';
        $output[] = '<td style="'.$css.'">'.$this->evalVarDesc($variable).'</td>';
        $output[] = '</tr>';
        return implode(PHP_EOL, $output);
    }

    protected function evalVarDesc($variable)
    {
        switch (gettype($variable)) {
            case 'object':
                return $this->evalObjDesc($variable);

            case 'array':
                return $this->evalArrDesc($variable);

            default:
                return '';
        }
    }

    protected function evalObjDesc($variable)
    {
        return '<abbr title="'.e(get_class($variable)).'">'.Str::getRealClass($variable).'</abbr>';
    }

    protected function evalArrDesc($variable)
    {
        $output = [];
        foreach ($variable as $key => $value) {
            $output[] = '<abbr title="'.e(gettype($value)).'">'.$key.'</abbr>';
        }

        return implode(', ', $output);
    }

    /**
     * Get the CSS string for the output data
     *
     * @return string
     */
    protected function getDataCss()
    {
        return $this->arrayToCss([
            'padding'               => '7px',
            'background-color'      => $this->zebra ? '#D8D9DB' : '#FFF',
            'color'                 => '#405261',
        ]);
    }

    /**
     * Get the CSS string for the output container
     *
     * @return string
     */
    protected function getContainerCss()
    {
        return $this->arrayToCss([
            'background-color'      => '#F3F3F3',
            'border'                => '1px solid #bbb',
            'border-radius'         => '4px',
            'font-size'             => '12px',
            'line-height'           => '1.4em',
            'margin'                => '30px',
            'padding'               => '7px',
            'display'               => 'inline-block',
        ]);
    }

    /**
     * Get the CSS string for the output header
     *
     * @return string
     */
    protected function getHeaderCss()
    {
        return $this->arrayToCss([
            'font-size'        => '18px',
            'font-weight'      => 'normal',
            'margin'           => '0',
            'padding'          => '10px',
            'background-color' => '#7B8892',
            'color'            => '#FFF',
        ]);
    }

    /**
     * Convert a key/value pair array into a CSS string
     *
     * @param array $rules List of rules to process
     * @return string
     */
    protected function arrayToCss(array $rules)
    {
        $strings = [];

        foreach ($rules as $key => $value) {
            $strings[] = $key . ': ' . $value;
        }

        return join('; ', $strings);
    }

}
