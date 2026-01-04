<?= Form::open([
    'data-request-parent-form' => "#{$this->getId()}"
]) ?>
    <div class="modal-header">
        <h4 class="modal-title"><?= __("List Setup") ?></h4>
        <button type="button" class="btn-close" data-dismiss="popup"></button>
    </div>
    <div class="modal-body">
        <p class="form-text before-field"><?= __("Use checkboxes to select columns you want to see in the list. You can change position of columns by dragging them up or down.") ?></p>

        <div class="control-simplelist with-checkboxes is-sortable" data-control="simplelist">
            <ul>
                <?php foreach ($columns as $key => $column): ?>
                    <li>
                        <span class="drag-handle" title="<?= __("Reorder") ?>">
                            <i class="icon-list-reorder"></i>
                        </span>
                        <div class="form-check">
                            <input
                                type="hidden"
                                name="column_order[]"
                                value="<?= e($column->columnName) ?>" />
                            <input
                                class="form-check-input"
                                id="<?= $this->getId('setupCheckbox-'.$column->columnName) ?>"
                                name="visible_columns[]"
                                value="<?= e($column->columnName) ?>"
                                <?= $column->invisible ? '' : 'checked="checked"' ?>
                                type="checkbox" />
                            <label
                                class="form-check-label"
                                for="<?= $this->getId('setupCheckbox-'.$column->columnName) ?>">
                                    <?= __($column->label) ?>
                            </label>
                        </div>
                    </li>
                <?php endforeach ?>
            </ul>
        </div>

        <?php if ($this->showPagination): ?>
            <div class="form-group">
                <label><?= __("Records Per Page") ?></label>
                <p class="form-text before-field">
                    <?= __("Select the number of records per page to display. Please note that high number of records on a single page can reduce performance.") ?>
                </p>
                <select class="form-control custom-select select-no-search" name="records_per_page">
                    <?php foreach ($perPageOptions as $optionValue): ?>
                        <option value="<?= $optionValue ?>" <?= $optionValue == $recordsPerPage ? 'selected="selected"' : '' ?>><?= $optionValue ?></option>
                    <?php endforeach ?>
                </select>
            </div>
        <?php endif ?>

    </div>
    <div class="modal-footer">
        <button
            type="button"
            class="btn btn-primary"
            data-request="<?= $this->getEventHandler('onApplySetup') ?>"
            data-dismiss="popup"
            data-stripe-load-indicator>
            <?= __("Apply") ?>
        </button>
        <span class="button-separator"><?= __("or") ?></span>
        <button
            type="button"
            class="btn btn-link text-muted"
            data-dismiss="popup">
            <?= __("Cancel") ?>
        </button>

        <button
            type="button"
            class="btn btn-link pull-right"
            data-request="<?= $this->getEventHandler('onResetSetup') ?>"
            data-dismiss="popup"
            data-stripe-load-indicator>
            <?= __("Reset to Default") ?>
        </button>
    </div>
<?= Form::close() ?>
