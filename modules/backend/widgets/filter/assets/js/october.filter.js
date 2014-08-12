/*
 * Filter Widget
 *
 * Dependences:
 * - Nil
 */
+function ($) { "use strict";

    var FilterWidget = function (element, options) {

        var $el = this.$el = $(element);

        this.options = options || {}
        this.scopeValues = {}
        this.$activeScope = null
        this.activeScopeName = null
        this.isActiveScopeDirty = false

        this.init()
    }

    FilterWidget.DEFAULTS = {
        optionsHandler: null,
        updateHandler: null
    }

    /*
     * Get popover template
     */
    FilterWidget.prototype.getPopoverTemplate = function() {

        return '                                                                                   \
                <div class="control-filter-popover">                                               \
                    <div class="filter-search">                                                    \
                        <input type="text" class="form-control" />                                 \
                    </div>                                                                         \
                    <div class="filter-items">                                                     \
                        <ul>                                                                       \
                            {{#available}}                                                         \
                                <li data-item-id="{{id}}"><a href="javascript:;">{{name}}</a></li> \
                            {{/available}}                                                         \
                            {{#loading}}                                                           \
                                <li class="loading"><span></span></li>                             \
                            {{/loading}}                                                           \
                        </ul>                                                                      \
                    </div>                                                                         \
                    <div class="filter-active-items">                                              \
                        <ul>                                                                       \
                            {{#active}}                                                            \
                                <li data-item-id="{{id}}"><a href="javascript:;">{{name}}</a></li> \
                            {{/active}}                                                            \
                        </ul>                                                                      \
                    </div>                                                                         \
                </div>                                                                             \
            '
    }

    FilterWidget.prototype.init = function() {
        var self = this

        this.$el.on('click', 'a.filter-scope', function(){
            self.$activeScope = $(this)
            self.activeScopeName = self.$activeScope.data('scope-name')
            self.isActiveScopeDirty = false
            self.displayPopover(self.$activeScope)
        })

        this.$el.on('hide.oc.popover', 'a.filter-scope', function(){
            self.pushOptions(self.activeScopeName)
        })

        $(document).on('click', '.control-filter-popover .filter-items > ul > li', function(){
            self.selectItem($(this))
        })

        $(document).on('click', '.control-filter-popover .filter-active-items > ul > li', function(){
            self.selectItem($(this), true)
        })
    }

    FilterWidget.prototype.updateScopeSetting = function($scope, amount) {
        var $setting = $scope.find('.filter-setting')

        if (amount) {
            $setting.text(amount)
            $scope.addClass('active')
        }
        else {
            $setting.text('all')
            $scope.removeClass('active')
        }
    }

    FilterWidget.prototype.selectItem = function($item, isDeselect) {
        var $otherContainer = isDeselect
            ? $item.closest('.control-filter-popover').find('.filter-items:first > ul')
            : $item.closest('.control-filter-popover').find('.filter-active-items:first > ul')

        // Cannot filter by everything (pointless)
        // if (!isDeselect && $item.siblings().length <= 0)
        //     return

        $item
            .addClass('animate-enter')
            .prependTo($otherContainer)
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                $(this).removeClass('animate-enter')
            })

        if (!this.scopeValues[this.activeScopeName])
            return

        var
            itemId = $item.data('item-id'),
            items = this.scopeValues[this.activeScopeName],
            fromItems = isDeselect ? items.active : items.available,
            toItems = isDeselect ? items.available : items.active,
            testFunc = function(item){ return item.id == itemId },
            item = $.grep(fromItems, testFunc).pop(),
            filtered = $.grep(fromItems, testFunc, true)

        if (isDeselect)
            this.scopeValues[this.activeScopeName].active = filtered
        else
            this.scopeValues[this.activeScopeName].available = filtered

        if (item)
            toItems.push(item)

        this.updateScopeSetting(this.$activeScope, items.active.length)
        this.isActiveScopeDirty = true
    }

    FilterWidget.prototype.displayPopover = function($scope) {
        var self = this,
            scopeName = $scope.data('scope-name'),
            data = this.scopeValues[scopeName]

        if (!data) {
            self.loadOptions(scopeName)
            data = { loading: true }
        }

        // Destroy any popovers already bound
        $scope.data('oc.popover', null)

        $scope.ocPopover({
            content: Mustache.render(self.getPopoverTemplate(), data),
            modal: false,
            highlightModalTarget: true,
            closeOnPageClick: true,
            placement: 'bottom'
        })
    }

    FilterWidget.prototype.loadOptions = function(scopeName) {
        var $form = this.$el.closest('form'),
            self = this,
            data = { scopeName: scopeName }

        $form.request(this.options.optionsHandler, {
            data: data,
            success: function(data) {

                if (self.scopeValues[scopeName])
                    return

                self.scopeValues[scopeName] = data.options

                // Do not render if scope has changed
                if (scopeName != self.activeScopeName)
                    return

                /*
                 * Inject available
                 */
                if (data.options.available) {
                    var container = $('.control-filter-popover .filter-items > ul').empty()
                    $.each(data.options.available, function(key, obj){
                        var item = $('<li />').data({ 'item-id': obj.id })
                            .append($('<a />').prop({ 'href': 'javascript:;',}).text(obj.name))
                        container.append(item)
                    })
                }

                /*
                 * Inject active
                 */
                if (data.options.active) {
                    var container = $('.control-filter-popover .filter-active-items > ul')
                    $.each(data.options.active, function(key, obj){
                        var item = $('<li />').data({ 'item-id': obj.id })
                            .append($('<a />').prop({ 'href': 'javascript:;',}).text(obj.name))
                        container.append(item)
                    })
                }

            }
        })

    }

    FilterWidget.prototype.pushOptions = function(scopeName) {
        if (!this.isActiveScopeDirty)
            return

        var $form = this.$el.closest('form'),
            data = {
                scopeName: scopeName,
                options: this.scopeValues[scopeName]
            }

        $form.request(this.options.updateHandler, {
            data: data
        })
    }

    // FILTER WIDGET PLUGIN DEFINITION
    // ============================

    var old = $.fn.filterWidget

    $.fn.filterWidget = function (option) {
        var args = arguments,
            result

        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.filterwidget')
            var options = $.extend({}, FilterWidget.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.filterwidget', (data = new FilterWidget(this, options)))
            if (typeof option == 'string') result = data[option].call($this)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
      }

    $.fn.filterWidget.Constructor = FilterWidget

    // FILTER WIDGET NO CONFLICT
    // =================

    $.fn.filterWidget.noConflict = function () {
        $.fn.filterWidget = old
        return this
    }

    // FILTER WIDGET DATA-API
    // ==============

    $(document).render(function(){
        $('[data-control="filterwidget"]').filterWidget();
    })

}(window.jQuery);

