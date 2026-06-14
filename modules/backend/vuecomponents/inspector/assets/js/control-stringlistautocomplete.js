import { ControlBase, utils } from './classes/index.js';

/*
 * Vue Inspector stringListAutocomplete control implementation.
 * Displays an array of strings with autocomplete suggestions per row.
 * Opens a modal with a table of inputs for editing.
 */
export default {
    extends: ControlBase,
    props: {
        splitterData: {
            type: Object,
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
            popupVisible: false,
            rows: [],
            autocompleteItems: null
        };
    },
    computed: {
        displayText: function computeDisplayText() {
            var value = this.value;
            if (!Array.isArray(value) || value.length === 0) {
                return this.control.placeholder || '[]';
            }

            return '[' + value.join(', ') + ']';
        },

        isPlaceholder: function computeIsPlaceholder() {
            var value = this.value;
            return !Array.isArray(value) || value.length === 0;
        },

        resolvedItems: function computeResolvedItems() {
            if (this.autocompleteItems !== null) {
                return this.autocompleteItems;
            }

            var items = this.control.items;
            if (!items) {
                return [];
            }

            if (Array.isArray(items)) {
                return items;
            }

            // Convert object { key: label } to array of strings
            var result = [];
            for (var key in items) {
                result.push(items[key]);
            }
            return result;
        }
    },
    methods: {
        getDefaultValue: function getDefaultValue() {
            return [];
        },

        openPopup: function openPopup() {
            if (this.inspectorPreferences.readOnly) {
                return;
            }

            var value = this.value;
            this.rows = [];

            if (Array.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                    this.rows.push({ value: value[i] });
                }
            }

            if (this.rows.length === 0) {
                this.rows.push({ value: '' });
            }

            this.popupVisible = true;

            // Load dynamic autocomplete items if no static items
            if (!this.control.items) {
                this.loadDynamicOptions();
            }

            this.$nextTick(() => {
                this.$refs.popupModal.show();
                this.$nextTick(() => {
                    this.focusRow(0);
                });
            });
        },

        dynamicOptionsLoaded: function dynamicOptionsLoaded(data) {
            this.autocompleteItems = [];
            if (data.options) {
                for (var i = 0; i < data.options.length; i++) {
                    this.autocompleteItems.push(data.options[i].title || data.options[i].value);
                }
            }
        },

        applyPopup: function applyPopup() {
            var result = [];

            for (var i = 0; i < this.rows.length; i++) {
                var val = this.rows[i].value.trim();
                if (val.length > 0) {
                    result.push(val);
                }
            }

            this.setManagedValue(result);
            this.$refs.popupModal.hide();
        },

        cancelPopup: function cancelPopup() {
            if (this.$refs.popupModal) {
                this.$refs.popupModal.hide();
            }
        },

        onPopupHidden: function onPopupHidden() {
            this.popupVisible = false;
        },

        addRow: function addRow() {
            this.rows.push({ value: '' });
            this.$nextTick(() => {
                this.focusRow(this.rows.length - 1);
            });
        },

        removeRow: function removeRow(index) {
            this.rows.splice(index, 1);

            if (this.rows.length === 0) {
                this.rows.push({ value: '' });
            }

            this.$nextTick(() => {
                var focusIndex = Math.min(index, this.rows.length - 1);
                this.focusRow(focusIndex);
            });
        },

        onRowInput: function onRowInput(index, ev) {
            this.rows[index].value = ev.target.value;
        },

        onRowKeydown: function onRowKeydown(index, ev) {
            ev.stopPropagation();

            if (ev.key === 'ArrowDown' && index < this.rows.length - 1) {
                ev.preventDefault();
                this.focusRow(index + 1);
            }
            else if (ev.key === 'ArrowUp' && index > 0) {
                ev.preventDefault();
                this.focusRow(index - 1);
            }
            else if (ev.key === 'Enter') {
                ev.preventDefault();
                this.addRow();
            }
        },

        focusRow: function focusRow(index) {
            var inputs = this.$refs.rowInputs;
            if (inputs && inputs[index]) {
                inputs[index].focus();
            }
        },

        focusControl: function focusControl() {
            if (this.$refs.link) {
                this.$refs.link.focus();
            }
        },

        getFilteredItems: function getFilteredItems(query) {
            if (!query || query.length === 0) {
                return this.resolvedItems;
            }

            var lowerQuery = query.toLowerCase();
            return this.resolvedItems.filter(function(item) {
                return item.toLowerCase().indexOf(lowerQuery) !== -1;
            });
        }
    }
};
