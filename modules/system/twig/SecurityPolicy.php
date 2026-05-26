<?php namespace System\Twig;

use Config;
use System;
use Twig\Markup;
use Twig\Template;
use Twig\Environment as TwigEnvironment;
use Twig\Sandbox\SecurityPolicyInterface;
use Twig\Sandbox\SecurityNotAllowedMethodError;
use Twig\Sandbox\SecurityNotAllowedPropertyError;
use Twig\Extension\SandboxExtension;

/**
 * SecurityPolicy is a security policy using an allow-list
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
final class SecurityPolicy implements SecurityPolicyInterface
{
    /**
     * @var array blockedClassMethods lists forbidden methods per class.
     * Each entry holds only methods unique to that class; forwarded methods
     * are pulled in via $blockedClassForwarders.
     */
    protected $blockedClassMethods = [
        \October\Rain\Database\Attach\File::class => [
            'fromPost', 'fromData', 'fromUrl', 'getDisk'
        ],
        \Illuminate\Database\Query\Builder::class => [
            'insert', 'insertOrIgnore', 'insertGetId', 'insertUsing', 'insertOrIgnoreUsing',
            'update', 'updateFrom', 'updateOrInsert', 'upsert',
            'delete', 'truncate',
            'increment', 'incrementEach', 'decrement', 'decrementEach',
            'from', 'fromRaw', 'fromSub',
            'getConnection', 'toRawSql',
            'selectRaw', 'whereRaw', 'orWhereRaw',
            'havingRaw', 'orHavingRaw',
            'orderByRaw', 'groupByRaw',
            'joinSub', 'leftJoinSub', 'rightJoinSub', 'crossJoinSub',
            'raw', 'rawValue',
        ],
        \Illuminate\Database\Eloquent\Builder::class => [
            'forceDelete',
            'create', 'createQuietly', 'forceCreate', 'forceCreateQuietly',
            'firstOrCreate', 'createOrFirst', 'updateOrCreate', 'incrementOrCreate',
            'fillAndInsert', 'fillAndInsertOrIgnore', 'fillAndInsertGetId',
            'touch',
        ],
        \Illuminate\Database\Eloquent\Model::class => [
            'updateOrFail', 'updateQuietly',
            'deleteQuietly', 'deleteOrFail', 'destroy', 'forceDestroy',
            'save', 'saveQuietly', 'saveOrFail',
            'push', 'pushQuietly',
            'fill', 'forceFill',
        ],
    ];

    /**
     * @var array blockedClassForwarders maps a class to the class its __call
     * forwards to, so the sandbox enforces both blocklists for one receiver.
     */
    protected $blockedClassForwarders = [
        \Illuminate\Database\Eloquent\Builder::class => \Illuminate\Database\Query\Builder::class,
        \Illuminate\Database\Eloquent\Model::class => \Illuminate\Database\Eloquent\Builder::class,
        \Tailor\Classes\ComponentVariable::class => \Illuminate\Database\Eloquent\Builder::class,
    ];

    /**
     * @var array blockMethods is a list of forbidden methods
     */
    protected $blockMethods = [
        // Block PHP
        '__call',
        '__callStatic',

        // Block October\Rain\Extension\ExtensionTrait
        'extend',
        'extensionExtendCallback',

        // Block October\Rain\Extension\ExtendableTrait
        'extendableCall',
        'extendableCallStatic',
        'extendClassWith',
        'implementClassWith',
        'addDynamicMethod',
        'addDynamicProperty',

        // Block October\Rain\Support\Traits\Emitter
        'bindEvent',
        'bindEventOnce',

        // Block Illuminate\Support\Traits\Macroable
        'macro',
        'mixin',
    ];

    /**
     * @var array allowMethods is a list of allowed methods
     */
    protected $allowMethods = [
        '__toString',
        'toArray'
    ];

    /**
     * __construct
     */
    public function __construct()
    {
        // Convert all methods to lower case
        foreach ($this->allowMethods as $i => $m) {
            $this->allowMethods[$i] = strtr($m, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz');
        }

        foreach ($this->blockMethods as $i => $m) {
            $this->blockMethods[$i] = strtr($m, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz');
        }

        foreach ($this->blockedClassMethods as $i => $methods) {
            foreach ($methods as $ii => $m) {
                $this->blockedClassMethods[$i][$ii] = strtr($m, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz');
            }
        }
    }

    /**
     * addExtensionToTwig will add the appropriate policy based on configuration. The policy
     * only used in safe mode.
     */
    public static function addExtensionToTwig(TwigEnvironment $twig)
    {
        if (!System::checkSafeMode()) {
            return;
        }

        if (Config::get('cms.security_policy_v1', false)) {
            $twig->addExtension(new SandboxExtension(new SecurityPolicyLegacy, true));
        }
        else {
            $twig->addExtension(new SandboxExtension(new SecurityPolicy, true));
        }
    }

    /**
     * checkSecurity
     * @throws SecurityError
     */
    public function checkSecurity($tags, $filters, $functions): void
    {
    }

    /**
     * checkMethodAllowed
     * @throws SecurityNotAllowedMethodError
     */
    public function checkMethodAllowed($obj, $method): void
    {
        if ($obj instanceof Template || $obj instanceof Markup) {
            return;
        }

        $this->checkMethodAllowedAllowlist($obj, $method);
        $this->checkMethodAllowedBlocklist($obj, $method);
    }

    /**
     * checkPropertyAllowed
     * @throws SecurityNotAllowedPropertyError
     */
    public function checkPropertyAllowed($obj, $property): void
    {
    }

    /**
     * castMethodObjectToSafeObject casts unsafe objects used by method calls to proxy objects
     * that protect from arbitrary callable methods, such as using 'passthru' to execute
     * shell commands.
     */
    public function castMethodObjectToSafeObject($object)
    {
        if ($object instanceof \Illuminate\Support\Collection) {
            return new \System\Twig\SecurityPolicy\SafeCollection($object);
        }

        if ($object instanceof \Illuminate\Session\Store) {
            return new \System\Twig\SecurityPolicy\SafeSessionStore($object);
        }

        if ($object instanceof \Illuminate\Http\Request) {
            return new \System\Twig\SecurityPolicy\SafeRequest($object);
        }

        return $object;
    }

    //
    // Allow-list
    //

    /**
     * checkMethodAllowedAllowlist
     */
    protected function checkMethodAllowedAllowlist($obj, $method)
    {
        // Common internals
        if (
            $obj instanceof \Carbon\Carbon ||
            $obj instanceof \Illuminate\View\View ||
            $obj instanceof \Illuminate\Support\HtmlString ||
            $obj instanceof \Illuminate\Support\Collection ||
            $obj instanceof \Illuminate\Database\Query\Builder ||
            $obj instanceof \Illuminate\Database\Eloquent\Model ||
            $obj instanceof \Illuminate\Database\Eloquent\Builder ||
            $obj instanceof \Illuminate\Pagination\AbstractPaginator ||
            $obj instanceof \Illuminate\View\ComponentAttributeBag ||
            $obj instanceof \SimpleXMLElement
        ) {
            return;
        }

        // Contractual allow-list
        if ($obj instanceof \October\Contracts\Twig\CallsMethods) {
            $methodNames = $obj->getTwigMethodNames();
            if (in_array($method, $methodNames)) {
                return;
            }
        }

        // Contractual wildcard
        if ($obj instanceof \October\Contracts\Twig\CallsAnyMethod) {
            return;
        }

        // Check general methods
        $allowMethod = strtr($method, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz');
        if (in_array($allowMethod, $this->allowMethods)) {
            return;
        }

        $className = get_class($obj);
        throw new SecurityNotAllowedMethodError(sprintf('Calling any method on a "%s" object is blocked.', $className), $className, $method);
    }

    //
    // Block-list
    //

    /**
     * checkMethodAllowedBlocklist
     */
    protected function checkMethodAllowedBlocklist($obj, $method)
    {
        $blockedMethod = strtr($method, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz');

        // Check direct class blocklists
        foreach ($this->blockedClassMethods as $blockedClass => $blockedMethods) {
            if (is_a($obj, $blockedClass) && in_array($blockedMethod, $blockedMethods)) {
                throw new SecurityNotAllowedMethodError(sprintf('Calling "%s" method on a "%s" object is blocked.', $method, $blockedClass), $blockedClass, $method);
            }
        }

        // Check forwarder chains: if $obj's class forwards __call to another
        // class, enforce that class's blocklist as well (transitively).
        foreach ($this->blockedClassForwarders as $sourceClass => $targetClass) {
            if (!is_a($obj, $sourceClass)) {
                continue;
            }

            $cursor = $targetClass;
            while ($cursor !== null) {
                $targetMethods = $this->blockedClassMethods[$cursor] ?? [];
                if (in_array($blockedMethod, $targetMethods)) {
                    throw new SecurityNotAllowedMethodError(sprintf('Calling "%s" method on a "%s" object is blocked.', $method, $sourceClass), $sourceClass, $method);
                }
                $cursor = $this->blockedClassForwarders[$cursor] ?? null;
            }
        }

        // Check general methods
        if (!in_array($blockedMethod, $this->blockMethods)) {
            return;
        }

        $className = get_class($obj);
        throw new SecurityNotAllowedMethodError(sprintf('Calling "%s" method on a "%s" object is blocked.', $method, $className), $className, $method);
    }
}
