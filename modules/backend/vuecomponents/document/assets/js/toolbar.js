export default {
    props: {
        elements: Array,
        disabled: Boolean
    },
    methods: {
        onElementCommand: function onElementCommand(command, isHotkey, ev, targetElement, customData) {
            this.$emit('command', command, isHotkey, ev, targetElement, customData);
            $(this.$el).trigger('documenttoolbarcmd', {
                command: command,
                isHotkey: isHotkey,
                ev
            });
        },

        onDropdownContentShown: function onDropdownContentShown() {
            $(this.$refs.scrollable).dragScroll('pause');
        },

        onDropdownContentHidden: function onDropdownContentHidden() {
            $(this.$refs.scrollable).dragScroll('resume');
        }
    },
    computed: {
        flattenedElements: function computeFlattenedElements() {
            if (!this.elements) {
                return [];
            }

            var result = [];

            for (var index = 0; index < this.elements.length; index++) {
                var element = this.elements[index];
                if (!Array.isArray(element)) {
                    result.push(element);
                }
                else {
                    result = result.concat(element);
                }
            }

            return result;
        },

        scrollableElements: function computeScrollableElements() {
            return this.flattenedElements.filter(function (el) {
                return !el.fixedRight;
            });
        },

        fixedRightElements: function computeFixedRightElements() {
            return this.flattenedElements.filter(function (el) {
                return el.fixedRight;
            });
        }
    },
    mounted: function mounted() {
        $(this.$refs.scrollable).dragScroll({
            useDrag: true,
            useNative: false,
            noScrollClasses: false,
            scrollClassContainer: this.$refs.toolbarContainer
        });
    },
    beforeUnmount: function beforeUnmount() {
        $(this.$refs.scrollable).dragScroll('dispose');
    },
    watch: {
        elements: function watchElements() {
            $(this.$refs.scrollable).dragScroll('fixScrollClasses');
        },
        disabled: function watchDisabled() {
            Vue.nextTick(oc.octoberTooltips.clear, 1);
        }
    }
};
