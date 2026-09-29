<?php

use Backend\Models\UserRole;
use Backend\Widgets\ListStructure;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Facade;

class ListStructureWidgetTest extends PluginTestCase
{
    public function testReferencePoolIsReadFromConfig()
    {
        $widget = $this->makeRoleStructureWidget(true);

        $this->assertTrue($widget->includeReferencePool);
    }

    public function testReorderWithReferencePoolKeepsExistingRanks()
    {
        $roles = [];
        foreach (['alpha' => 10, 'bravo' => 20, 'charlie' => 30, 'delta' => 40] as $code => $rank) {
            $role = UserRole::create(['name' => ucfirst($code), 'code' => 'test-'.$code]);
            UserRole::where('id', $role->id)->update(['sort_order' => $rank]);
            $roles[$code] = $role->id;
        }

        $widget = $this->makeRoleStructureWidget(true);
        $this->app->instance('request', HttpRequest::create('/', 'POST', [
            'sort_orders' => [$roles['charlie'], $roles['bravo']]
        ]));
        Facade::clearResolvedInstance('request');

        $item = UserRole::find($roles['charlie']);
        self::callProtectedMethod($widget, 'reorderForItem', [$item]);

        $ranks = UserRole::whereIn('id', $roles)->pluck('sort_order', 'id')->all();

        $this->assertEquals(10, $ranks[$roles['alpha']]);
        $this->assertEquals(20, $ranks[$roles['charlie']]);
        $this->assertEquals(30, $ranks[$roles['bravo']]);
        $this->assertEquals(40, $ranks[$roles['delta']]);
    }

    protected function makeRoleStructureWidget(bool $includeReferencePool): ListStructure
    {
        return new ListStructure(null, [
            'model' => new UserRole,
            'arrayName' => 'array',
            'showTree' => false,
            'maxDepth' => 1,
            'includeReferencePool' => $includeReferencePool,
            'columns' => [
                'name' => [
                    'type' => 'text',
                    'label' => 'Name'
                ]
            ]
        ]);
    }
}
