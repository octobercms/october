/*
 * Extends the fancy tabs layout with expand controls in the tab 
 * form sections. See main Builder page for example. 
 * TODO: A similar layout is used in the CMS, Pages and Builder areas,
 * but only Builder uses this class.
 */
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var TabFormExpandControls = function ($tabsControlElement, options) {
        this.$tabsControlElement = $tabsControlElement
        this.options = $.extend(TabFormExpandControls.DEFAULTS, typeof options == 'object' && options)
        this.tabsControlId = null

        Base.call(this)
        this.init()
    }

    TabFormExpandControls.prototype = Object.create(BaseProto)
    TabFormExpandControls.prototype.constructor = TabFormExpandControls

    TabFormExpandControls.prototype.init = function() {
        this.tabsControlId = this.$tabsControlElement.attr('id')

        if (!this.tabsControlId) {
            throw new Error('The tab controls element should have the id attribute value.')
        }

        this.registerHandlers()
    }

    TabFormExpandControls.prototype.dispose = function() {
        this.unregisterHandlers()

        this.$tabsControlElement = null

        BaseProto.dispose.call(this)
    }

    TabFormExpandControls.prototype.registerHandlers = function() {
        this.$tabsControlElement.on('initTab.oc.tab', this.proxy(this.initTab))
        this.$tabsControlElement.on('click', '[data-control="tabless-collapse-icon"]', this.proxy(this.tablessCollapseClicked))
        this.$tabsControlElement.on('click', '[data-control="primary-collapse-icon"]', this.proxy(this.primaryCollapseClicked))
    }

    TabFormExpandControls.prototype.unregisterHandlers = function() {
        this.$tabsControlElement.off('initTab.oc.tab', this.proxy(this.initTab))
        this.$tabsControlElement.off('click', '[data-control="tabless-collapse-icon"]', this.proxy(this.tablessCollapseClicked))
        this.$tabsControlElement.off('click', '[data-control="primary-collapse-icon"]', this.proxy(this.primaryCollapseClicked))
    }

    TabFormExpandControls.prototype.initTab = function(ev, data) {
        if ($(ev.target).attr('id') != this.tabsControlId)
            return

        var $primaryPanel = this.findPrimaryPanel(data.pane),
            $panel = $('.form-tabless-fields', data.pane),
            $secondaryPanel = this.findSecondaryPanel(data.pane),
            hasSecondaryTabs = $secondaryPanel.length > 0

        $secondaryPanel.addClass('secondary-content-tabs')
        $panel.append(this.createTablessCollapseIcon())

        if (!hasSecondaryTabs) {
            $('.tab-pane', $primaryPanel).addClass('pane-compact')
        }

        $('.nav-tabs', $primaryPanel).addClass('master-area')

        if ($primaryPanel.length > 0) {
            $secondaryPanel.append(this.createPrimaryCollapseIcon())
        } else {
            $secondaryPanel.addClass('primary-collapsed')
        }

        if (!$('a', data.tab).hasClass('new-template') && this.getLocalStorageValue('tabless', 0) == 1) {
            $panel.addClass('collapsed')
        }

        if (this.getLocalStorageValue('primary', 0) == 1 && hasSecondaryTabs) {
            $primaryPanel.addClass('collapsed')
            $secondaryPanel.addClass('primary-collapsed')
        }

        if (this.options.onInitTab) {
            this.options.onInitTab($('form', data.pane))
        }
    }

    TabFormExpandControls.prototype.tablessCollapseClicked = function(ev) {
        var $panel = $(ev.target).closest('.form-tabless-fields')

        $panel.toggleClass('collapsed')
        this.setLocalStorageValue('tabless', $panel.hasClass('collapsed') ? 1 : 0)
        window.setTimeout(this.proxy(this.updateUi), 500)

        ev.stopPropagation()
        return false
    }

    TabFormExpandControls.prototype.primaryCollapseClicked = function(ev) {
        var $pane = $(ev.target).closest('.tab-pane'),
            $primaryPanel = this.findPrimaryPanel($pane),
            $secondaryPanel = this.findSecondaryPanel($pane)

        $primaryPanel.toggleClass('collapsed')
        $secondaryPanel.toggleClass('primary-collapsed')

        this.updateUi()
        this.setLocalStorageValue('primary', $primaryPanel.hasClass('collapsed') ? 1 : 0)

        return false
    }

    TabFormExpandControls.prototype.updateUi = function() {
        $(window).trigger('oc.updateUi')
    }

    TabFormExpandControls.prototype.createTablessCollapseIcon = function() {
        return $('<a href="javascript:;" class="tab-collapse-icon tabless" data-control="tabless-collapse-icon"><i class="icon-chevron-up"></i></a>')
    }

    TabFormExpandControls.prototype.createPrimaryCollapseIcon = function() {
        return $('<a href="javascript:;" class="tab-collapse-icon primary" data-control="primary-collapse-icon"><i class="icon-chevron-down"></i></a>')
    }

    TabFormExpandControls.prototype.generateStorageKey = function(section) {
        return 'oc' + section + this.tabsControlId.replace('-', '') + 'collapsed'
    }

    TabFormExpandControls.prototype.findPrimaryPanel = function(pane) {
        return $(pane).find('.control-tabs.primary-tabs')
    }

    TabFormExpandControls.prototype.findSecondaryPanel = function(pane) {
        return $(pane).find('.control-tabs.secondary-tabs')
    }

    TabFormExpandControls.prototype.getLocalStorageValue = function(section, defaultValue) {
        var key = this.generateStorageKey(section)

        if (typeof(localStorage) !== 'undefined') {
            return localStorage[key]
        }

        return defaultValue
    }

    TabFormExpandControls.prototype.setLocalStorageValue = function(section, value) {
        var key = this.generateStorageKey(section)

        if (typeof(localStorage) !== 'undefined') {
            localStorage[key] = value
        }
    }

    TabFormExpandControls.DEFAULTS = {
        onInitTab: null
    }

    $.oc.tabFormExpandControls = TabFormExpandControls

}(window.jQuery);


/*
 * Auto update WAI-ARIA when a user updates the tabs
 */
 $(document).ready(function() {

     /* If no selected => select first */
     if ($('.master-tabs a[aria-selected]').length === 0) {
         $('.master-tabs a:first').attr({
             'aria-selected': 'true',
             'tabindex': '0'
         });
     } else if ($('.primary-tabs a[aria-selected]').length === 0) {
         $('.primary-tabs a:first').attr({
             'aria-selected': 'true',
             'tabindex': '0'
         });
     } else if ($('.secondary-tabs a[aria-selected]').length === 0) {
         $('.secondary-tabs a:first').attr({
             'aria-selected': 'true',
             'tabindex': '0'
         });
     } else if ($('.content-tabs a[aria-selected]').length === 0) {
         $('.content-tabs a:first').attr({
             'aria-selected': 'true',
             'tabindex': '0'
         });
     }
     // else if ($('.vertical-tabs a[aria-selected]').length === 0) {
     //     $('.vertical-tabs a:first').attr({'aria-selected':'true', 'tabindex':'0'});
     //     $('.vertical-tabs ul').attr('aria-orientation':'vertical');
     // }

     /* Click on a link */
     $('body').on('click', '.master-tabs,.primary-tabs,.secondary-tabs,.content-tabs', function(event) { // Can add ,.vertical-tabs

         let $target = $(event.target);
         let tabNameClick = '';

         if ($target.hasClass('master-tabs')) {
             tabNameClick = '.master-tabs';
         } else if ($target.hasClass('primary-tabs')) {
             tabNameClick = '.primary-tabs';
         } else if ($target.hasClass('secondary-tabs')) {
             tabNameClick = '.secondary-tabs';
         } else if ($target.hasClass('content-tabs')) {
             tabNameClick = '.content-tabs';
         }
         // else if($target.hasClass('vertical-tabs')) {
         //     tabNameClick = '.vertical-tabs';
         // }

         // remove aria selected on all links + remove focusable
         $(tabName + ' a').attr('aria-selected', 'false');

         // add aria selected on $this + focusable
         $(tabName + ' a.focus-visible').attr('aria-selected', 'true');

         // Important - Must be set to true for October to set class="active" in the <li>
         return true;
     });

     /* Keyboard arrow selection */
     $('body').on('keydown', '.primary-tabs,.secondary-tabs,.master-tabs,.content-tabs', function(event) { // Can add ,.vertical-tabs

         let $target = $(event.target);
         let tabNameKey = '';

         if ($target.hasClass('primary-tabs')) {
             tabNameKey = '.primary-tabs';
         } else if ($target.hasClass('secondary-tabs')) {
             tabNameKey = '.secondary-tabs';
         } else if ($target.hasClass('secondary-tabs')) {
             tabNameKey = '.secondary-tabs';
         } else if ($target.hasClass('secondary-tabs')) {
             tabNameKey = '.content-tabs';
         }
         // else if($target.hasClass('vertical-tabs')) {
         //     tabNameKey = '.vertical-tabs';
         // }

         let strikeUpOrRightTab = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
         let strikeDownOrLeftTab = event.key === 'ArrowDown' || event.key === 'ArrowRight';
         if (strikeUpOrRightTab || strikeDownOrLeftTab) {
             event.preventDefault();

             var postition = strikeUpOrRightTab ? 'first-child' : 'last-child';
             $activated = $(tabNameKey + ' a[aria-selected="true"]').parent();
             if ($activated.is(tabNameKey + ' li:' + position)) {
                 $(tabNameKey + ' li:' + position + ' a').click().focus();
             } else {
                 // else activate previous
                 $activated.prev().children(tabNameKey + ' a').click().focus();
             }
         }

         // Important - Must be set to true for October to set class="active" in the <li>
         return true;
     });

 });