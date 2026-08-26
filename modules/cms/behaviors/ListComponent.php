<?php namespace Cms\Behaviors;

use Cms\Classes\ComponentBehavior;

/**
 * ListComponent behavior adds record listing capabilities to CMS components.
 *
 * This behavior provides query building, sorting, pagination, and record
 * exposure for Twig templates. Components supply the base query via
 * listCreateQuery() and the behavior handles the rest.
 *
 * Usage in a component:
 *
 *     public $implement = [
 *         \Cms\Behaviors\ListComponent::class,
 *     ];
 *
 *     public function listCreateQuery() { return MyModel::query(); }
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ListComponent extends ComponentBehavior
{
    /**
     * @var mixed primaryRecordCache
     */
    protected $primaryRecordCache = false;

    /**
     * getPrimaryRecordQuery returns the base query, delegating to the component
     */
    public function getPrimaryRecordQuery()
    {
        return $this->component->listCreateQuery();
    }

    /**
     * getPrimaryRecord returns the record(s) with sorting and pagination applied
     */
    public function getPrimaryRecord()
    {
        if ($this->primaryRecordCache !== false) {
            return $this->primaryRecordCache;
        }

        return $this->primaryRecordCache = $this->component->getPrimaryRecordResult();
    }

    /**
     * getPrimaryRecordResult fetches results with sorting and pagination
     */
    public function getPrimaryRecordResult()
    {
        $query = $this->component->getPrimaryRecordQuery();

        if ($sortColumn = $this->listGetSortColumn()) {
            $query = $query->orderBy($sortColumn, $this->listGetSortDirection());
        }

        if ($recordsPerPage = $this->listGetRecordsPerPage()) {
            return $query->paginateAtPage($recordsPerPage, $this->listGetPageNumber());
        }

        return $query->get();
    }

    /**
     * listGetSortColumn returns the sort column from component properties
     */
    public function listGetSortColumn(): ?string
    {
        return $this->component->property('sortColumn') ?: null;
    }

    /**
     * listGetSortDirection returns the sort direction from component properties
     */
    public function listGetSortDirection(): string
    {
        return $this->component->property('sortDirection') ?: 'desc';
    }

    /**
     * listGetRecordsPerPage returns pagination size from component properties
     */
    public function listGetRecordsPerPage(): ?int
    {
        $value = $this->component->property('recordsPerPage');

        return $value ? (int) $value : null;
    }

    /**
     * listGetPageNumber returns the current page number from component properties
     */
    public function listGetPageNumber(): ?string
    {
        return $this->component->property('pageNumber') ?: null;
    }
}
