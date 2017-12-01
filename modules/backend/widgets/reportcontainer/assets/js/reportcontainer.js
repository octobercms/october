/*
 * Report container widget
 *
 * Data attributes:
 * - data-control="report-container" - enables the report container plugin
 *
 * JavaScript API:
 * $('#container').reportContainer()
 *
 * Dependancies:
 * - Isotope (isotope.js)
 */
+function ($) { "use strict";

    // REPORTCONTAINER CLASS DEFINITION
    // ============================

    var ReportContainer = function(element, options) {
        this.options = options
        this.$el= $(element)
        this.$form = this.$el.closest('form')
        this.$toolbar = $('[data-container-toolbar]', this.$form)
        this.alias = $('[data-container-alias]', this.$form).val()

        this.init();
    }

    ReportContainer.DEFAULTS = {
        breakpoint: 768,
        columns: 10
    }

    ReportContainer.prototype.init = function() {
        var self = this

        this.$el.isotope({
            itemSelector: '.item',
            resizable: false
        })

        $(window).resize($.proxy(this.updateWidth, this))
        this.updateWidth()

        if (!Modernizr.touch) {
            this.$el.sortable({
                vertical: false,
                handle: '.drag-handle',
                onDrop: function($item, container, _super) {
                    $item.removeClass('dragged')
                    $('body').removeClass('dragging')

                    self.updateSeparators()
                    self.redraw()
                    self.postSortOrders()
                }
            })
        }

        this.$el.on('hidden.oc.inspector', '[data-inspectable]', function() {
            var values = $('[data-inspector-values]', this).val(),
                parsedValues = $.parseJSON(values),
                li = $(this).closest('li').get(0)

            self.$form.request(self.alias + '::onUpdateWidget', {
                data: {
                    'fields': values,
                    'alias': $('[data-widget-alias]', $(this).closest('div.content')).val()
                },
                success: function(data) {
                    this.success(data).done(function() {
                        li.className = li.className.replace(/width\-[0-9]+/g, '')
                        $(li).addClass('width-'+parsedValues['ocWidgetWidth'])
                        $(li).toggleClass('new-line', parsedValues['ocWidgetNewRow'] == 1)

                        self.updateSeparators()
                        self.redraw()
                    })
                }
            })
        })

        this.$el.on('click', '.content > button.close', function() {
            var $btn = $(this)
            $.oc.confirm($.oc.lang.get('alert.widget_remove_confirm'), function() {
                self.$form.request(self.alias + '::onRemoveWidget', {
                    data: {
                        'alias': $('[data-widget-alias]', $btn.closest('div.content')).val()
                    }
                })

                $btn.closest('li').remove()
                self.redraw()
                self.setSortOrders()
            })
        })

        $(window).on('oc.reportWidgetAdded', function() {
            self.redraw()
            self.setSortOrders()
        })

        $(window).on('oc.reportWidgetRefresh', function() {
            self.redraw()
        })

        window.setTimeout(function() {
            self.updateWidth()
            self.redraw()
        }, 200)

        this.setSortOrders()
    }

    ReportContainer.prototype.updateWidth = function() {
        var width = this.$el.width(),
            wrapped = width <= this.options.breakpoint,
            columnWidth = wrapped ? width : width / this.options.columns

        this.$el.isotope({
            masonry: { columnWidth: columnWidth }
        })

        this.$el.toggleClass('wrapped', wrapped)
    }

    ReportContainer.prototype.redraw = function() {
        this.$el
            .isotope('reloadItems')
            .isotope({ sortBy: 'original-order' })

        var $items = $('li.item', this.$el)

        $items.css({'width': '', 'height': ''})

        $('> .dropdown', this.$toolbar).toggleClass('dropup', !!$items.length)
    }

    ReportContainer.prototype.setSortOrders = function() {
        this.sortOrders = []

        var self = this
        $('[data-widget-order]', this.$el).each(function() {
            self.sortOrders.push($(this).val())
        })
    }

    ReportContainer.prototype.postSortOrders = function() {
        var aliases = [],
            self = this

        $('[data-widget-alias]', this.$el).each(function() {
            aliases.push($(this).val())
        })

        this.$form.request(self.alias + '::onSetWidgetOrders', {
            data: {
                'aliases': aliases.join(','),
                'orders': self.sortOrders.join(',')
            }
        })
    }

    ReportContainer.prototype.updateSeparators = function() {
        $('li.item.separator', this.$el).remove()
        $('li.item.new-line', this.$el).each(function() {
            $(this).before('<li class="item separator"></li>')
        })
    }

    // REPORTCONTAINER PLUGIN DEFINITION
    // ============================

    var old = $.fn.reportContainer

    $.fn.reportContainer = function(option) {
        return this.each(function() {
            var $this   = $(this)
            var data    = $this.data('oc.reportContainer')
            var options = $.extend({}, ReportContainer.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.reportContainer', (data = new ReportContainer(this, options)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.reportContainer.Constructor = ReportContainer

    // REPORTCONTAINER NO CONFLICT
    // =================

    $.fn.reportContainer.noConflict = function() {
        $.fn.reportContainer = old
        return this
    }

    // REPORTCONTAINER DATA-API
    // ===============

    $(document).render(function() {
        $('[data-control="report-container"]').reportContainer()
    })

}(window.jQuery);
