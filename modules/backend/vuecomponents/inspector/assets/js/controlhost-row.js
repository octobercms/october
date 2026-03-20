import { utils } from './classes/index.js';

/*
 * Vue Inspector control host row implementation
 */
export default {
    props: {
        obj: {
            type: [Object, Array],
            required: true
        },
        parentObj: {
            type: Object,
            required: false
        },
        control: {
            type: Object,
            required: true
        },
        splitterData: {
            type: Object,
            required: true
        },
        depth: {
            type: Number,
            required: true
        },
        panelUpdateData: {
            type: Object,
            required: true
        },
        controlHostUniqueId: {
            type: String,
            required: true
        },
        layoutUpdateData: {
            type: Object
        },
        inspectorPreferences: {
            type: Object
        },
        isFullWidth: {
            type: Boolean
        },
        inspectorUniqueId: {
            type: String,
            required: true
        }
    },
    data: function () {
        return {
            hasErrors: false,
            controlLabelHidden: false,
            bottomBorderHidden: false
        };
    },
    computed: {
        titlePanelStyle: function computeTitlePanelStyle() {
            var result = {},
                sizePx = this.splitterData.position + 'px';

            result['width'] = sizePx;

            return result;
        },

        rowVisible: function computeRowVisible() {
            if (!this.control.visibility) {
                return true;
            }

            const visibility = this.control.visibility;
            const sourceValue = utils.getProperty(this.obj, visibility.source_property);

            let visible = true;
            if (typeof visibility === 'function') {
                visible = visibility(this.obj);
            }
            else {
                if (visibility.value !== '--any--') {
                    if (Array.isArray(visibility.value)) {
                        visible = visibility.value.includes(sourceValue)
                    }
                    else {
                        visible = sourceValue == visibility.value;
                    }
                }
                else {
                    visible = !utils.isValueEmpty(sourceValue);
                }

                if (visibility.inverse) {
                    visible = !visible;
                }
            }


            if (visible) {
                const currentValue = utils.getProperty(this.obj, this.control.property);
                if (currentValue === null) {
                    utils.setProperty(this.obj, this.control.property, this.control.default);
                    this.$refs.editor.refreshDisplayedValue();
                }

                if (this.control.type === 'string' && !this.control.no_focus_on_visible) {
                    Vue.nextTick(() => {
                        this.$refs.editor.focusControl();
                    });
                }
            }
            else {
                utils.setProperty(this.obj, this.control.property, null);
            }

            return visible;
        },

        controlColspan: function computeControlColspan() {
            return this.isFullWidth || this.controlLabelHidden ? 2 : 1;
        },

        labelStyle: function computeLabelStyle() {
            if (!this.depth) {
                return {};
            }

            return {
                'margin-left': (this.depth * 10) + 'px'
            };
        },

        controlEditorId: function computeControlEditorId() {
            return this.controlHostUniqueId + this.control.property;
        }
    },
    methods: {
        onEditorFocus: function onEditorFocus() {
            $(this.$el).closest('.component-backend-inspector-panel').find('tr.inspector-control-row').removeClass('focused');
            $(this.$el).addClass('focused');
        },

        onEditorBlur: function onEditorBlur() {
            $(this.$el).removeClass('focused');
        },

        onLabelClick: function onLabelClick() {
            if (this.$refs.editor.onInspectorLabelClick !== undefined) {
                this.$refs.editor.onInspectorLabelClick();
            }
        },

        onEditorInvalid: function onEditorInvalid() {
            this.hasErrors = true;
        },

        onEditorValid: function onEditorValid() {
            this.hasErrors = false;
        }
    },
    created: function created() {
    }
};
