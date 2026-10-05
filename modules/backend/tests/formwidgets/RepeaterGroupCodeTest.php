<?php

use Backend\Widgets\Form;
use October\Rain\Database\Model;

/**
 * RepeaterGroupCodeModel is a plain model holding grouped repeater data in memory.
 */
class RepeaterGroupCodeModel extends Model
{
    protected $jsonable = ['data'];

    protected $fillable = ['data'];

    public $timestamps = false;
}

/**
 * RepeaterGroupCodeTest covers group code escaping and read-only handlers in the repeater widget.
 */
class RepeaterGroupCodeTest extends PluginTestCase
{
    /**
     * makeRepeater returns the model, form and grouped repeater widget.
     */
    protected function makeRepeater($value = null, array $fieldConfig = []): array
    {
        $model = new RepeaterGroupCodeModel;
        if ($value !== null) {
            $model->data = $value;
        }

        $form = new Form(new \Backend\Classes\Controller, [
            'model' => $model,
            'arrayName' => 'RepeaterGroupCodeModel',
            'fields' => [
                'data' => $fieldConfig + [
                    'type' => 'repeater',
                    'groups' => [
                        'text_block' => [
                            'name' => 'Text',
                            'fields' => [
                                'title' => ['type' => 'text'],
                            ],
                        ],
                        'quote_block' => [
                            'name' => 'Quote',
                            'fields' => [
                                'quote' => ['type' => 'text'],
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

    public function testStoredGroupCodeIsEscapedWhenRendered()
    {
        $payload = '"><svg onload="alert(1)"></svg>';

        [$model, $form, $repeater] = $this->makeRepeater([
            ['_group' => $payload, 'title' => 'Hello'],
        ]);

        $html = $repeater->render();

        $this->assertStringNotContainsString('<svg', $html);
        $this->assertStringContainsString('data-repeater-group="&quot;&gt;&lt;svg', $html);
        $this->assertStringContainsString('[_group]" value="&quot;&gt;&lt;svg', $html);
    }

    public function testAddItemIsForbiddenInPreviewMode()
    {
        [$model, $form, $repeater] = $this->makeRepeater(null, ['disabled' => true]);

        $this->assertTrue($repeater->previewMode);

        $this->expectException(ForbiddenException::class);
        $repeater->onAddItem();
    }

    public function testDuplicateItemIsForbiddenInPreviewMode()
    {
        [$model, $form, $repeater] = $this->makeRepeater([
            ['_group' => 'text_block', 'title' => 'Hello'],
        ], ['disabled' => true]);

        $this->swapPost(['_repeater_index' => 0, '_repeater_group' => 'text_block']);

        $this->expectException(ForbiddenException::class);
        $repeater->onDuplicateItem();
    }
}
