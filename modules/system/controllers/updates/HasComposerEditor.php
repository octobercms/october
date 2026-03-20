<?php namespace System\Controllers\Updates;

use File;
use Flash;
use ValidationException;

/**
 * HasComposerEditor contains logic for editing the composer.json file
 */
trait HasComposerEditor
{
    /**
     * manage_onLoadComposerForm displays the composer.json editor popup
     */
    public function manage_onLoadComposerForm()
    {
        $composerFile = base_path('composer.json');

        $widget = $this->makeComposerFormWidget();
        $widget->getField('content')->value(File::get($composerFile));

        $this->vars['widget'] = $widget;

        return $this->makePartial('composer_form');
    }

    /**
     * manage_onSaveComposer validates and saves the composer.json file
     */
    public function manage_onSaveComposer()
    {
        $content = post('Composer')['content'] ?? '';

        try {
            json_decode($content, flags: JSON_THROW_ON_ERROR);
        }
        catch (\JsonException $ex) {
            throw new ValidationException(['content' => __("Invalid JSON: :error", [
                'error' => $ex->getMessage()
            ])]);
        }

        File::put(base_path('composer.json'), $content);

        Flash::success(__("Composer file updated successfully."));
    }

    /**
     * makeComposerFormWidget creates a form widget for the composer editor
     */
    protected function makeComposerFormWidget()
    {
        $config = $this->makeConfig([
            'alias' => 'formComposerEditor',
            'arrayName' => 'Composer',
            'model' => new \Model,
            'fields' => [
                'content' => [
                    'type' => 'codeeditor',
                    'language' => 'json',
                    'size' => 'giant',
                    'stretch' => true,
                ]
            ]
        ]);

        $widget = $this->makeWidget(\Backend\Widgets\Form::class, $config);
        $widget->bindToController();

        return $widget;
    }
}
