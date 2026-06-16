/*
 * Popover Control
 *
 * Renders a rich popover with content, positioning, modal overlay, and animation.
 *
 * - Documentation: ./README.md
 */

const $ = window.jQuery;

export default class PopoverControl
{
    constructor(element, options) {
        this.el = element;
        this.$el = $(element);
        this.options = Object.assign({}, PopoverControl.DEFAULTS, options);
        this.arrowSize = 15;
        this.docClickHandler = null;
        this.resizeHandler = null;
        this.container = null;
        this.overlay = null;
        this.show();
    }

    hide() {
        var e = $.Event('hiding.oc.popover', { relatedTarget: this.$el });
        this.$el.trigger(e, this);

        if (e.isDefaultPrevented()) {
            return;
        }

        this.container.classList.remove('show');

        if (this.options.modal) {
            this.overlay.classList.remove('show');
        }

        this.disposeControls();

        if (this.container.classList.contains('fade')) {
            this.container.addEventListener('transitionend', () => this.hidePopover(), { once: true });
        }
        else {
            this.hidePopover();
        }
    }

    disposeControls() {
        if (this.container) {
            $.oc.foundation.controlUtils.disposeControls(this.container);
        }
    }

    hidePopover() {
        if (this.container && this.container.parentNode) {
            this.container.remove();
        }

        if (this.overlay && this.overlay.parentNode) {
            this.overlay.remove();
        }

        this.el.classList.remove('popover-highlight');
        this.$el.trigger('hide.oc.popover');

        this.overlay = null;
        this.container = null;

        this.$el.data('oc.popover', null);
        document.body.classList.remove('popover-open');

        if (this.docClickHandler) {
            document.removeEventListener('mousedown', this.docClickHandler);
            this.docClickHandler = null;
        }

        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = null;
        }

        document.removeEventListener('keyup', this.escHandler);
        this.options.onCheckDocumentClickTarget = null;
    }

    show() {
        // Trigger the show event
        var e = $.Event('showing.oc.popover', { relatedTarget: this.$el });
        this.$el.trigger(e, this);
        if (e.isDefaultPrevented()) {
            return;
        }

        // Create the popover container and overlay
        this.container = document.createElement('div');
        this.$container = $(this.container);
        this.container.classList.add('control-popover');

        if (this.options.containerClass) {
            this.options.containerClass.split(' ').forEach(cls => {
                if (cls) this.container.classList.add(cls);
            });
        }

        if (this.options.useAnimation) {
            this.container.classList.add('fade');
        }

        const contentWrapper = document.createElement('div');
        contentWrapper.innerHTML = this.getContent();
        this.container.appendChild(contentWrapper);

        if (this.options.width) {
            this.container.style.width = this.options.width + 'px';
        }

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.classList.add('popover-overlay');
        document.body.appendChild(this.overlay);

        if (this.options.highlightModalTarget) {
            this.el.classList.add('popover-highlight');
            this.el.blur();
        }

        if (this.options.container) {
            const containerEl = typeof this.options.container === 'string'
                ? document.querySelector(this.options.container)
                : this.options.container;
            if (containerEl) {
                containerEl.appendChild(this.container);
            }
        }
        else {
            document.body.appendChild(this.container);
        }

        // Determine the popover position
        this.reposition();

        this.resizeHandler = () => {
            if (this.container) {
                this.reposition();
            }
        };
        window.addEventListener('resize', this.resizeHandler);

        // Display the popover
        this.container.classList.add('show');
        if (this.options.modal) {
            this.overlay.classList.add('show');
        }

        document.body.classList.add('popover-open');
        var showEvent = $.Event('show.oc.popover', { relatedTarget: this.container });
        this.$el.trigger(showEvent);

        // Autofocus
        const autofocusEl = this.container.querySelector('[data-popover-autofocus]');
        if (autofocusEl) {
            autofocusEl.focus();
        }

        // Bind events
        this.container.addEventListener('close.oc.popover', () => this.hide());

        this.container.addEventListener('click', (e) => {
            if (e.target.closest('[data-dismiss=popover]')) {
                this.hide();
                e.preventDefault();
                e.stopPropagation();
            }
        });

        this.docClickHandler = (e) => this.onDocumentClick(e);
        document.addEventListener('mousedown', this.docClickHandler);

        this.escHandler = (e) => {
            if (!this.options.closeOnEsc) {
                return;
            }

            if (e.target.classList && e.target.classList.contains('select2-offscreen')) {
                return;
            }

            if (e.key === 'Escape') {
                this.hide();
                e.preventDefault();
                e.stopPropagation();
            }
        };

        if (this.options.closeOnEsc) {
            document.addEventListener('keyup', this.escHandler);
        }
    }

    reposition() {
        const placement = this.calcPlacement();
        const position = this.calcPosition(placement);

        this.container.classList.remove('placement-center', 'placement-bottom', 'placement-top', 'placement-left', 'placement-right');
        this.container.style.left = position.x + 'px';
        this.container.style.top = position.y + 'px';
        this.container.classList.add('placement-' + placement);
    }

    getContainer() {
        return this.container;
    }

    getContent() {
        if (this.options.contentFrom) {
            const sourceEl = document.querySelector(this.options.contentFrom);
            return sourceEl ? sourceEl.innerHTML : '';
        }

        if (typeof this.options.content === 'function') {
            return this.options.content.call(this.el, this);
        }

        return this.options.content;
    }

    calcDimensions() {
        const targetRect = this.el.getBoundingClientRect();
        const scrollLeft = window.scrollX;
        const scrollTop = window.scrollY;
        const documentWidth = document.documentElement.scrollWidth;
        const documentHeight = document.documentElement.scrollHeight;
        const targetOffset = {
            left: targetRect.left + scrollLeft,
            top: targetRect.top + scrollTop
        };
        const targetWidth = this.el.offsetWidth;
        const targetHeight = this.el.offsetHeight;

        return {
            containerWidth: this.container.offsetWidth + this.arrowSize,
            containerHeight: this.container.offsetHeight + this.arrowSize,
            targetOffset: targetOffset,
            targetHeight: targetHeight,
            targetWidth: targetWidth,
            spaceLeft: targetOffset.left,
            spaceRight: documentWidth - (targetWidth + targetOffset.left),
            spaceTop: targetOffset.top,
            spaceBottom: documentHeight - (targetHeight + targetOffset.top),
            spaceHorizontalBottom: documentHeight - targetOffset.top,
            spaceVerticalRight: documentWidth - targetOffset.left,
            documentWidth: documentWidth
        };
    }

    fitsLeft(dimensions) {
        return dimensions.spaceLeft >= dimensions.containerWidth &&
            dimensions.spaceHorizontalBottom >= dimensions.containerHeight;
    }

    fitsRight(dimensions) {
        return dimensions.spaceRight >= dimensions.containerWidth &&
            dimensions.spaceHorizontalBottom >= dimensions.containerHeight;
    }

    fitsBottom(dimensions) {
        return dimensions.spaceBottom >= dimensions.containerHeight &&
            dimensions.spaceVerticalRight >= dimensions.containerWidth;
    }

    fitsTop(dimensions) {
        return dimensions.spaceTop >= dimensions.containerHeight &&
            dimensions.spaceVerticalRight >= dimensions.containerWidth;
    }

    calcPlacement() {
        let placement = this.options.placement;
        const dimensions = this.calcDimensions();

        if (placement === 'center') {
            return placement;
        }

        if (!['bottom', 'top', 'left', 'right'].includes(placement)) {
            placement = 'bottom';
        }

        const placementFunctions = {
            top: (d) => this.fitsTop(d),
            bottom: (d) => this.fitsBottom(d),
            left: (d) => this.fitsLeft(d),
            right: (d) => this.fitsRight(d)
        };

        if (placementFunctions[placement](dimensions)) {
            return placement;
        }

        for (const key in placementFunctions) {
            if (placementFunctions[key](dimensions)) {
                return key;
            }
        }

        return this.options.fallbackPlacement;
    }

    calcPosition(placement) {
        const dimensions = this.calcDimensions();
        let result;

        switch (placement) {
            case 'left': {
                const realOffset = this.options.offsetY !== undefined ? this.options.offsetY : this.options.offset;
                result = { x: dimensions.targetOffset.left - dimensions.containerWidth, y: dimensions.targetOffset.top + realOffset };
                break;
            }
            case 'top': {
                const realOffset = this.options.offsetX !== undefined ? this.options.offsetX : this.options.offset;
                result = { x: dimensions.targetOffset.left + realOffset, y: dimensions.targetOffset.top - dimensions.containerHeight };
                break;
            }
            case 'bottom': {
                const realOffset = this.options.offsetX !== undefined ? this.options.offsetX : this.options.offset;
                result = { x: dimensions.targetOffset.left + realOffset, y: dimensions.targetOffset.top + dimensions.targetHeight + this.arrowSize };
                break;
            }
            case 'right': {
                const realOffset = this.options.offsetY !== undefined ? this.options.offsetY : this.options.offset;
                result = { x: dimensions.targetOffset.left + dimensions.targetWidth + this.arrowSize, y: dimensions.targetOffset.top + realOffset };
                break;
            }
            case 'center': {
                const windowHeight = window.innerHeight;
                result = { x: dimensions.documentWidth / 2 - dimensions.containerWidth / 2, y: windowHeight / 2 - dimensions.containerHeight / 2 };
                if (result.y < 40) {
                    result.y = 40;
                }
                break;
            }
        }

        if (!this.options.container) {
            return result;
        }

        const containerEl = typeof this.options.container === 'string'
            ? document.querySelector(this.options.container)
            : this.options.container;

        if (containerEl) {
            const containerRect = containerEl.getBoundingClientRect();
            const scrollLeft = window.scrollX;
            const scrollTop = window.scrollY;
            result.x -= containerRect.left + scrollLeft;
            result.y -= containerRect.top + scrollTop;
        }

        return result;
    }

    onDocumentClick(e) {
        if (!this.options.closeOnPageClick) {
            return;
        }

        if (this.options.onCheckDocumentClickTarget && this.options.onCheckDocumentClickTarget(e.target)) {
            return;
        }

        if (this.container && this.container.contains(e.target)) {
            return;
        }

        this.hide();
    }
}

PopoverControl.DEFAULTS = {
    placement: 'bottom',
    fallbackPlacement: 'bottom',
    content: '<p>Popover content<p>',
    contentFrom: null,
    width: false,
    modal: false,
    highlightModalTarget: false,
    closeOnPageClick: true,
    closeOnEsc: true,
    container: false,
    containerClass: null,
    offset: 15,
    useAnimation: false,
    onCheckDocumentClickTarget: null
};

// JQUERY PLUGIN DEFINITION
// ============================

var old = $.fn.ocPopover;

$.fn.ocPopover = function (option) {
    var args = Array.prototype.slice.call(arguments, 1), result;

    this.each(function () {
        var $this = $(this);
        var data = $this.data('oc.popover');
        var options = Object.assign({}, PopoverControl.DEFAULTS, $this.data(), typeof option === 'object' && option);
        if (!data) $this.data('oc.popover', (data = new PopoverControl(this, options)));
        if (typeof option === 'string') result = data[option].apply(data, args);
        if (typeof result !== 'undefined') return false;
    });

    return result ? result : this;
};

$.fn.ocPopover.Constructor = PopoverControl;

// POPOVER NO CONFLICT
// =================

$.fn.ocPopover.noConflict = function () {
    $.fn.ocPopover = old;
    return this;
};

// POPOVER DATA-API
// ===============

$(document).on('click', '[data-control=popover]', function(e) {
    $(this).ocPopover();
    return false;
});