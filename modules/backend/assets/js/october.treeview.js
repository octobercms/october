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
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var TreeView = function (element, options) {
        this.$el = $(element)
        this.options = options
        this.$allItems = null
        this.$scrollbar = null

        Base.call(this)

        $.oc.foundation.controlUtils.markDisposable(element)
        this.init()
    }

    TreeView.prototype = Object.create(BaseProto)
    TreeView.prototype.constructor = TreeView

    TreeView.prototype.init = function () {
        this.$allItems = $('li', this.$el)
        this.$scrollbar = this.$el.closest('[data-control=scrollbar]')

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

        this.$el.on('click.treeview', 'li > div > ul.submenu li a', this.proxy(this.onOpenSubmenu))
        this.$el.on('click.treeview', 'li > div > a', this.proxy(this.onOpen))
        this.$el.on('click.treeview', 'li span.expand', this.proxy(this.onItemExpandClick))

        /*
         * Listen for the AJAX updates and dispose the widget
         */

        this.$el.one('dispose-control', this.proxy(this.dispose))

        /*
         * Mark previously active item, if it was set
         */
        var dataId = this.$el.data('oc.active-item')
        if (dataId !== undefined)
            this.markActive(dataId)
    }

    TreeView.prototype.dispose = function() {
        this.unregisterHandlers()

        this.options = null
        this.$el.removeData('oc.treeView')
        this.$el = null
        this.$allItems = null
        this.$scrollbar = null

        BaseProto.dispose.call(this)
    }

    TreeView.prototype.unregisterHandlers = function() {
        this.$el.off('.treeview')
        this.$el.off('move.oc.treelist', this.proxy(this.onNodeMove))
        this.$el.off('aftermove.oc.treelist', this.proxy(this.onAfterNodeMove))
        this.$el.off('dispose-control', this.proxy(this.dispose))
    }

    TreeView.prototype.createItemControls = function() {
        $('li', this.$el).each(function() {
            var $container = $('> div', this),
                $expand = $('> span.expand', $container)

            if ($expand.length > 0)
                return

            $expand = $('<span class="expand">Expand</span>')

            $container.prepend($expand)

            if (!$('.drag-handle', $container).length)
                $container.append($('<span class="drag-handle">Drag</span>'))

            $container.append($('<span class="borders"></span>'))

            if ($(this).attr('data-no-drag-mode') !== undefined)
              $('span.drag-handle', this).attr('title', 'Dragging is disabled when the Search is active')
        })
    }

    TreeView.prototype.collapseGroup = function($group) {
        var $subitems = $('> ol', $group)

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
        var $subitems = $('> ol', $group)

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
        var $noDragItems = $('[data-no-drag-mode]', this.$el)

        if ($noDragItems.length > 0)
            return

        if (this.$el.data('oc.treelist'))
            this.$el.treeListWidget('unbind')

        this.$el.treeListWidget({
            tweakCursorAdjustment: this.proxy(this.tweakCursorAdjustment),
            isValidTarget: this.proxy(this.isValidTarget),
            useAnimation: false,
            handle: 'span.drag-handle'
        })

        this.$el.on('move.oc.treelist', this.proxy(this.onNodeMove))
        this.$el.on('aftermove.oc.treelist', this.proxy(this.onAfterNodeMove))
    }

    TreeView.prototype.markActive = function(dataId) {
        $('li', this.$el).removeClass('active')

        if (dataId)
            $('li[data-id="'+dataId+'"]', this.$el).addClass('active')

        this.$el.data('oc.active-item', dataId)
    }

    // It seems the method is not used anymore as we re-create the control
    // instead of updating it. Remove later if nothing weird is noticed. 
    // -ab Apr 26 2015
    //
    TreeView.prototype.update = function() {
        this.$allItems = $('li', this.$el)
        this.createItemControls()
        //this.initSortable()

        var dataId = this.$el.data('oc.active-item')
        if (dataId !== undefined)
            this.markActive(dataId)
    }

    TreeView.prototype.handleMovedNode = function() {
        this.$el.trigger('change')
        this.$allItems.removeClass('drop-target')
        this.fixSubItems()
        this.sendReorderRequest()
    }

    TreeView.prototype.tweakCursorAdjustment = function(adjustment) {
        if (!adjustment)
            return adjustment

        if (this.$scrollbar.length > 0)
            adjustment.top -= this.$scrollbar.scrollTop()

        return adjustment
    }

    TreeView.prototype.isValidTarget = function($item, container) {
        return $(container.el).closest('li').attr('data-status') != 'collapsed'
    }

    TreeView.DEFAULTS = {

    }

    // TREEVIEW EVENT HANDLERS
    // ============================

    TreeView.prototype.onOpenSubmenu = function(ev) {
        var e = $.Event('submenu.oc.treeview', {relatedTarget: ev.currentTarget, clickEvent: ev})
        this.$el.trigger(e, this)

        return false
    }

    TreeView.prototype.onOpen = function(ev) {
        var e = $.Event('open.oc.treeview', {relatedTarget: $(ev.currentTarget).closest('li').get(0), clickEvent: ev})
        this.$el.trigger(e, ev.currentTarget)

        return false
    }

    TreeView.prototype.onNodeMove = function() {
        setTimeout(this.proxy(this.handleMovedNode), 50)
    }

    TreeView.prototype.onAfterNodeMove = function(ev, data) {
        this.$allItems.removeClass('drop-target')
        data.container.el.closest('li').addClass('drop-target')
    }

    TreeView.prototype.onItemExpandClick = function(ev) {
        this.toggleGroup($(ev.currentTarget).closest('li'))
        return false
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

            if (typeof option == 'string' && data) { 
                var methodArgs = [];
                for (var i=1; i<args.length; i++)
                    methodArgs.push(args[i])

                if (data[option])
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