import { ControlBase, utils } from './classes/index.js';

/*
 * Vue Inspector text control implementation
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
            edited: false
        };
    },
    computed: {
        presetValue: function computePresetValue() {
            if (!this.control.preset || this.edited) {
                return undefined;
            }

            var sourceValue = utils.getProperty(this.obj, this.control.preset.property);

            if (sourceValue === undefined || sourceValue === null) {
                sourceValue = '';
            }

            return oc.InputPresetEngine.formatValue(
                {
                    inputPresetType: this.control.preset.type,
                    inputPresetRemoveWords:
                        this.control.preset.removeWords === undefined ? true : this.control.preset.removeWords
                },
                sourceValue
            );
        },

        valueWithPreset: function computeValueWithPreset() {
            var value = this.value,
                presetValue = this.presetValue;

            return presetValue !== undefined ? presetValue : value;
        },

        cssClass: function computeCssClass() {
            if (this.control.type != 'text') {
                return {};
            }

            return {
                'size-small': this.control.size === undefined || this.control.size == 'small',
                'size-medium': this.control.size == 'medium',
                'size-large': this.control.size == 'large'
            };
        }
    },
    methods: {
        updateValue: function updateValue() {
            this.edited = true;
            this.setManagedValue(this.$refs.input.value);
            this.updateTextareaHeight();
        },

        updateTextareaHeight: function updateHeight() {
            if (this.control.type != 'text') {
                return;
            }

            var that = this;
            Vue.nextTick(function () {
                var $shadow = $(that.$refs.textareaShadow),
                    $input = $(that.$refs.input);

                $shadow.width($input.width());
                $input.height($shadow.height());
            });
        },

        focusControl: function focusControl() {
            this.$refs.input.focus();
        }
    },
    created: function created() {
        if (this.value !== undefined && this.value != this.control.default) {
            this.edited = true;
        }
    },
    mounted: function mounted() {
        this.updateTextareaHeight();
    },
    watch: {
        'splitterData.position': function onSplitterPositionChanged() {
            this.updateTextareaHeight();
        },
        'panelUpdateData.tabChanged': function onPanelTabChanged() {
            this.updateTextareaHeight();
        },
        valueWithPreset: function onValueWithPresetChanged() {
            this.updateTextareaHeight();
        },
        presetValue: function onPresetValueChanged(value) {
            if (value !== undefined) {
                Vue.nextTick(() => {
                    this.setManagedValue(this.$refs.input.value);
                });
            }
        },
        'layoutUpdateData.updateValue': function onLayoutUpdateValueChanged() {
            this.updateTextareaHeight();
        },
        'layoutUpdateData.modalShown': function onModalShown() {
            if (this.control.defaultFocus) {
                // Focus after visbility animations are ready
                var self = this;
                setTimeout(function () {
                    self.focusControl();
                }, 100);
            }
        }
    }
};
