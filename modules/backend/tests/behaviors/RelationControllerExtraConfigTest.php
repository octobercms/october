<?php

use Backend\Behaviors\RelationController;

/**
 * RelationExtraConfigController defines relations with readOnly set to true, false, null and not at all.
 */
class RelationExtraConfigController extends \Backend\Classes\Controller
{
    public $implement = [RelationController::class];

    public $relationConfig = [
        'locked' => ['label' => 'Locked', 'readOnly' => true],
        'writable' => ['label' => 'Writable', 'readOnly' => false],
        'unset' => ['label' => 'Unset', 'readOnly' => null],
        'open' => ['label' => 'Open'],
    ];
}

/**
 * RelationControllerExtraConfigTest covers how posted and render config change the relation readOnly,
 * which is locked when the relation config sets it and only changes the display otherwise.
 */
class RelationControllerExtraConfigTest extends TestCase
{
    /**
     * testPostedConfigCannotLiftDefinedReadOnly ensures a relation defined as read only stays read only.
     */
    public function testPostedConfigCannotLiftDefinedReadOnly()
    {
        $behavior = $this->makeBehavior();

        $this->assertTrue($this->applyConfig($behavior, 'locked', ['readOnly' => false])['readOnly']);
    }

    /**
     * testPostedConfigCannotLockDefinedWritable ensures a relation defined as writable stays writable.
     */
    public function testPostedConfigCannotLockDefinedWritable()
    {
        $behavior = $this->makeBehavior();

        $this->assertFalse($this->applyConfig($behavior, 'writable', ['readOnly' => true])['readOnly']);
    }

    /**
     * testNullReadOnlyIsNotDefined ensures a null readOnly leaves the relation to extra config, like an omitted one.
     */
    public function testNullReadOnlyIsNotDefined()
    {
        $behavior = $this->makeBehavior();

        $this->assertTrue($this->applyConfig($behavior, 'unset', ['readOnly' => true])['readOnly']);
        $this->assertFalse($this->applyConfig($behavior, 'unset', ['readOnly' => false])['readOnly']);
    }

    /**
     * testPostedConfigCanMakeRelationReadOnly ensures extra config can still make a writable relation read only.
     */
    public function testPostedConfigCanMakeRelationReadOnly()
    {
        $behavior = $this->makeBehavior();

        $this->assertTrue($this->applyConfig($behavior, 'open', ['readOnly' => true])['readOnly']);
    }

    /**
     * testPreviewDefaultStillApplies ensures the readOnlyDefault used by preview mode still makes a relation read only.
     */
    public function testPreviewDefaultStillApplies()
    {
        $behavior = $this->makeBehavior();

        $this->assertTrue($this->applyConfig($behavior, 'open', ['readOnlyDefault' => true])['readOnly']);
    }

    /**
     * testEarlierReadOnlyInRequestDoesNotStick ensures a read only applied earlier in the request is not treated as the definition.
     */
    public function testEarlierReadOnlyInRequestDoesNotStick()
    {
        $behavior = $this->makeBehavior();

        $this->applyConfig($behavior, 'open', ['readOnly' => true]);

        $this->assertFalse($this->applyConfig($behavior, 'open', ['readOnly' => false])['readOnly']);
    }

    /**
     * testRegisteredReadOnlyCannotBeLifted ensures a relation registered as read only stays read only.
     */
    public function testRegisteredReadOnlyCannotBeLifted()
    {
        $behavior = $this->makeBehavior();
        $behavior->relationRegisterField('items', ['label' => 'Items', 'readOnly' => true]);

        $this->assertTrue($this->applyConfig($behavior, 'items', ['readOnly' => false])['readOnly']);
    }

    /**
     * testRegisteringAgainSetsDefinedReadOnly ensures a new registration replaces the remembered readOnly.
     */
    public function testRegisteringAgainSetsDefinedReadOnly()
    {
        $behavior = $this->makeBehavior();
        $behavior->relationRegisterField('items', ['label' => 'Items', 'readOnly' => true]);
        $this->applyConfig($behavior, 'items', ['readOnly' => false]);

        $behavior->relationRegisterField('items', ['label' => 'Items']);

        $this->assertFalse($this->applyConfig($behavior, 'items', ['readOnly' => false])['readOnly']);
    }

    /**
     * makeBehavior returns the relation behavior with its definitions loaded.
     */
    protected function makeBehavior(): RelationController
    {
        $behavior = (new RelationExtraConfigController)->asExtension('RelationController');
        $behavior->relationApplyConfigDefaults('open', []);

        return $behavior;
    }

    /**
     * applyConfig applies extra config to a relation, as a postback does, and returns the resulting definition.
     */
    protected function applyConfig(RelationController $behavior, string $field, array $config): array
    {
        self::callProtectedMethod($behavior, 'setExtraConfig', [json_encode($config)]);
        self::callProtectedMethod($behavior, 'applyExtraConfig', [$field]);

        return (array) self::getProtectedProperty($behavior, 'originalConfig')->{$field};
    }
}
