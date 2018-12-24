/*! Ace Editor v1.4.2 */
define("ace/snippets/makefile",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "snippet ifeq\n\
	ifeq (${1:cond0},${2:cond1})\n\
		${3:code}\n\
	endif\n\
";
exports.scope = "makefile";

});                (function() {
                    window.require(["ace/snippets/makefile"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            