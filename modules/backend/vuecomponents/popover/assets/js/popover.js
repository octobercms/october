/*
 * Vue popover implementation
 */
export default {
    props: {
        closeByEsc: {
            type: Boolean,
            default: true
        },
        containerCssClass: {
            type: String,
            default: ''
        },
        closeByOverlayClick: {
            type: Boolean,
            default: true
        },
        baseZIndex: {
            type: Number,
            default: 600
        },
        position: {
            type: String,
            default: 'bottom-right',
            validator: function (value) {
                return ['bottom-right'].indexOf(value) !== -1;
            }
        },
        alwaysVisible: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            basePopoverZindex: 600,
            visible: false,
            in: false,
            zIndex: 600,
            offset: {
                left: 0,
                top: 0
            },
            componentUid: null
        };
    },
    computed: {
        containerStyle() {
            let result = {
                'z-index': this.zIndex
            };

            if (this.alwaysVisible && !this.visible) {
                result.display = 'none';
            }

            return result;
        },

        popoverStyle() {
            const result = {
                top: this.offset.top + 'px',
                left: this.offset.left + 'px'
            };

            return result;
        },

        containerCssClassFull() {
            let result = this.containerCssClass;

            if (this.in) {
                result += ' show ';
            }

            if (this.position === 'bottom-right') {
                result += ' placement-bottom placement-bottom-right';
            }

            return result;
        },

        isVisible() {
            return this.visible;
        }
    },
    methods: {
        show(triggerElement) {
            if (!triggerElement) {
                throw new Error('Popover trigger element is not provided');
            }

            this.offset.top = 0;
            this.offset.left = 0;

            this.visible = true;
            Vue.nextTick(_ => {
                this.in = true;
                this.loadPosition(triggerElement);
            });

            $(document.body).on('keydown', this.onKeyDown);
        },

        hide(byEscape) {
            $(document.body).off('keydown', this.onKeyDown);
            this.in = false;

            setTimeout(_ => {
                this.visible = false;
                $.oc.modalFocusManager.pop();
                Vue.nextTick(_ => this.$emit('hidden', byEscape));
            }, 300);
        },

        loadPosition(triggerElement) {
            Vue.nextTick(_ => {
                this.calculatePosition(triggerElement);
                $.oc.modalFocusManager.push(this.onFocusIn, 'popover', this.componentUid, true);
                this.zIndex = this.basePopoverZindex + $.oc.modalFocusManager.getNumberOfType('popover');
                this.$emit('shown');
            });
        },

        calculatePosition(triggerElement) {
            const relativeOffset = $.oc.vueUtils.getRelativeOffset(triggerElement, this.$refs.popover);
            const triggerHeight = $(triggerElement).outerHeight();
            const triggerWidth = $(triggerElement).outerWidth();
            const containerWidth = $(this.$refs.popover).width();

            this.offset.top = relativeOffset.top + triggerHeight + 10;
            this.offset.left = relativeOffset.left + triggerWidth - containerWidth;
        },

        focusDefaultControl() {
            let defaultFocus = $(this.$refs.content).find('[data-default-focus]').first();
            setTimeout(_ => defaultFocus.focus(), 100);
        },

        onKeyDown(ev) {
            if (!$.oc.modalFocusManager.isUidTop(this.componentUid)) {
                return;
            }

            if (ev.keyCode == 27) {
                if (!this.closeByEsc) {
                    return;
                }

                const event = $.Event('escapepressed');

                this.$emit('escapepressed', event);
                if (!event.isDefaultPrevented()) {
                    this.hide(true);

                    ev.stopPropagation();
                    ev.preventDefault();
                }
            }

            if (ev.keyCode == 13) {
                this.$emit('enterkey', ev);
            }
        },

        onFocusIn(ev) {
            if (!ev) {
                const event = $.Event('setdefaultfocus');

                this.$emit('setdefaultfocus', event);
                if (event.isDefaultPrevented()) {
                    return;
                }

                this.focusDefaultControl();

                return;
            }

            if (!this.isModal) {
                return;
            }

            if (
                document !== ev.target &&
                this.$refs.content !== ev.target &&
                this.$el !== ev.target &&
                !this.$refs.content.contains(ev.target)
            ) {
                this.focusDefaultControl();

                return false;
            }
        },

        onOverlayClick(ev) {
            if (!this.visible) {
                return;
            }

            const $popover = $(this.$refs.popover);
            if ($popover.has(ev.target).length) {
                return;
            }

            if (this.$refs.popover == ev.target) {
                return;
            }

            if (this.closeByOverlayClick) {
                this.hide(true);
                return;
            }
        }
    },
    mounted() {
        this.basePopoverZindex = this.baseZIndex;
        this.componentUid = $.oc.domIdManager.generate('popover-uid');
    }
};
