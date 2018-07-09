(function ($) {
    // Add an option for your plugin.
    // $.FroalaEditor.DEFAULTS = $.extend($.FroalaEditor.DEFAULTS, {
    //
    // });

    $.FroalaEditor.PLUGINS.relationUpload = function (editor) {

        function _setOptions() {
            editor.opts.requestHeaders = {
                'X-CSRF-TOKEN': $('input[name="_token"]').val(),
                'X-Requested-With': 'XMLHttpRequest'
            }
            editor.opts.imageUploadParams = editor.opts.fileUploadParams = {
                X_OCTOBER_RICHEDITOR_RELATION_UPLOAD: 1,
                _session_key: $('input[name="_session_key"]').val(),
            }
        }
        /**
         * Init.
         */
        function _init () {
            _setOptions();
        }

        return {
            _init: _init,
        }
    }

})(jQuery);
