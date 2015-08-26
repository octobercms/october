/*
 * Drop-down cell processor for the table control.
 */

/*
 * TODO: implement the search
 */

+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.processor === undefined)
        throw new Error("The $.oc.table.processor namespace is not defined. Make sure that the table.processor.base.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.processor.base,
        BaseProto = Base.prototype

    var DropdownProcessor = function(tableObj, columnName, columnConfiguration) {
        //
        // State properties
        //

        this.itemListElement = null

        this.cachedOptionPromises = {}

        // Event handlers
        this.itemClickHandler = this.onItemClick.bind(this)
        this.itemKeyDownHandler = this.onItemKeyDown.bind(this)

        //
        // Parent constructor
        //

        Base.call(this, tableObj, columnName, columnConfiguration)
    }

    DropdownProcessor.prototype = Object.create(BaseProto)
    DropdownProcessor.prototype.constructor = DropdownProcessor

    DropdownProcessor.prototype.dispose = function() {
        this.unregisterListHandlers()
        this.itemClickHandler = null
        this.itemKeyDownHandler = null
        this.itemListElement = null
        this.cachedOptionPromises = null
        BaseProto.dispose.call(this)
    }

    DropdownProcessor.prototype.unregisterListHandlers = function() {
        if (this.itemListElement)
        {
            // This processor binds custom click handler to the item list,
            // the standard registerHandlers/unregisterHandlers functionality
            // can't be used here because the element belongs to the document
            // body, not to the table.
            this.itemListElement.removeEventListener('click', this.itemClickHandler)
            this.itemListElement.removeEventListener('keydown', this.itemKeyDownHandler)
        }
    }

    /*
     * Renders the cell in the normal (no edit) mode
     */
    DropdownProcessor.prototype.renderCell = function(value, cellContentContainer) {
        var viewContainer = this.createViewContainer(cellContentContainer, '...')

        this.fetchOptions(cellContentContainer.parentNode, function renderCellFetchOptions(options) {
            if (options[value] !== undefined)
                viewContainer.textContent = options[value]

            cellContentContainer.setAttribute('tabindex', 0)
        })
    }

    /*
     * This method is called when the cell managed by the processor
     * is focused (clicked or navigated with the keyboard).
     */
    DropdownProcessor.prototype.onFocus = function(cellElement, isClick) {
        if (this.activeCell === cellElement) {
            this.showDropdown()
            return
        }

        this.activeCell = cellElement
        var cellContentContainer = this.getCellContentContainer(cellElement)
        this.buildEditor(cellElement, cellContentContainer, isClick)

        if (!isClick)
            cellContentContainer.focus()
    }

    /*
     * Forces the processor to hide the editor when the user navigates
     * away from the cell. Processors can update the sell value in this method.
     * Processors must clear the reference to the active cell in this method.
     */
    DropdownProcessor.prototype.onUnfocus = function() {
        if (!this.activeCell)
            return

        this.unregisterListHandlers()

        this.hideDropdown()
        this.itemListElement = null
        this.activeCell = null
    }

    DropdownProcessor.prototype.buildEditor = function(cellElement, cellContentContainer, isClick) {
        // Create the select control 
        var currentValue = this.tableObj.getCellValue(cellElement),
            containerPosition = this.getAbsolutePosition(cellContentContainer)
            self = this

        this.itemListElement = document.createElement('div')

        this.itemListElement.addEventListener('click', this.itemClickHandler)
        this.itemListElement.addEventListener('keydown', this.itemKeyDownHandler)

        this.itemListElement.setAttribute('class', 'table-control-dropdown-list')
        this.itemListElement.style.width = cellContentContainer.offsetWidth + 'px'
        this.itemListElement.style.left = containerPosition.left + 'px'
        this.itemListElement.style.top = containerPosition.top - 2 + cellContentContainer.offsetHeight + 'px'

        this.fetchOptions(cellElement, function renderCellFetchOptions(options) {
            var listElement = document.createElement('ul')
    
            for (var value  in options) {
                var itemElement = document.createElement('li')
                itemElement.setAttribute('data-value', value)
                itemElement.textContent = options[value]
                itemElement.setAttribute('tabindex', 0)

                if (value == currentValue)
                    itemElement.setAttribute('class', 'selected')

                listElement.appendChild(itemElement)
            }

            self.itemListElement.appendChild(listElement)

            if (isClick)
                self.showDropdown()

            self = null
        })
    }

    /*
     * Hide the drop-down, but don't delete it.
     */
    DropdownProcessor.prototype.hideDropdown = function() {
        if (this.itemListElement && this.activeCell && this.itemListElement.parentNode) {
            var cellContentContainer = this.getCellContentContainer(this.activeCell)
            cellContentContainer.setAttribute('data-dropdown-open', 'false')

            this.itemListElement.parentNode.removeChild(this.itemListElement)

            cellContentContainer.focus()
        }
    }

    DropdownProcessor.prototype.showDropdown = function() {
        if (this.itemListElement && this.itemListElement.parentNode !== document.body) {
            this.getCellContentContainer(this.activeCell).setAttribute('data-dropdown-open', 'true')
            document.body.appendChild(this.itemListElement)

            var activeItemElement = this.itemListElement.querySelector('ul li.selected')

            if (!activeItemElement) {
                activeItemElement = this.itemListElement.querySelector('ul li:first-child')

                if (activeItemElement)
                    activeItemElement.setAttribute('class', 'selected')
            }

            if (activeItemElement) {
                window.setTimeout(function(){
                    activeItemElement.focus()
                }, 0)
            }
        }
    }

    DropdownProcessor.prototype.fetchOptions = function(cellElement, onSuccess) {
        if (this.columnConfiguration.options)
            onSuccess(this.columnConfiguration.options)
        else {
            // If options are not provided and not found in the cache,
            // request them from the server. For dependent drop-downs 
            // the caching key contains the master column values.

            var row = cellElement.parentNode,
                cachingKey = this.createOptionsCachingKey(row),
                viewContainer = this.getViewContainer(cellElement)

            // Request options from the server. When the table widget builds,
            // multiple cells in the column could require loading the options.
            // The AJAX promises are cached here so that we have a single
            // request per caching key.

            viewContainer.setAttribute('class', 'loading')

            if (!this.cachedOptionPromises[cachingKey]) {
                var requestData = {
                       column: this.columnName,
                        rowData: this.tableObj.getRowData(row)
                    },
                    handlerName = this.tableObj.getAlias()+'::onGetDropdownOptions'

                this.cachedOptionPromises[cachingKey] = this.tableObj.$el.request(handlerName, {data: requestData})
            }

            this.cachedOptionPromises[cachingKey].done(function onDropDownLoadOptionsSuccess(data){
                onSuccess(data.options)
            }).always(function onDropDownLoadOptionsAlways(){
                viewContainer.setAttribute('class', '')
            })
        }
    }

    DropdownProcessor.prototype.createOptionsCachingKey = function(row) {
        var cachingKey = 'non-dependent',
            dependsOn = this.columnConfiguration.dependsOn

        if (dependsOn) {
            if (typeof dependsOn == 'object') {
                for (var i = 0, len = dependsOn.length; i < len; i++ )
                    cachingKey += dependsOn[i] + this.tableObj.getRowCellValueByColumnName(row, dependsOn[i])
            } else
                cachingKey = dependsOn + this.tableObj.getRowCellValueByColumnName(row, dependsOn)
        }

        return cachingKey
    }

    DropdownProcessor.prototype.getAbsolutePosition = function(element) {
        // TODO: use the foundation library

        var top = document.body.scrollTop,
            left = 0

        do {
            top += element.offsetTop || 0;
            top -= element.scrollTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while(element)

        return {
            top: top,
            left: left
        }
    }

    DropdownProcessor.prototype.updateCellFromSelectedItem = function(selectedItem) {
        this.tableObj.setCellValue(this.activeCell, selectedItem.getAttribute('data-value'))
        this.setViewContainerValue(this.activeCell, selectedItem.textContent)
    }

    DropdownProcessor.prototype.findSelectedItem = function() {
        if (this.itemListElement)
            return this.itemListElement.querySelector('ul li.selected')

        return null
    }

    DropdownProcessor.prototype.onItemClick = function(ev) {
        var target = this.tableObj.getEventTarget(ev)

        if (target.tagName == 'LI') {
            this.updateCellFromSelectedItem(target)

            var selected = this.findSelectedItem()
            if (selected)
                selected.setAttribute('class', '')

            target.setAttribute('class', 'selected')
            this.hideDropdown()
        }
    }

    DropdownProcessor.prototype.onItemKeyDown = function(ev) {
        if (!this.itemListElement)
            return

        if (ev.keyCode == 40 || ev.keyCode == 38)
        {
            // Up or down keys - find previous/next list item and select it
            var selected = this.findSelectedItem(),
                newSelectedItem = selected.nextElementSibling

            if (ev.keyCode == 38)
                newSelectedItem = selected.previousElementSibling

            if (newSelectedItem) {
                selected.setAttribute('class', '')
                newSelectedItem.setAttribute('class', 'selected')
                newSelectedItem.focus()
            }

            return
        }

        if (ev.keyCode == 13 || ev.keyCode == 32) {
            // Return or space keys - update the selected value and hide the editor
            this.updateCellFromSelectedItem(this.findSelectedItem())

            this.hideDropdown()
            return
        }

        if (ev.keyCode == 9) {
            // Tab - update the selected value and pass control to the table navigation
            this.updateCellFromSelectedItem(this.findSelectedItem())
            this.tableObj.navigation.navigateNext(ev)
            this.tableObj.stopEvent(ev)
        }

        if (ev.keyCode == 27) {
            // Esc - hide the drop-down
            this.hideDropdown()
        }
    }

    /*
     * Event handler for the keydown event. The table class calls this method
     * for all processors.
     */
    DropdownProcessor.prototype.onKeyDown = function(ev) {
        if (ev.keyCode == 32)
            this.showDropdown()
    }

    /*
     * This method is called when a cell value in the row changes.
     */
    DropdownProcessor.prototype.onRowValueChanged = function(columnName, cellElement) {
        // Determine if this drop-down depends on the changed column
        // and update the option list if necessary

        // TODO: setting drop-down values with table.setRowValues() is not implemented currently

        if (!this.columnConfiguration.dependsOn)
            return

        var dependsOnColumn = false,
            dependsOn = this.columnConfiguration.dependsOn

        if (typeof dependsOn == 'object') {
            for (var i = 0, len = dependsOn.length; i < len; i++ ) {
                if (dependsOn[i] == columnName) {
                    dependsOnColumn = true
                    break
                }
            }
        }
        else {
            dependsOnColumn = dependsOn == columnName
        }

        if (!dependsOnColumn)
            return

        var currentValue = this.tableObj.getCellValue(cellElement),
            viewContainer = this.getViewContainer(cellElement)

        this.fetchOptions(cellElement, function rowValueChangedFetchOptions(options) {
            var value = options[currentValue] !== undefined
                ? options[currentValue]
                : '...'

            viewContainer.textContent = value
            viewContainer = null
        })
    }

    /*
     * Determines whether the specified element is some element created by the 
     * processor. 
     */
    DropdownProcessor.prototype.elementBelongsToProcessor = function(element) {
        if (!this.itemListElement)
            return false

        return this.tableObj.parentContainsElement(this.itemListElement, element)
    }

    $.oc.table.processor.dropdown = DropdownProcessor;
}(window.jQuery);