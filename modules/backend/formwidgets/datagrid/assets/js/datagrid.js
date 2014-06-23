/*
 * DataGrid plugin
 * 
 * Data attributes:
 * - data-control="datagrid" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * $('a#someElement').dataGrid({ option: 'value' })
 *
 * Dependences: 
 * - Some other plugin (filename.js)
 */

+function ($) { "use strict";

    // DATAGRID CLASS DEFINITION
    // ============================

    var DataGrid = function(element, options) {
        var self       = this
        this.options   = options
        this.$el       = $(element)

        this.staticWidths = this.options.columnWidths
        this.gridInstance = null
        this.columns = validateColumns(this.options.columns)

        // Init
        var handsontableOptions = {
            colHeaders: this.options.columnHeaders,
            colWidths: function(columnIndex) {
                return self.staticWidths[columnIndex]
            },
            height: 400,
            columns: this.columns,
            startRows: this.options.startRows,
            minRows: this.options.minRows,
            currentRowClassName: 'currentRow',
            // rowHeaders: true,
            // manualColumnMove: true,
            // manualRowMove: true,
            fillHandle: false,
            multiSelect: false,
            removeRowPlugin: true
        }

        if (this.options.autoInsertRows)
            handsontableOptions.minSpareRows = 1

        if (this.options.dataLocker) {
            /*
             * Event to update the data locker
             */
            this.$dataLocker = $(this.options.dataLocker)
            handsontableOptions.afterChange = function(changes, source) {
                if (!self.gridInstance) return
                self.$dataLocker.val(JSON.stringify(self.getData()))
            }

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
        dataLocker: null,
        startRows: 1,
        minRows: 1,
        autoInsertRows: false,
        columnHeaders: null,
        columnWidths: null,
        columns: null,
        autocompleteHandler: null,
        confirmMessage: 'Are you sure?'
    }

    DataGrid.prototype.getDataAtRow = function(row) {
        if (!row && row !== 0)
            row = this.getSelectedRow()

        return $.extend(true, {}, this.gridInstance.getDataAtRow(row))
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
                        instance.alter("remove_row", row);
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