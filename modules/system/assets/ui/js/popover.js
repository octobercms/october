/*
 * Popover plugin
 *
 * Options:
 * - placement: top | bottom | left | right | center. The placement could automatically be changed 
     if the popover doesn't fit into the desired position.
 * - fallbackPlacement: top | bottom | left | right. The placement to use if the default placement
 *   and all other possible placements do not work. The default value is "bottom".
 * - content: content HTML string or callback
 * - width: content width, optional. If not specified, the content width will be used.
 * - modal: make the popover modal
 * - highlightModalTarget: "pop" the popover target above the overlay, making it highlighted.
 *   The feature assigns the target position relative.
 * - closeOnPageClick: close the popover if the page was clicked outside the popover area.
 * - container: the popover container selector or element. The default container is the document body.
 *   The container must be relative positioned.
 * - containerClass - a CSS class to apply to the popover container element
 * - offset - offset in pixels to add to the calculated position, to make the position more "random"
 * - offsetX - X offset in pixels to add to the calculated position, to make the position more "random". 
 *   If specified, overrides the offset property for the bottom and top popover placement.
 * - offsetY - Y offset in pixels to add to the calculated position, to make the position more "random". 
 *   If specified, overrides the offset property for the left and right popover placement.
 * - useAnimation: adds animation to the open and close sequence, the equivalent of adding 
 *   the CSS class 'fade' to the containerClass.
 *
 * Methods:
 * - hide
 *
 * Closing the popover. There are 3 ways to close the popover: call it's hide() method, trigger 
 * the close.oc.popover on any element inside the popover or click an element with attribute 
 * data-dismiss="popover" inside the popover.
 *
 * Events:
 * - showing.oc.popover - triggered before the popover is displayed. Allows to override the 
 *   popover options (for example the content) or cancel the action with e.preventDefault()
 * - show.oc.popover - triggered after the popover is displayed.
 * - hiding.oc.popover - triggered before the popover is closed. Allows to cancel the action with
 *   e.preventDefault()
 * - hide.oc.popover - triggered after the popover is hidden.
 *
 * JavaScript API:
 * $('#element').ocPopover({
    content: '<p>This is a popover</p>'
    placement: 'top'
 * })
 */
+function ($) { "use strict";

    var Popover = function (element, options) {

        var $el = this.$el = $(element);

        this.options = options || {};
        this.arrowSize = 15
        this.show()
    }

    Popover.prototype.hide = function() {
        var e = $.Event('hiding.oc.popover', {relatedTarget: this.$el})
        this.$el.trigger(e, this)
        if (e.isDefaultPrevented())
            return

        this.$container.removeClass('in')
        if (this.$overlay) this.$overlay.removeClass('in')

        $.support.transition && this.$container.hasClass('fade')
            ? this.$container
                .one($.support.transition.end, $.proxy(this.hidePopover, this))
                .emulateTransitionEnd(300)
            : this.hidePopover()
    }

    Popover.prototype.hidePopover = function() {

        if (this.$container) this.$container.remove()
        if (this.$overlay) this.$overlay.remove()

        this.$el.removeClass('popover-highlight')
        this.$el.trigger('hide.oc.popover')

        this.$overlay = false
        this.$container = false

        this.$el.data('oc.popover', null)
        $(document.body).removeClass('popover-open')

        $(document).unbind('mousedown', this.docClickHandler);
        $(document).off('.oc.popover')
    }

    Popover.prototype.show = function(options) {
        var self = this

        /*
         * Trigger the show event
         */
        var e = $.Event('showing.oc.popover', { relatedTarget: this.$el })
        this.$el.trigger(e, this)
        if (e.isDefaultPrevented())
            return

        /*
         * Create the popover container and overlay
         */
        this.$container = $('<div />').addClass('control-popover')

        if (this.options.containerClass)
            this.$container.addClass(this.options.containerClass)

        if (this.options.useAnimation)
            this.$container.addClass('fade')

        var $content = $('<div />').html(this.getContent())
        this.$container.append($content)

        if (this.options.width)
            this.$container.width(this.options.width)

        if (this.options.modal) {
            this.$overlay = $('<div />').addClass('popover-overlay')
            $(document.body).append(this.$overlay)
            if (this.options.highlightModalTarget) {
                this.$el.addClass('popover-highlight')
                this.$el.blur()
            }
        } else {
            this.$overlay = false
        }

        if (this.options.container)
            $(this.options.container).append(this.$container)
        else
            $(document.body).append(this.$container)

        /*
         * Determine the popover position
         */
        var
            placement = this.calcPlacement(),
            position = this.calcPosition(placement)

        this.$container.css({
            left: position.x,
            top: position.y
        }).addClass('placement-'+placement)

        /*
         * Display the popover
         */
        this.$container.addClass('in')
        if (this.$overlay) this.$overlay.addClass('in')

        $(document.body).addClass('popover-open')
        var showEvent = jQuery.Event('show.oc.popover', { relatedTarget: this.$container.get(0) })
        this.$el.trigger(showEvent)

        /*
         * Bind events
         */
         this.$container.on('mousedown', function(e){
            e.stopPropagation();
         })

         this.$container.on('close.oc.popover', function(e){
            self.hide()
         })

         this.$container.on('click', '[data-dismiss=popover]', function(e){
            self.hide()
            return false
         })

         this.docClickHandler = $.proxy(this.onDocumentClick, this)
         $(document).bind('mousedown', this.docClickHandler);

         if (this.options.closeOnEsc) {
             $(document).on('keyup.oc.popover', function(e){
                if ($(e.target).hasClass('select2-offscreen'))
                    return false

                if (e.keyCode == 27) {
                    self.hide()
                    return false
                }
             })
         }
    }

    Popover.prototype.getContent = function () {
        return typeof this.options.content == 'function'
            ? this.options.content.call(this.$el[0], this)
            : this.options.content
    }

    Popover.prototype.calcDimensions = function() {
        var
            documentWidth = $(document).width(),
            documentHeight = $(document).height(),
            targetOffset = this.$el.offset(),
            targetWidth = this.$el.outerWidth(),
            targetHeight = this.$el.outerHeight()

        return {
            containerWidth: this.$container.outerWidth() + this.arrowSize,
            containerHeight: this.$container.outerHeight() + this.arrowSize,
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
        }
    }

    Popover.prototype.fitsLeft = function(dimensions) {
        return dimensions.spaceLeft >= dimensions.containerWidth &&
               dimensions.spaceHorizontalBottom >= dimensions.containerHeight
    }

    Popover.prototype.fitsRight = function(dimensions) {
        return dimensions.spaceRight >= dimensions.containerWidth &&
               dimensions.spaceHorizontalBottom >= dimensions.containerHeight
    }

    Popover.prototype.fitsBottom = function(dimensions) {
        return dimensions.spaceBottom >= dimensions.containerHeight &&
               dimensions.spaceVerticalRight >= dimensions.containerWidth
    }

    Popover.prototype.fitsTop = function(dimensions) {
        return dimensions.spaceTop >= dimensions.containerHeight &&
               dimensions.spaceVerticalRight >= dimensions.containerWidth
    }

    Popover.prototype.calcPlacement = function() {
        var 
            placement = this.options.placement,
            dimensions = this.calcDimensions();

        if (placement == 'center')
            return placement

        if (placement != 'bottom' && placement != 'top' && placement != 'left' && placement != 'right')
            placement = 'bottom'

        var placementFunctions = {
            top: this.fitsTop,
            bottom: this.fitsBottom,
            left: this.fitsLeft,
            right: this.fitsRight
        }

        if (placementFunctions[placement](dimensions))
            return placement

        for (var index in placementFunctions) {
            if (placementFunctions[index](dimensions))
                return index
        }

        return this.options.fallbackPlacement
    }

    Popover.prototype.calcPosition = function(placement) {
        var
            dimensions = this.calcDimensions(),
            result

        switch (placement) {
            case 'left':
                var realOffset = this.options.offsetY === undefined ? this.options.offset : this.options.offsetY
                result = {x: (dimensions.targetOffset.left - dimensions.containerWidth), y: dimensions.targetOffset.top + realOffset}
            break;
            case 'top':
                var realOffset = this.options.offsetX === undefined ? this.options.offset : this.options.offsetX
                result = {x: dimensions.targetOffset.left + realOffset, y: (dimensions.targetOffset.top - dimensions.containerHeight)}
            break;
            case 'bottom':
                var realOffset = this.options.offsetX === undefined ? this.options.offset : this.options.offsetX
                result = {x: dimensions.targetOffset.left + realOffset, y: (dimensions.targetOffset.top + dimensions.targetHeight + this.arrowSize)}
            break;
            case 'right':
                var realOffset = this.options.offsetY === undefined ? this.options.offset : this.options.offsetY
                result = {x: (dimensions.targetOffset.left + dimensions.targetWidth + this.arrowSize), y: dimensions.targetOffset.top + realOffset}
            break;
            case 'center' :
                var windowHeight = $(window).height()
                result = {x: (dimensions.documentWidth/2 - dimensions.containerWidth/2), y: (windowHeight/2 - dimensions.containerHeight/2)}

                if (result.y < 40)
                    result.y = 40
            break;
        }

        if (!this.options.container)
            return result

        var
            $container = $(this.options.container),
            containerOffset = $container.offset()

        result.x -= containerOffset.left
        result.y -= containerOffset.top

        return result
    }

    Popover.prototype.onDocumentClick = function() {
        if (this.options.closeOnPageClick)
            this.hide();
    }

    Popover.DEFAULTS = {
        placement: 'bottom',
        fallbackPlacement: 'bottom',
        content: '<p>Popover content<p>',
        width: false,
        modal: false,
        highlightModalTarget: false,
        closeOnPageClick: true,
        closeOnEsc: true,
        container: false,
        containerClass: null,
        offset: 15,
        useAnimation: false
    }

    // POPOVER PLUGIN DEFINITION
    // ============================

    var old = $.fn.ocPopover

    $.fn.ocPopover = function (option) {
        var args = arguments;

        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.popover')
            var options = $.extend({}, Popover.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) {
                if (typeof option == 'string')
                    return;

                $this.data('oc.popover', (data = new Popover(this, options)))
            } else {
                if (typeof option != 'string')
                    return;

                var methodArgs = [];
                for (var i=1; i<args.length; i++)
                    methodArgs.push(args[i])

                data[option].apply(data, methodArgs)
            }
        })
      }

    $.fn.ocPopover.Constructor = Popover

    // POPOVER NO CONFLICT
    // =================

    $.fn.ocPopover.noConflict = function () {
        $.fn.ocPopover = old
        return this
    }

    // POPOVER DATA-API
    // ===============

    $(document).on('click', '[data-control=popover]', function(e){
        $(this).ocPopover()

        return false;
    })

}(window.jQuery);