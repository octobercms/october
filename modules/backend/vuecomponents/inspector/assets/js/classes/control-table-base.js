import ValidatorSet from './validatorset.js';

export const TableControlBase = {
    props: {
        row: Object,
        column: Object,
        cellIndex: Number,
        inspectorPreferences: Object
    },
    methods: {
        focusControl: function focusControl() {
        },

        validatePropertyValue: function validate() {
            var validatorSet = new ValidatorSet(
                    this.column,
                    this.column.column
                ),
                result = validatorSet.validate(this.row[this.column.column]);

            if (result !== null) {
                this.$emit('invalid');
            }
            else {
                this.$emit('valid');
            }

            return result;
        },
    }
};

export default TableControlBase;
