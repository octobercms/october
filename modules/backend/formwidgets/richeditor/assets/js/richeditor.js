/*
 * Rich text editor form field control (WYSIWYG)
 *
 * Data attributes:
 * - data-control="richeditor" - enables the rich editor plugin
 *
 * JavaScript API:
 * $('textarea').richEditor()
 *
 * Dependancies:
 * - Redactor Editor (redactor.js)
 */
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    // RICHEDITOR CLASS DEFINITION
    // ============================

    var RichEditor = function(element, options) {
        this.options     = options
        this.$el         = $(element)
        this.$textarea   = this.$el.find('>textarea:first')
        this.$form       = this.$el.closest('form')
        this.$dataLocker = null
        this.$editor     = null
        this.redactor    = null

        $.oc.foundation.controlUtils.markDisposable(element)

        Base.call(this)

        this.init()
    }

    RichEditor.prototype = Object.create(BaseProto)
    RichEditor.prototype.constructor = RichEditor

    RichEditor.DEFAULTS = {
        dataLocker: null,
        linksHandler: null,
        stylesheet: null,
        fullpage: false
    }

    RichEditor.prototype.init = function (){
        var self = this;

        this.$el.one('dispose-control', this.proxy(this.dispose))

        /*
         * Sync all changes to a data locker, since fullscreen mode
         * will pull the textarea outside of the form element.
         */
        if (this.options.dataLocker) {
            this.$dataLocker = $(this.options.dataLocker)
            this.$textarea.val(this.$dataLocker.val())
        }

        /*
         * Textarea must have an identifier
         */
        if (!this.$textarea.attr('id')) {
            this.$textarea.attr('id', 'element-' + Math.random().toString(36).substring(7))
        }

        /*
         * Initialize Redactor editor
         */
        var redactorOptions = {
            imageEditable: true,
            imageResizable: true,
            buttonSource: true,
            removeDataAttr: false,
            toolbarFixed: false,
            syncBeforeCallback: this.proxy(this.onSyncBefore),
            focusCallback: this.proxy(this.onFocus),
            blurCallback: this.proxy(this.onBlur),
            keydownCallback: this.proxy(this.onKeydown),
            enterCallback: this.proxy(this.onEnter),
            changeCallback: this.proxy(this.onChange),
            pageLinksHandler: this.options.linksHandler,
            initCallback: function() { self.build(this) }
        }

        if (this.options.fullpage) {
            redactorOptions.fullpage = true
        }

        redactorOptions.plugins = ['fullscreen', 'figure', 'table', 'pagelinks', 'mediamanager']
        redactorOptions.buttons = ['html', 'formatting', 'bold', 'italic', 'unorderedlist', 'orderedlist', 'link', 'horizontalrule'],

        this.$textarea.redactor(redactorOptions)

        this.redactor = this.$textarea.redactor('core.getObject')
        this.$editor = this.redactor.$editor
    }

    RichEditor.prototype.dispose = function() {
        this.unregisterHandlers()

        // Release clickedElement reference inside redactor.js
        $(document).trigger('mousedown')

        this.redactor.core.destroy()

        // The figure plugin keeps references to the editor,
        // DOM elements and event handlers. It was hacked and
        // extended with the destroy() method.
        if (this.redactor.figure) {
            this.redactor.figure.destroy()
            this.redactor.figure = null
        }

        this.$el.removeData('oc.richEditor')

        this.options = null
        this.$el = null
        this.$textarea = null
        this.$form = null
        this.$dataLocker = null
        this.$editor = null

        this.redactor.$textarea = null
        this.redactor.$element = null

        this.redactor = null

        BaseProto.dispose.call(this)
    }

    RichEditor.prototype.unregisterHandlers = function() {
        $(window).off('resize', this.proxy(this.updateLayout))
        $(window).off('oc.updateUi', this.proxy(this.updateLayout))
        this.$el.off('dispose-control', this.proxy(this.dispose))
    }

    RichEditor.prototype.build = function(redactor) {
        this.updateLayout()

        $(window).on('resize', this.proxy(this.updateLayout))
        $(window).on('oc.updateUi', this.proxy(this.updateLayout))

        this.$textarea.trigger('init.oc.richeditor', [this.$el])

        this.initUiBlocks()

        var self = this
        redactor.default = {
            onShow: function($figure, $toolbar) {
                self.onShowFigureToolbar($figure, $toolbar)
            }
        }
    }

    RichEditor.prototype.updateLayout = function() {
        var $editor = $('.redactor-editor', this.$el),
            $codeEditor = $('textarea', this.$el),
            $toolbar = $('.redactor-toolbar', this.$el)

        if (!$editor.length)
            return

        if (this.$el.hasClass('stretch')) {
            var height = $toolbar.outerHeight(true)
            $editor.css('top', height+1)
            $codeEditor.css('top', height)
        }
    }

    RichEditor.prototype.sanityCheckContent = function() {
        // First and last elements should always be paragraphs, lists or pre
        var safeElements = 'p, h1, h2, h3, h4, h5, pre, figure, ol, ul';

        if (!this.$editor.children(':last-child').is(safeElements)) {
            this.$editor.append('<p><br></p>')
        }

        if (!this.$editor.children(':first-child').is(safeElements)) {
            this.$editor.prepend('<p><br></p>')
        }

        this.$textarea.trigger('sanitize.oc.richeditor', [this.$editor])
    }

    RichEditor.prototype.syncBefore = function(html) {
        var container = {
            html: html
        }

        this.$textarea.trigger('syncBefore.oc.richeditor', [container])

        var $domTree = $('<div>'+container.html+'</div>')

        // This code removes Redactor-specific attributes and tags from the code.
        // It seems to be a known problem with Redactor, try googling for 
        // "data-redactor-tag" or "redactor-invisible-space" (with quotes)
        $('*', $domTree).removeAttr('data-redactor-tag')

        $domTree.find('span[data-redactor-class="redactor-invisible-space"]').each(function(){
            $(this).children().insertBefore(this)
            $(this).remove()
        })

        $domTree.find('span.redactor-invisible-space').each(function(){
            $(this).children().insertBefore(this)
            $(this).remove()
        })

        $domTree.find('[data-video], [data-audio]').each(function(){
            $(this).removeAttr('contenteditable data-ui-block tabindex')
        })

        $domTree.find('div.oc-figure-controls').remove()

        return $domTree.html()
    }

    RichEditor.prototype.onShowFigureToolbar = function($figure, $toolbar) {
        // Deal with the case when the toolbar top has negative 
        // value
        var toolbarTop = $figure.position().top - $toolbar.height() - 10

        $toolbar.toggleClass('bottom', toolbarTop < 0)
    }

    /*
     * Inserts non-editable block (used for snippets, audio and video)
     */
    RichEditor.prototype.insertUiBlock = function($node) {
        var current = this.redactor.selection.getCurrent(),
            inserted = false

        if (current === false)
            this.redactor.focus.setStart()

        current = this.redactor.selection.getCurrent()

        if (current !== false) {
            // If the block is inserted into a paragraph, insert it after the paragraph.
            var $paragraph = $(current).closest('p')
            if ($paragraph.length > 0) {
                this.redactor.caret.setAfter($paragraph.get(0))

                // If the paragraph is empty, remove it.
                if ($.trim($paragraph.text()).length == 0)
                    $paragraph.remove()
            }
            else {
                // If block is inserted into another UI block, insert it after the existing block.
                var $closestBlock = $(current).closest('[data-ui-block]')
                if ($closestBlock.length > 0) {
                    $node.insertBefore($closestBlock.get(0))
                    inserted = true
                }
            }
        }

        if (!inserted)
            this.redactor.insert.node($node)

        this.redactor.code.sync()

        $node.focus()
    }

    RichEditor.prototype.initUiBlocks = function() {
        $('.redactor-editor [data-video], .redactor-editor [data-audio]', this.$el).each(function() {
            $(this).attr({
                'data-ui-block': true,
                'tabindex': '0'
            })
            this.contentEditable = false
        })
    }

    RichEditor.prototype.handleUiBlocksKeydown = function(ev) {
        if (this.$textarea === undefined)
            return

        if (ev.target && $(ev.target).attr('data-ui-block') !== undefined) {
            this.uiBlockKeyDown(ev, ev.target)

            ev.preventDefault()
            return
        }

        switch (ev.which) {
            case 38:
                // Up arrow
                var block = this.redactor.selection.getBlock()
                if (block)
                    this.handleUiBlockCaretIn($(block).prev())
            break
            case 40:
                // Down arrow
                var block = this.redactor.selection.getBlock()
                if (block)
                    this.handleUiBlockCaretIn($(block).next())
            break
        }
    }

    RichEditor.prototype.handleUiBlockCaretIn = function($block) {
        if ($block.attr('data-ui-block') !== undefined) {
            $block.focus()
            this.redactor.selection.remove()

            return true
        }

        return false
    }

    RichEditor.prototype.uiBlockKeyDown = function(ev, block) {
        if (ev.which == 40 || ev.which == 38 || ev.which == 13 || ev.which == 8) {
            switch (ev.which) {
                case 40:
                    // Down arrow
                    this.focusUiBlockOrText($(block).next(), true)
                break
                case 38:
                    // Up arrow
                    this.focusUiBlockOrText($(block).prev(), false)
                break
                case 13:
                    // Enter key
                    var $paragraph = $('<p><br/></p>')
                    $paragraph.insertAfter(block)
                    this.redactor.caret.setStart($paragraph.get(0))
                break
                case 8:
                    // Backspace key
                    var $nextFocus = $(block).next(),
                        gotoStart = true

                    if ($nextFocus.length == 0) {
                        $nextFocus = $(block).prev()
                        gotoStart = false
                    }

                    this.focusUiBlockOrText($nextFocus, gotoStart)

                    $(block).remove()
                break
            }
        }
    }

    RichEditor.prototype.focusUiBlockOrText = function($block, gotoStart) {
        if ($block.length > 0) {
            if (!this.handleUiBlockCaretIn($block, this.redactor)) {
                if (gotoStart)
                    this.redactor.caret.setStart($block.get(0))
                else
                    this.redactor.caret.setEnd($block.get(0))
            }
        }
    }

    // EVENT HANDLERS
    // ============================

    RichEditor.prototype.onSyncBefore = function(html) {
        return this.syncBefore(html)
    }

    RichEditor.prototype.onFocus = function() {
        this.$el.addClass('editor-focus')
    }

    RichEditor.prototype.onBlur = function() {
        this.$el.removeClass('editor-focus')
    }

    RichEditor.prototype.onKeydown = function(ev) {
        this.$textarea.trigger('keydown.oc.richeditor', [ev, this.$editor, this.$textarea])

        if (ev.isDefaultPrevented())
            return false

        this.handleUiBlocksKeydown(ev)

        if (ev.isDefaultPrevented())
            return false
    }

    RichEditor.prototype.onEnter = function(ev) {
        this.$textarea.trigger('enter.oc.richeditor', [ev, this.$editor, this.$textarea])

        if (ev.isDefaultPrevented())
            return false

        this.handleUiBlocksKeydown(ev)

        if (ev.isDefaultPrevented())
            return false
    }

    RichEditor.prototype.onChange = function(ev) {
        this.sanityCheckContent()
        this.$editor.trigger('mutate')
        this.$form.trigger('change')

        if (this.$dataLocker)
            this.$dataLocker.val(this.syncBefore(this.$editor.html()))
    }

    // RICHEDITOR PLUGIN DEFINITION
    // ============================

    var old = $.fn.richEditor

    $.fn.richEditor = function (option) {
        var args = arguments;

        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.richEditor')
            var options = $.extend({}, RichEditor.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.richEditor', (data = new RichEditor(this, options)))

            if (typeof option == 'string') {
                var methodArgs = [];
                for (var i=1; i<args.length; i++)
                    methodArgs.push(args[i])

                data[option].apply(data, methodArgs)
            }
        })
    }

    $.fn.richEditor.Constructor = RichEditor

    // RICHEDITOR NO CONFLICT
    // =================

    $.fn.richEditor.noConflict = function () {
        $.fn.richEditor = old
        return this
    }

    // RICHEDITOR DATA-API
    // ===============
    $(document).render(function () {
        $('[data-control="richeditor"]').richEditor()
    })

}(window.jQuery);
