<?php namespace Backend\Widgets\Lists;

use Backend;

/**
 * HasSearch concern
 *
 * @mixin \Backend\Traits\SessionMaker
 */
trait HasSearch
{
    /**
     * @var string Filter the records by a search term.
     */
    protected $searchTerm;

    /**
     * @var string If searching the records, specifies a policy to use.
     * - all: result must contain all words
     * - any: result can contain any word
     * - exact: result must contain the exact phrase
     */
    protected $searchMode;

    /**
     * @var string Use a custom scope method for performing searches.
     */
    protected $searchScope;

    /**
     * setSearchTerm applies a search term to the list results.
     * @param string $term
     * @param boolean $resetState
     */
    public function setSearchTerm($term, $resetState = false)
    {
        // Reset pagination
        if ($resetState) {
            $this->currentPageNumber = 1;
        }

        // Set the actual term
        $this->searchTerm = $term;
    }

    /**
     * getSearchTerm returns the active search term.
     */
    public function getSearchTerm(): ?string
    {
        return $this->searchTerm;
    }

    /**
     * setSearchOptions applies a search options to the list search.
     * @param array $options
     */
    public function setSearchOptions($options = [])
    {
        extract(array_merge([
            'mode' => null,
            'scope' => null
        ], $options));

        $this->searchMode = $mode;
        $this->searchScope = $scope;
    }

    /**
     * getSearchableColumns returns a collection of columns which can be searched.
     * @return array
     */
    public function getSearchableColumns()
    {
        $columns = $this->getColumns();
        $searchable = [];

        foreach ($columns as $column) {
            if (!$column->searchable) {
                continue;
            }

            $searchable[] = $column;
        }

        return $searchable;
    }

    /**
     * applySearchToQuery applies the search constraint to a query.
     */
    protected function applySearchToQuery($query, $columns, $boolean = 'and')
    {
        $term = $this->searchTerm;

        if ($scopeMethod = $this->searchScope) {
            $searchMethod = $boolean == 'and' ? 'where' : 'orWhere';
            $query->$searchMethod(function ($q) use ($term, $columns, $scopeMethod) {
                $q->$scopeMethod($term, $columns);
            });
        }
        else {
            $searchMethod = $boolean == 'and' ? 'searchWhere' : 'orSearchWhere';
            $query->$searchMethod($term, $columns, $this->searchMode);
        }
    }
}
