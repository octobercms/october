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
 * @author Alexey Bobkov, Samuel Georges, Luke Towers
 */
final class SecurityPolicy implements SecurityPolicyInterface
{
    /**
     * @var array List of forbidden methods.
     */
    protected $blockedMethods = [
        // \October\Rain\Extension\ExtendableTrait
        'addDynamicMethod',
        'addDynamicProperty',

        // \October\Rain\Support\Traits\Emitter
        'bindEvent',
        'bindEventOnce',

        // Eloquent & Halcyon data modification
        'insert',
        'update',
        'delete',
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
     * Check the provided arguments against this security policy
     *
     * @param array $tags Array of tags to be checked against the policy ['tag', 'tag2', 'etc']
     * @param array $filters Array of filters to be checked against the policy ['filter', 'filter2', 'etc']
     * @param array $functions Array of funtions to be checked against the policy ['function', 'function2', 'etc']
     * @throws SecurityNotAllowedTagError if a given tag is not allowed
     * @throws SecurityNotAllowedFilterError if a given filter is not allowed
     * @throws SecurityNotAllowedFunctionError if a given function is not allowed
     */
    public function checkSecurity($tags, $filters, $functions)
    {
    }

    /**
     * Checks if a given property is permitted to be accessed on a given object
     *
     * @param object $obj
     * @param string $property
     * @throws SecurityNotAllowedPropertyError
     */
    public function checkPropertyAllowed($obj, $property)
    {
    }

    /**
     * Checks if a given method is allowed to be called on a given object
     *
     * @param object $obj
     * @param string $method
     * @throws SecurityNotAllowedMethodError
     */
    public function checkMethodAllowed($obj, $method)
    {
        // No need to check Twig internal objects
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
