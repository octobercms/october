<?php

use Backend\Widgets\Form;
use Backend\Classes\Controller;
use October\Rain\Database\Model;

/**
 * QuickCreateCountryModel is the related dropdown model.
 */
class QuickCreateCountryModel extends Model
{
    public $table = 'quick_create_countries';

    protected $fillable = ['name'];

    public $timestamps = false;
}

/**
 * QuickCreateUserModel is the host model with a singular relation.
 */
class QuickCreateUserModel extends Model
{
    public $table = 'quick_create_users';

    public $timestamps = false;

    public $belongsTo = [
        'country' => QuickCreateCountryModel::class,
    ];
}

/**
 * RelationQuickCreateTest covers the quick create option being unselectable
 * when the dropdown had no entries, since the sentinel option became the
 * default browser selection and never fired a change event.
 */
class RelationQuickCreateTest extends PluginTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        if (!Schema::hasTable('quick_create_countries')) {
            Schema::create('quick_create_countries', function ($table) {
                $table->increments('id');
                $table->string('name')->nullable();
            });
        }

        if (!Schema::hasTable('quick_create_users')) {
            Schema::create('quick_create_users', function ($table) {
                $table->increments('id');
                $table->integer('country_id')->nullable();
            });
        }
    }

    public function tearDown(): void
    {
        Schema::dropIfExists('quick_create_users');
        Schema::dropIfExists('quick_create_countries');

        parent::tearDown();
    }

    /**
     * makeRelationWidget builds a relation form widget for the user country field.
     */
    protected function makeRelationWidget(array $fieldConfig = [])
    {
        $form = new Form(new Controller, [
            'model' => new QuickCreateUserModel,
            'arrayName' => 'QuickCreateUserModel',
            'fields' => [
                'country' => array_merge([
                    'label' => 'Country',
                    'type' => 'relation',
                    'nameFrom' => 'name',
                    'quickCreate' => ['optionText' => 'Create New Country'],
                ], $fieldConfig),
            ],
        ]);

        $form->bindToController();
        self::callProtectedMethod($form, 'defineFormFields');

        return $form->getFormWidget('country');
    }

    /**
     * renderField prepares the widget and returns the render form field.
     */
    protected function renderField($widget)
    {
        $widget->prepareVars();

        return $widget->renderFormField;
    }

    /**
     * testQuickCreateOptionIsPrepended
     */
    public function testQuickCreateOptionIsPrepended()
    {
        QuickCreateCountryModel::create(['name' => 'Testland']);

        $field = $this->renderField($this->makeRelationWidget());
        $options = $field->options();

        $this->assertSame('__quick_create__', array_key_first($options));
        $this->assertContains('Testland', $options);
    }

    /**
     * testPlaceholderAppliedWhenNoEntriesExist asserts the placeholder default,
     * which guarantees an empty option renders first so the sentinel option is
     * never the default browser selection.
     */
    public function testPlaceholderAppliedWhenNoEntriesExist()
    {
        $field = $this->renderField($this->makeRelationWidget());
        $options = $field->options();

        $this->assertSame(['__quick_create__'], array_keys($options));
        $this->assertNotEmpty($field->placeholder);
    }

    /**
     * testExplicitPlaceholderIsPreserved
     */
    public function testExplicitPlaceholderIsPreserved()
    {
        $field = $this->renderField($this->makeRelationWidget([
            'placeholder' => 'Choose a country'
        ]));

        $this->assertSame('Choose a country', $field->placeholder);
    }

    /**
     * testExplicitEmptyOptionDisablesPlaceholderDefault
     */
    public function testExplicitEmptyOptionDisablesPlaceholderDefault()
    {
        $field = $this->renderField($this->makeRelationWidget([
            'emptyOption' => 'No Country'
        ]));

        $this->assertEmpty($field->placeholder);
        $this->assertSame('No Country', $field->getConfig('emptyOption'));
    }

    /**
     * testSentinelValueIsNeverSaved
     */
    public function testSentinelValueIsNeverSaved()
    {
        $widget = $this->makeRelationWidget();

        $this->assertNull($widget->getSaveValue('__quick_create__'));
    }

    /**
     * testNoPlaceholderDefaultWithoutQuickCreate
     */
    public function testNoPlaceholderDefaultWithoutQuickCreate()
    {
        $field = $this->renderField($this->makeRelationWidget([
            'quickCreate' => null
        ]));

        $this->assertArrayNotHasKey('__quick_create__', $field->options());
        $this->assertEmpty($field->placeholder);
    }
}
