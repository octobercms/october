/*
 * Tailor entry publish button Vue component
 */
export default {
    props: {
        state: Object
    },
    data: function () {
        return {
        };
    },
    computed: {
        currentStatusData() {
            let statusCode = this.state.initial.statusCode;

            if (this.state.initial.isDraft) {
                statusCode = 'draft';
            }

            if (this.state.initial.statusCodeOptions[statusCode]) {
                return this.state.initial.statusCodeOptions[statusCode];
            }

            return null;
        },

        buttonCssClass() {
            let statusCode = this.state.initial.statusCode;
            let result = [];

            result.push('status-' + statusCode);

            if (this.state.initial.isFirstDraft) {
                result.push('status-initial-draft');
            }

            if (this.state.initial.isDraft) {
                result.push('status-draft');
            }

            return result;
        },

        markerStyle() {
            let result = {};

            if (this.currentStatusData) {
                result['background-color'] = this.currentStatusData[1];
            }

            return result;
        },

        currentStatusName() {
            return this.currentStatusData ? this.currentStatusData[0] : 'Unknown';
        }
    },
    methods: {
        onClick(ev) {
            this.$emit('click', ev);
        }
    },
    mounted: function onMounted() {
    },
    watch: {
    }
};
