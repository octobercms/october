Vue.component('dashboard-component-dashboard-dashboard-selector', {
    props: {
        store: Object,
        embeddedInDashboard: Boolean
    },
    computed: {
        canCreateAndEdit: function () {
            return this.store.state.canCreateAndEdit;
        },

        currentDashboard: function () {
            return this.store.getCurrentDashboard();
        }
    },
    data: function () {
        return {
            editMenuItems: [],
        };
    },
    methods: {
        setEditMenuItems: function () {
            this.editMenuItems = [];

            this.editMenuItems.push(
                {
                    type: 'text',
                    command: 'edit',
                    label: oc.lang.get('dashboard.edit_dashboard')
                }
            );

            if (this.store.state.canMakeDefault || this.store.state.canResetLayout) {
                this.editMenuItems.push(
                    {
                        type: 'separator'
                    }
                );

                if (this.store.state.canMakeDefault) {
                    this.editMenuItems.push(
                        {
                            type: 'text',
                            command: 'make-default',
                            label: oc.lang.get('dashboard.make_default')
                        }
                    );
                }

                if (this.store.state.canResetLayout) {
                    this.editMenuItems.push(
                        {
                            type: 'text',
                            command: 'reset-layout',
                            label: oc.lang.get('dashboard.reset_layout')
                        }
                    );
                }
            }

            // {
            //     type: 'text',
            //     command: 'rename',
            //     label: oc.lang.get('dashboard.rename_dashboard')
            // },
            // {
            //     type: 'text',
            //     command: 'delete',
            //     label: oc.lang.get('dashboard.delete_dashboard')
            // },
            // {
            //     type: 'text',
            //     href: '/export/url/here' + this.store.state.dashboardCode,
            //     target: '_blank',
            //     label: oc.lang.get('dashboard.export_dashboard')
            // }

            if (this.store.manageUrl) {
                this.editMenuItems.push(
                    {
                        type: 'separator'
                    },
                    {
                        type: 'text',
                        href: this.store.manageUrl,
                        label: oc.lang.get('dashboard.manage_dashboards')
                    }
                );
            }
        },

        onEditClick: function (ev) {
            this.setEditMenuItems();
            this.$refs.editMenu.showMenu(ev);
        },

        onEditMenuItemCommand: function (command) {
            // Let the dropdown menu hide before
            // running the next operation.
            Vue.nextTick(() => {
                if (command === 'edit') {
                    this.store.startEditing();
                    return;
                }

                if (command === 'reset-layout') {
                    this.store.resetLayout();
                    return;
                }

                if (command === 'make-default') {
                    this.store.makeDefault();
                    return;
                }
            })
        },

        onKeyDown: function onKeyDown(ev) {
            if (ev.keyCode == 27) {
                this.hideDropdown();
            }
        },
    },
    mounted: function onMounted() {
    },
    watch: {
    },
    beforeDestroy: function beforeDestroy() {
    },
    template: '#dashboard_vuecomponents_dashboard_dashboard_selector'
});
