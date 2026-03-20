/*
 * Vue modal host implementation
 */
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
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
        },
        dataSchema: {
            type: Array,
            required: true
        },
        liveMode: {
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            required: true
        },
        uniqueId: {
            type: String,
            required: true
        },
        handlerAlias: {
            type: String,
            required: false
        },
        resizableWidth: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            modalTitleId: $.oc.domIdManager.generate('modal-inspector-title'),
            primaryButtonText: '',
            layoutUpdateData: {
                updateValue: 0,
                modalShown: 0,
                modalTemporaryHidden: false
            },
            readOnly: false
        };
    },
    computed: {},
    methods: {
        applyAndClose: function emitApplyAndClose() {
            this.$refs.inspector.applyChanges();
            this.$emit('applyclick');
            this.$refs.modal.hide();
        },

        onHidden: function onHidden() {
            this.$emit('close');
        },

        onApplyClick: function onApplyClick() {
            if (this.readOnly) {
                return;
            }

            var inspector = this.$refs.inspector,
                that = this;

            that.readOnly = true;

            this.$refs.inspector.validate().then(
                function validateResolve() {
                    var beforeApplyCallbackHolder = {};
                    that.$emit('beforeapply', beforeApplyCallbackHolder);

                    if (beforeApplyCallbackHolder.callback) {
                        var beforeApplyPromise = beforeApplyCallbackHolder.callback(inspector.getCleanObject());
                        if (typeof beforeApplyPromise !== 'object') {
                            throw new Error('The beforeapply callback must return a promise');
                        }

                        if (typeof beforeApplyPromise.then !== 'function') {
                            throw new Error('The beforeapply callback must return a promise');
                        }

                        beforeApplyPromise.then(
                            function beforeApplyPromiseResolve(result) {
                                if (result !== false) {
                                    that.applyAndClose();
                                }
                                that.readOnly = false;
                            },
                            function beforeApplyPromiseReject() {
                                that.readOnly = false;
                            }
                        );
                    }
                    else {
                        that.readOnly = false;
                        that.applyAndClose();
                    }
                },
                function validateReject() {
                    that.readOnly = false;
                }
            );
        },

        onCloseClick: function onCloseClick() {
            if (this.readOnly) {
                return;
            }

            this.$refs.modal.hide();
        },

        onCancelClick: function onCancelClick() {
            if (this.liveMode) {
                this.$refs.inspector.revertChanges();
            }

            this.onCloseClick();
        },

        onResized: function onResized() {
            this.layoutUpdateData.updateValue++;
        },

        onShown: function onShown() {
            this.$refs.inspector.onModalShown();
        },

        onEnterKey: function onEnterKey(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            this.onApplyClick();
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
    }
};
