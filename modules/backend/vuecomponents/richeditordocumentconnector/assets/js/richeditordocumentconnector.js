import utils from './utils.js';
import octoberCommands from './octobercommands.js';
import EditorModelDefinition from '../../../monacoeditor/assets/js/modeldefinition.js';

export default {
    props: {
        toolbarContainer: Array,
        allowResizing: {
            type: Boolean,
            default: true
        },
        uniqueKey: {
            type: String,
            required: true
        },
        containerCssClass: {
            type: String,
            default: ''
        },
        useMediaManager: {
            type: Boolean,
            default: false
        },
        builtInMode: {
            type: Boolean,
            default: false
        },
        externalToolbarAppState: String
    },
    data: function() {
        const imageDropdownItems = [];
        const fileDropdownItems = [];
        const videoDropdownOptions = [];
        const audioDropdownOptions = [];
        const internalEventBus = Vue.markRaw(mitt());

        videoDropdownOptions.push({
            command: 'oc-embed-video',
            label: 'embedding_code'
        });

        audioDropdownOptions.push({
            command: 'oc-embed-audio',
            label: 'embedding_code'
        });

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

            videoDropdownOptions.push({
                command: 'oc-browse-video',
                label: 'browse'
            });

            audioDropdownOptions.push({
                command: 'oc-browse-audio',
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

        videoDropdownOptions.push({
            command: 'oc-enter-video-url',
            label: 'by_url'
        });

        audioDropdownOptions.push({
            command: 'oc-enter-audio-url',
            label: 'by_url'
        });

        return {
            internalEventBus: internalEventBus,
            size: 800,
            minSize: 200,
            containerSize: 0,

            config: null,

            editorTextarea: null,
            editorButtons: null,
            updateDebounceTimeoutId: null,

            codeEditingMode: false,
            loadingCodeEditingMode: false,
            htmlCode: '',
            codeEditorModelDefinitions: [],

            buttonConfig: {
                fullscreen: {
                    ignore: true
                },
                quote: {
                    dropdownOnly: true
                },
                paragraphStyle: {
                    dropdownOnly: true,
                    checkboxDropdown: true,
                    noPressedState: true
                },
                paragraphFormat: {
                    dropdownOnly: true,
                    checkedToLabel: true,
                    checkboxDropdown: true,
                    noPressedState: true,
                    separatorAfter: true,
                    separatorBefore: true
                },
                fontFamily: {
                    dropdownOnly: true,
                    checkedToLabel: true,
                    checkboxDropdown: true,
                    noPressedState: true,
                    separatorAfter: true,
                    separatorBefore: true,
                    applyItemStyle: true
                },
                fontSize: {
                    dropdownOnly: true,
                    checkedToLabel: true,
                    checkboxDropdown: true,
                    noPressedState: true,
                    separatorAfter: true
                },
                inlineStyle: {
                    dropdownOnly: true
                },
                align: {
                    convertToButtonGroup: true
                },
                html: {
                    cmd: 'oc-toggle-code-editor'
                },
                insertSnippet: {},
                insertLink: {},
                insertPageLink: {},
                insertImage: {
                    dropdown: imageDropdownItems,
                    dropdownOnly: true
                },
                insertVideo: {
                    dropdown: videoDropdownOptions,
                    dropdownOnly: true
                },
                insertAudio: {
                    dropdown: audioDropdownOptions,
                    dropdownOnly: true
                },
                insertFile: {
                    dropdown: fileDropdownItems,
                    dropdownOnly: true
                }
            },
            nonModifyingCommands: ['insertSnippet', 'insertLink', 'insertPageLink'],
            iconMap: {
                'undo': 'text-undo',
                'redo': 'text-redo',
                'bold': 'text-bold',
                'italic': 'text-italic',
                'underline': 'text-underline',
                'align-left': 'text-left',
                'align-right': 'text-right',
                'align-center': 'text-center',
                'align-justify': 'text-justify',
                'icon-list-ol': 'text-format-ol',
                'icon-list-ul': 'text-format-ul',
                'icon-magic': 'magic-wand',
                'icon-quote-left': 'quote',
                'icon-paint-brush': 'text-inline-style',
                color: 'text-colors',
                emoticons: 'text-emoticons',
                subscript: 'text-subscript',
                superscript: 'text-superscript',
                strikeThrough: 'text-strikethrough',
                insertSnippet: 'newspaper',
                insertLink: 'text-link',
                insertPageLink: 'text-link',
                insertTable: 'text-insert-table',
                outdent: 'text-decrease-indent',
                indent: 'text-increase-indent',
                'icon-paragraph': null,
                insertHR: 'horizontal-line',
                'icon-image': 'text-image',
                'icon-video-camera': 'text-video',
                'icon-volume-up': 'volume',
                'icon-file': 'attachment',
                clearFormatting: 'text-clear-formatting',
                selectAll: 'cursor-arrow',
                html: 'edit-code'
            }
        };
    },
    computed: {
        majorTicks: function computeMajorTicks() {
            return utils.makeTicks(this, 100);
        },

        minorTicks: function computeMinorTicks() {
            return utils.makeTicks(this, 25);
        },

        cssClass: function computeCssClass() {
            var result = '';

            if (this.allowResizing) {
                result += ' resizing-ui';
            }
            else {
                result += ' no-resizing-ui';
            }

            if (this.codeEditingMode) {
                result += ' code-editing-mode';
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

        rulerStyle: function computeRulerStyle() {
            const result = {
                width: this.size + 'px'
            };

            result.margin = '0 auto';

            return result;
        },

        storageKey: function computeStorageKey() {
            return this.uniqueKey + '-splitter';
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
        extendToolbar: function extendToolbar(dropdownId) {
            // Guard against unmounted component during retry
            if (!this.$el) {
                return;
            }

            // Find buttons fresh each time - Froala may not be ready on first call
            var $buttons = $(this.$el).find('.fr-toolbar .fr-btn, .fr-toolbar .fr-separator');

            // If no buttons found, Froala isn't ready yet - retry after a delay.
            // Uses setTimeout instead of Vue.nextTick because nextTick creates
            // microtasks that never yield to the browser, causing infinite loops.
            if (!$buttons.length) {
                setTimeout(() => {
                    this.extendToolbar(dropdownId);
                }, 50);
                return;
            }

            this.editorButtons = $buttons;
            const that = this;

            if (!dropdownId) {
                this.toolbarContainer.splice(0, this.toolbarContainer.length);

                if (!this.builtInMode) {
                    this.toolbarContainer.push({ type: 'separator' });
                }
            }

            if (!utils.hasActiveFroalaPopup()) {
                this.openDropdown('fontFamily');
                this.openDropdown('fontSize');
                this.openDropdown('paragraphFormat');
            }

            $buttons.each(function() {
                const $button = $(this);

                if (!dropdownId && $button.hasClass('fr-separator')) {
                    utils.addSeparator(that);
                    return;
                }

                if (dropdownId && $button.attr('data-oc-button-id') !== dropdownId) {
                    return;
                }

                const cmd = $button.attr('data-cmd');
                if (that.buttonConfig[cmd] && that.buttonConfig[cmd].ignore) {
                    return;
                }

                const hasCustomDropdown = that.buttonConfig[cmd] && that.buttonConfig[cmd].dropdown;

                if (!$button.hasClass('fr-dropdown') && !hasCustomDropdown) {
                    utils.buttonFromButton(that, $button);
                }
                else {
                    utils.dropdownFromButton(that, $button, dropdownId);
                }
            });

            this.updateDebounceTimeoutId = null;
        },

        extendExternalToolbar: function extendExternalToolbar() {
            // Guard against unmounted component during retry
            if (!this.$el) {
                return;
            }

            if ($(this.$el).is(":visible")) {
                this.extendToolbar(null);
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

        trans: function trans(key) {
            if (this.configuration.lang[key] === undefined) {
                return key;
            }

            return this.configuration.lang[key];
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

        updateSize: function updateSize() {
            if (this.allowResizing) {
                const $wrapper = $('.fr-wrapper', this.$el);
                const containerSize = $(this.$el).width();
                if (containerSize && this.size > containerSize) {
                    $wrapper
                        .css('width', this.size + 'px')
                        .css('margin-left', '-50%');
                }
                else {
                    $wrapper
                        .css('width', this.size + 'px')
                        .css('margin-left', -(this.size / 2) + 'px');
                }
            }
        },

        updateUi: function updateUi(dropdownId) {
            if (dropdownId) {
                this.extendToolbar(dropdownId);
                return;
            }

            if (this.updateDebounceTimeoutId !== null) {
                clearTimeout(this.updateDebounceTimeoutId);
            }

            // Froala uses 50ms timeout
            this.updateDebounceTimeoutId = setTimeout(this.extendToolbar, 80);
        },

        initListeners: function initListeners() {
            // Guard against unmounted component during retry
            if (!this.$el) {
                return;
            }

            var $textarea = $(this.$el).find('.editor-element');

            // If textarea not found, Froala isn't ready yet - retry on next tick
            if (!$textarea || !$textarea.length) {
                Vue.nextTick(() => {
                    this.initListeners();
                });
                return;
            }

            this.editorTextarea = $textarea;

            $textarea.on(
                [
                    'froalaEditor.click.connector',
                    'froalaEditor.input.connector',
                    'froalaEditor.keyup.connector'
                ].join(' '),
                this.onEditorContextChanged
            );
        },

        openDropdown: function openDropdown(cmd) {
            const $button = $(this.$el).find('.fr-toolbar button[data-cmd="' + cmd + '"]');
            this.triggerEditorButtonClick($button);
        },

        triggerEditorButtonClick: function triggerEditorCommandClick($button) {
            var editor = this.editorTextarea ? this.editorTextarea.data('froala.editor') : null,
                eventType = editor && editor.helpers.isMobile() ? 'touchend' : 'mouseup';

            const ev1 = jQuery.Event(eventType);
            ev1.which = 1;
            $button.addClass('fr-selected').trigger(ev1).removeClass('fr-selected');
        },

        toggleCodeEditing: function toggleCodeEditing() {
            if (!this.codeEditingMode) {
                const basePath = this.configuration.vendorPath;
                this.loadingCodeEditingMode = true;

                require.config({
                    paths: {
                        beautify: basePath + '/beautify@1.13.0/beautify.js',
                        beautifyHtml: basePath + '/beautify@1.13.0/beautify-html.js'
                    }
                });

                // require is provided by the Monaco editor loader
                //
                require(['beautify', 'beautifyHtml'], (js, html) => {
                    this.htmlCode = html.html_beautify(this.editorTextarea.froalaEditor('html.get'));
                    const defMarkup = new EditorModelDefinition(
                        'html',
                        'HTML',
                        {},
                        'htmlCode',
                        'backend-icon-background monaco-document html'
                    );
                    defMarkup.setHolderObject(this);
                    this.codeEditorModelDefinitions = [defMarkup];

                    this.codeEditingMode = true;
                });
            }
            else {
                this.codeEditingMode = false;
                this.loadingCodeEditingMode = false;
                utils.updateEditorHtml(this, this.htmlCode);
            }

            this.updateUi();
        },

        saveSize: function saveSize() {
            if (isNaN(this.size)) {
                return;
            }

            localStorage.setItem(this.storageKey + '-size', this.size);
        },

        alignEditorToolbars: function alignEditorToolbars($button) {
            const $popup = $(this.$el).find('.fr-toolbar .fr-popup.fr-desktop.fr-active');
            if (!$popup.length) {
                return;
            }

            $popup.css('visibility', 'hidden');
            const buttonPosition = $button.position();

            $popup.css('left', buttonPosition.left + 'px');
            const popupOffset = $popup.offset();
            const popupRight = popupOffset.left + $popup.width();
            const documentWidth = $(document).width();
            const correction = popupRight - documentWidth;
            if (correction > 0) {
                $popup.css('left', buttonPosition.left - correction - 15 + 'px');
            }

            if (popupOffset.left < 15) {
                $popup.css('left', 15 + 'px');
            }

            $popup.css('visibility', 'visible');
        },

        onResizingHandleMouseDown: function onResizingHandleMouseDown() {
            this.containerSize = $(this.$el).width();
            $(document.body).addClass('richeditor-document-connector-resizing');

            document.addEventListener('mousemove', this.onMouseMove, { passive: true });
            document.addEventListener('mouseup', this.onMouseUp);

            this.startMargin = $(this.$refs.handle).position();
        },

        onMouseMove: function onMouseMove(ev) {
            if (ev.buttons != 1) {
                // Handle the case when the button was released
                // outside of the viewport. mouseup doesn't fire
                // in that case.
                //
                this.onMouseUp();
            }

            var handlePos = $(this.$refs.handle).offset(),
                delta = ev.pageX - handlePos.left;

            if (delta <= 0) {
                this.size = Math.max(this.size + delta, this.minSize);
            }
            else {
                this.size = Math.min(this.size + delta, this.containerSize);
            }
        },

        onMouseUp: function onMouseUp() {
            document.removeEventListener('mousemove', this.onMouseMove, { passive: true });
            document.removeEventListener('mouseup', this.onMouseUp);

            $(document.body).removeClass('richeditor-document-connector-resizing');
            this.saveSize();
        },

        onEditorContextChanged: function onEditorContextChanged() {
            this.updateUi();
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

            let $button = $(this.$el).find('.fr-toolbar [data-cmd="' + command.froalaCommand + '"]');

            if (command.parameter && command.parameter.substring(0, 11) !== 'oc-dropdown') {
                $button = $button.filter('[data-param1="' + command.parameter + '"]');
            }

            if (!$button.length) {
                return;
            }

            this.triggerEditorButtonClick($button);
            if (this.nonModifyingCommands.indexOf(command.froalaCommand) === -1) {
                this.updateUi(command.ocParameter);
            }

            if (commandData.ev) {
                this.alignEditorToolbars($(commandData.ev.currentTarget));
            }
        },

        onOctoberCommand: function onOctoberCommand(command) {
            octoberCommands.invoke(command.froalaCommand, this.editorTextarea, this);
        }
    },
    mounted: function onMounted() {
        Vue.nextTick(() => {
            // Richeditor Vue component initializes Froala in the next tick
            // after mount()
            //
            var size = parseInt(localStorage.getItem(this.storageKey + '-size'));

            if (size) {
                this.size = size;
            }

            if (this.hasExternalToolbar) {
                this.extendExternalToolbar();
            }
            else {
                this.extendToolbar();
            }

            this.mountEventBus();
            this.initListeners();
            this.internalEventBus.on('toolbarcmd', this.onToolbarCommand);
            this.updateSize();
            addEventListener('resize', this.updateSize);
        });
    },
    beforeUnmount: function beforeUnmount() {
        if (this.editorTextarea) {
            this.editorTextarea.off('.connector');
        }
        removeEventListener('resize', this.updateSize);

        this.unmountEventBus();
        this.internalEventBus.off('toolbarcmd', this.onToolbarCommand);

        this.editorTextarea = null;
        this.editorButtons = null;
    },
    watch: {
        size: function watchSize() {
            this.updateSize();
        },
        htmlCode: function watchHtmlCode(html) {
            utils.updateEditorHtml(this, html);
        }
    }
};
