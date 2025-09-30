<div class="modal-body">
    <p><?= e(trans('backend::lang.warnings.tips_description')) ?></p>

    <div class="control-simplelist with-icons is-divided">
        <ul class="mb-0">
            <?php foreach ($warnings as $warning): ?>
                <li class="py-2">
                    <?= $warning ?>
                </li>
            <?php endforeach ?>
        </ul>
    </div>
</div>
<div class="modal-footer">
    <button
        type="button"
        class="btn btn-primary btn-default-action"
        data-default-focus
        data-close-popup="close"
    >Close</button>
</div>