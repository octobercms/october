/*
 * @deprecated, remove if year >= 2021.
 * Remove this Polyfill when Edge fixes this issue: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11509049/
 * and October CMS decides to drop IE11 Support.
 * Polyfill for KeyboardEvent.prototype.key Version V1.1.0
 * Release URL: https://github.com/cvan/keyboardevent-key-polyfill/releases
 * This will still enable KeyboardEvent.prototype.key in environments where it may not yet be available.
 *
 * WARNING: The Initialize has been placed at the bottom, to autoload the Polyfill in October CMS
 */
 (function() {

     var keyboardeventKeyPolyfill = {
         polyfill: polyfill,
         keys: {
             3: 'Cancel',
             6: 'Help',
             8: 'Backspace',
             9: 'Tab',
             12: 'Clear',
             13: 'Enter',
             16: 'Shift',
             17: 'Control',
             18: 'Alt',
             19: 'Pause',
             20: 'CapsLock',
             27: 'Escape',
             28: 'Convert',
             29: 'NonConvert',
             30: 'Accept',
             31: 'ModeChange',
             32: ' ',
             33: 'PageUp',
             34: 'PageDown',
             35: 'End',
             36: 'Home',
             37: 'ArrowLeft',
             38: 'ArrowUp',
             39: 'ArrowRight',
             40: 'ArrowDown',
             41: 'Select',
             42: 'Print',
             43: 'Execute',
             44: 'PrintScreen',
             45: 'Insert',
             46: 'Delete',
             48: ['0', ')'],
             49: ['1', '!'],
             50: ['2', '@'],
             51: ['3', '#'],
             52: ['4', '$'],
             53: ['5', '%'],
             54: ['6', '^'],
             55: ['7', '&'],
             56: ['8', '*'],
             57: ['9', '('],
             91: 'OS',
             93: 'ContextMenu',
             106: '*',
             107: '+',
             109: '-',
             110: '.',
             111: '/',
             144: 'NumLock',
             145: 'ScrollLock',
             181: 'VolumeMute',
             182: 'VolumeDown',
             183: 'VolumeUp',
             186: [';', ':'],
             187: ['=', '+'],
             188: [',', '<'],
             189: ['-', '_'],
             190: ['.', '>'],
             191: ['/', '?'],
             192: ['`', '~'],
             219: ['[', '{'],
             220: ['\\', '|'],
             221: [']', '}'],
             222: ["'", '"'],
             224: 'Meta',
             225: 'AltGraph',
             246: 'Attn',
             247: 'CrSel',
             248: 'ExSel',
             249: 'EraseEof',
             250: 'Play',
             251: 'ZoomOut'
         }
     };

     // Function keys (F1-24).
     var i;
     for (i = 1; i < 25; i++) {
         keyboardeventKeyPolyfill.keys[111 + i] = 'F' + i;
     }

     // Printable ASCII characters.
     var letter = '';
     for (i = 65; i < 91; i++) {
         letter = String.fromCharCode(i);
         keyboardeventKeyPolyfill.keys[i] = [letter.toLowerCase(), letter.toUpperCase()];
     }

     // Numbers on numeric keyboard.
     for (i = 96; i < 106; i++) {
         letter = String.fromCharCode(i - 48);
         keyboardeventKeyPolyfill.keys[i] = letter;
     }

     function polyfill() {
         var isEdgeOrIE = (navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./) || navigator.userAgent.indexOf("Edge/") > 0);
         if (!('KeyboardEvent' in window) ||
             ('key' in KeyboardEvent.prototype && !isEdgeOrIE)) {
             return false;
         }

         // Polyfill `key` on `KeyboardEvent`.
         var proto = {
             get: function(x) {
                 var key = keyboardeventKeyPolyfill.keys[this.which || this.keyCode];

                 if (Array.isArray(key)) {
                     key = key[+this.shiftKey];
                 }

                 return key;
             },
             enumerable: true,
             configurable: true
         };
         Object.defineProperty(KeyboardEvent.prototype, 'key', proto);
         return proto;
     }

     if (typeof define === 'function' && define.amd) {
         define('keyboardevent-key-polyfill', keyboardeventKeyPolyfill);
     } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
         module.exports = keyboardeventKeyPolyfill;
     } else if (window) {
         window.keyboardeventKeyPolyfill = keyboardeventKeyPolyfill;
     }

 })();

/* Initialize the polyfill
 * Load KeyboardEvent polyfill for old browsers
 */
 keyboardeventKeyPolyfill.polyfill();
