import { TableControlBase } from './classes/index.js';

/*
 * Vue Inspector table text control implementation
 */
export default {
    extends: TableControlBase,
    props: {
    },
    data: function () {
        return {
        };
    },
    computed: {
    },
    methods: {
        focusControl: function focusControl() {
            this.$refs.input.focus();
        }
    }
};
