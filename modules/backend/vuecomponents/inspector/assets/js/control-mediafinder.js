import { ControlBase, utils } from './classes/index.js';

/*
 * Vue Inspector media finder control implementation
 */
export default {
    extends: ControlBase,
    props: {
        splitterData: {
            type: Object,
            required: true
        },
        panelUpdateData: {
            type: Object,
            required: true
        },
        layoutUpdateData: {
            type: Object
        }
    },
    data: function () {
        return {
            lang: {}
        };
    },
    computed: {
        cssClass: function computeCssClass() {
            return {
                'placeholder': utils.isValueEmpty(this.value)
            };
        },

        displayedText: function computeDisplayedText() {
            if (utils.isValueEmpty(this.value)) {
                return this.control.placeholder ? this.control.placeholder : this.lang.placeholder;
            }

            return this.value;
        }
    },
    methods: {
        updateValue: function updateValue(value) {
            this.setManagedValue(value);
        },

        focusControl: function focusControl() {
            this.$refs.input.focus();
        },

        onInspectorLabelClick: function onInspectorLabelClick() {
            this.onClick();
        },

        onFocus: function onFocus() {
            this.$emit('focus', { target: this.$refs.input });
        },

        onBlur: function onBlur() {
            this.$emit('blur', { target: this.$refs.input });
        },

        onClearClick: function onClearClick() {
            if (this.inspectorPreferences.readOnly) {
                return;
            }

            this.updateValue(null);
        },

        onKeyDown: function onKeyDown(ev) {
            if (ev.keyCode == 27 || ev.keyCode == 13) {
                this.onClick();
            }

            if (ev.keyCode == 8) {
                this.onClearClick();
            }
        },

        onClick: function onClick() {
            if (this.inspectorPreferences.readOnly) {
                return;
            }

            var that = this,
                mediaType = that.control.mediaType;

            if (this.layoutUpdateData) {
                // Vue 3: Direct assignment is reactive
                this.layoutUpdateData.modalTemporaryHidden = true;
            }

            new oc.mediaManager.popup({
                alias: 'ocmediamanager',
                cropAndInsertButton: true,
                onClose: function () {
                    if (that.layoutUpdateData) {
                        // Vue 3: Direct assignment is reactive
                        that.layoutUpdateData.modalTemporaryHidden = false;
                    }
                },
                onInsert: function (items) {
                    if (!items.length) {
                        oc.alert($.oc.lang.get('mediamanager.invalid_file_empty_insert'))
                        return
                    }

                    if (items.length > 1) {
                        oc.alert($.oc.lang.get('mediamanager.invalid_file_single_insert'))
                        return
                    }

                    if (mediaType === 'image' && items[0].documentType !== 'image') {
                        oc.alert(
                            $.oc.lang.get(
                                'mediamanager.invalid_image_invalid_insert',
                                that.lang.errorNotImage
                            )
                        );
                        return;
                    }

                    that.updateValue(items[0].path);
                    this.hide();
                    that.$refs.input.focus();
                }
            });
        }
    },
    watch: {
    },
    mounted: function mounted() {
        // Vue 3: Direct assignment is reactive
        this.lang.errorNotImage = this.$el.getAttribute('data-lang-error-not-image');
        this.lang.placeholder = this.$el.getAttribute('data-lang-placeholder');
    }
};
