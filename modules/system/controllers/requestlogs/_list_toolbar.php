<div data-control="toolbar" class="loading-indicator-container">
    <a
        href="javascript:;"
        data-request="onRefresh"
        data-load-indicator="<?= e(trans('backend::lang.list.updating')) ?>"
        class="btn btn-primary oc-icon-refresh">
        <?= e(trans('backend::lang.list.refresh')) ?>
    </a>
    <a
        href="javascript:;"
        data-request="onEmptyLog"
        data-request-confirm="<?= e(trans('backend::lang.list.delete_selected_confirm')) ?>"
        data-load-indicator="<?= e(trans('system::lang.request_log.empty_loading')) ?>"
        class="btn btn-secondary oc-icon-eraser">
        <?= e(trans('system::lang.request_log.empty_link')) ?>
    </a>

    <div class="toolbar-divider"></div>

    <button
        class="btn btn-secondary oc-icon-trash"
        data-request="onDelete"
        data-list-checked-trigger
        data-list-checked-request
        data-stripe-load-indicator>
        <?= e(trans('backend::lang.list.delete_selected')) ?>
    </button>
</div>
