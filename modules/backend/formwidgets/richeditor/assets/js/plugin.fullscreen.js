(function ($) {
    'use strict';

    window.RedactorPlugins = window.RedactorPlugins || {};

    window.RedactorPlugins.fullscreen = function() {
        return {

            init: function() {
                this.fullscreen.isOpen = false

                var button = this.button.add('fullscreen', 'FullScreen')
                this.button.addCallback(button, $.proxy(this.fullscreen.toggle, this))
                button.addClass('redactor_btn_fullscreen').removeClass('redactor-btn-image')
                button.parent().addClass('redactor-btn-right')

                if (this.opts.fullscreen)
                    this.fullscreen.toggle()
            },

            toggle: function() {
                if (!this.fullscreen.isOpen)
                    this.fullscreen.enable()
                else
                    this.fullscreen.disable()
            },

            enable: function() {
                this.button.changeIcon('fullscreen', 'normalscreen')
                this.button.setActive('fullscreen')
                this.fullscreen.isOpen = true

                if (this.opts.toolbarExternal) {
                    this.fullscreen.toolcss = {}
                    this.fullscreen.boxcss = {}
                    this.fullscreen.toolcss.width = this.$toolbar.css('width')
                    this.fullscreen.toolcss.top = this.$toolbar.css('top')
                    this.fullscreen.toolcss.position = this.$toolbar.css('position')
                    this.fullscreen.boxcss.top = this.$box.css('top')
                }

                this.fullscreen.height = this.$editor.height()

                if (this.opts.maxHeight) this.$editor.css('max-height', '')
                if (this.opts.minHeight) this.$editor.css('min-height', '')

                if (!this.$fullscreenPlaceholder) this.$fullscreenPlaceholder = $('<div/>')
                this.$fullscreenPlaceholder.insertAfter(this.$box)

                this.$box.appendTo(document.body)

                this.$box.addClass('redactor-box-fullscreen')
                $('body, html').css('overflow', 'hidden')

                this.fullscreen.resize()
                $(window).on('resize.redactor.fullscreen', $.proxy(this.fullscreen.resize, this))
                $(document).scrollTop(0, 0)

                this.$editor.focus()
                this.observe.load()
            },

            disable: function() {
                this.button.removeIcon('fullscreen', 'normalscreen')
                this.button.setInactive('fullscreen')
                this.fullscreen.isOpen = false

                $(window).off('resize.redactor.fullscreen')
                $('body, html').css('overflow', '')

                this.$box.insertBefore(this.$fullscreenPlaceholder)
                this.$fullscreenPlaceholder.remove()

                this.$box.removeClass('redactor-box-fullscreen').css({ width: 'auto', height: 'auto' })

                this.code.sync()

                if (this.opts.toolbarExternal) {
                    this.$box.css('top', this.fullscreen.boxcss.top)
                    this.$toolbar.css({
                        'width': this.fullscreen.toolcss.width,
                        'top': this.fullscreen.toolcss.top,
                        'position': this.fullscreen.toolcss.position
                    })
                }

                if (this.opts.minHeight) this.$editor.css('minHeight', this.opts.minHeight)
                if (this.opts.maxHeight) this.$editor.css('maxHeight', this.opts.maxHeight)

                this.$editor.css('height', 'auto')
                this.$editor.focus()
                this.observe.load()
            },

            resize: function() {
                if (!this.fullscreen.isOpen)
                    return false

                var pad = this.$editor.css('padding-top').replace('px', '')

                var toolbarHeight = this.$toolbar.height(),
                    height = $(window).height() - toolbarHeight

                this.$box.width($(window).width() - 2).height(height + toolbarHeight)

                if (this.opts.toolbarExternal) {
                    this.$toolbar.css({
                        top: '0px',
                        position: 'absolute',
                        width: '100%'
                    })

                    this.$box.css('top', toolbarHeight + 'px')
                }

                // if (!this.opts.iframe) {
                //     this.$editor.height(height - (pad * 2))
                // }
                // else {
                //     setTimeout($.proxy(function() {
                //         this.$frame.height(height)
                //     }, this), 1)
                // }

                // this.$editor.height(height)
            }
        }
    }
}(jQuery));