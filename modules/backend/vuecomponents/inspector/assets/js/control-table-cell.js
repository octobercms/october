/*
 * Vue Inspector table control implementation
 */
export default {
    props: {
        row: Object,
        column: Object,
        cellIndex: Number,
        inspectorPreferences: Object,
        tableConfiguration: Object,
        isLastCell: Boolean
    },
    data: function () {
        return {
        };
    },
    computed: {
    },
    methods: {
        focusControl: function focusControl() {
            this.$refs.editor.focusControl();
        }
    }
};
