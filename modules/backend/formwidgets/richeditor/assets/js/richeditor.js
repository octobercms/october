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
        this.options   = options
        this.$el       = $(element)
        this.$textarea = this.$el.find('>textarea:first')
        this.$form     = this.$el.closest('form')
        this.editor    = null

        this.init();
    }

    RichEditor.DEFAULTS = {
        stylesheet: null,
        fullpage: false
    }

    RichEditor.prototype.init = function (){

        var self = this;
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
            focusCallback: function() { self.$el.addClass('editor-focus') },
            blurCallback: function() { self.$el.removeClass('editor-focus') },
            initCallback: function() { self.build() },
            changeCallback: function() { self.onChange() }
        }

        if (this.options.stylesheet) {
            redactorOptions.iframe = true
            redactorOptions.css = this.options.stylesheet
        }

        if (this.options.fullpage) {
            redactorOptions.fullpage = true
        }

        this.$textarea.redactor(redactorOptions)
    }

    RichEditor.prototype.build = function() {
        var $editors = $('iframe, textarea', this.$el),
            $toolbar = $('.redactor_toolbar', this.$el),
            $html = $('html')

        if (!$editors.length)
            return

        if (this.$el.hasClass('stretch')) {
            $editors.css('padding-top', $toolbar.height())
        }

        /*
         * Replicate hotkeys to parent container
         */
        $editors.contents().find('html').on('keydown', function(event){
            $html.triggerHandler(event)
        })

        $editors.contents().find('html').on('keyup', function(event){
            $html.triggerHandler(event)
        })
    }

    RichEditor.prototype.onChange = function() {
        this.$form.trigger('change')

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
