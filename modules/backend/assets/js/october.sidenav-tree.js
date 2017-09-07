/*
 * Side navigation tree
 *
 * Data attributes:
 * - data-control="sidenav-tree" - enables the plugin
 * - data-tree-name - unique name of the tree control. The name is used for storing user configuration in the browser cookies.
 *
 * JavaScript API:
 * $('#tree').sidenavTree()
 *
 * Dependences: 
 * - Null
 */

+function ($) { "use strict";

    // SIDENAVTREE CLASS DEFINITION
    // ============================

    var SidenavTree = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        this.init()
    }

    SidenavTree.DEFAULTS = {
        treeName: 'sidenav_tree'
    }

    SidenavTree.prototype.init = function (){
        var self = this

        $(document.body).addClass('has-sidenav-tree')

        this.statusCookieName = this.options.treeName + 'groupStatus'
        this.searchCookieName = this.options.treeName + 'search'
        this.$searchInput = $(this.options.searchInput)

        this.$el.on('click', 'li > div.group', function() {
            self.toggleGroup($(this).closest('li'))
            return false
        })

        this.$searchInput.on('keyup', function(){
            self.handleSearchChange()
        })

        var searchTerm = $.cookie(this.searchCookieName)
        if (searchTerm !== undefined && searchTerm.length > 0) {
            this.$searchInput.val(searchTerm)
            this.applySearch()
        }

        var scrollbar = $('[data-control=scrollbar]', this.$el).data('oc.scrollbar'),
            active = $('li.active', this.$el)

        if (active.length > 0) {
            scrollbar.gotoElement(active)
        }
    }

    SidenavTree.prototype.toggleGroup = function(group) {
        var $group = $(group),
            status = $group.attr('data-status')

        status === undefined || status == 'expanded'
            ? this.collapseGroup($group)
            : this.expandGroup($group)
    }

    SidenavTree.prototype.collapseGroup = function(group) {
        var
            $list = $('> ul', group),
            self = this

        $list.css('overflow', 'hidden')
        $list.animate({ 'height': 0 }, {
            duration: 100,
            queue: false,
            complete: function() {
                $list.css({
                    'overflow': 'visible',
                    'display': 'none'
                })

                $(group).attr('data-status', 'collapsed')
                $(window).trigger('oc.updateUi')
                self.saveGroupStatus($(group).data('group-code'), true)
            }
        })
    }

    SidenavTree.prototype.expandGroup = function(group, duration) {
        var
            $list = $('> ul', group),
            self = this

        duration = duration === undefined ? 100 : duration

        $list.css({
            'overflow': 'hidden',
            'display': '',
            'height': 0
        })
        $list.animate({'height': $list[0].scrollHeight}, { duration: duration, queue: false, complete: function() {
            $list.css({
                'overflow': 'visible',
                'height': 'auto'
            })
            $(group).attr('data-status', 'expanded')
            $(window).trigger('oc.updateUi')
            self.saveGroupStatus($(group).data('group-code'), false)
        } })
    }

    SidenavTree.prototype.saveGroupStatus = function(groupCode, collapsed) {
        var collapsedGroups = $.cookie(this.statusCookieName),
            updatedGroups = []

        if (collapsedGroups === undefined) {
            collapsedGroups = ''
        }

        collapsedGroups = collapsedGroups.split('|')
        $.each(collapsedGroups, function() {
            if (groupCode != this)
                updatedGroups.push(this)
        })

        if (collapsed) {
            updatedGroups.push(groupCode)
        }

        $.cookie(this.statusCookieName, updatedGroups.join('|'), { expires: 30, path: '/' })
    }

    SidenavTree.prototype.handleSearchChange = function() {
        var lastValue = this.$searchInput.data('oc.lastvalue');

        if (lastValue !== undefined && lastValue == this.$searchInput.val()) {
            return
        }

        this.$searchInput.data('oc.lastvalue', this.$searchInput.val())

        if (this.dataTrackInputTimer !== undefined) {
            window.clearTimeout(this.dataTrackInputTimer)
        }

        var self = this
        this.dataTrackInputTimer = window.setTimeout(function(){
            self.applySearch()
        }, 300);

        $.cookie(this.searchCookieName, $.trim(this.$searchInput.val()), { expires: 30, path: '/' })
    }

    SidenavTree.prototype.applySearch = function() {
        var query = $.trim(this.$searchInput.val()),
            words = query.toLowerCase().split(' '),
            visibleGroups = [],
            visibleItems = [],
            self = this

        if (query.length == 0) {
            $('li', this.$el).removeClass('hidden')

            return
        }

        /*
         * Find visible groups and items
         */
        $('ul.top-level > li', this.$el).each(function() {
            var $li = $(this)

            if (self.textContainsWords($('div.group h3', $li).text(), words)) {
                visibleGroups.push($li.get(0))

                $('ul li', $li).each(function(){
                    visibleItems.push(this)
                })
            }
            else {
                $('ul li', $li).each(function(){
                    if (self.textContainsWords($(this).text(), words) || self.textContainsWords($(this).data('keywords'), words)) {
                        visibleGroups.push($li.get(0))
                        visibleItems.push(this)
                    }
                })
            }
        })

        /*
         * Hide invisible groups and items
         */
        $('ul.top-level > li', this.$el).each(function() {
            var $li = $(this),
                groupIsVisible = $.inArray(this, visibleGroups) !== -1

            $li.toggleClass('hidden', !groupIsVisible)
            if (groupIsVisible)
                self.expandGroup($li, 0)

            $('ul li', $li).each(function(){
                var $itemLi = $(this)

                $itemLi.toggleClass('hidden', $.inArray(this, visibleItems) == -1)
            })
        })

        return false
    }

    SidenavTree.prototype.textContainsWords = function(text, words) {
        text = text.toLowerCase()

        for (var i = 0; i < words.length; i++) {
            if (text.indexOf(words[i]) === -1)
                return false
        }

        return true
    }

    // SIDENAVTREE PLUGIN DEFINITION
    // ============================

    var old = $.fn.sidenavTree

    $.fn.sidenavTree = function (option) {
        var args = arguments;

        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.sidenavTree')
            var options = $.extend({}, SidenavTree.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('oc.sidenavTree', (data = new SidenavTree(this, options)))
            if (typeof option == 'string') { 
                var methodArgs = [];
                for (var i=1; i<args.length; i++)
                    methodArgs.push(args[i])

                data[option].apply(data, methodArgs)
            }
        })
    }

    $.fn.sidenavTree.Constructor = SidenavTree

    // SIDENAVREE NO CONFLICT
    // =================

    $.fn.sidenavTree.noConflict = function () {
        $.fn.sidenavTree = old
        return this
    }

    // SIDENAVTREE DATA-API
    // ===============

    $(document).ready(function () {
        $('[data-control=sidenav-tree]').sidenavTree()
    })

}(window.jQuery);
