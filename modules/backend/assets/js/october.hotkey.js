/*
 * Hot key binding. 
 *
 * JavaScript API:
 *
 * $('html').hotKey({ hotkey: 'Ctrl+S', hotkeyMac: 'Command+M', callback: doSomething);
 */
+function ($) { "use strict";

    var HotKey = function (element, options) {

        var $el = this.$el = $(element)
        var $target = this.$target = $(options.hotkeyTarget)

        this.options = options || {}

        if (!options.hotkey)
            throw new Error('No hotkey has been defined.');

        if (!options.hotkeyMac)
            options.hotkeyMac = options.hotkey

        var
            keys,
            keysCount,
            platform = (navigator.userAgent.indexOf('Mac OS X') != -1) ? 'hotkeyMac' : 'hotkey',
            keyBind = options[platform].toLowerCase(),
            keyPressed = { shift: false, ctrl: false, cmd: false, alt: false },
            keyWaited = { shift: false, ctrl: false, cmd: false, alt: false, specific: -1 },
            keyMap = {'esc':27, 'tab':9, 'space':32, 'return':13, 'enter':13, 'backspace':8, 'scroll':145, 'capslock':20, 'numlock':144, 'pause':19,
                     'break':19, 'insert':45, 'home':36, 'delete':46, 'suppr':46, 'end':35, 'pageup':33, 'pagedown':34, 'left':37, 'up':38, 'right':39, 'down':40,
                     'f1':112, 'f2':113, 'f3':114, 'f4':115, 'f5':116, 'f6':117, 'f7':118, 'f8':119, 'f9':120, 'f10':121, 'f11':122, 'f12':123}

        keys = keyBind.split('+')
        keysCount = keys.length;
        for (var i = 0; i < keysCount; i++) {
            switch (keys[i]) {
                case 'shift':
                    keyWaited.shift = true
                    break
                case 'ctrl':
                    keyWaited.ctrl = true
                    break
                case 'command':
                case 'cmd':
                    keyWaited.cmd = true
                    break
                case 'alt':
                    keyWaited.alt = true
                    break
            }
        }
        keyWaited.specific = keyMap[keys[keys.length-1]]

        if (typeof (keyWaited.specific) == 'undefined')
            keyWaited.specific = keys[keys.length-1].toUpperCase().charCodeAt()

        $target.keydown(function (event) {
            keyPressed.shift = event.originalEvent.shiftKey
            keyPressed.ctrl = event.originalEvent.ctrlKey
            keyPressed.cmd = event.originalEvent.metaKey
            keyPressed.alt = event.originalEvent.altKey

            if (event.which == keyWaited.specific
                && keyPressed.shift == keyWaited.shift
                && keyPressed.ctrl == keyWaited.ctrl
                && keyPressed.cmd == keyWaited.cmd
                && keyPressed.alt == keyWaited.alt) {

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
    }

    HotKey.DEFAULTS = {
        hotkey: null,
        hotkeyMac: null,
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