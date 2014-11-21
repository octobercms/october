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
     */
    Base.prototype.getRecords = function(offset, count, onSuccess) {
        onSuccess([])
    }

    /*
     * Creates a record with the passed data and returns the updated page records
     * to the onSuccess callback function.
     * 
     * - recordData - the record fields
     * - offset - the current page's first record index (zero-based)
     * - count - number of records to return
     * - onSuccess - a callback function to execute when the updated data gets available.
     *
     * The onSuccess callback parameters: records, totalCount.
     */
    Base.prototype.createRecord = function(recordData, offset, count, onSuccess) {
        onSuccess([], 0)
    }

    /*
     * Updates a record with the specified index with the passed data
     *
     * - index - the record index in the dataset (primary key, etc)
     * - recordData - the record fields.
     */
    Base.prototype.updateRecord = function(index, recordData) {
    }

    /*
     * Deletes a record with the specified index.
     *
     * - index - the record index in the dataset (primary key, etc).
     * - offset - the current page's first record index (zero-based)
     * - count - number of records to return
     * - onSuccess - a callback function to execute when the updated data gets available.
     *
     * The onSuccess callback parameters: records, totalCount.
     */
    Base.prototype.deleteRecord = function(index, offset, count, onSuccess) {
        onSuccess([], 0)
    }

    $.oc.table.datasource.base = Base;
}(window.jQuery);