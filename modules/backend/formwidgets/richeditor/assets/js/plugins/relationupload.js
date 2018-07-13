var richeditorRelationUploadPlugin;

function richeditorRelationUploadSelect($form) {
    richeditorRelationUploadPlugin.insertFromBrowse($form);
}
(function ($) {
    // Add an option for your plugin.
    // $.FroalaEditor.DEFAULTS = $.extend($.FroalaEditor.DEFAULTS, {
    //
    // });

    $.FroalaEditor.PLUGINS.relationUpload = function (editor) {

        function insertFromBrowse($form) {
            var $selected = $("input[name^='relations'][type='checkbox']:checked, input[name^='relations'][type='hidden']:enabled", $form);

            if(!$selected.length) {
                return;
            }

            var selectedArray = [];
            $($selected).each(function(index) {
                var name = ($(this).attr('name'));
                console.log(name);
                name = name.replace(/]/g, "");
                var nameArr = name.split("[");
                var inputIndex = nameArr[1];
                var inputType = nameArr[2];
                if(inputType == "id") {
                    selectedArray.splice(inputIndex, 0, {})
                    selectedArray[inputIndex].id = $(this).val();
                }
                else if(inputType == "file_name") {
                    selectedArray[inputIndex].file_name = $(this).val();
                }
                else if(inputType == "disk_name") {
                    selectedArray[inputIndex].disk_name = $(this).val();
                }
                else if(inputType == "path") {
                    selectedArray[inputIndex].path = $(this).val();
                }
                else if(inputType == "file_type") {
                    selectedArray[inputIndex].file_type = $(this).val();
                }
            });

            var i = 0;
            for(i = 0; i < selectedArray.length; i++){
                if(selectedArray[i].file_type == "image") {
                    var $currentImage = editor.image.get();
                    editor.image.insert(selectedArray[i]['path'], false, {}, $currentImage)
                }
                else if(selectedArray[i].file_type == "video") {
                    var $richEditorNode = editor.$el.closest('[data-control="richeditor"]');
                    $richEditorNode.richEditor('insertVideo', selectedArray[i].path, selectedArray[i].file_name);
                }
                else if(selectedArray[i].file_type == "audio") {
                    var $richEditorNode = editor.$el.closest('[data-control="richeditor"]');
                    $richEditorNode.richEditor('insertAudio', selectedArray[i].path, selectedArray[i].file_name);
                }
                else {
                    // Focus in the editor.
                    editor.events.focus(true);
                    editor.selection.restore();

                    // Insert the link.
                    editor.html.insert('<a href="' + selectedArray[i].path + '" id="fr-inserted-file" class="fr-file">' + selectedArray[i].file_name + '</a>');

                    // Get the file.
                    var $file = editor.$el.find('#fr-inserted-file');
                    $file.removeAttr('id');
                }
            }
        }

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
            richeditorRelationUploadPlugin = this;
            editor.$el.popup({
                handler: editor.opts.relationUploadBrowseHandler
            })
        }

        function onInsertVideo() {
            richeditorRelationUploadPlugin = this;
            editor.$el.popup({
                handler: editor.opts.relationUploadBrowseHandler
            })
        }

        function onInsertAudio() {
            richeditorRelationUploadPlugin = this;
            editor.$el.popup({
                handler: editor.opts.relationUploadBrowseHandler
            })
        }

        function onInsertFile() {
            richeditorRelationUploadPlugin = this;
            editor.$el.popup({
                handler: editor.opts.relationUploadBrowseHandler
            })
        }

        /**
         * Init.
         */
        function _init () {
            _setOptions();
        }

        return {
            _init: _init,
            insertFromBrowse: insertFromBrowse,
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
