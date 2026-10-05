<?php

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use System\Twig\SecurityPolicy;
use System\Twig\SecurityPolicy\SafePaginator;

/**
 * SafePaginatorTest verifies paginators reaching a sandboxed template are proxied and cannot reach callables.
 */
class SafePaginatorTest extends TestCase
{
    public function testPaginatorsAreCastToSafeProxy()
    {
        $policy = new SecurityPolicy;

        $this->assertInstanceOf(SafePaginator::class, $policy->castMethodObjectToSafeObject($this->makeLengthAwarePaginator()));
        $this->assertInstanceOf(SafePaginator::class, $policy->castMethodObjectToSafeObject(new Paginator([1, 2], 2)));
    }

    /**
     * @dataProvider blockedMethodProvider
     */
    public function testBlockedMethodsReturnProxyWithoutForwarding(string $method)
    {
        $proxy = new SafePaginator($this->makeLengthAwarePaginator());

        $this->assertSame($proxy, $proxy->$method('strtoupper'));
    }

    public static function blockedMethodProvider(): array
    {
        return [
            ['through'], ['getCollection'], ['setCollection'], ['tap'], ['pipe'],
            ['mapInto'], ['pipeInto'], ['toResourceCollection'], ['PIPE'],
        ];
    }

    public function testForwardedCollectionCallsStripCallables()
    {
        $proxy = new SafePaginator($this->makeLengthAwarePaginator(['a', 'b']));

        $this->assertSame(['a', 'b'], $proxy->filter('is_numeric')->all());
    }

    public function testNativePaginatorMethodsStillWork()
    {
        $proxy = new SafePaginator($this->makeLengthAwarePaginator(['a', 'b']));

        $this->assertSame(2, $proxy->count());
        $this->assertSame(1, $proxy->currentPage());
        $this->assertSame(['a', 'b'], iterator_to_array($proxy));
    }

    protected function makeLengthAwarePaginator(array $items = [1, 2]): LengthAwarePaginator
    {
        return new LengthAwarePaginator($items, count($items), 10, 1);
    }
}
