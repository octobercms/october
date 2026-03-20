
class KeyCondition {
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

    constructor(hotkeyStr) {
        this.shift = false;
        this.ctrl = false;
        this.cmd = false;
        this.alt = false;
        this.specific = -1;

        this.parseHotkeyStr(hotkeyStr);
    }

    parseHotkeyStr(hotkeyStr) {
        const keys = hotkeyStr.trim().split('+');

        keys.forEach((key) => {
            switch (key.trim()) {
                case 'shift':
                    this.shift = true;
                    break;
                case 'ctrl':
                    this.ctrl = true;
                    break;
                case 'command':
                case 'cmd':
                case 'meta':
                    this.cmd = true;
                    break;
                case 'alt':
                case 'option':
                    this.alt = true;
                    break;
            }
        });

        this.specific = KeyCondition.keyMap[keys[keys.length - 1]];
        if (this.specific === undefined) {
            this.specific = keys[keys.length - 1].toUpperCase().charCodeAt();
        }
    }

    match(ev) {
        var code = ev.which ? ev.which : ev.keyCode;

        return (
            code === this.specific &&
            ev.shiftKey === this.shift &&
            ev.ctrlKey === this.ctrl &&
            ev.metaKey === this.cmd &&
            ev.altKey === this.alt
        );
    }
}

class ListenerRegistry {
    constructor() {
        this.listeners = new Map();
        document.addEventListener('keydown', (ev) => this.onKeyDown(ev));
        document.addEventListener('page:before-render', (ev) => this.listeners.clear());
    }

    makeConditions(hotkeyStr) {
        const conditions = [];

        hotkeyStr.split(',').forEach((keyBinding) => {
            conditions.push(new KeyCondition(keyBinding));
        });

        return conditions;
    }

    addListener(listener, hotkeyStr) {
        this.listeners.set(listener, this.makeConditions(hotkeyStr));
    }

    removeListener(listener) {
        this.listeners.delete(listener);
    }

    onKeyDown(ev) {
        this.listeners.forEach((conditions, listener) => {
            if (conditions.some((condition) => condition.match(ev))) {
                listener(ev);
            }
        });
    }
}

const registry = new ListenerRegistry();

// Vue 3 directive - registered globally for all app instances
const ocHotkeyDirective = {
    beforeMount: function(el, binding) {
        if (!binding.arg) {
            return;
        }

        registry.addListener(binding.value, binding.arg);
    },

    unmounted: function(el, binding) {
        if (!binding.arg) {
            return;
        }

        registry.removeListener(binding.value);
    }
};

// Register directive globally
if (!window.oc) window.oc = {};
if (!window.oc.vueDirectives) window.oc.vueDirectives = {};
window.oc.vueDirectives['oc-hotkey'] = ocHotkeyDirective;

export const vueHotkeyMixin = {
    data: function() {
        return {
            componentHotkeys: {}
        };
    },

    created: function() {
        Object.keys(this.componentHotkeys).forEach((hotkey) => {
            registry.addListener(this.componentHotkeys[hotkey], hotkey);
        });
    },

    beforeUnmount: function() {
        Object.keys(this.componentHotkeys).forEach((hotkey) => {
            registry.removeListener(this.componentHotkeys[hotkey]);
        });
    }
};

// Also expose on window for legacy access
if (window.oc === undefined) {
    window.oc = {}
}
window.oc.vueHotkeyMixin = vueHotkeyMixin;
