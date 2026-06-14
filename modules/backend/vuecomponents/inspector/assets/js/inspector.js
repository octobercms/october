import { utils } from './classes/index.js';

/*
 * Vue Inspector implementation
 */
export default {
    props: {
        dataSchema: {
            type: Array,
            required: true
        },
        data: {
            type: Object,
            required: true
        },
        liveMode: {
            type: Boolean,
            default: false
        },
        uniqueId: {
            type: String,
            required: true
        },
        handlerAlias: {
            type: String
        },
        layoutUpdateData: {
            type: Object
        },
        inspectorClass: {
            type: String
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        enableExternalParameterEditor: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        if (typeof this.data !== 'object') {
            throw new Error('Inspector data.obj must be an object');
        }

        return {
            liveObject: this.liveMode ? this.data.obj : $.oc.vueUtils.getCleanObject(this.data.obj),
            originalData: this.liveMode ? $.oc.vueUtils.getCleanObject(this.data.obj) : null,
            parentObject: this.data.parentObj ? this.data.parentObj : {}
        };
    },
    computed: {
        inspectorPreferences: function computeInspectorPreferences() {
            return {
                readOnly: this.readOnly,
                inspectorClass: this.inspectorClass,
                handlerAlias: this.handlerAlias,
                enableExternalParameterEditor: this.enableExternalParameterEditor
            };
        }
    },
    methods: {
        getCleanObject: function getCleanObject() {
            var result = $.oc.vueUtils.getCleanObject(this.liveObject);

            this.dataSchema.forEach(function(control) {
                if (!control.property) {
                    return;
                }

                var value = utils.getProperty(result, control.property);

                // ignoreIfEmpty: strip property if the value is empty
                if (control.ignoreIfEmpty) {
                    if (utils.isValueEmpty(value)) {
                        utils.deleteProperty(result, control.property);
                        return;
                    }
                }

                // ignoreIfDefault: strip property if the value matches the default
                if (control.ignoreIfDefault) {
                    if (control.default !== undefined && utils.compareValues(value, control.default)) {
                        utils.deleteProperty(result, control.property);
                        return;
                    }
                }

                // Implicit: strip if value matches the defined default
                if (control.default !== undefined && utils.compareValues(value, control.default)) {
                    utils.deleteProperty(result, control.property);
                }
            });

            return result;
        },

        applyChanges: function applyChanges() {
            utils.deepCloneObject(this.getCleanObject(), this.data.obj);
        },

        revertChanges: function cancelChanges() {
            if (!this.liveMode) {
                throw new Error('Changes can only be reverted in live mode.');
            }

            utils.deepCloneObject(this.originalData, this.data.obj);
        },

        validate: function validate() {
            return this.$refs.panel.validate();
        },

        onModalShown: function onModalShown() {
            this.layoutUpdateData.modalShown++;
        }
    },
    created: function created() {
        var validationError = utils.validateDataSchema(this.dataSchema);

        if (typeof validationError === 'string') {
            console.log(this.dataSchema);
            throw new Error(validationError);
        }
    }
};
