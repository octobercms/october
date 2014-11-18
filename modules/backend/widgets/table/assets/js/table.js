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

        // The cell processors array
        this.cellProcessors = []

        // A reference to the currently active cell processor
        this.activeCellProcessor = null

        // A reference to the currently active table cell
        this.activeCell = null

        // The current first record index.
        // This index is zero based and has nothing to do 
        // with the database identifiers or any underlying data.
        this.offset = 0

        // The index of the row which is being edited at the moment.
        // This index corresponds the data source row index which 
        // uniquely identifies the row in the data set. When the
        // table grid notices that a cell in another row is edited it commits
        // the previously edited record to the data source.
        this.editedRowIndex = null

        // A reference to the data table.
        this.dataTable = null

        // Event handlers
        this.clickHandler = this.onClick.bind(this)

        // Navigation helper
        this.navigation = null

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
    }

    Table.prototype.unregisterHandlers = function() {
        this.el.removeEventListener('click', this.clickHandler);

        this.clickHandler = null
    }

    Table.prototype.initCellProcessors = function() {
        for (var i = 0, len = this.options.columns.length; i < len; i++) {
            var column = this.options.columns[i].key,
                columnType = this.options.columns[i].type

            // Resolve the default column type string
            if (columnType === undefined) {
                columnType = 'string'
                this.options.columns[i].type = columnType
            }

            if ($.oc.table.processor === undefined || $.oc.table.processor[columnType] == undefined)
                throw new Error('The table cell processor for the column type "'+columnType+'" is not ' +
                    'found in the $.oc.table.processor namespace.')

            this.cellProcessors[column] = new $.oc.table.processor[columnType](this, column)
        }
    }

    Table.prototype.getCellProcessor = function(columnName) {
        return this.cellProcessors[columnName]
    }

    Table.prototype.buildTables = function() {
        // Build the headers table
        this.el.appendChild(this.buildHeaderTable())

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
            header.textContent !== undefined ? 
                header.textContent = this.options.columns[i].title :
                header.innerText = this.options.columns[i].title

            row.appendChild(header)
        }

        return headersTable
    }

    Table.prototype.updateDataTable = function() {
        var self = this;

        this.getRecords(function onSuccess(records){
            self.buildDataTable(records)
        })
    }

    Table.prototype.buildDataTable = function(records) {
        // Completely remove the existing data table. By convention there should 
        // be no event handlers or references bound to it.
        if (this.dataTable !== null)
            this.dataTable.parentNode.removeChild(this.dataTable);

        this.dataTable = document.createElement('table')

        for (var i = 0, len = records.length; i < len; i++) {
            var row = document.createElement('tr')

            row.setAttribute('data-row', i)

            for (var j = 0, colsLen = this.options.columns.length; j < colsLen; j++) {
                var cell = document.createElement('td'),
                    dataContainer = document.createElement('input'),
                    column = this.options.columns[j],
                    columnName = column.key,
                    cellProcessor = this.getCellProcessor(columnName)

                cell.setAttribute('data-column', columnName)
                cell.setAttribute('data-column-type', column.type)

                dataContainer.setAttribute('type', 'hidden')
                dataContainer.setAttribute('data-container', 'data-container')
                dataContainer.value = records[i][columnName]

                cellProcessor.renderCell(records[i][columnName], cell)

                cell.appendChild(dataContainer)
                row.appendChild(cell)
            }

            this.dataTable.appendChild(row)
        }

        // Build the data table
        this.el.appendChild(this.dataTable)
    }

    Table.prototype.getRecords = function(onSuccess) {
        return this.dataSource.getRecords(
            this.offset, 
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
        if (this.editedRowIndex === null)
            return

        var editedRow = this.dataTable.querySelector('tr[data-row="'+this.editedRowIndex+'"]')
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

        this.dataSource.updateRecord(this.editedRowIndex, data)
        editedRow.setAttribute('data-dirty', 0)
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

        if (this.activeCell !== cellElement) {
            this.setActiveProcessor(processor)
            this.activeCell = cellElement
        }

        // If the cell belongs to other row than the currently edited, 
        // commit currently edited row to the data source. Update the
        // currently edited row index.
        var rowIndex = this.getCellRowIndex(cellElement)

        if (this.editedRowIndex !== null && rowIndex != this.editedRowIndex)
            this.commitEditedRow()

        this.editedRowIndex = rowIndex

        processor.onFocus(cellElement, true)
    }

    Table.prototype.markCellRowDirty = function(cellElement) {
        cellElement.parentNode.setAttribute('data-dirty', 1)
    }

    // EVENT HANDLERS
    // ============================

    Table.prototype.onClick = function(ev) {
        var target = this.getEventTarget(ev, 'TD')

        if (!target)
            return

        if (target.tagName != 'TD')
            return

        this.focusCell(target)
    }

    // PUBLIC METHODS
    // ============================

    Table.prototype.dispose = function() {
        // Dispose the data source and clean up the reference
        this.dataSource.dispose()
        this.dataSource = null

        // Unregister event handlers
        this.unregisterHandlers()

        // Remove references to DOM elements
        this.dataTable = null

        // Dispose cell processors
        this.disposeCellProcessors()

        // Dispose helpers and remove references
        this.navigation.dispose()
        this.navigation = null

        // Delete the reference to the control HTML element.
        // The script doesn't remove any DOM elements themselves.
        // If it's needed it should be done by the outer script,
        // we only make sure that the table widget doesn't hold 
        // references to the detached DOM tree so that the garbage
        // collector can delete the elements if needed.
        this.el = null

        // Delete references to other DOM elements
        this.activeCell = null
    }


    // HELPER METHODS
    // ============================

    Table.prototype.getElement = function() {
        return this.el
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

    Table.prototype.getCellRowIndex = function(cellElement) {
        return cellElement.parentNode.getAttribute('data-row')
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