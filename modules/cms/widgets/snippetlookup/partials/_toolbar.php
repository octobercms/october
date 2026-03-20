<div class="toolbar-item loading-indicator-container size-input-text">
    <?= Ui::searchInput(
        name: 'search',
        value: $this->getSearchTerm(),
        placeholder: __("Search..."),
        handler: $this->getEventHandler('onSearch'),
        outerClass: 'is-modal-search'
    ) ?>
</div>
