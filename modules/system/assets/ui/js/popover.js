/*
 * Popover plugin
 *
 * Documentation: ../docs/popover.md
 */

+function ($) { "use strict";

    var Popover = function (element, options) {

        var $el = this.$el = $(element);

        this.options = options || {};
        this.arrowSize = 15
        this.docClickHandler = null
        this.show()
    }

    Popover.prototype.hide = function() {
        var e = $.Event('hiding.oc.popover', {relatedTarget: this.$el})
        this.$el.trigger(e, this)
        if (e.isDefaultPrevented())
            return

        this.$container.removeClass('in')
        if (this.$overlay) this.$overlay.removeClass('in')

        this.disposeControls()

        $.support.transition && this.$container.hasClass('fade')
         ? this.$container
             .one($.support.transition.end, $.proxy(this.hidePopover, this))
             .emulateTransitionEnd(300)
         : this.hidePopover()
    }

    Popover.prototype.disposeControls = function() {
        if (this.$container) {
            $.oc.foundation.controlUtils.disposeControls(this.$container.get(0))
        }
    }

    Popover.prototype.hidePopover = function() {
        this.$container.remove();
        if (this.$overlay) this.$overlay.remove()

        this.$el.removeClass('popover-highlight')
        this.$el.trigger('hide.oc.popover')

        this.$overlay = false
        this.$container = false

        this.$el.data('oc.popover', null)
        $(document.body).removeClass('popover-open')

        $(document).unbind('mousedown', this.docClickHandler);
        $(document).off('.oc.popover')

        this.docClickHandler = null
        this.options.onCheckDocumentClickTarget = null
    }

    Popover.prototype.show = function(options) {
        var self = this

        /*
         * Trigger the show event
         */
        var e = $.Event('showing.oc.popover', { relatedTarget: this.$el })
        this.$el.trigger(e, this)
        if (e.isDefaultPrevented()) return

        /*
         * Create the popover container and overlay
         */
        this.$container = $('<div />').addClass('control-popover')

        if (this.options.containerClass) {
            this.$container.addClass(this.options.containerClass)
        }

        if (this.options.useAnimation) {
            this.$container.addClass('fade')
        }

        var $content = $('<div />').html(this.getContent())

        this.$container.append($content)

        if (this.options.width) {
            this.$container.width(this.options.width)
        }

        if (this.options.modal) {
            this.$overlay = $('<div />').addClass('popover-overlay')
            $(document.body).append(this.$overlay)
            if (this.options.highlightModalTarget) {
                this.$el.addClass('popover-highlight')
                this.$el.blur()
            }
        }
        else {
            this.$overlay = false
        }

        if (this.options.container) {
            $(this.options.container).append(this.$container)
        }
        else {
            $(document.body).append(this.$container)
        }

        /*
         * Determine the popover position
         */
        this.reposition()

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

               if (!self.options.closeOnEsc) { // The value of the option could be changed after the popover is displayed
                   return false
               }

               if (e.keyCode == 27) {
                   self.hide()
                   return false
               }
            })
        }
    }

    Popover.prototype.reposition = function() {
        var
            placement = this.calcPlacement(),
            position = this.calcPosition(placement)

        this.$container.removeClass('placement-center placement-bottom placement-top placement-left placement-right')

        this.$container.css({
            left: position.x,
            top: position.y
        }).addClass('placement-'+placement)
    }

    Popover.prototype.getContent = function () {
        if (this.options.contentFrom) {
            return $(this.options.contentFrom).html()
        }

        if (typeof this.options.content == 'function') {
            return this.options.content.call(this.$el[0], this)
        }

        return this.options.content
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

    Popover.prototype.onDocumentClick = function(e) {
        if (!this.options.closeOnPageClick)
            return

        if (this.options.onCheckDocumentClickTarget && this.options.onCheckDocumentClickTarget(e.target)) {
            return
        }

        if ($.contains(this.$container.get(0), e.target))
            return

        this.hide();
    }

    Popover.DEFAULTS = {
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
