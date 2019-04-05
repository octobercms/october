@if ($paginator->hasPages())
    <ul class="pagination">
        {{-- Previous Page Link --}}
        @if ($paginator->onFirstPage())
            <li class="disabled"><span>{!! Lang::get('system::lang.pagination.previous') !!}</span></li>
        @else
            <li><a href="{{ $paginator->previousPageUrl() }}"
                   rel="prev">{!! Lang::get('system::lang.pagination.previous') !!}</a></li>
        @endif

        {{-- Next Page Link --}}
        @if ($paginator->hasMorePages())
            <li><a href="{{ $paginator->nextPageUrl() }}" rel="next">{!! Lang::get('system::lang.pagination.next') !!}</a>
            </li>
        @else
            <li class="disabled"><span>{!! Lang::get('system::lang.pagination.next') !!}</span></li>
        @endif
    </ul>
@endif

