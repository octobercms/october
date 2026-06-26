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
            bottomBorderHidden: false,
            externalParamEditorVisible: false,
            externalParamValue: ''
        };
    },
    computed: {
        titlePanelStyle: function computeTitlePanelStyle() {
            var result = {},
                sizePx = this.splitterData.position + 'px';

            result['width'] = sizePx;

            return result;
        },

        isVisible: function computeIsVisible() {
            if (!this.control.visibility) {
                return true;
            }

            const visibility = this.control.visibility;

            if (typeof visibility === 'function') {
                return visibility(this.obj);
            }

            const sourceValue = utils.getProperty(this.obj, visibility.source_property);

            let visible;
            if (visibility.value !== '--any--') {
                if (Array.isArray(visibility.value)) {
                    visible = visibility.value.includes(sourceValue);
                }
                else {
                    visible = sourceValue == visibility.value;
                }
            }
            else {
                visible = !utils.isValueEmpty(sourceValue);
            }

            return visibility.inverse ? !visible : visible;
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
        },

        showExternalParamEditor: function computeShowExternalParamEditor() {
            if (!this.inspectorPreferences || !this.inspectorPreferences.enableExternalParameterEditor) {
                return false;
            }

            var unsupportedTypes = ['object', 'objectList', 'objectListRecords', 'dictionary', 'set', 'table', 'stringList', 'stringListAutocomplete'];
            if (unsupportedTypes.indexOf(this.control.type) !== -1) {
                return false;
            }

            return this.control.showExternalParam !== false;
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
        },

        toggleExternalParamEditor: function toggleExternalParamEditor() {
            if (!this.externalParamEditorVisible) {
                // Entering external param mode
                this.externalParamEditorVisible = true;
                this.syncExternalParamToObj();

                Vue.nextTick(() => {
                    if (this.$refs.externalParamInput) {
                        this.$refs.externalParamInput.focus();
                    }
                });
            }
            else {
                // Leaving external param mode
                this.externalParamEditorVisible = false;

                // Clear the {{ }} value from obj so the normal editor gets a clean value
                var currentVal = utils.getProperty(this.obj, this.control.property);
                if (typeof currentVal === 'string' && currentVal.match(/^\{\{.*\}\}$/)) {
                    utils.setProperty(this.obj, this.control.property, this.control.default !== undefined ? this.control.default : '');
                }

                if (this.$refs.editor) {
                    this.$refs.editor.refreshDisplayedValue();
                }
            }
        },

        syncExternalParamToObj: function syncExternalParamToObj() {
            var value = this.externalParamValue.trim();
            if (value.length > 0) {
                utils.setProperty(this.obj, this.control.property, '{{ ' + value + ' }}');
            }
        },

        onExternalParamInput: function onExternalParamInput(ev) {
            this.externalParamValue = ev.target.value;
            this.syncExternalParamToObj();
        },

        onExternalParamFocus: function onExternalParamFocus() {
            this.onEditorFocus();
        },

        onExternalParamBlur: function onExternalParamBlur() {
            this.onEditorBlur();
        }
    },
    watch: {
        isVisible: {
            immediate: true,
            handler: function onVisibilityChange(visible) {
                if (visible) {
                    const currentValue = utils.getProperty(this.obj, this.control.property);
                    if (currentValue === null) {
                        utils.setProperty(this.obj, this.control.property, this.control.default);
                        if (this.$refs.editor) {
                            this.$refs.editor.refreshDisplayedValue();
                        }
                    }

                    if (this.control.type === 'string' && !this.control.no_focus_on_visible) {
                        Vue.nextTick(() => {
                            if (this.$refs.editor) {
                                this.$refs.editor.focusControl();
                            }
                        });
                    }
                }
                else {
                    utils.setProperty(this.obj, this.control.property, null);
                }
            }
        }
    },
    created: function created() {
    },
    mounted: function mounted() {
        if (this.showExternalParamEditor) {
            var value = utils.getProperty(this.obj, this.control.property);
            if (typeof value === 'string') {
                var matches = value.match(/^\{\{\s*([^\}]+?)\s*\}\}$/);
                if (matches) {
                    this.externalParamValue = matches[1];
                    this.externalParamEditorVisible = true;
                }
            }
        }
    }
};
