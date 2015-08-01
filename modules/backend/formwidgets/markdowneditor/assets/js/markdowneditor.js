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


        this.createCodeContainer()
        this.createToolbar()

        this.$toolbar.on('click', '.btn, .md-dropdown-button', this.proxy(this.onClickButton))

        $('[data-control="tooltip"]', this.$toolbar).tooltip()
        $('[data-toggle="dropdown"]', this.$toolbar).dropdown()
    }

    MarkdownEditor.prototype.dispose = function() {
        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$toolbar.off('click', '.btn, .md-dropdown-button', this.proxy(this.onClickButton))

        this.$el.removeData('oc.markdownEditor')

        this.$el = null
        this.$textarea = null
        this.$toolbar = null
        this.$write = null
        this.$preview = null
        this.$code = null
        this.editor = null
        this.$form = null

        this.options = null

        BaseProto.dispose.call(this)
    }

    MarkdownEditor.prototype.onClickButton = function(ev) {
        var $button = $(ev.target),
            action = $button.data('button-action'),
            template = $button.data('button-template')

        this[action](template)
    }

    MarkdownEditor.prototype.createToolbar = function() {
        var self = this,
            $button,
            $buttons = $('<div class="layout-cell toolbar-item" />'),
            $fixedButtons = $('<div class="layout-cell toolbar-item width-fix" />')

        $.each($.oc.markdownEditorButtons, function(code, button) {
            $button = $('<button />').attr({
                'type': "button",
                'class': 'btn',
                'title': $.oc.lang.get(button.label),
                'data-control': "tooltip",
                'data-placement': "bottom",
                'data-container': "body",
                'data-button-code': code,
                'data-button-action': button.action
            })

            if (button.template) {
                $button.attr('data-button-template', button.template)
            }

            if (button.cssClass) {
                $button.addClass(button.cssClass)
            }
            else {
                $button.addClass('tb-icon tb-' + button.icon)
            }

            if (button.fixed) {
                $fixedButtons.append($button)
            }
            else {
                $buttons.append($button)
            }

            if (button.dropdown) {
                $button.attr('data-toggle', 'dropdown')
                self.createToolbarDropdown(button, $button)
            }
        })

        $buttons.wrapInner('<div data-control="toolbar" />')
        this.$toolbar.append($buttons)
        this.$toolbar.append($fixedButtons)
    }

    MarkdownEditor.prototype.createToolbarDropdown = function(button, $el) {
        var $dropdown = $('<ul class="dropdown-menu" />'),
            $childButton

        $dropdown.attr('data-dropdown-title', $.oc.lang.get(button.label))
        $.each(button.dropdown, function(code, childButton) {
            $childButton = $('<a />').attr({
                'href': 'javascript:;',
                'class': 'md-dropdown-button',
                'tabindex': '-1',
                'data-button-code': code,
                'data-button-action': childButton.action
            })

            if (childButton.cssClass) {
                $childButton.addClass(childButton.cssClass)
            }

            $childButton.text($.oc.lang.get(childButton.label))

            $dropdown.append($childButton)
            $childButton.wrap('<li />')
        })

        $el.wrap('<div class="dropdown dropdown-fixed" />')
        $el.after($dropdown)
    }

    MarkdownEditor.prototype.createCodeContainer = function() {
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

    MarkdownEditor.prototype.onResize = function() {
        this.editor.resize()
    }

    MarkdownEditor.prototype.onBlur = function() {
        this.$el.removeClass('editor-focus')
    }

    MarkdownEditor.prototype.onFocus = function() {
        this.$el.addClass('editor-focus')
    }

    /*
     * Button actions
     */

    MarkdownEditor.prototype.insertLine = function(template) {
        var editor = this.editor,
            pos = this.editor.getCursorPosition()

        if (pos.column == 0) {
            editor.selection.clearSelection()
        }
        else {
            editor.navigateTo(editor.getSelectionRange().start.row, Number.MAX_VALUE)
        }

        editor.insert('\n'+template+'\n')
        editor.focus()
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
            action: 'insertLine',
            template: '---'
        },
        fullscreen: {
            label: 'markdowneditor.fullscreen',
            icon: 'fullscreen',
            action: 'fullscreen.toggle',
            fixed: true
        },
        preview: {
            label: 'markdowneditor.preview',
            cssClass: 'oc-button oc-icon-eye',
            action: 'preview.toggle',
            fixed: true
        }
    }

}(window.jQuery);
