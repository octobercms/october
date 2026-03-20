import { ControlBase, utils } from './classes/index.js';

/*
 * Vue Inspector object list records control implementation
 */
export default {
    extends: ControlBase,
    props: {
        obj: {
            type: [Object, Array],
            required: true
        },
        parentObj: {
            type: Object,
            required: false
        },
        layoutUpdateData: {
            type: Object
        },
        inspectorPreferences: Object
    },
    data: function () {
        return {
            lang: {
                addItem: ""
            }
        };
    },
    computed: {
        hasValues: function computeHasValues() {
            return !utils.isValueEmpty(this.obj);
        },

        displayAddItem: function computeDisplayAddItem() {
            if (!this.control.parentControl.maxItems) {
                return true;
            }

            const itemCount = Array.isArray(this.obj) ? this.obj.length : Object.keys(this.obj).length;
            return itemCount < this.control.parentControl.maxItems;
        }
    },
    methods: {
        onRemoveItemClick: function onRemoveItemClick(index) {
            if (Array.isArray(this.obj)) {
                this.obj.splice(index, 1);
            }
            else {
                // Vue 3: Use delete operator
                delete this.obj[index];
            }
        },

        onAddItemClick: function onAddItemClick() {
            if (this.inspectorPreferences.readOnly || !this.displayAddItem) {
                return;
            }

            this.$emit('inspectorcommand', {
                command: 'addItem'
            });
        },

        onItemClick: function onItemClick(key) {
            if (this.inspectorPreferences.readOnly) {
                return;
            }

            this.$emit('inspectorcommand', {
                command: 'editItem',
                key: key
            });
        }
    },
    mounted: function mounted() {
        this.$emit('hidefullwidthlabel');
        this.$emit('hidebottomborder');
        this.lang.addItem = this.$el.getAttribute('data-lang-add-item');
    }
};
