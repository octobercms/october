<?php namespace Backend\Behaviors\RelationController;

/**
 * HasOverrides in the controller
 */
trait HasOverrides
{
    /**
     * relationBeforeSave is called before the creation or updating form is saved
     * @param string $field
     * @param \Model $model
     */
    public function relationBeforeSave($field, $model)
    {
    }

    /**
     * relationAfterSave is called after the creation or updating form is saved
     * @param string $field
     * @param \Model $model
     */
    public function relationAfterSave($field, $model)
    {
    }

    /**
     * relationBeforeCreate is called before the creation form is saved
     * @param string $field
     * @param \Model $model
     */
    public function relationBeforeCreate($field, $model)
    {
    }

    /**
     * relationAfterCreate is called after the creation form is saved
     * @param string $field
     * @param \Model $model
     */
    public function relationAfterCreate($field, $model)
    {
    }

    /**
     * relationBeforeUpdate is called before the updating form is saved
     * @param string $field
     * @param \Model $model
     */
    public function relationBeforeUpdate($field, $model)
    {
    }

    /**
     * relationAfterUpdate is called after the updating form is saved
     * @param string $field
     * @param \Model $model
     */
    public function relationAfterUpdate($field, $model)
    {
    }

    /**
     * relationAfterDelete called after the related models are deleted
     * @param string $field
     * @param iterable $models
     */
    public function relationAfterDelete($field, $models)
    {
    }

    /**
     * relationBeforeAdd is called before the adding related models
     * @param string $field
     * @param iterable $models
     */
    public function relationBeforeAdd($field, $models)
    {
    }

    /**
     * relationAfterAdd is called after the adding related models
     * @param string $field
     * @param iterable $models
     */
    public function relationAfterAdd($field, $models)
    {
    }

    /**
     * relationBeforeRemove is called before the removing related models
     * @param string $field
     * @param iterable $models
     */
    public function relationBeforeRemove($field, $models)
    {
    }

    /**
     * relationAfterRemove is called after the removing related models
     * @param string $field
     * @param iterable $models
     */
    public function relationAfterRemove($field, $models)
    {
    }

    /**
     * relationAfterCancel called after the user has cancelled the form
     * @param string $field
     * @param \Model $model
     */
    public function relationAfterCancel($field, $model)
    {
    }

    /**
     * relationExtendConfig provides an opportunity to manipulate the field configuration.
     * @param object $config
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendConfig($config, $field, $model)
    {
    }

    /**
     * relationExtendManageFormQuery extends the query used for finding the form model. Extra conditions
     * can be applied to the query, for example, $query->withTrashed();
     * @param \October\Rain\Database\Builder $query
     * @return void
     */
    public function relationExtendManageFormQuery($field, $query)
    {
    }

    /**
     * relationExtendViewListWidget provides an opportunity to manipulate the view widget.
     * @param \Backend\Widgets\List $widget
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendViewListWidget($widget, $field, $model)
    {
    }

    /**
     * relationExtendViewFormWidget provides an opportunity to manipulate the manage widget.
     * @param \Backend\Widgets\Form $widget
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendViewFormWidget($widget, $field, $model)
    {
    }

    /**
     * relationExtendManageListWidget provides an opportunity to manipulate the view widget.
     * @param \Backend\Widgets\List $widget
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendManageListWidget($widget, $field, $model)
    {
    }

    /**
     * relationExtendManageFormWidget provides an opportunity to manipulate the manage widget.
     * @param \Backend\Widgets\Form $widget
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendManageFormWidget($widget, $field, $model)
    {
    }

    /**
     * relationExtendPivotWidget provides an opportunity to manipulate the pivot widget.
     * @param \Backend\Widgets\Form $widget
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendPivotFormWidget($widget, $field, $model)
    {
    }

    /**
     * relationExtendManageFilterWidget provides an opportunity to manipulate the manage filter widget.
     * @param \Backend\Widgets\Filter $widget
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendManageFilterWidget($widget, $field, $model)
    {
    }

    /**
     * relationExtendViewFilterWidget provides an opportunity to manipulate the view filter widget.
     * @param \Backend\Widgets\Filter $widget
     * @param string $field
     * @param \October\Rain\Database\Model $model
     */
    public function relationExtendViewFilterWidget($widget, $field, $model)
    {
    }

    /**
     * relationExtendRefreshResults is needed because the view widget is often
     * refreshed when the manage widget makes a change, you can use this method
     * to inject additional containers when this process occurs. Return an array
     * with the extra values to send to the browser, eg:
     *
     * return ['#myCounter' => 'Total records: 6'];
     *
     * @param string $field
     * @return array
     */
    public function relationExtendRefreshResults($field)
    {
    }

    /**
     * @deprecated use relationExtendViewListWidget or relationExtendViewFormWidget
     */
    public function relationExtendViewWidget($widget, $field, $model)
    {
    }

    /**
     * @deprecated use relationExtendManageListWidget or relationExtendManageFormWidget
     */
    public function relationExtendManageWidget($widget, $field, $model)
    {
    }

    /**
     * @deprecated use relationExtendPivotFormWidget
     */
    public function relationExtendPivotWidget($widget, $field, $model)
    {
    }
}
