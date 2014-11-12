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
        this.$el = $(element)
        this.options = options

        //
        // State properties
        //

        this.dataSource = this.createDataSource()

        // The current first record index.
        // This index is zero based and has nothing to do 
        // with the database identifiers or any underlying data.
        this.offset = 0

        // The index of the row which is being edited at the moment.
        // This index corresponds the data source row index which 
        // uniquely identifies the row in the data set. The negative 
        // value means that no record is edited at the moment. When the
        // table grid notices that a cell in another row is edited it commits
        // the previously edited record to the data source.
        this.editedRowIndex = -1
    };

    Table.prototype.dispose = function() {
        // Delete the reference to the HTML element.
        // The script doesn't remove any DOM elements themselves.
        // If it's needed it should be done by the outer script,
        // we only make sure that the table widget doesn't hold 
        // references to the detached DOM tree so that the garbage
        // collector can delete the elements if needed.
        this.$el = null

        // Dispose the data source and clean up the reference
        this.dataSource.dispose()
        this.dataSource = null

        // TODO: unbind event handlers,
        // remove references to objects,
        // remove references to DOM elements
    };

    Table.prototype.createDataSource = function() {
        var dataSourceClass = this.options.clientDataSourceClass;

        if ($.oc.table.datasource === undefined || $.oc.table.datasource[dataSourceClass] == undefined)
            throw new Error('The table client-side data source class "'+dataSourceClass+'" is not \
                found in the .oc.table.datasource namespace.')

        this.dataSource = new $.oc.table.datasource[dataSourceClass](this);
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