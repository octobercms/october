/*
 * Code editor form field control
 *
 * Data attributes:
 * - data-control="codeeditor" - enables the code editor plugin
 * - data-vendor-path="/" - sets the path to find Ace editor files
 * - data-language="php" - set the coding language used
 * - data-theme="textmate" - the colour scheme and theme
 *
 * JavaScript API:
 * $('textarea').codeEditor({ vendorPath: '/', language: 'php '})
 *
 * Dependancies:
 * - Ace Editor (ace.js)
 */

+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    // CODEEDITOR CLASS DEFINITION
    // ============================

    var CodeEditor = function(element, options) {
        Base.call(this)

        this.options   = options
        this.$el       = $(element)
        this.$textarea = this.$el.find('>textarea:first')
        this.$toolbar  = this.$el.find('>.editor-toolbar:first')
        this.$code     = null
        this.editor    = null
        this.$form     = null

        // Toolbar links
        this.isFullscreen = false
        this.$fullscreenEnable = this.$toolbar.find('li.fullscreen-enable')
        this.$fullscreenDisable = this.$toolbar.find('li.fullscreen-disable')
        this.isSearchbox = false
        this.$searchboxEnable = this.$toolbar.find('li.searchbox-enable')
        this.$searchboxDisable = this.$toolbar.find('li.searchbox-disable')
        this.isReplacebox = false
        this.$replaceboxEnable = this.$toolbar.find('li.replacebox-enable')
        this.$replaceboxDisable = this.$toolbar.find('li.replacebox-disable')

        $.oc.foundation.controlUtils.markDisposable(element)

        this.init();

        this.$el.trigger('oc.codeEditorReady')
    }

    CodeEditor.prototype = Object.create(BaseProto)
    CodeEditor.prototype.constructor = CodeEditor

    CodeEditor.DEFAULTS = {
        fontSize: 12,
        wordWrap: 'off',
        codeFolding: 'manual',
        autocompletion: 'manual',
        tabSize: 4,
        theme: 'textmate',
        showInvisibles: true,
        highlightActiveLine: true,
        useSoftTabs: true,
        autoCloseTags: true,
        showGutter: true,
        enableEmmet: true,
        language: 'php',
        margin: 0,
        vendorPath: '/',
        showPrintMargin: false,
        highlightSelectedWord: false,
        hScrollBarAlwaysVisible: false,
        readOnly: false
    }

    CodeEditor.prototype.init = function (){

        var self = this;

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
            .appendTo(this.$el)

        /*
         * Initialize ACE editor
         */
        var editor = this.editor = ace.edit(this.$code.attr('id')),
            options = this.options,
            $form = this.$el.closest('form');

        // Fixes a weird notice about scrolling
        editor.$blockScrolling = Infinity

        this.$form = $form

        this.$textarea.hide();
        editor.getSession().setValue(this.$textarea.val())

        editor.on('change', this.proxy(this.onChange))
        $form.on('oc.beforeRequest', this.proxy(this.onBeforeRequest))
        $(window).on('resize', this.proxy(this.onResize))
        $(window).on('oc.updateUi', this.proxy(this.onResize))
        this.$el.one('dispose-control', this.proxy(this.dispose))

        /*
         * Set theme, anticipated languages should be preloaded
         */
        assetManager.load({
            js:[
                // options.vendorPath + '/mode-' + options.language + '.js',
                options.vendorPath + '/theme-' + options.theme + '.js'
            ]
        }, function(){
            editor.setTheme('ace/theme/' + options.theme)
            var inline = options.language === 'php'
            editor.getSession().setMode({ path: 'ace/mode/'+options.language, inline: inline })
        })

        /*
         * Config editor
         */
        editor.wrapper = this
        editor.setShowInvisibles(options.showInvisibles)
        editor.setBehavioursEnabled(options.autoCloseTags)
        editor.setHighlightActiveLine(options.highlightActiveLine)
        editor.renderer.setShowGutter(options.showGutter)
        editor.renderer.setShowPrintMargin(options.showPrintMargin)
        editor.setHighlightSelectedWord(options.highlightSelectedWord)
        editor.renderer.setHScrollBarAlwaysVisible(options.hScrollBarAlwaysVisible)
        editor.setDisplayIndentGuides(options.displayIndentGuides)
        editor.getSession().setUseSoftTabs(options.useSoftTabs)
        editor.getSession().setTabSize(options.tabSize)
        editor.setReadOnly(options.readOnly)
        editor.getSession().setFoldStyle(options.codeFolding)
        editor.setFontSize(options.fontSize)
        editor.on('blur', this.proxy(this.onBlur))
        editor.on('focus', this.proxy(this.onFocus))
        this.setWordWrap(options.wordWrap)

        // Set the vendor path for Ace's require path
        ace.require('ace/config').set('basePath', this.options.vendorPath)

        editor.setOptions({
            enableEmmet: options.enableEmmet,
            enableBasicAutocompletion: options.autocompletion === 'basic',
            enableSnippets: options.enableSnippets,
            enableLiveAutocompletion: options.autocompletion === 'live'
        })

        editor.renderer.setScrollMargin(options.margin, options.margin, 0, 0)
        editor.renderer.setPadding(options.margin)

        /*
         * Toolbar
         */

        this.$toolbar.find('>ul>li>a')
            .each(function(){
                var abbr = $(this).find('>abbr'),
                    label = abbr.text(),
                    help = abbr.attr('title'),
                    title = label + ' (<strong>' + help + '</strong>)';

                $(this).attr('title', title)
            })
            .tooltip({
                delay: 500,
                placement: 'top',
                html: true
            })
        ;

        this.$fullscreenDisable.hide()
        this.$fullscreenEnable.on('click.codeeditor', '>a', $.proxy(this.toggleFullscreen, this))
        this.$fullscreenDisable.on('click.codeeditor', '>a', $.proxy(this.toggleFullscreen, this))

        this.$searchboxDisable.hide()
        this.$searchboxEnable.on('click.codeeditor', '>a', $.proxy(this.toggleSearchbox, this))
        this.$searchboxDisable.on('click.codeeditor', '>a', $.proxy(this.toggleSearchbox, this))

        this.$replaceboxDisable.hide()
        this.$replaceboxEnable.on('click.codeeditor', '>a', $.proxy(this.toggleReplacebox, this))
        this.$replaceboxDisable.on('click.codeeditor', '>a', $.proxy(this.toggleReplacebox, this))

        /*
         * Hotkeys
         */
        this.$el.hotKey({
            hotkey: 'esc',
            callback: this.proxy(this.onEscape)
        })

        editor.commands.addCommand({
            name: 'toggleFullscreen',
            bindKey: { win: 'Ctrl+Shift+F', mac: 'Ctrl+Shift+F' },
            exec: $.proxy(this.toggleFullscreen, this),
            readOnly: true
        })
    }

    CodeEditor.prototype.dispose = function() {
        if (this.$el === null)
            return

        this.unregisterHandlers()
        this.disposeAttachedControls()

        this.$el = null
        this.$textarea = null
        this.$toolbar = null
        this.$code = null
        this.$fullscreenEnable = null
        this.$fullscreenDisable = null
        this.$searchboxEnable = null
        this.$searchboxDisable = null
        this.$replaceboxEnable = null
        this.$replaceboxDisable = null
        this.$form = null
        this.options = null

        BaseProto.dispose.call(this)
    }

    CodeEditor.prototype.disposeAttachedControls = function() {
        this.editor.destroy()

        var keys = Object.keys(this.editor.renderer)
        for (var i=0, len=keys.length; i<len; i++)
            this.editor.renderer[keys[i]] = null

        keys = Object.keys(this.editor)
        for (var i=0, len=keys.length; i<len; i++)
            this.editor[keys[i]] = null

        this.editor = null

        this.$toolbar.find('>ul>li>a').tooltip('destroy')
        this.$el.removeData('oc.codeEditor')
        this.$el.hotKey('dispose')
    }

    CodeEditor.prototype.unregisterHandlers = function() {
        this.editor.off('change', this.proxy(this.onChange))
        this.editor.off('blur', this.proxy(this.onBlur))
        this.editor.off('focus', this.proxy(this.onFocus))

        this.$fullscreenEnable.off('.codeeditor')
        this.$fullscreenDisable.off('.codeeditor')
        this.$form.off('oc.beforeRequest', this.proxy(this.onBeforeRequest))

        this.$el.off('dispose-control', this.proxy(this.dispose))

        $(window).off('resize', this.proxy(this.onResize))
        $(window).off('oc.updateUi', this.proxy(this.onResize))
    }

    CodeEditor.prototype.onBeforeRequest = function() {
        this.$textarea.val(this.editor.getSession().getValue())
    }

    CodeEditor.prototype.onChange = function() {
        this.$form.trigger('change')
        this.$textarea.trigger('oc.codeEditorChange')
    }

    CodeEditor.prototype.onResize = function() {
        this.editor.resize()
    }

    CodeEditor.prototype.onBlur = function() {
        this.$el.removeClass('editor-focus')
    }

    CodeEditor.prototype.onFocus = function() {
        this.$el.addClass('editor-focus')
    }

    CodeEditor.prototype.onEscape = function() {
        this.isFullscreen && this.toggleFullscreen()
    }

    CodeEditor.prototype.setWordWrap = function(mode) {
        var session = this.editor.getSession(),
            renderer = this.editor.renderer

        switch (mode + '') {
            default:
            case "off":
                session.setUseWrapMode(false)
                renderer.setPrintMarginColumn(80)
            break
            case "40":
                session.setUseWrapMode(true)
                session.setWrapLimitRange(40, 40)
                renderer.setPrintMarginColumn(40)
            break
            case "80":
                session.setUseWrapMode(true)
                session.setWrapLimitRange(80, 80)
                renderer.setPrintMarginColumn(80)
            break
            case "fluid":
                session.setUseWrapMode(true)
                session.setWrapLimitRange(null, null)
                renderer.setPrintMarginColumn(80)
            break
        }
    }

    CodeEditor.prototype.setTheme = function(theme) {
        var self = this
        assetManager.load({
            js:[
                this.options.vendorPath + '/theme-' + theme + '.js'
            ]
        }, function(){
            self.editor.setTheme('ace/theme/' + theme)
        })
    }

    CodeEditor.prototype.getContent = function() {
        return this.editor.getSession().getValue()
    }

    CodeEditor.prototype.setContent = function(html) {
        this.editor.getSession().setValue(html)
    }

    CodeEditor.prototype.getEditorObject = function() {
        return this.editor
    }

    CodeEditor.prototype.getToolbar = function() {
        return this.$toolbar
    }

    CodeEditor.prototype.toggleFullscreen = function() {
        this.$el.toggleClass('editor-fullscreen')
        this.$fullscreenEnable.toggle()
        this.$fullscreenDisable.toggle()

        this.isFullscreen = this.$el.hasClass('editor-fullscreen')

        if (this.isFullscreen) {
            $('body').css({ overflow: 'hidden' })
        }
        else {
            $('body').css({ overflow: 'inherit' })
        }

        this.editor.resize()
        this.editor.focus()
    }

    CodeEditor.prototype.toggleSearchbox = function() {
        this.$searchboxEnable.toggle()
        this.$searchboxDisable.toggle()

        this.editor.execCommand("find")

        this.editor.resize()
        this.editor.focus()
    }

    CodeEditor.prototype.toggleReplacebox = function() {
        this.$replaceboxEnable.toggle()
        this.$replaceboxDisable.toggle()

        this.editor.execCommand("replace")

        this.editor.resize()
        this.editor.focus()
    }

    // CODEEDITOR PLUGIN DEFINITION
    // ============================

    var old = $.fn.codeEditor

    $.fn.codeEditor = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.codeEditor')
            var options = $.extend({}, CodeEditor.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.codeEditor', (data = new CodeEditor(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.codeEditor.Constructor = CodeEditor

    if ($.oc === undefined)
        $.oc = {}

    $.oc.codeEditorExtensionModes = {
        'htm': 'html',
        'html': 'html',
        'md': 'markdown',
        'txt': 'plain_text',
        'js': 'javascript',
        'less': 'less',
        'scss': 'scss',
        'sass': 'sass',
        'css': 'css'
    }

    // CODEEDITOR NO CONFLICT
    // =================

    $.fn.codeEditor.noConflict = function () {
        $.fn.codeEditor = old
        return this
    }

    // CODEEDITOR DATA-API
    // ===============
    $(document).render(function () {
        $('[data-control="codeeditor"]').codeEditor()
    });

    // FIX EMMET HTML WHEN SYNTAX IS TWIG
    // ==================================

    +function (exports) {
        if (exports.ace && typeof exports.ace.require == 'function') {
            var emmetExt = exports.ace.require('ace/ext/emmet')

            if (emmetExt && emmetExt.AceEmmetEditor && emmetExt.AceEmmetEditor.prototype.getSyntax) {
                var coreGetSyntax = emmetExt.AceEmmetEditor.prototype.getSyntax

                emmetExt.AceEmmetEditor.prototype.getSyntax = function () {
                    var $syntax = $.proxy(coreGetSyntax, this)()
                    return $syntax == 'twig' ? 'html' : $syntax
                };
            }
        }
    }(window)

}(window.jQuery);
