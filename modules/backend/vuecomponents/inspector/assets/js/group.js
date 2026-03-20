/*
 * Vue Inspector control group implementation
 */
export default {
    props: {
        controls: {
            type: Array,
            required: true
        },
        obj: {
            type: [Object, Array],
            required: true
        },
        parentObj: {
            type: Object,
            required: false
        },
        splitterData: {
            type: Object,
            required: true
        },
        groupName: {
            type: String,
            required: true
        },
        inspectorUniqueId: {
            type: String,
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
        layoutUpdateData: {
            type: Object
        },
        inspectorPreferences: {
            type: Object
        },
        loading: {
            type: Boolean
        },
        groupValue: String,
        hideBottomBorder: Boolean
    },
    data: function () {
        return {
            expanded: true,
            hasErrors: false
        };
    },
    computed: {
        expandStatusStorageKey: function computeExpandStatusStorageKey() {
            return this.inspectorUniqueId + '-group-status-' + $.oc.vueUtils.stringHashCode(this.groupName);
        },

        nameAndValue: function computeNameAndValue() {
            if (typeof this.groupValue !== 'string') {
                return this.groupName;
            }

            return this.groupName + ' ' + this.groupValue;
        },

        nameStyle: function computeNameStyle() {
            if (!this.depth) {
                return {};
            }

            return {
                'margin-left': (this.depth * 10) + 'px'
            };
        }
    },
    methods: {
        onToggleGroup: function onToggleGroup() {
            this.expanded = !this.expanded;

            if (this.expanded) {
                localStorage.setItem(this.expandStatusStorageKey, '1');
            }
            else {
                localStorage.removeItem(this.expandStatusStorageKey);
            }
        },

        expandInspectorControl: function expandInspectorControl() {
            if (!this.expanded) {
                this.onToggleGroup();
            }
        },

        setHasValidationErrors: function setHasValidationErrors(value) {
            this.hasErrors = value;
        }
    },
    mounted: function onMounted() {
        this.expanded = localStorage.getItem(this.expandStatusStorageKey) == '1';
    },
    created: function created() {
    }
};
