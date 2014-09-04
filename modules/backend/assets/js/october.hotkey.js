/*
 * Hot key binding.
 * 
 * Data attributes:
 * - data-hotkey="ctrl+s, cmd+s" - enables the autocomplete plugin
 *
 * JavaScript API:
 *
 * $('html').hotKey({ hotkey: 'ctrl+s, cmd+s', callback: doSomething);
 */
+function ($) { "use strict";

    var HotKey = function (element, options) {

        var $el = this.$el = $(element)
        var $target = this.$target = $(options.hotkeyTarget)

        this.options = options || {}

        if (!options.hotkey)
            throw new Error('No hotkey has been defined.');

        if (options.hotkeyMac) options.hotkey += ', ' + options.hotkeyMac // @todo deprecated

        var
            keys = options.hotkey.toLowerCase().split(','),
            keysCount = keys.length,
            keyConditions = [],
            keyPressed = { shift: false, ctrl: false, cmd: false, alt: false },
            keyMap = {8: "backspace", 9: "tab", 10: "return", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
                      20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
                      37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 59: ";", 61: "=",
                      96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
                      104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
                      112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
                      120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 173: "-", 186: ";", 187: "=",
                      188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\", 221: "]", 222: "'"}

        for (var i = 0; i < keysCount; i++) {
            keyConditions.push(makeCondition(trim(keys[i])))
        }

        $target.keydown(function (event) {
            keyPressed.shift = event.originalEvent.shiftKey
            keyPressed.ctrl = event.originalEvent.ctrlKey
            keyPressed.cmd = event.originalEvent.metaKey
            keyPressed.alt = event.originalEvent.altKey

            if (testConditions(event)) {
                if (options.hotkeyVisible && !$el.is(':visible'))
                    return

                if (options.callback)
                    return options.callback($el, this)

                keyPressed.shift = false
                keyPressed.ctrl = false
                keyPressed.cmd = false
                keyPressed.alt = false
            }

        });

        $target.keyup(function (event) {
            keyPressed.shift = event.originalEvent.shiftKey
            keyPressed.ctrl = event.originalEvent.ctrlKey
            keyPressed.cmd = event.originalEvent.metaKey
            keyPressed.alt = event.originalEvent.altKey
        });

        function testConditions(event) {
            var count = keyConditions.length,
                condition

            for (var i = 0; i < count; i++) {
                condition = keyConditions[i]

                if (event.which == condition.specific
                    && keyPressed.shift == condition.shift
                    && keyPressed.ctrl == condition.ctrl
                    && keyPressed.cmd == condition.cmd
                    && keyPressed.alt == condition.alt) {
                    return true
                }
            }

            return false
        }

        function makeCondition(keyBind) {
            var condition = { shift: false, ctrl: false, cmd: false, alt: false, specific: -1 },
                keys = keyBind.split('+'),
                count = keys.length

            for (var i = 0; i < count; i++) {
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
                        condition.alt = true
                        break
                }
            }

            condition.specific = keyMap[keys[keys.length-1]]

            if (typeof (condition.specific) == 'undefined')
                condition.specific = keys[keys.length-1].toUpperCase().charCodeAt()

            return condition
        }

        function trim(str){
            return str
                .replace(/^\s+/, "") // Left
                .replace(/\s+$/, "") // Right
        }
    }

    HotKey.DEFAULTS = {
        hotkey: null,
        hotkeyMac: null, // @todo deprecated
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
            if (typeof option == 'string') data[option].call($this)
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
    
    $(document).render(function(){
        $('[data-hotkey]').hotKey()
    })

}(window.jQuery);