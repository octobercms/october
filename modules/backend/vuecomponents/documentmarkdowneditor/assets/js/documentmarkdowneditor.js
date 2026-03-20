import utils from './utils.js';
import octoberCommands from './octobercommands.js';

export default {
    props: {
        toolbarContainer: Array,
        fullHeight: {
            type: Boolean,
            default: true
        },
        containerCssClass: {
            type: String,
            default: ''
        },
        useMediaManager: {
            type: Boolean,
            default: false
        },
        sideBySide: {
            type: Boolean,
            default: true
        },
        builtInMode: {
            type: Boolean,
            default: false
        },
        modelValue: String,
        externalToolbarAppState: String
    },
    data: function() {
        const imageDropdownItems = [];
        const fileDropdownItems = [];
        const internalEventBus = Vue.markRaw(mitt());

        if (this.useMediaManager) {
            imageDropdownItems.push({
                command: 'oc-upload-image',
                label: 'command_upload_from_computer'
            });

            fileDropdownItems.push({
                command: 'oc-upload-file',
                label: 'command_upload_from_computer'
            });

            imageDropdownItems.push({
                command: 'oc-browse-image',
                label: 'browse'
            });

            fileDropdownItems.push({
                command: 'oc-browse-file',
                label: 'browse'
            });
        }

        imageDropdownItems.push({
            command: 'oc-enter-image-url',
            label: 'by_url'
        });

        fileDropdownItems.push({
            command: 'oc-enter-file-url',
            label: 'by_url'
        });

        const result = {
            internalEventBus: internalEventBus,
            editor: null,
            editorId: null,
            $buttons: null,
            updateDebounceTimeoutId: null,
            lastCachedValue: this.modelValue,
            lastCachedPreview: null,
            config: null,
            defaultButtons: [
                {
                    name: 'bold',
                    action: EasyMDE.toggleBold,
                    className: 'fa fa-bold',
                    title: oc.lang.get('markdowneditor.bold')
                },
                {
                    name: 'italic',
                    action: EasyMDE.toggleItalic,
                    className: 'fa fa-italic',
                    title: oc.lang.get('markdowneditor.italic')
                },
                {
                    name: 'strikethrough',
                    action: EasyMDE.toggleStrikethrough,
                    className: 'fa fa-strikethrough',
                    title: oc.lang.get('markdowneditor.strikethrough')
                },
                {
                    name: 'heading-1',
                    action: EasyMDE.toggleHeading1,
                    className: 'fa fa-header header-1',
                    title: oc.lang.get('markdowneditor.header1')
                },
                {
                    name: 'heading-2',
                    action: EasyMDE.toggleHeading2,
                    className: 'fa fa-header header-2',
                    title: oc.lang.get('markdowneditor.header2')
                },
                {
                    name: 'heading-3',
                    action: EasyMDE.toggleHeading3,
                    className: 'fa fa-header header-3',
                    title: oc.lang.get('markdowneditor.header3')
                },
                '|',
                {
                    name: 'code',
                    action: EasyMDE.toggleCodeBlock,
                    className: 'fa fa-code',
                    title: oc.lang.get('markdowneditor.code')
                },
                {
                    name: 'quote',
                    action: EasyMDE.toggleBlockquote,
                    className: 'fa fa-code',
                    title: oc.lang.get('markdowneditor.quote')
                },
                {
                    name: 'unordered-list',
                    action: EasyMDE.toggleUnorderedList,
                    className: 'fa fa-list-ul',
                    title: oc.lang.get('markdowneditor.unorderedlist')
                },
                {
                    name: 'ordered-list',
                    action: EasyMDE.toggleOrderedList,
                    className: 'fa fa-list-ol',
                    title: oc.lang.get('markdowneditor.orderedlist')
                },
                {
                    name: 'clean-block',
                    action: EasyMDE.cleanBlock,
                    className: 'fa fa-eraser',
                    title: oc.lang.get('markdowneditor.cleanblock')
                },
                '|',
                {
                    name: 'snippet',
                    action: 'snippet',
                    className: 'fa fa-newspaper',
                    title: oc.lang.get('markdowneditor.snippet')
                },
                {
                    name: 'link',
                    action: EasyMDE.drawLink,
                    className: 'fa fa-link',
                    title: oc.lang.get('markdowneditor.link')
                },
                {
                    name: 'image',
                    action: EasyMDE.drawImage,
                    className: 'fa fa-picture',
                    title: oc.lang.get('markdowneditor.image')
                },
                {
                    name: 'attachment',
                    action: 'attachment',
                    className: 'fa fa-bold',
                    title: 'add_file_title'
                },
                {
                    name: 'table',
                    action: EasyMDE.drawTable,
                    className: 'fa fa-table',
                    title: oc.lang.get('markdowneditor.table')
                },
                {
                    name: 'horizontal-rule',
                    action: EasyMDE.drawHorizontalRule,
                    className: 'fa fa-minus',
                    title: oc.lang.get('markdowneditor.horizontalrule')
                },
                {
                    name: 'side-by-side',
                    action: EasyMDE.toggleSideBySide,
                    className: 'fa fa-columns no-disable no-mobile',
                    title: oc.lang.get('markdowneditor.sidebyside')
                }
            ],
            buttonConfig: {
                heading: {
                    ignore: true
                },
                preview: {
                    ignore: true
                },
                guide: {
                    ignore: true
                },
                undo: {
                    ignore: true
                },
                redo: {
                    ignore: true
                },
                fullscreen: {
                    ignore: true
                },
                snippet: {
                    ignorePressState: true,
                    cmd: 'oc-snippet'
                },
                link: {
                    ignorePressState: true,
                    cmd: oc.pageLookup ? 'oc-link' : 'link'
                },
                image: {
                    dropdown: imageDropdownItems,
                    ignorePressState: true
                },
                attachment: {
                    dropdown: fileDropdownItems
                }
            },
            iconMap: {
                strikethrough: 'text-strikethrough',
                'heading-1': 'text-h1',
                'heading-2': 'text-h2',
                'heading-3': 'text-h3',
                code: 'text-code-block',
                'unordered-list': 'text-format-ul',
                'ordered-list': 'text-format-ol',
                'clean-block': 'text-eraser',
                image: 'text-image',
                table: 'text-insert-table',
                'horizontal-rule': 'horizontal-line',
                'side-by-side': 'window-split',
                snippet: 'newspaper'
            }
        };

        return result;
    },
    computed: {
        cssClass: function computeCssClass() {
            var result = '';

            if (this.fullHeight) {
                result += ' full-height-strict';
            }

            result += ' ' + this.containerCssClass;

            return result;
        },

        configuration: function computeConfiguration() {
            if (this.config === null) {
                this.config = JSON.parse(this.$el.getAttribute('data-configuration'));
            }

            return this.config;
        },

        externalToolbarEventBusObj: function computeExternalToolbarEventBusObj() {
            if (!this.externalToolbarAppState) {
                return null;
            }

            const point = $.oc.vueUtils.getToolbarExtensionPoint(
                this.externalToolbarAppState,
                this.$el
            );

            return point ? point.bus : null;
        },

        hasExternalToolbar: function computeHasExternalToolbar() {
            return !!this.externalToolbarEventBusObj;
        }
    },
    methods: {
        extendToolbar: function extendToolbar() {
            // Guard against unmounted component during retry
            if (!this.$el) {
                return;
            }

            // Find buttons fresh each time - EasyMDE may not be ready on first call
            var $buttons = $(this.$el).find('.editor-toolbar button, .editor-toolbar i.separator');

            // If no buttons found, editor isn't ready yet - retry after a delay.
            // Uses setTimeout instead of Vue.nextTick because nextTick creates
            // microtasks that never yield to the browser, causing infinite loops.
            if (!$buttons.length) {
                setTimeout(() => {
                    this.extendToolbar();
                }, 50);
                return;
            }

            this.$buttons = $buttons;
            this.toolbarContainer.splice(0, this.toolbarContainer.length);
            const that = this;

            if (!this.builtInMode || this.hasExternalToolbar) {
                utils.addSeparator(that);
            }

            $buttons.each(function() {
                const $button = $(this);

                if ($button.hasClass('separator')) {
                    utils.addSeparator(that);
                    return;
                }

                const cmd = utils.getButtonCommand($button);
                if (that.buttonConfig[cmd] && that.buttonConfig[cmd].ignore) {
                    return;
                }

                const hasCustomDropdown = that.buttonConfig[cmd] && that.buttonConfig[cmd].dropdown;
                if (!hasCustomDropdown) {
                    utils.buttonFromButton(that, $button);
                }
                else {
                    utils.dropdownFromButton(that, $button);
                }
            });

            const lastIndex = this.toolbarContainer.length - 1;
            if (this.toolbarContainer[lastIndex].type === 'separator') {
                this.toolbarContainer.pop();
            }
        },

        extendExternalToolbar: function extendExternalToolbar() {
            // Guard against unmounted component during retry
            if (!this.$el) {
                return;
            }

            if ($(this.$el).is(":visible")) {
                this.extendToolbar();
            }
            else {
                // Element not visible yet, retry after a delay.
                // Uses setTimeout instead of Vue.nextTick because nextTick creates
                // microtasks that never yield to the browser, causing infinite loops.
                setTimeout(() => {
                    this.extendExternalToolbar();
                }, 50);
            }
        },

        updateUi: function updateUi() {
            if (this.updateDebounceTimeoutId !== null) {
                clearTimeout(this.updateDebounceTimeoutId);
            }

            this.updateDebounceTimeoutId = setTimeout(
                this.hasExternalToolbar ? this.extendExternalToolbar : this.extendToolbar,
                30
            );
        },

        trans: function trans(key) {
            if (this.configuration.lang[key] === undefined) {
                return key;
            }

            return this.configuration.lang[key];
        },

        enableSideBySide: function enableSideBySide() {
            this.onToolbarCommand({
                command: 'markdowneditor-toolbar-side-by-side'
            });
        },

        refresh: function refresh() {
            if (this.editor) {
                this.editor.codemirror.refresh();
            }
        },

        clearHistory: function clearHistory() {
            if (this.editor) {
                this.editor.codemirror.doc.clearHistory();
            }
        },

        mountEventBus: function mountEventBus() {
            if (!this.externalToolbarEventBusObj) {
                return;
            }

            this.externalToolbarEventBusObj.on('toolbarcmd', this.onToolbarExternalCommand);
            this.externalToolbarEventBusObj.on('extendapptoolbar', this.extendExternalToolbar);
        },

        unmountEventBus: function unmountEventBus() {
            if (!this.externalToolbarEventBusObj) {
                return;
            }

            this.externalToolbarEventBusObj.off('toolbarcmd', this.onToolbarExternalCommand);
            this.externalToolbarEventBusObj.off('extendapptoolbar', this.extendExternalToolbar);
        },

        onToolbarExternalCommand: function (command) {
            if ($(this.$el).is(":visible")) {
                this.onToolbarCommand(command);
            }
        },

        onToolbarCommand: function(commandData) {
            const command = utils.parseCommandString(commandData.command);
            if (command === null) {
                return;
            }

            if (command.isOctoberCommand) {
                this.onOctoberCommand(command);
            }

            let $button = $(this.$el).find('.editor-toolbar button[class*="' + command.editorCommand + '"]');
            if (!$button.length) {
                return;
            }

            $button.trigger('click');
            this.updateUi();
        },

        onEditorContextChanged: function onEditorContextChanged() {
            this.updateUi();
        },

        onOctoberCommand: function onOctoberCommand(command) {
            octoberCommands.invoke(command.editorCommand, this.editor, this);
        },

        onChange: function onChange() {
            this.onEditorContextChanged();

            this.lastCachedValue = this.editor.value();
            this.$emit('update:modelValue', this.lastCachedValue);
        },

        onFocus: function onFocus() {
            this.$emit('focus');
        },

        onBlur: function onBlur() {
            this.$emit('blur');
        }
    },
    mounted: function onMounted() {
        this.editorId = $.oc.domIdManager.generate('markdowneditor');
        this.editor = Vue.markRaw(new EasyMDE({
            element: this.$refs.textarea,
            toolbar: this.defaultButtons,
            previewImagesInEditor: false,
            sideBySideFullscreen: false,
            autoDownloadFontAwesome: false,
            syncSideBySidePreviewScroll: true,
            initialValue: this.modelValue,
            status: true,
            sanitizerFunction: function(htmlText) {
                return DOMPurify.sanitize(htmlText);
            },
            previewRender: function(plainText) {
                // Optimization: prevent rendering same thing twice
                if (this.lastCachedPreview == plainText) {
                    return null;
                }
                this.lastCachedPreview = plainText;

                // Process page lookup links
                if (oc.pageLookup) {
                    plainText = oc.pageLookup.processLinks(plainText);
                }

                // Process snippets
                if (oc.snippetLookup) {
                    plainText = oc.snippetLookup.processSnippets(plainText);

                    // Disable the preview update
                    if (oc.snippetLookup.pauseRendering) {
                        return null;
                    }
                }

                // Inherit default logic, includes logic processing
                // anchors so links open in a new window
                return this.parent.markdown(plainText);
            }
        }));

        this.editor.codemirror.on('cursorActivity', this.onEditorContextChanged);
        this.editor.codemirror.on('change', this.onChange);
        this.editor.codemirror.on('focus', this.onFocus);
        this.editor.codemirror.on('blur', this.onBlur);
        $(window).on('oc.updateUi', this.refresh);
        this.internalEventBus.on('toolbarcmd', this.onToolbarCommand);

        Vue.nextTick(() => {
            if (this.hasExternalToolbar) {
                this.extendExternalToolbar();
            }
            else {
                this.extendToolbar();
            }

            this.mountEventBus();

            if (this.sideBySide) {
                this.enableSideBySide();
            }
        });
    },
    beforeUnmount: function beforeUnmount() {
        if (this.editor) {
            this.editor.toTextArea();
            this.editor.codemirror.off('cursorActivity', this.onEditorContextChanged);
            this.editor.codemirror.off('change', this.onEditorContextChanged);
            this.editor.codemirror.off('focus', this.onFocus);
            this.editor.codemirror.off('blur', this.onBlur);
        }

        $(window).off('oc.updateUi', this.refresh);
        this.unmountEventBus();
        this.internalEventBus.off('toolbarcmd', this.onToolbarCommand);

        this.editor = null;
        this.$buttons = null;
    },
    watch: {
        modelValue: function onValueChanged(newValue) {
            if (this.editor) {
                if (newValue === null) {
                    newValue = '';
                }

                if (newValue == this.lastCachedValue) {
                    return;
                }
            }

            this.editor.value(newValue);
        }
    }
};
