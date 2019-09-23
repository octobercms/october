/*
 * Hot key binding.
 *
 * Data attributes:
 * - data-hotkey="ctrl+s, cmd+s" - enables the hotkey plugin
 *
 * JavaScript API:
 *
 * $('html').hotKey({ hotkey: 'ctrl+s, cmd+s', hotkeyVisible: false, callback: doSomething });
 */
+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var HotKey = function (element, options) {
        if (!options.hotkey) {
            throw new Error('No hotkey has been defined.');
        }

        this.$el = $(element)
        this.$target = $(options.hotkeyTarget)
        this.options = options || {}
        this.keyConditions = []
        this.keyMap = null

        $.oc.foundation.controlUtils.markDisposable(element)

        Base.call(this)

        this.init()
    }

    HotKey.prototype = Object.create(BaseProto)
    HotKey.prototype.constructor = HotKey

    HotKey.prototype.dispose = function() {
        if (this.$el === null) {
            return
        }

        this.unregisterHandlers()

        this.$el.removeData('oc.hotkey')
        this.$target = null
        this.$el = null
        this.keyConditions = null
        this.keyMap = null
        this.options = null

        BaseProto.dispose.call(this)
    }

    HotKey.prototype.init = function() {
        this.initKeyMap()

        var keys = this.options.hotkey.toLowerCase().split(',')

        for (var i = 0, len = keys.length; i < len; i++) {
            var keysTrimmed = this.trim(keys[i])
            this.keyConditions.push(this.makeCondition(keysTrimmed))
        }

        this.$target.on('keydown', this.proxy(this.onKeyDown))
        this.$el.one('dispose-control', this.proxy(this.dispose))
    }

    HotKey.prototype.unregisterHandlers = function() {
        this.$target.off('keydown', this.proxy(this.onKeyDown))
        this.$el.off('dispose-control', this.proxy(this.dispose))
    }

    HotKey.prototype.makeCondition = function(keyBind) {
        var condition = { shift: false, ctrl: false, cmd: false, alt: false, specific: -1 },
            keys = keyBind.split('+')

        for (var i = 0, len = keys.length; i < len; i++) {
            switch (keys[i]) {
                case 'shift':
                    condition.shift = true
                    break
                case 'ctrl':
                    condition.ctrl = true
                    break
                case 'command':
                case 'cmd':
                case 'meta':
                    condition.cmd = true
                    break
                case 'alt':
                case 'option':
                    condition.alt = true
                    break
            }
        }

        condition.specific = this.keyMap[keys[keys.length-1]]

        if (typeof (condition.specific) == 'undefined') {
            condition.specific = keys[keys.length-1].toUpperCase().charCodeAt()
        }

        return condition
    }

    HotKey.prototype.initKeyMap = function() {
        this.keyMap = {
            'esc':       27,
            'tab':       9,
            'space':     32,
            'return':    13,
            'enter':     13,
            'backspace': 8,
            'scroll':    145,
            'capslock':  20,
            'numlock':   144,
            'pause':     19,
            'break':     19,
            'insert':    45,
            'home':      36,
            'delete':    46,
            'suppr':     46,
            'end':       35,
            'pageup':    33,
            'pagedown':  34,
            'left':      37,
            'up':        38,
            'right':     39,
            'down':      40,
            'f1':        112,
            'f2':        113,
            'f3':        114,
            'f4':        115,
            'f5':        116,
            'f6':        117,
            'f7':        118,
            'f8':        119,
            'f9':        120,
            'f10':       121,
            'f11':       122,
            'f12':       123
        }
    }

    HotKey.prototype.trim = function(str) {
        return str
            .replace(/^\s+/, "")
            .replace(/\s+$/, "")
    }

    HotKey.prototype.testConditions = function(ev) {
        for (var i = 0, len = this.keyConditions.length; i < len; i++) {
            var condition = this.keyConditions[i]

            if (ev.which === condition.specific
                && ev.originalEvent.shiftKey === condition.shift
                && ev.originalEvent.ctrlKey === condition.ctrl
                && ev.originalEvent.metaKey === condition.cmd
                && ev.originalEvent.altKey === condition.alt) {
                return true
            }
        }

        return false
    }

    HotKey.prototype.onKeyDown = function(ev) {
        if (this.testConditions(ev)) {
            if (this.options.hotkeyVisible && !this.$el.is(':visible')) {
                return
            }

            if (this.options.callback) {
                return this.options.callback(this.$el, ev.currentTarget, ev)
            }
        }
    }

    HotKey.DEFAULTS = {
        hotkey: null,
        hotkeyTarget: 'html',
        hotkeyVisible: true,
        callback: function(element) {
            element.trigger('click')
            return false
        }
    }

    // HOTKEY PLUGIN DEFINITION
    // ============================

    var old = $.fn.hotKey

    $.fn.hotKey = function (option) {
        var args = arguments;

        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.hotkey')
            var options = $.extend({}, HotKey.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.hotkey', (data = new HotKey(this, options)))
            if (typeof option == 'string') data[option].apply(data, args)
        })
    }

    $.fn.hotKey.Constructor = HotKey

    // HOTKEY NO CONFLICT
    // =================

    $.fn.hotKey.noConflict = function () {
        $.fn.hotKey = old
        return this
    }

    // HOTKEY DATA-API
    // ==============

    $(document).render(function() {
        $('[data-hotkey]').hotKey()
    })

}(window.jQuery);
