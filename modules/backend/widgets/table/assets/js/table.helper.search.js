/*
 * Search helper for the table widget.
 * Implements searching within the table.
 */
+function ($) { "use strict";

    // NAMESPACE CHECK
    // ============================

    if ($.oc.table === undefined)
        throw new Error("The $.oc.table namespace is not defined. Make sure that the table.js script is loaded.");

    if ($.oc.table.helper === undefined)
        $.oc.table.helper = {}

    // SEARCH CLASS DEFINITION
    // ============================

    var Search = function(tableObj) {
        // Reference to the table object
        this.tableObj = tableObj

        // The search form element
        this.searchForm = null
        this.searchInput = null

        // Timer used for tracking input changes
        this.inputTrackTimer = null

        // Event handlers

        // Active search query
        this.activeQuery = null

        this.isActive = false

        this.init()
    };

    Search.prototype.init = function() {
    }

    Search.prototype.dispose = function() {
        // Remove the reference to the table object
        this.tableObj = null
        this.searchForm = null
        this.searchInput = null
    }

    Search.prototype.buildSearchForm = function() {
        if (!this.searchEnabled())
            return

        var el = this.tableObj.getElement(),
            toolbar = this.tableObj.getToolbar(),
            searchForm = toolbar.querySelector('.table-search')

        if (!searchForm) {
            this.searchForm = $($('[data-table-toolbar-search]', el).html()).appendTo(toolbar).get(0)
            this.searchInput = $('.table-search-input', this.searchForm).get(0)
        }
    }

    Search.prototype.getQuery = function() {
        return $.trim(this.activeQuery)
    }

    Search.prototype.hasQuery = function() {
        return this.searchEnabled() && $.trim(this.activeQuery).length > 0
    }

    Search.prototype.searchEnabled = function() {
        return this.tableObj.options.searching
    }

    Search.prototype.performSearch = function(query, onSuccess) {
        var isDirty = this.activeQuery != query

        this.activeQuery = query

        if (isDirty) {
            this.tableObj.updateDataTable(onSuccess)
        }
    }

    // EVENT HANDLERS
    // ============================

    Search.prototype.onKeydown = function(ev) {
        // The navigation object uses the table's keydown handler
        // and doesn't register own handler.

        // Tab pressed
        if (ev.keyCode == 9) {
            this.onClick(ev)
            return
        }

        if (!this.isActive) {
            return
        }

        var self = this
        this.inputTrackTimer = window.setTimeout(function() {
            self.performSearch(self.searchInput.value)
        }, 300)
    }

    Search.prototype.onClick = function(ev) {
        var target = this.tableObj.getEventTarget(ev, 'INPUT')
        this.isActive = target && $(target).hasClass('table-search-input')
    }

    $.oc.table.helper.search = Search;

}(window.jQuery);
