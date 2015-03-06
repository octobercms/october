/*
 * Side Panel Tabs
 */

+function ($) { "use strict";

    var SidePanelTab = function(element, options) {
        this.options = options
        this.$el = $(element)
        this.init()
    }

    SidePanelTab.prototype.init = function() {
        var self = this
        this.tabOpenDelay = 200
        this.tabOpenTimeout = undefined
        this.panelOpenTimeout = undefined
        this.$sideNav = $('#layout-sidenav')
        this.$sideNavItems = $('ul li', this.$sideNav)
        this.$sidePanelItems = $('[data-content-id]', this.$el)
        this.sideNavWidth = this.$sideNavItems.outerWidth()
        this.mainNavHeight = $('#layout-mainmenu').outerHeight()
        this.panelVisible = false
        this.visibleItemId = false
        this.$fixButton = $('<a href="#" class="fix-button"><i class="icon-thumb-tack"></i></a>')

        this.$fixButton.click(function(){
            self.fixPanel()
            return false
        })
        $('.fix-button-container', this.$el).append(this.$fixButton)

        this.$sideNavItems.click(function(){
            if (Modernizr.touch && $(window).width() < self.options.breakpoint) {
                if ($(this).data('menu-item') == self.visibleItemId && self.panelVisible) {
                    self.hideSidePanel()
                    return
                } else
                    self.displaySidePanel()
            }

            self.displayTab(this)

            return false
        })

        if (!Modernizr.touch) {
            self.$sideNav.mouseenter(function(){
               if ($(window).width() < self.options.breakpoint || !self.panelFixed()) {
                    self.panelOpenTimeout = setTimeout(function () {
                        self.displaySidePanel()
                    }, self.tabOpenDelay)
               }
            })

            self.$sideNav.mouseleave(function(){
                clearTimeout(self.panelOpenTimeout)
            })

            self.$el.mouseleave(function(){
                self.hideSidePanel()
            })

            self.$sideNavItems.mouseenter(function(){
                if ($(window).width() < self.options.breakpoint || !self.panelFixed()) {
                    var _this = this
                    self.tabOpenTimeout = setTimeout(function () {
                        self.displayTab(_this)
                    }, self.tabOpenDelay)
                }
            })

            self.$sideNavItems.mouseleave(function (){
                clearTimeout(self.tabOpenTimeout)
            })


            $(window).resize(function() {
                self.updatePanelPosition()
                self.updateActiveTab()
            })
        } else {
            $('#layout-body').click(function(){
                if (self.panelVisible) {
                    self.hideSidePanel()
                    return false
                }
            })

            self.$el.on('close.oc.sidePanel', function(){
                self.hideSidePanel()
            })
        }

        this.updateActiveTab()
    }

    SidePanelTab.prototype.displayTab = function(menuItem) {
        var menuItemId = $(menuItem).data('menu-item')

        this.$sideNavItems.removeClass('active')
        $(menuItem).addClass('active')
        this.visibleItemId = menuItemId

        this.$sidePanelItems.each(function(){
            var  $el = $(this)
            $el.toggleClass('hide', $el.data('content-id') != menuItemId)
        })

        $(window).trigger('resize')
    }

    SidePanelTab.prototype.displaySidePanel = function() {
        $(document.body).addClass('display-side-panel')

        this.$el.appendTo('#layout-canvas')
        this.panelVisible = true
        this.$el.css({
            left: this.sideNavWidth,
            top: this.mainNavHeight
        })

        this.updatePanelPosition()
        $(window).trigger('resize')
    }

    SidePanelTab.prototype.hideSidePanel = function() {
        $(document.body).removeClass('display-side-panel')
        if (this.$el.next('#layout-body').length == 0) {
            $('#layout-body').before(this.$el)
        }

        this.panelVisible = false

        this.updateActiveTab()
    }

    SidePanelTab.prototype.updatePanelPosition = function() {
        if (!this.panelFixed() || Modernizr.touch) {
            this.$el.height($(document).height() - this.mainNavHeight)
        }
        else {
            this.$el.css('height', '')
        }

        if (this.panelVisible && $(window).width() > this.options.breakpoint && this.panelFixed()) {
            this.hideSidePanel()
        }
    }

    SidePanelTab.prototype.updateActiveTab = function() {
        if (!this.panelVisible && ($(window).width() < this.options.breakpoint || !this.panelFixed())) {
            this.$sideNavItems.removeClass('active')
        }
        else {
            this.$sideNavItems.filter('[data-menu-item='+this.visibleItemId+']').addClass('active')
        }
    }

    SidePanelTab.prototype.panelFixed = function() {
        return !($(window).width() < this.options.breakpoint) &&
            !$(document.body).hasClass('side-panel-not-fixed')
    }

    SidePanelTab.prototype.fixPanel = function() {
        $(document.body).toggleClass('side-panel-not-fixed')

        var self = this

        window.setTimeout(function() {
            var fixed = self.panelFixed()

            if (fixed) {
                self.updateActiveTab()
                $(document.body).addClass('side-panel-fix-shadow')
            } else {
                $(document.body).removeClass('side-panel-fix-shadow')
                self.hideSidePanel()
            }

            if (typeof(localStorage) !== 'undefined')
                localStorage.ocSidePanelFixed = fixed ? 1 : 0
        }, 0)
    }

    SidePanelTab.DEFAULTS = {
        breakpoint: 769
    }

    // PLUGIN DEFINITION
    // ============================

    var old = $.fn.sidePanelTab

    $.fn.sidePanelTab = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('oc.sidePanelTab')
            var options = $.extend({}, SidePanelTab.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.sidePanelTab', (data = new SidePanelTab(this, options)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.sidePanelTab.Constructor = SidePanelTab

    // NO CONFLICT
    // =================

    $.fn.sidePanelTab.noConflict = function () {
        $.fn.sidePanelTab = old
        return this
    }

    // DATA-API
    // ============

    $(window).load(function(){
        $('[data-control=layout-sidepanel]').sidePanelTab()
    })

    // STORED PREFERENCES
    // ====================

    $(document).ready(function(){
        if (Modernizr.touch || (typeof(localStorage) !== 'undefined' && localStorage.ocSidePanelFixed == 1)) {
            $(document.body).removeClass('side-panel-not-fixed')
            $(window).trigger('resize')
        }
    })
}(window.jQuery);