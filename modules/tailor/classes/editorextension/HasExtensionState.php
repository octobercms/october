<?php namespace Tailor\Classes\EditorExtension;

use System;
use Cms\Classes\Theme;
use Tailor\Classes\Blueprint;
use Tailor\Classes\EditorExtension;
use Backend\VueComponents\TreeView\NodeDefinition;
use Editor\Classes\NewDocumentDescription;

/**
 * HasExtensionState initializes state for the Tailor Editor Extension
 */
trait HasExtensionState
{
    /**
     * getTailorBlueprintNewDocumentData
     */
    private function getTailorBlueprintNewDocumentData()
    {
        $description = new NewDocumentDescription(
            trans('tailor::lang.blueprint.new'),
            $this->makeMetadataForNewTemplate(EditorExtension::DOCUMENT_TYPE_BLUEPRINT)
        );

        $description->setIcon(EditorExtension::ICON_COLOR_BLUEPRINT, 'backend-icon-background entity-small tailor-blueprint');
        $description->setInitialDocumentData([
            'fileName' => 'new-blueprint.yaml',
            'content' => $this->getBlueprintTemplate('entry')
        ]);

        return $description;
    }

    /**
     * addBlueprintsNavigatorNodes
     */
    protected function addBlueprintsNavigatorNodes($rootNode)
    {
        $blueprintsNode = $rootNode->addNode(__("App"), EditorExtension::DOCUMENT_TYPE_BLUEPRINT);
        $blueprintsNode
            ->setSortBy('isFolder:desc,fileName')
            ->setDragAndDropMode([NodeDefinition::DND_MOVE, NodeDefinition::DND_CUSTOM_EXTERNAL])
            ->setDisplayMode(NodeDefinition::DISPLAY_MODE_TREE)
            ->setChildKeyPrefix(EditorExtension::DOCUMENT_TYPE_BLUEPRINT.':')
            ->setMultiSelect(true)
            ->setHasApiMenuItems(true)
            ->setUserData([
                'path' => '/',
                'topLevel' => true
            ])
        ;

        $this->addDirectoryBlueprintNodes('', $blueprintsNode);
    }

    /**
     * getTailorThemeBlueprintNewDocumentData
     */
    private function getTailorThemeBlueprintNewDocumentData()
    {
        $description = new NewDocumentDescription(
            trans('tailor::lang.blueprint.new'),
            $this->makeMetadataForNewTemplate(EditorExtension::DOCUMENT_TYPE_THEME_BLUEPRINT)
        );

        $description->setIcon(EditorExtension::ICON_COLOR_BLUEPRINT, 'backend-icon-background entity-small tailor-blueprint');
        $description->setInitialDocumentData([
            'fileName' => 'new-blueprint.yaml',
            'content' => $this->getBlueprintTemplate('entry')
        ]);

        return $description;
    }

    /**
     * addBlueprintsNavigatorNodes
     */
    protected function addThemeBlueprintsNavigatorNodes($rootNode)
    {
        if (!System::hasModule('Cms')) {
            return;
        }

        $blueprintsNode = $rootNode->addNode(__("Theme"), EditorExtension::DOCUMENT_TYPE_THEME_BLUEPRINT);
        $blueprintsNode
            ->setSortBy('isFolder:desc,fileName')
            ->setDragAndDropMode([NodeDefinition::DND_MOVE, NodeDefinition::DND_CUSTOM_EXTERNAL])
            ->setDisplayMode(NodeDefinition::DISPLAY_MODE_TREE)
            ->setChildKeyPrefix(EditorExtension::DOCUMENT_TYPE_THEME_BLUEPRINT.':')
            ->setMultiSelect(true)
            ->setHasApiMenuItems(true)
            ->setUserData([
                'path' => '/',
                'topLevel' => true
            ])
        ;

        $this->addDirectoryBlueprintNodes('', $blueprintsNode, true);
    }

    /**
     * addDirectoryBlueprintNodes
     */
    protected function addDirectoryBlueprintNodes(string $path, $parentNode, $isTheme = false)
    {
        $blueprints = new Blueprint;
        if ($isTheme) {
            $theme = Theme::getEditTheme() ?: Theme::getActiveTheme();
            if (!$theme) {
                return;
            }

            $blueprints = Blueprint::inDatasource($theme->getPath() . '/blueprints', $theme->getDirName());
        }

        $blueprints = $blueprints->get([
            'recursive' => false,
            'filterPath' => $path
        ]);

        foreach ($blueprints as $blueprint) {
            $node = $parentNode
                ->addNode($blueprint['fileName'], $blueprint['path'])
                ->setHasApiMenuItems(true)
                ->setUserData($blueprint)
            ;

            if ($blueprint['isFolder']) {
                $node->setFolderIcon();
                $innerPath = $path ? $path.'/'.$blueprint['fileName'] : $blueprint['fileName'];
                $this->addDirectoryBlueprintNodes($innerPath, $node, $isTheme);
            }
            else {
                $node->setHideInQuickAccess(!$blueprint['isEditable']);
                $node->setNoMoveDrop(true);
                $node->setIcon(EditorExtension::ICON_COLOR_BLUEPRINT, 'backend-icon-background entity-small tailor-blueprint');
            }
        }
    }
}
