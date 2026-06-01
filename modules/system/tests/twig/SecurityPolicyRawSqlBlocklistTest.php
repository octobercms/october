<?php

use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use System\Twig\SecurityPolicy;
use Twig\Sandbox\SecurityNotAllowedMethodError;

/**
 * SecurityPolicyRawSqlBlocklistTest verifies raw-SQL and subquery methods
 * are blocked across the Query\Builder forwarding chain.
 */
class SecurityPolicyRawSqlBlocklistTest extends TestCase
{
    protected SecurityPolicy $policy;

    public function setUp(): void
    {
        parent::setUp();
        $this->policy = new SecurityPolicy();
    }

    /** @return array<int, string> */
    public function rawSqlMethods(): array
    {
        return [
            'selectRaw', 'whereRaw', 'orWhereRaw',
            'havingRaw', 'orHavingRaw',
            'orderByRaw', 'groupByRaw',
            'fromRaw', 'fromSub',
            'joinSub', 'leftJoinSub', 'rightJoinSub', 'crossJoinSub',
            'raw', 'rawValue',
        ];
    }

    public function testRawSqlMethodsBlockedOnQueryBuilder()
    {
        $builder = $this->makeQueryBuilder();

        foreach ($this->rawSqlMethods() as $method) {
            try {
                $this->policy->checkMethodAllowed($builder, $method);
                $this->fail("Expected {$method}() to be blocked on Query\\Builder");
            }
            catch (SecurityNotAllowedMethodError $e) {
                $this->assertStringContainsString($method, $e->getMessage());
            }
        }
    }

    public function testRawSqlMethodsBlockedOnEloquentBuilder()
    {
        $builder = $this->makeEloquentBuilder();

        foreach ($this->rawSqlMethods() as $method) {
            try {
                $this->policy->checkMethodAllowed($builder, $method);
                $this->fail("Expected {$method}() to be blocked on Eloquent\\Builder");
            }
            catch (SecurityNotAllowedMethodError $e) {
                $this->assertStringContainsString($method, $e->getMessage());
            }
        }
    }

    public function testRawSqlMethodsBlockedOnEloquentModel()
    {
        $model = new SecurityPolicyRawSqlBlocklistTestModel();

        foreach ($this->rawSqlMethods() as $method) {
            try {
                $this->policy->checkMethodAllowed($model, $method);
                $this->fail("Expected {$method}() to be blocked on Eloquent\\Model");
            }
            catch (SecurityNotAllowedMethodError $e) {
                $this->assertStringContainsString($method, $e->getMessage());
            }
        }
    }

    public function testRawSqlAndWriteMethodsBlockedOnTailorComponentVariable()
    {
        if (!class_exists(\Tailor\Classes\ComponentVariable::class)) {
            $this->markTestSkipped('Tailor module not available');
        }

        $variable = (new ReflectionClass(\Tailor\Classes\ComponentVariable::class))
            ->newInstanceWithoutConstructor();

        $blockedMethods = array_merge($this->rawSqlMethods(), [
            'insert', 'update', 'delete', 'truncate', 'forceDelete',
            'create', 'firstOrCreate', 'updateOrCreate',
        ]);

        foreach ($blockedMethods as $method) {
            try {
                $this->policy->checkMethodAllowed($variable, $method);
                $this->fail("Expected {$method}() to be blocked on ComponentVariable");
            }
            catch (SecurityNotAllowedMethodError $e) {
                $this->assertStringContainsString($method, $e->getMessage());
            }
        }
    }

    public function testSafeBuilderMethodsStillAllowed()
    {
        $builder = $this->makeQueryBuilder();

        foreach (['where', 'orderBy', 'limit', 'take', 'skip', 'get', 'first', 'pluck', 'count'] as $method) {
            $this->policy->checkMethodAllowed($builder, $method);
        }

        $this->assertTrue(true);
    }

    protected function makeQueryBuilder(): QueryBuilder
    {
        return (new ReflectionClass(QueryBuilder::class))->newInstanceWithoutConstructor();
    }

    protected function makeEloquentBuilder(): EloquentBuilder
    {
        return (new ReflectionClass(EloquentBuilder::class))->newInstanceWithoutConstructor();
    }
}

class SecurityPolicyRawSqlBlocklistTestModel extends Model
{
    protected $table = 'security_policy_raw_sql_blocklist_test';
    protected $guarded = [];
}
