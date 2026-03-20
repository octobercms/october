import DomTools from './domtools.js';

/*
 * Tailor entry publishing controls Vue component
 */
export default {
    props: {
        modelName: {
            type: String,
            default: "EntryRecord"
        },
        lang: Object,
        entryState: Object
    },
    data: function () {
        return {
            showPublishDate: false,
            showExpiryDate: false,
            showFullSlug: false,

            state: {
                saved: {},
                current: {}
            }
        };
    },
    computed: {
        hasStateChanged() {
            return JSON.stringify(this.state.saved) != JSON.stringify(this.state.current);
        },

        isInitialDraft() {
            return this.entryState.initial.isFirstDraft;
        },

        isDraft() {
            return this.entryState.initial.isDraft;
        },

        isDeleted() {
            return this.entryState.initial.isDeleted;
        },

        showTreeControls() {
            return this.entryState.initial.showTreeControls;
        },

        fullSlug() {
            let fullSlug = this.entryState.initial.fullSlug;
            if (fullSlug === undefined || fullSlug === null) {
                fullSlug = '';
            }

            let parts = fullSlug.split('/');
            let resultArray = parts.slice(0, -1);
            resultArray.push(this.state.current.slug);

            return resultArray.join('/');
        }
    },
    methods: {
        show(target) {
            this.$refs.popover.show(target);
        },

        hide() {
            this.$refs.popover.hide();
        },

        getStateFromDom() {
            let result = {};

            let enabledFormGroup = this.domTools.findFormGroup('is_enabled');
            if (enabledFormGroup) {
                result.enabled = enabledFormGroup.find('input[type=checkbox]').is(':checked');
            }

            let slugFormGroup = this.domTools.findFormGroup('slug');
            if (slugFormGroup) {
                result.slug = slugFormGroup.find('input[type=text]').val().trim();
            }

            let publishedDateFormGroup = this.domTools.findFormGroup('published_at');
            let expiryDateFormGroup = this.domTools.findFormGroup('expired_at');
            if (publishedDateFormGroup && expiryDateFormGroup) {
                result.publishDate = publishedDateFormGroup.find('input[type=text]').val().trim();
                result.expiryDate = expiryDateFormGroup.find('input[type=text]').val().trim();
            }

            if (this.entryState.initial.showTreeControls) {
                let parentIdFormGroup = this.domTools.findFormGroup('parent_id');
                if (parentIdFormGroup) {
                    result.parentId = parentIdFormGroup.find('select').val().trim();
                }
            }

            return result;
        },

        hasDateControls() {
            return this.domTools.findFormGroup('published_at') &&
                this.domTools.findFormGroup('expired_at');
        },

        synchStateFromDom(isInit, ev) {
            let state = this.getStateFromDom();

            if (isInit) {
                this.state.saved = $.oc.vueUtils.getCleanObject(state);

                if (this.hasDateControls()) {
                    this.showPublishDate = this.state.saved.publishDate.length > 0;
                    this.showExpiryDate = this.state.saved.expiryDate.length > 0;
                }
            }

            this.state.current = $.oc.vueUtils.getCleanObject(state);
        },

        updateSavedState() {
            this.state.saved = $.oc.vueUtils.getCleanObject(this.getStateFromDom());
        },

        moveDateControls() {
            let publishedEl = this.domTools.findFormGroup('published_at');
            let expiredEl = this.domTools.findFormGroup('expired_at');

            if (expiredEl && publishedEl) {
                $(this.$refs.publishDate).append(publishedEl);
                $(this.$refs.expiryDate).append(expiredEl);
            }

            // Date picker initializes on document.render and triggers the change event
            // on the inputs. Add change handlers after the date picker finishes initializing.
            setTimeout(_ => {
                this.synchStateFromDom(true);

                let slugEl = this.domTools.findFormGroup('slug');
                if (slugEl) {
                    slugEl.find('input[type=text]').on('change keyup paste', ev => this.synchStateFromDom(false, ev));
                }

                if (expiredEl && publishedEl) {
                    publishedEl.find('input[type=text]').on('change keyup paste', ev => this.synchStateFromDom(false, ev));
                    expiredEl.find('input[type=text]').on('change keyup paste', _ => this.synchStateFromDom());
                }

                if (this.entryState.initial.showTreeControls) {
                    let formGroup = this.domTools.findFormGroup('parent_id');
                    if (formGroup) {
                        formGroup.find('select').on('change', _ => this.synchStateFromDom());
                    }
                }
            }, 1)
        },

        initDomListeners() {
            this.moveDateControls();

            let formGroup = this.domTools.findFormGroup('is_enabled');
            if (formGroup) {
                formGroup.find('input[type=checkbox]').on('change', _ => this.synchStateFromDom());
            }
        },

        onRemovePublishDateClick() {
            this.showPublishDate = false;
            let formGroup = this.domTools.findFormGroup('published_at');
            formGroup.find('input[type=text]').val('');
            formGroup.find('input[type=hidden]').val('');
            this.synchStateFromDom();
        },

        onRemoveExpiryDateClick() {
            this.showExpiryDate = false;
            let formGroup = this.domTools.findFormGroup('expired_at');
            formGroup.find('input[type=text]').val('');
            formGroup.find('input[type=hidden]').val('');
            this.synchStateFromDom();
        },

        onShowPublishDateClick() {
            this.showPublishDate = true;
            Vue.nextTick(_ => {
                let formGroup = this.domTools.findFormGroup('published_at');
                formGroup.find('input[type=text]').trigger('click');
            });
        },

        onShowExpiryDateClick() {
            this.showExpiryDate = true;
            Vue.nextTick(_ => {
                let formGroup = this.domTools.findFormGroup('expired_at');
                formGroup.find('input[type=text]').trigger('click');
            });
        },

        onShown() {
            $(this.$el).find('input[type=text]').first().focus();
            this.synchStateFromDom();
        },

        onShowFullSlugClick() {
            this.showFullSlug = true;
        }
    },
    mounted: function onMounted() {
        Vue.nextTick(() => {
            this.domTools = DomTools.newDomTools();
            this.domTools.setForm(this.$el.closest('form'), this.modelName);

            $(this.$refs.enabled).append(this.domTools.findFormGroup('is_enabled'));
            $(this.$refs.slug).append(this.domTools.findFormGroup('slug'));

            if (this.entryState.initial.showTreeControls) {
                $(this.$refs.parentId).append(this.domTools.findFormGroup('parent_id'));
            }

            this.initDomListeners();

            // Hide publish button when no form fields are available
            if (!this.$el.querySelector('.form-group')) {
                this.$el.style.display = 'none';
                var button = this.$el.parentNode.querySelector('.record-status-button');
                if (button) {
                    button.style.display = 'none';
                }
            }
        });
    },
    watch: {
        hasStateChanged(newValue, oldValue) {
            this.$emit('statechanged', newValue)
        }
    }
};
