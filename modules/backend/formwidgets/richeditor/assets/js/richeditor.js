import { ControlBase, registerControl } from 'larajax';
import RichEditorFormWidget from '../../../../vuecomponents/richeditordocumentconnector/assets/js/formwidget.js';

/*
 * Rich text editor form field control (WYSIWYG)
 *
 * Data attributes:
 * - data-control="richeditor" - enables the rich editor plugin
 *
 * JavaScript API:
 * oc.fetchControl(element, 'richeditor')
 *
 * Dependencies:
 * - Froala Editor (froala_editor.js)
 */
registerControl('richeditor', class extends ControlBase {
    init() {
        this.editor = null;
        this.vueWidget = null;

        // Apply defaults to config
        this.config = Object.assign({
            linksHandler: null,
            stylesheet: null,
            fullpage: false,
            editorLang: 'en',
            editorOptions: null,
            useMediaManager: false,
            toolbarButtons: null,
            allowEmptyTags: null,
            allowTags: null,
            allowAttrs: null,
            noWrapTags: null,
            removeTags: null,
            lineBreakerTags: null,
            imageStyles: null,
            linkStyles: null,
            paragraphStyles: null,
            inlineStyles: null,
            paragraphFormat: null,
            tableStyles: null,
            tableCellStyles: null,
            useLineBreaks: null,
            aceVendorPath: '/',
            readOnly: false
        }, this.config);

        if (!this.config.editorOptions || this.config.editorOptions.constructor !== {}.constructor) {
            this.config.editorOptions = {};
        }
    }

    connect() {
        this.$el = $(this.element);
        this.$textarea = this.$el.find('textarea[data-richeditor-textarea]:first');
        this.$form = this.$el.closest('form');

        // Textarea must have an identifier
        if (!this.$textarea.attr('id')) {
            this.$textarea.attr('id', 'element-' + Math.random().toString(36).substring(7));
        }

        if (!this.config.legacyMode) {
            this.initVueConnector();
            return;
        }

        // Initialize Froala editor
        this.initFroala();
    }

    disconnect() {
        this.unregisterHandlers();

        if (this.vueWidget) {
            this.vueWidget.remove();
            this.vueWidget = null;
        }
        else if (this.$textarea) {
            this.$textarea.froalaEditor('destroy');
        }

        this.$el = null;
        this.$textarea = null;
        this.$form = null;
        this.editor = null;
    }

    initFroala() {
        var froalaOptions = {
            ...this.config.editorOptions,
            editorClass: 'control-richeditor',
            language: this.config.editorLang,
            fullPage: this.config.fullpage,
            aceEditorVendorPath: this.config.aceVendorPath,
            toolbarSticky: false
        };

        if (this.config.useLineBreaks) {
            froalaOptions.enter = $.FroalaEditor.ENTER_BR;
        }

        if (this.config.toolbarButtons) {
            froalaOptions.toolbarButtons = this.config.toolbarButtons.split(',');
        }
        else {
            froalaOptions.toolbarButtons = oc.richEditorButtons;
        }

        froalaOptions.imageStyles = this.config.imageStyles
            ? this.config.imageStyles
            : {
                'oc-img-rounded': 'Rounded',
                'oc-img-bordered': 'Bordered'
              };

        froalaOptions.linkStyles = this.config.linkStyles
            ? this.config.linkStyles
            : {
                'oc-link-green': 'Green',
                'oc-link-strong': 'Thick'
              };

        froalaOptions.paragraphFormat = this.config.paragraphFormat
            ? this.config.paragraphFormat
            : {
                'N': 'Normal',
                'H1': 'Heading 1',
                'H2': 'Heading 2',
                'H3': 'Heading 3',
                'H4': 'Heading 4',
                'PRE': 'Code'
            }

        froalaOptions.paragraphStyles = this.config.paragraphStyles
            ? this.config.paragraphStyles
            : {
                'oc-text-gray': 'Gray',
                'oc-text-bordered': 'Bordered',
                'oc-text-spaced': 'Spaced',
                'oc-text-uppercase': 'Uppercase'
              };

        froalaOptions.inlineStyles = this.config.inlineStyles
            ? this.config.inlineStyles
            : {
                'oc-class-code': 'Code',
                'oc-class-highlighted': 'Highlighted',
                'oc-class-transparency': 'Transparent'
              };

        froalaOptions.tableStyles = this.config.tableStyles
            ? this.config.tableStyles
            : {
                'oc-dashed-borders': 'Dashed Borders',
                'oc-alternate-rows': 'Alternate Rows'
              };

        froalaOptions.tableCellStyles = this.config.tableCellStyles
            ? this.config.tableCellStyles
            : {
                'oc-cell-highlighted': 'Highlighted',
                'oc-cell-thick-border': 'Thick'
              };

        froalaOptions.toolbarButtonsMD = froalaOptions.toolbarButtons;
        froalaOptions.toolbarButtonsSM = froalaOptions.toolbarButtons;
        froalaOptions.toolbarButtonsXS = froalaOptions.toolbarButtons;

        if (this.config.allowEmptyTags) {
            froalaOptions.htmlAllowedEmptyTags = this.config.allowEmptyTags.split(/[\s,]+/);
        }

        if (this.config.allowTags) {
            froalaOptions.htmlAllowedTags = this.config.allowTags.split(/[\s,]+/);
        }

        if (this.config.allowAttrs) {
            froalaOptions.htmlAllowedAttrs = $.extend($.FroalaEditor.DEFAULTS.htmlAllowedAttrs, this.config.allowAttrs.split(/[\s,]+/));
        }

        if (this.config.noWrapTags) {
            froalaOptions.htmlDoNotWrapTags = this.config.noWrapTags.split(/[\s,]+/);
        }

        if (this.config.removeTags) {
            froalaOptions.htmlRemoveTags = this.config.removeTags.split(/[\s,]+/);
        }

        froalaOptions.lineBreakerTags = this.config.lineBreakerTags
            ? this.config.lineBreakerTags.split(/[\s,]+/)
            : ['figure, table, hr, iframe, form, dl'];

        froalaOptions.shortcutsEnabled = ['show', 'bold', 'italic', 'underline', 'indent', 'outdent', 'undo', 'redo'];

        // File upload
        froalaOptions.imageUploadURL = froalaOptions.fileUploadURL = window.location;
        froalaOptions.imageUploadParam = froalaOptions.fileUploadParam = 'file_data';
        froalaOptions.imageUploadParams = froalaOptions.fileUploadParams = {
            X_OCTOBER_MEDIA_MANAGER_QUICK_UPLOAD: 1,
            _token: $('meta[name="csrf-token"]').attr('content')
        };

        var placeholder = this.$textarea.attr('placeholder');
        froalaOptions.placeholderText = placeholder ? placeholder : '';

        froalaOptions.height = this.$el.hasClass('stretch') ? Infinity : $('.height-indicator', this.$el).height();

        if (!this.config.useMediaManager) {
            delete $.FroalaEditor.PLUGINS.mediaManager;
        }

        this.$textarea.on('froalaEditor.initialized', this.proxy(this.build));
        this.$textarea.on('froalaEditor.contentChanged', this.proxy(this.onChange));
        this.$textarea.on('froalaEditor.html.get', this.proxy(this.onSyncContent));
        this.$textarea.on('froalaEditor.html.set', this.proxy(this.onSetContent));
        this.$textarea.on('froalaEditor.image.uploaded', this.proxy(this.onImageUploaded));
        this.$form.on('oc.beforeRequest', this.proxy(this.onFormBeforeRequest));

        this.$textarea.froalaEditor(froalaOptions);

        this.editor = this.$textarea.data('froala.editor');

        if (this.config.readOnly) {
            this.editor.edit.off();
        }

        this.$el.on('keydown', '.fr-view figure', this.proxy(this.onFigureKeydown));
    }

    unregisterHandlers() {
        if (this.$el) {
            this.$el.off('keydown', '.fr-view figure', this.proxy(this.onFigureKeydown));
        }

        if (this.$textarea) {
            this.$textarea.off('froalaEditor.initialized', this.proxy(this.build));
            this.$textarea.off('froalaEditor.contentChanged', this.proxy(this.onChange));
            this.$textarea.off('froalaEditor.html.get', this.proxy(this.onSyncContent));
            this.$textarea.off('froalaEditor.html.set', this.proxy(this.onSetContent));
            this.$textarea.off('froalaEditor.image.uploaded', this.proxy(this.onImageUploaded));
        }

        if (this.$form) {
            this.$form.off('oc.beforeRequest', this.proxy(this.onFormBeforeRequest));
        }

        $(window).off('resize', this.proxy(this.updateLayout));
        $(window).off('oc.updateUi', this.proxy(this.updateLayout));
    }

    build(event, editor) {
        this.updateLayout();

        $(window).on('resize', this.proxy(this.updateLayout));
        $(window).on('oc.updateUi', this.proxy(this.updateLayout));

        // Bind the keydown listener here to ensure it gets handled before the Froala handlers
        editor.events.on('keydown', this.proxy(this.onKeydown), true);

        this.$textarea.trigger('init.oc.richeditor', [this]);
    }

    isCodeViewActive() {
        return this.editor && this.editor.codeView && this.editor.codeView.isActive();
    }

    getElement() {
        return this.$el;
    }

    getEditor() {
        if (!this.config.legacyMode) {
            return this.vueWidget.getEditor();
        }

        return this.editor;
    }

    getTextarea() {
        return this.$textarea;
    }

    getContent() {
        return this.getEditor().html.get();
    }

    setContent(html) {
        if (!this.config.legacyMode) {
            this.vueWidget.setContent(html);
            return;
        }

        this.getEditor().html.set(html);
    }

    syncContent() {
        this.editor.events.trigger('contentChanged');
    }

    updateLayout() {
        var $editor = $('.fr-wrapper', this.$el),
            $codeEditor = $('.fr-code', this.$el),
            $toolbar = $('.fr-toolbar', this.$el),
            $box = $('.fr-box', this.$el);

        if (!$editor.length) {
            return;
        }

        if (this.$el.hasClass('stretch') && !$box.hasClass('fr-fullscreen')) {
            var height = $toolbar.outerHeight(true);
            $editor.css('top', height + 1);
            $codeEditor.css('top', height);
        }
        else {
            $editor.css('top', '');
            $codeEditor.css('top', '');
        }
    }

    insertHtml(html) {
        this.getEditor().html.insert(html);
        this.getEditor().selection.restore();
    }

    insertElement($el) {
        this.insertHtml($('<div />').append($el.clone()).remove().html());
    }

    /*
     * Inserts non-editable block (used for snippets, audio and video)
     */
    insertUiBlock($node) {
        this.$textarea.froalaEditor('figures.insert', $node);
    }

    insertVideo(url, title) {
        this.$textarea.froalaEditor('figures.insertVideo', url, title);
    }

    insertAudio(url, title) {
        this.$textarea.froalaEditor('figures.insertAudio', url, title);
    }

    // EVENT HANDLERS
    // ============================

    onSetContent(ev, editor) {
        this.$textarea.trigger('setContent.oc.richeditor', [this]);
    }

    onSyncContent(ev, editor, html) {
        // Beautify HTML.
        if (editor.codeBeautifier) {
            html = editor.codeBeautifier.run(html, editor.opts.codeBeautifierOptions);
        }

        var container = {
            html: html
        };

        this.$textarea.trigger('syncContent.oc.richeditor', [this, container]);

        return container.html;
    }

    onFocus() {
        this.$el.addClass('editor-focus');
    }

    onBlur() {
        this.$el.removeClass('editor-focus');
    }

    onFigureKeydown(ev) {
        this.$textarea.trigger('figureKeydown.oc.richeditor', [ev, this]);
    }

    onKeydown(ev, editor, keyEv) {
        this.$textarea.trigger('keydown.oc.richeditor', [keyEv, this]);

        if (ev.isDefaultPrevented()) {
            return false;
        }
    }

    onChange(ev) {
        this.$form.trigger('change');
    }

    onImageUploaded(ev, editor, response) {
        try {
            var data = JSON.parse(response);
            if (data.error) {
                oc.flashMsg({ text: data.error, class: 'error' });
                editor.image.hideProgressBar(true);
                editor.image.remove();
                editor.edit.on();
                return false;
            }
        }
        catch (e) {}
    }

    /*
     * Instantly synchronizes HTML content.
     * The onSyncContent() method (above) is involved into this call,
     * so the resulting HTML is (optionally) beautified.
     */
    onFormBeforeRequest(ev) {
        if (!this.editor || !this.editor.html) {
            return;
        }

        if (this.isCodeViewActive()) {
            this.editor.html.set(this.editor.codeView.get());
        }

        this.$textarea.val(this.editor.html.get());
    }

    //
    // Vue mode
    //

    initVueConnector() {
        this.vueWidget = new RichEditorFormWidget(this.$textarea.get(0), this.config, () => {
            this.$form.trigger('change');
        });
    }
});

// BUTTON DEFINITIONS
// =================

oc.richEditorRegisterButton = $.FE.RegisterCommand;

oc.richEditorButtons = [
    'paragraphFormat',
    'align',
    'bold',
    'italic',
    'underline',
    '|',
    'formatOL',
    'formatUL',
    '|',
    'insertSnippet',
    'insertTable',
    'insertPageLink',
    'insertImage',
    'insertHR',
    'html'
];

// @deprecated backwards compatibility
if ($.oc === undefined) {
    $.oc = {};
}

$.oc.richEditorButtons = oc.richEditorButtons;
