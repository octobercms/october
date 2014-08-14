/*
 * TreeView Widget. Represents a sortable and draggable tree view. This widget was first used in the Pages plugin, for the sidebar page tree.
 *
 * Supported options:
 * 
 * Events:
 * 
 * Dependences:
 * 
 */
+function ($) { "use strict";
    var TreeView = function (element, options) {
        this.$el = $(element)
        this.options = options
        this.expandControls = []

        this.init()
    }

    TreeView.prototype.init = function () {
        this.$expandControlContainer = this.options.expandControlContainer !== null ?
                this.$el.closest(this.options.expandControlContainer) :
                $(document.body)

        /*
         * Delete existing expand/collapse icons
         */

        $.each(this.expandControls, function(){
            $(this).remove()
        })

        /*
         * Create new expand/collapse icons
         */

        var self = this

        $('li', this.$el).each(function() {
            var $el = $(this),
                $expand = $('> span.expand', $el),
                $info = $('> div', $el)

            $expand
                .data('oc.treeview-parent', $el)
                .addClass('oc-treeview-expand-control')
                .addClass('hidden')

            self.$expandControlContainer.append($expand)

            self.expandControls.push($expand)

            $expand.click(function(){
                self.toggleGroup($expand)
            })

            $info.mouseenter(function() {
                $expand.addClass('hover')
            })

            $info.mouseleave(function() {
                $expand.removeClass('hover')
            })
        })

        this.realignExpandControls()

        /*
         * Bind to a scrollbar events, if the treeview is hosted inside a scrollbar
         */

        var $scrollbar = this.$el.closest('[data-control=scrollbar]')

        if ($scrollbar.length > 0) {
            $scrollbar.on('oc.scrollStart', $.proxy(this.hideExpandControls, this))
            $scrollbar.on('oc.scrollEnd', $.proxy(this.showExpandControls, this))
        }

        /*
         * Ralign expand controls after window resize
         */

        $(window).on('resize, oc.updateUi', $.proxy(this.realignExpandControls, this))

        /*
         * Init the sortable
         */

        this.$el.treeListWidget()
    }

    TreeView.prototype.alignExpandControls = function() {
        var expandControlOffset = this.$expandControlContainer.offset(),
            expandControlHeight = this.$expandControlContainer.height()

        $.each(this.expandControls, function(){
            var $expand = $(this),
                $li = $expand.data('oc.treeview-parent'),
                offset = $li.offset(),
                top = offset.top+14-expandControlOffset.top,
                outside = top < 0 || (top+20) > expandControlHeight

            $expand.css({
                left: offset.left-7-expandControlOffset.left,
                top: top
            })

            $expand.toggleClass('expand-hidden', !$li.hasClass('has-subitems') || outside)
        })
    }

    TreeView.prototype.hideExpandControls = function() {
        $.each(this.expandControls, function(){
            $(this).addClass('expand-drag-hidden')
        })
    }

    TreeView.prototype.showExpandControls = function() {
        $.each(this.expandControls, function(){
            $(this).removeClass('expand-drag-hidden')
        })

        this.realignExpandControls()
    }

    TreeView.prototype.realignExpandControls = function() {
        this.alignExpandControls()

        $.each(this.expandControls, function(){
            $(this).removeClass('hidden')
        })
    }

    TreeView.prototype.collapseGroup = function($expandControl, $list) {
        var self = this,
            $subitems = $('> ol', $list)

        $subitems.css('overflow', 'hidden')
        $expandControl.attr('data-status', 'collapsed')

        $subitems.animate({'height': 0}, { duration: 100, queue: false, complete: function() {
            $subitems.css({
                'overflow': 'visible',
                'display': 'none'
            })
            $list.attr('data-status', 'collapsed')
            self.alignExpandControls()
            $(window).trigger('resize')
        } })

        // this.sendGroupStatusRequest(group, 0);
    }

    TreeView.prototype.expandGroup = function($expandControl, $list) {
        var self = this,
            $subitems = $('> ol', $list)

        $subitems.css({
            'overflow': 'hidden',
            'display': 'block',
            'height': 0
        })

        $list.attr('data-status', 'expanded')
        $subitems.animate({'height': $subitems[0].scrollHeight}, { duration: 100, queue: false, complete: function() {
            $subitems.css({
                'overflow': 'visible',
                'height': 'auto'
            })
            $expandControl.attr('data-status', 'expanded')
            self.alignExpandControls()
            $(window).trigger('resize')
        } })

//        this.sendGroupStatusRequest(group, 1);
    }

    TreeView.prototype.toggleGroup = function(group) {
        var $group = $(group);

        $group.attr('data-status') == 'expanded' ?
            this.collapseGroup($group, $group.data('oc.treeview-parent')) : 
            this.expandGroup($group, $group.data('oc.treeview-parent'))
    }

    TreeView.DEFAULTS = {
        sortableHandle: null,
        expandControlContainer: null
    }

    // TREEVIEW PLUGIN DEFINITION
    // ============================

    var old = $.fn.treeView

    $.fn.treeView = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.treeView')
            var options = $.extend({}, TreeView.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.treeView', (data = new TreeView(this, options)))
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
    $(window).load(function(){
        $('[data-control=treeview]').treeView()
    })

}(window.jQuery);