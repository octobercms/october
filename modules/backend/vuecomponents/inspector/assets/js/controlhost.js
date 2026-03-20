import { utils } from './classes/index.js';

/*
 * Vue Inspector control host implementation
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
        inspectorUniqueId: {
            type: String,
            required: true
        },
        inspectorPreferences: {
            type: Object
        }
    },
    data: function () {
        return {
            uniqueId: $.oc.domIdManager.generate('inspector-control-host'),
            containerSize: 0,
            draggedHandle: null,
            fullWidthControls: [
                'table',
                'object',
                'objectList',
                'objectListRecords',
                'set',
                'dictionary'
            ]
        };
    },
    computed: {
    },
    methods: {
        isFullWidthControl: function isFullWidthControl(control) {
            return this.fullWidthControls.indexOf(control.type) !== -1;
        },

        onHandleMouseDown: function onHandleMouseDown(ev) {
            if (!$(ev.target).hasClass('inspector-drag-handle')) {
                return;
            }

            this.draggedHandle = ev.target;
            this.containerSize = $(this.$el).width();
            $(document.body).addClass('splitter-dragging-vertical');

            document.addEventListener('mousemove', this.onMouseMove, { passive: true });
            document.addEventListener('mouseup', this.onMouseUp);
        },

        onMouseMove: function onMouseMove(ev) {
            if (ev.buttons != 1) {
                // Handle the case when the button was released
                // outside of the viewport. mouseup doesn't fire
                // in that case.
                //
                this.onMouseUp();
            }

            var handlePos = $(this.draggedHandle).offset(),
                delta = ev.pageX - handlePos.left,
                minSize = this.splitterData.minSize;

            if (delta <= 0) {
                this.splitterData.position = Math.max(this.splitterData.position + delta, minSize);
            }
            else {
                this.splitterData.position = Math.min(this.splitterData.position + delta, this.containerSize - minSize);
            }
        },

        onMouseUp: function onMouseUp() {
            this.draggedHandle = null;

            document.removeEventListener('mousemove', this.onMouseMove, { passive: true });
            document.removeEventListener('mouseup', this.onMouseUp);

            $(document.body).removeClass('splitter-dragging-vertical');

            var storageKey = utils.getLocalStorageKey(this, 'splitter');
            localStorage.setItem(storageKey, Math.round(this.splitterData.position));
        }
    },
    created: function created() {
    }
};
