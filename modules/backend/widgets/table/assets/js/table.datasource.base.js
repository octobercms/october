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
     */
    Base.prototype.getRecords = function(offset, count, onSuccess) {
        onSuccess([])
    }

    /*
     * Returns the total number of records in the underlying set
     */
    Base.prototype.count = function() {
        return 0
    }

    /*
     * Creates a record with the passed data and returns the new record index.
     */
    Base.prototype.createRecord = function(recordData) {
        return 0
    }

    /*
     * Updates a record with the specified index with the passed data
     */
    Base.prototype.updateRecord = function(index, recordData) {
    }

    /*
     * Deletes a record with the specified index
     */
    Base.prototype.deleteRecord = function(index) {
    }

    $.oc.table.datasource.base = Base;
}(window.jQuery);