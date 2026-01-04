Vue.component('dashboard-component-dashboard', {
    props: {
        store: Object
    },
    data: function () {
        return {
            saving: false
        };
    },
    computed: {
        currentDashboard: function () {
            return this.store.getCurrentDashboard();
        }
    },
    methods: {
        async onApplyChanges() {
            this.saving = true;
            try {
                await oc.ajax(this.store.getEventHandler('onSaveDashboard'), {
                    progressBar: true,
                    data: {
                        _dash_definition: this.currentDashboard.code,
                        definition: JSON.stringify(this.currentDashboard.rows)
                    }
                });

                this.store.state.editMode = false;
                oc.snackbar.show(oc.lang.get('dashboard.updated_successfully'));
            }
            catch (err) {
                oc.alert(err.message);
            }
            finally {
                this.saving = false;
            }
        },

        onCancelChanges: function () {
            this.store.cancelEditing();
        }
    },
    mounted: function onMounted() {
    },
    watch: {
    },
    beforeDestroy: function beforeDestroy() {
    },
    template: '#dashboard_vuecomponents_dashboard'
});
