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

        // Init
        var handsontableOptions = {
            colHeaders: this.options.columnHeaders,
            colWidths: function(columnIndex) {
                return self.staticWidths[columnIndex]
            },
            columns: this.options.columns,
            startRows: this.options.startRows,
            fillHandle: false,
            // rowHeaders: true,
            // manualColumnMove: true,
            // manualRowMove: true,
            removeRowPlugin: true
        }


        this.$el.handsontable(handsontableOptions)

        this.staticWidths = this.calculateColumnWidths()
        self.$el.handsontable('render')

        $(window).on('oc.updateUi', function(){
            self.staticWidths = self.calculateColumnWidths()
            self.$el.handsontable('render')
        })

        $(window).on('resize', function(){
            self.staticWidths = self.calculateColumnWidths()
        })
    }

    DataGrid.DEFAULTS = {
        startRows: null,
        columnHeaders: null,
        columnWidths: null,
        columns: null
    }

    DataGrid.prototype.calculateColumnWidths = function() {

        var widths = this.options.columnWidths,
            totalWidth = this.$el.innerWidth(),
            usedWidth = 0,
            unsetWidthCounts = 0,
            staticWidths = [],
            headerOffsetWidth = 0

        this.$el.find('colgroup > .rowHeader').each(function(){
            headerOffsetWidth += $(this).width()
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
                var remainingWidth = ((totalWidth - headerOffsetWidth - usedWidth) / unsetWidthCounts) - 2
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