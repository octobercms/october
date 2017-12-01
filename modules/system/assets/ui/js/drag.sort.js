/*
 * Sortable plugin.
 *
 * Documentation: ../docs/drag-sort.md
 *
 * Require:
 *  - sortable/jquery-sortable
 */

 +function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var Sortable = function (element, options) {
        this.$el = $(element)
        this.options = options || {}
        this.cursorAdjustment = null

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)
        this.init()
    }

    Sortable.prototype = Object.create(BaseProto)
    Sortable.prototype.constructor = Sortable

    Sortable.prototype.init = function() {
        this.$el.one('dispose-control', this.proxy(this.dispose))

        var
            self = this,
            sortableOverrides = {},
            sortableDefaults = {
                onDragStart: this.proxy(this.onDragStart),
                onDrag: this.proxy(this.onDrag),
                onDrop: this.proxy(this.onDrop)
            }

        /*
         * Override _super object for each option/event
         */
        if (this.options.onDragStart) {
            sortableOverrides.onDragStart = function ($item, container, _super, event) {
                self.options.onDragStart($item, container, sortableDefaults.onDragStart, event)
            }
        }

        if (this.options.onDrag) {
            sortableOverrides.onDrag = function ($item, position, _super, event) {
                self.options.onDrag($item, position, sortableDefaults.onDrag, event)
            }
        }

        if (this.options.onDrop) {
            sortableOverrides.onDrop = function ($item, container, _super, event) {
                self.options.onDrop($item, container, sortableDefaults.onDrop, event)
            }
        }

        this.$el.jqSortable($.extend({}, sortableDefaults, this.options, sortableOverrides))
    }

    Sortable.prototype.dispose = function() {
        this.$el.jqSortable('destroy')
        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$el.removeData('oc.sortable')
        this.$el = null
        this.options = null
        this.cursorAdjustment = null
        BaseProto.dispose.call(this)
    }

    Sortable.prototype.onDragStart = function ($item, container, _super, event) {
        /*
         * Relative cursor position
         */
        var offset = $item.offset(),
            pointer = container.rootGroup.pointer

        if (pointer) {
            this.cursorAdjustment = {
                left: pointer.left - offset.left,
                top: pointer.top - offset.top
            }
        }
        else {
            this.cursorAdjustment = null
        }

        if (this.options.tweakCursorAdjustment) {
            this.cursorAdjustment = this.options.tweakCursorAdjustment(this.cursorAdjustment)
        }

        $item.css({
            height: $item.height(),
            width: $item.width()
        })

        $item.addClass('dragged')
        $('body').addClass('dragging')
        this.$el.addClass('dragging')

        /*
         * Use animation
         */
        if (this.options.useAnimation) {
            $item.data('oc.animated', true)
        }

        /*
         * Placeholder clone
         */
         if (this.options.usePlaceholderClone) {
            $(container.rootGroup.placeholder).html($item.html())
         }

         if (!this.options.useDraggingClone) {
            $item.hide()
         }
    }

    Sortable.prototype.onDrag = function ($item, position, _super, event) {
        if (this.cursorAdjustment) {
            /*
             * Relative cursor position
             */
            $item.css({
              left: position.left - this.cursorAdjustment.left,
              top: position.top - this.cursorAdjustment.top
            })
        }
        else {
            /*
             * Default behavior
             */
            $item.css(position)
        }
    }

    Sortable.prototype.onDrop = function ($item, container, _super, event) {
        $item.removeClass('dragged').removeAttr('style')
        $('body').removeClass('dragging')
        this.$el.removeClass('dragging')

        if ($item.data('oc.animated')) {
            $item
                .hide()
                .slideDown(200)
        }
    }

    //
    // Proxy API
    //

    Sortable.prototype.enable = function() {
        this.$el.jqSortable('enable')
    }

    Sortable.prototype.disable = function() {
        this.$el.jqSortable('disable')
    }

    Sortable.prototype.refresh = function() {
        this.$el.jqSortable('refresh')
    }

    Sortable.prototype.serialize = function() {
        this.$el.jqSortable('serialize')
    }

    Sortable.prototype.destroy = function() {
        this.dispose()
    }

    // External solution for group persistence
    // See https://github.com/johnny/jquery-sortable/pull/122
    Sortable.prototype.destroyGroup = function() {
        var jqSortable = this.$el.data('jqSortable')
        if (jqSortable.group) {
            jqSortable.group._destroy()
        }
    }

    Sortable.DEFAULTS = {
        useAnimation: false,
        usePlaceholderClone: false,
        useDraggingClone: true,
        tweakCursorAdjustment: null
    }

    // PLUGIN DEFINITION
    // ============================

    var old = $.fn.sortable

    $.fn.sortable = function (option) {
        var args = arguments;

        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.sortable')
            var options = $.extend({}, Sortable.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.sortable', (data = new Sortable(this, options)))
            if (typeof option == 'string') data[option].apply(data, args)
        })
    }

    $.fn.sortable.Constructor = Sortable

    $.fn.sortable.noConflict = function () {
        $.fn.sortable = old
        return this
    }

}(window.jQuery);
