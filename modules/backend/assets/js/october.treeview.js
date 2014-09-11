/*
 * TreeView Widget. Represents a sortable and draggable tree view. This widget was first used in the Pages plugin, for the sidebar page tree.
 *
 * Data attributes:
 * - data-group-status-handler - AJAX handler to execute when an item is collapsed or expanded by a user
 * - data-reorder-handler - AJAX handler to execute when items are reordered
 * 
 * Events
 * - open.oc.treeview - this event is triggered on the list element when an item is clicked.
 * 
 * Dependences:
 * - Tree list (october.treelist.js)
 * 
 */
+function ($) { "use strict";
    var TreeView = function (element, options) {
        this.$el = $(element)
        this.options = options

        this.init()
    }

    TreeView.prototype.init = function () {
        this.$allItems = $('li', this.$el)
        this.$scrollbar = this.$el.closest('[data-control=scrollbar]')

        var self = this

        /*
         * Init the sortable
         */

        this.initSortable()

        /*
         * Create expand/collapse icons and drag handles
         */

        this.createItemControls()

        /*
         * Bind the click events
         */

        this.$el.on('click', 'li > div > ul.submenu li a', function(event) {
            var e = $.Event('submenu.oc.treeview', {relatedTarget: this, clickEvent: event})
            self.$el.trigger(e, this)

            return false
        })

        this.$el.on('click', 'li > div > a', function(event) {
            var e = $.Event('open.oc.treeview', {relatedTarget: $(this).closest('li').get(0), clickEvent: event})
            self.$el.trigger(e, this)

            return false
        })

        /*
         * Listen for the AJAX updates and update the widget
         */
        this.$el.on('ajaxUpdate', $.proxy(this.update, this))
    }

    TreeView.prototype.createItemControls = function() {
        var self = this

        $('li', this.$el).each(function() {
            var $container = $('> div', this),
                $expand = $('> span.expand', $container),
                group = this

            if ($expand.length > 0)
                return

            $expand = $('<span class="expand">Expand</span>').click(function(){
                self.toggleGroup($(group))

                return false
            })

            $container.prepend($expand)

            if (!$('.drag-handle', $container).length)
                $container.append($('<span class="drag-handle">Drag</span>'))

            $container.append($('<span class="borders"></span>'))

            if ($(this).attr('data-no-drag-mode') !== undefined)
              $('span.drag-handle', this).attr('title', 'Dragging is disabled when the Search is active')
        })
    }

    TreeView.prototype.collapseGroup = function($group) {
        var self = this,
            $subitems = $('> ol', $group)

        $subitems.css({
            'overflow': 'hidden'
        })

        $subitems.animate({'height': 0}, { duration: 100, queue: false, complete: function() {
            $subitems.css({
                'overflow': 'visible',
                'display': 'none',
                'height' : 'auto'
            })
            $group.attr('data-status', 'collapsed')
            $(window).trigger('resize')
        } })

        this.sendGroupStatusRequest($group, 0)
    }

    TreeView.prototype.expandGroup = function($group) {
        var self = this,
            $subitems = $('> ol', $group)

        $subitems.css({
            'overflow': 'hidden',
            'display': 'block',
            'height': 0
        })

        $group.attr('data-status', 'expanded')
        $subitems.animate({'height': $subitems[0].scrollHeight}, { duration: 100, queue: false, complete: function() {
            $subitems.css({
                'overflow': 'visible',
                'height': 'auto'
            })
            $(window).trigger('resize')
        } })

       this.sendGroupStatusRequest($group, 1);
    }

    TreeView.prototype.fixSubItems = function() {
        $('li', this.$el).each(function(){
            var $li = $(this),
            $subitems = $('> ol > li', $li)
            $li.toggleClass('has-subitems', $subitems.length > 0)
        })
    }

    TreeView.prototype.toggleGroup = function(group) {
        var $group = $(group);

        $group.attr('data-status') == 'expanded' ?
            this.collapseGroup($group) : 
            this.expandGroup($group)
    }

    TreeView.prototype.sendGroupStatusRequest = function($group, status) {
        if (this.options.groupStatusHandler !== undefined) {
            var groupId = $group.data('group-id')

            $group.request(this.options.groupStatusHandler, {data: {group: groupId, status: status}})
        }
    }

    TreeView.prototype.sendReorderRequest = function() {
        if (this.options.reorderHandler === undefined)
            return

        var groups = {}

        function iterator($container, node) {
            $('> li', $container).each(function(){
                var subnodes = {}
                iterator($('> ol', this), subnodes)

                node[$(this).data('groupId')] = subnodes
            })
        }

        iterator($('> ol', this.$el), groups)

        this.$el.request(this.options.reorderHandler, {data: {structure: JSON.stringify(groups)}})
    }

    TreeView.prototype.initSortable = function() {
        var self = this,
            $noDragItems = $('[data-no-drag-mode]', this.$el)

        if ($noDragItems.length > 0)
            return

        if (this.$el.data('oc.treelist'))
            this.$el.treeListWidget('unbind')

        this.$el.treeListWidget({
            tweakCursorAdjustment: function(adjustment) {
                if (!adjustment)
                    return adjustment

                if (self.$scrollbar.length > 0) {
                    adjustment.top -= self.$scrollbar.scrollTop()
                }

                return adjustment;
            },
            isValidTarget: function($item, container) {
                return $(container.el).closest('li').attr('data-status') != 'collapsed'
            },
            useAnimation: true,
            handle: 'span.drag-handle'
        })

        this.$el.on('move.oc.treelist', function(){
            setTimeout(function(){
                self.$el.trigger('change')
                self.$allItems.removeClass('drop-target')
                self.fixSubItems()
                self.sendReorderRequest()
            }, 50)
        })

        this.$el.on('aftermove.oc.treelist', function(event, data) {
            self.$allItems.removeClass('drop-target')
            data.container.el.closest('li').addClass('drop-target')
        })
    }

    TreeView.prototype.markActive = function(dataId) {
        $('li', this.$el).removeClass('active')

        if (dataId)
            $('li[data-id="'+dataId+'"]', this.$el).addClass('active')

        this.dataId = dataId
    }

    TreeView.prototype.update = function() {
        this.$allItems = $('li', this.$el)
        this.createItemControls()
        this.initSortable()

        if (this.dataId !== undefined)
            this.markActive(this.dataId)
    }

    TreeView.DEFAULTS = {

    }

    // TREEVIEW PLUGIN DEFINITION
    // ============================

    var old = $.fn.treeView

    $.fn.treeView = function (option) {
        var args = arguments

        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.treeView')
            var options = $.extend({}, TreeView.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.treeView', (data = new TreeView(this, options)))

            if (typeof option == 'string') { 
                var methodArgs = [];
                for (var i=1; i<args.length; i++)
                    methodArgs.push(args[i])

                data[option].apply(data, methodArgs)
            }
        })
      }

    $.fn.treeView.Constructor = TreeView

    // TREEVIEW NO CONFLICT
    // =================

    $.fn.treeView.noConflict = function () {
        $.fn.treeView = old
        return this
    }

    // TREEVIEW DATA-API
    // ===============
    // $(window).load(function(){
    //     $('[data-control=treeview]').treeView()
    // })

    $(document).render(function(){
        $('[data-control=treeview]').treeView()
    })

}(window.jQuery);