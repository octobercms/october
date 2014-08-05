/*
 * DataGrid plugin
 * 
 * Data attributes:
 * - data-control="datagrid" - enables the plugin on an element
 * - data-allow-remove="true" - allow rows to be removed
 * - data-autocomplete-handler="onAutocomplete" - AJAX handler for autocomplete values
 * - data-data-locker="input#locker" - Input element to store and restore grid data as JSON
 * - data-source-handler="onGetData" - AJAX handler for obtaining grid data
 *
 * JavaScript API:
 * $('div#someElement').dataGrid({ option: 'value' })
 *
 * Dependences:
 * - Handsontable (handsontable.js)
 */

+function ($) { "use strict";

    // DATAGRID CLASS DEFINITION
    // ============================

    var DataGrid = function(element, options) {
        var self       = this
        this.options   = options
        this.$el       = $(element)

        this.columnHeaders = this.options.columnHeaders
        this.staticWidths = this.options.columnWidths
        this.gridInstance = null
        this.columns = validateColumns(this.options.columns)

        // Init
        var handsontableOptions = {
            colHeaders: function(columnIndex) {
                return self.columnHeaders[columnIndex]
            },
            colWidths: function(columnIndex) {
                return self.staticWidths[columnIndex]
            },
            // height: 400,
            columns: this.columns,
            startRows: this.options.startRows,
            minRows: this.options.minRows,
            currentRowClassName: 'currentRow',
            // rowHeaders: false,
            // manualColumnMove: true,
            // manualRowMove: true,
            afterChange: function(changes, source) {
                if (source === 'loadData')
                    return

                /*
                 * changes - is a 2D array containing information about each of the edited cells 
                 *           [ [row, prop, oldVal, newVal], ... ].
                 *
                 * source  - is one of the strings: "alter", "empty", "edit", "populateFromArray",
                 *           "loadData", "autofill", "paste", "remove".
                 */
                self.$el.trigger('datagrid.change', [changes, source])
            },
            fillHandle: false,
            multiSelect: false,
            removeRowPlugin: this.options.allowRemove
        }

        if (this.options.autoInsertRows)
            handsontableOptions.minSpareRows = 1

        /*
         * Data provided
         */
        if (this.options.data) {
            handsontableOptions.data = this.options.data
        }
        /*
         * Data from an AJAX data source
         */
        else if (this.options.sourceHandler) {
            self.refreshDataSource()
        }
        /*
         * Data from a data locker
         */
        else if (this.options.dataLocker) {
            /*
             * Event to update the data locker
             */
            this.$dataLocker = $(this.options.dataLocker)
            self.$el.on('datagrid.change', function(event) {
                if (!self.gridInstance) return
                self.$dataLocker.val(JSON.stringify(self.getData()))
            })

            /*
             * Populate existing data
             */
            try {
                var existingData = JSON.parse(this.$dataLocker.val())
                if (existingData) handsontableOptions.data = existingData
            } catch (e) {
                delete handsontableOptions.data
            }
        }

        /*
         * Monitor for data changes
         */
        if (this.options.changeHandler) {
            self.$el.on('datagrid.change', function(event, changes, source) {
                var changeData = [];

                $.each(changes, function(index, change){
                    var changeObj = {}
                    changeObj.keyName = change[1]
                    changeObj.oldValue = change[2]
                    changeObj.newValue = change[3]

                    if (changeObj.oldValue == changeObj.newValue)
                        return; // continue

                    changeObj.rowData = self.getDataAtRow(change[0])
                    changeData.push(changeObj)
                })

                if (changeData.length > 0) {
                    self.$el.request(self.options.changeHandler, {
                        data: { grid_action: source, grid_changes: changeData }
                    })
                }
            })
        }

        /*
         * Create up Handson table and validate columns
         */
        this.$el.handsontable(handsontableOptions)
        this.gridInstance = this.$el.handsontable('getInstance')

        self.updateUi()

        $(window).on('oc.updateUi', function(){
            self.updateUi()
        })

        $(window).on('resize', function(){
            self.staticWidths = self.calculateColumnWidths()
        })

        function validateColumns(columns) {
            $.each(columns, function(index, column){

                if (column.type == 'autocomplete' && !column.source) {
                    column.source = function(query, process) {
                        return requestAutocompleteData(column, query, process)
                    }
                }

            })

            return columns
        }

        /*
         * Auto complete
         */
        var autocompleteLastQuery = '',
            autocompleteInterval = 300,
            autocompleteInputTimer

        function requestAutocompleteData(column, query, process) {

            if (!self.options.autocompleteHandler)
                return

            if (query == autocompleteLastQuery) return
            autocompleteLastQuery = query

            if (autocompleteInputTimer !== undefined)
                window.clearTimeout(autocompleteInputTimer);

            autocompleteInputTimer = window.setTimeout(function(){
                var dataSet = {
                    autocomplete_field: column.data,
                    autocomplete_value: query,
                    autocomplete_data: self.getDataAtRow()
                }

                $.request(self.options.autocompleteHandler, {
                    data: dataSet,
                    success: function(data, textStatus, jqXHR){
                        process(data.result)
                    }
                })

            }, autocompleteInterval);
        }
    }

    DataGrid.DEFAULTS = {
        data: null,
        dataLocker: null,
        sourceHandler: null,
        changeHandler: null,
        startRows: 1,
        minRows: 1,
        autoInsertRows: false,
        columnHeaders: null,
        columnWidths: null,
        columns: null,
        autocompleteHandler: null,
        allowRemove: true,
        confirmMessage: 'Are you sure?'
    }

    DataGrid.prototype.setHeaderValue = function(index, value) {
        this.columnHeaders[index] = value
    }

    DataGrid.prototype.getDataAtRow = function(row) {
        if (!row && row !== 0)
            row = this.getSelectedRow()

        return $.extend(true, {}, this.gridInstance.getDataAtRow(row))
    }

    DataGrid.prototype.refreshDataSource = function() {
        var self = this
        this.$el.request(self.options.sourceHandler, {
            success: function(data, textStatus, jqXHR){
                self.setData(data.result)
            }
        })
    }

    DataGrid.prototype.deselect = function() {
        this.gridInstance.deselectCell()
    }

    DataGrid.prototype.setData = function(data) {
        this.gridInstance.loadData(data)
    }

    DataGrid.prototype.getData = function() {
        var self = this,
            results = [],
            dataArray = this.gridInstance.getData()

        $.each(dataArray, function(index, object){
            var dataObj = {}

            // Prune out unwanted array data
            $.each(self.columns, function(index, column){
                dataObj[column.data] = object[column.data]
            })
            results.push(dataObj)
        })
        return results
    }

    DataGrid.prototype.insertRow = function(index) {
        if (!index)
            index = this.getSelectedRow()

        if (!index)
            index = 0

        this.gridInstance.alter('insert_row', index)
        this.updateUi()
    }

    DataGrid.prototype.removeRow = function(index) {
        if (!confirm(this.options.confirmMessage))
            return

        if (!index)
            index = this.getSelectedRow()

        if (!index && index !== 0)
            return

        var changes = [[index, null, null, 'DELETE']]
        this.$el.trigger('datagrid.change', [changes, 'remove'])

        this.gridInstance.alter('remove_row', index)
        this.updateUi()
    }

    DataGrid.prototype.getSelectedRow = function() {
        var row,
            selectedArr = this.gridInstance.getSelected()

        if (selectedArr && selectedArr.length > 0)
            row = selectedArr[0]

        return row
    }

    DataGrid.prototype.updateUi = function() {
        this.staticWidths = this.calculateColumnWidths()
        this.gridInstance.render()
    }

    DataGrid.prototype.calculateColumnWidths = function() {

        var widths = this.options.columnWidths,
            totalWidth = this.$el.innerWidth(),
            usedWidth = 0,
            unsetWidthCounts = 0,
            staticWidths = [],
            offsetWidth = 0

        /*
         * Account for row headers
         */
        this.$el.find('colgroup > .rowHeader').each(function(){
            offsetWidth += $(this).width()
        })

        /*
         * Account for scrollbars
         */
        this.$el.find('.dragdealer.vertical:visible').each(function(){
            offsetWidth += $(this).width()
        })

        $.each(widths, function() {
            var width = parseInt(this)
            usedWidth += width
            if (width <= 0) unsetWidthCounts++
        })

        $.each(widths, function() {
            if (this > 0) {
                staticWidths.push(this)
            } else {
                var remainingWidth = ((totalWidth - offsetWidth - usedWidth) / unsetWidthCounts) - 1
                staticWidths.push(Math.max(remainingWidth, 100))
            }
        })

        return staticWidths
    }

    // DATAGRID PLUGIN DEFINITION
    // ============================

    var old = $.fn.dataGrid

    $.fn.dataGrid = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.datagrid')
            var options = $.extend({}, DataGrid.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.datagrid', (data = new DataGrid(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })
        
        return result ? result : this
    }

    $.fn.dataGrid.Constructor = DataGrid

    // DATAGRID NO CONFLICT
    // =================

    $.fn.dataGrid.noConflict = function () {
        $.fn.dataGrid = old
        return this
    }

    // DATAGRID DATA-API
    // ===============

    $(document).on('render', function(){
        $('div[data-control=datagrid]').dataGrid()
    })

}(window.jQuery);


/*
 * Custom plugin for handsontable
 */

(function (Handsontable, $) {
    "use strict";

    function init() {
        var instance = this;

        var pluginEnabled = !!(instance.getSettings().removeRowPlugin);

        if (pluginEnabled) {
            bindMouseEvents();
            instance.rootElement.addClass('htControlPanel');
        } else {
            unbindMouseEvents();
            instance.rootElement.removeClass('htControlPanel');
        }

        function bindMouseEvents() {
            instance.rootElement.on('mouseover.removeRow', 'tbody th, tbody td', function () {
                getButton(this).show();
            });
            instance.rootElement.on('mouseout.removeRow', 'tbody th, tbody td', function () {
                getButton(this).hide();
            });
        }

        function unbindMouseEvents() {
            instance.rootElement.off('mouseover.removeRow');
            instance.rootElement.off('mouseout.removeRow');
        }

        function getButton(td) {
            return $(td).parent('tr').find('th.htControlPanel').eq(0).find('.close');
        }
    }

    Handsontable.PluginHooks.add('beforeInitWalkontable', function (walkontableConfig) {
        var instance = this;

        /**
         * rowHeaders is a function, so to alter the actual value we need to alter the result returned by this function
         */
        var baseRowHeaders = walkontableConfig.rowHeaders;
        walkontableConfig.rowHeaders = function () {
            var pluginEnabled = Boolean(instance.getSettings().removeRowPlugin);

            var newRowHeader = function (row, elem) {

                var $el = $(elem).empty().addClass('htNoFrame htControlPanel'),
                    $btn;

                if (row > -1) {
                    $btn = $('<button />').addClass('close').html('&times;').hide();
                    $el.append($btn);

                    $btn.on('mouseup', function () {
                        instance.rootElement.dataGrid('removeRow', row)
                        $(window).trigger('oc.updateUi')
                    });
                }
            };

            return pluginEnabled ? Array.prototype.concat.call([], newRowHeader, baseRowHeaders()) : baseRowHeaders();
        };
    });

    Handsontable.PluginHooks.add('beforeInit', function () {
        init.call(this)
    });

    Handsontable.PluginHooks.add('afterUpdateSettings', function () {
        init.call(this)
    });
})(Handsontable, jQuery);
