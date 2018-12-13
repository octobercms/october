<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;
use Backend\Widgets\Form;

/**
 * Sub Form
 * Renders a sub form bound to a jsonable field of a model.
 *
 * @package october\backend
 * @author Sascha Aeppli
 */
class SubForm extends FormWidgetBase
{
    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'subform';

    /**
     * @var [] Form configuration
     */
    public $form;

    /**
     * @var Form form widget reference
     */
    protected $formWidget;

    /**
     * @inheritDoc
     */
    public function init() {
        $this->fillFromConfig([
            'form',
        ]);

        $config = $this->makeConfig($this->form);
        $config->model = $this->model;
        $config->data = $this->getLoadValue();
        $config->alias = $this->alias . $this->defaultAlias;
        $config->arrayName = $this->getFieldName();
        $config->isNested = true;

        $widget = $this->makeWidget(Form::class, $config);
        $widget->bindToController();

        $this->formWidget = $widget;
    }

    protected function loadAssets()
    {
        $this->addCss('css/subform.css', 'core');
    }

    /**
     * @inheritdoc
     */
    function render()
    {
        $this->prepareVars();
        return $this->makePartial('subform');
    }

    function prepareVars() {
        $this->formWidget->previewMode = $this->previewMode;
    }
}
