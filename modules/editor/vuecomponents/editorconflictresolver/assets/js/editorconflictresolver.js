export default {
    props: {},
    data: function() {
        return {
            uniqueKey: $.oc.domIdManager.generate('modal-alert'),
            modalTitleId: $.oc.domIdManager.generate('modal-title'),
            actionSelected: false,
            resolve: null,
            reject: null
        };
    },
    computed: {},
    methods: {
        requestResolution: function requestResolution() {
            var that = this;

            this.actionSelected = false;
            return new Promise(function(resolve, reject) {
                that.resolve = resolve;
                that.reject = reject;
                that.$refs.modal.show();
            });
        },

        onHidden: function onHidden() {
            if (this.reject && !this.actionSelected) {
                this.reject(false);
            }

            this.resolve = null;
            this.reject = null;
        },

        onReloadClick: function onReloadClick() {
            this.actionSelected = true;
            this.$refs.modal.hide();
            this.resolve('reload');
        },

        onSaveClick: function onSaveClick() {
            this.actionSelected = true;
            this.$refs.modal.hide();
            this.resolve('save');
        }
    }
};
