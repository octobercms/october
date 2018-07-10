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

        function onInsertImage() {
            console.log('browse upload image');
        }

        function onInsertVideo() {
            console.log('browse upload video');
        }

        function onInsertAudio() {
            console.log('browse upload audio');
        }

        function onInsertFile() {
            console.log('browse upload file');
        }

        /**
         * Init.
         */
        function _init () {
            _setOptions();
        }

        return {
            _init: _init,
            insertImage: onInsertImage,
            insertVideo: onInsertVideo,
            insertAudio: onInsertAudio,
            insertFile: onInsertFile,
        }
    }

    $.FE.DEFAULTS.imageInsertButtons.push('relationUploadImageManager');

    $.FE.RegisterCommand('relationUploadImageManager', {
        title: 'Browse',
        undo: false,
        focus: false,
        callback: function () {
            this.relationUpload.insertImage();
        },
        plugin: 'relationUpload'
    })

    // Add the font size icon.
    $.FE.DefineIcon('relationUploadImageManager', {
        NAME: 'folder'
    });

    $.FE.DEFAULTS.videoInsertButtons.push('relationUploadVideoManager');

    $.FE.RegisterCommand('relationUploadVideoManager', {
        title: 'Browse',
        undo: false,
        focus: false,
        callback: function () {
            this.relationUpload.insertVideo();
        },
        plugin: 'relationUpload'
    })

    // Add the font size icon.
    $.FE.DefineIcon('relationUploadVideoManager', {
        NAME: 'folder'
    });

    $.FE.DEFAULTS.audioInsertButtons.push('relationUploadAudioManager');

    $.FE.RegisterCommand('relationUploadAudioManager', {
        title: 'Browse',
        undo: false,
        focus: false,
        callback: function () {
            this.relationUpload.insertAudio();
        },
        plugin: 'relationUpload'
    })

    // Add the font size icon.
    $.FE.DefineIcon('relationUploadAudioManager', {
        NAME: 'folder'
    });

    $.FE.DEFAULTS.fileInsertButtons.push('relationUploadFileManager');

    $.FE.RegisterCommand('relationUploadFileManager', {
        title: 'Browse',
        undo: false,
        focus: false,
        callback: function () {
            this.relationUpload.insertFile();
        },
        plugin: 'relationUpload'
    })

    // Add the font size icon.
    $.FE.DefineIcon('relationUploadFileManager', {
        NAME: 'folder'
    });

})(jQuery);
