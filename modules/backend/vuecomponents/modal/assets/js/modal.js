import { modalPosition, modalSize } from './classes/index.js';

/*
 * Vue modal implementation
 */
export default {
    props: {
        ariaLabeledBy: {
            type: String,
            required: true
        },
        closeByEsc: {
            type: Boolean,
            default: true
        },
        modalCssClass: {
            type: String,
            default: ''
        },
        closeByOverlayClick: {
            type: Boolean,
            default: false
        },
        draggable: {
            type: Boolean,
            default: true
        },
        resizable: {
            type: [String, Boolean],
            default: false,
            validator: function (value) {
                if (value === undefined) {
                    return;
                }

                if (typeof value === 'string') {
                    return ['horizontal', 'vertical'].indexOf(value) !== -1;
                }

                return typeof value === 'boolean';
            }
        },
        uniqueKey: {
            type: String,
            required: true
        },
        size: {
            type: String,
            default: 'normal',
            validator: function (value) {
                return ['small', 'normal', 'large'].indexOf(value) !== -1;
            }
        },
        storePosition: {
            type: Boolean,
            default: true
        },
        resizeMinWidth: {
            type: Number,
            default: 300
        },
        resizeDefaultWidth: {
            type: Number,
            default: 300
        },
        resizeMinHeight: {
            type: Number,
            default: 200
        },
        resizeDefaultHeight: {
            type: Number,
            default: 200
        },
        isModal: {
            type: Boolean,
            default: true
        },
        baseZIndex: {
            type: Number,
            default: 600
        },
        modalTemporaryHidden: {
            type: Boolean,
            default: false
        },
        contentCssClass: String
    },
    data: function () {
        return {
            baseModalZindex: 600,
            visible: false,
            loadingPosition: true,
            wasResizingOrDragging: false,
            fadeIn: false,
            offset: {
                left: 0,
                top: 0
            },
            userSize: {
                width: null,
                height: null
            },
            zIndex: 600,
            componentUid: null
        };
    },
    computed: {
        modalStyle: function computeModalStyle() {
            var result = {
                top: this.offset.top + 'px',
                left: this.offset.left + 'px'
            };

            if (this.resizable === true || this.resizable === 'horizontal') {
                if (this.userSize.width !== null) {
                    result.width = Math.max(this.resizeMinWidth, this.userSize.width) + 'px';
                }
                else {
                    result.width = Math.max(this.resizeMinWidth, this.resizeDefaultWidth) + 'px';
                }
            }

            if (this.resizable === true || this.resizable === 'vertical') {
                if (this.userSize.height !== null) {
                    result.height = Math.max(this.resizeMinHeight, this.userSize.height) + 'px';
                }
                else {
                    result.height = Math.max(this.resizeMinHeight, this.resizeDefaultHeight) + 'px';
                }
            }

            return result;
        },

        containerStyle: function computeContainerStyle() {
            if (!this.loadingPosition) {
                return {
                    'z-index': this.zIndex
                };
            }

            return {
                visibility: 'hidden'
            };
        },

        contentCssClassName: function computeContentCssClassName() {
            var result = '';

            if (this.draggable) {
                result = 'draggable';
            }

            if (this.contentCssClass) {
                result += ' ' + this.contentCssClass;
            }

            return result;
        },

        storageKey: function computeStorageKey() {
            return this.uniqueKey + '-modal';
        },

        containerCssClass: function computeContainerCssClass() {
            var result = this.modalCssClass;

            if (this.fadeIn) {
                result += ' show ';
            }

            if (!this.isModal) {
                return result + ' non-modal';
            }

            if (this.modalTemporaryHidden) {
                result += ' temporary-hidden';
            }

            return result;
        },

        cssClass: function computeCssClass() {
            if (this.size == 'small') {
                return 'modal-sm';
            }

            if (this.size == 'large') {
                return 'modal-lg';
            }

            return '';
        },

        isVisible: function computeIsVisible() {
            return this.visible;
        }
    },
    methods: {
        show: function show() {
            this.visible = true;

            var that = this;
            Vue.nextTick(function () {
                that.fadeIn = true;
                that.loadPosition();
            });

            $(document.body).on('keydown', this.onKeyDown);
        },

        hide: function hide(byEscape) {
            this.fadeIn = false;
            $(document.body).off('keydown', this.onKeyDown);

            var that = this;
            setTimeout(function () {
                that.visible = false;
                that.loadingPosition = true;
                that.offset = {
                    left: 0,
                    top: 0
                };

                Vue.nextTick(function () {
                    $.oc.modalFocusManager.pop();
                    that.$emit('hidden', byEscape);
                });
            }, 300);
        },

        savePosition: function savePosition() {
            if (!this.storePosition) {
                return;
            }

            var that = this;

            Vue.nextTick(function () {
                var offset = $(that.$refs.content).offset();

                sessionStorage.setItem(that.storageKey + '-x', Math.round(offset.left));
                sessionStorage.setItem(that.storageKey + '-y', Math.round(offset.top));

                if (that.userSize.width || (that.userSize.height && that.resizable !== false)) {
                    if (that.resizable === 'horizontal' || that.resizable === true) {
                        sessionStorage.setItem(that.storageKey + '-width', Math.round(that.userSize.width));
                    }

                    if (that.resizable === 'vertical' || that.resizable === true) {
                        sessionStorage.setItem(that.storageKey + '-height', Math.round(that.userSize.height));
                    }
                }
            });
        },

        loadPosition: function loadPosition() {
            var left = parseInt(sessionStorage.getItem(this.storageKey + '-x')),
                top = parseInt(sessionStorage.getItem(this.storageKey + '-y')),
                width = parseInt(sessionStorage.getItem(this.storageKey + '-width')),
                height = parseInt(sessionStorage.getItem(this.storageKey + '-height')),
                initialOffset = modalPosition.getInitialOffset(this.isModal),
                contentOffset = $(this.$refs.content).offset();

            this.offset.top = !isNaN(top) ? top - contentOffset.top : initialOffset;
            this.offset.left = !isNaN(left) ? left - contentOffset.left : initialOffset;

            if (!isNaN(width)) {
                this.userSize.width = width;
            }

            if (this.userSize.width === null && !this.isModal) {
                this.userSize.width = this.resizeMinWidth;
            }

            if (this.userSize.height === null && !this.isModal) {
                this.userSize.height = this.resizeMinHeight;
            }

            if (!isNaN(height)) {
                this.userSize.height = height;
            }

            var that = this;
            Vue.nextTick(function () {
                modalPosition.fixPosition($(that.$refs.content), false, that.offset);
                that.loadingPosition = false;

                Vue.nextTick(function () {
                    $.oc.modalFocusManager.push(that.onFocusIn, 'modal', that.componentUid, that.isModal);
                    that.zIndex = that.baseModalZindex + $.oc.modalFocusManager.getNumberOfType('modal');
                    that.$emit('shown');
                });
            });
        },

        onKeyDown: function onKeyDown(ev) {
            if (!$.oc.modalFocusManager.isUidTop(this.componentUid)) {
                return;
            }

            if (this.modalTemporaryHidden) {
                return;
            }

            if (ev.keyCode == 27) {
                if (!this.closeByEsc) {
                    return;
                }

                var event = $.Event('escapepressed');

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

        onFocusIn: function onFocusIn(ev) {
            if (!ev) {
                var event = $.Event('setdefaultfocus');

                this.$emit('setdefaultfocus', event);
                if (event.isDefaultPrevented()) {
                    return;
                }

                // Focus after visbility animations are ready
                var defaultFocus = $(this.$refs.content).find('[data-default-focus]').first();
                setTimeout(function () {
                    defaultFocus.focus();
                }, 100);

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
                // Focus after visbility animations are ready
                var defaultFocus = $(this.$refs.content).find('[data-default-focus]').first();
                setTimeout(function () {
                    defaultFocus.focus();
                }, 100);

                return false;
            }
        },

        onTransitionEnd: function onTransitionEnd() {
            $(this.$refs.content).removeClass('animate-position');
            this.savePosition();
        },

        onResizeMouseUp: function onResizeMouseUp() {
            this.wasResizingOrDragging = true;
            this.savePosition();

            var that = this;
            setTimeout(function () {
                that.wasResizingOrDragging = false;
            }, 5);
        },

        onMouseDown: function onMouseDown(ev) {
            if ($(window).width() <= 768) {
                return;
            }

            if (this.draggable && $(ev.target.closest('.modal-header')).length) {
                return modalPosition.onMouseDown(
                    ev,
                    this.$refs.content,
                    this.offset,
                    this.onResizeMouseUp
                );
            }

            if (this.resizable && $(ev.target).hasClass('resize-handle')) {
                return modalSize.onMouseDown(
                    ev,
                    this.$refs.content,
                    this.userSize,
                    this.offset,
                    this.onResizeMouseUp,
                    this.resizeMinWidth,
                    this.resizeMinHeight
                );
            }
        },

        onOverlayClick: function onOverlayClick(ev) {
            if (!this.visible || this.wasResizingOrDragging || !this.isModal) {
                return;
            }

            var $content = $(this.$refs.content);
            if ($content.has(ev.target).length) {
                return;
            }

            if (this.$refs.content == ev.target) {
                return;
            }

            if (this.closeByOverlayClick) {
                this.hide(true);
                return;
            }

            $content.addClass('show-modal-frame');
            setTimeout(function () {
                $content.removeClass('show-modal-frame');
            }, 400);
        }
    },
    watch: {
        userSize: {
            handler: function onUserSizeChanged() {
                this.$emit('resized');
            },
            deep: true
        }
    },
    mounted: function onMounted() {
        this.baseModalZindex = this.baseZIndex;
        this.componentUid = $.oc.domIdManager.generate('modal-uid');
    }
};
