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

    var TreeListWidget = function (element, options) {

        var $el = this.$el = $(element),
            self = this;

        this.options = options || {};

        var sortableOptions = {
                handle: options.handle,
                nested: options.nested,
                onDrop: function($item, container, _super) {
                    self.$el.trigger('move.oc.treelist', { item: $item, container: container })
                    _super($item, container)
                },
                afterMove: function($placeholder, container, $closestEl) {
                    self.$el.trigger('aftermove.oc.treelist', { placeholder: $placeholder, container: container, closestEl: $closestEl })
                }
            }

        $el.find('> ol').sortable($.extend(sortableOptions, options))

        if (!options.nested) {
            $el.find('> ol ol').sortable($.extend(sortableOptions, options))
        }
    }

    TreeListWidget.prototype.unbind = function() {
        this.$el.find('> ol').sortable('destroy')

        if (!this.options.nested) {
            this.$el.find('> ol ol').sortable('destroy')
        }

        this.$el.removeData('oc.treelist')
    }

    TreeListWidget.DEFAULTS = {
        handle: null,
        nested: true
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