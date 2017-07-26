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
        this.disposed = false

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

        // Search helper
        this.search = null

        // Number of records added or deleted during the session
        this.recordsAddedOrDeleted = 0

        // Bound reference to dispose() - ideally the class should use the October foundation library base class
        this.disposeBound = this.dispose.bind(this)

        //
        // Initialization
        //

        this.init()

        $.oc.foundation.controlUtils.markDisposable(element)
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
        this.search = new $.oc.table.helper.search(this)

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
        this.$el.one('dispose-control', this.disposeBound)

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
        if (this.options.toolbar) {
            this.buildToolbar()
        }

        // Build the headers table
        this.tableContainer.appendChild(this.buildHeaderTable())

        // Append the table container to the element
        this.el.insertBefore(this.tableContainer, this.el.children[0])

        if (!this.options.height) {
            this.dataTableContainer = this.tableContainer
        }
        else {
            this.dataTableContainer = this.buildScrollbar()
        }

        // Build the data table
        this.updateDataTable()
    }

    Table.prototype.buildToolbar = function() {
        if (!this.options.adding && !this.options.deleting) {
            return
        }

        this.toolbar = $($('[data-table-toolbar]', this.el).html()).appendTo(this.tableContainer).get(0)

        if (!this.options.adding) {
            $('[data-cmd^="record-add"]', this.toolbar).remove()
        }
        else {
            if (this.navigation.paginationEnabled() || !this.options.rowSorting) {
                // When the pagination is enabled, or sorting is disabled,
                // new records can only be added to the bottom of the
                // table, so just show the general "Add row" button.
                $('[data-cmd=record-add-below], [data-cmd=record-add-above]', this.toolbar).remove()
            }
            else {
                $('[data-cmd=record-add]', this.toolbar).remove()
            }
        }

        if (!this.options.deleting) {
            $('[data-cmd="record-delete"]', this.toolbar).remove()
        }
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

        this.fetchRecords(function onUpdateDataTableSuccess(records, totalCount) {
            self.buildDataTable(records, totalCount)

            if (onSuccess)
                onSuccess()

            if (totalCount == 0)
                self.addRecord('above', true)

            self.$el.trigger('oc.tableUpdateData', [
                records,
                totalCount
            ])

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
                dataContainer.value = this.formatDataContainerValue(records[i][columnName])

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

        // Update the search form
        this.search.buildSearchForm()
    }

    Table.prototype.formatDataContainerValue = function(value) {
        if (value === undefined) {
            return ''
        }

        if (typeof value === 'boolean') {
            return value ? 1 : ''
        }

        return value
    }

    Table.prototype.fetchRecords = function(onSuccess) {
        if (this.search.hasQuery()) {
            this.dataSource.searchRecords(
                this.search.getQuery(),
                this.navigation.getPageFirstRowOffset(),
                this.options.recordsPerPage,
                onSuccess
            )
        }
        else {
            this.dataSource.getRecords(
                this.navigation.getPageFirstRowOffset(),
                this.options.recordsPerPage,
                onSuccess
            )
        }
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

        recordData[keyColumn] = -1 * this.recordsAddedOrDeleted

        this.$el.trigger('oc.tableNewRow', [
            recordData
        ])

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

        newRecordData[keyColumn] = -1 * this.recordsAddedOrDeleted

        this.dataSource.deleteRecord(
            key,
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

        if (this.search.onClick(ev) === false)
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
            }
            else {
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

        if (this.navigation.onKeydown(ev) === false) {
            return
        }

        if (this.search.onKeydown(ev) === false) {
            return
        }
    }

    Table.prototype.onFormSubmit = function(ev, data) {
        if (data.handler == this.options.postbackHandlerName) {
            this.unfocusTable()

            if (!this.validate()) {
                ev.preventDefault()
                return
            }

            var fieldName = this.options.fieldName.indexOf('[') > -1
                ? this.options.fieldName + '[TableData]'
                : this.options.fieldName + 'TableData'

            data.options.data[fieldName] = this.dataSource.getAllData()
        }
    }

    Table.prototype.onToolbarClick = function(ev) {
        var target = this.getEventTarget(ev),
            cmd = target.getAttribute('data-cmd')

        if (!cmd) {
            return
        }

        switch (cmd) {
            case 'record-add':
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
        if (this.disposed) {
            // Prevent errors when legacy code executes the dispose() method
            // directly, bypassing $.oc.foundation.controlUtils.disposeControls(container)
            return
        }

        this.disposed = true

        this.disposeBound = true

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

    /*
     * Updates row values in the table. 
     * rowIndex is an integer value containing the row index on the current page.
     * The rowValues should be a hash object containing only changed
     * columns.
     * Returns false if the row wasn't found. Otherwise returns true.
     */
    Table.prototype.setRowValues = function(rowIndex, rowValues) {
        var row = this.findRowByIndex(rowIndex)

        if (!row) {
            return false
        }

        var dataUpdated = false

        for (var i = 0, len = row.children.length; i < len; i++) {
            var cell = row.children[i],
                cellColumnName = this.getCellColumnName(cell)

            for (var rowColumnName in rowValues) {
                if (rowColumnName == cellColumnName) {
                    this.setCellValue(cell, rowValues[rowColumnName], true)
                    dataUpdated = true
                }
            }
        }

        if (dataUpdated) {
            var originalEditedRowKey = this.editedRowKey

            this.editedRowKey = this.getRowKey(row)
            this.commitEditedRow()
            this.editedRowKey = originalEditedRowKey
        }

        return true
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
        // TODO: use the foundation library

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
        // TODO: use the foundation library

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
        // TODO: use the foundation library

        if (el.classList)
            return el.classList.contains(className);
        
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }

    Table.prototype.elementAddClass = function(el, className) {
        // TODO: use the foundation library

        if (this.elementHasClass(el, className))
            return

        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    }

    Table.prototype.elementRemoveClass = function(el, className) {
        // TODO: use the foundation library

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

    Table.prototype.getRowKey = function(rowElement) {
        return parseInt(rowElement.getAttribute('data-row'))
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

    Table.prototype.getCellColumnName = function(cellElement) {
        return cellElement.getAttribute('data-column')
    }

    Table.prototype.setCellValue = function(cellElement, value, suppressEvents) {
        var dataContainer = cellElement.querySelector('[data-container]')

        if (dataContainer.value != value) {
            dataContainer.value = value

            this.markCellRowDirty(cellElement)

            this.notifyRowProcessorsOnChange(cellElement)

            if (suppressEvents === undefined || !suppressEvents) {
                this.$el.trigger('oc.tableCellChanged', [
                    this.getCellColumnName(cellElement),
                    value,
                    this.getCellRowIndex(cellElement)
                ])
            }
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
        searching: false,
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