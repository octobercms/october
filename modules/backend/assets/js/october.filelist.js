/*
 * File List
 *
 * Creates a tree list of clickable folders and files.
 *
 * Data attributes:
 * - data-control="filelist" - enables the file list plugin
 * - data-group-status-handler - AJAX handler to execute when a group is collapsed or expanded by a user
 *
 * JavaScript API:
 * $('#list').fileList()
 *
 * Events
 * - open.oc.list - this event is triggered on the list element when an item is clicked.
 *
 * Dependences: 
 * - Null
 */

+function ($) { "use strict";

    // FILELIST CLASS DEFINITION
    // ============================

    var FileList = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        this.init();
    }

    FileList.DEFAULTS = {

    }

    FileList.prototype.init = function (){
        var self = this

        this.$el.on('click', 'li.group > h4 > a, li.group > div.group', function() {
            self.toggleGroup($(this).closest('li'))

            return false;
        });

        this.$el.on('click', 'li.item > a', function(event) {
            var e = $.Event('open.oc.list', {relatedTarget: $(this).parent().get(0), clickEvent: event})
            self.$el.trigger(e, this)

            return false
        })

        this.$el.on('ajaxUpdate', $.proxy(this.update, this))
    }

    FileList.prototype.toggleGroup = function(group) {
        var $group = $(group);

        $group.attr('data-status') == 'expanded' ?
            this.collapseGroup($group) : 
            this.expandGroup($group)
    }

    FileList.prototype.collapseGroup = function(group) {
        var 
            $list = $('> ul, > div.subitems', group),
            self = this;

        $list.css('overflow', 'hidden')
        $list.animate({'height': 0}, { duration: 100, queue: false, complete: function() {
            $list.css({
                'overflow': 'visible',
                'display': 'none'
            })
            $(group).attr('data-status', 'collapsed')
            $(window).trigger('resize')
        } })

        this.sendGroupStatusRequest(group, 0);
    }

    FileList.prototype.expandGroup = function(group) {
        var 
            $list = $('> ul, > div.subitems', group),
            self = this;

        $list.css({
            'overflow': 'hidden',
            'display': 'block',
            'height': 0
        })
        $list.animate({'height': $list[0].scrollHeight}, { duration: 100, queue: false, complete: function() {
            $list.css({
                'overflow': 'visible',
                'height': 'auto'
            })
            $(group).attr('data-status', 'expanded')
            $(window).trigger('resize')
        } })

        this.sendGroupStatusRequest(group, 1);
    }

    FileList.prototype.sendGroupStatusRequest = function(group, status) {
        if (this.options.groupStatusHandler !== undefined) {
            var groupId = $(group).data('group-id')
            if (groupId === undefined)
                groupId = $('> h4 a', group).text();

            $(group).request(this.options.groupStatusHandler, {data: {group: groupId, status: status}})
        }
    }

    FileList.prototype.markActive = function(dataId) {
        $('li.item', this.$el).removeClass('active')
        if (dataId)
            $('li.item[data-id="'+dataId+'"]', this.$el).addClass('active')

        this.dataId = dataId
    }

    FileList.prototype.update = function() {
        if (this.dataId !== undefined)
            this.markActive(this.dataId)
    }

    // FILELIST PLUGIN DEFINITION
    // ============================

    var old = $.fn.fileList

    $.fn.fileList = function (option) {
        var args = arguments;

        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.fileList')
            var options = $.extend({}, FileList.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('oc.fileList', (data = new FileList(this, options)))
            if (typeof option == 'string') { 
                var methodArgs = [];
                for (var i=1; i<args.length; i++)
                    methodArgs.push(args[i])

                data[option].apply(data, methodArgs)
            }
        })
    }

    $.fn.fileList.Constructor = FileList

    // FILELIST NO CONFLICT
    // =================

    $.fn.fileList.noConflict = function () {
        $.fn.fileList = old
        return this
    }

    // FILELIST DATA-API
    // ===============

    $(document).ready(function () {
        $('[data-control=filelist]').fileList()
    })

}(window.jQuery);