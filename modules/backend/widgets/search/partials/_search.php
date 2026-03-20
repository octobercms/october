<div class="control-search loading-indicator-container size-input-text">
    <div
        id="<?= $this->getId() ?>"
        class="search-input-container storm-icon-pseudo"
        data-control="search-input"
    >
        <input
            placeholder="<?= $placeholder ?>"
            type="text"
            name="<?= $this->getName() ?>"
            value="<?= e($value) ?>"
            data-request="<?= $this->getEventHandler('onSubmit') ?>"
            <?= !$searchOnEnter ? 'data-track-input' : '' ?>
            data-load-indicator
            data-load-indicator-opaque
            class="form-control is-searchable <?= $cssClasses ?>"
            autocomplete="off"
            data-search-input />
        <button
            class="clear-input-text"
            type="button"
            value=""
            style="display:none"
            data-search-clear
        >
            <i class="storm-icon"></i>
        </button>
    </div>
</div>
