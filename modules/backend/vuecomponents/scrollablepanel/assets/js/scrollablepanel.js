/*
 * Vue scrollable panel implementation.
 *
 * The panel is positioned using position=absolute. The hosting
 * element must have position=relative.
 */
export default {
    props: {
        relativeLayout: {
            type: Boolean,
            default: false
        },
        relativeLayoutMaxHeight: Number
    },
    computed: {
        containerStyle: function computeContainerStyle() {
            if (!this.relativeLayout) {
                return {};
            }

            var result = {};

            if (this.relativeLayoutMaxHeight !== undefined) {
                result['max-height'] = this.relativeLayoutMaxHeight + 'px';
            }

            return result;
        }
    },
    methods: {
        gotoStart: function gotoStart() {
            $(this.$refs.scrollable).dragScroll('goToStart');
        },

        goToElement: function goToElement(element, options) {
            var that = this;
            return new Promise(function (resolve, reject) {
                $(that.$refs.scrollable).dragScroll('goToElement', element, resolve, options);
            });
        },

        onScroll: function onScroll() {
            $(this.$refs.container).toggleClass('scrolled', this.$refs.scrollable.scrollTop > 0);
        }
    },
    mounted: function mounted() {
        $(this.$refs.scrollable).dragScroll({
            useDrag: true,
            useNative: false,
            vertical: true,
            noScrollClasses: true
        });
    },
    beforeUnmount: function beforeUnmount() {
        $(this.$refs.scrollable).dragScroll('dispose');
    }
};
