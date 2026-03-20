<?php namespace Tailor\Classes;

use Lang;
use BackendAuth;
use Editor\Classes\ExtensionBase;
use Backend\VueComponents\TreeView\SectionList;
use Backend\VueComponents\DropdownMenu\ItemDefinition;
use SystemException;

/**
 * EditorExtension adds Tailor objects to October Editor IDE
 */
class EditorExtension extends ExtensionBase
{
    use \Tailor\Classes\EditorExtension\HasExtensionState;
    use \Tailor\Classes\EditorExtension\HasExtensionCrud;

    const DOCUMENT_TYPE_BLUEPRINT = 'tailor-blueprint';
    const DOCUMENT_TYPE_THEME_BLUEPRINT = 'tailor-theme-blueprint';

    const ICON_COLOR_BLUEPRINT = '#1563B5';

    const DOCUMENT_TYPE_PERMISSIONS = [
        EditorExtension::DOCUMENT_TYPE_BLUEPRINT => ['editor.tailor_blueprints'],
        EditorExtension::DOCUMENT_TYPE_THEME_BLUEPRINT => ['editor.tailor_blueprints']
    ];

    /**
     * getNamespace returns unique extension namespace
     */
    public function getNamespace(): string
    {
        return 'tailor';
    }

    /**
     * getExtensionSortOrder affects the extension position in the Editor Navigator
     */
    public function getExtensionSortOrder()
    {
        return 20;
    }

    /**
     * Returns a list of JavaScript files required for the extension.
     * @return array Returns an associative array of JavaScript file paths and attributes.
     */
    public function listJsFiles()
    {
        return [
            '/modules/tailor/assets/js/tailor.editor.extension.js'
        ];
    }

    /**
     * getClientSideLangStrings returns a list of language strings required by the
     * client-side extension controller.
     * @return array
     */
    public function getClientSideLangStrings()
    {
        return [
            'tailor::lang.blueprint.saved',
            'tailor::lang.blueprint.reloaded',
            'tailor::lang.blueprint.deleted',
            'tailor::lang.blueprint.new',
            'tailor::lang.blueprint.create_directory',
            'tailor::lang.blueprint.rename',
            'tailor::lang.blueprint.delete',
            'tailor::lang.blueprint.editor_yaml',
            'tailor::lang.blueprint.upload_files',
            'tailor::lang.blueprint.migrating',
            'tailor::lang.blueprint.migrated',
            'backend::lang.form.save',
            'backend::lang.form.delete',
            'tailor::lang.blueprint.apply',
            'tailor::lang.blueprint.apply_tooltip',
            'tailor::lang.blueprint.mixin',
            'tailor::lang.blueprint.entry',
            'tailor::lang.blueprint.global',
            'tailor::lang.blueprint.stream',
            'tailor::lang.blueprint.single',
            'tailor::lang.blueprint.structure'
        ];
    }

    /**
     * Returns a list of Vue components required for the extension.
     * @return array Array of Vue component class names
     */
    public function listVueComponents()
    {
        return [
            // Important - load modules that use `define()` before Monaco. Monaco pollutes
            // the global space and breaks `define()`.
            // See https://github.com/microsoft/vscode-loader/issues/19#issuecomment-439810640
            //
            \Backend\VueComponents\RichEditorDocumentConnector::class,
            \Tailor\VueComponents\BlueprintEditor::class
        ];
    }

    /**
     * listNavigatorSections initializes extension's sidebar Navigator sections.
     */
    public function listNavigatorSections(SectionList $sectionList, $documentType = null)
    {
        $user = BackendAuth::getUser();

        $tailorSection = $sectionList->addSection(__("Tailor") . ' - ' . __("Blueprints"), 'tailor');
        $tailorSection->setHasApiMenuItems(true);
        $tailorSection->setUserDataElement('uniqueKey', 'tailor:root');

        $this->addSectionMenuItems($tailorSection);

        if (
            EditorExtension::hasAccessToDocType($user, self::DOCUMENT_TYPE_BLUEPRINT) &&
            (!$documentType || $documentType === self::DOCUMENT_TYPE_BLUEPRINT)
        ) {
            $this->addBlueprintsNavigatorNodes($tailorSection);
        }

        if (
            EditorExtension::hasAccessToDocType($user, self::DOCUMENT_TYPE_THEME_BLUEPRINT) &&
            (!$documentType || $documentType === self::DOCUMENT_TYPE_THEME_BLUEPRINT)
        ) {
            $this->addThemeBlueprintsNavigatorNodes($tailorSection);
        }
    }

    /**
     * getNewDocumentsData
     */
    public function getNewDocumentsData()
    {
        return [
            EditorExtension::DOCUMENT_TYPE_BLUEPRINT => $this->getTailorBlueprintNewDocumentData(),
            EditorExtension::DOCUMENT_TYPE_THEME_BLUEPRINT => $this->getTailorThemeBlueprintNewDocumentData()
        ];
    }

    /**
     * hasAccessToDocType
     */
    public static function hasAccessToDocType($user, $documentType)
    {
        if (!array_key_exists($documentType, EditorExtension::DOCUMENT_TYPE_PERMISSIONS)) {
            throw new SystemException(sprintf('Unknown document type: %s', $documentType));
        }

        return $user->hasAnyAccess(EditorExtension::DOCUMENT_TYPE_PERMISSIONS[$documentType]);
    }

    /**
     * getCustomData returns custom state data required for the extension client-side controller
     */
    public function getCustomData(): array
    {
        return [
            'blueprintTemplates' => [
                'entry' => $this->getBlueprintTemplate('entry'),
                'single' => $this->getBlueprintTemplate('single'),
                'stream' => $this->getBlueprintTemplate('stream'),
                'structure' => $this->getBlueprintTemplate('structure'),
                'mixin' => $this->getBlueprintTemplate('mixin'),
                'global' => $this->getBlueprintTemplate('global'),
            ]
        ];
    }

    /**
     * getBlueprintTemplate
     */
    protected function getBlueprintTemplate($type)
    {
        $path = __DIR__.'/editorextension/templates/'.$type.'.yaml';
        if (!is_file($path)) {
            return;
        }

        return file_get_contents($path);
    }

    /**
     * addSectionMenuItems
     */
    protected function addSectionMenuItems($section)
    {
        $user = BackendAuth::getUser();

        $section->addMenuItem(ItemDefinition::TYPE_TEXT, Lang::get('tailor::lang.editor.refresh'), 'tailor:refresh-navigator')
            ->setIcon('icon-refresh');

        $createMenuItem = new ItemDefinition(ItemDefinition::TYPE_TEXT, Lang::get('tailor::lang.editor.create'), 'tailor:create');
        $createMenuItem->setIcon('icon-create');

        $menuConfiguration = [
            [
                'label' => __("App Blueprint"),
                'permission' => 'editor.tailor_blueprints',
                'document' => EditorExtension::DOCUMENT_TYPE_BLUEPRINT
            ],
            [
                'label' => __("Theme Blueprint"),
                'permission' => 'editor.tailor_blueprints',
                'document' => EditorExtension::DOCUMENT_TYPE_THEME_BLUEPRINT
            ]
        ];

        foreach ($menuConfiguration as $itemConfig) {
            $permission = $itemConfig['permission'];
            if (!$user->hasAnyAccess([$permission])) {
                continue;
            }

            $createMenuItem->addItemObject(
                $section->addCreateMenuItem(
                    ItemDefinition::TYPE_TEXT,
                    Lang::get($itemConfig['label']),
                    'tailor:create-document@'.$itemConfig['document']
                )
            );
        }

        if ($createMenuItem->hasItems()) {
            $section->addMenuItemObject($createMenuItem);
        }
    }
}
