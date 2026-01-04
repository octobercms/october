<?php namespace Tailor\Models;

use October\Contracts\Element\FormElement;
use October\Rain\Support\Date;
use Tailor\Classes\Scopes\GlobalRecordScope;
use Tailor\Classes\BlueprintModel;
use Tailor\Classes\BlueprintIndexer;
use ApplicationException;
use Exception;

/**
 * GlobalRecord model for content
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class GlobalRecord extends BlueprintModel
{
    use \Tailor\Traits\DeferredContentModel;
    use \Tailor\Models\GlobalRecord\HasGlobalBlueprint;
    use \October\Rain\Database\Traits\Multisite;
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string table associated with the model
     */
    protected $table = 'tailor_globals';

    /**
     * @var array rules for validation
     */
    public $rules = [];

    /**
     * @var array fillable fields, in addition to those dynamically added by content fields
     */
    protected $fillable = [
        'title'
    ];

    /**
     * @var array attributeNames of custom attributes
     */
    public $attributeNames = [];

    /**
     * @var array customMessages of custom error messages
     */
    public $customMessages = [];

    /**
     * @var array jsonable attribute names that are json encoded and decoded from the database
     */
    protected $jsonable = ['content'];

    /**
     * @var array propagatable list of attributes to propagate to other sites.
     */
    protected $propagatable = [];

    /**
     * definePrimaryFormFields
     */
    public function definePrimaryFormFields(FormElement $host)
    {
        $this->getFieldsetDefinition()->defineAllFormFields($host);
    }

    /**
     * afterBoot
     */
    public function afterBoot()
    {
        static::addGlobalScope(new GlobalRecordScope);
    }

    /**
     * findForGlobal
     */
    public static function findForGlobal($handle): GlobalRecord
    {
        $blueprint = BlueprintIndexer::instance()->findGlobalByHandle($handle);
        if (!$blueprint) {
            throw new ApplicationException("Global handle [{$handle}] not found");
        }

        return static::findForGlobalUuid($blueprint->uuid);
    }

    /**
     * findForGlobalUuid
     */
    public static function findForGlobalUuid($uuid): GlobalRecord
    {
        // Find existing record
        $record = static::inGlobalUuid($uuid)->first();
        if ($record) {
            return $record;
        }

        // Create new record
        $global = new static;
        $global->extendWithBlueprint($uuid);
        $global->forceSave();

        return $global;
    }

    /**
     * inGlobal
     */
    public static function inGlobal($handle)
    {
        $blueprint = BlueprintIndexer::instance()->findGlobalByHandle($handle);
        if (!$blueprint) {
            throw new ApplicationException("Global handle [{$handle}] not found");
        }

        return static::inGlobalUuid($blueprint->uuid);
    }

    /**
     * scopeInGlobalUuid
     */
    public static function inGlobalUuid($uuid)
    {
        $instance = new static;

        $instance->extendWithBlueprint($uuid);

        return $instance;
    }

    /**
     * extendInGlobal
     */
    public static function extendInGlobal($handle, callable $callback)
    {
        $blueprint = BlueprintIndexer::instance()->findGlobalByHandle($handle);
        if (!$blueprint) {
            throw new ApplicationException("Global handle [{$handle}] not found");
        }

        self::extendInGlobalUuid($blueprint->uuid, $callback);
    }

    /**
     * extendInGlobalUuid
     */
    public static function extendInGlobalUuid($uuid, callable $callback)
    {
        static::extend(function($model) use ($uuid, $callback) {
            $model->bindEvent('model.extendBlueprint', function($foundUuid) use ($uuid, $callback, $model) {
                if ($uuid === $foundUuid) {
                    $callback($model);
                }
            });
        });
    }

    /**
     * isMultisiteEnabled allows for programmatic toggling
     * @return bool
     */
    public function isMultisiteEnabled()
    {
        return $this->getBlueprintDefinition()->useMultisite();
    }

    /**
     * isMultisiteSyncEnabled
     * @return bool
     */
    public function isMultisiteSyncEnabled()
    {
        return $this->getBlueprintDefinition()->useMultisiteSync();
    }

    /**
     * fromDateTime handles an extra saved datetime type in the db
     */
    public function fromDateTime($value)
    {
        // @deprecated this method should be removed once the correct
        // datetime value is stored in the jsonable attribute
        try {
            return parent::fromDateTime($value);
        }
        catch (Exception $ex) {
            return Date::parse($value);
        }
    }
}
