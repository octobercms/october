<?php

use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use System\Twig\SecurityPolicy;
use Twig\Sandbox\SecurityNotAllowedMethodError;

/**
 * SecurityPolicySafeModeTest verifies templates cannot run SQL strings,
 * join other tables or write through models.
 */
class SecurityPolicySafeModeTest extends TestCase
{
    protected SecurityPolicy $policy;

    public function setUp(): void
    {
        parent::setUp();
        $this->policy = new SecurityPolicy;
    }

    public function testJoinLockAndDumpMethodsBlockedAcrossTheBuilderChain()
    {
        $methods = [
            'join', 'joinWhere', 'leftJoin', 'leftJoinWhere', 'rightJoin', 'rightJoinWhere',
            'crossJoin', 'joinLateral', 'leftJoinLateral', 'union', 'unionAll',
            'lock', 'dd', 'ddRawSql', 'dump', 'dumpRawSql',
        ];

        $objects = [
            (new ReflectionClass(QueryBuilder::class))->newInstanceWithoutConstructor(),
            (new ReflectionClass(EloquentBuilder::class))->newInstanceWithoutConstructor(),
            new SecurityPolicySafeModeTestModel,
        ];

        foreach ($objects as $object) {
            foreach ($methods as $method) {
                $this->assertBlocked($object, $method);
            }
        }
    }

    public function testRawQueryAndRestoreBlockedOnEloquentBuilderAndModel()
    {
        $objects = [
            (new ReflectionClass(EloquentBuilder::class))->newInstanceWithoutConstructor(),
            new SecurityPolicySafeModeTestModel,
        ];

        foreach ($objects as $object) {
            foreach (['fromQuery', 'restore', 'restoreOrCreate'] as $method) {
                $this->assertBlocked($object, $method);
            }
        }
    }

    public function testModelWriteMethodsBlocked()
    {
        $model = new SecurityPolicySafeModeTestModel;

        $methods = [
            'setAttribute', 'setRawAttributes', 'offsetSet', 'offsetUnset',
            'forceSave', 'incrementQuietly', 'decrementQuietly',
            'bindDeferred', 'unbindDeferred', 'commitDeferred', 'cancelDeferred',
            'makeRoot', 'makeChildOf', 'deleteDescendants',
            'setSortableOrder', 'setSortableRelationOrder',
            'savePropagate', 'deleteForSite',
            'multisiteAfterCreate', 'multisiteSaveComplete', 'multisiteAfterDelete',
            'createNewDraft', 'restoreVersionSnapshot', 'duplicateRecord',
        ];

        foreach ($methods as $method) {
            $this->assertBlocked($model, $method);
        }
    }

    public function testReadMethodsStillAllowed()
    {
        $model = new SecurityPolicySafeModeTestModel;

        foreach (['where', 'orderBy', 'get', 'first', 'count', 'getKey', 'getAttribute'] as $method) {
            $this->policy->checkMethodAllowed($model, $method);
        }

        $this->assertTrue(true);
    }

    public function testSandboxedTemplateCallCannotRunSql()
    {
        $env = new \Twig\Environment(new \Twig\Loader\ArrayLoader([]));
        $env->addExtension(new \Twig\Extension\SandboxExtension($this->policy, true));

        $this->expectException(SecurityNotAllowedMethodError::class);

        \System\Twig\Node\GetAttrNode::customGetAttribute(
            $env,
            new \Twig\Source('', 'test'),
            new SecurityPolicySafeModeTestModel,
            'fromQuery',
            ['select 1'],
            \Twig\Template::METHOD_CALL,
            false,
            false,
            true
        );
    }

    protected function assertBlocked($object, string $method): void
    {
        try {
            $this->policy->checkMethodAllowed($object, $method);
            $this->fail(sprintf('Expected %s() to be blocked on %s', $method, get_class($object)));
        }
        catch (SecurityNotAllowedMethodError $e) {
            $this->assertStringContainsString($method, $e->getMessage());
        }
    }
}

class SecurityPolicySafeModeTestModel extends Model
{
    protected $table = 'security_policy_safe_mode_test';
}
