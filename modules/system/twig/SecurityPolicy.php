<?php namespace System\Twig;

use Twig\Markup;
use Twig\Template;
use Twig\Sandbox\SecurityPolicyInterface;
use Twig\Sandbox\SecurityNotAllowedMethodError;
use Twig\Sandbox\SecurityNotAllowedPropertyError;

/**
 * SecurityPolicy globally blocks accessibility of certain methods and properties.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
final class SecurityPolicy implements SecurityPolicyInterface
{
    /**
     * @var array List of forbidden methods.
     */
    protected $blockedMethods = [
        'addDynamicMethod',
        'addDynamicProperty'
    ];

    /**
     * Constructor
     */
    public function __construct()
    {
        foreach ($this->blockedMethods as $i => $m) {
            $this->blockedMethods[$i] = strtolower($m);
        }
    }

    /**
     * @throws SecurityError
     */
    public function checkSecurity($tags, $filters, $functions)
    {
    }

    /**
     * @throws SecurityNotAllowedPropertyError
     */
    public function checkPropertyAllowed($obj, $property)
    {
    }

    /**
     * @throws SecurityNotAllowedMethodError
     */
    public function checkMethodAllowed($obj, $method)
    {
        if ($obj instanceof Template || $obj instanceof Markup) {
            return;
        }

        $blockedMethod = strtolower($method);
        if (in_array($blockedMethod, $this->blockedMethods)) {
            $class = get_class($obj);
            throw new SecurityNotAllowedMethodError(sprintf('Calling "%s" method on a "%s" object is blocked.', $method, $class), $class, $method);
        }
    }
}
