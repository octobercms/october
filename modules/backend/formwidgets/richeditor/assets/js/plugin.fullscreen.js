(function ($) {
    'use strict';

    window.RedactorPlugins = window.RedactorPlugins || {};

    window.RedactorPlugins.fullscreen = {

        init: function() {

            this.fullscreen = false

            this.buttonAdd('fullscreen', 'Fullscreen', $.proxy(this.toggleFullscreen, this))
            this.buttonGet('fullscreen').addClass('redactor_btn_fullscreen').removeClass('redactor-btn-image')
            this.buttonGet('fullscreen').parent().addClass('redactor_btn_right')

            if (this.opts.fullscreen)
                this.toggleFullscreen()

        },

        toggleFullscreen: function() {
            if (!this.fullscreen)
                this.enableFullScreen()
            else
                this.disableFullScreen()
        },

        enableFullScreen: function() {
            var html

            this.buttonChangeIcon('fullscreen', 'normalscreen')
            this.buttonActive('fullscreen')
            this.fullscreen = true

            if (this.opts.toolbarExternal) {
                this.toolcss = {}
                this.boxcss = {}
                this.toolcss.width = this.$toolbar.css('width')
                this.toolcss.top = this.$toolbar.css('top')
                this.toolcss.position = this.$toolbar.css('position')
                this.boxcss.top = this.$box.css('top')
            }

            this.fsheight = this.$editor.height()

            if (this.opts.iframe)
                this.fsheight = this.$frame.height()

            if (this.opts.maxHeight)
                this.$editor.css('max-height', '')

            if (this.opts.iframe)
                html = this.get()

            if (!this.$fullscreenPlaceholder)
                this.$fullscreenPlaceholder = $('<div/>')

            this.$fullscreenPlaceholder.insertAfter(this.$box)

            this.$box.appendTo(document.body)

            this.$box.addClass('redactor_box_fullscreen')
            $('body, html').css('overflow', 'hidden')

            if (this.opts.iframe)
                this.fullscreenIframe(html)

            this.fullScreenResize()
            $(window).resize($.proxy(this.fullScreenResize, this))
            $(document).scrollTop(0, 0)

            this.focus()
            this.observeStart()
        },

        disableFullScreen: function() {
            var height

            this.buttonRemoveIcon('fullscreen', 'normalscreen')
            this.buttonInactive('fullscreen')
            this.fullscreen = false

            $(window).off('resize', $.proxy(this.fullScreenResize, this))
            $('body, html').css('overflow', '')

            this.$box.insertBefore(this.$fullscreenPlaceholder)
            this.$fullscreenPlaceholder.remove()

            this.$box.removeClass('redactor_box_fullscreen').css({ width: 'auto', height: 'auto' })

            if (this.opts.iframe)
                html = this.$editor.html()

            if (this.opts.iframe)
                this.fullscreenIframe(html)
            else
                this.sync()

            height = this.fsheight
            if (this.opts.autoresize)
                height = 'auto'

            if (this.opts.maxHeight)
                this.$editor.css('max-height', this.opts.maxHeight)

            if (this.opts.toolbarExternal) {
                this.$box.css('top', this.boxcss.top)
                this.$toolbar.css({
                    width: this.toolcss.width,
                    top: this.toolcss.top,
                    position: this.toolcss.position
                })
            }

            if (!this.opts.iframe)
                this.$editor.css('height', height)
            else
                this.$frame.css('height', height)

            this.$editor.css('height', height)
            this.focus()
            this.observeStart()
        },

        fullscreenIframe: function(html) {
            this.$editor = this.$frame.contents().find('body')
            this.$editor.attr({
                contenteditable: true,
                dir: this.opts.direction
            });

            // Set document & window
            if (this.$editor.get(0)) {
                this.document = this.$editor.get(0).ownerDocument
                this.window = this.document.defaultView || window
            }

            // Iframe css
            this.iframeAddCss()

            if (this.opts.fullpage)
                this.setFullpageOnInit(html)
            else
                this.set(html)

            if (this.opts.wym)
                this.$editor.addClass('redactor_editor_wym')
        },

        fullScreenResize: function() {
            if (!this.fullscreen)
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
    };

}(jQuery));