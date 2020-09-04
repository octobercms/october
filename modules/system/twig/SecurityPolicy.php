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
    protected $blockedProperties = [];

    protected $blockedMethods = [
        'addDynamicMethod',
        'addDynamicProperty'
    ];

    public function __construct()
    {
        $this->setBlockedMethods($this->blockedMethods);
    }

    public function setBlockedMethods(array $methods)
    {
        foreach ($this->blockedMethods as $i => $m) {
            $this->blockedMethods[$i] = strtr($m, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz');
        }
    }

    public function checkSecurity($tags, $filters, $functions)
    {
    }

    public function checkMethodAllowed($obj, $method)
    {
        if ($obj instanceof Template || $obj instanceof Markup) {
            return;
        }

        $blockedMethod = strtr($method, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz');

        if (in_array($blockedMethod, $this->blockedMethods)) {
            $class = get_class($obj);
            throw new SecurityNotAllowedMethodError(sprintf('Calling "%s" method on a "%s" object is blocked.', $method, $class), $class, $method);
        }
    }

    public function checkPropertyAllowed($obj, $property)
    {
        if (in_array($property, $this->blockedProperties)) {
            $class = get_class($obj);
            throw new SecurityNotAllowedPropertyError(sprintf('Calling "%s" property on a "%s" object is blocked.', $property, $class), $class, $property);
        }
    }
}
