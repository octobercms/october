/*
 *  Universal file uploader item implementation
 */
export default {
    props: {
        file: Object
    },
    data: function () {
        return {
            progress: 0,
            errorMessage: '',
            status: 'uploading'
        };
    },
    computed: {
        // trying to use computed property to update progress but not working
        // progress: function computeProgress() {
        //     return this.file.progress;
        // },
        cssClass: function computeCssClass() {
            return {
                'status-completed': this.status === 'completed',
                'status-uploading': this.status === 'uploading',
                'status-error': this.status === 'error'
            };
        }
    },
    methods: {},
    mounted: function onMounted() {
        // important for progress bar to update
        let intervalId = setInterval(() => {
            this.progress = this.file.progress;
            if (this.status === 'completed' || this.status === 'error') {
                clearInterval(intervalId);
            }
        }, 200);
        this.file.promise.then(
            () => {
                this.status = 'completed';
                this.progress = 100;
            },
            () => {
                this.status = 'error';
                this.errorMessage = this.file.errorMessage;
            }
        );
    }
};
