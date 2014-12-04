/*
 * Table control class
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

        // Event handlers
        this.clickHandler = this.onClick.bind(this)
        this.keydownHandler = this.onKeydown.bind(this)

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

        // Create header and data tables
        this.buildTables()

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
    }

    Table.prototype.unregisterHandlers = function() {
        this.el.removeEventListener('click', this.clickHandler);
        this.clickHandler = null

        this.el.removeEventListener('keydown', this.keydownHandler);
        this.keydownHandler = null
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

    Table.prototype.buildTables = function() {
        this.tableContainer = document.createElement('div')
        this.tableContainer.setAttribute('class', 'table-container')

        // Build the headers table
        this.tableContainer.appendChild(this.buildHeaderTable())

        // Append the table container to the element
        this.el.insertBefore(this.tableContainer, this.el.children[0])

        // Build the data table
        this.updateDataTable()
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

            header.textContent !== undefined ? 
                header.textContent = this.options.columns[i].title :
                header.innerText = this.options.columns[i].title

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
            tbody = document.createElement('tbody')

        dataTable.setAttribute('class', 'data')

        for (var i = 0, len = records.length; i < len; i++) {
            var row = document.createElement('tr')

            if (records[i].__key === undefined)
                throw new Error('The row attribute __key is not set for the row #'+i);

            row.setAttribute('data-row', records[i].__key)
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

                cellProcessor.renderCell(records[i][columnName], cellContentContainer)

                cell.appendChild(cellContentContainer)

                cell.appendChild(dataContainer)
                row.appendChild(cell)
            }

            tbody.appendChild(row)
        }

        dataTable.appendChild(tbody)

        // Inject the data table to the DOM or replace the existing table
        if (this.dataTable !== null)
            this.tableContainer.replaceChild(dataTable, this.dataTable)
        else
            this.tableContainer.appendChild(dataTable)

        this.dataTable = dataTable

        // Update column widths
        this.updateColumnWidth()

        // Update the pagination links
        this.navigation.buildPagination(totalCount)
    }

    Table.prototype.fetchRecords = function(onSuccess) {
        this.dataSource.getRecords(
            this.navigation.getPageFirstRowOffset(), 
            this.options.recordsPerPage,
            onSuccess)
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
        if (this.activeCellProcessor)
            this.activeCellProcessor.onUnfocus()

        this.commitEditedRow()
        this.activeCellProcessor = null
        this.activeCell = null
    }

    /*
     * Calls the onFocus() method for the cell processor responsible for the
     * newly focused cell. Commit the previous edited row to the data source
     * if needed.
     */
    Table.prototype.focusCell = function(cellElement) {
        var columnName = cellElement.getAttribute('data-column')
        if (columnName === null)
            return

        var processor = this.getCellProcessor(columnName)
        if (!processor)
            throw new Error("Cell processor not found for the column "+columnName)

        if (this.activeCell)
            this.activeCell.setAttribute('class', '')

        if (this.activeCell !== cellElement) {
            this.setActiveProcessor(processor)
            this.activeCell = cellElement

            if (processor.isCellFocusable())
                this.activeCell.setAttribute('class', 'active')
        }

        // If the cell belongs to other row than the currently edited, 
        // commit currently edited row to the data source. Update the
        // currently edited row key.
        var rowKey = this.getCellRowKey(cellElement)

        if (this.editedRowKey !== null && rowKey != this.editedRowKey)
            this.commitEditedRow()

        this.editedRowKey = rowKey

        processor.onFocus(cellElement, true)
    }

    Table.prototype.markCellRowDirty = function(cellElement) {
        cellElement.parentNode.setAttribute('data-dirty', 1)
    }

    Table.prototype.addRecord = function(placement) {
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

        if (this.navigation.paginationEnabled())
            this.navigation.pageIndex = this.navigation.getNewRowPage(placement, currentRowIndex)

        this.unfocusTable()

        this.recordsAddedOrDeleted++

        // New records have negative keys
        var recordData = {
                __key: -1*this.recordsAddedOrDeleted
            },
            self = this

        this.dataSource.createRecord(recordData, placement, relativeToKey,
            this.navigation.getPageFirstRowOffset(), 
            this.options.recordsPerPage,
            function onAddRecordDataTableSuccess(records, totalCount) {
                self.buildDataTable(records, totalCount)

                var row = self.findRowByKey(recordData.__key)
                if (!row)
                    throw new Error('New row is not found in the updated table: '+recordData.__key)

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
        var newRecordData = {
                __key: -1*this.recordsAddedOrDeleted
            }

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

    // EVENT HANDLERS
    // ============================

    Table.prototype.onClick = function(ev) {
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

        this.focusCell(target)
    }

    Table.prototype.onKeydown = function(ev) {
        if (ev.keyCode == 65 && ev.altKey) {
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

        if (ev.keyCode == 68 && ev.altKey) {
            // alt+d - delete record
            this.deleteRecord('above')

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
        this.el = null
        this.tableContainer = null

        // Delete references to other DOM elements
        this.activeCell = null
    }


    // HELPER METHODS
    // ============================

    Table.prototype.getElement = function() {
        return this.el
    }

    Table.prototype.getTableContainer = function() {
        return this.tableContainer
    }

    Table.prototype.getDataTableBody = function() {
        return this.dataTable.children[0]
    }

    Table.prototype.getEventTarget = function(ev, tag) {
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
        if (ev.stopPropagation)
            ev.stopPropagation()
        else
            ev.cancelBubble = true

        if(ev.preventDefault)
            ev.preventDefault()
        else
            ev.returnValue = false
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

    Table.prototype.setCellValue = function(cellElement, value) {
        var dataContainer = cellElement.querySelector('[data-container]')

        if (dataContainer.value != value) {
            dataContainer.value = value

            this.markCellRowDirty(cellElement)
        }
    }

    Table.DEFAULTS = {
        clientDataSourceClass: 'client',
        recordsPerPage: false,
        data: null
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