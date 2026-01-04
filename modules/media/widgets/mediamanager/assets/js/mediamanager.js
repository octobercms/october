/*
 * Media manager control class
 *
 * Data attributes:
 * - data-control="media-manager" - enables the plugin on an element
 *
 * JavaScript API:
 * oc.fetchControl(element, 'media-manager')
 *
 * Dependencies:
 * - Scrollpad (october.scrollpad.js)
 */
'use strict';

if (oc.mediaManager === undefined) {
    oc.mediaManager = {};
}

oc.registerControl('media-manager', class extends oc.ControlBase {
    init() {
        this.$el = $(this.element);
        this.$form = this.$el.closest('form');

        // State properties
        this.selectTimer = null;
        this.sidebarPreviewElement = null;
        this.itemListElement = null;
        this.scrollContentElement = null;
        this.thumbnailQueue = [];
        this.activeThumbnailQueueLength = 0;
        this.sidebarThumbnailAjax = null;
        this.selectionMarker = null;
        this.dropzone = null;
        this.searchTrackInputTimer = null;
        this.navigationAjax = null;
        this.dblTouchTimer = null;
        this.dblTouchFlag = null;
        this.itemListPosition = null;

        // Apply defaults to config
        this.config = Object.assign({
            url: window.location,
            alias: '',
            uniqueId: null,
            deleteEmpty: 'Please select files to delete.',
            deleteConfirm: 'Delete the selected file(s)?',
            moveEmpty: 'Please select files to move.',
            selectSingleImage: 'Please select a single image.',
            selectionNotImage: 'The selected item is not an image.',
            overwriteConfirm: 'Some files already exist. Do you want to replace them?',
            bottomToolbar: false,
            cropAndInsertButton: false,
            readOnly: false
        }, this.config);

        this.itemListElement = this.$el.find('[data-media-item-list]').get(0);
        if (this.itemListElement) {
            this.scrollContentElement = this.itemListElement.querySelector('.scroll-wrapper');
        }

        if (this.config.bottomToolbar) {
            this.$el.find('[data-media-bottom-toolbar]').removeClass('oc-hide');

            if (this.config.cropAndInsertButton) {
                this.$el.find('[data-popup-command="crop-and-insert"]').removeClass('oc-hide');
            }
        }
    }

    connect() {
        this.registerHandlers();

        this.updateSidebarPreview();
        this.generateThumbnails();
        this.initUploader();
        this.initScroll();
    }

    disconnect() {
        this.unregisterHandlers();
        this.clearSelectTimer();
        this.destroyUploader();
        this.clearSearchTrackInputTimer();
        this.releaseNavigationAjax();
        this.clearDblTouchTimer();
        this.removeAttachedControls();
        this.removeScroll();

        this.$el = null;
        this.$form = null;

        this.sidebarPreviewElement = null;
        this.itemListElement = null;
        this.scrollContentElement = null;
        this.sidebarThumbnailAjax = null;
        this.selectionMarker = null;
        this.thumbnailQueue = [];
        this.navigationAjax = null;
    }

    getSelectedItems(returnNotProcessed, allowRootItem) {
        var items = this.$el.get(0).querySelectorAll('[data-type="media-item"].selected'),
            result = [];

        if (!allowRootItem) {
            var filteredItems = [];

            for (var i=0, len=items.length; i < len; i++) {
                var item = items[i];
                if (!item.hasAttribute('data-root')) {
                    filteredItems.push(item);
                }
            }

            items = filteredItems;
        }

        if (returnNotProcessed === true) {
            return items;
        }

        for (var i=0, len=items.length; i < len; i++) {
            var item = items[i],
                itemDetails = {
                    itemType: item.getAttribute('data-item-type'),
                    path: item.getAttribute('data-path'),
                    title: item.getAttribute('data-title'),
                    documentType: item.getAttribute('data-document-type'),
                    folder: item.getAttribute('data-folder'),
                    publicUrl: item.getAttribute('data-public-url'),
                    // @todo optimistically this should be a thumb URL for the media picker -sg
                    thumbUrl: item.getAttribute('data-public-url')
                };

            result.push(itemDetails);
        }

        return result;
    }

    // MEDIA MANAGER INTERNAL METHODS
    // ============================

    registerHandlers() {
        this.$el.on('dblclick', this.proxy(this.onNavigate));
        this.$el.on('click.tree-path', 'ul.tree-path, [data-media-sidebar-labels]', this.proxy(this.onNavigate));

        this.$el.on('click.command', '[data-command]', this.proxy(this.onCommandClick));

        // Touch devices use double-tap for the navigation and single tap for selecting.
        // Another option is checkboxes visible only on touch devices, but this approach
        // will require more significant changes in the code for the touch device support.
        this.$el.on('click.item', '[data-type="media-item"]', this.proxy(this.onItemClick));
        this.$el.on('touchend', '[data-type="media-item"]', this.proxy(this.onItemTouch));

        this.$el.on('change', '[data-media-sorting]', this.proxy(this.onSortingChanged));
        this.$el.on('input', '[data-media-search]', this.proxy(this.onSearchChanged));
        this.$el.on('mediarefresh', this.proxy(this.refresh));
        this.$el.on('shown.oc.popup', '[data-command="create-folder"]', this.proxy(this.onFolderPopupShown));
        this.$el.on('hidden.oc.popup', '[data-command="create-folder"]', this.proxy(this.onFolderPopupHidden));
        this.$el.on('shown.oc.popup', '[data-command="move"]', this.proxy(this.onMovePopupShown));
        this.$el.on('hidden.oc.popup', '[data-command="move"]', this.proxy(this.onMovePopupHidden));
        this.$el.on('keydown', this.proxy(this.onKeyDown));

        if (this.itemListElement) {
            this.itemListElement.addEventListener('mousedown', this.proxy(this.onListMouseDown));
        }
    }

    unregisterHandlers() {
        this.$el.off('dblclick', this.proxy(this.onNavigate));
        this.$el.off('click.tree-path', this.proxy(this.onNavigate));
        this.$el.off('click.command', this.proxy(this.onCommandClick));

        this.$el.off('click.item', this.proxy(this.onItemClick));
        this.$el.off('touchend', '[data-type="media-item"]', this.proxy(this.onItemTouch));

        this.$el.off('change', '[data-media-sorting]', this.proxy(this.onSortingChanged));
        this.$el.off('keyup', '[data-media-search]', this.proxy(this.onSearchChanged));
        this.$el.off('shown.oc.popup', '[data-command="create-folder"]', this.proxy(this.onFolderPopupShown));
        this.$el.off('hidden.oc.popup', '[data-command="create-folder"]', this.proxy(this.onFolderPopupHidden));
        this.$el.off('shown.oc.popup', '[data-command="move"]', this.proxy(this.onMovePopupShown));
        this.$el.off('hidden.oc.popup', '[data-command="move"]', this.proxy(this.onMovePopupHidden));
        this.$el.off('keydown', this.proxy(this.onKeyDown));

        if (this.itemListElement) {
            this.itemListElement.removeEventListener('mousedown', this.proxy(this.onListMouseDown));
            this.itemListElement.removeEventListener('mousemove', this.proxy(this.onListMouseMove));
        }

        document.removeEventListener('mouseup', this.proxy(this.onListMouseUp));
    }

    changeView(view) {
        var data = {
            view: view,
            path: this.$el.find('[data-type="current-folder"]').val()
        };

        this.execNavigationRequest('onChangeView', data);
    }

    setFilter(filter) {
        var data = {
            filter: filter,
            path: this.$el.find('[data-type="current-folder"]').val()
        };

        this.execNavigationRequest('onSetFilter', data);
    }

    isSearchMode() {
        return this.$el.find('[data-type="search-mode"]').val() == 'true';
    }

    initScroll() {
        this.$el.find('.control-scrollpad').scrollpad();
    }

    updateScroll() {
        this.$el.find('.control-scrollpad').scrollpad('update');
    }

    removeScroll() {
        this.$el.find('.control-scrollpad').scrollpad('dispose');
    }

    scrollToTop() {
        this.$el.find('.control-scrollpad').scrollpad('scrollToStart');
    }

    //
    // Disposing
    //

    removeAttachedControls() {
        this.$el.find('[data-control=toolbar]').toolbar('dispose');
        this.$el.find('[data-media-sorting]').select2('destroy');
    }

    //
    // Selecting
    //

    clearSelectTimer() {
        if (this.selectTimer === null) {
            return;
        }

        clearTimeout(this.selectTimer);
        this.selectTimer = null;
    }

    selectItem(node, expandSelection) {
        if (!expandSelection) {
            var items = this.$el.get(0).querySelectorAll('[data-type="media-item"].selected');

            // The class attribute is used only for selecting, it's safe to clear it
            for (var i = 0, len = items.length; i < len; i++) {
                items[i].setAttribute('class', '');
            }

            node.setAttribute('class', 'selected');
        }
        else {
            if (node.getAttribute('class') == 'selected') {
                node.setAttribute('class', '');
            }
            else {
                node.setAttribute('class', 'selected');
            }
        }

        node.focus();

        this.clearSelectTimer();

        if (this.isPreviewSidebarVisible()) {
            // Use the timeout to prevent too many AJAX requests
            // when the selection changes too quickly (with the keyboard arrows)
            this.selectTimer = setTimeout(this.proxy(this.updateSidebarPreview), 100);
        }

        // Disable delete and move buttons
        if (node.hasAttribute('data-root') && !expandSelection) {
            this.toggleMoveAndDelete(true);
        }
        else {
            this.toggleMoveAndDelete(false);
        }

        // Always unselect root when selecting multiples
        if (expandSelection) {
            this.unselectRoot();
        }
    }

    toggleMoveAndDelete(value) {
        $('[data-command=delete]', this.$el).prop('disabled', value);
        $('[data-command=move]', this.$el).prop('disabled', value);
    }

    unselectRoot() {
        var rootItem = this.$el.get(0).querySelector('[data-type="media-item"][data-root].selected');

        if (rootItem) {
            rootItem.setAttribute('class', '');
        }
    }

    clearDblTouchTimer() {
        if (this.dblTouchTimer === null) {
            return;
        }

        clearTimeout(this.dblTouchTimer);
        this.dblTouchTimer = null;
    }

    clearDblTouchFlag() {
        this.dblTouchFlag = false;
    }

    selectFirstItem() {
        var firstItem = this.itemListElement.querySelector('[data-type="media-item"]:first-child');
        if (firstItem) {
            this.selectItem(firstItem);
        }
    }

    selectRelative(next, expandSelection) {
        var currentSelection = this.getSelectedItems(true, true);
        if (currentSelection.length == 0) {
            this.selectFirstItem();
            return;
        }

        var itemToSelect = null;
        if (next) {
            var lastItem = currentSelection[currentSelection.length-1];

            if (lastItem) {
                itemToSelect = lastItem.nextElementSibling;
            }
        }
        else {
            var firstItem = currentSelection[0];
            if (firstItem) {
                itemToSelect = firstItem.previousElementSibling;
            }
        }

        if (itemToSelect) {
            this.selectItem(itemToSelect, expandSelection);
        }
    }

    //
    // Navigation
    //

    gotoFolder(path, resetSearch) {
        var data = {
            path: path,
            resetSearch: resetSearch !== undefined ? 1 : 0
        };

        this.execNavigationRequest('onGoToFolder', data);
    }

    afterNavigate() {
        this.scrollToTop();
        this.generateThumbnails();
        this.updateSidebarPreview(true);
        this.selectFirstItem();
        this.updateScroll();
    }

    refresh() {
        var data = {
            path: this.$el.find('[data-type="current-folder"]').val(),
            clearCache: true
        };

        this.execNavigationRequest('onGoToFolder', data);
    }

    execNavigationRequest(handler, data, element) {
        if (element === undefined) {
            element = this.$form;
        }

        if (this.navigationAjax !== null) {
            try {
                this.navigationAjax.abort();
            }
            catch (e) {}
            this.releaseNavigationAjax();
        }

        $.oc.stripeLoadIndicator.show();
        this.navigationAjax = element.request(this.config.alias+'::' + handler, {
                data: data
            })
            .always(function() {
                $.oc.stripeLoadIndicator.hide()
            })
            .done(this.proxy(this.afterNavigate))
            .always(this.proxy(this.releaseNavigationAjax));
    }

    releaseNavigationAjax() {
        this.navigationAjax = null;
    }

    navigateToItem($item) {
        if (!$item.length || !$item.data('path').length) {
            return;
        }

        if ($item.data('item-type') == 'folder') {
            if (!$item.data('clear-search'))
                this.gotoFolder($item.data('path'));
            else {
                this.resetSearch();
                this.gotoFolder($item.data('path'), true);
            }
        }
        else if ($item.data('item-type') == 'file') {
            // Trigger the Insert popup command if a file item
            // was double clicked or Enter key was pressed.
            this.$el.trigger('popupcommand', ['insert']);
        }
    }

    //
    // Sidebar
    //

    isPreviewSidebarVisible() {
        return !this.$el.find('[data-media-preview-sidebar]').hasClass('oc-hide');
    }

    toggleSidebar(ev) {
        var isVisible = this.isPreviewSidebarVisible(),
            $sidebar = this.$el.find('[data-media-preview-sidebar]'),
            $button = $(ev.target);

        if (!isVisible) {
            $sidebar.removeClass('oc-hide');
            this.updateSidebarPreview();
            $button.removeClass('sidebar-hidden');
        }
        else {
            $sidebar.addClass('oc-hide');
            $button.addClass('sidebar-hidden');
        }

        this.$form.request(this.config.alias+'::onSetSidebarVisible', {
            data: {
                visible: (isVisible ? 0 : 1)
            }
        })
    }

    updateSidebarMediaPreview(items) {
        var previewPanel = this.sidebarPreviewElement,
            previewContainer = previewPanel.querySelector('[data-media-preview-container]'),
            template = '';

        for (var i = 0, len = previewContainer.children.length; i < len; i++) {
            previewContainer.removeChild(previewContainer.children[i]);
        }

        // Single item selected
        if (items.length == 1 && !items[0].hasAttribute('data-root')) {
            var item = items[0],
                documentType = item.getAttribute('data-document-type');

            switch (documentType) {
                case 'audio' :
                    template = previewPanel.querySelector('[data-media-audio-template]').innerHTML;
                break;
                case 'video' :
                    template = previewPanel.querySelector('[data-media-video-template]').innerHTML;
                break;
                case 'image' :
                    template = previewPanel.querySelector('[data-media-image-template]').innerHTML;
                break;
            }

            previewContainer.innerHTML = template
                .replace('{src}', item.getAttribute('data-public-url'))
                .replace('{path}', item.getAttribute('data-path'))
                .replace('{last-modified}', item.getAttribute('data-last-modified-ts'));

            if (documentType == 'image') {
                this.loadSidebarThumbnail();
            }
        }
        // "Go up" is selected
        else if (items.length == 1 && items[0].hasAttribute('data-root')) {
            template = previewPanel.querySelector('[data-media-go-up]').innerHTML;
            previewContainer.innerHTML = template;
        }
        // No selection
        else if (items.length == 0) {
            template = previewPanel.querySelector('[data-media-no-selection-template]').innerHTML;
            previewContainer.innerHTML = template;
        }
        // Multiple selection
        else {
            template = previewPanel.querySelector('[data-media-multi-selection-template]').innerHTML;
            previewContainer.innerHTML = template;
        }
    }

    updateSidebarPreview(resetSidebar) {
        if (!this.sidebarPreviewElement) {
            this.sidebarPreviewElement = this.$el.get(0).querySelector('[data-media-preview-sidebar]');
        }

        var items = resetSidebar === undefined ? this.$el.get(0).querySelectorAll('[data-type="media-item"].selected') : [],
            previewPanel = this.sidebarPreviewElement;

        // No items are selected
        if (items.length == 0) {
            this.sidebarPreviewElement.querySelector('[data-media-sidebar-labels]').setAttribute('class', 'oc-hide');
        }
        // One item is selected - display the details
        else if (items.length == 1 && !items[0].hasAttribute('data-root')) {
            this.sidebarPreviewElement.querySelector('[data-media-sidebar-labels]').setAttribute('class', 'panel');

            var item = items[0],
                lastModified = item.getAttribute('data-last-modified');

            previewPanel.querySelector('[data-label="size"]').textContent = item.getAttribute('data-size');
            previewPanel.querySelector('[data-label="title"]').textContent = item.getAttribute('data-title');
            previewPanel.querySelector('[data-label="last-modified"]').textContent = lastModified;
            previewPanel.querySelector('[data-label="public-url"]').setAttribute('href', item.getAttribute('data-public-url'));

            if (lastModified) {
                previewPanel.querySelector('[data-media-last-modified]').setAttribute('class', '');
            }
            else {
                previewPanel.querySelector('[data-media-last-modified]').setAttribute('class', 'oc-hide');
            }

            if (this.isSearchMode()) {
                previewPanel.querySelector('[data-media-item-folder]').setAttribute('class', '');
                var folderNode = previewPanel.querySelector('[data-label="folder"]');
                folderNode.textContent = item.getAttribute('data-folder');
                folderNode.setAttribute('data-path', item.getAttribute('data-folder'));
            }
            else {
                previewPanel.querySelector('[data-media-item-folder]').setAttribute('class', 'oc-hide');
            }
        }
        // Multiple items are selected or "Go up" is selected
        else {
            this.sidebarPreviewElement.querySelector('[data-media-sidebar-labels]').setAttribute('class', 'oc-hide');
        }

        this.updateSidebarMediaPreview(items);
    }

    loadSidebarThumbnail() {
        if (this.sidebarThumbnailAjax) {
            try {
                this.sidebarThumbnailAjax.abort();
            }
            catch (e) {}
            this.sidebarThumbnailAjax = null;
        }

        var sidebarThumbnail = this.sidebarPreviewElement.querySelector('[data-media-sidebar-thumbnail]');
        if (!sidebarThumbnail) {
            return;
        }

        var data = {
            path: sidebarThumbnail.getAttribute('data-path'),
            lastModified: sidebarThumbnail.getAttribute('data-last-modified')
        }

        this.sidebarThumbnailAjax = this.$form.request(this.config.alias+'::onGetSidebarThumbnail', {
                data: data
            })
            .done(this.proxy(this.replaceSidebarPlaceholder))
            .always(this.proxy(this.releaseSidebarThumbnailAjax));
    }

    replaceSidebarPlaceholder(response) {
        if (!this.sidebarPreviewElement) {
            return;
        }

        var sidebarThumbnail = this.sidebarPreviewElement.querySelector('[data-media-sidebar-thumbnail]');
        if (!sidebarThumbnail) {
            return;
        }

        if (!response.markup) {
            return;
        }

        sidebarThumbnail.innerHTML = response.markup;
        sidebarThumbnail.removeAttribute('data-loading');
    }

    releaseSidebarThumbnailAjax() {
        this.sidebarThumbnailAjax = null;
    }

    //
    // Thumbnails
    //

    generateThumbnails() {
        this.thumbnailQueue = [];

        var placeholders = this.itemListElement.querySelectorAll('[data-type="media-item"] div.image-placeholder')
        for (var i = (placeholders.length-1); i >= 0; i--) {
            this.thumbnailQueue.push({
                id: placeholders[i].getAttribute('id'),
                width: placeholders[i].getAttribute('data-width'),
                height: placeholders[i].getAttribute('data-height'),
                path: placeholders[i].getAttribute('data-path'),
                lastModified: placeholders[i].getAttribute('data-last-modified')
            });
        }

        this.handleThumbnailQueue();
    }

    handleThumbnailQueue() {
        var maxThumbnailQueueLength = 2,
            maxThumbnailBatchLength = 3;

        if (this.activeThumbnailQueueLength >= maxThumbnailQueueLength) {
            return;
        }

        for (var i = this.activeThumbnailQueueLength; i < maxThumbnailQueueLength && this.thumbnailQueue.length > 0; i++) {
            var batch = [];
            for (var j = 0; j < maxThumbnailBatchLength && this.thumbnailQueue.length > 0; j++) {
                batch.push(this.thumbnailQueue.pop());
            }

            this.activeThumbnailQueueLength++;

            this.handleThumbnailBatch(batch).always(this.proxy(this.placeholdersUpdated));
        }
    }

    handleThumbnailBatch(batch) {
        var data = {
            batch: batch
        };

        for (var i = 0, len = batch.length; i < len; i++) {
            var placeholder = document.getElementById(batch[i].id);
            if (placeholder) {
                placeholder.setAttribute('data-loading', 'true');
            }
        }

        var promise = this.$form.request(this.config.alias+'::onGenerateThumbnails', {
            data: data
        });

        promise.done(this.proxy(this.replacePlaceholder));

        return promise;
    }

    replacePlaceholder(response) {
        if (!response.generatedThumbnails) {
            return;
        }

        for (var i = 0, len = response.generatedThumbnails.length; i < len; i++) {
            var thumbnailInfo = response.generatedThumbnails[i];

            if (!thumbnailInfo.id || !thumbnailInfo.markup) {
                continue;
            }

            var node = document.getElementById(thumbnailInfo.id)
            if (!node) {
                continue;
            }

            var placeholderContainer = node.parentNode;
            if (placeholderContainer) {
                placeholderContainer.innerHTML = thumbnailInfo.markup;
            }
        }
    }

    placeholdersUpdated() {
        this.activeThumbnailQueueLength--;

        this.handleThumbnailQueue();
    }

    //
    // Drag-select
    //

    getRelativePosition(element, pageX, pageY, startPosition) {
        var absolutePosition = startPosition !== undefined
            ? startPosition
            : $.oc.foundation.element.absolutePosition(element, true);

        return {
            x: (pageX - absolutePosition.left), // There is no horizontal scroll
            y: (pageY - absolutePosition.top + this.scrollContentElement.scrollTop - document.documentElement.scrollTop)
        };
    }

    createSelectionMarker() {
        if (this.selectionMarker) {
            return;
        }

        this.selectionMarker = document.createElement('div');
        this.selectionMarker.setAttribute('data-media-selection-marker', '');

        this.scrollContentElement.insertBefore(this.selectionMarker, this.scrollContentElement.firstChild);
    }

    doObjectsCollide(aTop, aLeft, aWidth, aHeight, bTop, bLeft, bWidth, bHeight) {
        return !(
            ((aTop + aHeight) < (bTop)) ||
            (aTop > (bTop + bHeight)) ||
            ((aLeft + aWidth) < bLeft) ||
            (aLeft > (bLeft + bWidth))
        );
    }

    //
    // Uploading
    //

    initUploader() {
        if (!this.itemListElement || this.config.readOnly) {
            return;
        }

        var uploaderOptions = {
            clickable: this.$el.find('[data-media-upload]').get(0),
            url: this.config.url,
            paramName: 'file_data',
            headers: {},
            timeout: 0,
            createImageThumbnails: false,
            autoProcessQueue: false
            // fallback: implement method that would set a flag that the uploader is not supported by the browser
        };

        if (this.config.uniqueId) {
            uploaderOptions.headers['X-OCTOBER-FILEUPLOAD'] = this.config.uniqueId;
        }

        /*
         * Add CSRF token to headers
         */
        var token = $('meta[name="csrf-token"]').attr('content');
        if (token) {
            uploaderOptions.headers['X-CSRF-TOKEN'] = token;
        }

        this.dropzone = new Dropzone(this.$el.get(0), uploaderOptions);
        this.dropzone.on('addedfile', this.proxy(this.uploadFileAdded));
        this.dropzone.on('totaluploadprogress', this.proxy(this.uploadUpdateTotalProgress));
        this.dropzone.on('queuecomplete', this.proxy(this.uploadQueueComplete));
        this.dropzone.on('sending', this.proxy(this.uploadSending));
        this.dropzone.on('error', this.proxy(this.uploadError));
        this.dropzone.on('success', this.proxy(this.uploadSuccess));
    }

    destroyUploader() {
        if (!this.dropzone) {
            return;
        }

        this.dropzone.destroy();
        this.dropzone = null;
    }

    uploadFileAdded() {
        this.showUploadUi();
        this.setUploadProgress(0);

        this.$el.find('[data-command="cancel-uploading"]').removeClass('oc-hide');
        this.$el.find('[data-command="close-uploader"]').addClass('oc-hide');

        // Batch file additions and check for conflicts after a short delay
        clearTimeout(this.uploadCheckTimeout);
        this.uploadCheckTimeout = setTimeout(this.proxy(this.checkFilesBeforeUpload), 100);
    }

    checkFilesBeforeUpload() {
        var self = this,
            queuedFiles = this.dropzone.getQueuedFiles(),
            fileNames = queuedFiles.map(function(f) { return f.name; }),
            path = this.$el.find('[data-type="current-folder"]').val();

        if (queuedFiles.length === 0) {
            return;
        }

        // Check which files already exist
        this.$el.request('onCheckFilesExist', {
            data: { file_names: fileNames, path: path },
            success: function(data) {
                if (data.existing && data.existing.length > 0) {
                    self.showOverwriteConfirmation(data.existing, queuedFiles);
                }
                else {
                    // No conflicts, proceed with upload
                    self.dropzone.processQueue();
                }
            },
            error: function() {
                // On error, proceed anyway (server will validate)
                self.dropzone.processQueue();
            }
        });
    }

    showOverwriteConfirmation(existingFiles, queuedFiles) {
        var self = this,
            message = this.config.overwriteConfirm + ' (' + existingFiles.join(', ') + ')';

        oc.confirm(message, function(confirmed) {
            if (confirmed) {
                // Mark for overwrite and process queue
                self.forceOverwrite = true;
                self.dropzone.processQueue();
            }
            else {
                // Remove conflicting files from queue, upload the rest
                var existingSet = {};
                existingFiles.forEach(function(name) { existingSet[name] = true; });

                queuedFiles.forEach(function(file) {
                    if (existingSet[file.name]) {
                        self.dropzone.removeFile(file);
                    }
                });

                // Process remaining files if any
                if (self.dropzone.getQueuedFiles().length > 0) {
                    self.dropzone.processQueue();
                }
                else {
                    self.hideUploadUi();
                }
            }
        });
    }

    showUploadUi() {
        this.$el.find('[data-media-upload-ui]').removeClass('oc-hide');
    }

    hideUploadUi() {
        this.$el.find('[data-media-upload-ui]').addClass('oc-hide');
    }

    uploadUpdateTotalProgress(uploadProgress, totalBytes, totalBytesSent) {
        this.setUploadProgress(uploadProgress);

        var fileNumberLabel = this.$el.get(0).querySelector('[data-label="file-number-and-progress"]'),
            messageTemplate = fileNumberLabel.getAttribute('data-message-template'),
            fileNumber = this.dropzone.getUploadingFiles().length + this.dropzone.getQueuedFiles().length;

        // Don't confuse users with displaying 100%
        // until the operation finishes. We consider the operation
        // finished when the Dropzone's 'compete' event triggers -
        // when the response is received from the server.
        if (uploadProgress >= 100) {
            uploadProgress = 99;
        }

        fileNumberLabel.innerHTML = messageTemplate.replace(':number', fileNumber).replace(':percents', Math.round(uploadProgress) + '%');
    }

    setUploadProgress(value) {
        var progressBar = this.$el.get(0).querySelector('[data-media-upload-progress-bar]');

        progressBar.setAttribute('style', 'width: ' + value + '%');
        progressBar.setAttribute('class', 'progress-bar');
    }

    uploadQueueComplete() {
        this.$el.find('[data-command="cancel-uploading"]').addClass('oc-hide');
        this.$el.find('[data-command="close-uploader"]').removeClass('oc-hide');

        // Reset overwrite flag
        this.forceOverwrite = false;

        this.refresh();
    }

    uploadSending(file, xhr, formData) {
        formData.append('path', this.$el.find('[data-type="current-folder"]').val());

        if (this.forceOverwrite) {
            formData.append('force_overwrite', '1');
        }
    }

    uploadCancelAll() {
        this.dropzone.removeAllFiles(true);
        this.hideUploadUi();
    }

    updateUploadBar(templateName, classNames) {
        var fileNumberLabel = this.$el.get(0).querySelector('[data-label="file-number-and-progress"]'),
            successTemplate = fileNumberLabel.getAttribute('data-' + templateName + '-template'),
            progressBar = this.$el.get(0).querySelector('[data-media-upload-progress-bar]');

        fileNumberLabel.innerHTML = successTemplate;
        progressBar.setAttribute('class', classNames);
    }

    uploadSuccess() {
        this.updateUploadBar('success', 'progress-bar bg-success');
    }

    uploadError(file, message) {
        this.updateUploadBar('error', 'progress-bar bg-danger');

        if (!message) {
            message = 'Error uploading file';
        }

        oc.alert(message);
    }

    //
    // Cropping images
    //

    cropSelectedImage(callback) {
        var selectedItems = this.getSelectedItems(true);

        if (selectedItems.length != 1) {
            alert(this.config.selectSingleImage);
            return;
        }

        if (selectedItems[0].getAttribute('data-document-type') !== 'image') {
            alert(this.config.selectionNotImage);
            return;
        }

        var path = selectedItems[0].getAttribute('data-path');

        new oc.mediaManager.imageCropPopup(path, {
            alias: this.config.alias,
            onDone: callback
        });
    }

    onImageCropped(result) {
        this.$el.trigger('popupcommand', ['insert-cropped', result]);
    }

    //
    // Search
    //

    clearSearchTrackInputTimer() {
        if (this.searchTrackInputTimer === null) {
            return;
        }

        clearTimeout(this.searchTrackInputTimer);
        this.searchTrackInputTimer = null;
    }

    updateSearchResults() {
        var $searchField = this.$el.find('[data-media-search]'),
            data = {
                search: $searchField.val()
            };

        this.execNavigationRequest('onSearch', data, $searchField);
    }

    resetSearch() {
        this.$el.find('[data-media-search]').val('');
    }

    onSearchChanged(ev) {
        var value = ev.currentTarget.value;

        if (this.lastSearchValue !== undefined && this.lastSearchValue == value) {
            return;
        }

        this.lastSearchValue = value;

        this.clearSearchTrackInputTimer();

        this.searchTrackInputTimer = window.setTimeout(this.proxy(this.updateSearchResults), 300);
    }

    //
    // File and folder operations
    //

    deleteItems() {
        var items = this.$el.get(0).querySelectorAll('[data-type="media-item"].selected');

        if (!items.length) {
            oc.alert(this.config.deleteEmpty);
            return;
        }

        oc.confirm(this.config.deleteConfirm, this.proxy(this.deleteConfirmation));
    }

    deleteConfirmation(isConfirm) {
        if (!isConfirm) {
            return;
        }

        var items = this.$el.get(0).querySelectorAll('[data-type="media-item"].selected'),
            paths = []

        for (var i=0, len=items.length; i<len; i++) {
            // Skip the 'return to parent' item
            if (items[i].hasAttribute('data-root')) {
                continue;
            }
            paths.push({
                'path': items[i].getAttribute('data-path'),
                'type': items[i].getAttribute('data-item-type')
            });
        }

        var data = {
            paths: paths
        };

        $.oc.stripeLoadIndicator.show();
        this.$form
            .request(this.config.alias+'::onDeleteItem', {
                data: data
            })
            .always(function() {
                $.oc.stripeLoadIndicator.hide()
            })
            .done(this.proxy(this.afterNavigate));
    }

    createFolder(ev) {
        $(ev.target).popup({
            content: this.$el.find('[data-media-new-folder-template]').html()
        });
    }

    onFolderPopupShown(ev, button, popup) {
        $(popup).find('input[name=name]').focus();
        $(popup).on('submit.media', 'form', this.proxy(this.onNewFolderSubmit));
    }

    onFolderPopupHidden(ev, button, popup) {
        $(popup).off('.media', 'form');
    }

    onNewFolderSubmit(ev) {
        var data = {
            name: $(ev.target).find('input[name=name]').val(),
            path: this.$el.find('[data-type="current-folder"]').val()
        };

        $.oc.stripeLoadIndicator.show();
        this.$form.request(this.config.alias+'::onCreateFolder', {
            data: data
        }).always(function() {
            $.oc.stripeLoadIndicator.hide()
        }).done(this.proxy(this.folderCreated));

        ev.preventDefault();
        return false;
    }

    folderCreated() {
        this.$el.find('button[data-command="create-folder"]').popup('hide');
        this.afterNavigate();
    }

    moveItems(ev) {
        var items = this.$el.get(0).querySelectorAll('[data-type="media-item"].selected');

        if (!items.length) {
            oc.alert(this.config.moveEmpty);
            return;
        }

        var data = {
            exclude: [],
            path: this.$el.find('[data-type="current-folder"]').val()
        };

        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i],
                path = item.getAttribute('data-path');

            if (item.getAttribute('data-item-type') == 'folder') {
                data.exclude.push(path);
            }
        }

        $(ev.target).popup({
            handler: this.config.alias+'::onLoadMovePopup',
            extraData: data
        });
    }

    onMovePopupShown(ev, button, popup) {
        $(popup).on('submit.media', 'form', this.proxy(this.onMoveItemsSubmit));
    }

    onMoveItemsSubmit(ev) {
        var items = this.$el.get(0).querySelectorAll('[data-type="media-item"].selected'),
            data = {
                dest: $(ev.target).find('select[name=dest]').val(),
                originalPath: $(ev.target).find('input[name=originalPath]').val(),
                files: [],
                folders: []
            };

        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i],
                path = item.getAttribute('data-path');


            if (item.getAttribute('data-item-type') == 'folder') {
                data.folders.push(path);
            }
            else {
                data.files.push(path);
            }
        }

        $.oc.stripeLoadIndicator.show();
        this.$form.request(this.config.alias+'::onMoveItems', {
                data: data
            })
            .always(function() {
                $.oc.stripeLoadIndicator.hide();
            })
            .done(this.proxy(this.itemsMoved));

        ev.preventDefault();
        return false;
    }

    onMovePopupHidden(ev, button, popup) {
        $(popup).off('.media', 'form');
    }

    itemsMoved() {
        this.$el.find('button[data-command="move"]').popup('hide');
        this.afterNavigate();
    }

    // EVENT HANDLERS
    // ============================

    onNavigate(ev) {
        var $item = $(ev.target).closest('[data-type="media-item"]');

        this.navigateToItem($item);

        if ($(ev.target).data('label') != 'public-url') {
            return false;
        }
    }

    onCommandClick(ev) {
        var command = $(ev.currentTarget).data('command');

        switch (command) {
            case 'refresh':
                this.refresh();
            break;
            case 'change-view':
                this.changeView($(ev.currentTarget).data('view'));
            break;
            case 'cancel-uploading':
                this.uploadCancelAll();
            break;
            case 'close-uploader':
                this.hideUploadUi();
            break;
            case 'set-filter':
                this.setFilter($(ev.currentTarget).data('filter'));
            break;
            case 'delete':
                this.deleteItems();
            break;
            case 'create-folder':
                this.createFolder(ev);
            break;
            case 'move':
                this.moveItems(ev);
            break;
            case 'toggle-sidebar':
                this.toggleSidebar(ev);
            break;
            case 'popup-command':
                var popupCommand = $(ev.currentTarget).data('popup-command');

                if (popupCommand !== 'crop-and-insert') {
                    this.$el.trigger('popupcommand', [popupCommand]);
                }
                else {
                    this.cropSelectedImage(this.proxy(this.onImageCropped));
                }
            break;
        }

        return false;
    }

    onItemClick(ev) {
        // Don't select items when the rename icon is clicked
        if (ev.target.tagName == 'I' && ev.target.hasAttribute('data-rename-control')) {
            return;
        }

        this.selectItem(ev.currentTarget, ev.shiftKey);
    }

    onItemTouch(ev) {
        // The 'click' event is triggered after 'touchend',
        // so we can prevent handling it.
        ev.preventDefault();
        ev.stopPropagation();

        if (this.dblTouchFlag) {
            this.onNavigate(ev);
            this.dblTouchFlag = null;
        }
        else {
            this.onItemClick(ev);
            this.dblTouchFlag = true;
        }

        this.clearDblTouchTimer();

        this.dblTouchTimer = setTimeout(this.proxy(this.clearDblTouchFlag), 300);
    }

    onListMouseDown(ev) {
        this.itemListElement.addEventListener('mousemove', this.proxy(this.onListMouseMove));
        document.addEventListener('mouseup', this.proxy(this.onListMouseUp));

        this.itemListPosition = $.oc.foundation.element.absolutePosition(this.itemListElement, true);

        var pagePosition = $.oc.foundation.event.pageCoordinates(ev),
            relativePosition = this.getRelativePosition(this.itemListElement, pagePosition.x, pagePosition.y, this.itemListPosition);

        this.selectionStartPoint = relativePosition;
        this.selectionStarted = false;
    }

    onListMouseUp(ev) {
        this.itemListElement.removeEventListener('mousemove', this.proxy(this.onListMouseMove));
        document.removeEventListener('mouseup', this.proxy(this.onListMouseUp));
        $(document.body).removeClass('no-select');

        if (this.selectionStarted) {
            this.unselectRoot();

            var items = this.itemListElement.querySelectorAll('[data-type="media-item"]:not([data-root])'),
                selectionPosition = $.oc.foundation.element.absolutePosition(this.selectionMarker, true);

            for (var index = 0, len = items.length; index < len; index++) {
                var item = items[index],
                    itemPosition = $.oc.foundation.element.absolutePosition(item, true);

                if (this.doObjectsCollide(
                    selectionPosition.top,
                    selectionPosition.left,
                    this.selectionMarker.offsetWidth,
                    this.selectionMarker.offsetHeight,
                    itemPosition.top,
                    itemPosition.left,
                    item.offsetWidth,
                    item.offsetHeight
                )) {
                    if (!ev.shiftKey) {
                        item.setAttribute('class', 'selected');
                    }
                    else {
                        if (item.getAttribute('class') == 'selected') {
                            item.setAttribute('class', '');
                        }
                        else {
                            item.setAttribute('class', 'selected');
                        }
                    }
                }
                else if (!ev.shiftKey) {
                    item.setAttribute('class', '');
                }
            }

            this.updateSidebarPreview();
            this.selectionMarker.setAttribute('class', 'oc-hide');
        }

        this.selectionStarted = false;
    }

    onListMouseMove(ev) {
        var pagePosition = $.oc.foundation.event.pageCoordinates(ev),
            relativePosition = this.getRelativePosition(this.itemListElement, pagePosition.x, pagePosition.y, this.itemListPosition);

        var deltaX = relativePosition.x - this.selectionStartPoint.x,
            deltaY = relativePosition.y - this.selectionStartPoint.y;

        if (!this.selectionStarted && (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2)) {
            // Start processing the selection only if the mouse was moved by at least 2 pixels.
            this.createSelectionMarker();

            this.selectionMarker.setAttribute('class', '');
            this.selectionStarted = true;
            $(document.body).addClass('no-select');
        }

        if (this.selectionStarted) {
            if (deltaX >= 0) {
                this.selectionMarker.style.left = this.selectionStartPoint.x + 'px';
                this.selectionMarker.style.width = deltaX + 'px';
            }
            else {
                this.selectionMarker.style.left = relativePosition.x + 'px';
                this.selectionMarker.style.width = Math.abs(deltaX) + 'px';
            }

            if (deltaY >= 0) {
                this.selectionMarker.style.height = deltaY + 'px';
                this.selectionMarker.style.top = this.selectionStartPoint.y + 'px';
            }
            else {
                this.selectionMarker.style.top = relativePosition.y + 'px';
                this.selectionMarker.style.height = Math.abs(deltaY) + 'px';
            }
        }
    }

    onSortingChanged(ev) {
        var $target = $(ev.target),
            data = {
                path: this.$el.find('[data-type="current-folder"]').val()
            };

        if ($target.data('sort') == 'by') {
            data.sortBy = $target.val();
        }
        else if ($target.data('sort') == 'direction') {
            data.sortDirection = $target.val();
        }

        this.execNavigationRequest('onSetSorting', data);
    }

    onKeyDown(ev) {
        var eventHandled = false;

        switch (ev.key) {
            case 'Enter':
                var items = this.getSelectedItems(true, true);
                if (items.length > 0) {
                    this.navigateToItem($(items[0]));
                }
                eventHandled = true;
            break;
            case 'ArrowRight':
            case 'ArrowDown':
                this.selectRelative(true, ev.shiftKey);
                eventHandled = true;
            break;
            case 'ArrowLeft':
            case 'ArrowUp':
                this.selectRelative(false, ev.shiftKey);
                eventHandled = true;
            break;
        }

        if (eventHandled) {
            ev.preventDefault();
            ev.stopPropagation();
        }
    }
});
