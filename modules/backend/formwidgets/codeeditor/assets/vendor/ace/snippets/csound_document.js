/*! Ace Editor v1.4.2 */
define("ace/snippets/csound_document",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# <CsoundSynthesizer>\n\
snippet synth\n\
	<CsoundSynthesizer>\n\
	<CsInstruments>\n\
	${1}\n\
	</CsInstruments>\n\
	<CsScore>\n\
	e\n\
	</CsScore>\n\
	</CsoundSynthesizer>\n\
";
exports.scope = "csound_document";

});                (function() {
                    window.require(["ace/snippets/csound_document"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            