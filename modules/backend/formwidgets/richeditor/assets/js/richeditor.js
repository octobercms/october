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
            initCallback: function() { self.build() },
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

        redactorOptions.plugins = ['cleanup', 'fullscreen', 'figure', 'quote', 'table']
        redactorOptions.buttons = ['formatting', 'bold', 'italic', 'unorderedlist', 'orderedlist', 'image', 'link', 'horizontalrule', 'html'],

        this.$textarea.redactor(redactorOptions)
        
        // Allows to overrite redactor content
        this.$textarea.on('codeSet.oc.richeditor', function(e, code){
            if (typeof code === 'string') {
                this.$textarea.redactor('code.set', code);
            }
        }.bind(this));
    }

    RichEditor.prototype.build = function() {
        this.updateLayout()

        $(window).resize($.proxy(this.updateLayout, this))
        $(window).on('oc.updateUi', $.proxy(this.updateLayout, this))

        this.$textarea.trigger('init.oc.richeditor', [this.$el])
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
        return container.html
    }

    RichEditor.prototype.keydown = function(e, $editor) {
        this.$textarea.trigger('keydown.oc.richeditor', [e, $editor, this.$textarea])

        if (e.isDefaultPrevented())
            return false
    }

    RichEditor.prototype.enter = function(e, $editor) {
        this.$textarea.trigger('enter.oc.richeditor', [e, $editor, this.$textarea])

        if (e.isDefaultPrevented())
            return false
    }

    // RICHEDITOR PLUGIN DEFINITION
    // ============================

    var old = $.fn.richEditor

    $.fn.richEditor = function (option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.richEditor')
            var options = $.extend({}, RichEditor.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.richEditor', (data = new RichEditor(this, options)))
            if (typeof option == 'string') data[option].call($this)
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
