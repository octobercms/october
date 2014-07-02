<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;

/**
 * Date picker
 * Renders a record finder field.
 *
 *    user:
 *        label: User
 *        type: recordfinder
 *        list: @/plugins/rainlab/user/models/user/columns.yaml
 *        prompt: Click the Find button to find a user
 *        displayName: name
 *        displayDescription: email
 * 
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RecordFinder extends FormWidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'recordfinder';

    /**
     * @var string Relation column to display for the name
     */
    public $displayName;

    /**
     * @var string Relation column to display for the description
     */
    public $displayDescription;

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->displayName = $this->getConfig('displayName', $this->displayName);
        $this->displayDescription = $this->getConfig('displayDescription', $this->displayDescription);
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('container');
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->vars['name'] = $this->formField->getName();

        $value = $this->model->{$this->columnName};

        $this->vars['value'] = $value ?: '';
        $this->vars['displayName'] = $this->displayName;
        $this->vars['displayDescription'] = $this->displayDescription;
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {

    }

    /**
     * {@inheritDoc}
     */
    public function getSaveData($value)
    {
        return $value;
    }
}