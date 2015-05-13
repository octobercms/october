if (!RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.mediamanager = function()
{
    // This plugin uses Redactor's undocumented internals directly (this.link). 
    // If Redactor changes the internal link API, we will need 
    // to rewrite the code.

    function hideLinkTooltips() {
        $('.redactor-link-tooltip').remove()
    }

    return {
        init: function()
        {
            // Insert link button
            var buttonInsertLink = this.button.add('mmInsertMediaLink', 'Insert Media Link');

            this.button.setAwesome('mmInsertMediaLink', 'icon-link');
            buttonInsertLink.addClass('oc-redactor-button oc-autumn-button')
            this.button.addCallback(buttonInsertLink, this.mediamanager.onInsertLink);

            // Insert image button
            var buttonInsertImage = this.button.add('mmInsertImageLink', 'Insert Media Image');
            buttonInsertImage.addClass('re-image oc-autumn-button')
            buttonInsertImage.removeClass('redactor-btn-image')
            this.button.addCallback(buttonInsertImage, this.mediamanager.onInsertImage);

            // Insert video button
            var buttonInsertVideo = this.button.add('mmInsertVideoLink', 'Insert Media Video');
            buttonInsertVideo.addClass('re-video oc-autumn-button')
            buttonInsertVideo.removeClass('redactor-btn-image')
            this.button.addCallback(buttonInsertVideo, this.mediamanager.onInsertVideo);

            // Insert audio button
            var buttonInsertAudio = this.button.add('mmInsertAudioLink', 'Insert Media Audio');
            this.button.setAwesome('mmInsertAudioLink', 'icon-volume-up');
            buttonInsertAudio.addClass('oc-redactor-button oc-autumn-button')
            this.button.addCallback(buttonInsertAudio, this.mediamanager.onInsertAudio);
        },

        onInsertLink: function(buttonName)
        {
            var that = this
            hideLinkTooltips()

            this.selection.save()
            this.link.getData()

            new $.oc.mediaManager.popup({
                alias: 'ocmediamanager',
                cropAndInsertButton: false,
                onInsert: function(items) {
                    if (!items.length) {
                        alert('Please select file to insert a links to.')
                        return
                    }

                    if (items.length > 1) {
                        alert('Please select a single file.')
                        return
                    }

                    var text = that.link.text,
                        textIsEmpty = $.trim(text) === ''

                    for (var i=0, len=items.length; i<len; i++) {
                        var text = textIsEmpty ? items[i].title : text

                        that.link.set(text, items[i].publicUrl, '')
                    }

                    this.hide()
                }
            })
        },

        onInsertImage: function(buttonName)
        {
            hideLinkTooltips()

            if (!this.selection.getCurrent())
                this.focus.setStart()

            this.selection.save()

            var that = this

            new $.oc.mediaManager.popup({
                alias: 'ocmediamanager',
                cropAndInsertButton: true,
                onInsert: function(items) {
                    if (!items.length) {
                        alert('Please select image(s) to insert.')
                        return
                    }
                    that.selection.restore()

                    // The code is partially borrowed from redactor.js, image plugin

                    var isP = that.utils.isCurrentOrParent('P'),
                        html = '',
                        imagesInserted = 0

                    for (var i=0, len=items.length; i<len; i++) {
                        if (items[i].documentType !== 'image') {
                            alert('The file "'+items[i].title+'" is not an image.')
                            continue
                        }

                        var $img = $('<img>')
                                .attr('src', items[i].publicUrl)
                                .attr('data-redactor-inserted-image', 'true')

                        html += that.utils.getOuterHtml($img)
                        imagesInserted++
                    }

                    if (imagesInserted > 0) {
                        if (isP)
                            html = '<blockquote>' + html + '</blockquote>'

                        that.selection.restore()
                        that.buffer.set()
                        that.insert.html(html, false);

                        var $image = that.$editor.find('img[data-redactor-inserted-image=true]').removeAttr('data-redactor-inserted-image')

                        if (isP)
                            $image.parent().contents().unwrap().wrap('<p />')
                        else {
                            if (that.opts.linebreaks)
                                $image.before('<br>').after('<br>')
                        }
                    }

                    if (imagesInserted !== 0)
                        this.hide()
                }
            })
        },

        onInsertVideo: function(buttonName) {
            hideLinkTooltips()

            var that = this
            hideLinkTooltips()

            this.selection.save()
            this.link.getData()

            new $.oc.mediaManager.popup({
                alias: 'ocmediamanager',
                cropAndInsertButton: false,
                onInsert: function(items) {
                    if (!items.length) {
                        alert('Please select a video file to insert.')
                        return
                    }

                    if (items.length > 1) {
                        alert('Please select a single file.')
                        return
                    }

                    var item = items[0]

                    if (item.documentType !== 'video') {
                        alert('The file "'+item.title+'" is not a video.')
                        return
                    }

                    var $richEditorNode = that.core.getTextarea().closest('[data-control="richeditor"]'),
                        $videoNode = $('<figure contenteditable="false" tabindex="0" data-ui-block="true"/>')

                    $videoNode.get(0).contentEditable = false

                    $videoNode.attr('data-video', item.publicUrl)
                    $videoNode.attr('data-label', item.title)

                    that.selection.restore()

                    $richEditorNode.richEditor('insertUiBlock', $videoNode)

                    this.hide()
                }
            })
        },

        onInsertAudio: function(buttonName) {
            hideLinkTooltips()

            var that = this
            hideLinkTooltips()

            this.selection.save()
            this.link.getData()

            new $.oc.mediaManager.popup({
                alias: 'ocmediamanager',
                cropAndInsertButton: false,
                onInsert: function(items) {
                    if (!items.length) {
                        alert('Please select an audio file to insert.')
                        return
                    }

                    if (items.length > 1) {
                        alert('Please select a single file.')
                        return
                    }

                    var item = items[0]

                    if (item.documentType !== 'audio') {
                        alert('The file "'+item.title+'" is not an audio file.')
                        return
                    }

                    var $richEditorNode = that.core.getTextarea().closest('[data-control="richeditor"]'),
                        $videoNode = $('<figure contenteditable="false" tabindex="0" data-ui-block="true"/>')

                    $videoNode.get(0).contentEditable = false

                    $videoNode.attr('data-audio', item.publicUrl)
                    $videoNode.attr('data-label', item.title)

                    that.selection.restore()

                    $richEditorNode.richEditor('insertUiBlock', $videoNode)

                    this.hide()
                }
            })
        }
    };
};