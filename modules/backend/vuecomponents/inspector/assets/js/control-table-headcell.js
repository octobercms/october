/*
 * Vue Inspector table control implementation
 */
export default {
    props: {
        column: Object,
        columnIndex: Number,
        columnWidth: Object
    },
    data: function () {
        return {
        };
    },
    computed: {
        cellStyle: function computeCellStyle() {
            if (this.columnWidth[this.columnIndex] === undefined) {
                return {};
            }

            return {
                width: this.columnWidth[this.columnIndex] + 'px'
            }
        }
    },
    methods: {
    }
};
