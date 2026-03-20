import { ControlBase, registerControl } from 'larajax';
import MarkdownFormWidget from '../../../../vuecomponents/documentmarkdowneditor/assets/js/formwidget.js';

/*
 * Markdown Editor form field control
 *
 * Data attributes:
 * - data-control="markdowneditor" - enables the markdown editor plugin
 *
 * JavaScript API:
 * oc.fetchControl(element, 'markdowneditor')
 *
 * Dependencies:
 * - Ace Editor (ace.js)
 */
registerControl('markdowneditor', class extends ControlBase {
    init() {
        this.$el = $(this.element);
        this.$textarea = $('textarea:first', this.$el);
        this.$toolbar = $('.editor-toolbar:first', this.$el);
        this.$write = $('.editor-write:first', this.$el);
        this.$preview = $('.editor-preview:first', this.$el);
        this.$code = null;
        this.editor = null;
        this.$form = null;
        this.$buttons = null;
        this.$fixedButtons = null;
        this.$indicator = null;
        this.editorPadding = 15;
        this.updatesPaused = false;
        this.vueWidget = null;

        // Apply defaults to config
        this.config = Object.assign({
            vendorPath: '/',
            refreshHandler: null,
            buttons: ['formatting', 'bold', 'italic', 'unorderedlist', 'orderedlist', 'link', 'horizontalrule'],
            viewMode: 'tab',
            sideBySide: true,
            useMediaManager: false,
            legacyMode: false
        }, this.config);

        // Control must have an identifier
        if (!this.$el.attr('id')) {
            this.$el.attr('id', 'element-' + Math.random().toString(36).substring(7));
        }
    }

    connect() {
        this.$form = this.$el.closest('form');

        if (!this.config.legacyMode) {
            this.initVueConnector();
            return;
        }

        this.createCodeContainer();
        this.createToolbar();
        this.createIndicator();
        this.setViewMode(this.config.viewMode);

        this.$toolbar.on('click', '.btn, .md-dropdown-button', this.proxy(this.onClickToolbarButton));
        this.$form.on('oc.beforeRequest', this.proxy(this.onBeforeRequest));
        this.editor.on('change', this.proxy(this.onEditorChange));
        this.editor.getSession().on('changeScrollTop', this.proxy(this.onEditorScrollTop));

        $('[data-control="tooltip"]', this.$toolbar).tooltip();
        $('[data-toggle="dropdown"]', this.$toolbar).dropdown();
    }

    disconnect() {
        if (this.config.legacyMode) {
            this.$toolbar.off('click', '.btn, .md-dropdown-button', this.proxy(this.onClickToolbarButton));
            this.$form.off('oc.beforeRequest', this.proxy(this.onBeforeRequest));
            if (this.editor) {
                this.editor.off('change', this.proxy(this.onEditorChange));
            }
            $(window).off('resize', this.proxy(this.updateFullscreen));
        }

        if (this.vueWidget) {
            this.vueWidget.remove();
            this.vueWidget = null;
        }

        this.$el = null;
        this.$textarea = null;
        this.$toolbar = null;
        this.$write = null;
        this.$preview = null;
        this.$code = null;
        this.editor = null;
        this.$form = null;
        this.$buttons = null;
        this.$fixedButtons = null;
        this.$indicator = null;
        this.editorPadding = null;
        this.updatesPaused = null;

        this.isSplitMode = null;
        this.isPreview = null;
        this.isFullscreen = null;
        this.dataTrackInputTimer = null;
    }

    //
    // Events
    //

    onClickToolbarButton(ev) {
        var $target = $(ev.target),
            $button = $target.is('a') ? $target : $target.closest('.btn'),
            action = $button.data('button-action'),
            template = $button.data('button-template');

        $button.blur();

        this.pauseUpdates();

        if (template) {
            this[action](template);
        }
        else if (action) {
            this[action]();
        }

        this.resumeUpdates();
        this.handleChange();
    }

    onEditorScrollTop(scroll) {
        if (!this.isSplitMode) {
            return;
        }

        var canvasHeight = this.$preview.height(),
            editorHeight,
            previewHeight,
            scrollRatio;

        if (canvasHeight != this.$el.data('markdowneditor-canvas-height')) {
            editorHeight =
                (this.editor.getSession().getScreenLength() *
                this.editor.renderer.lineHeight) -
                canvasHeight;

            previewHeight = this.$preview.get(0).scrollHeight - canvasHeight;

            scrollRatio = previewHeight / editorHeight;

            this.$el.data('markdowneditor-canvas-height', canvasHeight);
            this.$el.data('markdowneditor-scroll-ratio', scrollRatio);
        }
        else {
            scrollRatio = this.$el.data('markdowneditor-scroll-ratio');
        }

        scroll += this.editorPadding;
        this.$preview.scrollTop(scroll * scrollRatio);
    }

    onEditorChange() {
        var html = this.editor.getSession().getValue();

        this.$form.trigger('change');

        this.$textarea.trigger('changeContent.oc.markdowneditor', [this, html]);

        this.handleChange();
    }

    onBeforeRequest() {
        this.$textarea.val(this.editor.getSession().getValue());
    }

    onResize() {
        this.editor.resize();
    }

    onBlur() {
        this.$el.removeClass('editor-focus');
    }

    onFocus() {
        this.$el.addClass('editor-focus');
    }

    //
    // Toolbar
    //

    createToolbar() {
        var self = this,
            $button,
            $buttons = $('<div class="toolbar-item toolbar-primary" />'),
            $fixedButtons = $('<div class="toolbar-item" data-calculate-width />');

        $.each($.oc.markdownEditorButtons, function(code, button) {
            $button = self.makeToolbarButton(code, button);

            if (button.fixed) {
                $fixedButtons.append($button);
            }
            else {
                $buttons.append($button);
            }

            if (button.dropdown) {
                $button.attr('data-toggle', 'dropdown');
                self.createToolbarDropdown(button, $button);
            }
        })

        $buttons.wrapInner('<div data-control="toolbar" />');
        this.$toolbar.append($buttons);
        this.$toolbar.append($fixedButtons);

        this.$fixedButtons = $fixedButtons;
        this.$buttons = $buttons;
    }

    createToolbarDropdown(button, $el) {
        var $dropdown = $('<ul class="dropdown-menu" />'),
            $childButton;

        $dropdown.attr('data-dropdown-title', $.oc.lang.get(button.label));
        $.each(button.dropdown, function(code, childButton) {
            $childButton = $('<a />').attr({
                'href': 'javascript:;',
                'class': 'md-dropdown-button',
                'tabindex': '-1',
                'data-button-code': code,
                'data-button-action': childButton.action
            });

            if (childButton.template) {
                $childButton.attr('data-button-template', childButton.template);
            }

            if (childButton.cssClass) {
                $childButton.addClass(childButton.cssClass);
            }

            $childButton.text($.oc.lang.get(childButton.label));

            $dropdown.append($childButton);
            $childButton.wrap('<li />');
        })

        $el.wrap('<div class="dropdown dropdown-fixed" />');
        $el.after($dropdown);
    }

    makeToolbarButton(code, button) {
        if (!this.config.useMediaManager && (code == 'medialink' || code == 'mediaimage')) {
            return;
        }

        var $button = $('<button />').attr({
            'type': "button",
            'class': 'btn',
            'data-button-code': code,
            'data-bs-display': "static",
        }).css({
            position: 'relative'
        });

        var $buttonTooltip = $('<span />').attr({
            'title': $.oc.lang.get(button.label),
            'data-control': "tooltip",
            'data-bs-placement': "bottom",
            'data-bs-container': "body"
        }).css({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        });

        $button.append($buttonTooltip);

        if (button.action) {
            $button.attr('data-button-action', button.action);
        }

        if (button.template) {
            $button.attr('data-button-template', button.template);
        }

        if (button.cssClass) {
            $button.addClass(button.cssClass);
        }
        else {
            $buttonTooltip.append('<i class="icon-' + button.icon + '"></i>');
        }

        return $button;
    }

    addToolbarButton(code, button) {
        var $button = this.makeToolbarButton(code, button);
        var appendCode = button.insertBefore || button.insertAfter;
        if (appendCode) {
            var appendButton = this.findToolbarButton(appendCode)
            if (!!appendButton.length && button.insertBefore) {
                appendButton.before($button);
            }
            else if (!!appendButton.length && button.insertAfter) {
                appendButton.after($button);
            }
        }
        else {
            if (button.fixed) {
                this.$fixedButtons.append($button);
            }
            else {
                $('[data-control="toolbar"]', this.$buttons).append($button);
            }
        }

        return $button;
    }

    findToolbarButton(code) {
        return $('[data-button-code='+code+']', this.$toolbar);
    }

    //
    // Write
    //

    createCodeContainer() {
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
            .appendTo(this.$write);

        /*
         * Initialize ACE editor
         */
        var editor = this.editor = ace.edit(this.$code.attr('id'));

        // Fixes a weird notice about scrolling
        editor.$blockScrolling = Infinity;

        editor.getSession().setValue(this.$textarea.val());

        /*
         * Set theme, anticipated languages should be preloaded
         */
        oc.AssetManager.load({
            js:[
                this.config.vendorPath + '/theme-github.js'
            ]
        }, function(){
            editor.setTheme('ace/theme/github')
        });

        editor.getSession().setMode({ path: 'ace/mode/markdown' });
        editor.setHighlightActiveLine(false);
        editor.renderer.setShowGutter(false);
        editor.renderer.setShowPrintMargin(false);
        editor.getSession().setUseWrapMode(true);
        editor.setFontSize(14);
        editor.on('blur', this.proxy(this.onBlur));
        editor.on('focus', this.proxy(this.onFocus));

        // Set the vendor path for Ace's require path
        ace.require('ace/config').set('basePath', this.config.vendorPath);

        editor.renderer.setPadding(this.editorPadding);
        editor.renderer.setScrollMargin(this.editorPadding, this.editorPadding, 0, 0);

        setTimeout(function() {
            editor.resize();
        }, 100);
    }

    handleChange() {
        if (this.updatesPaused) {
            return;
        }

        var self = this;
        if (!this.isSplitMode) {
            return;
        }

        if (this.loading) {
            if (this.dataTrackInputTimer === undefined) {
                this.dataTrackInputTimer = window.setInterval(function(){
                    self.handleChange();
                }, 100);
            }
            return;
        }

        window.clearTimeout(this.dataTrackInputTimer);
        this.dataTrackInputTimer = undefined;

        self.updatePreview();
    }

    getEditorObject() {
        return this.editor
    }

    getContent() {
        return this.editor.getSession().getValue()
    }

    setContent(html) {
        this.editor.getSession().setValue(html)
    }

    //
    // Preview
    //

    updatePreview() {
        var self = this

        this.loading = true
        this.showIndicator()

        this.$el.request(this.config.refreshHandler, {
            success: function(data) {
                this.success(data)
                self.$preview.html(data.preview)
                self.initPreview()
            }
        }).done(function() {
            self.hideIndicator()
            self.loading = false
        })
    }

    initPreview() {
        $('pre', this.$preview).addClass('prettyprint')
        prettyPrint()

        this.$el.trigger('initPreview.oc.markdowneditor')
    }

    pauseUpdates() {
        this.updatesPaused = true
    }

    resumeUpdates() {
        this.updatesPaused = false
    }

    //
    // Loader
    //

    createIndicator() {
        this.$indicator = $('<div class="editor-preview-loader"></div>')
        this.$el.prepend(this.$indicator)
        this.$indicator.css('display', 'none')
    }

    showIndicator() {
        this.$indicator.css('display', 'block')
    }

    hideIndicator() {
        this.$indicator.css('display', 'none')
    }

    //
    // View mode
    //

    setViewMode(value) {
        this.isSplitMode = value == 'split'

        $('[data-button-code="preview"]', this.$toolbar).toggle(!this.isSplitMode)

        this.$el
            .removeClass('mode-tab mode-split')
            .addClass('mode-' + value)

        if (this.isSplitMode) {
            this.updatePreview()
        }
    }

    //
    // Full screen
    //

    setFullscreen(value) {
        this.isFullscreen = value
        this.$el.toggleClass('is-fullscreen', value)

        if (value) {
            $('body, html').css('overflow', 'hidden')
            this.updateFullscreen()
            this.setViewMode('split')
            $(window).on('resize', this.proxy(this.updateFullscreen))
        }
        else {
            this.setViewMode(this.config.viewMode)

            this.$preview.css('height', '')
            this.$write.css('height', '')
            $('body, html').css('overflow', '')

            $(window).off('resize', this.proxy(this.updateFullscreen))
            this.editor.resize()
        }

        $(window).trigger('oc.updateUi')
    }

    updateFullscreen() {
        if (!this.isFullscreen) return

        var fullscreenCss = {
            height: $(document).height() - this.$toolbar.outerHeight()
        }

        this.$preview.css(fullscreenCss)
        this.$write.css(fullscreenCss)
        this.editor.resize()
    }

    //
    // Media Manager
    //

    launchMediaManager(onSuccess) {
        var self = this

        new oc.mediaManager.popup({
            alias: 'ocmediamanager',
            cropAndInsertButton: true,
            onInsert: function(items) {
                if (!items.length) {
                    alert('Please select image(s) to insert.')
                    return
                }

                if (items.length > 1) {
                    alert('Please select a single item.')
                    return
                }

                var path, publicUrl
                for (var i=0, len=items.length; i<len; i++) {
                    path = items[i].path
                    publicUrl = items[i].publicUrl
                }

                // Spaces in URLs break Markdown syntax
                publicUrl = publicUrl.replace(/\s/g, '%20')

                onSuccess(publicUrl)

                this.hide()
            }
        })
    }

    //
    // Button actions
    //

    toggleFullscreen() {
        this.setFullscreen(!this.isFullscreen)
        if (this.isPreview) {
            this.togglePreview()
        }

        this.editor.focus()
        $('[data-button-code="fullscreen"]', this.$toolbar).toggleClass('active')
    }

    togglePreview() {
        this.isPreview = !this.isPreview

        if (this.isPreview) {
            this.updatePreview()
        }
        else {
            this.editor.focus()
        }

        this.$el.toggleClass('is-preview', this.isPreview)
        $('.btn', this.$buttons).prop('disabled', this.isPreview)

        $('[data-button-code="preview"]', this.$toolbar).toggleClass('active')
    }

    insertLine(template) {
        var editor = this.editor,
            pos = this.editor.getCursorPosition()

        if (pos.column == 0) {
            editor.selection.clearSelection()
        }
        else {
            editor.navigateTo(editor.getSelectionRange().start.row, Number.MAX_VALUE)
        }

        editor.insert(template)
        editor.focus()
    }

    formatInline(template) {
        var editor = this.editor,
            pos = this.editor.getCursorPosition(),
            text = editor.session.getTextRange(editor.selection.getRange()).trim()

        if (!text.length) {
            editor.selection.selectWord()
            text = editor.session.getTextRange(editor.selection.getRange()).trim()
        }

        editor.insert(template.replace('$1', text))
        editor.moveCursorToPosition(pos)

        if (template.indexOf('$1') != -1) {
            editor.navigateRight(template.indexOf('$1'))
        }

        editor.focus()
    }

    formatBlock(template) {
        var editor = this.editor,
            pos = this.editor.getCursorPosition(),
            text = editor.session.getTextRange(editor.selection.getRange()).trim()

        if (!text.length) {
            editor.navigateTo(editor.getSelectionRange().start.row, 0)
            editor.selection.selectLineEnd()
            text = editor.session.getTextRange(editor.selection.getRange()).trim()
        }
        else {
            editor.insert('\n')
        }

        editor.insert(template.replace('$1', text))
        editor.moveCursorToPosition(pos)

        if (template.indexOf('$1') != -1) {
            editor.navigateRight(template.indexOf('$1'))
        }

        editor.focus()
    }

    formatBlockMulti(template) {
        var editor = this.editor,
            pos = this.editor.getCursorPosition(),
            text = editor.session.getTextRange(editor.selection.getRange()).trim()

        if (!text.length) {
            editor.navigateTo(editor.getSelectionRange().start.row, 0)
            editor.selection.selectLineEnd()
        }

        var range = editor.selection.getRange()
        for (var i = range.start.row + 1; i < range.end.row + 2; i++) {
            editor.gotoLine(i);
            editor.insert(template.replace('$1', ''));
        }

        editor.moveCursorToPosition(pos)
        editor.focus()
    }

    formatMediaManager(template) {
        var self = this,
            editor = this.editor,
            pos = this.editor.getCursorPosition(),
            text = editor.session.getTextRange(editor.selection.getRange()).trim()

        if (!text.length) {
            editor.selection.selectWord()
            text = editor.session.getTextRange(editor.selection.getRange()).trim()
        }

        this.launchMediaManager(function(path) {
            editor.insert(template.replace('$1', text).replace('$2', path));
            editor.moveCursorToPosition(pos)
            editor.focus()

            if (!text.length && template.indexOf('$1') != -1) {
                editor.navigateRight(template.indexOf('$1'))
            }
        })
    }

    //
    // Vue mode
    //

    initVueConnector() {
        this.vueWidget = new MarkdownFormWidget(this.$textarea.get(0), this.config, () => {
            this.$form.trigger('change');
        });
    }
});

// BUTTON DEFINITIONS
// =================

if ($.oc === undefined)
    $.oc = {}

$.oc.markdownEditorButtons = {

    formatting: {
        label: 'markdowneditor.formatting',
        icon: 'paragraph',
        dropdown: {
            quote: {
                label: 'markdowneditor.quote',
                cssClass: 'oc-button oc-icon-quote-right',
                action: 'formatBlockMulti',
                template: '> $1'
            },
            code: {
                label: 'markdowneditor.code',
                cssClass: 'oc-button oc-icon-code',
                action: 'formatBlock',
                template: '\n```\n$1\n```\n'
            },
            header1: {
                label: 'markdowneditor.header1',
                cssClass: 'oc-button oc-icon-header',
                action: 'formatBlock',
                template: '# $1'
            },
            header2: {
                label: 'markdowneditor.header2',
                cssClass: 'oc-button oc-icon-header',
                action: 'formatBlock',
                template: '## $1'
            },
            header3: {
                label: 'markdowneditor.header3',
                cssClass: 'oc-button oc-icon-header',
                action: 'formatBlock',
                template: '### $1'
            },
            header4: {
                label: 'markdowneditor.header4',
                cssClass: 'oc-button oc-icon-header',
                action: 'formatBlock',
                template: '#### $1'
            },
            header5: {
                label: 'markdowneditor.header5',
                cssClass: 'oc-button oc-icon-header',
                action: 'formatBlock',
                template: '##### $1'
            },
            header6: {
                label: 'markdowneditor.header6',
                cssClass: 'oc-button oc-icon-header',
                action: 'formatBlock',
                template: '###### $1'
            }
        }
    },
    bold: {
        label: 'markdowneditor.bold',
        icon: 'bold',
        action: 'formatInline',
        template: '**$1**'
    },
    italic: {
        label: 'markdowneditor.italic',
        icon: 'italic',
        action: 'formatInline',
        template: '*$1*'
    },
    unorderedlist: {
        label: 'markdowneditor.unorderedlist',
        icon: 'list-ul',
        action: 'formatBlockMulti',
        template: '* $1'
    },
    orderedlist: {
        label: 'markdowneditor.orderedlist',
        icon: 'list-ol',
        action: 'formatBlockMulti',
        template: '1. $1'
    },
    link: {
        label: 'markdowneditor.link',
        icon: 'link',
        action: 'formatInline',
        template: '[$1](http://)'
    },
    image: {
        label: 'markdowneditor.image',
        icon: 'image',
        action: 'formatInline',
        template: '![$1](http://)'
    },
    horizontalrule: {
        label: 'markdowneditor.horizontalrule',
        icon: 'minus',
        action: 'insertLine',
        template: '\n\n---\n'
    },
    medialink: {
        label: 'mediamanager.insert_link',
        cssClass: 'oc-autumn-button oc-icon-link',
        action: 'formatMediaManager',
        template: '[$1]($2)'
    },
    mediaimage: {
        label: 'mediamanager.insert_image',
        cssClass: 'oc-autumn-button oc-icon-image',
        action: 'formatMediaManager',
        template: '![$1]($2)'
    },
    fullscreen: {
        label: 'markdowneditor.fullscreen',
        icon: 'expand',
        action: 'toggleFullscreen',
        fixed: true
    },
    preview: {
        label: 'markdowneditor.preview',
        icon: 'eye',
        action: 'togglePreview',
        fixed: true
    }
}
