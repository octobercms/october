var richeditorRelationUploadPlugin;

function richeditorRelationUploadSetSelectedRecords($form) {
    richeditorRelationUploadPlugin.setSelectedRecords($form);
}
function richeditorRelationUploadInsert() {
    richeditorRelationUploadPlugin.insertSelectedRecords();
}
function richeditorRelationUploadRemove() {
    richeditorRelationUploadPlugin.removeSelectedRecords();
}
(function ($) {
    // Add an option for your plugin.
    // $.FroalaEditor.DEFAULTS = $.extend($.FroalaEditor.DEFAULTS, {
    //
    // });

    $.FroalaEditor.PLUGINS.relationUpload = function (editor) {

        var selectedRecords;
        function setSelectedRecords($form) {
            var $selected = $("input[name^='relations'][type='checkbox']:checked, input[name^='relations'][type='hidden']:enabled", $form);

            if(!$selected.length) {
                return;
            }

            var selectedArray = [];
            $($selected).each(function(index) {
                var name = ($(this).attr('name'));
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
            selectedRecords = selectedArray;
        }

        function insertSelectedRecords($form) {
            var i = 0;
            for(i = 0; i < selectedRecords.length; i++){
                if(selectedRecords[i].file_type == "image") {
                    var $currentImage = editor.image.get();
                    editor.image.insert(selectedRecords[i]['path'], false, {}, $currentImage)
                }
                else if(selectedRecords[i].file_type == "video") {
                    var $richEditorNode = editor.$el.closest('[data-control="richeditor"]');
                    $richEditorNode.richEditor('insertVideo', selectedRecords[i].path, selectedRecords[i].file_name);
                }
                else if(selectedRecords[i].file_type == "audio") {
                    var $richEditorNode = editor.$el.closest('[data-control="richeditor"]');
                    $richEditorNode.richEditor('insertAudio', selectedRecords[i].path, selectedRecords[i].file_name);
                }
                else {
                    // Focus in the editor.
                    editor.events.focus(true);
                    editor.selection.restore();

                    // Insert the link.
                    editor.html.insert('<a href="' + selectedRecords[i].path + '" id="fr-inserted-file" class="fr-file">' + selectedArray[i].file_name + '</a>');

                    // Get the file.
                    var $file = editor.$el.find('#fr-inserted-file');
                    $file.removeAttr('id');
                }
            }

            selectedRecords = [];
        }

        function removeSelectedRecords() {
            var html = editor.html.get();
            html = $.parseHTML(html);
            for(i = 0; i < selectedRecords.length; i++){
                console.log(selectedRecords[i].file_type);
                if(selectedRecords[i].file_type == 'document'){
                    $(html).find("a[href='"+selectedRecords[i].path+"']").remove();
                }
                else if(selectedRecords[i].file_type == 'image') {
                    $(html).find("img[src='"+selectedRecords[i].path+"']").remove();
                }
            }
            editor.html.set(html[0].outerHTML);

            selectedRecords = [];
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
                handler: editor.opts.relationRecordsHandler,
                size: 'adaptive'
            })
        }

        function onInsertFile() {
            richeditorRelationUploadPlugin = this;
            editor.$el.popup({
                handler: editor.opts.relationRecordsHandler,
                size: 'adaptive'
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
            setSelectedRecords: setSelectedRecords,
            insertSelectedRecords: insertSelectedRecords,
            removeSelectedRecords: removeSelectedRecords,
            insertImage: onInsertImage,
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
