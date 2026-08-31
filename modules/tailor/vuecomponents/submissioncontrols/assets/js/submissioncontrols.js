import DomTools from '../../../publishingcontrols/assets/js/domtools.js';

/*
 * Tailor submission entry controls Vue component
 */
export default {
    props: {
        modelName: {
            type: String,
            default: "EntryRecord"
        },
        entryState: Object
    },
    data: function () {
        return {
            state: {
                saved: {},
                current: {}
            }
        };
    },
    computed: {
        hasStateChanged() {
            return JSON.stringify(this.state.saved) != JSON.stringify(this.state.current);
        },

        canPublish() {
            return this.entryState.initial.canPublish;
        },

        canDelete() {
            return this.entryState.initial.canDelete;
        },

        isRejected() {
            return this.entryState.initial.isDeleted;
        }
    },
    methods: {
        show(target) {
            this.$refs.popover.show(target);
        },

        hide() {
            this.$refs.popover.hide();
        },

        getStateFromDom() {
            let result = {};

            let enabledFormGroup = this.domTools.findFormGroup('is_enabled');
            if (enabledFormGroup) {
                result.enabled = enabledFormGroup.find('input[type=checkbox]').is(':checked');
            }

            return result;
        },

        synchStateFromDom(isInit) {
            let state = this.getStateFromDom();

            if (isInit) {
                this.state.saved = $.oc.vueUtils.getCleanObject(state);
            }

            this.state.current = $.oc.vueUtils.getCleanObject(state);
        },

        updateSavedState() {
            this.state.saved = $.oc.vueUtils.getCleanObject(this.getStateFromDom());
        }
    },
    mounted: function onMounted() {
        Vue.nextTick(() => {
            this.domTools = DomTools.newDomTools();
            this.domTools.setForm(this.$el.closest('form'), this.modelName);

            let enabledFormGroup = this.domTools.findFormGroup('is_enabled');
            if (enabledFormGroup) {
                $(this.$refs.enabled).append(enabledFormGroup);
                enabledFormGroup.find('input[type=checkbox]').on('change', _ => this.synchStateFromDom());
            }

            this.synchStateFromDom(true);
        });
    },
    watch: {
        hasStateChanged(newValue) {
            this.$emit('statechanged', newValue);
        }
    }
};
