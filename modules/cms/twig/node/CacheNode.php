<?php namespace Cms\Twig\Node;

use Twig\Compiler;
use Twig\Node\CaptureNode;
use Twig\Node\Expression\AbstractExpression;
use Twig\Node\Node;

/**
 * CacheNode
 */
class CacheNode extends AbstractExpression
{
    /**
     * __construct
     */
    public function __construct(AbstractExpression $key, ?AbstractExpression $ttl, Node $body, int $lineno)
    {
        $body = new CaptureNode($body, $lineno);
        $body->setAttribute('raw', true);

        $nodes = ['key' => $key, 'body' => $body];
        if (null !== $ttl) {
            $nodes['ttl'] = $ttl;
        }

        parent::__construct($nodes, [], $lineno);
    }

    /**
     * compile
     */
    public function compile(Compiler $compiler): void
    {
        $compiler
            ->addDebugInfo($this)
            // compile as a single expression (IIFE) that returns the cached string
            ->raw('(function () use ($context, $macros, $blocks) {' . "\n")
            ->indent()

            // body renderer
            ->write('$__cmsClosure = function () use ($context, $macros, $blocks) {' . "\n")
            ->indent()
                ->write('return ')
                ->subcompile($this->getNode('body'))
                ->raw(";\n")
            ->outdent()
            ->write("};\n");

        // ttl
        if ($this->hasNode('ttl')) {
            $compiler
                ->write('$__cmsTtl = ')
                ->subcompile($this->getNode('ttl'))
                ->raw(";\n");
        } else {
            $compiler->write('$__cmsTtl = null;' . "\n");
        }

        // single proxy call to the extension (handles prefix, ttl normalization, store, tags, etc.)
        $compiler
            ->write('return $this->env->getExtension(\\Cms\\Twig\\Extension::class)->setCache(')
            ->subcompile($this->getNode('key'))
            ->raw(', $__cmsTtl, $__cmsClosure);' . "\n")
            ->outdent()
            ->raw('})()');
    }
}
