<?php namespace Cms\Twig\Node;

use Twig\Source;
use Twig\Template;
use Twig\Node\Node;
use Twig\Compiler;
use Twig\Environment;
use Twig\Extension\SandboxExtension;
use Twig\Node\Expression\GetAttrExpression;
use Twig\Extension\CoreExtension;
use Twig\Node\Expression\SupportDefinedTestInterface;
use Twig\Node\Expression\SupportDefinedTestTrait;

/**
 * GetAttrNode compiles a custom get attribute node.
 * Carbon copy of the parent class with custom get attribute logic.
 */
class GetAttrNode extends GetAttrExpression implements SupportDefinedTestInterface
{
    use SupportDefinedTestTrait;

    /**
     * @inheritdoc
     */
    public function __construct(array $nodes = [], array $attributes = [], int $lineno = 0)
    {
        // Skips parent::__construct()
        Node::__construct($nodes, $attributes, $lineno);
    }

    /**
     * @inheritdoc
     */
    public function compile(Compiler $compiler): void
    {
        $env = $compiler->getEnvironment();

        // optimize array calls
        if (
            $this->getAttribute('optimizable')
            && (!$env->isStrictVariables() || $this->getAttribute('ignore_strict_check'))
            && !$this->isDefinedTestEnabled()
            && Template::ARRAY_CALL === $this->getAttribute('type')
        ) {
            $var = '$'.$compiler->getVarName();
            $compiler
                ->raw('(('.$var.' = ')
                ->subcompile($this->getNode('node'))
                ->raw(') && is_array(')
                ->raw($var)
                ->raw(') || ')
                ->raw($var)
                ->raw(' instanceof ArrayAccess ? (')
                ->raw($var)
                ->raw('[')
                ->subcompile($this->getNode('attribute'))
                ->raw('] ?? null) : null)')
            ;

            return;
        }

        // Different from parent logic, call our custom customGetAttribute method
        $compiler->raw(static::class . '::customGetAttribute($this->env, $this->source, ');

        if ($this->getAttribute('ignore_strict_check')) {
            $this->getNode('node')->setAttribute('ignore_strict_check', true);
        }

        $compiler
            ->subcompile($this->getNode('node'))
            ->raw(', ')
            ->subcompile($this->getNode('attribute'))
        ;

        if ($this->hasNode('arguments')) {
            $compiler->raw(', ')->subcompile($this->getNode('arguments'));
        }
        else {
            $compiler->raw(', []');
        }

        $compiler->raw(', ')
            ->repr($this->getAttribute('type'))
            ->raw(', ')->repr($this->isDefinedTestEnabled())
            ->raw(', ')->repr($this->getAttribute('ignore_strict_check'))
            ->raw(', ')->repr($env->hasExtension(SandboxExtension::class))
            ->raw(', ')->repr($this->getNode('node')->getTemplateLine())
            ->raw(')')
        ;
    }

    /**
     * customGetAttribute inherits the logic of CoreExtension::getAttribute
     */
    public static function customGetAttribute(Environment $env, Source $source, $object, $item, array $arguments = [], $type = /* Template::ANY_CALL */ 'any', $isDefinedTest = false, $ignoreStrictCheck = false, $sandboxed = false, int $lineno = -1)
    {
        // This will basically disable strict attribute checking for models since they contain
        // dynamic attributes stored in the database or from accessors and should return null
        if ($type !== Template::METHOD_CALL) {
            // Model specific
            if (
                $object instanceof \October\Rain\Halcyon\Model ||
                $object instanceof \October\Rain\Database\Model
            ) {
                if ($isDefinedTest) {
                    return true;
                }

                $ignoreStrictCheck = true;
            }

            // Halcyon relies on fillable to know what is a certain attribute
            if ($object instanceof \October\Rain\Halcyon\Model) {
                if ($object->isFillable($item)) {
                    return $object->$item;
                }
            }

            // Checks if the item is an attribute or a relation, related attributes
            // are lazy loaded and are therefore always defined
            if ($object instanceof \October\Rain\Database\Model) {
                if (
                    array_key_exists($item, $object->attributes) ||
                    $object->hasGetMutator($item) ||
                    $object->hasRelation($item)
                ) {
                    return $object->$item;
                }
            }
        }

        // In sandbox mode, cast objects to safer versions when calling methods
        if ($sandboxed && $type === Template::METHOD_CALL && $env->hasExtension(SandboxExtension::class)) {
            $policy = $env->getExtension(SandboxExtension::class)->getSecurityPolicy();
            if ($policy instanceof \System\Twig\SecurityPolicy) {
                $object = $policy->castMethodObjectToSafeObject($object);
            }
        }

        return CoreExtension::getAttribute(
            $env,
            $source,
            $object,
            $item,
            $arguments,
            $type,
            $isDefinedTest,
            $ignoreStrictCheck,
            $sandboxed,
            $lineno
        );
    }
}
