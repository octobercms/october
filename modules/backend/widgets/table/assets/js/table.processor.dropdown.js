/*
 * Drop-down cell processor for the table control.
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

        this.itemListElement = null

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
        var self = this

        this.fetchOptions(function renderCellFetchOptions(options) {
            if ( options[value] !== undefined )
                value = options[value]

            self.createViewContainer(cellContentContainer, value)
            cellContentContainer.setAttribute('tabindex', 0)
            self = null
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
        this.itemListElement.style.top = containerPosition.top - 1 + cellContentContainer.offsetHeight + 'px'

        this.fetchOptions(function renderCellFetchOptions(options) {
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

            if (activeItemElement) {
                activeItemElement.focus()
            }
        }
    }

    DropdownProcessor.prototype.fetchOptions = function(onSuccess) {
        // TODO: implement caching and AJAX support,
        // loading indicator is required here for AJAX-based options.
        //
        if ( this.columnConfiguration.options )
            onSuccess(this.columnConfiguration.options)
    }

    DropdownProcessor.prototype.getAbsolutePosition = function(element) {
        // TODO: refactor to a core library

        var top = 0,
            left = 0

        do {
            top += element.offsetTop  || 0;
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

        if (target.tagName == 'LI')
        {
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
    }

    /*
     * Event handler for the keydown event. The table class calls this method
     * for all processors.
     */
    DropdownProcessor.prototype.onKeyDown = function(ev) {
        if (ev.keyCode == 32)
            this.showDropdown()
    }

    $.oc.table.processor.dropdown = DropdownProcessor;
}(window.jQuery);