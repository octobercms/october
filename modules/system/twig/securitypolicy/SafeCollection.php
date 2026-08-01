<?php namespace System\Twig\SecurityPolicy;

use Illuminate\Support\Collection;
use October\Contracts\Twig\CallsAnyMethod;

/**
 * SafeCollection is a collection proxy class that is safe for use in Twig
 * without exposing callable functions, which are unusable in Twig anyway.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SafeCollection implements CallsAnyMethod
{
    use \Illuminate\Support\Traits\ForwardsCalls;

    /**
     * @var Collection collection instance
     */
    protected $collection;

    /**
     * @var array hybridCallableArgs are methods that can take a string value or a callable array.
     * This allows callable strings that might be used as attributes, e.g. 'passthru'.
     * Entries are lowercased in __construct for case-insensitive matching.
     */
    protected $hybridCallableArgs = [
        'contains',
        'containsStrict',
        'groupBy',
        'implode',
        'search'
    ];

    /**
     * @var array blockedMethods that could be used to instantiate arbitrary classes
     * or call static methods on arbitrary classes.
     * Entries are lowercased in __construct for case-insensitive matching.
     */
    protected $blockedMethods = [
        'mapInto',
        'pipeInto',
        'toResourceCollection'
    ];

    /**
     * @inheritdoc
     */
    public function __construct(Collection $collection)
    {
        $this->collection = $collection;

        // PHP method dispatch is case-insensitive, so lowercase both sides
        // of every comparison to ensure case-variant calls (e.g. MAPINTO)
        // are caught by the same block-list.
        $this->blockedMethods = array_map('strtolower', $this->blockedMethods);
        $this->hybridCallableArgs = array_map('strtolower', $this->hybridCallableArgs);
    }

    /**
     * __call magic
     * @param string $method
     * @param array $parameters
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        $normalizedMethod = strtolower($method);

        // Block methods that can instantiate arbitrary classes
        if (in_array($normalizedMethod, $this->blockedMethods, true)) {
            return $this;
        }

        foreach ($parameters as &$param) {
            $param = $this->stripCallables($param, $normalizedMethod);
        }

        return $this->forwardCallTo(
            $this->collection,
            $method,
            $parameters
        );
    }

    /**
     * stripCallables walks the value and nulls out any callable found at
     * any depth. Hybrid methods (contains, groupBy, etc.) keep string
     * values because they may be used as attribute names. The $method
     * argument is expected to be already lowercased by the caller.
     *
     * Arrays are checked as callables themselves before being recursed
     * into, so a [class, method] / [object, method] tuple is neutralised
     * as a whole rather than walked element-by-element (which would leave
     * the tuple intact since each element is individually non-callable).
     */
    protected function stripCallables($value, string $method)
    {
        if (
            is_callable($value) &&
            (!in_array($method, $this->hybridCallableArgs, true) || !is_string($value))
        ) {
            return null;
        }

        if (is_array($value)) {
            foreach ($value as $key => $item) {
                $value[$key] = $this->stripCallables($item, $method);
            }
            return $value;
        }

        return $value;
    }
}
