import { ControlBase } from './classes/index.js';

/*
 * Vue Inspector checkbox control implementation
 */
export default {
    extends: ControlBase,
    props: {
    },
    data: function () {
        return {};
    },
    computed: {
        isChecked: function () {
            var value = this.value;

            if (value == '0' || value == 'false') {
                return false;
            }

            return value;
        }
    },
    methods: {
        updateValue: function updateValue() {
            var value = this.$refs.input.checked ? 1 : 0;

            this.setManagedValue(value);
        },

        onLabelKeydown: function onLabelKeydown(ev) {
            if (ev.keyCode == 32) {
                this.$refs.input.checked = !this.$refs.input.checked;
                ev.stopPropagation();
                ev.preventDefault();
            }
        }
    }
};
