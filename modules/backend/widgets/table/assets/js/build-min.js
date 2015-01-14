/*
 * Table control class
 *
 * Dependences:
 * - Scrollbar (october.scrollbar.js)
 */
+function ($) { "use strict";

    // TABLE CONTROL NAMESPACES
    // ============================

    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.table === undefined)
        $.oc.table = {}

    // TABLE CLASS DEFINITION
    // ============================

    var Table = function(element, options) {
        this.el = element
        this.$el = $(element)

        this.options = options

        //
        // State properties
        //

        // The data source object
        this.dataSource = null

        // The cell processors list
        this.cellProcessors = {}

        // A reference to the currently active cell processor
        this.activeCellProcessor = null

        // A reference to the currently active table cell
        this.activeCell = null

        // A reference to the tables container
        this.tableContainer = null

        // A reference to the data table container
        this.dataTableContainer = null

        // The key of the row which is being edited at the moment.
        // This key corresponds the data source row key which 
        // uniquely identifies the row in the data set. When the
        // table grid notices that a cell in another row is edited it commits
        // the previously edited record to the data source.
        this.editedRowKey = null

        // A reference to the data table
        this.dataTable = null

        // A reference to the header table
        this.headerTable = null

        // A reference to the toolbar
        this.toolbar = null

        // Event handlers
        this.clickHandler = this.onClick.bind(this)
        this.keydownHandler = this.onKeydown.bind(this)
        this.documentClickHandler = this.onDocumentClick.bind(this)
        this.toolbarClickHandler = this.onToolbarClick.bind(this)

        if (this.options.postback && this.options.clientDataSourceClass == 'client')
            this.formSubmitHandler = this.onFormSubmit.bind(this)

        // Navigation helper
        this.navigation = null

        // Number of records added or deleted during the session
        this.recordsAddedOrDeleted = 0

        //
        // Initialization
        //

        this.init()
    }

    // INTERNAL METHODS
    // ============================

    Table.prototype.init = function() {
        // Create the data source object
        this.createDataSource()

        // Create cell processors
        this.initCellProcessors()

        // Initialize helpers
        this.navigation = new $.oc.table.helper.navigation(this)

        // Create the UI
        this.buildUi()

        // Register event handlers
        this.registerHandlers()
    }

    Table.prototype.disposeCellProcessors = function() {
        // For the performance reasons cell processors are stored
        // in an object structure with keys matching the column names.
        // We can iterate through then with the for cycle if we know
        // the column names. We use the for cycle for the performance
        // reasons: http://jsperf.com/for-vs-foreach/37,
        // http://jonraasch.com/blog/10-javascript-performance-boosting-tips-from-nicholas-zakas

        for (var i = 0, len = this.options.columns.length; i < len; i++) {
            var column = this.options.columns[i].key

            this.cellProcessors[column].dispose()
            this.cellProcessors[column] = null
        }

        this.cellProcessors = null
        this.activeCellProcessor = null
    }

    Table.prototype.createDataSource = function() {
        var dataSourceClass = this.options.clientDataSourceClass

        if ($.oc.table.datasource === undefined || $.oc.table.datasource[dataSourceClass] == undefined)
            throw new Error('The table client-side data source class "'+dataSourceClass+'" is not ' +
                'found in the $.oc.table.datasource namespace.')

        this.dataSource = new $.oc.table.datasource[dataSourceClass](this)
    }

    Table.prototype.registerHandlers = function() {
        this.el.addEventListener('click', this.clickHandler)
        this.el.addEventListener('keydown', this.keydownHandler)
        document.addEventListener('click', this.documentClickHandler)

        if (this.options.postback && this.options.clientDataSourceClass == 'client')
            this.$el.closest('form').bind('oc.beforeRequest', this.formSubmitHandler)

        var toolbar = this.getToolbar()
        if (toolbar)
            toolbar.addEventListener('click', this.toolbarClickHandler);
    }

    Table.prototype.unregisterHandlers = function() {
        this.el.removeEventListener('click', this.clickHandler);
        document.removeEventListener('click', this.documentClickHandler)

        this.clickHandler = null

        this.el.removeEventListener('keydown', this.keydownHandler);
        this.keydownHandler = null

        var toolbar = this.getToolbar()
        if (toolbar)
            toolbar.removeEventListener('click', this.toolbarClickHandler);

        this.toolbarClickHandler = null

        if (this.formSubmitHandler) {
            this.$el.closest('form').unbind('oc.beforeRequest', this.formSubmitHandler)
            this.formSubmitHandler = null
        }
    }

    Table.prototype.initCellProcessors = function() {
        for (var i = 0, len = this.options.columns.length; i < len; i++) {
            var columnConfiguration = this.options.columns[i],
                column = columnConfiguration.key,
                columnType = columnConfiguration.type

            // Resolve the default column type to string
            if (columnType === undefined) {
                columnType = 'string'
                this.options.columns[i].type = columnType
            }

            if ($.oc.table.processor === undefined || $.oc.table.processor[columnType] == undefined)
                throw new Error('The table cell processor for the column type "'+columnType+'" is not ' +
                    'found in the $.oc.table.processor namespace.')

            this.cellProcessors[column] = new $.oc.table.processor[columnType](this, column, columnConfiguration)
        }
    }

    Table.prototype.getCellProcessor = function(columnName) {
        return this.cellProcessors[columnName]
    }

    Table.prototype.buildUi = function() {
        this.tableContainer = document.createElement('div')
        this.tableContainer.setAttribute('class', 'table-container')

        // Build the toolbar
        if (this.options.toolbar)
            this.buildToolbar()

        // Build the headers table
        this.tableContainer.appendChild(this.buildHeaderTable())

        // Append the table container to the element
        this.el.insertBefore(this.tableContainer, this.el.children[0])

        if (!this.options.height)
            this.dataTableContainer = this.tableContainer
        else 
            this.dataTableContainer = this.buildScrollbar()

        // Build the data table
        this.updateDataTable()
    }

    Table.prototype.buildToolbar = function() {
        if (!this.options.adding && !this.options.deleting)
            return

        this.toolbar = document.createElement('div')
        this.toolbar.setAttribute('class', 'toolbar')

        if (this.options.adding) {
            var addBelowButton = document.createElement('a')
            addBelowButton.setAttribute('class', 'btn add-table-row-below')
            addBelowButton.setAttribute('data-cmd', 'record-add-below')
            this.toolbar.appendChild(addBelowButton)

            if (this.navigation.paginationEnabled() || !this.options.rowSorting) {
                // When the pagination is enabled, or sorting is disabled,
                // new records can only be added to the bottom of the
                // table.
                addBelowButton.textContent = 'Add row'
            } else {
                addBelowButton.textContent = 'Add row below'

                var addAboveButton = document.createElement('a')
                addAboveButton.setAttribute('class', 'btn add-table-row-above')
                addAboveButton.textContent = 'Add row above'
                addAboveButton.setAttribute('data-cmd', 'record-add-above')
                this.toolbar.appendChild(addAboveButton)
            }
        }

        if (this.options.deleting) {
            var deleteButton = document.createElement('a')
            deleteButton.setAttribute('class', 'btn delete-table-row')
            deleteButton.textContent = 'Delete row'
            deleteButton.setAttribute('data-cmd', 'record-delete')
            this.toolbar.appendChild(deleteButton)
        }

        this.tableContainer.appendChild(this.toolbar)
    }

    Table.prototype.buildScrollbar = function() {
        var scrollbar = document.createElement('div'),
            scrollbarContent = document.createElement('div')

        scrollbar.setAttribute('class', 'control-scrollbar')

        if (this.options.dynamicHeight)
            scrollbar.setAttribute('style', 'max-height: ' + this.options.height + 'px')
        else
            scrollbar.setAttribute('style', 'height: ' + this.options.height + 'px')

        scrollbar.appendChild(scrollbarContent)
        this.tableContainer.appendChild(scrollbar)

        $(scrollbar).scrollbar({animation: false})

        return scrollbarContent
    }

    Table.prototype.buildHeaderTable = function() {
        var headersTable = document.createElement('table'),
            row = document.createElement('tr')

        headersTable.className = 'headers'
        headersTable.appendChild(row)

        for (var i = 0, len = this.options.columns.length; i < len; i++) {
            var header = document.createElement('th')

            if (this.options.columns[i].width)
                header.setAttribute('style', 'width: '+this.options.columns[i].width)

            header.textContent !== undefined
                ? header.textContent = this.options.columns[i].title
                : header.innerText = this.options.columns[i].title

            row.appendChild(header)
        }

        this.headerTable = headersTable

        return headersTable
    }

    Table.prototype.updateDataTable = function(onSuccess) {
        var self = this

        this.unfocusTable()

        this.fetchRecords(function onUpdateDataTableSuccess(records, totalCount){
            self.buildDataTable(records, totalCount)

            if (onSuccess)
                onSuccess()

            if (totalCount == 0)
                self.addRecord('above', true)

            self = null
        })
    }

    Table.prototype.updateColumnWidth = function() {
        var headerCells = this.headerTable.querySelectorAll('th'),
            dataCells = this.dataTable.querySelectorAll('tr:first-child td')

        for (var i = 0, len = headerCells.length; i < len; i++) {
            if (dataCells[i])
                dataCells[i].setAttribute('style', headerCells[i].getAttribute('style'))
        }
    }

    Table.prototype.buildDataTable = function(records, totalCount) {
        var dataTable = document.createElement('table'),
            tbody = document.createElement('tbody'),
            keyColumn = this.options.keyColumn

        dataTable.setAttribute('class', 'data')

        for (var i = 0, len = records.length; i < len; i++) {
            var row = document.createElement('tr')

            if (records[i][keyColumn] === undefined)
                throw new Error('The row attribute '+keyColumn+' is not set for the row #'+i);

            row.setAttribute('data-row', records[i][keyColumn])
            for (var j = 0, colsLen = this.options.columns.length; j < colsLen; j++) {
                var cell = document.createElement('td'),
                    dataContainer = document.createElement('input'),
                    cellContentContainer = document.createElement('div'),
                    column = this.options.columns[j],
                    columnName = column.key,
                    cellProcessor = this.getCellProcessor(columnName)

                cell.setAttribute('data-column', columnName)
                cell.setAttribute('data-column-type', column.type)

                dataContainer.setAttribute('type', 'hidden')
                dataContainer.setAttribute('data-container', 'data-container')
                dataContainer.value = records[i][columnName] !== undefined ?
                    records[i][columnName] :
                    ""

                cellContentContainer.setAttribute('class', 'content-container')

                cell.appendChild(cellContentContainer)
                row.appendChild(cell)
                cell.appendChild(dataContainer)

                cellProcessor.renderCell(records[i][columnName], cellContentContainer)
            }

            tbody.appendChild(row)
        }

        dataTable.appendChild(tbody)

        // Inject the data table to the DOM or replace the existing table
        if (this.dataTable !== null)
            this.dataTableContainer.replaceChild(dataTable, this.dataTable)
        else
            this.dataTableContainer.appendChild(dataTable)

        this.dataTable = dataTable

        // Update column widths
        this.updateColumnWidth()

        // Update the scrollbar
        this.updateScrollbar()

        // Update the pagination links
        this.navigation.buildPagination(totalCount)
    }

    Table.prototype.fetchRecords = function(onSuccess) {
        this.dataSource.getRecords(
            this.navigation.getPageFirstRowOffset(), 
            this.options.recordsPerPage,
            onSuccess)
    }

    Table.prototype.updateScrollbar = function() {
        if (!this.options.height)
            return
    
        $(this.dataTableContainer.parentNode).data('oc.scrollbar').update()
    }

    Table.prototype.scrollCellIntoView = function() {
        if (!this.options.height || !this.activeCell)
            return

        $(this.dataTableContainer.parentNode).data('oc.scrollbar').gotoElement(this.activeCell)
    }

    Table.prototype.disposeScrollbar = function() {
        if (!this.options.height)
            return

        $(this.dataTableContainer.parentNode).data('oc.scrollbar').dispose()
        $(this.dataTableContainer.parentNode).data('oc.scrollbar', null)
    }

    /*
     * Makes a cell processor active and hides the previously
     * active editor.
     */
    Table.prototype.setActiveProcessor = function(processor) {
        if (this.activeCellProcessor)
            this.activeCellProcessor.onUnfocus()

        this.activeCellProcessor = processor
    }

    Table.prototype.commitEditedRow = function() {
        if (this.editedRowKey === null)
            return
        
        var editedRow = this.dataTable.querySelector('tr[data-row="'+this.editedRowKey+'"]')
        if (!editedRow)
            return

        if (editedRow.getAttribute('data-dirty') != 1)
            return

        var cells = editedRow.children,
            data = {}

        for (var i=0, len = cells.length; i < len; i++) {
            var cell = cells[i]

            data[cell.getAttribute('data-column')] = this.getCellValue(cell)
        }

        this.dataSource.updateRecord(this.editedRowKey, data)
        editedRow.setAttribute('data-dirty', 0)
    }

    /*
     * Removes editor from the currently edited cell and commits the row if needed.
     */
    Table.prototype.unfocusTable = function() {
        this.elementRemoveClass(this.el, 'active')

        if (this.activeCellProcessor)
            this.activeCellProcessor.onUnfocus()

        this.commitEditedRow()
        this.activeCellProcessor = null

        if (this.activeCell)
            this.activeCell.setAttribute('class', '')

        this.activeCell = null
    }

    /*
     * Makes the table focused in the UI
     */
    Table.prototype.focusTable = function() {
        this.elementAddClass(this.el, 'active')
    }

    /*
     * Calls the onFocus() method for the cell processor responsible for the
     * newly focused cell. Commit the previous edited row to the data source
     * if needed.
     */
    Table.prototype.focusCell = function(cellElement, isClick) {
        var columnName = cellElement.getAttribute('data-column')
        if (columnName === null)
            return

        this.focusTable()

        var processor = this.getCellProcessor(columnName)
        if (!processor)
            throw new Error("Cell processor not found for the column "+columnName)

        if (this.activeCell !== cellElement) {
            if (this.activeCell)
                this.elementRemoveClass(this.activeCell, 'active')

            this.setActiveProcessor(processor)
            this.activeCell = cellElement

            if (processor.isCellFocusable())
                this.elementAddClass(this.activeCell, 'active')
        }

        // If the cell belongs to other row than the currently edited, 
        // commit currently edited row to the data source. Update the
        // currently edited row key.
        var rowKey = this.getCellRowKey(cellElement)

        if (this.editedRowKey !== null && rowKey != this.editedRowKey)
            this.commitEditedRow()

        this.editedRowKey = rowKey

        processor.onFocus(cellElement, isClick)

        this.scrollCellIntoView()
    }

    Table.prototype.markCellRowDirty = function(cellElement) {
        cellElement.parentNode.setAttribute('data-dirty', 1)
    }

    Table.prototype.addRecord = function(placement, noFocus) {
        // If there is no active cell, or the pagination is enabled or 
        // row sorting is disabled, add the record to the bottom of 
        // the table (last page).

        if (!this.activeCell || this.navigation.paginationEnabled() || !this.options.rowSorting)
            placement = 'bottom'

        var relativeToKey = null,
            currentRowIndex = null

        if (placement == 'above' || placement == 'below') {
            relativeToKey = this.getCellRowKey(this.activeCell)
            currentRowIndex = this.getCellRowIndex(this.activeCell)
        }

        this.unfocusTable()

        if (this.navigation.paginationEnabled()) {
            var newPageIndex = this.navigation.getNewRowPage(placement, currentRowIndex)

            if (newPageIndex != this.navigation.pageIndex) {
                // Validate data on the current page if adding a new record
                // is going to create another page.
                if (!this.validate())
                    return
            }

            this.navigation.pageIndex = newPageIndex
        }

        this.recordsAddedOrDeleted++

        // New records have negative keys
        var keyColumn = this.options.keyColumn,
            recordData = {},
            self = this

        recordData[keyColumn] = -1*this.recordsAddedOrDeleted

        this.dataSource.createRecord(recordData, placement, relativeToKey,
            this.navigation.getPageFirstRowOffset(), 
            this.options.recordsPerPage,
            function onAddRecordDataTableSuccess(records, totalCount) {
                self.buildDataTable(records, totalCount)

                var row = self.findRowByKey(recordData[keyColumn])
                if (!row)
                    throw new Error('New row is not found in the updated table: '+recordData[keyColumn])

                if (!noFocus)
                    self.navigation.focusCell(row, 0)

                self = null
            }
        )
    }

    Table.prototype.deleteRecord = function() {
        if (!this.activeCell)
            return

        var currentRowIndex = this.getCellRowIndex(this.activeCell),
            key = this.getCellRowKey(this.activeCell),
            self = this,
            paginationEnabled = this.navigation.paginationEnabled(),
            currentPageIndex = this.navigation.pageIndex,
            currentCellIndex = this.activeCell.cellIndex

        if (paginationEnabled)
            this.navigation.pageIndex = this.navigation.getPageAfterDeletion(currentRowIndex)

        this.recordsAddedOrDeleted++

        // New records have negative keys
        var keyColumn = this.options.keyColumn,
            newRecordData = {}

        newRecordData[keyColumn] = -1*this.recordsAddedOrDeleted

        this.dataSource.deleteRecord(key, 
            newRecordData,
            this.navigation.getPageFirstRowOffset(), 
            this.options.recordsPerPage,
            function onDeleteRecordDataTableSuccess(records, totalCount) {
                self.buildDataTable(records, totalCount)

                if (!paginationEnabled)
                    self.navigation.focusCellInReplacedRow(currentRowIndex, currentCellIndex)
                else {
                    if (currentPageIndex != self.navigation.pageIndex)
                        self.navigation.focusCell('bottom', currentCellIndex)
                    else
                        self.navigation.focusCellInReplacedRow(currentRowIndex, currentCellIndex)
                }
                
                self = null
            }
        )
    }

    Table.prototype.notifyRowProcessorsOnChange = function(cellElement) {
        var columnName = cellElement.getAttribute('data-column'),
            row = cellElement.parentNode

        for (var i = 0, len = row.children.length; i < len; i++) {
            var column = this.options.columns[i].key

            this.cellProcessors[column].onRowValueChanged(columnName, row.children[i])
        }
    }

    Table.prototype.getToolbar = function() {
        return this.tableContainer.querySelector('div.toolbar')
    }

    /*
     * Validaates data on the current page
     */
    Table.prototype.validate = function() {
        var rows = this.dataTable.querySelectorAll('tbody tr[data-row]')

        for (var i = 0, len = rows.length; i < len; i++) {
            var row = rows[i]

            this.elementRemoveClass(row, 'error')
        }

        for (var i = 0, rowsLen = rows.length; i < rowsLen; i++) {
            var row = rows[i],
                rowData = this.getRowData(row)

            for (var j = 0, colsLen = row.children.length; j < colsLen; j++)
                this.elementRemoveClass(row.children[j], 'error')

            for (var columnName in rowData) {
                var cellProcessor = this.getCellProcessor(columnName),
                    message = cellProcessor.validate(rowData[columnName], rowData)

                if (message !== undefined) {
                    var cell = row.querySelector('td[data-column="'+columnName+'"]'),
                        self = this

                    this.elementAddClass(row, 'error')
                    this.elementAddClass(cell, 'error')

                    $.oc.flashMsg({text: message, 'class': 'error'})

                    window.setTimeout(function(){
                        self.focusCell(cell, false)
                        cell = null
                        self = null
                        cellProcessor = null
                    }, 100)
                    return false
                }
            }
        }

        return true
    }

    // EVENT HANDLERS
    // ============================

    Table.prototype.onClick = function(ev) {
        this.focusTable()

        if (this.navigation.onClick(ev) === false)
            return

        for (var i = 0, len = this.options.columns.length; i < len; i++) {
            var column = this.options.columns[i].key

            this.cellProcessors[column].onClick(ev)
        }

        var target = this.getEventTarget(ev, 'TD')

        if (!target)
            return

        if (target.tagName != 'TD')
            return

        this.focusCell(target, true)
    }

    Table.prototype.onKeydown = function(ev) {
        if (ev.keyCode == 65 && ev.altKey && this.options.adding) {
            if (!ev.shiftKey) {
                // alt+a - add record below
                this.addRecord('below')
            } else {    
                // alt+shift+a - add record above
                this.addRecord('above')
            }

            this.stopEvent(ev)
            return
        }

        if (ev.keyCode == 68 && ev.altKey && this.options.deleting) {
            // alt+d - delete record
            this.deleteRecord()

            this.stopEvent(ev)
            return
        }

        for (var i = 0, len = this.options.columns.length; i < len; i++) {
            var column = this.options.columns[i].key

            this.cellProcessors[column].onKeyDown(ev)
        }

        if (this.navigation.onKeydown(ev) === false)
            return
    }

    Table.prototype.onFormSubmit = function(ev, data) {
        if (data.handler == this.options.postbackHandlerName) {
            this.unfocusTable()

            if (!this.validate()) {
                ev.preventDefault()
                return
            }

            var fieldName = this.options.alias.indexOf('[') > -1 ? 
                this.options.alias + '[TableData]' :
                this.options.alias + 'TableData';

            data.options.data[fieldName] = this.dataSource.getAllData()
        }
    }

    Table.prototype.onToolbarClick = function(ev) {
        var target = this.getEventTarget(ev),
            cmd = target.getAttribute('data-cmd')

        switch (cmd) {
            case 'record-add-below':
                this.addRecord('below')
            break
            case 'record-add-above':
                this.addRecord('above')
            break
            case 'record-delete':
                this.deleteRecord()
            break
        }

        this.stopEvent(ev)
    }

    Table.prototype.onDocumentClick = function(ev) {
        var target = this.getEventTarget(ev)

        // Determine if the click was inside the table element
        // and just exit if so
        if (this.parentContainsElement(this.el, target))
            return

        // Request the active cell processor if the clicked 
        // element belongs to any extra-table element created
        // by the processor

        if (this.activeCellProcessor && this.activeCellProcessor.elementBelongsToProcessor(target))
            return

        this.unfocusTable()
    }

    // PUBLIC METHODS
    // ============================

    Table.prototype.dispose = function() {
        // Remove an editor and commit the data if needed
        this.unfocusTable()

        // Dispose the data source and clean up the reference
        this.dataSource.dispose()
        this.dataSource = null

        // Unregister event handlers
        this.unregisterHandlers()

        // Remove references to DOM elements
        this.dataTable = null
        this.headerTable = null
        this.toolbar = null

        // Dispose cell processors
        this.disposeCellProcessors()

        // Dispose helpers and remove references
        this.navigation.dispose()
        this.navigation = null

        // Delete references to the control HTML elements.
        // The script doesn't remove any DOM elements themselves.
        // If it's needed it should be done by the outer script,
        // we only make sure that the table widget doesn't hold 
        // references to the detached DOM tree so that the garbage
        // collector can delete the elements if needed.
        this.disposeScrollbar()
        this.el = null
        this.tableContainer = null
        this.$el = null
        this.dataTableContainer = null

        // Delete references to other DOM elements
        this.activeCell = null
    }

    // HELPER METHODS
    // ============================

    Table.prototype.getElement = function() {
        return this.el
    }

    Table.prototype.getAlias = function() {
        return this.options.alias
    }

    Table.prototype.getTableContainer = function() {
        return this.tableContainer
    }

    Table.prototype.getDataTableBody = function() {
        return this.dataTable.children[0]
    }

    Table.prototype.getEventTarget = function(ev, tag) {
        // TODO: refactor to a core library

        var target = ev.target ? ev.target : ev.srcElement

        if (tag === undefined)
            return target

        var tagName = target.tagName

        while (tagName != tag) {
            target = target.parentNode

            if (!target)
                return null

            tagName = target.tagName
        }

        return target
    }

    Table.prototype.stopEvent = function(ev) {
        // TODO: refactor to a core library

        if (ev.stopPropagation)
            ev.stopPropagation()
        else
            ev.cancelBubble = true

        if(ev.preventDefault)
            ev.preventDefault()
        else
            ev.returnValue = false
    }

    Table.prototype.elementHasClass = function(el, className) {
        // TODO: refactor to a core library

        if (el.classList)
            return el.classList.contains(className);
        
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }

    Table.prototype.elementAddClass = function(el, className) {
        // TODO: refactor to a core library

        if (this.elementHasClass(el, className))
            return

        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    }

    Table.prototype.elementRemoveClass = function(el, className) {
        // TODO: refactor to a core library

        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    Table.prototype.parentContainsElement = function(parent, element) {
        while (element && element != parent) {
            element = element.parentNode
        }

        return element ? true : false
    }

    Table.prototype.getCellValue = function(cellElement) {
        return cellElement.querySelector('[data-container]').value
    }

    Table.prototype.getCellRowKey = function(cellElement) {
        return parseInt(cellElement.parentNode.getAttribute('data-row'))
    }

    Table.prototype.findRowByKey = function(key) {
        return this.dataTable.querySelector('tbody tr[data-row="'+key+'"]')
    }

    Table.prototype.findRowByIndex = function(index) {
        return this.getDataTableBody().children[index]
    }

    Table.prototype.getCellRowIndex = function(cellElement) {
        return parseInt(cellElement.parentNode.rowIndex)
    }

    Table.prototype.getRowCellValueByColumnName = function(row, columnName) {
        var cell = row.querySelector('td[data-column="'+columnName+'"]')

        if (!cell)
            return cell

        return this.getCellValue(cell)
    }

    Table.prototype.getRowData = function(row) {
        var result = {}

        for (var i = 0, len = row.children.length; i < len; i++) {
            var cell = row.children[i]
            result[cell.getAttribute('data-column')] = this.getCellValue(cell)
        }

        return result
    }

    Table.prototype.setCellValue = function(cellElement, value) {
        var dataContainer = cellElement.querySelector('[data-container]')

        if (dataContainer.value != value) {
            dataContainer.value = value

            this.markCellRowDirty(cellElement)

            this.notifyRowProcessorsOnChange(cellElement)
        }
    }

    Table.DEFAULTS = {
        clientDataSourceClass: 'client',
        keyColumn: 'id',
        recordsPerPage: false,
        data: null,
        postback: true,
        postbackHandlerName: 'onSave',
        adding: true,
        deleting: true,
        toolbar: true,
        rowSorting: false,
        height: false,
        dynamicHeight: false
    }

    // TABLE PLUGIN DEFINITION
    // ============================

    var old = $.fn.table

    $.fn.table = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), 
            result = undefined

        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.table')
            var options = $.extend({}, Table.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.table', (data = new Table(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })
        
        return result ? result : this
    }

    $.fn.table.Constructor = Table

    $.oc.table.table = Table

    // TABLE NO CONFLICT
    // =================

    $.fn.table.noConflict = function () {
        $.fn.table = old
        return this
    }

    // TABLE DATA-API
    // ===============

    $(document).on('render', function(){
        $('div[data-control=table]').table()
    })

}(window.jQuery);

/* **********************************************
     Begin table.datasource.base.js
********************************************** */

/*
 * Base class for the table data sources.
 */
+function ($) { "use strict";

    // DATASOURCE NAMESPACES
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.datasource === undefined)
        $.oc.table.datasource = {}

    // CLASS DEFINITION
    // ============================

    var Base = function(tableObj) {
        //
        // State properties
        //

        this.tableObj = tableObj
    }

    Base.prototype.dispose = function() {
        this.tableObj = null
    }

    /*
     * Fetches records from the underlying data source and
     * passes them to the onSuccess callback function.
     * The onSuccess callback parameters: records, totalCount.
     * Each record contains the key field which uniquely identifies 
     * the record. The name of the key field is defined with the table 
     * widget options.
     */
    Base.prototype.getRecords = function(offset, count, onSuccess) {
        onSuccess([])
    }

    /*
     * Creates a record with the passed data and returns the updated page records
     * to the onSuccess callback function.
     * 
     * - recordData - the record fields
     * - placement - "bottom" (the end of the data set), "above", "below"
     * - relativeToKey - a row key, required if the placement is not "bottom"
     * - offset - the current page's first record index (zero-based)
     * - count - number of records to return
     * - onSuccess - a callback function to execute when the updated data gets available.
     *
     * The onSuccess callback parameters: records, totalCount.
     */
    Base.prototype.createRecord = function(recordData, placement, relativeToKey, offset, count, onSuccess) {
        onSuccess([], 0)
    }

    /*
     * Updates a record with the specified key with the passed data
     *
     * - key - the record key in the dataset (primary key, etc)
     * - recordData - the record fields.
     */
    Base.prototype.updateRecord = function(key, recordData) {
    }

    /*
     * Deletes a record with the specified key.
     *
     * - key - the record key in the dataset (primary key, etc).
     * - newRecordData - replacement record to add to the dataset if the deletion
     *   empties it.
     * - offset - the current page's first record key (zero-based)
     * - count - number of records to return
     * - onSuccess - a callback function to execute when the updated data gets available.
     *
     * The onSuccess callback parameters: records, totalCount.
     */
    Base.prototype.deleteRecord = function(key, newRecordData, offset, count, onSuccess) {
        onSuccess([], 0)
    }

    $.oc.table.datasource.base = Base;
}(window.jQuery);

/* **********************************************
     Begin table.processor.base.js
********************************************** */

/*
 * Base class for the table cell processors.
 */
+function ($) { "use strict";

    // PROCESSOR NAMESPACES
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.processor === undefined)
        $.oc.table.processor = {}

    // CLASS DEFINITION
    // ============================

    var Base = function(tableObj, columnName, columnConfiguration) {
        //
        // State properties
        //

        this.tableObj = tableObj

        this.columnName = columnName

        this.columnConfiguration = columnConfiguration

        this.activeCell = null

        this.validators = []

        // Register event handlers
        this.registerHandlers()

        // Initialize validators
        this.initValidators()
    }

    Base.prototype.dispose = function() {
        // Register event handlers
        this.unregisterHandlers()

        // Remove references to the DOM
        this.tableObj = null

        this.activeCell = null
    }

    /*
     * Renders the cell in the normal (no edit) mode
     */
    Base.prototype.renderCell = function(value, cellContentContainer) {
    }

    /*
     * Registers event handlers required for the cell processor.
     * Event handers should be bound to the container control element 
     * (not to the table element).
     */
    Base.prototype.registerHandlers = function() {
    }

    /*
     * Unregisters event handlers previously registered with 
     * registerHandlers().
     */
    Base.prototype.unregisterHandlers = function() {
    }

    /*
     * This method is called when the cell managed by the processor
     * is focused (clicked or navigated with the keyboard).
     */
    Base.prototype.onFocus = function(cellElement, isClick) {
    }


    /*
     * Forces the processor to hide the editor when the user navigates
     * away from the cell. Processors can update the sell value in this method.
     * Processors must clear the reference to the active cell in this method.
     */
    Base.prototype.onUnfocus = function() {
    }

    /*
     * Event handler for the keydown event. The table class calls this method
     * for all processors.
     */
    Base.prototype.onKeyDown = function(ev) {
    }

    /*
     * Event handler for the click event. The table class calls this method
     * for all processors.
     */
    Base.prototype.onClick = function(ev) {
    }

    /*
     * This method is called when a cell value in the row changes.
     */
    Base.prototype.onRowValueChanged = function(columnName, cellElement) {
    }

    /*
     * Determines if the keyboard navigation in the specified direction is allowed
     * by the cell processor. Some processors could reject the navigation, for example
     * the string processor could cancel the left array navigation if the caret 
     * in the text input is not in the beginning of the text.
     */
    Base.prototype.keyNavigationAllowed = function(ev, direction) {
        return true
    }

    /*
     * Determines if the processor's cell is focusable.
     */
    Base.prototype.isCellFocusable = function() {
        return true
    }

    /*
     * Returns the content container element of a cell
     */
    Base.prototype.getCellContentContainer = function(cellElement) {
        return cellElement.querySelector('.content-container')
    }

    /*
     * Creates a cell view data container (a DIV element that contains 
     * the current cell value). This functionality is required for most
     * of the processors, perhaps except the checkbox cell processor.
     */
    Base.prototype.createViewContainer = function(cellContentContainer, value) {
        var viewContainer = document.createElement('div')

        viewContainer.setAttribute('data-view-container', 'data-view-container')
        viewContainer.textContent = value

        cellContentContainer.appendChild(viewContainer)

        return viewContainer
    }

    /*
     * Returns the cell's view container element.
     */
    Base.prototype.getViewContainer = function(cellElement) {
        return cellElement.querySelector('[data-view-container]')
    }

    /*
     * Displays the view container
     */
    Base.prototype.showViewContainer = function(cellElement) {
        return this.getViewContainer(cellElement).setAttribute('class', '')
    }

    /*
     * Hides the view container
     */
    Base.prototype.hideViewContainer = function(cellElement) {
        return this.getViewContainer(cellElement).setAttribute('class', 'hide')
    }

    /*
     * Sets visual value for the view container
     */
    Base.prototype.setViewContainerValue = function(cellElement, value) {
        return this.getViewContainer(cellElement).textContent = value
    }

    /*
     * Determines whether the specified element is some element created by the 
     * processor. 
     */
    Base.prototype.elementBelongsToProcessor = function(element) {
        return false
    }

    Base.prototype.initValidators = function() {
        if (this.columnConfiguration.validation === undefined)
            return

        for (var validatorName in this.columnConfiguration.validation) {
            if ($.oc.table.validator === undefined || $.oc.table.validator[validatorName] == undefined)
                throw new Error('The table cell validator "'+validatorName+'" for the column "'+this.columnName+'" is not ' +
                    'found in the $.oc.table.validator namespace.')

            var validator = new $.oc.table.validator[validatorName](
                    this.columnConfiguration.validation[validatorName]
                )

            this.validators.push(validator)
        }
    }

    Base.prototype.validate = function(value, rowData) {
        for (var i=0, len=this.validators.length; i<len; i++) {
            var message = this.validators[i].validate(value, rowData)

            if (message !== undefined)
                return message
        }
    }

    $.oc.table.processor.base = Base
}(window.jQuery);

/* **********************************************
     Begin table.helper.navigation.js
********************************************** */

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
        } else
            curRecordCount = this.getRecordCount(paginationContainer)

        // Generate the new page list only if the record count has changed
        if (newPaginationContainer || curRecordCount != recordCount) {
            paginationContainer.setAttribute('data-record-count', recordCount)

            var pageList = this.buildPaginationLinkList(recordCount, 
                    this.tableObj.options.recordsPerPage, 
                    this.pageIndex)

            if (!newPaginationContainer)
                paginationContainer.replaceChild(pageList, paginationContainer.children[0])
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
            newRow = !ev.shiftKey ? 
                row.nextElementSibling :
                row.parentNode.children[row.parentNode.children.length - 1],
            cellIndex = forceCellIndex !== undefined ? 
                forceCellIndex :
                this.tableObj.activeCell.cellIndex

        if (newRow) {
            var cell = newRow.children[cellIndex]

            if (cell)
                this.tableObj.focusCell(cell)
        } else {
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

        if (!target)
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

/* **********************************************
     Begin table.datasource.client.js
********************************************** */

/*
 * Client memory data source for the table control.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.datasource === undefined)
        throw new Error("The $.oc.table.datasource namespace is not defined. Make sure that the table.datasource.base.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.datasource.base,
        BaseProto = Base.prototype

    var Client = function(tableObj) {
        Base.call(this, tableObj)

        var dataString = tableObj.getElement().getAttribute('data-data')

        if (dataString === null || dataString === undefined)
            throw new Error('The required data-data attribute is not found on the table control element.')

        this.data = JSON.parse(dataString)
    };

    Client.prototype = Object.create(BaseProto)
    Client.prototype.constructor = Client

    Client.prototype.dispose = function() {
        BaseProto.dispose.call(this)
        this.data = null
    }

    /*
     * Fetches records from the underlying data source and
     * passes them to the onSuccess callback function.
     * The onSuccess callback parameters: records, totalCount.
     * Each record contains the key field which uniquely identifies 
     * the record. The name of the key field is defined with the table 
     * widget options.
     */
    Client.prototype.getRecords = function(offset, count, onSuccess) {
        if (!count) {
            // Return all records
            onSuccess(this.data, this.data.length)
        } else {
            // Return a subset of records
            onSuccess(this.data.slice(offset, offset+count), this.data.length)
        }
    }

    /*
     * Creates a record with the passed data and returns the updated page records
     * to the onSuccess callback function.
     * 
     * - recordData - the record fields
     * - placement - "bottom" (the end of the data set), "above", "below"
     * - relativeToKey - a row key, required if the placement is not "bottom"
     * - offset - the current page's first record index (zero-based)
     * - count - number of records to return
     * - onSuccess - a callback function to execute when the updated data gets available.
     *
     * The onSuccess callback parameters: records, totalCount.
     */
    Client.prototype.createRecord = function(recordData, placement, relativeToKey, offset, count, onSuccess) {
        if (placement === 'bottom') {
            // Add record to the bottom of the dataset
            this.data.push(recordData)
        }
        else if (placement == 'above' || placement == 'below') {
            // Add record above or below the passed record key
            var recordIndex = this.getIndexOfKey(relativeToKey)
            if (placement == 'below')
                recordIndex ++

            this.data.splice(recordIndex, 0, recordData)
        }

        this.getRecords(offset, count, onSuccess)
    }

    /*
     * Updates a record with the specified key with the passed data
     *
     * - key - the record key in the dataset (primary key, etc)
     * - recordData - the record fields.
     */
    Client.prototype.updateRecord = function(key, recordData) {
        var recordIndex = this.getIndexOfKey(key)

        if (recordIndex !== -1) {
            recordData[this.tableObj.options.keyColumn] = key
            this.data[recordIndex] = recordData
        }
        else {
            throw new Error('Record with they key '+key+ ' is not found in the data set')
        }
    }

    /*
     * Deletes a record with the specified key.
     *
     * - key - the record key in the dataset (primary key, etc).
     * - newRecordData - replacement record to add to the dataset if the deletion
     *   empties it.
     * - offset - the current page's first record key (zero-based)
     * - count - number of records to return
     * - onSuccess - a callback function to execute when the updated data gets available.
     *
     * The onSuccess callback parameters: records, totalCount.
     */
    Base.prototype.deleteRecord = function(key, newRecordData, offset, count, onSuccess) {
        var recordIndex = this.getIndexOfKey(key)

        if (recordIndex !== -1) {
            this.data.splice(recordIndex, 1)

            if (this.data.length == 0)
                this.data.push(newRecordData)

            this.getRecords(offset, count, onSuccess)
        }
        else {
            throw new Error('Record with they key '+key+ ' is not found in the data set')
        }
    }

    Client.prototype.getIndexOfKey = function(key) {
        var keyColumn = this.tableObj.options.keyColumn

        return this.data.map(function(record) {
            return record[keyColumn] + ""
        }).indexOf(key + "")
    }

    Client.prototype.getAllData = function() {
        return this.data
    }

    $.oc.table.datasource.client = Client
}(window.jQuery);

/* **********************************************
     Begin table.processor.checkbox.js
********************************************** */

/*
 * Checkbox cell processor for the table control.
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

    var CheckboxProcessor = function(tableObj, columnName, columnConfiguration) {
        //
        // Parent constructor
        //

        Base.call(this, tableObj, columnName, columnConfiguration)
    }

    CheckboxProcessor.prototype = Object.create(BaseProto)
    CheckboxProcessor.prototype.constructor = CheckboxProcessor

    CheckboxProcessor.prototype.dispose = function() {
        BaseProto.dispose.call(this)
    }

    /*
     * Determines if the processor's cell is focusable.
     */
    CheckboxProcessor.prototype.isCellFocusable = function() {
        return false
    }

    /*
     * Renders the cell in the normal (no edit) mode
     */
    CheckboxProcessor.prototype.renderCell = function(value, cellContentContainer) {
        var checkbox = document.createElement('div')
        checkbox.setAttribute('data-checkbox-element', 'true')
        checkbox.setAttribute('tabindex', '0')

        if (value && value != 0 && value != "false")
            checkbox.setAttribute('class', 'checked')

        cellContentContainer.appendChild(checkbox)
    }

    /*
     * This method is called when the cell managed by the processor
     * is focused (clicked or navigated with the keyboard).
     */
    CheckboxProcessor.prototype.onFocus = function(cellElement, isClick) {
        cellElement.querySelector('div[data-checkbox-element]').focus()
    }

    /*
     * Event handler for the keydown event. The table class calls this method
     * for all processors.
     */
    CheckboxProcessor.prototype.onKeyDown = function(ev) {
        if (ev.keyCode == 32)
            this.onClick(ev)
    }

    /*
     * Event handler for the click event. The table class calls this method
     * for all processors.
     */
    CheckboxProcessor.prototype.onClick = function(ev) {
        var target = this.tableObj.getEventTarget(ev, 'DIV')

        if (target.getAttribute('data-checkbox-element')) {
            this.changeState(target)
        }
    }

    CheckboxProcessor.prototype.changeState = function(divElement) {
        var cell = divElement.parentNode.parentNode

        if (divElement.getAttribute('class') == 'checked') {
            divElement.setAttribute('class', '')
            this.tableObj.setCellValue(cell, 0)
        } else {
            divElement.setAttribute('class', 'checked')
            this.tableObj.setCellValue(cell, 1)
        }
    }

    $.oc.table.processor.checkbox = CheckboxProcessor;
}(window.jQuery);

/* **********************************************
     Begin table.processor.dropdown.js
********************************************** */

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
        // TODO: refactor to a core library

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

/* **********************************************
     Begin table.processor.string.js
********************************************** */

/*
 * String cell processor for the table control.
 * The string processor allows to edit cell values with a simple
 * input control.
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

    var StringProcessor = function(tableObj, columnName, columnConfiguration) {
        //
        // State properties
        //

        this.focusTimeoutHandler = this.onFocusTimeout.bind(this)

        //
        // Parent constructor
        //

        Base.call(this, tableObj, columnName, columnConfiguration)
    }

    StringProcessor.prototype = Object.create(BaseProto)
    StringProcessor.prototype.constructor = StringProcessor

    StringProcessor.prototype.dispose = function() {
        BaseProto.dispose.call(this)
        this.focusTimeoutHandler = null
    }

    /*
     * Renders the cell in the normal (no edit) mode
     */
    StringProcessor.prototype.renderCell = function(value, cellContentContainer) {
        this.createViewContainer(cellContentContainer, value)
    }

    /*
     * This method is called when the cell managed by the processor
     * is focused (clicked or navigated with the keyboard).
     */
    StringProcessor.prototype.onFocus = function(cellElement, isClick) {
        if (this.activeCell === cellElement)
            return

        this.activeCell = cellElement
        this.buildEditor(cellElement, this.getCellContentContainer(cellElement))
    }

    /*
     * Forces the processor to hide the editor when the user navigates
     * away from the cell. Processors can update the sell value in this method.
     * Processors must clear the reference to the active cell in this method.
     */
    StringProcessor.prototype.onUnfocus = function() {
        if (!this.activeCell)
            return

        var editor = this.activeCell.querySelector('.string-input')
        if (editor) {
            // Update the cell value and remove the editor
            this.tableObj.setCellValue(this.activeCell, editor.value)
            this.setViewContainerValue(this.activeCell, editor.value)
            editor.parentNode.removeChild(editor)
        }

        this.showViewContainer(this.activeCell)
        this.activeCell = null
    }
    
    StringProcessor.prototype.buildEditor = function(cellElement, cellContentContainer) {
        // Hide the view container
        this.hideViewContainer(this.activeCell)

        // Create the input control 
        var input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('class', 'string-input')
        input.value = this.tableObj.getCellValue(cellElement)
        cellContentContainer.appendChild(input)

        this.setCaretPosition(input, 0)

        // Focus the element in the next frame. 
        // http://stackoverflow.com/questions/779379/why-is-settimeoutfn-0-sometimes-useful
        window.setTimeout(this.focusTimeoutHandler, 0)
    }

    /*
     * Determines if the keyboard navigation in the specified direction is allowed
     * by the cell processor. Some processors could reject the navigation, for example
     * the string processor could cancel the left array navigation if the caret 
     * in the text input is not in the beginning of the text.
     */
    StringProcessor.prototype.keyNavigationAllowed = function(ev, direction) {
        if (direction != 'left' && direction != 'right')
            return true

        if (!this.activeCell)
            return true

        var editor = this.activeCell.querySelector('.string-input')
        if (!editor)
            return true

        var caretPosition = this.getCaretPosition(editor)

        if (direction == 'left')
            return caretPosition == 0

        if (direction == 'right')
            return caretPosition == editor.value.length

        return true
    }

    StringProcessor.prototype.onFocusTimeout = function() {
        if (!this.activeCell)
            return

        var editor = this.activeCell.querySelector('.string-input')
        if (!editor)
            return

        editor.focus()
        this.setCaretPosition(editor, 0)
    }

    StringProcessor.prototype.getCaretPosition = function(input) {
        // TODO: refactor to a core library

        if (document.selection) { 
           var selection = document.selection.createRange()

           selection.moveStart('character', -input.value.length)
           return selection.text.length
        }

        if (input.selectionStart !== undefined)
           return input.selectionStart

        return 0
    }

    StringProcessor.prototype.setCaretPosition = function(input, position) {
        // TODO: refactor to a core library

        if (document.selection) { 
            var range = input.createTextRange()

            setTimeout(function() {
                // Asynchronous layout update, better performance
                range.collapse(true)
                range.moveStart("character", position)
                range.moveEnd("character", 0)
                range.select()
            }, 0)
        }

        if (input.selectionStart !== undefined) {
            setTimeout(function() {
                // Asynchronous layout update
                input.selectionStart = position
                input.selectionEnd = position
            }, 0)
       }

        return 0
    }

    $.oc.table.processor.string = StringProcessor;
}(window.jQuery);

/* **********************************************
     Begin table.validator.base.js
********************************************** */

/*
 * Base class for the table validators.
 */
+function ($) { "use strict";

    // VALIDATOR NAMESPACES
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.validator === undefined)
        $.oc.table.validator = {}

    // CLASS DEFINITION
    // ============================

    var Base = function(options) {
        //
        // State properties
        //

        this.options = options
    }

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Base.prototype.validate = function(value, rowData) {
        if (this.options.requiredWith !== undefined && !this.rowHasValue(this.options.requiredWith, rowData))
            return

        return this.validateValue(value, rowData)
    }

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined. This method should be redefined
     * in descendant classes.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Base.prototype.validateValue = function(value, rowData) {
        
    }

    Base.prototype.trim = function(value) {
        if (String.prototype.trim)
            return value.trim()

        return value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
    }

    Base.prototype.getMessage = function(defaultValue) {
        if (this.options.message !== undefined)
            return this.options.message

        return defaultValue
    }

    Base.prototype.rowHasValue = function(columnName, rowData) {
        if (rowData[columnName] === undefined)
            return false

        if (typeof rowData[columnName] == 'boolean')
            return rowData[columnName]

        var value = this.trim(String(rowData[columnName]))

        return value.length > 0
    }

    $.oc.table.validator.base = Base;
}(window.jQuery);

/* **********************************************
     Begin table.validator.required.js
********************************************** */

/*
 * Required table validator.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.validator === undefined)
        throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.validator.base,
        BaseProto = Base.prototype

    var Required = function(options) {
        Base.call(this, options)
    };

    Required.prototype = Object.create(BaseProto)
    Required.prototype.constructor = Required

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Required.prototype.validateValue = function(value, rowData) {
        value = this.trim(value)

        if (value.length === 0)
            return this.getMessage("The value should not be empty.")

        return
    }

    $.oc.table.validator.required = Required
}(window.jQuery);

/* **********************************************
     Begin table.validator.basenumber.js
********************************************** */

/*
 * Base class for number validators.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.validator === undefined)
        throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.validator.base,
        BaseProto = Base.prototype

    var BaseNumber = function(options) {
        Base.call(this, options)
    };

    BaseNumber.prototype = Object.create(BaseProto)
    BaseNumber.prototype.constructor = BaseNumber

    BaseNumber.prototype.doCommonChecks = function(value) {
        if (this.options.min !== undefined || this.options.max !== undefined) {
            if (this.options.min !== undefined) {
                if (this.options.min.value === undefined)
                    throw new Error('The min.value parameter is not defined in the table validator configuration')

                if (value < this.options.min.value) {
                    return this.options.min.message !== undefined ?
                        this.options.min.message :
                        "The value should not be less than " + this.options.min.value
                }
            }

            if (this.options.max !== undefined) {
                if (this.options.max.value === undefined)
                    throw new Error('The max.value parameter is not defined in the table validator configuration')

                if (value > this.options.max.value) {
                    return this.options.max.message !== undefined ?
                        this.options.max.message :
                        "The value should not be more than " + this.options.max.value
                }
            }
        }

        return
    }

    $.oc.table.validator.baseNumber = BaseNumber
}(window.jQuery);

/* **********************************************
     Begin table.validator.integer.js
********************************************** */

/*
 * Integer table validator.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.validator === undefined)
        throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");

    if ($.oc.table.validator.baseNumber === undefined)
        throw new Error("The $.oc.table.validator.baseNumber namespace is not defined. Make sure that the table.validator.baseNumber.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.validator.baseNumber,
        BaseProto = Base.prototype

    var Integer = function(options) {
        Base.call(this, options)
    };

    Integer.prototype = Object.create(BaseProto)
    Integer.prototype.constructor = Integer

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Integer.prototype.validateValue = function(value, rowData) {
        value = this.trim(value)

        if (value.length == 0)
            return

        var testResult = this.options.allowNegative ? 
            /^\-?[0-9]*$/.test(value) : 
            /^[0-9]*$/.test(value)

        if (!testResult) {
            var defaultMessage = this.options.allowNegative ?
                'The value should be an integer.' :
                'The value should be a positive integer';

            return this.getMessage(defaultMessage)
        }

        return this.doCommonChecks(parseInt(value))
    }

    $.oc.table.validator.integer = Integer
}(window.jQuery);

/* **********************************************
     Begin table.validator.float.js
********************************************** */

/*
 * Float table validator.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.validator === undefined)
        throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");

    if ($.oc.table.validator.baseNumber === undefined)
        throw new Error("The $.oc.table.validator.baseNumber namespace is not defined. Make sure that the table.validator.baseNumber.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.validator.baseNumber,
        BaseProto = Base.prototype

    var Float = function(options) {
        Base.call(this, options)
    };

    Float.prototype = Object.create(BaseProto)
    Float.prototype.constructor = Float

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Float.prototype.validateValue = function(value, rowData) {
        value = this.trim(value)

        if (value.length == 0)
            return

        var testResult = this.options.allowNegative ? 
            /^[-]?([0-9]+\.[0-9]+|[0-9]+)$/.test(value) : 
            /^([0-9]+\.[0-9]+|[0-9]+)$/.test(value)

        if (!testResult) {
            var defaultMessage = this.options.allowNegative ?
                'The value should be a floating point number.' :
                'The value should be a positive floating point number';

            return this.getMessage(defaultMessage)
        }

        return this.doCommonChecks(parseFloat(value))
    }

    $.oc.table.validator.float = Float
}(window.jQuery);

/* **********************************************
     Begin table.validator.length.js
********************************************** */

/*
 * String length table validator.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.validator === undefined)
        throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.validator.base,
        BaseProto = Base.prototype

    var Length = function(options) {
        Base.call(this, options)
    };

    Length.prototype = Object.create(BaseProto)
    Length.prototype.constructor = Length

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Length.prototype.validateValue = function(value, rowData) {
        value = this.trim(value)

        if (value.length == 0)
            return

        if (this.options.min !== undefined || this.options.max !== undefined) {
            if (this.options.min !== undefined) {
                if (this.options.min.value === undefined)
                    throw new Error('The min.value parameter is not defined in the Length table validator configuration')

                if (value.length < this.options.min.value) {
                    return this.options.min.message !== undefined ?
                        this.options.min.message :
                        "The string should not be shorter than " + this.options.min.value
                }
            }

            if (this.options.max !== undefined) {
                if (this.options.max.value === undefined)
                    throw new Error('The max.value parameter is not defined in the Length table validator configuration')

                if (value.length > this.options.max.value) {
                    return this.options.max.message !== undefined ?
                        this.options.max.message :
                        "The string should not be longer than " + this.options.max.value
                }
            }
        }

        return
    }

    $.oc.table.validator.length = Length
}(window.jQuery);

/* **********************************************
     Begin table.validator.regex.js
********************************************** */

/*
 * Regex length table validator.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.validator === undefined)
        throw new Error("The $.oc.table.validator namespace is not defined. Make sure that the table.validator.base.js script is loaded.");

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.table.validator.base,
        BaseProto = Base.prototype

    var Regex = function(options) {
        Base.call(this, options)
    };

    Regex.prototype = Object.create(BaseProto)
    Regex.prototype.constructor = Regex

    /*
     * Validates a value and returns the error message. If there
     * are no errors, returns undefined.
     * The rowData parameter is an object containing all values in the
     * target row.
     */
    Regex.prototype.validateValue = function(value, rowData) {
        value = this.trim(value)

        if (value.length == 0)
            return

        if (this.options.pattern === undefined)
            throw new Error('The pattern parameter is not defined in the Regex table validator configuration')

        var regexObj = new RegExp(this.options.pattern, this.options.modifiers)

        if (!regexObj.test(value))
            return this.getMessage("Invalid value format.")

        return
    }

    $.oc.table.validator.regex = Regex
}(window.jQuery);