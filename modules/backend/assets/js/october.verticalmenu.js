/*
 * Creates a vertical responsive menu. 
 *
 * JavaScript API:
 * $('#menu').verticalMenu()
 *
 * Dependences: 
 * - Drag Scroll (october.dragscroll.js)
 */
+function ($) { "use strict";

    var VerticalMenu = function (element, toggle, options) {
        this.$el = $(element)
        this.body = $('body')
        this.toggle = $(toggle)
        this.options = options || {}
        this.options = $.extend({}, VerticalMenu.DEFAULTS, this.options)
        this.wrapper = $(this.options.contentWrapper)
        this.breakpoint = options.breakpoint

        /*
         * Insert the menu
         */
        this.menuPanel = $('<div></div>').appendTo('body').addClass(this.options.collapsedMenuClass).css('width', 0)
        this.menuContainer = $('<div></div>').appendTo(this.menuPanel).css('display', 'none')
        this.menuElement = this.$el.clone().appendTo(this.menuContainer).css('width', 'auto')

        var self = this

        /*
         * Handle the menu toggle click
         */
        this.toggle.click(function() {
            if (!self.body.hasClass(self.options.bodyMenuOpenClass)) {
                var wrapperWidth = self.wrapper.outerWidth()

                self.menuElement.dragScroll('goToStart')

                self.wrapper.css({
                    'position': 'absolute',
                    'min-width': self.wrapper.width(),
                    'height': '100%'
                })
                self.body.addClass(self.options.bodyMenuOpenClass)
                self.menuContainer.css('display', 'block')

                self.wrapper.animate({'left': self.options.menuWidth}, { duration: 200, queue: false })
                self.menuPanel.animate({'width': self.options.menuWidth}, {
                    duration: 200,
                    queue: false,
                    complete: function() {
                        self.menuElement.css('width', self.options.menuWidth)
                    }
                })
            }
            else {
                closeMenu()
            }

            return false
        })

        this.wrapper.click(function() {
            if (self.body.hasClass(self.options.bodyMenuOpenClass)) {
                closeMenu()
                return false
            }
        })

        /*
         * Disable the menu if the window is wider than the breakpoint width
         */
        $(window).resize(function() {
            if (self.body.hasClass(self.options.bodyMenuOpenClass)) {
                if ($(window).width() > self.breakpoint) {
                    hideMenu()
                }
            }
        })

        /*
         * Make the menu draggable
         */
        this.menuElement.dragScroll({
            vertical: true,
            start: function(){self.menuElement.addClass('drag')},
            stop: function(){self.menuElement.removeClass('drag')},
            scrollClassContainer: self.menuPanel,
            scrollMarkerContainer: self.menuContainer
        })

        this.menuElement.on('click', function() {
            // Do not handle menu item clicks while dragging
            if (self.menuElement.hasClass('drag'))
                return false
        })

        /*
         * Internal event, completely hides the menu
         */
        function hideMenu() {
            self.body.removeClass(self.options.bodyMenuOpenClass)
            self.wrapper.css({
                'position': 'static',
                'min-width': 0,
                'right': 0,
                'height': '100%'
            })
            self.menuPanel.css('width', 0)
            self.menuElement.css('width', 'auto')
            self.menuContainer.css('display', 'none')
        }

        /*
         * Internal event, smoothly collapses the menu
         */
        function closeMenu() {
            self.wrapper.animate({'left': 0}, { duration: 200, queue: false})
            self.menuPanel.animate({'width': 0}, { duration: 200, queue: false, complete: hideMenu })
            self.menuElement.animate({'width': 0}, { duration: 200, queue: false })
        }
    }

    VerticalMenu.DEFAULTS = {
        menuWidth: 230,
        breakpoint: 769,
        bodyMenuOpenClass: 'mainmenu-open',
        collapsedMenuClass: 'mainmenu-collapsed',
        contentWrapper: '#layout-canvas'
    }

    // VERTICAL MENU PLUGIN DEFINITION
    // ============================

    var old = $.fn.verticalMenu

    $.fn.verticalMenu = function (toggleSelector, option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.verticalMenu')
            var options = typeof option == 'object' && option

            if (!data) $this.data('oc.verticalMenu', (data = new VerticalMenu(this, toggleSelector, options)))
            if (typeof option == 'string') data[option].call($this)
        })
      }

    $.fn.verticalMenu.Constructor = VerticalMenu

    // VERTICAL MENU NO CONFLICT
    // =================

    $.fn.verticalMenu.noConflict = function () {
        $.fn.verticalMenu = old
        return this
    }

}(window.jQuery);