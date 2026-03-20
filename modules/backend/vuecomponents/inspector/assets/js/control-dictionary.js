import { ControlBase } from './classes/index.js';

/*
 * Vue Inspector dictionary control implementation
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
            initialValue = {
                tableData: []
            };

        if (typeof value === 'object') {
            for (var prop in value) {
                if (!value.hasOwnProperty(prop)) {
                    continue;
                }

                initialValue.tableData.push({
                    key: prop,
                    value: value[prop]
                });
            }
        }

        return {
            editedObject: initialValue,
            lang: {},
            nestedControlProperties: []
        };
    },
    computed: {
        groupValue: function computeGroupValue() {
            var value = this.computeValue();

            if (typeof value !== 'object') {
                return '';
            }

            var itemNumber = Object.keys(value).length;
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

            var storedValue = {};

            if (Array.isArray(value.tableData)) {
                value.tableData.forEach(function (tableItem) {
                    if (typeof tableItem.key === 'string') {
                        var key = tableItem.key.trim(),
                            value = tableItem.value;

                        if (typeof value !== 'string') {
                            value = '';
                        }

                        if (key.length === 0) {
                            return;
                        }

                        storedValue[key] = value.trim();
                    }
                })
            }

            this.setManagedValue(storedValue);
        },

        initNestedControls: function initNestedControls() {
            this.nestedControlProperties = [
                {
                    type: 'table',
                    property: 'tableData',
                    columns: [
                        {
                            'column': 'key',
                            'type': 'string',
                            'title': 'Key',
                            "validation": {
                                "required": {
                                    "message": this.lang.keyRequired
                                }
                            }
                        },
                        {
                            'column': 'value',
                            'type': 'string',
                            'title': 'Value',
                            "validation": {
                                "required": {
                                    "message": this.lang.valueRequired
                                }
                            }
                        }
                    ]
                }
            ];
        },

        getDefaultValue: function getDefaultValue() {
            return {};
        },

        focusControl: function focusControl() {
            // TODO
        }
    },
    created: function created() {

    },
    mounted: function mounted() {
        this.$emit('hidefullwidthlabel');
        // this.$emit('hidebottomborder');

        this.lang.keyRequired = this.$el.getAttribute('data-lang-key-required');
        this.lang.valueRequired = this.$el.getAttribute('data-lang-value-required');
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
