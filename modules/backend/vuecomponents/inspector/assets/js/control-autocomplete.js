import { ControlBase } from './classes/index.js';

/*
 * Vue Inspector autocomplete control implementation
 */
export default {
    extends: ControlBase,
    props: {},
    data: function () {
        return {
            dynamicItems: {},
            initialValue: this.computeValue()
        };
    },
    computed: {
        items: function computeItems() {
            var items = this.control.items ? this.control.items : this.dynamicItems;

            return items;
        },

        placeholder: function computePlaceholder() {
            return this.control.placeholder;
        }
    },
    methods: {
        updateValue: function updateValue(value) {
            this.setManagedValue(value);
        },

        onFocus: function onFocus() {
            this.$emit('focus', { target: this.$refs.autocomplete.$el });
        },

        onBlur: function onBlur() {
            this.$emit('blur', { target: this.$refs.autocomplete.$el });
        },

        focusControl: function focusControl() {
            this.$refs.autocomplete.$refs.input.focus();
        },

        getResultValue: function (result) {
            return result.key;
        },

        dynamicOptionsLoaded: function dynamicOptionsLoaded(data) {
            if (data.options) {
                var loadedItems = {};
                for (var i = data.options.length - 1; i >= 0; i--) {
                    loadedItems[data.options[i].value] = data.options[i].title
                }

                // Vue 3: Direct assignment is reactive
                this.dynamicItems = this.prepareItems(loadedItems);
            }
        },

        prepareItems: function prepareItems(items) {
            var result = {}

            if (Array.isArray(items)) {
                for (var i = 0, len = items.length; i < len; i++) {
                    result[items[i]] = items[i];
                }
            }
            else {
                result = items;
            }

            return result;
        },

        onInput: function onInput() {
            this.updateValue(this.$refs.autocomplete.value);
        },

        onChange: function onChange() {
            this.updateValue(this.$refs.autocomplete.value);
        },

        onUpdate: function onUpdate() {
            this.updateValue(this.$refs.autocomplete.value);
        },

        onSearch: function onSearch(input) {
            var result = [],
                input = input.toLowerCase();

            var keys = Object.keys(this.items);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i].toLowerCase(),
                    item = this.items[key].toLowerCase();

                if ($.oc.vueUtils.stringFuzzySearch(input, key)
                    || $.oc.vueUtils.stringFuzzySearch(input, item)) {
                    result.push({
                        value: this.items[key],
                        key: key
                    });
                }
            }

            return result;
        }
    },
    mounted: function () {
        if (!this.control.items) {
            this.loadDynamicOptions();
        }
    }
};
