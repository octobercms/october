<?php

namespace System\Classes;

use Illuminate\Contracts\Container\Container;
use Illuminate\Routing\RouteDependencyResolverTrait;

class DependenciesResolver
{
    use RouteDependencyResolverTrait;

    /**
     * @var Container
     */
    private $container;

    /**
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * Resolve the dependencies for an object which uses the extendable trait
     *
     * @param object $object
     * @param array $parameters
     * @param string $method
     * @return array
     */
    public function resolveForExtendableObject(object $object, array $parameters, string $method): array
    {
        if (method_exists($object, $method)) {
            try {
                return $this->resolveMethodDependencies($parameters, new \ReflectionMethod($object, $method));
            } catch (\ReflectionException $exception) {
                // do nothing
            }
        }

        if (method_exists($object, 'getExtendableCallReflection')) {
            $reflectionFunction = $object->getExtendableCallReflection($method);

            return $this->resolveMethodDependencies($parameters, $reflectionFunction);
        }

        return $parameters;
    }
}
