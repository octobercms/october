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
        BaseProto = $.oc.table.datasource.base.prototype

    var Client = function(tableObj) {
        Base.call(this, tableObj)
    };

    Client.prototype = Object.create(BaseProto)
    Client.prototype.constructor = Client

    Client.prototype.dispose = function() {
        BaseProto.dispose.call(this)
    };

    $.oc.table.datasource.client = Client
}(window.jQuery);