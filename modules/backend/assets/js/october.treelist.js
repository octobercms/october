/*
 * TreeList Widget
 *
 * Supported options:
 *  - handle - class name to use as a handle
 *  - nested - set to false if sorting should be kept within each OL container, if using
 *             a handle it should be focused enough to exclude nested handles.
 * 
 * Events:
 * - move.oc.treelist - triggered when a node on the tree is moved.
 * 
 * Dependences:
 * - Sortable Plugin (october.sortable.js)
 */
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var TreeListWidget = function (element, options) {
        this.$el = $(element)
        this.options = options || {};

        Base.call(this)

        $.oc.foundation.controlUtils.markDisposable(element)
        this.init()
    }

    TreeListWidget.prototype = Object.create(BaseProto)
    TreeListWidget.prototype.constructor = TreeListWidget

    TreeListWidget.prototype.init = function() {
        var sortableOptions = {
                handle: this.options.handle,
                nested: this.options.nested,
                onDrop: this.proxy(this.onDrop),
                afterMove: this.proxy(this.onAfterMove)
            }

        this.$el.find('> ol').sortable($.extend(sortableOptions, this.options))

        if (!this.options.nested)
            this.$el.find('> ol ol').sortable($.extend(sortableOptions, this.options))

        this.$el.one('dispose-control', this.proxy(this.dispose))
    }

    TreeListWidget.prototype.dispose = function() {
        this.unbind()
        BaseProto.dispose.call(this)
    }

    TreeListWidget.prototype.unbind = function() {
        this.$el.off('dispose-control', this.proxy(this.dispose))

        this.$el.find('> ol').sortable('destroy')

        if (!this.options.nested) {
            this.$el.find('> ol ol').sortable('destroy')
        }

        this.$el.removeData('oc.treelist')

        this.$el = null
        this.options = null
    }

    TreeListWidget.DEFAULTS = {
        handle: null,
        nested: true
    }

    // TREELIST EVENT HANDLERS
    // ============================

    TreeListWidget.prototype.onDrop = function($item, container, _super) {
        // The event handler could be registered after the
        // sortable is destroyed. This should be fixed later.
        if (!this.$el) {
            return
        }

        this.$el.trigger('move.oc.treelist', { item: $item, container: container })
        _super($item, container)
    }

    TreeListWidget.prototype.onAfterMove = function($placeholder, container, $closestEl) {
        if (!this.$el) {
            return
        }

        this.$el.trigger('aftermove.oc.treelist', { placeholder: $placeholder, container: container, closestEl: $closestEl })
    }

    // TREELIST WIDGET PLUGIN DEFINITION
    // ============================

    var old = $.fn.treeListWidget

    $.fn.treeListWidget = function (option) {
        var args = arguments,
            result

        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.treelist')
            var options = $.extend({}, TreeListWidget.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.treelist', (data = new TreeListWidget(this, options)))
            if (typeof option == 'string') result = data[option].call(data)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
      }

    $.fn.treeListWidget.Constructor = TreeListWidget

    // TREELIST WIDGET NO CONFLICT
    // =================

    $.fn.treeListWidget.noConflict = function () {
        $.fn.treeListWidget = old
        return this
    }

    // TREELIST WIDGET DATA-API
    // ==============
    
    $(document).render(function(){
        $('[data-control="treelist"]').treeListWidget();
    })

}(window.jQuery);