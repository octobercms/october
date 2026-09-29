<?php namespace Backend\Behaviors\ListController;

/**
 * HasOverrides in the controller
 */
trait HasOverrides
{
    /**
     * listExtendColumns is called after the list columns are defined.
     * @param \Backend\Widgets\List $host The hosting list widget
     * @return void
     */
    public function listExtendColumns($host)
    {
    }

    /**
     * listFilterExtendScopes is called after the filter scopes are defined.
     * @param \Backend\Widgets\Filter $host The hosting filter widget
     * @return void
     */
    public function listFilterExtendScopes($host)
    {
    }

    /**
     * listExtendModel controller override: Extend supplied model
     * @param Model $model
     * @return Model
     */
    public function listExtendModel($model, $definition = null)
    {
        return $model;
    }

    /**
     * listExtendQueryBefore controller override: Extend the query used for populating the list
     * before the default query is processed.
     * @param \October\Rain\Database\Builder $query
     */
    public function listExtendQueryBefore($query, $definition = null)
    {
    }

    /**
     * listExtendQuery controller override: Extend the query used for populating the list
     * after the default query is processed.
     * @param \October\Rain\Database\Builder $query
     */
    public function listExtendQuery($query, $definition = null)
    {
    }

    /**
     * listExtendSortColumn controller override: Customize the sort column and direction
     * to include secondary sorting columns if necessary
     * @param \October\Rain\Database\Builder $query
     */
    public function listExtendSortColumn($query, $sortColumn, $sortDirection, $definition = null)
    {
    }

    /**
     * listExtendRecords controller override: Extend the records used for populating the list
     * after the query is processed.
     * @param Illuminate\Contracts\Pagination\LengthAwarePaginator|Illuminate\Database\Eloquent\Collection $records
     */
    public function listExtendRecords($records, $definition = null)
    {
    }

    /**
     * listFilterExtendQuery controller override: Extend the query used for populating the filter
     * options before the default query is processed.
     * @param \October\Rain\Database\Builder $query
     * @param array $scope
     */
    public function listFilterExtendQuery($query, $scope)
    {
    }

    /**
     * listInjectRowClass returns a CSS class name for a list row (<tr class="...">).
     * @param  Model $record The populated model used for the column
     * @param  string $definition List definition (optional)
     * @return string CSS class name
     */
    public function listInjectRowClass($record, $definition = null)
    {
    }

    /**
     * listOverrideColumnValue replaces a table column value (<td>...</td>)
     * @param  Model $record The populated model used for the column
     * @param  string $columnName The column name to override
     * @param  string $definition List definition (optional)
     * @return string HTML view
     */
    public function listOverrideColumnValue($record, $columnName, $definition = null)
    {
    }

    /**
     * listOverrideHeaderValue replaces the entire table header contents (<th>...</th>) with custom HTML
     * @param  string $columnName The column name to override
     * @param  string $definition List definition (optional)
     * @return string HTML view
     */
    public function listOverrideHeaderValue($columnName, $definition = null)
    {
    }

    /**
     * listOverrideRecordUrl overrides the record url for the given record
     * @param \October\Rain\Database\Model $record
     * @param string|null $definition List definition (optional)
     * @return string|array|void New url or complex directive
     */
    public function listOverrideRecordUrl($record, $definition = null)
    {
    }

    /**
     * listBeforeReorder is called before the list record structure is reordered and may return false to abort the reorder.
     * @param \October\Rain\Database\Model $record
     * @param string|null $definition List definition (optional)
     */
    public function listBeforeReorder($record, $definition = null)
    {
    }

    /**
     * listAfterReorder is called after the list record structure is reordered
     * @param \October\Rain\Database\Model $record
     * @param string|null $definition List definition (optional)
     */
    public function listAfterReorder($record, $definition = null)
    {
    }

    /**
     * listExtendRefreshResults is called when the list is refreshed using AJAX,
     * and should return an array of additional partial updates.
     * @param Backend\Widgets\List $host
     * @param array $result
     * @param  string $definition List definition (optional)
     * @return array
     */
    public function listExtendRefreshResults($host, $result, $definition = null)
    {
    }
}
