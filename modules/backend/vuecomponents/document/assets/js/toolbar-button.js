export default {
    props: {
        settings: Object,
        toolbarDisabled: Boolean
    },
    computed: {
        icon: function computeIcon() {
            if (this.settings.icon) {
                return this.settings.icon;
            }
        },

        command: function computeCommand() {
            if (this.settings.command) {
                return this.settings.command;
            }
        },

        label: function computeLabel() {
            var label = '';

            if (this.settings.label) {
                label = this.settings.label;
            }

            if (this.settings.labelFromSelectedItem && this.settings.menuitems) {
                for (var index = 0; index < this.settings.menuitems.length; index++) {
                    var menuItem = this.settings.menuitems[index];

                    if (menuItem.checked) {
                        label = menuItem.label;
                        break;
                    }
                }
            }

            return label;
        },

        tooltip: function computeTooltip() {
            if (this.settings.tooltip) {
                return this.settings.tooltip;
            }
        },

        tooltipHotkey: function computeTooltipHotkey() {
            if (this.settings.tooltip) {
                return this.settings.tooltipHotkey;
            }
        },

        ariaControlsId: function computeAiaControlsId() {
            if (this.settings.type === 'dropdown') {
                return this.menuId;
            }
        },

        cssClass: function computeCssClass() {
            return {
                'has-menu': this.settings.type === 'dropdown',
                'icon-only': !this.label,
                'has-menu-trigger': this.settings.type != 'dropdown' && this.settings.menuitems,
                'disabled-button': this.settings.disabled || this.toolbarDisabled,
                pressed: !!this.settings.pressed
            };
        },

        menuTriggerCssClass: function computeMenuTriggerCssClass() {
            return {
                pressed: !!this.settings.pressed
            };
        },

        titleStyle: function computeTitleStyle() {
            var result = {};

            if (!this.settings.labelFromSelectedItem || !this.settings.menuitems) {
                return result;
            }

            var $testerContainer = $('<div class="backend-document-toolbar-button-length-tester">'),
                labelsText = '';
            for (var index = 0; index < this.settings.menuitems.length; index++) {
                var menuItem = this.settings.menuitems[index];
                if (typeof menuItem.label !== 'string') {
                    continue;
                }

                labelsText += '\n' + menuItem.label;
            }

            $testerContainer.text(labelsText);

            $(document.body).append($testerContainer);
            result.width = $testerContainer.width() + 'px';
            $testerContainer.remove();

            return result;
        }
    },
    data: function () {
        return {
            menuId: null,
            buttonId: null,
            menuButtonId: null
        };
    },
    methods: {
        onClick: function onClick(ev, isHotkey, isMenuButton) {
            Vue.nextTick(oc.octoberTooltips.clear, 1);

            if (this.settings.disabled || this.toolbarDisabled || $(document.body).hasClass('drag')) {
                ev.preventDefault();
                ev.stopPropagation();
                return false;
            }

            if (this.settings.href) {
                if (isHotkey) {
                    window.open(this.settings.href, this.settings.target ? this.settings.target : '_self');
                }

                return;
            }

            ev.preventDefault();
            ev.stopPropagation();

            if (this.settings.type != 'dropdown' && !isMenuButton) {
                if (!this.settings.command) {
                    throw new Error('command option is not set for toolbar button');
                }

                this.$emit('command', this.settings.command, isHotkey, ev, this.$el, this.settings.customData);
                return false;
            }

            if (this.settings.emitCommandBeforeMenu) {
                this.$emit('command', this.settings.emitCommandBeforeMenu, isHotkey, ev, this.$el, this.settings.customData);
            }

            this.$refs.menu.showMenu(this.settings.type == 'dropdown' ? this.$refs.button : this.$refs.menuButton);
            return false;
        },

        onMenuClosedWithEsc: function onMenuClosedWithEsc() {
            var that = this;
            Vue.nextTick(function () {
                that.$refs.button.focus();
            });
        },

        onMenuItemCommand: function onMenuItemCommand(command) {
            this.$emit('command', command, false, null, this.$el);
        },

        onMenuShown: function onMenuShown() {
            $(this.$refs.button).attr('aria-expanded', 'true');
            this.$emit('dropdowncontentshown');
        },

        onMenuHidden: function onMenuHidden() {
            $(this.$refs.button).removeAttr('aria-expanded');
            this.$emit('dropdowncontenthidden');
        },

        onAlignToTrigger: function onAlignToTrigger(ev) {
            if (this.settings.type == 'dropdown') {
                ev.triggerElement = this.$refs.button;
            }
            else {
                ev.triggerElement = this.$refs.menuButton;
            }
        },

        onHotkey: function onHotkey(ev) {
            ev.preventDefault();

            if ((this.settings.type == 'dropdown' || this.settings.href) && !$(this.$el).is(':visible')) {
                // Ignore hotkeys for invisible link buttons and buttons with dropdown menus
                //
                return;
            }

            this.onClick(ev, true);
        }
    },
    mounted: function onMounted() {
        this.menuId = $.oc.domIdManager.generate('dropdown-menu');
        this.buttonId = $.oc.domIdManager.generate('document-toolbar-button');
        this.menuButtonId = $.oc.domIdManager.generate('document-toolbar-menu-button');
    }
};
