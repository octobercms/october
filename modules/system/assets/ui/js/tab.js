/*
=require ../vendor/bootstrap/js/transition.js
=require ../vendor/bootstrap/js/tab.js
*/

/*
 * Tab control.
 *
 * This plugin is a wrapper for the Twitter Bootstrap Tab component. It provides the following features:
 * - Adding tabs
 * - Optional close icons with 2 states (modified / unmodified). The icon state can be changed by
 *   triggering the modified.oc.tab/unmodified.oc.tab events on any element within tab, or on the tab itself.
 * - Removing tabs with the Close icon, or with triggering an event from inside a tab pane or tab. 
 *   The removing can be canceled if the confirm.oc.tab event handler returns false.
 * - Scrolling tabs if they do not fit the screen
 * - Collapsible tabs
 *
 * Data attributes:
 * - data-control="tab" - creates the tab control from an element
 * - data-closable - enables the Close Tab feature
 * - data-pane-classes - a list of CSS classes to apply new pane elements
 *
 * Example with data attributes (data-control="tab"):
 *
 *  <div class="control-tabs master" data-control="tab" data-closable>
 *      <ul class="nav nav-tabs">
 *          <li class="active"><a href="#home">Home</a></li>
 *      </ul>
 *      <div class="tab-content">
 *          <div class="tab-pane active">Home</div>
 *      </div>
 *  </div>
 *
 * JavaScript methods:
 * - $('#mytabs').ocTab({closable: true, closeConfirmation: 'Do you really want to close this tab? Unsaved data will be lost.'})
 * - $('#mytabs').ocTab('addTab', 'Tab title', 'Tab content', identifier) - adds tab. The optional identifier parameter allows to
     associate a identifier with a tab. The identifier can be used with the goTo() method to find and open a tab by it's identifier.
 * - $('#mytabs').ocTab('closeTab', '.nav-tabs > li.active', true) - closes a tab. The second argument can point to a tab or tab pane. 
     The thrid argument determines whether the tab should be closed without the user confirmation. The default value is false.
 * - $('.nav-tabs > li.active').trigger('close.oc.tab') - another way to close a tab. The event can be triggered on a tab, tab pane
 *   or any element inside a tab or tab pane.
 * - $('#mytabs').ocTab('modifyTab', '.nav-tabs > li.active') - marks a tab as modified. Use the 'unmodifyTab' to mark a tab as unmodified.
 * - $('.nav-tabs > li.active').trigger('modified.oc.tab') - another way to mark a tab as modified. The event can be triggered on a tab, tab pane
 *   or any element inside a tab or tab pane. Use the 'unmodified.oc.tab' to mark a tab as unmodified.
 * - $('#mytabs').ocTab('goTo', 'someidentifier') - Finds a tab by it's identifier and opens it.
 * - $('#mytabs').ocTab('goToPane', '.tab-content .tab-pane:first') - Opens a tab in context of it's content (pane element)
 *
 * Supported options:
 *  - closable - adds the "close" icon to the tab and lets users to close tabs. Corresponds the data-closable attribute.
 *  - closeConfirmation - a confirmation to show when a user tries to close a modified tab. Corresponds the data-close-confirmation 
 *    attribute. The confirmation is displayed only if the tab was modified.
 *  - slidable - allows the tabs to be switched with the swipe gesture on touch devices. Corresponds the data-slidable attribute.
 *  - paneClasses - a list of CSS classes to apply new pane elements. Corresponds to the data-pane-classes attribute.
 *  - maxTitleSymbols - the maximum number of characters in tab titles.
 *  - titleAsFileNames - treat tab titles as file names. In this mode only the file name part is displayed in the tab, and the directory part
 *    is hidden.
 *
 * Events:
 * - beforeClose.oc.tab - triggered on a tab pane element before tab is closed by the user. Call the event's 
 *   preventDefault() method to cancel the action.
 * - afterAllClosed.oc.tab - triggered after all tabs have been closed
 * 
 * Dependences:
 * - DragScroll (october.dragscroll.js)
 * - Toolbar (october.toolbar.js)
 * - Touchwipe (jquery.touchwipe.min.js)
 */

+function ($) { "use strict";

    var Tab = function (element, options) {

        var $el = this.$el = $(element);
        this.options = options || {}
        this.$tabsContainer = $('.nav-tabs', $el)
        this.$pagesContainer = $('.tab-content', $el)
        this.tabId = 'tabs' + $el.parents().length + Math.round(Math.random()*1000);

        if (this.options.closable !== undefined && this.options.closable !== false)
            $el.attr('data-closable', '')

        this.init()
    }

    Tab.prototype.init = function() {
        var self = this;

        this.options.slidable = this.options.slidable !== undefined && this.options.slidable !== false

        $('> li', this.$tabsContainer).each(function(index){
            self.initTab(this)
        })

        this.$el.on('close.oc.tab', function(ev, data){
            ev.preventDefault()
            var force = (data !== undefined && data.force !== undefined) ? data.force : false;
            self.closeTab($(ev.target).closest('ul.nav-tabs > li, div.tab-content > div'), force)
        })

        this.$el.on('toggleCollapse.oc.tab', function(ev, data){
            ev.preventDefault()
            $(ev.target).closest('div.tab-content > div').toggleClass('collapsed')
        })

        this.$el.on('modified.oc.tab', function(ev){
            ev.preventDefault()
            self.modifyTab($(ev.target).closest('ul.nav-tabs > li, div.tab-content > div'))
        })

        this.$el.on('unmodified.oc.tab', function(ev){
            ev.preventDefault()
            self.unmodifyTab($(ev.target).closest('ul.nav-tabs > li, div.tab-content > div'))
        })

        this.$tabsContainer.on('shown.bs.tab', 'li', function(){
            // self.$tabsContainer.dragScroll('fixScrollClasses')
            $(window).trigger('oc.updateUi')

            var tabUrl = $('> a', this).data('tabUrl')
            if (tabUrl) {
                window.history.replaceState({}, 'Tab link reference', tabUrl)
            }
        })

        if (this.options.slidable) {
            this.$pagesContainer.touchwipe({
                wipeRight: function(){self.prev();},
                wipeLeft: function(){self.next();},
                preventDefaultEvents: false,
                min_move_x: 60
            });
        }

        this.$tabsContainer.toolbar({
            scrollClassContainer: this.$el
        })

        this.updateClasses()
    }

    Tab.prototype.initTab = function(li) {
        var
            $tabs = $('>li', this.$tabsContainer),
            tabIndex = $tabs.index(li),
            time = new Date().getTime(),
            targetId = this.tabId + '-tab-' + tabIndex + time,
            $a = $('a', li)

        $a.attr('data-target', '#'+targetId).attr('data-toggle', 'tab')
        if (!$a.attr('title'))
            $a.attr('title', $a.text())

        var html = $a.html()

        $a.html('')
        $a.append($('<span class="title"></span>').append($('<span></span>').html(html)))

        var pane = $('> .tab-pane', this.$pagesContainer).eq(tabIndex).attr('id', targetId)
        $(li).append($('<span class="tab-close"><i>&times;</i></span>').click(function(){
            $(this).trigger('close.oc.tab')
            return false
        }))

        pane.data('tab', li)

        this.$el.trigger('initTab.oc.tab', [{'pane': pane, 'tab': li}])
    }

    Tab.prototype.addTab = function(title, content, identifier, tabClass) {
        var
            processedTitle = this.generateTitleText(title, -1),
            $link = $('<a/>').attr('href', 'javascript:;').text(processedTitle),
            $li = $('<li/>'),
            $pane = $('<div>').html(content).addClass('tab-pane');

        $link.attr('title', title)
        $li.append($link)
        this.$tabsContainer.append($li)
        this.$pagesContainer.append($pane)

        if (tabClass !== undefined)
            $link.addClass(tabClass)

        if (identifier !== undefined)
            $li.attr('data-tab-id', identifier)

        if (this.options.paneClasses !== undefined)
            $pane.addClass(this.options.paneClasses)

        this.initTab($li)
        $link.tab('show')

        $(window).trigger('resize')
        this.$tabsContainer.dragScroll('goToElement', $li)

        var defaultFocus = $('[default-focus]', $pane)
        if (defaultFocus.is(":visible"))
            defaultFocus.focus()

        this.updateClasses()
    }

    Tab.prototype.updateTab = function(tab, title, content) {
        var tabIndex = this.findTabIndex(tab)
        if (tabIndex == -1)
            return

        var
            processedTitle = this.generateTitleText(title, -1),
            $tab = $('> li', this.$tabsContainer).eq(tabIndex),
            $pane = $('> div', this.$pagesContainer).eq(tabIndex),
            $link = $('a', $tab)

        $link.text(processedTitle).attr('title', title)
        $pane.html(content)

        this.initTab($tab)

        this.updateClasses()
    }

    Tab.prototype.generateTitleText = function(title, tabIndex) {
        var newTitle = title
        if (this.options.titleAsFileNames)
            newTitle = title.replace(/^.*[\\\/]/, '')

        if (this.options.maxTitleSymbols && newTitle.length > this.options.maxTitleSymbols)
            newTitle = '...'+newTitle.substring(newTitle.length - this.options.maxTitleSymbols)

        return newTitle
    }

    Tab.prototype.closeTab = function(tab, force) {
        var tabIndex = this.findTabIndex(tab)
        if (tabIndex == -1)
            return

        var
            $tab = $('> li', this.$tabsContainer).eq(tabIndex),
            $pane = $('> div', this.$pagesContainer).eq(tabIndex),
            isActive = $tab.hasClass('active'),
            isModified = $tab.attr('data-modified') !== undefined;

        if (isModified && this.options.closeConfirmation !== undefined && force !== true) {
            if (!confirm(this.options.closeConfirmation))
                return
        }

        var e = $.Event('beforeClose.oc.tab', { relatedTarget: $pane })
        this.$el.trigger(e)
        if (e.isDefaultPrevented())
            return

        $pane.remove()
        $tab.remove()

        if (isActive)
            $('> li > a', this.$tabsContainer).eq(tabIndex-1).tab('show')

        if ($('> li > a', this.$tabsContainer).length == 0)
            this.$el.trigger('afterAllClosed.oc.tab')

        this.$el.trigger('closed.oc.tab', [$tab])

        $(window).trigger('resize')
        this.updateClasses()
    }

    Tab.prototype.updateClasses = function() {
        if (this.$tabsContainer.children().length > 0)
            this.$el.addClass('has-tabs')
        else
            this.$el.removeClass('has-tabs')
    }

    Tab.prototype.modifyTab = function(tab) {
        var tabIndex = this.findTabIndex(tab)
        if (tabIndex == -1)
            return

        $('> li', this.$tabsContainer).eq(tabIndex).attr('data-modified', '')
        $('> div', this.$pagesContainer).eq(tabIndex).attr('data-modified', '')
    }

    Tab.prototype.unmodifyTab = function(tab) {
        var tabIndex = this.findTabIndex(tab)
        if (tabIndex == -1)
            return

        $('> li', this.$tabsContainer).eq(tabIndex).removeAttr('data-modified')
        $('> div', this.$pagesContainer).eq(tabIndex).removeAttr('data-modified')
    }

    Tab.prototype.findTabIndex = function(tab) {
        var tabToFind = tab

        if (tab === undefined)
            tabToFind = $('li.active', this.$tabsContainer)

        var tabParent = this.$pagesContainer

        if ($(tabToFind).parent().hasClass('nav-tabs'))
            tabParent = this.$tabsContainer

        return tabParent.children().index($(tabToFind))
    }

    Tab.prototype.findTabFromPane = function(pane) {
        var id = '#' + $(pane).attr('id'),
            tab = $('[data-target="' + id + '"]', this.$tabsContainer)

        return tab
    }

    Tab.prototype.goTo = function(identifier) {
        var $tab = $('[data-tab-id="'+identifier+'" ]', this.$tabsContainer)

        if ($tab.length == 0)
            return false

        var tabIndex = this.findTabIndex($tab)
        if (tabIndex == -1)
            return false

        this.goToIndex(tabIndex)

        this.$tabsContainer.dragScroll('goToElement', $tab)

        return true
    }

    Tab.prototype.goToPane = function(pane) {
        var $pane = $(pane),
            $tab = this.findTabFromPane($pane)

        if ($pane.length == 0)
            return

        $pane.removeClass('collapsed')

        var tabIndex = this.findTabIndex($pane)
        if (tabIndex == -1)
            return false

        this.goToIndex(tabIndex)

        if ($tab.length > 0)
            this.$tabsContainer.dragScroll('goToElement', $tab)

        return true
    }

    Tab.prototype.goToElement = function(element) {
        return this.goToPane(element.closest('.tab-pane'))
    }

    Tab.prototype.findByIdentifier = function(identifier) {
        return $('[data-tab-id="'+identifier+'" ]', this.$tabsContainer);
    }

    Tab.prototype.updateIdentifier = function(tab, identifier) {
        var index = this.findTabIndex(tab)
        if (index == -1)
            return

        $('> li', this.$tabsContainer).eq(index).attr('data-tab-id', identifier)
    }

    Tab.prototype.updateTitle = function(tab, title) {
        var index = this.findTabIndex(tab)
        if (index == -1)
            return

        var processedTitle = this.generateTitleText(title, index),
            $link = $('> li > a span.title', this.$tabsContainer).eq(index)

        $link.attr('title', title)
        $link.text(processedTitle)
    }

    Tab.prototype.goToIndex = function(index) {
        $('> li > a', this.$tabsContainer).eq(index).tab('show')
    }

    Tab.prototype.prev = function() {
        var tabIndex = this.findTabIndex()
        if (tabIndex <= 0)
            return

        this.goToIndex(tabIndex-1)
    }

    Tab.prototype.next = function() {
        var tabIndex = this.findTabIndex()
        if (tabIndex == -1)
            return

        this.goToIndex(tabIndex+1)
    }

    Tab.DEFAULTS = {
    }

    // TAB PLUGIN DEFINITION
    // ============================

    var old = $.fn.ocTab

    $.fn.ocTab = function (option) {
        var args = arguments;

        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.tab')
            var options = $.extend({}, Tab.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('oc.tab', (data = new Tab(this, options)))
            if (typeof option == 'string') {
                var methodArgs = [];
                for (var i=1; i<args.length; i++)
                    methodArgs.push(args[i])

                data[option].apply(data, methodArgs)
            }
        })
      }

    $.fn.ocTab.Constructor = Tab

    // TAB NO CONFLICT
    // =================

    $.fn.ocTab.noConflict = function () {
        $.fn.ocTab = old
        return this
    }

    // TAB DATA-API
    // ============
    $(document).render(function(){
        $('[data-control=tab]').ocTab()
    })

    /*
     * Detect invalid fields, focus the tab
     */
    $(window).on('ajaxInvalidField', function(event, element, name, messages, isFirst){
        if (!isFirst) return
        event.preventDefault()
        element.closest('[data-control=tab]').ocTab('goToElement', element)
        element.focus()
    })

}(window.jQuery);