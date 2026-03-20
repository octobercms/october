import { DocumentComponentBase } from '../../../editor/assets/js/editor.extension.documentcomponent.base.js';

export const TailorDocumentComponentBase = {
    extends: DocumentComponentBase,
    data: function () {
        return {
            savingDocument: false,
            documentSavedMessage: this.trans('tailor::lang.blueprint.saved'),
            documentReloadedMessage: this.trans('tailor::lang.blueprint.reloaded'),
            documentDeletedMessage: this.trans('tailor::lang.blueprint.deleted')
        };
    },

    computed: {
    },

    methods: {
        monacoLoaded: function monacoLoaded() {
            // Overwrite this method in subclasses
        },

        getSaveDocumentData: function getSaveDocumentData(inspectorDocumentData) {
            const documentData = inspectorDocumentData ? inspectorDocumentData : this.documentData;

            const data = $.oc.vueUtils.getCleanObject(documentData);
            const result = {
            };

            // Copy root properties
            //
            Object.keys(data).forEach((property) => {
                    result[property] = data[property];
            });

            return result;
        },


        getDocumentSavedMessage: function getDocumentSavedMessage(responseData) {
            return this.documentSavedMessage;
        },

        onParentTabSelected: function onParentTabSelected() {
            if (this.$refs.editor) {
                this.$nextTick(() => this.$refs.editor.layout());
            }
        },

        onToolbarCommand: function onToolbarCommand(command, isHotkey) {
            this.handleBasicDocumentCommands(command, isHotkey);
        }
    }
};
