/*
 * Drag Scroll control
 *
 * Makes containers drag/scrollable with overflow indicators.
 *
 * Data attributes:
 * - data-control="drag-scroll" - enables the drag scroll plugin
 *
 * Config:
 * - noDragSupport - disables drag support, leaving only mouse wheel support
 * - useNativeDrag - if native CSS is enabled via "mobile" on the HTML tag
 * - vertical - enables vertical scrolling mode
 */
import { ControlBase } from 'larajax';

const $ = window.jQuery;

export default class DragScrollControl extends ControlBase {
    init() {
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
    }

    disconnect() {
        $(this.element).dragScroll('dispose');
    }
}