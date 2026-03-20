/*
 * Tab control
 *
 * Documentation: ../docs/tab.md
 *
 * Config:
 * - closable
 * - linkable
 * - paneClasses
 * - titleAsFileNames
 * - maxTitleSymbols
 * - closeConfirmation
 *
 * Require:
 *  - bootstrap/transition
 *  - bootstrap/tab
 *  - foundation/toolbar
 */
import { ControlBase } from 'larajax';
import * as bootstrap from 'bootstrap';

const $ = window.jQuery;

export default class TabControl extends ControlBase {
    init() {
        var $el = this.$el = $(this.element);
        this.options = Object.assign(Object.assign({}, this.tabInstanceConfig || {}), this.config || {});
        this.$tabsContainer = $('.nav-tabs:first', $el);
        this.$pagesContainer = $('.tab-content:first', $el);
        this.tabId = 'tabs' + $el.parents().length + Math.round(Math.random() * 1000);
        this.invalidElement = false;

        if (this.options.closable) {
            $el.attr('data-closable', '');
        }

        // Cast empty attribute
        if (this.options.linkable === '') {
            this.options.linkable = true;
        }
    }

    connect() {
        this.tabInstance = this;
        this.$el.data('oc.tab', this);

        this.$el.on('close.oc.tab', this.proxy(this.onCloseTab));
        this.$el.on('mousedown', "li[data-tab-id]", this.proxy(this.onMiddleClickTab));
        this.$el.on('modified.oc.tab', this.proxy(this.onModifyTab));
        this.$el.on('unmodified.oc.tab', this.proxy(this.onUnmodifyTab));
        this.$tabsContainer.on('shown.bs.tab', 'li', this.proxy(this.onContainerTabShown));

        $('> li', this.$tabsContainer).each((index, el) => {
            this.initTab(el);
        });

        this.$tabsContainer.toolbar({
            scrollClassContainer: this.$el
        });

        this.updateClasses();
        this.showHashedAnchorTab();
    }

    disconnect() {
        this.$el.off('close.oc.tab', this.proxy(this.onCloseTab));
        this.$el.off('mousedown', "li[data-tab-id]", this.proxy(this.onMiddleClickTab));
        this.$el.off('modified.oc.tab', this.proxy(this.onModifyTab));
        this.$el.off('unmodified.oc.tab', this.proxy(this.onUnmodifyTab));
        this.$tabsContainer.off('shown.bs.tab', 'li', this.proxy(this.onContainerTabShown));

        this.$tabsContainer.toolbar('dispose');

        this.$el.removeData('oc.tab');
        this.tabInstance = null;
    }

    onCloseTab(ev, data) {
        ev.preventDefault();
        var force = (data !== undefined && data.force !== undefined) ? data.force : false;
        this.closeTab($(ev.target).closest('ul.nav-tabs > li, div.tab-content > div'), force);
    }

    onMiddleClickTab(ev) {
        if (ev.which == '2') {
            $(ev.target).trigger('close.oc.tab');
        }
    }

    onModifyTab(ev) {
        ev.preventDefault();
        this.modifyTab($(ev.target).closest('ul.nav-tabs > li, div.tab-content > div'));
    }

    onUnmodifyTab(ev) {
        ev.preventDefault();
        this.unmodifyTab($(ev.target).closest('ul.nav-tabs > li, div.tab-content > div'));
    }

    onContainerTabShown(ev) {
        $(window).trigger('oc.updateUi');

        var $li = ev.target.closest('li');
        var $anchor = $('> a', $li);

        // Attach the active class to the list item in addition to the anchor
        // which was introduced in the bootstrap 5 version -sg
        $($li).addClass('active')
            .siblings('.active').removeClass('active');

        // Unselect all panes that were active at the time the DOM rendered
        // since bootstrap 5 no longer deactivates siblings internally -sg
        $($anchor.data('bs-target'))
            .siblings('.active').removeClass('active');

        var tabUrl = $anchor.data('tabUrl');

        if (!tabUrl && this.options.linkable) {
            tabUrl = $anchor.attr('href');
        }

        if (tabUrl && !this.invalidElement) {
            if (oc.useTurbo()) {
                oc.visit(tabUrl, { action: 'swap', scroll: false });
            }
            else {
                window.history.replaceState({}, 'Tab link reference', tabUrl);
            }
        }
    }

    showHashedAnchorTab() {
        if (!location.hash || !this.options.linkable) {
            return;
        }

        var $hashedAnchor = $('li > a[href="' + location.hash + '"]', this.$tabsContainer);
        if (!$hashedAnchor.length) {
            return;
        }

        this.bsTab($hashedAnchor).show();

        // Next tick
        setTimeout(function() {
            $hashedAnchor.trigger('shownLinkable.oc.tab');
        }, 1);
    }

    initTab(li) {
        var
            $tabs = $('> li', this.$tabsContainer),
            tabIndex = $tabs.index(li),
            time = new Date().getTime(),
            $anchor = $('a', li),
            $pane = $('> .tab-pane', this.$pagesContainer).eq(tabIndex),
            targetId = $pane.attr('id');

        // Auto generate the tab pane identifier
        if (!targetId) {
            targetId = this.tabId + '-tab-' + tabIndex + time;
            $pane.attr('id', targetId);
        }

        $anchor
            .data('target', '#'+targetId)
            .attr('data-bs-target', '#'+targetId)
            .attr('data-bs-toggle', 'tab');

        // Setup the required tabs markup if it does not exist already.
        if ($anchor.find('> span.title > span').length < 1) {
            var html = $anchor.html();
            $anchor
                .html('')
                .append($('<span class="title"></span>')
                .append($('<span></span>').html(html)));
        }

        if (!$('span.tab-close', li).length) {
            $(li).append($('<span class="tab-close"><i>&times;</i></span>').click(function(){
                $(this).trigger('close.oc.tab');
                return false;
            }));
        }

        $pane.data('tab', li);

        this.$el.trigger('initTab.oc.tab', [{ 'pane': $pane, 'tab': li }]);
    }

    addTab(title, content, identifier, tabClass) {
        var
            processedTitle = this.generateTitleText(title, -1),
            $link = $('<a/>').attr('href', 'javascript:;').text(processedTitle),
            $li = $('<li/>'),
            $pane = $('<div>').html(content).addClass('tab-pane');

        $link.attr('title', title);
        $li.append($link);
        this.$tabsContainer.append($li);
        this.$pagesContainer.append($pane);

        if (tabClass !== undefined) {
            $link.addClass(tabClass);
        }

        if (identifier !== undefined) {
            $li.attr('data-tab-id', identifier);
        }

        if (this.options.paneClasses) {
            $pane.addClass(this.options.paneClasses);
        }

        this.initTab($li);
        $link.tab('show');

        $(window).trigger('resize');
        this.$tabsContainer.dragScroll('goToElement', $li);

        var defaultFocus = $('[default-focus]', $pane);
        if (defaultFocus.is(':visible')) {
            defaultFocus.focus();
        }

        this.updateClasses();
    }

    updateTab(tab, title, content) {
        var tabIndex = this.findTabIndex(tab);
        if (tabIndex == -1) {
            return;
        }

        var
            processedTitle = this.generateTitleText(title, -1),
            $tab = $('> li', this.$tabsContainer).eq(tabIndex),
            $pane = $('> div', this.$pagesContainer).eq(tabIndex),
            $link = $('a', $tab);

        $link.text(processedTitle).attr('title', title);
        $pane.html(content);

        this.initTab($tab);

        this.updateClasses();
    }

    generateTitleText(title, tabIndex) {
        var newTitle = title
        if (this.options.titleAsFileNames) {
            newTitle = title.replace(/^.*[\\\/]/, '')
        }

        if (this.options.maxTitleSymbols && newTitle.length > this.options.maxTitleSymbols) {
            newTitle = '...'+newTitle.substring(newTitle.length - this.options.maxTitleSymbols);
        }

        return newTitle;
    }

    closeTab(tab, force) {
        var tabIndex = this.findTabIndex(tab);
        if (tabIndex == -1) {
            return;
        }

        var
            $tab = $('> li', this.$tabsContainer).eq(tabIndex),
            $pane = $('> div', this.$pagesContainer).eq(tabIndex),
            isActive = $tab.hasClass('active'),
            isModified = $tab.attr('data-modified') !== undefined;

        if (isModified && this.options.closeConfirmation && force !== true) {
            if (!confirm(this.options.closeConfirmation)) {
                return;
            }
        }

        var e = $.Event('beforeClose.oc.tab', { relatedTarget: $pane });
        this.$el.trigger(e);
        if (e.isDefaultPrevented()) {
            return;
        }

        $.oc.foundation.controlUtils.disposeControls($pane.get(0));

        $pane.remove();
        $tab.remove();

        if (isActive) {
            $('> li > a', this.$tabsContainer).eq(tabIndex-1).tab('show');
        }

        if ($('> li > a', this.$tabsContainer).length == 0) {
            this.$el.trigger('afterAllClosed.oc.tab');
        }

        this.$el.trigger('closed.oc.tab', [$tab, $pane]);

        $(window).trigger('resize');
        this.updateClasses();
    }

    updateClasses() {
        if (this.$tabsContainer.children().length > 0) {
            this.$el.addClass('has-tabs');
        }
        else {
            this.$el.removeClass('has-tabs');
        }
    }

    modifyTab(tab) {
        var tabIndex = this.findTabIndex(tab);
        if (tabIndex == -1) {
            return;
        }

        $('> li', this.$tabsContainer).eq(tabIndex).attr('data-modified', '');
        $('> div', this.$pagesContainer).eq(tabIndex).attr('data-modified', '');
    }

    unmodifyTab(tab) {
        var tabIndex = this.findTabIndex(tab);
        if (tabIndex == -1) {
            return;
        }

        $('> li', this.$tabsContainer).eq(tabIndex).removeAttr('data-modified');
        $('> div', this.$pagesContainer).eq(tabIndex).removeAttr('data-modified');
    }

    findTabIndex(tab) {
        var tabToFind = tab;

        if (tab === undefined) {
            tabToFind = $('li.active', this.$tabsContainer);
        }

        var tabParent = this.$pagesContainer;

        if ($(tabToFind).parent().hasClass('nav-tabs')) {
            tabParent = this.$tabsContainer;
        }

        return tabParent.children().index($(tabToFind));
    }

    findTabFromPane(pane) {
        var id = '#' + $(pane).attr('id'),
            tab = $('[data-target="' + id + '"]', this.$tabsContainer);

        return tab;
    }

    findPaneFromTab(tab) {
        var id = $(tab).find('> a').data('target'),
            pane = this.$pagesContainer.find(id);

        return pane;
    }

    goTo(identifier) {
        var $tab = $('[data-tab-id="'+identifier+'" ]', this.$tabsContainer)

        if ($tab.length == 0) {
            return false;
        }

        var tabIndex = this.findTabIndex($tab);
        if (tabIndex == -1) {
            return false;
        }

        this.goToIndex(tabIndex);

        this.$tabsContainer.dragScroll('goToElement', $tab);

        return true;
    }

    goToPane(pane) {
        var $pane = $(pane),
            $tab = this.findTabFromPane($pane);

        if ($pane.length == 0) {
            return;
        }

        $pane.removeClass('collapsed');

        var tabIndex = this.findTabIndex($pane);
        if (tabIndex == -1) {
            return false;
        }

        this.goToIndex(tabIndex);

        if ($tab.length > 0) {
            this.$tabsContainer.dragScroll('goToElement', $tab);
        }

        return true;
    }

    goToInvalidElement(element) {
        this.invalidElement = true;
        var result = this.goToPane(element.closest('.tab-pane'));
        this.invalidElement = false;
        return result;
    }

    goToElement(element) {
        return this.goToPane(element.closest('.tab-pane'));
    }

    findByIdentifier(identifier) {
        return $('[data-tab-id="'+identifier+'" ]', this.$tabsContainer);
    }

    updateIdentifier(tab, identifier) {
        var index = this.findTabIndex(tab);
        if (index == -1) {
            return;
        }

        $('> li', this.$tabsContainer).eq(index).attr('data-tab-id', identifier);
    }

    updateTitle(tab, title) {
        var index = this.findTabIndex(tab);
        if (index == -1) {
            return;
        }

        var processedTitle = this.generateTitleText(title, index),
            $link = $('> li > a span.title', this.$tabsContainer).eq(index);

        $link.attr('title', title);
        $link.text(processedTitle);
    }

    goToIndex(index) {
        $('> li > a', this.$tabsContainer).eq(index).tab('show');
    }

    prev() {
        var tabIndex = this.findTabIndex();
        if (tabIndex <= 0) {
            return;
        }

        this.goToIndex(tabIndex-1);
    }

    next() {
        var tabIndex = this.findTabIndex();
        if (tabIndex == -1) {
            return;
        }

        this.goToIndex(tabIndex+1);
    }

    // Tunnel to bootstrap.Tab instance
    bsTab(el) {
        if (el instanceof $) {
            el = el.get(0);
        }

        return bootstrap.Tab.getOrCreateInstance(el);
    }
}

// JQUERY PLUGIN DEFINITION
// ============================

$.fn.ocTab = function (config) {
    var args = Array.prototype.slice.call(arguments, 1), result;
    this.each((index, element) => {
        if (typeof config !== 'string') {
            element.tabInstanceConfig = config;
        }

        if (!element.tabInstance) {
            element.tabInstance = oc.observeControl(element, 'tab');
        }

        if (typeof config === 'string' && element.tabInstance) {
            result = element.tabInstance[config].apply(element.tabInstance, args);
            return typeof result === 'undefined';
        }
    });

    return result || this;
}

// GLOBAL EVENTS
// ============================

// Detect invalid fields, focus the tab
$(window).on('ajaxInvalidField', function(event, element, name, messages, isFirst){
    if (!isFirst) {
        return;
    }

    event.preventDefault();

    var $el = $(element);
    $el.closest('[data-control=tab]').ocTab('goToInvalidElement', $el);
    $el.focus();
});
