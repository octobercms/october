import { ControlBase } from './classes/index.js';

/*
 * Vue Inspector stringList control implementation.
 * Displays an array of strings as a collapsible group with an inline table.
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
        }
    },
    data: function () {
        var value = this.computeValue(),
            initialValue = {
                tableData: []
            };

        if (Array.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
                var item = value[i];
                if (typeof item === 'string') {
                    initialValue.tableData.push({
                        value: item
                    });
                }
            }
        }

        return {
            editedObject: initialValue,
            nestedControlProperties: []
        };
    },
    computed: {
        groupValue: function computeGroupValue() {
            var value = this.computeValue();

            if (!Array.isArray(value)) {
                return '';
            }

            var itemNumber = value.length;
            if (itemNumber === 0) {
                return '';
            }

            return '[' + itemNumber + ']';
        }
    },
    methods: {
        updateValue: function updateValue(value) {
            if (!value.tableData) {
                return;
            }

            var storedValue = [];

            if (Array.isArray(value.tableData)) {
                value.tableData.forEach(function (tableItem) {
                    if (typeof tableItem.value === 'string') {
                        var trimmed = tableItem.value.trim();
                        if (trimmed.length > 0) {
                            storedValue.push(trimmed);
                        }
                    }
                });
            }

            this.setManagedValue(storedValue);
        },

        initNestedControls: function initNestedControls() {
            this.nestedControlProperties = [
                {
                    type: 'table',
                    property: 'tableData',
                    noHeader: true,
                    columns: [
                        {
                            'column': 'value',
                            'type': 'string',
                            'title': 'Value'
                        }
                    ]
                }
            ];
        },

        getDefaultValue: function getDefaultValue() {
            return [];
        },

        focusControl: function focusControl() {
            // TODO
        }
    },
    mounted: function mounted() {
        this.$emit('hidefullwidthlabel');

        this.initNestedControls();
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
