<?php namespace Tailor\Classes\SchemaBuilder;

use Site;
use Schema;
use Tailor\Classes\Blueprint\EntryBlueprint;
use Tailor\Classes\Blueprint\StructureBlueprint;
use Tailor\Models\StructureRecord;
use Tailor\Models\EntryRecord;
use Exception;

/**
 * HasTablePatches
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasTablePatches
{
    /**
     * migrateTablePatches when certain conditions change
     */
    protected function migrateTablePatches()
    {
        $this->migrateRenameColumns();
        $this->migrateDropColumns();
        $this->migrateMetaData();

        $this->patchTableWhenBlueprintBecomesStructure();
        $this->patchTableWhenBlueprintBecomesMultisite();
    }

    /**
     * migrateRenameColumns
     */
    protected function migrateRenameColumns()
    {
        $schemaObj = $this->getContentSchema();
        $changedFields = $schemaObj->getChangedFields();

        foreach ($changedFields as $fieldName => $details) {
            // Never touch a reserved field
            if (in_array($fieldName, $this->reservedFieldNames)) {
                continue;
            }

            $wantType = $details['type'] ?? null;
            if (!$wantType) {
                continue;
            }

            try {
                Schema::table($this->tableName, function($table) use ($fieldName, $wantType) {
                    $table->$wantType($fieldName)->nullable()->change();
                });
            }
            catch (Exception $ex) {
                $droppedName = 'x_'.$fieldName.'_'.hash('crc32', str_random());

                Schema::table($this->tableName, function($table) use ($fieldName, $droppedName) {
                    $table->renameColumn($fieldName, $droppedName);
                });

                Schema::table($this->tableName, function($table) use ($fieldName, $wantType) {
                    $table->$wantType($fieldName)->nullable();
                });

                $schemaObj->setDroppedColumn($fieldName, $droppedName, true);
            }

            $this->actionCount++;
        }
    }

    /**
     * migrateDropColumns
     */
    protected function migrateDropColumns()
    {
        $schemaObj = $this->getContentSchema();
        $droppedFields = $schemaObj->getDroppedFields();

        foreach ($droppedFields as $fieldName => $details) {
            // Never touch a reserved field
            if (in_array($fieldName, $this->reservedFieldNames)) {
                continue;
            }

            if (!$this->hasColumn($fieldName)) {
                continue;
            }

            $droppedName = 'x_'.$fieldName.'_'.hash('crc32', str_random());

            Schema::table($this->tableName, function($table) use ($fieldName, $droppedName) {
                $table->renameColumn($fieldName, $droppedName);
            });

            $schemaObj->setDroppedColumn($fieldName, $droppedName);

            $this->actionCount++;
        }
    }

    /**
     * migrateMetaData
     */
    protected function migrateMetaData()
    {
        if ($this->getContentSchema()->isMetaDirty()) {
            $this->actionCount++;
        }
    }

    /**
     * patchTableWhenBlueprintBecomesStructure
     */
    protected function patchTableWhenBlueprintBecomesStructure()
    {
        // Targeting structures
        if (!$this->blueprint instanceof StructureBlueprint) {
            return;
        }

        $schemaObj = $this->getContentSchema();

        // Nothing changed
        if (!$schemaObj->isMetaDirty('blueprint_type')) {
            return;
        }

        // Temporary patch to set the meta without doing the repair
        // @deprecated this can be removed if year >= 2024
        if ($schemaObj->getMetaData('blueprint_type') === null) {
            return;
        }

        // Reset the nested tree nesting columns
        StructureRecord::inSectionUuid($this->blueprint->uuid)->resetTreeNesting();
    }

    /**
     * patchTableWhenBlueprintBecomesMultisite
     */
    protected function patchTableWhenBlueprintBecomesMultisite()
    {
        // Targeting structures
        if (!$this->blueprint instanceof EntryBlueprint) {
            return;
        }

        if (!$this->blueprint->useMultisiteSync()) {
            return;
        }

        $schemaObj = $this->getContentSchema();

        // Nothing changed
        if (!$schemaObj->isMetaDirty('multisite_sync')) {
            return;
        }

        EntryRecord::inSectionUuid($this->blueprint->uuid)->chunkById(100, function($records) {
            foreach ($records as $record) {
                foreach ($record->getMultisiteSyncSites() as $siteId) {
                    // Context for nested trees and others
                    Site::withContext($siteId, function() use ($record, $siteId) {
                        // Context for relational data availability
                        Site::withGlobalContext(function() use ($record, $siteId) {
                            $record->propagateToSite($siteId);
                        });
                    });
                }
            }
        });
    }
}
