/*
 * Rich Editor public API (oc.richEditor)
 *
 * Engine-agnostic registry for custom toolbar buttons, included as a classic
 * script in the backend layout head so it is available on every backend page,
 * before plugin scripts and the ES module editor stack. Register buttons at
 * the top level of any script, before the first editor initializes:
 *
 *     oc.richEditor.registerButton('insertCustomThing', {
 *         label: 'Insert Something',
 *         icon: 'icon-star',
 *         toolbar: 'end',
 *         onClick: function(editor) {
 *             editor.insertHtml('<strong>My Custom Thing!</strong>');
 *         }
 *     });
 */
+function() {
    'use strict';

    if (window.oc === undefined) {
        window.oc = {};
    }

    if (oc.richEditor !== undefined) {
        return;
    }

    // normalizeList accepts an array or comma separated string, returning a clean array or null
    function normalizeList(value) {
        if (typeof value === 'string') {
            value = value.split(',');
        }

        if (!Array.isArray(value)) {
            return null;
        }

        var result = value
            .map(function(item) {
                return String(item).trim();
            })
            .filter(function(item) {
                return item.length > 0;
            });

        return result.length ? result : null;
    }

    // findInsertIndex resolves a placement hint to an index in the button list
    function findInsertIndex(list, placement) {
        if (placement === 'start') {
            return 0;
        }

        if (placement && typeof placement === 'object') {
            var reference = placement.before || placement.after,
                index = list.indexOf(reference);

            if (index !== -1) {
                return placement.before ? index : index + 1;
            }
        }

        return list.length;
    }

    // injectButton splices a button into the list, applying separator hints
    function injectButton(list, name, definition) {
        var index = findInsertIndex(list, definition.toolbar),
            separator = definition.separator,
            entry = [name];

        if ((separator === 'before' || separator === 'both') && index > 0 && list[index - 1] !== '|') {
            entry.unshift('|');
        }

        if ((separator === 'after' || separator === 'both') && index < list.length && list[index] !== '|') {
            entry.push('|');
        }

        Array.prototype.splice.apply(list, [index, 0].concat(entry));
    }

    oc.richEditor = {
        /*
         * buttons registered on this page, keyed by name
         */
        buttons: {},

        /*
         * booted is set once by the engine adapter, sealing the registry
         */
        booted: false,

        /*
         * engine adapter reference, set on boot
         */
        engine: null,

        /*
         * defaultButtons used when no field or settings configuration applies
         */
        defaultButtons: [
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
        ],

        /*
         * knownButtons holds display metadata for the built-in button set, used
         * by toolbar editing interfaces, custom buttons supply their own metadata
         */
        knownButtons: {
            'fullscreen': { label: 'Fullscreen', icon: 'icon-expand' },
            'bold': { label: 'Bold', icon: 'icon-bold' },
            'italic': { label: 'Italic', icon: 'icon-italic' },
            'underline': { label: 'Underline', icon: 'icon-underline' },
            'strikeThrough': { label: 'Strikethrough', icon: 'icon-strikethrough' },
            'subscript': { label: 'Subscript', icon: 'icon-subscript' },
            'superscript': { label: 'Superscript', icon: 'icon-superscript' },
            'fontFamily': { label: 'Font Family', icon: 'icon-font' },
            'fontSize': { label: 'Font Size', icon: 'icon-text-height' },
            'color': { label: 'Text Color', icon: 'icon-tint' },
            'emoticons': { label: 'Emoticons', icon: 'icon-smile-o' },
            'inlineStyle': { label: 'Inline Style', icon: 'icon-paint-brush' },
            'paragraphStyle': { label: 'Paragraph Style', icon: 'icon-paragraph' },
            'paragraphFormat': { label: 'Paragraph Format', icon: 'icon-header' },
            'align': { label: 'Align', icon: 'icon-align-left' },
            'formatOL': { label: 'Ordered List', icon: 'icon-list-ol' },
            'formatUL': { label: 'Unordered List', icon: 'icon-list-ul' },
            'outdent': { label: 'Outdent', icon: 'icon-outdent' },
            'indent': { label: 'Indent', icon: 'icon-indent' },
            'quote': { label: 'Quote', icon: 'icon-quote-left' },
            'insertHR': { label: 'Horizontal Line', icon: 'icon-minus' },
            'insertLink': { label: 'Insert Link', icon: 'icon-link' },
            'insertPageLink': { label: 'Insert Page Link', icon: 'icon-link' },
            'insertImage': { label: 'Insert Image', icon: 'icon-image' },
            'insertVideo': { label: 'Insert Video', icon: 'icon-video-camera' },
            'insertAudio': { label: 'Insert Audio', icon: 'icon-volume-up' },
            'insertFile': { label: 'Insert File', icon: 'icon-file' },
            'insertTable': { label: 'Insert Table', icon: 'icon-table' },
            'insertSnippet': { label: 'Insert Snippet', icon: 'icon-newspaper-o' },
            'undo': { label: 'Undo', icon: 'icon-undo' },
            'redo': { label: 'Redo', icon: 'icon-repeat' },
            'clearFormatting': { label: 'Clear Formatting', icon: 'icon-eraser' },
            'selectAll': { label: 'Select All', icon: 'icon-mouse-pointer' },
            'html': { label: 'Code View', icon: 'icon-code' }
        },

        /*
         * getButtonMeta returns display metadata for a button code, or null
         * when the code is not known to this page
         */
        getButtonMeta: function(name) {
            var custom = this.buttons[name];
            if (custom) {
                return {
                    label: custom.label || name,
                    icon: typeof custom.icon === 'string' ? custom.icon : null
                };
            }

            return this.knownButtons[name] || null;
        },

        /*
         * registerButton adds an engine-agnostic button definition:
         *
         * - label: tooltip and accessible label
         * - icon: October icon class name, or { html: '...' } markup
         * - toolbar: 'start' | 'end' | { before: name } | { after: name }, omit to register without placing
         * - separator: 'before' | 'after' | 'both' inserts a visual separator
         * - undo: records an undo step after onClick
         * - focus: focuses the editor before onClick
         * - onClick: function(editor) receiving the editor facade
         */
        registerButton: function(name, definition) {
            if (this.booted) {
                console.warn(
                    '[richeditor] Button "' + name + '" was registered after the editor booted and is ignored. ' +
                    'Register buttons at the top level of a page script, before the first editor initializes.'
                );
                return;
            }

            this.buttons[name] = definition || {};
        },

        /*
         * resolveButtons builds the toolbar list for an editor instance, configured
         * buttons are used verbatim while the built-in default list receives
         * registered button injection
         */
        resolveButtons: function(context) {
            context = context || {};

            var fieldButtons = normalizeList(context.fieldButtons);
            if (fieldButtons) {
                return fieldButtons;
            }

            var globalButtons = normalizeList(context.globalButtons);
            if (globalButtons) {
                return globalButtons;
            }

            return this.injectRegisteredButtons(this.defaultButtons);
        },

        /*
         * injectRegisteredButtons returns a copy of a button list with the
         * registered buttons that request a toolbar placement injected
         */
        injectRegisteredButtons: function(list) {
            var result = (list || []).slice(),
                self = this;

            Object.keys(this.buttons).forEach(function(name) {
                var definition = self.buttons[name];
                if (definition.toolbar && result.indexOf(name) === -1) {
                    injectButton(result, name, definition);
                }
            });

            return result;
        },

        /*
         * boot is called once by the engine adapter, sealing the registry
         */
        boot: function(engine) {
            if (this.booted) {
                return;
            }

            this.booted = true;
            this.engine = engine;
        }
    };

    /*
     * @deprecated use oc.richEditor.registerButton, this shim translates the legacy
     * Froala command configuration into a registry definition
     */
    oc.richEditorRegisterButton = function(name, config) {
        config = config || {};

        var definition = {
            label: config.title,
            undo: config.undo,
            focus: config.focus,
            toolbar: config.toolbar,
            separator: config.separator,
            engineOptions: { froala: config }
        };

        if (typeof config.icon === 'string') {
            definition.icon = { html: config.icon };
        }

        if (typeof config.callback === 'function') {
            definition.onClick = function(editor) {
                return config.callback.apply(editor.native, Array.prototype.slice.call(arguments, 1));
            };
        }

        oc.richEditor.registerButton(name, definition);
    };
}();
