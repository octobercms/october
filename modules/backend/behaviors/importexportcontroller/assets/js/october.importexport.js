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

        this.loadFileColumnSample = function(el, id) {
            $(el).popup({
                handler: 'onImportLoadColumnSample'
            })
        }
    }

    $.oc.importExportBehavior = new ImportExportBehavior;
}(window.jQuery);