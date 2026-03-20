export default {
    props: {
        items: Array,
        menuId: String,
        labeledById: String,
        managedTriggerSelector: String,
        preferablePosition: {
            type: String,
            validator: function (value) {
                return ['right', 'bottom-right'].indexOf(value) !== -1;
            }
        }
    },
    data: function () {
        return {
            visible: false
        };
    },
    computed: {},
    beforeUnmount: function beforeUnmount() {
        $(document.body).off('.backenddropdownmenu', this.onKeyDown);
    },
    methods: {
        showMenu: function showMenu(triggerElementOrEvent) {
            this.visible = true;
            this.$refs.sheet.show(triggerElementOrEvent);

            $(document.body).on('keydown.backenddropdownmenu', this.onKeyDown);

            var that = this;
            Vue.nextTick(function () {
                that.$emit('shown');

                if (that.managedTriggerSelector) {
                    $(that.managedTriggerSelector).attr('aria-expanded', 'true');
                }
            });
        },

        hideMenu: function hideMenu(sheetHidden) {
            $(document.body).off('.backenddropdownmenu', this.onKeyDown);

            if (!sheetHidden && this.$refs.sheet) {
                this.$refs.sheet.hide();
            }

            this.visible = false;
            var that = this;
            Vue.nextTick(function () {
                that.$emit('hidden');

                if (that.managedTriggerSelector) {
                    $(that.managedTriggerSelector).removeAttr('aria-expanded', 'true');
                }
            });
        },

        onOverlayClick: function onOverlayClick() {
            this.hideMenu();
        },

        onSheetHidden: function onMenuHidden(ev) {
            this.hideMenu(true);
        },

        onKeyDown: function onKeyDown(ev) {
            if (ev.keyCode == 27) {
                this.hideMenu();
                this.$emit('closedwithesc');

                if (this.managedTriggerSelector) {
                    var that = this;
                    Vue.nextTick(function () {
                        $(that.managedTriggerSelector).focus();
                    });
                }

                return;
            }

            return this.$refs.sheet.onKeyDown(ev);
        },

        onOverlayContextMenu: function onOverlayContextMenu(ev) { }
    }
};
