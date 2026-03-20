import { ControlBase, utils } from './classes/index.js';

/*
 * Vue Inspector object control implementation
 */
export default {
    extends: ControlBase,
    props: {
        layoutUpdateData: {
            type: Object
        },
        inspectorPreferences: Object,
        splitterData: {
            type: Object,
            required: true
        },
        inspectorUniqueId: {
            type: String,
            required: true
        },
        depth: {
            type: Number,
            required: true
        },
        panelUpdateData: {
            type: Object,
            required: true
        },
        layoutUpdateData: {
            type: Object
        }
    },
    data: function () {
        return {
            // We manipulate this object directly. It's
            // a model of the Inspector's target object
            // which copy is created when the component
            // instantiates.
            //
            // The Inspector's target object is updated
            // when editedObject is changed. This way we
            // intentionally break a two-way binding
            // between object properties and inputs. This
            // is needed because when ignoreIfPropertyEmpty
            // is in use and object evaluates to an empty
            // value we don't want to clear inputs.
            //
            editedObject: this.computeValue()
        };
    },
    computed: {
    },
    methods: {
        updateValue: function updateValue(value) {
            if (this.control.ignoreIfPropertyEmpty !== undefined) {
                var targetProperty = this.control.ignoreIfPropertyEmpty;
                if (utils.isValueEmpty(value[targetProperty])) {
                    value = undefined;
                }
            }

            this.setManagedValue(value);
        },

        getDefaultValue: function getDefaultValue() {
            return {};
        },

        shouldSkipInspectorValidation: function shouldSkipInspectorValidation() {
            if (this.control.ignoreIfPropertyEmpty === undefined) {
                return false;
            }

            var targetProperty = this.control.ignoreIfPropertyEmpty;
            return utils.isValueEmpty(this.editedObject[targetProperty]);
        },

        focusControl: function focusControl() {
            // TODO
        },

        onInvalid: function onInvalid() {
            this.$refs.group.setHasValidationErrors(true);
        },

        onValid: function onValid() {
            this.$refs.group.setHasValidationErrors(false);
        }
    },
    created: function created() {

    },
    mounted: function mounted() {
        this.$emit('hidefullwidthlabel');
        this.$emit('hidebottomborder');
    },
    watch: {
        editedObject: {
            deep: true,
            handler: function (newValue, oldValue) {
                this.updateValue(newValue);
            }
        }
    }
};
