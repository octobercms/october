<div
    id="<?= $this->getId() ?>"
    data-control="table"
    class="control-table"
    data-columns="<?= e(json_encode($columns)) ?>"
    data-data="<?= e($data) ?>"
    data-alias="<?= e($this->alias) ?>"
    data-field-name="<?= e($this->fieldName) ?>"
    data-postback-handler-name="<?= e($postbackHandlerName) ?>"
    data-postback-handler-wild="<?= e($postbackHandlerWild) ?>"
    data-adding="<?= e($adding) ?>"
    data-searching="<?= e($searching) ?>"
    data-deleting="<?= e($deleting) ?>"
    data-toolbar="<?= e($toolbar) ?>"
    data-height="<?= e($height) ?>"
    data-records-per-page="<?= e($recordsPerPage) ?>"
    data-key-column="<?= e($recordsKeyFrom) ?>"
    data-client-data-source-class="<?= e($clientDataSourceClass) ?>"
    data-dynamic-height="<?= e($dynamicHeight) ?>"
>
    <script type="text/template" data-table-toolbar>
        <div class="toolbar">
            <button type="button" class="backend-toolbar-button control-button add-table-row-below" data-cmd="record-add">
                <i class="icon-list-add"></i>
                <span class="button-label"><?= e($btnAddRowLabel) ?></span>
            </button>

            <button type="button" class="backend-toolbar-button control-button add-table-row-below" data-cmd="record-add-below">
                <i class="icon-add-below"></i>
                <?= e($btnAddRowBelowLabel) ?>
            </button>

            <button type="button" class="backend-toolbar-button control-button add-table-row-above" data-cmd="record-add-above">
                <i class="icon-add-above"></i>
                Add Row Above
            </button>

            <button type="button" class="backend-toolbar-button control-button delete-table-row" data-cmd="record-delete">
                <i class="icon-list-remove"></i>
                <?= e($btnDeleteRowLabel) ?>
            </button>
        </div>
    </script>
    <script type="text/template" data-table-toolbar-search>
        <div class="table-search">
            <input
                placeholder="<?= e(trans('backend::lang.list.search_prompt')) ?>"
                name="search"
                id="search"
                value="<?= e(get('search')) ?>"
                type="text"
                autocomplete="off"
                class="table-search-input form-control" />
        </div>
    </script>
</div>
