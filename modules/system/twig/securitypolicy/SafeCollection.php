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
     * This allows callable strings that might be used as attributes, e.g. 'passthru'
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
     * or call static methods on arbitrary classes
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
    }

    /**
     * __call magic
     * @param string $method
     * @param array $parameters
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        // Block methods that can instantiate arbitrary classes
        if (in_array($method, $this->blockedMethods)) {
            return $this;
        }

        // Remove args that are callable, or hybrid methods only get removed
        // if they are non-strings based on Collection::useAsCallable method
        foreach ($parameters as &$param) {
            if (
                is_callable($param) &&
                (!in_array($method, $this->hybridCallableArgs) || !is_string($param))
            ) {
                $param = null;
            }
        }

        return $this->forwardCallTo(
            $this->collection,
            $method,
            $parameters
        );
    }
}
