import { ControlBase } from './classes/index.js';

/*
 * Vue Inspector set control implementation
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
        var value = this.computeValue(),
            initialValue = {};

        if (Array.isArray(value)) {
            value.forEach(function (element) {
                initialValue[element] = 1;
            });
        }
        else if (typeof value === 'object') {
            initialValue = value;
        }

        return {
            editedObject: initialValue,
            loadedItems: {},
            unwatches: []
        };
    },
    computed: {
        nestedControlProperties: function computeNestedControlProperties() {
            var items = this.items,
                result = [];

            for (var prop in items) {
                if (!items.hasOwnProperty(prop)) {
                    continue;
                }

                result.push({
                    'property': prop,
                    'title': items[prop],
                    'type': 'checkbox',
                    'default': false
                });
            }

            return result;
        },

        items: function computeItems() {
            var items = this.control.items ? this.control.items : this.loadedItems;

            return items;
        },

        groupValue: function computeGroupValue() {
            var value = this.computeValue();
            if (Array.isArray(value) && value.length > 0) {
                var items = this.items,
                    titles = [];

                for (var i = 0; i < value.length; i++) {
                    var currentValue = value[i];
                    if (items[currentValue] != undefined) {
                        titles.push(items[currentValue]);
                    }
                }

                if (titles.length > 0) {
                    return '[' + titles.join(', ') + ']';
                }

                return '';
            }

            return '';
        }
    },
    methods: {
        updateValue: function updateValue(value) {
            var storedValue = [];

            if (typeof value === 'object') {
                for (var prop in value) {
                    if (!value.hasOwnProperty(prop)) {
                        continue;
                    }

                    if (value[prop]) {
                        storedValue.push(prop);
                    }
                }
            }

            this.setManagedValue(storedValue);
        },

        dynamicOptionsLoaded: function dynamicOptionsLoaded(data) {
            if (data.options) {
                this.loadedItems = {};
                for (var i = 0, len = data.options.length; i < len; i++) {
                    // Vue 3: Direct assignment is reactive
                    this.loadedItems[data.options[i].value] = data.options[i].title;
                }
            }
        },

        getDefaultValue: function getDefaultValue() {
            return {};
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
    },
    created: function created() {

    },
    mounted: function mounted() {
        this.$emit('hidefullwidthlabel');
        this.$emit('hidebottomborder');

        if (!this.control.items) {
            this.loadDynamicOptions();
        }

        if (Array.isArray(this.control.depends)) {
            this.control.depends.forEach(dependsOn => {
                this.unwatches.push(
                    this.$watch('obj.' + dependsOn, (newVal) => {
                        const originalValue = this.value;
                        this.loadDynamicOptions().then(() => {
                            if (!this.findOptionByValue(originalValue)) {
                                this.setManagedValue([]);
                            }
                        })
                    }, {
                        deep: true
                    })
                );
            })
        }
    },
    watch: {
        editedObject: {
            deep: true,
            handler: function (newValue, oldValue) {
                this.updateValue(newValue);
            }
        }
    },
    beforeUnmount: function () {
        this.unwatches.forEach(unwatch => {
            unwatch();
        })
    }
};
