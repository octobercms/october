<?php namespace Cms\Classes\EditorExtension;

use Lang;
use Cms\Classes\Lang as CmsLang;
use Cms\Classes\EditorExtension;
use Backend\VueComponents\DropdownMenu\ItemDefinition;
use Editor\Classes\NewDocumentDescription;

/**
 * HasExtensionLangsState adds language file state for the CMS Editor Extension
 */
trait HasExtensionLangsState
{
    /**
     * addLangsNavigatorNodes
     */
    protected function addLangsNavigatorNodes($theme, $rootNode)
    {
        $langs = CmsLang::listInTheme($theme);
        $langsNode = $rootNode->addNode(Lang::get('cms::lang.lang.editor_node_name'), EditorExtension::DOCUMENT_TYPE_LANG);
        $langsNode
            ->setSortBy('filename')
            ->setChildKeyPrefix(EditorExtension::DOCUMENT_TYPE_LANG.':')
        ;

        $langsNode->addRootMenuItem(
            ItemDefinition::TYPE_TEXT,
            Lang::get('cms::lang.lang.new'),
            'cms:create-document@'.EditorExtension::DOCUMENT_TYPE_LANG
        )->setIcon('icon-create');

        foreach ($langs as $langFile) {
            $langsNode
                ->addNode($langFile['filename'], $langFile['path'])
                ->setIcon(EditorExtension::ICON_COLOR_LANG, 'backend-icon-background entity-small cms-content')
                ->setUserData($langFile)
            ;
        }
    }

    /**
     * getCmsLangNewDocumentData
     */
    protected function getCmsLangNewDocumentData()
    {
        $description = new NewDocumentDescription(
            trans('cms::lang.lang.new'),
            $this->makeMetadataForNewTemplate(EditorExtension::DOCUMENT_TYPE_LANG)
        );

        $description->setIcon(EditorExtension::ICON_COLOR_LANG, 'backend-icon-background entity-small cms-content');
        $description->setInitialDocumentData([
            'fileName' => 'en.json',
            'content' => "{\n    \n}\n"
        ]);

        return $description;
    }

    /**
     * loadLangsForUiLists
     */
    protected function loadLangsForUiLists($theme, $user)
    {
        // Use lang list from Navigator
        if ($user->hasAnyAccess(['editor.cms_langs'])) {
            return [];
        }

        $result = [];

        $langs = CmsLang::listInTheme($theme);

        foreach ($langs as $lang) {
            $result[] = $lang['path'];
        }

        sort($result);

        return $result;
    }
}
