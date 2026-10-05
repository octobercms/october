<div class="modal-header">
    <h4 class="modal-title"><?= e(__('Column preview')) ?></h4>
    <button type="button" class="btn-close" data-dismiss="popup"></button>
</div>
<div class="modal-body">
    <p>
        <?= e(__('Column')) ?>:
        <strong><?= e($columnName) ?></strong>
    </p>
    <div class="list-preview">
        <div class="control-simplelist is-divided is-scrollable size-small" data-control="simplelist">
            <ul>
                <?php foreach ($columnData as $sample): ?>
                    <li class="oc-icon-file">
                        <?= e($sample) ?>
                    </li>
                <?php endforeach ?>
            </ul>
        </div>
    </div>
</div>
<div class="modal-footer">
    <button
        type="button"
        class="btn btn-secondary"
        data-dismiss="popup">
        <?= e(trans('backend::lang.form.close')) ?>
    </button>
</div>
