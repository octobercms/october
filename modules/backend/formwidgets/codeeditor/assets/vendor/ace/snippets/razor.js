/*! Ace Editor v1.4.2 */
define("ace/snippets/razor",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "snippet if\n\
(${1} == ${2}) {\n\
	${3}\n\
}";
exports.scope = "razor";

});                (function() {
                    window.require(["ace/snippets/razor"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            