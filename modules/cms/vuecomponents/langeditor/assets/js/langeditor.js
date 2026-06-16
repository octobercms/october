import { CmsDocumentComponentBase } from '../../../../assets/js/cms.editor.extension.documentcomponent.base.js';

export default {
    extends: CmsDocumentComponentBase,
    data: function() {
        return {
            documentSettingsPopupTitle: this.trans('cms::lang.editor.lang'),
            documentDeletedMessage: this.trans('cms::lang.lang.deleted'),
            documentTitleProperty: 'fileName',
            autoUpdateNavigatorNodeLabel: false,
            spreadsheetColumns: [
                { data: 'key', title: this.trans('cms::lang.lang.key_column') },
                { data: 'value', title: this.trans('cms::lang.lang.value_column') }
            ],
            spreadsheetData: [],
            showSearch: false
        };
    },
    computed: {
        toolbarElements: function computeToolbarElements() {
            return this.postProcessToolbarElements(
                [
                    {
                        type: 'button',
                        icon: 'icon-save-cloud',
                        label: this.trans('backend::lang.form.save'),
                        hotkey: 'ctrl+s, cmd+s',
                        tooltip: this.trans('backend::lang.form.save'),
                        tooltipHotkey: '⌃S, ⌘S',
                        command: 'save'
                    },
                    {
                        type: 'button',
                        icon: 'icon-settings',
                        label: this.trans('editor::lang.common.settings'),
                        command: 'settings',
                        hidden: !this.hasSettingsForm
                    },
                    {
                        type: 'separator'
                    },
                    {
                        type: 'button',
                        icon: 'icon-info-circle',
                        label: this.trans('cms::lang.editor.info'),
                        command: 'show-template-info',
                        disabled: this.isNewDocument
                    },
                    {
                        type: 'separator'
                    },
                    {
                        type: 'button',
                        icon: 'icon-delete',
                        disabled: this.isNewDocument,
                        command: 'delete',
                        hotkey: 'shift+option+d',
                        tooltip: this.trans('backend::lang.form.delete'),
                        tooltipHotkey: '⇧⌥D'
                    },
                    {
                        type: 'separator'
                    },
                    {
                        type: 'button',
                        icon: 'icon-list-add',
                        label: this.trans('backend::lang.form.insert_row'),
                        command: 'insert-row',
                        tooltip: this.trans('backend::lang.form.insert_row')
                    },
                    {
                        type: 'button',
                        icon: 'icon-list-remove',
                        label: this.trans('backend::lang.form.delete_row'),
                        command: 'delete-row',
                        tooltip: this.trans('backend::lang.form.delete_row')
                    },
                    {
                        type: 'button',
                        icon: 'icon-search',
                        label: this.trans('backend::lang.list.search_prompt'),
                        command: 'toggle-search',
                        pressed: this.showSearch,
                        tooltip: this.trans('backend::lang.list.search_prompt')
                    },
                    {
                        type: 'button',
                        icon: this.documentHeaderCollapsed ? 'icon-angle-down' : 'icon-angle-up',
                        command: 'document:toggleToolbar',
                        fixedRight: true,
                        tooltip: this.trans('editor::lang.common.toggle_document_header')
                    }
                ],
                true
            );
        }
    },
    methods: {
        getRootProperties: function() {
            return ['fileName', 'content'];
        },

        getMainUiDocumentProperties: function getMainUiDocumentProperties() {
            return ['fileName', 'content'];
        },

        updateNavigatorNodeUserData: function updateNavigatorNodeUserData(title) {
            this.documentNavigatorNode.userData.filename = this.documentMetadata.fileName;
            this.documentNavigatorNode.userData.path = this.documentMetadata.navigatorPath;
        },

        getDocumentSavedMessage: function getDocumentSavedMessage(responseData) {
            return this.trans('cms::lang.lang.saved');
        },

        documentLoaded: function documentLoaded(data) {
            this.contentToSpreadsheet(this.documentData.content);
        },

        documentSaved: function documentSaved(data, prevData) {
            if (prevData && prevData.fileName != data.fileName) {
                this.store.refreshExtensionNavigatorNodes(this.namespace, this.documentType);
            }
        },

        documentCreatedOrLoaded: function documentCreatedOrLoaded() {
            if (this.isNewDocument) {
                this.loadDefaultKeys();
            }
            else {
                this.contentToSpreadsheet(this.documentData.content);
            }
        },

        loadDefaultKeys: function loadDefaultKeys() {
            var self = this;
            this.ajaxRequest('onCommand', {
                extension: this.namespace,
                command: 'onGetLangDefaultKeys',
                documentMetadata: this.documentMetadata
            }).then(function(data) {
                var keys = data.keys || {};
                var rows = [];

                Object.keys(keys).forEach(function(key) {
                    rows.push({ key: key, value: '' });
                });

                self.spreadsheetData = rows;

                if (self.$refs.spreadsheet) {
                    self.$refs.spreadsheet.loadData(rows);
                }
            });
        },

        contentToSpreadsheet: function contentToSpreadsheet(content) {
            var rows = [];

            try {
                var obj = JSON.parse(content || '{}');
                Object.keys(obj).forEach(function(key) {
                    rows.push({ key: key, value: obj[key] });
                });
            }
            catch (e) {
                // Invalid JSON, start empty
            }

            this.spreadsheetData = rows;

            if (this.$refs.spreadsheet) {
                this.$refs.spreadsheet.loadData(rows);
            }
        },

        onToolbarCommand: function onToolbarCommand(command, isHotkey) {
            this.handleBasicDocumentCommands(command, isHotkey);

            if (command === 'show-template-info') {
                this.showTemplateInfo();
            }

            if (command === 'insert-row') {
                this.$refs.spreadsheet.addRow();
            }

            if (command === 'delete-row') {
                this.$refs.spreadsheet.deleteRow();
            }

            if (command === 'toggle-search') {
                this.showSearch = !this.showSearch;

                if (this.showSearch) {
                    this.$nextTick(function() {
                        this.$refs.searchInput.focus();
                    }.bind(this));
                }
                else {
                    this.$refs.searchInput.value = '';
                    this.$refs.spreadsheet.search('');
                }
            }
        },

        onSearchInput: function onSearchInput(ev) {
            this.$refs.spreadsheet.search(ev.target.value);
        },

        onSearchNext: function onSearchNext() {
            this.$refs.spreadsheet.searchNext();
        },

        onSpreadsheetChange: function onSpreadsheetChange(data) {
            if (!Array.isArray(data)) {
                return;
            }

            var obj = {};

            data.forEach(function(row) {
                var key = row.key && typeof row.key === 'string' ? row.key.trim() : '';
                var value = typeof row.value === 'string' ? row.value : String(row.value || '');

                if (key.length > 0 && value.trim().length > 0) {
                    obj[key] = value;
                }
            });

            this.documentData.content = JSON.stringify(obj, null, 4) + '\n';
        }
    }
};
