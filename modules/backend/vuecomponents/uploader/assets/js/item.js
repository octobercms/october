/*
 *  Universal file uploader item implementation
 */
export default {
    props: {
        errorMessage: String,
        fileName: String,
        progress: Number,
        status: String
    },
    data: function () {
        return {};
    },
    computed: {
        cssClass: function computeCssClass() {
            return {
                'status-completed': this.status === 'completed',
                'status-uploading': this.status === 'uploading',
                'status-error': this.status === 'error'
            };
        }
    },
    methods: {}
};
