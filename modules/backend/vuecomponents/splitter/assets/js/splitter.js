/*
 * Vue splitter implementation
 */
export default {
    props: {
        direction: {
            type: String,
            default: 'vertical',
            validator: function (value) {
                if (['vertical', 'horizontal'].indexOf(value) === -1) {
                    return false;
                }

                return true;
            }
        },
        minSize: {
            type: Number,
            default: 100
        },
        defaultSize: {
            type: Number,
            default: 100
        },
        fullHeight: {
            type: Boolean,
            default: true
        },
        uniqueKey: {
            type: String,
            required: true
        },
        value: {
            // If the splitter size is provided as an
            // external property, the component doesn't
            // save its size and doesn't use the default
            // size property.
            //
            type: Number
        }
    },
    data: function () {
        return {
            size: 100,
            containerSize: 0,
            dragging: false
        };
    },
    computed: {
        firstPanelStyle: function computeFirstPanelStyle() {
            var result = {},
                prop = this.direction == 'vertical' ? 'width' : 'height';

            result[prop] = this.size + 'px';

            return result;
        },

        cssClass: function computeCssClass() {
            var result = {};

            result['full-height-strict'] = this.fullHeight;
            result['flex-layout-row'] = this.direction == 'vertical';
            result['flex-layout-column'] = this.direction == 'horizontal';

            return result;
        },

        storageKey: function computeStorageKey() {
            return this.uniqueKey + '-splitter';
        }
    },
    methods: {
        saveSize: function saveSize() {
            if (this.value !== undefined) {
                return;
            }

            localStorage.setItem(this.storageKey + '-size', !isNaN(this.size) ? this.size : this.defaultSize);
        },

        applyMinSize: function applyMinSize() {
            var containerSize = 0;

            if (this.direction == 'vertical') {
                containerSize = $(this.$el).width();
            }
            else {
                containerSize = $(this.$el).height();
            }

            if (!containerSize) {
                return;
            }

            this.size = Math.max(this.size, this.minSize);
            this.size = Math.min(this.size, containerSize - this.minSize);
            this.saveSize();
        },

        onMouseMove: function onMouseMove(ev) {
            if (ev.buttons != 1) {
                // Handle the case when the button was released
                // outside of the viewport. mouseup doesn't fire
                // in that case.
                //
                this.onMouseUp();
            }

            var handlePos = $(this.$refs.handle).offset(),
                delta = 0;

            if (this.direction == 'vertical') {
                delta = ev.pageX - handlePos.left;
            }
            else {
                delta = ev.pageY - handlePos.top;
            }

            if (delta <= 0) {
                this.size = Math.max(this.size + delta, this.minSize);
            }
            else {
                this.size = Math.min(this.size + delta, this.containerSize - this.minSize);
            }

            this.$emit('input', this.size);
        },

        onMouseUp: function onMouseUp() {
            document.removeEventListener('mousemove', this.onMouseMove, { passive: true });
            document.removeEventListener('mouseup', this.onMouseUp);
            this.dragging = false;

            $(document.body).removeClass('splitter-dragging-vertical splitter-dragging-horizontal');
            this.saveSize();
        },

        onHandleMouseDown: function onSplitterMouseDown() {
            if (this.direction == 'vertical') {
                this.containerSize = $(this.$el).width();
                $(document.body).addClass('splitter-dragging-vertical');
            }
            else {
                this.containerSize = $(this.$el).height();
                $(document.body).addClass('splitter-dragging-horizontal');
            }

            document.addEventListener('mousemove', this.onMouseMove, { passive: true });
            document.addEventListener('mouseup', this.onMouseUp);
            this.dragging = true;
        }
    },
    mounted: function onMounted() {
        if (this.value === undefined) {
            var size = parseInt(localStorage.getItem(this.storageKey + '-size'));

            if (!size) {
                size = this.defaultSize;
            }

            this.size = size;
        }
        else {
            this.size = this.value;
        }

        var that = this;
        Vue.nextTick(function () {
            that.applyMinSize();
        });

        window.addEventListener('resize', this.applyMinSize, { passive: true });
    },
    watch: {
        value: function onValueChanged(newValue, oldValue) {
            if (newValue != this.size) {
                this.size = newValue;
            }
        },
        dragging: function (newValue) {
            this.$emit('dragging', newValue)
        }
    },
    beforeUnmount: function onBeforeUnmount() {
        window.removeEventListener('resize', this.applyMinSize, { passive: true });
    }
};
