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
     */
    Client.prototype.getRecords = function(offset, count, onSuccess) {
        onSuccess(this.data)
    }

    /*
     * Returns the total number of records in the underlying set
     */
    Client.prototype.count = function() {
        return this.data.length
    }

    /*
     * Creates a record with the passed data and returns the new record index.
     */
    Client.prototype.createRecord = function(recordData) {
        return 0;
    }

    /*
     * Updates a record with the specified index with the passed data
     */
    Client.prototype.updateRecord = function(index, recordData) {
// console.log('Update recird', index, recordData)
    }

    $.oc.table.datasource.client = Client
}(window.jQuery);