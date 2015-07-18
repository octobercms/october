/*
 * Scripts for the Import/Export controller behavior.
 */
+function ($) { "use strict";

    var ImportExportBehavior = function() {

        this.bindColumnSorting = function() {
            /*
             * Unbind existing
             */
            $('#importDbColumns > ul, .import-column-bindings > ul').each(function(){
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

            $('#importDbColumns > ul, .import-column-bindings > ul').sortable(sortableOptions)
        }

        this.ignoreFileColumn = function(el) {
            var $el = $(el),
                $column = $el.closest('[data-column-id]')

            $column.addClass('column-ignored')
            $('#showIgnoredColumnsButton').removeClass('disabled')
        }

        this.showIgnoredColumns = function(el) {
            $('#importFileColumns li.column-ignored').removeClass('column-ignored')
            $('#showIgnoredColumnsButton').addClass('disabled')
        }

        this.loadFileColumnSample = function(el) {
            var $el = $(el),
                $column = $el.closest('[data-column-id]'),
                columnId = $column.data('column-id')

            $el.popup({
                handler: 'onImportLoadColumnSamplePopup',
                extraData: {
                    file_column_id: columnId
                }
            })
        }
    }

    $.oc.importExportBehavior = new ImportExportBehavior;
}(window.jQuery);