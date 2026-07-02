<div class="import-file-columns" id="importFileColumns">
    <?php if ($importFileColumns): ?>
        <ul>
            <?php foreach ($importFileColumns as $index => $column): ?>
                <li data-column-id="<?= $index ?>">
                    <div class="import-column-name">
                        <span>
                            <i class="column-success-icon text-success icon-check"></i>
                            <a
                                href="javascript:;"
                                class="column-ignore-button"
                                data-toggle="tooltip"
                                data-delay="300"
                                data-placement="right"
                                title="<?= __("Ignore this column") ?>"
                                onclick="$.oc.importBehavior.ignoreFileColumn(this)"
                            >
                                <i class="icon-close"></i>
                            </a>
                            <a
                                href="javascript:;"
                                class="column-label"
                                onclick="$.oc.importBehavior.loadFileColumnSample(this)"
                            >
                                <?= e($column) ?>
                            </a>
                        </span>
                    </div>
                    <div class="import-column-bindings">
                        <ul data-empty-text="<?= __("Drop column here...") ?>"></ul>
                    </div>
                </li>
            <?php endforeach ?>
        </ul>
    <?php else: ?>
        <p class="upload-prompt">
            <?= __("Please upload a valid CSV file.") ?>
        </p>
    <?php endif ?>
</div>

<script>
    addEventListener('render', function() {
        $.oc.importBehavior.bindColumnSorting();
    });
</script>
