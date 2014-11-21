/*
 * Navigation helper for the table widget.
 * Implements the keyboard navigation within the current page
 * and pagination.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.helper === undefined)
        $.oc.table.helper = {}

    // NAVIGATION CLASS DEFINITION
    // ============================

    var Navigation = function(tableObj) {
        // Reference to the table object
        this.tableObj = tableObj

        // The current page index
        this.pageIndex = 0

        // Event handlers
        this.keydownHandler = this.onKeydown.bind(this)

        // Number of pages in the pagination
        this.pageCount = 0

        this.init()
    };

    Navigation.prototype.init = function() {
        this.registerHandlers()
    }

    Navigation.prototype.dispose = function() {
        // Unregister event handlers
        this.unregisterHandlers()

        // Remove the reference to the table object
        this.tableObj = null
    }

    Navigation.prototype.registerHandlers = function() {
        this.tableObj.el.addEventListener('keydown', this.keydownHandler)
    }

    Navigation.prototype.unregisterHandlers = function() {
        this.tableObj.el.removeEventListener('keydown', this.keydownHandler);
        this.keydownHandler = null
    }

    // PAGINATION
    // ============================

    Navigation.prototype.paginationEnabled = function() {
        return this.tableObj.options.recordsPerPage != null &&
            this.tableObj.options.recordsPerPage != false
    }

    Navigation.prototype.getPageFirstRowOffset = function() {
        return this.pageIndex * this.tableObj.options.recordsPerPage
    }

    Navigation.prototype.buildPagination = function(recordCount) {
        if (!this.paginationEnabled())
            return

        var paginationContainer = this.tableObj.el.querySelector('.pagination'),
            newPaginationContainer = false,
            curRecordCount = 0

        this.pageCount = this.calculatePageCount(recordCount, this.tableObj.options.recordsPerPage)

        if (!paginationContainer) {
            paginationContainer = document.createElement('div')
            paginationContainer.setAttribute('class', 'pagination')
            newPaginationContainer = true
        } else
            curRecordCount = paginationContainer.getAttribute('data-record-count')

        // Generate the new page list only if the record count has changed
        if (newPaginationContainer || curRecordCount != recordCount) {
            paginationContainer.setAttribute('data-record-count', recordCount)

            var pageList = this.buildPaginationLinkList(recordCount, 
                    this.tableObj.options.recordsPerPage, 
                    this.pageIndex)

            if (!newPaginationContainer)
                paginationContainer.replaceChild(paginationContainer.children[0], pageList)
            else {
                paginationContainer.appendChild(pageList)
                this.tableObj.el.appendChild(paginationContainer)
            }
        } else {
            // Do not re-generate the pages if the record count hasn't changed,
            // but mark the new active item in the pagination list
       
            this.markActiveLinkItem(paginationContainer, this.pageIndex)
        }
    }

    Navigation.prototype.calculatePageCount = function(recordCount, recordsPerPage) {
        var pageCount = Math.ceil(recordCount/recordsPerPage)

        if (!pageCount)
            pageCount = 1

        return pageCount
    }

    Navigation.prototype.buildPaginationLinkList = function(recordCount, recordsPerPage, pageIndex) {
        // This method could be refactored and moved to a pagination
        // helper if we want to support other pagination markup options.

        var pageCount = this.calculatePageCount(recordCount, recordsPerPage),
            pageList = document.createElement('ul')

        for (var i=0; i < pageCount; i++) {
            var item = document.createElement('li'),
                link = document.createElement('a')

            if (i == pageIndex)
                item.setAttribute('class', 'active')

            link.innerText = i+1
            link.setAttribute('data-page-index', i)
            link.setAttribute('href', '#')

            item.appendChild(link)
            pageList.appendChild(item)
        }

        return pageList
    }

    Navigation.prototype.markActiveLinkItem = function(paginationContainer, pageIndex) {
        // This method could be refactored and moved to a pagination
        // helper if we want to support other pagination markup options.

        var activeItem = paginationContainer.querySelector('.active'),
            list = paginationContainer.children[0]

        activeItem.setAttribute('class', '')

        for (var i=0, len = list.children.length; i < len; i++) {
            if (i == pageIndex)
                list.children[i].setAttribute('class', 'active')
        }
    }

    Navigation.prototype.gotoPage = function(pageIndex, onSuccess) {
        this.pageIndex = pageIndex

        this.tableObj.updateDataTable(onSuccess)
    }

    // KEYBOARD NAVIGATION
    // ============================

    Navigation.prototype.navigateDown = function(ev) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'down'))
            return

        var row = this.tableObj.activeCell.parentNode,
            newRow = !ev.shiftKey ? 
                row.nextElementSibling :
                row.parentNode.children[row.parentNode.children.length - 1]

        if (newRow) {
            var cell = newRow.children[this.tableObj.activeCell.cellIndex]

            if (cell)
                this.tableObj.focusCell(cell)
        } else {
            // Try to switch to the previous page if that's possible

            if (!this.paginationEnabled())
                return

            if (this.pageIndex < this.pageCount-1) {
                var cellIndex = this.tableObj.activeCell.cellIndex,
                    self = this

                this.gotoPage(this.pageIndex+1, function navUpPageSuccess(){
                    self.focusCell('top', cellIndex)
                    self = null
                })
            }
        }
    }

    Navigation.prototype.navigateUp = function(ev) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'up'))
            return

        var row = this.tableObj.activeCell.parentNode,
            newRow = !ev.shiftKey ? 
                row.previousElementSibling :
                row.parentNode.children[0]

        if (newRow) {
            var cell = newRow.children[this.tableObj.activeCell.cellIndex]

            if (cell)
                this.tableObj.focusCell(cell)
        } else {
            // Try to switch to the previous page if that's possible

            if (!this.paginationEnabled())
                return

            if (this.pageIndex > 0) {
                var cellIndex = this.tableObj.activeCell.cellIndex,
                    self = this

                this.gotoPage(this.pageIndex-1, function navUpPageSuccess(){
                    self.focusCell('bottom', cellIndex)
                    self = null
                })
            }
        }
    }

    Navigation.prototype.navigateLeft = function(ev) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'left'))
            return

        var row = this.tableObj.activeCell.parentNode,
            newIndex = !ev.shiftKey ? 
                this.tableObj.activeCell.cellIndex-1 :
                0

        var cell = row.children[newIndex]

        if (cell)
            this.tableObj.focusCell(cell)
    }

    Navigation.prototype.navigateRight = function(ev) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'right'))
            return

        var row = this.tableObj.activeCell.parentNode,
            newIndex = !ev.shiftKey ? 
                this.tableObj.activeCell.cellIndex+1 :
                row.children.length-1

        var cell = row.children[newIndex]

        if (cell)
            this.tableObj.focusCell(cell)
    }

    Navigation.prototype.navigateNext = function(ev) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'tab'))
            return

        var row = this.tableObj.activeCell.parentNode,
            cellCount = row.children.length,
            cellIndex = this.tableObj.activeCell.cellIndex

        if (!ev.shiftKey) {
            if (cellIndex < cellCount-1)
                this.tableObj.focusCell(row.children[cellIndex+1])
            else {
                if (row.nextElementSibling)
                    this.tableObj.focusCell(row.nextElementSibling.children[0])
            }
        } else {
            if (cellIndex > 0)
                this.tableObj.focusCell(row.children[cellIndex-1])
            else {
                if (row.previousElementSibling)
                    this.tableObj.focusCell(row.previousElementSibling.children[cellCount-1])
            }
        }

        this.tableObj.stopEvent(ev)
    }

    Navigation.prototype.focusCell = function(rowReference, cellIndex) {
        var row = null,
            dataTable = this.tableObj.dataTable

        if (rowReference == 'bottom') {
            row = dataTable.children[dataTable.children.length-1]
        } 
        else if (rowReference == 'top') {
            row = dataTable.children[0]
        }

        if (!row)
            return

        var cell = row.children[cellIndex]
        if (cell)
            this.tableObj.focusCell(cell)
    }

    // EVENT HANDLERS
    // ============================

    Navigation.prototype.onKeydown = function(ev) {
        // Handle keyboard navigation events.

        if (ev.keyCode == 40)
            return this.navigateDown(ev)
        else if (ev.keyCode == 38)
            return this.navigateUp(ev)
        else if (ev.keyCode == 37)
            return this.navigateLeft(ev)
        if (ev.keyCode == 39)
            return this.navigateRight(ev)
        if (ev.keyCode == 9)
            return this.navigateNext(ev)
    }

    Navigation.prototype.onClick = function(ev) {
        // The navigation object uses the table's click handler
        // and doesn't register own click handler.

        var target = this.tableObj.getEventTarget(ev, 'A')

        if (!target)
            return

        var pageIndex = target.getAttribute('data-page-index')

        if (pageIndex === null)
            return

        this.gotoPage(pageIndex)
        this.tableObj.stopEvent(ev)

        return false
    }

    $.oc.table.helper.navigation = Navigation;
}(window.jQuery);