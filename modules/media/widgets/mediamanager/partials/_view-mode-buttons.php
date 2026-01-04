<button
    type="button"
    class="btn btn-secondary oc-icon-align-justify empty <?= $viewMode == Media\Widgets\MediaManager::VIEW_MODE_GRID ? 'active' : '' ?>"
    data-command="change-view"
    data-view="<?= Media\Widgets\MediaManager::VIEW_MODE_GRID ?>">
</button>
<button
    type="button"
    class="btn btn-secondary oc-icon-th empty <?= $viewMode == Media\Widgets\MediaManager::VIEW_MODE_LIST ? 'active' : '' ?>"
    data-command="change-view"
    data-view="<?= Media\Widgets\MediaManager::VIEW_MODE_LIST ?>">
</button>
<button
    type="button"
    class="btn btn-secondary oc-icon-th-large empty <?= $viewMode == Media\Widgets\MediaManager::VIEW_MODE_TILES ? 'active' : '' ?>"
    data-command="change-view"
    data-view="<?= Media\Widgets\MediaManager::VIEW_MODE_TILES ?>">
</button>
