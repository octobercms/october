import { TableControlBase } from './classes/index.js';

/*
 * Vue Inspector table dropdown control implementation
 */
export default {
    extends: TableControlBase,
    props: {
    },
    data: function () {
        return {
            dynamicOptions: {},
            selectedValue: null,
            editorFocused: false
        };
    },
    computed: {
        options: function computeOptions() {
            var options = this.column.options ? this.column.options : this.dynamicOptions,
                optionKeys = Object.keys(options),
                result = [];

            optionKeys.forEach(function (key) {
                result.push({
                    label: options[key],
                    code: key
                });
            });

            return result;
        },

        hasValue: function computeHasValue() {
            var value = this.row[this.column.column];
            return typeof value === 'string' && value.length > 0;
        },

        containerTabIndex: function computeContainerTabIndex() {
            return this.editorFocused ? -1 : 0;
        }
    },
    methods: {
        focusEditor: function focusEditor() {
            this.$refs.editor.activate();
        },

        updateValue: function updateValue(option) {
            var value = option ? option.code : null;
            // Vue 3: Direct assignment is reactive
            this.row[this.column.column] = value;
        },

        setInitialValue: function () {
            var value = this.row[this.column.column],
                options = this.column.options ? this.column.options : this.dynamicOptions;

            // TODO - make this conversion configurable.
            if (value === null) {
                value = '';
            }

            if (value !== undefined) {
                this.selectedValue = {
                    code: value,
                    label: options[value]
                };
            }
        },

        onContainerFocus: function onContainerFocus() {
            this.$refs.editor.activate();
        },

        onFocus: function onFocus() {
            this.$emit('focus', { target: this.$refs.editor.$el });
            this.editorFocused = true;
        },

        onBlur: function onBlur() {
            this.$emit('blur', { target: this.$refs.editor.$el });
            this.editorFocused = false;
        },
    },
    mounted: function () {
        $(this.$el).find('.multiselect__select').addClass('backend-icon-background-pseudo');

        if (this.loadingDynamicOptions) {
            // TODO - load options and call setInitialValue()
        }
        else {
            this.setInitialValue();
        }
    },
    watch: {
        row: {
            deep: true,
            handler: function (newValue) {
                this.setInitialValue();
            }
        }
    },
    created: function created() {
        if (!this.column.options) {
            this.loadingDynamicOptions = true;
        }
    }
};
