/*
 * Vue basic modal implementation
 */
import alert from './alert.js';

export default {
    extends: alert,
    methods: {
        onCloseClick: function onCloseClick() {
            this.$refs.modal.hide();
        },
        onClick: function onClick(ev) {
            if (!ev.target.dataset.closePopup) {
                return;
            }

            this.$emit('closeclick', ev.target.dataset.closePopup);
            this.$refs.modal.hide();
        }
    }
};
