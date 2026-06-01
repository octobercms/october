<?php namespace System\Classes;

use App;
use ReflectionException;
use ReflectionMethod;

/**
 * DependencyResolver is a dependency injection implementation.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class DependencyResolver
{
    use \Illuminate\Routing\ResolvesRouteDependencies;

    /**
     * @var Container container for application
     */
    protected $container;

    /**
     * __construct instance
     */
    public function __construct()
    {
        $this->container = App::make('app');
    }

    /**
     * resolve
     */
    public function resolve($instance, string $method, array $parameters)
    {
        try {
            if (method_exists($instance, $method)) {
                return $this->resolveMethodDependencies(
                    $parameters,
                    new ReflectionMethod($instance, $method)
                );
            }
            elseif (method_exists($instance, 'getClassMethodAsReflector')) {
                return $this->resolveMethodDependencies(
                    $parameters,
                    $instance->getClassMethodAsReflector($method)
                );
            }
        }
        catch (ReflectionException $ex) {
        }

        return $parameters;
    }
}
