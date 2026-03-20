<div
    id="<?= $this->getId() ?>"
    class="field-datatable is-handsontable"
    data-control="datatable-handsontable"
    data-alias="<?= $this->alias ?>"
    data-columns='<?= e(json_encode($columns)) ?>'
    data-data='<?= e(json_encode($value)) ?>'
    data-col-headers='<?= e(json_encode($colHeaders)) ?>'
    data-hot-options='<?= e(json_encode($hotOptions)) ?>'
    data-ajax-columns='<?= e(json_encode($ajaxColumns)) ?>'
    data-column-dependencies='<?= e(json_encode($columnDependencies)) ?>'
    data-field-name="<?= $name ?>"
>
    <?php if ($toolbar): ?>
    <div class="toolbar" data-table-toolbar>
        <?php if ($adding): ?>
            <button type="button" class="backend-toolbar-button control-button" data-table-add>
                <i class="icon-list-add"></i>
                <span class="button-label"><?= e(trans('backend::lang.form.insert_row')) ?></span>
            </button>
        <?php endif ?>
        <?php if ($deleting): ?>
            <button type="button" class="backend-toolbar-button control-button" data-table-delete>
                <i class="icon-list-remove"></i>
                <span class="button-label"><?= e(trans('backend::lang.form.delete_row')) ?></span>
            </button>
        <?php endif ?>
        <?php if ($csvExport): ?>
            <button type="button" class="backend-toolbar-button control-button" data-table-export>
                <i class="icon-download"></i>
                <span class="button-label">Export</span>
            </button>
        <?php endif ?>
        <?php if ($csvImport): ?>
            <button type="button" class="backend-toolbar-button control-button" data-table-import>
                <i class="icon-upload"></i>
                <span class="button-label">Import</span>
            </button>
        <?php endif ?>
        <?php if ($searching): ?>
            <div class="toolbar-search">
                <input type="text" class="form-control" placeholder="Search..." data-table-search>
            </div>
        <?php endif ?>
    </div>
    <?php endif ?>

    <div class="handsontable-container" data-hot-container></div>

    <input type="hidden" name="<?= $name ?>" data-table-data>
</div>
