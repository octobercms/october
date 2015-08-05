/*
 * Scripts for the Export controller behavior.
 */
+function ($) { "use strict";

    var ExportBehavior = function() {

        this.processExport = function () {
            var $form = $('#exportColumns').closest('form')

            $form.request('onExport', {
                success: function(data) {
                    $('#exportContainer').html(data.result)
                    $(document).trigger('render')
                }
            })
        }

    }

    $.oc.exportBehavior = new ExportBehavior;
}(window.jQuery);