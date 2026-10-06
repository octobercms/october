<?php

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\View\ComponentAttributeBag;
use System\Twig\Node\GetAttrNode;
use System\Twig\SecurityPolicy;
use Twig\Environment;
use Twig\Extension\SandboxExtension;
use Twig\Loader\ArrayLoader;
use Twig\Sandbox\SecurityNotAllowedMethodError;
use Twig\Source;
use Twig\Template;

/**
 * SecurityPolicyCallableBlocklistTest verifies callback-taking methods are blocked on allow-listed receivers.
 */
class SecurityPolicyCallableBlocklistTest extends TestCase
{
    protected SecurityPolicy $policy;

    public function setUp(): void
    {
        parent::setUp();
        $this->policy = new SecurityPolicy();
    }

    /**
     * @dataProvider blockedMethodProvider
     */
    public function testCallbackMethodsAreBlocked(string $receiver, string $method)
    {
        $this->expectException(SecurityNotAllowedMethodError::class);

        $this->policy->checkMethodAllowed($this->makeReceiver($receiver), $method);
    }

    public static function blockedMethodProvider(): array
    {
        $cases = [];

        foreach (['query', 'eloquent', 'model'] as $receiver) {
            foreach (['when', 'unless', 'tap', 'pipe', 'chunk', 'each', 'eachById', 'beforeQuery', 'aggregate', 'WHEN'] as $method) {
                $cases["{$receiver} {$method}"] = [$receiver, $method];
            }
        }

        $cases['eloquent withAggregate'] = ['eloquent', 'withAggregate'];
        $cases['model loadAggregate'] = ['model', 'loadAggregate'];
        $cases['model saving'] = ['model', 'saving'];
        $cases['model withoutEvents'] = ['model', 'withoutEvents'];
        foreach (['softDeleted', 'restoring', 'restored', 'forceDeleting', 'forceDeleted', 'validating', 'validated', 'observe', 'extendableExtendCallback'] as $method) {
            $cases["model {$method}"] = ['model', $method];
        }

        $cases['entry extendInSection'] = ['entry', 'extendInSection'];
        $cases['entry extendInSectionUuid'] = ['entry', 'extendInSectionUuid'];
        $cases['global extendInGlobal'] = ['global', 'extendInGlobal'];
        $cases['global extendInGlobalUuid'] = ['global', 'extendInGlobalUuid'];
        $cases['carbon round'] = ['carbon', 'round'];
        $cases['carbon setTestNow'] = ['carbon', 'setTestNow'];
        $cases['attributes when'] = ['attributes', 'when'];
        $cases['attributes filter'] = ['attributes', 'filter'];

        return $cases;
    }

    /**
     * @dataProvider allowedMethodProvider
     */
    public function testCommonTemplateMethodsRemainAllowed(string $receiver, string $method)
    {
        $this->policy->checkMethodAllowed($this->makeReceiver($receiver), $method);

        $this->assertTrue(true);
    }

    public static function allowedMethodProvider(): array
    {
        return [
            ['query', 'where'],
            ['eloquent', 'orderBy'],
            ['eloquent', 'with'],
            ['model', 'get'],
            ['carbon', 'format'],
            ['carbon', 'diffForHumans'],
            ['attributes', 'merge'],
        ];
    }

    public function testEagerLoadConstraintsAreStripped()
    {
        $model = new SecurityPolicyCallableBlocklistTestModel;

        $this->assertSame(
            [['author' => null, 'comments']],
            $this->policy->stripCallableArguments($model, 'with', [['author' => 'strtoupper', 'comments']])
        );

        $this->assertSame(
            ['date'],
            $this->policy->stripCallableArguments($model, 'with', ['date'])
        );

        $this->assertSame(
            ['title', 'strtoupper'],
            $this->policy->stripCallableArguments($model, 'where', ['title', 'strtoupper'])
        );
    }

    /**
     * @dataProvider forwardingMethodProvider
     */
    public function testEagerLoadConstraintsAreStrippedForForwardingMethods(string $method, array $arguments, array $expected)
    {
        $model = new SecurityPolicyCallableBlocklistTestModel;

        $this->assertSame($expected, $this->policy->stripCallableArguments($model, $method, $arguments));
    }

    public static function forwardingMethodProvider(): array
    {
        $morphMap = ['App\Post' => ['author' => 'strtoupper', 'tags']];
        $cleanMorphMap = ['App\Post' => ['author' => null, 'tags']];

        return [
            'withOnly' => ['withOnly', [['author' => 'strtoupper']], [['author' => null]]],
            'fresh' => ['fresh', [['author' => 'strtoupper', 'tags']], [['author' => null, 'tags']]],
            'loadMorph' => ['loadMorph', ['commentable', $morphMap], ['commentable', $cleanMorphMap]],
            'loadMorphCount' => ['loadMorphCount', ['commentable', $morphMap], ['commentable', $cleanMorphMap]],
            'loadMorphMax' => ['loadMorphMax', ['commentable', $morphMap, 'date'], ['commentable', $cleanMorphMap, 'date']],
            'loadMorphMin' => ['loadMorphMin', ['commentable', $morphMap, 'date'], ['commentable', $cleanMorphMap, 'date']],
            'loadMorphSum' => ['loadMorphSum', ['commentable', $morphMap, 'count'], ['commentable', $cleanMorphMap, 'count']],
            'loadMorphAvg' => ['loadMorphAvg', ['commentable', $morphMap, 'count'], ['commentable', $cleanMorphMap, 'count']],
            'LOADMORPH' => ['LOADMORPH', ['commentable', $morphMap], ['commentable', $cleanMorphMap]],
        ];
    }

    /**
     * @dataProvider positionalNameProvider
     */
    public function testPositionalNamesMatchingPhpFunctionsAreKept(string $method, array $arguments)
    {
        $model = new SecurityPolicyCallableBlocklistTestModel;

        $this->assertSame($arguments, $this->policy->stripCallableArguments($model, $method, $arguments));
    }

    public static function positionalNameProvider(): array
    {
        return [
            'withMax date column' => ['withMax', ['events', 'date']],
            'withMin time column' => ['withMin', ['logs', 'time']],
            'withSum count column' => ['withSum', ['items', 'count']],
            'load file relation' => ['load', ['author', 'file']],
            'with link relation' => ['with', ['author', 'link']],
            'fresh file relation' => ['fresh', ['author', 'file']],
            'withOnly link relation' => ['withOnly', [['author', 'link']]],
        ];
    }

    public function testEagerLoadConstraintsAreStrippedForAttributeFunction()
    {
        $env = new Environment(new ArrayLoader([]));
        $env->addExtension(new SandboxExtension($this->policy, true));

        $model = new SecurityPolicyCallableBlocklistTestLoadModel;

        // The attribute() function compiles to ANY_CALL with arguments
        GetAttrNode::customGetAttribute(
            $env,
            new Source('', 'test'),
            $model,
            'load',
            [['author' => 'strtoupper']],
            Template::ANY_CALL,
            false,
            true,
            true
        );

        $this->assertSame([['author' => null]], $model->loadArguments);
    }

    protected function makeReceiver(string $receiver)
    {
        return match ($receiver) {
            'query' => (new ReflectionClass(QueryBuilder::class))->newInstanceWithoutConstructor(),
            'eloquent' => (new ReflectionClass(EloquentBuilder::class))->newInstanceWithoutConstructor(),
            'model' => new SecurityPolicyCallableBlocklistTestModel,
            'entry' => (new ReflectionClass(\Tailor\Models\EntryRecord::class))->newInstanceWithoutConstructor(),
            'global' => (new ReflectionClass(\Tailor\Models\GlobalRecord::class))->newInstanceWithoutConstructor(),
            'carbon' => Carbon::now(),
            'attributes' => new ComponentAttributeBag,
        };
    }
}

class SecurityPolicyCallableBlocklistTestModel extends Model
{
    protected $table = 'security_policy_callable_blocklist_test';
    protected $guarded = [];
}

class SecurityPolicyCallableBlocklistTestLoadModel extends SecurityPolicyCallableBlocklistTestModel
{
    public $loadArguments;

    public function load($relations)
    {
        $this->loadArguments = func_get_args();

        return $this;
    }
}
