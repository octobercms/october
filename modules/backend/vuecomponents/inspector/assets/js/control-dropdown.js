import { ControlBase } from './classes/index.js';

/*
 * Vue Inspector dropdown control implementation
 */
export default {
    extends: ControlBase,
    props: {},
    data: function () {
        return {
            dynamicOptions: {},
            selectedValue: null,
            prevSelectedValue: null,
            editorFocused: false,
            unwatches: []
        };
    },
    computed: {
        options: function computeOptions() {
            var options = this.control.options ? this.control.options : this.dynamicOptions,
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

        useValuesAsIcons: function computeUseValuesAsIcons() {
            return !!this.control.useValuesAsIcons;
        },

        useValuesAsColors: function computeUseValuesAsColors() {
            return !!this.control.useValuesAsColors;
        },

        containerTabIndex: function computeContainerTabIndex() {
            return this.editorFocused ? -1 : 0;
        }
    },
    methods: {
        focusControl: function focusControl() {
            if (this.$refs.input) {
                this.$refs.input.activate();
                this.editorFocused = true;
            }
        },

        updateValue: function updateValue(option) {
            if (option === null) {
                // Vue Multiselect deselects the selected value
                // if the user clicks it. It's not a desired
                // behavior for the Inspector dropdown control.
                this.selectedValue = this.prevSelectedValue;
                return;
            }

            var value = option ? option.code : null;
            this.setManagedValue(value);
        },

        findOptionByValue: function findOptionByValue(value) {
            if (!this.options) {
                return null;
            }

            for (var index = 0; index < this.options.length; index++) {
                if (this.options[index].code == value) {
                    return this.options[index];
                }
            }
        },

        refreshDisplayedValue: function refreshDisplayedValue() {
            this.setInitialValue();
        },

        setInitialValue: function () {
            var value = this.value;
            // TODO - make this conversion configurable.
            // It works for CMS page layouts where we get null
            // as an input value but want to return an empty string
            // if the empty value is selected.
            if (value === null) {
                value = '';
            }

            if (value !== undefined) {
                this.selectedValue = this.findOptionByValue(value);
            }
        },

        dynamicOptionsLoaded: function dynamicOptionsLoaded(data) {
            this.dynamicOptions = {};

            if (data.options) {
                for (var i = 0, len = data.options.length; i < len; i++) {
                    // Vue 3: Direct assignment is reactive
                    this.dynamicOptions[data.options[i].value] = data.options[i].title;
                }
            }

            this.setInitialValue();
        },

        onDropdownMounted: function onDropdownMounted() {
            $(this.$el).find('.multiselect__select').addClass('backend-icon-background-pseudo');
        },

        onFocus: function onFocus() {
            this.$emit('focus', { target: this.$refs.input.$el });
            this.editorFocused = true;
        },

        onBlur: function onBlur() {
            this.$emit('blur', { target: this.$refs.input.$el });
            this.editorFocused = false;
        },

        onInspectorLabelClick: function onInspectorLabelClick() {
            if (this.$refs.input) {
                this.$refs.input.activate();
            }
        },

        onContainerFocus: function onContainerFocus() {
            if (this.$refs.input) {
                this.$refs.input.activate();
            }
        }
    },
    mounted: function () {
        if (!this.control.options) {
            this.loadDynamicOptions();
        }
        else {
            this.setInitialValue();
        }

        if (Array.isArray(this.control.depends)) {
            this.control.depends.forEach(dependsOn => {
                this.unwatches.push(
                    this.$watch('obj.' + dependsOn, (newVal) => {
                        const originalValue = this.value;
                        this.loadDynamicOptions().then(() => {
                            if (!this.findOptionByValue(originalValue)) {
                                this.setManagedValue(null);
                            }
                        })
                    }, {
                        deep: true
                    })
                );
            })
        }
    },
    beforeUnmount: function () {
        this.unwatches.forEach(unwatch => {
            unwatch();
        })
    },
    watch: {
        selectedValue: function (newValue, oldValue) {
            this.prevSelectedValue = newValue;
        }
    }
};
