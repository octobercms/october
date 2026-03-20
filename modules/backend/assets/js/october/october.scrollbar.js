/*
 * Creates a scrollbar in a container.
 *
 * Note the element must have a height set for vertical,
 * and a width set for horizontal.
 *
 * Data attributes:
 * - data-control="scrollbar" - enables the scrollbar plugin
 *
 * jQuery API:
 * $('#area').scrollbar()
 */

'use strict';

oc.registerControl('scrollbar', class extends oc.ControlBase {
    init() {
        this.el = this.element;
        this.options = Object.assign({
            vertical: true,
            scrollSpeed: 2,
            animation: true
        }, this.config);

        this.isNative = document.documentElement.classList.contains('mobile');
        this.isTouch = 'ontouchstart' in window;
        this.isScrollable = false;
        this.isLocked = false;
        this.dragStart = 0;
        this.startOffset = 0;
        this.eventElementName = this.options.vertical ? 'pageY' : 'pageX';

        // @deprecated backwards compatibility
        $(this.el).data('oc.scrollbar', this);

        // Use native scrolling on mobile
        if (this.isNative) {
            return;
        }

        this.createScrollbar();
    }

    connect() {
        if (this.isNative) {
            return;
        }

        this.attachEventHandlers();
        this.update();

        // Dispatch a ready event
        setTimeout(() => {
            oc.Events.dispatch('scrollbar:ready', { target: this.el });
        }, 1);
    }

    disconnect() {
        if (this.isNative) {
            return;
        }

        window.removeEventListener('resize', this.proxy(this.update));
        this.el.removeEventListener('wheel', this.proxy(this.onScrollWheel));
        this.el.removeEventListener('scrollbar:goto-start', this.proxy(this.gotoStart));
    }

    createScrollbar() {
        this.scrollbar = document.createElement('div');
        this.scrollbar.className = 'scrollbar-scrollbar';

        this.track = document.createElement('div');
        this.track.className = 'scrollbar-track';

        this.thumb = document.createElement('div');
        this.thumb.className = 'scrollbar-thumb';

        this.track.appendChild(this.thumb);
        this.scrollbar.appendChild(this.track);
        this.el.classList.add('drag-scrollbar', this.options.vertical ? 'vertical' : 'horizontal');
        this.el.prepend(this.scrollbar);
    }

    attachEventHandlers() {
        if (this.isTouch) {
            this.el.addEventListener('touchstart', this.proxy(this.onTouchStart));
        } else {
            this.thumb.addEventListener('mousedown', this.proxy(this.onDragStart));
            this.track.addEventListener('mouseup', this.proxy(this.onTrackClick));
        }

        this.el.addEventListener('wheel', this.proxy(this.onScrollWheel));
        this.el.addEventListener('scrollbar:goto-start', this.proxy(this.gotoStart));
        window.addEventListener('resize', this.proxy(this.update));
    }

    onTouchStart(event) {
        if (event.touches.length === 1) {
            this.startDrag(event.touches[0]);
            event.stopPropagation();
        }
    }

    onDragStart(event) {
        this.startDrag(event);
    }

    onTrackClick(event) {
        this.moveDrag(event);
    }

    onScrollWheel(event) {
        if (!this.isScrollable) {
            return;
        }

        let offset = this.options.vertical
            ? (event.deltaY || 0)
            : (event.deltaX || 0);

        this.scrollWheel(offset * this.options.scrollSpeed);
        event.preventDefault();
    }

    startDrag(event) {
        document.body.classList.add('drag-noselect');
        oc.Events.dispatch('scrollbar:scroll-start', { target: this.el });

        this.dragStart = event[this.eventElementName];
        this.startOffset = this.options.vertical ? this.el.scrollTop : this.el.scrollLeft;

        if (this.isTouch) {
            window.addEventListener('touchmove', this.proxy(this.moveDrag));
            this.el.addEventListener('touchend', this.proxy(this.stopDrag));
        } else {
            window.addEventListener('mousemove', this.proxy(this.moveDrag));
            window.addEventListener('mouseup', this.proxy(this.stopDrag));
        }
    }

    moveDrag(event) {
        this.isLocked = true;

        let offset,
            dragTo = event[this.eventElementName];

        if (this.isTouch) {
            offset = this.dragStart - dragTo;
        } else {
            let ratio = this.getCanvasSize() / this.getViewportSize();
            offset = (dragTo - this.dragStart) * ratio;
        }

        if (this.options.vertical) {
            this.el.scrollTop = this.startOffset + offset;
        } else {
            this.el.scrollLeft = this.startOffset + offset;
        }

        this.setThumbPosition();
        return true;
    }

    stopDrag() {
        document.body.classList.remove('drag-noselect');
        oc.Events.dispatch('scrollbar:scroll-end', { target: this.el });

        window.removeEventListener('mousemove', this.proxy(this.moveDrag));
        window.removeEventListener('mouseup', this.proxy(this.stopDrag));
    }

    scrollWheel(offset) {
        this.startOffset = this.options.vertical ? this.el.scrollTop : this.el.scrollLeft;
        oc.Events.dispatch('scrollbar:scroll-start', { target: this.el });

        if (this.options.vertical) {
            this.el.scrollTop += offset;
        } else {
            this.el.scrollLeft += offset;
        }

        this.setThumbPosition();
        oc.Events.dispatch('scrollbar:scroll-end', { target: this.el });

        return true;
    }

    update() {
        if (!this.scrollbar) {
            return;
        }

        this.scrollbar.style.display = 'none';
        this.setThumbSize();
        this.setThumbPosition();
        this.scrollbar.style.display = 'block';
    }

    setThumbSize() {
        let properties = this.calculateProperties();

        this.isScrollable = properties.thumbSizeRatio < 1;
        this.scrollbar.classList.toggle('disabled', !this.isScrollable);

        if (this.options.vertical) {
            this.track.style.height = `${properties.canvasSize}px`;
            this.thumb.style.height = `${properties.thumbSize}px`;
        } else {
            this.track.style.width = `${properties.canvasSize}px`;
            this.thumb.style.width = `${properties.thumbSize}px`;
        }
    }

    setThumbPosition() {
        let properties = this.calculateProperties();

        if (this.options.vertical) {
            this.thumb.style.top = `${properties.thumbPosition}px`;
        } else {
            this.thumb.style.left = `${properties.thumbPosition}px`;
        }
    }

    calculateProperties() {
        let viewportSize = this.getViewportSize();
        let canvasSize = this.getCanvasSize();
        let scrollAmount = this.options.vertical ? this.el.scrollTop : this.el.scrollLeft;

        let offset = 1;
        let thumbSizeRatio = viewportSize / (canvasSize - offset);
        let thumbSize = viewportSize * thumbSizeRatio;
        let thumbPositionRatio = scrollAmount / (canvasSize - viewportSize);
        let thumbPosition = ((viewportSize - thumbSize) * thumbPositionRatio) + scrollAmount;

        return { viewportSize, canvasSize, scrollAmount, thumbSizeRatio, thumbSize, thumbPosition };
    }

    getViewportSize() {
        return this.options.vertical ? this.el.clientHeight : this.el.clientWidth;
    }

    getCanvasSize() {
        return this.options.vertical ? this.el.scrollHeight : this.el.scrollWidth;
    }

    gotoStart() {
        if (this.options.vertical) {
            this.el.scrollTop = 0;
        } else {
            this.el.scrollLeft = 0;
        }
        this.update();
    }

    gotoElement(element, callback) {
        // @deprecated jQuery
        if (element && element.jquery) {
            element = element.get(0);
        }

        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) {
            return;
        }

        const isVertical = this.options.vertical;
        const scrollProp = isVertical ? 'scrollTop' : 'scrollLeft';
        const offsetProp = isVertical ? 'offsetTop' : 'offsetLeft';
        const sizeProp = isVertical ? 'offsetHeight' : 'offsetWidth';
        const containerSizeProp = isVertical ? 'clientHeight' : 'clientWidth';
        const containerScrollProp = isVertical ? 'scrollHeight' : 'scrollWidth';

        let targetPosition = target[offsetProp];
        let maxScroll = targetPosition;

        // Ensure we do not scroll beyond container limits
        maxScroll = Math.max(0, Math.min(maxScroll, this.el[containerScrollProp] - this.el[containerSizeProp]));

        if (this.options.animation) {
            this.smoothScrollTo(scrollProp, maxScroll, {
                duration: 300,
                complete: () => {
                    this.setThumbPosition();
                    if (callback) {
                        callback();
                    }
                }
            });
        } else {
            this.el[scrollProp] = maxScroll;
            this.setThumbPosition();
            if (callback) {
                callback();
            }
        }

        return this;
    }

    // Helper function for smooth scrolling
    smoothScrollTo(property, value, params) {
        const start = this.el[property];
        const change = value - start;
        const startTime = performance.now();
        const duration = params.duration || 300;

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            this.el[property] = start + change * progress;

            if (elapsed < duration) {
                requestAnimationFrame(animateScroll);
            } else if (params.complete) {
                params.complete();
            }
        };

        requestAnimationFrame(animateScroll);
    }


    // @deprecated this control disposes itself
    dispose() {}
});

// jQuery Plugin Definition (For Backwards Compatibility)
$.fn.scrollbar = function (config) {
    this.each((index, element) => {
        config = config || {};
        for (const key in config) {
            if (key.startsWith('scroll')) {
                element.dataset[key] = config[key];
            }
        }

        if (!element.matches('[data-control~="scrollbar"]')) {
            element.dataset.control = ((element.dataset.control || '') + ' scrollbar').trim();
        }
    });
};
