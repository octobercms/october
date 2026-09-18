<?php

use Backend\Widgets\Form;
use October\Rain\Database\Model;

/**
 * RepeaterJsonModel is a plain jsonable-backed model (the OP scenario: a repeater
 * saved to a JSON column, not a Tailor relation).
 */
class RepeaterJsonModel extends Model
{
    public $table = 'repeater_json_model';

    protected $jsonable = ['data'];

    protected $fillable = ['data'];

    public $timestamps = false;
}

/**
 * RepeaterJsonStoreTest reproduces forum #202: nested JSON repeaters swapping /
 * blanking / duplicating sibling values, especially after deleting an item and
 * saving again. Maintainer noted a fix in v4.0.21 (commit f9d163985).
 */
class RepeaterJsonStoreTest extends PluginTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        if (!Schema::hasTable('repeater_json_model')) {
            Schema::create('repeater_json_model', function ($table) {
                $table->increments('id');
                $table->mediumText('data')->nullable();
            });
        }
    }

    public function tearDown(): void
    {
        Schema::dropIfExists('repeater_json_model');

        parent::tearDown();
    }

    protected function makeRepeater($value = null)
    {
        $model = new RepeaterJsonModel;
        if ($value !== null) {
            $model->data = $value;
        }

        $controller = new \Backend\Classes\Controller;

        $form = new Form($controller, [
            'model' => $model,
            'arrayName' => 'RepeaterJsonModel',
            'fields' => [
                'data' => [
                    'type' => 'repeater',
                    'form' => [
                        'fields' => [
                            'title' => ['type' => 'text'],
                            'children' => [
                                'type' => 'repeater',
                                'form' => [
                                    'fields' => [
                                        'body' => ['type' => 'text'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        $form->bindToController();
        self::callProtectedMethod($form, 'defineFormFields');

        return [$model, $form, $form->getFormWidget('data')];
    }

    /**
     * swapPost replaces the request instance so post() reads the given data.
     */
    protected function swapPost(array $data): void
    {
        $request = \Illuminate\Http\Request::create('/', 'POST', $data);
        app()->instance('request', $request);
        \Illuminate\Support\Facades\Facade::clearResolvedInstance('request');
    }

    /**
     * getData runs the widget save cycle for the given posted repeater value and
     * returns the resulting saved array.
     */
    protected function saveValue($repeater, array $postedRepeaterValue): array
    {
        $this->swapPost(['RepeaterJsonModel' => ['data' => $postedRepeaterValue]]);

        return (array) $repeater->getSaveValue($postedRepeaterValue);
    }

    /**
     * testNestedSiblingsAfterDeletingMiddle reproduces the OP: three nested items,
     * delete the middle one, and the survivors must keep their exact values.
     */
    public function testNestedSiblingsAfterDeletingMiddle()
    {
        // Existing saved state: one outer item holding three inner children
        $saved = [
            [
                'title' => 'Outer',
                'children' => [
                    ['body' => 'ALPHA'],
                    ['body' => 'BRAVO'],
                    ['body' => 'CHARLIE'],
                ],
            ],
        ];

        [$model, $form, $repeater] = $this->makeRepeater($saved);

        // Simulate the postback after deleting the MIDDLE inner child (BRAVO).
        // The DOM keeps original indexes: outer[0], inner children 0 and 2 remain.
        $posted = [
            0 => [
                '_index' => 0,
                'title' => 'Outer',
                'children' => [
                    0 => ['_index' => 0, 'body' => 'ALPHA'],
                    2 => ['_index' => 2, 'body' => 'CHARLIE'],
                ],
            ],
        ];

        $result = $this->saveValue($repeater, $posted);

        $children = array_column($result[0]['children'] ?? [], 'body');
        $this->assertEquals(['ALPHA', 'CHARLIE'], $children);
    }

    /**
     * testTwoOuterItemsWithNestedChildrenNoSwap covers the "values go to a
     * neighboring repeater" symptom: two outer items each with nested children,
     * after deleting a child in the first, nothing should leak between outer items.
     */
    public function testTwoOuterItemsWithNestedChildrenNoSwap()
    {
        $saved = [
            ['title' => 'First', 'children' => [
                ['body' => 'A1'], ['body' => 'A2'], ['body' => 'A3'],
            ]],
            ['title' => 'Second', 'children' => [
                ['body' => 'B1'], ['body' => 'B2'],
            ]],
        ];

        [$model, $form, $repeater] = $this->makeRepeater($saved);

        // Delete the middle child (A2) of the FIRST outer item; keep everything else
        $posted = [
            0 => ['_index' => 0, 'title' => 'First', 'children' => [
                0 => ['_index' => 0, 'body' => 'A1'],
                2 => ['_index' => 2, 'body' => 'A3'],
            ]],
            1 => ['_index' => 1, 'title' => 'Second', 'children' => [
                0 => ['_index' => 0, 'body' => 'B1'],
                1 => ['_index' => 1, 'body' => 'B2'],
            ]],
        ];

        $result = $this->saveValue($repeater, $posted);

        $this->assertEquals('First', $result[0]['title']);
        $this->assertEquals('Second', $result[1]['title']);
        $this->assertEquals(['A1', 'A3'], array_column($result[0]['children'], 'body'));
        $this->assertEquals(['B1', 'B2'], array_column($result[1]['children'], 'body'));
    }

    /**
     * testNextIndexUsesPostStateAfterDelete locks in the v4.0.21 fix (f9d163985):
     * after deleting an item, adding a new one must derive its index from the
     * current post state (with the deleted item gone), not the stale loaded value.
     * A stale index would let the new item bind to a neighbor's data (the swap).
     */
    public function testNextIndexUsesPostStateAfterDelete()
    {
        // Saved DB value has three items [0,1,2]
        $saved = [
            ['title' => 'Zero'],
            ['title' => 'One'],
            ['title' => 'Two'],
        ];

        [$model, $form, $repeater] = $this->makeRepeater($saved);

        // Post reflects the LAST item (index 2) deleted client-side: only [0,1]
        // remain. Stale getLoadValue() would give max([0,1,2])+1 = 3, but the
        // correct next index from post state max([0,1])+1 = 2.
        $this->swapPost([
            'RepeaterJsonModel' => ['data' => [
                0 => ['_index' => 0, 'title' => 'Zero'],
                1 => ['_index' => 1, 'title' => 'One'],
            ]],
            $repeater->alias . '_loaded' => '1',
        ]);

        $next = self::callProtectedMethod($repeater, 'getNextIndex');

        // Must reflect current post state (max 1 -> 2), not the stale loaded value (3)
        $this->assertSame(2, $next);
    }
}
