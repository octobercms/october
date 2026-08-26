<?php namespace Tailor\Components;

use Tailor\Classes\ComponentVariable;
use Tailor\Classes\BlueprintIndexer;
use Tailor\Models\EntryRecord;
use Cms\Classes\ComponentModuleBase;

/**
 * CollectionComponent displays a collection of records.
 */
class CollectionComponent extends ComponentModuleBase
{
    /**
     * @var array implement extensions
     */
    public $implement = [
        \Cms\Behaviors\ListComponent::class,
    ];

    /**
     * componentDetails
     */
    public function componentDetails()
    {
        return [
            'name' => 'Collection',
            'description' => 'Displays a collection of entries.',
            'icon' => 'icon-clone'
        ];
    }

    /**
     * defineProperties
     */
    public function defineProperties()
    {
        return [
            'handle' => [
                'title' => 'Handle',
                'type' => 'dropdown',
                'showExternalParam' => false
            ],
            'recordsPerPage' => [
                'title' => 'Records Per Page',
                'description' => 'Number of records to display on a single page. Leave empty to disable pagination.',
                'type' => 'string',
                'validationPattern' => '^[0-9]*$',
                'validationMessage' => 'Invalid format of the records per page value. The value should be a number.',
                'group' => 'Pagination'
            ],
            'pageNumber' => [
                'title' => 'Page Number',
                'description' => 'This value is used to determine what page the user is on.',
                'type' => 'string',
                'group' => 'Pagination'
            ],
            'sortColumn' => [
                'title' => 'Sort by Column',
                'description' => 'Model column the records should be ordered by',
                'type' => 'autocomplete',
                'group' => 'Sorting',
                'showExternalParam' => false
            ],
            'sortDirection' => [
                'title' => 'Direction',
                'type' => 'dropdown',
                'showExternalParam' => false,
                'group' => 'Sorting',
                'options' => [
                    'asc' => 'Ascending',
                    'desc' => 'Descending'
                ]
            ]
        ];
    }

    /**
     * makePrimaryAccessor returns the PHP object variable for the Twig view layer.
     */
    public function makePrimaryAccessor()
    {
        return new ComponentVariable($this);
    }

    /**
     * getHandleOptions
     */
    public function getHandleOptions()
    {
        $blueprints = BlueprintIndexer::instance()->listSections();

        $result = [];
        foreach ($blueprints as $bp) {
            $result[$bp->handle] = $bp->name . ' ('.$bp->handle.')';
        }

        return $result;
    }

    /**
     * listCreateQuery returns the base query for the ListComponent behavior
     */
    public function listCreateQuery()
    {
        $handle = $this->property('handle');

        return EntryRecord::inSection($handle)->applyVisibleFrontend();
    }

    /**
     * getPrimaryRecordResult extends the behavior to support structure (nested tree)
     */
    public function getPrimaryRecordResult()
    {
        $query = $this->getPrimaryRecordQuery();
        $sortColumn = $this->property('sortColumn');

        if ($sortColumn) {
            $query = $query->orderBy($sortColumn, $this->property('sortDirection') ?: 'desc');
        }

        // Return pagination
        if ($recordsPerPage = $this->property('recordsPerPage')) {
            return $query->paginateAtPage($recordsPerPage, $this->property('pageNumber'));
        }

        // Return structure
        if (!$sortColumn && $query->getModel()->isEntryStructure()) {
            return $query->getNested();
        }

        // Return collection
        return $query->get();
    }
}
