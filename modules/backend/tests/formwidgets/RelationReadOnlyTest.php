<?php

use Backend\Widgets\Form;
use Backend\Classes\Controller;
use October\Rain\Database\Model;

/**
 * RelationReadOnlyCountryModel is the related model.
 */
class RelationReadOnlyCountryModel extends Model
{
    public $table = 'relation_read_only_countries';
}

/**
 * RelationReadOnlyUserModel belongs to a country.
 */
class RelationReadOnlyUserModel extends Model
{
    public $table = 'relation_read_only_users';

    public $belongsTo = [
        'country' => RelationReadOnlyCountryModel::class,
    ];
}

/**
 * RelationReadOnlyTest covers which readOnly settings the relation widget registers as locked relation config.
 */
class RelationReadOnlyTest extends PluginTestCase
{
    /**
     * testFieldReadOnlyIsNotRegistered ensures the form field readOnly stays a display setting for inline controller config.
     */
    public function testFieldReadOnlyIsNotRegistered()
    {
        $config = $this->registerRelationField(['readOnly' => true], ['label' => 'Country']);

        $this->assertArrayNotHasKey('readOnly', $config);
    }

    /**
     * testControllerReadOnlyIsRegistered ensures a readOnly set in the inline controller config is registered.
     */
    public function testControllerReadOnlyIsRegistered()
    {
        $config = $this->registerRelationField([], ['label' => 'Country', 'readOnly' => true]);

        $this->assertTrue($config['readOnly']);
    }

    /**
     * registerRelationField builds a relation field with inline controller config and returns the relation config it registers.
     */
    protected function registerRelationField(array $fieldConfig, array $controllerConfig): array
    {
        $controller = new Controller;

        $form = new Form($controller, [
            'model' => new RelationReadOnlyUserModel,
            'arrayName' => 'RelationReadOnlyUserModel',
            'fields' => [
                'country' => array_merge([
                    'label' => 'Country',
                    'type' => 'relation',
                    'controller' => $controllerConfig,
                ], $fieldConfig),
            ],
        ]);

        $form->bindToController();
        self::callProtectedMethod($form, 'defineFormFields');

        $behavior = $controller->asExtension('RelationController');

        return (array) self::getProtectedProperty($behavior, 'originalConfig')->country;
    }
}
