/*
 * Vue modal confirmation implementation
 */
import alert from './alert.js';

export default {
    extends: alert,
    props: {
        isDanger: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onButtonClick: function onButtonClick() {
            this.$emit('buttonclick');
            this.$refs.modal.hide();
        }
    }
};
