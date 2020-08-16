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