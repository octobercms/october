+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var MarkdownEditor = function (element, options) {
        this.$el = $(element)
        this.options = options || {}
        this.$textarea = $('textarea:first', this.$el)
        this.$toolbar  = $('.editor-toolbar:first', this.$el)
        this.$write    = $('.editor-write:first', this.$el)
        this.$preview  = $('.editor-preview:first', this.$el)
        this.$code     = null
        this.editor    = null
        this.$form     = null

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)
        this.init()
    }

    MarkdownEditor.prototype = Object.create(BaseProto)
    MarkdownEditor.prototype.constructor = MarkdownEditor

    MarkdownEditor.prototype.init = function() {
        this.$el.one('dispose-control', this.proxy(this.dispose))

        /*
         * Control must have an identifier
         */
        if (!this.$el.attr('id')) {
            this.$el.attr('id', 'element-' + Math.random().toString(36).substring(7))
        }

        /*
         * Create code container
         */
        this.$code = $('<div />')
            .addClass('editor-code')
            .attr('id', this.$el.attr('id') + '-code')
            .css({
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            })
            .appendTo(this.$write)

        /*
         * Initialize ACE editor
         */
        var editor = this.editor = ace.edit(this.$code.attr('id')),
            options = this.options,
            $form = this.$el.closest('form');

        editor.getSession().setMode({ path: 'ace/mode/markdown' })
        editor.setHighlightActiveLine(false)
        editor.renderer.setShowGutter(false)
        editor.renderer.setShowPrintMargin(false)
        editor.getSession().setUseWrapMode(true)
        editor.setFontSize(14)
        editor.on('blur', this.proxy(this.onBlur))
        editor.on('focus', this.proxy(this.onFocus))
    }

    MarkdownEditor.prototype.dispose = function() {
        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$el.removeData('oc.markdownEditor')

        this.$el = null

        // In some cases options could contain callbacks, 
        // so it's better to clean them up too.
        this.options = null

        BaseProto.dispose.call(this)
    }

    MarkdownEditor.prototype.onResize = function() {
        this.editor.resize()
    }

    MarkdownEditor.prototype.onBlur = function() {
        this.$el.removeClass('editor-focus')
    }

    MarkdownEditor.prototype.onFocus = function() {
        this.$el.addClass('editor-focus')
    }

    MarkdownEditor.DEFAULTS = {
        buttons: ['formatting', 'bold', 'italic', 'unorderedlist', 'orderedlist', 'link', 'horizontalrule'],
        viewMode: 'tab'
    }

    // PLUGIN DEFINITION
    // ============================

    var old = $.fn.markdownEditor

    $.fn.markdownEditor = function (option) {
        var args = arguments;

        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.markdownEditor')
            var options = $.extend({}, MarkdownEditor.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.markdownEditor', (data = new MarkdownEditor(this, options)))
            if (typeof option == 'string') data[option].apply(data, args)
        })
      }

    $.fn.markdownEditor.Constructor = MarkdownEditor

    $.fn.markdownEditor.noConflict = function () {
        $.fn.markdownEditor = old
        return this
    }

    $(document).render(function (){
        $('[data-control="markdowneditor"]').markdownEditor()
    })

    // BUTTON DEFINITIONS
    // =================

    if ($.oc === undefined)
        $.oc = {}

    $.oc.markdownEditorButtons = {

        formatting: {
            label: 'markdowneditor.formatting',
            icon: 'formatting',
            dropdown: {
                quote: {
                    label: 'markdowneditor.quote',
                    cssClass: 'oc-button oc-icon-quote-right',
                    action: 'list.toggle',
                    template: '> $1'
                },
                code: {
                    label: 'markdowneditor.code',
                    cssClass: 'oc-button oc-icon-code',
                    action: 'block.format',
                    template: '```$1```'
                },
                header1: {
                    label: 'markdowneditor.header1',
                    cssClass: 'oc-button oc-icon-header',
                    action: 'block.format',
                    template: '# $1'
                },
                header2: {
                    label: 'markdowneditor.header2',
                    cssClass: 'oc-button oc-icon-header',
                    action: 'block.format',
                    template: '## $1'
                },
                header3: {
                    label: 'markdowneditor.header3',
                    cssClass: 'oc-button oc-icon-header',
                    action: 'block.format',
                    template: '### $1'
                },
                header4: {
                    label: 'markdowneditor.header4',
                    cssClass: 'oc-button oc-icon-header',
                    action: 'block.format',
                    template: '#### $1'
                },
                header5: {
                    label: 'markdowneditor.header5',
                    cssClass: 'oc-button oc-icon-header',
                    action: 'block.format',
                    template: '##### $1'
                },
                header6: {
                    label: 'markdowneditor.header6',
                    cssClass: 'oc-button oc-icon-header',
                    action: 'block.format',
                    template: '###### $1'
                }
            }
        },
        bold: {
            label: 'markdowneditor.bold',
            icon: 'bold',
            action: 'inline.format',
            template: '**$1**'
        },
        italic: {
            label: 'markdowneditor.italic',
            icon: 'italic',
            action: 'inline.format',
            template: '*$1*'
        },
        unorderedlist: {
            label: 'markdowneditor.unorderedlist',
            icon: 'unorderedlist',
            action: 'list.toggle',
            template: '* $1'
        },
        orderedlist: {
            label: 'markdowneditor.orderedlist',
            icon: 'orderedlist',
            action: 'list.toggle',
            template: '1. $1'
        },
        link: {
            label: 'markdowneditor.link',
            icon: 'link',
            action: 'inline.format',
            template: '[$1](http://)'
        },
        horizontalrule: {
            label: 'markdowneditor.horizontalrule',
            icon: 'horizontalrule',
            action: 'line.insert',
            template: '---'
        },
        fullscreen: {
            label: 'markdowneditor.fullscreen',
            icon: 'fullscreen',
            action: 'fullscreen.toggle'
        },
        preview: {
            label: 'markdowneditor.preview',
            cssClass: 'oc-button oc-icon-eye',
            action: 'preview.toggle'
        }
    }

}(window.jQuery);
