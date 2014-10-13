(function ($) {
    'use strict';

    window.RedactorPlugins = window.RedactorPlugins || {};

    var Quote = function (redactor) {
        this.redactor = redactor
        this.init()
    }

    Quote.prototype = {
        control: {
            left        : { classSuffix: 'arrow-left' },
            right       : { classSuffix: 'arrow-right' },
            small       : { classSuffix: 'small', text: 'S' },
            medium      : { classSuffix: 'medium', text: 'M' },
            large       : { classSuffix: 'large', text: 'L' },
            resizeFull  : { classSuffix: 'resize-full' },
            resizeSmall : { classSuffix: 'resize-small' }
        },

        controlGroup: ['left', 'up', 'down', 'right', '|', 'small', 'medium', 'large', 'resizeFull', 'resizeSmall', 'remove'],

        init: function () {
            this.redactor.$editor.on('focus', $.proxy(this.addCites, this))
            this.addCites()
            this.observe()
        },

        addCites: function () {
            /*
             * Find any quotes missing citations and add an empty one
             */
            this.redactor.$editor
                .find('figure[data-type=quote] blockquote:not(:has(cite))')
                .each(function () {
                    $(this).append('<cite>')
                })
        },

        observe: function () {
            this.redactor.$editor.on('mutate', $.proxy(this.orphanCheck, this))
        },

        orphanCheck: function () {
            this.redactor.$editor.find('blockquote').filter(function () {
                return $(this).closest('figure').length == 0
            }).each(function () {
                $(this).append($('<cite />'))
                $(this).wrap('<figure data-type="quote" />')
            })
        },

        onShow: function ($figure, $toolbar) {

            $toolbar.children().removeClass('on')

            if ($figure.hasClass('oc-figure-medium')) {
                $toolbar.find('.oc-figure-controls-medium').addClass('on')
            }
            else if ($figure.hasClass('oc-figure-large')) {
                $toolbar.find('.oc-figure-controls-large').addClass('on')
            }
            else {
                $toolbar.find('.oc-figure-controls-small').addClass('on')
            }

            if ($figure.hasClass('oc-figure-left')) {
                $toolbar.find('.oc-figure-controls-arrow-left').addClass('on')
                $toolbar.find('.oc-figure-controls-resize-small').hide()
                $toolbar.find('.oc-figure-controls-resize-full').show()
            }
            else if ($figure.hasClass('oc-figure-right')) {
                $toolbar.find('.oc-figure-controls-arrow-right').addClass('on')
                $toolbar.find('.oc-figure-controls-resize-small').hide()
                $toolbar.find('.oc-figure-controls-resize-full').show()
            }
            else {
                $toolbar.find('.oc-figure-controls-resize-small').show()
                $toolbar.find('.oc-figure-controls-resize-full').hide()
            }

        },

        command: function (command, $figure) {

            switch (command) {
                case 'left':
                    $figure.removeClass('oc-figure-right').addClass('oc-figure-left')
                    break

                case 'right':
                    $figure.removeClass('oc-figure-left').addClass('oc-figure-right')
                    break

                case 'resize_full':
                    $figure.removeClass('oc-figure-left oc-figure-right')
                    break

                case 'resize_small':
                    $figure.addClass('oc-figure-left')
                    break

                case 'small':
                    $figure.removeClass('oc-figure-medium oc-figure-large').addClass('oc-figure-small')
                    break

                case 'medium':
                    $figure.removeClass('oc-figure-small oc-figure-large').addClass('oc-figure-medium')
                    break

                case 'large':
                    $figure.removeClass('oc-figure-small oc-figure-medium').addClass('oc-figure-large')
                    break
            }

        },

        toggle: function () {

                this.redactor.block.format('blockquote')

                var $target = $(this.redactor.selection.getBlock() || this.redactor.selection.getCurrent())

                if ($target.is('blockquote')) {
                    $target.append($('<cite />'))
                    $target.wrap('<figure data-type="quote" />')
                }
                else {
                    $target.find('cite').remove()
                    $target.closest('figure').before($target).remove()
                }

                this.redactor.code.sync()

            }
    }

    window.RedactorPlugins.quote = function() {
        return {
            init: function () {
                this.quote = new Quote(this)

                var button = this.button.addBefore('link', 'quote', 'Quote')
                this.button.addCallback(button, $.proxy(this.quote.toggle, this.quote))
                button.addClass('redactor_btn_quote').removeClass('redactor-btn-image')
            }
        }
    }

}(jQuery));