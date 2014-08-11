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

        this.init()
    }

    FilterWidget.DEFAULTS = {
        optionsHandler: null
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
                                <li><a href="javascript:;" data-item-id="{{id}}">{{name}}</a></li> \
                            {{/available}}                                                         \
                            {{^available}}                                                         \
                                <li class="loading"><span></span></li>                             \
                            {{/available}}                                                         \
                        </ul>                                                                      \
                    </div>                                                                         \
                    <div class="filter-active-items">                                              \
                        <ul>                                                                       \
                            {{#active}}                                                            \
                                <li><a href="javascript:;" data-item-id="{{id}}">{{name}}</a></li> \
                            {{/active}}                                                            \
                        </ul>                                                                      \
                    </div>                                                                         \
                </div>                                                                             \
            '
    }

    FilterWidget.prototype.init = function() {
        var self = this

        this.$el.on('click', 'a.filter-scope', function(){
            self.displayPopover($(this))
        })
    }

    FilterWidget.prototype.displayPopover = function($scope) {
        var self = this,
            scopeName = $scope.data('scope-name'),
            data = this.scopeValues[scopeName]

        if (!data)
            self.loadOptions($scope)

        $scope.ocPopover({
            content: Mustache.render(self.getPopoverTemplate(), data),
            modal: false,
            highlightModalTarget: true,
            closeOnPageClick: true,
            placement: 'bottom'
        })
    }

    FilterWidget.prototype.loadOptions = function($scope) {
        var $form = this.$el.closest('form'),
            self = this,
            scopeName = $scope.data('scope-name'),
            data = {
                scopeName: scopeName
            }

        $form.request(this.options.optionsHandler, {
            data: data,
            success: function(data) {

                if (self.scopeValues[scopeName])
                    return

                self.scopeValues[scopeName] = data.options

                /*
                 * Inject available
                 */
                if (data.options.available) {
                    var container = $('.control-filter-popover .filter-items > ul').empty()
                    $.each(data.options.available, function(key, obj){
                        var item = $('<li />').append($('<a />').prop({
                            'href': 'javascript:;',
                            'data-item-id': obj.id
                        }).text(obj.name))
                        container.append(item)
                    })
                }

                /*
                 * Inject active
                 */
                if (data.options.active) {
                    var container = $('.control-filter-popover .filter-active-items > ul')
                    $.each(data.options.active, function(key, obj){
                        var item = $('<li />').append($('<a />').prop({
                            'href': 'javascript:;',
                            'data-item-id': obj.id
                        }).text(obj.name))
                        container.append(item)
                    })
                }

            }
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

