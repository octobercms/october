import DataHelper from '../../../../assets/js/classes/data-helper.js';

export default {
    props: {
        prevValue: Number,
        currentValue: Number,
        formattingOptions: Object,
        store: Object
    },
    methods: {
        formatValue: function (value) {
            return DataHelper
                .instance()
                .formatValue(
                    value,
                    this.formattingOptions,
                    this.store.state.locale
                );
        }
    },
    computed: {
        diff: function () {
            return this.currentValue - this.prevValue;
        },

        diffFormattedAbs: function () {
            return this.formatValue(Math.abs(this.diff));
        },

        diffFormatted: function () {
            return this.formatValue(this.diff);
        }
    },
    mounted: function mounted() {
    },
    beforeUnmount: function beforeUnmount() {
    },
    watch: {
    }
};
