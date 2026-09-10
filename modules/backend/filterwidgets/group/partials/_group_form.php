<div
    data-control="groupfilter"
    data-options-handler="<?= $this->getEventHandler('onGetGroupOptions') ?>"
    data-group-template="#<?= $this->getId('groupTemplate') ?>"
>
    <input
        type="hidden"
        name="Filter[value]"
        value="<?= $scope->value ? e(json_encode($scope->value)) : '' ?>"
        data-groupfilter-datalocker />
    <div data-groupfilter-container></div>
</div>

<script type="text/template" id="<?= $this->getId('groupTemplate') ?>">
    <?php if ($scope->matchMode === 'toggle' || $scope->matchMode === true): ?>
        <div class="filter-mode">
            <div class="control-balloon-selector form-control-sm d-block p-2" data-control="balloon-selector">
                <ul class="d-block m-0">
                    <li
                        class="w-50 text-center <?= !$scope->mode || $scope->mode === 'include' ? 'active' : '' ?>"
                        data-value="include">
                        <i class="icon-plus me-1"></i> <?= __("Includes") ?>
                    </li>
                    <li
                        class="w-50 text-center <?= $scope->mode === 'exclude' ? 'active' : '' ?>"
                        data-value="exclude">
                        <i class="icon-minus me-1"></i> <?= __("Excludes") ?>
                    </li>
                </ul>
                <input type="hidden" name="Filter[mode]" value="<?= $scope->mode ?: 'include' ?>">
            </div>
        </div>
    <?php else: ?>
        <input type="hidden" name="Filter[mode]" value="<?= $scope->matchMode ?: 'include' ?>">
    <?php endif ?>
    <div class="filter-search search-input-container storm-icon-pseudo loading-indicator-container size-input-text">
        <input
            type="text"
            name="search"
            autocomplete="off"
            class="filter-search-input form-control popup-allow-focus"
            data-request="{{ optionsHandler }}"
            data-load-indicator-opaque
            data-load-indicator
            data-track-input />
        <div class="filter-items">
            <ul>
                {{#available}}
                    <li data-item-id="{{ id }}"><a href="javascript:;">{{{ name }}}</a></li>
                {{/available}}
                {{#loading}}
                    <li class="loading"><span></span></li>
                {{/loading}}
            </ul>
        </div>
        <div class="filter-active-items">
            <ul>
                {{#active}}
                    <li data-item-id="{{ id }}"><a href="javascript:;">{{{ name }}}</a></li>
                {{/active}}
            </ul>
        </div>
        <div class="filter-buttons">
            <button class="btn btn-sm btn-primary" data-filter-action="apply">
                <?= __("Apply") ?>
            </button>
            <div class="flex-grow-1"></div>
            <button class="btn btn-sm btn-secondary" data-filter-action="clear">
                <?= __("Clear") ?>
            </button>
        </div>
    </div>
</script>
