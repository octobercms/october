/*
 * Scripts for the Import/Export controller behavior.
 */
+function ($) { "use strict";

    var ImportExportBehavior = function() {

        this.bindColumnSorting = function() {
            /*
             * Unbind existing
             */
            $('.import-db-columns > ul, .import-column-bindings > ul').each(function(){
                var $this = $(this)
                if ($this.data('oc.sortable')) {
                    $this.sortable('destroyGroup')
                    $this.sortable('destroy')
                }
            })

            var sortableOptions = {
                group: 'import-fields',
                usePlaceholderClone: true,
                nested: false
            }

            $('.import-db-columns > ul, .import-column-bindings > ul').sortable(sortableOptions)
        }
    }

    $.oc.importExportBehavior = new ImportExportBehavior;
}(window.jQuery);