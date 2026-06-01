<div class="control-tabs underline-tabs mt-2 mb-3">
    <ul class="nav nav-tabs" data-control="drag-scroll" role="tablist">
        <li class="<?= !get('group') ? 'active' : '' ?>">
            <a href="javascript:;" data-request="onRefreshList" data-request-query="group: null">
                <span class="title">
                    <span><?= __("All Sites") ?></span>
                </span>
            </a>
        </li>
        <?php foreach ($groups as $group): ?>
            <li class="<?= get('group') == $group->id ? 'active' : '' ?>">
                <a href="javascript:;" data-request="onRefreshList" data-request-query="group: '<?= $group->id ?>'">
                    <span class="title">
                        <span><?= e($group->name) ?></span>
                    </span>
                </a>
            </li>
        <?php endforeach ?>
    </ul>
</div>
