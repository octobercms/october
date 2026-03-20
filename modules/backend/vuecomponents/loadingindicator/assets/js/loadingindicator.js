/*
 * Vue loading indicator implementation.
 */
export default {
    props: {
        indicatorStyle: {
            type: String,
            default: 'circles',
            validator: function (value) {
                return ['circles', 'stripe', 'bar'].indexOf(value) !== -1;
            }
        },
        size: {
            type: String,
            default: 'small',
            validator: function (value) {
                return ['small', 'large', 'tiny'].indexOf(value) !== -1;
            }
        },
        progress: {
            type: Number,
            default: 0,
            validator: function (value) {
                return value >= 0 && value <= 100;
            }
        },
        orientation: {
            type: String,
            default: 'horizontal',
            validator: function (value) {
                return ['horizontal', 'vertical'].indexOf(value) !== -1;
            }
        },
        cssClass: {
            type: String,
            default: ''
        }
    },
    computed: {
        className: function computeClassName() {
            return (
                'size-' +
                this.size +
                ' ' +
                this.cssClass +
                ' style-' +
                this.indicatorStyle +
                ' orientation-' +
                this.orientation
            );
        },

        barIndicatorStyle: function computeBarIndicatorStyle() {
            if (this.orientation === 'horizontal') {
                return {
                    width: this.progress + '%'
                };
            }

            return {
                height: this.progress + '%'
            };
        }
    },
    methods: {},
    mounted: function mounted() { },
    beforeUnmount: function beforeUnmount() { }
};
