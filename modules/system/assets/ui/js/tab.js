/*
 * Tab control
 *
 * Documentation: ../docs/tab.md
 *
 * Require:
 *  - bootstrap/transition
 *  - bootstrap/tab
 *  - storm/toolbar
 */
+function ($) { "use strict";

    var Tab = function (element, options) {

        var $el = this.$el = $(element);
        this.options = options || {}
        this.$tabsContainer = $('.nav-tabs:first', $el)
        this.$pagesContainer = $('.tab-content:first', $el)
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

		this.$el.on('mousedown', "li[data-tab-id]", function (ev) {
            if (ev.key === '2') {
                $(ev.target).trigger('close.oc.tab');
            }
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
            if (!tabUrl && $(this).parent('ul').is('[data-linkable]')) {
            	tabUrl = $('> a', this).attr('href')
            }
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

        if (location.hash && this.$tabsContainer.is('[data-linkable]')) {
            $('li > a[href=' + location.hash + ']', this.$tabsContainer).tab('show')
        }
    }

    Tab.prototype.initTab = function(li) {
        var
            $tabs = $('>li', this.$tabsContainer),
            tabIndex = $tabs.index(li),
            time = new Date().getTime(),
            targetId = this.tabId + '-tab-' + tabIndex + time,
            $anchor = $('a', li)

        $anchor
            .data('target', '#'+targetId)
            .attr('data-target', '#'+targetId)
            .attr('data-toggle', 'tab')

        if (!$anchor.attr('title'))
            $anchor.attr('title', $anchor.text().trim())

        // Setup the required tabs markup if it does not exist already.
        if ($anchor.find('> span.title > span').length < 1) {
            var html = $anchor.html()
            $anchor
                .html('')
                .append($('<span class="title"></span>')
                .append($('<span></span>').html(html)))
        }

        var pane = $('> .tab-pane', this.$pagesContainer).eq(tabIndex).attr('id', targetId)

        if (!$('span.tab-close', li).length) {
            $(li).append($('<span class="tab-close"><i>&times;</i></span>').click(function(){
                $(this).trigger('close.oc.tab')
                return false
            }))
        }

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

        $.oc.foundation.controlUtils.disposeControls($pane.get(0))

        $pane.remove()
        $tab.remove()

        if (isActive)
            $('> li > a', this.$tabsContainer).eq(tabIndex-1).tab('show')

        if ($('> li > a', this.$tabsContainer).length == 0)
            this.$el.trigger('afterAllClosed.oc.tab')

        this.$el.trigger('closed.oc.tab', [$tab, $pane])

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

    Tab.prototype.findPaneFromTab = function(tab) {
        var id = $(tab).find('> a').data('target'),
            pane = this.$pagesContainer.find(id)

        return pane
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

        var $el = $(element)
        $el.closest('[data-control=tab]').ocTab('goToElement', $el)
        $el.focus()
    })

}(window.jQuery);
