export default {
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
                    label: oc.t("Edit Dashboard")
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
                            label: oc.t("Make Default")
                        }
                    );
                }

                if (this.store.state.canResetLayout) {
                    this.editMenuItems.push(
                        {
                            type: 'text',
                            command: 'reset-layout',
                            label: oc.t("Reset Layout")
                        }
                    );
                }
            }

            // {
            //     type: 'text',
            //     command: 'rename',
            //     label: oc.t("Rename Dashboard")
            // },
            // {
            //     type: 'text',
            //     command: 'delete',
            //     label: oc.t("Delete Dashboard")
            // },
            // {
            //     type: 'text',
            //     href: '/export/url/here' + this.store.state.dashboardCode,
            //     target: '_blank',
            //     label: oc.t("Export Dashboard")
            // }

            if (this.store.manageUrl) {
                this.editMenuItems.push(
                    {
                        type: 'separator'
                    },
                    {
                        type: 'text',
                        href: this.store.manageUrl,
                        label: oc.t("Manage Dashboards")
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
    beforeUnmount: function beforeUnmount() {
    }
};
