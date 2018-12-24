/*! Ace Editor v1.4.2 */
define("ace/snippets/snippets",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# snippets for making snippets :)\n\
snippet snip\n\
	snippet ${1:trigger}\n\
		${2}\n\
snippet msnip\n\
	snippet ${1:trigger} ${2:description}\n\
		${3}\n\
snippet v\n\
	{VISUAL}\n\
";
exports.scope = "snippets";

});                (function() {
                    window.require(["ace/snippets/snippets"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            