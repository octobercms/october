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

    // RICHEDITOR CLASS DEFINITION
    // ============================

    var RichEditor = function(element, options) {
        this.options     = options
        this.$el         = $(element)
        this.$textarea   = this.$el.find('>textarea:first')
        this.$form       = this.$el.closest('form')
        this.$dataLocker = null

        this.init();
    }

    RichEditor.DEFAULTS = {
        stylesheet: null,
        fullpage: false
    }

    RichEditor.prototype.init = function (){

        var self = this;

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
            imageEditable: false,
            imageResizable: false,
            buttonSource: true,
            removeDataAttr: false,
            syncBeforeCallback: function(html) { return self.syncBefore(html) },
            focusCallback: function() { self.$el.addClass('editor-focus') },
            blurCallback: function() { self.$el.removeClass('editor-focus') },
            keydownCallback: function(e) { return self.keydown(e, this.$editor) },
            enterCallback: function(e) { return self.enter(e, this.$editor) },
            initCallback: function() { self.build(this) },
            changeCallback: function() {
                self.sanityCheckContent(this.$editor)
                this.$editor.trigger('mutate')
                self.$form.trigger('change')

                if (self.$dataLocker)
                    self.$dataLocker.val(self.syncBefore(this.$editor.html()))
            }
        }

        if (this.options.fullpage) {
            redactorOptions.fullpage = true
        }

        // redactorOptions.plugins = ['cleanup', 'fullscreen', 'figure', 'image', 'quote', 'table']
        // redactorOptions.buttons = ['formatting', 'bold', 'italic', 'unorderedlist', 'orderedlist', 'link', 'horizontalrule', 'html'],

        redactorOptions.plugins = ['cleanup', 'fullscreen', 'figure', 'quote', 'table', 'mediamanager']
        redactorOptions.buttons = ['formatting', 'bold', 'italic', 'unorderedlist', 'orderedlist', 'link', 'horizontalrule', 'html'],

        this.$textarea.redactor(redactorOptions)
    }

    RichEditor.prototype.build = function(redactor) {
        this.updateLayout()

        $(window).resize($.proxy(this.updateLayout, this))
        $(window).on('oc.updateUi', $.proxy(this.updateLayout, this))

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

    RichEditor.prototype.sanityCheckContent = function($editor) {
        // First and last elements should always be paragraphs or pre
        var safeElements = 'p, h1, h2, h3, h4, h5, pre, figure';

        if (!$editor.children(':last-child').is(safeElements)) {
            $editor.append('<p><br></p>')
        }

        if (!$editor.children(':first-child').is(safeElements)) {
            $editor.prepend('<p><br></p>')
        }

        this.$textarea.trigger('sanitize.oc.richeditor', [$editor])
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

    RichEditor.prototype.keydown = function(e, $editor) {
        this.$textarea.trigger('keydown.oc.richeditor', [e, $editor, this.$textarea])

        if (e.isDefaultPrevented())
            return false

        this.handleUiBlocksKeydown(e, $editor, this.$textarea)

        if (e.isDefaultPrevented())
            return false
    }

    RichEditor.prototype.enter = function(e, $editor) {
        this.$textarea.trigger('enter.oc.richeditor', [e, $editor, this.$textarea])

        if (e.isDefaultPrevented())
            return false

        this.handleUiBlocksKeydown(e, $editor, this.$textarea)

        if (e.isDefaultPrevented())
            return false
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
        var redactor = this.$textarea.redactor('core.getObject'),
            current = redactor.selection.getCurrent(),
            inserted = false

        if (current === false)
            redactor.focus.setStart()

        current = redactor.selection.getCurrent()

        if (current !== false) {
            // If the block is inserted into a paragraph, insert it after the paragraph.
            var $paragraph = $(current).closest('p')
            if ($paragraph.length > 0) {
                redactor.caret.setAfter($paragraph.get(0))

                // If the paragraph is empty, remove it.
                if ($.trim($paragraph.text()).length == 0)
                    $paragraph.remove()
            } else {
                // If block is inserted into another UI block, insert it after the existing block.
                var $closestBlock = $(current).closest('[data-ui-block]')
                if ($closestBlock.length > 0) {
                    $node.insertBefore($closestBlock.get(0))
                    inserted = true
                }
            }
        }

        if (!inserted)
            redactor.insert.node($node)
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

    RichEditor.prototype.handleUiBlocksKeydown = function(originalEv, $editor, $textarea) {
        if ($textarea === undefined)
            return

        var redactor = $textarea.redactor('core.getObject')

        if (originalEv.target && $(originalEv.target).attr('data-ui-block') !== undefined) {
            this.uiBlockKeyDown(originalEv, originalEv.target)

            originalEv.preventDefault()
            return
        }

        switch (originalEv.which) {
            case 38:
                // Up arrow
                var block = redactor.selection.getBlock()
                if (block)
                    this.handleUiBlockCaretIn($(block).prev(), redactor)
            break
            case 40:
                // Down arrow
                var block = redactor.selection.getBlock()
                if (block)
                    this.handleUiBlockCaretIn($(block).next(), redactor)
            break
        }
    }

    RichEditor.prototype.handleUiBlockCaretIn = function($block, redactor) {
        if ($block.attr('data-ui-block') !== undefined) {
            $block.focus()
            redactor.selection.remove()

            return true
        }

        return false
    }

    RichEditor.prototype.uiBlockKeyDown = function(ev, block) {
        if (ev.which == 40 || ev.which == 38 || ev.which == 13 || ev.which == 8) {
            var $textarea = $(block).closest('.redactor-box').find('textarea'),
                redactor = $textarea.redactor('core.getObject')

            switch (ev.which) {
                case 40:
                    // Down arrow
                    this.focusUiBlockOrText(redactor, $(block).next(), true)
                break
                case 38:
                    // Up arrow
                    this.focusUiBlockOrText(redactor, $(block).prev(), false)
                break
                case 13:
                    // Enter key
                    var $paragraph = $('<p><br/></p>')
                    $paragraph.insertAfter(block)
                    redactor.caret.setStart($paragraph.get(0))
                break
                case 8:
                    // Backspace key
                    var $nextFocus = $(block).next(),
                        gotoStart = true

                    if ($nextFocus.length == 0) {
                        $nextFocus = $(block).prev()
                        gotoStart = false
                    }

                    this.focusUiBlockOrText(redactor, $nextFocus, gotoStart)

                    $(block).remove()
                break
            }
        }
    }

    RichEditor.prototype.focusUiBlockOrText = function(redactor, $block, gotoStart) {
        if ($block.length > 0) {
            if (!this.handleUiBlockCaretIn($block, redactor)) {
                if (gotoStart)
                    redactor.caret.setStart($block.get(0))
                else
                    redactor.caret.setEnd($block.get(0))
            }
        }
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
