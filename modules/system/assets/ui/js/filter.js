/*
 * Filter Widget
 *
 * Data attributes:
 * - data-behavior="filter" - enables the filter plugin
 *
 * Dependences:
 * - October Popover (october.popover.js)
 *
 * Notes:
 *   Ideally this control would not depend on loader or the AJAX framework,
 *   then the Filter widget can use events to handle this business logic.
 *
 * Require:
 *  - mustache/mustache
 *  - modernizr/modernizr
 *  - storm/popover
 */
+function ($) { "use strict";

    var FilterWidget = function (element, options) {
        this.$el = $(element);

        this.options = options || {}
        this.scopeValues = {}
        this.scopeAvailable = {}
        this.$activeScope = null
        this.activeScopeName = null
        this.isActiveScopeDirty = false

        /*
         * Throttle dependency updating
         */
        this.dependantUpdateInterval = 300
        this.dependantUpdateTimers = {}

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
        return '                                                                                                       \
                <form id="filterPopover-{{ scopeName }}">                                                              \
                    <input type="hidden" name="scopeName"  value="{{ scopeName }}" />                                  \
                    <div id="controlFilterPopover" class="control-filter-popover control-filter-box-popover --range">  \
                        <div class="filter-search loading-indicator-container size-input-text">                        \
                            <button class="close" data-dismiss="popover" type="button">&times;</button>                \
                            <input                                                                                     \
                                type="text"                                                                            \
                                name="search"                                                                          \
                                autocomplete="off"                                                                     \
                                class="filter-search-input form-control icon search popup-allow-focus"                 \
                                data-search />                                                                         \
                            <div class="filter-items">                                                                 \
                                <ul>                                                                                   \
                                    {{#available}}                                                                     \
                                        <li data-item-id="{{id}}"><a href="javascript:;">{{name}}</a></li>             \
                                    {{/available}}                                                                     \
                                    {{#loading}}                                                                       \
                                        <li class="loading"><span></span></li>                                         \
                                    {{/loading}}                                                                       \
                                </ul>                                                                                  \
                            </div>                                                                                     \
                            <div class="filter-active-items">                                                          \
                                <ul>                                                                                   \
                                    {{#active}}                                                                        \
                                        <li data-item-id="{{id}}"><a href="javascript:;">{{name}}</a></li>             \
                                    {{/active}}                                                                        \
                                </ul>                                                                                  \
                            </div>                                                                                     \
                            <div class="filter-buttons">                                                               \
                                <button class="btn btn-block btn-primary oc-icon-filter" data-filter-action="apply">   \
                                    {{ apply_button_text }}                                                            \
                                </button>                                                                              \
                                <button class="btn btn-block btn-secondary oc-icon-eraser" data-filter-action="clear"> \
                                    {{ clear_button_text }}                                                            \
                                </button>                                                                              \
                            </div>                                                                                     \
                        </div>                                                                                         \
                    </div>                                                                                             \
                </form>                                                                                                \
            '
    }

    FilterWidget.prototype.init = function() {
        var self = this

        this.bindDependants()

        // Setup event handler on type: checkbox scopes
        this.$el.on('change', '.filter-scope input[type="checkbox"]', function(){
            var $scope = $(this).closest('.filter-scope')

            if ($scope.hasClass('is-indeterminate')) {
                self.switchToggle($(this))
            }
            else {
                self.checkboxToggle($(this))
            }
        })

        // Apply classes to type: checkbox scopes that are active from the server
        $('.filter-scope input[type="checkbox"]', this.$el).each(function() {
            $(this)
                .closest('.filter-scope')
                .toggleClass('active', $(this).is(':checked'))
        })

        // Setup click handler on type: group scopes
        this.$el.on('click', 'a.filter-scope', function(){
            var $scope = $(this),
                scopeName = $scope.data('scope-name')

            // Second click closes the filter scope
            if ($scope.hasClass('filter-scope-open')) return

            self.$activeScope = $scope
            self.activeScopeName = scopeName
            self.isActiveScopeDirty = false
            self.displayPopover($scope)
            $scope.addClass('filter-scope-open')
        })

        // Setup event handlers on type: group scopes' controls
        this.$el.on('show.oc.popover', 'a.filter-scope', function(event){
            self.focusSearch()

            $(event.relatedTarget).on('click', '#controlFilterPopover .filter-items > ul > li', function(){
                self.selectItem($(this))
            })

            $(event.relatedTarget).on('click', '#controlFilterPopover .filter-active-items > ul > li', function(){
                self.selectItem($(this), true)
            })

            $(event.relatedTarget).on('ajaxDone', '#controlFilterPopover input.filter-search-input', function(event, context, data){
                self.filterAvailable(data.scopeName, data.options.available)
            })

            $(event.relatedTarget).on('click', '#controlFilterPopover [data-filter-action="apply"]', function (e) {
                e.preventDefault()
                self.filterScope()
            })

            $(event.relatedTarget).on('click', '#controlFilterPopover [data-filter-action="clear"]', function (e) {
                e.preventDefault()
                self.filterScope(true)
            })

            $(event.relatedTarget).on('input', '#controlFilterPopover input[data-search]', function (e) {
                self.searchQuery($(this))
            });
        })

        // Setup event handler to apply selected options when closing the type: group scope popup
        this.$el.on('hide.oc.popover', 'a.filter-scope', function(){
            var $scope = $(this)
            self.pushOptions(self.activeScopeName)
            self.activeScopeName = null
            self.$activeScope = null

            // Second click closes the filter scope
            setTimeout(function() { $scope.removeClass('filter-scope-open') }, 200)
        })
    }

    /*
     * Bind dependant scopes
     */
    FilterWidget.prototype.bindDependants = function() {
        if (!$('[data-scope-depends]', this.$el).length) {
            return;
        }

        var self = this,
            scopeMap = {},
            scopeElements = this.$el.find('.filter-scope')

        /*
         * Map master and slave scope
         */
        scopeElements.filter('[data-scope-depends]').each(function() {
            var name = $(this).data('scope-name'),
                depends = $(this).data('scope-depends')

            $.each(depends, function(index, depend){
                if (!scopeMap[depend]) {
                    scopeMap[depend] = { scopes: [] }
                }

                scopeMap[depend].scopes.push(name)
            })
        })

        /*
         * When a master is updated, refresh its slaves
         */
        $.each(scopeMap, function(scopeName, toRefresh){
            scopeElements.filter('[data-scope-name="'+scopeName+'"]')
                .on('change.oc.filterScope', $.proxy(self.onRefreshDependants, self, scopeName, toRefresh))
        })
    }

    /*
     * Refresh a dependancy scope
     * Uses a throttle to prevent duplicate calls and click spamming
     */
    FilterWidget.prototype.onRefreshDependants = function(scopeName, toRefresh) {
        var self = this,
            scopeElements = this.$el.find('.filter-scope')

        if (this.dependantUpdateTimers[scopeName] !== undefined) {
            window.clearTimeout(this.dependantUpdateTimers[scopeName])
        }

        this.dependantUpdateTimers[scopeName] = window.setTimeout(function() {
            $.each(toRefresh.scopes, function (index, dependantScope) {
                self.scopeValues[dependantScope] = null
                var $scope = self.$el.find('[data-scope-name="'+dependantScope+'"]')

                /*
                 * Request options from server
                 */
                self.$el.request(self.options.optionsHandler, {
                    data: { scopeName: dependantScope },
                    success: function(data) {
                        self.fillOptions(dependantScope, data.options)
                        self.updateScopeSetting($scope, data.options.active.length)
                        $scope.loadIndicator('hide')
                    }
                })
            })
        }, this.dependantUpdateInterval)

        $.each(toRefresh.scopes, function(index, scope) {
            scopeElements.filter('[data-scope-name="'+scope+'"]')
                .addClass('loading-indicator-container')
                .loadIndicator()
        })
    }

    FilterWidget.prototype.focusSearch = function() {
        if (Modernizr.touchevents)
            return

        var $input = $('#controlFilterPopover input.filter-search-input'),
            length = $input.val().length

        $input.focus()
        $input.get(0).setSelectionRange(length, length)
    }

    FilterWidget.prototype.updateScopeSetting = function($scope, amount) {
        var $setting = $scope.find('.filter-setting')

        if (amount) {
            $setting.text(amount)
            $scope.addClass('active')
        }
        else {
            $setting.text(this.getLang('filter.group.all', 'all'))
            $scope.removeClass('active')
        }
    }

    FilterWidget.prototype.selectItem = function($item, isDeselect) {
        var $otherContainer = isDeselect
            ? $item.closest('.control-filter-popover').find('.filter-items:first > ul')
            : $item.closest('.control-filter-popover').find('.filter-active-items:first > ul')

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
            active = this.scopeValues[this.activeScopeName],
            available = this.scopeAvailable[this.activeScopeName],
            fromItems = isDeselect ? active : available,
            toItems = isDeselect ? available : active,
            testFunc = function(active){ return active.id == itemId },
            item = $.grep(fromItems, testFunc).pop(),
            filtered = $.grep(fromItems, testFunc, true)

        if (isDeselect)
            this.scopeValues[this.activeScopeName] = filtered
        else
            this.scopeAvailable[this.activeScopeName] = filtered

        if (item)
            toItems.push(item)

        this.toggleFilterButtons(active)
        this.updateScopeSetting(this.$activeScope, isDeselect ? filtered.length : active.length)
        this.isActiveScopeDirty = true
        this.focusSearch()
    }

    FilterWidget.prototype.displayPopover = function($scope) {
        var self = this,
            scopeName = $scope.data('scope-name'),
            data = null,
            isLoaded = true,
            container = false

        if (typeof this.scopeAvailable[scopeName] !== "undefined" && this.scopeAvailable[scopeName]) {
            data = $.extend({}, data, {
                available: this.scopeAvailable[scopeName],
                active: this.scopeValues[scopeName]
            })
        }

        // If the filter is running in a modal, popovers should be
        // attached to the modal container. This prevents z-index issues.
        var modalParent = $scope.parents('.modal-dialog')
        if (modalParent.length > 0) {
            container = modalParent[0]
        }

        if (!data) {
            data = { loading: true }
            isLoaded = false
        }

        data = $.extend({}, data, {
            apply_button_text: this.getLang('filter.scopes.apply_button_text', 'Apply'),
            clear_button_text: this.getLang('filter.scopes.clear_button_text', 'Clear')
        })

        data.scopeName = scopeName
        data.optionsHandler = self.options.optionsHandler

        // Destroy any popovers already bound
        $scope.data('oc.popover', null)

        $scope.ocPopover({
            content: Mustache.render(self.getPopoverTemplate(), data),
            modal: false,
            highlightModalTarget: true,
            closeOnPageClick: true,
            placement: 'bottom',
            container: container
        })

        this.toggleFilterButtons()

        // Load options for the first time
        if (!isLoaded) {
            self.loadOptions(scopeName)
        }
    }

    /*
     * Returns false if loading options is instant,
     * otherwise returns a deferred promise object.
     */
    FilterWidget.prototype.loadOptions = function(scopeName) {
        var self = this,
            data = { scopeName: scopeName }

        /*
         * Dataset provided manually
         */
        var populated = this.$el.data('filterScopes')
        if (populated && populated[scopeName]) {
            self.fillOptions(scopeName, populated[scopeName])
            return false
        }

        /*
         * Request options from server
         */
        return this.$el.request(this.options.optionsHandler, {
            data: data,
            success: function(data) {
                self.fillOptions(scopeName, data.options)
                self.toggleFilterButtons()
            }
        })
    }

    FilterWidget.prototype.fillOptions = function(scopeName, data) {
        if (this.scopeValues[scopeName])
            return

        if (!data.active) data.active = []
        if (!data.available) data.available = []

        this.scopeValues[scopeName] = data.active;
        this.scopeAvailable[scopeName] = data.available;

        // Do not render if scope has changed
        if (scopeName != this.activeScopeName)
            return

        /*
         * Inject available
         */
        var container = $('#controlFilterPopover .filter-items > ul').empty()
        this.addItemsToListElement(container, data.available)

        /*
         * Inject active
         */
        var container = $('#controlFilterPopover .filter-active-items > ul')
        this.addItemsToListElement(container, data.active)
    }

    FilterWidget.prototype.filterAvailable = function(scopeName, available) {
        if (this.activeScopeName != scopeName)
            return

        if (!this.scopeValues[this.activeScopeName])
            return

        var
            self = this,
            filtered = [],
            items = this.scopeValues[scopeName]

        /*
         * Ensure any active items do not appear in the search results
         */
        if (items.length) {
            var activeIds = []
            $.each(items, function (key, obj) {
                activeIds.push(obj.id)
            })

            filtered = $.grep(available, function(item) {
                return $.inArray(item.id, activeIds) === -1
            })
        }
        else {
            filtered = available
        }

        var container = $('#controlFilterPopover .filter-items > ul').empty()
        self.addItemsToListElement(container, filtered)
    }

    FilterWidget.prototype.addItemsToListElement = function($ul, items) {
        $.each(items, function(key, obj){
            var item = $('<li />').data({ 'item-id': obj.id })
                .append($('<a />').prop({ 'href': 'javascript:;',}).text(obj.name))

            $ul.append(item)
        })
    }

    FilterWidget.prototype.toggleFilterButtons = function(data)
    {
        var items = $('#controlFilterPopover .filter-active-items > ul'),
            buttonContainer = $('#controlFilterPopover .filter-buttons')

        if (data) {
            data.length > 0 ? buttonContainer.show() : buttonContainer.hide()
        } else {
            items.children().length > 0 ? buttonContainer.show() : buttonContainer.hide()
        }
    }

    /*
     * Saves the options to the update handler
     */
    FilterWidget.prototype.pushOptions = function(scopeName) {
        if (!this.isActiveScopeDirty || !this.options.updateHandler)
            return

        var self = this,
            data = {
                scopeName: scopeName,
                options: JSON.stringify(this.scopeValues[scopeName])
            }

        $.oc.stripeLoadIndicator.show()

        this.$el.request(this.options.updateHandler, {
            data: data
        }).always(function () {
            $.oc.stripeLoadIndicator.hide()
        }).done(function () {
            // Trigger dependsOn updates on successful requests
            self.$el.find('[data-scope-name="'+scopeName+'"]').trigger('change.oc.filterScope')
        })
    }

    FilterWidget.prototype.checkboxToggle = function($el) {
        var isChecked = $el.is(':checked'),
            $scope = $el.closest('.filter-scope'),
            scopeName = $scope.data('scope-name')

        this.scopeValues[scopeName] = isChecked

        if (this.options.updateHandler) {
            var data = {
                    scopeName: scopeName,
                    value: isChecked
                }

            $.oc.stripeLoadIndicator.show()
            this.$el.request(this.options.updateHandler, {
                data: data
            }).always(function(){
                $.oc.stripeLoadIndicator.hide()
            })
        }

        $scope.toggleClass('active', isChecked)
    }

    FilterWidget.prototype.switchToggle = function($el) {
        var switchValue = $el.data('checked'),
            $scope = $el.closest('.filter-scope'),
            scopeName = $scope.data('scope-name')

        this.scopeValues[scopeName] = switchValue

        if (this.options.updateHandler) {
            var data = {
                    scopeName: scopeName,
                    value: switchValue
                }

            $.oc.stripeLoadIndicator.show()
            this.$el.request(this.options.updateHandler, {
                data: data
            }).always(function(){
                $.oc.stripeLoadIndicator.hide()
            })
        }

        $scope.toggleClass('active', !!switchValue)
    }

    FilterWidget.prototype.filterScope = function (isReset) {
        var scopeName = this.$activeScope.data('scope-name')

        if (isReset) {
            this.scopeValues[scopeName] = null
            this.scopeAvailable[scopeName] = null
            this.updateScopeSetting(this.$activeScope, 0)
        }

        this.pushOptions(scopeName);
        this.isActiveScopeDirty = true;
        this.$activeScope.data('oc.popover').hide()
    }

    FilterWidget.prototype.getLang = function(name, defaultValue) {
        if ($.oc === undefined || $.oc.lang === undefined) {
            return defaultValue
        }

        return $.oc.lang.get(name, defaultValue)
    }

    FilterWidget.prototype.searchQuery = function ($el) {
        if (this.dataTrackInputTimer !== undefined) {
            window.clearTimeout(this.dataTrackInputTimer)
        }

        var self = this

        this.dataTrackInputTimer = window.setTimeout(function () {
            var
                lastValue = $el.data('oc.lastvalue'),
                thisValue = $el.val()

            if (lastValue !== undefined && lastValue == thisValue) {
                return
            }

            $el.data('oc.lastvalue', thisValue)

            if (self.lastDataTrackInputRequest) {
                self.lastDataTrackInputRequest.abort()
            }

            var data = {
                scopeName: self.activeScopeName,
                search: thisValue
            }

            $.oc.stripeLoadIndicator.show()
            self.lastDataTrackInputRequest = self.$el.request(self.options.optionsHandler, {
                data: data
            }).success(function(data){
                self.filterAvailable(self.activeScopeName, data.options.available)
                self.toggleFilterButtons()
            }).always(function(){
                $.oc.stripeLoadIndicator.hide()
            })
        }, 300)
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

