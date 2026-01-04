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

        if (this.config.isSortable) {
            this.bindSortable();
        }

        // External toolbar
        setTimeout(() => {
            this.initToolbarExtensionPoint();
            this.mountExternalToolbarEventBusEvents();
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
        if (!this.config.externalToolbarAppState) {
            return;
        }

        const point = $.oc.vueUtils.getToolbarExtensionPoint(
            this.config.externalToolbarAppState,
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

        this.externalToolbarEventBusObj.$on('toolbarcmd', this.proxy(this.onToolbarExternalCommand));
        this.externalToolbarEventBusObj.$on('extendapptoolbar', this.proxy(this.extendExternalToolbar));
    }

    unmountExternalToolbarEventBusEvents() {
        if (!this.externalToolbarEventBusObj) {
            return;
        }

        this.externalToolbarEventBusObj.$off('toolbarcmd', this.proxy(this.onToolbarExternalCommand));
        this.externalToolbarEventBusObj.$off('extendapptoolbar', this.proxy(this.extendExternalToolbar));
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
        if (!this.$el.is(":visible") || !this.toolbarExtensionPoint) {
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
        this.extendExternalToolbar();

        ev.stopPropagation();
        ev.preventDefault();
    }

    onSelectionChanged(ev) {
        var $object = $(ev.target).closest('.item-object');

        $object.toggleClass('selected', ev.target.checked);

        this.updateDeleteSelectedState();
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
        if (!this.config.isMulti) {
            this.$filesContainer.empty();
        }

        for (var i=0, len=items.length; i<len; i++) {
            this.$filesContainer.append(this.makeFilePreview(items[i]));
        }

        this.extendExternalToolbar();
    }

    onClickRemoveButton(ev) {
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

    evalIsPopulated() {
        var isPopulated = !!$('>.item-object', this.$filesContainer).length;
        this.$el.toggleClass('is-populated', isPopulated);
        this.extendExternalToolbar();
    }

    evalIsMaxReached() {
        var isMaxReached = false;

        if (this.config.maxItems !== null) {
            isMaxReached = $('>.item-object', this.$filesContainer).length >= this.config.maxItems;
        }

        this.$el.toggleClass('is-max-reached', isMaxReached);
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
});
