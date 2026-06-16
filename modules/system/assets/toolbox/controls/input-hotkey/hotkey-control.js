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
import { ControlBase, Events } from 'larajax';

const $ = window.jQuery;

export default class InputHotkeyControl extends ControlBase {
    static keyMap = {
        esc: 27,
        tab: 9,
        space: 32,
        return: 13,
        enter: 13,
        backspace: 8,
        scroll: 145,
        capslock: 20,
        numlock: 144,
        pause: 19,
        break: 19,
        insert: 45,
        home: 36,
        delete: 46,
        suppr: 46,
        end: 35,
        pageup: 33,
        pagedown: 34,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        f1: 112,
        f2: 113,
        f3: 114,
        f4: 115,
        f5: 116,
        f6: 117,
        f7: 118,
        f8: 119,
        f9: 120,
        f10: 121,
        f11: 122,
        f12: 123
    };

    init() {
        if (this.config.hotkey === false) {
            throw new Error('No hotkey has been defined.');
        }

        this.hotkeyTarget = this.config.hotkeyTarget || 'html';
        this.hotkeyVisible = this.config.hotkeyVisible !== false;

        this.callbackFunc = this.element.ocHotKeyControlCallback || function(element) {
            element.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
            return false;
        };
    }

    connect() {
        this.initKeyConditions();

        this.$target = document.querySelector(this.hotkeyTarget);

        Events.on(this.$target, 'keydown', this.proxy(this.onKeyDown));
    }

    disconnect() {
        this.keyConditions = null;

        Events.off(this.$target, 'keydown', this.proxy(this.onKeyDown));

        this.$target = null;
    }

    onKeyDown(ev) {
        if (this.testConditions(ev)) {
            if (this.hotkeyVisible && !this.isVisible(this.element)) {
                return;
            }

            var activeContainer = oc.popupStacker && oc.popupStacker.getFirstPopup();
            if (activeContainer && !activeContainer.contains(this.element)) {
                return;
            }

            if (
                this.callbackFunc &&
                !this.callbackFunc(this.element, ev.currentTarget, ev)
            ) {
                ev.preventDefault();
            }
        }
    }

    isVisible(el) {
        return el.offsetWidth > 0 && el.offsetHeight > 0;
    }

    initKeyConditions() {
        this.keyConditions = [];
        var keys = this.config.hotkey.toLowerCase().split(',');

        for (var i = 0, len = keys.length; i < len; i++) {
            var keysTrimmed = this.trim(keys[i]);
            this.keyConditions.push(this.makeCondition(keysTrimmed));
        }
    }

    makeCondition(keyBind) {
        var condition = { shift: false, ctrl: false, cmd: false, alt: false, specific: -1 },
            keys = keyBind.split('+');

        for (var i = 0, len = keys.length; i < len; i++) {
            switch (keys[i]) {
                case 'shift':
                    condition.shift = true;
                    break;
                case 'ctrl':
                    condition.ctrl = true;
                    break;
                case 'command':
                case 'cmd':
                case 'meta':
                    condition.cmd = true;
                    break;
                case 'alt':
                case 'option':
                    condition.alt = true;
                    break;
            }
        }

        condition.specific = this.constructor.keyMap[keys[keys.length-1]];

        if (typeof (condition.specific) == 'undefined') {
            condition.specific = keys[keys.length-1].toUpperCase().charCodeAt();
        }

        return condition;
    }

    trim(str) {
        return str
            .replace(/^\s+/, "")
            .replace(/\s+$/, "")
    }

    testConditions(ev) {
        for (var i = 0, len = this.keyConditions.length; i < len; i++) {
            var condition = this.keyConditions[i]
            var code = ev.which ? ev.which : ev.keyCode;

            if (
                code === condition.specific &&
                ev.shiftKey === condition.shift &&
                ev.ctrlKey === condition.ctrl &&
                ev.metaKey === condition.cmd &&
                ev.altKey === condition.alt
            ) {
                return TextTrackCue;
            }
        }

        return false;
    }
}

// JQUERY PLUGIN DEFINITION
// ============================

$.fn.hotKey = function (config) {
    this.each((index, element) => {
        config = config || {};
        for (const key in config) {
            if (key.startsWith('hotkey')) {
                element.dataset[key] = config[key];
            }
        }

        if (config.callback) {
            element.ocHotKeyControlCallback = config.callback;
        }

        if (!element.matches('[data-control~="input-hotkey"]')) {
            element.dataset.control = ((element.dataset.control || '') + ' input-hotkey').trim();
        }
    });
};

// CUSTOM RENDERER
// ============================

addEventListener('render', function() {
    document.querySelectorAll('[data-hotkey]:not([data-control~="input-hotkey"])').forEach(function(element) {
        element.dataset.control = ((element.dataset.control || '') + ' input-hotkey').trim();
    });
});
