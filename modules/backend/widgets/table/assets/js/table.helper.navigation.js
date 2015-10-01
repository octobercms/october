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

        // Number of pages in the pagination
        this.pageCount = 0

        this.init()
    };

    Navigation.prototype.init = function() {
    }

    Navigation.prototype.dispose = function() {
        // Remove the reference to the table object
        this.tableObj = null
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

        var paginationContainer = this.tableObj.getElement().querySelector('.pagination'),
            newPaginationContainer = false,
            curRecordCount = 0

        this.pageCount = this.calculatePageCount(recordCount, this.tableObj.options.recordsPerPage)

        if (!paginationContainer) {
            paginationContainer = document.createElement('div')
            paginationContainer.setAttribute('class', 'pagination')
            newPaginationContainer = true
        }
        else {
            curRecordCount = this.getRecordCount(paginationContainer)
        }

        // Generate the new page list only if the record count has changed
        if (newPaginationContainer || curRecordCount != recordCount) {
            paginationContainer.setAttribute('data-record-count', recordCount)

            var pageList = this.buildPaginationLinkList(
                recordCount,
                this.tableObj.options.recordsPerPage,
                this.pageIndex
            )

            if (!newPaginationContainer) {
                paginationContainer.replaceChild(pageList, paginationContainer.children[0])
            }
            else {
                paginationContainer.appendChild(pageList)
                this.tableObj.getElement().appendChild(paginationContainer)
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

    Navigation.prototype.getRecordCount = function(paginationContainer) {
        var container = paginationContainer ? paginationContainer : this.tableObj.getElement().querySelector('.pagination')

        return parseInt(container.getAttribute('data-record-count'))
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

            $(item).addClass('pagination-link')

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
            if (i == pageIndex) {
                list.children[i].setAttribute('class', 'active')
            }
        }
    }

    Navigation.prototype.gotoPage = function(pageIndex, onSuccess) {
        this.tableObj.unfocusTable()

        if (!this.tableObj.validate())
            return

        this.pageIndex = pageIndex

        this.tableObj.updateDataTable(onSuccess)
    }

    Navigation.prototype.getRowCountOnPage = function(cellElement) {
        return this.tableObj.getDataTableBody().children.length
    }

    Navigation.prototype.getNewRowPage = function(placement, currentRowIndex) {
        var curRecordCount = this.getRecordCount()

        if (placement === 'bottom')
            return this.calculatePageCount(curRecordCount+1, this.tableObj.options.recordsPerPage)-1

        // When a row is added above a current row, the current row just moves down,
        // so it's safe to return the current page index
        if (placement == 'above')
            return this.pageIndex

        if (placement == 'below') {
            if (currentRowIndex == (this.tableObj.options.recordsPerPage-1))
                return this.pageIndex+1

            return this.pageIndex
        }

        return this.pageIndex
    }

    Navigation.prototype.getPageAfterDeletion = function(currentRowIndex) {
        if (currentRowIndex == 0 && this.getRowCountOnPage() == 1)
            return this.pageIndex == 0 ? 0 : this.pageIndex-1

        return this.pageIndex
    }

    // KEYBOARD NAVIGATION
    // ============================

    Navigation.prototype.navigateDown = function(ev, forceCellIndex) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'down'))
            return

        var row = this.tableObj.activeCell.parentNode,
            newRow = !ev.shiftKey
                ? row.nextElementSibling 
                : row.parentNode.children[row.parentNode.children.length - 1],
            cellIndex = forceCellIndex !== undefined ? 
                forceCellIndex :
                this.tableObj.activeCell.cellIndex

        if (newRow) {
            var cell = newRow.children[cellIndex]

            if (cell)
                this.tableObj.focusCell(cell)
        }
        else {
            // Try to switch to the next page if that's possible

            if (!this.paginationEnabled())
                return

            if (this.pageIndex < this.pageCount-1) {
                var self = this

                this.gotoPage(this.pageIndex+1, function navDownPageSuccess(){
                    self.focusCell('top', cellIndex)
                    self = null
                })
            }
        }
    }

    Navigation.prototype.navigateUp = function(ev, forceCellIndex, isTab) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'up'))
            return

        var row = this.tableObj.activeCell.parentNode,
            newRow = (!ev.shiftKey || isTab) ? 
                row.previousElementSibling :
                row.parentNode.children[0],
            cellIndex = forceCellIndex !== undefined ? 
                forceCellIndex :
                this.tableObj.activeCell.cellIndex

        if (newRow) {
            var cell = newRow.children[cellIndex]

            if (cell)
                this.tableObj.focusCell(cell)
        } else {
            // Try to switch to the previous page if that's possible

            if (!this.paginationEnabled())
                return

            if (this.pageIndex > 0) {
                var self = this

                this.gotoPage(this.pageIndex-1, function navUpPageSuccess(){
                    self.focusCell('bottom', cellIndex)
                    self = null
                })
            }
        }
    }

    Navigation.prototype.navigateLeft = function(ev, isTab) {
        if (!this.tableObj.activeCell)
            return

        if (!isTab && this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'left'))
            return

        var row = this.tableObj.activeCell.parentNode,
            newIndex = (!ev.shiftKey || isTab) ? 
                this.tableObj.activeCell.cellIndex-1 :
                0

        var cell = row.children[newIndex]

        if (cell)
            this.tableObj.focusCell(cell)
        else {
            // Try to navigate up if that's possible
            this.navigateUp(ev, row.children.length-1, isTab)
        }
    }

    Navigation.prototype.navigateRight = function(ev, isTab) {
        if (!this.tableObj.activeCell)
            return

        if (!isTab && this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'right'))
            return

        var row = this.tableObj.activeCell.parentNode,
            newIndex = !ev.shiftKey ? 
                this.tableObj.activeCell.cellIndex+1 :
                row.children.length-1

        var cell = row.children[newIndex]

        if (cell)
            this.tableObj.focusCell(cell)
        else {
            // Try to navigate down if that's possible
            this.navigateDown(ev, 0)
        }
    }

    Navigation.prototype.navigateNext = function(ev) {
        if (!this.tableObj.activeCell)
            return

        if (this.tableObj.activeCellProcessor && !this.tableObj.activeCellProcessor.keyNavigationAllowed(ev, 'tab'))
            return

        if (!ev.shiftKey)
            this.navigateRight(ev, true)
        else
            this.navigateLeft(ev, true)

        this.tableObj.stopEvent(ev)
    }

    Navigation.prototype.focusCell = function(rowReference, cellIndex) {
        var row = null,
            tbody = this.tableObj.getDataTableBody()

        if (typeof rowReference === 'object')
            row = rowReference
        else {
            if (rowReference == 'bottom') {
                row = tbody.children[tbody.children.length-1]
            } 
            else if (rowReference == 'top') {
                row = tbody.children[0]
            }
        }

        if (!row)
            return

        var cell = row.children[cellIndex]
        if (cell)
            this.tableObj.focusCell(cell)
    }

    Navigation.prototype.focusCellInReplacedRow = function(rowIndex, cellIndex) {
        if (rowIndex == 0)
           this.focusCell('top', cellIndex)
        else {
            var focusRow = this.tableObj.findRowByIndex(rowIndex)

            if (!focusRow)
                focusRow = this.tableObj.findRowByIndex(rowIndex-1)

            if (focusRow)
                this.focusCell(focusRow, cellIndex)
            else
                this.focusCell('top', cellIndex)
        }
    }

    // EVENT HANDLERS
    // ============================

    Navigation.prototype.onKeydown = function(ev) {
        // The navigation object uses the table's keydown handler
        // and doesn't register own handler.

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

        if (!target || !$(target).hasClass('pagination-link'))
            return

        var pageIndex = parseInt(target.getAttribute('data-page-index'))

        if (pageIndex === null)
            return

        this.gotoPage(pageIndex)
        this.tableObj.stopEvent(ev)

        return false
    }

    $.oc.table.helper.navigation = Navigation;
}(window.jQuery);