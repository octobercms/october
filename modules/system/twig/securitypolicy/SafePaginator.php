<?php namespace System\Twig\SecurityPolicy;

use Illuminate\Pagination\AbstractPaginator;
use October\Contracts\Twig\CallsAnyMethod;
use ArrayAccess;
use Countable;
use IteratorAggregate;
use Traversable;

/**
 * SafePaginator proxies a paginator so that forwarded __call reaches the
 * underlying collection through SafeCollection instead of the raw one.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SafePaginator implements CallsAnyMethod, ArrayAccess, Countable, IteratorAggregate
{
    /**
     * @var array blockedMethods that expose the raw collection or accept callables
     */
    protected $blockedMethods = [
        'through',
        'setcollection',
        'getcollection',
    ];

    /**
     * @inheritdoc
     */
    public function __construct(protected AbstractPaginator $paginator)
    {
    }

    /**
     * __call routes native paginator methods to the paginator, otherwise routes
     * the call through SafeCollection so the raw collection is never exposed.
     */
    public function __call($method, $parameters)
    {
        if (in_array(strtolower($method), $this->blockedMethods, true)) {
            return $this;
        }

        if (method_exists($this->paginator, $method)) {
            return $this->paginator->$method(...$parameters);
        }

        return (new SafeCollection($this->paginator->getCollection()))->$method(...$parameters);
    }

    /**
     * __toString delegates to the paginator so string casts render pagination.
     */
    public function __toString(): string
    {
        return (string) $this->paginator;
    }

    /**
     * getIterator delegates iteration to the paginator so Twig for-loops work.
     */
    public function getIterator(): Traversable
    {
        return $this->paginator->getIterator();
    }

    /**
     * count delegates to the paginator so Twig |length works.
     */
    public function count(): int
    {
        return $this->paginator->count();
    }

    /**
     * offsetExists delegates to the paginator so Twig array access works.
     */
    public function offsetExists($offset): bool
    {
        return $this->paginator->offsetExists($offset);
    }

    /**
     * offsetGet delegates to the paginator so Twig array access works.
     */
    public function offsetGet($offset): mixed
    {
        return $this->paginator->offsetGet($offset);
    }

    /**
     * offsetSet is a no-op since paginators are read-only in Twig.
     */
    public function offsetSet($offset, $value): void
    {
    }

    /**
     * offsetUnset is a no-op since paginators are read-only in Twig.
     */
    public function offsetUnset($offset): void
    {
    }
}
