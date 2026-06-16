/*
 * DragScroll
 *
 * Allows to scroll an element content in the horizontal or vertical directions. This script
 * doesn't use absolute positioning and relies on the scrollLeft/scrollTop DHTML properties.
 * The element width should be fixed with the CSS or JavaScript.
 *
 * Events triggered on the element:
 * - start.oc.dragScroll
 * - drag.oc.dragScroll
 * - stop.oc.dragScroll
 *
 * Options:
 * - start - callback function to execute when the drag starts
 * - drag - callback function to execute when the element is dragged
 * - stop - callback function to execute when the drag ends
 * - vertical - determines if the scroll direction is vertical, true by default
 * - scrollClassContainer - if specified, specifies an element or element selector to apply the
 *   'scroll-before' and 'scroll-after' CSS classes, depending on whether the scrollable area is
 *   in its start or end
 * - scrollMarkerContainer - if specified, specifies an element or element selector to inject scroll
 *   markers (span elements that contain the ellipses icon, indicating whether scrolling is possible)
 * - useDrag - determines if dragging is allowed, true by default
 * - useNative - if native CSS is enabled via "mobile" on the HTML tag, false by default
 * - useScroll - determines if mouse wheel scrolling is allowed, true by default
 * - useComboScroll - determines if horizontal scroll should act as vertical, and vice versa, true by default
 * - dragSelector - restrict drag events to this selector
 * - scrollSelector - restrict scroll events to this selector
 *
 * Methods:
 * - dispose - clean up the instance
 * - isStart - determines if the scrollable area is in its start (left or top)
 * - isEnd - determines if the scrollable area is in its end (right or bottom)
 * - goToStart - moves the scrollable area to the start (left or top)
 * - goToElement - moves the scrollable area to an element
 * - pause - pauses drag and scroll
 * - resume - resumes drag and scroll
 *
 * Require:
 * - mousewheel/mousewheel
 */
const $ = window.jQuery;

export default class DragScroll {
    static DEFAULTS = {
        vertical: false,
        useDrag: true,
        useScroll: true,
        useNative: false,
        useComboScroll: true,
        scrollClassContainer: false,
        scrollMarkerContainer: false,
        scrollSelector: null,
        dragSelector: null,
        noScrollClasses: false,
        noOverScroll: false,
        dragClass: 'drag',
        start: function() {},
        drag: function() {},
        stop: function() {}
    };

    constructor(element, options) {
        this.options = $.extend({}, DragScroll.DEFAULTS, options);
        this.proxiedMethods = {};
        this.touchDragStarted = false;
        this.onTouchMove = this.handleTouchMove.bind(this);

        var $el = $(element),
            el = $el.get(0),
            self = this,
            eventElementName = this.options.vertical ? 'pageY' : 'pageX',
            isNative = this.options.useNative && $('html').hasClass('mobile');

        this.el = $el;
        this.scrollClassContainer = this.options.scrollClassContainer ? $(this.options.scrollClassContainer) : $el;
        this.isScrollable = true;
        this.dragStart = 0;
        this.startOffset = 0;
        this.dragging = false;
        this.eventElementName = eventElementName;
        this.isNative = isNative;

        // Inject scroll markers
        if (this.options.scrollMarkerContainer) {
            $(this.options.scrollMarkerContainer).append(
                $('<span class="before scroll-marker"></span><span class="after scroll-marker"></span>')
            );
        }

        // Bind events
        var $scrollSelect = this.options.scrollSelector ? $(this.options.scrollSelector, $el) : $el;

        $scrollSelect.mousewheel(function(event) {
            if (!self.options.useScroll || self.paused) {
                return;
            }

            var offset,
                offsetX = event.deltaFactor * event.deltaX,
                offsetY = event.deltaFactor * event.deltaY;

            if (!offsetX && self.options.useComboScroll) {
                offset = offsetY * -1;
            }
            else if (!offsetY && self.options.useComboScroll) {
                offset = offsetX;
            }
            else {
                offset = self.options.vertical ? offsetY * -1 : offsetX;
            }

            var scrolled = self.scrollWheel(offset);
            if (!scrolled && self.options.noOverScroll) {
                event.preventDefault();
                event.stopPropagation();
            }

            return !scrolled;
        });

        if (this.options.useDrag) {
            $el.on('mousedown.dragScroll', this.options.dragSelector, function(event) {
                if (self.paused) {
                    return;
                }

                // Don't prevent clicking inputs in the toolbar
                if (event.target && event.target.tagName === 'INPUT') {
                    return;
                }

                if (!self.isScrollable) {
                    return;
                }

                self.startDrag(event);
                return false;
            });
        }

        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            $el.on('touchstart.dragScroll', this.options.dragSelector, function(event) {
                if (self.paused) {
                    return;
                }

                var touchEvent = event.originalEvent;

                if (touchEvent.touches.length == 1) {
                    self.startDrag(touchEvent.touches[0]);
                    self.touchDragStarted = true;

                    event.stopPropagation();
                }
            });

            window.addEventListener('touchmove', self.onTouchMove, { passive: false });
        }

        $el.on('click.dragScroll', function() {
            // Do not handle item clicks while dragging
            if ($(document.body).hasClass(self.options.dragClass)) {
                return false;
            }
        });

        if (!this.options.noScrollClasses) {
            $(document).on('ready', this.proxy(this.fixScrollClasses));
            $(window).on('resize', this.proxy(this.fixScrollClasses));
            this.el.on('scroll', this.proxy(this.fixScrollClasses));
        }

        this.fixScrollClasses();
    }

    dispose() {
        clearTimeout(this.fixScrollClassesIntervalId);

        this.scrollClassContainer = null;

        if (!this.options.noScrollClasses) {
            $(document).off('ready', this.proxy(this.fixScrollClasses));
            $(window).off('resize', this.proxy(this.fixScrollClasses));
            this.el.off('scroll', this.proxy(this.fixScrollClasses));
        }

        this.el.off('.dragScroll');

        this.el.removeData('oc.dragScroll');
        window.removeEventListener('touchmove', this.onTouchMove, { passive: false });

        this.el = null;

        for (var key in this.proxiedMethods) {
            this.proxiedMethods[key] = null;
        }
        this.proxiedMethods = null;
    }

    // Internal

    startDrag(event) {
        if (this.paused) {
            return;
        }

        var self = this,
            $el = this.el;

        this.dragStart = event[this.eventElementName];
        this.startOffset = this.options.vertical ? $el.scrollTop() : $el.scrollLeft();

        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            $(window).on('touchend.dragScroll', function(event) {
                self.stopDrag();
            });
        }

        $(window).on('mousemove.dragScroll', function(event) {
            self.moveDrag(event);
            return false;
        });

        $(window).on('mouseup.dragScroll', function(mouseUpEvent) {
            var isClick = event.pageX == mouseUpEvent.pageX && event.pageY == mouseUpEvent.pageY;
            self.stopDrag(isClick);
            return false;
        });
    }

    handleTouchMove(event) {
        if (!this.touchDragStarted) {
            return;
        }

        var touchEvent = event;
        this.moveDrag(touchEvent.touches[0]);
        if (!this.isNative) {
            event.preventDefault();
        }
    }

    moveDrag(event) {
        var current = event[this.eventElementName],
            offset = this.dragStart - current,
            $el = this.el;

        if (Math.abs(offset) > 3) {
            if (!this.dragging) {
                this.dragging = true;
                $el.trigger('start.oc.dragScroll');
                this.options.start();
                $(document.body).addClass(this.options.dragClass);
            }

            if (!this.isNative) {
                this.options.vertical ? $el.scrollTop(this.startOffset + offset) : $el.scrollLeft(this.startOffset + offset);
            }

            this.fixScrollClasses(true);

            $el.trigger('drag.oc.dragScroll');
            this.options.drag();
        }
    }

    stopDrag(click) {
        var self = this,
            $el = this.el;

        $(window).off('.dragScroll');
        this.touchDragStarted = false;

        this.dragging = false;

        if (click) {
            $(document.body).removeClass(this.options.dragClass);
        }
        else {
            this.fixScrollClasses();
        }

        window.setTimeout(function() {
            if (!click) {
                $(document.body).removeClass(self.options.dragClass);
                $el.trigger('stop.oc.dragScroll');
                self.options.stop();
                self.fixScrollClasses();
            }
        }, 100);
    }

    scrollWheel(offset) {
        if (this.paused) {
            return;
        }

        var el = this.el.get(0),
            $el = this.el;

        this.startOffset = this.options.vertical ? el.scrollTop : el.scrollLeft;

        this.options.vertical ? $el.scrollTop(this.startOffset + offset) : $el.scrollLeft(this.startOffset + offset);

        var scrolled = this.options.vertical ? el.scrollTop != this.startOffset : el.scrollLeft != this.startOffset;

        $el.trigger('drag.oc.dragScroll');
        this.options.drag();

        if (scrolled) {
            if (this.wheelUpdateTimer !== undefined && this.wheelUpdateTimer !== false) {
                window.clearInterval(this.wheelUpdateTimer);
            }

            var self = this;
            this.wheelUpdateTimer = window.setTimeout(function() {
                self.wheelUpdateTimer = false;
                self.fixScrollClasses();
            }, 100);
        }

        return scrolled;
    }

    // Public

    fixScrollClasses(isThrottle) {
        if (this.options.noScrollClasses) {
            return;
        }

        if (this.fixScrollClassesIntervalId) {
            if (isThrottle) {
                return;
            }

            clearTimeout(this.fixScrollClassesIntervalId);
            this.fixScrollClassesIntervalId = null;
        }

        var self = this;
        this.fixScrollClassesIntervalId = window.setTimeout(function() {
            self.fixScrollClassesIntervalId = null;

            var isStart = self.isStart(),
                isEnd = self.isEnd();

            self.scrollClassContainer.toggleClass('scroll-before', !isStart);
            self.scrollClassContainer.toggleClass('scroll-after', !isEnd);

            self.scrollClassContainer.toggleClass('scroll-active-before', self.isActiveBefore());
            self.scrollClassContainer.toggleClass('scroll-active-after', self.isActiveAfter());
            self.isScrollable = !isStart || !isEnd;
        }, 30);
    }

    isStart() {
        if (!this.options.vertical) {
            return this.el.scrollLeft() <= 0;
        }
        else {
            return this.el.scrollTop() <= 0;
        }
    }

    isEnd() {
        // Fudge factor for retina displays
        var offset = 1;

        if (!this.options.vertical) {
            return this.el[0].scrollWidth - (this.el.scrollLeft() + this.el.outerWidth()) - offset <= 0;
        }
        else {
            return this.el[0].scrollHeight - (this.el.scrollTop() + this.el.outerHeight()) - offset <= 0;
        }
    }

    goToStart() {
        if (!this.options.vertical) {
            return this.el.scrollLeft(0);
        }
        else {
            return this.el.scrollTop(0);
        }
    }

    /*
     * Determines if the element with the class 'active' is hidden after the viewport -
     * on the right or on the bottom.
     */
    isActiveAfter() {
        var activeElement = $('.active', this.el);
        if (activeElement.length == 0) {
            return false;
        }

        if (!this.options.vertical) {
            return activeElement.get(0).offsetLeft > this.el.scrollLeft() + this.el.width();
        }
        else {
            return activeElement.get(0).offsetTop > this.el.scrollTop() + this.el.height();
        }
    }

    /*
     * Determines if the element with the class 'active' is hidden before the viewport -
     * on the left or on the top.
     */
    isActiveBefore() {
        var activeElement = $('.active', this.el);
        if (activeElement.length == 0) {
            return false;
        }

        if (!this.options.vertical) {
            return activeElement.get(0).offsetLeft + activeElement.width() < this.el.scrollLeft();
        }
        else {
            return activeElement.get(0).offsetTop + activeElement.height() < this.el.scrollTop();
        }
    }

    goToElement(element, callback, options) {
        var $el = $(element);
        if (!$el.length) return;

        var self = this,
            params = {
                duration: 300,
                queue: false,
                complete: function() {
                    self.fixScrollClasses();
                    if (callback !== undefined) callback();
                }
            };

        params = $.extend(params, options || {});

        var offset = 0,
            animated = false;

        if (!this.options.vertical) {
            offset = $el.get(0).offsetLeft - this.el.scrollLeft();

            if (offset < 0) {
                this.el.animate({ scrollLeft: $el.get(0).offsetLeft }, params);
                animated = true;
            }
            else {
                offset = $el.get(0).offsetLeft + $el.width() - (this.el.scrollLeft() + this.el.width());
                if (offset > 0) {
                    this.el.animate({ scrollLeft: $el.get(0).offsetLeft + $el.width() - this.el.width() }, params);
                    animated = true;
                }
            }
        }
        else {
            offset = $el.get(0).offsetTop - this.el.scrollTop();

            if (offset < 0) {
                this.el.animate({ scrollTop: $el.get(0).offsetTop }, params);
                animated = true;
            }
            else {
                var heightOffset = 0;
                if (params.alignBottom) {
                    heightOffset = $el.height();
                }

                offset = $el.get(0).offsetTop + heightOffset - (this.el.scrollTop() + this.el.height());
                if (offset > 0) {
                    this.el.animate(
                        { scrollTop: $el.get(0).offsetTop + $el.height() - this.el.height() + heightOffset },
                        params
                    );
                    animated = true;
                }
            }
        }

        if (!animated && callback !== undefined) {
            callback();
        }
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    // Proxy

    proxy(method) {
        if (method.ocProxyId === undefined) {
            DragScroll.proxyCounter++;
            method.ocProxyId = DragScroll.proxyCounter;
        }

        if (this.proxiedMethods[method.ocProxyId] !== undefined) {
            return this.proxiedMethods[method.ocProxyId];
        }

        this.proxiedMethods[method.ocProxyId] = method.bind(this);
        return this.proxiedMethods[method.ocProxyId];
    }
}

DragScroll.proxyCounter = 0;
