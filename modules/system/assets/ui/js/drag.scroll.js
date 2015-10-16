/*
 * Allows to scroll an element content in the horizontal or horizontal directions. This script doesn't use
 * absolute positioning and rely on the scrollLeft/scrollTop DHTML properties. The element width should be
 * fixed with the CSS or JavaScript.
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
 * - allowScroll - determines if the mouse wheel scrolling is allowed, true by default
 * - scrollClassContainer - if specified, specifies an element or element selector to apply the 'scroll-before' and 'scroll-after' CSS classes,
 *   depending on whether the scrollable area is in its start or end
 * - scrollMarkerContainer - if specified, specifies an element or element selector to inject scroll markers (span elements that con 
 *   contain the ellipses icon, indicating whether scrolling is possible)
 * - noDragSupport - disables the drag support, leaving only the mouse wheel support
 * 
 * Methods:
 * - isStart - determines if the scrollable area is in its start (left or top)
 * - isEnd - determines if the scrollable area is in its end (right or bottom)
 * - goToStart - moves the scrollable area to the start (left or top)
 * - goToElement - moves the scrollable area to an element
 *
 * Require:
 * - modernizr/modernizr
 * - mousewheel/mousewheel
 */
+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var DragScroll = function (element, options) {
        this.options = $.extend({}, DragScroll.DEFAULTS, options)

        var
            $el = $(element),
            el = $el.get(0),
            dragStart = 0,
            startOffset = 0,
            self = this,
            dragging = false,
            eventElementName = this.options.vertical ? 'pageY' : 'pageX';

        this.el = $el
        this.scrollClassContainer = this.options.scrollClassContainer ? $(this.options.scrollClassContainer) : $el

        Base.call(this)

        /*
         * Inject scroll markers
         */
        if (this.options.scrollMarkerContainer) {
            $(this.options.scrollMarkerContainer)
                .append($('<span class="before scroll-marker"></span><span class="after scroll-marker"></span>'))
        }

        /*
         * Bind events
         */
        $el.mousewheel(function(event){
            if (!self.options.allowScroll)
                return;

            var offset = self.options.vertical
                ? ((event.deltaFactor * event.deltaY) * -1)
                : (event.deltaFactor * event.deltaX)

            return !scrollWheel(offset)
        })

        if (!options.noDragSupport) {
            $el.on('mousedown.dragScroll', function(event){
                if (event.target && event.target.tagName === 'INPUT')
                    return // Don't prevent clicking inputs in the toolbar

                startDrag(event)
                return false
            })
        }

        $el.on('touchstart.dragScroll', function(event){
            var touchEvent = event.originalEvent;
            if (touchEvent.touches.length == 1) {
                startDrag(touchEvent.touches[0])
                event.stopPropagation()
            }
        })

        $el.on('click.dragScroll', function() {
            // Do not handle item clicks while dragging
            if ($(document.body).hasClass('drag'))
                return false
        })

        $(document).on('ready', this.proxy(this.fixScrollClasses))
        $(window).on('resize', this.proxy(this.fixScrollClasses))

        /*
         * Internal event, drag has started
         */
        function startDrag(event) {
            dragStart = event[eventElementName]
            startOffset = self.options.vertical ? $el.scrollTop() : $el.scrollLeft()

            if (Modernizr.touch) {
                $(window).on('touchmove.dragScroll', function(event){
                    var touchEvent = event.originalEvent
                    moveDrag(touchEvent.touches[0])
                    event.preventDefault()
                })

                $(window).on('touchend.dragScroll', function(event) {
                    stopDrag()
                })
            }
            else {
                $(window).on('mousemove.dragScroll', function(event){
                    moveDrag(event)
                    $(document.body).addClass(self.options.dragClass)
                    return false
                })
                
                $(window).on('mouseup.dragScroll', function(mouseUpEvent){
                    var isClick = event.pageX == mouseUpEvent.pageX && event.pageY == mouseUpEvent.pageY
                    stopDrag(isClick)
                    return false
                })
            }
        }

        /*
         * Internal event, drag is active
         */
        function moveDrag(event) {
            var current = event[eventElementName],
                offset = dragStart - current

            if (Math.abs(offset) > 2) {
                if (!dragging) {
                    dragging = true
                    $el.trigger('start.oc.dragScroll')
                    self.options.start();
                }

                self.options.vertical
                    ? $el.scrollTop(startOffset + offset)
                    : $el.scrollLeft(startOffset + offset)

                $el.trigger('drag.oc.dragScroll')
                self.options.drag()
            }
        }

        /*
         * Internal event, drag has ended
         */
        function stopDrag(click) {
            $(window).off('.dragScroll')

            dragging = false;

            if (click)
                $(document.body).removeClass(self.options.dragClass)
            else
                self.fixScrollClasses()

            window.setTimeout(function(){
                if (!click) {
                    $(document.body).removeClass(self.options.dragClass)
                    $el.trigger('stop.oc.dragScroll')
                    self.options.stop()
                    self.fixScrollClasses()
                }
            }, 100)
        }

        /*
         * Scroll wheel has moved by supplied offset
         */
        function scrollWheel(offset) {
            startOffset = self.options.vertical ? el.scrollTop : el.scrollLeft

            self.options.vertical
                ? $el.scrollTop(startOffset + offset)
                : $el.scrollLeft(startOffset + offset)

            var scrolled = self.options.vertical
                ? el.scrollTop != startOffset
                : el.scrollLeft != startOffset

            $el.trigger('drag.oc.dragScroll')
            self.options.drag()

            if (scrolled) {
                if (self.wheelUpdateTimer !== undefined && self.wheelUpdateTimer !== false)
                    window.clearInterval(self.wheelUpdateTimer);

                self.wheelUpdateTimer = window.setTimeout(function() {
                    self.wheelUpdateTimer = false;
                    self.fixScrollClasses()
                }, 100);
            }

            return scrolled
        }

        this.fixScrollClasses();
    }

    DragScroll.prototype = Object.create(BaseProto)
    DragScroll.prototype.constructor = DragScroll

    DragScroll.DEFAULTS = {
        vertical: false,
        allowScroll: true,
        scrollClassContainer: false,
        scrollMarkerContainer: false,
        dragClass: 'drag',
        noDragSupport: false,
        start: function() {},
        drag: function() {},
        stop: function() {}
    }

    DragScroll.prototype.fixScrollClasses = function() {
        this.scrollClassContainer.toggleClass('scroll-before', !this.isStart())
        this.scrollClassContainer.toggleClass('scroll-after', !this.isEnd())

        this.scrollClassContainer.toggleClass('scroll-active-before', this.isActiveBefore())
        this.scrollClassContainer.toggleClass('scroll-active-after', this.isActiveAfter())
    }

    DragScroll.prototype.isStart = function() {
        if (!this.options.vertical)
            return this.el.scrollLeft() <= 0;
        else
            return this.el.scrollTop() <= 0;
    }

    DragScroll.prototype.isEnd = function() {
        if (!this.options.vertical)
            return (this.el[0].scrollWidth - (this.el.scrollLeft() + this.el.width())) <= 0
        else
            return (this.el[0].scrollHeight - (this.el.scrollTop() + this.el.height())) <= 0
    }

    DragScroll.prototype.goToStart = function() {
        if (!this.options.vertical)
            return this.el.scrollLeft(0)
        else
            return this.el.scrollTop(0)
    }

    /*
     * Determines if the element with the class 'active' is hidden before the viewport -
     * on the left or on the top, depending on whether the scrollbar is horizontal or vertical.
     */
    DragScroll.prototype.isActiveAfter = function() {
        var activeElement = $('.active', this.el);
        if (activeElement.length == 0)
            return false

        if (!this.options.vertical)
            return activeElement.get(0).offsetLeft > (this.el.scrollLeft() + this.el.width())
        else
            return activeElement.get(0).offsetTop > (this.el.scrollTop() + this.el.height())
    }

    /*
     * Determines if the element with the class 'active' is hidden after the viewport -
     * on the right or on the bottom, depending on whether the scrollbar is horizontal or vertical.
     */
    DragScroll.prototype.isActiveBefore = function() {
        var activeElement = $('.active', this.el);
        if (activeElement.length == 0)
            return false

        if (!this.options.vertical)
            return (activeElement.get(0).offsetLeft + activeElement.width()) < this.el.scrollLeft()
        else
            return (activeElement.get(0).offsetTop + activeElement.height()) < this.el.scrollTop()
    }

    DragScroll.prototype.goToElement = function(element, callback, options) {
        var $el = $(element)
        if (!$el.length)
            return;

        var self = this,
            params = {
                duration: 300,
                queue: false,
                complete: function(){
                    self.fixScrollClasses()
                    if (callback !== undefined)
                        callback()
                }
            }

        params = $.extend(params, options || {})

        var offset = 0,
            animated = false

        if (!this.options.vertical) {
            offset = $el.get(0).offsetLeft - this.el.scrollLeft()

            if (offset < 0) {
                this.el.animate({'scrollLeft': $el.get(0).offsetLeft}, params)
                animated = true
            }
            else {
                offset = $el.get(0).offsetLeft + $el.width() - (this.el.scrollLeft() + this.el.width())
                if (offset > 0) {
                    this.el.animate({'scrollLeft': $el.get(0).offsetLeft + $el.width() - this.el.width()}, params)
                    animated = true
                }
            }
        }
        else {
            offset = $el.get(0).offsetTop - this.el.scrollTop()

            if (offset < 0) {
                this.el.animate({'scrollTop': $el.get(0).offsetTop}, params)
                animated = true
            }
            else {
                offset = $el.get(0).offsetTop - (this.el.scrollTop() + this.el.height())
                if (offset > 0) {
                    this.el.animate({'scrollTop': $el.get(0).offsetTop + $el.height() - this.el.height()}, params)
                    animated = true
                }
            }
        }

        if (!animated && callback !== undefined) {
            callback()
        }
    }

    DragScroll.prototype.dispose = function() {
        this.scrollClassContainer = null

        $(document).off('ready', this.proxy(this.fixScrollClasses))
        $(window).off('resize', this.proxy(this.fixScrollClasses))
        this.el.off('.dragScroll')

        this.el.removeData('oc.dragScroll')

        this.el = null
        BaseProto.dispose.call(this)
    }

    // DRAGSCROLL PLUGIN DEFINITION
    // ============================

    var old = $.fn.dragScroll

    $.fn.dragScroll = function (option) {
        var args = arguments;

        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.dragScroll')
            var options = typeof option == 'object' && option

            if (!data) $this.data('oc.dragScroll', (data = new DragScroll(this, options)))
            if (typeof option == 'string') {
                var methodArgs = [];
                for (var i=1; i<args.length; i++)
                    methodArgs.push(args[i])

                data[option].apply(data, methodArgs)
            }
        })
      }

    $.fn.dragScroll.Constructor = DragScroll

    // DRAGSCROLL NO CONFLICT
    // =================

    $.fn.dragScroll.noConflict = function () {
        $.fn.dragScroll = old
        return this
    }
}(window.jQuery);
