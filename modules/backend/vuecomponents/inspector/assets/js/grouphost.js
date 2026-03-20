import { utils } from './classes/index.js';

/*
 * Vue Inspector group host implementation
 */
export default {
    props: {
        controls: {
            type: Array,
            required: true
        },
        obj: {
            type: Object,
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
        }
    },
    data: function () {
        return {
        };
    },
    computed: {
        groupedControls: function computeGroupedUntabbedControls() {
            return utils.groupControls(this.controls);
        }
    },
    methods: {
    }
};
