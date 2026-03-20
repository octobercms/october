export default {
    props: {
        record: {
            type: [Object],
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
        control: {
            type: Object,
            required: true
        },
    },
    data: function () {
        return {
            fetchedTitle: "",
            loadingDynamicTitle: false
        };
    },
    computed: {
        recordTitle: function computeRecordTitle() {
            if (this.control.formatItemTitle) {
                this.fetchTitle();
                return this.fetchedTitle;
            }

            return this.record[this.control.titleProperty];
        },

        recordColor: function computeRecordColor() {
            if (!this.control.colorProperty) {
                return null;
            }

            return this.record[this.control.colorProperty];
        },
    },
    methods: {
        fetchTitle: async function () {
            const titleData = this.control.formatItemTitle(this.record, this.obj, this.parentObj);
            const isPromise = !!titleData
                && (typeof titleData === 'object' || typeof titleData === 'function')
                && typeof titleData.then === 'function';

            if (isPromise) {
                this.loadingDynamicTitle = true;
                try {
                    this.fetchedTitle = await titleData;
                } finally {
                    this.loadingDynamicTitle = false;
                }
            }
            else {
                this.fetchedTitle = titleData;
            }
        }
    }
};
