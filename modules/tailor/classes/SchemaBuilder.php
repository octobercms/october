<?php namespace Tailor\Classes;

use Db;
use Schema;
use SystemException;
use Tailor\Classes\Fieldset;
use Tailor\Classes\Blueprint;
use Tailor\Models\ContentSchema;
use Tailor\Classes\Blueprint\StreamBlueprint;
use Tailor\Classes\Blueprint\StructureBlueprint;
use October\Rain\Database\Schema\Blueprint as DbBlueprint;

/**
 * SchemaBuilder builds tables for tailor content
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class SchemaBuilder
{
    use \Tailor\Classes\SchemaBuilder\HasJoinTable;
    use \Tailor\Classes\SchemaBuilder\HasRepeaterTable;
    use \Tailor\Classes\SchemaBuilder\HasCommonColumns;
    use \Tailor\Classes\SchemaBuilder\HasStreamColumns;
    use \Tailor\Classes\SchemaBuilder\HasStructureColumns;
    use \Tailor\Classes\SchemaBuilder\HasTablePatches;

    /**
     * @var Blueprint blueprint
     */
    protected $blueprint;

    /**
     * @var Fieldset fields
     */
    protected $fieldset;

    /**
     * @var ContentSchema contentSchema
     */
    protected $contentSchema;

    /**
     * @var DbBlueprint tableBlueprint for managing the table
     */
    protected $tableBlueprint;

    /**
     * @var string tableName for the blueprint content
     */
    protected $tableName;

    /**
     * @var bool tableExists
     */
    protected $tableExists;

    /**
     * @var array tableColumns
     */
    protected $tableColumns;

    /**
     * @var int actionCount number of actions that occurred.
     */
    protected $actionCount = 0;

    /**
     * @var array reservedFieldNames are field names that cannot be used as database columns.
     * @see Tailor\Classes\FieldManager
     */
    protected $reservedFieldNames = [
        // Properties
        'attributes',

        // Columns
        'id',
        'site_id',
        'site_root_id',
        'title',
        'slug',
        'fullslug',
        'is_enabled',
        'created_user_id',
        'updated_user_id',
        'deleted_user_id',
        'deleted_at',
        'created_at',
        'parent_id',
        'relation_id',
        'relation_type',
        'field_name',
        'nest_left',
        'nest_right',
        'nest_depth',
        'blueprint_uuid',
        'is_version',
        'primary_id',
        'primary_attrs',
        'content_group',
        'draft_mode',
        'published_at',
        'expired_at',

        // Relations
        'primaryRecord',
        'drafts',
        'versions',
        'parent',
        'children',
    ];

    /**
     * migrateBlueprint
     */
    public static function migrateBlueprint(Blueprint $blueprint, Fieldset $fieldset)
    {
        $builder = new self;
        $builder->initBlueprint($blueprint, $fieldset);
        return $builder->migrate();
    }

    /**
     * initBlueprint
     */
    public function initBlueprint(Blueprint $blueprint, Fieldset $fieldset)
    {
        $this->fieldset = $fieldset;
        $this->blueprint = $blueprint;
        $this->tableName = $blueprint->getContentTableName();
        $this->tableBlueprint = $this->makeDatabaseBlueprint($fieldset);

        if (!$this->tableName) {
            throw new SystemException('Blueprint ['.get_class($blueprint).'] does not use a database table.');
        }

        $this->tableExists = Schema::hasTable($this->tableName);
        $this->tableColumns = $this->tableExists ? Schema::getColumnListing($this->tableName) : [];
    }

    /**
     * migrate
     */
    public function migrate()
    {
        $this->actionCount = 0;

        $this->migrateFields();
        $this->migrateJoins();
        $this->migrateRepeaters();
        $this->migrateTablePatches();

        if ($this->actionCount > 0) {
            $this->getContentSchema()->commitChanges();
        }

        return $this->actionCount;
    }

    /**
     * migrateFields
     */
    public function migrateFields()
    {
        $method = $this->tableExists ? 'table' : 'create';

        Schema::$method($this->tableName, function ($table) {
            $this->defineStartColumns($table);
            $this->defineVisibilityColumns($table);
            $this->defineDraftableColumns($table);
            $this->defineVersionableColumns($table);

            if ($this->blueprint instanceof StructureBlueprint) {
                $this->defineStructureColumns($table);
            }

            if ($this->blueprint instanceof StreamBlueprint) {
                $this->defineStreamColumns($table);
            }

            $this->defineFieldColumns($table);
            $this->defineEndColumns($table);

            // Increment actions
            if ($table->getColumns() || $table->getCommands()) {
                $this->defineTableComment($table);
                $this->actionCount++;
            }
        });
    }

    /**
     * defineTableComment adds a comment to the table to make it easier to find
     */
    protected function defineTableComment($table, $message = null)
    {
        if ($message === null) {
            $message = "Content for :name [:id].";
        }

        // Custom escaping since framework doesn't handle it
        $blueprintId = str_replace('\\', '\\\\', $this->blueprint->handle ?: $this->blueprint->uuid);

        $table->comment(__($message, [
            'name' => $this->blueprint->name ?: 'Blueprint',
            'id' => $blueprintId
        ]));
    }

    /**
     * makeDatabaseBlueprint
     */
    protected function makeDatabaseBlueprint($fieldset)
    {
        // Lazy load the grammar
        Db::connection()->getSchemaBuilder();

        $table = new DbBlueprint(Db::connection(), $this->tableName);

        foreach ($fieldset->getAllFields() as $name => $fieldObj) {
            if (!str_starts_with($name, '_')) {
                $fieldObj->extendDatabaseTable($table);
            }
        }

        return $table;
    }

    /**
     * getContentSchema
     */
    protected function getContentSchema()
    {
        if ($this->contentSchema !== null) {
            return $this->contentSchema;
        }

        $schema = ContentSchema::findRecord($this->tableName);
        $schema->setExistingColumns($this->tableColumns);
        $schema->proposeChanges($this->tableBlueprint);
        $schema->setLatestMeta($this->blueprint->getMetaData());

        return $this->contentSchema = $schema;
    }

    /**
     * defineFieldColumns
     */
    protected function defineFieldColumns($table)
    {
        $missingFields = $this->getContentSchema()->getMissingFields();

        foreach ($missingFields as $fieldName => $details) {
            // Never touch a reserved field
            if (in_array($fieldName, $this->reservedFieldNames)) {
                continue;
            }

            // Invalid field definition
            $columnType = $details['type'] ?? false;
            if (!$columnType) {
                continue;
            }

            $column = $table->$columnType($fieldName);

            // Assign allowable properties
            $allowedProps = ['unsigned', 'nullable'];
            foreach ($allowedProps as $prop) {
                if (!isset($details[$prop])) {
                    continue;
                }

                $column->$prop($details[$prop]);
            }
        }
    }

    /**
     * hasColumn
     */
    protected function hasColumn($column)
    {
        return in_array($column, $this->tableColumns);
    }
}
