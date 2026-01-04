
Vue.component('cms-editor-component-page-editor', {
    extends: oc.Modules.import('cms.editor.extension.documentcomponent.base'),
    data: function() {
        const EditorModelDefinition = oc.Modules.import('backend.vuecomponents.monacoeditor.modeldefinition');
        const defMarkup = new EditorModelDefinition(
            'twig',
            this.trans('cms::lang.page.editor_markup'),
            {},
            'markup',
            'backend-icon-background monaco-document html'
        );

        defMarkup.setModelTags(['cms-markup']);

        const defCode = new EditorModelDefinition(
            'php',
            this.trans('cms::lang.page.editor_code'),
            {},
            'code',
            'backend-icon-background monaco-document php'
        );

        defCode.setAutoPrefix('<?php\n\n', /^\s*\<\?(php)?\n*/);

        return {
            documentData: {
                markup: '',
                code: ''
            },
            documentSettingsPopupTitle: this.trans('cms::lang.editor.page'),
            previewUrl: null,
            codeEditorModelDefinitions: [defMarkup, defCode],
            defMarkup: defMarkup,
            defCode: defCode
        };
    },
    computed: {
        toolbarElements: function computeToolbarElements() {
            return this.postProcessToolbarElements([
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
                    target: '_blank',
                    href: this.previewUrl,
                    disabled: this.previewUrl === null,
                    icon: 'icon-location-target',
                    label: this.trans('cms::lang.editor.preview'),
                    tooltip: this.trans('cms::lang.editor.preview'),
                    hotkey: 'shift+ctrl+p, shift+cmd+p',
                    tooltipHotkey: '⇧⌃P, ⇧⌘P',
                    command: 'preview',
                    visibilityTag: 'hide-for-direct-document'
                },
                {
                    type: 'button',
                    icon: 'icon-settings',
                    label: this.trans('editor::lang.common.settings'),
                    command: 'settings',
                    hidden: !this.hasSettingsForm
                },
                this.customToolbarButtons,
                {
                    type: 'button',
                    icon: 'icon-components',
                    label: this.trans('cms::lang.editor.component_list'),
                    command: 'show-components'
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
                    type: 'button',
                    icon: this.documentHeaderCollapsed ? 'icon-angle-down' : 'icon-angle-up',
                    command: 'document:toggleToolbar',
                    fixedRight: true,
                    tooltip: this.trans('editor::lang.common.toggle_document_header')
                }
            ]);
        }
    },
    methods: {
        getRootProperties: function() {
            return ['components', 'fileName', 'markup', 'code'];
        },

        getMainUiDocumentProperties: function getMainUiDocumentProperties() {
            return ['title', 'url', 'markup', 'code', 'components'];
        },

        documentLoaded: function documentLoaded(data) {
            this.previewUrl = data.previewUrl;

            if (this.$refs.editor) {
                this.$refs.editor.updateValue(this.defMarkup, this.documentData.markup);
                this.$refs.editor.updateValue(this.defCode, this.documentData.code);
            }
        },

        documentCreatedOrLoaded: function documentCreatedOrLoaded() {
            this.defMarkup.setHolderObject(this.documentData);
            this.defCode.setHolderObject(this.documentData);
        },

        documentSaved: function documentSaved(data) {
            if (data.previewUrl !== undefined) {
                this.previewUrl = data.previewUrl;
            }
        },

        updateNavigatorNodeUserData: function updateNavigatorNodeUserData(title) {
            this.documentNavigatorNode.userData.title = title;
            this.documentNavigatorNode.userData.url = this.documentData.url;
            this.documentNavigatorNode.userData.filename = this.documentMetadata.path;
            this.documentNavigatorNode.userData.path = this.documentMetadata.navigatorPath;
        },

        onTitleInput: function onTitleInput() {
            // This flag is set until the document is first saved.
            //
            if (!this.documentMetadata.isNewDocument) {
                return;
            }

            const path = $.oc.presetEngine.formatValue(
                {
                    inputPresetType: 'file',
                    inputPresetRemoveWords: true
                },
                this.documentData.title
            );

            Vue.set(this.documentData, 'fileName', path);
        }
    },
    template: '#cms_vuecomponents_pageeditor'
});
