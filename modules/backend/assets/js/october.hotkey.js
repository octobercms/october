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
            keyMap = {'esc':27, 'tab':9, 'space':32, 'return':13, 'enter':13, 'backspace':8, 'scroll':145, 'capslock':20, 'numlock':144, 'pause':19,
                     'break':19, 'insert':45, 'home':36, 'delete':46, 'suppr':46, 'end':35, 'pageup':33, 'pagedown':34, 'left':37, 'up':38, 'right':39, 'down':40,
                     'f1':112, 'f2':113, 'f3':114, 'f4':115, 'f5':116, 'f6':117, 'f7':118, 'f8':119, 'f9':120, 'f10':121, 'f11':122, 'f12':123}

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