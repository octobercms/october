/*
 * Media manager control class
 *
 * Dependences:
 * - Scrollpad (october.scrollpad.js)
 */
+function ($) { "use strict";

    if ($.oc.mediaManager === undefined)
        $.oc.mediaManager = {}

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    // MEDIA MANAGER CLASS DEFINITION
    // ============================

    var MediaManager = function(element, options) {
        this.$el = $(element)
        this.$form = this.$el.closest('form')

        this.options = options
        Base.call(this)

        // State properties
        this.selectTimer = null
        this.sidebarPreviewElement = null
        this.itemListElement = null
        this.scrollContentElement = null
        this.thumbnailQueue = []
        this.activeThumbnailQueueLength = 0
        this.sidebarThumbnailAjax = null
        this.selectionMarker = null
        this.dropzone = null
        this.searchTrackInputTimer = null
        this.navigationAjax = null
        this.dblTouchTimer = null
        this.dblTouchFlag = null
        this.itemListPosition = null

        //
        // Initialization
        //

        this.init()
    }

    MediaManager.prototype = Object.create(BaseProto)
    MediaManager.prototype.constructor = MediaManager

    MediaManager.prototype.dispose = function() {
        this.unregisterHandlers()
        this.clearSelectTimer()
        this.destroyUploader()
        this.clearSearchTrackInputTimer()
        this.releaseNavigationAjax()
        this.clearDblTouchTimer()
        this.removeAttachedControls()
        this.removeScroll()

        this.$el.removeData('oc.mediaManager')
        this.$el = null
        this.$form = null

        this.sidebarPreviewElement = null
        this.itemListElement = null
        this.scrollContentElement = null
        this.sidebarThumbnailAjax = null
        this.selectionMarker = null
        this.thumbnailQueue = []
        this.navigationAjax = null

        BaseProto.dispose.call(this)
    }

    MediaManager.prototype.getSelectedItems = function(returnNotProcessed, allowRootItem) {
        var items = this.$el.get(0).querySelectorAll('[data-type="media-item"].selected'),
            result = []

        if (!allowRootItem) {
            var filteredItems = []

            for (var i=0, len=items.length; i < len; i++) {
                var item = items[i]
                if (!item.hasAttribute('data-root'))
                    filteredItems.push(item)
            }

            items = filteredItems
        }

        if (returnNotProcessed === true)
            return items

        for (var i=0, len=items.length; i < len; i++) {
            var item = items[i],
                itemDetails = {
                    itemType: item.getAttribute('data-item-type'),
                    path: item.getAttribute('data-path'),
                    title: item.getAttribute('data-title'),
                    documentType: item.getAttribute('data-document-type'),
                    folder: item.getAttribute('data-folder'),
                    publicUrl: item.getAttribute('data-public-url')
                }

            result.push(itemDetails)
        }

        return result
    }

    // MEDIA MANAGER INTERNAL METHODS
    // ============================

    MediaManager.prototype.init = function() {
        this.itemListElement = this.$el.find('[data-control="item-list"]').get(0)
        this.scrollContentElement = this.itemListElement.querySelector('.scroll-wrapper')

        if (this.options.bottomToolbar) {
            this.$el.find('[data-control="bottom-toolbar"]').removeClass('hide')

            if (this.options.cropAndInsertButton)
                this.$el.find('[data-popup-command="crop-and-insert"]').removeClass('hide')
        }

        this.registerHandlers()

        this.updateSidebarPreview()
        this.generateThumbnails()
        this.initUploader()
        this.initScroll()
    }

    MediaManager.prototype.registerHandlers = function() {
        this.$el.on('dblclick', this.proxy(this.onNavigate))
        this.$el.on('click.tree-path', 'ul.tree-path, [data-control="sidebar-labels"]', this.proxy(this.onNavigate))

        this.$el.on('click.command', '[data-command]', this.proxy(this.onCommandClick))

        // Touch devices use double-tap for the navigation and single tap for selecting.
        // Another option is checkboxes visible only on touch devices, but this approach
        // will require more significant changes in the code for the touch device support.
        this.$el.on('click.item', '[data-type="media-item"]', this.proxy(this.onItemClick))
        this.$el.on('touchend', '[data-type="media-item"]', this.proxy(this.onItemTouch))

        this.$el.on('change', '[data-control="sorting"]', this.proxy(this.onSortingChanged))
        this.$el.on('keyup', '[data-control="search"]', this.proxy(this.onSearchChanged))
        this.$el.on('mediarefresh', this.proxy(this.refresh))
        this.$el.on('shown.oc.popup', '[data-command="create-folder"]', this.proxy(this.onFolderPopupShown))
        this.$el.on('hidden.oc.popup', '[data-command="create-folder"]', this.proxy(this.onFolderPopupHidden))
        this.$el.on('shown.oc.popup', '[data-command="move"]', this.proxy(this.onMovePopupShown))
        this.$el.on('hidden.oc.popup', '[data-command="move"]', this.proxy(this.onMovePopupHidden))
        this.$el.on('keydown', this.proxy(this.onKeyDown))

        if (this.itemListElement)
            this.itemListElement.addEventListener('mousedown', this.proxy(this.onListMouseDown))
    }

    MediaManager.prototype.unregisterHandlers = function() {
        this.$el.off('dblclick', this.proxy(this.onNavigate))
        this.$el.off('click.tree-path', this.proxy(this.onNavigate))
        this.$el.off('click.command', this.proxy(this.onCommandClick))

        this.$el.off('click.item', this.proxy(this.onItemClick))
        this.$el.off('touchend', '[data-type="media-item"]', this.proxy(this.onItemTouch))

        this.$el.off('change', '[data-control="sorting"]', this.proxy(this.onSortingChanged))
        this.$el.off('keyup', '[data-control="search"]', this.proxy(this.onSearchChanged))
        this.$el.off('shown.oc.popup', '[data-command="create-folder"]', this.proxy(this.onFolderPopupShown))
        this.$el.off('hidden.oc.popup', '[data-command="create-folder"]', this.proxy(this.onFolderPopupHidden))
        this.$el.off('shown.oc.popup', '[data-command="move"]', this.proxy(this.onMovePopupShown))
        this.$el.off('hidden.oc.popup', '[data-command="move"]', this.proxy(this.onMovePopupHidden))
        this.$el.off('keydown', this.proxy(this.onKeyDown))

        if (this.itemListElement) {
            this.itemListElement.removeEventListener('mousedown', this.proxy(this.onListMouseDown))
            this.itemListElement.removeEventListener('mousemove', this.proxy(this.onListMouseMove))
        }

        document.removeEventListener('mouseup', this.proxy(this.onListMouseUp))
    }

    MediaManager.prototype.changeView = function(view) {
        var data = {
            view: view,
            path: this.$el.find('[data-type="current-folder"]').val()
        }

        this.execNavigationRequest('onChangeView', data)
    }

    MediaManager.prototype.setFilter = function(filter) {
        var data = {
            filter: filter,
            path: this.$el.find('[data-type="current-folder"]').val()
        }

        this.execNavigationRequest('onSetFilter', data)
    }

    MediaManager.prototype.isSearchMode = function() {
        return this.$el.find('[data-type="search-mode"]').val() == 'true' 
    }

    MediaManager.prototype.initScroll = function() {
        this.$el.find('.control-scrollpad').scrollpad()
    }

    MediaManager.prototype.updateScroll = function() {
        this.$el.find('.control-scrollpad').scrollpad('update')
    }

    MediaManager.prototype.removeScroll = function() {
        this.$el.find('.control-scrollpad').scrollpad('dispose')
    }

    MediaManager.prototype.scrollToTop = function() {
        this.$el.find('.control-scrollpad').scrollpad('scrollToStart')
    }

    //
    // Disposing
    //

    MediaManager.prototype.removeAttachedControls = function() {
        this.$el.find('[data-control=toolbar]').toolbar('dispose')
        this.$el.find('[data-control=sorting]').select2('destroy')
    }

    //
    // Selecting
    //

    MediaManager.prototype.clearSelectTimer = function() {
        if (this.selectTimer === null)
            return

        clearTimeout(this.selectTimer)
        this.selectTimer = null
    }

    MediaManager.prototype.selectItem = function(node, expandSelection) {
        if (!expandSelection) {
            var items = this.$el.get(0).querySelectorAll('[data-type="media-item"].selected')

            // The class attribute is used only for selecting, it's safe to clear it
            for (var i = 0, len = items.length; i < len; i++) {
                items[i].setAttribute('class', '')
            }

            node.setAttribute('class', 'selected')
        }
        else {
            if (node.getAttribute('class') == 'selected')
                node.setAttribute('class', '')
            else
                node.setAttribute('class', 'selected')
        }

        node.focus()

        this.clearSelectTimer()

        if (this.isPreviewSidebarVisible()) {
            // Use the timeout to prevent too many AJAX requests
            // when the selection changes too quickly (with the keyboard arrows)
            this.selectTimer = setTimeout(this.proxy(this.updateSidebarPreview), 100) 
        }

        // Disable delete and move buttons
        if (node.hasAttribute('data-root') && !expandSelection) {
            this.toggleMoveAndDelete(true)
        }
        else {
            this.toggleMoveAndDelete(false)
        }

        // Always unselect root when selecting multiples
        if (expandSelection) {
            this.unselectRoot()
        }
    }

    MediaManager.prototype.toggleMoveAndDelete = function(value) {
        $('[data-command=delete]', this.$el).prop('disabled', value)
        $('[data-command=move]', this.$el).prop('disabled', value)
    }

    MediaManager.prototype.unselectRoot = function() {
        var rootItem = this.$el.get(0).querySelector('[data-type="media-item"][data-root].selected')

        if (rootItem)
            rootItem.setAttribute('class', '')
    }

    MediaManager.prototype.clearDblTouchTimer = function() {
        if (this.dblTouchTimer === null)
            return

        clearTimeout(this.dblTouchTimer)
        this.dblTouchTimer = null
    }

    MediaManager.prototype.clearDblTouchFlag = function() {
        this.dblTouchFlag = false
    }

    MediaManager.prototype.selectFirstItem = function() {
        var firstItem = this.itemListElement.querySelector('[data-type="media-item"]:first-child')
        if (firstItem) {
            this.selectItem(firstItem)
        }
    }

    MediaManager.prototype.selectRelative = function(next, expandSelection) {
        var currentSelection = this.getSelectedItems(true, true)

        if (currentSelection.length == 0) {
            this.selectFirstItem()

            return
        }

        var itemToSelect = null
        if (next) {
            var lastItem = currentSelection[currentSelection.length-1]

            if (lastItem)
                itemToSelect = lastItem.nextElementSibling
        }
        else {
            var firstItem = currentSelection[0]

            if (firstItem)
                itemToSelect = firstItem.previousElementSibling
        }

        if (itemToSelect)
            this.selectItem(itemToSelect, expandSelection)
    }

    //
    // Navigation
    //

    MediaManager.prototype.gotoFolder = function(path, resetSearch) {
        var data = {
                path: path,
                resetSearch: resetSearch !== undefined ? 1 : 0
            }

        this.execNavigationRequest('onGoToFolder', data)
    }

    MediaManager.prototype.afterNavigate = function() {
        this.scrollToTop()
        this.generateThumbnails()
        this.updateSidebarPreview(true)
        this.selectFirstItem()
        this.updateScroll()
    }

    MediaManager.prototype.refresh = function() {
        var data = {
                path: this.$el.find('[data-type="current-folder"]').val(),
                clearCache: true
            }

        this.execNavigationRequest('onGoToFolder', data)
    }

    MediaManager.prototype.execNavigationRequest = function(handler, data, element)
    {
        if (element === undefined)
            element = this.$form

        if (this.navigationAjax !== null) {
            try {
                this.navigationAjax.abort()
            }
            catch (e) {}
            this.releaseNavigationAjax()
        }

        $.oc.stripeLoadIndicator.show()
        this.navigationAjax = element.request(this.options.alias+'::' + handler, {
            data: data
        }).always(function() {
            $.oc.stripeLoadIndicator.hide()
        })
            .done(this.proxy(this.afterNavigate))
            .always(this.proxy(this.releaseNavigationAjax))
    }

    MediaManager.prototype.releaseNavigationAjax = function() {
        this.navigationAjax = null
    }

    MediaManager.prototype.navigateToItem = function($item) {
        if (!$item.length || !$item.data('path').length)
            return

        if ($item.data('item-type') == 'folder') {
            if (!$item.data('clear-search'))
                this.gotoFolder($item.data('path'))
            else {
                this.resetSearch()
                this.gotoFolder($item.data('path'), true)
            }
        } 
        else if ($item.data('item-type') == 'file') {
            // Trigger the Insert popup command if a file item
            // was double clicked or Enter key was pressed.
            this.$el.trigger('popupcommand', ['insert'])
        }
    }

    //
    // Sidebar
    //

    MediaManager.prototype.isPreviewSidebarVisible = function() {
        return !this.$el.find('[data-control="preview-sidebar"]').hasClass('hide')
    }

    MediaManager.prototype.toggleSidebar = function(ev) {
        var isVisible = this.isPreviewSidebarVisible(),
            $sidebar = this.$el.find('[data-control="preview-sidebar"]'),
            $button = $(ev.target)

        if (!isVisible) {
            $sidebar.removeClass('hide')
            this.updateSidebarPreview()
            $button.removeClass('sidebar-hidden')
        } 
        else {
            $sidebar.addClass('hide')
            $button.addClass('sidebar-hidden')
        }

        this.$form.request(this.options.alias+'::onSetSidebarVisible', {
            data: {
                visible: (isVisible ? 0 : 1)
            }
        })
    }

    MediaManager.prototype.updateSidebarMediaPreview = function(items) {
        var previewPanel = this.sidebarPreviewElement,
            previewContainer = previewPanel.querySelector('[data-control="media-preview-container"]'),
            template = ''

        for (var i = 0, len = previewContainer.children.length; i < len; i++) {
            previewContainer.removeChild(previewContainer.children[i])
        }

        // Single item selected
        if (items.length == 1 && !items[0].hasAttribute('data-root')) {
            var item = items[0],
                documentType = item.getAttribute('data-document-type')

            switch (documentType) {
                case 'audio' :
                    template = previewPanel.querySelector('[data-control="audio-template"]').innerHTML
                break;
                case 'video' :
                    template = previewPanel.querySelector('[data-control="video-template"]').innerHTML
                break;
                case 'image' :
                    template = previewPanel.querySelector('[data-control="image-template"]').innerHTML
                break;
            }

            previewContainer.innerHTML = template
                .replace('{src}', item.getAttribute('data-public-url'))
                .replace('{path}', item.getAttribute('data-path'))
                .replace('{last-modified}', item.getAttribute('data-last-modified-ts'))

            if (documentType == 'image')
                this.loadSidebarThumbnail()
        }
        // "Go up" is selected
        else if (items.length == 1 && items[0].hasAttribute('data-root')) {
            template = previewPanel.querySelector('[data-control="go-up"]').innerHTML
            previewContainer.innerHTML = template
        }
        // No selection
        else if (items.length == 0) {
            template = previewPanel.querySelector('[data-control="no-selection-template"]').innerHTML
            previewContainer.innerHTML = template
        }
        // Multiple selection
        else {
            template = previewPanel.querySelector('[data-control="multi-selection-template"]').innerHTML
            previewContainer.innerHTML = template
        }
    }

    MediaManager.prototype.updateSidebarPreview = function(resetSidebar) {
        if (!this.sidebarPreviewElement)
            this.sidebarPreviewElement = this.$el.get(0).querySelector('[data-control="preview-sidebar"]')

        var items = resetSidebar === undefined ? this.$el.get(0).querySelectorAll('[data-type="media-item"].selected') : [],
            previewPanel = this.sidebarPreviewElement

        // No items are selected
        if (items.length == 0) {
            this.sidebarPreviewElement.querySelector('[data-control="sidebar-labels"]').setAttribute('class', 'hide')
        }
        // One item is selected - display the details
        else if (items.length == 1 && !items[0].hasAttribute('data-root')) {
            this.sidebarPreviewElement.querySelector('[data-control="sidebar-labels"]').setAttribute('class', 'panel')

            var item = items[0],
                lastModified = item.getAttribute('data-last-modified')

            previewPanel.querySelector('[data-label="size"]').textContent = item.getAttribute('data-size')
            previewPanel.querySelector('[data-label="title"]').textContent = item.getAttribute('data-title')
            previewPanel.querySelector('[data-label="last-modified"]').textContent = lastModified
            previewPanel.querySelector('[data-label="public-url"]').setAttribute('href', item.getAttribute('data-public-url'))

            if (lastModified)
                previewPanel.querySelector('[data-control="last-modified"]').setAttribute('class', '')
            else
                previewPanel.querySelector('[data-control="last-modified"]').setAttribute('class', 'hide')

            if (this.isSearchMode()) {
                previewPanel.querySelector('[data-control="item-folder"]').setAttribute('class', '')
                var folderNode = previewPanel.querySelector('[data-label="folder"]')
                folderNode.textContent = item.getAttribute('data-folder')
                folderNode.setAttribute('data-path', item.getAttribute('data-folder'))
            }
            else {
                previewPanel.querySelector('[data-control="item-folder"]').setAttribute('class', 'hide')
            }
        }
        // Multiple items are selected or "Go up" is selected
        else {
            this.sidebarPreviewElement.querySelector('[data-control="sidebar-labels"]').setAttribute('class', 'hide')
        }

        this.updateSidebarMediaPreview(items)
    }

    MediaManager.prototype.loadSidebarThumbnail = function() {
        if (this.sidebarThumbnailAjax) {
            try {
                this.sidebarThumbnailAjax.abort()
            }
            catch (e) {}
            this.sidebarThumbnailAjax = null
        }

        var sidebarThumbnail = this.sidebarPreviewElement.querySelector('[data-control="sidebar-thumbnail"]')
        if (!sidebarThumbnail)
            return

        var data = {
            path: sidebarThumbnail.getAttribute('data-path'),
            lastModified: sidebarThumbnail.getAttribute('data-last-modified')
        }

        this.sidebarThumbnailAjax = this.$form.request(this.options.alias+'::onGetSidebarThumbnail', {
            data: data
        })
            .done(this.proxy(this.replaceSidebarPlaceholder))
            .always(this.proxy(this.releaseSidebarThumbnailAjax))
    }

    MediaManager.prototype.replaceSidebarPlaceholder = function(response) {
        if (!this.sidebarPreviewElement)
            return

        var sidebarThumbnail = this.sidebarPreviewElement.querySelector('[data-control="sidebar-thumbnail"]')
        if (!sidebarThumbnail)
            return

        if (!response.markup)
            return

        sidebarThumbnail.innerHTML = response.markup
        sidebarThumbnail.removeAttribute('data-loading')
    }

    MediaManager.prototype.releaseSidebarThumbnailAjax = function() {
        this.sidebarThumbnailAjax = null
    }

    //
    // Thumbnails
    //

    MediaManager.prototype.generateThumbnails = function() {
        this.thumbnailQueue = []

        var placeholders = this.itemListElement.querySelectorAll('[data-type="media-item"] div.image-placeholder')
        for (var i = (placeholders.length-1); i >= 0; i--)
            this.thumbnailQueue.push({
                id: placeholders[i].getAttribute('id'),
                width: placeholders[i].getAttribute('data-width'), 
                height: placeholders[i].getAttribute('data-height'), 
                path: placeholders[i].getAttribute('data-path'),
                lastModified: placeholders[i].getAttribute('data-last-modified')
            })

        this.handleThumbnailQueue()
    }

    MediaManager.prototype.handleThumbnailQueue = function() {
        var maxThumbnailQueueLength = 2,
            maxThumbnailBatchLength = 3

        if (this.activeThumbnailQueueLength >= maxThumbnailQueueLength)
            return

        for (var i = this.activeThumbnailQueueLength; i < maxThumbnailQueueLength && this.thumbnailQueue.length > 0; i++) {
            var batch = []

            for (var j = 0; j < maxThumbnailBatchLength && this.thumbnailQueue.length > 0; j++)
                batch.push(this.thumbnailQueue.pop())

            this.activeThumbnailQueueLength++

            this.handleThumbnailBatch(batch).always(this.proxy(this.placeholdersUpdated))
        }
    }

    MediaManager.prototype.handleThumbnailBatch = function(batch) {
        var data = {
            batch: batch
        }

        for (var i = 0, len = batch.length; i < len; i++) {
            var placeholder = document.getElementById(batch[i].id)
            if (placeholder)
                placeholder.setAttribute('data-loading', 'true')
        }

        var promise = this.$form.request(this.options.alias+'::onGenerateThumbnails', {
            data: data
        })

        promise.done(this.proxy(this.replacePlaceholder))

        return promise
    }

    MediaManager.prototype.replacePlaceholder = function(response) {
        if (!response.generatedThumbnails)
            return

        for (var i = 0, len = response.generatedThumbnails.length; i < len; i++) {
            var thumbnailInfo = response.generatedThumbnails[i]

            if (!thumbnailInfo.id || !thumbnailInfo.markup)
                continue

            var node = document.getElementById(thumbnailInfo.id)
            if (!node)
                continue

            var placeholderContainer = node.parentNode
            if (placeholderContainer)
                placeholderContainer.innerHTML = thumbnailInfo.markup
        }
    }

    MediaManager.prototype.placeholdersUpdated = function() {
        this.activeThumbnailQueueLength--

        this.handleThumbnailQueue()
    }

    //
    // Drag-select
    //

    MediaManager.prototype.getRelativePosition = function(element, pageX, pageY, startPosition) {
        var absolutePosition = startPosition !== undefined ? startPosition : $.oc.foundation.element.absolutePosition(element, true)

        return {
            x: (pageX - absolutePosition.left), // There is no horizontal scroll
            y: (pageY - absolutePosition.top + this.scrollContentElement.scrollTop)
        }
    }

    MediaManager.prototype.createSelectionMarker = function() {
        if (this.selectionMarker)
            return

        this.selectionMarker = document.createElement('div')
        this.selectionMarker.setAttribute('data-control', 'selection-marker')

        this.scrollContentElement.insertBefore(this.selectionMarker, this.scrollContentElement.firstChild)
    }

    MediaManager.prototype.doObjectsCollide = function(aTop, aLeft, aWidth, aHeight, bTop, bLeft, bWidth, bHeight) {
        return !(
            ((aTop + aHeight) < (bTop)) ||
            (aTop > (bTop + bHeight)) ||
            ((aLeft + aWidth) < bLeft) ||
            (aLeft > (bLeft + bWidth))
        )
    }

    //
    // Uploading
    //

    MediaManager.prototype.initUploader = function() {
        if (!this.itemListElement)
            return

        var uploaderOptions = {
            clickable: this.$el.find('[data-control="upload"]').get(0),
            url: this.options.url,
            paramName: 'file_data',
            headers: {},
            createImageThumbnails: false
            // fallback: implement method that would set a flag that the uploader is not supported by the browser
        }

        if (this.options.uniqueId) {
            uploaderOptions.headers['X-OCTOBER-FILEUPLOAD'] = this.options.uniqueId
        }

        /*
         * Add CSRF token to headers
         */
        var token = $('meta[name="csrf-token"]').attr('content')
        if (token) {
            uploaderOptions.headers['X-CSRF-TOKEN'] = token
        }

        this.dropzone = new Dropzone(this.$el.get(0), uploaderOptions)
        this.dropzone.on('addedfile', this.proxy(this.uploadFileAdded))
        this.dropzone.on('totaluploadprogress', this.proxy(this.uploadUpdateTotalProgress))
        this.dropzone.on('queuecomplete', this.proxy(this.uploadQueueComplete))
        this.dropzone.on('sending', this.proxy(this.uploadSending))
        this.dropzone.on('error', this.proxy(this.uploadError))
        this.dropzone.on('success', this.proxy(this.uploadSuccess))
    }

    MediaManager.prototype.destroyUploader = function() {
        if (!this.dropzone)
            return

        this.dropzone.destroy()
        this.dropzone = null
    }

    MediaManager.prototype.uploadFileAdded = function() {
        this.showUploadUi()
        this.setUploadProgress(0)

        this.$el.find('[data-command="cancel-uploading"]').removeClass('hide')
        this.$el.find('[data-command="close-uploader"]').addClass('hide')
    }

    MediaManager.prototype.showUploadUi = function() {
        this.$el.find('[data-control="upload-ui"]').removeClass('hide')
    }

    MediaManager.prototype.hideUploadUi = function() {
        this.$el.find('[data-control="upload-ui"]').addClass('hide')
    }

    MediaManager.prototype.uploadUpdateTotalProgress = function(uploadProgress, totalBytes, totalBytesSent) {
        this.setUploadProgress(uploadProgress)

        var fileNumberLabel = this.$el.get(0).querySelector('[data-label="file-number-and-progress"]'),
            messageTemplate = fileNumberLabel.getAttribute('data-message-template'),
            fileNumber = this.dropzone.getUploadingFiles().length + this.dropzone.getQueuedFiles().length

        // Don't confuse users with displaying 100%
        // until the operation finishes. We consider the operation
        // finished when the Dropzone's 'compete' event triggers -
        // when the response is received from the server.
        if (uploadProgress >= 100) {
            uploadProgress = 99
        }

        fileNumberLabel.innerHTML = messageTemplate.replace(':number', fileNumber).replace(':percents', Math.round(uploadProgress) + '%')
    }

    MediaManager.prototype.setUploadProgress = function(value) {
        var progressBar = this.$el.get(0).querySelector('[data-control="upload-progress-bar"]')

        progressBar.setAttribute('style', 'width: ' + value + '%')
        progressBar.setAttribute('class', 'progress-bar')
    }

    MediaManager.prototype.uploadQueueComplete = function() {
        this.$el.find('[data-command="cancel-uploading"]').addClass('hide')
        this.$el.find('[data-command="close-uploader"]').removeClass('hide')

        this.refresh()
    }

    MediaManager.prototype.uploadSending = function(file, xhr, formData) {
        formData.append('path', this.$el.find('[data-type="current-folder"]').val())
    }

    MediaManager.prototype.uploadCancelAll = function() {
        this.dropzone.removeAllFiles(true)
        this.hideUploadUi()
    }

    MediaManager.prototype.updateUploadBar = function(templateName, classNames) {
        var fileNumberLabel = this.$el.get(0).querySelector('[data-label="file-number-and-progress"]'),
            successTemplate = fileNumberLabel.getAttribute('data-' + templateName + '-template'),
            progressBar = this.$el.get(0).querySelector('[data-control="upload-progress-bar"]')

        fileNumberLabel.innerHTML = successTemplate;
        progressBar.setAttribute('class', classNames)
    }

    MediaManager.prototype.uploadSuccess = function() {
        this.updateUploadBar('success', 'progress-bar progress-bar-success');
    }

    MediaManager.prototype.uploadError = function(file, message) {
        this.updateUploadBar('error', 'progress-bar progress-bar-danger');

        if (!message) {
            message = 'Error uploading file'
        }

        $.oc.alert(message)
    }

    //
    // Cropping images
    //

    MediaManager.prototype.cropSelectedImage = function(callback) {
        var selectedItems = this.getSelectedItems(true)

        if (selectedItems.length != 1) {
            alert(this.options.selectSingleImage)
            return
        }

        if (selectedItems[0].getAttribute('data-document-type') !== 'image') {
            alert(this.options.selectionNotImage)
            return
        }

        var path = selectedItems[0].getAttribute('data-path')

        new $.oc.mediaManager.imageCropPopup(path, {
                alias: this.options.alias,
                onDone: callback
            })
    }

    MediaManager.prototype.onImageCropped = function(result) {
        this.$el.trigger('popupcommand', ['insert-cropped', result])
    }

    //
    // Search
    //

    MediaManager.prototype.clearSearchTrackInputTimer = function() {
        if (this.searchTrackInputTimer === null)
            return

        clearTimeout(this.searchTrackInputTimer)
        this.searchTrackInputTimer = null
    }

    MediaManager.prototype.updateSearchResults = function() {
        var $searchField = this.$el.find('[data-control="search"]'),
            data = {
                search: $searchField.val()
            }

        this.execNavigationRequest('onSearch', data, $searchField)
    }

    MediaManager.prototype.resetSearch = function() {
        this.$el.find('[data-control="search"]').val('')
    }

    MediaManager.prototype.onSearchChanged = function(ev) {
        var value = ev.currentTarget.value

        if (this.lastSearchValue !== undefined && this.lastSearchValue == value)
            return

        this.lastSearchValue = value

        this.clearSearchTrackInputTimer()

        this.searchTrackInputTimer = window.setTimeout(this.proxy(this.updateSearchResults), 300)
    }

    //
    // File and folder operations
    //

    MediaManager.prototype.deleteItems = function() {
        var items = this.$el.get(0).querySelectorAll('[data-type="media-item"].selected')

        if (!items.length) {
            $.oc.alert(this.options.deleteEmpty)
            return
        }

        $.oc.confirm(this.options.deleteConfirm, this.proxy(this.deleteConfirmation))
    }

    MediaManager.prototype.deleteConfirmation = function(confirmed) {
        if (!confirmed)
            return

        var items = this.$el.get(0).querySelectorAll('[data-type="media-item"].selected'),
            paths = []

        for (var i=0, len=items.length; i<len; i++) {
            paths.push({
                'path': items[i].getAttribute('data-path'),
                'type': items[i].getAttribute('data-item-type')
            })
        }

        var data = {
                paths: paths
            }

        $.oc.stripeLoadIndicator.show()
        this.$form.request(this.options.alias+'::onDeleteItem', {
            data: data
        }).always(function() {
            $.oc.stripeLoadIndicator.hide()
        }).done(this.proxy(this.afterNavigate))
    }

    MediaManager.prototype.createFolder = function(ev) {
        $(ev.target).popup({
            content: this.$el.find('[data-control="new-folder-template"]').html(),
            zIndex: 1200 // Media Manager can be opened in a popup, so this new popup should have a higher z-index
        })
    }

    MediaManager.prototype.onFolderPopupShown = function(ev, button, popup) {
        $(popup).find('input[name=name]').focus()
        $(popup).on('submit.media', 'form', this.proxy(this.onNewFolderSubmit))
    }

    MediaManager.prototype.onFolderPopupHidden = function(ev, button, popup) {
        $(popup).off('.media', 'form')
    }

    MediaManager.prototype.onNewFolderSubmit = function(ev) {
        var data = {
                name: $(ev.target).find('input[name=name]').val(),
                path: this.$el.find('[data-type="current-folder"]').val()
            }

        $.oc.stripeLoadIndicator.show()
        this.$form.request(this.options.alias+'::onCreateFolder', {
            data: data
        }).always(function() {
            $.oc.stripeLoadIndicator.hide()
        }).done(this.proxy(this.folderCreated))

        ev.preventDefault()
        return false
    }

    MediaManager.prototype.folderCreated = function() {
        this.$el.find('button[data-command="create-folder"]').popup('hide')

        this.afterNavigate()
    }

    MediaManager.prototype.moveItems = function(ev) {
        var items = this.$el.get(0).querySelectorAll('[data-type="media-item"].selected')

        if (!items.length) {
            $.oc.alert(this.options.moveEmpty)
            return
        }

        var data = {
            exclude: [],
            path: this.$el.find('[data-type="current-folder"]').val()
        }

        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i],
                path = item.getAttribute('data-path')

            if (item.getAttribute('data-item-type') == 'folder')
                data.exclude.push(path)
        }

        $(ev.target).popup({
            handler: this.options.alias+'::onLoadMovePopup',
            extraData: data,
            zIndex: 1200 // Media Manager can be opened in a popup, so this new popup should have a higher z-index
        })
    }

    MediaManager.prototype.onMovePopupShown = function(ev, button, popup) {
        $(popup).on('submit.media', 'form', this.proxy(this.onMoveItemsSubmit))
    }

    MediaManager.prototype.onMoveItemsSubmit = function(ev) {
        var items = this.$el.get(0).querySelectorAll('[data-type="media-item"].selected'),
            data = {
                dest: $(ev.target).find('select[name=dest]').val(),
                originalPath: $(ev.target).find('input[name=originalPath]').val(),
                files: [],
                folders: []
            } 

        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i],
                path = item.getAttribute('data-path')

            if (item.getAttribute('data-item-type') == 'folder')
                data.folders.push(path)
            else
                data.files.push(path)
        }

        $.oc.stripeLoadIndicator.show()
        this.$form.request(this.options.alias+'::onMoveItems', {
            data: data
        }).always(function() {
            $.oc.stripeLoadIndicator.hide()
        }).done(this.proxy(this.itemsMoved))

        ev.preventDefault()
        return false
    }

    MediaManager.prototype.onMovePopupHidden = function(ev, button, popup) {
        $(popup).off('.media', 'form')
    }

    MediaManager.prototype.itemsMoved = function() {
        this.$el.find('button[data-command="move"]').popup('hide')

        this.afterNavigate()
    }

    // EVENT HANDLERS
    // ============================

    MediaManager.prototype.onNavigate = function(ev) {
        var $item = $(ev.target).closest('[data-type="media-item"]')

        this.navigateToItem($item)

        if ($(ev.target).data('label') != 'public-url')
            return false
    }

    MediaManager.prototype.onCommandClick = function(ev) {
        var command = $(ev.currentTarget).data('command')

        switch (command) {
            case 'refresh':
                this.refresh()
            break;
            case 'change-view':
                this.changeView($(ev.currentTarget).data('view'))
            break;
            case 'cancel-uploading':
                this.uploadCancelAll()
            break;
            case 'close-uploader':
                this.hideUploadUi()
            break;
            case 'set-filter':
                this.setFilter($(ev.currentTarget).data('filter'))
            break;
            case 'delete':
                this.deleteItems()
            break;
            case 'create-folder':
                this.createFolder(ev)
            break;
            case 'move':
                this.moveItems(ev)
            break;
            case 'toggle-sidebar':
                this.toggleSidebar(ev)
            break;
            case 'popup-command':
                var popupCommand = $(ev.currentTarget).data('popup-command')

                if (popupCommand !== 'crop-and-insert')
                    this.$el.trigger('popupcommand', [popupCommand])
                else
                    this.cropSelectedImage(this.proxy(this.onImageCropped))
            break;
        }

        return false
    }

    MediaManager.prototype.onItemClick = function(ev) {
        // Don't select items when the rename icon is clicked
        if (ev.target.tagName == 'I' && ev.target.hasAttribute('data-rename-control'))
            return

        this.selectItem(ev.currentTarget, ev.shiftKey)
    }

    MediaManager.prototype.onItemTouch = function(ev) {
        // The 'click' event is triggered after 'touchend', 
        // so we can prevent handling it.
        ev.preventDefault() 
        ev.stopPropagation()

        if (this.dblTouchFlag) {
            this.onNavigate(ev)
            this.dblTouchFlag = null
        }
        else {
            this.onItemClick(ev)
            this.dblTouchFlag = true
        }

        this.clearDblTouchTimer()

        this.dblTouchTimer = setTimeout(this.proxy(this.clearDblTouchFlag), 300) 
    }

    MediaManager.prototype.onListMouseDown = function(ev) {
        this.itemListElement.addEventListener('mousemove', this.proxy(this.onListMouseMove))
        document.addEventListener('mouseup', this.proxy(this.onListMouseUp))

        this.itemListPosition = $.oc.foundation.element.absolutePosition(this.itemListElement, true)

        var pagePosition = $.oc.foundation.event.pageCoordinates(ev),
            relativePosition = this.getRelativePosition(this.itemListElement, pagePosition.x, pagePosition.y, this.itemListPosition)

        this.selectionStartPoint = relativePosition
        this.selectionStarted = false
    }

    MediaManager.prototype.onListMouseUp = function(ev) {
        this.itemListElement.removeEventListener('mousemove', this.proxy(this.onListMouseMove))
        document.removeEventListener('mouseup', this.proxy(this.onListMouseUp))
        $(document.body).removeClass('no-select')

        if (this.selectionStarted) {
            this.unselectRoot()

            var items = this.itemListElement.querySelectorAll('[data-type="media-item"]:not([data-root])'),
                selectionPosition = $.oc.foundation.element.absolutePosition(this.selectionMarker, true)

            for (var index = 0, len = items.length; index < len; index++) {
                var item = items[index],
                    itemPosition = $.oc.foundation.element.absolutePosition(item, true)

                if (this.doObjectsCollide(
                        selectionPosition.top,
                        selectionPosition.left,
                        this.selectionMarker.offsetWidth,
                        this.selectionMarker.offsetHeight,
                        itemPosition.top,
                        itemPosition.left,
                        item.offsetWidth,
                        item.offsetHeight)
                ) {
                    if (!ev.shiftKey)
                        item.setAttribute('class', 'selected')
                    else {
                        if (item.getAttribute('class') == 'selected') 
                            item.setAttribute('class', '')
                        else
                            item.setAttribute('class', 'selected')
                    }
                }
                else if (!ev.shiftKey)
                    item.setAttribute('class', '')
            }

            this.updateSidebarPreview()
            this.selectionMarker.setAttribute('class', 'hide')
        }

        this.selectionStarted = false
    }

    MediaManager.prototype.onListMouseMove = function(ev) {
        var pagePosition = $.oc.foundation.event.pageCoordinates(ev),
            relativePosition = this.getRelativePosition(this.itemListElement, pagePosition.x, pagePosition.y, this.itemListPosition)

        var deltaX = relativePosition.x - this.selectionStartPoint.x,
            deltaY = relativePosition.y - this.selectionStartPoint.y

        if (!this.selectionStarted && (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2)) {
            // Start processing the selection only if the mouse was moved by 
            // at least 2 pixels.
            this.createSelectionMarker()

            this.selectionMarker.setAttribute('class', '')
            this.selectionStarted = true
            $(document.body).addClass('no-select')
        }

        if (this.selectionStarted) {
            if (deltaX >= 0) {
                this.selectionMarker.style.left = this.selectionStartPoint.x + 'px' 
                this.selectionMarker.style.width = deltaX + 'px' 
            }
            else {
                this.selectionMarker.style.left = relativePosition.x + 'px' 
                this.selectionMarker.style.width = Math.abs(deltaX) + 'px' 
            }

            if (deltaY >= 0) {
                this.selectionMarker.style.height = deltaY + 'px' 
                this.selectionMarker.style.top = this.selectionStartPoint.y + 'px'
            }
            else {
                this.selectionMarker.style.top = relativePosition.y + 'px' 
                this.selectionMarker.style.height = Math.abs(deltaY) + 'px'
            }
        }
    }

    MediaManager.prototype.onSortingChanged = function(ev) {
        var data = {
            sortBy: $(ev.target).val(),
            path: this.$el.find('[data-type="current-folder"]').val()
        }

        this.execNavigationRequest('onSetSorting', data)
    }

    MediaManager.prototype.onKeyDown = function(ev) {
        var eventHandled = false

        switch (ev.which) {
            case 13:
                var items = this.getSelectedItems(true, true)
                if (items.length > 0)
                    this.navigateToItem($(items[0]))

                eventHandled = true
            break;
            case 39:
            case 40:
                this.selectRelative(true, ev.shiftKey)
                eventHandled = true
            break;
            case 37:
            case 38:
                this.selectRelative(false, ev.shiftKey)
                eventHandled = true
            break;
        }

        if (eventHandled) {
            ev.preventDefault()
            ev.stopPropagation()
        }
    }

    // MEDIA MANAGER PLUGIN DEFINITION
    // ============================

    MediaManager.DEFAULTS = {
        url: window.location,
        alias: '',
        uniqueId: null,
        deleteEmpty: 'Please select files to delete.',
        deleteConfirm: 'Delete the selected file(s)?',
        moveEmpty: 'Please select files to move.',
        selectSingleImage: 'Please select a single image.',
        selectionNotImage: 'The selected item is not an image.',
        bottomToolbar: false,
        cropAndInsertButton: false
    }

    var old = $.fn.mediaManager

    $.fn.mediaManager = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), 
            result = undefined

        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.mediaManager')
            var options = $.extend({}, MediaManager.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.mediaManager', (data = new MediaManager(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })
        
        return result ? result : this
    }

    $.fn.mediaManager.Constructor = MediaManager

    // MEDIA MANAGER NO CONFLICT
    // =================

    $.fn.mediaManager.noConflict = function () {
        $.fn.mediaManager = old
        return this
    }

    // MEDIA MANAGER DATA-API
    // ===============

    $(document).on('render', function(){
        $('div[data-control=media-manager]').mediaManager()
    })

}(window.jQuery);