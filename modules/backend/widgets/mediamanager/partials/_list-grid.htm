<?php
    $listElementId = $this->getId('item-list');
?>

<table class="table data">
    <col />
    <col width="130px" />
    <col width="130px" />

    <tbody class="icons clickable">
        <?php if (count($items) > 0 || !$isRootFolder): ?>
            <?php if (!$isRootFolder && !$searchMode): ?>
                <tr data-type="media-item" data-item-type="folder" data-root data-path="<?= e(dirname($currentFolder)) ?>" tabindex="0">
                    <td><i class="icon-folder"></i>..</td>
                    <td></td>
                    <td></td>
                </tr>
            <?php endif ?>

            <?php foreach ($items as $item):
                $itemType = $item->getFileType();
            ?>
                <tr data-type="media-item"
                    data-item-type="<?= $item->type ?>"
                    data-path="<?= e($item->path) ?>"
                    data-title="<?= e(basename($item->path)) ?>"
                    data-size="<?= e($item->sizeToString()) ?>"
                    data-last-modified="<?= e($item->lastModifiedAsString()) ?>"
                    data-last-modified-ts="<?= $item->lastModified ?>"
                    data-public-url="<?= e($item->publicUrl) ?>"
                    data-document-type="<?= e($itemType) ?>"
                    data-folder="<?= e(dirname($item->path)) ?>"
                    tabindex="0"
                >
                    <td>
                        <div class="item-title no-wrap-text">
                            <i class="<?= $this->itemTypeToIconClass($item, $itemType) ?>"></i> <?= e(basename($item->path)) ?>

                            <?php if (!$this->readOnly) : ?>
                                <a
                                    href="#"
                                    data-rename
                                    data-control="popup"
                                    data-request-data="path: '<?= e($item->path) ?>', listId: '<?= $listElementId ?>', type: '<?= $item->type ?>'"
                                    data-handler="<?= $this->getEventHandler('onLoadRenamePopup') ?>"
                                    data-z-index="1200"
                                ><i data-rename-control class="icon-terminal"></i></a>
                            <?php endif; ?>
                        </div>
                    </td>
                    <td><?= e($item->sizeToString()) ?></td>
                    <td><?= e($item->lastModifiedAsString()) ?></td>
                    <?php if ($searchMode): ?>
                        <td title="<?= e(dirname($item->path)) ?>">
                            <div class="no-wrap-text"><?= e(dirname($item->path)) ?></div>
                        </td>
                    <?php endif ?>
                </tr>
            <?php endforeach ?>
        <?php endif ?>
    </tbody>
</table>

<?php if (count($items) == 0 && $searchMode): ?>
    <p class="no-data">
        <?= e(trans('backend::lang.media.no_files_found')) ?>
    </p>
<?php endif ?>
