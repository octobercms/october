<?php

use Illuminate\Http\Request;
use October\Rain\Extension\ExtendableTrait;
use System\Classes\DependenciesResolver;

class DependencyTestClass
{
    use ExtendableTrait;

    public function testDependencyInjection(Request $request)
    {
    }

    public function testDependencyInjectionWithParameters(Request $request, string $key)
    {
    }
}

class DependencyResolverTest extends TestCase
{
    public function testDependencyInjection()
    {
        /** @var DependenciesResolver $dependencyResolver */
        $dependencyResolver = $this->app->make(DependenciesResolver::class);

        $dependencyTestClass = new DependencyTestClass();

        $result = $dependencyResolver->resolveForExtendableObject(
            $dependencyTestClass,
            [],
            'testDependencyInjection'
        );

        $this->assertInstanceOf(Request::class, $result[0]);
    }

    public function testDependencyInjectionWithParameters()
    {
        /** @var DependenciesResolver $dependencyResolver */
        $dependencyResolver = $this->app->make(DependenciesResolver::class);

        $dependencyTestClass = new DependencyTestClass();

        $result = $dependencyResolver->resolveForExtendableObject(
            $dependencyTestClass,
            ['test'],
            'testDependencyInjection'
        );

        $this->assertInstanceOf(Request::class, $result[0]);
        $this->assertEquals('test', $result[1]);
    }

    ///
    /// Uncomment below when PR https://github.com/octobercms/library/pull/453 is merged
    ///

//    public function testDependencyInjectionDynamicMethod()
//    {
//        /** @var DependenciesResolver $dependencyResolver */
//        $dependencyResolver = $this->app->make(DependenciesResolver::class);
//
//        $dependencyTestClass = new DependencyTestClass();
//        $dependencyTestClass->addDynamicMethod('testDynamic', static function (Request $request) {});
//
//        $result = $dependencyResolver->resolveForExtendableObject(
//            $dependencyTestClass,
//            [],
//            'testDynamic'
//        );
//
//        $this->assertInstanceOf(Request::class, $result[0]);
//    }
//
//    public function testDependencyInjectionDynamicMethodWithParameters()
//    {
//        /** @var DependenciesResolver $dependencyResolver */
//        $dependencyResolver = $this->app->make(DependenciesResolver::class);
//
//        $dependencyTestClass = new DependencyTestClass();
//        $dependencyTestClass->addDynamicMethod('testDynamic', static function (Request $request) {});
//
//        $result = $dependencyResolver->resolveForExtendableObject(
//            $dependencyTestClass,
//            ['testDynamic'],
//            'testDependencyInjection'
//        );
//
//        $this->assertInstanceOf(Request::class, $result[0]);
//        $this->assertEquals('test', $result[1]);
//    }
}
