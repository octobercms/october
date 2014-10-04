(function ($) {
    'use strict';

    window.RedactorPlugins = window.RedactorPlugins || {}

    var Image = function (redactor) {
        this.redactor = redactor
        this.init()
    }

    Image.prototype = {
        control: {
            left        : { classSuffix: 'arrow-left' },
            right       : { classSuffix: 'arrow-right' },
            small       : { classSuffix: 'small', text: 'S' },
            medium      : { classSuffix: 'medium', text: 'M' },
            resize_full : { classSuffix: 'resize-full' },
            resize_small: { classSuffix: 'resize-small' }
        },

        controlGroup: ['left', 'up', 'down', 'right', '|', 'small', 'medium', 'resize_full', 'resize_small', 'remove'],

        init: function () {
            this.redactor.$editor.on('focus', $.proxy(this.addCaptions, this))
            this.addCaptions()
        },

        addCaptions: function () {
            /*
             * Find images without captions, adds an empty caption
             */
            this.redactor.$editor.find('figure[data-type=image]:not(:has(figcaption))').each(function () {
                $(this).append('<figcaption>')
            })
        },

        onShow: function ($figure, $toolbar) {

            $toolbar.children().removeClass('on')

            if ($figure.hasClass('oc-figure-small')) {
                $toolbar.find('.oc-figure-controls-small').show().addClass('on')
                $toolbar.find('.oc-figure-controls-medium').show()
                $toolbar.find('.oc-figure-controls-resize-full').show()
                $toolbar.find('.oc-figure-controls-resize-small').hide()
            }

            else if ($figure.hasClass('oc-figure-medium')) {
                $toolbar.find('.oc-figure-controls-small').show()
                $toolbar.find('.oc-figure-controls-medium').show().addClass('on')
                $toolbar.find('.oc-figure-controls-resize-full').show()
                $toolbar.find('.oc-figure-controls-resize-small').hide()
            }

            else {
                $toolbar.find('.oc-figure-controls-small').hide()
                $toolbar.find('.oc-figure-controls-medium').hide()
                $toolbar.find('.oc-figure-controls-large').hide()
                $toolbar.find('.oc-figure-controls-resize-full').hide()
                $toolbar.find('.oc-figure-controls-resize-small').show()
            }

            if ($figure.hasClass('oc-figure-right')) {
                $toolbar.find('.oc-figure-controls-arrow-right').addClass('on')
            }

            if ($figure.hasClass('oc-figure-left')) {
                $toolbar.find('.oc-figure-controls-arrow-left').addClass('on')
            }

        },

        command: function (command, $figure) {

            var classString = function (suffixArray, separator, prefix, dot) {
                var baseClass = (dot ? '.' : '') + 'oc-figure-' + (prefix || '')
                return baseClass + suffixArray.join((separator || ' ') + baseClass)
            }

            var changeSuffix = function (removeArray, addArray) {
                $figure.removeClass(classString(removeArray)).addClass(classString(addArray))
                $.each(addArray, function (index, command) {
                    $figure.trigger('imageCommand', command)
                })
            }

            switch (command) {
                case 'left':
                case 'right':
                    changeSuffix(['left', 'right'], [command])
                    if (!$figure.hasClass('oc-figure-medium') && !$figure.hasClass('oc-figure-small')) {
                        $figure.addClass('oc-figure-medium')
                        $figure.trigger('medium')
                    }
                    break

                case 'small':
                case 'medium':
                    changeSuffix(['small', 'medium', 'large'], [command])
                    if (!$figure.hasClass('oc-figure-left') && !$figure.hasClass('oc-figure-right')) {
                        $figure.addClass('oc-figure-left')
                        $figure.trigger('left')
                    }
                    break

                case 'resize_full':
                    changeSuffix(['small', 'medium', 'left', 'right'], ['large'])
                    break

                case 'resize_small':
                    changeSuffix(['small', 'large', 'right'], ['medium', 'left'])
                    break
            }
        }
    }

    window.RedactorPlugins.image = function() {
        return {
            init: function () {
                this.image = new Image(this)

                // This is a work in progress

                var button = this.button.addBefore('video', 'image', 'Image')
                this.button.addCallback(button, $.proxy(function () {

                    /*
                     * Maintain undo history
                     */
                    this.buffer.set()

                    /*
                     * Remember the cursor pos
                     */
                    var cursor = this.selection.getBlock() || this.selection.getCurrent()

                    /*
                     * Display the image upload modal
                     */

                    /*
                     * Add button
                     */
                    var url = 'http://placehold.it/100x100'

                    var data = '<figure data-type="image"><a href="' + url + '"><img src="' + url + '"></a><figcaption></figcaption></figure>'

                    this.selection.restore()

                    if (cursor) {
                        $(cursor).after(data)
                    }
                    else {
                        this.insert.html(data)
                    }

                    this.selection.restore()
                    this.code.sync()

                }, this))

                /*
                 * Detect resize command, update the image src
                 */
                this.$editor.on('imageCommand', 'figure', function (event, command) {
                    var size = null

                    if (command == 'small')
                        size = 300
                    else if (command == 'medium')
                        size = 600
                    else if (command == 'large')
                        size = 900
                    else
                        return

                    // @todo
                    var newUrl, $img = $(this).find('img')
                    $img.attr('src', newUrl)
                })

                button.addClass('redactor_btn_image').removeClass('redactor-btn-image')
            }
        }
    }

}(jQuery));