function initFroala(component) {
    const options = JSON.parse(component.$el.getAttribute('data-configuration'));
    const $textarea = $(component.$refs.textarea);
    let froalaOptions = {
        ...component.editorOptions,
        editorClass: 'control-richeditor',
        language: options.editorLang,
        toolbarSticky: false
    };

    if (component.useLineBreaks) {
        froalaOptions.enter = $.FroalaEditor.ENTER_BR;
    }

    if (Array.isArray(component.toolbarButtons) && component.toolbarButtons.length > 0) {
        froalaOptions.toolbarButtons = component.toolbarButtons;
    }
    else {
        if (options.globalToolbarButtons) {
            froalaOptions.toolbarButtons = options.globalToolbarButtons;
        }
        else {
            froalaOptions.toolbarButtons = component.defaultButtons;
        }
    }

    froalaOptions.imageStyles = options.imageStyles
        ? options.imageStyles
        : {
              'oc-img-rounded': 'Rounded',
              'oc-img-bordered': 'Bordered'
          };

    froalaOptions.linkStyles = options.linkStyles
        ? options.linkStyles
        : {
              'oc-link-green': 'Green',
              'oc-link-strong': 'Thick'
          };

    froalaOptions.paragraphFormat = options.paragraphFormat
        ? options.paragraphFormat
        : {
          'N': 'Normal',
          'H1': 'Heading 1',
          'H2': 'Heading 2',
          'H3': 'Heading 3',
          'H4': 'Heading 4',
          'PRE': 'Code'
        }

    froalaOptions.paragraphStyles = options.paragraphStyles
        ? options.paragraphStyles
        : {
              'oc-text-gray': 'Gray',
              'oc-text-bordered': 'Bordered',
              'oc-text-spaced': 'Spaced',
              'oc-text-uppercase': 'Uppercase'
          };

    froalaOptions.inlineStyles = options.inlineStyles
        ? options.inlineStyles
        : {
            'oc-class-code': 'Code',
            'oc-class-highlighted': 'Highlighted',
            'oc-class-transparency': 'Transparent'
          };

    froalaOptions.tableStyles = options.tableStyles
        ? options.tableStyles
        : {
              'oc-dashed-borders': 'Dashed Borders',
              'oc-alternate-rows': 'Alternate Rows'
          };

    froalaOptions.tableCellStyles = options.tableCellStyles
        ? options.tableCellStyles
        : {
              'oc-cell-highlighted': 'Highlighted',
              'oc-cell-thick-border': 'Thick'
          };

    froalaOptions.toolbarButtonsMD = froalaOptions.toolbarButtons;
    froalaOptions.toolbarButtonsSM = froalaOptions.toolbarButtons;
    froalaOptions.toolbarButtonsXS = froalaOptions.toolbarButtons;

    if (options.allowEmptyTags) {
        froalaOptions.htmlAllowedEmptyTags = options.allowEmptyTags.split(/[\s,]+/);
    }

    if (options.allowTags) {
        froalaOptions.htmlAllowedTags = options.allowTags.split(/[\s,]+/);
    }

    if (options.allowAttrs) {
        froalaOptions.htmlAllowedAttrs = $.FroalaEditor.DEFAULTS.htmlAllowedAttrs.concat(options.allowAttrs.split(/[\s,]+/));
    }

    if (options.noWrapTags) {
        froalaOptions.htmlDoNotWrapTags = options.noWrapTags.split(/[\s,]+/);
    }

    if (options.removeTags) {
        froalaOptions.htmlRemoveTags = options.removeTags.split(/[\s,]+/);
    }

    froalaOptions.lineBreakerTags = options.lineBreakerTags
        ? options.lineBreakerTags.split(/[\s,]+/)
        : ['figure, table, hr, iframe, form, dl'];

    froalaOptions.shortcutsEnabled = ['show', 'bold', 'italic', 'underline', 'indent', 'outdent', 'undo', 'redo'];

    // File upload
    froalaOptions.imageUploadURL = froalaOptions.fileUploadURL = window.location;
    froalaOptions.imageUploadParam = froalaOptions.fileUploadParam = 'file_data';
    froalaOptions.imageUploadParams = froalaOptions.fileUploadParams = {
        X_OCTOBER_MEDIA_MANAGER_QUICK_UPLOAD: 1,
        _token: $('meta[name="csrf-token"]').attr('content')
    };

    var placeholder = component.placeholder;
    froalaOptions.placeholderText = placeholder ? placeholder : '';

    var fieldEl = component.$el.closest('.field-richeditor');
    if (fieldEl && !fieldEl.classList.contains('stretch')) {
        froalaOptions.height = $('.height-indicator', fieldEl).height();
    }
    else {
        froalaOptions.height = Infinity;
    }

    froalaOptions.iframeStyleFiles = [options.iframeStylesFile];

    if (component.fullPage) {
        froalaOptions.fullPage = true;
    }

    if (!options.useMediaManager) {
        delete $.FroalaEditor.PLUGINS.mediaManager;
    }

    if (!oc.pageLookup) {
        delete $.FroalaEditor.PLUGINS.pageLinks;
    }

    // $textarea.on('froalaEditor.initialized.richeditor', component.initialized);
    $textarea.on('froalaEditor.contentChanged.richeditor', component.onChange);
    $textarea.on('froalaEditor.focus.richeditor', component.onFocus);
    $textarea.on('froalaEditor.blur.richeditor', component.onBlur);
    $textarea.on('froalaEditor.image.uploaded.richeditor', component.onImageUploaded);
    $textarea.closest('form').on('oc.beforeRequest', component.onFormBeforeRequest);
    $(document).on('vue.beforeRequest', component.onVueFormBeforeRequest);
    // $textarea.on('froalaEditor.html.get.richeditor', this.proxy(this.onSyncContent));
    // $textarea.on('froalaEditor.html.set.richeditor', this.proxy(this.onSetContent));

    $textarea.froalaEditor(froalaOptions);

    component.editor = Vue.markRaw($textarea.data('froala.editor'));

    if (component.readOnly) {
        component.editor.edit.off();
    }

    // this.$el.on('keydown', '.fr-view figure', this.proxy(this.onFigureKeydown));
}

export default {
    props: {
        fullHeight: {
            type: Boolean,
            default: true
        },
        readOnly: Boolean,
        useLineBreaks: Boolean,
        editorOptions: Object,
        toolbarButtons: Array,
        fullPage: {
            type: Boolean,
            default: false
        },
        containerCssClass: {
            type: String,
            default: ''
        },
        modelValue: String,
        placeholder: String
    },
    data: function() {
        return {
            editorId: $.oc.domIdManager.generate('richeditor'),
            defaultButtons: oc.richEditorButtons,
            editor: null,
            lastCachedValue: this.modelValue
        };
    },
    computed: {
        cssClass: function computeCssClass() {
            var result = '';

            if (this.fullHeight) {
                result += ' full-height-strict';
            }

            result += ' ' + this.containerCssClass;

            return result;
        }
    },
    methods: {
        getEditor: function getEditor() {
            return this.editor;
        },

        onChange: function onChange() {
            this.lastCachedValue = this.editor.html.get();
            this.$emit('update:modelValue', this.lastCachedValue);
        },

        onFocus: function onFocus() {
            this.$emit('focus');
        },

        onBlur: function onBlur() {
            this.$emit('blur');
        },

        onFormBeforeRequest: function onFormBeforeRequest() {
            const $textarea = $(this.$refs.textarea).closest('div.field-richeditor.vue-mode').find('[data-richeditor-textarea]');
            $textarea.val(this.editor.html.get());
        },

        onVueFormBeforeRequest: function onVueFormBeforeRequest() {
            this.onChange();
        },

        onImageUploaded: function onImageUploaded(ev, editor, response) {
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
    },
    mounted: function onMounted() {
        Vue.nextTick(() => {
            initFroala(this);
            this.editor.html.set(this.modelValue);
        });
    },
    beforeUnmount: function beforeUnmount() {
        const $textarea = $(this.$refs.textarea);

        if (this.editor) {
            $textarea.off('.richeditor');
            $textarea.froalaEditor('destroy');
        }

        $textarea.closest('form').off('oc.beforeRequest', this.onFormBeforeRequest);
        $(document).off('vue.beforeRequest', this.onVueFormBeforeRequest);

        this.editor = null;
    },
    watch: {
        modelValue: function onValueChanged(newValue, oldValue) {
            if (!this.editor) {
                return;
            }

            if (this.lastCachedValue == newValue) {
                return;
            }

            if (newValue === null) {
                newValue = '';
            }

            this.editor.html.set(newValue);
        }
    }
};
