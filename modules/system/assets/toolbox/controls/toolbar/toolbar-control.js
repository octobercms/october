/*
 * Toolbar control
 *
 * Makes toolbars drag/scrollable.
 *
 * Data attributes:
 * - data-control="toolbar" - enables the toolbar plugin
 *
 * Config:
 * - noDragSupport - disables drag support, leaving only mouse wheel support
 * - useNativeDrag - if native CSS is enabled via "mobile" on the HTML tag
 * - vertical - enables vertical scrolling mode
 */
import { ControlBase } from 'larajax';

const $ = window.jQuery;

export default class ToolbarControl extends ControlBase {
    init() {
        this.$toolbar = this.element.closest('.control-toolbar');
        this.scrollClassContainer = this.element.parentNode;
    }

    connect() {
        var noDragSupport = this.config.noDragSupport !== undefined && this.config.noDragSupport;

        if (this.config.useNativeDrag) {
            this.element.classList.add('is-native-drag');
        }

        $(this.element).dragScroll({
            scrollClassContainer: this.scrollClassContainer,
            useDrag: !noDragSupport,
            useNative: this.config.useNativeDrag,
            vertical: this.config.vertical,
            noOverScroll: this.config.vertical
        });

        if (this.$toolbar) {
            this.$growables = this.$toolbar.querySelectorAll('.form-control.is-growable');
            this.$growables.forEach((el) => {
                this.listen('focus', el, this.onGrowableFocus);
                this.listen('blur', el, this.onGrowableFocus);
            });
        }
    }

    disconnect() {
        $(this.element).dragScroll('dispose');
        this.$toolbar = null;
        this.$growables = null;
    }

    onGrowableFocus() {
        $(window).trigger('resize');
    }
}
