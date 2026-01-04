<?= $this->makePartial('item-sidebar-preview') ?>

<div class="media-panel oc-hide" data-media-sidebar-labels>
    <label><?= e(trans('backend::lang.media.title')) ?></label>
    <p data-label="title"></p>

    <table class="name-value-list">
        <tr>
            <th><?= e(trans('backend::lang.media.size')) ?></th>
            <td data-label="size"></td>
        </tr>
        <tr>
            <th><?= e(trans('backend::lang.media.public_url')) ?></th>
            <td><a href="#" data-label="public-url" target="_blank"><?= e(trans('backend::lang.media.click_here')) ?></a></td>
        </tr>
        <tr data-media-last-modified>
            <th><?= e(trans('backend::lang.media.last_modified')) ?></th>
            <td data-label="last-modified"></td>
        </tr>

        <tr data-media-item-folder class="oc-hide">
            <th><?= e(trans('backend::lang.media.folder')) ?></th>
            <td><a href="#" data-type="media-item" data-item-type="folder" data-label="folder" data-clear-search="true"></a></td>
        </tr>
    </table>
</div>