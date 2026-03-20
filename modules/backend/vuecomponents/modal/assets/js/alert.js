/*
 * Vue modal alert implementation
 */
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        buttonText: {
            type: String,
            required: false
        },
        size: {
            type: String,
            default: 'normal',
            validator: function (value) {
                return ['small', 'normal', 'large'].indexOf(value) !== -1;
            }
        }
    },
    data: function () {
        return {
            uniqueKey: $.oc.domIdManager.generate('modal-alert'),
            modalTitleId: $.oc.domIdManager.generate('modal-alert-title'),
            primaryButtonText: ""
        };
    },
    computed: {
    },
    methods: {
        onHidden: function onHidden() {
            this.$emit('close');
        }
    },
    mounted: function onMounted() {
        if (this.buttonText) {
            this.primaryButtonText = this.buttonText;
        }
        else {
            this.primaryButtonText = $(this.$el).attr('data-default-button-text');
        }

        this.$refs.modal.show();
    },
    beforeUnmount: function beforeUnmount() {
    }
};
