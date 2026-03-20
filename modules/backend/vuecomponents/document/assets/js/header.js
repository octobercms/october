export default {
    props: {
        data: {
            type: Object,
            required: true
        },
        titleProperty: {
            type: String
        },
        subtitleProperty: {
            type: String
        },
        hideSubtitleEditor: {
            type: Boolean,
            default: false
        },
        disableTitleEditor: {
            type: Boolean,
            default: false
        },
        isNewDocument: {
            type: Boolean,
            default: true
        },
        subtitleLabel: String,
        disabled: Boolean,
        subtitlePresetType: {
            type: String,
            validator: function (value) {
                return ['url', 'file', 'exact', 'camel'].indexOf(value) !== -1;
            }
        },
        documentIcon: {
            type: Object,
            default: null
        },
        showCloseIcon: {
            type: Boolean,
            default: false
        },
        subtitlePresetRemoveWords: Boolean
    },
    data: function () {
        var subtitleEdited = false;

        if (this.subtitleProperty) {
            subtitleEdited = this.data[this.subtitleProperty] !== undefined;
        }

        return {
            subtitleEdited: subtitleEdited
        };
    },
    computed: {
        documentIconStyle: function computeDocumentIconStyle() {
            return {
                'background-color': this.documentIcon.backgroundColor ? this.documentIcon.backgroundColor : '#E67E21'
            };
        },
    },
    methods: {
        focusTitle: function focusTitle() {
            if (this.$refs.titleInput) {
                this.$refs.titleInput.focus();
            }
        },

        onTitleInput: function onTitleInput() {
            if (!this.isNewDocument || this.subtitleEdited || !this.subtitlePresetType || !this.subtitleProperty) {
                return;
            }

            var value = oc.InputPresetEngine.formatValue(
                {
                    inputPresetType: this.subtitlePresetType,
                    inputPresetRemoveWords: this.subtitlePresetRemoveWords
                },
                this.data[this.titleProperty]
            );

            // Vue 3: Direct assignment is reactive
            this.data[this.subtitleProperty] = value;
            this.$emit('titleinput');
        },

        onSubtitleInput: function onSubtitleInput() {
            this.subtitleEdited = true;
        }
    },
    mounted: function onMounted() {
        this.onTitleInput();
    }
};
