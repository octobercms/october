(function ($) {

    $.FroalaEditor.PLUGINS.mediaManager = function (editor) {

        function onInsertFile() {
            new $.oc.mediaManager.popup({
                alias: 'ocmediamanager',
                cropAndInsertButton: false,
                onInsert: function(items) {
                    if (!items.length) {
                        $.oc.alert($.oc.lang.get('mediamanager.invalid_file_empty_insert'))
                        return
                    }

                    if (items.length > 1) {
                        $.oc.alert($.oc.lang.get('mediamanager.invalid_file_single_insert'))
                        return
                    }

                    var link,
                        text = editor.selection.text(),
                        textIsEmpty = $.trim(text) === ''

                    for (var i=0, len=items.length; i<len; i++) {
                        var text = textIsEmpty ? items[i].title : text

                        link = items[i].publicUrl
                    }

                    // Focus in the editor.
                    editor.events.focus(true);
                    editor.selection.restore();

                    // Insert the link.
                    editor.html.insert('<a href="' + link + '" id="fr-inserted-file" class="fr-file">' + text + '</a>');

                    // Get the file.
                    var $file = editor.$el.find('#fr-inserted-file');
                    $file.removeAttr('id');

                    editor.undo.saveStep()
                    this.hide()
                }
            })
        }

        function onInsertImage() {
            var $currentImage = editor.image.get(),
                selection = editor.selection.get(),
                range = editor.selection.ranges(0);

            new $.oc.mediaManager.popup({
                alias: 'ocmediamanager',
                cropAndInsertButton: true,
                onInsert: function(items) {
                    editor.selection.clear();
                    selection.addRange(range);
                    
                    if (!items.length) {
                        $.oc.alert($.oc.lang.get('mediamanager.invalid_image_empty_insert'))
                        return
                    }

                    var imagesInserted = 0

                    for (var i=0, len=items.length; i<len; i++) {
                        if (items[i].documentType !== 'image') {
                            $.oc.alert($.oc.lang.get('mediamanager.invalid_image_invalid_insert', 'The file "'+items[i].title+'" is not an image.'))
                            continue
                        }

                        editor.image.insert(items[i].publicUrl, false, {}, $currentImage)
                        imagesInserted++

                        if (imagesInserted == 1) {
                            $currentImage = null
                        }
                    }

                    if (imagesInserted !== 0) {
                        this.hide()
                        editor.undo.saveStep()
                    }
                }
            })
        }

        function onInsertVideo() {
            new $.oc.mediaManager.popup({
                alias: 'ocmediamanager',
                cropAndInsertButton: false,
                onInsert: function(items) {
                    if (!items.length) {
                        $.oc.alert($.oc.lang.get('mediamanager.invalid_video_empty_insert'))
                        return
                    }

                    if (items.length > 1) {
                        $.oc.alert($.oc.lang.get('mediamanager.invalid_file_single_insert'))
                        return
                    }

                    var item = items[0]

                    if (item.documentType !== 'video') {
                        $.oc.alert($.oc.lang.get('mediamanager.invalid_video_invalid_insert', 'The file "'+item.title+'" is not a video.'))
                        return
                    }

                    var $richEditorNode = editor.$el.closest('[data-control="richeditor"]')

                    $richEditorNode.richEditor('insertVideo', item.publicUrl, item.title)

                    this.hide()
                }
            })
        }

        function onInsertAudio() {
            new $.oc.mediaManager.popup({
                alias: 'ocmediamanager',
                cropAndInsertButton: false,
                onInsert: function(items) {
                    if (!items.length) {
                        $.oc.alert($.oc.lang.get('mediamanager.invalid_audio_empty_insert'))
                        return
                    }

                    if (items.length > 1) {
                        $.oc.alert($.oc.lang.get('mediamanager.invalid_file_single_insert'))
                        return
                    }

                    var item = items[0]

                    if (item.documentType !== 'audio') {
                        $.oc.alert($.oc.lang.get('mediamanager.invalid_audio_invalid_insert', 'The file "'+item.title+'" is not an audio file.'))
                        return
                    }

                    var $richEditorNode = editor.$el.closest('[data-control="richeditor"]')

                    $richEditorNode.richEditor('insertAudio', item.publicUrl, item.title)

                    this.hide()
                }
            })
        }

        function _insertVideoFallback(link) {
            var $richEditorNode = editor.$el.closest('[data-control="richeditor"]')

            var title = link.substring(link.lastIndexOf('/') + 1)

            $richEditorNode.richEditor('insertVideo', link, title)

            editor.popups.hide('video.insert')
        }

        function _insertAudioFallback(link) {
            var $richEditorNode = editor.$el.closest('[data-control="richeditor"]')

            var title = link.substring(link.lastIndexOf('/') + 1)

            $richEditorNode.richEditor('insertAudio', link, title)

            editor.popups.hide('audio.insert')
        }

        /**
         * Init.
         */
        function _init () {
            editor.events.on('destroy', _destroy, true)

            editor.events.on('video.linkError', _insertVideoFallback)

            editor.events.on('audio.linkError', _insertAudioFallback)
        }

        /**
         * Destroy.
         */
        function _destroy () {
        }

        // Expose public methods. If _init is not public then the plugin won't be initialized.
        // Public method can be accessed through the editor API:
        // $('.selector').froalaEditor('mediaManager.publicMethod');
        return {
            _init: _init,
            insertFile: onInsertFile,
            insertImage: onInsertImage,
            insertVideo: onInsertVideo,
            insertAudio: onInsertAudio
        }
    }

    if (!$.FE.PLUGINS.link || !$.FE.PLUGINS.file || !$.FE.PLUGINS.image || !$.FE.PLUGINS.video) {
        throw new Error('Media manager plugin requires link, file, image and video plugin.');
    }

    //
    // Image
    //

    $.FE.DEFAULTS.imageInsertButtons.push('mmImageManager');

    $.FE.RegisterCommand('mmImageManager', {
        title: 'Browse',
        undo: false,
        focus: false,
        callback: function () {
            this.mediaManager.insertImage();
        },
        plugin: 'mediaManager'
    })

    // Add the font size icon.
    $.FE.DefineIcon('mmImageManager', {
        NAME: 'folder'
    });

    //
    // File
    //

    $.FE.DEFAULTS.fileInsertButtons.push('mmFileManager');

    $.FE.RegisterCommand('mmFileManager', {
        title: 'Browse',
        undo: false,
        focus: false,
        callback: function () {
            this.mediaManager.insertFile();
        },
        plugin: 'mediaManager'
    })

    // Add the font size icon.
    $.FE.DefineIcon('mmFileManager', {
        NAME: 'folder'
    });

    //
    // Video
    //

    $.FE.DEFAULTS.videoInsertButtons.push('mmVideoManager');

    $.FE.RegisterCommand('mmVideoManager', {
        title: 'Browse',
        undo: false,
        focus: false,
        callback: function () {
            this.mediaManager.insertVideo();
        },
        plugin: 'mediaManager'
    })

    // Add the font size icon.
    $.FE.DefineIcon('mmVideoManager', {
        NAME: 'folder'
    });

    //
    // Audio
    //

    $.FE.DEFAULTS.audioInsertButtons.push('mmAudioManager');

    $.FE.RegisterCommand('mmAudioManager', {
        title: 'Browse',
        undo: false,
        focus: false,
        callback: function () {
            this.mediaManager.insertAudio();
        },
        plugin: 'mediaManager'
    })

    // Add the font size icon.
    $.FE.DefineIcon('mmAudioManager', {
        NAME: 'folder'
    });

})(jQuery);
