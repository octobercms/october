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

            if ($figure.hasClass('wy-figure-medium')) {
                $toolbar.find('.wy-figure-controls-medium').addClass('on')
            }
            else if ($figure.hasClass('wy-figure-large')) {
                $toolbar.find('.wy-figure-controls-large').addClass('on')
            }
            else {
                $toolbar.find('.wy-figure-controls-small').addClass('on')
            }

            if ($figure.hasClass('wy-figure-left')) {
                $toolbar.find('.wy-figure-controls-arrow-left').addClass('on')
                $toolbar.find('.wy-figure-controls-resize-small').hide()
                $toolbar.find('.wy-figure-controls-resize-full').show()
            }
            else if ($figure.hasClass('wy-figure-right')) {
                $toolbar.find('.wy-figure-controls-arrow-right').addClass('on')
                $toolbar.find('.wy-figure-controls-resize-small').hide()
                $toolbar.find('.wy-figure-controls-resize-full').show()
            }
            else {
                $toolbar.find('.wy-figure-controls-resize-small').show()
                $toolbar.find('.wy-figure-controls-resize-full').hide()
            }

        },

        command: function (command, $figure) {

            switch (command) {
                case 'left':
                    $figure.removeClass('wy-figure-right').addClass('wy-figure-left')
                    break

                case 'right':
                    $figure.removeClass('wy-figure-left').addClass('wy-figure-right')
                    break

                case 'resize_full':
                    $figure.removeClass('wy-figure-left wy-figure-right')
                    break

                case 'resize_small':
                    $figure.addClass('wy-figure-left')
                    break

                case 'small':
                    $figure.removeClass('wy-figure-medium wy-figure-large').addClass('wy-figure-small')
                    break

                case 'medium':
                    $figure.removeClass('wy-figure-small wy-figure-large').addClass('wy-figure-medium')
                    break

                case 'large':
                    $figure.removeClass('wy-figure-small wy-figure-medium').addClass('wy-figure-large')
                    break
            }

        },

        toggle: function () {

                this.redactor.formatQuote()

                var $target = $(this.redactor.getBlock() || this.redactor.getCurrent())

                if ($target.is('blockquote')) {
                    $target.append($('<cite />'))
                    $target.wrap('<figure data-type="quote" />')
                }
                else {
                    $target.find('cite').remove()
                    $target.closest('figure').before($target).remove()
                }

                this.redactor.sync()

            }
    }

    window.RedactorPlugins.quote = {
        init: function () {
            this.quote = new Quote(this)

            this.buttonAddBefore('link', 'quote', 'Quote', $.proxy(this.quote.toggle, this.quote))
            this.buttonGet('quote').addClass('redactor_btn_quote').removeClass('redactor-btn-image')
        }
    }

}(jQuery));