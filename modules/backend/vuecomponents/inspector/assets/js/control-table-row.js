/*
 * Vue Inspector table control implementation
 */
export default {
    props: {
        columns: Array,
        row: Object,
        inspectorPreferences: Object,
        tableConfiguration: Object,
        rowIndex: Number
    },
    data: function () {
        return {
            focused: false,
            isTableRow: true,
            hasErrors: false,
            cellRefs: []
        };
    },
    computed: {
    },
    methods: {
        setCellRef: function setCellRef(el, index) {
            this.cellRefs[index] = el;
        },

        focusFirst: function focusFirst() {
            var cells = this.cellRefs.filter(function(cell) { return cell != null; });
            if (cells.length) {
                cells[0].focusControl();
            }
        },

        onCellFocus: function onCellFocus() {
            this.focused = true;
        },

        onCellBlur: function onCellBlur() {
            this.focused = false;
        },

        onValid: function onValid() {
            this.hasErrors = false;
        },

        onInvalid: function onInvalid() {
            this.hasErrors = true;
        }
    }
};
