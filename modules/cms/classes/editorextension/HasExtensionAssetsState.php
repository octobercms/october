<?php namespace Cms\Classes\EditorExtension;

use Url;
use Lang;
use Cms\Classes\Asset;
use Cms\Classes\ThemeFiles;
use Cms\Classes\EditorExtension;
use Backend\VueComponents\TreeView\NodeDefinition;
use Backend\VueComponents\DropdownMenu\ItemDefinition;
use October\Rain\Filesystem\Definitions as FileDefinitions;
use Editor\Classes\NewDocumentDescription;

/**
 * HasExtensionAssetsState assets state for the CMS Editor Extension
 */
trait HasExtensionAssetsState
{
    /**
     * addAssetsNavigatorNodes
     */
    protected function addAssetsNavigatorNodes($theme, $rootNode)
    {
        $assetsNode = $rootNode->addNode(Lang::get('cms::lang.asset.editor_node_name'), EditorExtension::DOCUMENT_TYPE_ASSET);
        $assetsNode
            ->setSortBy('isFolder:desc,filename')
            ->setDragAndDropMode([NodeDefinition::DND_MOVE, NodeDefinition::DND_CUSTOM_EXTERNAL])
            ->setDisplayMode(NodeDefinition::DISPLAY_MODE_TREE)
            ->setChildKeyPrefix(EditorExtension::DOCUMENT_TYPE_ASSET.':')
            ->setMultiSelect(true)
            ->setUserData([
                'path' => '/'
            ])
        ;

        $assetsNode->addRootMenuItem(
            ItemDefinition::TYPE_TEXT,
            Lang::get('cms::lang.asset.new'),
            'cms:create-document@'.EditorExtension::DOCUMENT_TYPE_ASSET
        )->setIcon('icon-create');

        $assetsNode->addRootMenuItem(
            ItemDefinition::TYPE_TEXT,
            Lang::get('cms::lang.asset.upload_files'),
            'cms:cms-asset-upload@'.EditorExtension::DOCUMENT_TYPE_ASSET
        )->setIcon('icon-upload');

        $assetsNode->addRootMenuItem(
            ItemDefinition::TYPE_TEXT,
            Lang::get('cms::lang.asset.create_directory'),
            'cms:cms-asset-create-directory'
        )->setIcon('icon-folder');

        $this->addDirectoryAssetsNodes('', $assetsNode, $theme);
    }

    /**
     * addDirectoryAssetsNodes
     */
    protected function addDirectoryAssetsNodes(string $path, $parentNode, $theme)
    {
        $assets = Asset::listInTheme($theme, [
            'recursive' => false,
            'filterPath' => $path
        ]);

        foreach ($assets as $asset) {
            if (!$asset['isEditable'] && !$asset['isFolder']) {
                $themeRelativePath = 'assets/'.$asset['path'];
                if (ThemeFiles::isStoredFile($theme, $themeRelativePath)) {
                    $asset['url'] = ThemeFiles::getPublicUrl($theme, $themeRelativePath);
                }
                else {
                    $asset['url'] = Url::to('themes/'.$theme->getDirName().'/assets/'.$asset['path']);
                }
            }

            $node = $parentNode
                ->addNode($asset['filename'], $asset['path'])
                ->setHasApiMenuItems(true)
                ->setUserData($asset)
            ;

            if ($asset['isFolder']) {
                $node->setFolderIcon();
                $innerPath = $path ? $path.'/'.$asset['filename'] : $asset['filename'];
                $this->addDirectoryAssetsNodes($innerPath, $node, $theme);
            }
            else {
                $node->setHideInQuickAccess(!$asset['isEditable']);
                $node->setNoMoveDrop(true);
                $node->setIcon(EditorExtension::ICON_COLOR_ASSET, 'backend-icon-background entity-small cms-asset');
            }
        }
    }

    /**
     * getCmsAssetNewDocumentData
     */
    protected function getCmsAssetNewDocumentData()
    {
        $description = new NewDocumentDescription(
            trans('cms::lang.asset.new'),
            $this->makeMetadataForNewTemplate(EditorExtension::DOCUMENT_TYPE_ASSET)
        );

        $description->setIcon(EditorExtension::ICON_COLOR_ASSET, 'backend-icon-background entity-small cms-asset');
        $description->setInitialDocumentData([
            'fileName' => 'new-asset-file.js',
            'content' => ''
        ]);

        return $description;
    }

    /**
     * getAssetExtensionListInitialState
     */
    protected function getAssetExtensionListInitialState()
    {
        $extensions = FileDefinitions::get('asset_extensions');

        $result = [];
        foreach ($extensions as $extension) {
            if (preg_match('/^[0-9a-z]+$/i', $extension)) {
                $result[] = '.'.$extension;
            }
        }

        return implode(',', $result);
    }

    /**
     * loadAssetsForUiLists
     */
    protected function loadAssetsForUiLists($theme, $user)
    {
        // Use asset list from Navigator
        if ($user->hasAnyAccess(['editor.cms_assets'])) {
            return [];
        }

        $result = [];

        $assets = Asset::listInTheme($theme, [
            'filterFiles' => true,
            'flatten' => true
        ]);

        foreach ($assets as $asset) {
            $result[] = $asset['path'];
        }

        sort($result);

        return $result;
    }
}
