export default {
    props: {
        type: {
            type: String,
            required: true,
            validator: function (value) {
                return ['radiobutton', 'checkbox', 'text', 'separator'].indexOf(value) !== -1;
            }
        },
        disabled: Boolean,
        href: String,
        target: String,
        checked: Boolean,
        items: Array,
        icon: String,
        label: String,
        itemStyle: String,
        command: [String, Object],
        isFirst: Boolean
    },
    data: function () {
        return {
            menuItemId: null,
            submenuId: null,
            isSubmenuExpanded: false,
            componentUid: null
        };
    },
    computed: {
        itemRole: function computeItemRole() {
            if (this.type !== 'radiobutton' && this.type !== 'checkbox') {
                return 'menuitem';
            }

            if (this.type == 'checkbox') {
                return 'menuitemcheckbox';
            }

            return 'menuitemradio';
        },

        itemIsChecked: function computeItemIsChecked() {
            if (this.type !== 'radiobutton' && this.type !== 'checkbox') {
                return false;
            }

            return !!this.checked;
        },

        hasSubmenu: function computeHasSubmenu() {
            return this.items && this.items.length > 0;
        }
    },
    methods: {
        hideSubmenu: function hideSubmenu() {
            if (this.hasSubmenu) {
                this.$refs.submenu.hide();
            }
        },

        showSubmenu: function showSubmenu() {
            if (this.hasSubmenu && !this.disabled && this.$refs.submenu) {
                if (this.$refs.submenu.show(this.$el)) {
                    this.isSubmenuExpanded = true;
                    this.$emit('submenushown');
                }
            }
        },

        notifyMenuClosing: function notifyMenuClosing() {
            if (this.hasSubmenu) {
                this.$refs.submenu.notifyMenuClosing();
                this.isSubmenuExpanded = false;
            }
        },

        onClick: function onClick(ev, item) {
            if (this.disabled) {
                ev.preventDefault();
                ev.stopPropagation();
                return false;
            }

            if (this.hasSubmenu) {
                this.showSubmenu();
                ev.preventDefault();
                ev.stopPropagation();
                return false;
            }

            if (this.href) {
                this.$emit('closemenu');
                return;
            }

            if (!this.command) {
                throw new Error('command option is not set for menu item');
            }

            ev.preventDefault();
            ev.stopPropagation();

            this.$emit('command', this.command);
            return false;
        },

        onMouseEnter: function onMouseEnter() {
            this.$emit('itemmouseenter', this.componentUid);
            this.showSubmenu();

            if (!this.disabled && this.$refs.itemElement) {
                var that = this;
                Vue.nextTick(function () {
                    that.$refs.itemElement.focus();
                });
            }
        },

        onKeyDown: function onKeyDown(ev) {
            if (this.hasSubmenu) {
                this.$refs.submenu.onKeyDown(ev);
            }
        },

        onSubmenuHidden: function onSubmenuHidden(ev) {
            this.$refs.itemElement.focus();
            this.isSubmenuExpanded = false;
            this.$emit('submenuhidden');
        }
    },
    mounted: function onMounted() {
        this.menuItemId = $.oc.domIdManager.generate('menuitem');
        this.submenuId = $.oc.domIdManager.generate('dropdown-submenu');
        this.componentUid = $.oc.domIdManager.generate('menuitem-uid');
    }
};
