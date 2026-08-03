/*
 * MediaFinder plugin
 *
 * Data attributes:
 * - data-control="mediafinder" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * oc.fetchControl(element, 'mediafinder')
 */
'use strict';

oc.registerControl('mediafinder', class extends oc.ControlBase {
    static instanceCounter = 0;

    init() {
        this.constructor.instanceCounter++;
        this.$el = $(this.element);
        this.instanceNumber = this.constructor.instanceCounter;

        if (this.config.isMulti === undefined) {
            this.config.isMulti = this.$el.hasClass('is-multi');
        }

        if (this.config.isPreview === undefined) {
            this.config.isPreview = this.$el.hasClass('is-preview');
        }

        if (this.config.isImage === undefined) {
            this.config.isImage = this.$el.hasClass('is-image');
        }

        if (this.config.isFolder === undefined) {
            this.config.isFolder = this.$el.hasClass('is-folder');
        }

        if (this.config.isSortable === undefined) {
            this.config.isSortable = this.$el.hasClass('is-sortable');
        }

        this.previewTemplate = $(this.config.template).html();
        this.$filesContainer = $('.mediafinder-files-container:first', this.$el);
        this.$dataLocker = $('[data-data-locker]', this.$el);
        this.$navigationClipboard = this.initNavigationClipboard();
    }

    connect() {
        this.loadExistingFiles();

        // Stop here for preview mode
        if (this.config.isPreview) {
            return;
        }

        this.listen('click', '.toolbar-find-button', this.onClickFindButton);
        this.listen('click', '.find-remove-button', this.onClickRemoveButton);
        this.listen('click', '.toolbar-delete-selected', this.onDeleteSelectedClick);
        this.listen('click', 'input[data-record-selector]', this.onClickCheckbox);
        this.listen('change', 'input[data-record-selector]', this.onSelectionChanged);

        if (this.config.isMulti && this.config.useCopyPaste) {
            this.listen('click', '.toolbar-select-all', this.onSelectAllClick);
            this.listen('click', '.toolbar-copy-selected', this.onCopySelectedClick);
            this.listen('click', '.toolbar-paste-items', this.onPasteItemsClick);
        }

        if (this.config.isSortable) {
            this.bindSortable();
        }

        // External toolbar
        setTimeout(() => {
            this.initToolbarExtensionPoint();
            this.mountExternalToolbarEventBusEvents();
            this.updateButtonsState();
            this.extendExternalToolbar();
        }, 0);
    }

    disconnect() {
        this.unmountExternalToolbarEventBusEvents();

        this.sortable = null;
        this.$dataLocker = null;
        this.$filesContainer = null;
        this.$el = null;
        this.toolbarExtensionPoint = null;
        this.externalToolbarEventBusObj = null;
    }

    //
    // External toolbar
    //

    initToolbarExtensionPoint() {
        if (!this.config.externalToolbarBus) {
            return;
        }

        const point = $.oc.vueUtils.getToolbarExtensionPoint(
            this.config.externalToolbarBus,
            this.element
        );

        if (point) {
            this.toolbarExtensionPoint = point.state;
            this.externalToolbarEventBusObj = point.bus;
        }
    }

    mountExternalToolbarEventBusEvents() {
        if (!this.externalToolbarEventBusObj) {
            return;
        }

        this.externalToolbarEventBusObj.on('toolbarcmd', this.proxy(this.onToolbarExternalCommand));
        this.externalToolbarEventBusObj.on('extendapptoolbar', this.proxy(this.extendExternalToolbar));
    }

    unmountExternalToolbarEventBusEvents() {
        if (!this.externalToolbarEventBusObj) {
            return;
        }

        this.externalToolbarEventBusObj.off('toolbarcmd', this.proxy(this.onToolbarExternalCommand));
        this.externalToolbarEventBusObj.off('extendapptoolbar', this.proxy(this.extendExternalToolbar));
    }

    onToolbarExternalCommand(ev) {
        var cmdPrefix = 'mediafinder-toolbar-' + this.instanceNumber + '-';

        if (ev.command.substring(0, cmdPrefix.length) != cmdPrefix) {
            return;
        }

        var buttonClassName = ev.command.substring(cmdPrefix.length),
            $toolbar = this.$el.find('.mediafinder-control-toolbar'),
            $button = $toolbar.find('[class="'+buttonClassName+'"]');

        $button.get(0).click(ev.ev);
    }

    extendExternalToolbar() {
        if (!this.$el || !this.$el.is(":visible") || !this.toolbarExtensionPoint) {
            return;
        }

        this.toolbarExtensionPoint.splice(0, this.toolbarExtensionPoint.length);

        this.toolbarExtensionPoint.push({
            type: 'separator'
        });

        var that = this,
            $buttons = this.$el.find('.mediafinder-control-toolbar .backend-toolbar-button');

        $buttons.each(function () {
            var $button = $(this),
                $icon = $button.find('i[class^=icon]');

            that.toolbarExtensionPoint.push(
                {
                    type: 'button',
                    icon: $icon.attr('class'),
                    label: $button.find('.button-label').text(),
                    command: 'mediafinder-toolbar-' + that.instanceNumber + '-' + $button.attr('class'),
                    disabled: $button.attr('disabled') !== undefined
                }
            );
        });
    }

    //
    // Selection
    //

    onDeleteSelectedClick(ev) {
        var $currentObjects = $('.item-object:has(input[data-record-selector]:checked)', this.$filesContainer);

        $currentObjects.remove();

        this.setValue();
        this.evalIsPopulated();
        this.evalIsMaxReached();
        this.updateDeleteSelectedState();
        this.updateButtonsState();
        this.extendExternalToolbar();

        ev.stopPropagation();
        ev.preventDefault();
    }

    onSelectionChanged(ev) {
        var $object = $(ev.target).closest('.item-object');

        $object.toggleClass('selected', ev.target.checked);

        this.updateDeleteSelectedState();
        this.updateButtonsState();
        this.extendExternalToolbar();
    }

    onClickCheckbox(ev) {
        oc.checkboxRangeRegisterClick(ev, '.item-object', 'input[data-record-selector]');
    }

    updateDeleteSelectedState() {
        var enabled = false,
            selectedCount = this.$el.find('input[data-record-selector]:checked').length;

        if (this.$el.hasClass('is-populated')) {
            enabled = selectedCount > 0;
        }

        var $button = this.$el.find('.toolbar-delete-selected'),
            $counter = $button.find('.button-label > span');

        $button.prop('disabled', !enabled);

        if (enabled) {
            $counter.text('(' + selectedCount + ')');
        }
        else {
            $counter.text('');
        }
    }

    //
    // Loading
    //

    loadExistingFiles() {
        var self = this;

        $('.server-file', this.$filesContainer).each(function () {
            $(this).replaceWith(self.makeFilePreview($(this).data()));
        });
    }

    makeFilePreview(item) {
        var $preview = $(this.previewTemplate);

        $preview.attr('data-path', item.path);
        $preview.attr('data-folder', this.makeFolderPath(item));
        $('[data-public-url]', $preview).attr('src', item.publicUrl);
        $('[data-thumb-url]', $preview).attr('src', item.thumbUrl);
        $('[data-title]', $preview).text(item.title).attr('title', item.path);

        // Image is the default but can be swapped out for video and audio
        if (['video', 'audio'].includes(item.documentType)) {
            $('[data-document-type]', $preview).each(function() {
                var $el = $(this).get(0);
                if ($el.dataset.documentType !== item.documentType) {
                    $el.remove();
                }
            });
        }
        else {
            $('[data-document-type]', $preview).remove();
        }

        return $preview;
    }

    makeFolderPath(item) {
        var path = item.path;
        if (path.endsWith(item.title)) {
            path = path.slice(0, item.title.length * -1);
        }

        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        return path;
    }

    getValue() {
        var result = [];

        $('> .item-object', this.$filesContainer).each(function() {
            result.push($(this).data('path'));
        });

        return result.length ? result : '';
    }

    setValue() {
        var self = this,
            currentValue = this.getValue();

        this.$dataLocker.empty();

        // Spin over items and set the input value
        if (currentValue) {
            $.each(this.getValue(), function(k, v) {
                self.addValueToLocker(v);
            });
        }
        // Empty value
        else {
            this.addValueToLocker('');
        }

        // Set value and trigger change event, so that wrapping implementations
        // like mlmediafinder can listen for changes.
        this.$dataLocker.find('input:first').trigger('change');
    }

    addValueToLocker(val) {
        var inputName = val && this.config.isMulti
            ? this.config.inputName + '[]'
            : this.config.inputName;

        $('<input type="hidden" />')
            .attr('name', inputName)
            .val(val)
            .appendTo(this.$dataLocker);
    }

    addItems(items) {
        if (!this.$filesContainer) {
            return;
        }

        if (!this.config.isMulti) {
            this.$filesContainer.empty();
        }

        for (var i=0, len=items.length; i<len; i++) {
            this.$filesContainer.append(this.makeFilePreview(items[i]));
        }

        this.extendExternalToolbar();
    }

    updateButtonsState() {
        if (!this.config.useCopyPaste) {
            return;
        }

        var selectAllButton = this.$el.find('.toolbar-select-all');
        var copySelectedButton = this.$el.find('.toolbar-copy-selected');
        var pasteItemsButton = this.$el.find('.toolbar-paste-items');

        // remove focus
        selectAllButton.blur();
        copySelectedButton.blur();
        pasteItemsButton.blur();

        var hasItems = this.$el.find('.item-object').length > 0;
        var selectedCount = this.$el.find('input[data-record-selector]:checked').length;
        var hasSelection = selectedCount > 0;

        // unselect button if no items
        selectAllButton.prop('disabled', !hasItems);

        // change text if all items are selected
        var checkboxes = this.$el.find('input[data-record-selector]');
        var allChecked = hasItems && checkboxes.filter(':checked').length === checkboxes.length;

        selectAllButton.find('.button-label').text(allChecked ? oc.lang.get('mediafinder.deselect_all') : oc.lang.get('mediafinder.select_all'));
        selectAllButton.find('i').attr('class', allChecked ? 'icon-square-o' : 'icon-check-square');

        // Copy button : enabled if there is a selection
        copySelectedButton.prop('disabled', !hasSelection);
        copySelectedButton.find('.button-label > span').text(hasSelection ? '(' + selectedCount + ')' : '');

        // Paste button : enabled if the clipboard holds items not already present here
        var existingPaths = this.$el.find('.item-object').map(function() {
            return $(this).attr('data-path');
        }).get();

        var newItemCount = this.$navigationClipboard.paste('mediafinder').filter(function(item) {
            return existingPaths.indexOf(item.path) === -1;
        }).length;

        var canPaste = newItemCount > 0;

        if (canPaste && this.config.maxItems !== null && this.config.maxItems !== undefined) {
            var totalAfterPaste = existingPaths.length + newItemCount;
            canPaste = totalAfterPaste <= this.config.maxItems;
        }

        pasteItemsButton.prop('disabled', !canPaste);
        pasteItemsButton.find('.button-label > span').text(newItemCount > 0 ? '(' + newItemCount + ')' : '');
    }

    onClickRemoveButton(ev) {
        if (!this.$filesContainer) {
            return;
        }

        this.$filesContainer.empty();
        this.setValue();
        this.evalIsPopulated();
        this.evalIsMaxReached();
        this.extendExternalToolbar();

        ev.preventDefault();
        ev.stopPropagation();
    }

    onClickFindButton() {
        var self = this;

        new oc.mediaManager.popup({
            alias: 'ocmediamanager',
            mediaFolder: this.getCurrentFolderContext(),
            cropAndInsertButton: true,
            onInsert: function(items) {
                if (!items.length) {
                    alert('Please select image(s) to insert.');
                    return;
                }

                // Single mode
                if (!self.config.isMulti && items.length > 1) {
                    alert('Please select a single item.');
                    return;
                }

                if (!self.maxSelectionAllowed(items.length)) {
                    alert('Too many items selected.');
                    return;
                }

                var isHalted = false;
                items.forEach(function(item) {
                    if (!isHalted && self.config.isFolder && item.itemType !== 'folder') {
                        alert('Please select a folder only.');
                        isHalted = true;
                    }

                    if (!isHalted && !self.config.isFolder && item.itemType === 'folder') {
                        alert('Cannot select a folder. Please select an item instead.');
                        isHalted = true;
                    }
                });

                if (isHalted) {
                    return;
                }

                self.addItems(items);
                self.setValue();
                self.evalIsPopulated();
                self.evalIsMaxReached();

                this.hide();
            }
        });
    }

    onSelectAllClick(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        var checkboxes = this.$el.find('input[data-record-selector]');
        var allChecked = checkboxes.filter(':checked').length === checkboxes.length;

        checkboxes.prop('checked', !allChecked).each(function() {
            $(this).closest('.item-object').toggleClass('selected', !allChecked);
        });

        this.updateDeleteSelectedState();
        this.updateButtonsState();

        if (this.extendExternalToolbar){
            this.extendExternalToolbar();
        }
    }

    onCopySelectedClick(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        var items = [];
        var selectedObjects = this.$el.find('.item-object:has(input[data-record-selector]:checked)');

        selectedObjects.each(function() {
            var item = $(this);

            var itemData = {
                path: item.attr('data-path'),
                folder: item.attr('data-folder') || ''
            };

            var publicUrlEl = item.find('[data-public-url]');
            var thumbUrlEl = item.find('[data-thumb-url]');
            var titleEl = item.find('[data-title]');

            if(publicUrlEl.length) {
                itemData.publicUrl = publicUrlEl.attr('src') || publicUrlEl.attr('data-public-url');
            }

            if(thumbUrlEl.length) {
                itemData.thumbUrl = thumbUrlEl.attr('src') || thumbUrlEl.attr('data-thumb-url');
            }

            if(titleEl.length) {
                itemData.title = titleEl.text() || titleEl.attr('data-title');
            } else {
                itemData.title = itemData.path ? itemData.path.split('/').pop() : '';
            }

            var docType = item.find('[data-document-type]');
            if(docType.length) {
                itemData.documentType = docType.attr('data-document-type');
            }

            items.push(itemData);
        });

        if (items.length === 0) {
            return;
        }

        this.$navigationClipboard.copy(items, 'mediafinder');

        $.oc.flashMsg({
            text: items.length + oc.lang.get('mediafinder.items_copied_to_clipboard'),
            class: 'success',
            interval: 3
        });

        this.evalIsPopulated();
        this.evalIsMaxReached();
        this.updateButtonsState();

        if (this.extendExternalToolbar){
            this.extendExternalToolbar();
        }
    }

    onPasteItemsClick(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        if(!this.$navigationClipboard.hasItems('mediafinder')) {
            return;
        }

        var items = this.$navigationClipboard.paste('mediafinder');

        // Skip items already present in this widget, matching on path
        var existingPaths = this.$el.find('.item-object').map(function() {
            return $(this).attr('data-path');
        }).get();

        items = items.filter(function(item) {
            return existingPaths.indexOf(item.path) === -1;
        });

        if (items.length === 0) {
            $.oc.flashMsg({
                text: oc.lang.get('mediafinder.no_new_items_to_paste'),
                class: 'warning',
                interval: 3
            });
            return;
        }

        if (this.config.maxItems !== null && this.config.maxItems !== undefined) {
            var currentCount = this.$el.find('.item-object').length;
            var totalAfterPaste = currentCount + items.length;

            if (totalAfterPaste > this.config.maxItems) {
                $.oc.flashMsg({
                    text: oc.lang.get('mediafinder.cannot_paste_items_maximum_limit_exceeded', { maxItems: this.config.maxItems }),
                    class: 'error',
                    interval: 5
                });
                return;
            }
        }

        this.addItems(items);

        this.setValue();
        this.evalIsPopulated();
        this.evalIsMaxReached();
        this.updateButtonsState();

        $.oc.flashMsg({
            text: items.length + oc.lang.get('mediafinder.items_pasted_successfully'),
            class: 'success',
            interval: 3
        });
    }

    evalIsPopulated() {
        var isPopulated = !!$('>.item-object', this.$filesContainer).length;
        this.$el.toggleClass('is-populated', isPopulated);
        this.updateButtonsState();
        this.extendExternalToolbar();
    }

    evalIsMaxReached() {
        var isMaxReached = false;

        if (this.config.maxItems !== null) {
            isMaxReached = $('>.item-object', this.$filesContainer).length >= this.config.maxItems;
        }

        this.$el.toggleClass('is-max-reached', isMaxReached);
        this.updateButtonsState();
        this.extendExternalToolbar();
    }

    maxSelectionAllowed(count) {
        if (this.config.maxItems !== null) {
            var totalCount = $('>.item-object', this.$filesContainer).length + count;

            if (totalCount > this.config.maxItems) {
                return false;
            }
        }

        return true;
    }

    getCurrentFolderContext() {
        // Cannot determine context from multiple items
        if (!this.config.isMulti) {
            return $('>.item-object:first', this.$filesContainer).data('folder');
        }
    }

    //
    // Sorting
    //

    bindSortable() {
        this.sortable = Sortable.create(this.$filesContainer.get(0), {
            animation: 150,
            draggable: 'div.item-object',
            handle: '.drag-handle',
            onEnd: this.proxy(this.onSortAttachments),

            // Auto scroll plugin
            forceAutoScrollFallback: true,
            scrollSensitivity: 60,
            scrollSpeed: 20
        });
    }

    onSortAttachments() {
        this.setValue();
    }

    initNavigationClipboard() {
        var $clipboard = {
            storageKey: 'oc.mediafinder.navigationClipboard',
            // Load from localStorage
            load: function() {
                try {
                    var data = localStorage.getItem(this.storageKey);
                    if (data) {
                        return JSON.parse(data);
                    }
                } catch (e) { }
                return { items: [], type: null };
            },

            // Save to localStorage
            save: function(items, type) {
                try {
                    localStorage.setItem(this.storageKey, JSON.stringify({
                        items: items,
                        type: type
                    }));
                } catch (e) { }
            },

            copy: function(items, type) {
                this.save(items.slice(), type || null);
            },

            paste: function(type) {
                var data = this.load();
                // If type is specified, only return items if they match the type
                if (type && data.type !== type) {
                    return [];
                }
                return data.items.slice();
            },

            hasItems: function(type) {
                var data = this.load();
                // If type is specified, check if clipboard has items of that type
                if (type) {
                    return data.items.length > 0 && data.type === type;
                }
                return data.items.length > 0;
            },

            clear: function() {
                try {
                    localStorage.removeItem(this.storageKey);
                } catch (e) { }
            },

            count: function(type) {
                var data = this.load();
                // If type is specified, only count if items match the type
                if (type && data.type !== type) {
                    return 0;
                }
                return data.items.length;
            }
        };

        return $clipboard;
    }
});
