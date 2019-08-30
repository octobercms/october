!function(e){var val=e(); if("object"==typeof exports&&"undefined"!=typeof module)module.exports=val;if("function"==typeof define&&define.amd)define("emmet",[],val);{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.emmet=val}}(function(){var define,module,exports;return (function outer (modules, cache, entry) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof require == "function" && require;

    function newRequire(name, jumped){
        if(!cache[name]) {
            if(!modules[name]) {
                // if we cannot find the the module within our internal map or
                // cache jump to the current global require ie. the last bundle
                // that was added to the page.
                var currentRequire = typeof require == "function" && require;
                if (!jumped && currentRequire) return currentRequire(name, true);

                // If there are other bundles on this page the require from the
                // previous one is saved to 'previousRequire'. Repeat this as
                // many times as there are bundles until the module is found or
                // we exhaust the require chain.
                if (previousRequire) return previousRequire(name, true);
                var err = new Error('Cannot find module \'' + name + '\'');
                err.code = 'MODULE_NOT_FOUND';
                throw err;
            }
            var m = cache[name] = {exports:{}};
            modules[name][0].call(m.exports, function(x){
                var id = modules[name][1][x];
                return newRequire(id ? id : x);
            },m,m.exports,outer,modules,cache,entry);
        }
        return cache[name].exports;
    }
    for(var i=0;i<entry.length;i++) newRequire(entry[i]);

    // Override the current require with this new one
    return newRequire;
})
({"./bundles/snippets.js":[function(require,module,exports){
/**
 * Bundler, used in builder script to statically
 * include snippets.json into bundle
 */
var res = require('../lib/assets/resources');
var snippets = require('../lib/snippets.json');
res.setVocabulary(snippets, 'system');

},{"../lib/assets/resources":"assets\\resources.js","../lib/snippets.json":"snippets.json"}],"./lib/emmet.js":[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var global = typeof self != 'undefined' ? self : this;

	var utils = require('./utils/common');
	var actions = require('./action/main');
	var parser = require('./parser/abbreviation');
	var file = require('./plugin/file');

	var preferences = require('./assets/preferences');
	var resources = require('./assets/resources');
	var profile = require('./assets/profile');
	var ciu = require('./assets/caniuse');
	var logger = require('./assets/logger');

	var sliceFn = Array.prototype.slice;

	/**
	 * Returns file name part from path
	 * @param {String} path Path to file
	 * @return {String}
	 */
	function getFileName(path) {
		var re = /([\w\.\-]+)$/i;
		var m = re.exec(path);
		return m ? m[1] : '';
	}

	/**
	 * Normalizes profile definition: converts some
	 * properties to valid data types
	 * @param {Object} profile
	 * @return {Object}
	 */
	function normalizeProfile(profile) {
		if (typeof profile === 'object') {
			if ('indent' in profile) {
				profile.indent = !!profile.indent;
			}

			if ('self_closing_tag' in profile) {
				if (typeof profile.self_closing_tag === 'number') {
					profile.self_closing_tag = !!profile.self_closing_tag;
				}
			}
		}

		return profile;
	}

	return {
		/**
		 * The essential function that expands Emmet abbreviation
		 * @param {String} abbr Abbreviation to parse
		 * @param {String} syntax Abbreviation's context syntax
		 * @param {String} profile Output profile (or its name)
		 * @param {Object} contextNode Contextual node where abbreviation is
		 * written
		 * @return {String}
		 */
		expandAbbreviation: function(abbr, syntax, profile, contextNode) {
			return parser.expand(abbr, {
				syntax: syntax,
				profile: profile,
				contextNode: contextNode
			});
		},

		/**
		 * Runs given action
		 * @param  {String} name Action name
		 * @param  {IEmmetEditor} editor Editor instance
		 * @return {Boolean} Returns true if action was performed successfully
		 */
		run: function(name) {
			return actions.run.apply(actions, sliceFn.call(arguments, 0));
		},

		/**
		 * Loads Emmet extensions. Extensions are simple .js files that
		 * uses Emmet modules and resources to create new actions, modify
		 * existing ones etc.
		 * @param {Array} fileList List of absolute paths to files in extensions
		 * folder. Back-end app should not filter this list (e.g. by extension)
		 * but return it "as-is" so bootstrap can decide how to load contents
		 * of each file.
		 * This method requires a <code>file</code> module of <code>IEmmetFile</code>
		 * interface to be implemented.
		 * @memberOf bootstrap
		 */
		loadExtensions: function(fileList) {
			var payload = {};
			var userSnippets = null;
			var that = this;

			// make sure file list contians only valid extension files
			fileList = fileList.filter(function(f) {
				var ext = file.getExt(f);
				return ext === 'json' || ext === 'js';
			});

			var reader = (file.readText || file.read).bind(file);
			var next = function() {
				if (fileList.length) {
					var f = fileList.shift();
					reader(f, function(err, content) {
						if (err) {
							logger.log('Unable to read "' + f + '" file: '+ err);
							return next();
						}

						switch (file.getExt(f)) {
							case 'js':
								try {
									eval(content);
								} catch (e) {
									logger.log('Unable to eval "' + f + '" file: '+ e);
								}
								break;
							case 'json':
								var fileName = getFileName(f).toLowerCase().replace(/\.json$/, '');
								content = utils.parseJSON(content);
								if (/^snippets/.test(fileName)) {
									if (fileName === 'snippets') {
										// data in snippets.json is more important to user
										userSnippets = content;
									} else {
										payload.snippets = utils.deepMerge(payload.snippets || {}, content);
									}
								} else {
									payload[fileName] = content;
								}

								break;
						}

						next();
					});
				} else {
					// complete
					if (userSnippets) {
						payload.snippets = utils.deepMerge(payload.snippets || {}, userSnippets);
					}

					that.loadUserData(payload);
				}
			};

			next();
		},

		/**
		 * Loads preferences from JSON object (or string representation of JSON)
		 * @param {Object} data
		 * @returns
		 */
		loadPreferences: function(data) {
			preferences.load(utils.parseJSON(data));
		},

		/**
		 * Loads user snippets and abbreviations. It doesn’t replace current
		 * user resource vocabulary but merges it with passed one. If you need
		 * to <i>replaces</i> user snippets you should call
		 * <code>resetSnippets()</code> method first
		 */
		loadSnippets: function(data) {
			data = utils.parseJSON(data);

			var userData = resources.getVocabulary('user') || {};
			resources.setVocabulary(utils.deepMerge(userData, data), 'user');
		},

		/**
		 * Helper function that loads default snippets, defined in project’s
		 * <i>snippets.json</i>
		 * @param {Object} data
		 */
		loadSystemSnippets: function(data) {
			resources.setVocabulary(utils.parseJSON(data), 'system');
		},

		/**
		 * Helper function that loads Can I Use database
		 * @param {Object} data
		 */
		loadCIU: function(data) {
			ciu.load(utils.parseJSON(data));
		},

		/**
		 * Removes all user-defined snippets
		 */
		resetSnippets: function() {
			resources.setVocabulary({}, 'user');
		},

		/**
		 * Helper function that loads all user data (snippets and preferences)
		 * defined as a single JSON object. This is useful for loading data
		 * stored in a common storage, for example <code>NSUserDefaults</code>
		 * @param {Object} data
		 */
		loadUserData: function(data) {
			data = utils.parseJSON(data);
			if (data.snippets) {
				this.loadSnippets(data.snippets);
			}

			if (data.preferences) {
				this.loadPreferences(data.preferences);
			}

			if (data.profiles) {
				this.loadProfiles(data.profiles);
			}

			if (data.caniuse) {
				this.loadCIU(data.caniuse);
			}

			var profiles = data.syntaxProfiles || data.syntaxprofiles;
			if (profiles) {
				this.loadSyntaxProfiles(profiles);
			}
		},

		/**
		 * Resets all user-defined data: preferences, snippets etc.
		 * @returns
		 */
		resetUserData: function() {
			this.resetSnippets();
			preferences.reset();
			profile.reset();
		},

		/**
		 * Load syntax-specific output profiles. These are essentially
		 * an extension to syntax snippets
		 * @param {Object} profiles Dictionary of profiles
		 */
		loadSyntaxProfiles: function(profiles) {
			profiles = utils.parseJSON(profiles);
			var snippets = {};
			Object.keys(profiles).forEach(function(syntax) {
				var options = profiles[syntax];
				if (!(syntax in snippets)) {
					snippets[syntax] = {};
				}
				snippets[syntax].profile = normalizeProfile(options);
			});

			this.loadSnippets(snippets);
		},

		/**
		 * Load named profiles
		 * @param {Object} profiles
		 */
		loadProfiles: function(profiles) {
			profiles = utils.parseJSON(profiles);
			Object.keys(profiles).forEach(function(name) {
				profile.create(name, normalizeProfile(profiles[name]));
			});
		},

		// expose some useful data for plugin authors
		actions: actions,
		parser: parser,
		file: file,
		preferences: preferences,
		resources: resources,
		profile: profile,
		tabStops: require('./assets/tabStops'),
		htmlMatcher: require('./assets/htmlMatcher'),
		utils: {
			common: utils,
			action: require('./utils/action'),
			editor: require('./utils/editor')
		}
	};
});

},{"./action/main":"action\\main.js","./assets/caniuse":"assets\\caniuse.js","./assets/htmlMatcher":"assets\\htmlMatcher.js","./assets/logger":"assets\\logger.js","./assets/preferences":"assets\\preferences.js","./assets/profile":"assets\\profile.js","./assets/resources":"assets\\resources.js","./assets/tabStops":"assets\\tabStops.js","./parser/abbreviation":"parser\\abbreviation.js","./plugin/file":"plugin\\file.js","./utils/action":"utils\\action.js","./utils/common":"utils\\common.js","./utils/editor":"utils\\editor.js"}],"action\\balance.js":[function(require,module,exports){
/**
 * HTML pair matching (balancing) actions
 * @constructor
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var htmlMatcher = require('../assets/htmlMatcher');
	var utils = require('../utils/common');
	var editorUtils = require('../utils/editor');
	var actionUtils = require('../utils/action');
	var range = require('../assets/range');
	var cssEditTree = require('../editTree/css');
	var cssSections = require('../utils/cssSections');
	var lastMatch = null;

	function last(arr) {
		return arr[arr.length - 1];
	}

	function balanceHTML(editor, direction) {
		var info = editorUtils.outputInfo(editor);
		var content = info.content;
		var sel = range(editor.getSelectionRange());
		
		// validate previous match
		if (lastMatch && !lastMatch.range.equal(sel)) {
			lastMatch = null;
		}
		
		if (lastMatch && sel.length()) {
			if (direction == 'in') {
				// user has previously selected tag and wants to move inward
				if (lastMatch.type == 'tag' && !lastMatch.close) {
					// unary tag was selected, can't move inward
					return false;
				} else {
					if (lastMatch.range.equal(lastMatch.outerRange)) {
						lastMatch.range = lastMatch.innerRange;
					} else {
						var narrowed = utils.narrowToNonSpace(content, lastMatch.innerRange);
						lastMatch = htmlMatcher.find(content, narrowed.start + 1);
						if (lastMatch && lastMatch.range.equal(sel) && lastMatch.outerRange.equal(sel)) {
							lastMatch.range = lastMatch.innerRange;
						}
					}
				}
			} else {
				if (
					!lastMatch.innerRange.equal(lastMatch.outerRange) 
					&& lastMatch.range.equal(lastMatch.innerRange) 
					&& sel.equal(lastMatch.range)) {
					lastMatch.range = lastMatch.outerRange;
				} else {
					lastMatch = htmlMatcher.find(content, sel.start);
					if (lastMatch && lastMatch.range.equal(sel) && lastMatch.innerRange.equal(sel)) {
						lastMatch.range = lastMatch.outerRange;
					}
				}
			}
		} else {
			lastMatch = htmlMatcher.find(content, sel.start);
		}

		if (lastMatch) {
			if (lastMatch.innerRange.equal(sel)) {
				lastMatch.range = lastMatch.outerRange;
			}

			if (!lastMatch.range.equal(sel)) {
				editor.createSelection(lastMatch.range.start, lastMatch.range.end);
				return true;
			}
		}
		
		lastMatch = null;
		return false;
	}

	function rangesForCSSRule(rule, pos) {
		// find all possible ranges
		var ranges = [rule.range(true)];

		// braces content
		ranges.push(rule.valueRange(true));

		// find nested sections
		var nestedSections = cssSections.nestedSectionsInRule(rule);

		// real content, e.g. from first property name to
		// last property value
		var items = rule.list();
		if (items.length || nestedSections.length) {
			var start = Number.POSITIVE_INFINITY, end = -1;
			if (items.length) {
				start = items[0].namePosition(true);
				end = last(items).range(true).end;
			}

			if (nestedSections.length) {
				if (nestedSections[0].start < start) {
					start = nestedSections[0].start;
				}

				if (last(nestedSections).end > end) {
					end = last(nestedSections).end;
				}
			}

			ranges.push(range.create2(start, end));
		}

		ranges = ranges.concat(nestedSections);

		var prop = cssEditTree.propertyFromPosition(rule, pos) || items[0];
		if (prop) {
			ranges.push(prop.range(true));
			var valueRange = prop.valueRange(true);
			if (!prop.end()) {
				valueRange._unterminated = true;
			}
			ranges.push(valueRange);
		}

		return ranges;
	}

	/**
	 * Returns all possible selection ranges for given caret position
	 * @param  {String} content CSS content
	 * @param  {Number} pos     Caret position(where to start searching)
	 * @return {Array}
	 */
	function getCSSRanges(content, pos) {
		var rule;
		if (typeof content === 'string') {
			var ruleRange = cssSections.matchEnclosingRule(content, pos);
			if (ruleRange) {
				rule = cssEditTree.parse(ruleRange.substring(content), {
					offset: ruleRange.start
				});
			}
		} else {
			// passed parsed CSS rule
			rule = content;
		}

		if (!rule) {
			return null;
		}

		// find all possible ranges
		var ranges = rangesForCSSRule(rule, pos);

		// remove empty ranges
		ranges = ranges.filter(function(item) {
			return !!item.length;
		});

		return utils.unique(ranges, function(item) {
			return item.valueOf();
		});
	}

	function balanceCSS(editor, direction) {
		var info = editorUtils.outputInfo(editor);
		var content = info.content;
		var sel = range(editor.getSelectionRange());

		var ranges = getCSSRanges(info.content, sel.start);
		if (!ranges && sel.length()) {
			// possible reason: user has already selected
			// CSS rule from last match
			try {
				var rule = cssEditTree.parse(sel.substring(info.content), {
					offset: sel.start
				});
				ranges = getCSSRanges(rule, sel.start);
			} catch(e) {}
		}

		if (!ranges) {
			return false;
		}

		ranges = range.sort(ranges, true);

		// edge case: find match that equals current selection,
		// in case if user moves inward after selecting full CSS rule
		var bestMatch = utils.find(ranges, function(r) {
			return r.equal(sel);
		});

		if (!bestMatch) {
			bestMatch = utils.find(ranges, function(r) {
				// Check for edge case: caret right after CSS value
				// but it doesn‘t contains terminating semicolon.
				// In this case we have to check full value range
				return r._unterminated ? r.include(sel.start) : r.inside(sel.start);
			});
		}

		if (!bestMatch) {
			return false;
		}

		// if best match equals to current selection, move index
		// one position up or down, depending on direction
		var bestMatchIx = ranges.indexOf(bestMatch);
		if (bestMatch.equal(sel)) {
			bestMatchIx += direction == 'out' ? 1 : -1;
		}

		if (bestMatchIx < 0 || bestMatchIx >= ranges.length) {
			if (bestMatchIx >= ranges.length && direction == 'out') {
				pos = bestMatch.start - 1;

				var outerRanges = getCSSRanges(content, pos);
				if (outerRanges) {
					bestMatch = last(outerRanges.filter(function(r) {
						return r.inside(pos);
					}));
				}
			} else if (bestMatchIx < 0 && direction == 'in') {
				bestMatch = null;
			} else {
				bestMatch = null;
			}
		} else {
			bestMatch = ranges[bestMatchIx];	
		}

		if (bestMatch) {
			editor.createSelection(bestMatch.start, bestMatch.end);
			return true;
		}
		
		return false;
	}
	
	return {
		/**
		 * Find and select HTML tag pair
		 * @param {IEmmetEditor} editor Editor instance
		 * @param {String} direction Direction of pair matching: 'in' or 'out'. 
		 * Default is 'out'
		 */
		balance: function(editor, direction) {
			direction = String((direction || 'out').toLowerCase());
			var info = editorUtils.outputInfo(editor);
			if (actionUtils.isSupportedCSS(info.syntax)) {
				return balanceCSS(editor, direction);
			}
			
			return balanceHTML(editor, direction);
		},

		balanceInwardAction: function(editor) {
			return this.balance(editor, 'in');
		},

		balanceOutwardAction: function(editor) {
			return this.balance(editor, 'out');	
		},

		/**
		 * Moves caret to matching opening or closing tag
		 * @param {IEmmetEditor} editor
		 */
		goToMatchingPairAction: function(editor) {
			var content = String(editor.getContent());
			var caretPos = editor.getCaretPos();
			
			if (content.charAt(caretPos) == '<') 
				// looks like caret is outside of tag pair  
				caretPos++;
				
			var tag = htmlMatcher.tag(content, caretPos);
			if (tag && tag.close) { // exclude unary tags
				if (tag.open.range.inside(caretPos)) {
					editor.setCaretPos(tag.close.range.start);
				} else {
					editor.setCaretPos(tag.open.range.start);
				}
				
				return true;
			}
			
			return false;
		}
	};
});
},{"../assets/htmlMatcher":"assets\\htmlMatcher.js","../assets/range":"assets\\range.js","../editTree/css":"editTree\\css.js","../utils/action":"utils\\action.js","../utils/common":"utils\\common.js","../utils/cssSections":"utils\\cssSections.js","../utils/editor":"utils\\editor.js"}],"action\\base64.js":[function(require,module,exports){
/**
 * Encodes/decodes image under cursor to/from base64
 * @param {IEmmetEditor} editor
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var file = require('../plugin/file');
	var base64 = require('../utils/base64');
	var actionUtils = require('../utils/action');
	var editorUtils = require('../utils/editor');

	/**
	 * Test if <code>text</code> starts with <code>token</code> at <code>pos</code>
	 * position. If <code>pos</code> is omitted, search from beginning of text 
	 * @param {String} token Token to test
	 * @param {String} text Where to search
	 * @param {Number} pos Position where to start search
	 * @return {Boolean}
	 * @since 0.65
	 */
	function startsWith(token, text, pos) {
		pos = pos || 0;
		return text.charAt(pos) == token.charAt(0) && text.substr(pos, token.length) == token;
	}

	/**
	 * Encodes image to base64
	 * 
	 * @param {IEmmetEditor} editor
	 * @param {String} imgPath Path to image
	 * @param {Number} pos Caret position where image is located in the editor
	 * @return {Boolean}
	 */
	function encodeToBase64(editor, imgPath, pos) {
		var editorFile = editor.getFilePath();
		var defaultMimeType = 'application/octet-stream';

		if (editorFile === null) {
			throw "You should save your file before using this action";
		}

		// locate real image path
		file.locateFile(editorFile, imgPath, function(realImgPath) {
			if (realImgPath === null) {
				throw "Can't find " + imgPath + ' file';
			}

			file.read(realImgPath, function(err, content) {
				if (err) {
					throw 'Unable to read ' + realImgPath + ': ' + err;
				}

				var b64 = base64.encode(String(content));
				if (!b64) {
					throw "Can't encode file content to base64";
				}

				b64 = 'data:' + (actionUtils.mimeTypes[String(file.getExt(realImgPath))] || defaultMimeType) +
					';base64,' + b64;

				editor.replaceContent('$0' + b64, pos, pos + imgPath.length);
			});
		});

		return true;
	}

	/**
	 * Decodes base64 string back to file.
	 * @param {IEmmetEditor} editor
	 * @param {String} filePath to new image
	 * @param {String} data Base64-encoded file content
	 * @param {Number} pos Caret position where image is located in the editor
	 */
	function decodeFromBase64(editor, filePath, data, pos) {
		// ask user to enter path to file
		filePath = filePath || String(editor.prompt('Enter path to file (absolute or relative)'));
		if (!filePath) {
			return false;
		}

		var editorFile = editor.getFilePath();
		file.createPath(editorFile, filePath, function(err, absPath) {
			if (err || !absPath) {
				throw "Can't save file";
			}

			var content = data.replace(/^data\:.+?;.+?,/, '');
			file.save(absPath, base64.decode(content), function(err) {
				if (err) {
					throw 'Unable to save ' + absPath + ': ' + err;
				}

				editor.replaceContent('$0' + filePath, pos, pos + data.length);
			});
		});

		return true;
	}

	return {
		/**
		 * Action to encode or decode file to data:url
		 * @param  {IEmmetEditor} editor  Editor instance
		 * @param  {String} syntax  Current document syntax
		 * @param  {String} profile Output profile name
		 * @return {Boolean}
		 */
		encodeDecodeDataUrlAction: function(editor, filepath) {
			var data = String(editor.getSelection());
			var caretPos = editor.getCaretPos();
			var info = editorUtils.outputInfo(editor);

			if (!data) {
				// no selection, try to find image bounds from current caret position
				var text = info.content, m;
				while (caretPos-- >= 0) {
					if (startsWith('src=', text, caretPos)) { // found <img src="">
						if ((m = text.substr(caretPos).match(/^(src=(["'])?)([^'"<>\s]+)\1?/))) {
							data = m[3];
							caretPos += m[1].length;
						}
						break;
					} else if (startsWith('url(', text, caretPos)) { // found CSS url() pattern
						if ((m = text.substr(caretPos).match(/^(url\((['"])?)([^'"\)\s]+)\1?/))) {
							data = m[3];
							caretPos += m[1].length;
						}
						break;
					}
				}
			}

			if (data) {
				if (startsWith('data:', data)) {
					return decodeFromBase64(editor, filepath, data, caretPos);
				} else {
					return encodeToBase64(editor, data, caretPos);
				}
			}

			return false;
		}
	};
});

},{"../plugin/file":"plugin\\file.js","../utils/action":"utils\\action.js","../utils/base64":"utils\\base64.js","../utils/editor":"utils\\editor.js"}],"action\\editPoints.js":[function(require,module,exports){
/**
 * Move between next/prev edit points. 'Edit points' are places between tags 
 * and quotes of empty attributes in html
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	/**
	 * Search for new caret insertion point
	 * @param {IEmmetEditor} editor Editor instance
	 * @param {Number} inc Search increment: -1 — search left, 1 — search right
	 * @param {Number} offset Initial offset relative to current caret position
	 * @return {Number} Returns -1 if insertion point wasn't found
	 */
	function findNewEditPoint(editor, inc, offset) {
		inc = inc || 1;
		offset = offset || 0;
		
		var curPoint = editor.getCaretPos() + offset;
		var content = String(editor.getContent());
		var maxLen = content.length;
		var nextPoint = -1;
		var reEmptyLine = /^\s+$/;
		
		function getLine(ix) {
			var start = ix;
			while (start >= 0) {
				var c = content.charAt(start);
				if (c == '\n' || c == '\r')
					break;
				start--;
			}
			
			return content.substring(start, ix);
		}
			
		while (curPoint <= maxLen && curPoint >= 0) {
			curPoint += inc;
			var curChar = content.charAt(curPoint);
			var nextChar = content.charAt(curPoint + 1);
			var prevChar = content.charAt(curPoint - 1);
				
			switch (curChar) {
				case '"':
				case '\'':
					if (nextChar == curChar && prevChar == '=') {
						// empty attribute
						nextPoint = curPoint + 1;
					}
					break;
				case '>':
					if (nextChar == '<') {
						// between tags
						nextPoint = curPoint + 1;
					}
					break;
				case '\n':
				case '\r':
					// empty line
					if (reEmptyLine.test(getLine(curPoint - 1))) {
						nextPoint = curPoint;
					}
					break;
			}
			
			if (nextPoint != -1)
				break;
		}
		
		return nextPoint;
	}
	
	return {
		/**
		 * Move to previous edit point
		 * @param  {IEmmetEditor} editor  Editor instance
		 * @param  {String} syntax  Current document syntax
		 * @param  {String} profile Output profile name
		 * @return {Boolean}
		 */
		previousEditPointAction: function(editor, syntax, profile) {
			var curPos = editor.getCaretPos();
			var newPoint = findNewEditPoint(editor, -1);
				
			if (newPoint == curPos)
				// we're still in the same point, try searching from the other place
				newPoint = findNewEditPoint(editor, -1, -2);
			
			if (newPoint != -1) {
				editor.setCaretPos(newPoint);
				return true;
			}
			
			return false;
		},

		/**
		 * Move to next edit point
		 * @param  {IEmmetEditor} editor  Editor instance
		 * @param  {String} syntax  Current document syntax
		 * @param  {String} profile Output profile name
		 * @return {Boolean}
		 */
		nextEditPointAction: function(editor, syntax, profile) {
			var newPoint = findNewEditPoint(editor, 1);
			if (newPoint != -1) {
				editor.setCaretPos(newPoint);
				return true;
			}
			
			return false;
		}
	};
});
},{}],"action\\evaluateMath.js":[function(require,module,exports){
/**
 * Evaluates simple math expression under caret
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var actionUtils = require('../utils/action');
	var utils = require('../utils/common');
	var math = require('../utils/math');
	var range = require('../assets/range');

	return {
		/**
		 * Evaluates math expression under the caret
		 * @param  {IEmmetEditor} editor
		 * @return {Boolean}
		 */
		evaluateMathAction: function(editor) {
			var content = editor.getContent();
			var chars = '.+-*/\\';
			
			/** @type Range */
			var sel = range(editor.getSelectionRange());
			if (!sel.length()) {
				sel = actionUtils.findExpressionBounds(editor, function(ch) {
					return utils.isNumeric(ch) || chars.indexOf(ch) != -1;
				});
			}
			
			if (sel && sel.length()) {
				var expr = sel.substring(content);
				
				// replace integral division: 11\2 => Math.round(11/2) 
				expr = expr.replace(/([\d\.\-]+)\\([\d\.\-]+)/g, 'round($1/$2)');
				
				try {
					var result = utils.prettifyNumber(math.evaluate(expr));
					editor.replaceContent(result, sel.start, sel.end);
					editor.setCaretPos(sel.start + result.length);
					return true;
				} catch (e) {}
			}
			
			return false;
		}
	};
});

},{"../assets/range":"assets\\range.js","../utils/action":"utils\\action.js","../utils/common":"utils\\common.js","../utils/math":"utils\\math.js"}],"action\\expandAbbreviation.js":[function(require,module,exports){
/**
 * 'Expand abbreviation' editor action: extracts abbreviation from current caret 
 * position and replaces it with formatted output. 
 * <br><br>
 * This behavior can be overridden with custom handlers which can perform 
 * different actions when 'Expand Abbreviation' action is called.
 * For example, a CSS gradient handler that produces vendor-prefixed gradient
 * definitions registers its own expand abbreviation handler.  
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var handlerList = require('../assets/handlerList');
	var range = require('../assets/range');
	var prefs = require('../assets/preferences');
	var utils = require('../utils/common');
	var editorUtils = require('../utils/editor');
	var actionUtils = require('../utils/action');
	var cssGradient = require('../resolver/cssGradient');
	var parser = require('../parser/abbreviation');

	/**
	 * Search for abbreviation in editor from current caret position
	 * @param {IEmmetEditor} editor Editor instance
	 * @return {String}
	 */
	function findAbbreviation(editor) {
		var r = range(editor.getSelectionRange());
		var content = String(editor.getContent());
		if (r.length()) {
			// abbreviation is selected by user
			return r.substring(content);
		}
		
		// search for new abbreviation from current caret position
		var curLine = editor.getCurrentLineRange();
		return actionUtils.extractAbbreviation(content.substring(curLine.start, r.start));
	}

	/**
	 * @type HandlerList List of registered handlers
	 */
	var handlers = handlerList.create();

	// XXX setup default expand handlers
	
	/**
	 * Extracts abbreviation from current caret 
	 * position and replaces it with formatted output 
	 * @param {IEmmetEditor} editor Editor instance
	 * @param {String} syntax Syntax type (html, css, etc.)
	 * @param {String} profile Output profile name (html, xml, xhtml)
	 * @return {Boolean} Returns <code>true</code> if abbreviation was expanded 
	 * successfully
	 */
	handlers.add(function(editor, syntax, profile) {
		var caretPos = editor.getSelectionRange().end;
		var abbr = findAbbreviation(editor);
			
		if (abbr) {
			var content = parser.expand(abbr, {
				syntax: syntax, 
				profile: profile, 
				contextNode: actionUtils.captureContext(editor)
			});

			if (content) {
				var replaceFrom = caretPos - abbr.length;
				var replaceTo = caretPos;

				// a special case for CSS: if editor already contains
				// semicolon right after current caret position — replace it too
				var cssSyntaxes = prefs.getArray('css.syntaxes');
				if (cssSyntaxes && ~cssSyntaxes.indexOf(syntax)) {
					var curContent = editor.getContent();
					if (curContent.charAt(caretPos) == ';' && content.charAt(content.length - 1) == ';') {
						replaceTo++;
					}
				}

				editor.replaceContent(content, replaceFrom, replaceTo);
				return true;
			}
		}
		
		return false;
	}, {order: -1});
	handlers.add(cssGradient.expandAbbreviationHandler.bind(cssGradient));
		
	return {
		/**
		 * The actual “Expand Abbreviation“ action routine
		 * @param  {IEmmetEditor} editor  Editor instance
		 * @param  {String} syntax  Current document syntax
		 * @param  {String} profile Output profile name
		 * @return {Boolean}
		 */
		expandAbbreviationAction: function(editor, syntax, profile) {
			var args = utils.toArray(arguments);
			
			// normalize incoming arguments
			var info = editorUtils.outputInfo(editor, syntax, profile);
			args[1] = info.syntax;
			args[2] = info.profile;
			
			return handlers.exec(false, args);
		},

		/**
		 * A special case of “Expand Abbreviation“ action, invoked by Tab key.
		 * In this case if abbreviation wasn’t expanded successfully or there’s a selecetion, 
		 * the current line/selection will be indented. 
		 * @param  {IEmmetEditor} editor  Editor instance
		 * @param  {String} syntax  Current document syntax
		 * @param  {String} profile Output profile name
		 * @return {Boolean}
		 */
		expandAbbreviationWithTabAction: function(editor, syntax, profile) {
			var sel = editor.getSelection();
			var indent = '\t';

			// if something is selected in editor,
			// we should indent the selected content
			if (sel) {
				var selRange = range(editor.getSelectionRange());
				var content = utils.padString(sel, indent);
				
				editor.replaceContent(indent + '${0}', editor.getCaretPos());
				var replaceRange = range(editor.getCaretPos(), selRange.length());
				editor.replaceContent(content, replaceRange.start, replaceRange.end, true);
				editor.createSelection(replaceRange.start, replaceRange.start + content.length);
				return true;
			}
	
			// nothing selected, try to expand
			if (!this.expandAbbreviationAction(editor, syntax, profile)) {
				editor.replaceContent(indent, editor.getCaretPos());
			}
			
			return true;
		},

		
		_defaultHandler: function(editor, syntax, profile) {
			var caretPos = editor.getSelectionRange().end;
			var abbr = this.findAbbreviation(editor);
				
			if (abbr) {
				var ctx = actionUtils.captureContext(editor);
				var content = parser.expand(abbr, syntax, profile, ctx);
				if (content) {
					editor.replaceContent(content, caretPos - abbr.length, caretPos);
					return true;
				}
			}
			
			return false;
		},

		/**
		 * Adds custom expand abbreviation handler. The passed function should 
		 * return <code>true</code> if it was performed successfully, 
		 * <code>false</code> otherwise.
		 * 
		 * Added handlers will be called when 'Expand Abbreviation' is called
		 * in order they were added
		 * @memberOf expandAbbreviation
		 * @param {Function} fn
		 * @param {Object} options
		 */
		addHandler: function(fn, options) {
			handlers.add(fn, options);
		},
		
		/**
		 * Removes registered handler
		 * @returns
		 */
		removeHandler: function(fn) {
			handlers.remove(fn);
		},
		
		findAbbreviation: findAbbreviation
	};
});
},{"../assets/handlerList":"assets\\handlerList.js","../assets/preferences":"assets\\preferences.js","../assets/range":"assets\\range.js","../parser/abbreviation":"parser\\abbreviation.js","../resolver/cssGradient":"resolver\\cssGradient.js","../utils/action":"utils\\action.js","../utils/common":"utils\\common.js","../utils/editor":"utils\\editor.js"}],"action\\incrementDecrement.js":[function(require,module,exports){
/**
 * Increment/decrement number under cursor
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var actionUtils = require('../utils/action');

	/**
	 * Returns length of integer part of number
	 * @param {String} num
	 */
	function intLength(num) {
		num = num.replace(/^\-/, '');
		if (~num.indexOf('.')) {
			return num.split('.')[0].length;
		}
		
		return num.length;
	}

	return {
		increment01Action: function(editor) {
			return this.incrementNumber(editor, .1);
		},

		increment1Action: function(editor) {
			return this.incrementNumber(editor, 1);
		},

		increment10Action: function(editor) {
			return this.incrementNumber(editor, 10);
		},

		decrement01Action: function(editor) {
			return this.incrementNumber(editor, -.1);
		},

		decrement1Action: function(editor) {
			return this.incrementNumber(editor, -1);
		},

		decrement10Action: function(editor) {
			return this.incrementNumber(editor, -10);
		},

		/**
		 * Default method to increment/decrement number under
		 * caret with given step
		 * @param  {IEmmetEditor} editor
		 * @param  {Number} step
		 * @return {Boolean}
		 */
		incrementNumber: function(editor, step) {
			var hasSign = false;
			var hasDecimal = false;
				
			var r = actionUtils.findExpressionBounds(editor, function(ch, pos, content) {
				if (utils.isNumeric(ch))
					return true;
				if (ch == '.') {
					// make sure that next character is numeric too
					if (!utils.isNumeric(content.charAt(pos + 1)))
						return false;
					
					return hasDecimal ? false : hasDecimal = true;
				}
				if (ch == '-')
					return hasSign ? false : hasSign = true;
					
				return false;
			});
				
			if (r && r.length()) {
				var strNum = r.substring(String(editor.getContent()));
				var num = parseFloat(strNum);
				if (!isNaN(num)) {
					num = utils.prettifyNumber(num + step);
					
					// do we have zero-padded number?
					if (/^(\-?)0+[1-9]/.test(strNum)) {
						var minus = '';
						if (RegExp.$1) {
							minus = '-';
							num = num.substring(1);
						}
							
						var parts = num.split('.');
						parts[0] = utils.zeroPadString(parts[0], intLength(strNum));
						num = minus + parts.join('.');
					}
					
					editor.replaceContent(num, r.start, r.end);
					editor.createSelection(r.start, r.start + num.length);
					return true;
				}
			}
			
			return false;
		}
	};
});
},{"../utils/action":"utils\\action.js","../utils/common":"utils\\common.js"}],"action\\lineBreaks.js":[function(require,module,exports){
/**
 * Actions to insert line breaks. Some simple editors (like browser's 
 * &lt;textarea&gt;, for example) do not provide such simple things
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var prefs = require('../assets/preferences');
	var utils = require('../utils/common');
	var resources = require('../assets/resources');
	var htmlMatcher = require('../assets/htmlMatcher');
	var editorUtils = require('../utils/editor');

	var xmlSyntaxes = ['html', 'xml', 'xsl'];

	// setup default preferences
	prefs.define('css.closeBraceIndentation', '\n',
			'Indentation before closing brace of CSS rule. Some users prefere ' 
			+ 'indented closing brace of CSS rule for better readability. '
			+ 'This preference’s value will be automatically inserted before '
			+ 'closing brace when user adds newline in newly created CSS rule '
			+ '(e.g. when “Insert formatted linebreak” action will be performed ' 
			+ 'in CSS file). If you’re such user, you may want to write put a value ' 
			+ 'like <code>\\n\\t</code> in this preference.');

	return {
		/**
		 * Inserts newline character with proper indentation. This action is used in
		 * editors that doesn't have indentation control (like textarea element) to 
		 * provide proper indentation for inserted newlines
		 * @param {IEmmetEditor} editor Editor instance
		 */
		insertLineBreakAction: function(editor) {
			if (!this.insertLineBreakOnlyAction(editor)) {
				var curPadding = editorUtils.getCurrentLinePadding(editor);
				var content = String(editor.getContent());
				var caretPos = editor.getCaretPos();
				var len = content.length;
				var nl = '\n';
					
				// check out next line padding
				var lineRange = editor.getCurrentLineRange();
				var nextPadding = '';
					
				for (var i = lineRange.end, ch; i < len; i++) {
					ch = content.charAt(i);
					if (ch == ' ' || ch == '\t')
						nextPadding += ch;
					else
						break;
				}
				
				if (nextPadding.length > curPadding.length) {
					editor.replaceContent(nl + nextPadding, caretPos, caretPos, true);
				} else {
					editor.replaceContent(nl, caretPos);
				}
			}
			
			return true;
		},

		/**
		 * Inserts newline character with proper indentation in specific positions only.
		 * @param {IEmmetEditor} editor
		 * @return {Boolean} Returns <code>true</code> if line break was inserted 
		 */
		insertLineBreakOnlyAction: function(editor) {
			var info = editorUtils.outputInfo(editor);
			var caretPos = editor.getCaretPos();
			var nl = '\n';
			var pad = '\t';
			
			if (~xmlSyntaxes.indexOf(info.syntax)) {
				// let's see if we're breaking newly created tag
				var tag = htmlMatcher.tag(info.content, caretPos);
				if (tag && !tag.innerRange.length()) {
					editor.replaceContent(nl + pad + utils.getCaretPlaceholder() + nl, caretPos);
					return true;
				}
			} else if (info.syntax == 'css') {
				/** @type String */
				var content = info.content;
				if (caretPos && content.charAt(caretPos - 1) == '{') {
					var append = prefs.get('css.closeBraceIndentation');
					
					var hasCloseBrace = content.charAt(caretPos) == '}';
					if (!hasCloseBrace) {
						// do we really need special formatting here?
						// check if this is really a newly created rule,
						// look ahead for a closing brace
						for (var i = caretPos, il = content.length, ch; i < il; i++) {
							ch = content.charAt(i);
							if (ch == '{') {
								// ok, this is a new rule without closing brace
								break;
							}
							
							if (ch == '}') {
								// not a new rule, just add indentation
								append = '';
								hasCloseBrace = true;
								break;
							}
						}
					}
					
					if (!hasCloseBrace) {
						append += '}';
					}
					
					// defining rule set
					var insValue = nl + pad + utils.getCaretPlaceholder() + append;
					editor.replaceContent(insValue, caretPos);
					return true;
				}
			}
				
			return false;
		}
	};
});

},{"../assets/htmlMatcher":"assets\\htmlMatcher.js","../assets/preferences":"assets\\preferences.js","../assets/resources":"assets\\resources.js","../utils/common":"utils\\common.js","../utils/editor":"utils\\editor.js"}],"action\\main.js":[function(require,module,exports){
/**
 * Module describes and performs Emmet actions. The actions themselves are
 * defined in <i>actions</i> folder
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');

	// all registered actions
	var actions = {};

	// load all default actions
	var actionModules = {
		base64: require('./base64'),
		editPoints: require('./editPoints'),
		evaluateMath: require('./evaluateMath'),
		expandAbbreviation: require('./expandAbbreviation'),
		incrementDecrement: require('./incrementDecrement'),
		lineBreaks: require('./lineBreaks'),
		balance: require('./balance'),
		mergeLines: require('./mergeLines'),
		reflectCSSValue: require('./reflectCSSValue'),
		removeTag: require('./removeTag'),
		selectItem: require('./selectItem'),
		selectLine: require('./selectLine'),
		splitJoinTag: require('./splitJoinTag'),
		toggleComment: require('./toggleComment'),
		updateImageSize: require('./updateImageSize'),
		wrapWithAbbreviation: require('./wrapWithAbbreviation'),
		updateTag: require('./updateTag')
	};

	function addAction(name, fn, options) {
		name = name.toLowerCase();
		options = options || {};
		
		if (typeof options === 'string') {
			options = {label: options};
		}

		if (!options.label) {
			options.label = humanizeActionName(name);
		}
		
		actions[name] = {
			name: name,
			fn: fn,
			options: options
		};
	}
	
	/**
	 * “Humanizes” action name, makes it more readable for people
	 * @param {String} name Action name (like 'expand_abbreviation')
	 * @return Humanized name (like 'Expand Abbreviation')
	 */
	function humanizeActionName(name) {
		return utils.trim(name.charAt(0).toUpperCase() 
			+ name.substring(1).replace(/_[a-z]/g, function(str) {
				return ' ' + str.charAt(1).toUpperCase();
			}));
	}

	var bind = function(name, method) {
		var m = actionModules[name];
		return m[method].bind(m);
	};

	// XXX register default actions
	addAction('encode_decode_data_url', bind('base64', 'encodeDecodeDataUrlAction'), 'Encode\\Decode data:URL image');
	addAction('prev_edit_point', bind('editPoints', 'previousEditPointAction'), 'Previous Edit Point');
	addAction('next_edit_point', bind('editPoints', 'nextEditPointAction'), 'Next Edit Point');
	addAction('evaluate_math_expression', bind('evaluateMath', 'evaluateMathAction'), 'Numbers/Evaluate Math Expression');
	addAction('expand_abbreviation_with_tab', bind('expandAbbreviation', 'expandAbbreviationWithTabAction'), {hidden: true});
	addAction('expand_abbreviation', bind('expandAbbreviation', 'expandAbbreviationAction'), 'Expand Abbreviation');
	addAction('insert_formatted_line_break_only', bind('lineBreaks', 'insertLineBreakOnlyAction'), {hidden: true});
	addAction('insert_formatted_line_break', bind('lineBreaks', 'insertLineBreakAction'), {hidden: true});
	addAction('balance_inward', bind('balance', 'balanceInwardAction'), 'Balance (inward)');
	addAction('balance_outward', bind('balance', 'balanceOutwardAction'), 'Balance (outward)');
	addAction('matching_pair', bind('balance', 'goToMatchingPairAction'), 'HTML/Go To Matching Tag Pair');
	addAction('merge_lines', bind('mergeLines', 'mergeLinesAction'), 'Merge Lines');
	addAction('reflect_css_value', bind('reflectCSSValue', 'reflectCSSValueAction'), 'CSS/Reflect Value');
	addAction('remove_tag', bind('removeTag', 'removeTagAction'), 'HTML/Remove Tag');
	addAction('select_next_item', bind('selectItem', 'selectNextItemAction'), 'Select Next Item');
	addAction('select_previous_item', bind('selectItem', 'selectPreviousItemAction'), 'Select Previous Item');
	addAction('split_join_tag', bind('splitJoinTag', 'splitJoinTagAction'), 'HTML/Split\\Join Tag Declaration');
	addAction('toggle_comment', bind('toggleComment', 'toggleCommentAction'), 'Toggle Comment');
	addAction('update_image_size', bind('updateImageSize', 'updateImageSizeAction'), 'Update Image Size');
	addAction('wrap_with_abbreviation', bind('wrapWithAbbreviation', 'wrapWithAbbreviationAction'), 'Wrap With Abbreviation');
	addAction('update_tag', bind('updateTag', 'updateTagAction'), 'HTML/Update Tag');

	[1, -1, 10, -10, 0.1, -0.1].forEach(function(num) {
		var prefix = num > 0 ? 'increment' : 'decrement';
		var suffix = String(Math.abs(num)).replace('.', '').substring(0, 2);
		var actionId = prefix + '_number_by_' + suffix;
		var actionMethod = prefix + suffix + 'Action';
		var actionLabel = 'Numbers/' + prefix.charAt(0).toUpperCase() + prefix.substring(1) + ' number by ' + Math.abs(num);
		addAction(actionId, bind('incrementDecrement', actionMethod), actionLabel);
	});
	
	return {
		/**
		 * Registers new action
		 * @param {String} name Action name
		 * @param {Function} fn Action function
		 * @param {Object} options Custom action options:<br>
		 * <b>label</b> : (<code>String</code>) – Human-readable action name. 
		 * May contain '/' symbols as submenu separators<br>
		 * <b>hidden</b> : (<code>Boolean</code>) – Indicates whether action
		 * should be displayed in menu (<code>getMenu()</code> method)
		 */
		add: addAction,
		
		/**
		 * Returns action object
		 * @param {String} name Action name
		 * @returns {Object}
		 */
		get: function(name) {
			return actions[name.toLowerCase()];
		},
		
		/**
		 * Runs Emmet action. For list of available actions and their
		 * arguments see <i>actions</i> folder.
		 * @param {String} name Action name 
		 * @param {Array} args Additional arguments. It may be array of arguments
		 * or inline arguments. The first argument should be <code>IEmmetEditor</code> instance
		 * @returns {Boolean} Status of performed operation, <code>true</code>
		 * means action was performed successfully.
		 * @example
		 * require('action/main').run('expand_abbreviation', editor);  
		 * require('action/main').run('wrap_with_abbreviation', [editor, 'div']);  
		 */
		run: function(name, args) {
			if (!Array.isArray(args)) {
				args = utils.toArray(arguments, 1);
			}
			
			var action = this.get(name);
			if (!action) {
				throw new Error('Action "' + name + '" is not defined');
			}

			return action.fn.apply(action, args);
		},
		
		/**
		 * Returns all registered actions as object
		 * @returns {Object}
		 */
		getAll: function() {
			return actions;
		},
		
		/**
		 * Returns all registered actions as array
		 * @returns {Array}
		 */
		getList: function() {
			var all = this.getAll();
			return Object.keys(all).map(function(key) {
				return all[key];
			});
		},
		
		/**
		 * Returns actions list as structured menu. If action has <i>label</i>,
		 * it will be splitted by '/' symbol into submenus (for example: 
		 * CSS/Reflect Value) and grouped with other items
		 * @param {Array} skipActions List of action identifiers that should be 
		 * skipped from menu
		 * @returns {Array}
		 */
		getMenu: function(skipActions) {
			var result = [];
			skipActions = skipActions || [];
			this.getList().forEach(function(action) {
				if (action.options.hidden || ~skipActions.indexOf(action.name))
					return;
				
				var actionName = humanizeActionName(action.name);
				var ctx = result;
				if (action.options.label) {
					var parts = action.options.label.split('/');
					actionName = parts.pop();
					
					// create submenus, if needed
					var menuName, submenu;
					while ((menuName = parts.shift())) {
						submenu = utils.find(ctx, function(item) {
							return item.type == 'submenu' && item.name == menuName;
						});
						
						if (!submenu) {
							submenu = {
								name: menuName,
								type: 'submenu',
								items: []
							};
							ctx.push(submenu);
						}
						
						ctx = submenu.items;
					}
				}
				
				ctx.push({
					type: 'action',
					name: action.name,
					label: actionName
				});
			});
			
			return result;
		},

		/**
		 * Returns action name associated with menu item title
		 * @param {String} title
		 * @returns {String}
		 */
		getActionNameForMenuTitle: function(title, menu) {
			return utils.find(menu || this.getMenu(), function(val) {
				if (val.type == 'action') {
					if (val.label == title || val.name == title) {
						return val.name;
					}
				} else {
					return this.getActionNameForMenuTitle(title, val.items);
				}
			}, this);
		}
	};
});
},{"../utils/common":"utils\\common.js","./balance":"action\\balance.js","./base64":"action\\base64.js","./editPoints":"action\\editPoints.js","./evaluateMath":"action\\evaluateMath.js","./expandAbbreviation":"action\\expandAbbreviation.js","./incrementDecrement":"action\\incrementDecrement.js","./lineBreaks":"action\\lineBreaks.js","./mergeLines":"action\\mergeLines.js","./reflectCSSValue":"action\\reflectCSSValue.js","./removeTag":"action\\removeTag.js","./selectItem":"action\\selectItem.js","./selectLine":"action\\selectLine.js","./splitJoinTag":"action\\splitJoinTag.js","./toggleComment":"action\\toggleComment.js","./updateImageSize":"action\\updateImageSize.js","./updateTag":"action\\updateTag.js","./wrapWithAbbreviation":"action\\wrapWithAbbreviation.js"}],"action\\mergeLines.js":[function(require,module,exports){
/**
 * Merges selected lines or lines between XHTML tag pairs
 * @param {Function} require
 * @param {Underscore} _
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var htmlMatcher = require('../assets/htmlMatcher');
	var utils = require('../utils/common');
	var editorUtils = require('../utils/editor');
	var range = require('../assets/range');

	return {
		mergeLinesAction: function(editor) {
			var info = editorUtils.outputInfo(editor);
		
			var selection = range(editor.getSelectionRange());
			if (!selection.length()) {
				// find matching tag
				var pair = htmlMatcher.find(info.content, editor.getCaretPos());
				if (pair) {
					selection = pair.outerRange;
				}
			}
			
			if (selection.length()) {
				// got range, merge lines
				var text =  selection.substring(info.content);
				var lines = utils.splitByLines(text);
				
				for (var i = 1; i < lines.length; i++) {
					lines[i] = lines[i].replace(/^\s+/, '');
				}
				
				text = lines.join('').replace(/\s{2,}/, ' ');
				var textLen = text.length;
				text = utils.escapeText(text);
				editor.replaceContent(text, selection.start, selection.end);
				editor.createSelection(selection.start, selection.start + textLen);
				
				return true;
			}
			
			return false;
		}
	};
});
},{"../assets/htmlMatcher":"assets\\htmlMatcher.js","../assets/range":"assets\\range.js","../utils/common":"utils\\common.js","../utils/editor":"utils\\editor.js"}],"action\\reflectCSSValue.js":[function(require,module,exports){
/**
 * Reflect CSS value: takes rule's value under caret and pastes it for the same 
 * rules with vendor prefixes
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var handlerList = require('../assets/handlerList');
	var prefs = require('../assets/preferences');
	var cssResolver = require('../resolver/css');
	var cssEditTree = require('../editTree/css');
	var utils = require('../utils/common');
	var actionUtils = require('../utils/action');
	var editorUtils = require('../utils/editor');
	var cssGradient = require('../resolver/cssGradient');

	prefs.define('css.reflect.oldIEOpacity', false, 'Support IE6/7/8 opacity notation, e.g. <code>filter:alpha(opacity=...)</code>.\
		Note that CSS3 and SVG also provides <code>filter</code> property so this option is disabled by default.')

	/**
	 * @type HandlerList List of registered handlers
	 */
	var handlers = handlerList.create();
	
	function doCSSReflection(editor) {
		var outputInfo = editorUtils.outputInfo(editor);
		var caretPos = editor.getCaretPos();
		
		var cssRule = cssEditTree.parseFromPosition(outputInfo.content, caretPos);
		if (!cssRule) return;
		
		var property = cssRule.itemFromPosition(caretPos, true);
		// no property under cursor, nothing to reflect
		if (!property) return;
		
		var oldRule = cssRule.source;
		var offset = cssRule.options.offset;
		var caretDelta = caretPos - offset - property.range().start;
		
		handlers.exec(false, [property]);
		
		if (oldRule !== cssRule.source) {
			return {
				data:  cssRule.source,
				start: offset,
				end:   offset + oldRule.length,
				caret: offset + property.range().start + caretDelta
			};
		}
	}
	
	/**
	 * Returns regexp that should match reflected CSS property names
	 * @param {String} name Current CSS property name
	 * @return {RegExp}
	 */
	function getReflectedCSSName(name) {
		name = cssEditTree.baseName(name);
		var vendorPrefix = '^(?:\\-\\w+\\-)?', m;
		
		if ((name == 'opacity' || name == 'filter') && prefs.get('css.reflect.oldIEOpacity')) {
			return new RegExp(vendorPrefix + '(?:opacity|filter)$');
		} else if ((m = name.match(/^border-radius-(top|bottom)(left|right)/))) {
			// Mozilla-style border radius
			return new RegExp(vendorPrefix + '(?:' + name + '|border-' + m[1] + '-' + m[2] + '-radius)$');
		} else if ((m = name.match(/^border-(top|bottom)-(left|right)-radius/))) { 
			return new RegExp(vendorPrefix + '(?:' + name + '|border-radius-' + m[1] + m[2] + ')$');
		}
		
		return new RegExp(vendorPrefix + name + '$');
	}

	/**
	 * Reflects inner CSS properites in given value
	 * agains name‘s vendor prefix. In other words, it tries
	 * to modify `transform 0.2s linear` value for `-webkit-transition`
	 * property
	 * @param  {String} name  Reciever CSS property name
	 * @param  {String} value New property value
	 * @return {String}
	 */
	function reflectValueParts(name, value) {
		// detects and updates vendor-specific properties in value,
		// e.g. -webkit-transition: -webkit-transform
		
		var reVendor = /^\-(\w+)\-/;
		var propPrefix = reVendor.test(name) ? RegExp.$1.toLowerCase() : '';
		var parts = cssEditTree.findParts(value);

		parts.reverse();
		parts.forEach(function(part) {
			var partValue = part.substring(value).replace(reVendor, '');
			var prefixes = cssResolver.vendorPrefixes(partValue);
			if (prefixes) {
				// if prefixes are not null then given value can
				// be resolved against Can I Use database and may or
				// may not contain prefixed variant
				if (propPrefix && ~prefixes.indexOf(propPrefix)) {
					partValue = '-' + propPrefix + '-' + partValue;
				}

				value = utils.replaceSubstring(value, partValue, part);
			}
		});

		return value;
	}
	
	/**
	 * Reflects value from <code>donor</code> into <code>receiver</code>
	 * @param {CSSProperty} donor Donor CSS property from which value should
	 * be reflected
	 * @param {CSSProperty} receiver Property that should receive reflected 
	 * value from donor
	 */
	function reflectValue(donor, receiver) {
		var value = getReflectedValue(donor.name(), donor.value(), 
				receiver.name(), receiver.value());
		
		value = reflectValueParts(receiver.name(), value);
		receiver.value(value);
	}
	
	/**
	 * Returns value that should be reflected for <code>refName</code> CSS property
	 * from <code>curName</code> property. This function is used for special cases,
	 * when the same result must be achieved with different properties for different
	 * browsers. For example: opаcity:0.5; → filter:alpha(opacity=50);<br><br>
	 * 
	 * This function does value conversion between different CSS properties
	 * 
	 * @param {String} curName Current CSS property name
	 * @param {String} curValue Current CSS property value
	 * @param {String} refName Receiver CSS property's name 
	 * @param {String} refValue Receiver CSS property's value
	 * @return {String} New value for receiver property
	 */
	function getReflectedValue(curName, curValue, refName, refValue) {
		curName = cssEditTree.baseName(curName);
		refName = cssEditTree.baseName(refName);
		
		if (curName == 'opacity' && refName == 'filter') {
			return refValue.replace(/opacity=[^)]*/i, 'opacity=' + Math.floor(parseFloat(curValue) * 100));
		} else if (curName == 'filter' && refName == 'opacity') {
			var m = curValue.match(/opacity=([^)]*)/i);
			return m ? utils.prettifyNumber(parseInt(m[1], 10) / 100) : refValue;
		}
		
		return curValue;
	}
	
	module = module || {};
	module.exports = {
		reflectCSSValueAction: function(editor) {
			if (editor.getSyntax() != 'css') {
				return false;
			}

			return actionUtils.compoundUpdate(editor, doCSSReflection(editor));
		},

		_defaultHandler: function(property) {
			var reName = getReflectedCSSName(property.name());
			property.parent.list().forEach(function(p) {
				if (reName.test(p.name())) {
					reflectValue(property, p);
				}
			});
		},

		/**
		 * Adds custom reflect handler. The passed function will receive matched
		 * CSS property (as <code>CSSEditElement</code> object) and should
		 * return <code>true</code> if it was performed successfully (handled 
		 * reflection), <code>false</code> otherwise.
		 * @param {Function} fn
		 * @param {Object} options
		 */
		addHandler: function(fn, options) {
			handlers.add(fn, options);
		},
		
		/**
		 * Removes registered handler
		 * @returns
		 */
		removeHandler: function(fn) {
			handlers.remove(fn);
		}
	};

	// XXX add default handlers
	handlers.add(module.exports._defaultHandler.bind(module.exports), {order: -1});
	handlers.add(cssGradient.reflectValueHandler.bind(cssGradient));

	return module.exports;
});
},{"../assets/handlerList":"assets\\handlerList.js","../assets/preferences":"assets\\preferences.js","../editTree/css":"editTree\\css.js","../resolver/css":"resolver\\css.js","../resolver/cssGradient":"resolver\\cssGradient.js","../utils/action":"utils\\action.js","../utils/common":"utils\\common.js","../utils/editor":"utils\\editor.js"}],"action\\removeTag.js":[function(require,module,exports){
/**
 * Gracefully removes tag under cursor
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var editorUtils = require('../utils/editor');
	var htmlMatcher = require('../assets/htmlMatcher');

	return {
		removeTagAction: function(editor) {
			var info = editorUtils.outputInfo(editor);
			
			// search for tag
			var tag = htmlMatcher.tag(info.content, editor.getCaretPos());
			if (tag) {
				if (!tag.close) {
					// simply remove unary tag
					editor.replaceContent(utils.getCaretPlaceholder(), tag.range.start, tag.range.end);
				} else {
					// remove tag and its newlines
					/** @type Range */
					var tagContentRange = utils.narrowToNonSpace(info.content, tag.innerRange);
					/** @type Range */
					var startLineBounds = utils.findNewlineBounds(info.content, tagContentRange.start);
					var startLinePad = utils.getLinePadding(startLineBounds.substring(info.content));
					var tagContent = tagContentRange.substring(info.content);
					
					tagContent = utils.unindentString(tagContent, startLinePad);
					editor.replaceContent(utils.getCaretPlaceholder() + utils.escapeText(tagContent), tag.outerRange.start, tag.outerRange.end);
				}
				
				return true;
			}
			
			return false;
		}
	};
});

},{"../assets/htmlMatcher":"assets\\htmlMatcher.js","../utils/common":"utils\\common.js","../utils/editor":"utils\\editor.js"}],"action\\selectItem.js":[function(require,module,exports){
/**
 * Actions that use stream parsers and tokenizers for traversing:
 * -- Search for next/previous items in HTML
 * -- Search for next/previous items in CSS
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var range = require('../assets/range');
	var utils = require('../utils/common');
	var editorUtils = require('../utils/editor');
	var actionUtils = require('../utils/action');
	var stringStream = require('../assets/stringStream');
	var xmlParser = require('../parser/xml');
	var cssEditTree = require('../editTree/css');
	var cssSections = require('../utils/cssSections');

	var startTag = /^<([\w\:\-]+)((?:\s+[\w\-:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;

	/**
	 * Generic function for searching for items to select
	 * @param {IEmmetEditor} editor
	 * @param {Boolean} isBackward Search backward (search forward otherwise)
	 * @param {Function} extractFn Function that extracts item content
	 * @param {Function} rangeFn Function that search for next token range
	 */
	function findItem(editor, isBackward, extractFn, rangeFn) {
		var content = editorUtils.outputInfo(editor).content;
		
		var contentLength = content.length;
		var itemRange, rng;
		/** @type Range */
		var prevRange = range(-1, 0);
		/** @type Range */
		var sel = range(editor.getSelectionRange());
		
		var searchPos = sel.start, loop = 100000; // endless loop protection
		while (searchPos >= 0 && searchPos < contentLength && --loop > 0) {
			if ( (itemRange = extractFn(content, searchPos, isBackward)) ) {
				if (prevRange.equal(itemRange)) {
					break;
				}
				
				prevRange = itemRange.clone();
				rng = rangeFn(itemRange.substring(content), itemRange.start, sel.clone());
				
				if (rng) {
					editor.createSelection(rng.start, rng.end);
					return true;
				} else {
					searchPos = isBackward ? itemRange.start : itemRange.end - 1;
				}
			}
			
			searchPos += isBackward ? -1 : 1;
		}
		
		return false;
	}
	
	// XXX HTML section
	
	/**
	 * Find next HTML item
	 * @param {IEmmetEditor} editor
	 */
	function findNextHTMLItem(editor) {
		var isFirst = true;
		return findItem(editor, false, function(content, searchPos){
			if (isFirst) {
				isFirst = false;
				return findOpeningTagFromPosition(content, searchPos);
			} else {
				return getOpeningTagFromPosition(content, searchPos);
			}
		}, function(tag, offset, selRange) {
			return getRangeForHTMLItem(tag, offset, selRange, false);
		});
	}
	
	/**
	 * Find previous HTML item
	 * @param {IEmmetEditor} editor
	 */
	function findPrevHTMLItem(editor) {
		return findItem(editor, true, getOpeningTagFromPosition, function (tag, offset, selRange) {
			return getRangeForHTMLItem(tag, offset, selRange, true);
		});
	}
	
	/**
	 * Creates possible selection ranges for HTML tag
	 * @param {String} source Original HTML source for tokens
	 * @param {Array} tokens List of HTML tokens
	 * @returns {Array}
	 */
	function makePossibleRangesHTML(source, tokens, offset) {
		offset = offset || 0;
		var result = [];
		var attrStart = -1, attrName = '', attrValue = '', attrValueRange, tagName;
		tokens.forEach(function(tok) {
			switch (tok.type) {
				case 'tag':
					tagName = source.substring(tok.start, tok.end);
					if (/^<[\w\:\-]/.test(tagName)) {
						// add tag name
						result.push(range({
							start: tok.start + 1, 
							end: tok.end
						}));
					}
					break;
				case 'attribute':
					attrStart = tok.start;
					attrName = source.substring(tok.start, tok.end);
					break;
					
				case 'string':
					// attribute value
					// push full attribute first
					result.push(range(attrStart, tok.end - attrStart));
					
					attrValueRange = range(tok);
					attrValue = attrValueRange.substring(source);
					
					// is this a quoted attribute?
					if (isQuote(attrValue.charAt(0)))
						attrValueRange.start++;
					
					if (isQuote(attrValue.charAt(attrValue.length - 1)))
						attrValueRange.end--;
					
					result.push(attrValueRange);
					
					if (attrName == 'class') {
						result = result.concat(classNameRanges(attrValueRange.substring(source), attrValueRange.start));
					}
					
					break;
			}
		});
		
		// offset ranges
		result = result.filter(function(item) {
			if (item.length()) {
				item.shift(offset);
				return true;
			}
		});

		// remove duplicates
		return utils.unique(result, function(item) {
			return item.toString();
		});
	}
	
	/**
	 * Returns ranges of class names in "class" attribute value
	 * @param {String} className
	 * @returns {Array}
	 */
	function classNameRanges(className, offset) {
		offset = offset || 0;
		var result = [];
		/** @type StringStream */
		var stream = stringStream.create(className);
		
		// skip whitespace
		stream.eatSpace();
		stream.start = stream.pos;
		
		var ch;
		while ((ch = stream.next())) {
			if (/[\s\u00a0]/.test(ch)) {
				result.push(range(stream.start + offset, stream.pos - stream.start - 1));
				stream.eatSpace();
				stream.start = stream.pos;
			}
		}
		
		result.push(range(stream.start + offset, stream.pos - stream.start));
		return result;
	}
	
	/**
	 * Returns best HTML tag range match for current selection
	 * @param {String} tag Tag declaration
	 * @param {Number} offset Tag's position index inside content
	 * @param {Range} selRange Selection range
	 * @return {Range} Returns range if next item was found, <code>null</code> otherwise
	 */
	function getRangeForHTMLItem(tag, offset, selRange, isBackward) {
		var ranges = makePossibleRangesHTML(tag, xmlParser.parse(tag), offset);
		
		if (isBackward)
			ranges.reverse();
		
		// try to find selected range
		var curRange = utils.find(ranges, function(r) {
			return r.equal(selRange);
		});
		
		if (curRange) {
			var ix = ranges.indexOf(curRange);
			if (ix < ranges.length - 1)
				return ranges[ix + 1];
			
			return null;
		}
		
		// no selected range, find nearest one
		if (isBackward)
			// search backward
			return utils.find(ranges, function(r) {
				return r.start < selRange.start;
			});
		
		// search forward
		// to deal with overlapping ranges (like full attribute definition
		// and attribute value) let's find range under caret first
		if (!curRange) {
			var matchedRanges = ranges.filter(function(r) {
				return r.inside(selRange.end);
			});
			
			if (matchedRanges.length > 1)
				return matchedRanges[1];
		}
		
		
		return utils.find(ranges, function(r) {
			return r.end > selRange.end;
		});
	}
	
	/**
	 * Search for opening tag in content, starting at specified position
	 * @param {String} html Where to search tag
	 * @param {Number} pos Character index where to start searching
	 * @return {Range} Returns range if valid opening tag was found,
	 * <code>null</code> otherwise
	 */
	function findOpeningTagFromPosition(html, pos) {
		var tag;
		while (pos >= 0) {
			if ((tag = getOpeningTagFromPosition(html, pos)))
				return tag;
			pos--;
		}
		
		return null;
	}
	
	/**
	 * @param {String} html Where to search tag
	 * @param {Number} pos Character index where to start searching
	 * @return {Range} Returns range if valid opening tag was found,
	 * <code>null</code> otherwise
	 */
	function getOpeningTagFromPosition(html, pos) {
		var m;
		if (html.charAt(pos) == '<' && (m = html.substring(pos, html.length).match(startTag))) {
			return range(pos, m[0]);
		}
	}
	
	function isQuote(ch) {
		return ch == '"' || ch == "'";
	}

	/**
	 * Returns all ranges inside given rule, available for selection
	 * @param  {CSSEditContainer} rule
	 * @return {Array}
	 */
	function findInnerRanges(rule) {
		// rule selector
		var ranges = [rule.nameRange(true)];

		// find nested sections, keep selectors only
		var nestedSections = cssSections.nestedSectionsInRule(rule);
		nestedSections.forEach(function(section) {
			ranges.push(range.create2(section.start, section._selectorEnd));
		});

		// add full property ranges and values
		rule.list().forEach(function(property) {
			ranges = ranges.concat(makePossibleRangesCSS(property));
		});

		ranges = range.sort(ranges);

		// optimize result: remove empty ranges and duplicates
		ranges = ranges.filter(function(item) {
			return !!item.length();
		});
		return utils.unique(ranges, function(item) {
			return item.toString();
		});
	}
	
	/**
	 * Makes all possible selection ranges for specified CSS property
	 * @param {CSSProperty} property
	 * @returns {Array}
	 */
	function makePossibleRangesCSS(property) {
		// find all possible ranges, sorted by position and size
		var valueRange = property.valueRange(true);
		var result = [property.range(true), valueRange];
		
		// locate parts of complex values.
		// some examples:
		// – 1px solid red: 3 parts
		// – arial, sans-serif: enumeration, 2 parts
		// – url(image.png): function value part
		var value = property.value();
		property.valueParts().forEach(function(r) {
			// add absolute range
			var clone = r.clone();
			result.push(clone.shift(valueRange.start));
			
			/** @type StringStream */
			var stream = stringStream.create(r.substring(value));
			if (stream.match(/^[\w\-]+\(/, true)) {
				// we have a function, find values in it.
				// but first add function contents
				stream.start = stream.pos;
				stream.backUp(1);
				stream.skipToPair('(', ')');
				stream.backUp(1);
				var fnBody = stream.current();
				result.push(range(clone.start + stream.start, fnBody));
				
				// find parts
				cssEditTree.findParts(fnBody).forEach(function(part) {
					result.push(range(clone.start + stream.start + part.start, part.substring(fnBody)));
				});
			}
		});

		return result;
	}
	
	/**
	 * Tries to find matched CSS property and nearest range for selection
	 * @param {CSSRule} rule
	 * @param {Range} selRange
	 * @param {Boolean} isBackward
	 * @returns {Range}
	 */
	function matchedRangeForCSSProperty(rule, selRange, isBackward) {
		var ranges = findInnerRanges(rule);
		if (isBackward) {
			ranges.reverse();
		}
		
		// return next to selected range, if possible
		var r = utils.find(ranges, function(item) {
			return item.equal(selRange);
		});

		if (r) {
			return ranges[ranges.indexOf(r) + 1];
		}

		// find matched and (possibly) overlapping ranges
		var nested = ranges.filter(function(item) {
			return item.inside(selRange.end);
		});

		if (nested.length) {
			return nested.sort(function(a, b) {
				return a.length() - b.length();
			})[0];
		}

		// return range next to caret
		var test = 
		r = utils.find(ranges, isBackward 
			? function(item) {return item.end < selRange.start;}
			: function(item) {return item.end > selRange.start;}
		);

		if (!r) {
			// can’t find anything, just pick first one
			r = ranges[0];
		}

		return r;
	}
	
	function findNextCSSItem(editor) {
		return findItem(editor, false, cssSections.locateRule.bind(cssSections), getRangeForNextItemInCSS);
	}
	
	function findPrevCSSItem(editor) {
		return findItem(editor, true, cssSections.locateRule.bind(cssSections), getRangeForPrevItemInCSS);
	}
	
	/**
	 * Returns range for item to be selected in CSS after current caret 
	 * (selection) position
	 * @param {String} rule CSS rule declaration
	 * @param {Number} offset Rule's position index inside content
	 * @param {Range} selRange Selection range
	 * @return {Range} Returns range if next item was found, <code>null</code> otherwise
	 */
	function getRangeForNextItemInCSS(rule, offset, selRange) {
		var tree = cssEditTree.parse(rule, {
			offset: offset
		});

		return matchedRangeForCSSProperty(tree, selRange, false);
	}
	
	/**
	 * Returns range for item to be selected in CSS before current caret 
	 * (selection) position
	 * @param {String} rule CSS rule declaration
	 * @param {Number} offset Rule's position index inside content
	 * @param {Range} selRange Selection range
	 * @return {Range} Returns range if previous item was found, <code>null</code> otherwise
	 */
	function getRangeForPrevItemInCSS(rule, offset, selRange) {
		var tree = cssEditTree.parse(rule, {
			offset: offset
		});

		return matchedRangeForCSSProperty(tree, selRange, true);
	}

	return {
		selectNextItemAction: function(editor) {
			if (actionUtils.isSupportedCSS(editor.getSyntax())) {
				return findNextCSSItem(editor);
			} else {
				return findNextHTMLItem(editor);
			}
		},

		selectPreviousItemAction: function(editor) {
			if (actionUtils.isSupportedCSS(editor.getSyntax())) {
				return findPrevCSSItem(editor);
			} else {
				return findPrevHTMLItem(editor);
			}
		}
	};
});
},{"../assets/range":"assets\\range.js","../assets/stringStream":"assets\\stringStream.js","../editTree/css":"editTree\\css.js","../parser/xml":"parser\\xml.js","../utils/action":"utils\\action.js","../utils/common":"utils\\common.js","../utils/cssSections":"utils\\cssSections.js","../utils/editor":"utils\\editor.js"}],"action\\selectLine.js":[function(require,module,exports){
/**
 * Select current line (for simple editors like browser's &lt;textarea&gt;)
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	return {
		selectLineAction: function(editor) {
			var range = editor.getCurrentLineRange();
			editor.createSelection(range.start, range.end);
			return true;
		}
	};
});
},{}],"action\\splitJoinTag.js":[function(require,module,exports){
/**
 * Splits or joins tag, e.g. transforms it into a short notation and vice versa:<br>
 * &lt;div&gt;&lt;/div&gt; → &lt;div /&gt; : join<br>
 * &lt;div /&gt; → &lt;div&gt;&lt;/div&gt; : split
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var resources = require('../assets/resources');
	var matcher = require('../assets/htmlMatcher');
	var editorUtils = require('../utils/editor');
	var profile = require('../assets/profile');

	/**
	 * @param {IEmmetEditor} editor
	 * @param {Object} profile
	 * @param {Object} tag
	 */
	function joinTag(editor, profile, tag) {
		// empty closing slash is a nonsense for this action
		var slash = profile.selfClosing() || ' /';
		var content = tag.open.range.substring(tag.source).replace(/\s*>$/, slash + '>');
		
		var caretPos = editor.getCaretPos();
		
		// update caret position
		if (content.length + tag.outerRange.start < caretPos) {
			caretPos = content.length + tag.outerRange.start;
		}
		
		content = utils.escapeText(content);
		editor.replaceContent(content, tag.outerRange.start, tag.outerRange.end);
		editor.setCaretPos(caretPos);
		return true;
	}
	
	function splitTag(editor, profile, tag) {
		var caretPos = editor.getCaretPos();
		
		// define tag content depending on profile
		var tagContent = (profile.tag_nl === true) ? '\n\t\n' : '';
		var content = tag.outerContent().replace(/\s*\/>$/, '>');
		caretPos = tag.outerRange.start + content.length;
		content += tagContent + '</' + tag.open.name + '>';
		
		content = utils.escapeText(content);
		editor.replaceContent(content, tag.outerRange.start, tag.outerRange.end);
		editor.setCaretPos(caretPos);
		return true;
	}

	return {
		splitJoinTagAction: function(editor, profileName) {
			var info = editorUtils.outputInfo(editor, null, profileName);
			var curProfile = profile.get(info.profile);
			
			// find tag at current position
			var tag = matcher.tag(info.content, editor.getCaretPos());
			if (tag) {
				return tag.close 
					? joinTag(editor, curProfile, tag) 
					: splitTag(editor, curProfile, tag);
			}
			
			return false;
		}
	};
});
},{"../assets/htmlMatcher":"assets\\htmlMatcher.js","../assets/profile":"assets\\profile.js","../assets/resources":"assets\\resources.js","../utils/common":"utils\\common.js","../utils/editor":"utils\\editor.js"}],"action\\toggleComment.js":[function(require,module,exports){
/**
 * Toggles HTML and CSS comments depending on current caret context. Unlike
 * the same action in most editors, this action toggles comment on currently
 * matched item—HTML tag or CSS selector—when nothing is selected.
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var prefs = require('../assets/preferences');
	var range = require('../assets/range');
	var utils = require('../utils/common');
	var actionUtils = require('../utils/action');
	var editorUtils = require('../utils/editor');
	var htmlMatcher = require('../assets/htmlMatcher');
	var cssEditTree = require('../editTree/css');

	/**
	 * Toggle HTML comment on current selection or tag
	 * @param {IEmmetEditor} editor
	 * @return {Boolean} Returns <code>true</code> if comment was toggled
	 */
	function toggleHTMLComment(editor) {
		/** @type Range */
		var r = range(editor.getSelectionRange());
		var info = editorUtils.outputInfo(editor);
			
		if (!r.length()) {
			// no selection, find matching tag
			var tag = htmlMatcher.tag(info.content, editor.getCaretPos());
			if (tag) { // found pair
				r = tag.outerRange;
			}
		}
		
		return genericCommentToggle(editor, '<!--', '-->', r);
	}

	/**
	 * Simple CSS commenting
	 * @param {IEmmetEditor} editor
	 * @return {Boolean} Returns <code>true</code> if comment was toggled
	 */
	function toggleCSSComment(editor) {
		/** @type Range */
		var rng = range(editor.getSelectionRange());
		var info = editorUtils.outputInfo(editor);
			
		if (!rng.length()) {
			// no selection, try to get current rule
			/** @type CSSRule */
			var rule = cssEditTree.parseFromPosition(info.content, editor.getCaretPos());
			if (rule) {
				var property = cssItemFromPosition(rule, editor.getCaretPos());
				rng = property 
					? property.range(true) 
					: range(rule.nameRange(true).start, rule.source);
			}
		}
		
		if (!rng.length()) {
			// still no selection, get current line
			rng = range(editor.getCurrentLineRange());
			utils.narrowToNonSpace(info.content, rng);
		}
		
		return genericCommentToggle(editor, '/*', '*/', rng);
	}
	
	/**
	 * Returns CSS property from <code>rule</code> that matches passed position
	 * @param {EditContainer} rule
	 * @param {Number} absPos
	 * @returns {EditElement}
	 */
	function cssItemFromPosition(rule, absPos) {
		// do not use default EditContainer.itemFromPosition() here, because
		// we need to make a few assumptions to make CSS commenting more reliable
		var relPos = absPos - (rule.options.offset || 0);
		var reSafeChar = /^[\s\n\r]/;
		return utils.find(rule.list(), function(item) {
			if (item.range().end === relPos) {
				// at the end of property, but outside of it
				// if there’s a space character at current position,
				// use current property
				return reSafeChar.test(rule.source.charAt(relPos));
			}
			
			return item.range().inside(relPos);
		});
	}

	/**
	 * Search for nearest comment in <code>str</code>, starting from index <code>from</code>
	 * @param {String} text Where to search
	 * @param {Number} from Search start index
	 * @param {String} start_token Comment start string
	 * @param {String} end_token Comment end string
	 * @return {Range} Returns null if comment wasn't found
	 */
	function searchComment(text, from, startToken, endToken) {
		var commentStart = -1;
		var commentEnd = -1;
		
		var hasMatch = function(str, start) {
			return text.substr(start, str.length) == str;
		};
			
		// search for comment start
		while (from--) {
			if (hasMatch(startToken, from)) {
				commentStart = from;
				break;
			}
		}
		
		if (commentStart != -1) {
			// search for comment end
			from = commentStart;
			var contentLen = text.length;
			while (contentLen >= from++) {
				if (hasMatch(endToken, from)) {
					commentEnd = from + endToken.length;
					break;
				}
			}
		}
		
		return (commentStart != -1 && commentEnd != -1) 
			? range(commentStart, commentEnd - commentStart) 
			: null;
	}

	/**
	 * Generic comment toggling routine
	 * @param {IEmmetEditor} editor
	 * @param {String} commentStart Comment start token
	 * @param {String} commentEnd Comment end token
	 * @param {Range} range Selection range
	 * @return {Boolean}
	 */
	function genericCommentToggle(editor, commentStart, commentEnd, range) {
		var content = editorUtils.outputInfo(editor).content;
		var caretPos = editor.getCaretPos();
		var newContent = null;
			
		/**
		 * Remove comment markers from string
		 * @param {Sting} str
		 * @return {String}
		 */
		function removeComment(str) {
			return str
				.replace(new RegExp('^' + utils.escapeForRegexp(commentStart) + '\\s*'), function(str){
					caretPos -= str.length;
					return '';
				}).replace(new RegExp('\\s*' + utils.escapeForRegexp(commentEnd) + '$'), '');
		}
		
		// first, we need to make sure that this substring is not inside 
		// comment
		var commentRange = searchComment(content, caretPos, commentStart, commentEnd);
		if (commentRange && commentRange.overlap(range)) {
			// we're inside comment, remove it
			range = commentRange;
			newContent = removeComment(range.substring(content));
		} else {
			// should add comment
			// make sure that there's no comment inside selection
			newContent = commentStart + ' ' +
				range.substring(content)
					.replace(new RegExp(utils.escapeForRegexp(commentStart) + '\\s*|\\s*' + utils.escapeForRegexp(commentEnd), 'g'), '') +
				' ' + commentEnd;
				
			// adjust caret position
			caretPos += commentStart.length + 1;
		}

		// replace editor content
		if (newContent !== null) {
			newContent = utils.escapeText(newContent);
			editor.setCaretPos(range.start);
			editor.replaceContent(editorUtils.unindent(editor, newContent), range.start, range.end);
			editor.setCaretPos(caretPos);
			return true;
		}
		
		return false;
	}
	
	return {
		/**
		 * Toggle comment on current editor's selection or HTML tag/CSS rule
		 * @param {IEmmetEditor} editor
		 */
		toggleCommentAction: function(editor) {
			var info = editorUtils.outputInfo(editor);
			if (actionUtils.isSupportedCSS(info.syntax)) {
				// in case our editor is good enough and can recognize syntax from 
				// current token, we have to make sure that cursor is not inside
				// 'style' attribute of html element
				var caretPos = editor.getCaretPos();
				var tag = htmlMatcher.tag(info.content, caretPos);
				if (tag && tag.open.range.inside(caretPos)) {
					info.syntax = 'html';
				}
			}
			
			var cssSyntaxes = prefs.getArray('css.syntaxes');
			if (~cssSyntaxes.indexOf(info.syntax)) {
				return toggleCSSComment(editor);
			}
			
			return toggleHTMLComment(editor);
		}
	};
});
},{"../assets/htmlMatcher":"assets\\htmlMatcher.js","../assets/preferences":"assets\\preferences.js","../assets/range":"assets\\range.js","../editTree/css":"editTree\\css.js","../utils/action":"utils\\action.js","../utils/common":"utils\\common.js","../utils/editor":"utils\\editor.js"}],"action\\updateImageSize.js":[function(require,module,exports){
/**
 * Automatically updates image size attributes in HTML's &lt;img&gt; element or
 * CSS rule
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var editorUtils = require('../utils/editor');
	var actionUtils = require('../utils/action');
	var xmlEditTree = require('../editTree/xml');
	var cssEditTree = require('../editTree/css');
	var base64 = require('../utils/base64');
	var file = require('../plugin/file');

	/**
	 * Updates image size of &lt;img src=""&gt; tag
	 * @param {IEmmetEditor} editor
	 */
	function updateImageSizeHTML(editor) {
		var offset = editor.getCaretPos();

		// find tag from current caret position
		var info = editorUtils.outputInfo(editor);
		var xmlElem = xmlEditTree.parseFromPosition(info.content, offset, true);
		if (xmlElem && (xmlElem.name() || '').toLowerCase() == 'img') {
			getImageSizeForSource(editor, xmlElem.value('src'), function(size) {
				if (size) {
					var compoundData = xmlElem.range(true);
					xmlElem.value('width', size.width);
					xmlElem.value('height', size.height, xmlElem.indexOf('width') + 1);

					actionUtils.compoundUpdate(editor, utils.extend(compoundData, {
						data: xmlElem.toString(),
						caret: offset
					}));
				}
			});
		}
	}

	/**
	 * Updates image size of CSS property
	 * @param {IEmmetEditor} editor
	 */
	function updateImageSizeCSS(editor) {
		var offset = editor.getCaretPos();

		// find tag from current caret position
		var info = editorUtils.outputInfo(editor);
		var cssRule = cssEditTree.parseFromPosition(info.content, offset, true);
		if (cssRule) {
			// check if there is property with image under caret
			var prop = cssRule.itemFromPosition(offset, true), m;
			if (prop && (m = /url\((["']?)(.+?)\1\)/i.exec(prop.value() || ''))) {
				getImageSizeForSource(editor, m[2], function(size) {
					if (size) {
						var compoundData = cssRule.range(true);
						cssRule.value('width', size.width + 'px');
						cssRule.value('height', size.height + 'px', cssRule.indexOf('width') + 1);

						actionUtils.compoundUpdate(editor, utils.extend(compoundData, {
							data: cssRule.toString(),
							caret: offset
						}));
					}
				});
			}
		}
	}

	/**
	 * Returns image dimensions for source
	 * @param {IEmmetEditor} editor
	 * @param {String} src Image source (path or data:url)
	 */
	function getImageSizeForSource(editor, src, callback) {
		var fileContent;
		if (src) {
			// check if it is data:url
			if (/^data:/.test(src)) {
				fileContent = base64.decode( src.replace(/^data\:.+?;.+?,/, '') );
				return callback(actionUtils.getImageSize(fileContent));
			}

			var filePath = editor.getFilePath();
			file.locateFile(filePath, src, function(absPath) {
				if (absPath === null) {
					throw "Can't find " + src + ' file';
				}

				file.read(absPath, function(err, content) {
					if (err) {
						throw 'Unable to read ' + absPath + ': ' + err;
					}

					content = String(content);
					callback(actionUtils.getImageSize(content));
				});
			});
		}
	}

	return {
		updateImageSizeAction: function(editor) {
			// this action will definitely won’t work in SASS dialect,
			// but may work in SCSS or LESS
			if (actionUtils.isSupportedCSS(editor.getSyntax())) {
				updateImageSizeCSS(editor);
			} else {
				updateImageSizeHTML(editor);
			}

			return true;
		}
	};
});
},{"../editTree/css":"editTree\\css.js","../editTree/xml":"editTree\\xml.js","../plugin/file":"plugin\\file.js","../utils/action":"utils\\action.js","../utils/base64":"utils\\base64.js","../utils/common":"utils\\common.js","../utils/editor":"utils\\editor.js"}],"action\\updateTag.js":[function(require,module,exports){
/**
 * Update Tag action: allows users to update existing HTML tags and add/remove
 * attributes or even tag name
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var xmlEditTree = require('../editTree/xml');
	var editorUtils = require('../utils/editor');
	var actionUtils = require('../utils/action');
	var utils = require('../utils/common');
	var parser = require('../parser/abbreviation');

	function updateAttributes(tag, abbrNode, ix) {
		var classNames = (abbrNode.attribute('class') || '').split(/\s+/g);
		if (ix) {
			classNames.push('+' + abbrNode.name());
		}

		var r = function(str) {
			return utils.replaceCounter(str, abbrNode.counter);
		};

		// update class
		classNames.forEach(function(className) {
			if (!className) {
				return;
			}

			className = r(className);
			var ch = className.charAt(0);
			if (ch == '+') {
				tag.addClass(className.substr(1));
			} else if (ch == '-') {
				tag.removeClass(className.substr(1));
			} else {
				tag.value('class', className);
			}
		});

		// update attributes
		abbrNode.attributeList().forEach(function(attr) {
			if (attr.name.toLowerCase() == 'class') {
				return;
			}

			var ch = attr.name.charAt(0);
			if (ch == '+') {
				var attrName = attr.name.substr(1);
				var tagAttr = tag.get(attrName);
				if (tagAttr) {
					tagAttr.value(tagAttr.value() + r(attr.value));
				} else {
					tag.value(attrName, r(attr.value));
				}
			} else if (ch == '-') {
				tag.remove(attr.name.substr(1));
			} else {
				tag.value(attr.name, r(attr.value));
			}
		});
	}
	
	return {
		/**
		 * Matches HTML tag under caret and updates its definition
		 * according to given abbreviation
		 * @param {IEmmetEditor} Editor instance
		 * @param {String} abbr Abbreviation to update with
		 */
		updateTagAction: function(editor, abbr) {
			abbr = abbr || editor.prompt("Enter abbreviation");

			if (!abbr) {
				return false;
			}

			var content = editor.getContent();
			var ctx = actionUtils.captureContext(editor);
			var tag = this.getUpdatedTag(abbr, ctx, content);

			if (!tag) {
				// nothing to update
				return false;
			}

			// check if tag name was updated
			if (tag.name() != ctx.name && ctx.match.close) {
				editor.replaceContent('</' + tag.name() + '>', ctx.match.close.range.start, ctx.match.close.range.end, true);
			}

			editor.replaceContent(tag.source, ctx.match.open.range.start, ctx.match.open.range.end, true);
			return true;
		},

		/**
		 * Returns XMLEditContainer node with updated tag structure
		 * of existing tag context.
		 * This data can be used to modify existing tag
		 * @param  {String} abbr    Abbreviation
		 * @param  {Object} ctx     Tag to be updated (captured with `htmlMatcher`)
		 * @param  {String} content Original editor content
		 * @return {XMLEditContainer}
		 */
		getUpdatedTag: function(abbr, ctx, content, options) {
			if (!ctx) {
				// nothing to update
				return null;
			}

			var tree = parser.parse(abbr, options || {});

			// for this action some characters in abbreviation has special
			// meaning. For example, `.-c2` means “remove `c2` class from
			// element” and `.+c3` means “append class `c3` to exising one.
			// 
			// But `.+c3` abbreviation will actually produce two elements:
			// <div class=""> and <c3>. Thus, we have to walk on each element
			// of parsed tree and use their definitions to update current element
			var tag = xmlEditTree.parse(ctx.match.open.range.substring(content), {
				offset: ctx.match.outerRange.start
			});

			tree.children.forEach(function(node, i) {
				updateAttributes(tag, node, i);
			});

			// if tag name was resolved by implicit tag name resolver,
			// then user omitted it in abbreviation and wants to keep
			// original tag name
			var el = tree.children[0];
			if (!el.data('nameResolved')) {
				tag.name(el.name());
			}

			return tag;
		}
	};
});
},{"../editTree/xml":"editTree\\xml.js","../parser/abbreviation":"parser\\abbreviation.js","../utils/action":"utils\\action.js","../utils/common":"utils\\common.js","../utils/editor":"utils\\editor.js"}],"action\\wrapWithAbbreviation.js":[function(require,module,exports){
/**
 * Action that wraps content with abbreviation. For convenience, action is 
 * defined as reusable module
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var range = require('../assets/range');
	var htmlMatcher = require('../assets/htmlMatcher');
	var utils = require('../utils/common');
	var editorUtils = require('../utils/editor');
	var actionUtils = require('../utils/action');
	var parser = require('../parser/abbreviation');
	
	return {
		/**
		 * Wraps content with abbreviation
		 * @param {IEmmetEditor} Editor instance
		 * @param {String} abbr Abbreviation to wrap with
		 * @param {String} syntax Syntax type (html, css, etc.)
		 * @param {String} profile Output profile name (html, xml, xhtml)
		 */
		wrapWithAbbreviationAction: function(editor, abbr, syntax, profile) {
			var info = editorUtils.outputInfo(editor, syntax, profile);
			abbr = abbr || editor.prompt("Enter abbreviation");
			
			if (!abbr) {
				return null;
			}
			
			abbr = String(abbr);
			
			var r = range(editor.getSelectionRange());
			
			if (!r.length()) {
				// no selection, find tag pair
				var match = htmlMatcher.tag(info.content, r.start);
				if (!match) {  // nothing to wrap
					return false;
				}
				
				r = utils.narrowToNonSpace(info.content, match.range);
			}
			
			var newContent = utils.escapeText(r.substring(info.content));
			var result = parser.expand(abbr, {
				pastedContent: editorUtils.unindent(editor, newContent),
				syntax: info.syntax,
				profile: info.profile,
				contextNode: actionUtils.captureContext(editor)
			});
			
			if (result) {
				editor.replaceContent(result, r.start, r.end);
				return true;
			}
			
			return false;
		}
	};
});
},{"../assets/htmlMatcher":"assets\\htmlMatcher.js","../assets/range":"assets\\range.js","../parser/abbreviation":"parser\\abbreviation.js","../utils/action":"utils\\action.js","../utils/common":"utils\\common.js","../utils/editor":"utils\\editor.js"}],"assets\\caniuse.js":[function(require,module,exports){
/**
 * Parsed resources (snippets, abbreviations, variables, etc.) for Emmet.
 * Contains convenient method to get access for snippets with respect of
 * inheritance. Also provides ability to store data in different vocabularies
 * ('system' and 'user') for fast and safe resource update
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var prefs = require('./preferences');
	var utils = require('../utils/common');

	prefs.define('caniuse.enabled', true, 'Enable support of Can I Use database. When enabled,\
		CSS abbreviation resolver will look at Can I Use database first before detecting\
		CSS properties that should be resolved');

	prefs.define('caniuse.vendors', 'all', 'A comma-separated list vendor identifiers\
		(as described in Can I Use database) that should be supported\
		when resolving vendor-prefixed properties. Set value to <code>all</code>\
		to support all available properties');

	prefs.define('caniuse.era', 'e-2', 'Browser era, as defined in Can I Use database.\
		Examples: <code>e0</code> (current version), <code>e1</code> (near future)\
		<code>e-2</code> (2 versions back) and so on.');

	var cssSections = {
		'border-image': ['border-image'],
		'css-boxshadow': ['box-shadow'],
		'css3-boxsizing': ['box-sizing'],
		'multicolumn': ['column-width', 'column-count', 'columns', 'column-gap', 'column-rule-color', 'column-rule-style', 'column-rule-width', 'column-rule', 'column-span', 'column-fill'],
		'border-radius': ['border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
		'transforms2d': ['transform'],
		'css-hyphens': ['hyphens'],
		'css-transitions': ['transition', 'transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay'],
		'font-feature': ['font-feature-settings'],
		'css-animation': ['animation', 'animation-name', 'animation-duration', 'animation-timing-function', 'animation-iteration-count', 'animation-direction', 'animation-play-state', 'animation-delay', 'animation-fill-mode', '@keyframes'],
		'css-gradients': ['linear-gradient'],
		'css-masks': ['mask-image', 'mask-source-type', 'mask-repeat', 'mask-position', 'mask-clip', 'mask-origin', 'mask-size', 'mask', 'mask-type', 'mask-box-image-source', 'mask-box-image-slice', 'mask-box-image-width', 'mask-box-image-outset', 'mask-box-image-repeat', 'mask-box-image', 'clip-path', 'clip-rule'],
		'css-featurequeries': ['@supports'],
		'flexbox': ['flex', 'inline-flex', 'flex-direction', 'flex-wrap', 'flex-flow', 'order', 'flex'],
		'calc': ['calc'],
		'object-fit': ['object-fit', 'object-position'],
		'css-grid': ['grid', 'inline-grid', 'grid-template-rows', 'grid-template-columns', 'grid-template-areas', 'grid-template', 'grid-auto-rows', 'grid-auto-columns', ' grid-auto-flow', 'grid-auto-position', 'grid', ' grid-row-start', 'grid-column-start', 'grid-row-end', 'grid-column-end', 'grid-column', 'grid-row', 'grid-area', 'justify-self', 'justify-items', 'align-self', 'align-items'],
		'css-repeating-gradients': ['repeating-linear-gradient'],
		'css-filters': ['filter'],
		'user-select-none': ['user-select'],
		'intrinsic-width': ['min-content', 'max-content', 'fit-content', 'fill-available'],
		'css3-tabsize': ['tab-size']
	};

	/** @type {Object} The Can I Use database for CSS */
	var cssDB = null;
	/** @type {Object} A list of available vendors (browsers) and their prefixes */
	var vendorsDB = null;
	var erasDB = null;

	function intersection(arr1, arr2) {
		var result = [];
		var smaller = arr1, larger = arr2;
		if (smaller.length > larger.length) {
			smaller = arr2;
			larger = arr1;
		}
		larger.forEach(function(item) {
			if (~smaller.indexOf(item)) {
				result.push(item);
			}
		});
		return result;
	}

	/**
	 * Parses raw Can I Use database for better lookups
	 * @param  {String} data Raw database
	 * @param  {Boolean} optimized Pass `true` if given `data` is already optimized
	 * @return {Object}
	 */
	function parseDB(data, optimized) {
		if (typeof data == 'string') {
			data = JSON.parse(data);
		}

		if (!optimized) {
			data = optimize(data);
		}

		vendorsDB = data.vendors;
		cssDB = data.css;
		erasDB = data.era;
	}

	/**
	 * Extract required data only from CIU database
	 * @param  {Object} data Raw Can I Use database
	 * @return {Object}      Optimized database
	 */
	function optimize(data) {
		if (typeof data == 'string') {
			data = JSON.parse(data);
		}

		return {
			vendors: parseVendors(data),
			css: parseCSS(data),
			era: parseEra(data)
		};
	}

	/**
	 * Parses vendor data
	 * @param  {Object} data
	 * @return {Object}
	 */
	function parseVendors(data) {
		var out = {};
		Object.keys(data.agents).forEach(function(name) {
			var agent = data.agents[name];
			out[name] = {
				prefix: agent.prefix,
				versions: agent.versions
			};
		});
		return out;
	}

	/**
	 * Parses CSS data from Can I Use raw database
	 * @param  {Object} data
	 * @return {Object}
	 */
	function parseCSS(data) {
		var out = {};
		var cssCategories = data.cats.CSS;
		Object.keys(data.data).forEach(function(name) {
			var section = data.data[name];
			if (name in cssSections) {
				cssSections[name].forEach(function(kw) {
					out[kw] = section.stats;
				});
			}
		});

		return out;
	}

	/**
	 * Parses era data from Can I Use raw database
	 * @param  {Object} data
	 * @return {Array}
	 */
	function parseEra(data) {
		// some runtimes (like Mozilla Rhino) does not preserves
		// key order so we have to sort values manually
		return Object.keys(data.eras).sort(function(a, b) {
			return parseInt(a.substr(1)) - parseInt(b.substr(1));
		});
	}

	/**
	 * Returs list of supported vendors, depending on user preferences
	 * @return {Array}
	 */
	function getVendorsList() {
		var allVendors = Object.keys(vendorsDB);
		var vendors = prefs.getArray('caniuse.vendors');
		if (!vendors || vendors[0] == 'all') {
			return allVendors;
		}

		return intersection(allVendors, vendors);
	}

	/**
	 * Returns size of version slice as defined by era identifier
	 * @return {Number}
	 */
	function getVersionSlice() {
		var era = prefs.get('caniuse.era');
		var ix = erasDB.indexOf(era);
		if (!~ix) {
			ix = erasDB.indexOf('e-2');
		}

		return ix;
	}

	// try to load caniuse database
	// hide it from Require.JS parser
	var db = null;
	(function(r) {
		if (typeof define === 'undefined' || !define.amd) {
			try {
				db = r('caniuse-db/data.json');
			} catch(e) {}
		}
	})(require);

	if (db) {
		parseDB(db);
	}

	return {
		load: parseDB,
		optimize: optimize,

		/**
		 * Resolves prefixes for given property
		 * @param {String} property A property to resolve. It can start with `@` symbol
		 * (CSS section, like `@keyframes`) or `:` (CSS value, like `flex`)
		 * @return {Array} Array of resolved prefixes or <code>null</code>
		 * if prefixes can't be resolved. Empty array means property has no vendor
		 * prefixes
		 */
		resolvePrefixes: function(property) {
			if (!prefs.get('caniuse.enabled') || !cssDB || !(property in cssDB)) {
				return null;
			}

			var prefixes = [];
			var propStats = cssDB[property];
			var versions = getVersionSlice();

			getVendorsList().forEach(function(vendor) {
				var vendorVesions = vendorsDB[vendor].versions.slice(versions);
				for (var i = 0, v; i < vendorVesions.length; i++) {
					v = vendorVesions[i];
					if (!v) {
						continue;
					}

					if (~propStats[vendor][v].indexOf('x')) {
						prefixes.push(vendorsDB[vendor].prefix);
						break;
					}
				}
			});

			return utils.unique(prefixes).sort(function(a, b) {
				return b.length - a.length;
			});
		}
	};
});

},{"../utils/common":"utils\\common.js","./preferences":"assets\\preferences.js"}],"assets\\elements.js":[function(require,module,exports){
/**
 * Module that contains factories for element types used by Emmet
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var factories = {};
	var reAttrs = /([@\!]?)([\w\-:]+)\s*=\s*(['"])(.*?)\3/g;

	// register resource references
	function commonFactory(value) {
		return {data: value};
	}

	module = module || {};
	module.exports = {
		/**
		 * Create new element factory
		 * @param {String} name Element identifier
		 * @param {Function} factory Function that produces element of specified 
		 * type. The object generated by this factory is automatically 
		 * augmented with <code>type</code> property pointing to element
		 * <code>name</code>
		 * @memberOf elements
		 */
		add: function(name, factory) {
			var that = this;
			factories[name] = function() {
				var elem = factory.apply(that, arguments);
				if (elem)
					elem.type = name;
				
				return elem;
			};
		},
		
		/**
		 * Returns factory for specified name
		 * @param {String} name
		 * @returns {Function}
		 */
		get: function(name) {
			return factories[name];
		},
		
		/**
		 * Creates new element with specified type
		 * @param {String} name
		 * @returns {Object}
		 */
		create: function(name) {
			var args = [].slice.call(arguments, 1);
			var factory = this.get(name);
			return factory ? factory.apply(this, args) : null;
		},
		
		/**
		 * Check if passed element is of specified type
		 * @param {Object} elem
		 * @param {String} type
		 * @returns {Boolean}
		 */
		is: function(elem, type) {
			return this.type(elem) === type;
		},

		/**
		 * Returns type of element
		 * @param  {Object} elem
		 * @return {String}
		 */
		type: function(elem) {
			return elem && elem.type;
		}
	};
	
	/**
	 * Element factory
	 * @param {String} elementName Name of output element
	 * @param {String} attrs Attributes definition. You may also pass
	 * <code>Array</code> where each contains object with <code>name</code> 
	 * and <code>value</code> properties, or <code>Object</code>
	 * @param {Boolean} isEmpty Is expanded element should be empty
	 */
	module.exports.add('element', function(elementName, attrs, isEmpty) {
		var ret = {
			name: elementName,
			is_empty: !!isEmpty
		};

		if (attrs) {
			ret.attributes = [];
			if (Array.isArray(attrs)) {
				ret.attributes = attrs;
			} else if (typeof attrs === 'string') {
				var m;
				while ((m = reAttrs.exec(attrs))) {
					ret.attributes.push({
						name: m[2],
						value: m[4],
						isDefault: m[1] == '@',
						isImplied: m[1] == '!'
					});
				}
			} else {
				ret.attributes = Object.keys(attrs).map(function(name) {
					return {
						name: name, 
						value: attrs[name]
					};
				});
			}
		}
		
		return ret;
	});
	
	module.exports.add('snippet', commonFactory);
	module.exports.add('reference', commonFactory);
	module.exports.add('empty', function() {
		return {};
	});
	
	return module.exports;
});
},{}],"assets\\handlerList.js":[function(require,module,exports){
/**
 * Utility module that provides ordered storage of function handlers. 
 * Many Emmet modules' functionality can be extended/overridden by custom
 * function. This modules provides unified storage of handler functions, their 
 * management and execution
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	
	/**
	 * @type HandlerList
	 * @constructor
	 */
	function HandlerList() {
		this._list = [];
	}
	
	HandlerList.prototype = {
		/**
		 * Adds function handler
		 * @param {Function} fn Handler
		 * @param {Object} options Handler options. Possible values are:<br><br>
		 * <b>order</b> : (<code>Number</code>) – order in handler list. Handlers
		 * with higher order value will be executed earlier.
		 */
		add: function(fn, options) {
			// TODO hack for stable sort, remove after fixing `list()`
			var order = this._list.length;
			if (options && 'order' in options) {
				order = options.order * 10000;
			}
			this._list.push(utils.extend({}, options, {order: order, fn: fn}));
		},
		
		/**
		 * Removes handler from list
		 * @param {Function} fn
		 */
		remove: function(fn) {
			var item = utils.find(this._list, function(item) {
				return item.fn === fn;
			});
			if (item) {
				this._list.splice(this._list.indexOf(item), 1);
			}
		},
		
		/**
		 * Returns ordered list of handlers. By default, handlers 
		 * with the same <code>order</code> option returned in reverse order, 
		 * i.e. the latter function was added into the handlers list, the higher 
		 * it will be in the returned array 
		 * @returns {Array}
		 */
		list: function() {
			// TODO make stable sort
			return this._list.sort(function(a, b) {
				return b.order - a.order;
			});
		},
		
		/**
		 * Returns ordered list of handler functions
		 * @returns {Array}
		 */
		listFn: function() {
			return this.list().map(function(item) {
				return item.fn;
			});
		},
		
		/**
		 * Executes handler functions in their designated order. If function
		 * returns <code>skipVal</code>, meaning that function was unable to 
		 * handle passed <code>args</code>, the next function will be executed
		 * and so on.
		 * @param {Object} skipValue If function returns this value, execute 
		 * next handler.
		 * @param {Array} args Arguments to pass to handler function
		 * @returns {Boolean} Whether any of registered handlers performed
		 * successfully  
		 */
		exec: function(skipValue, args) {
			args = args || [];
			var result = null;
			utils.find(this.list(), function(h) {
				result = h.fn.apply(h, args);
				if (result !== skipValue) {
					return true;
				}
			});
			
			return result;
		}
	};
	
	return {
		/**
		 * Factory method that produces <code>HandlerList</code> instance
		 * @returns {HandlerList}
		 * @memberOf handlerList
		 */
		create: function() {
			return new HandlerList();
		}
	};
});
},{"../utils/common":"utils\\common.js"}],"assets\\htmlMatcher.js":[function(require,module,exports){
/**
 * HTML matcher: takes string and searches for HTML tag pairs for given position 
 * 
 * Unlike “classic” matchers, it parses content from the specified 
 * position, not from the start, so it may work even outside HTML documents
 * (for example, inside strings of programming languages like JavaScript, Python 
 * etc.)
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var range = require('./range');

	// Regular Expressions for parsing tags and attributes
	var reOpenTag = /^<([\w\:\-]+)((?:\s+[\w\-:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
	var reCloseTag = /^<\/([\w\:\-]+)[^>]*>/;

	function openTag(i, match) {
		return {
			name: match[1],
			selfClose: !!match[3],
			/** @type Range */
			range: range(i, match[0]),
			type: 'open'
		};
	}
	
	function closeTag(i, match) {
		return {
			name: match[1],
			/** @type Range */
			range: range(i, match[0]),
			type: 'close'
		};
	}
	
	function comment(i, match) {
		return {
			/** @type Range */
			range: range(i, typeof match == 'number' ? match - i : match[0]),
			type: 'comment'
		};
	}
	
	/**
	 * Creates new tag matcher session
	 * @param {String} text
	 */
	function createMatcher(text) {
		var memo = {}, m;
		return {
			/**
			 * Test if given position matches opening tag
			 * @param {Number} i
			 * @returns {Object} Matched tag object
			 */
			open: function(i) {
				var m = this.matches(i);
				return m && m.type == 'open' ? m : null;
			},
			
			/**
			 * Test if given position matches closing tag
			 * @param {Number} i
			 * @returns {Object} Matched tag object
			 */
			close: function(i) {
				var m = this.matches(i);
				return m && m.type == 'close' ? m : null;
			},
			
			/**
			 * Matches either opening or closing tag for given position
			 * @param i
			 * @returns
			 */
			matches: function(i) {
				var key = 'p' + i;
				
				if (!(key in memo)) {
					memo[key] = false;
					if (text.charAt(i) == '<') {
						var substr = text.slice(i);
						if ((m = substr.match(reOpenTag))) {
							memo[key] = openTag(i, m);
						} else if ((m = substr.match(reCloseTag))) {
							memo[key] = closeTag(i, m);
						}
					}
				}
				
				return memo[key];
			},
			
			/**
			 * Returns original text
			 * @returns {String}
			 */
			text: function() {
				return text;
			},

			clean: function() {
				memo = text = m = null;
			}
		};
	}
	
	function matches(text, pos, pattern) {
		return text.substring(pos, pos + pattern.length) == pattern;
	}
	
	/**
	 * Search for closing pair of opening tag
	 * @param {Object} open Open tag instance
	 * @param {Object} matcher Matcher instance
	 */
	function findClosingPair(open, matcher) {
		var stack = [], tag = null;
		var text = matcher.text();
		
		for (var pos = open.range.end, len = text.length; pos < len; pos++) {
			if (matches(text, pos, '<!--')) {
				// skip to end of comment
				for (var j = pos; j < len; j++) {
					if (matches(text, j, '-->')) {
						pos = j + 3;
						break;
					}
				}
			}
			
			if ((tag = matcher.matches(pos))) {
				if (tag.type == 'open' && !tag.selfClose) {
					stack.push(tag.name);
				} else if (tag.type == 'close') {
					if (!stack.length) { // found valid pair?
						return tag.name == open.name ? tag : null;
					}
					
					// check if current closing tag matches previously opened one
					if (stack[stack.length - 1] == tag.name) {
						stack.pop();
					} else {
						var found = false;
						while (stack.length && !found) {
							var last = stack.pop();
							if (last == tag.name) {
								found = true;
							}
						}
						
						if (!stack.length && !found) {
							return tag.name == open.name ? tag : null;
						}
					}
				}

				pos = tag.range.end - 1;
			}
		}
	}
	
	return {
		/**
		 * Main function: search for tag pair in <code>text</code> for given 
		 * position
		 * @memberOf htmlMatcher
		 * @param {String} text 
		 * @param {Number} pos
		 * @returns {Object}
		 */
		find: function(text, pos) {
			var matcher = createMatcher(text); 
			var open = null, close = null;
			var j, jl;
			
			for (var i = pos; i >= 0; i--) {
				if ((open = matcher.open(i))) {
					// found opening tag
					if (open.selfClose) {
						if (open.range.cmp(pos, 'lt', 'gt')) {
							// inside self-closing tag, found match
							break;
						}
						
						// outside self-closing tag, continue
						continue;
					}
					
					close = findClosingPair(open, matcher);
					if (close) {
						// found closing tag.
						var r = range.create2(open.range.start, close.range.end);
						if (r.contains(pos)) {
							break;
						}
					} else if (open.range.contains(pos)) {
						// we inside empty HTML tag like <br>
						break;
					}
					
					open = null;
				} else if (matches(text, i, '-->')) {
					// skip back to comment start
					for (j = i - 1; j >= 0; j--) {
						if (matches(text, j, '-->')) {
							// found another comment end, do nothing
							break;
						} else if (matches(text, j, '<!--')) {
							i = j;
							break;
						}
					}
				} else if (matches(text, i, '<!--')) {
					// we're inside comment, match it
					for (j = i + 4, jl = text.length; j < jl; j++) {
						if (matches(text, j, '-->')) {
							j += 3;
							break;
						}
					}
					
					open = comment(i, j);
					break;
				}
			}
			
			matcher.clean();

			if (open) {
				var outerRange = null;
				var innerRange = null;
				
				if (close) {
					outerRange = range.create2(open.range.start, close.range.end);
					innerRange = range.create2(open.range.end, close.range.start);
				} else {
					outerRange = innerRange = range.create2(open.range.start, open.range.end);
				}
				
				if (open.type == 'comment') {
					// adjust positions of inner range for comment
					var _c = outerRange.substring(text);
					innerRange.start += _c.length - _c.replace(/^<\!--\s*/, '').length;
					innerRange.end -= _c.length - _c.replace(/\s*-->$/, '').length;
				}
				
				return {
					open: open,
					close: close,
					type: open.type == 'comment' ? 'comment' : 'tag',
					innerRange: innerRange,
					innerContent: function() {
						return this.innerRange.substring(text);
					},
					outerRange: outerRange,
					outerContent: function() {
						return this.outerRange.substring(text);
					},
					range: !innerRange.length() || !innerRange.cmp(pos, 'lte', 'gte') ? outerRange : innerRange,
					content: function() {
						return this.range.substring(text);
					},
					source: text
				};
			}
		},
		
		/**
		 * The same as <code>find()</code> method, but restricts matched result 
		 * to <code>tag</code> type
		 * @param {String} text 
		 * @param {Number} pos
		 * @returns {Object}
		 */
		tag: function(text, pos) {
			var result = this.find(text, pos);
			if (result && result.type == 'tag') {
				return result;
			}
		}
	};
});
},{"./range":"assets\\range.js"}],"assets\\logger.js":[function(require,module,exports){
/**
 * Simple logger for Emmet
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	return {
		log: function() {
			if (typeof console != 'undefined' && console.log) {
				console.log.apply(console, arguments);
			}
		}
	}
})
},{}],"assets\\preferences.js":[function(require,module,exports){
/**
 * Common module's preferences storage. This module 
 * provides general storage for all module preferences, their description and
 * default values.<br><br>
 * 
 * This module can also be used to list all available properties to create 
 * UI for updating properties
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');

	var preferences = {};
	var defaults = {};
	var _dbgDefaults = null;
	var _dbgPreferences = null;

	function toBoolean(val) {
		if (typeof val === 'string') {
			val = val.toLowerCase();
			return val == 'yes' || val == 'true' || val == '1';
		}

		return !!val;
	}
	
	function isValueObj(obj) {
		return typeof obj === 'object'
			&& !Array.isArray(obj) 
			&& 'value' in obj 
			&& Object.keys(obj).length < 3;
	}
	
	return {
		/**
		 * Creates new preference item with default value
		 * @param {String} name Preference name. You can also pass object
		 * with many options
		 * @param {Object} value Preference default value
		 * @param {String} description Item textual description
		 * @memberOf preferences
		 */
		define: function(name, value, description) {
			var prefs = name;
			if (typeof name === 'string') {
				prefs = {};
				prefs[name] = {
					value: value,
					description: description
				};
			}
			
			Object.keys(prefs).forEach(function(k) {
				var v = prefs[k];
				defaults[k] = isValueObj(v) ? v : {value: v};
			});
		},
		
		/**
		 * Updates preference item value. Preference value should be defined
		 * first with <code>define</code> method.
		 * @param {String} name Preference name. You can also pass object
		 * with many options
		 * @param {Object} value Preference default value
		 * @memberOf preferences
		 */
		set: function(name, value) {
			var prefs = name;
			if (typeof name === 'string') {
				prefs = {};
				prefs[name] = value;
			}
			
			Object.keys(prefs).forEach(function(k) {
				var v = prefs[k];
				if (!(k in defaults)) {
					throw new Error('Property "' + k + '" is not defined. You should define it first with `define` method of current module');
				}
				
				// do not set value if it equals to default value
				if (v !== defaults[k].value) {
					// make sure we have value of correct type
					switch (typeof defaults[k].value) {
						case 'boolean':
							v = toBoolean(v);
							break;
						case 'number':
							v = parseInt(v + '', 10) || 0;
							break;
						default: // convert to string
							if (v !== null) {
								v += '';
							}
					}

					preferences[k] = v;
				} else if (k in preferences) {
					delete preferences[k];
				}
			});
		},
		
		/**
		 * Returns preference value
		 * @param {String} name
		 * @returns {String} Returns <code>undefined</code> if preference is 
		 * not defined
		 */
		get: function(name) {
			if (name in preferences) {
				return preferences[name];
			}
			
			if (name in defaults) {
				return defaults[name].value;
			}
			
			return void 0;
		},
		
		/**
		 * Returns comma-separated preference value as array of values
		 * @param {String} name
		 * @returns {Array} Returns <code>undefined</code> if preference is 
		 * not defined, <code>null</code> if string cannot be converted to array
		 */
		getArray: function(name) {
			var val = this.get(name);
			if (typeof val === 'undefined' || val === null || val === '')  {
				return null;
			}

			val = val.split(',').map(utils.trim);
			if (!val.length) {
				return null;
			}
			
			return val;
		},
		
		/**
		 * Returns comma and colon-separated preference value as dictionary
		 * @param {String} name
		 * @returns {Object}
		 */
		getDict: function(name) {
			var result = {};
			this.getArray(name).forEach(function(val) {
				var parts = val.split(':');
				result[parts[0]] = parts[1];
			});
			
			return result;
		},
		
		/**
		 * Returns description of preference item
		 * @param {String} name Preference name
		 * @returns {Object}
		 */
		description: function(name) {
			return name in defaults ? defaults[name].description : void 0;
		},
		
		/**
		 * Completely removes specified preference(s)
		 * @param {String} name Preference name (or array of names)
		 */
		remove: function(name) {
			if (!Array.isArray(name)) {
				name = [name];
			}
			
			name.forEach(function(key) {
				if (key in preferences) {
					delete preferences[key];
				}
				
				if (key in defaults) {
					delete defaults[key];
				}
			});
		},
		
		/**
		 * Returns sorted list of all available properties
		 * @returns {Array}
		 */
		list: function() {
			return Object.keys(defaults).sort().map(function(key) {
				return {
					name: key,
					value: this.get(key),
					type: typeof defaults[key].value,
					description: defaults[key].description
				};
			}, this);
		},
		
		/**
		 * Loads user-defined preferences from JSON
		 * @param {Object} json
		 * @returns
		 */
		load: function(json) {
			Object.keys(json).forEach(function(key) {
				this.set(key, json[key]);
			}, this);
		},

		/**
		 * Returns hash of user-modified preferences
		 * @returns {Object}
		 */
		exportModified: function() {
			return utils.extend({}, preferences);
		},
		
		/**
		 * Reset to defaults
		 * @returns
		 */
		reset: function() {
			preferences = {};
		},
		
		/**
		 * For unit testing: use empty storage
		 */
		_startTest: function() {
			_dbgDefaults = defaults;
			_dbgPreferences = preferences;
			defaults = {};
			preferences = {};
		},
		
		/**
		 * For unit testing: restore original storage
		 */
		_stopTest: function() {
			defaults = _dbgDefaults;
			preferences = _dbgPreferences;
		}
	};
});
},{"../utils/common":"utils\\common.js"}],"assets\\profile.js":[function(require,module,exports){
/**
 * Output profile module.
 * Profile defines how XHTML output data should look like
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var resources = require('./resources');
	var prefs = require('./preferences');

	prefs.define('profile.allowCompactBoolean', true, 
		'This option can be used to globally disable compact form of boolean ' + 
		'attribues (attributes where name and value are equal). With compact' +
		'form enabled, HTML tags can be outputted as <code>&lt;div contenteditable&gt;</code> ' +
		'instead of <code>&lt;div contenteditable="contenteditable"&gt;</code>');

	prefs.define('profile.booleanAttributes', '^contenteditable|seamless|async|autofocus|autoplay|checked|controls|defer|disabled|formnovalidate|hidden|ismap|loop|multiple|muted|novalidate|readonly|required|reversed|selected|typemustmatch$', 
		'A regular expression for attributes that should be boolean by default.' + 
		'If attribute name matches this expression, you don’t have to write dot ' +
		'after attribute name in Emmet abbreviation to mark it as boolean.');

	var profiles = {};
	
	var defaultProfile = {
		tag_case: 'asis',
		attr_case: 'asis',
		attr_quotes: 'double',
		
		// Each tag on new line
		tag_nl: 'decide',
		
		// With tag_nl === true, defines if leaf node (e.g. node with no children)
		// should have formatted line breaks
		tag_nl_leaf: false,
		
		place_cursor: true,
		
		// Indent tags
		indent: true,
		
		// How many inline elements should be to force line break 
		// (set to 0 to disable)
		inline_break: 3,

		// Produce compact notation of boolean attribues:
		// attributes where name and value are equal.
		// With this option enabled, HTML filter will
		// produce <div contenteditable> instead of <div contenteditable="contenteditable">
		compact_bool: false,
		
		// Use self-closing style for writing empty elements, e.g. <br /> or <br>
		self_closing_tag: 'xhtml',
		
		// Profile-level output filters, re-defines syntax filters 
		filters: '',
		
		// Additional filters applied to abbreviation.
		// Unlike "filters", this preference doesn't override default filters
		// but add the instead every time given profile is chosen
		extraFilters: ''
	};
	
	/**
	 * @constructor
	 * @type OutputProfile
	 * @param {Object} options
	 */
	function OutputProfile(options) {
		utils.extend(this, defaultProfile, options);
	}
	
	OutputProfile.prototype = {
		/**
		 * Transforms tag name case depending on current profile settings
		 * @param {String} name String to transform
		 * @returns {String}
		 */
		tagName: function(name) {
			return stringCase(name, this.tag_case);
		},
		
		/**
		 * Transforms attribute name case depending on current profile settings 
		 * @param {String} name String to transform
		 * @returns {String}
		 */
		attributeName: function(name) {
			return stringCase(name, this.attr_case);
		},
		
		/**
		 * Returns quote character for current profile
		 * @returns {String}
		 */
		attributeQuote: function() {
			return this.attr_quotes == 'single' ? "'" : '"';
		},

		/**
		 * Returns self-closing tag symbol for current profile
		 * @returns {String}
		 */
		selfClosing: function() {
			if (this.self_closing_tag == 'xhtml')
				return ' /';
			
			if (this.self_closing_tag === true)
				return '/';
			
			return '';
		},
		
		/**
		 * Returns cursor token based on current profile settings
		 * @returns {String}
		 */
		cursor: function() {
			return this.place_cursor ? utils.getCaretPlaceholder() : '';
		},

		/**
		 * Check if attribute with given name is boolean,
		 * e.g. written as `contenteditable` instead of 
		 * `contenteditable="contenteditable"`
		 * @param  {String}  name Attribute name
		 * @return {Boolean}
		 */
		isBoolean: function(name, value) {
			if (name == value) {
				return true;
			}

			var boolAttrs = prefs.get('profile.booleanAttributes');
			if (!value && boolAttrs) {
				boolAttrs = new RegExp(boolAttrs, 'i');
				return boolAttrs.test(name);
			}

			return false;
		},

		/**
		 * Check if compact boolean attribute record is 
		 * allowed for current profile
		 * @return {Boolean}
		 */
		allowCompactBoolean: function() {
			return this.compact_bool && prefs.get('profile.allowCompactBoolean');
		}
	};
	
	/**
	 * Helper function that converts string case depending on 
	 * <code>caseValue</code> 
	 * @param {String} str String to transform
	 * @param {String} caseValue Case value: can be <i>lower</i>, 
	 * <i>upper</i> and <i>leave</i>
	 * @returns {String}
	 */
	function stringCase(str, caseValue) {
		switch (String(caseValue || '').toLowerCase()) {
			case 'lower':
				return str.toLowerCase();
			case 'upper':
				return str.toUpperCase();
		}
		
		return str;
	}
	
	/**
	 * Creates new output profile
	 * @param {String} name Profile name
	 * @param {Object} options Profile options
	 */
	function createProfile(name, options) {
		return profiles[name.toLowerCase()] = new OutputProfile(options);
	}
	
	function createDefaultProfiles() {
		createProfile('xhtml');
		createProfile('html', {self_closing_tag: false, compact_bool: true});
		createProfile('xml', {self_closing_tag: true, tag_nl: true});
		createProfile('plain', {tag_nl: false, indent: false, place_cursor: false});
		createProfile('line', {tag_nl: false, indent: false, extraFilters: 's'});
		createProfile('css', {tag_nl: true});
		createProfile('css_line', {tag_nl: false});
	}
	
	createDefaultProfiles();
	
	return  {
		/**
		 * Creates new output profile and adds it into internal dictionary
		 * @param {String} name Profile name
		 * @param {Object} options Profile options
		 * @memberOf emmet.profile
		 * @returns {Object} New profile
		 */
		create: function(name, options) {
			if (arguments.length == 2)
				return createProfile(name, options);
			else
				// create profile object only
				return new OutputProfile(utils.defaults(name || {}, defaultProfile));
		},
		
		/**
		 * Returns profile by its name. If profile wasn't found, returns
		 * 'plain' profile
		 * @param {String} name Profile name. Might be profile itself
		 * @param {String} syntax. Optional. Current editor syntax. If defined,
		 * profile is searched in resources first, then in predefined profiles
		 * @returns {Object}
		 */
		get: function(name, syntax) {
			if (!name && syntax) {
				// search in user resources first
				var profile = resources.findItem(syntax, 'profile');
				if (profile) {
					name = profile;
				}
			}
			
			if (!name) {
				return profiles.plain;
			}
			
			if (name instanceof OutputProfile) {
				return name;
			}
			
			if (typeof name === 'string' && name.toLowerCase() in profiles) {
				return profiles[name.toLowerCase()];
			}
			
			return this.create(name);
		},
		
		/**
		 * Deletes profile with specified name
		 * @param {String} name Profile name
		 */
		remove: function(name) {
			name = (name || '').toLowerCase();
			if (name in profiles)
				delete profiles[name];
		},
		
		/**
		 * Resets all user-defined profiles
		 */
		reset: function() {
			profiles = {};
			createDefaultProfiles();
		},
		
		/**
		 * Helper function that converts string case depending on 
		 * <code>caseValue</code> 
		 * @param {String} str String to transform
		 * @param {String} caseValue Case value: can be <i>lower</i>, 
		 * <i>upper</i> and <i>leave</i>
		 * @returns {String}
		 */
		stringCase: stringCase
	};
});

},{"../utils/common":"utils\\common.js","./preferences":"assets\\preferences.js","./resources":"assets\\resources.js"}],"assets\\range.js":[function(require,module,exports){
/**
 * Helper module to work with ranges
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	function cmp(a, b, op) {
		switch (op) {
			case 'eq':
			case '==':
				return a === b;
			case 'lt':
			case '<':
				return a < b;
			case 'lte':
			case '<=':
				return a <= b;
			case 'gt':
			case '>':
				return a > b;
			case 'gte':
			case '>=':
				return a >= b;
		}
	}
	
	
	/**
	 * @type Range
	 * @constructor
	 * @param {Object} start
	 * @param {Number} len
	 */
	function Range(start, len) {
		if (typeof start === 'object' && 'start' in start) {
			// create range from object stub
			this.start = Math.min(start.start, start.end);
			this.end = Math.max(start.start, start.end);
		} else if (Array.isArray(start)) {
			this.start = start[0];
			this.end = start[1];
		} else {
			len = typeof len === 'string' ? len.length : +len;
			this.start = start;
			this.end = start + len;
		}
	}
	
	Range.prototype = {
		length: function() {
			return Math.abs(this.end - this.start);
		},
		
		/**
		 * Returns <code>true</code> if passed range is equals to current one
		 * @param {Range} range
		 * @returns {Boolean}
		 */
		equal: function(range) {
			return this.cmp(range, 'eq', 'eq');
//			return this.start === range.start && this.end === range.end;
		},
		
		/**
		 * Shifts indexes position with passed <code>delta</code>
		 * @param {Number} delta
		 * @returns {Range} range itself
		 */
		shift: function(delta) {
			this.start += delta;
			this.end += delta;
			return this;
		},
		
		/**
		 * Check if two ranges are overlapped
		 * @param {Range} range
		 * @returns {Boolean}
		 */
		overlap: function(range) {
			return range.start <= this.end && range.end >= this.start;
		},
		
		/**
		 * Finds intersection of two ranges
		 * @param {Range} range
		 * @returns {Range} <code>null</code> if ranges does not overlap
		 */
		intersection: function(range) {
			if (this.overlap(range)) {
				var start = Math.max(range.start, this.start);
				var end = Math.min(range.end, this.end);
				return new Range(start, end - start);
			}
			
			return null;
		},
		
		/**
		 * Returns the union of the thow ranges.
		 * @param {Range} range
		 * @returns {Range} <code>null</code> if ranges are not overlapped
		 */
		union: function(range) {
			if (this.overlap(range)) {
				var start = Math.min(range.start, this.start);
				var end = Math.max(range.end, this.end);
				return new Range(start, end - start);
			}
			
			return null;
		},
		
		/**
		 * Returns a Boolean value that indicates whether a specified position 
		 * is in a given range.
		 * @param {Number} loc
		 */
		inside: function(loc) {
			return this.cmp(loc, 'lte', 'gt');
//			return this.start <= loc && this.end > loc;
		},
		
		/**
		 * Returns a Boolean value that indicates whether a specified position 
		 * is in a given range, but not equals bounds.
		 * @param {Number} loc
		 */
		contains: function(loc) {
			return this.cmp(loc, 'lt', 'gt');
		},
		
		/**
		 * Check if current range completely includes specified one
		 * @param {Range} r
		 * @returns {Boolean} 
		 */
		include: function(r) {
			return this.cmp(r, 'lte', 'gte');
//			return this.start <= r.start && this.end >= r.end;
		},
		
		/**
		 * Low-level comparision method
		 * @param {Number} loc
		 * @param {String} left Left comparison operator
		 * @param {String} right Right comaprison operator
		 */
		cmp: function(loc, left, right) {
			var a, b;
			if (loc instanceof Range) {
				a = loc.start;
				b = loc.end;
			} else {
				a = b = loc;
			}
			
			return cmp(this.start, a, left || '<=') && cmp(this.end, b, right || '>');
		},
		
		/**
		 * Returns substring of specified <code>str</code> for current range
		 * @param {String} str
		 * @returns {String}
		 */
		substring: function(str) {
			return this.length() > 0 
				? str.substring(this.start, this.end) 
				: '';
		},
		
		/**
		 * Creates copy of current range
		 * @returns {Range}
		 */
		clone: function() {
			return new Range(this.start, this.length());
		},
		
		/**
		 * @returns {Array}
		 */
		toArray: function() {
			return [this.start, this.end];
		},
		
		toString: function() {
			return this.valueOf();
		},

		valueOf: function() {
			return '{' + this.start + ', ' + this.length() + '}';
		}
	};

	/**
	 * Creates new range object instance
	 * @param {Object} start Range start or array with 'start' and 'end'
	 * as two first indexes or object with 'start' and 'end' properties
	 * @param {Number} len Range length or string to produce range from
	 * @returns {Range}
	 */
	module.exports = function(start, len) {
		if (typeof start == 'undefined' || start === null)
			return null;
			
		if (start instanceof Range)
			return start;
		
		if (typeof start == 'object' && 'start' in start && 'end' in start) {
			len = start.end - start.start;
			start = start.start;
		}
			
		return new Range(start, len);
	};

	module.exports.create = module.exports;

	module.exports.isRange = function(val) {
		return val instanceof Range;
	};

	/**
	 * <code>Range</code> object factory, the same as <code>this.create()</code>
	 * but last argument represents end of range, not length
	 * @returns {Range}
	 */
	module.exports.create2 = function(start, end) {
		if (typeof start === 'number' && typeof end === 'number') {
			end -= start;
		}
		
		return this.create(start, end);
	};

	/**
	 * Helper function that sorts ranges in order as they
	 * appear in text
	 * @param  {Array} ranges
	 * @return {Array}
	 */
	module.exports.sort = function(ranges, reverse) {
		ranges = ranges.sort(function(a, b) {
			if (a.start === b.start) {
				return b.end - a.end;
			}

			return a.start - b.start;
		});

		reverse && ranges.reverse();
		return ranges;
	};

	return module.exports;
});
},{}],"assets\\resources.js":[function(require,module,exports){
/**
 * Parsed resources (snippets, abbreviations, variables, etc.) for Emmet.
 * Contains convenient method to get access for snippets with respect of
 * inheritance. Also provides ability to store data in different vocabularies
 * ('system' and 'user') for fast and safe resource update
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var handlerList = require('./handlerList');
	var utils = require('../utils/common');
	var elements = require('./elements');
	var logger = require('../assets/logger');
	var stringScore = require('../vendor/stringScore');
	var cssResolver = require('../resolver/css');

	var VOC_SYSTEM = 'system';
	var VOC_USER = 'user';

	var cache = {};

	/** Regular expression for XML tag matching */
	var reTag = /^<(\w+\:?[\w\-]*)((?:\s+[@\!]?[\w\:\-]+\s*=\s*(['"]).*?\3)*)\s*(\/?)>/;

	var systemSettings = {};
	var userSettings = {};

	/** @type HandlerList List of registered abbreviation resolvers */
	var resolvers = handlerList.create();

	function each(obj, fn) {
		if (!obj) {
			return;
		}

		Object.keys(obj).forEach(function(key) {
			fn(obj[key], key);
		});
	}

	/**
	 * Normalizes caret plceholder in passed text: replaces | character with
	 * default caret placeholder
	 * @param {String} text
	 * @returns {String}
	 */
	function normalizeCaretPlaceholder(text) {
		return utils.replaceUnescapedSymbol(text, '|', utils.getCaretPlaceholder());
	}

	function parseItem(name, value, type) {
		value = normalizeCaretPlaceholder(value);

		if (type == 'snippets') {
			return elements.create('snippet', value);
		}

		if (type == 'abbreviations') {
			return parseAbbreviation(name, value);
		}
	}

	/**
	 * Parses single abbreviation
	 * @param {String} key Abbreviation name
	 * @param {String} value Abbreviation value
	 * @return {Object}
	 */
	function parseAbbreviation(key, value) {
		key = utils.trim(key);
		var m;
		if ((m = reTag.exec(value))) {
			return elements.create('element', m[1], m[2], m[4] == '/');
		} else {
			// assume it's reference to another abbreviation
			return elements.create('reference', value);
		}
	}

	/**
	 * Normalizes snippet key name for better fuzzy search
	 * @param {String} str
	 * @returns {String}
	 */
	function normalizeName(str) {
		return str.replace(/:$/, '').replace(/:/g, '-');
	}

	function expandSnippetsDefinition(snippets) {
		var out = {};
		each(snippets, function(val, key) {
			var items = key.split('|');
			// do not use iterators for better performance
			for (var i = items.length - 1; i >= 0; i--) {
				out[items[i]] = val;
			}
		});

		return out;
	}

	utils.extend(exports, {
		/**
		 * Sets new unparsed data for specified settings vocabulary
		 * @param {Object} data
		 * @param {String} type Vocabulary type ('system' or 'user')
		 * @memberOf resources
		 */
		setVocabulary: function(data, type) {
			cache = {};

			// sections like "snippets" and "abbreviations" could have
			// definitions like `"f|fs": "fieldset"` which is the same as distinct
			// "f" and "fs" keys both equals to "fieldset".
			// We should parse these definitions first
			var voc = {};
			each(data, function(section, syntax) {
				var _section = {};
				each(section, function(subsection, name) {
					if (name == 'abbreviations' || name == 'snippets') {
						subsection = expandSnippetsDefinition(subsection);
					}
					_section[name] = subsection;
				});

				voc[syntax] = _section;
			});


			if (type == VOC_SYSTEM) {
				systemSettings = voc;
			} else {
				userSettings = voc;
			}
		},

		/**
		 * Returns resource vocabulary by its name
		 * @param {String} name Vocabulary name ('system' or 'user')
		 * @return {Object}
		 */
		getVocabulary: function(name) {
			return name == VOC_SYSTEM ? systemSettings : userSettings;
		},

		/**
		 * Returns resource (abbreviation, snippet, etc.) matched for passed
		 * abbreviation
		 * @param {AbbreviationNode} node
		 * @param {String} syntax
		 * @returns {Object}
		 */
		getMatchedResource: function(node, syntax) {
			return resolvers.exec(null, utils.toArray(arguments))
				|| this.findSnippet(syntax, node.name());
		},

		/**
		 * Returns variable value
		 * @return {String}
		 */
		getVariable: function(name) {
			return (this.getSection('variables') || {})[name];
		},

		/**
		 * Store runtime variable in user storage
		 * @param {String} name Variable name
		 * @param {String} value Variable value
		 */
		setVariable: function(name, value){
			var voc = this.getVocabulary('user') || {};
			if (!('variables' in voc))
				voc.variables = {};

			voc.variables[name] = value;
			this.setVocabulary(voc, 'user');
		},

		/**
		 * Check if there are resources for specified syntax
		 * @param {String} syntax
		 * @return {Boolean}
		 */
		hasSyntax: function(syntax) {
			return syntax in this.getVocabulary(VOC_USER)
				|| syntax in this.getVocabulary(VOC_SYSTEM);
		},

		/**
		 * Registers new abbreviation resolver.
		 * @param {Function} fn Abbreviation resolver which will receive
		 * abbreviation as first argument and should return parsed abbreviation
		 * object if abbreviation has handled successfully, <code>null</code>
		 * otherwise
		 * @param {Object} options Options list as described in
		 * {@link HandlerList#add()} method
		 */
		addResolver: function(fn, options) {
			resolvers.add(fn, options);
		},

		removeResolver: function(fn) {
			resolvers.remove(fn);
		},

		/**
		 * Returns actual section data, merged from both
		 * system and user data
		 * @param {String} name Section name (syntax)
		 * @param {String} ...args Subsections
		 * @returns
		 */
		getSection: function(name) {
			if (!name)
				return null;

			if (!(name in cache)) {
				cache[name] = utils.deepMerge({}, systemSettings[name], userSettings[name]);
			}

			var data = cache[name], subsections = utils.toArray(arguments, 1), key;
			while (data && (key = subsections.shift())) {
				if (key in data) {
					data = data[key];
				} else {
					return null;
				}
			}

			return data;
		},

		/**
		 * Recursively searches for a item inside top level sections (syntaxes)
		 * with respect of `extends` attribute
		 * @param {String} topSection Top section name (syntax)
		 * @param {String} subsection Inner section name
		 * @returns {Object}
		 */
		findItem: function(topSection, subsection) {
			var data = this.getSection(topSection);
			while (data) {
				if (subsection in data)
					return data[subsection];

				data = this.getSection(data['extends']);
			}
		},

		/**
		 * Recursively searches for a snippet definition inside syntax section.
		 * Definition is searched inside `snippets` and `abbreviations`
		 * subsections
		 * @param {String} syntax Top-level section name (syntax)
		 * @param {String} name Snippet name
		 * @returns {Object}
		 */
		findSnippet: function(syntax, name, memo) {
			if (!syntax || !name)
				return null;

			memo = memo || [];

			var names = [name];
			// create automatic aliases to properties with colons,
			// e.g. pos-a == pos:a
			if (~name.indexOf('-')) {
				names.push(name.replace(/\-/g, ':'));
			}

			var data = this.getSection(syntax), matchedItem = null;
			['snippets', 'abbreviations'].some(function(sectionName) {
				var data = this.getSection(syntax, sectionName);
				if (data) {
					return names.some(function(n) {
						if (data[n]) {
							return matchedItem = parseItem(n, data[n], sectionName);
						}
					});
				}
			}, this);

			memo.push(syntax);
			if (!matchedItem && data['extends'] && !~memo.indexOf(data['extends'])) {
				// try to find item in parent syntax section
				return this.findSnippet(data['extends'], name, memo);
			}

			return matchedItem;
		},

		/**
		 * Performs fuzzy search of snippet definition
		 * @param {String} syntax Top-level section name (syntax)
		 * @param {String} name Snippet name
		 * @returns
		 */
		fuzzyFindSnippet: function(syntax, name, minScore) {
			var result = this.fuzzyFindMatches(syntax, name, minScore)[0];
			if (result) {
				return result.value.parsedValue;
			}
		},

		fuzzyFindMatches: function(syntax, name, minScore) {
			minScore = minScore || 0.3;
			name = normalizeName(name);
			var snippets = this.getAllSnippets(syntax);

			return Object.keys(snippets)
				.map(function(key) {
					var value = snippets[key];
					return {
						key: key,
						score: stringScore.score(value.nk, name, 0.1),
						value: value
					};
				})
				.filter(function(item) {
					return item.score >= minScore;
				})
				.sort(function(a, b) {
					return a.score - b.score;
				})
				.reverse();
		},

		/**
		 * Returns plain dictionary of all available abbreviations and snippets
		 * for specified syntax with respect of inheritance
		 * @param {String} syntax
		 * @returns {Object}
		 */
		getAllSnippets: function(syntax) {
			var cacheKey = 'all-' + syntax;
			if (!cache[cacheKey]) {
				var stack = [], sectionKey = syntax;
				var memo = [];

				do {
					var section = this.getSection(sectionKey);
					if (!section)
						break;

					['snippets', 'abbreviations'].forEach(function(sectionName) {
						var stackItem = {};
						each(section[sectionName] || null, function(v, k) {
							stackItem[k] = {
								nk: normalizeName(k),
								value: v,
								parsedValue: parseItem(k, v, sectionName),
								type: sectionName
							};
						});

						stack.push(stackItem);
					});

					memo.push(sectionKey);
					sectionKey = section['extends'];
				} while (sectionKey && !~memo.indexOf(sectionKey));


				cache[cacheKey] = utils.extend.apply(utils, stack.reverse());
			}

			return cache[cacheKey];
		},

		/**
		 * Returns newline character
		 * @returns {String}
		 */
		getNewline: function() {
			var nl = this.getVariable('newline');
			return typeof nl === 'string' ? nl : '\n';
		},

		/**
		 * Sets new newline character that will be used in output
		 * @param {String} str
		 */
		setNewline: function(str) {
			this.setVariable('newline', str);
			this.setVariable('nl', str);
		}
	});

	// XXX add default resolvers
	exports.addResolver(cssResolver.resolve.bind(cssResolver));

	// try to load snippets
	// hide it from Require.JS parser
	(function(r) {
		if (typeof define === 'undefined' || !define.amd) {
			try {
				exports.setVocabulary(r('../snippets.json'), VOC_SYSTEM);
			} catch (e) {}
		}
	})(require);


	return exports;
});

},{"../assets/logger":"assets\\logger.js","../resolver/css":"resolver\\css.js","../utils/common":"utils\\common.js","../vendor/stringScore":"vendor\\stringScore.js","./elements":"assets\\elements.js","./handlerList":"assets\\handlerList.js"}],"assets\\stringStream.js":[function(require,module,exports){
/**
 * A trimmed version of CodeMirror's StringStream module for string parsing
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	/**
	 * @type StringStream
	 * @constructor
	 * @param {String} string Assuming that bound string should be
	 * immutable
	 */
	function StringStream(string) {
		this.pos = this.start = 0;
		this.string = string;
		this._length = string.length;
	}
	
	StringStream.prototype = {
		/**
		 * Returns true only if the stream is at the end of the line.
		 * @returns {Boolean}
		 */
		eol: function() {
			return this.pos >= this._length;
		},
		
		/**
		 * Returns true only if the stream is at the start of the line
		 * @returns {Boolean}
		 */
		sol: function() {
			return this.pos === 0;
		},
		
		/**
		 * Returns the next character in the stream without advancing it. 
		 * Will return <code>undefined</code> at the end of the line.
		 * @returns {String}
		 */
		peek: function() {
			return this.string.charAt(this.pos);
		},
		
		/**
		 * Returns the next character in the stream and advances it.
		 * Also returns <code>undefined</code> when no more characters are available.
		 * @returns {String}
		 */
		next: function() {
			if (this.pos < this._length)
				return this.string.charAt(this.pos++);
		},
		
		/**
		 * match can be a character, a regular expression, or a function that
		 * takes a character and returns a boolean. If the next character in the
		 * stream 'matches' the given argument, it is consumed and returned.
		 * Otherwise, undefined is returned.
		 * @param {Object} match
		 * @returns {String}
		 */
		eat: function(match) {
			var ch = this.string.charAt(this.pos), ok;
			if (typeof match == "string")
				ok = ch == match;
			else
				ok = ch && (match.test ? match.test(ch) : match(ch));
			
			if (ok) {
				++this.pos;
				return ch;
			}
		},
		
		/**
		 * Repeatedly calls <code>eat</code> with the given argument, until it
		 * fails. Returns <code>true</code> if any characters were eaten.
		 * @param {Object} match
		 * @returns {Boolean}
		 */
		eatWhile: function(match) {
			var start = this.pos;
			while (this.eat(match)) {}
			return this.pos > start;
		},
		
		/**
		 * Shortcut for <code>eatWhile</code> when matching white-space.
		 * @returns {Boolean}
		 */
		eatSpace: function() {
			var start = this.pos;
			while (/[\s\u00a0]/.test(this.string.charAt(this.pos)))
				++this.pos;
			return this.pos > start;
		},
		
		/**
		 * Moves the position to the end of the line.
		 */
		skipToEnd: function() {
			this.pos = this._length;
		},
		
		/**
		 * Skips to the next occurrence of the given character, if found on the
		 * current line (doesn't advance the stream if the character does not
		 * occur on the line). Returns true if the character was found.
		 * @param {String} ch
		 * @returns {Boolean}
		 */
		skipTo: function(ch) {
			var found = this.string.indexOf(ch, this.pos);
			if (found > -1) {
				this.pos = found;
				return true;
			}
		},
		
		/**
		 * Skips to <code>close</code> character which is pair to <code>open</code>
		 * character, considering possible pair nesting. This function is used
		 * to consume pair of characters, like opening and closing braces
		 * @param {String} open
		 * @param {String} close
		 * @returns {Boolean} Returns <code>true</code> if pair was successfully
		 * consumed
		 */
		skipToPair: function(open, close, skipString) {
			var braceCount = 0, ch;
			var pos = this.pos, len = this._length;
			while (pos < len) {
				ch = this.string.charAt(pos++);
				if (ch == open) {
					braceCount++;
				} else if (ch == close) {
					braceCount--;
					if (braceCount < 1) {
						this.pos = pos;
						return true;
					}
				} else if (skipString && (ch == '"' || ch == "'")) {
					this.skipString(ch);
				}
			}
			
			return false;
		},

		/**
		 * A helper function which, in case of either single or
		 * double quote was found in current position, skips entire
		 * string (quoted value)
		 * @return {Boolean} Wether quoted string was skipped
		 */
		skipQuoted: function(noBackup) {
			var ch = this.string.charAt(noBackup ? this.pos : this.pos - 1);
			if (ch === '"' || ch === "'") {
				if (noBackup) {
					this.pos++;
				}
				return this.skipString(ch);
			}
		},

		/**
		 * A custom function to skip string literal, e.g. a "double-quoted"
		 * or 'single-quoted' value
		 * @param  {String} quote An opening quote
		 * @return {Boolean}
		 */
		skipString: function(quote) {
			var pos = this.pos, len = this._length, ch;
			while (pos < len) {
				ch = this.string.charAt(pos++);
				if (ch == '\\') {
					continue;
				} else if (ch == quote) {
					this.pos = pos;
					return true;
				}
			}

			return false;
		},
		
		/**
		 * Backs up the stream n characters. Backing it up further than the
		 * start of the current token will cause things to break, so be careful.
		 * @param {Number} n
		 */
		backUp : function(n) {
			this.pos -= n;
		},
		
		/**
		 * Act like a multi-character <code>eat</code>—if <code>consume</code> is true or
		 * not given—or a look-ahead that doesn't update the stream position—if
		 * it is false. <code>pattern</code> can be either a string or a
		 * regular expression starting with ^. When it is a string,
		 * <code>caseInsensitive</code> can be set to true to make the match
		 * case-insensitive. When successfully matching a regular expression,
		 * the returned value will be the array returned by <code>match</code>,
		 * in case you need to extract matched groups.
		 * 
		 * @param {RegExp} pattern
		 * @param {Boolean} consume
		 * @param {Boolean} caseInsensitive
		 * @returns
		 */
		match: function(pattern, consume, caseInsensitive) {
			if (typeof pattern == "string") {
				var cased = caseInsensitive
					? function(str) {return str.toLowerCase();}
					: function(str) {return str;};
				
				if (cased(this.string).indexOf(cased(pattern), this.pos) == this.pos) {
					if (consume !== false)
						this.pos += pattern.length;
					return true;
				}
			} else {
				var match = this.string.slice(this.pos).match(pattern);
				if (match && consume !== false)
					this.pos += match[0].length;
				return match;
			}
		},
		
		/**
		 * Get the string between the start of the current token and the 
		 * current stream position.
		 * @returns {String}
		 */
		current: function(backUp) {
			return this.string.slice(this.start, this.pos - (backUp ? 1 : 0));
		}
	};

	module.exports = function(string) {
		return new StringStream(string);
	};

	/** @deprecated */
	module.exports.create = module.exports;
	return module.exports;
});
},{}],"assets\\tabStops.js":[function(require,module,exports){
/**
 * Utility module for handling tabstops tokens generated by Emmet's 
 * "Expand Abbreviation" action. The main <code>extract</code> method will take
 * raw text (for example: <i>${0} some ${1:text}</i>), find all tabstops 
 * occurrences, replace them with tokens suitable for your editor of choice and 
 * return object with processed text and list of found tabstops and their ranges.
 * For sake of portability (Objective-C/Java) the tabstops list is a plain 
 * sorted array with plain objects.
 * 
 * Placeholders with the same are meant to be <i>linked</i> in your editor.
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var stringStream = require('./stringStream');
	var resources = require('./resources');

	/**
	 * Global placeholder value, automatically incremented by 
	 * <code>variablesResolver()</code> function
	 */
	var startPlaceholderNum = 100;
	var tabstopIndex = 0;
	
	var defaultOptions = {
		replaceCarets: false,
		escape: function(ch) {
			return '\\' + ch;
		},
		tabstop: function(data) {
			return data.token;
		},
		variable: function(data) {
			return data.token;
		}
	};
	
	return {
		/**
		 * Main function that looks for a tabstops in provided <code>text</code>
		 * and returns a processed version of <code>text</code> with expanded 
		 * placeholders and list of tabstops found.
		 * @param {String} text Text to process
		 * @param {Object} options List of processor options:<br>
		 * 
		 * <b>replaceCarets</b> : <code>Boolean</code> — replace all default
		 * caret placeholders (like <i>{%::emmet-caret::%}</i>) with <i>${0:caret}</i><br>
		 * 
		 * <b>escape</b> : <code>Function</code> — function that handle escaped
		 * characters (mostly '$'). By default, it returns the character itself 
		 * to be displayed as is in output, but sometimes you will use 
		 * <code>extract</code> method as intermediate solution for further 
		 * processing and want to keep character escaped. Thus, you should override
		 * <code>escape</code> method to return escaped symbol (e.g. '\\$')<br>
		 * 
		 * <b>tabstop</b> : <code>Function</code> – a tabstop handler. Receives 
		 * a single argument – an object describing token: its position, number 
		 * group, placeholder and token itself. Should return a replacement 
		 * string that will appear in final output
		 * 
		 * <b>variable</b> : <code>Function</code> – variable handler. Receives 
		 * a single argument – an object describing token: its position, name 
		 * and original token itself. Should return a replacement 
		 * string that will appear in final output
		 * 
		 * @returns {Object} Object with processed <code>text</code> property
		 * and array of <code>tabstops</code> found
		 * @memberOf tabStops
		 */
		extract: function(text, options) {
			// prepare defaults
			var placeholders = {carets: ''};
			var marks = [];
			
			options = utils.extend({}, defaultOptions, options, {
				tabstop: function(data) {
					var token = data.token;
					var ret = '';
					if (data.placeholder == 'cursor') {
						marks.push({
							start: data.start,
							end: data.start + token.length,
							group: 'carets',
							value: ''
						});
					} else {
						// unify placeholder value for single group
						if ('placeholder' in data)
							placeholders[data.group] = data.placeholder;
						
						if (data.group in placeholders)
							ret = placeholders[data.group];
						
						marks.push({
							start: data.start,
							end: data.start + token.length,
							group: data.group,
							value: ret
						});
					}
					
					return token;
				}
			});
			
			if (options.replaceCarets) {
				text = text.replace(new RegExp( utils.escapeForRegexp( utils.getCaretPlaceholder() ), 'g'), '${0:cursor}');
			}
			
			// locate tabstops and unify group's placeholders
			text = this.processText(text, options);
			
			// now, replace all tabstops with placeholders
			var buf = '', lastIx = 0;
			var tabStops = marks.map(function(mark) {
				buf += text.substring(lastIx, mark.start);
				
				var pos = buf.length;
				var ph = placeholders[mark.group] || '';
				
				buf += ph;
				lastIx = mark.end;
				
				return {
					group: mark.group,
					start: pos,
					end:  pos + ph.length
				};
			});
			
			buf += text.substring(lastIx);
			
			return {
				text: buf,
				tabstops: tabStops.sort(function(a, b) {
					return a.start - b.start;
				})
			};
		},
		
		/**
		 * Text processing routine. Locates escaped characters and tabstops and
		 * replaces them with values returned by handlers defined in 
		 * <code>options</code>
		 * @param {String} text
		 * @param {Object} options See <code>extract</code> method options 
		 * description
		 * @returns {String}
		 */
		processText: function(text, options) {
			options = utils.extend({}, defaultOptions, options);
			
			var buf = '';
			/** @type StringStream */
			var stream = stringStream.create(text);
			var ch, m, a;
			
			while ((ch = stream.next())) {
				if (ch == '\\' && !stream.eol()) {
					// handle escaped character
					buf += options.escape(stream.next());
					continue;
				}
				
				a = ch;
				
				if (ch == '$') {
					// looks like a tabstop
					stream.start = stream.pos - 1;
					
					if ((m = stream.match(/^[0-9]+/))) {
						// it's $N
						a = options.tabstop({
							start: buf.length, 
							group: stream.current().substr(1),
							token: stream.current()
						});
					} else if ((m = stream.match(/^\{([a-z_\-][\w\-]*)\}/))) {
						// ${variable}
						a = options.variable({
							start: buf.length, 
							name: m[1],
							token: stream.current()
						});
					} else if ((m = stream.match(/^\{([0-9]+)(:.+?)?\}/, false))) {
						// ${N:value} or ${N} placeholder
						// parse placeholder, including nested ones
						stream.skipToPair('{', '}');
						
						var obj = {
							start: buf.length, 
							group: m[1],
							token: stream.current()
						};
						
						var placeholder = obj.token.substring(obj.group.length + 2, obj.token.length - 1);
						
						if (placeholder) {
							obj.placeholder = placeholder.substr(1);
						}
						
						a = options.tabstop(obj);
					}
				}
				
				buf += a;
			}
			
			return buf;
		},
		
		/**
		 * Upgrades tabstops in output node in order to prevent naming conflicts
		 * @param {AbbreviationNode} node
		 * @param {Number} offset Tab index offset
		 * @returns {Number} Maximum tabstop index in element
		 */
		upgrade: function(node, offset) {
			var maxNum = 0;
			var options = {
				tabstop: function(data) {
					var group = parseInt(data.group, 10);
					if (group > maxNum) maxNum = group;
						
					if (data.placeholder)
						return '${' + (group + offset) + ':' + data.placeholder + '}';
					else
						return '${' + (group + offset) + '}';
				}
			};
			
			['start', 'end', 'content'].forEach(function(p) {
				node[p] = this.processText(node[p], options);
			}, this);
			
			return maxNum;
		},
		
		/**
		 * Helper function that produces a callback function for 
		 * <code>replaceVariables()</code> method from {@link utils}
		 * module. This callback will replace variable definitions (like 
		 * ${var_name}) with their value defined in <i>resource</i> module,
		 * or outputs tabstop with variable name otherwise.
		 * @param {AbbreviationNode} node Context node
		 * @returns {Function}
		 */
		variablesResolver: function(node) {
			var placeholderMemo = {};
			return function(str, varName) {
				// do not mark `child` variable as placeholder – it‘s a reserved
				// variable name
				if (varName == 'child') {
					return str;
				}
				
				if (varName == 'cursor') {
					return utils.getCaretPlaceholder();
				}
				
				var attr = node.attribute(varName);
				if (typeof attr !== 'undefined' && attr !== str) {
					return attr;
				}
				
				var varValue = resources.getVariable(varName);
				if (varValue) {
					return varValue;
				}
				
				// output as placeholder
				if (!placeholderMemo[varName]) {
					placeholderMemo[varName] = startPlaceholderNum++;
				}
					
				return '${' + placeholderMemo[varName] + ':' + varName + '}';
			};
		},

		/**
		 * Replace variables like ${var} in string
		 * @param {String} str
		 * @param {Object} vars Variable set (defaults to variables defined in 
		 * <code>snippets.json</code>) or variable resolver (<code>Function</code>)
		 * @return {String}
		 */
		replaceVariables: function(str, vars) {
			vars = vars || {};
			var resolver = typeof vars === 'function' ? vars : function(str, p1) {
				return p1 in vars ? vars[p1] : null;
			};
			
			return this.processText(str, {
				variable: function(data) {
					var newValue = resolver(data.token, data.name, data);
					if (newValue === null) {
						// try to find variable in resources
						newValue = resources.getVariable(data.name);
					}
					
					if (newValue === null || typeof newValue === 'undefined')
						// nothing found, return token itself
						newValue = data.token;
					return newValue;
				}
			});
		},
		
		/**
		 * Resets global tabstop index. When parsed tree is converted to output
		 * string (<code>AbbreviationNode.toString()</code>), all tabstops 
		 * defined in snippets and elements are upgraded in order to prevent
		 * naming conflicts of nested. For example, <code>${1}</code> of a node
		 * should not be linked with the same placehilder of the child node.
		 * By default, <code>AbbreviationNode.toString()</code> automatically
		 * upgrades tabstops of the same index for each node and writes maximum
		 * tabstop index into the <code>tabstopIndex</code> variable. To keep
		 * this variable at reasonable value, it is recommended to call 
		 * <code>resetTabstopIndex()</code> method each time you expand variable 
		 * @returns
		 */
		resetTabstopIndex: function() {
			tabstopIndex = 0;
			startPlaceholderNum = 100;
		},

		/**
		 * Output processor for abbreviation parser that will upgrade tabstops 
		 * of parsed node in order to prevent tabstop index conflicts
		 */
		abbrOutputProcessor: function(text, node, type) {
			var maxNum = 0;
			var that = this;
			
			var tsOptions = {
				tabstop: function(data) {
					var group = parseInt(data.group, 10);
					if (group === 0)
						return '${0}';
					
					if (group > maxNum) maxNum = group;
					if (data.placeholder) {
						// respect nested placeholders
						var ix = group + tabstopIndex;
						var placeholder = that.processText(data.placeholder, tsOptions);
						return '${' + ix + ':' + placeholder + '}';
					} else {
						return '${' + (group + tabstopIndex) + '}';
					}
				}
			};
			
			// upgrade tabstops
			text = this.processText(text, tsOptions);
			
			// resolve variables
			text = this.replaceVariables(text, this.variablesResolver(node));
			
			tabstopIndex += maxNum + 1;
			return text;
		}
	};
});
},{"../utils/common":"utils\\common.js","./resources":"assets\\resources.js","./stringStream":"assets\\stringStream.js"}],"assets\\tokenIterator.js":[function(require,module,exports){
/**
 * Helper class for convenient token iteration
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	/**
	 * @type TokenIterator
	 * @param {Array} tokens
	 * @type TokenIterator
	 * @constructor
	 */
	function TokenIterator(tokens) {
		/** @type Array */
		this.tokens = tokens;
		this._position = 0;
		this.reset();
	}
	
	TokenIterator.prototype = {
		next: function() {
			if (this.hasNext()) {
				var token = this.tokens[++this._i];
				this._position = token.start;
				return token;
			} else {
				this._i = this._il;
			}
			
			return null;
		},
		
		current: function() {
			return this.tokens[this._i];
		},

		peek: function() {
			return this.tokens[this._i + i];
		},
		
		position: function() {
			return this._position;
		},
		
		hasNext: function() {
			return this._i < this._il - 1;
		},
		
		reset: function() {
			this._i = 0;
			this._il = this.tokens.length;
		},
		
		item: function() {
			return this.tokens[this._i];
		},
		
		itemNext: function() {
			return this.tokens[this._i + 1];
		},
		
		itemPrev: function() {
			return this.tokens[this._i - 1];
		},
		
		nextUntil: function(type, callback) {
			var token;
			var test = typeof type == 'string' 
				? function(t){return t.type == type;} 
				: type;
			
			while ((token = this.next())) {
				if (callback)
					callback.call(this, token);
				if (test.call(this, token))
					break;
			}
		}
	};
	
	return {
		create: function(tokens) {
			return new TokenIterator(tokens);
		}
	};
});
},{}],"editTree\\base.js":[function(require,module,exports){
/**
 * Abstract implementation of edit tree interface.
 * Edit tree is a named container of editable “name-value” child elements, 
 * parsed from <code>source</code>. This container provides convenient methods
 * for editing/adding/removing child elements. All these update actions are
 * instantly reflected in the <code>source</code> code with respect of formatting.
 * <br><br>
 * For example, developer can create an edit tree from CSS rule and add or 
 * remove properties from it–all changes will be immediately reflected in the 
 * original source.
 * <br><br>
 * All classes defined in this module should be extended the same way as in
 * Backbone framework: using <code>extend</code> method to create new class and 
 * <code>initialize</code> method to define custom class constructor.
 * 
 * @example
 * <pre><code>
 * var MyClass = require('editTree/base').EditElement.extend({
 *     initialize: function() {
 *     // constructor code here
 *   }
 * });
 * 
 * var elem = new MyClass(); 
 * </code></pre>
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var range = require('../assets/range');
	var utils = require('../utils/common');
	var klass = require('../vendor/klass');
	
	/**
	 * Named container of edited source
	 * @type EditContainer
	 * @param {String} source
	 * @param {Object} options
	 */
	function EditContainer(source, options) {
		this.options = utils.extend({offset: 0}, options);
		/**
		 * Source code of edited structure. All changes in the structure are 
		 * immediately reflected into this property
		 */
		this.source = source;
		
		/** 
		 * List of all editable children
		 * @private 
		 */
		this._children = [];
		
		/**
		 * Hash of all positions of container
		 * @private
		 */
		this._positions = {
			name: 0
		};
		
		this.initialize.apply(this, arguments);
	}
	
	/**
	 * The self-propagating extend function for classes.
	 * @type Function
	 */
	EditContainer.extend = klass.extend;
	
	EditContainer.prototype = {
		type: 'container',
		/**
		 * Child class constructor
		 */
		initialize: function() {},

		/**
		 * Make position absolute
		 * @private
		 * @param {Number} num
		 * @param {Boolean} isAbsolute
		 * @returns {Boolean}
		 */
		_pos: function(num, isAbsolute) {
			return num + (isAbsolute ? this.options.offset : 0);
		},
		
		/**
		 * Replace substring of tag's source
		 * @param {String} value
		 * @param {Number} start
		 * @param {Number} end
		 * @private
		 */
		_updateSource: function(value, start, end) {
			// create modification range
			var r = range.create(start, typeof end === 'undefined' ? 0 : end - start);
			var delta = value.length - r.length();
			
			var update = function(obj) {
				Object.keys(obj).forEach(function(k) {
					if (obj[k] >= r.end) {
						obj[k] += delta;
					}
				});
			};
			
			// update affected positions of current container
			update(this._positions);
			
			// update affected positions of children
			var recursiveUpdate = function(items) {
				items.forEach(function(item) {
					update(item._positions);
					if (item.type == 'container') {
						recursiveUpdate(item.list());
					}
				});
			};

			recursiveUpdate(this.list());
			this.source = utils.replaceSubstring(this.source, value, r);
		},
			
			
		/**
		 * Adds new attribute 
		 * @param {String} name Property name
		 * @param {String} value Property value
		 * @param {Number} pos Position at which to insert new property. By 
		 * default the property is inserted at the end of rule 
		 * @returns {EditElement} Newly created element
		 */
		add: function(name, value, pos) {
			// this is abstract implementation
			var item = new EditElement(name, value);
			this._children.push(item);
			return item;
		},
		
		/**
		 * Returns attribute object
		 * @param {String} name Attribute name or its index
		 * @returns {EditElement}
		 */
		get: function(name) {
			if (typeof name === 'number') {
				return this.list()[name];
			}
			
			if (typeof name === 'string') {
				return utils.find(this.list(), function(prop) {
					return prop.name() === name;
				});
			}
			
			return name;
		},
		
		/**
		 * Returns all children by name or indexes
		 * @param {Object} name Element name(s) or indexes (<code>String</code>,
		 * <code>Array</code>, <code>Number</code>)
		 * @returns {Array}
		 */
		getAll: function(name) {
			if (!Array.isArray(name))
				name = [name];
			
			// split names and indexes
			var names = [], indexes = [];
			name.forEach(function(item) {
				if (typeof item === 'string') {
					names.push(item);
				} else if (typeof item === 'number') {
					indexes.push(item);
				}
			});
			
			return this.list().filter(function(attribute, i) {
				return ~indexes.indexOf(i) || ~names.indexOf(attribute.name());
			});
		},

		/**
		 * Returns list of all editable child elements
		 * @returns {Array}
		 */
		list: function() {
			return this._children;
		},

		/**
		 * Remove child element
		 * @param {String} name Property name or its index
		 */
		remove: function(name) {
			var element = this.get(name);
			if (element) {
				this._updateSource('', element.fullRange());
				var ix = this._children.indexOf(element);
				if (~ix) {
					this._children.splice(ix, 1);
				}
			}
		},
		
		/**
		 * Returns index of editble child in list
		 * @param {Object} item
		 * @returns {Number}
		 */
		indexOf: function(item) {
			return this.list().indexOf(this.get(item));
		},
		
		/**
		 * Returns or updates element value. If such element doesn't exists,
		 * it will be created automatically and added at the end of child list.
		 * @param {String} name Element name or its index
		 * @param {String} value New element value
		 * @returns {String}
		 */
		value: function(name, value, pos) {
			var element = this.get(name);
			if (element)
				return element.value(value);
			
			if (typeof value !== 'undefined') {
				// no such element — create it
				return this.add(name, value, pos);
			}
		},
		
		/**
		 * Returns all values of child elements found by <code>getAll()</code>
		 * method
		 * @param {Object} name Element name(s) or indexes (<code>String</code>,
		 * <code>Array</code>, <code>Number</code>)
		 * @returns {Array}
		 */
		values: function(name) {
			return this.getAll(name).map(function(element) {
				return element.value();
			});
		},
		
		/**
		 * Sets or gets container name
		 * @param {String} val New name. If not passed, current 
		 * name is returned
		 * @return {String}
		 */
		name: function(val) {
			if (typeof val !== 'undefined' && this._name !== (val = String(val))) {
				this._updateSource(val, this._positions.name, this._positions.name + this._name.length);
				this._name = val;
			}
			
			return this._name;
		},
		
		/**
		 * Returns name range object
		 * @param {Boolean} isAbsolute Return absolute range (with respect of 
		 * rule offset)
		 * @returns {Range}
		 */
		nameRange: function(isAbsolute) {
			return range.create(this._positions.name + (isAbsolute ? this.options.offset : 0), this.name());
		},

		/**
		 * Returns range of current source
		 * @param {Boolean} isAbsolute
		 */
		range: function(isAbsolute) {
			return range.create(isAbsolute ? this.options.offset : 0, this.valueOf());
		},
		
		/**
		 * Returns element that belongs to specified position
		 * @param {Number} pos
		 * @param {Boolean} isAbsolute
		 * @returns {EditElement}
		 */
		itemFromPosition: function(pos, isAbsolute) {
			return utils.find(this.list(), function(elem) {
				return elem.range(isAbsolute).inside(pos);
			});
		},
		
		/**
		 * Returns source code of current container 
		 * @returns {String}
		 */
		toString: function() {
			return this.valueOf();
		},

		valueOf: function() {
			return this.source;
		}
	};
	
	/**
	 * @param {EditContainer} parent
	 * @param {Object} nameToken
	 * @param {Object} valueToken
	 */
	function EditElement(parent, nameToken, valueToken) {
		/** @type EditContainer */
		this.parent = parent;
		
		this._name = nameToken.value;
		this._value = valueToken ? valueToken.value : '';
		
		this._positions = {
			name: nameToken.start,
			value: valueToken ? valueToken.start : -1
		};
		
		this.initialize.apply(this, arguments);
	}
	
	/**
	 * The self-propagating extend function for classes.
	 * @type Function
	 */
	EditElement.extend = klass.extend;
	
	EditElement.prototype = {
		type: 'element',

		/**
		 * Child class constructor
		 */
		initialize: function() {},
		
		/**
		 * Make position absolute
		 * @private
		 * @param {Number} num
		 * @param {Boolean} isAbsolute
		 * @returns {Boolean}
		 */
		_pos: function(num, isAbsolute) {
			return num + (isAbsolute ? this.parent.options.offset : 0);
		},
			
		/**
		 * Sets of gets element value
		 * @param {String} val New element value. If not passed, current 
		 * value is returned
		 * @returns {String}
		 */
		value: function(val) {
			if (typeof val !== 'undefined' && this._value !== (val = String(val))) {
				this.parent._updateSource(val, this.valueRange());
				this._value = val;
			}
			
			return this._value;
		},
		
		/**
		 * Sets of gets element name
		 * @param {String} val New element name. If not passed, current 
		 * name is returned
		 * @returns {String}
		 */
		name: function(val) {
			if (typeof val !== 'undefined' && this._name !== (val = String(val))) {
				this.parent._updateSource(val, this.nameRange());
				this._name = val;
			}
			
			return this._name;
		},
		
		/**
		 * Returns position of element name token
		 * @param {Boolean} isAbsolute Return absolute position
		 * @returns {Number}
		 */
		namePosition: function(isAbsolute) {
			return this._pos(this._positions.name, isAbsolute);
		},
		
		/**
		 * Returns position of element value token
		 * @param {Boolean} isAbsolute Return absolute position
		 * @returns {Number}
		 */
		valuePosition: function(isAbsolute) {
			return this._pos(this._positions.value, isAbsolute);
		},
		
		/**
		 * Returns element name
		 * @param {Boolean} isAbsolute Return absolute range 
		 * @returns {Range}
		 */
		range: function(isAbsolute) {
			return range.create(this.namePosition(isAbsolute), this.valueOf());
		},
		
		/**
		 * Returns full element range, including possible indentation
		 * @param {Boolean} isAbsolute Return absolute range
		 * @returns {Range}
		 */
		fullRange: function(isAbsolute) {
			return this.range(isAbsolute);
		},
		
		/**
		 * Returns element name range
		 * @param {Boolean} isAbsolute Return absolute range
		 * @returns {Range}
		 */
		nameRange: function(isAbsolute) {
			return range.create(this.namePosition(isAbsolute), this.name());
		},
		
		/**
		 * Returns element value range
		 * @param {Boolean} isAbsolute Return absolute range
		 * @returns {Range}
		 */
		valueRange: function(isAbsolute) {
			return range.create(this.valuePosition(isAbsolute), this.value());
		},
		
		/**
		 * Returns current element string representation
		 * @returns {String}
		 */
		toString: function() {
			return this.valueOf();
		},
		
		valueOf: function() {
			return this.name() + this.value();
		}
	};
	
	return {
		EditContainer: EditContainer,
		EditElement: EditElement,
		
		/**
		 * Creates token that can be fed to <code>EditElement</code>
		 * @param {Number} start
		 * @param {String} value
		 * @param {String} type
		 * @returns
		 */
		createToken: function(start, value, type) {
			var obj = {
				start: start || 0,
				value: value || '',
				type: type
			};
			
			obj.end = obj.start + obj.value.length;
			return obj;
		}
	};
});
},{"../assets/range":"assets\\range.js","../utils/common":"utils\\common.js","../vendor/klass":"vendor\\klass.js"}],"editTree\\css.js":[function(require,module,exports){
/**
 * CSS EditTree is a module that can parse a CSS rule into a tree with 
 * convenient methods for adding, modifying and removing CSS properties. These 
 * changes can be written back to string with respect of code formatting.
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var editTree = require('./base');
	var cssParser = require('../parser/css');
	var cssSections = require('../utils/cssSections');
	var range = require('../assets/range');
	var stringStream = require('../assets/stringStream');
	var tokenIterator = require('../assets/tokenIterator');

	var defaultOptions = {
		styleBefore: '\n\t',
		styleSeparator: ': ',
		offset: 0
	};
	
	var reSpaceStart = /^\s+/;
	var reSpaceEnd = /\s+$/;
	var WHITESPACE_REMOVE_FROM_START = 1;
	var WHITESPACE_REMOVE_FROM_END   = 2;
	
	/**
	 * Modifies given range to remove whitespace from beginning
	 * and/or from the end
	 * @param  {Range} rng Range to modify
	 * @param  {String} text  Text that range belongs to
	 * @param  {Number} mask  Mask indicating from which end 
	 * whitespace should be removed
	 * @return {Range}
	 */
	function trimWhitespaceInRange(rng, text, mask) {
		mask = mask || (WHITESPACE_REMOVE_FROM_START | WHITESPACE_REMOVE_FROM_END);
		text = rng.substring(text);
		var m;
		if ((mask & WHITESPACE_REMOVE_FROM_START) && (m = text.match(reSpaceStart))) {
			rng.start += m[0].length;
		}

		if ((mask & WHITESPACE_REMOVE_FROM_END) && (m = text.match(reSpaceEnd))) {
			rng.end -= m[0].length;
		}

		// in case given range is just a whatespace
		if (rng.end < rng.start) {
			rng.end = rng.start;
		}

		return rng;
	}

	/**
	 * Consumes CSS property and value from current token
	 * iterator state. Offsets iterator pointer into token
	 * that can be used for next value consmption
	 * @param  {TokenIterator} it
	 * @param  {String} text
	 * @return {Object}    Object with `name` and `value` properties 
	 * ar ranges. Value range can be zero-length.
	 */
	function consumeSingleProperty(it, text) {
		var name, value, end;
		var token = it.current();

		if (!token) {
			return null;
		}

		// skip whitespace
		var ws = {'white': 1, 'line': 1, 'comment': 1};
		while ((token = it.current())) {
			if (!(token.type in ws)) {
				break;
			}
			it.next();
		}

		if (!it.hasNext()) {
			return null;
		}

		// consume property name
		token = it.current();
		name = range(token.start, token.value);
		var isAtProperty = token.value.charAt(0) == '@';
		while (token = it.next()) {
			name.end = token.end;
			if (token.type == ':' || token.type == 'white') {
				name.end = token.start;
				it.next();
				if (token.type == ':' || isAtProperty) {
					// XXX I really ashame of this hardcode, but I need
					// to stop parsing if this is an SCSS mixin call,
					// for example: @include border-radius(10px)
					break;
				}
			} else if (token.type == ';' || token.type == 'line') {
				// there’s no value, looks like a mixin
				// or a special use case:
				// user is writing a new property or abbreviation
				name.end = token.start;
				value = range(token.start, 0);
				it.next();
				break;
			}
		}

		token = it.current();
		if (!value && token) {
			if (token.type == 'line') {
				lastNewline = token;
			}
			// consume value
			value = range(token.start, token.value);
			var lastNewline;
			while ((token = it.next())) {
				value.end = token.end;
				if (token.type == 'line') {
					lastNewline = token;
				} else if (token.type == '}' || token.type == ';') {
					value.end = token.start;
					if (token.type == ';') {
						end = range(token.start, token.value);
					}
					it.next();
					break;
				} else if (token.type == ':' && lastNewline) {
					// A special case: 
					// user is writing a value before existing
					// property, but didn’t inserted closing semi-colon.
					// In this case, limit value range to previous
					// newline
					value.end = lastNewline.start;
					it._i = it.tokens.indexOf(lastNewline);
					break;
				}
			}
		}

		if (!value) {
			value = range(name.end, 0);
		}

		return {
			name: trimWhitespaceInRange(name, text),
			value: trimWhitespaceInRange(value, text, WHITESPACE_REMOVE_FROM_START | (end ? WHITESPACE_REMOVE_FROM_END : 0)),
			end: end || range(value.end, 0)
		};
	}

	/**
	 * Finds parts of complex CSS value
	 * @param {String} str
	 * @returns {Array} Returns list of <code>Range</code>'s
	 */
	function findParts(str) {
		/** @type StringStream */
		var stream = stringStream.create(str);
		var ch;
		var result = [];
		var sep = /[\s\u00a0,;]/;
		
		var add = function() {
			stream.next();
			result.push(range(stream.start, stream.current()));
			stream.start = stream.pos;
		};
		
		// skip whitespace
		stream.eatSpace();
		stream.start = stream.pos;
		
		while ((ch = stream.next())) {
			if (ch == '"' || ch == "'") {
				stream.next();
				if (!stream.skipTo(ch)) break;
				add();
			} else if (ch == '(') {
				// function found, may have nested function
				stream.backUp(1);
				if (!stream.skipToPair('(', ')')) break;
				stream.backUp(1);
				add();
			} else {
				if (sep.test(ch)) {
					result.push(range(stream.start, stream.current().length - 1));
					stream.eatWhile(sep);
					stream.start = stream.pos;
				}
			}
		}
		
		add();

		return utils.unique(result.filter(function(item) {
			return !!item.length();
		}));
	}
	
	/**
	 * Parses CSS properties from given CSS source
	 * and adds them to CSSEditContainer node
	 * @param  {CSSEditContainer} node
	 * @param  {String} source CSS source
	 * @param {Number} offset Offset of properties subset from original source
	 */
	function consumeProperties(node, source, offset) {
		var list = extractPropertiesFromSource(source, offset);

		list.forEach(function(property) {
			node._children.push(new CSSEditElement(node,
				editTree.createToken(property.name.start, property.nameText),
				editTree.createToken(property.value.start, property.valueText),
				editTree.createToken(property.end.start, property.endText)
				));
		});
	}

	/**
	 * Parses given CSS source and returns list of ranges of located CSS properties.
	 * Normally, CSS source must contain properties only, it must be,
	 * for example, a content of CSS selector or text between nested
	 * CSS sections
	 * @param  {String} source CSS source
	 * @param {Number} offset Offset of properties subset from original source.
	 * Used to provide proper ranges of locates items
	 */
	function extractPropertiesFromSource(source, offset) {
		offset = offset || 0;
		source = source.replace(reSpaceEnd, '');
		var out = [];

		if (!source) {
			return out;
		}

		var tokens = cssParser.parse(source);
		var it = tokenIterator.create(tokens);
		var property;

		while ((property = consumeSingleProperty(it, source))) {
			out.push({
				nameText: property.name.substring(source),
				name: property.name.shift(offset),

				valueText: property.value.substring(source),
				value: property.value.shift(offset),

				endText: property.end.substring(source),
				end: property.end.shift(offset)
			});
		}

		return out;
	}
	
	/**
	 * @class
	 * @extends EditContainer
	 */
	var CSSEditContainer = editTree.EditContainer.extend({
		initialize: function(source, options) {
			utils.extend(this.options, defaultOptions, options);
			
			if (Array.isArray(source)) {
				source = cssParser.toSource(source);
			}

			var allRules = cssSections.findAllRules(source);
			var currentRule = allRules.shift();

			// keep top-level rules only since they will
			// be parsed by nested CSSEditContainer call
			var topLevelRules = [];
			allRules.forEach(function(r) {
				var isTopLevel = !utils.find(topLevelRules, function(tr) {
					return tr.contains(r);
				});

				if (isTopLevel) {
					topLevelRules.push(r);
				}
			});


			var selectorRange = range.create2(currentRule.start, currentRule._selectorEnd);
			this._name = selectorRange.substring(source);
			this._positions.name = selectorRange.start;
			this._positions.contentStart = currentRule._contentStart + 1;

			var sectionOffset = currentRule._contentStart + 1;
			var sectionEnd = currentRule.end - 1;

			// parse properties between nested rules
			// and add nested rules as children
			var that = this;
			topLevelRules.forEach(function(r) {
				consumeProperties(that, source.substring(sectionOffset, r.start), sectionOffset);
				var opt = utils.extend({}, that.options, {offset: r.start + that.options.offset});
				// XXX I think I don’t need nested containers here
				// They should be handled separately
				// that._children.push(new CSSEditContainer(r.substring(source), opt));
				sectionOffset = r.end;
			});

			// consume the rest of data
			consumeProperties(this, source.substring(sectionOffset, currentRule.end - 1), sectionOffset);
			this._saveStyle();
		},
		
		/**
		 * Remembers all styles of properties
		 * @private
		 */
		_saveStyle: function() {
			var start = this._positions.contentStart;
			var source = this.source;
			
			this.list().forEach(function(p) {
				if (p.type === 'container') {
					return;
				}

				p.styleBefore = source.substring(start, p.namePosition());
				// a small hack here:
				// Sometimes users add empty lines before properties to logically
				// separate groups of properties. In this case, a blind copy of
				// characters between rules may lead to undesired behavior,
				// especially when current rule is duplicated or used as a donor
				// to create new rule.
				// To solve this issue, we‘ll take only last newline indentation
				var lines = utils.splitByLines(p.styleBefore);
				if (lines.length > 1) {
					p.styleBefore = '\n' + lines[lines.length - 1];
				}
				
				p.styleSeparator = source.substring(p.nameRange().end, p.valuePosition());
				
				// graceful and naive comments removal 
				var parts = p.styleBefore.split('*/');
				p.styleBefore = parts[parts.length - 1];
				p.styleSeparator = p.styleSeparator.replace(/\/\*.*?\*\//g, '');
				
				start = p.range().end;
			});
		},

		/**
		 * Returns position of element name token
		 * @param {Boolean} isAbsolute Return absolute position
		 * @returns {Number}
		 */
		namePosition: function(isAbsolute) {
			return this._pos(this._positions.name, isAbsolute);
		},
		
		/**
		 * Returns position of element value token
		 * @param {Boolean} isAbsolute Return absolute position
		 * @returns {Number}
		 */
		valuePosition: function(isAbsolute) {
			return this._pos(this._positions.contentStart, isAbsolute);
		},

		/**
		 * Returns element value range
		 * @param {Boolean} isAbsolute Return absolute range
		 * @returns {Range}
		 */
		valueRange: function(isAbsolute) {
			return range.create2(this.valuePosition(isAbsolute), this._pos(this.valueOf().length, isAbsolute) - 1);
		},
		
		/**
		 * Adds new CSS property 
		 * @param {String} name Property name
		 * @param {String} value Property value
		 * @param {Number} pos Position at which to insert new property. By 
		 * default the property is inserted at the end of rule 
		 * @returns {CSSEditProperty}
		 */
		add: function(name, value, pos) {
			var list = this.list();
			var start = this._positions.contentStart;
			var styles = utils.pick(this.options, 'styleBefore', 'styleSeparator');
			
			if (typeof pos === 'undefined') {
				pos = list.length;
			}
			
			/** @type CSSEditProperty */
			var donor = list[pos];
			if (donor) {
				start = donor.fullRange().start;
			} else if ((donor = list[pos - 1])) {
				// make sure that donor has terminating semicolon
				donor.end(';');
				start = donor.range().end;
			}
			
			if (donor) {
				styles = utils.pick(donor, 'styleBefore', 'styleSeparator');
			}
			
			var nameToken = editTree.createToken(start + styles.styleBefore.length, name);
			var valueToken = editTree.createToken(nameToken.end + styles.styleSeparator.length, value);
			
			var property = new CSSEditElement(this, nameToken, valueToken,
					editTree.createToken(valueToken.end, ';'));
			
			utils.extend(property, styles);
			
			// write new property into the source
			this._updateSource(property.styleBefore + property.toString(), start);
			
			// insert new property
			this._children.splice(pos, 0, property);
			return property;
		}
	});
	
	/**
	 * @class
	 * @type CSSEditElement
	 * @constructor
	 */
	var CSSEditElement = editTree.EditElement.extend({
		initialize: function(rule, name, value, end) {
			this.styleBefore = rule.options.styleBefore;
			this.styleSeparator = rule.options.styleSeparator;
			
			this._end = end.value;
			this._positions.end = end.start;
		},
		
		/**
		 * Returns ranges of complex value parts
		 * @returns {Array} Returns <code>null</code> if value is not complex
		 */
		valueParts: function(isAbsolute) {
			var parts = findParts(this.value());
			if (isAbsolute) {
				var offset = this.valuePosition(true);
				parts.forEach(function(p) {
					p.shift(offset);
				});
			}
			
			return parts;
		},

		/**
		 * Sets of gets element value. 
		 * When setting value, this implementation will ensure that your have 
		 * proper name-value separator
		 * @param {String} val New element value. If not passed, current 
		 * value is returned
		 * @returns {String}
		 */
		value: function(val) {
			var isUpdating = typeof val !== 'undefined';
			var allItems = this.parent.list();
			if (isUpdating && this.isIncomplete()) {
				var self = this;
				var donor = utils.find(allItems, function(item) {
					return item !== self && !item.isIncomplete();
				});

				this.styleSeparator = donor 
					? donor.styleSeparator 
					: this.parent.options.styleSeparator;
				this.parent._updateSource(this.styleSeparator, range(this.valueRange().start, 0));
			}

			var value = this.constructor.__super__.value.apply(this, arguments);
			if (isUpdating) {
				// make sure current property has terminating semi-colon
				// if it’s not the last one
				var ix = allItems.indexOf(this);
				if (ix !== allItems.length - 1 && !this.end()) {
					this.end(';');
				}
			}
			return value;
		},

		/**
		 * Test if current element is incomplete, e.g. has no explicit
		 * name-value separator
		 * @return {Boolean} [description]
		 */
		isIncomplete: function() {
			return this.nameRange().end === this.valueRange().start;
		},
		
		/**
		 * Sets of gets property end value (basically, it's a semicolon)
		 * @param {String} val New end value. If not passed, current 
		 * value is returned
		 */
		end: function(val) {
			if (typeof val !== 'undefined' && this._end !== val) {
				this.parent._updateSource(val, this._positions.end, this._positions.end + this._end.length);
				this._end = val;
			}
			
			return this._end;
		},
		
		/**
		 * Returns full rule range, with indentation
		 * @param {Boolean} isAbsolute Return absolute range (with respect of
		 * rule offset)
		 * @returns {Range}
		 */
		fullRange: function(isAbsolute) {
			var r = this.range(isAbsolute);
			r.start -= this.styleBefore.length;
			return r;
		},
		
		/**
		 * Returns item string representation
		 * @returns {String}
		 */
		valueOf: function() {
			return this.name() + this.styleSeparator + this.value() + this.end();
		}
	});
	
	return {
		/**
		 * Parses CSS rule into editable tree
		 * @param {String} source
		 * @param {Object} options
		 * @memberOf emmet.cssEditTree
		 * @returns {EditContainer}
		 */
		parse: function(source, options) {
			return new CSSEditContainer(source, options);
		},
		
		/**
		 * Extract and parse CSS rule from specified position in <code>content</code> 
		 * @param {String} content CSS source code
		 * @param {Number} pos Character position where to start source code extraction
		 * @returns {EditContainer}
		 */
		parseFromPosition: function(content, pos, isBackward) {
			var bounds = cssSections.locateRule(content, pos, isBackward);
			if (!bounds || !bounds.inside(pos)) {
				// no matching CSS rule or caret outside rule bounds
				return null;
			}
			
			return this.parse(bounds.substring(content), {
				offset: bounds.start
			});
		},

		/**
		 * Locates CSS property in given CSS code fragment under specified character position
		 * @param  {String} css CSS code or parsed CSSEditContainer
		 * @param  {Number} pos Character position where to search CSS property
		 * @return {CSSEditElement}
		 */
		propertyFromPosition: function(css, pos) {
			var cssProp = null;
			/** @type EditContainer */
			var cssRule = typeof css === 'string' ? this.parseFromPosition(css, pos, true) : css;
			if (cssRule) {
				cssProp = cssRule.itemFromPosition(pos, true);
				if (!cssProp) {
					// in case user just started writing CSS property
					// and didn't include semicolon–try another approach
					cssProp = utils.find(cssRule.list(), function(elem) {
						return elem.range(true).end == pos;
					});
				}
			}

			return cssProp;
		},
		
		/**
		 * Removes vendor prefix from CSS property
		 * @param {String} name CSS property
		 * @return {String}
		 */
		baseName: function(name) {
			return name.replace(/^\s*\-\w+\-/, '');
		},
		
		/**
		 * Finds parts of complex CSS value
		 * @param {String} str
		 * @returns {Array}
		 */
		findParts: findParts,

		extractPropertiesFromSource: extractPropertiesFromSource
	};
});
},{"../assets/range":"assets\\range.js","../assets/stringStream":"assets\\stringStream.js","../assets/tokenIterator":"assets\\tokenIterator.js","../parser/css":"parser\\css.js","../utils/common":"utils\\common.js","../utils/cssSections":"utils\\cssSections.js","./base":"editTree\\base.js"}],"editTree\\xml.js":[function(require,module,exports){
/**
 * XML EditTree is a module that can parse an XML/HTML element into a tree with 
 * convenient methods for adding, modifying and removing attributes. These 
 * changes can be written back to string with respect of code formatting.
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var editTree = require('./base');
	var xmlParser = require('../parser/xml');
	var range = require('../assets/range');
	var utils = require('../utils/common');

	var defaultOptions = {
		styleBefore: ' ',
		styleSeparator: '=',
		styleQuote: '"',
		offset: 0
	};
	
	var startTag = /^<([\w\:\-]+)((?:\s+[\w\-:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/m;
	
	var XMLEditContainer = editTree.EditContainer.extend({
		initialize: function(source, options) {
			utils.defaults(this.options, defaultOptions);
			this._positions.name = 1;
			
			var attrToken = null;
			var tokens = xmlParser.parse(source);
			
			tokens.forEach(function(token) {
				token.value = range.create(token).substring(source);
				switch (token.type) {
					case 'tag':
						if (/^<[^\/]+/.test(token.value)) {
							this._name = token.value.substring(1);
						}
						break;
						
					case 'attribute':
						// add empty attribute
						if (attrToken) {
							this._children.push(new XMLEditElement(this, attrToken));
						}
						
						attrToken = token;
						break;
						
					case 'string':
						this._children.push(new XMLEditElement(this, attrToken, token));
						attrToken = null;
						break;
				}
			}, this);
			
			if (attrToken) {
				this._children.push(new XMLEditElement(this, attrToken));
			}
			
			this._saveStyle();
		},
		
		/**
		 * Remembers all styles of properties
		 * @private
		 */
		_saveStyle: function() {
			var start = this.nameRange().end;
			var source = this.source;
			
			this.list().forEach(function(p) {
				p.styleBefore = source.substring(start, p.namePosition());
				
				if (p.valuePosition() !== -1) {
					p.styleSeparator = source.substring(p.namePosition() + p.name().length, p.valuePosition() - p.styleQuote.length);
				}
				
				start = p.range().end;
			});
		},
		
		/**
		 * Adds new attribute 
		 * @param {String} name Property name
		 * @param {String} value Property value
		 * @param {Number} pos Position at which to insert new property. By 
		 * default the property is inserted at the end of rule 
		 */
		add: function(name, value, pos) {
			var list = this.list();
			var start = this.nameRange().end;
			var styles = utils.pick(this.options, 'styleBefore', 'styleSeparator', 'styleQuote');
			
			if (typeof pos === 'undefined') {
				pos = list.length;
			}
			
			
			/** @type XMLEditAttribute */
			var donor = list[pos];
			if (donor) {
				start = donor.fullRange().start;
			} else if ((donor = list[pos - 1])) {
				start = donor.range().end;
			}
			
			if (donor) {
				styles = utils.pick(donor, 'styleBefore', 'styleSeparator', 'styleQuote');
			}
			
			value = styles.styleQuote + value + styles.styleQuote;
			
			var attribute = new XMLEditElement(this, 
					editTree.createToken(start + styles.styleBefore.length, name),
					editTree.createToken(start + styles.styleBefore.length + name.length 
							+ styles.styleSeparator.length, value)
					);
			
			utils.extend(attribute, styles);
			
			// write new attribute into the source
			this._updateSource(attribute.styleBefore + attribute.toString(), start);
			
			// insert new attribute
			this._children.splice(pos, 0, attribute);
			return attribute;
		},

		/**
		 * A special case of attribute editing: adds class value to existing
		 * `class` attribute
		 * @param {String} value
		 */
		addClass: function(value) {
			var attr = this.get('class');
			value = utils.trim(value);
			if (!attr) {
				return this.add('class', value);
			}

			var classVal = attr.value();
			var classList = ' ' + classVal.replace(/\n/g, ' ') + ' ';
			if (!~classList.indexOf(' ' + value + ' ')) {
				attr.value(classVal + ' ' + value);
			}
		},

		/**
		 * A special case of attribute editing: removes class value from existing
		 * `class` attribute
		 * @param {String} value
		 */
		removeClass: function(value) {
			var attr = this.get('class');
			value = utils.trim(value);
			if (!attr) {
				return;
			}

			var reClass = new RegExp('(^|\\s+)' + utils.escapeForRegexp(value));
			var classVal = attr.value().replace(reClass, '');
			if (!utils.trim(classVal)) {
				this.remove('class');
			} else {
				attr.value(classVal);
			}
		}
	});
	
	var XMLEditElement = editTree.EditElement.extend({
		initialize: function(parent, nameToken, valueToken) {
			this.styleBefore = parent.options.styleBefore;
			this.styleSeparator = parent.options.styleSeparator;
			
			var value = '', quote = parent.options.styleQuote;
			if (valueToken) {
				value = valueToken.value;
				quote = value.charAt(0);
				if (quote == '"' || quote == "'") {
					value = value.substring(1);
				} else {
					quote = '';
				}
				
				if (quote && value.charAt(value.length - 1) == quote) {
					value = value.substring(0, value.length - 1);
				}
			}
			
			this.styleQuote = quote;
			
			this._value = value;
			this._positions.value = valueToken ? valueToken.start + quote.length : -1;
		},
		
		/**
		 * Returns full rule range, with indentation
		 * @param {Boolean} isAbsolute Return absolute range (with respect of
		 * rule offset)
		 * @returns {Range}
		 */
		fullRange: function(isAbsolute) {
			var r = this.range(isAbsolute);
			r.start -= this.styleBefore.length;
			return r;
		},
		
		valueOf: function() {
			return this.name() + this.styleSeparator
				+ this.styleQuote + this.value() + this.styleQuote;
		}
	});
	
	return {
		/**
		 * Parses HTML element into editable tree
		 * @param {String} source
		 * @param {Object} options
		 * @memberOf emmet.htmlEditTree
		 * @returns {EditContainer}
		 */
		parse: function(source, options) {
			return new XMLEditContainer(source, options);
		},
		
		/**
		 * Extract and parse HTML from specified position in <code>content</code> 
		 * @param {String} content CSS source code
		 * @param {Number} pos Character position where to start source code extraction
		 * @returns {XMLEditElement}
		 */
		parseFromPosition: function(content, pos, isBackward) {
			var bounds = this.extractTag(content, pos, isBackward);
			if (!bounds || !bounds.inside(pos))
				// no matching HTML tag or caret outside tag bounds
				return null;
			
			return this.parse(bounds.substring(content), {
				offset: bounds.start
			});
		},
		
		/**
		 * Extracts nearest HTML tag range from <code>content</code>, starting at 
		 * <code>pos</code> position
		 * @param {String} content
		 * @param {Number} pos
		 * @param {Boolean} isBackward
		 * @returns {Range}
		 */
		extractTag: function(content, pos, isBackward) {
			var len = content.length, i;
			
			// max extraction length. I don't think there may be tags larger 
			// than 2000 characters length
			var maxLen = Math.min(2000, len);
			
			/** @type Range */
			var r = null;
			
			var match = function(pos) {
				var m;
				if (content.charAt(pos) == '<' && (m = content.substr(pos, maxLen).match(startTag)))
					return range.create(pos, m[0]);
			};
			
			// lookup backward, in case we are inside tag already
			for (i = pos; i >= 0; i--) {
				if ((r = match(i))) break;
			}
			
			if (r && (r.inside(pos) || isBackward))
				return r;
			
			if (!r && isBackward)
				return null;
			
			// search forward
			for (i = pos; i < len; i++) {
				if ((r = match(i)))
					return r;
			}
		}
	};
});
},{"../assets/range":"assets\\range.js","../parser/xml":"parser\\xml.js","../utils/common":"utils\\common.js","./base":"editTree\\base.js"}],"filter\\bem.js":[function(require,module,exports){
/**
 * Filter for aiding of writing elements with complex class names as described
 * in Yandex's BEM (Block, Element, Modifier) methodology. This filter will
 * automatically inherit block and element names from parent elements and insert
 * them into child element classes
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var htmlFilter = require('./html');
	var prefs = require('../assets/preferences');
	var abbreviationUtils = require('../utils/abbreviation');
	var utils = require('../utils/common');

	prefs.define('bem.elementSeparator', '__', 'Class name’s element separator.');
	prefs.define('bem.modifierSeparator', '_', 'Class name’s modifier separator.');
	prefs.define('bem.shortElementPrefix', '-', 
			'Symbol for describing short “block-element” notation. Class names '
			+ 'prefixed with this symbol will be treated as element name for parent‘s '
			+ 'block name. Each symbol instance traverses one level up in parsed ' 
			+ 'tree for block name lookup. Empty value will disable short notation.');
	
	var shouldRunHtmlFilter = false;
	
	function getSeparators() {
		return {
			element: prefs.get('bem.elementSeparator'),
			modifier: prefs.get('bem.modifierSeparator')
		};
	}

	/**
	 * @param {AbbreviationNode} item
	 */
	function bemParse(item) {
		if (abbreviationUtils.isSnippet(item))
			return item;
		
		// save BEM stuff in cache for faster lookups
		item.__bem = {
			block: '',
			element: '',
			modifier: ''
		};
		
		var classNames = normalizeClassName(item.attribute('class')).split(' ');
		
		// guess best match for block name
		var reBlockName = /^[a-z]\-/i;
		item.__bem.block = utils.find(classNames, function(name) {
			return reBlockName.test(name);
		});
		
		// guessing doesn't worked, pick first class name as block name
		if (!item.__bem.block) {
			reBlockName = /^[a-z]/i;
			item.__bem.block = utils.find(classNames, function(name) {
				return reBlockName.test(name);
			}) || '';
		}

		classNames = classNames.map(function(name) {
			return processClassName(name, item);
		});

		classNames = utils.unique(utils.flatten(classNames)).join(' ');
		if (classNames) {
			item.attribute('class', classNames);
		}
		
		return item;
	}
	
	/**
	 * @param {String} className
	 * @returns {String}
	 */
	function normalizeClassName(className) {
		className = (' ' + (className || '') + ' ').replace(/\s+/g, ' ');
		
		var shortSymbol = prefs.get('bem.shortElementPrefix');
		if (shortSymbol) {
			var re = new RegExp('\\s(' + utils.escapeForRegexp(shortSymbol) + '+)', 'g');
			className = className.replace(re, function(str, p1) {
				return ' ' + utils.repeatString(getSeparators().element, p1.length);
			});
		}
		
		return utils.trim(className);
	}
	
	/**
	 * Processes class name
	 * @param {String} name Class name item to process
	 * @param {AbbreviationNode} item Host node for provided class name
	 * @returns Processed class name. May return <code>Array</code> of
	 * class names 
	 */
	function processClassName(name, item) {
		name = transformClassName(name, item, 'element');
		name = transformClassName(name, item, 'modifier');
		
		// expand class name
		// possible values:
		// * block__element
		// * block__element_modifier
		// * block__element_modifier1_modifier2
		// * block_modifier
		var block = '', element = '', modifier = '';
		var separators = getSeparators();
		if (~name.indexOf(separators.element)) {
			var elements = name.split(separators.element);
			block = elements.shift();

			var modifiers = elements.pop().split(separators.modifier);
			elements.push(modifiers.shift());
			element = elements.join(separators.element);
			modifier = modifiers.join(separators.modifier);
		} else if (~name.indexOf(separators.modifier)) {
			var blockModifiers = name.split(separators.modifier);
			
			block = blockModifiers.shift();
			modifier = blockModifiers.join(separators.modifier);
		}
		
		if (block || element || modifier) {
			if (!block) {
				block = item.__bem.block;
			}
			
			// inherit parent bem element, if exists
//			if (item.parent && item.parent.__bem && item.parent.__bem.element)
//				element = item.parent.__bem.element + separators.element + element;
			
			// produce multiple classes
			var prefix = block;
			var result = [];
			
			if (element) {
				prefix += separators.element + element;
				result.push(prefix);
			} else {
				result.push(prefix);
			}
			
			if (modifier) {
				result.push(prefix + separators.modifier + modifier);
			}
			
			if (!item.__bem.block || modifier) {
				item.__bem.block = block;
			}
			
			item.__bem.element = element;
			item.__bem.modifier = modifier;
			
			return result;
		}
		
		// ...otherwise, return processed or original class name
		return name;
	}
	
	/**
	 * Low-level function to transform user-typed class name into full BEM class
	 * @param {String} name Class name item to process
	 * @param {AbbreviationNode} item Host node for provided class name
	 * @param {String} entityType Type of entity to be tried to transform 
	 * ('element' or 'modifier')
	 * @returns {String} Processed class name or original one if it can't be
	 * transformed
	 */
	function transformClassName(name, item, entityType) {
		var separators = getSeparators();
		var reSep = new RegExp('^(' + separators[entityType] + ')+', 'g');
		if (reSep.test(name)) {
			var depth = 0; // parent lookup depth
			var cleanName = name.replace(reSep, function(str) {
				depth = str.length / separators[entityType].length;
				return '';
			});
			
			// find donor element
			var donor = item;
			while (donor.parent && depth--) {
				donor = donor.parent;
			}
			
			if (!donor || !donor.__bem)
				donor = item;
			
			if (donor && donor.__bem) {
				var prefix = donor.__bem.block;
				
				// decide if we should inherit element name
//				if (entityType == 'element') {
//					var curElem = cleanName.split(separators.modifier, 1)[0];
//					if (donor.__bem.element && donor.__bem.element != curElem)
//						prefix += separators.element + donor.__bem.element;
//				}
				
				if (entityType == 'modifier' &&  donor.__bem.element)
					prefix += separators.element + donor.__bem.element;
				
				return prefix + separators[entityType] + cleanName;
			}
		}
		
		return name;
	}
	
	/**
	 * Recursive function for processing tags, which extends class names 
	 * according to BEM specs: http://bem.github.com/bem-method/pages/beginning/beginning.ru.html
	 * <br><br>
	 * It does several things:<br>
	 * <ul>
	 * <li>Expands complex class name (according to BEM symbol semantics):
	 * .block__elem_modifier → .block.block__elem.block__elem_modifier
	 * </li>
	 * <li>Inherits block name on child elements: 
	 * .b-block > .__el > .__el → .b-block > .b-block__el > .b-block__el__el
	 * </li>
	 * <li>Treats first dash symbol as '__'</li>
	 * <li>Double underscore (or typographic '–') is also treated as an element 
	 * level lookup, e.g. ____el will search for element definition in parent’s 
	 * parent element:
	 * .b-block > .__el1 > .____el2 → .b-block > .b-block__el1 > .b-block__el2
	 * </li>
	 * </ul>
	 * 
	 * @param {AbbreviationNode} tree
	 * @param {Object} profile
	 */
	function process(tree, profile) {
		if (tree.name) {
			bemParse(tree, profile);
		}
		
		tree.children.forEach(function(item) {
			process(item, profile);
			if (!abbreviationUtils.isSnippet(item) && item.start) {
				shouldRunHtmlFilter = true;
			}
		});
		
		return tree;
	}

	return function(tree, profile) {
		shouldRunHtmlFilter = false;
		tree = process(tree, profile);
		// in case 'bem' filter is applied after 'html' filter: run it again
		// to update output
		if (shouldRunHtmlFilter) {
			tree = htmlFilter(tree, profile);
		}
		
		return tree;
	};
});

},{"../assets/preferences":"assets\\preferences.js","../utils/abbreviation":"utils\\abbreviation.js","../utils/common":"utils\\common.js","./html":"filter\\html.js"}],"filter\\comment.js":[function(require,module,exports){
/**
 * Comment important tags (with 'id' and 'class' attributes)
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var prefs = require('../assets/preferences');
	var utils = require('../utils/common');
	var template = require('../utils/template');
	var abbrUtils = require('../utils/abbreviation');
	var filterCore = require('./main');
	
	prefs.define('filter.commentAfter', 
			'\n<!-- /<%= attr("id", "#") %><%= attr("class", ".") %> -->',
			'A definition of comment that should be placed <i>after</i> matched '
			+ 'element when <code>comment</code> filter is applied. This definition '
			+ 'is an ERB-style template passed to <code>_.template()</code> '
			+ 'function (see Underscore.js docs for details). In template context, '
			+ 'the following properties and functions are availabe:\n'
			+ '<ul>'
			
			+ '<li><code>attr(name, before, after)</code> – a function that outputs' 
			+ 'specified attribute value concatenated with <code>before</code> ' 
			+ 'and <code>after</code> strings. If attribute doesn\'t exists, the ' 
			+ 'empty string will be returned.</li>'
			
			+ '<li><code>node</code> – current node (instance of <code>AbbreviationNode</code>)</li>'
			
			+ '<li><code>name</code> – name of current tag</li>'
			
			+ '<li><code>padding</code> – current string padding, can be used ' 
			+ 'for formatting</li>'
			
			+'</ul>');
	
	prefs.define('filter.commentBefore', 
			'',
			'A definition of comment that should be placed <i>before</i> matched '
			+ 'element when <code>comment</code> filter is applied. '
			+ 'For more info, read description of <code>filter.commentAfter</code> '
			+ 'property');
	
	prefs.define('filter.commentTrigger', 'id, class',
			'A comma-separated list of attribute names that should exist in abbreviatoin '
			+ 'where comment should be added. If you wish to add comment for '
			+ 'every element, set this option to <code>*</code>');
	
	/**
	 * Add comments to tag
	 * @param {AbbreviationNode} node
	 */
	function addComments(node, templateBefore, templateAfter) {
		// check if comments should be added
		var trigger = prefs.get('filter.commentTrigger');
		if (trigger != '*') {
			var shouldAdd = utils.find(trigger.split(','), function(name) {
				return !!node.attribute(utils.trim(name));
			});

			if (!shouldAdd) {
				return;
			}
		}
		
		var ctx = {
			node: node,
			name: node.name(),
			padding: node.parent ? node.parent.padding : '',
			attr: function(name, before, after) {
				var attr = node.attribute(name);
				if (attr) {
					return (before || '') + attr + (after || '');
				}
				
				return '';
			}
		};
		
		var nodeBefore = templateBefore ? templateBefore(ctx) : '';
		var nodeAfter = templateAfter ? templateAfter(ctx) : '';
		
		node.start = node.start.replace(/</, nodeBefore + '<');
		node.end = node.end.replace(/>/, '>' + nodeAfter);
	}
	
	function process(tree, before, after) {
		tree.children.forEach(function(item) {
			if (abbrUtils.isBlock(item)) {
				addComments(item, before, after);
			}
			
			process(item, before, after);
		});
			
		return tree;
	}

	return function(tree) {
		var templateBefore = template(prefs.get('filter.commentBefore'));
		var templateAfter = template(prefs.get('filter.commentAfter'));
		
		return process(tree, templateBefore, templateAfter);
	};
});

},{"../assets/preferences":"assets\\preferences.js","../utils/abbreviation":"utils\\abbreviation.js","../utils/common":"utils\\common.js","../utils/template":"utils\\template.js","./main":"filter\\main.js"}],"filter\\css.js":[function(require,module,exports){
/**
 * Filter for outputting CSS and alike
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	/**
	 * Test if passed item is very first child in parsed tree
	 * @param {AbbreviationNode} item
	 */
	function isVeryFirstChild(item) {
		return item.parent && !item.parent.parent && !item.index();
	}

	return function process(tree, profile, level) {
		level = level || 0;
		
		tree.children.forEach(function(item) {
			if (!isVeryFirstChild(item) && profile.tag_nl !== false) {
				item.start = '\n' + item.start;
			}
			process(item, profile, level + 1);
		});
		
		return tree;
	};
});
},{}],"filter\\escape.js":[function(require,module,exports){
/**
 * Filter for escaping unsafe XML characters: <, >, &
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var charMap = {
		'<': '&lt;',
		'>': '&gt;',
		'&': '&amp;'
	};
	
	function escapeChars(str) {
		return str.replace(/([<>&])/g, function(str, p1){
			return charMap[p1];
		});
	}
	
	return function process(tree) {
		tree.children.forEach(function(item) {
			item.start = escapeChars(item.start);
			item.end = escapeChars(item.end);
			item.content = escapeChars(item.content);
			process(item);
		});
		
		return tree;
	};
});
},{}],"filter\\format.js":[function(require,module,exports){
/**
 * Generic formatting filter: creates proper indentation for each tree node,
 * placing "%s" placeholder where the actual output should be. You can use
 * this filter to preformat tree and then replace %s placeholder to whatever you
 * need. This filter should't be called directly from editor as a part 
 * of abbreviation.
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var abbrUtils = require('../utils/abbreviation');
	var prefs = require('../assets/preferences');
	var resources = require('../assets/resources');

	prefs.define('format.noIndentTags', 'html', 
			'A comma-separated list of tag names that should not get inner indentation.');
	
	prefs.define('format.forceIndentationForTags', 'body', 
		'A comma-separated list of tag names that should <em>always</em> get inner indentation.');

	var placeholder = '%s';
	
	/**
	 * Get indentation for given node
	 * @param {AbbreviationNode} node
	 * @returns {String}
	 */
	function getIndentation(node) {
		var items = prefs.getArray('format.noIndentTags') || [];
		if (~items.indexOf(node.name())) {
			return '';
		}
		
		return '\t';
	}
	
	/**
	 * Test if passed node has block-level sibling element
	 * @param {AbbreviationNode} item
	 * @return {Boolean}
	 */
	function hasBlockSibling(item) {
		return item.parent && abbrUtils.hasBlockChildren(item.parent);
	}
	
	/**
	 * Test if passed item is very first child in parsed tree
	 * @param {AbbreviationNode} item
	 */
	function isVeryFirstChild(item) {
		return item.parent && !item.parent.parent && !item.index();
	}
	
	/**
	 * Check if a newline should be added before element
	 * @param {AbbreviationNode} node
	 * @param {OutputProfile} profile
	 * @return {Boolean}
	 */
	function shouldAddLineBreak(node, profile) {
		if (profile.tag_nl === true || abbrUtils.isBlock(node))
			return true;
		
		if (!node.parent || !profile.inline_break)
			return false;
		
		// check if there are required amount of adjacent inline element
		return shouldFormatInline(node.parent, profile);
}
	
	/**
	 * Need to add newline because <code>item</code> has too many inline children
	 * @param {AbbreviationNode} node
	 * @param {OutputProfile} profile
	 */
	function shouldBreakChild(node, profile) {
		// we need to test only one child element, because 
		// hasBlockChildren() method will do the rest
		return node.children.length && shouldAddLineBreak(node.children[0], profile);
	}
	
	function shouldFormatInline(node, profile) {
		var nodeCount = 0;
		return !!utils.find(node.children, function(child) {
			if (child.isTextNode() || !abbrUtils.isInline(child))
				nodeCount = 0;
			else if (abbrUtils.isInline(child))
				nodeCount++;
			
			if (nodeCount >= profile.inline_break)
				return true;
		});
	}
	
	function isRoot(item) {
		return !item.parent;
	}
	
	/**
	 * Processes element with matched resource of type <code>snippet</code>
	 * @param {AbbreviationNode} item
	 * @param {OutputProfile} profile
	 */
	function processSnippet(item, profile) {
		item.start = item.end = '';
		if (!isVeryFirstChild(item) && profile.tag_nl !== false && shouldAddLineBreak(item, profile)) {
			// check if we’re not inside inline element
			if (isRoot(item.parent) || !abbrUtils.isInline(item.parent)) {
				item.start = '\n' + item.start;
			}
		}
		
		return item;
	}
	
	/**
	 * Check if we should add line breaks inside inline element
	 * @param {AbbreviationNode} node
	 * @param {OutputProfile} profile
	 * @return {Boolean}
	 */
	function shouldBreakInsideInline(node, profile) {
		var hasBlockElems = node.children.some(function(child) {
			if (abbrUtils.isSnippet(child))
				return false;
			
			return !abbrUtils.isInline(child);
		});
		
		if (!hasBlockElems) {
			return shouldFormatInline(node, profile);
		}
		
		return true;
	}
	
	/**
	 * Processes element with <code>tag</code> type
	 * @param {AbbreviationNode} item
	 * @param {OutputProfile} profile
	 */
	function processTag(item, profile) {
		item.start = item.end = placeholder;
		var isUnary = abbrUtils.isUnary(item);
		var nl = '\n';
		var indent = getIndentation(item);
			
		// formatting output
		if (profile.tag_nl !== false) {
			var forceNl = profile.tag_nl === true && (profile.tag_nl_leaf || item.children.length);
			if (!forceNl) {
				var forceIndentTags = prefs.getArray('format.forceIndentationForTags') || [];
				forceNl = ~forceIndentTags.indexOf(item.name());
			}
			
			// formatting block-level elements
			if (!item.isTextNode()) {
				if (shouldAddLineBreak(item, profile)) {
					// - do not indent the very first element
					// - do not indent first child of a snippet
					if (!isVeryFirstChild(item) && (!abbrUtils.isSnippet(item.parent) || item.index()))
						item.start = nl + item.start;
						
					if (abbrUtils.hasBlockChildren(item) || shouldBreakChild(item, profile) || (forceNl && !isUnary))
						item.end = nl + item.end;
						
					if (abbrUtils.hasTagsInContent(item) || (forceNl && !item.children.length && !isUnary))
						item.start += nl + indent;
				} else if (abbrUtils.isInline(item) && hasBlockSibling(item) && !isVeryFirstChild(item)) {
					item.start = nl + item.start;
				} else if (abbrUtils.isInline(item) && shouldBreakInsideInline(item, profile)) {
					item.end = nl + item.end;
				}
				
				item.padding = indent;
			}
		}
		
		return item;
	}

	/**
	 * Processes simplified tree, making it suitable for output as HTML structure
	 * @param {AbbreviationNode} tree
	 * @param {OutputProfile} profile
	 * @param {Number} level Depth level
	 */
	return function process(tree, profile, level) {
		level = level || 0;
	
		tree.children.forEach(function(item) {
			if (abbrUtils.isSnippet(item)) {
				processSnippet(item, profile, level);
			} else {
				processTag(item, profile, level);
			}
			
			process(item, profile, level + 1);
		});
		
		return tree;
	};
});
},{"../assets/preferences":"assets\\preferences.js","../assets/resources":"assets\\resources.js","../utils/abbreviation":"utils\\abbreviation.js","../utils/common":"utils\\common.js"}],"filter\\haml.js":[function(require,module,exports){
/**
 * Filter for producing HAML code from abbreviation.
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var abbrUtils = require('../utils/abbreviation');
	var formatFilter = require('./format');

	function transformClassName(className) {
		return utils.trim(className).replace(/\s+/g, '.');
	}

	/**
	 * Condenses all "data-" attributes into a single entry.
	 * HAML allows data attributes to be ouputted as a sub-hash
	 * of `:data` key
	 * @param  {Array} attrs
	 * @return {Array}
	 */
	function condenseDataAttrs(attrs) {
		var out = [], data = null;
		var reData = /^data-/i;
		attrs.forEach(function(attr) {
			if (reData.test(attr.name)) {
				if (!data) {
					data = [];
					out.push({
						name: 'data',
						value: data
					});
				}

				data.push(utils.extend({}, attr, {name: attr.name.replace(reData, '')}));
			} else {
				out.push(attr);
			}
		});

		return out;
	}

	function stringifyAttrs(attrs, profile) {
		var attrQuote = profile.attributeQuote();
		return '{' + attrs.map(function(attr) {
			var value = attrQuote + attr.value + attrQuote;
			if (Array.isArray(attr.value)) {
				value = stringifyAttrs(attr.value, profile);
			} else if (attr.isBoolean) {
				value = 'true';
			}

			return ':' + attr.name + ' => ' + value
		}).join(', ') + '}';
	}
	
	/**
	 * Creates HAML attributes string from tag according to profile settings
	 * @param {AbbreviationNode} tag
	 * @param {Object} profile
	 */
	function makeAttributesString(tag, profile) {
		var attrs = '';
		var otherAttrs = [];
		var attrQuote = profile.attributeQuote();
		var cursor = profile.cursor();
		
		tag.attributeList().forEach(function(a) {
			var attrName = profile.attributeName(a.name);
			switch (attrName.toLowerCase()) {
				// use short notation for ID and CLASS attributes
				case 'id':
					attrs += '#' + (a.value || cursor);
					break;
				case 'class':
					attrs += '.' + transformClassName(a.value || cursor);
					break;
				// process other attributes
				default:
					otherAttrs.push({
						name: attrName,
						value: a.value || cursor,
						isBoolean: profile.isBoolean(a.name, a.value)
					});
			}
		});
		
		if (otherAttrs.length) {
			attrs += stringifyAttrs(condenseDataAttrs(otherAttrs), profile);
		}
		
		return attrs;
	}
	
	/**
	 * Processes element with <code>tag</code> type
	 * @param {AbbreviationNode} item
	 * @param {OutputProfile} profile
	 */
	function processTag(item, profile) {
		if (!item.parent)
			// looks like it's root element
			return item;
		
		var attrs = makeAttributesString(item, profile);
		var cursor = profile.cursor();
		var isUnary = abbrUtils.isUnary(item);
		var selfClosing = profile.self_closing_tag && isUnary ? '/' : '';
		var start= '';
			
		// define tag name
		var tagName = '%' + profile.tagName(item.name());
		if (tagName.toLowerCase() == '%div' && attrs && attrs.indexOf('{') == -1)
			// omit div tag
			tagName = '';
			
		item.end = '';
		start = tagName + attrs + selfClosing;
		if (item.content && !/^\s/.test(item.content)) {
			item.content = ' ' + item.content;
		}
		
		var placeholder = '%s';
		// We can't just replace placeholder with new value because
		// JavaScript will treat double $ character as a single one, assuming
		// we're using RegExp literal.
		item.start = utils.replaceSubstring(item.start, start, item.start.indexOf(placeholder), placeholder);
		
		if (!item.children.length && !isUnary)
			item.start += cursor;
		
		return item;
	}

	return function process(tree, profile, level) {
		level = level || 0;
		
		if (!level) {
			tree = formatFilter(tree, '_format', profile);
		}
		
		tree.children.forEach(function(item) {
			if (!abbrUtils.isSnippet(item)) {
				processTag(item, profile, level);
			}
			
			process(item, profile, level + 1);
		});
		
		return tree;
	};
});
},{"../utils/abbreviation":"utils\\abbreviation.js","../utils/common":"utils\\common.js","./format":"filter\\format.js"}],"filter\\html.js":[function(require,module,exports){
/**
 * Filter that produces HTML tree
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var abbrUtils = require('../utils/abbreviation');
	var utils = require('../utils/common');
	var tabStops = require('../assets/tabStops');
	var formatFilter = require('./format');

	/**
	 * Creates HTML attributes string from tag according to profile settings
	 * @param {AbbreviationNode} node
	 * @param {OutputProfile} profile
	 */
	function makeAttributesString(node, profile) {
		var attrQuote = profile.attributeQuote();
		var cursor = profile.cursor();
		
		return node.attributeList().map(function(a) {
			var isBoolean = profile.isBoolean(a.name, a.value);
			var attrName = profile.attributeName(a.name);
			var attrValue = isBoolean ? attrName : a.value;
			if (isBoolean && profile.allowCompactBoolean()) {
				return ' ' + attrName;
			}
			return ' ' + attrName + '=' + attrQuote + (attrValue || cursor) + attrQuote;
		}).join('');
	}
	
	/**
	 * Processes element with <code>tag</code> type
	 * @param {AbbreviationNode} item
	 * @param {OutputProfile} profile
	 */
	function processTag(item, profile) {
		if (!item.parent) { // looks like it's root element
			return item;
		}
		
		var attrs = makeAttributesString(item, profile); 
		var cursor = profile.cursor();
		var isUnary = abbrUtils.isUnary(item);
		var start = '';
		var end = '';
			
		// define opening and closing tags
		if (!item.isTextNode()) {
			var tagName = profile.tagName(item.name());
			if (isUnary) {
				start = '<' + tagName + attrs + profile.selfClosing() + '>';
				item.end = '';
			} else {
				start = '<' + tagName + attrs + '>';
				end = '</' + tagName + '>';
			}
		}
		
		var placeholder = '%s';
		// We can't just replace placeholder with new value because
		// JavaScript will treat double $ character as a single one, assuming
		// we're using RegExp literal.
		item.start = utils.replaceSubstring(item.start, start, item.start.indexOf(placeholder), placeholder);
		item.end = utils.replaceSubstring(item.end, end, item.end.indexOf(placeholder), placeholder);
		
		// should we put caret placeholder after opening tag?
		if (
				!item.children.length 
				&& !isUnary 
				&& !~item.content.indexOf(cursor)
				&& !tabStops.extract(item.content).tabstops.length
			) {
			item.start += cursor;
		}
		
		return item;
	}

	return function process(tree, profile, level) {
		level = level || 0;
		
		if (!level) {
			tree = formatFilter(tree, profile, level)
		}
		
		tree.children.forEach(function(item) {
			if (!abbrUtils.isSnippet(item)) {
				processTag(item, profile, level);
			}
			
			process(item, profile, level + 1);
		});
		
		return tree;
	};
});
},{"../assets/tabStops":"assets\\tabStops.js","../utils/abbreviation":"utils\\abbreviation.js","../utils/common":"utils\\common.js","./format":"filter\\format.js"}],"filter\\jade.js":[function(require,module,exports){
/**
 * Filter for producing Jade code from abbreviation.
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var abbrUtils = require('../utils/abbreviation');
	var formatFilter = require('./format');
	var tabStops = require('../assets/tabStops');
	var profile = require('../assets/profile');

	var reNl = /[\n\r]/;
	var reIndentedText = /^\s*\|/;
	var reSpace = /^\s/;

	function transformClassName(className) {
		return utils.trim(className).replace(/\s+/g, '.');
	}

	function stringifyAttrs(attrs, profile) {
		var attrQuote = profile.attributeQuote();
		return '(' + attrs.map(function(attr) {
			if (attr.isBoolean) {
				return attr.name;
			}

			return attr.name + '=' + attrQuote + attr.value + attrQuote;
		}).join(', ') + ')';
	}
	
	/**
	 * Creates HAML attributes string from tag according to profile settings
	 * @param {AbbreviationNode} tag
	 * @param {Object} profile
	 */
	function makeAttributesString(tag, profile) {
		var attrs = '';
		var otherAttrs = [];
		var attrQuote = profile.attributeQuote();
		var cursor = profile.cursor();
		
		tag.attributeList().forEach(function(a) {
			var attrName = profile.attributeName(a.name);
			switch (attrName.toLowerCase()) {
				// use short notation for ID and CLASS attributes
				case 'id':
					attrs += '#' + (a.value || cursor);
					break;
				case 'class':
					attrs += '.' + transformClassName(a.value || cursor);
					break;
				// process other attributes
				default:
					otherAttrs.push({
						name: attrName,
						value: a.value || cursor,
						isBoolean: profile.isBoolean(a.name, a.value)
					});
			}
		});
		
		if (otherAttrs.length) {
			attrs += stringifyAttrs(otherAttrs, profile);
		}
		
		return attrs;
	}

	function processTagContent(item) {
		if (!item.content) {
			return;
		}

		var content = tabStops.replaceVariables(item.content, function(str, name) {
			if (name === 'nl' || name === 'newline') {
				return '\n';
			}
			return str;
		});

		if (reNl.test(content) && !reIndentedText.test(content)) {
			// multiline content: pad it with indentation and pipe
			var pad = '| ';
			item.content = '\n' + pad + utils.padString(content, pad);
		} else if (!reSpace.test(content)) {
			item.content = ' ' + content;
		}
	}
	
	/**
	 * Processes element with <code>tag</code> type
	 * @param {AbbreviationNode} item
	 * @param {OutputProfile} profile
	 */
	function processTag(item, profile) {
		if (!item.parent)
			// looks like it's a root (empty) element
			return item;
		
		var attrs = makeAttributesString(item, profile);
		var cursor = profile.cursor();
		var isUnary = abbrUtils.isUnary(item);
			
		// define tag name
		var tagName = profile.tagName(item.name());
		if (tagName.toLowerCase() == 'div' && attrs && attrs.charAt(0) != '(')
			// omit div tag
			tagName = '';
			
		item.end = '';
		var start = tagName + attrs;
		processTagContent(item);

		var placeholder = '%s';
		// We can't just replace placeholder with new value because
		// JavaScript will treat double $ character as a single one, assuming
		// we're using RegExp literal.
		item.start = utils.replaceSubstring(item.start, start, item.start.indexOf(placeholder), placeholder);
		
		if (!item.children.length && !isUnary)
			item.start += cursor;
		
		return item;
	}

	return function process(tree, curProfile, level) {
		level = level || 0;
		
		if (!level) {
			// always format with `xml` profile since
			// Jade requires all tags to be on separate lines
			tree = formatFilter(tree, profile.get('xml'));
		}
		
		tree.children.forEach(function(item) {
			if (!abbrUtils.isSnippet(item)) {
				processTag(item, curProfile, level);
			}
			
			process(item, curProfile, level + 1);
		});
		
		return tree;
	};
});
},{"../assets/profile":"assets\\profile.js","../assets/tabStops":"assets\\tabStops.js","../utils/abbreviation":"utils\\abbreviation.js","../utils/common":"utils\\common.js","./format":"filter\\format.js"}],"filter\\jsx.js":[function(require,module,exports){
/**
 * A filter for React.js (JSX):
 * ranames attributes like `class` and `for`
 * for proper representation in JSX
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var attrMap = {
		'class': 'className',
		'for': 'htmlFor'
	};

	return function process(tree) {
		tree.children.forEach(function(item) {
			item._attributes.forEach(function(attr) {
				if (attr.name in attrMap) {
					attr.name = attrMap[attr.name]
				}
			});
			process(item);
		});

		return tree;
	};
});
},{}],"filter\\main.js":[function(require,module,exports){
/**
 * Module for handling filters
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var profile = require('../assets/profile');
	var resources = require('../assets/resources');

	/** List of registered filters */
	var registeredFilters = {
		html: require('./html'),
		haml: require('./haml'),
		jade: require('./jade'),
		jsx: require('./jsx'),
		slim: require('./slim'),
		xsl: require('./xsl'),
		css: require('./css'),
		bem: require('./bem'),
		c: require('./comment'),
		e: require('./escape'),
		s: require('./singleLine'),
		t: require('./trim')
	};
	
	/** Filters that will be applied for unknown syntax */
	var basicFilters = 'html';
	
	function list(filters) {
		if (!filters)
			return [];
		
		if (typeof filters === 'string') {
			return filters.split(/[\|,]/g);
		}
		
		return filters;
	}
	
	return  {
		/**
		 * Register new filter
		 * @param {String} name Filter name
		 * @param {Function} fn Filter function
		 */
		add: function(name, fn) {
			registeredFilters[name] = fn;
		},
		
		/**
		 * Apply filters for final output tree
		 * @param {AbbreviationNode} tree Output tree
		 * @param {Array} filters List of filters to apply. Might be a 
		 * <code>String</code>
		 * @param {Object} profile Output profile, defined in <i>profile</i> 
		 * module. Filters defined it profile are not used, <code>profile</code>
		 * is passed to filter function
		 * @memberOf emmet.filters
		 * @returns {AbbreviationNode}
		 */
		apply: function(tree, filters, profileName) {
			profileName = profile.get(profileName);
			
			list(filters).forEach(function(filter) {
				var name = utils.trim(filter.toLowerCase());
				if (name && name in registeredFilters) {
					tree = registeredFilters[name](tree, profileName);
				}
			});
			
			return tree;
		},
		
		/**
		 * Composes list of filters that should be applied to a tree, based on 
		 * passed data
		 * @param {String} syntax Syntax name ('html', 'css', etc.)
		 * @param {Object} profile Output profile
		 * @param {String} additionalFilters List or pipe-separated
		 * string of additional filters to apply
		 * @returns {Array}
		 */
		composeList: function(syntax, profileName, additionalFilters) {
			profileName = profile.get(profileName);
			var filters = list(profileName.filters || resources.findItem(syntax, 'filters') || basicFilters);
			
			if (profileName.extraFilters) {
				filters = filters.concat(list(profileName.extraFilters));
			}
				
			if (additionalFilters) {
				filters = filters.concat(list(additionalFilters));
			}
				
			if (!filters || !filters.length) {
				// looks like unknown syntax, apply basic filters
				filters = list(basicFilters);
			}
				
			return filters;
		},
		
		/**
		 * Extracts filter list from abbreviation
		 * @param {String} abbr
		 * @returns {Array} Array with cleaned abbreviation and list of 
		 * extracted filters
		 */
		extract: function(abbr) {
			var filters = '';
			abbr = abbr.replace(/\|([\w\|\-]+)$/, function(str, p1){
				filters = p1;
				return '';
			});
			
			return [abbr, list(filters)];
		}
	};
});
},{"../assets/profile":"assets\\profile.js","../assets/resources":"assets\\resources.js","../utils/common":"utils\\common.js","./bem":"filter\\bem.js","./comment":"filter\\comment.js","./css":"filter\\css.js","./escape":"filter\\escape.js","./haml":"filter\\haml.js","./html":"filter\\html.js","./jade":"filter\\jade.js","./jsx":"filter\\jsx.js","./singleLine":"filter\\singleLine.js","./slim":"filter\\slim.js","./trim":"filter\\trim.js","./xsl":"filter\\xsl.js"}],"filter\\singleLine.js":[function(require,module,exports){
/**
 * Output abbreviation on a single line (i.e. no line breaks)
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var abbrUtils = require('../utils/abbreviation');
	var rePad = /^\s+/;
	var reNl = /[\n\r]/g;

	return function process(tree) {
		tree.children.forEach(function(item) {
			if (!abbrUtils.isSnippet(item)) {
				// remove padding from item 
				item.start = item.start.replace(rePad, '');
				item.end = item.end.replace(rePad, '');
			}
			
			// remove newlines 
			item.start = item.start.replace(reNl, '');
			item.end = item.end.replace(reNl, '');
			item.content = item.content.replace(reNl, '');
			
			process(item);
		});
		
		return tree;
	};
});

},{"../utils/abbreviation":"utils\\abbreviation.js"}],"filter\\slim.js":[function(require,module,exports){
/**
 * Filter for producing Jade code from abbreviation.
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var abbrUtils = require('../utils/abbreviation');
	var formatFilter = require('./format');
	var tabStops = require('../assets/tabStops');
	var prefs = require('../assets/preferences');
	var profile = require('../assets/profile');

	var reNl = /[\n\r]/;
	var reIndentedText = /^\s*\|/;
	var reSpace = /^\s/;

	prefs.define('slim.attributesWrapper', 'none', 
		'Defines how attributes will be wrapped:' +
		'<ul>' +
		'<li><code>none</code> – no wrapping;</li>' +
		'<li><code>round</code> — wrap attributes with round braces;</li>' +
		'<li><code>square</code> — wrap attributes with round braces;</li>' +
		'<li><code>curly</code> — wrap attributes with curly braces.</li>' +
		'</ul>');

	function transformClassName(className) {
		return utils.trim(className).replace(/\s+/g, '.');
	}

	function getAttrWrapper() {
		var start = ' ', end = '';
		switch (prefs.get('slim.attributesWrapper')) {
			case 'round':
				start = '(';
				end = ')';
				break;
			case 'square':
				start = '[';
				end = ']';
				break;
			case 'curly':
				start = '{';
				end = '}';
				break;
		}

		return {
			start: start,
			end: end
		};
	}

	function stringifyAttrs(attrs, profile) {
		var attrQuote = profile.attributeQuote();
		var attrWrap = getAttrWrapper();
		return attrWrap.start + attrs.map(function(attr) {
			var value = attrQuote + attr.value + attrQuote;
			if (attr.isBoolean) {
				if (!attrWrap.end) {
					value = 'true';
				} else {
					return attr.name;
				}
			}

			return attr.name + '=' + value;
		}).join(' ') + attrWrap.end;
	}
	
	/**
	 * Creates HAML attributes string from tag according to profile settings
	 * @param {AbbreviationNode} tag
	 * @param {Object} profile
	 */
	function makeAttributesString(tag, profile) {
		var attrs = '';
		var otherAttrs = [];
		var attrQuote = profile.attributeQuote();
		var cursor = profile.cursor();
		
		tag.attributeList().forEach(function(a) {
			var attrName = profile.attributeName(a.name);
			switch (attrName.toLowerCase()) {
				// use short notation for ID and CLASS attributes
				case 'id':
					attrs += '#' + (a.value || cursor);
					break;
				case 'class':
					attrs += '.' + transformClassName(a.value || cursor);
					break;
				// process other attributes
				default:
					otherAttrs.push({
						name: attrName,
						value: a.value || cursor,
						isBoolean: profile.isBoolean(a.name, a.value)
					});
			}
		});
		
		if (otherAttrs.length) {
			attrs += stringifyAttrs(otherAttrs, profile);
		}
		
		return attrs;
	}

	function processTagContent(item) {
		if (!item.content) {
			return;
		}

		var content = tabStops.replaceVariables(item.content, function(str, name) {
			if (name === 'nl' || name === 'newline') {
				return '\n';
			}
			return str;
		});

		if (reNl.test(content) && !reIndentedText.test(content)) {
			// multiline content: pad it with indentation and pipe
			var pad = '  ';
			item.content = '\n| ' + utils.padString(content, pad);
		} else if (!reSpace.test(content)) {
			item.content = ' ' + content;
		}
	}
	
	/**
	 * Processes element with <code>tag</code> type
	 * @param {AbbreviationNode} item
	 * @param {OutputProfile} profile
	 */
	function processTag(item, profile) {
		if (!item.parent)
			// looks like it's a root (empty) element
			return item;
		
		var attrs = makeAttributesString(item, profile);
		var cursor = profile.cursor();
		var isUnary = abbrUtils.isUnary(item);
		var selfClosing = profile.self_closing_tag && isUnary ? '/' : '';
			
		// define tag name
		var tagName = profile.tagName(item.name());
		if (tagName.toLowerCase() == 'div' && attrs && '([{'.indexOf(attrs.charAt(0)) == -1)
			// omit div tag
			tagName = '';
			
		item.end = '';
		var start = tagName + attrs + selfClosing;
		processTagContent(item);

		var placeholder = '%s';
		// We can't just replace placeholder with new value because
		// JavaScript will treat double $ character as a single one, assuming
		// we're using RegExp literal.
		item.start = utils.replaceSubstring(item.start, start, item.start.indexOf(placeholder), placeholder);
		
		if (!item.children.length && !isUnary)
			item.start += cursor;
		
		return item;
	}

	return function process(tree, curProfile, level) {
		level = level || 0;
		
		if (!level) {
			// always format with `xml` profile since
			// Slim requires all tags to be on separate lines
			tree = formatFilter(tree, profile.get('xml'));
		}
		
		tree.children.forEach(function(item) {
			if (!abbrUtils.isSnippet(item)) {
				processTag(item, curProfile, level);
			}
			
			process(item, curProfile, level + 1);
		});
		
		return tree;
	};
});
},{"../assets/preferences":"assets\\preferences.js","../assets/profile":"assets\\profile.js","../assets/tabStops":"assets\\tabStops.js","../utils/abbreviation":"utils\\abbreviation.js","../utils/common":"utils\\common.js","./format":"filter\\format.js"}],"filter\\trim.js":[function(require,module,exports){
/**
 * Trim filter: removes characters at the beginning of the text
 * content that indicates lists: numbers, #, *, -, etc.
 * 
 * Useful for wrapping lists with abbreviation.
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var prefs = require('../assets/preferences');
	prefs.define('filter.trimRegexp', 
		'[\\s|\\u00a0]*[\\d|#|\\-|\*|\\u2022]+\\.?\\s*',
		'Regular expression used to remove list markers (numbers, dashes, ' 
		+ 'bullets, etc.) in <code>t</code> (trim) filter. The trim filter '
		+ 'is useful for wrapping with abbreviation lists, pased from other ' 
		+ 'documents (for example, Word documents).');
	
	function process(tree, re) {
		tree.children.forEach(function(item) {
			if (item.content) {
				item.content = item.content.replace(re, '');
			}
			
			process(item, re);
		});
		
		return tree;
	}

	return function(tree) {
		var re = new RegExp(prefs.get('filter.trimRegexp'));
		return process(tree, re);
	};
});

},{"../assets/preferences":"assets\\preferences.js"}],"filter\\xsl.js":[function(require,module,exports){
/**
 * Filter for trimming "select" attributes from some tags that contains
 * child elements
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var abbrUtils = require('../utils/abbreviation');

	var tags = {
		'xsl:variable': 1,
		'xsl:with-param': 1
	};
	
	/**
	 * Removes "select" attribute from node
	 * @param {AbbreviationNode} node
	 */
	function trimAttribute(node) {
		node.start = node.start.replace(/\s+select\s*=\s*(['"]).*?\1/, '');
	}

	return function process(tree) {
		tree.children.forEach(function(item) {
			if (!abbrUtils.isSnippet(item)
					&& (item.name() || '').toLowerCase() in tags 
					&& item.children.length)
				trimAttribute(item);
			process(item);
		});
		
		return tree;
	};
});
},{"../utils/abbreviation":"utils\\abbreviation.js"}],"generator\\lorem.js":[function(require,module,exports){
/**
 * "Lorem ipsum" text generator. Matches <code>lipsum(num)?</code> or 
 * <code>lorem(num)?</code> abbreviation.
 * This code is based on Django's contribution: 
 * https://code.djangoproject.com/browser/django/trunk/django/contrib/webdesign/lorem_ipsum.py
 * <br><br>
 * Examples to test:<br>
 * <code>lipsum</code> – generates 30 words text.<br>
 * <code>lipsum*6</code> – generates 6 paragraphs (autowrapped with &lt;p&gt; element) of text.<br>
 * <code>ol>lipsum10*5</code> — generates ordered list with 5 list items (autowrapped with &lt;li&gt; tag)
 * with text of 10 words on each line.<br>
 * <code>span*3>lipsum20</code> – generates 3 paragraphs of 20-words text, each wrapped with &lt;span&gt; element.
 * Each paragraph phrase is unique.   
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var prefs = require('../assets/preferences');

	var langs = {
		en: {
			common: ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipisicing', 'elit'],
			words: ['exercitationem', 'perferendis', 'perspiciatis', 'laborum', 'eveniet',
				'sunt', 'iure', 'nam', 'nobis', 'eum', 'cum', 'officiis', 'excepturi',
				'odio', 'consectetur', 'quasi', 'aut', 'quisquam', 'vel', 'eligendi',
				'itaque', 'non', 'odit', 'tempore', 'quaerat', 'dignissimos',
				'facilis', 'neque', 'nihil', 'expedita', 'vitae', 'vero', 'ipsum',
				'nisi', 'animi', 'cumque', 'pariatur', 'velit', 'modi', 'natus',
				'iusto', 'eaque', 'sequi', 'illo', 'sed', 'ex', 'et', 'voluptatibus',
				'tempora', 'veritatis', 'ratione', 'assumenda', 'incidunt', 'nostrum',
				'placeat', 'aliquid', 'fuga', 'provident', 'praesentium', 'rem',
				'necessitatibus', 'suscipit', 'adipisci', 'quidem', 'possimus',
				'voluptas', 'debitis', 'sint', 'accusantium', 'unde', 'sapiente',
				'voluptate', 'qui', 'aspernatur', 'laudantium', 'soluta', 'amet',
				'quo', 'aliquam', 'saepe', 'culpa', 'libero', 'ipsa', 'dicta',
				'reiciendis', 'nesciunt', 'doloribus', 'autem', 'impedit', 'minima',
				'maiores', 'repudiandae', 'ipsam', 'obcaecati', 'ullam', 'enim',
				'totam', 'delectus', 'ducimus', 'quis', 'voluptates', 'dolores',
				'molestiae', 'harum', 'dolorem', 'quia', 'voluptatem', 'molestias',
				'magni', 'distinctio', 'omnis', 'illum', 'dolorum', 'voluptatum', 'ea',
				'quas', 'quam', 'corporis', 'quae', 'blanditiis', 'atque', 'deserunt',
				'laboriosam', 'earum', 'consequuntur', 'hic', 'cupiditate',
				'quibusdam', 'accusamus', 'ut', 'rerum', 'error', 'minus', 'eius',
				'ab', 'ad', 'nemo', 'fugit', 'officia', 'at', 'in', 'id', 'quos',
				'reprehenderit', 'numquam', 'iste', 'fugiat', 'sit', 'inventore',
				'beatae', 'repellendus', 'magnam', 'recusandae', 'quod', 'explicabo',
				'doloremque', 'aperiam', 'consequatur', 'asperiores', 'commodi',
				'optio', 'dolor', 'labore', 'temporibus', 'repellat', 'veniam',
				'architecto', 'est', 'esse', 'mollitia', 'nulla', 'a', 'similique',
				'eos', 'alias', 'dolore', 'tenetur', 'deleniti', 'porro', 'facere',
				'maxime', 'corrupti']
		},
		sp: {
			common: ['mujer', 'uno', 'dolor', 'más', 'de', 'poder', 'mismo', 'si'],
			words: ['ejercicio', 'preferencia', 'perspicacia', 'laboral', 'paño',
				'suntuoso', 'molde', 'namibia', 'planeador', 'mirar', 'demás', 'oficinista', 'excepción',
				'odio', 'consecuencia', 'casi', 'auto', 'chicharra', 'velo', 'elixir',
				'ataque', 'no', 'odio', 'temporal', 'cuórum', 'dignísimo',
				'facilismo', 'letra', 'nihilista', 'expedición', 'alma', 'alveolar', 'aparte',
				'león', 'animal', 'como', 'paria', 'belleza', 'modo', 'natividad',
				'justo', 'ataque', 'séquito', 'pillo', 'sed', 'ex', 'y', 'voluminoso',
				'temporalidad', 'verdades', 'racional', 'asunción', 'incidente', 'marejada',
				'placenta', 'amanecer', 'fuga', 'previsor', 'presentación', 'lejos',
				'necesariamente', 'sospechoso', 'adiposidad', 'quindío', 'pócima',
				'voluble', 'débito', 'sintió', 'accesorio', 'falda', 'sapiencia',
				'volutas', 'queso', 'permacultura', 'laudo', 'soluciones', 'entero',
				'pan', 'litro', 'tonelada', 'culpa', 'libertario', 'mosca', 'dictado',
				'reincidente', 'nascimiento', 'dolor', 'escolar', 'impedimento', 'mínima',
				'mayores', 'repugnante', 'dulce', 'obcecado', 'montaña', 'enigma',
				'total', 'deletéreo', 'décima', 'cábala', 'fotografía', 'dolores',
				'molesto', 'olvido', 'paciencia', 'resiliencia', 'voluntad', 'molestias',
				'magnífico', 'distinción', 'ovni', 'marejada', 'cerro', 'torre', 'y',
				'abogada', 'manantial', 'corporal', 'agua', 'crepúsculo', 'ataque', 'desierto',
				'laboriosamente', 'angustia', 'afortunado', 'alma', 'encefalograma',
				'materialidad', 'cosas', 'o', 'renuncia', 'error', 'menos', 'conejo',
				'abadía', 'analfabeto', 'remo', 'fugacidad', 'oficio', 'en', 'almácigo', 'vos', 'pan',
				'represión', 'números', 'triste', 'refugiado', 'trote', 'inventor',
				'corchea', 'repelente', 'magma', 'recusado', 'patrón', 'explícito',
				'paloma', 'síndrome', 'inmune', 'autoinmune', 'comodidad',
				'ley', 'vietnamita', 'demonio', 'tasmania', 'repeler', 'apéndice',
				'arquitecto', 'columna', 'yugo', 'computador', 'mula', 'a', 'propósito',
				'fantasía', 'alias', 'rayo', 'tenedor', 'deleznable', 'ventana', 'cara',
				'anemia', 'corrupto']
		},
		ru: {
			common: ['далеко-далеко', 'за', 'словесными', 'горами', 'в стране', 'гласных', 'и согласных', 'живут', 'рыбные', 'тексты'],
			words: ['вдали', 'от всех', 'они', 'буквенных', 'домах', 'на берегу', 'семантика', 
				'большого', 'языкового', 'океана', 'маленький', 'ручеек', 'даль', 
				'журчит', 'по всей', 'обеспечивает', 'ее','всеми', 'необходимыми', 
				'правилами', 'эта', 'парадигматическая', 'страна', 'которой', 'жаренные', 
				'предложения', 'залетают', 'прямо', 'рот', 'даже', 'всемогущая', 
				'пунктуация', 'не', 'имеет', 'власти', 'над', 'рыбными', 'текстами', 
				'ведущими', 'безорфографичный', 'образ', 'жизни', 'однажды', 'одна', 
				'маленькая', 'строчка','рыбного', 'текста', 'имени', 'lorem', 'ipsum', 
				'решила', 'выйти', 'большой', 'мир', 'грамматики', 'великий', 'оксмокс', 
				'предупреждал', 'о', 'злых', 'запятых', 'диких', 'знаках', 'вопроса', 
				'коварных', 'точках', 'запятой', 'но', 'текст', 'дал', 'сбить', 
				'себя', 'толку', 'он', 'собрал', 'семь', 'своих', 'заглавных', 'букв', 
				'подпоясал', 'инициал', 'за', 'пояс', 'пустился', 'дорогу', 
				'взобравшись', 'первую', 'вершину', 'курсивных', 'гор', 'бросил', 
				'последний', 'взгляд', 'назад', 'силуэт', 'своего', 'родного', 'города', 
				'буквоград', 'заголовок', 'деревни', 'алфавит', 'подзаголовок', 'своего', 
				'переулка', 'грустный', 'реторический', 'вопрос', 'скатился', 'его', 
				'щеке', 'продолжил', 'свой', 'путь', 'дороге', 'встретил', 'рукопись', 
				'она', 'предупредила',  'моей', 'все', 'переписывается', 'несколько', 
				'раз', 'единственное', 'что', 'меня', 'осталось', 'это', 'приставка', 
				'возвращайся', 'ты', 'лучше', 'свою', 'безопасную', 'страну', 'послушавшись', 
				'рукописи', 'наш', 'продолжил', 'свой', 'путь', 'вскоре', 'ему', 
				'повстречался', 'коварный', 'составитель', 'рекламных', 'текстов', 
				'напоивший', 'языком', 'речью', 'заманивший', 'свое', 'агентство', 
				'которое', 'использовало', 'снова', 'снова', 'своих', 'проектах', 
				'если', 'переписали', 'то', 'живет', 'там', 'до', 'сих', 'пор']
		}
	};

	
	prefs.define('lorem.defaultLang', 'en', 
		'Default language of generated dummy text. Currently, <code>en</code>\
		and <code>ru</code> are supported, but users can add their own syntaxes\
		see <a href="http://docs.emmet.io/abbreviations/lorem-ipsum/">docs</a>.');
	prefs.define('lorem.omitCommonPart', false,
		'Omit commonly used part (e.g. “Lorem ipsum dolor sit amet“) from generated text.');
	
	/**
	 * Returns random integer between <code>from</code> and <code>to</code> values
	 * @param {Number} from
	 * @param {Number} to
	 * @returns {Number}
	 */
	function randint(from, to) {
		return Math.round(Math.random() * (to - from) + from);
	}
	
	/**
	 * @param {Array} arr
	 * @param {Number} count
	 * @returns {Array}
	 */
	function sample(arr, count) {
		var len = arr.length;
		var iterations = Math.min(len, count);
		var result = [];
		while (result.length < iterations) {
			var randIx = randint(0, len - 1);
			if (!~result.indexOf(randIx)) {
				result.push(randIx);
			}
		}
		
		return result.map(function(ix) {
			return arr[ix];
		});
	}
	
	function choice(val) {
		if (typeof val === 'string')
			return val.charAt(randint(0, val.length - 1));
		
		return val[randint(0, val.length - 1)];
	}
	
	function sentence(words, end) {
		if (words.length) {
			words[0] = words[0].charAt(0).toUpperCase() + words[0].substring(1);
		}
		
		return words.join(' ') + (end || choice('?!...')); // more dots than question marks
	}
	
	/**
	 * Insert commas at randomly selected words. This function modifies values
	 * inside <code>words</code> array 
	 * @param {Array} words
	 */
	function insertCommas(words) {
		var len = words.length;

		if (len < 2) {
			return;
		}

		var totalCommas = 0;
		if (len > 3 && len <= 6) {
			totalCommas = randint(0, 1);
		} else if (len > 6 && len <= 12) {
			totalCommas = randint(0, 2);
		} else {
			totalCommas = randint(1, 4);
		}

		for (var i = 0, pos, word; i < totalCommas; i++) {
			pos = randint(0, words.length - 2);
			word = words[pos];
			if (word.charAt(word.length - 1) !== ',') {
				words[pos] += ',';
			}
		}
	}
	
	/**
	 * Generate a paragraph of "Lorem ipsum" text
	 * @param {Number} wordCount Words count in paragraph
	 * @param {Boolean} startWithCommon Should paragraph start with common 
	 * "lorem ipsum" sentence.
	 * @returns {String}
	 */
	function paragraph(lang, wordCount, startWithCommon) {
		var data = langs[lang];
		if (!data) {
			return '';
		}

		var result = [];
		var totalWords = 0;
		var words;
		
		wordCount = parseInt(wordCount, 10);
		
		if (startWithCommon && data.common) {
			words = data.common.slice(0, wordCount);
			if (words.length > 5) {
				words[4] += ',';
			}
			totalWords += words.length;
			result.push(sentence(words, '.'));
		}
		
		while (totalWords < wordCount) {
			words = sample(data.words, Math.min(randint(2, 30), wordCount - totalWords));
			totalWords += words.length;
			insertCommas(words);
			result.push(sentence(words));
		}
		
		return result.join(' ');
	}

	return {
		/**
		 * Adds new language words for Lorem Ipsum generator
		 * @param {String} lang Two-letter lang definition
		 * @param {Object} data Words for language. Maight be either a space-separated 
		 * list of words (String), Array of words or object with <code>text</code> and
		 * <code>common</code> properties
		 */
		addLang: function(lang, data) {
			if (typeof data === 'string') {
				data = {
					words: data.split(' ').filter(function(item) {
						return !!item;
					})
				};
			} else if (Array.isArray(data)) {
				data = {words: data};
			}

			langs[lang] = data;
		},
		preprocessor: function(tree) {
			var re = /^(?:lorem|lipsum)([a-z]{2})?(\d*)$/i, match;
			var allowCommon = !prefs.get('lorem.omitCommonPart');
			
			/** @param {AbbreviationNode} node */
			tree.findAll(function(node) {
				if (node._name && (match = node._name.match(re))) {
					var wordCound = match[2] || 30;
					var lang = match[1] || prefs.get('lorem.defaultLang') || 'en';
					
					// force node name resolving if node should be repeated
					// or contains attributes. In this case, node should be outputed
					// as tag, otherwise as text-only node
					node._name = '';
					node.data('forceNameResolving', node.isRepeating() || node.attributeList().length);
					node.data('pasteOverwrites', true);
					node.data('paste', function(i) {
						return paragraph(lang, wordCound, !i && allowCommon);
					});
				}
			});
		}
	};
});

},{"../assets/preferences":"assets\\preferences.js"}],"parser\\abbreviation.js":[function(require,module,exports){
/**
 * Emmet abbreviation parser.
 * Takes string abbreviation and recursively parses it into a tree. The parsed 
 * tree can be transformed into a string representation with 
 * <code>toString()</code> method. Note that string representation is defined
 * by custom processors (called <i>filters</i>), not by abbreviation parser 
 * itself.
 * 
 * This module can be extended with custom pre-/post-processors to shape-up
 * final tree or its representation. Actually, many features of abbreviation 
 * engine are defined in other modules as tree processors
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var tabStops = require('../assets/tabStops');
	var profile = require('../assets/profile');
	var filters = require('../filter/main');
	var utils = require('../utils/common');
	var abbreviationUtils = require('../utils/abbreviation');
	var stringStream = require('../assets/stringStream');

	// pre- and post-processorcs
	var lorem = require('../generator/lorem');
	var procPastedContent = require('./processor/pastedContent');
	var procTagName = require('./processor/tagName');
	var procResourceMatcher = require('./processor/resourceMatcher');
	var procAttributes = require('./processor/attributes');
	var procHref = require('./processor/href');

	var reValidName = /^[\w\-\$\:@\!%]+\+?$/i;
	var reWord = /[\w\-:\$@]/;
	var DEFAULT_ATTR_NAME = '%default';
	
	var pairs = {
		'[': ']',
		'(': ')',
		'{': '}'
	};
	
	var spliceFn = Array.prototype.splice;
	
	var preprocessors = [];
	var postprocessors = [];
	var outputProcessors = [];
	
	/**
	 * @type AbbreviationNode
	 */
	function AbbreviationNode(parent) {
		/** @type AbbreviationNode */
		this.parent = null;
		this.children = [];
		this._attributes = [];
		
		/** @type String Raw abbreviation for current node */
		this.abbreviation = '';
		this.counter = 1;
		this._name = null;
		this._text = '';
		this.repeatCount = 1;
		this.hasImplicitRepeat = false;
		
		/** Custom data dictionary */
		this._data = {};
		
		// output properties
		this.start = '';
		this.end = '';
		this.content = '';
		this.padding = '';
	}
	
	AbbreviationNode.prototype = {
		/**
		 * Adds passed node as child or creates new child
		 * @param {AbbreviationNode} child
		 * @param {Number} position Index in children array where child should 
		 * be inserted
		 * @return {AbbreviationNode}
		 */
		addChild: function(child, position) {
			child = child || new AbbreviationNode();
			child.parent = this;
			
			if (typeof position === 'undefined') {
				this.children.push(child);
			} else {
				this.children.splice(position, 0, child);
			}
			
			return child;
		},
		
		/**
		 * Creates a deep copy of current node
		 * @returns {AbbreviationNode}
		 */
		clone: function() {
			var node = new AbbreviationNode();
			var attrs = ['abbreviation', 'counter', '_name', '_text', 'repeatCount', 'hasImplicitRepeat', 'start', 'end', 'content', 'padding'];
			attrs.forEach(function(a) {
				node[a] = this[a];
			}, this);
			
			// clone attributes
			node._attributes = this._attributes.map(function(attr) {
				return utils.extend({}, attr);
			});
			
			node._data = utils.extend({}, this._data);
			
			// clone children
			node.children = this.children.map(function(child) {
				child = child.clone();
				child.parent = node;
				return child;
			});
			
			return node;
		},
		
		/**
		 * Removes current node from parent‘s child list
		 * @returns {AbbreviationNode} Current node itself
		 */
		remove: function() {
			if (this.parent) {
				var ix = this.parent.children.indexOf(this);
				if (~ix) {
					this.parent.children.splice(ix, 1);
				}
			}
			
			return this;
		},
		
		/**
		 * Replaces current node in parent‘s children list with passed nodes
		 * @param {AbbreviationNode} node Replacement node or array of nodes
		 */
		replace: function() {
			var parent = this.parent;
			var ix = parent.children.indexOf(this);
			var items = utils.flatten(arguments);
			spliceFn.apply(parent.children, [ix, 1].concat(items));
			
			// update parent
			items.forEach(function(item) {
				item.parent = parent;
			});
		},
		
		/**
		 * Recursively sets <code>property</code> to <code>value</code> of current
		 * node and its children 
		 * @param {String} name Property to update
		 * @param {Object} value New property value
		 */
		updateProperty: function(name, value) {
			this[name] = value;
			this.children.forEach(function(child) {
				child.updateProperty(name, value);
			});
			
			return this;
		},
		
		/**
		 * Finds first child node that matches truth test for passed 
		 * <code>fn</code> function
		 * @param {Function} fn
		 * @returns {AbbreviationNode}
		 */
		find: function(fn) {
			return this.findAll(fn, {amount: 1})[0];
		},
		
		/**
		 * Finds all child nodes that matches truth test for passed 
		 * <code>fn</code> function
		 * @param {Function} fn
		 * @returns {Array}
		 */
		findAll: function(fn, state) {
			state = utils.extend({amount: 0, found: 0}, state || {});

			if (typeof fn !== 'function') {
				var elemName = fn.toLowerCase();
				fn = function(item) {return item.name().toLowerCase() == elemName;};
			}
				
			var result = [];
			this.children.forEach(function(child) {
				if (fn(child)) {
					result.push(child);
					state.found++;
					if (state.amount && state.found >= state.amount) {
						return;
					}
				}
				
				result = result.concat(child.findAll(fn));
			});
			
			return result.filter(function(item) {
				return !!item;
			});
		},
		
		/**
		 * Sets/gets custom data
		 * @param {String} name
		 * @param {Object} value
		 * @returns {Object}
		 */
		data: function(name, value) {
			if (arguments.length == 2) {
				this._data[name] = value;
			}
			
			return this._data[name];
		},
		
		/**
		 * Returns name of current node
		 * @returns {String}
		 */
		name: function() {
			return this._name;
		},
		
		/**
		 * Returns list of attributes for current node
		 * @returns {Array}
		 */
		attributeList: function() {
			return optimizeAttributes(this._attributes.slice(0));
		},
		
		/**
		 * Returns or sets attribute value
		 * @param {String} name Attribute name
		 * @param {String} value New attribute value. `Null` value 
		 * will remove attribute
		 * @returns {String}
		 */
		attribute: function(name, value) {
			if (arguments.length == 2) {
				if (value === null) {
					// remove attribute
					var vals = this._attributes.filter(function(attr) {
						return attr.name === name;
					});

					var that = this;
					vals.forEach(function(attr) {
						var ix = that._attributes.indexOf(attr);
						if (~ix) {
							that._attributes.splice(ix, 1);
						}
					});

					return;
				}

				// modify attribute
				var attrNames = this._attributes.map(function(attr) {
					return attr.name;
				});
				var ix = attrNames.indexOf(name.toLowerCase());
				if (~ix) {
					this._attributes[ix].value = value;
				} else {
					this._attributes.push({
						name: name,
						value: value
					});
				}
			}
			
			return (utils.find(this.attributeList(), function(attr) {
				return attr.name == name;
			}) || {}).value;
		},
		
		/**
		 * Returns index of current node in parent‘s children list
		 * @returns {Number}
		 */
		index: function() {
			return this.parent ? this.parent.children.indexOf(this) : -1;
		},
		
		/**
		 * Sets how many times current element should be repeated
		 * @private
		 */
		_setRepeat: function(count) {
			if (count) {
				this.repeatCount = parseInt(count, 10) || 1;
			} else {
				this.hasImplicitRepeat = true;
			}
		},
		
		/**
		 * Sets abbreviation that belongs to current node
		 * @param {String} abbr
		 */
		setAbbreviation: function(abbr) {
			abbr = abbr || '';
			
			var that = this;
			
			// find multiplier
			abbr = abbr.replace(/\*(\d+)?$/, function(str, repeatCount) {
				that._setRepeat(repeatCount);
				return '';
			});
			
			this.abbreviation = abbr;
			
			var abbrText = extractText(abbr);
			if (abbrText) {
				abbr = abbrText.element;
				this.content = this._text = abbrText.text;
			}
			
			var abbrAttrs = parseAttributes(abbr);
			if (abbrAttrs) {
				abbr = abbrAttrs.element;
				this._attributes = abbrAttrs.attributes;
			}
			
			this._name = abbr;
			
			// validate name
			if (this._name && !reValidName.test(this._name)) {
				throw new Error('Invalid abbreviation');
			}
		},
		
		/**
		 * Returns string representation of current node
		 * @return {String}
		 */
		valueOf: function() {
			var start = this.start;
			var end = this.end;
			var content = this.content;
			
			// apply output processors
			var node = this;
			outputProcessors.forEach(function(fn) {
				start = fn(start, node, 'start');
				content = fn(content, node, 'content');
				end = fn(end, node, 'end');
			});
			
			
			var innerContent = this.children.map(function(child) {
				return child.valueOf();
			}).join('');
			
			content = abbreviationUtils.insertChildContent(content, innerContent, {
				keepVariable: false
			});
			
			return start + utils.padString(content, this.padding) + end;
		},

		toString: function() {
			return this.valueOf();
		},
		
		/**
		 * Check if current node contains children with empty <code>expr</code>
		 * property
		 * @return {Boolean}
		 */
		hasEmptyChildren: function() {
			return !!utils.find(this.children, function(child) {
				return child.isEmpty();
			});
		},
		
		/**
		 * Check if current node has implied name that should be resolved
		 * @returns {Boolean}
		 */
		hasImplicitName: function() {
			return !this._name && !this.isTextNode();
		},
		
		/**
		 * Indicates that current element is a grouping one, e.g. has no 
		 * representation but serves as a container for other nodes
		 * @returns {Boolean}
		 */
		isGroup: function() {
			return !this.abbreviation;
		},
		
		/**
		 * Indicates empty node (i.e. without abbreviation). It may be a 
		 * grouping node and should not be outputted
		 * @return {Boolean}
		 */
		isEmpty: function() {
			return !this.abbreviation && !this.children.length;
		},
		
		/**
		 * Indicates that current node should be repeated
		 * @returns {Boolean}
		 */
		isRepeating: function() {
			return this.repeatCount > 1 || this.hasImplicitRepeat;
		},
		
		/**
		 * Check if current node is a text-only node
		 * @return {Boolean}
		 */
		isTextNode: function() {
			return !this.name() && !this.attributeList().length;
		},
		
		/**
		 * Indicates whether this node may be used to build elements or snippets
		 * @returns {Boolean}
		 */
		isElement: function() {
			return !this.isEmpty() && !this.isTextNode();
		},
		
		/**
		 * Returns latest and deepest child of current tree
		 * @returns {AbbreviationNode}
		 */
		deepestChild: function() {
			if (!this.children.length)
				return null;
				
			var deepestChild = this;
			while (deepestChild.children.length) {
				deepestChild = deepestChild.children[deepestChild.children.length - 1];
			}
			
			return deepestChild;
		}
	};
	
	/**
	 * Returns stripped string: a string without first and last character.
	 * Used for “unquoting” strings
	 * @param {String} str
	 * @returns {String}
	 */
	function stripped(str) {
		return str.substring(1, str.length - 1);
	}
	
	function consumeQuotedValue(stream, quote) {
		var ch;
		while ((ch = stream.next())) {
			if (ch === quote)
				return true;
			
			if (ch == '\\')
				continue;
		}
		
		return false;
	}
	
	/**
	 * Parses abbreviation into a tree
	 * @param {String} abbr
	 * @returns {AbbreviationNode}
	 */
	function parseAbbreviation(abbr) {
		abbr = utils.trim(abbr);
		
		var root = new AbbreviationNode();
		var context = root.addChild(), ch;
		
		/** @type StringStream */
		var stream = stringStream.create(abbr);
		var loopProtector = 1000, multiplier;
		var addChild = function(child) {
			context.addChild(child);
		};

		var consumeAbbr = function() {
			stream.start = stream.pos;
			stream.eatWhile(function(c) {
				if (c == '[' || c == '{') {
					if (stream.skipToPair(c, pairs[c])) {
						stream.backUp(1);
						return true;
					}
					
					throw new Error('Invalid abbreviation: mo matching "' + pairs[c] + '" found for character at ' + stream.pos);
				}
				
				if (c == '+') {
					// let's see if this is an expando marker
					stream.next();
					var isMarker = stream.eol() ||  ~'+>^*'.indexOf(stream.peek());
					stream.backUp(1);
					return isMarker;
				}
				
				return c != '(' && isAllowedChar(c);
			});
		};
		
		while (!stream.eol() && --loopProtector > 0) {
			ch = stream.peek();
			
			switch (ch) {
				case '(': // abbreviation group
					stream.start = stream.pos;
					if (stream.skipToPair('(', ')')) {
						var inner = parseAbbreviation(stripped(stream.current()));
						if ((multiplier = stream.match(/^\*(\d+)?/, true))) {
							context._setRepeat(multiplier[1]);
						}
						
						inner.children.forEach(addChild);
					} else {
						throw new Error('Invalid abbreviation: mo matching ")" found for character at ' + stream.pos);
					}
					break;
					
				case '>': // child operator
					context = context.addChild();
					stream.next();
					break;
					
				case '+': // sibling operator
					context = context.parent.addChild();
					stream.next();
					break;
					
				case '^': // climb up operator
					var parent = context.parent || context;
					context = (parent.parent || parent).addChild();
					stream.next();
					break;
					
				default: // consume abbreviation
					consumeAbbr();
					context.setAbbreviation(stream.current());
					stream.start = stream.pos;
			}
		}
		
		if (loopProtector < 1) {
			throw new Error('Endless loop detected');
		}
		
		return root;
	}

	/**
	 * Splits attribute set into a list of attributes string
	 * @param  {String} attrSet 
	 * @return {Array}
	 */
	function splitAttributes(attrSet) {
		attrSet = utils.trim(attrSet);
		var parts = [];

		// split attribute set by spaces
		var stream = stringStream(attrSet), ch;
		while ((ch = stream.next())) {
			if (ch == ' ') {
				parts.push(utils.trim(stream.current()));
				// skip spaces
				while (stream.peek() == ' ') {
					stream.next();
				}

				stream.start = stream.pos;
			} else if (ch == '"' || ch == "'") {
				// skip values in strings
				if (!stream.skipString(ch)) {
					throw new Error('Invalid attribute set');
				}
			}
		}

		parts.push(utils.trim(stream.current()));
		return parts;
	}

	/**
	 * Removes opening and closing quotes from given string
	 * @param  {String} str
	 * @return {String}
	 */
	function unquote(str) {
		var ch = str.charAt(0);
		if (ch == '"' || ch == "'") {
			str = str.substr(1);
			var last = str.charAt(str.length - 1);
			if (last === ch) {
				str = str.substr(0, str.length - 1);
			}
		}

		return str;
	}

	/**
	 * Extract attributes and their values from attribute set: 
	 * <code>[attr col=3 title="Quoted string"]</code> (without square braces)
	 * @param {String} attrSet
	 * @returns {Array}
	 */
	function extractAttributes(attrSet) {
		var reAttrName = /^[\w\-:\$@]+\.?$/;
		return splitAttributes(attrSet).map(function(attr) {
			// attribute name: [attr]
			if (reAttrName.test(attr)) {
				var value = '';
				if (attr.charAt(attr.length - 1) == '.') {
					// a boolean attribute
					attr = attr.substr(0, attr.length - 1);
					value = attr;
				}
				return {
					name: attr,
					value: value
				};
			}

			// attribute with value: [name=val], [name="val"]
			if (~attr.indexOf('=')) {
				var parts = attr.split('=');
				return {
					name: parts.shift(),
					value: unquote(parts.join('='))
				};
			}

			// looks like it’s implied attribute
			return {
				name: DEFAULT_ATTR_NAME,
				value: unquote(attr)
			};
		});
	}
	
	/**
	 * Parses tag attributes extracted from abbreviation. If attributes found, 
	 * returns object with <code>element</code> and <code>attributes</code>
	 * properties
	 * @param {String} abbr
	 * @returns {Object} Returns <code>null</code> if no attributes found in 
	 * abbreviation
	 */
	function parseAttributes(abbr) {
		/*
		 * Example of incoming data:
		 * #header
		 * .some.data
		 * .some.data#header
		 * [attr]
		 * #item[attr=Hello other="World"].class
		 */
		var result = [];
		var attrMap = {'#': 'id', '.': 'class'};
		var nameEnd = null;
		
		/** @type StringStream */
		var stream = stringStream.create(abbr);
		while (!stream.eol()) {
			switch (stream.peek()) {
				case '#': // id
				case '.': // class
					if (nameEnd === null)
						nameEnd = stream.pos;
					
					var attrName = attrMap[stream.peek()];
					
					stream.next();
					stream.start = stream.pos;
					stream.eatWhile(reWord);
					result.push({
						name: attrName, 
						value: stream.current()
					});
					break;
				case '[': //begin attribute set
					if (nameEnd === null)
						nameEnd = stream.pos;
					
					stream.start = stream.pos;
					if (!stream.skipToPair('[', ']')) {
						throw new Error('Invalid attribute set definition');
					}
					
					result = result.concat(
						extractAttributes(stripped(stream.current()))
					);
					break;
				default:
					stream.next();
			}
		}
		
		if (!result.length)
			return null;
		
		return {
			element: abbr.substring(0, nameEnd),
			attributes: optimizeAttributes(result)
		};
	}
	
	/**
	 * Optimize attribute set: remove duplicates and merge class attributes
	 * @param attrs
	 */
	function optimizeAttributes(attrs) {
		// clone all attributes to make sure that original objects are 
		// not modified
		attrs = attrs.map(function(attr) {
			return utils.clone(attr);
		});
		
		var lookup = {};

		return attrs.filter(function(attr) {
			if (!(attr.name in lookup)) {
				return lookup[attr.name] = attr;
			}
			
			var la = lookup[attr.name];
			
			if (attr.name.toLowerCase() == 'class') {
				la.value += (la.value.length ? ' ' : '') + attr.value;
			} else {
				la.value = attr.value;
				la.isImplied = !!attr.isImplied;
			}
			
			return false;
		});
	}
	
	/**
	 * Extract text data from abbreviation: if <code>a{hello}</code> abbreviation
	 * is passed, returns object <code>{element: 'a', text: 'hello'}</code>.
	 * If nothing found, returns <code>null</code>
	 * @param {String} abbr
	 * 
	 */
	function extractText(abbr) {
		if (!~abbr.indexOf('{'))
			return null;
		
		/** @type StringStream */
		var stream = stringStream.create(abbr);
		while (!stream.eol()) {
			switch (stream.peek()) {
				case '[':
				case '(':
					stream.skipToPair(stream.peek(), pairs[stream.peek()]); break;
					
				case '{':
					stream.start = stream.pos;
					stream.skipToPair('{', '}');
					return {
						element: abbr.substring(0, stream.start),
						text: stripped(stream.current())
					};
					
				default:
					stream.next();
			}
		}
	}
	
	/**
	 * “Un-rolls“ contents of current node: recursively replaces all repeating 
	 * children with their repeated clones
	 * @param {AbbreviationNode} node
	 * @returns {AbbreviationNode}
	 */
	function unroll(node) {
		for (var i = node.children.length - 1, j, child, maxCount; i >= 0; i--) {
			child = node.children[i];
			
			if (child.isRepeating()) {
				maxCount = j = child.repeatCount;
				child.repeatCount = 1;
				child.updateProperty('counter', 1);
				child.updateProperty('maxCount', maxCount);
				while (--j > 0) {
					child.parent.addChild(child.clone(), i + 1)
						.updateProperty('counter', j + 1)
						.updateProperty('maxCount', maxCount);
				}
			}
		}
		
		// to keep proper 'counter' property, we need to walk
		// on children once again
		node.children.forEach(unroll);
		
		return node;
	}
	
	/**
	 * Optimizes tree node: replaces empty nodes with their children
	 * @param {AbbreviationNode} node
	 * @return {AbbreviationNode}
	 */
	function squash(node) {
		for (var i = node.children.length - 1; i >= 0; i--) {
			/** @type AbbreviationNode */
			var n = node.children[i];
			if (n.isGroup()) {
				n.replace(squash(n).children);
			} else if (n.isEmpty()) {
				n.remove();
			}
		}
		
		node.children.forEach(squash);
		
		return node;
	}
	
	function isAllowedChar(ch) {
		var charCode = ch.charCodeAt(0);
		var specialChars = '#.*:$-_!@|%';
		
		return (charCode > 64 && charCode < 91)       // uppercase letter
				|| (charCode > 96 && charCode < 123)  // lowercase letter
				|| (charCode > 47 && charCode < 58)   // number
				|| specialChars.indexOf(ch) != -1;    // special character
	}

	// XXX add counter replacer function as output processor
	outputProcessors.push(function(text, node) {
		return utils.replaceCounter(text, node.counter, node.maxCount);
	});

	// XXX add tabstop updater
	outputProcessors.push(tabStops.abbrOutputProcessor.bind(tabStops));

	// include default pre- and postprocessors
	[lorem, procResourceMatcher, procAttributes, procPastedContent, procTagName, procHref].forEach(function(mod) {
		if (mod.preprocessor) {
			preprocessors.push(mod.preprocessor.bind(mod));
		}

		if (mod.postprocessor) {
			postprocessors.push(mod.postprocessor.bind(mod));
		}
	});

	return {
		DEFAULT_ATTR_NAME: DEFAULT_ATTR_NAME,

		/**
		 * Parses abbreviation into tree with respect of groups, 
		 * text nodes and attributes. Each node of the tree is a single 
		 * abbreviation. Tree represents actual structure of the outputted 
		 * result
		 * @memberOf abbreviationParser
		 * @param {String} abbr Abbreviation to parse
		 * @param {Object} options Additional options for parser and processors
		 * 
		 * @return {AbbreviationNode}
		 */
		parse: function(abbr, options) {
			options = options || {};
			
			var tree = parseAbbreviation(abbr);
			var that = this;
			
			if (options.contextNode) {
				// add info about context node –
				// a parent XHTML node in editor inside which abbreviation is 
				// expanded
				tree._name = options.contextNode.name;
				var attrLookup = {};
				tree._attributes.forEach(function(attr) {
					attrLookup[attr.name] = attr;
				});
				
				options.contextNode.attributes.forEach(function(attr) {
					if (attr.name in attrLookup) {
						attrLookup[attr.name].value = attr.value;
					} else {
						attr = utils.clone(attr);
						tree._attributes.push(attr);
						attrLookup[attr.name] = attr;
					}
				});
			}
			
			// apply preprocessors
			preprocessors.forEach(function(fn) {
				fn(tree, options, that);
			});

			if ('counter' in options) {
				tree.updateProperty('counter', options.counter);
			}
			
			tree = squash(unroll(tree));
			
			// apply postprocessors
			postprocessors.forEach(function(fn) {
				fn(tree, options, that);
			});
			
			return tree;
		},

		/**
		 * Expands given abbreviation into a formatted code structure.
		 * This is the main method that is used for expanding abbreviation
		 * @param {String} abbr Abbreviation to expand
		 * @param {Options} options Additional options for abbreviation
		 * expanding and transformation: `syntax`, `profile`, `contextNode` etc.
		 * @return {String}
		 */
		expand: function(abbr, options) {
			if (!abbr) return '';
			if (typeof options == 'string') {
				throw new Error('Deprecated use of `expand` method: `options` must be object');
			}

			options = options || {};

			if (!options.syntax) {
				options.syntax = utils.defaultSyntax();
			}

			var p = profile.get(options.profile, options.syntax);
			tabStops.resetTabstopIndex();
			
			var data = filters.extract(abbr);
			var outputTree = this.parse(data[0], options);

			var filtersList = filters.composeList(options.syntax, p, data[1]);
			filters.apply(outputTree, filtersList, p);

			return outputTree.valueOf();
		},
		
		AbbreviationNode: AbbreviationNode,
		
		/**
		 * Add new abbreviation preprocessor. <i>Preprocessor</i> is a function
		 * that applies to a parsed abbreviation tree right after it get parsed.
		 * The passed tree is in unoptimized state.
		 * @param {Function} fn Preprocessor function. This function receives
		 * two arguments: parsed abbreviation tree (<code>AbbreviationNode</code>)
		 * and <code>options</code> hash that was passed to <code>parse</code>
		 * method
		 */
		addPreprocessor: function(fn) {
			if (!~preprocessors.indexOf(fn)) {
				preprocessors.push(fn);
			}
		},
		
		/**
		 * Removes registered preprocessor
		 */
		removeFilter: function(fn) {
			var ix = preprocessors.indexOf(fn);
			if (~ix) {
				preprocessors.splice(ix, 1);
			}
		},
		
		/**
		 * Adds new abbreviation postprocessor. <i>Postprocessor</i> is a 
		 * functinon that applies to <i>optimized</i> parsed abbreviation tree
		 * right before it returns from <code>parse()</code> method
		 * @param {Function} fn Postprocessor function. This function receives
		 * two arguments: parsed abbreviation tree (<code>AbbreviationNode</code>)
		 * and <code>options</code> hash that was passed to <code>parse</code>
		 * method
		 */
		addPostprocessor: function(fn) {
			if (!~postprocessors.indexOf(fn)) {
				postprocessors.push(fn);
			}
		},
		
		/**
		 * Removes registered postprocessor function
		 */
		removePostprocessor: function(fn) {
			var ix = postprocessors.indexOf(fn);
			if (~ix) {
				postprocessors.splice(ix, 1);
			}
		},
		
		/**
		 * Registers output postprocessor. <i>Output processor</i> is a 
		 * function that applies to output part (<code>start</code>, 
		 * <code>end</code> and <code>content</code>) when 
		 * <code>AbbreviationNode.toString()</code> method is called
		 */
		addOutputProcessor: function(fn) {
			if (!~outputProcessors.indexOf(fn)) {
				outputProcessors.push(fn);
			}
		},
		
		/**
		 * Removes registered output processor
		 */
		removeOutputProcessor: function(fn) {
			var ix = outputProcessors.indexOf(fn);
			if (~ix) {
				outputProcessors.splice(ix, 1);
			}
		},
		
		/**
		 * Check if passed symbol is valid symbol for abbreviation expression
		 * @param {String} ch
		 * @return {Boolean}
		 */
		isAllowedChar: function(ch) {
			ch = String(ch); // convert Java object to JS
			return isAllowedChar(ch) || ~'>+^[](){}'.indexOf(ch);
		}
	};
});
},{"../assets/profile":"assets\\profile.js","../assets/stringStream":"assets\\stringStream.js","../assets/tabStops":"assets\\tabStops.js","../filter/main":"filter\\main.js","../generator/lorem":"generator\\lorem.js","../utils/abbreviation":"utils\\abbreviation.js","../utils/common":"utils\\common.js","./processor/attributes":"parser\\processor\\attributes.js","./processor/href":"parser\\processor\\href.js","./processor/pastedContent":"parser\\processor\\pastedContent.js","./processor/resourceMatcher":"parser\\processor\\resourceMatcher.js","./processor/tagName":"parser\\processor\\tagName.js"}],"parser\\css.js":[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var session = {tokens: null};
	
	// walks around the source
	var walker = {
		init: function (source) {
			// this.source = source.replace(/\r\n?/g, '\n');
			this.source = source;
			this.ch = '';
			this.chnum = -1;
		
			// advance
			this.nextChar();
		},
		nextChar: function () {
			return this.ch = this.source.charAt(++this.chnum);
		},
		peek: function() {
			return this.source.charAt(this.chnum + 1);
		}
	};

	// utility helpers
	function isNameChar(c, cc) {
		cc = cc || c.charCodeAt(0);
		return (
			(cc >= 97 && cc <= 122 /* a-z */) || 
			(cc >= 65 && cc <= 90 /* A-Z */) || 
			/* 
			Experimental: include cyrillic ranges 
			since some letters, similar to latin ones, can 
			accidentally appear in CSS tokens
			*/
			(cc >= 1024 && cc <= 1279) || 
			c === '&' || /* selector placeholder (LESS, SCSS) */
			c === '_' || 
			c === '<' || /* comparisons (LESS, SCSS) */
			c === '>' || 
			c === '=' || 
			c === '-'
		);
	}

	function isDigit(c, cc) {
		cc = cc || c.charCodeAt(0);
		return (cc >= 48 && cc <= 57);
	}

	var isOp = (function () {
		var opsa = "{}[]()+*=.,;:>~|\\%$#@^!".split(''),
			opsmatcha = "*^|$~".split(''),
			ops = {},
			opsmatch = {},
			i = 0;
		for (; i < opsa.length; i += 1) {
			ops[opsa[i]] = true;
		}
		for (i = 0; i < opsmatcha.length; i += 1) {
			opsmatch[opsmatcha[i]] = true;
		}
		return function (ch, matchattr) {
			if (matchattr) {
				return ch in opsmatch;
			}
			return ch in ops;
		};
	}());
	
	// creates token objects and pushes them to a list
	function tokener(value, type) {
		session.tokens.push({
			value: value,
			type:  type || value,
			start: null,
			end:   null
		});
	}

	function getPosInfo(w) {
		var errPos = w.chnum;
		var source = w.source.replace(/\r\n?/g, '\n');
		var part = w.source.substring(0, errPos + 1).replace(/\r\n?/g, '\n');
		var lines = part.split('\n');
		var ch = (lines[lines.length - 1] || '').length;
		var fullLine = source.split('\n')[lines.length - 1] || '';
		
		var chunkSize = 100;
		var offset = Math.max(0, ch - chunkSize);
		var formattedLine = fullLine.substr(offset, chunkSize * 2) + '\n';
		for (var i = 0; i < ch - offset - 1; i++) {
			formattedLine += '-';
		}
		formattedLine += '^';

		return {
			line: lines.length,
			ch: ch,
			text: fullLine,
			hint: formattedLine
		};
	}

	function raiseError(message) {
		var err = error(message);
		var errObj = new Error(err.message, '', err.line);
		errObj.line = err.line;
		errObj.ch = err.ch;
		errObj.name = err.name;
		errObj.hint = err.hint;

		throw errObj;
	}
	
	// oops
	function error(m) { 
		var w = walker;
		var info = getPosInfo(walker);
		var tokens = session.tokens;
		session.tokens = null;

		var message = 'CSS parsing error at line ' + info.line + ', char ' + info.ch + ': ' + m;
		message += '\n' +  info.hint;
		return {
			name: "ParseError",
			message: message,
			hint: info.hint,
			line: info.line,
			ch: info.ch
		};
	}


	// token handlers follow for:
	// white space, comment, string, identifier, number, operator
	function white() {
		var c = walker.ch,
			token = '';
	
		while (c === " " || c === "\t") {
			token += c;
			c = walker.nextChar();
		}
	
		tokener(token, 'white');
	
	}

	function comment() {
		var w = walker,
			c = w.ch,
			token = c,
			cnext;
	 
		cnext = w.nextChar();

		if (cnext === '/') {
			// inline comment in SCSS and LESS
			while (c && !(cnext === "\n" || cnext === "\r")) {
				token += cnext;
				c = cnext;
				cnext = w.nextChar();
			}
		} else if (cnext === '*') {
			// multiline CSS commment
			while (c && !(c === "*" && cnext === "/")) {
				token += cnext;
				c = cnext;
				cnext = w.nextChar();
			}
		} else {
			// oops, not a comment, just a /
			return tokener(token, token);
		}
		
		token += cnext;
		w.nextChar();
		tokener(token, 'comment');
	}

	function eatString() {
		var w = walker,
			c = w.ch,
			q = c,
			token = c,
			cnext;
	
		c = w.nextChar();

		while (c !== q) {
			if (c === '\n') {
				cnext = w.nextChar();
				if (cnext === "\\") {
					token += c + cnext;
				} else {
					// end of line with no \ escape = bad
					raiseError("Unterminated string");
				}
			} else if (c === '') {
				raiseError("Unterminated string");
			} else {
				if (c === "\\") {
					token += c + w.nextChar();
				} else {
					token += c;
				}
			}
		
			c = w.nextChar();
		}

		token += c;

		return token;
	}

	function str() {
		var token = eatString();
		walker.nextChar();
		tokener(token, 'string');
	}
	
	function brace() {
		var w = walker,
			c = w.ch,
			depth = 1,
			token = c,
			stop = false;
	
		c = w.nextChar();
	
		while (c && !stop) {
			if (c === '(') {
				depth++;
			} else if (c === ')') {
				depth--;
				if (!depth) {
					stop = true;
				}
			} else if (c === '"' || c === "'") {
				c = eatString();
			} else if (c === '') {
				raiseError("Unterminated brace");
			}
			
			token += c;
			c = w.nextChar();
		}
		
		tokener(token, 'brace');
	}

	function identifier(pre) {
		var c = walker.ch;
		var token = pre ? pre + c : c;
			
		c = walker.nextChar();
		var cc = c.charCodeAt(0);
		while (isNameChar(c, cc) || isDigit(c, cc)) {
			token += c;
			c = walker.nextChar();
			cc = c.charCodeAt(0);
		}
	
		tokener(token, 'identifier');
	}

	function num() {
		var w = walker,
			c = w.ch,
			token = c,
			point = token === '.',
			nondigit;
		
		c = w.nextChar();
		nondigit = !isDigit(c);
	
		// .2px or .classname?
		if (point && nondigit) {
			// meh, NaN, could be a class name, so it's an operator for now
			return tokener(token, '.');    
		}
		
		// -2px or -moz-something
		if (token === '-' && nondigit) {
			return identifier('-');
		}
	
		while (c !== '' && (isDigit(c) || (!point && c === '.'))) { // not end of source && digit or first instance of .
			if (c === '.') {
				point = true;
			}
			token += c;
			c = w.nextChar();
		}

		tokener(token, 'number');    
	
	}

	function op() {
		var w = walker,
			c = w.ch,
			token = c,
			next = w.nextChar();
			
		if (next === "=" && isOp(token, true)) {
			token += next;
			tokener(token, 'match');
			w.nextChar();
			return;
		} 
		
		tokener(token, token);
	}


	// call the appropriate handler based on the first character in a token suspect
	function tokenize() {
		var ch = walker.ch;
	
		if (ch === " " || ch === "\t") {
			return white();
		}

		if (ch === '/') {
			return comment();
		} 

		if (ch === '"' || ch === "'") {
			return str();
		}
		
		if (ch === '(') {
			return brace();
		}
	
		if (ch === '-' || ch === '.' || isDigit(ch)) { // tricky - char: minus (-1px) or dash (-moz-stuff)
			return num();
		}
	
		if (isNameChar(ch)) {
			return identifier();
		}

		if (isOp(ch)) {
			return op();
		}

		if (ch === '\r') {
			if (walker.peek() === '\n') {
				ch += walker.nextChar();
			}

			tokener(ch, 'line');
			walker.nextChar();
			return;
		}
		
		if (ch === '\n') {
			tokener(ch, 'line');
			walker.nextChar();
			return;
		}
		
		raiseError("Unrecognized character '" + ch + "'");
	}

	return {
		/**
		 * Sprits given source into tokens
		 * @param {String} source
		 * @returns {Array}
		 */
		lex: function (source) {
			walker.init(source);
			session.tokens = [];

			// for empty source, return single space token
			if (!source) {
				session.tokens.push(this.white());
			} else {
				while (walker.ch !== '') {
					tokenize();
				}
			}

			var tokens = session.tokens;
			session.tokens = null;
			return tokens;
		},
		
		/**
		 * Tokenizes CSS source. It's like `lex()` method,
		 * but also stores proper token indexes in source, 
		 * so it's a bit slower
		 * @param {String} source
		 * @returns {Array}
		 */
		parse: function(source) {
			// transform tokens
			var tokens = this.lex(source), pos = 0, token;
			for (var i = 0, il = tokens.length; i < il; i++) {
				token = tokens[i];
				token.start = pos;
				token.end = (pos += token.value.length);
			}
			return tokens;
		},

		white: function() {
			return {
				value: '',
				type:  'white',
				start: 0,
				end:   0
			};
		},
		
		toSource: function(toks) {
			var i = 0, max = toks.length, src = '';
			for (; i < max; i++) {
				src += toks[i].value;
			}
			return src;
		}
	};
});
},{}],"parser\\processor\\attributes.js":[function(require,module,exports){
/**
 * Resolves node attribute names: moves `default` attribute value
 * from stub to real attribute.
 *
 * This resolver should be applied *after* resource matcher
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../../utils/common');

	var findDefault = function(attr) {
		return attr.isDefault;
	};

	var findImplied = function(attr) {
		return attr.isImplied;
	};

	var findEmpty = function(attr) {
		return !attr.value;
	};

	function resolveDefaultAttrs(node, parser) {
		node.children.forEach(function(item) {
			var attrList = item.attributeList();
			var defaultAttrValue = item.attribute(parser.DEFAULT_ATTR_NAME);
			if (typeof defaultAttrValue !== 'undefined') {
				// remove stub attribute
				item.attribute(parser.DEFAULT_ATTR_NAME, null);
				
				if (attrList.length) {
					// target for default value:
					// 1. default attribute
					// 2. implied attribute
					// 3. first empty attribute
				
					// find attribute marked as default
					var defaultAttr = utils.find(attrList, findDefault) 
						|| utils.find(attrList, findImplied) 
						|| utils.find(attrList, findEmpty);

					if (defaultAttr) {
						var oldVal = item.attribute(defaultAttr.name);
						var newVal = utils.replaceUnescapedSymbol(oldVal, '|', defaultAttrValue);
						// no replacement, e.g. default value does not contains | symbol
						if (oldVal == newVal) {
							newVal = defaultAttrValue
						}
						
						item.attribute(defaultAttr.name, newVal);
					}
				}
			} else {
				// if no default attribute value, remove implied attributes
				attrList.forEach(function(attr) {
					if (attr.isImplied) {
						item.attribute(attr.name, null);
					}
				});
			}

			resolveDefaultAttrs(item, parser);
		});
	}

	return {
		/**
		 * @param  {AbbreviationNode} tree
		 * @param  {Object} options
		 * @param  {abbreviation} parser
		 */
		preprocessor: function(tree, options, parser) {
			resolveDefaultAttrs(tree, parser);
		}
	};
});
},{"../../utils/common":"utils\\common.js"}],"parser\\processor\\href.js":[function(require,module,exports){
/**
 * A preptocessor for &lt;a&gt; tag: tests wrapped content
 * for common URL patterns and, if matched, inserts it as 
 * `href` attribute
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var prefs = require('../../assets/preferences');
	var utils = require('../../utils/common');
	var pc = require('./pastedContent');

	prefs.define('href.autodetect', true, 
		'Enables or disables automatic URL recognition when wrapping\
		text with <code>&lt;a&gt;</code> tag. With this option enabled,\
		if wrapped text matches URL or e-mail pattern it will be automatically\
		inserted into <code>href</code> attribute.');
	prefs.define('href.urlPattern', '^(?:(?:https?|ftp|file)://|www\\.|ftp\\.)(?:\\([-A-Z0-9+&@#/%=~_|$?!:,.]*\\)|[-A-Z0-9+&@#/%=~_|$?!:,.])*(?:\\([-A-Z0-9+&@#/%=~_|$?!:,.]*\\)|[A-Z0-9+&@#/%=~_|$])', 
		'RegExp pattern to match wrapped URLs. Matched content will be inserts\
		as-is into <code>href</code> attribute, only whitespace will be trimmed.');

	prefs.define('href.emailPattern', '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,5}$', 
		'RegExp pattern to match wrapped e-mails. Unlike <code>href.urlPattern</code>,\
		wrapped content will be prefixed with <code>mailto:</code> in <code>href</code>\
		attribute');

	return {
		/**
		 * @param {AbbreviationNode} tree
		 * @param {Object} options
		 */
		postprocessor: function(tree, options) {
			if (!prefs.get('href.autodetect')) {
				return;
			}

			var reUrl = new RegExp(prefs.get('href.urlPattern'), 'i');
			var reEmail = new RegExp(prefs.get('href.emailPattern'), 'i');
			var reProto = /^([a-z]+:)?\/\//i;

			tree.findAll(function(item) {
				if (item.name().toLowerCase() != 'a' || item.attribute('href')) {
					return;
				}

				var pastedContent = utils.trim(pc.pastedContent(item) || options.pastedContent);
				if (pastedContent) {
					if (reUrl.test(pastedContent)) {
						// do we have protocol?
						if (!reProto.test(pastedContent)) {
							pastedContent = 'http://' + pastedContent;
						}

						item.attribute('href', pastedContent);
					} else if (reEmail.test(pastedContent)) {
						item.attribute('href', 'mailto:' + pastedContent);
					}
				}
			});
		}
	};
});
},{"../../assets/preferences":"assets\\preferences.js","../../utils/common":"utils\\common.js","./pastedContent":"parser\\processor\\pastedContent.js"}],"parser\\processor\\pastedContent.js":[function(require,module,exports){
/**
 * Pasted content abbreviation processor. A pasted content is a content that
 * should be inserted into implicitly repeated abbreviation nodes.
 * This processor powers “Wrap With Abbreviation” action
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../../utils/common');
	var abbrUtils = require('../../utils/abbreviation');
	var stringStream = require('../../assets/stringStream');
	var range = require('../../assets/range');

	var outputPlaceholder = '$#';
	
	/**
	 * Locates output placeholders inside text
	 * @param {String} text
	 * @returns {Array} Array of ranges of output placeholder in text
	 */
	function locateOutputPlaceholder(text) {
		var result = [];
		
		var stream = stringStream.create(text);
		
		while (!stream.eol()) {
			if (stream.peek() == '\\') {
				stream.next();
			} else {
				stream.start = stream.pos;
				if (stream.match(outputPlaceholder, true)) {
					result.push(range.create(stream.start, outputPlaceholder));
					continue;
				}
			}
			stream.next();
		}
		
		return result;
	}
	
	/**
	 * Replaces output placeholders inside <code>source</code> with 
	 * <code>value</code>
	 * @param {String} source
	 * @param {String} value
	 * @returns {String}
	 */
	function replaceOutputPlaceholders(source, value) {
		var ranges = locateOutputPlaceholder(source);
		
		ranges.reverse().forEach(function(r) {
			source = utils.replaceSubstring(source, value, r);
		});
		
		return source;
	}
	
	/**
	 * Check if parsed node contains output placeholder – a target where
	 * pasted content should be inserted
	 * @param {AbbreviationNode} node
	 * @returns {Boolean}
	 */
	function hasOutputPlaceholder(node) {
		if (locateOutputPlaceholder(node.content).length)
			return true;
		
		// check if attributes contains placeholder
		return !!utils.find(node.attributeList(), function(attr) {
			return !!locateOutputPlaceholder(attr.value).length;
		});
	}
	
	/**
	 * Insert pasted content into correct positions of parsed node
	 * @param {AbbreviationNode} node
	 * @param {String} content
	 * @param {Boolean} overwrite Overwrite node content if no value placeholders
	 * found instead of appending to existing content
	 */
	function insertPastedContent(node, content, overwrite) {
		var nodesWithPlaceholders = node.findAll(function(item) {
			return hasOutputPlaceholder(item);
		});
		
		if (hasOutputPlaceholder(node))
			nodesWithPlaceholders.unshift(node);
		
		if (nodesWithPlaceholders.length) {
			nodesWithPlaceholders.forEach(function(item) {
				item.content = replaceOutputPlaceholders(item.content, content);
				item._attributes.forEach(function(attr) {
					attr.value = replaceOutputPlaceholders(attr.value, content);
				});
			});
		} else {
			// on output placeholders in subtree, insert content in the deepest
			// child node
			var deepest = node.deepestChild() || node;
			if (overwrite) {
				deepest.content = content;
			} else {
				deepest.content = abbrUtils.insertChildContent(deepest.content, content);
			}
		}
	}

	return {
		pastedContent: function(item) {
			var content = item.data('paste');
			if (Array.isArray(content)) {
				return content[item.counter - 1];
			} else if (typeof content === 'function') {
				return content(item.counter - 1, item.content);
			} else if (content) {
				return content;
			}
		},

		/**
		 * @param {AbbreviationNode} tree
		 * @param {Object} options
		 */
		preprocessor: function(tree, options) {
			if (options.pastedContent) {
				var lines = utils.splitByLines(options.pastedContent, true).map(utils.trim);
				
				// set repeat count for implicitly repeated elements before
				// tree is unrolled
				tree.findAll(function(item) {
					if (item.hasImplicitRepeat) {
						item.data('paste', lines);
						return item.repeatCount = lines.length;
					}
				});
			}
		},

		/**
		 * @param {AbbreviationNode} tree
		 * @param {Object} options
		 */
		postprocessor: function(tree, options) {
			var that = this;
			// for each node with pasted content, update text data
			var targets = tree.findAll(function(item) {
				var pastedContent = that.pastedContent(item);
				if (pastedContent) {
					insertPastedContent(item, pastedContent, !!item.data('pasteOverwrites'));
				}
				
				return !!pastedContent;
			});
			
			if (!targets.length && options.pastedContent) {
				// no implicitly repeated elements, put pasted content in
				// the deepest child
				insertPastedContent(tree, options.pastedContent);
			}
		}
	};
});
},{"../../assets/range":"assets\\range.js","../../assets/stringStream":"assets\\stringStream.js","../../utils/abbreviation":"utils\\abbreviation.js","../../utils/common":"utils\\common.js"}],"parser\\processor\\resourceMatcher.js":[function(require,module,exports){
/**
 * Processor function that matches parsed <code>AbbreviationNode</code>
 * against resources defined in <code>resource</code> module
 */ 
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var resources = require('../../assets/resources');
	var elements = require('../../assets/elements');
	var utils = require('../../utils/common');
	var abbreviationUtils = require('../../utils/abbreviation');

	/**
	 * Finds matched resources for child nodes of passed <code>node</code> 
	 * element. A matched resource is a reference to <i>snippets.json</i> entry
	 * that describes output of parsed node 
	 * @param {AbbreviationNode} node
	 * @param {String} syntax
	 */
	function matchResources(node, syntax, parser) {
		// do a shallow copy because the children list can be modified during
		// resource matching
		node.children.slice(0).forEach(function(child) {
			var r = resources.getMatchedResource(child, syntax);
			if (typeof r === 'string') {
				r = elements.create('snippet', r);
			}

			child.data('resource', r);
			var elemType = elements.type(r);

			if (elemType == 'snippet') {
				var content = r.data;
				var curContent = child._text || child.content;
				if (curContent) {
					content = abbreviationUtils.insertChildContent(content, curContent);
				}

				child.content = content;
			} else if (elemType == 'element') {
				child._name = r.name;
				if (Array.isArray(r.attributes)) {
					child._attributes = [].concat(r.attributes, child._attributes);
				}
			} else if (elemType == 'reference') {
				// it’s a reference to another abbreviation:
				// parse it and insert instead of current child
				/** @type AbbreviationNode */
				var subtree = parser.parse(r.data, {
					syntax: syntax
				});

				// if context element should be repeated, check if we need to 
				// transfer repeated element to specific child node
				if (child.repeatCount > 1) {
					var repeatedChildren = subtree.findAll(function(node) {
						return node.hasImplicitRepeat;
					});

					if (!repeatedChildren.length) {
						repeatedChildren = subtree.children
					}
					
					repeatedChildren.forEach(function(node) {
						node.repeatCount = child.repeatCount;
						node.hasImplicitRepeat = false;
					});
				}

				// move child‘s children into the deepest child of new subtree
				var deepestChild = subtree.deepestChild();
				if (deepestChild) {
					child.children.forEach(function(c) {
						deepestChild.addChild(c);
					});
					deepestChild.content = child.content;
				}

				// copy current attributes to children
				subtree.children.forEach(function(node) {
					child.attributeList().forEach(function(attr) {
						node.attribute(attr.name, attr.value);
					});
				});
				
				child.replace(subtree.children);
			}
			
			matchResources(child, syntax, parser);
		});
	}
	
	return {
		preprocessor: function(tree, options, parser) {
			var syntax = options.syntax || utils.defaultSyntax();
			matchResources(tree, syntax, parser);
		}
	};
});
},{"../../assets/elements":"assets\\elements.js","../../assets/resources":"assets\\resources.js","../../utils/abbreviation":"utils\\abbreviation.js","../../utils/common":"utils\\common.js"}],"parser\\processor\\tagName.js":[function(require,module,exports){
/**
 * Resolves tag names in abbreviations with implied name
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var tagName = require('../../resolver/tagName');

	/**
	 * Resolves implicit node names in parsed tree
	 * @param {AbbreviationNode} tree
	 */
	function resolveNodeNames(tree) {
		tree.children.forEach(function(node) {
			if (node.hasImplicitName() || node.data('forceNameResolving')) {
				node._name = tagName.resolve(node.parent.name());
				node.data('nameResolved', true);
			}
			resolveNodeNames(node);
		});
		
		return tree;
	}

	return {
		postprocessor: resolveNodeNames
	};
});
},{"../../resolver/tagName":"resolver\\tagName.js"}],"parser\\xml.js":[function(require,module,exports){
/**
 * HTML tokenizer by Marijn Haverbeke
 * http://codemirror.net/
 * @constructor
 * @memberOf __xmlParseDefine
 * @param {Function} require
 * @param {Underscore} _
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var stringStream = require('../assets/stringStream');

	var Kludges = {
		autoSelfClosers : {},
		implicitlyClosed : {},
		contextGrabbers : {},
		doNotIndent : {},
		allowUnquoted : true,
		allowMissing : true
	};

	// Return variables for tokenizers
	var tagName = null, type = null;

	function inText(stream, state) {
		function chain(parser) {
			state.tokenize = parser;
			return parser(stream, state);
		}

		var ch = stream.next();
		if (ch == "<") {
			if (stream.eat("!")) {
				if (stream.eat("[")) {
					if (stream.match("CDATA["))
						return chain(inBlock("atom", "]]>"));
					else
						return null;
				} else if (stream.match("--"))
					return chain(inBlock("comment", "-->"));
				else if (stream.match("DOCTYPE", true, true)) {
					stream.eatWhile(/[\w\._\-]/);
					return chain(doctype(1));
				} else
					return null;
			} else if (stream.eat("?")) {
				stream.eatWhile(/[\w\._\-]/);
				state.tokenize = inBlock("meta", "?>");
				return "meta";
			} else {
				type = stream.eat("/") ? "closeTag" : "openTag";
				stream.eatSpace();
				tagName = "";
				var c;
				while ((c = stream.eat(/[^\s\u00a0=<>\"\'\/?]/)))
					tagName += c;
				state.tokenize = inTag;
				return "tag";
			}
		} else if (ch == "&") {
			var ok;
			if (stream.eat("#")) {
				if (stream.eat("x")) {
					ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
				} else {
					ok = stream.eatWhile(/[\d]/) && stream.eat(";");
				}
			} else {
				ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
			}
			return ok ? "atom" : "error";
		} else {
			stream.eatWhile(/[^&<]/);
			return "text";
		}
	}

	function inTag(stream, state) {
		var ch = stream.next();
		if (ch == ">" || (ch == "/" && stream.eat(">"))) {
			state.tokenize = inText;
			type = ch == ">" ? "endTag" : "selfcloseTag";
			return "tag";
		} else if (ch == "=") {
			type = "equals";
			return null;
		} else if (/[\'\"]/.test(ch)) {
			state.tokenize = inAttribute(ch);
			return state.tokenize(stream, state);
		} else {
			stream.eatWhile(/[^\s\u00a0=<>\"\'\/?]/);
			return "word";
		}
	}

	function inAttribute(quote) {
		return function(stream, state) {
			while (!stream.eol()) {
				if (stream.next() == quote) {
					state.tokenize = inTag;
					break;
				}
			}
			return "string";
		};
	}

	function inBlock(style, terminator) {
		return function(stream, state) {
			while (!stream.eol()) {
				if (stream.match(terminator)) {
					state.tokenize = inText;
					break;
				}
				stream.next();
			}
			return style;
		};
	}
	
	function doctype(depth) {
		return function(stream, state) {
			var ch;
			while ((ch = stream.next()) !== null) {
				if (ch == "<") {
					state.tokenize = doctype(depth + 1);
					return state.tokenize(stream, state);
				} else if (ch == ">") {
					if (depth == 1) {
						state.tokenize = inText;
						break;
					} else {
						state.tokenize = doctype(depth - 1);
						return state.tokenize(stream, state);
					}
				}
			}
			return "meta";
		};
	}

	var curState = null, setStyle;
	function pass() {
		for (var i = arguments.length - 1; i >= 0; i--)
			curState.cc.push(arguments[i]);
	}
	
	function cont() {
		pass.apply(null, arguments);
		return true;
	}

	function pushContext(tagName, startOfLine) {
		var noIndent = Kludges.doNotIndent.hasOwnProperty(tagName) 
			|| (curState.context && curState.context.noIndent);
		curState.context = {
			prev : curState.context,
			tagName : tagName,
			indent : curState.indented,
			startOfLine : startOfLine,
			noIndent : noIndent
		};
	}
	
	function popContext() {
		if (curState.context)
			curState.context = curState.context.prev;
	}

	function element(type) {
		if (type == "openTag") {
			curState.tagName = tagName;
			return cont(attributes, endtag(curState.startOfLine));
		} else if (type == "closeTag") {
			var err = false;
			if (curState.context) {
				if (curState.context.tagName != tagName) {
					if (Kludges.implicitlyClosed.hasOwnProperty(curState.context.tagName.toLowerCase())) {
						popContext();
					}
					err = !curState.context || curState.context.tagName != tagName;
				}
			} else {
				err = true;
			}
			
			if (err)
				setStyle = "error";
			return cont(endclosetag(err));
		}
		return cont();
	}
	
	function endtag(startOfLine) {
		return function(type) {
			if (type == "selfcloseTag"
					|| (type == "endTag" && Kludges.autoSelfClosers
							.hasOwnProperty(curState.tagName
									.toLowerCase()))) {
				maybePopContext(curState.tagName.toLowerCase());
				return cont();
			}
			if (type == "endTag") {
				maybePopContext(curState.tagName.toLowerCase());
				pushContext(curState.tagName, startOfLine);
				return cont();
			}
			return cont();
		};
	}
	
	function endclosetag(err) {
		return function(type) {
			if (err)
				setStyle = "error";
			if (type == "endTag") {
				popContext();
				return cont();
			}
			setStyle = "error";
			return cont(arguments.callee);
		};
	}
	
	function maybePopContext(nextTagName) {
		var parentTagName;
		while (true) {
			if (!curState.context) {
				return;
			}
			parentTagName = curState.context.tagName.toLowerCase();
			if (!Kludges.contextGrabbers.hasOwnProperty(parentTagName)
					|| !Kludges.contextGrabbers[parentTagName].hasOwnProperty(nextTagName)) {
				return;
			}
			popContext();
		}
	}

	function attributes(type) {
		if (type == "word") {
			setStyle = "attribute";
			return cont(attribute, attributes);
		}
		if (type == "endTag" || type == "selfcloseTag")
			return pass();
		setStyle = "error";
		return cont(attributes);
	}
	
	function attribute(type) {
		if (type == "equals")
			return cont(attvalue, attributes);
		if (!Kludges.allowMissing)
			setStyle = "error";
		return (type == "endTag" || type == "selfcloseTag") ? pass()
				: cont();
	}
	
	function attvalue(type) {
		if (type == "string")
			return cont(attvaluemaybe);
		if (type == "word" && Kludges.allowUnquoted) {
			setStyle = "string";
			return cont();
		}
		setStyle = "error";
		return (type == "endTag" || type == "selfCloseTag") ? pass()
				: cont();
	}
	
	function attvaluemaybe(type) {
		if (type == "string")
			return cont(attvaluemaybe);
		else
			return pass();
	}
	
	function startState() {
		return {
			tokenize : inText,
			cc : [],
			indented : 0,
			startOfLine : true,
			tagName : null,
			context : null
		};
	}
	
	function token(stream, state) {
		if (stream.sol()) {
			state.startOfLine = true;
			state.indented = 0;
		}
		
		if (stream.eatSpace())
			return null;

		setStyle = type = tagName = null;
		var style = state.tokenize(stream, state);
		state.type = type;
		if ((style || type) && style != "comment") {
			curState = state;
			while (true) {
				var comb = state.cc.pop() || element;
				if (comb(type || style))
					break;
			}
		}
		state.startOfLine = false;
		return setStyle || style;
	}

	return {
		/**
		 * @memberOf emmet.xmlParser
		 * @returns
		 */
		parse: function(data, offset) {
			offset = offset || 0;
			var state = startState();
			var stream = stringStream.create(data);
			var tokens = [];
			while (!stream.eol()) {
				tokens.push({
					type: token(stream, state),
					start: stream.start + offset,
					end: stream.pos + offset
				});
				stream.start = stream.pos;
			}
			
			return tokens;
		}		
	};
});

},{"../assets/stringStream":"assets\\stringStream.js"}],"plugin\\file.js":[function(require,module,exports){
/**
 * Module for working with file. Shall implement
 * IEmmetFile interface.
 *
 * Since implementation of this module depends
 * greatly on current runtime, this module must be
 * initialized with actual implementation first
 * before use. E.g.
 * require('./plugin/file')({
 * 	read: function() {...}
 * })
 *
 * By default, this module provides Node.JS implementation
 */

if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	var _transport = {};

	// hide it from Require.JS parser
	(function(r) {
		if (typeof define === 'undefined' || !define.amd) {
			try {
				fs = r('fs');
				path = r('path');
				_transport.http = r('http');
				_transport.https = r('https');
			} catch(e) { }
		}
	})(require);

	// module is a function that can extend itself
	module.exports = function(obj) {
		if (obj) {
			utils.extend(module.exports, obj);
		}
	};

	function bts(bytes) {
		var out = [];
		for (var i = 0, il = bytes.length; i < il; i++) {
			out.push(String.fromCharCode(bytes[i]));
		}
		return out.join('');
	}

	function isURL(path) {
		var re = /^https?:\/\//;
		return re.test(path);
	}

	return utils.extend(module.exports, {
		_parseParams: function(args) {
			var params = {
				path: args[0],
				size: 0
			};

			args = utils.toArray(args, 1);
			params.callback = args[args.length - 1];
			args = args.slice(0, args.length - 1);
			if (args.length) {
				params.size = args[0];
			}

			return params;
		},

		_read: function(params, callback) {
			if (isURL(params.path)) {
				var req = _transport[/^https:/.test(params.path) ? 'https' : 'http'].get(params.path, function(res) {
					var bufs = [];
					var totalLength = 0;
					var finished = false;
					res
						.on('data', function(chunk) {
							totalLength += chunk.length;
							bufs.push(chunk);
							if (params.size && totalLength >= params.size) {
								finished = true;
								callback(null, Buffer.concat(bufs));
								req.abort();
							}
						})
						.on('end', function() {
							if (!finished) {
								finished = true;
								callback(null, Buffer.concat(bufs));
							}
						});
				}).on('error', callback);
			} else {
				if (params.size) {
					var fd = fs.openSync(params.path, 'r');
					var buf = new Buffer(params.size);
					fs.read(fd, buf, 0, params.size, null, function(err, bytesRead) {
						callback(err, buf)
					});
				} else {
					callback(null, fs.readFileSync(params.path));
				}
			}
		},

		/**
		 * Reads binary file content and return it
		 * @param {String} path File's relative or absolute path
		 * @return {String}
		 */
		read: function(path, size, callback) {
			var params = this._parseParams(arguments);
			this._read(params, function(err, buf) {
				params.callback(err, err ? '' : bts(buf));
			});
		},

		/**
		 * Read file content and return it
		 * @param {String} path File's relative or absolute path
		 * @return {String}
		 */
		readText: function(path, size, callback) {
			var params = this._parseParams(arguments);
			this._read(params, function(err, buf) {
				params.callback(err, err ? '' : buf.toString());
			});
		},

		/**
		 * Locate <code>file_name</code> file that relates to <code>editor_file</code>.
		 * File name may be absolute or relative path
		 *
		 * <b>Dealing with absolute path.</b>
		 * Many modern editors have a "project" support as information unit, but you
		 * should not rely on project path to find file with absolute path. First,
		 * it requires user to create a project before using this method (and this
		 * is not very convenient). Second, project path doesn't always points to
		 * to website's document root folder: it may point, for example, to an
		 * upper folder which contains server-side scripts.
		 *
		 * For better result, you should use the following algorithm in locating
		 * absolute resources:
		 * 1) Get parent folder for <code>editorFile</code> as a start point
		 * 2) Append required <code>fileName</code> to start point and test if
		 * file exists
		 * 3) If it doesn't exists, move start point one level up (to parent folder)
		 * and repeat step 2.
		 *
		 * @param {String} editorFile
		 * @param {String} fileName
		 * @return {String} Returns null if <code>fileName</code> cannot be located
		 */
		locateFile: function(editorFile, fileName, callback) {
			if (isURL(fileName)) {
				return callback(fileName);
			}

			var dirname = editorFile
			var filepath;
			fileName = fileName.replace(/^\/+/, '');
			while (dirname && dirname !== path.dirname(dirname)) {
				dirname = path.dirname(dirname);
				filepath = path.join(dirname, fileName);
				if (fs.existsSync(filepath))
					return callback(filepath);
			}

			callback(null);
		},

		/**
		 * Creates absolute path by concatenating <code>parent</code> and <code>fileName</code>.
		 * If <code>parent</code> points to file, its parent directory is used
		 * @param {String} parent
		 * @param {String} fileName
		 * @return {String}
		 */
		createPath: function(parent, fileName, callback) {
			fs.stat(parent, function(err, stat) {
				if (err) {
					return callback(err);
				}

				if (stat.isFile()) {
					parent = path.dirname(parent);
				}

				var filepath = path.resolve(parent, fileName);
				callback(null, filepath);
			});
		},

		/**
		 * Saves <code>content</code> as <code>file</code>
		 * @param {String} file File's absolute path
		 * @param {String} content File content
		 */
		save: function(file, content, callback) {
			fs.writeFile(file, content, 'ascii', function(err) {
				callback(err ? err : null);
			});
		},

		/**
		 * Returns file extension in lower case
		 * @param {String} file
		 * @return {String}
		 */
		getExt: function(file) {
			var m = (file || '').match(/\.([\w\-]+)$/);
			return m ? m[1].toLowerCase() : '';
		}

	});
});

},{"../utils/common":"utils\\common.js"}],"resolver\\css.js":[function(require,module,exports){
/**
 * Resolver for fast CSS typing. Handles abbreviations with the following 
 * notation:<br>
 * 
 * <code>(-vendor prefix)?property(value)*(!)?</code>
 * 
 * <br><br>
 * <b>Abbreviation handling</b><br>
 * 
 * By default, Emmet searches for matching snippet definition for provided abbreviation.
 * If snippet wasn't found, Emmet automatically generates element with 
 * abbreviation's name. For example, <code>foo</code> abbreviation will generate
 * <code>&lt;foo&gt;&lt;/foo&gt;</code> output.
 * <br><br>
 * This module will capture all expanded properties and upgrade them with values, 
 * vendor prefixes and !important declarations. All unmatched abbreviations will 
 * be automatically transformed into <code>property-name: ${1}</code> snippets. 
 * 
 * <b>Vendor prefixes<b><br>
 * 
 * If CSS-property is preceded with dash, resolver should output property with
 * all <i>known</i> vendor prefixes. For example, if <code>brad</code> 
 * abbreviation generates <code>border-radius: ${value};</code> snippet,
 * the <code>-brad</code> abbreviation should generate:
 * <pre><code>
 * -webkit-border-radius: ${value};
 * -moz-border-radius: ${value};
 * border-radius: ${value};
 * </code></pre>
 * Note that <i>o</i> and <i>ms</i> prefixes are omitted since Opera and IE 
 * supports unprefixed property.<br><br>
 * 
 * Users can also provide an explicit list of one-character prefixes for any
 * CSS property. For example, <code>-wm-float</code> will produce
 * 
 * <pre><code>
 * -webkit-float: ${1};
 * -moz-float: ${1};
 * float: ${1};
 * </code></pre>
 * 
 * Although this example looks pointless, users can use this feature to write
 * cutting-edge properties implemented by browser vendors recently.  
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var prefs = require('../assets/preferences');
	var resources = require('../assets/resources');
	var stringStream = require('../assets/stringStream');
	var ciu = require('../assets/caniuse');
	var utils = require('../utils/common');
	var template = require('../utils/template');
	var cssEditTree = require('../editTree/css');

	var prefixObj = {
		/** Real vendor prefix name */
		prefix: 'emmet',
		
		/** 
		 * Indicates this prefix is obsolete and should't be used when user 
		 * wants to generate all-prefixed properties
		 */
		obsolete: false,
		
		/**
		 * Returns prefixed CSS property name
		 * @param {String} name Unprefixed CSS property
		 */
		transformName: function(name) {
			return '-' + this.prefix + '-' + name;
		},
		
		/**
		 * List of unprefixed CSS properties that supported by 
		 * current prefix. This list is used to generate all-prefixed property
		 * @returns {Array} 
		 */
		properties: function() {
			return getProperties('css.' + this.prefix + 'Properties') || [];
		},
		
		/**
		 * Check if given property is supported by current prefix
		 * @param name
		 */
		supports: function(name) {
			return ~this.properties().indexOf(name);
		}
	};
	
	
	/** 
	 * List of registered one-character prefixes. Key is a one-character prefix, 
	 * value is an <code>prefixObj</code> object
	 */
	var vendorPrefixes = {};
	
	var defaultValue = '${1};';
	
	// XXX module preferences
	prefs.define('css.valueSeparator', ': ',
			'Defines a symbol that should be placed between CSS property and ' 
			+ 'value when expanding CSS abbreviations.');
	prefs.define('css.propertyEnd', ';',
			'Defines a symbol that should be placed at the end of CSS property  ' 
			+ 'when expanding CSS abbreviations.');
	
	prefs.define('stylus.valueSeparator', ' ',
			'Defines a symbol that should be placed between CSS property and ' 
			+ 'value when expanding CSS abbreviations in Stylus dialect.');
	prefs.define('stylus.propertyEnd', '',
			'Defines a symbol that should be placed at the end of CSS property  ' 
			+ 'when expanding CSS abbreviations in Stylus dialect.');
	
	prefs.define('sass.propertyEnd', '',
			'Defines a symbol that should be placed at the end of CSS property  ' 
			+ 'when expanding CSS abbreviations in SASS dialect.');

	prefs.define('css.syntaxes', 'css, less, sass, scss, stylus, styl',
			'List of syntaxes that should be treated as CSS dialects.');
	
	prefs.define('css.autoInsertVendorPrefixes', true,
			'Automatically generate vendor-prefixed copies of expanded CSS ' 
			+ 'property. By default, Emmet will generate vendor-prefixed '
			+ 'properties only when you put dash before abbreviation ' 
			+ '(e.g. <code>-bxsh</code>). With this option enabled, you don’t ' 
			+ 'need dashes before abbreviations: Emmet will produce ' 
			+ 'vendor-prefixed properties for you.');

	prefs.define('less.autoInsertVendorPrefixes', false, 'Same as <code>css.autoInsertVendorPrefixes</code> but for LESS syntax');
	prefs.define('scss.autoInsertVendorPrefixes', false, 'Same as <code>css.autoInsertVendorPrefixes</code> but for SCSS syntax');
	prefs.define('sass.autoInsertVendorPrefixes', false, 'Same as <code>css.autoInsertVendorPrefixes</code> but for SASS syntax');
	prefs.define('stylus.autoInsertVendorPrefixes', false, 'Same as <code>css.autoInsertVendorPrefixes</code> but for Stylus syntax');
	
	var descTemplate = template('A comma-separated list of CSS properties that may have ' 
		+ '<code><%= vendor %></code> vendor prefix. This list is used to generate '
		+ 'a list of prefixed properties when expanding <code>-property</code> '
		+ 'abbreviations. Empty list means that all possible CSS values may ' 
		+ 'have <code><%= vendor %></code> prefix.');
	
	var descAddonTemplate = template('A comma-separated list of <em>additional</em> CSS properties ' 
			+ 'for <code>css.<%= vendor %>Preperties</code> preference. ' 
			+ 'You should use this list if you want to add or remove a few CSS ' 
			+ 'properties to original set. To add a new property, simply write its name, '
			+ 'to remove it, precede property with hyphen.<br>'
			+ 'For example, to add <em>foo</em> property and remove <em>border-radius</em> one, '
			+ 'the preference value will look like this: <code>foo, -border-radius</code>.');
	
	// properties list is created from cssFeatures.html file
	var props = {
		'webkit': 'animation, animation-delay, animation-direction, animation-duration, animation-fill-mode, animation-iteration-count, animation-name, animation-play-state, animation-timing-function, appearance, backface-visibility, background-clip, background-composite, background-origin, background-size, border-fit, border-horizontal-spacing, border-image, border-vertical-spacing, box-align, box-direction, box-flex, box-flex-group, box-lines, box-ordinal-group, box-orient, box-pack, box-reflect, box-shadow, color-correction, column-break-after, column-break-before, column-break-inside, column-count, column-gap, column-rule-color, column-rule-style, column-rule-width, column-span, column-width, dashboard-region, font-smoothing, highlight, hyphenate-character, hyphenate-limit-after, hyphenate-limit-before, hyphens, line-box-contain, line-break, line-clamp, locale, margin-before-collapse, margin-after-collapse, marquee-direction, marquee-increment, marquee-repetition, marquee-style, mask-attachment, mask-box-image, mask-box-image-outset, mask-box-image-repeat, mask-box-image-slice, mask-box-image-source, mask-box-image-width, mask-clip, mask-composite, mask-image, mask-origin, mask-position, mask-repeat, mask-size, nbsp-mode, perspective, perspective-origin, rtl-ordering, text-combine, text-decorations-in-effect, text-emphasis-color, text-emphasis-position, text-emphasis-style, text-fill-color, text-orientation, text-security, text-stroke-color, text-stroke-width, transform, transition, transform-origin, transform-style, transition-delay, transition-duration, transition-property, transition-timing-function, user-drag, user-modify, user-select, writing-mode, svg-shadow, box-sizing, border-radius',
		'moz': 'animation-delay, animation-direction, animation-duration, animation-fill-mode, animation-iteration-count, animation-name, animation-play-state, animation-timing-function, appearance, backface-visibility, background-inline-policy, binding, border-bottom-colors, border-image, border-left-colors, border-right-colors, border-top-colors, box-align, box-direction, box-flex, box-ordinal-group, box-orient, box-pack, box-shadow, box-sizing, column-count, column-gap, column-rule-color, column-rule-style, column-rule-width, column-width, float-edge, font-feature-settings, font-language-override, force-broken-image-icon, hyphens, image-region, orient, outline-radius-bottomleft, outline-radius-bottomright, outline-radius-topleft, outline-radius-topright, perspective, perspective-origin, stack-sizing, tab-size, text-blink, text-decoration-color, text-decoration-line, text-decoration-style, text-size-adjust, transform, transform-origin, transform-style, transition, transition-delay, transition-duration, transition-property, transition-timing-function, user-focus, user-input, user-modify, user-select, window-shadow, background-clip, border-radius',
		'ms': 'accelerator, backface-visibility, background-position-x, background-position-y, behavior, block-progression, box-align, box-direction, box-flex, box-line-progression, box-lines, box-ordinal-group, box-orient, box-pack, content-zoom-boundary, content-zoom-boundary-max, content-zoom-boundary-min, content-zoom-chaining, content-zoom-snap, content-zoom-snap-points, content-zoom-snap-type, content-zooming, filter, flow-from, flow-into, font-feature-settings, grid-column, grid-column-align, grid-column-span, grid-columns, grid-layer, grid-row, grid-row-align, grid-row-span, grid-rows, high-contrast-adjust, hyphenate-limit-chars, hyphenate-limit-lines, hyphenate-limit-zone, hyphens, ime-mode, interpolation-mode, layout-flow, layout-grid, layout-grid-char, layout-grid-line, layout-grid-mode, layout-grid-type, line-break, overflow-style, perspective, perspective-origin, perspective-origin-x, perspective-origin-y, scroll-boundary, scroll-boundary-bottom, scroll-boundary-left, scroll-boundary-right, scroll-boundary-top, scroll-chaining, scroll-rails, scroll-snap-points-x, scroll-snap-points-y, scroll-snap-type, scroll-snap-x, scroll-snap-y, scrollbar-arrow-color, scrollbar-base-color, scrollbar-darkshadow-color, scrollbar-face-color, scrollbar-highlight-color, scrollbar-shadow-color, scrollbar-track-color, text-align-last, text-autospace, text-justify, text-kashida-space, text-overflow, text-size-adjust, text-underline-position, touch-action, transform, transform-origin, transform-origin-x, transform-origin-y, transform-origin-z, transform-style, transition, transition-delay, transition-duration, transition-property, transition-timing-function, user-select, word-break, wrap-flow, wrap-margin, wrap-through, writing-mode',
		'o': 'dashboard-region, animation, animation-delay, animation-direction, animation-duration, animation-fill-mode, animation-iteration-count, animation-name, animation-play-state, animation-timing-function, border-image, link, link-source, object-fit, object-position, tab-size, table-baseline, transform, transform-origin, transition, transition-delay, transition-duration, transition-property, transition-timing-function, accesskey, input-format, input-required, marquee-dir, marquee-loop, marquee-speed, marquee-style'
	};
	
	Object.keys(props).forEach(function(k) {
		prefs.define('css.' + k + 'Properties', props[k], descTemplate({vendor: k}));
		prefs.define('css.' + k + 'PropertiesAddon', '', descAddonTemplate({vendor: k}));
	});
	
	prefs.define('css.unitlessProperties', 'z-index, line-height, opacity, font-weight, zoom', 
			'The list of properties whose values ​​must not contain units.');
	
	prefs.define('css.intUnit', 'px', 'Default unit for integer values');
	prefs.define('css.floatUnit', 'em', 'Default unit for float values');
	
	prefs.define('css.keywords', 'auto, inherit, all', 
			'A comma-separated list of valid keywords that can be used in CSS abbreviations.');
	
	prefs.define('css.keywordAliases', 'a:auto, i:inherit, s:solid, da:dashed, do:dotted, t:transparent', 
			'A comma-separated list of keyword aliases, used in CSS abbreviation. '
			+ 'Each alias should be defined as <code>alias:keyword_name</code>.');
	
	prefs.define('css.unitAliases', 'e:em, p:%, x:ex, r:rem', 
			'A comma-separated list of unit aliases, used in CSS abbreviation. '
			+ 'Each alias should be defined as <code>alias:unit_value</code>.');
	
	prefs.define('css.color.short', true, 
			'Should color values like <code>#ffffff</code> be shortened to '
			+ '<code>#fff</code> after abbreviation with color was expanded.');
	
	prefs.define('css.color.case', 'keep', 
			'Letter case of color values generated by abbreviations with color '
			+ '(like <code>c#0</code>). Possible values are <code>upper</code>, '
			+ '<code>lower</code> and <code>keep</code>.');
	
	prefs.define('css.fuzzySearch', true, 
			'Enable fuzzy search among CSS snippet names. When enabled, every ' 
			+ '<em>unknown</em> snippet will be scored against available snippet '
			+ 'names (not values or CSS properties!). The match with best score '
			+ 'will be used to resolve snippet value. For example, with this ' 
			+ 'preference enabled, the following abbreviations are equal: '
			+ '<code>ov:h</code> == <code>ov-h</code> == <code>o-h</code> == '
			+ '<code>oh</code>');
	
	prefs.define('css.fuzzySearchMinScore', 0.3, 
			'The minium score (from 0 to 1) that fuzzy-matched abbreviation should ' 
			+ 'achive. Lower values may produce many false-positive matches, '
			+ 'higher values may reduce possible matches.');
	
	prefs.define('css.alignVendor', false, 
			'If set to <code>true</code>, all generated vendor-prefixed properties ' 
			+ 'will be aligned by real property name.');
	
	
	function isNumeric(ch) {
		var code = ch && ch.charCodeAt(0);
		return (ch && ch == '.' || (code > 47 && code < 58));
	}
	
	/**
	 * Check if provided snippet contains only one CSS property and value.
	 * @param {String} snippet
	 * @returns {Boolean}
	 */
	function isSingleProperty(snippet) {
		snippet = utils.trim(snippet);
		
		// check if it doesn't contain a comment and a newline
		if (/\/\*|\n|\r/.test(snippet)) {
			return false;
		}
		
		// check if it's a valid snippet definition
		if (!/^[a-z0-9\-]+\s*\:/i.test(snippet)) {
			return false;
		}
		
		return snippet.replace(/\$\{.+?\}/g, '').split(':').length == 2;
	}
	
	/**
	 * Normalizes abbreviated value to final CSS one
	 * @param {String} value
	 * @returns {String}
	 */
	function normalizeValue(value) {
		if (value.charAt(0) == '-' && !/^\-[\.\d]/.test(value)) {
			value = value.replace(/^\-+/, '');
		}
		
		var ch = value.charAt(0);
		if (ch == '#') {
			return normalizeHexColor(value);
		}

		if (ch == '$') {
			return utils.escapeText(value);
		}

		return getKeyword(value);
	}
	
	function normalizeHexColor(value) {
		var hex = value.replace(/^#+/, '') || '0';
		if (hex.toLowerCase() == 't') {
			return 'transparent';
		}

		var opacity = '';
		hex = hex.replace(/\.(\d+)$/, function(str) {
			opacity = '0' + str;
			return '';
		});
		
		var repeat = utils.repeatString;
		var color = null;
		switch (hex.length) {
			case 1:
				color = repeat(hex, 6);
				break;
			case 2:
				color = repeat(hex, 3);
				break;
			case 3:
				color = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
				break;
			case 4:
				color = hex + hex.substr(0, 2);
				break;
			case 5:
				color = hex + hex.charAt(0);
				break;
			default:
				color = hex.substr(0, 6);
		}

		if (opacity) {
			return toRgba(color, opacity);
		}
		
		// color must be shortened?
		if (prefs.get('css.color.short')) {
			var p = color.split('');
			if (p[0] == p[1] && p[2] == p[3] && p[4] == p[5]) {
				color = p[0] + p[2] + p[4];
			}
		}
		
		// should transform case?
		switch (prefs.get('css.color.case')) {
			case 'upper':
				color = color.toUpperCase();
				break;
			case 'lower':
				color = color.toLowerCase();
				break;
		}
		
		return '#' + color;
	}

	/**
	 * Transforms HEX color definition into RGBA one
	 * @param  {String} color   HEX color, 6 characters
	 * @param  {String} opacity Opacity value
	 * @return {String}
	 */
	function toRgba(color, opacity) {
		var r = parseInt(color.substr(0, 2), 16);
		var g = parseInt(color.substr(2, 2), 16);
		var b = parseInt(color.substr(4, 2), 16);

		return 'rgba(' + [r, g, b, opacity].join(', ') + ')';
	}
	
	function getKeyword(name) {
		var aliases = prefs.getDict('css.keywordAliases');
		return name in aliases ? aliases[name] : name;
	}
	
	function getUnit(name) {
		var aliases = prefs.getDict('css.unitAliases');
		return name in aliases ? aliases[name] : name;
	}
	
	function isValidKeyword(keyword) {
		return ~prefs.getArray('css.keywords').indexOf(getKeyword(keyword));
	}
	
	/**
	 * Check if passed CSS property support specified vendor prefix 
	 * @param {String} property
	 * @param {String} prefix
	 */
	function hasPrefix(property, prefix) {
		var info = vendorPrefixes[prefix];
		
		if (!info)
			info = utils.find(vendorPrefixes, function(data) {
				return data.prefix == prefix;
			});
		
		return info && info.supports(property);
	}

	/**
	 * Finds available vendor prefixes for given CSS property.
	 * Search is performed within Can I Use database and internal
	 * property list
	 * @param  {String} property CSS property name
	 * @return {Array} Array of resolved prefixes or null if
	 * prefixes are not available for this property at all.
	 * Empty array means prefixes are not available for current
	 * user-define era
	 */
	function findVendorPrefixes(property) {
		var prefixes = ciu.resolvePrefixes(property);
		if (!prefixes) {
			// Can I Use database is disabled or prefixes are not
			// available for this property
			prefixes = [];
			Object.keys(vendorPrefixes).forEach(function(key) {
				if (hasPrefix(property, key)) {
					prefixes.push(vendorPrefixes[key].prefix);
				}
			});

			if (!prefixes.length) {
				prefixes = null;
			}
		}

		return prefixes;
	}
	
	/**
	 * Search for a list of supported prefixes for CSS property. This list
	 * is used to generate all-prefixed snippet
	 * @param {String} property CSS property name
	 * @returns {Array}
	 */
	function findInternalPrefixes(property, noAutofill) {
		var result = [];
		var prefixes = findVendorPrefixes(property);
		
		if (prefixes) {
			var prefixMap = {};
			Object.keys(vendorPrefixes).forEach(function(key) {
				prefixMap[vendorPrefixes[key].prefix] = key;
			});

			result = prefixes.map(function(prefix) {
				return prefixMap[prefix];
			});
		}
		
		if (!result.length && !noAutofill) {
			// add all non-obsolete prefixes
			Object.keys(vendorPrefixes).forEach(function(prefix) {
				if (!vendorPrefixes[prefix].obsolete) {
					result.push(prefix);
				}
			});
		}
		
		return result;
	}
	
	function addPrefix(name, obj) {
		if (typeof obj === 'string') {
			obj = {prefix: obj};
		}
		
		vendorPrefixes[name] = utils.extend({}, prefixObj, obj);
	}
	
	function getSyntaxPreference(name, syntax) {
		if (syntax) {
			// hacky alias for Stylus dialect
			if (syntax == 'styl') {
				syntax = 'stylus';
			}

			var val = prefs.get(syntax + '.' + name);
			if (typeof val !== 'undefined') {
				return val;
			}
		}
		
		return prefs.get('css.' + name);
	}
	
	/**
	 * Format CSS property according to current syntax dialect
	 * @param {String} property
	 * @param {String} syntax
	 * @returns {String}
	 */
	function formatProperty(property, syntax) {
		var ix = property.indexOf(':');
		property = property.substring(0, ix).replace(/\s+$/, '') 
			+ getSyntaxPreference('valueSeparator', syntax)
			+ utils.trim(property.substring(ix + 1));
		
		return property.replace(/\s*;\s*$/, getSyntaxPreference('propertyEnd', syntax));
	}
	
	/**
	 * Transforms snippet value if required. For example, this transformation
	 * may add <i>!important</i> declaration to CSS property
	 * @param {String} snippet
	 * @param {Boolean} isImportant
	 * @returns {String}
	 */
	function transformSnippet(snippet, isImportant, syntax) {
		if (typeof snippet !== 'string') {
			snippet = snippet.data;
		}
		
		if (!isSingleProperty(snippet)) {
			return snippet;
		}
		
		if (isImportant) {
			if (~snippet.indexOf(';')) {
				snippet = snippet.split(';').join(' !important;');
			} else {
				snippet += ' !important';
			}
		}
		
		return formatProperty(snippet, syntax);
	}
	
	function getProperties(key) {
		var list = prefs.getArray(key);
		var addon = prefs.getArray(key + 'Addon');
		if (addon) {
			addon.forEach(function(prop) {
				if (prop.charAt(0) == '-') {
					list = utils.without(list, prop.substr(1));
				} else {
					if (prop.charAt(0) == '+')
						prop = prop.substr(1);
					
					list.push(prop);
				}
			});
		}
		
		return list;
	}

	/**
	 * Tries to produce properties with vendor-prefixed value
	 * @param  {Object} snippetObj Parsed snippet object
	 * @return {Array} Array of properties with prefixed values
	 */
	function resolvePrefixedValues(snippetObj, isImportant, syntax) {
		var prefixes = [];
		var lookup = {};

		var parts = cssEditTree.findParts(snippetObj.value);
		parts.reverse();
		parts.forEach(function(p) {
			var partValue = p.substring(snippetObj.value);
			(findVendorPrefixes(partValue) || []).forEach(function(prefix) {
				if (!lookup[prefix]) {
					lookup[prefix] = snippetObj.value;
					prefixes.push(prefix);
				}

				lookup[prefix] = utils.replaceSubstring(lookup[prefix], '-' + prefix + '-' + partValue, p);
			});
		});

		return prefixes.map(function(prefix) {
			return transformSnippet(snippetObj.name + ':' + lookup[prefix], isImportant, syntax);
		});
	}
	
	
	// TODO refactor, this looks awkward now
	addPrefix('w', {
		prefix: 'webkit'
	});
	addPrefix('m', {
		prefix: 'moz'
	});
	addPrefix('s', {
		prefix: 'ms'
	});
	addPrefix('o', {
		prefix: 'o'
	});
	
	
	module = module || {};
	module.exports = {
		/**
		 * Adds vendor prefix
		 * @param {String} name One-character prefix name
		 * @param {Object} obj Object describing vendor prefix
		 * @memberOf cssResolver
		 */
		addPrefix: addPrefix,
		
		/**
		 * Check if passed CSS property supports specified vendor prefix
		 * @param {String} property
		 * @param {String} prefix
		 */
		supportsPrefix: hasPrefix,

		resolve: function(node, syntax) {
			var cssSyntaxes = prefs.getArray('css.syntaxes');
			if (cssSyntaxes && ~cssSyntaxes.indexOf(syntax) && node.isElement()) {
				return this.expandToSnippet(node.abbreviation, syntax);
			}
			
			return null;
		},

		/**
		 * Returns prefixed version of passed CSS property, only if this
		 * property supports such prefix
		 * @param {String} property
		 * @param {String} prefix
		 * @returns
		 */
		prefixed: function(property, prefix) {
			return hasPrefix(property, prefix) 
				? '-' + prefix + '-' + property 
				: property;
		},
		
		/**
		 * Returns list of all registered vendor prefixes
		 * @returns {Array}
		 */
		listPrefixes: function() {
			return vendorPrefixes.map(function(obj) {
				return obj.prefix;
			});
		},
		
		/**
		 * Returns object describing vendor prefix
		 * @param {String} name
		 * @returns {Object}
		 */
		getPrefix: function(name) {
			return vendorPrefixes[name];
		},
		
		/**
		 * Removes prefix object
		 * @param {String} name
		 */
		removePrefix: function(name) {
			if (name in vendorPrefixes)
				delete vendorPrefixes[name];
		},
		
		/**
		 * Extract vendor prefixes from abbreviation
		 * @param {String} abbr
		 * @returns {Object} Object containing array of prefixes and clean 
		 * abbreviation name
		 */
		extractPrefixes: function(abbr) {
			if (abbr.charAt(0) != '-') {
				return {
					property: abbr,
					prefixes: null
				};
			}
			
			// abbreviation may either contain sequence of one-character prefixes
			// or just dash, meaning that user wants to produce all possible
			// prefixed properties
			var i = 1, il = abbr.length, ch;
			var prefixes = [];
			
			while (i < il) {
				ch = abbr.charAt(i);
				if (ch == '-') {
					// end-sequence character found, stop searching
					i++;
					break;
				}
				
				if (ch in vendorPrefixes) {
					prefixes.push(ch);
				} else {
					// no prefix found, meaning user want to produce all
					// vendor-prefixed properties
					prefixes.length = 0;
					i = 1;
					break;
				}
				
				i++;
			}
			
			// reached end of abbreviation and no property name left
			if (i == il -1) {
				i = 1;
				prefixes.length = 1;
			}
			
			return {
				property: abbr.substring(i),
				prefixes: prefixes.length ? prefixes : 'all'
			};
		},
		
		/**
		 * Search for value substring in abbreviation
		 * @param {String} abbr
		 * @returns {String} Value substring
		 */
		findValuesInAbbreviation: function(abbr, syntax) {
			syntax = syntax || 'css';
			
			var i = 0, il = abbr.length, value = '', ch;
			while (i < il) {
				ch = abbr.charAt(i);
				if (isNumeric(ch) || ch == '#' || ch == '$' || (ch == '-' && isNumeric(abbr.charAt(i + 1)))) {
					value = abbr.substring(i);
					break;
				}
				
				i++;
			}
			
			// try to find keywords in abbreviation
			var property = abbr.substring(0, abbr.length - value.length);
			var keywords = [];
			// try to extract some commonly-used properties
			while (~property.indexOf('-') && !resources.findSnippet(syntax, property)) {
				var parts = property.split('-');
				var lastPart = parts.pop();
				if (!isValidKeyword(lastPart)) {
					break;
				}
				
				keywords.unshift(lastPart);
				property = parts.join('-');
			}

			return keywords.join('-') + value;
		},
		
		parseValues: function(str) {
			/** @type StringStream */
			var stream = stringStream.create(str);
			var values = [];
			var ch = null;
			
			while ((ch = stream.next())) {
				if (ch == '$') {
					stream.match(/^[^\$]+/, true);
					values.push(stream.current());
				} else if (ch == '#') {
					stream.match(/^t|[0-9a-f]+(\.\d+)?/i, true);
					values.push(stream.current());
				} else if (ch == '-') {
					if (isValidKeyword(utils.last(values)) || 
							( stream.start && isNumeric(str.charAt(stream.start - 1)) )
						) {
						stream.start = stream.pos;
					}
					
					stream.match(/^\-?[0-9]*(\.[0-9]+)?[a-z%\.]*/, true);
					values.push(stream.current());
				} else {
					stream.match(/^[0-9]*(\.[0-9]*)?[a-z%]*/, true);
					values.push(stream.current());
				}
				
				stream.start = stream.pos;
			}
			
			return values
				.filter(function(item) {
					return !!item;
				})
				.map(normalizeValue);
		},
		
		/**
		 * Extracts values from abbreviation
		 * @param {String} abbr
		 * @returns {Object} Object containing array of values and clean 
		 * abbreviation name
		 */
		extractValues: function(abbr) {
			// search for value start
			var abbrValues = this.findValuesInAbbreviation(abbr);
			if (!abbrValues) {
				return {
					property: abbr,
					values: null
				};
			}
			
			return {
				property: abbr.substring(0, abbr.length - abbrValues.length).replace(/-$/, ''),
				values: this.parseValues(abbrValues)
			};
		},
		
		/**
		 * Normalizes value, defined in abbreviation.
		 * @param {String} value
		 * @param {String} property
		 * @returns {String}
		 */
		normalizeValue: function(value, property) {
			property = (property || '').toLowerCase();
			var unitlessProps = prefs.getArray('css.unitlessProperties');
			return value.replace(/^(\-?[0-9\.]+)([a-z]*)$/, function(str, val, unit) {
				if (!unit && (val == '0' || ~unitlessProps.indexOf(property)))
					return val;
				
				if (!unit)
					return val.replace(/\.$/, '') + prefs.get(~val.indexOf('.') ? 'css.floatUnit' : 'css.intUnit');
				
				return val + getUnit(unit);
			});
		},
		
		/**
		 * Expands abbreviation into a snippet
		 * @param {String} abbr Abbreviation name to expand
		 * @param {String} value Abbreviation value
		 * @param {String} syntax Currect syntax or dialect. Default is 'css'
		 * @returns {Object} Array of CSS properties and values or predefined
		 * snippet (string or element)
		 */
		expand: function(abbr, value, syntax) {
			syntax = syntax || 'css';
			var autoInsertPrefixes = prefs.get(syntax + '.autoInsertVendorPrefixes');
			
			// check if snippet should be transformed to !important
			var isImportant = /^(.+)\!$/.test(abbr);
			if (isImportant) {
				abbr = RegExp.$1;
			}

			// check if we have abbreviated resource
			var snippet = resources.findSnippet(syntax, abbr);
			if (snippet && !autoInsertPrefixes) {
				return transformSnippet(snippet, isImportant, syntax);
			}
			
			// no abbreviated resource, parse abbreviation
			var prefixData = this.extractPrefixes(abbr);
			var valuesData = this.extractValues(prefixData.property);
			var abbrData = utils.extend(prefixData, valuesData);

			if (!snippet) {
				snippet = resources.findSnippet(syntax, abbrData.property);
			} else {
				abbrData.values = null;
			}
			
			if (!snippet && prefs.get('css.fuzzySearch')) {
				// let’s try fuzzy search
				snippet = resources.fuzzyFindSnippet(syntax, abbrData.property, parseFloat(prefs.get('css.fuzzySearchMinScore')));
			}
			
			if (!snippet) {
				if (!abbrData.property || abbrData.property.endsWith(':')) {
					return null;
				}
				snippet = abbrData.property + ':' + defaultValue;
			} else if (typeof snippet !== 'string') {
				snippet = snippet.data;
			}
			
			if (!isSingleProperty(snippet)) {
				return snippet;
			}
			
			var snippetObj = this.splitSnippet(snippet);
			var result = [];
			if (!value && abbrData.values) {
				value = abbrData.values.map(function(val) {
					return this.normalizeValue(val, snippetObj.name);
				}, this).join(' ') + ';';
			}
			
			snippetObj.value = value || snippetObj.value;

			var prefixes = abbrData.prefixes == 'all' || (!abbrData.prefixes && autoInsertPrefixes) 
				? findInternalPrefixes(snippetObj.name, autoInsertPrefixes && abbrData.prefixes != 'all')
				: abbrData.prefixes;
				
				
			var names = [], propName;
			(prefixes || []).forEach(function(p) {
				if (p in vendorPrefixes) {
					propName = vendorPrefixes[p].transformName(snippetObj.name);
					names.push(propName);
					result.push(transformSnippet(propName + ':' + snippetObj.value,
							isImportant, syntax));
				}
			});
			
			// put the original property
			result.push(transformSnippet(snippetObj.name + ':' + snippetObj.value, isImportant, syntax));
			names.push(snippetObj.name);

			result = resolvePrefixedValues(snippetObj, isImportant, syntax).concat(result);
			
			if (prefs.get('css.alignVendor')) {
				var pads = utils.getStringsPads(names);
				result = result.map(function(prop, i) {
					return pads[i] + prop;
				});
			}
			
			return result;
		},
		
		/**
		 * Same as <code>expand</code> method but transforms output into 
		 * Emmet snippet
		 * @param {String} abbr
		 * @param {String} syntax
		 * @returns {String}
		 */
		expandToSnippet: function(abbr, syntax) {
			var snippet = this.expand(abbr, null, syntax);
			if (snippet === null) {
				return null;
			}

			if (Array.isArray(snippet)) {
				return snippet.join('\n');
			}
			
			if (typeof snippet !== 'string') {
				return snippet.data;
			}
			
			return snippet + '';
		},
		
		/**
		 * Split snippet into a CSS property-value pair
		 * @param {String} snippet
		 */
		splitSnippet: function(snippet) {
			snippet = utils.trim(snippet);
			if (snippet.indexOf(':') == -1) {
				return {
					name: snippet,
					value: defaultValue
				};
			}
			
			var pair = snippet.split(':');
			
			return {
				name: utils.trim(pair.shift()),
				// replace ${0} tabstop to produce valid vendor-prefixed values
				// where possible
				value: utils.trim(pair.join(':')).replace(/^(\$\{0\}|\$0)(\s*;?)$/, '${1}$2')
			};
		},
		
		getSyntaxPreference: getSyntaxPreference,
		transformSnippet: transformSnippet,
		vendorPrefixes: findVendorPrefixes
	};

	return module.exports;
});
},{"../assets/caniuse":"assets\\caniuse.js","../assets/preferences":"assets\\preferences.js","../assets/resources":"assets\\resources.js","../assets/stringStream":"assets\\stringStream.js","../editTree/css":"editTree\\css.js","../utils/common":"utils\\common.js","../utils/template":"utils\\template.js"}],"resolver\\cssGradient.js":[function(require,module,exports){
/**
 * 'Expand Abbreviation' handler that parses gradient definition from under 
 * cursor and updates CSS rule with vendor-prefixed values.
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var prefs = require('../assets/preferences');
	var resources = require('../assets/resources');
	var utils = require('../utils/common');
	var stringStream = require('../assets/stringStream');
	var cssResolver = require('./css');
	var range = require('../assets/range');
	var cssEditTree = require('../editTree/css');
	var editorUtils = require('../utils/editor');
	var linearGradient = require('./gradient/linear');

	var cssSyntaxes = ['css', 'less', 'sass', 'scss', 'stylus', 'styl'];
	
	// XXX define preferences
	prefs.define('css.gradient.prefixes', 'webkit, moz, o',
			'A comma-separated list of vendor-prefixes for which values should ' 
			+ 'be generated.');
	
	prefs.define('css.gradient.oldWebkit', false,
			'Generate gradient definition for old Webkit implementations');
	
	prefs.define('css.gradient.omitDefaultDirection', true,
		'Do not output default direction definition in generated gradients.');
	
	prefs.define('css.gradient.defaultProperty', 'background-image',
		'When gradient expanded outside CSS value context, it will produce '
			+ 'properties with this name.');
	
	prefs.define('css.gradient.fallback', false,
			'With this option enabled, CSS gradient generator will produce '
			+ '<code>background-color</code> property with gradient first color '
			+ 'as fallback for old browsers.');

	/**
	 * Resolves property name (abbreviation): searches for snippet definition in 
	 * 'resources' and returns new name of matched property
	 */
	function resolvePropertyName(name, syntax) {
		var snippet = resources.findSnippet(syntax, name);
		
		if (!snippet && prefs.get('css.fuzzySearch')) {
			var minScore = parseFloat(prefs.get('css.fuzzySearchMinScore'));
			snippet = resources.fuzzyFindSnippet(syntax, name, minScore);
		}
		
		if (snippet) {
			if (typeof snippet !== 'string') {
				snippet = snippet.data;
			}
			
			return cssResolver.splitSnippet(snippet).name;
		}
	}

	/**
	 * Returns vendor prefixes for given gradient type
	 * @param {String} type Gradient type (currently, 'linear-gradient' 
	 * is the only supported value)
	 * @return {Array}
	 */
	function getGradientPrefixes(type) {
		var prefixes = cssResolver.vendorPrefixes(type);
		if (!prefixes) {
			// disabled Can I Use, fallback to property list
			prefixes = prefs.getArray('css.gradient.prefixes');
		}

		return prefixes || [];
	}
	
	function getPrefixedNames(type) {
		var prefixes = getGradientPrefixes(type);
		var names = prefixes 
			? prefixes.map(function(p) {
				return '-' + p + '-' + type;
			}) 
			: [];
		
		names.push(type);
		
		return names;
	}
	
	/**
	 * Returns list of CSS properties with gradient
	 * @param {Array} gradient List of gradient objects
	 * @param {CSSEditElement} property Original CSS property
	 * @returns {Array}
	 */
	function getPropertiesForGradient(gradients, property) {
		var props = [];
		var propertyName = property.name();
		var omitDir = prefs.get('css.gradient.omitDefaultDirection');
		
		if (prefs.get('css.gradient.fallback') && ~propertyName.toLowerCase().indexOf('background')) {
			props.push({
				name: 'background-color',
				value: '${1:' + gradients[0].gradient.colorStops[0].color + '}'
			});
		}
		
		var value = property.value();
		getGradientPrefixes('linear-gradient').forEach(function(prefix) {
			var name = cssResolver.prefixed(propertyName, prefix);
			if (prefix == 'webkit' && prefs.get('css.gradient.oldWebkit')) {
				try {
					props.push({
						name: name,
						value: insertGradientsIntoCSSValue(gradients, value, {
							prefix: prefix, 
							oldWebkit: true,
							omitDefaultDirection: omitDir
						})
					});
				} catch(e) {}
			}
			
			props.push({
				name: name,
				value: insertGradientsIntoCSSValue(gradients, value, {
					prefix: prefix,
					omitDefaultDirection: omitDir
				})
			});
		});
		
		return props.sort(function(a, b) {
			return b.name.length - a.name.length;
		});
	}

	/**
	 * Replaces old gradient definitions in given CSS property value
	 * with new ones, preserving original formatting
	 * @param  {Array} gradients List of CSS gradients
	 * @param  {String} value     Original CSS value
	 * @param  {Object} options   Options for gradient’s stringify() method
	 * @return {String}
	 */
	function insertGradientsIntoCSSValue(gradients, value, options) {
		// gradients *should* passed in order they actually appear in CSS property
		// iterate over it in backward direction to preserve gradient locations
		options = options || {};
		gradients = utils.clone(gradients);
		gradients.reverse().forEach(function(item, i) {
			var suffix = !i && options.placeholder ? options.placeholder : '';
			var str = options.oldWebkit ? item.gradient.stringifyOldWebkit(options) : item.gradient.stringify(options);
			value = utils.replaceSubstring(value, str + suffix, item.matchedPart);
		});

		return value;
	}

	/**
	 * Returns list of properties with the same meaning 
	 * (e.g. vendor-prefixed + original name)
	 * @param  {String} property CSS property name
	 * @return {Array}
	 */
	function similarPropertyNames(property) {
		if (typeof property !== 'string') {
			property = property.name();
		}

		var similarProps = (cssResolver.vendorPrefixes(property) || []).map(function(prefix) {
			return '-' + prefix + '-' + property;
		});
		similarProps.push(property);
		return similarProps;
	}
	
	/**
	 * Pastes gradient definition into CSS rule with correct vendor-prefixes
	 * @param {EditElement} property Matched CSS property
	 * @param {Array} gradients List of gradients to insert
	 */
	function pasteGradient(property, gradients) {
		var rule = property.parent;
		var alignVendor = prefs.get('css.alignVendor');
		var omitDir = prefs.get('css.gradient.omitDefaultDirection');
		
		// we may have aligned gradient definitions: find the smallest value
		// separator
		var sep = property.styleSeparator;
		var before = property.styleBefore;
		
		// first, remove all properties within CSS rule with the same name and
		// gradient definition
		rule.getAll(similarPropertyNames(property)).forEach(function(item) {
			if (item != property && /gradient/i.test(item.value())) {
				if (item.styleSeparator.length < sep.length) {
					sep = item.styleSeparator;
				}
				if (item.styleBefore.length < before.length) {
					before = item.styleBefore;
				}
				rule.remove(item);
			}
		});
		
		if (alignVendor) {
			// update prefix
			if (before != property.styleBefore) {
				var fullRange = property.fullRange();
				rule._updateSource(before, fullRange.start, fullRange.start + property.styleBefore.length);
				property.styleBefore = before;
			}
			
			// update separator value
			if (sep != property.styleSeparator) {
				rule._updateSource(sep, property.nameRange().end, property.valueRange().start);
				property.styleSeparator = sep;
			}
		}
		
		var value = property.value();

		// create list of properties to insert
		var propsToInsert = getPropertiesForGradient(gradients, property);
		
		// align prefixed values
		if (alignVendor) {
			var names = [], values = [];
			propsToInsert.forEach(function(item) {
				names.push(item.name);
				values.push(item.value);
			});
			values.push(property.value());
			names.push(property.name());
			
			var valuePads = utils.getStringsPads(values.map(function(v) {
				return v.substring(0, v.indexOf('('));
			}));
			
			var namePads = utils.getStringsPads(names);
			property.name(namePads[namePads.length - 1] + property.name());
			
			propsToInsert.forEach(function(prop, i) {
				prop.name = namePads[i] + prop.name;
				prop.value = valuePads[i] + prop.value;
			});
			
			property.value(valuePads[valuePads.length - 1] + property.value());
		}
		
		// put vendor-prefixed definitions before current rule
		propsToInsert.forEach(function(prop) {
			rule.add(prop.name, prop.value, rule.indexOf(property));
		});

		// put vanilla-clean gradient definition into current rule
		property.value(insertGradientsIntoCSSValue(gradients, value, {
			placeholder: '${2}',
			omitDefaultDirection: omitDir
		}));
	}

	/**
	 * Validates caret position relatively to located gradients
	 * in CSS rule. In other words, it checks if it’s safe to 
	 * expand gradients for current caret position or not.
	 * 
	 * See issue https://github.com/sergeche/emmet-sublime/issues/411
	 * 
	 * @param  {Array} gradients List of parsed gradients
	 * @param  {Number} caretPos  Current caret position
	 * @param  {String} syntax    Current document syntax
	 * @return {Boolean}
	 */
	function isValidCaretPosition(gradients, caretPos, syntax) {
		syntax = syntax || 'css';
		if (syntax == 'css' || syntax == 'less' || syntax == 'scss') {
			return true;
		}

		var offset = gradients.property.valueRange(true).start;
		var parts = gradients.gradients;

		// in case of preprocessors where properties are separated with
		// newlines, make sure there’s no gradient definition past
		// current caret position. 
		for (var i = parts.length - 1; i >= 0; i--) {
			if (parts[i].matchedPart.start + offset >= caretPos) {
				return false;
			}
		}

		return true;
	}
	
	module = module || {};
	return module.exports = {
		/**
		 * Search for gradient definitions inside CSS property value
		 * @returns {Array} Array of matched gradients
		 */
		findGradients: function(cssProp) {
			var value = cssProp.value();
			var gradients = [];
			var that = this;
			cssProp.valueParts().forEach(function(part) {
				var partValue = part.substring(value);
				if (linearGradient.isLinearGradient(partValue)) {
					var gradient = linearGradient.parse(partValue);
					if (gradient) {
						gradients.push({
							gradient: gradient,
							matchedPart: part
						});
					}
				}
			});
			
			return gradients.length ? gradients : null;
		},

		/**
		 * Returns list of gradients found in CSS property
		 * of given CSS code in specified (caret) position
		 * @param  {String} css CSS code snippet
		 * @param  {Number} pos Character index where to start searching for CSS property
		 * @return {Array}
		 */
		gradientsFromCSSProperty: function(css, pos) {
			var cssProp = cssEditTree.propertyFromPosition(css, pos);
			if (cssProp) {
				var grd = this.findGradients(cssProp);
				if (grd) {
					return {
						property: cssProp,
						gradients: grd
					};
				}
			}

			return null;
		},

		/**
		 * Handler for “Expand Abbreviation” action
		 * @param  {IEmmetEditor} editor
		 * @param  {String} syntax
		 * @param  {String} profile
		 * return {Boolean}
		 */
		expandAbbreviationHandler: function(editor, syntax, profile) {
			var info = editorUtils.outputInfo(editor, syntax, profile);
			if (!~cssSyntaxes.indexOf(info.syntax)) {
				return false;
			}
			
			// let's see if we are expanding gradient definition
			var caret = editor.getCaretPos();
			var content = info.content;
			var gradients = this.gradientsFromCSSProperty(content, caret);
			if (gradients) {
				if (!isValidCaretPosition(gradients, caret, info.syntax)) {
					return false;
				}

				var cssProperty = gradients.property;
				var cssRule = cssProperty.parent;
				var ruleStart = cssRule.options.offset || 0;
				var ruleEnd = ruleStart + cssRule.toString().length;
				
				// Handle special case:
				// user wrote gradient definition between existing CSS 
				// properties and did not finished it with semicolon.
				// In this case, we have semicolon right after gradient 
				// definition and re-parse rule again
				if (/[\n\r]/.test(cssProperty.value())) {
					// insert semicolon at the end of gradient definition
					var insertPos = cssProperty.valueRange(true).start + utils.last(gradients.gradients).matchedPart.end;
					content = utils.replaceSubstring(content, ';', insertPos);
					
					var _gradients = this.gradientsFromCSSProperty(content, caret);
					if (_gradients) {
						gradients = _gradients;
						cssProperty = gradients.property;
						cssRule = cssProperty.parent;
					}
				}
				
				// make sure current property has terminating semicolon
				cssProperty.end(';');
				
				// resolve CSS property name
				var resolvedName = resolvePropertyName(cssProperty.name(), syntax);
				if (resolvedName) {
					cssProperty.name(resolvedName);
				}
				
				pasteGradient(cssProperty, gradients.gradients);
				editor.replaceContent(cssRule.toString(), ruleStart, ruleEnd, true);
				return true;
			}
			
			return this.expandGradientOutsideValue(editor, syntax);
		},

		/**
		 * Tries to expand gradient outside CSS value 
		 * @param {IEmmetEditor} editor
		 * @param {String} syntax
		 */
		expandGradientOutsideValue: function(editor, syntax) {
			var propertyName = prefs.get('css.gradient.defaultProperty');
			var omitDir = prefs.get('css.gradient.omitDefaultDirection');
			
			if (!propertyName) {
				return false;
			}
			
			// assuming that gradient definition is written on new line,
			// do a simplified parsing
			var content = String(editor.getContent());
			/** @type Range */
			var lineRange = range.create(editor.getCurrentLineRange());
			
			// get line content and adjust range with padding
			var line = lineRange.substring(content)
				.replace(/^\s+/, function(pad) {
					lineRange.start += pad.length;
					return '';
				})
				.replace(/\s+$/, function(pad) {
					lineRange.end -= pad.length;
					return '';
				});

			// trick parser: make it think that we’re parsing actual CSS property
			var fakeCSS = 'a{' + propertyName + ': ' + line + ';}';
			var gradients = this.gradientsFromCSSProperty(fakeCSS, fakeCSS.length - 2);
			if (gradients) {
				var props = getPropertiesForGradient(gradients.gradients, gradients.property);
				props.push({
					name: gradients.property.name(),
					value: insertGradientsIntoCSSValue(gradients.gradients, gradients.property.value(), {
						placeholder: '${2}',
						omitDefaultDirection: omitDir
					})
				});
				
				var sep = cssResolver.getSyntaxPreference('valueSeparator', syntax);
				var end = cssResolver.getSyntaxPreference('propertyEnd', syntax);
				
				if (prefs.get('css.alignVendor')) {
					var pads = utils.getStringsPads(props.map(function(prop) {
						return prop.value.substring(0, prop.value.indexOf('('));
					}));
					props.forEach(function(prop, i) {
						prop.value = pads[i] + prop.value;
					});
				}
				
				props = props.map(function(item) {
					return item.name + sep + item.value + end;
				});
				
				editor.replaceContent(props.join('\n'), lineRange.start, lineRange.end);
				return true;
			}
			
			return false;
		},

		/**
		 * Handler for “Reflect CSS Value“ action
		 * @param  {String} property
		 */
		reflectValueHandler: function(property) {
			var omitDir = prefs.get('css.gradient.omitDefaultDirection');
			var gradients = this.findGradients(property);
			if (!gradients) {
				return false;
			}
			
			var that = this;
			var value = property.value();
			
			// reflect value for properties with the same name
			property.parent.getAll(similarPropertyNames(property)).forEach(function(prop) {
				if (prop === property) {
					return;
				}

				// make sure current property contains gradient definition,
				// otherwise – skip it
				var localGradients = that.findGradients(prop);
				if (localGradients) {
					// detect vendor prefix for current property
					var localValue = prop.value();
					var dfn = localGradients[0].matchedPart.substring(localValue);
					var prefix = '';
					if (/^\s*\-([a-z]+)\-/.test(dfn)) {
						prefix = RegExp.$1;
					}

					prop.value(insertGradientsIntoCSSValue(gradients, value, {
						prefix: prefix,
						omitDefaultDirection: omitDir
					}));
				}
			});
			
			return true;
		}
	};
});
},{"../assets/preferences":"assets\\preferences.js","../assets/range":"assets\\range.js","../assets/resources":"assets\\resources.js","../assets/stringStream":"assets\\stringStream.js","../editTree/css":"editTree\\css.js","../utils/common":"utils\\common.js","../utils/editor":"utils\\editor.js","./css":"resolver\\css.js","./gradient/linear":"resolver\\gradient\\linear.js"}],"resolver\\gradient\\linear.js":[function(require,module,exports){
/**
 * CSS linear gradient definition
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var stringStream = require('../../assets/stringStream');
	var utils = require('../../utils/common');

	// all directions are expressed in “new style” degrees
	var directions = {
		'bottom': 0,
		'bottom left': 45,
		'left': 90,
		'top left': 135,
		'top': 180,
		'top right': 225,
		'right': 270,
		'bottom right': 315,
		
		'to top': 0,
		'to top right': 45,
		'to right': 90,
		'to bottom right': 135,
		'to bottom': 180,
		'to bottom left': 225,
		'to left': 270,
		'to top left': 315
	};

	var defaultDirections = ['top', 'to bottom', '0deg'];


	var reLinearGradient = /^\s*(\-[a-z]+\-)?(lg|linear\-gradient)\s*\(/i;
	var reDeg = /(\d+)deg/i;
	var reKeyword = /top|bottom|left|right/i;

	function LinearGradient(dfn) {
		this.colorStops = [];
		this.direction = 180;

		// extract tokens
		var stream = stringStream.create(utils.trim(dfn));
		var ch, cur;
		while ((ch = stream.next())) {
			if (stream.peek() == ',') {
				// Is it a first entry? Check if it’s a direction
				cur = stream.current();

				if (!this.colorStops.length && (reDeg.test(cur) || reKeyword.test(cur))) {
					this.direction = resolveDirection(cur);
				} else {
					this.addColorStop(cur);
				}
				
				stream.next();
				stream.eatSpace();
				stream.start = stream.pos;
			} else if (ch == '(') { // color definition, like 'rgb(0,0,0)'
				stream.skipTo(')');
			}
		}
		
		// add last token
		this.addColorStop(stream.current());		
	}

	LinearGradient.prototype = {
		type: 'linear-gradient',
		addColorStop: function(color, ix) {
			color = normalizeSpace(color || '');
			if (!color) {
				return;
			}

			color = this.parseColorStop(color);

			if (typeof ix === 'undefined') {
				this.colorStops.push(color);
			} else {
				this.colorStops.splice(ix, 0, color);
			}
		},

		/**
		 * Parses color stop definition
		 * @param {String} colorStop
		 * @returns {Object}
		 */
		parseColorStop: function(colorStop) {
			colorStop = normalizeSpace(colorStop);
			
			// find color declaration
			// first, try complex color declaration, like rgb(0,0,0)
			var color = null;
			colorStop = colorStop.replace(/^(\w+\(.+?\))\s*/, function(str, c) {
				color = c;
				return '';
			});
			
			if (!color) {
				// try simple declaration, like yellow, #fco, #ffffff, etc.
				var parts = colorStop.split(' ');
				color = parts[0];
				colorStop = parts[1] || '';
			}
			
			var result = {
				color: color
			};
			
			if (colorStop) {
				// there's position in color stop definition
				colorStop.replace(/^(\-?[\d\.]+)([a-z%]+)?$/, function(str, pos, unit) {
					result.position = pos;
					if (~pos.indexOf('.')) {
						unit = '';
					} else if (!unit) {
						unit = '%';
					}
					
					if (unit) {
						result.unit = unit;
					}
				});
			}
			
			return result;
		},

		stringify: function(options) {
			options = options || {};
			var fn = 'linear-gradient';
			if (options.prefix) {
				fn = '-' + options.prefix + '-' + fn;
			}
				
			// transform color-stops
			var parts = this.colorStops.map(function(cs) {
				var pos = cs.position ? ' ' + cs.position + (cs.unit || '') : '';
				return cs.color + pos;
			});

			var dir = stringifyDirection(this.direction, !!options.prefix);
			if (!options.omitDefaultDirection || !~defaultDirections.indexOf(dir)) {
				parts.unshift(dir);
			}

			return fn + '(' + parts.join(', ') + ')';
		},

		stringifyOldWebkit: function() {
			var colorStops = this.colorStops.map(function(item) {
				return utils.clone(item);
			});
			
			// normalize color-stops position
			colorStops.forEach(function(cs) {
				if (!('position' in cs)) // implied position
					return;
				
				if (~cs.position.indexOf('.') || cs.unit == '%') {
					cs.position = parseFloat(cs.position) / (cs.unit == '%' ? 100 : 1);
				} else {
					throw "Can't convert color stop '" + (cs.position + (cs.unit || '')) + "'";
				}
			});
			
			this._fillImpliedPositions(colorStops);
			
			// transform color-stops into string representation
			colorStops = colorStops.map(function(cs, i) {
				if (!cs.position && !i) {
					return 'from(' + cs.color + ')';
				}
				
				if (cs.position == 1 && i == colorStops.length - 1) {
					return 'to(' + cs.color + ')';
				}
				
				return 'color-stop(' + (cs.position.toFixed(2).replace(/\.?0+$/, '')) + ', ' + cs.color + ')';
			});
			
			return '-webkit-gradient(linear, ' 
				+ oldWebkitDirection((this.direction + 180) % 360)
				+ ', '
				+ colorStops.join(', ')
				+ ')';
		},

		/**
		 * Fills-out implied positions in color-stops. This function is useful for
		 * old Webkit gradient definitions
		 */
		_fillImpliedPositions: function(colorStops) {
			var from = 0;
			
			colorStops.forEach(function(cs, i) {
				// make sure that first and last positions are defined
				if (!i) {
					return cs.position = cs.position || 0;
				}
				
				if (i == colorStops.length - 1 && !('position' in cs)) {
					cs.position = 1;
				}
				
				if ('position' in cs) {
					var start = colorStops[from].position || 0;
					var step = (cs.position - start) / (i - from);
					colorStops.slice(from, i).forEach(function(cs2, j) {
						cs2.position = start + step * j;
					});
					
					from = i;
				}
			});
		},

		valueOf: function() {
			return this.stringify();
		}
	};

	function normalizeSpace(str) {
		return utils.trim(str).replace(/\s+/g, ' ');
	}

	/**
	 * Resolves textual direction to degrees
	 * @param  {String} dir Direction to resolve
	 * @return {Number}
	 */
	function resolveDirection(dir) {
		if (typeof dir == 'number') {
			return dir;
		}

		dir = normalizeSpace(dir).toLowerCase();
		if (reDeg.test(dir)) {
			return +RegExp.$1;
		}

		var prefix = /^to\s/.test(dir) ? 'to ' : '';
		var left   = ~dir.indexOf('left')   && 'left';
		var right  = ~dir.indexOf('right')  && 'right';
		var top    = ~dir.indexOf('top')    && 'top';
		var bottom = ~dir.indexOf('bottom') && 'bottom';

		var key = normalizeSpace(prefix + (top || bottom || '') + ' ' + (left || right || ''));
		return directions[key] || 0;
	}

	/**
	 * Tries to find keyword for given direction, expressed in degrees
	 * @param  {Number} dir Direction (degrees)
	 * @param {Boolean} oldStyle Use old style keywords (e.g. "top" instead of "to bottom")
	 * @return {String}     Keyword or <code>Ndeg</code> expression
	 */
	function stringifyDirection(dir, oldStyle) {
		var reNewStyle = /^to\s/;
		var keys = Object.keys(directions).filter(function(k) {
			var hasPrefix = reNewStyle.test(k);
			return oldStyle ? !hasPrefix : hasPrefix;
		});

		for (var i = 0; i < keys.length; i++) {
			if (directions[keys[i]] == dir) {
				return keys[i];
			}
		}

		if (oldStyle) {
			dir = (dir + 270) % 360;
		}

		return dir + 'deg';
	}

	/**
	 * Creates direction definition for old Webkit gradients
	 * @param {String} direction
	 * @returns {String}
	 */
	function oldWebkitDirection(dir) {
		dir = stringifyDirection(dir, true);
		
		if(reDeg.test(dir)) {
			throw "The direction is an angle that can’t be converted.";
		}
		
		var v = function(pos) {
			return ~dir.indexOf(pos) ? '100%' : '0';
		};
		
		return v('left') + ' ' + v('top') + ', ' + v('right') + ' ' + v('bottom');
	}

	return {
		/**
		 * Parses gradient definition into an object.
		 * This object can be used to transform gradient into various
		 * forms
		 * @param  {String} gradient Gradient definition
		 * @return {LinearGradient}
		 */
		parse: function(gradient) {
			// cut out all redundant data
			if (this.isLinearGradient(gradient)) {
				gradient = gradient.replace(/^\s*[\-a-z]+\s*\(|\)\s*$/ig, '');
			} else {
				throw 'Invalid linear gradient definition:\n' + gradient;
			}

			return new LinearGradient(gradient);
		},

		/**
		 * Check if given string can be parsed as linear gradient
		 * @param  {String}  str
		 * @return {Boolean}
		 */
		isLinearGradient: function(str) {
			return reLinearGradient.test(str);
		},

		resolveDirection: resolveDirection,
		stringifyDirection: stringifyDirection
	};
});
},{"../../assets/stringStream":"assets\\stringStream.js","../../utils/common":"utils\\common.js"}],"resolver\\tagName.js":[function(require,module,exports){
/**
 * Module for resolving tag names: returns best matched tag name for child
 * element based on passed parent's tag name. Also provides utility function
 * for element type detection (inline, block-level, empty)
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');
	
	var elementTypes = {
//		empty: 'area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed,keygen,command'.split(','),
		empty: [],
		blockLevel: 'address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,link,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul,h1,h2,h3,h4,h5,h6'.split(','),
		inlineLevel: 'a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'.split(',')
	};
	
	var elementMap = {
		'p': 'span',
		'ul': 'li',
		'ol': 'li',
		'table': 'tr',
		'tr': 'td',
		'tbody': 'tr',
		'thead': 'tr',
		'tfoot': 'tr',
		'colgroup': 'col',
		'select': 'option',
		'optgroup': 'option',
		'audio': 'source',
		'video': 'source',
		'object': 'param',
		'map': 'area'
	};
	
	return {
		/**
		 * Returns best matched child element name for passed parent's
		 * tag name
		 * @param {String} name
		 * @returns {String}
		 * @memberOf tagName
		 */
		resolve: function(name) {
			name = (name || '').toLowerCase();
			
			if (name in elementMap)
				return this.getMapping(name);
			
			if (this.isInlineLevel(name))
				return 'span';
			
			return 'div';
		},
		
		/**
		 * Returns mapped child element name for passed parent's name 
		 * @param {String} name
		 * @returns {String}
		 */
		getMapping: function(name) {
			return elementMap[name.toLowerCase()];
		},
		
		/**
		 * Check if passed element name belongs to inline-level element
		 * @param {String} name
		 * @returns {Boolean}
		 */
		isInlineLevel: function(name) {
			return this.isTypeOf(name, 'inlineLevel');
		},
		
		/**
		 * Check if passed element belongs to block-level element.
		 * For better matching of unknown elements (for XML, for example), 
		 * you should use <code>!this.isInlineLevel(name)</code>
		 * @returns {Boolean}
		 */
		isBlockLevel: function(name) {
			return this.isTypeOf(name, 'blockLevel');
		},
		
		/**
		 * Check if passed element is void (i.e. should not have closing tag).
		 * @returns {Boolean}
		 */
		isEmptyElement: function(name) {
			return this.isTypeOf(name, 'empty');
		},
		
		/**
		 * Generic function for testing if element name belongs to specified
		 * elements collection
		 * @param {String} name Element name
		 * @param {String} type Collection name
		 * @returns {Boolean}
		 */
		isTypeOf: function(name, type) {
			return ~elementTypes[type].indexOf(name);
		},
		
		/**
		 * Adds new parent–child mapping
		 * @param {String} parent
		 * @param {String} child
		 */
		addMapping: function(parent, child) {
			elementMap[parent] = child;
		},
		
		/**
		 * Removes parent-child mapping
		 */
		removeMapping: function(parent) {
			if (parent in elementMap)
				delete elementMap[parent];
		},
		
		/**
		 * Adds new element into collection
		 * @param {String} name Element name
		 * @param {String} collection Collection name
		 */
		addElementToCollection: function(name, collection) {
			if (!elementTypes[collection])
				elementTypes[collection] = [];
			
			var col = this.getCollection(collection);
			if (!~col.indexOf(name)) {
				col.push(name);
			}
		},
		
		/**
		 * Removes element name from specified collection
		 * @param {String} name Element name
		 * @param {String} collection Collection name
		 * @returns
		 */
		removeElementFromCollection: function(name, collection) {
			if (collection in elementTypes) {
				elementTypes[collection] = utils.without(this.getCollection(collection), name);
			}
		},
		
		/**
		 * Returns elements name collection
		 * @param {String} name Collection name
		 * @returns {Array}
		 */
		getCollection: function(name) {
			return elementTypes[name];
		}
	};
});
},{"../utils/common":"utils\\common.js"}],"snippets.json":[function(require,module,exports){
module.exports={
	"variables": {
		"lang": "en",
		"locale": "en-US",
		"charset": "UTF-8",
		"indentation": "\t",
		"newline": "\n"
	},
	
	"css": {
		"filters": "css",
		"profile": "css",
		"snippets": {
			"@i": "@import url(|);",
			"@import": "@import url(|);",
			"@m": "@media ${1:screen} {\n\t|\n}",
			"@media": "@media ${1:screen} {\n\t|\n}",
			"@f": "@font-face {\n\tfont-family:|;\n\tsrc:url(|);\n}",
			"@f+": "@font-face {\n\tfont-family: '${1:FontName}';\n\tsrc: url('${2:FileName}.eot');\n\tsrc: url('${2:FileName}.eot?#iefix') format('embedded-opentype'),\n\t\t url('${2:FileName}.woff') format('woff'),\n\t\t url('${2:FileName}.ttf') format('truetype'),\n\t\t url('${2:FileName}.svg#${1:FontName}') format('svg');\n\tfont-style: ${3:normal};\n\tfont-weight: ${4:normal};\n}",

			"@kf": "@-webkit-keyframes ${1:identifier} {\n\t${2:from} { ${3} }${6}\n\t${4:to} { ${5} }\n}\n@-o-keyframes ${1:identifier} {\n\t${2:from} { ${3} }${6}\n\t${4:to} { ${5} }\n}\n@-moz-keyframes ${1:identifier} {\n\t${2:from} { ${3} }${6}\n\t${4:to} { ${5} }\n}\n@keyframes ${1:identifier} {\n\t${2:from} { ${3} }${6}\n\t${4:to} { ${5} }\n}",

			"anim": "animation:|;",
			"anim-": "animation:${1:name} ${2:duration} ${3:timing-function} ${4:delay} ${5:iteration-count} ${6:direction} ${7:fill-mode};",
			"animdel": "animation-delay:${1:time};",
			
			"animdir": "animation-direction:${1:normal};",
			"animdir:n": "animation-direction:normal;",
			"animdir:r": "animation-direction:reverse;",
			"animdir:a": "animation-direction:alternate;",
			"animdir:ar": "animation-direction:alternate-reverse;",
			
			"animdur": "animation-duration:${1:0}s;",
			
			"animfm": "animation-fill-mode:${1:both};",
			"animfm:f": "animation-fill-mode:forwards;",
			"animfm:b": "animation-fill-mode:backwards;",
			"animfm:bt": "animation-fill-mode:both;",
			"animfm:bh": "animation-fill-mode:both;",
			
			"animic": "animation-iteration-count:${1:1};",
			"animic:i": "animation-iteration-count:infinite;",
			
			"animn": "animation-name:${1:none};",

			"animps": "animation-play-state:${1:running};",
			"animps:p": "animation-play-state:paused;",
			"animps:r": "animation-play-state:running;",

			"animtf": "animation-timing-function:${1:linear};",
			"animtf:e": "animation-timing-function:ease;",
			"animtf:ei": "animation-timing-function:ease-in;",
			"animtf:eo": "animation-timing-function:ease-out;",
			"animtf:eio": "animation-timing-function:ease-in-out;",
			"animtf:l": "animation-timing-function:linear;",
			"animtf:cb": "animation-timing-function:cubic-bezier(${1:0.1}, ${2:0.7}, ${3:1.0}, ${3:0.1});",
			
			"ap": "appearance:${none};",

			"!": "!important",
			"pos": "position:${1:relative};",
			"pos:s": "position:static;",
			"pos:a": "position:absolute;",
			"pos:r": "position:relative;",
			"pos:f": "position:fixed;",
			"t": "top:|;",
			"t:a": "top:auto;",
			"r": "right:|;",
			"r:a": "right:auto;",
			"b": "bottom:|;",
			"b:a": "bottom:auto;",
			"l": "left:|;",
			"l:a": "left:auto;",
			"z": "z-index:|;",
			"z:a": "z-index:auto;",
			"fl": "float:${1:left};",
			"fl:n": "float:none;",
			"fl:l": "float:left;",
			"fl:r": "float:right;",
			"cl": "clear:${1:both};",
			"cl:n": "clear:none;",
			"cl:l": "clear:left;",
			"cl:r": "clear:right;",
			"cl:b": "clear:both;",

			"colm": "columns:|;",
			"colmc": "column-count:|;",
			"colmf": "column-fill:|;",
			"colmg": "column-gap:|;",
			"colmr": "column-rule:|;",
			"colmrc": "column-rule-color:|;",
			"colmrs": "column-rule-style:|;",
			"colmrw": "column-rule-width:|;",
			"colms": "column-span:|;",
			"colmw": "column-width:|;",

			"d": "display:${1:block};",
			"d:n": "display:none;",
			"d:b": "display:block;",
			"d:f": "display:flex;",
			"d:if": "display:inline-flex;",
			"d:i": "display:inline;",
			"d:ib": "display:inline-block;",
			"d:ib+": "display: inline-block;\n*display: inline;\n*zoom: 1;",
			"d:li": "display:list-item;",
			"d:ri": "display:run-in;",
			"d:cp": "display:compact;",
			"d:tb": "display:table;",
			"d:itb": "display:inline-table;",
			"d:tbcp": "display:table-caption;",
			"d:tbcl": "display:table-column;",
			"d:tbclg": "display:table-column-group;",
			"d:tbhg": "display:table-header-group;",
			"d:tbfg": "display:table-footer-group;",
			"d:tbr": "display:table-row;",
			"d:tbrg": "display:table-row-group;",
			"d:tbc": "display:table-cell;",
			"d:rb": "display:ruby;",
			"d:rbb": "display:ruby-base;",
			"d:rbbg": "display:ruby-base-group;",
			"d:rbt": "display:ruby-text;",
			"d:rbtg": "display:ruby-text-group;",
			"v": "visibility:${1:hidden};",
			"v:v": "visibility:visible;",
			"v:h": "visibility:hidden;",
			"v:c": "visibility:collapse;",
			"ov": "overflow:${1:hidden};",
			"ov:v": "overflow:visible;",
			"ov:h": "overflow:hidden;",
			"ov:s": "overflow:scroll;",
			"ov:a": "overflow:auto;",
			"ovx": "overflow-x:${1:hidden};",
			"ovx:v": "overflow-x:visible;",
			"ovx:h": "overflow-x:hidden;",
			"ovx:s": "overflow-x:scroll;",
			"ovx:a": "overflow-x:auto;",
			"ovy": "overflow-y:${1:hidden};",
			"ovy:v": "overflow-y:visible;",
			"ovy:h": "overflow-y:hidden;",
			"ovy:s": "overflow-y:scroll;",
			"ovy:a": "overflow-y:auto;",
			"ovs": "overflow-style:${1:scrollbar};",
			"ovs:a": "overflow-style:auto;",
			"ovs:s": "overflow-style:scrollbar;",
			"ovs:p": "overflow-style:panner;",
			"ovs:m": "overflow-style:move;",
			"ovs:mq": "overflow-style:marquee;",
			"zoo": "zoom:1;",
			"zm": "zoom:1;",
			"cp": "clip:|;",
			"cp:a": "clip:auto;",
			"cp:r": "clip:rect(${1:top} ${2:right} ${3:bottom} ${4:left});",
			"bxz": "box-sizing:${1:border-box};",
			"bxz:cb": "box-sizing:content-box;",
			"bxz:bb": "box-sizing:border-box;",
			"bxsh": "box-shadow:${1:inset }${2:hoff} ${3:voff} ${4:blur} ${5:color};",
			"bxsh:r": "box-shadow:${1:inset }${2:hoff} ${3:voff} ${4:blur} ${5:spread }rgb(${6:0}, ${7:0}, ${8:0});",
			"bxsh:ra": "box-shadow:${1:inset }${2:h} ${3:v} ${4:blur} ${5:spread }rgba(${6:0}, ${7:0}, ${8:0}, .${9:5});",
			"bxsh:n": "box-shadow:none;",
			"m": "margin:|;",
			"m:a": "margin:auto;",
			"mt": "margin-top:|;",
			"mt:a": "margin-top:auto;",
			"mr": "margin-right:|;",
			"mr:a": "margin-right:auto;",
			"mb": "margin-bottom:|;",
			"mb:a": "margin-bottom:auto;",
			"ml": "margin-left:|;",
			"ml:a": "margin-left:auto;",
			"p": "padding:|;",
			"pt": "padding-top:|;",
			"pr": "padding-right:|;",
			"pb": "padding-bottom:|;",
			"pl": "padding-left:|;",
			"w": "width:|;",
			"w:a": "width:auto;",
			"h": "height:|;",
			"h:a": "height:auto;",
			"maw": "max-width:|;",
			"maw:n": "max-width:none;",
			"mah": "max-height:|;",
			"mah:n": "max-height:none;",
			"miw": "min-width:|;",
			"mih": "min-height:|;",
			"mar": "max-resolution:${1:res};",
			"mir": "min-resolution:${1:res};",
			"ori": "orientation:|;",
			"ori:l": "orientation:landscape;",
			"ori:p": "orientation:portrait;",
			"ol": "outline:|;",
			"ol:n": "outline:none;",
			"olo": "outline-offset:|;",
			"olw": "outline-width:|;",
			"olw:tn": "outline-width:thin;",
			"olw:m": "outline-width:medium;",
			"olw:tc": "outline-width:thick;",
			"ols": "outline-style:|;",
			"ols:n": "outline-style:none;",
			"ols:dt": "outline-style:dotted;",
			"ols:ds": "outline-style:dashed;",
			"ols:s": "outline-style:solid;",
			"ols:db": "outline-style:double;",
			"ols:g": "outline-style:groove;",
			"ols:r": "outline-style:ridge;",
			"ols:i": "outline-style:inset;",
			"ols:o": "outline-style:outset;",
			"olc": "outline-color:#${1:000};",
			"olc:i": "outline-color:invert;",
			"bfv": "backface-visibility:|;",
			"bfv:h": "backface-visibility:hidden;",
			"bfv:v": "backface-visibility:visible;",
			"bd": "border:|;",
			"bd+": "border:${1:1px} ${2:solid} ${3:#000};",
			"bd:n": "border:none;",
			"bdbk": "border-break:${1:close};",
			"bdbk:c": "border-break:close;",
			"bdcl": "border-collapse:|;",
			"bdcl:c": "border-collapse:collapse;",
			"bdcl:s": "border-collapse:separate;",
			"bdc": "border-color:#${1:000};",
			"bdc:t": "border-color:transparent;",
			"bdi": "border-image:url(|);",
			"bdi:n": "border-image:none;",
			"bdti": "border-top-image:url(|);",
			"bdti:n": "border-top-image:none;",
			"bdri": "border-right-image:url(|);",
			"bdri:n": "border-right-image:none;",
			"bdbi": "border-bottom-image:url(|);",
			"bdbi:n": "border-bottom-image:none;",
			"bdli": "border-left-image:url(|);",
			"bdli:n": "border-left-image:none;",
			"bdci": "border-corner-image:url(|);",
			"bdci:n": "border-corner-image:none;",
			"bdci:c": "border-corner-image:continue;",
			"bdtli": "border-top-left-image:url(|);",
			"bdtli:n": "border-top-left-image:none;",
			"bdtli:c": "border-top-left-image:continue;",
			"bdtri": "border-top-right-image:url(|);",
			"bdtri:n": "border-top-right-image:none;",
			"bdtri:c": "border-top-right-image:continue;",
			"bdbri": "border-bottom-right-image:url(|);",
			"bdbri:n": "border-bottom-right-image:none;",
			"bdbri:c": "border-bottom-right-image:continue;",
			"bdbli": "border-bottom-left-image:url(|);",
			"bdbli:n": "border-bottom-left-image:none;",
			"bdbli:c": "border-bottom-left-image:continue;",
			"bdf": "border-fit:${1:repeat};",
			"bdf:c": "border-fit:clip;",
			"bdf:r": "border-fit:repeat;",
			"bdf:sc": "border-fit:scale;",
			"bdf:st": "border-fit:stretch;",
			"bdf:ow": "border-fit:overwrite;",
			"bdf:of": "border-fit:overflow;",
			"bdf:sp": "border-fit:space;",
			"bdlen": "border-length:|;",
			"bdlen:a": "border-length:auto;",
			"bdsp": "border-spacing:|;",
			"bds": "border-style:|;",
			"bds:n": "border-style:none;",
			"bds:h": "border-style:hidden;",
			"bds:dt": "border-style:dotted;",
			"bds:ds": "border-style:dashed;",
			"bds:s": "border-style:solid;",
			"bds:db": "border-style:double;",
			"bds:dtds": "border-style:dot-dash;",
			"bds:dtdtds": "border-style:dot-dot-dash;",
			"bds:w": "border-style:wave;",
			"bds:g": "border-style:groove;",
			"bds:r": "border-style:ridge;",
			"bds:i": "border-style:inset;",
			"bds:o": "border-style:outset;",
			"bdw": "border-width:|;",
			"bdtw": "border-top-width:|;",
			"bdrw": "border-right-width:|;",
			"bdbw": "border-bottom-width:|;",
			"bdlw": "border-left-width:|;",
			"bdt": "border-top:|;",
			"bt": "border-top:|;",
			"bdt+": "border-top:${1:1px} ${2:solid} ${3:#000};",
			"bdt:n": "border-top:none;",
			"bdts": "border-top-style:|;",
			"bdts:n": "border-top-style:none;",
			"bdtc": "border-top-color:#${1:000};",
			"bdtc:t": "border-top-color:transparent;",
			"bdr": "border-right:|;",
			"br": "border-right:|;",
			"bdr+": "border-right:${1:1px} ${2:solid} ${3:#000};",
			"bdr:n": "border-right:none;",
			"bdrst": "border-right-style:|;",
			"bdrst:n": "border-right-style:none;",
			"bdrc": "border-right-color:#${1:000};",
			"bdrc:t": "border-right-color:transparent;",
			"bdb": "border-bottom:|;",
			"bb": "border-bottom:|;",
			"bdb+": "border-bottom:${1:1px} ${2:solid} ${3:#000};",
			"bdb:n": "border-bottom:none;",
			"bdbs": "border-bottom-style:|;",
			"bdbs:n": "border-bottom-style:none;",
			"bdbc": "border-bottom-color:#${1:000};",
			"bdbc:t": "border-bottom-color:transparent;",
			"bdl": "border-left:|;",
			"bl": "border-left:|;",
			"bdl+": "border-left:${1:1px} ${2:solid} ${3:#000};",
			"bdl:n": "border-left:none;",
			"bdls": "border-left-style:|;",
			"bdls:n": "border-left-style:none;",
			"bdlc": "border-left-color:#${1:000};",
			"bdlc:t": "border-left-color:transparent;",
			"bdrs": "border-radius:|;",
			"bdtrrs": "border-top-right-radius:|;",
			"bdtlrs": "border-top-left-radius:|;",
			"bdbrrs": "border-bottom-right-radius:|;",
			"bdblrs": "border-bottom-left-radius:|;",
			"bg": "background:#${1:000};",
			"bg+": "background:${1:#fff} url(${2}) ${3:0} ${4:0} ${5:no-repeat};",
			"bg:n": "background:none;",
			"bg:ie": "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='${1:x}.png',sizingMethod='${2:crop}');",
			"bgc": "background-color:#${1:fff};",
			"bgc:t": "background-color:transparent;",
			"bgi": "background-image:url(|);",
			"bgi:n": "background-image:none;",
			"bgr": "background-repeat:|;",
			"bgr:n": "background-repeat:no-repeat;",
			"bgr:x": "background-repeat:repeat-x;",
			"bgr:y": "background-repeat:repeat-y;",
			"bgr:sp": "background-repeat:space;",
			"bgr:rd": "background-repeat:round;",
			"bga": "background-attachment:|;",
			"bga:f": "background-attachment:fixed;",
			"bga:s": "background-attachment:scroll;",
			"bgp": "background-position:${1:0} ${2:0};",
			"bgpx": "background-position-x:|;",
			"bgpy": "background-position-y:|;",
			"bgbk": "background-break:|;",
			"bgbk:bb": "background-break:bounding-box;",
			"bgbk:eb": "background-break:each-box;",
			"bgbk:c": "background-break:continuous;",
			"bgcp": "background-clip:${1:padding-box};",
			"bgcp:bb": "background-clip:border-box;",
			"bgcp:pb": "background-clip:padding-box;",
			"bgcp:cb": "background-clip:content-box;",
			"bgcp:nc": "background-clip:no-clip;",
			"bgo": "background-origin:|;",
			"bgo:pb": "background-origin:padding-box;",
			"bgo:bb": "background-origin:border-box;",
			"bgo:cb": "background-origin:content-box;",
			"bgsz": "background-size:|;",
			"bgsz:a": "background-size:auto;",
			"bgsz:ct": "background-size:contain;",
			"bgsz:cv": "background-size:cover;",
			"c": "color:#${1:000};",
			"c:r": "color:rgb(${1:0}, ${2:0}, ${3:0});",
			"c:ra": "color:rgba(${1:0}, ${2:0}, ${3:0}, .${4:5});",
			"cm": "/* |${child} */",
			"cnt": "content:'|';",
			"cnt:n": "content:normal;",
			"cnt:oq": "content:open-quote;",
			"cnt:noq": "content:no-open-quote;",
			"cnt:cq": "content:close-quote;",
			"cnt:ncq": "content:no-close-quote;",
			"cnt:a": "content:attr(|);",
			"cnt:c": "content:counter(|);",
			"cnt:cs": "content:counters(|);",

			"tbl": "table-layout:|;",
			"tbl:a": "table-layout:auto;",
			"tbl:f": "table-layout:fixed;",
			"cps": "caption-side:|;",
			"cps:t": "caption-side:top;",
			"cps:b": "caption-side:bottom;",
			"ec": "empty-cells:|;",
			"ec:s": "empty-cells:show;",
			"ec:h": "empty-cells:hide;",
			"lis": "list-style:|;",
			"lis:n": "list-style:none;",
			"lisp": "list-style-position:|;",
			"lisp:i": "list-style-position:inside;",
			"lisp:o": "list-style-position:outside;",
			"list": "list-style-type:|;",
			"list:n": "list-style-type:none;",
			"list:d": "list-style-type:disc;",
			"list:c": "list-style-type:circle;",
			"list:s": "list-style-type:square;",
			"list:dc": "list-style-type:decimal;",
			"list:dclz": "list-style-type:decimal-leading-zero;",
			"list:lr": "list-style-type:lower-roman;",
			"list:ur": "list-style-type:upper-roman;",
			"lisi": "list-style-image:|;",
			"lisi:n": "list-style-image:none;",
			"q": "quotes:|;",
			"q:n": "quotes:none;",
			"q:ru": "quotes:'\\00AB' '\\00BB' '\\201E' '\\201C';",
			"q:en": "quotes:'\\201C' '\\201D' '\\2018' '\\2019';",
			"ct": "content:|;",
			"ct:n": "content:normal;",
			"ct:oq": "content:open-quote;",
			"ct:noq": "content:no-open-quote;",
			"ct:cq": "content:close-quote;",
			"ct:ncq": "content:no-close-quote;",
			"ct:a": "content:attr(|);",
			"ct:c": "content:counter(|);",
			"ct:cs": "content:counters(|);",
			"coi": "counter-increment:|;",
			"cor": "counter-reset:|;",
			"va": "vertical-align:${1:top};",
			"va:sup": "vertical-align:super;",
			"va:t": "vertical-align:top;",
			"va:tt": "vertical-align:text-top;",
			"va:m": "vertical-align:middle;",
			"va:bl": "vertical-align:baseline;",
			"va:b": "vertical-align:bottom;",
			"va:tb": "vertical-align:text-bottom;",
			"va:sub": "vertical-align:sub;",
			"ta": "text-align:${1:left};",
			"ta:l": "text-align:left;",
			"ta:c": "text-align:center;",
			"ta:r": "text-align:right;",
			"ta:j": "text-align:justify;",
			"ta-lst": "text-align-last:|;",
			"tal:a": "text-align-last:auto;",
			"tal:l": "text-align-last:left;",
			"tal:c": "text-align-last:center;",
			"tal:r": "text-align-last:right;",
			"td": "text-decoration:${1:none};",
			"td:n": "text-decoration:none;",
			"td:u": "text-decoration:underline;",
			"td:o": "text-decoration:overline;",
			"td:l": "text-decoration:line-through;",
			"te": "text-emphasis:|;",
			"te:n": "text-emphasis:none;",
			"te:ac": "text-emphasis:accent;",
			"te:dt": "text-emphasis:dot;",
			"te:c": "text-emphasis:circle;",
			"te:ds": "text-emphasis:disc;",
			"te:b": "text-emphasis:before;",
			"te:a": "text-emphasis:after;",
			"th": "text-height:|;",
			"th:a": "text-height:auto;",
			"th:f": "text-height:font-size;",
			"th:t": "text-height:text-size;",
			"th:m": "text-height:max-size;",
			"ti": "text-indent:|;",
			"ti:-": "text-indent:-9999px;",
			"tj": "text-justify:|;",
			"tj:a": "text-justify:auto;",
			"tj:iw": "text-justify:inter-word;",
			"tj:ii": "text-justify:inter-ideograph;",
			"tj:ic": "text-justify:inter-cluster;",
			"tj:d": "text-justify:distribute;",
			"tj:k": "text-justify:kashida;",
			"tj:t": "text-justify:tibetan;",
			"tov": "text-overflow:${ellipsis};",
			"tov:e": "text-overflow:ellipsis;",
			"tov:c": "text-overflow:clip;",
			"to": "text-outline:|;",
			"to+": "text-outline:${1:0} ${2:0} ${3:#000};",
			"to:n": "text-outline:none;",
			"tr": "text-replace:|;",
			"tr:n": "text-replace:none;",
			"tt": "text-transform:${1:uppercase};",
			"tt:n": "text-transform:none;",
			"tt:c": "text-transform:capitalize;",
			"tt:u": "text-transform:uppercase;",
			"tt:l": "text-transform:lowercase;",
			"tw": "text-wrap:|;",
			"tw:n": "text-wrap:normal;",
			"tw:no": "text-wrap:none;",
			"tw:u": "text-wrap:unrestricted;",
			"tw:s": "text-wrap:suppress;",
			"tsh": "text-shadow:${1:hoff} ${2:voff} ${3:blur} ${4:#000};",
			"tsh:r": "text-shadow:${1:h} ${2:v} ${3:blur} rgb(${4:0}, ${5:0}, ${6:0});",
			"tsh:ra": "text-shadow:${1:h} ${2:v} ${3:blur} rgba(${4:0}, ${5:0}, ${6:0}, .${7:5});",
			"tsh+": "text-shadow:${1:0} ${2:0} ${3:0} ${4:#000};",
			"tsh:n": "text-shadow:none;",
			"trf": "transform:|;",
			"trf:skx": "transform: skewX(${1:angle});",
			"trf:sky": "transform: skewY(${1:angle});",
			"trf:sc": "transform: scale(${1:x}, ${2:y});",
			"trf:scx": "transform: scaleX(${1:x});",
			"trf:scy": "transform: scaleY(${1:y});",
			"trf:scz": "transform: scaleZ(${1:z});",
			"trf:sc3": "transform: scale3d(${1:x}, ${2:y}, ${3:z});",
			"trf:r": "transform: rotate(${1:angle});",
			"trf:rx": "transform: rotateX(${1:angle});",
			"trf:ry": "transform: rotateY(${1:angle});",
			"trf:rz": "transform: rotateZ(${1:angle});",
			"trf:t": "transform: translate(${1:x}, ${2:y});",
			"trf:tx": "transform: translateX(${1:x});",
			"trf:ty": "transform: translateY(${1:y});",
			"trf:tz": "transform: translateZ(${1:z});",
			"trf:t3": "transform: translate3d(${1:tx}, ${2:ty}, ${3:tz});",
			"trfo": "transform-origin:|;",
			"trfs": "transform-style:${1:preserve-3d};",
			"trs": "transition:${1:prop} ${2:time};",
			"trsde": "transition-delay:${1:time};",
			"trsdu": "transition-duration:${1:time};",
			"trsp": "transition-property:${1:prop};",
			"trstf": "transition-timing-function:${1:tfunc};",
			"lh": "line-height:|;",
			"whs": "white-space:|;",
			"whs:n": "white-space:normal;",
			"whs:p": "white-space:pre;",
			"whs:nw": "white-space:nowrap;",
			"whs:pw": "white-space:pre-wrap;",
			"whs:pl": "white-space:pre-line;",
			"whsc": "white-space-collapse:|;",
			"whsc:n": "white-space-collapse:normal;",
			"whsc:k": "white-space-collapse:keep-all;",
			"whsc:l": "white-space-collapse:loose;",
			"whsc:bs": "white-space-collapse:break-strict;",
			"whsc:ba": "white-space-collapse:break-all;",
			"wob": "word-break:|;",
			"wob:n": "word-break:normal;",
			"wob:k": "word-break:keep-all;",
			"wob:ba": "word-break:break-all;",
			"wos": "word-spacing:|;",
			"wow": "word-wrap:|;",
			"wow:nm": "word-wrap:normal;",
			"wow:n": "word-wrap:none;",
			"wow:u": "word-wrap:unrestricted;",
			"wow:s": "word-wrap:suppress;",
			"wow:b": "word-wrap:break-word;",
			"wm": "writing-mode:${1:lr-tb};",
			"wm:lrt": "writing-mode:lr-tb;",
			"wm:lrb": "writing-mode:lr-bt;",
			"wm:rlt": "writing-mode:rl-tb;",
			"wm:rlb": "writing-mode:rl-bt;",
			"wm:tbr": "writing-mode:tb-rl;",
			"wm:tbl": "writing-mode:tb-lr;",
			"wm:btl": "writing-mode:bt-lr;",
			"wm:btr": "writing-mode:bt-rl;",
			"lts": "letter-spacing:|;",
			"lts-n": "letter-spacing:normal;",
			"f": "font:|;",
			"f+": "font:${1:1em} ${2:Arial,sans-serif};",
			"fw": "font-weight:|;",
			"fw:n": "font-weight:normal;",
			"fw:b": "font-weight:bold;",
			"fw:br": "font-weight:bolder;",
			"fw:lr": "font-weight:lighter;",
			"fs": "font-style:${italic};",
			"fs:n": "font-style:normal;",
			"fs:i": "font-style:italic;",
			"fs:o": "font-style:oblique;",
			"fv": "font-variant:|;",
			"fv:n": "font-variant:normal;",
			"fv:sc": "font-variant:small-caps;",
			"fz": "font-size:|;",
			"fza": "font-size-adjust:|;",
			"fza:n": "font-size-adjust:none;",
			"ff": "font-family:|;",
			"ff:s": "font-family:serif;",
			"ff:ss": "font-family:sans-serif;",
			"ff:c": "font-family:cursive;",
			"ff:f": "font-family:fantasy;",
			"ff:m": "font-family:monospace;",
			"ff:a": "font-family: Arial, \"Helvetica Neue\", Helvetica, sans-serif;",
			"ff:t": "font-family: \"Times New Roman\", Times, Baskerville, Georgia, serif;",
			"ff:v": "font-family: Verdana, Geneva, sans-serif;",
			"fef": "font-effect:|;",
			"fef:n": "font-effect:none;",
			"fef:eg": "font-effect:engrave;",
			"fef:eb": "font-effect:emboss;",
			"fef:o": "font-effect:outline;",
			"fem": "font-emphasize:|;",
			"femp": "font-emphasize-position:|;",
			"femp:b": "font-emphasize-position:before;",
			"femp:a": "font-emphasize-position:after;",
			"fems": "font-emphasize-style:|;",
			"fems:n": "font-emphasize-style:none;",
			"fems:ac": "font-emphasize-style:accent;",
			"fems:dt": "font-emphasize-style:dot;",
			"fems:c": "font-emphasize-style:circle;",
			"fems:ds": "font-emphasize-style:disc;",
			"fsm": "font-smooth:|;",
			"fsm:a": "font-smooth:auto;",
			"fsm:n": "font-smooth:never;",
			"fsm:aw": "font-smooth:always;",
			"fst": "font-stretch:|;",
			"fst:n": "font-stretch:normal;",
			"fst:uc": "font-stretch:ultra-condensed;",
			"fst:ec": "font-stretch:extra-condensed;",
			"fst:c": "font-stretch:condensed;",
			"fst:sc": "font-stretch:semi-condensed;",
			"fst:se": "font-stretch:semi-expanded;",
			"fst:e": "font-stretch:expanded;",
			"fst:ee": "font-stretch:extra-expanded;",
			"fst:ue": "font-stretch:ultra-expanded;",
			"op": "opacity:|;",
			"op+": "opacity: $1;\nfilter: alpha(opacity=$2);",
			"op:ie": "filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=100);",
			"op:ms": "-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=100)';",
			"rsz": "resize:|;",
			"rsz:n": "resize:none;",
			"rsz:b": "resize:both;",
			"rsz:h": "resize:horizontal;",
			"rsz:v": "resize:vertical;",
			"cur": "cursor:${pointer};",
			"cur:a": "cursor:auto;",
			"cur:d": "cursor:default;",
			"cur:c": "cursor:crosshair;",
			"cur:ha": "cursor:hand;",
			"cur:he": "cursor:help;",
			"cur:m": "cursor:move;",
			"cur:p": "cursor:pointer;",
			"cur:t": "cursor:text;",
			"fxd": "flex-direction:|;",
			"fxd:r": "flex-direction:row;",
			"fxd:rr": "flex-direction:row-reverse;",
			"fxd:c": "flex-direction:column;",
			"fxd:cr": "flex-direction:column-reverse;",
			"fxw": "flex-wrap: |;",
			"fxw:n": "flex-wrap:nowrap;",
			"fxw:w": "flex-wrap:wrap;",
			"fxw:wr": "flex-wrap:wrap-reverse;",
			"fxf": "flex-flow:|;",
			"jc": "justify-content:|;",
			"jc:fs": "justify-content:flex-start;",
			"jc:fe": "justify-content:flex-end;",
			"jc:c": "justify-content:center;",
			"jc:sb": "justify-content:space-between;",
			"jc:sa": "justify-content:space-around;",
			"ai": "align-items:|;",
			"ai:fs": "align-items:flex-start;",
			"ai:fe": "align-items:flex-end;",
			"ai:c": "align-items:center;",
			"ai:b": "align-items:baseline;",
			"ai:s": "align-items:stretch;",
			"ac": "align-content:|;",
			"ac:fs": "align-content:flex-start;",
			"ac:fe": "align-content:flex-end;",
			"ac:c": "align-content:center;",
			"ac:sb": "align-content:space-between;",
			"ac:sa": "align-content:space-around;",
			"ac:s": "align-content:stretch;",
			"ord": "order:|;",
			"fxg": "flex-grow:|;",
			"fxsh": "flex-shrink:|;",
			"fxb": "flex-basis:|;",
			"fx": "flex:|;",
			"as": "align-self:|;",
			"as:a": "align-self:auto;",
			"as:fs": "align-self:flex-start;",
			"as:fe": "align-self:flex-end;",
			"as:c": "align-self:center;",
			"as:b": "align-self:baseline;",
			"as:s": "align-self:stretch;",
			"pgbb": "page-break-before:|;",
			"pgbb:au": "page-break-before:auto;",
			"pgbb:al": "page-break-before:always;",
			"pgbb:l": "page-break-before:left;",
			"pgbb:r": "page-break-before:right;",
			"pgbi": "page-break-inside:|;",
			"pgbi:au": "page-break-inside:auto;",
			"pgbi:av": "page-break-inside:avoid;",
			"pgba": "page-break-after:|;",
			"pgba:au": "page-break-after:auto;",
			"pgba:al": "page-break-after:always;",
			"pgba:l": "page-break-after:left;",
			"pgba:r": "page-break-after:right;",
			"orp": "orphans:|;",
			"us": "user-select:${none};",
			"wid": "widows:|;",
			"wfsm": "-webkit-font-smoothing:${antialiased};",
			"wfsm:a": "-webkit-font-smoothing:antialiased;",
			"wfsm:s": "-webkit-font-smoothing:subpixel-antialiased;",
			"wfsm:sa": "-webkit-font-smoothing:subpixel-antialiased;",
			"wfsm:n": "-webkit-font-smoothing:none;"
		}
	},
	
	"html": {
		"filters": "html",
		"profile": "html",
		"snippets": {
			"!!!":    "<!DOCTYPE html>",
			"!!!4t":  "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">",
			"!!!4s":  "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">",
			"!!!xt":  "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">",
			"!!!xs":  "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">",
			"!!!xxs": "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">",

			"c": "<!-- |${child} -->",
			"cc:ie6": "<!--[if lte IE 6]>\n\t${child}|\n<![endif]-->",
			"cc:ie": "<!--[if IE]>\n\t${child}|\n<![endif]-->",
			"cc:noie": "<!--[if !IE]><!-->\n\t${child}|\n<!--<![endif]-->"
		},
		
		"abbreviations": {
			"!": "html:5",
			"a": "<a href=\"\">",
			"a:link": "<a href=\"http://|\">",
			"a:mail": "<a href=\"mailto:|\">",
			"abbr": "<abbr title=\"\">",
			"acr|acronym": "<acronym title=\"\">",
			"base": "<base href=\"\" />",
			"basefont": "<basefont/>",
			"br": "<br/>",
			"frame": "<frame/>",
			"hr": "<hr/>",
			"bdo": "<bdo dir=\"\">",
			"bdo:r": "<bdo dir=\"rtl\">",
			"bdo:l": "<bdo dir=\"ltr\">",
			"col": "<col/>",
			"link": "<link rel=\"stylesheet\" href=\"\" />",
			"link:css": "<link rel=\"stylesheet\" href=\"${1:style}.css\" />",
			"link:print": "<link rel=\"stylesheet\" href=\"${1:print}.css\" media=\"print\" />",
			"link:favicon": "<link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"${1:favicon.ico}\" />",
			"link:touch": "<link rel=\"apple-touch-icon\" href=\"${1:favicon.png}\" />",
			"link:rss": "<link rel=\"alternate\" type=\"application/rss+xml\" title=\"RSS\" href=\"${1:rss.xml}\" />",
			"link:atom": "<link rel=\"alternate\" type=\"application/atom+xml\" title=\"Atom\" href=\"${1:atom.xml}\" />",
			"link:im|link:import": "<link rel=\"import\" href=\"${1:component}.html\" />",
			"meta": "<meta/>",
			"meta:utf": "<meta http-equiv=\"Content-Type\" content=\"text/html;charset=UTF-8\" />",
			"meta:win": "<meta http-equiv=\"Content-Type\" content=\"text/html;charset=windows-1251\" />",
			"meta:edge": "<meta http-equiv=\"X-UA-Compatible\" content=\"${1:ie=edge}\" />",
			"meta:vp": "<meta name=\"viewport\" content=\"width=${1:device-width}, initial-scale=${3:1.0}\" />",
			"meta:compat": "<meta http-equiv=\"X-UA-Compatible\" content=\"${1:IE=7}\" />",
			"meta:redirect": "<meta http-equiv=\"refresh\" content=\"0; url=${1:http://example.com}\" />",
			"style": "<style>",
			"script": "<script !src=\"\">",
			"script:src": "<script src=\"\">",
			"img": "<img src=\"\" alt=\"\" />",
			"img:s|img:srcset": "<img srcset=\"\" src=\"\" alt=\"\" />",
			"img:z|img:sizes": "<img sizes=\"\" srcset=\"\" src=\"\" alt=\"\" />",
			"picture": "<picture>",
			"src|source": "<source/>",
			"src:sc|source:src": "<source src=\"\" type=\"\"/>",
			"src:s|source:srcset": "<source srcset=\"\"/>",
			"src:m|source:media": "<source media=\"(${1:min-width: })\" srcset=\"\"/>",
			"src:t|source:type": "<source srcset=\"|\" type=\"${1:image/}\"/>",
			"src:z|source:sizes": "<source sizes=\"\" srcset=\"\"/>",
			"src:mt|source:media:type": "<source media=\"(${1:min-width: })\" srcset=\"\" type=\"${2:image/}\"/>",
			"src:mz|source:media:sizes": "<source media=\"(${1:min-width: })\" sizes=\"\" srcset=\"\"/>",
			"src:zt|source:sizes:type": "<source sizes=\"\" srcset=\"\" type=\"${1:image/}\"/>",
			"iframe": "<iframe src=\"\" frameborder=\"0\">",
			"embed": "<embed src=\"\" type=\"\" />",
			"object": "<object data=\"\" type=\"\">",
			"param": "<param name=\"\" value=\"\" />",
			"map": "<map name=\"\">",
			"area": "<area shape=\"\" coords=\"\" href=\"\" alt=\"\" />",
			"area:d": "<area shape=\"default\" href=\"\" alt=\"\" />",
			"area:c": "<area shape=\"circle\" coords=\"\" href=\"\" alt=\"\" />",
			"area:r": "<area shape=\"rect\" coords=\"\" href=\"\" alt=\"\" />",
			"area:p": "<area shape=\"poly\" coords=\"\" href=\"\" alt=\"\" />",
			"form": "<form action=\"\">",
			"form:get": "<form action=\"\" method=\"get\">",
			"form:post": "<form action=\"\" method=\"post\">",
			"label": "<label for=\"\">",
			"input": "<input type=\"${1:text}\" />",
			"inp": "<input type=\"${1:text}\" name=\"\" id=\"\" />",
			"input:h|input:hidden": "input[type=hidden name]",
			"input:t|input:text": "inp",
			"input:search": "inp[type=search]",
			"input:email": "inp[type=email]",
			"input:url": "inp[type=url]",
			"input:p|input:password": "inp[type=password]",
			"input:datetime": "inp[type=datetime]",
			"input:date": "inp[type=date]",
			"input:datetime-local": "inp[type=datetime-local]",
			"input:month": "inp[type=month]",
			"input:week": "inp[type=week]",
			"input:time": "inp[type=time]",
			"input:tel": "inp[type=tel]",
			"input:number": "inp[type=number]",
			"input:color": "inp[type=color]",
			"input:c|input:checkbox": "inp[type=checkbox]",
			"input:r|input:radio": "inp[type=radio]",
			"input:range": "inp[type=range]",
			"input:f|input:file": "inp[type=file]",
			"input:s|input:submit": "<input type=\"submit\" value=\"\" />",
			"input:i|input:image": "<input type=\"image\" src=\"\" alt=\"\" />",
			"input:b|input:button": "<input type=\"button\" value=\"\" />",
			"isindex": "<isindex/>",
			"input:reset": "input:button[type=reset]",
			"select": "<select name=\"\" id=\"\">",
			"select:d|select:disabled": "select[disabled.]",
			"opt|option": "<option value=\"\">",
			"textarea": "<textarea name=\"\" id=\"\" cols=\"${1:30}\" rows=\"${2:10}\">",
			"marquee": "<marquee behavior=\"\" direction=\"\">",
			"menu:c|menu:context": "menu[type=context]>",
			"menu:t|menu:toolbar": "menu[type=toolbar]>",
			"video": "<video src=\"\">",
			"audio": "<audio src=\"\">",
			"html:xml": "<html xmlns=\"http://www.w3.org/1999/xhtml\">",
			"keygen": "<keygen/>",
			"command": "<command/>",
			"btn:s|button:s|button:submit" : "button[type=submit]",
			"btn:r|button:r|button:reset" : "button[type=reset]",
			"btn:d|button:d|button:disabled" : "button[disabled.]",
			"fst:d|fset:d|fieldset:d|fieldset:disabled" : "fieldset[disabled.]",
			
			"bq": "blockquote",
			"fig": "figure",
			"figc": "figcaption",
			"pic": "picture",
			"ifr": "iframe",
			"emb": "embed",
			"obj": "object",
			"cap": "caption",
			"colg": "colgroup",
			"fst": "fieldset",
			"btn": "button",
			"optg": "optgroup",
			"tarea": "textarea",
			"leg": "legend",
			"sect": "section",
			"art": "article",
			"hdr": "header",
			"ftr": "footer",
			"adr": "address",
			"dlg": "dialog",
			"str": "strong",
			"prog": "progress",
			"mn": "main",
			"tem": "template",
			"fset": "fieldset",
			"datag": "datagrid",
			"datal": "datalist",
			"kg": "keygen",
			"out": "output",
			"det": "details",
			"cmd": "command",

			"doc": "html>(head>meta[charset=${charset}]+meta:vp+meta:edge+title{${1:Document}})+body",
			"doc4": "html>(head>meta[http-equiv=\"Content-Type\" content=\"text/html;charset=${charset}\"]+title{${1:Document}})+body",

			"ri:d|ri:dpr": "img:s",
			"ri:v|ri:viewport": "img:z",
			"ri:a|ri:art": "pic>src:m+img",
			"ri:t|ri:type": "pic>src:t+img",

			"html:4t":  "!!!4t+doc4[lang=${lang}]",
			"html:4s":  "!!!4s+doc4[lang=${lang}]",
			"html:xt":  "!!!xt+doc4[xmlns=http://www.w3.org/1999/xhtml xml:lang=${lang}]",
			"html:xs":  "!!!xs+doc4[xmlns=http://www.w3.org/1999/xhtml xml:lang=${lang}]",
			"html:xxs": "!!!xxs+doc4[xmlns=http://www.w3.org/1999/xhtml xml:lang=${lang}]",
			"html:5":   "!!!+doc[lang=${lang}]",
			
			"ol+": "ol>li",
			"ul+": "ul>li",
			"dl+": "dl>dt+dd",
			"map+": "map>area",
			"table+": "table>tr>td",
			"colgroup+": "colgroup>col",
			"colg+": "colgroup>col",
			"tr+": "tr>td",
			"select+": "select>option",
			"optgroup+": "optgroup>option",
			"optg+": "optgroup>option",
			"pic+": "picture>source:srcset+img"
		}
	},
	
	"xml": {
		"extends": "html",
		"profile": "xml",
		"filters": "html"
	},
	
	"svg": {
		"filters": "html",
		"profile": "xml",
		"snippets": {
			"!!!": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>",
			"svgdoc": "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">"
		},
		"abbreviations": {
			"!svg": "!!!+svgdoc+svg",
			"svg": "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">",
			"a": "<a xlink:href=\"\">",
			"ag": "altGliph",
			"agd": "altGliphDef",
			"agi": "altGliphItem",
			"anim|animate": "<animate attributeType=\"\" attributeName=\"\" from=\"\" to=\"\" dur=\"\" repeatCount=\"indefinite\">",
			"ac": "<animateColor>",
			"am": "<animateMotion>",
			"at": "<animateTransform>",
			"c": "circle",
			"cp": "colorPath",
			"c-p": "color-profile",
			"cur": "cursor",
			"df": "defs",
			"e|ellipse": "<ellipse  cx=\"\" cy=\"\" rx=\"\" ry=\"\"/>",
			"ff": "<font-face>",
			"fff": "<font-face-format>",
			"ffn": "<font-face-name>",
			"ffs": "<font-face-src>",
			"ffu": "<font-face-uri>",
			"fo": "<foreignObject>",
			"g": "<g>",
			"gl": "<glyph>",
			"glr": "<glyphRef>",
			"hk": "<hkern>",
			"i|image": "<image xlink:href=\"\" x=\"\" y=\"\" width=\"\" height=\"\"/>",
			"l": "<line>",
			"lg": "<linearGradient>",
			"marker": "<marker>",
			"mask": "<mask>",
			"md": "<metadata>",
			"mg": "<missing-glyph>",
			"mp": "<mpath>",
			"path": "<path d=\"\">",
			"patt": "<pattern>",
			"pg": "<polygon points=\"\">",
			"pl": "<polyline points=\"\">",
			"rg": "<radialGradient>",
			"r": "<rect x=\"\" y=\"\" width=\"\" height=\"\"/>",
			"scr": "<script>",
			"sb": "<symbol>",
			"txt": "<text>",
			"tp": "<textPath>",
			"ts": "<tspan>",
			"u|use": "<use xlink:href=\"\"/>",
			"v": "<view>",
			"vk": "<vkern>"
		}
	},
	
	"xsl": {
		"extends": "html",
		"profile": "xml",
		"filters": "html, xsl",
		"abbreviations": {
			"tm|tmatch": "<xsl:template match=\"\" mode=\"\">",
			"tn|tname": "<xsl:template name=\"\">",
			"call": "<xsl:call-template name=\"\"/>",
			"ap": "<xsl:apply-templates select=\"\" mode=\"\"/>",
			"api": "<xsl:apply-imports/>",
			"imp": "<xsl:import href=\"\"/>",
			"inc": "<xsl:include href=\"\"/>",

			"ch": "<xsl:choose>",
			"wh|xsl:when": "<xsl:when test=\"\">",
			"ot": "<xsl:otherwise>",
			"if": "<xsl:if test=\"\">",

			"par": "<xsl:param name=\"\">",
			"pare": "<xsl:param name=\"\" select=\"\"/>",
			"var": "<xsl:variable name=\"\">",
			"vare": "<xsl:variable name=\"\" select=\"\"/>",
			"wp": "<xsl:with-param name=\"\" select=\"\"/>",
			"key": "<xsl:key name=\"\" match=\"\" use=\"\"/>",

			"elem": "<xsl:element name=\"\">",
			"attr": "<xsl:attribute name=\"\">",
			"attrs": "<xsl:attribute-set name=\"\">",

			"cp": "<xsl:copy select=\"\"/>",
			"co": "<xsl:copy-of select=\"\"/>",
			"val": "<xsl:value-of select=\"\"/>",
			"for|each": "<xsl:for-each select=\"\">",
			"tex": "<xsl:text></xsl:text>",

			"com": "<xsl:comment>",
			"msg": "<xsl:message terminate=\"no\">",
			"fall": "<xsl:fallback>",
			"num": "<xsl:number value=\"\"/>",
			"nam": "<namespace-alias stylesheet-prefix=\"\" result-prefix=\"\"/>",
			"pres": "<xsl:preserve-space elements=\"\"/>",
			"strip": "<xsl:strip-space elements=\"\"/>",
			"proc": "<xsl:processing-instruction name=\"\">",
			"sort": "<xsl:sort select=\"\" order=\"\"/>",

			"choose+": "xsl:choose>xsl:when+xsl:otherwise",
			"xsl": "!!!+xsl:stylesheet[version=1.0 xmlns:xsl=http://www.w3.org/1999/XSL/Transform]>{\n|}"
		}, 
		"snippets": {
			"!!!": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
		}
	},
	
	"haml": {
		"filters": "haml",
		"extends": "html",
		"profile": "xml"
	},

	"jade": {
		"filters": "jade",
		"extends": "html",
		"profile": "xml"
	},

	"jsx": {
		"filters": "jsx, html",
		"extends": "html",
		"profile": "xml"
	},

	"slim": {
		"filters": "slim",
		"extends": "html",
		"profile": "xml"
	},
	
	"scss": {
		"extends": "css"
	},
	
	"sass": {
		"extends": "css"
	},
	
	"less": {
		"extends": "css"
	},
	
	"stylus": {
		"extends": "css"
	},

	"styl": {
		"extends": "stylus"
	}
}

},{}],"utils\\abbreviation.js":[function(require,module,exports){
/**
 * Utility functions to work with <code>AbbreviationNode</code> as HTML element
 * @param {Function} require
 * @param {Underscore} _
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var elements = require('../assets/elements');
	var tabStops = require('../assets/tabStops');
	var utils = require('../utils/common');
	var tagName = require('../resolver/tagName');

	return {
		/**
		 * Test if passed node is unary (no closing tag)
		 * @param {AbbreviationNode} node
		 * @return {Boolean}
		 */
		isUnary: function(node) {
			if (node.children.length || node._text || this.isSnippet(node)) {
				return false;
			}
			
			var r = node.data('resource');
			return r && r.is_empty;
		},
		
		/**
		 * Test if passed node is inline-level (like &lt;strong&gt;, &lt;img&gt;)
		 * @param {AbbreviationNode} node
		 * @return {Boolean}
		 */
		isInline: function(node) {
			return node.isTextNode() 
				|| !node.name() 
				|| tagName.isInlineLevel(node.name());
		},
		
		/**
		 * Test if passed node is block-level
		 * @param {AbbreviationNode} node
		 * @return {Boolean}
		 */
		isBlock: function(node) {
			return this.isSnippet(node) || !this.isInline(node);
		},
		
		/**
		 * Test if given node is a snippet
		 * @param {AbbreviationNode} node
		 * @return {Boolean}
		 */
		isSnippet: function(node) {
			return elements.is(node.data('resource'), 'snippet');
		},
		
		/**
		 * This function tests if passed node content contains HTML tags. 
		 * This function is mostly used for output formatting
		 * @param {AbbreviationNode} node
		 * @returns {Boolean}
		 */
		hasTagsInContent: function(node) {
			return utils.matchesTag(node.content);
		},
		
		/**
		 * Test if current element contains block-level children
		 * @param {AbbreviationNode} node
		 * @return {Boolean}
		 */
		hasBlockChildren: function(node) {
			return (this.hasTagsInContent(node) && this.isBlock(node)) 
				|| node.children.some(function(child) {
					return this.isBlock(child);
				}, this);
		},
		
		/**
		 * Utility function that inserts content instead of <code>${child}</code>
		 * variables on <code>text</code>
		 * @param {String} text Text where child content should be inserted
		 * @param {String} childContent Content to insert
		 * @param {Object} options
		 * @returns {String
		 */
		insertChildContent: function(text, childContent, options) {
			options = utils.extend({
				keepVariable: true,
				appendIfNoChild: true
			}, options || {});
			
			var childVariableReplaced = false;
			text = tabStops.replaceVariables(text, function(variable, name, data) {
				var output = variable;
				if (name == 'child') {
					// add correct indentation
					output = utils.padString(childContent, utils.getLinePaddingFromPosition(text, data.start));
					childVariableReplaced = true;
					if (options.keepVariable)
						output += variable;
				}
				
				return output;
			});
			
			if (!childVariableReplaced && options.appendIfNoChild) {
				text += childContent;
			}
			
			return text;
		}
	};
});
},{"../assets/elements":"assets\\elements.js","../assets/tabStops":"assets\\tabStops.js","../resolver/tagName":"resolver\\tagName.js","../utils/common":"utils\\common.js"}],"utils\\action.js":[function(require,module,exports){
/**
 * Utility methods for Emmet actions
 * @author Sergey Chikuyonok (serge.che@gmail.com) <http://chikuyonok.ru>
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('./common');
	var cssSections = require('./cssSections');
	var abbreviationParser = require('../parser/abbreviation');
	var htmlMatcher = require('../assets/htmlMatcher');
	var xmlEditTree = require('../editTree/xml');
	var range = require('../assets/range');
	var resources = require('../assets/resources');

	return {
		mimeTypes: {
			'gif' : 'image/gif',
			'png' : 'image/png',
			'jpg' : 'image/jpeg',
			'jpeg': 'image/jpeg',
			'svg' : 'image/svg+xml',
			'html': 'text/html',
			'htm' : 'text/html'
		},
		
		/**
		 * Extracts abbreviations from text stream, starting from the end
		 * @param {String} str
		 * @return {String} Abbreviation or empty string
		 * @memberOf emmet.actionUtils
		 */
		extractAbbreviation: function(str) {
			var curOffset = str.length;
			var startIndex = -1;
			var groupCount = 0;
			var braceCount = 0;
			var textCount = 0;
			
			while (true) {
				curOffset--;
				if (curOffset < 0) {
					// moved to the beginning of the line
					startIndex = 0;
					break;
				}
				
				var ch = str.charAt(curOffset);
				
				if (ch == ']') {
					braceCount++;
				} else if (ch == '[') {
					if (!braceCount) { // unexpected brace
						startIndex = curOffset + 1;
						break;
					}
					braceCount--;
				} else if (ch == '}') {
					textCount++;
				} else if (ch == '{') {
					if (!textCount) { // unexpected brace
						startIndex = curOffset + 1;
						break;
					}
					textCount--;
				} else if (ch == ')') {
					groupCount++;
				} else if (ch == '(') {
					if (!groupCount) { // unexpected brace
						startIndex = curOffset + 1;
						break;
					}
					groupCount--;
				} else {
					if (braceCount || textCount) 
						// respect all characters inside attribute sets or text nodes
						continue;
					else if (!abbreviationParser.isAllowedChar(ch) || (ch == '>' && utils.endsWithTag(str.substring(0, curOffset + 1)))) {
						// found stop symbol
						startIndex = curOffset + 1;
						break;
					}
				}
			}
			
			if (startIndex != -1 && !textCount && !braceCount && !groupCount) 
				// found something, remove some invalid symbols from the 
				// beginning and return abbreviation
				return str.substring(startIndex).replace(/^[\*\+\>\^]+/, '');
			else
				return '';
		},
		
		/**
		 * Gets image size from image byte stream.
		 * @author http://romeda.org/rePublish/
		 * @param {String} stream Image byte stream (use <code>IEmmetFile.read()</code>)
		 * @return {Object} Object with <code>width</code> and <code>height</code> properties
		 */
		getImageSize: function(stream) {
			var pngMagicNum = "\211PNG\r\n\032\n",
				jpgMagicNum = "\377\330",
				gifMagicNum = "GIF8",
				pos = 0,
				nextByte = function() {
					return stream.charCodeAt(pos++);
				};
		
			if (stream.substr(0, 8) === pngMagicNum) {
				// PNG. Easy peasy.
				pos = stream.indexOf('IHDR') + 4;
			
				return {
					width:  (nextByte() << 24) | (nextByte() << 16) | (nextByte() <<  8) | nextByte(),
					height: (nextByte() << 24) | (nextByte() << 16) | (nextByte() <<  8) | nextByte()
				};
			
			} else if (stream.substr(0, 4) === gifMagicNum) {
				pos = 6;
			
				return {
					width:  nextByte() | (nextByte() << 8),
					height: nextByte() | (nextByte() << 8)
				};
			
			} else if (stream.substr(0, 2) === jpgMagicNum) {
				pos = 2;
			
				var l = stream.length;
				while (pos < l) {
					if (nextByte() != 0xFF) return;
				
					var marker = nextByte();
					if (marker == 0xDA) break;
				
					var size = (nextByte() << 8) | nextByte();
				
					if (marker >= 0xC0 && marker <= 0xCF && !(marker & 0x4) && !(marker & 0x8)) {
						pos += 1;
						return {
							height: (nextByte() << 8) | nextByte(),
							width: (nextByte() << 8) | nextByte()
						};
				
					} else {
						pos += size - 2;
					}
				}
			}
		},
		
		/**
		 * Captures context XHTML element from editor under current caret position.
		 * This node can be used as a helper for abbreviation extraction
		 * @param {IEmmetEditor} editor
		 * @returns {Object}
		 */
		captureContext: function(editor, pos) {
			var allowedSyntaxes = {'html': 1, 'xml': 1, 'xsl': 1, 'jsx': 1};
			var syntax = editor.getSyntax();
			if (syntax in allowedSyntaxes) {
				var content = editor.getContent();
				if (typeof pos === 'undefined') {
					pos = editor.getCaretPos();
				}

				var tag = htmlMatcher.find(content, pos);
				if (tag && tag.type == 'tag') {
					var startTag = tag.open;
					var contextNode = {
						name: startTag.name,
						attributes: [],
						match: tag
					};
					
					// parse attributes
					var tagTree = xmlEditTree.parse(startTag.range.substring(content));
					if (tagTree) {
						contextNode.attributes = tagTree.getAll().map(function(item) {
							return {
								name: item.name(),
								value: item.value()
							};
						});
					}
					
					return contextNode;
				}
			}
			
			return null;
		},
		
		/**
		 * Find expression bounds in current editor at caret position. 
		 * On each character a <code>fn</code> function will be called and must 
		 * return <code>true</code> if current character meets requirements, 
		 * <code>false</code> otherwise
		 * @param {IEmmetEditor} editor
		 * @param {Function} fn Function to test each character of expression
		 * @return {Range}
		 */
		findExpressionBounds: function(editor, fn) {
			var content = String(editor.getContent());
			var il = content.length;
			var exprStart = editor.getCaretPos() - 1;
			var exprEnd = exprStart + 1;
				
			// start by searching left
			while (exprStart >= 0 && fn(content.charAt(exprStart), exprStart, content)) exprStart--;
			
			// then search right
			while (exprEnd < il && fn(content.charAt(exprEnd), exprEnd, content)) exprEnd++;
			
			if (exprEnd > exprStart) {
				return range([++exprStart, exprEnd]);
			}
		},
		
		/**
		 * @param {IEmmetEditor} editor
		 * @param {Object} data
		 * @returns {Boolean}
		 */
		compoundUpdate: function(editor, data) {
			if (data) {
				var sel = editor.getSelectionRange();
				editor.replaceContent(data.data, data.start, data.end, true);
				editor.createSelection(data.caret, data.caret + sel.end - sel.start);
				return true;
			}
			
			return false;
		},
		
		/**
		 * Common syntax detection method for editors that doesn’t provide any
		 * info about current syntax scope. 
		 * @param {IEmmetEditor} editor Current editor
		 * @param {String} hint Any syntax hint that editor can provide 
		 * for syntax detection. Default is 'html'
		 * @returns {String} 
		 */
		detectSyntax: function(editor, hint) {
			var syntax = hint || 'html';
			
			if (!resources.hasSyntax(syntax)) {
				syntax = 'html';
			}
			
			if (syntax == 'html' && (this.isStyle(editor) || this.isInlineCSS(editor))) {
				syntax = 'css';
			}

			if (syntax == 'styl') {
				syntax = 'stylus';
			}
			
			return syntax;
		},
		
		/**
		 * Common method for detecting output profile
		 * @param {IEmmetEditor} editor
		 * @returns {String}
		 */
		detectProfile: function(editor) {
			var syntax = editor.getSyntax();
			
			// get profile from syntax definition
			var profile = resources.findItem(syntax, 'profile');
			if (profile) {
				return profile;
			}
			
			switch(syntax) {
				case 'xml':
				case 'xsl':
					return 'xml';
				case 'css':
					if (this.isInlineCSS(editor)) {
						return 'line';
					}
					break;
				case 'html':
					profile = resources.getVariable('profile');
					if (!profile) { // no forced profile, guess from content
						// html or xhtml?
						profile = this.isXHTML(editor) ? 'xhtml': 'html';
					}

					return profile;
			}

			return 'xhtml';
		},
		
		/**
		 * Tries to detect if current document is XHTML one.
		 * @param {IEmmetEditor} editor
		 * @returns {Boolean}
		 */
		isXHTML: function(editor) {
			return editor.getContent().search(/<!DOCTYPE[^>]+XHTML/i) != -1;
		},

		/**
		 * Check if current caret position is inside &lt;style&gt; tag
		 * @param {IEmmetEditor} editor
		 * @returns {Range} Inner range of &lt;style&gt; tag
		 */
		isStyle: function(editor) {
			return !!cssSections.styleTagRange(editor.getContent(), editor.getCaretPos());
		},

		/**
		 * Check if given CSS dialect is supported by CSS actions
		 * @param  {String}  syntax
		 * @return {Boolean}
		 */
		isSupportedCSS: function(syntax) {
			return syntax == 'css' || syntax == 'less' || syntax == 'scss';
		},
		
		/**
		 * Check if current caret position is inside "style" attribute of HTML
		 * element
		 * @param {IEmmetEditor} editor
		 * @returns {Range} Inner range of style attribute
		 */
		isInlineCSS: function(editor) {
			return !!cssSections.styleAttrRange(editor.getContent(), editor.getCaretPos());
		}
	};
});
},{"../assets/htmlMatcher":"assets\\htmlMatcher.js","../assets/range":"assets\\range.js","../assets/resources":"assets\\resources.js","../editTree/xml":"editTree\\xml.js","../parser/abbreviation":"parser\\abbreviation.js","./common":"utils\\common.js","./cssSections":"utils\\cssSections.js"}],"utils\\base64.js":[function(require,module,exports){
/**
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	
	return {
		/**
		 * Encodes data using base64 algorithm
		 * @author Tyler Akins (http://rumkin.com)
		 * @param {String} input
		 * @returns {String}
		 */
		encode : function(input) {
			var output = [];
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4, cdp1, cdp2, cdp3;
			var i = 0, il = input.length, b64 = chars;

			while (i < il) {

				cdp1 = input.charCodeAt(i++);
				cdp2 = input.charCodeAt(i++);
				cdp3 = input.charCodeAt(i++);

				chr1 = cdp1 & 0xff;
				chr2 = cdp2 & 0xff;
				chr3 = cdp3 & 0xff;

				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;

				if (isNaN(cdp2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(cdp3)) {
					enc4 = 64;
				}

				output.push(b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4));
			}

			return output.join('');
		},

		/**
		 * Decodes string using MIME base64 algorithm
		 * 
		 * @author Tyler Akins (http://rumkin.com)
		 * @param {String} data
		 * @return {String}
		 */
		decode : function(data) {
			var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, tmpArr = [];
			var b64 = chars, il = data.length;

			if (!data) {
				return data;
			}

			data += '';

			do { // unpack four hexets into three octets using index points in b64
				h1 = b64.indexOf(data.charAt(i++));
				h2 = b64.indexOf(data.charAt(i++));
				h3 = b64.indexOf(data.charAt(i++));
				h4 = b64.indexOf(data.charAt(i++));

				bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

				o1 = bits >> 16 & 0xff;
				o2 = bits >> 8 & 0xff;
				o3 = bits & 0xff;

				if (h3 == 64) {
					tmpArr[ac++] = String.fromCharCode(o1);
				} else if (h4 == 64) {
					tmpArr[ac++] = String.fromCharCode(o1, o2);
				} else {
					tmpArr[ac++] = String.fromCharCode(o1, o2, o3);
				}
			} while (i < il);

			return tmpArr.join('');
		}
	};
});
},{}],"utils\\comments.js":[function(require,module,exports){
/**
 * Utility module for working with comments in source code
 * (mostly stripping it from source)
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('./common');
	var range = require('../assets/range');
	var stringStream = require('../assets/stringStream');
	var reHasComment = /\/\*|\/\//;

	return {
		/**
		 * Replaces all comments in given CSS source with spaces,
		 * which allows more reliable (and faster) token search
		 * in CSS content
		 * @param  {String} content CSS content
		 * @return {String}
		 */
		strip: function(content) {
			if (!reHasComment.test(content)) {
				return content;
			}

			var stream = stringStream(content);
			var replaceRanges = [];
			var ch, ch2;

			while ((ch = stream.next())) {
				if (ch === '/') {
					ch2 = stream.peek();
					if (ch2 === '*') { // multiline CSS comment
						stream.start = stream.pos - 1;

						if (stream.skipTo('*/')) {
							stream.pos += 2;
						} else {
							// unclosed comment
							stream.skipToEnd();
						}

						replaceRanges.push([stream.start, stream.pos]);
					} else if (ch2 === '/') {
						// preprocessor’s single line comments
						stream.start = stream.pos - 1;
						while ((ch2 = stream.next())) {
							if (ch2 === '\n' || ch2 == '\r') {
								break
							}
						}

						replaceRanges.push([stream.start, stream.pos]);
					}
				} else {
					stream.skipQuoted();
				}
			}

			return utils.replaceWith(content, replaceRanges, ' ');
		}
	};
});
},{"../assets/range":"assets\\range.js","../assets/stringStream":"assets\\stringStream.js","./common":"utils\\common.js"}],"utils\\common.js":[function(require,module,exports){
/**
 * Common utility helper for Emmet
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var range = require('../assets/range');

	/** 
	 * Special token used as a placeholder for caret positions inside 
	 * generated output 
	 */
	var caretPlaceholder = '${0}';
	
	return {
		reTag: /<\/?[\w:\-]+(?:\s+[\w\-:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*\s*(\/?)>$/,

		defaultSyntax: function() {
			return 'html';
		},

		defaultProfile: function() {
			return 'plain';
		},
		
		/**
		 * Test if passed string ends with XHTML tag. This method is used for testing
		 * '>' character: it belongs to tag or it's a part of abbreviation? 
		 * @param {String} str
		 * @return {Boolean}
		 */
		endsWithTag: function(str) {
			return this.reTag.test(str);
		},
		
		/**
		 * Check if passed symbol is a number
		 * @param {String} ch
		 * @returns {Boolean}
		 */
		isNumeric: function(ch) {
			if (typeof(ch) == 'string')
				ch = ch.charCodeAt(0);
				
			return (ch && ch > 47 && ch < 58);
		},
		
		/**
		 * Trim whitespace from string
		 * @param {String} text
		 * @return {String}
		 */
		trim: (function() {
			if (String.prototype.trim) {
				return function(text) {
					return text ? text.trim() : '';
				};
			}

			return function(text) {
				return (text || "").replace(/^\s+|\s+$/g, "");
			}
		})(),
		
		/**
		 * Split text into lines. Set <code>remove_empty</code> to true to filter
		 * empty lines
		 * @param {String} text Text to split
		 * @param {Boolean} removeEmpty Remove empty lines from result
		 * @return {Array}
		 */
		splitByLines: function(text, removeEmpty) {
			// IE fails to split string by regexp, 
			// need to normalize newlines first
			// Also, Mozilla's Rhiho JS engine has a weird newline bug
			var nl = '\n';
			var lines = (text || '')
				.replace(/\r\n/g, '\n')
				.replace(/\n\r/g, '\n')
				.replace(/\r/g, '\n')
				.replace(/\n/g, nl)
				.split(nl);
			
			if (removeEmpty) {
				lines = lines.filter(function(line) {
					return line.length && !!this.trim(line);
				}, this);
			}
			
			return lines;
		},
		
		/**
		 * Repeats string <code>howMany</code> times
		 * @param {String} str
		 * @param {Number} how_many
		 * @return {String}
		 */
		repeatString: function(str, howMany) {
			var out = '';
			while (howMany--) {
				out += str;
			}

			return out;
		},
		
		/**
		 * Returns list of paddings that should be used to align passed string
		 * @param {Array} strings
		 * @returns {Array}
		 */
		getStringsPads: function(strings) {
			var lengths = strings.map(function(s) {
				return typeof s === 'string' ? s.length : +s;
			});
			
			var max = lengths.reduce(function(prev, cur) {
				return typeof prev === 'undefined' ? cur : Math.max(prev, cur);
			});
			return lengths.map(function(l) {
				var pad = max - l;
				return pad ? this.repeatString(' ', pad) : '';
			}, this);
		},
		
		/**
		 * Indents text with padding
		 * @param {String} text Text to indent
		 * @param {String} pad Padding size (number) or padding itself (string)
		 * @return {String}
		 */
		padString: function(text, pad) {
			var result = [];
			var lines = this.splitByLines(text);
			var nl = '\n';
				
			result.push(lines[0]);
			for (var j = 1; j < lines.length; j++) 
				result.push(nl + pad + lines[j]);
				
			return result.join('');
		},
		
		/**
		 * Pad string with zeroes
		 * @param {String} str String to pad
		 * @param {Number} pad Desired string length
		 * @return {String}
		 */
		zeroPadString: function(str, pad) {
			var padding = '';
			var il = str.length;
				
			while (pad > il++) padding += '0';
			return padding + str; 
		},
		
		/**
		 * Removes padding at the beginning of each text's line
		 * @param {String} text
		 * @param {String} pad
		 */
		unindentString: function(text, pad) {
			var lines = this.splitByLines(text);
			var pl = pad.length;
			for (var i = 0, il = lines.length, line; i < il; i++) {
				line = lines[i];
				if (line.substr(0, pl) === pad) {
					lines[i] = line.substr(pl);
				}
			}
			
			return lines.join('\n');
		},
		
		/**
		 * Replaces unescaped symbols in <code>str</code>. For example, the '$' symbol
		 * will be replaced in 'item$count', but not in 'item\$count'.
		 * @param {String} str Original string
		 * @param {String} symbol Symbol to replace
		 * @param {String} replace Symbol replacement. Might be a function that 
		 * returns new value
		 * @return {String}
		 */
		replaceUnescapedSymbol: function(str, symbol, replace) {
			var i = 0;
			var il = str.length;
			var sl = symbol.length;
			var matchCount = 0;
				
			while (i < il) {
				if (str.charAt(i) == '\\') {
					// escaped symbol, skip next character
					i += sl + 1;
				} else if (str.substr(i, sl) == symbol) {
					// have match
					var curSl = sl;
					matchCount++;
					var newValue = replace;
					if (typeof replace === 'function') {
						var replaceData = replace(str, symbol, i, matchCount);
						if (replaceData) {
							curSl = replaceData[0].length;
							newValue = replaceData[1];
						} else {
							newValue = false;
						}
					}
					
					if (newValue === false) { // skip replacement
						i++;
						continue;
					}
					
					str = str.substring(0, i) + newValue + str.substring(i + curSl);
					// adjust indexes
					il = str.length;
					i += newValue.length;
				} else {
					i++;
				}
			}
			
			return str;
		},
		
		/**
		 * Replaces '$' character in string assuming it might be escaped with '\'
		 * @param {String} str String where character should be replaced
		 * @param {String} value New value
		 * @return {String}
		 */
		replaceCounter: function(str, value, total) {
			var symbol = '$';
			// in case we received strings from Java, convert the to native strings
			str = String(str);
			value = String(value);
			
			if (/^\-?\d+$/.test(value)) {
				value = +value;
			}
			
			var that = this;
			
			return this.replaceUnescapedSymbol(str, symbol, function(str, symbol, pos, matchNum){
				if (str.charAt(pos + 1) == '{' || that.isNumeric(str.charAt(pos + 1)) ) {
					// it's a variable, skip it
					return false;
				}
				
				// replace sequense of $ symbols with padded number  
				var j = pos + 1;
				while(str.charAt(j) == '$' && str.charAt(j + 1) != '{') j++;
				var pad = j - pos;
				
				// get counter base
				var base = 0, decrement = false, m;
				if ((m = str.substr(j).match(/^@(\-?)(\d*)/))) {
					j += m[0].length;
					
					if (m[1]) {
						decrement = true;
					}
					
					base = parseInt(m[2] || 1, 10) - 1;
				}
				
				if (decrement && total && typeof value === 'number') {
					value = total - value + 1;
				}
				
				value += base;
				
				return [str.substring(pos, j), that.zeroPadString(value + '', pad)];
			});
		},
		
		/**
		 * Check if string matches against <code>reTag</code> regexp. This 
		 * function may be used to test if provided string contains HTML tags
		 * @param {String} str
		 * @returns {Boolean}
		 */
		matchesTag: function(str) {
			return this.reTag.test(str || '');
		},
		
		/**
		 * Escapes special characters used in Emmet, like '$', '|', etc.
		 * Use this method before passing to actions like "Wrap with Abbreviation"
		 * to make sure that existing special characters won't be altered
		 * @param {String} text
		 * @return {String}
		 */
		escapeText: function(text) {
			return text.replace(/([\$\\])/g, '\\$1');
		},
		
		/**
		 * Unescapes special characters used in Emmet, like '$', '|', etc.
		 * @param {String} text
		 * @return {String}
		 */
		unescapeText: function(text) {
			return text.replace(/\\(.)/g, '$1');
		},
		
		/**
		 * Returns caret placeholder
		 * @returns {String}
		 */
		getCaretPlaceholder: function() {
			return typeof caretPlaceholder === 'function'
				? caretPlaceholder.apply(this, arguments)
				: caretPlaceholder;
		},
		
		/**
		 * Sets new representation for carets in generated output
		 * @param {String} value New caret placeholder. Might be a 
		 * <code>Function</code>
		 */
		setCaretPlaceholder: function(value) {
			caretPlaceholder = value;
		},
		
		/**
		 * Returns line padding
		 * @param {String} line
		 * @return {String}
		 */
		getLinePadding: function(line) {
			return (line.match(/^(\s+)/) || [''])[0];
		},
		
		/**
		 * Helper function that returns padding of line of <code>pos</code>
		 * position in <code>content</code>
		 * @param {String} content
		 * @param {Number} pos
		 * @returns {String}
		 */
		getLinePaddingFromPosition: function(content, pos) {
			var lineRange = this.findNewlineBounds(content, pos);
			return this.getLinePadding(lineRange.substring(content));
		},
		
		/**
		 * Escape special regexp chars in string, making it usable for creating dynamic
		 * regular expressions
		 * @param {String} str
		 * @return {String}
		 */
		escapeForRegexp: function(str) {
			var specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g"); // .*+?|()[]{}\
			return str.replace(specials, "\\$&");
		},
		
		/**
		 * Make decimal number look good: convert it to fixed precision end remove
		 * traling zeroes 
		 * @param {Number} num
		 * @param {Number} fracion Fraction numbers (default is 2)
		 * @return {String}
		 */
		prettifyNumber: function(num, fraction) {
			return num.toFixed(typeof fraction == 'undefined' ? 2 : fraction).replace(/\.?0+$/, '');
		},
		
		/**
		 * Replace substring of <code>str</code> with <code>value</code>
		 * @param {String} str String where to replace substring
		 * @param {String} value New substring value
		 * @param {Number} start Start index of substring to replace. May also
		 * be a <code>Range</code> object: in this case, the <code>end</code>
		 * argument is not required
		 * @param {Number} end End index of substring to replace. If ommited, 
		 * <code>start</code> argument is used
		 */
		replaceSubstring: function(str, value, start, end) {
			if (typeof start === 'object' && 'end' in start) {
				end = start.end;
				start = start.start;
			}
			
			if (typeof end === 'string') {
				end = start + end.length;
			}
			
			if (typeof end === 'undefined') {
				end = start;
			}
			
			if (start < 0 || start > str.length)
				return str;
			
			return str.substring(0, start) + value + str.substring(end);
		},

		/**
		 * Fills substrings in `content`, defined by given ranges,
		 * wich `ch` character
		 * @param  {String} content
		 * @param  {Array} ranges
		 * @return {String}
		 */
		replaceWith: function(content, ranges, ch, noRepeat) {
			if (ranges.length) {
				var offset = 0, fragments = [];
				ranges.forEach(function(r) {
					var repl = noRepeat ? ch : this.repeatString(ch, r[1] - r[0]);
					fragments.push(content.substring(offset, r[0]), repl);
					offset = r[1];
				}, this);

				content = fragments.join('') + content.substring(offset);
			}

			return content;
		},
		
		/**
		 * Narrows down text range, adjusting selection to non-space characters
		 * @param {String} text
		 * @param {Number} start Starting range in <code>text</code> where 
		 * slection should be adjusted. Can also be any object that is accepted
		 * by <code>Range</code> class
		 * @return {Range}
		 */
		narrowToNonSpace: function(text, start, end) {
			var rng = range.create(start, end);
			
			var reSpace = /[\s\n\r\u00a0]/;
			// narrow down selection until first non-space character
			while (rng.start < rng.end) {
				if (!reSpace.test(text.charAt(rng.start)))
					break;
					
				rng.start++;
			}
			
			while (rng.end > rng.start) {
				rng.end--;
				if (!reSpace.test(text.charAt(rng.end))) {
					rng.end++;
					break;
				}
			}
			
			return rng;
		},
		
		/**
		 * Find start and end index of text line for <code>from</code> index
		 * @param {String} text 
		 * @param {Number} from
		 */
		findNewlineBounds: function(text, from) {
			var len = text.length,
				start = 0,
				end = len - 1, 
				ch;

			
			// search left
			for (var i = from - 1; i > 0; i--) {
				ch = text.charAt(i);
				if (ch == '\n' || ch == '\r') {
					start = i + 1;
					break;
				}
			}
			// search right
			for (var j = from; j < len; j++) {
				ch = text.charAt(j);
				if (ch == '\n' || ch == '\r') {
					end = j;
					break;
				}
			}
			
			return range.create(start, end - start);
		},

		/**
		 * Deep merge of two or more objects. Taken from jQuery.extend()
		 */
		deepMerge: function() {
			var options, name, src, copy, copyIsArray, clone,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length;


			// Handle case when target is a string or something (possible in deep copy)
			if (typeof target !== 'object' && typeof target !== 'function') {
				target = {};
			}

			for ( ; i < length; i++ ) {
				// Only deal with non-null/undefined values
				if ( (options = arguments[ i ]) !== null ) {
					// Extend the base object
					for ( name in options ) {
						src = target[ name ];
						copy = options[ name ];

						// Prevent never-ending loop
						if ( target === copy ) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if ( copy && ( typeof copy === 'object' || (copyIsArray = Array.isArray(copy)) ) ) {
							if ( copyIsArray ) {
								copyIsArray = false;
								clone = src && Array.isArray(src) ? src : [];

							} else {
								clone = src && typeof src === 'object' ? src : {};
							}

							// Never move original objects, clone them
							target[ name ] = this.deepMerge(clone, copy );

						// Don't bring in undefined values
						} else if ( copy !== undefined ) {
							target[ name ] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		},

		/**
		 * Dead simple string-to-JSON parser
		 * @param {String} str
		 * @returns {Object}
		 */
		parseJSON: function(str) {
			if (typeof str == 'object') {
				return str;
			}
			
			try {
				return JSON.parse(str);
			} catch(e) {
				return {};
			}
		},


		/**************************
		 * Utility belt
		 **************************/
		unique: function(arr, comparator) {
			var lookup = [];
			return arr.filter(function(item) {
				var val = comparator ? comparator(item) : item;
				if (lookup.indexOf(val) < 0) {
					lookup.push(val);
					return true;
				}
			});
		},

		/**
		 * Return a copy of the object, filtered to only have values for 
		 * the whitelisted keys. 
		 * @param  {Object} obj
		 * @return {Object}
		 */
		pick: function(obj) {
			var result = {};
			var keys = this.toArray(arguments, 1);
			Object.keys(obj).forEach(function(key) {
				if (~keys.indexOf(key)) {
					result[key] = obj[key];
				}
			});
			return result;
		},

		find: function(arr, comparator, ctx) {
			var result;
			if (ctx) {
				comparator = comparator.bind(ctx);
			}

			if (Array.isArray(arr)) {
				arr.some(function(item, i) {
					if (comparator(item, i)) {
						return result = item;
					}
				});
			} else {
				Object.keys(arr).some(function(key, i) {
					if (comparator(arr[key], i)) {
						return result = arr[key];
					}
				});
			}

			return result;
		},

		toArray: function(obj, sliceIx) {
			if (Array.isArray(obj) && !sliceIx) {
				return obj;
			}
			return Array.prototype.slice.call(obj, sliceIx || 0);
		},

		extend: function(obj) {
			for (var i = 1, il = arguments.length, a; i < il; i++) {
				a = arguments[i];
				if (a) {
					Object.keys(a).forEach(function(key) {
						obj[key] = a[key];
					});
				}
			}
			return obj;
		},

		defaults: function(obj) {
			for (var i = 1, il = arguments.length, a; i < il; i++) {
				a = arguments[i];
				if (a) {
					Object.keys(a).forEach(function(key) {
						if (!(key in obj)) {
							obj[key] = a[key];
						}
					});
				}
			}
			return obj;
		},

		flatten: function(arr, out) {
			out = out || [];
			var self = this;
			self.toArray(arr).forEach(function(item) {
				if (Array.isArray(item)) {
					self.flatten(item, out);
				} else {
					out.push(item);
				}
			});

			return out;
		},

		clone: function(obj) {
			if (Array.isArray(obj)) {
				return obj.slice(0);
			}

			return this.extend({}, obj);
		},

		without: function(arr) {
			this.toArray(arguments, 1).forEach(function(item) {
				var ix;
				while (~(ix = arr.indexOf(item))) {
					arr.splice(ix, 1);
				}
			});
			return arr;
		},

		last: function(arr) {
			return arr[arr.length - 1];
		}
	};
});

},{"../assets/range":"assets\\range.js"}],"utils\\cssSections.js":[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('./common');
	var commentsUtils = require('./comments');
	var range = require('../assets/range');
	var stringStream = require('../assets/stringStream');
	var cssParser = require('../parser/css');
	var htmlMatcher = require('../assets/htmlMatcher');
	var xmlEditTree = require('../editTree/xml');

	var idCounter = 1;
	var maxId = 1000000;

	var reSpaceTrim = /^(\s*).+?(\s*)$/;
	var reSpace = /\s/g;
	var reComma = /,/;

	function isQuote(ch) {
		return ch == '"' || ch == "'";
	}

	function getId() {
		idCounter = (idCounter + 1) % maxId;
		return 's' + idCounter;
	}

	/**
	 * @param {Range} range Full selector range with additional
	 * properties for matching name and content (@see findAllRules())
	 * @param {String} source CSS source
	 */
	function CSSSection(rng, source) {
		this.id = getId();
		/** @type {CSSSection} */
		this.parent = null;
		/** @type {CSSSection} */
		this.nextSibling = null;
		/** @type {CSSSection} */
		this.previousSibling = null;
		this._source = source;
		this._name = null;
		this._content = null;

		/**
		 * Custom data for current nodes, used by other modules for
		 * caching etc.
		 * @type {Object}
		 */
		this._data = {};

		if (!rng && source) {
			rng = range(0, source);
		}

		this.range = rng;
		this.children = [];
	}

	CSSSection.prototype = {
		addChild: function(section) {
			if (!(section instanceof CSSSection)) {
				section = new CSSSection(section);
			}

			var lastChild = utils.last(this.children);
			if (lastChild) {
				lastChild.nextSibling = section;
				section.previousSibling = lastChild;
			}
			section.parent = this;

			this.children.push(section);
			return section;
		},

		/**
		 * Returns root node
		 * @return {CSSSection}
		 */
		root: function() {
			var root = this;
			do {
				if (!root.parent) {
					return root;
				}
			} while(root = root.parent);

			return root;
		},

		/**
		 * Returns currect CSS source
		 * @return {String}
		 */
		source: function() {
			return this._source || this.root()._source;
		},

		/**
		 * Returns section name
		 * @return {String}
		 */
		name: function() {
			if (this._name === null) {
				var range = this.nameRange();
				if (range) {
					this._name = range.substring(this.source());
				}
			}

			return this._name;
		},

		/**
		 * Returns section name range
		 * @return {[type]} [description]
		 */
		nameRange: function() {
			if (this.range && '_selectorEnd' in this.range) {
				return range.create2(this.range.start, this.range._selectorEnd);
			}
		},

		/**
		 * Returns deepest child of current section (or section itself) 
		 * which includes given position.
		 * @param  {Number} pos
		 * @return {CSSSection}
		 */
		matchDeep: function(pos) {
			if (!this.range.inside(pos)) {
				return null;
			}

			for (var i = 0, il = this.children.length, m; i < il; i++) {
				m = this.children[i].matchDeep(pos);
				if (m) {
					return m;
				}
			};

			return this.parent ? this : null;
		},

		/**
		 * Returns current and all nested sections ranges
		 * @return {Array}
		 */
		allRanges: function() {
			var out = [];
			if (this.parent) {
				// add current range if it is not root node
				out.push(this.range);
			}

			this.children.forEach(function(child) {
				out = out.concat(child.allRanges());
			});

			return out;
		},

		data: function(key, value) {
			if (typeof value !== 'undefined') {
				this._data[key] = value;
			}

			return this._data[key];
		},

		stringify: function(indent) {
			indent = indent || '';
			var out = '';
			this.children.forEach(function(item) {
				out += indent + item.name().replace(/\n/g, '\\n') + '\n';
				out += item.stringify(indent + '--');
			});

			return out;
		},

		/**
		 * Returns current section’s actual content,
		 * e.g. content without nested sections
		 * @return {String} 
		 */
		content: function() {
			if (this._content !== null) {
				return this._content;
			}

			if (!this.range || !('_contentStart' in this.range)) {
				return '';
			}

			var r = range.create2(this.range._contentStart + 1, this.range.end - 1);
			var source = this.source();
			var start = r.start;
			var out = '';

			this.children.forEach(function(child) {
				out += source.substring(start, child.range.start);
				start = child.range.end;
			});

			out += source.substring(start, r.end);
			return this._content = utils.trim(out);
		}
	};

	return {
		/**
		 * Finds all CSS rules‘ ranges in given CSS source
		 * @param  {String} content CSS source
		 * @return {Array} Array of ranges
		 */
		findAllRules: function(content) {
			content = this.sanitize(content);
			var stream = stringStream(content);
			var ranges = [], matchedRanges;
			var self = this;

			var saveRule = function(r) {
				var selRange = self.extractSelector(content, r.start);
				var rule = range.create2(selRange.start, r.end);
				rule._selectorEnd = selRange.end;
				rule._contentStart = r.start;
				ranges.push(rule);
			};

			var ch;
			while (ch = stream.next()) {
				if (isQuote(ch)) {
					if (!stream.skipString(ch)) {
						break; // unterminated string
					}

					continue;
				}

				if (ch == '{') {
					matchedRanges = this.matchBracesRanges(content, stream.pos - 1);
					matchedRanges.forEach(saveRule);

					if (matchedRanges.length) {
						stream.pos = utils.last(matchedRanges).end;
						continue;
					} 
				}
			}
			
			return ranges.sort(function(a, b) {
				return a.start - b.start;
			});
		},

		/**
		 * Matches curly braces content right after given position
		 * @param  {String} content CSS content. Must not contain comments!
		 * @param  {Number} pos     Search start position
		 * @return {Range}
		 */
		matchBracesRanges: function(content, pos, sanitize) {
			if (sanitize) {
				content = this.sanitize(content);
			}

			var stream = stringStream(content);
			stream.start = stream.pos = pos;
			var stack = [], ranges = [];
			var ch;
			while (ch = stream.next()) {
				if (ch == '{') {
					stack.push(stream.pos - 1);
				} else if (ch == '}') {
					if (!stack.length) {
						throw 'Invalid source structure (check for curly braces)';
					}
					ranges.push(range.create2(stack.pop(), stream.pos));
					if (!stack.length) {
						return ranges;
					}
				} else {
					stream.skipQuoted();
				}
			}

			return ranges;
		},

		/**
		 * Extracts CSS selector from CSS document from
		 * given position. The selector is located by moving backward
		 * from given position which means that passed position
		 * must point to the end of selector 
		 * @param  {String}  content CSS source
		 * @param  {Number}  pos     Search position
		 * @param  {Boolean} sanitize Sanitize CSS source before processing.
		 * Off by default and assumes that CSS must be comment-free already
		 * (for performance)
		 * @return {Range}
		 */
		extractSelector: function(content, pos, sanitize) {
			if (sanitize) {
				content = this.sanitize(content);
			}

			var skipString = function() {
				var quote = content.charAt(pos);
				if (quote == '"' || quote == "'") {
					while (--pos >= 0) {
						if (content.charAt(pos) == quote && content.charAt(pos - 1) != '\\') {
							break;
						}
					}
					return true;
				}

				return false;
			};

			// find CSS selector
			var ch;
			var endPos = pos;
			while (--pos >= 0) {
				if (skipString()) continue;

				ch = content.charAt(pos);
				if (ch == ')') {
					// looks like it’s a preprocessor thing,
					// most likely a mixin arguments list, e.g.
					// .mixin (@arg1; @arg2) {...}
					while (--pos >= 0) {
						if (skipString()) continue;

						if (content.charAt(pos) == '(') {
							break;
						}
					}
					continue;
				}

				if (ch == '{' || ch == '}' || ch == ';') {
					pos++;
					break;
				}
			}

			if (pos < 0) {
				pos = 0;
			}
			
			var selector = content.substring(pos, endPos);

			// trim whitespace from matched selector
			var m = selector.replace(reSpace, ' ').match(reSpaceTrim);
			if (m) {
				pos += m[1].length;
				endPos -= m[2].length;
			}

			return range.create2(pos, endPos);
		},

		/**
		 * Search for nearest CSS rule/section that contains
		 * given position
		 * @param  {String} content CSS content or matched CSS rules (array of ranges)
		 * @param  {Number} pos     Search position
		 * @return {Range}
		 */
		matchEnclosingRule: function(content, pos) {
			if (typeof content === 'string') {
				content = this.findAllRules(content);
			}

			var rules = content.filter(function(r) {
				return r.inside(pos);
			});

			return utils.last(rules);
		},

		/**
		 * Locates CSS rule next or before given position
		 * @param  {String}  content    CSS content
		 * @param  {Number}  pos        Search start position
		 * @param  {Boolean} isBackward Search backward (find previous rule insteaf of next one)
		 * @return {Range}
		 */
		locateRule: function(content, pos, isBackward) {
			// possible case: editor reported that current syntax is
			// CSS, but it’s actually a HTML document (either `style` tag or attribute)
			var offset = 0;
			var subrange = this.styleTagRange(content, pos);
			if (subrange) {
				offset = subrange.start;
				pos -= subrange.start;
				content = subrange.substring(content);
			}

			var rules = this.findAllRules(content);
			var ctxRule = this.matchEnclosingRule(rules, pos);

			if (ctxRule) {
				return ctxRule.shift(offset);
			}

			for (var i = 0, il = rules.length; i < il; i++) {
				if (rules[i].start > pos) {
					return rules[isBackward && i > 0 ? i - 1 : i].shift(offset);
				}
			}
		},

		/**
		 * Sanitizes given CSS content: replaces content that may 
		 * interfere with parsing (comments, interpolations, etc.)
		 * with spaces. Sanitized content MUST NOT be used for
		 * editing or outputting, it just simplifies searching
		 * @param  {String} content CSS content
		 * @return {String}
		 */
		sanitize: function(content) {
			content = commentsUtils.strip(content);

			// remove preprocessor string interpolations like #{var}
			var stream = stringStream(content);
			var replaceRanges = [];
			var ch, ch2;

			while ((ch = stream.next())) {
				if (isQuote(ch)) {
					// skip string
					stream.skipString(ch)
					continue;
				} else if (ch === '#' || ch === '@') {
					ch2 = stream.peek();
					if (ch2 === '{') { // string interpolation
						stream.start = stream.pos - 1;

						if (stream.skipTo('}')) {
							stream.pos += 1;
						} else {
							throw 'Invalid string interpolation at ' + stream.start;
						}

						replaceRanges.push([stream.start, stream.pos]);
					}
				}
			}

			return utils.replaceWith(content, replaceRanges, 'a');
		},

		/**
		 * Parses and returns all sections in given CSS
		 * as tree-like structure, e.g. provides nesting
		 * info
		 * @param  {String} content CSS content
		 * @return {CSSSection}
		 */
		sectionTree: function(content) {
			var root = new CSSSection(null, content);
			var rules = this.findAllRules(content);

			// rules are sorted in order they appear in CSS source
			// so we can optimize their nesting routine
			var insert = function(range, ctx) {
				while (ctx && ctx.range) {
					if (ctx.range.contains(range)) {
						return ctx.addChild(range);
					}

					ctx = ctx.parent;
				}

				// if we are here then given range is a top-level section
				return root.addChild(range);
			};

			var ctx = root;
			rules.forEach(function(r) {
				ctx = insert(r, ctx);
			});

			return root;
		},

		/**
		 * Returns ranges for all nested sections, available in
		 * given CSS rule
		 * @param  {CSSEditContainer} rule
		 * @return {Array}
		 */
		nestedSectionsInRule: function(rule) {
			var offset = rule.valueRange(true).start;
			var nestedSections = this.findAllRules(rule.valueRange().substring(rule.source));
			nestedSections.forEach(function(section) {
				section.start += offset;
				section.end += offset;
				section._selectorEnd += offset;
				section._contentStart += offset;
			});
			return nestedSections;
		},

		styleTagRange: function(content, pos) {
			var tag = htmlMatcher.tag(content, pos);
			return tag && tag.open.name.toLowerCase() == 'style' 
				&& tag.innerRange.cmp(pos, 'lte', 'gte')
				&& tag.innerRange;
		},

		styleAttrRange: function(content, pos) {
			var tree = xmlEditTree.parseFromPosition(content, pos, true);
			if (tree) {
				var attr = tree.itemFromPosition(pos, true);
				return attr && attr.name().toLowerCase() == 'style' 
					&& attr.valueRange(true).cmp(pos, 'lte', 'gte')
					&& attr.valueRange(true);
			}
		},

		CSSSection: CSSSection
	};
});
},{"../assets/htmlMatcher":"assets\\htmlMatcher.js","../assets/range":"assets\\range.js","../assets/stringStream":"assets\\stringStream.js","../editTree/xml":"editTree\\xml.js","../parser/css":"parser\\css.js","./comments":"utils\\comments.js","./common":"utils\\common.js"}],"utils\\editor.js":[function(require,module,exports){
/**
 * Utility module used to prepare text for pasting into back-end editor
 * @author Sergey Chikuyonok (serge.che@gmail.com) <http://chikuyonok.ru>
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('./common');
	var resources = require('../assets/resources');

	return  {
		/**
		 * Check if cursor is placed inside XHTML tag
		 * @param {String} html Contents of the document
		 * @param {Number} caretPos Current caret position inside tag
		 * @return {Boolean}
		 */
		isInsideTag: function(html, caretPos) {
			var reTag = /^<\/?\w[\w\:\-]*.*?>/;
			
			// search left to find opening brace
			var pos = caretPos;
			while (pos > -1) {
				if (html.charAt(pos) == '<') 
					break;
				pos--;
			}
			
			if (pos != -1) {
				var m = reTag.exec(html.substring(pos));
				if (m && caretPos > pos && caretPos < pos + m[0].length)
					return true;
			}
			
			return false;
		},
		
		/**
		 * Sanitizes incoming editor data and provides default values for
		 * output-specific info
		 * @param {IEmmetEditor} editor
		 * @param {String} syntax
		 * @param {String} profile
		 */
		outputInfo: function(editor, syntax, profile) {
			// most of this code makes sense for Java/Rhino environment
			// because string that comes from Java are not actually JS string
			// but Java String object so the have to be explicitly converted
			// to native string
			profile = profile || editor.getProfileName();
			return  {
				/** @memberOf outputInfo */
				syntax: String(syntax || editor.getSyntax()),
				profile: profile || null,
				content: String(editor.getContent())
			};
		},
		
		/**
		 * Unindent content, thus preparing text for tag wrapping
		 * @param {IEmmetEditor} editor Editor instance
		 * @param {String} text
		 * @return {String}
		 */
		unindent: function(editor, text) {
			return utils.unindentString(text, this.getCurrentLinePadding(editor));
		},
		
		/**
		 * Returns padding of current editor's line
		 * @param {IEmmetEditor} Editor instance
		 * @return {String}
		 */
		getCurrentLinePadding: function(editor) {
			return utils.getLinePadding(editor.getCurrentLine());
		},

		/**
		 * Normalizes content according to given preferences, e.g.
		 * replaces newlines and indentation with ones defined in
		 * `options`. If options are not provided or incomplete, 
		 * values will be taken from current user environment
		 * @param {String} text
		 * @param {Object} options
		 * @return {String}
		 */
		normalize: function(text, options) {
			options = utils.extend({
				newline: resources.getNewline(),
				indentation: resources.getVariable('indentation')
			}, options);

			var indent = function(tabs) {
				return utils.repeatString(options.indentation, tabs.length);
			};

			var lines = utils.splitByLines(text);

			// normailze indentation if it’s not tabs
			if (options.indentation !== '\t') {
				lines = lines.map(function(line) {
					return line.replace(/^\s+/, function(space) {
						return space.replace(/\t/g, indent);
					});
				});
			}

			// normalize newlines
			return lines.join(options.newline);
		}
	};
});

},{"../assets/resources":"assets\\resources.js","./common":"utils\\common.js"}],"utils\\math.js":[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	/*
	 Source: https://github.com/silentmatt/js-expression-eval

	 Based on ndef.parser, by Raphael Graf(r@undefined.ch)
	 http://www.undefined.ch/mparser/index.html

	 Ported to JavaScript and modified by Matthew Crumley (email@matthewcrumley.com, http://silentmatt.com/)

	 You are free to use and modify this code in anyway you find useful. Please leave this comment in the code
	 to acknowledge its original source. If you feel like it, I enjoy hearing about projects that use my code,
	 but don't feel like you have to let me know or ask permission.
	*/

	function object(o) {
		function F() {}
		F.prototype = o;
		return new F();
	}

	var TNUMBER = 0;
	var TOP1 = 1;
	var TOP2 = 2;
	var TVAR = 3;
	var TFUNCALL = 4;

	function Token(type_, index_, prio_, number_) {
		this.type_ = type_;
		this.index_ = index_ || 0;
		this.prio_ = prio_ || 0;
		this.number_ = (number_ !== undefined && number_ !== null) ? number_ : 0;
		this.toString = function () {
			switch (this.type_) {
			case TNUMBER:
				return this.number_;
			case TOP1:
			case TOP2:
			case TVAR:
				return this.index_;
			case TFUNCALL:
				return "CALL";
			default:
				return "Invalid Token";
			}
		};
	}

	function Expression(tokens, ops1, ops2, functions) {
		this.tokens = tokens;
		this.ops1 = ops1;
		this.ops2 = ops2;
		this.functions = functions;
	}

	// Based on http://www.json.org/json2.js
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            "'" : "\\'",
            '\\': '\\\\'
        };

	function escapeValue(v) {
		if (typeof v === "string") {
			escapable.lastIndex = 0;
	        return escapable.test(v) ?
	            "'" + v.replace(escapable, function (a) {
	                var c = meta[a];
	                return typeof c === 'string' ? c :
	                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	            }) + "'" :
	            "'" + v + "'";
		}
		return v;
	}

	Expression.prototype = {
		simplify: function (values) {
			values = values || {};
			var nstack = [];
			var newexpression = [];
			var n1;
			var n2;
			var f;
			var L = this.tokens.length;
			var item;
			var i = 0;
			for (i = 0; i < L; i++) {
				item = this.tokens[i];
				var type_ = item.type_;
				if (type_ === TNUMBER) {
					nstack.push(item);
				}
				else if (type_ === TVAR && (item.index_ in values)) {
					item = new Token(TNUMBER, 0, 0, values[item.index_]);
					nstack.push(item);
				}
				else if (type_ === TOP2 && nstack.length > 1) {
					n2 = nstack.pop();
					n1 = nstack.pop();
					f = this.ops2[item.index_];
					item = new Token(TNUMBER, 0, 0, f(n1.number_, n2.number_));
					nstack.push(item);
				}
				else if (type_ === TOP1 && nstack.length > 0) {
					n1 = nstack.pop();
					f = this.ops1[item.index_];
					item = new Token(TNUMBER, 0, 0, f(n1.number_));
					nstack.push(item);
				}
				else {
					while (nstack.length > 0) {
						newexpression.push(nstack.shift());
					}
					newexpression.push(item);
				}
			}
			while (nstack.length > 0) {
				newexpression.push(nstack.shift());
			}

			return new Expression(newexpression, object(this.ops1), object(this.ops2), object(this.functions));
		},

		substitute: function (variable, expr) {
			if (!(expr instanceof Expression)) {
				expr = new Parser().parse(String(expr));
			}
			var newexpression = [];
			var L = this.tokens.length;
			var item;
			var i = 0;
			for (i = 0; i < L; i++) {
				item = this.tokens[i];
				var type_ = item.type_;
				if (type_ === TVAR && item.index_ === variable) {
					for (var j = 0; j < expr.tokens.length; j++) {
						var expritem = expr.tokens[j];
						var replitem = new Token(expritem.type_, expritem.index_, expritem.prio_, expritem.number_);
						newexpression.push(replitem);
					}
				}
				else {
					newexpression.push(item);
				}
			}

			var ret = new Expression(newexpression, object(this.ops1), object(this.ops2), object(this.functions));
			return ret;
		},

		evaluate: function (values) {
			values = values || {};
			var nstack = [];
			var n1;
			var n2;
			var f;
			var L = this.tokens.length;
			var item;
			var i = 0;
			for (i = 0; i < L; i++) {
				item = this.tokens[i];
				var type_ = item.type_;
				if (type_ === TNUMBER) {
					nstack.push(item.number_);
				}
				else if (type_ === TOP2) {
					n2 = nstack.pop();
					n1 = nstack.pop();
					f = this.ops2[item.index_];
					nstack.push(f(n1, n2));
				}
				else if (type_ === TVAR) {
					if (item.index_ in values) {
						nstack.push(values[item.index_]);
					}
					else if (item.index_ in this.functions) {
						nstack.push(this.functions[item.index_]);
					}
					else {
						throw new Error("undefined variable: " + item.index_);
					}
				}
				else if (type_ === TOP1) {
					n1 = nstack.pop();
					f = this.ops1[item.index_];
					nstack.push(f(n1));
				}
				else if (type_ === TFUNCALL) {
					n1 = nstack.pop();
					f = nstack.pop();
					if (f.apply && f.call) {
						if (Object.prototype.toString.call(n1) == "[object Array]") {
							nstack.push(f.apply(undefined, n1));
						}
						else {
							nstack.push(f.call(undefined, n1));
						}
					}
					else {
						throw new Error(f + " is not a function");
					}
				}
				else {
					throw new Error("invalid Expression");
				}
			}
			if (nstack.length > 1) {
				throw new Error("invalid Expression (parity)");
			}
			return nstack[0];
		},

		toString: function (toJS) {
			var nstack = [];
			var n1;
			var n2;
			var f;
			var L = this.tokens.length;
			var item;
			var i = 0;
			for (i = 0; i < L; i++) {
				item = this.tokens[i];
				var type_ = item.type_;
				if (type_ === TNUMBER) {
					nstack.push(escapeValue(item.number_));
				}
				else if (type_ === TOP2) {
					n2 = nstack.pop();
					n1 = nstack.pop();
					f = item.index_;
					if (toJS && f == "^") {
						nstack.push("Math.pow(" + n1 + "," + n2 + ")");
					}
					else {
						nstack.push("(" + n1 + f + n2 + ")");
					}
				}
				else if (type_ === TVAR) {
					nstack.push(item.index_);
				}
				else if (type_ === TOP1) {
					n1 = nstack.pop();
					f = item.index_;
					if (f === "-") {
						nstack.push("(" + f + n1 + ")");
					}
					else {
						nstack.push(f + "(" + n1 + ")");
					}
				}
				else if (type_ === TFUNCALL) {
					n1 = nstack.pop();
					f = nstack.pop();
					nstack.push(f + "(" + n1 + ")");
				}
				else {
					throw new Error("invalid Expression");
				}
			}
			if (nstack.length > 1) {
				throw new Error("invalid Expression (parity)");
			}
			return nstack[0];
		},

		variables: function () {
			var L = this.tokens.length;
			var vars = [];
			for (var i = 0; i < L; i++) {
				var item = this.tokens[i];
				if (item.type_ === TVAR && (vars.indexOf(item.index_) == -1)) {
					vars.push(item.index_);
				}
			}

			return vars;
		},

		toJSFunction: function (param, variables) {
			var f = new Function(param, "with(Parser.values) { return " + this.simplify(variables).toString(true) + "; }");
			return f;
		}
	};

	function add(a, b) {
		return Number(a) + Number(b);
	}
	function sub(a, b) {
		return a - b; 
	}
	function mul(a, b) {
		return a * b;
	}
	function div(a, b) {
		return a / b;
	}
	function mod(a, b) {
		return a % b;
	}
	function concat(a, b) {
		return "" + a + b;
	}

	function neg(a) {
		return -a;
	}

	function random(a) {
		return Math.random() * (a || 1);
	}
	function fac(a) { //a!
		a = Math.floor(a);
		var b = a;
		while (a > 1) {
			b = b * (--a);
		}
		return b;
	}

	// TODO: use hypot that doesn't overflow
	function pyt(a, b) {
		return Math.sqrt(a * a + b * b);
	}

	function append(a, b) {
		if (Object.prototype.toString.call(a) != "[object Array]") {
			return [a, b];
		}
		a = a.slice();
		a.push(b);
		return a;
	}

	function Parser() {
		this.success = false;
		this.errormsg = "";
		this.expression = "";

		this.pos = 0;

		this.tokennumber = 0;
		this.tokenprio = 0;
		this.tokenindex = 0;
		this.tmpprio = 0;

		this.ops1 = {
			"sin": Math.sin,
			"cos": Math.cos,
			"tan": Math.tan,
			"asin": Math.asin,
			"acos": Math.acos,
			"atan": Math.atan,
			"sqrt": Math.sqrt,
			"log": Math.log,
			"abs": Math.abs,
			"ceil": Math.ceil,
			"floor": Math.floor,
			"round": Math.round,
			"-": neg,
			"exp": Math.exp
		};

		this.ops2 = {
			"+": add,
			"-": sub,
			"*": mul,
			"/": div,
			"%": mod,
			"^": Math.pow,
			",": append,
			"||": concat
		};

		this.functions = {
			"random": random,
			"fac": fac,
			"min": Math.min,
			"max": Math.max,
			"pyt": pyt,
			"pow": Math.pow,
			"atan2": Math.atan2
		};

		this.consts = {
			"E": Math.E,
			"PI": Math.PI
		};
	}

	Parser.parse = function (expr) {
		return new Parser().parse(expr);
	};

	Parser.evaluate = function (expr, variables) {
		return Parser.parse(expr).evaluate(variables);
	};

	Parser.Expression = Expression;

	Parser.values = {
		sin: Math.sin,
		cos: Math.cos,
		tan: Math.tan,
		asin: Math.asin,
		acos: Math.acos,
		atan: Math.atan,
		sqrt: Math.sqrt,
		log: Math.log,
		abs: Math.abs,
		ceil: Math.ceil,
		floor: Math.floor,
		round: Math.round,
		random: random,
		fac: fac,
		exp: Math.exp,
		min: Math.min,
		max: Math.max,
		pyt: pyt,
		pow: Math.pow,
		atan2: Math.atan2,
		E: Math.E,
		PI: Math.PI
	};

	var PRIMARY      = 1 << 0;
	var OPERATOR     = 1 << 1;
	var FUNCTION     = 1 << 2;
	var LPAREN       = 1 << 3;
	var RPAREN       = 1 << 4;
	var COMMA        = 1 << 5;
	var SIGN         = 1 << 6;
	var CALL         = 1 << 7;
	var NULLARY_CALL = 1 << 8;

	Parser.prototype = {
		parse: function (expr) {
			this.errormsg = "";
			this.success = true;
			var operstack = [];
			var tokenstack = [];
			this.tmpprio = 0;
			var expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
			var noperators = 0;
			this.expression = expr;
			this.pos = 0;

			while (this.pos < this.expression.length) {
				if (this.isOperator()) {
					if (this.isSign() && (expected & SIGN)) {
						if (this.isNegativeSign()) {
							this.tokenprio = 2;
							this.tokenindex = "-";
							noperators++;
							this.addfunc(tokenstack, operstack, TOP1);
						}
						expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
					}
					else if (this.isComment()) {

					}
					else {
						if ((expected & OPERATOR) === 0) {
							this.error_parsing(this.pos, "unexpected operator");
						}
						noperators += 2;
						this.addfunc(tokenstack, operstack, TOP2);
						expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
					}
				}
				else if (this.isNumber()) {
					if ((expected & PRIMARY) === 0) {
						this.error_parsing(this.pos, "unexpected number");
					}
					var token = new Token(TNUMBER, 0, 0, this.tokennumber);
					tokenstack.push(token);

					expected = (OPERATOR | RPAREN | COMMA);
				}
				else if (this.isString()) {
					if ((expected & PRIMARY) === 0) {
						this.error_parsing(this.pos, "unexpected string");
					}
					var token = new Token(TNUMBER, 0, 0, this.tokennumber);
					tokenstack.push(token);

					expected = (OPERATOR | RPAREN | COMMA);
				}
				else if (this.isLeftParenth()) {
					if ((expected & LPAREN) === 0) {
						this.error_parsing(this.pos, "unexpected \"(\"");
					}

					if (expected & CALL) {
						noperators += 2;
						this.tokenprio = -2;
						this.tokenindex = -1;
						this.addfunc(tokenstack, operstack, TFUNCALL);
					}

					expected = (PRIMARY | LPAREN | FUNCTION | SIGN | NULLARY_CALL);
				}
				else if (this.isRightParenth()) {
				    if (expected & NULLARY_CALL) {
						var token = new Token(TNUMBER, 0, 0, []);
						tokenstack.push(token);
					}
					else if ((expected & RPAREN) === 0) {
						this.error_parsing(this.pos, "unexpected \")\"");
					}

					expected = (OPERATOR | RPAREN | COMMA | LPAREN | CALL);
				}
				else if (this.isComma()) {
					if ((expected & COMMA) === 0) {
						this.error_parsing(this.pos, "unexpected \",\"");
					}
					this.addfunc(tokenstack, operstack, TOP2);
					noperators += 2;
					expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
				}
				else if (this.isConst()) {
					if ((expected & PRIMARY) === 0) {
						this.error_parsing(this.pos, "unexpected constant");
					}
					var consttoken = new Token(TNUMBER, 0, 0, this.tokennumber);
					tokenstack.push(consttoken);
					expected = (OPERATOR | RPAREN | COMMA);
				}
				else if (this.isOp2()) {
					if ((expected & FUNCTION) === 0) {
						this.error_parsing(this.pos, "unexpected function");
					}
					this.addfunc(tokenstack, operstack, TOP2);
					noperators += 2;
					expected = (LPAREN);
				}
				else if (this.isOp1()) {
					if ((expected & FUNCTION) === 0) {
						this.error_parsing(this.pos, "unexpected function");
					}
					this.addfunc(tokenstack, operstack, TOP1);
					noperators++;
					expected = (LPAREN);
				}
				else if (this.isVar()) {
					if ((expected & PRIMARY) === 0) {
						this.error_parsing(this.pos, "unexpected variable");
					}
					var vartoken = new Token(TVAR, this.tokenindex, 0, 0);
					tokenstack.push(vartoken);

					expected = (OPERATOR | RPAREN | COMMA | LPAREN | CALL);
				}
				else if (this.isWhite()) {
				}
				else {
					if (this.errormsg === "") {
						this.error_parsing(this.pos, "unknown character");
					}
					else {
						this.error_parsing(this.pos, this.errormsg);
					}
				}
			}
			if (this.tmpprio < 0 || this.tmpprio >= 10) {
				this.error_parsing(this.pos, "unmatched \"()\"");
			}
			while (operstack.length > 0) {
				var tmp = operstack.pop();
				tokenstack.push(tmp);
			}
			if (noperators + 1 !== tokenstack.length) {
				//print(noperators + 1);
				//print(tokenstack);
				this.error_parsing(this.pos, "parity");
			}

			return new Expression(tokenstack, object(this.ops1), object(this.ops2), object(this.functions));
		},

		evaluate: function (expr, variables) {
			return this.parse(expr).evaluate(variables);
		},

		error_parsing: function (column, msg) {
			this.success = false;
			this.errormsg = "parse error [column " + (column) + "]: " + msg;
			throw new Error(this.errormsg);
		},

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

		addfunc: function (tokenstack, operstack, type_) {
			var operator = new Token(type_, this.tokenindex, this.tokenprio + this.tmpprio, 0);
			while (operstack.length > 0) {
				if (operator.prio_ <= operstack[operstack.length - 1].prio_) {
					tokenstack.push(operstack.pop());
				}
				else {
					break;
				}
			}
			operstack.push(operator);
		},

		isNumber: function () {
			var r = false;
			var str = "";
			while (this.pos < this.expression.length) {
				var code = this.expression.charCodeAt(this.pos);
				if ((code >= 48 && code <= 57) || code === 46) {
					str += this.expression.charAt(this.pos);
					this.pos++;
					this.tokennumber = parseFloat(str);
					r = true;
				}
				else {
					break;
				}
			}
			return r;
		},

		// Ported from the yajjl JSON parser at http://code.google.com/p/yajjl/
		unescape: function(v, pos) {
			var buffer = [];
			var escaping = false;

			for (var i = 0; i < v.length; i++) {
				var c = v.charAt(i);
	
				if (escaping) {
					switch (c) {
					case "'":
						buffer.push("'");
						break;
					case '\\':
						buffer.push('\\');
						break;
					case '/':
						buffer.push('/');
						break;
					case 'b':
						buffer.push('\b');
						break;
					case 'f':
						buffer.push('\f');
						break;
					case 'n':
						buffer.push('\n');
						break;
					case 'r':
						buffer.push('\r');
						break;
					case 't':
						buffer.push('\t');
						break;
					case 'u':
						// interpret the following 4 characters as the hex of the unicode code point
						var codePoint = parseInt(v.substring(i + 1, i + 5), 16);
						buffer.push(String.fromCharCode(codePoint));
						i += 4;
						break;
					default:
						throw this.error_parsing(pos + i, "Illegal escape sequence: '\\" + c + "'");
					}
					escaping = false;
				} else {
					if (c == '\\') {
						escaping = true;
					} else {
						buffer.push(c);
					}
				}
			}
	
			return buffer.join('');
		},

		isString: function () {
			var r = false;
			var str = "";
			var startpos = this.pos;
			if (this.pos < this.expression.length && this.expression.charAt(this.pos) == "'") {
				this.pos++;
				while (this.pos < this.expression.length) {
					var code = this.expression.charAt(this.pos);
					if (code != "'" || str.slice(-1) == "\\") {
						str += this.expression.charAt(this.pos);
						this.pos++;
					}
					else {
						this.pos++;
						this.tokennumber = this.unescape(str, startpos);
						r = true;
						break;
					}
				}
			}
			return r;
		},

		isConst: function () {
			var str;
			for (var i in this.consts) {
				if (true) {
					var L = i.length;
					str = this.expression.substr(this.pos, L);
					if (i === str) {
						this.tokennumber = this.consts[i];
						this.pos += L;
						return true;
					}
				}
			}
			return false;
		},

		isOperator: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 43) { // +
				this.tokenprio = 0;
				this.tokenindex = "+";
			}
			else if (code === 45) { // -
				this.tokenprio = 0;
				this.tokenindex = "-";
			}
			else if (code === 124) { // |
				if (this.expression.charCodeAt(this.pos + 1) === 124) {
					this.pos++;
					this.tokenprio = 0;
					this.tokenindex = "||";
				}
				else {
					return false;
				}
			}
			else if (code === 42) { // *
				this.tokenprio = 1;
				this.tokenindex = "*";
			}
			else if (code === 47) { // /
				this.tokenprio = 2;
				this.tokenindex = "/";
			}
			else if (code === 37) { // %
				this.tokenprio = 2;
				this.tokenindex = "%";
			}
			else if (code === 94) { // ^
				this.tokenprio = 3;
				this.tokenindex = "^";
			}
			else {
				return false;
			}
			this.pos++;
			return true;
		},

		isSign: function () {
			var code = this.expression.charCodeAt(this.pos - 1);
			if (code === 45 || code === 43) { // -
				return true;
			}
			return false;
		},

		isPositiveSign: function () {
			var code = this.expression.charCodeAt(this.pos - 1);
			if (code === 43) { // -
				return true;
			}
			return false;
		},

		isNegativeSign: function () {
			var code = this.expression.charCodeAt(this.pos - 1);
			if (code === 45) { // -
				return true;
			}
			return false;
		},

		isLeftParenth: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 40) { // (
				this.pos++;
				this.tmpprio += 10;
				return true;
			}
			return false;
		},

		isRightParenth: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 41) { // )
				this.pos++;
				this.tmpprio -= 10;
				return true;
			}
			return false;
		},

		isComma: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 44) { // ,
				this.pos++;
				this.tokenprio = -1;
				this.tokenindex = ",";
				return true;
			}
			return false;
		},

		isWhite: function () {
			var code = this.expression.charCodeAt(this.pos);
			if (code === 32 || code === 9 || code === 10 || code === 13) {
				this.pos++;
				return true;
			}
			return false;
		},

		isOp1: function () {
			var str = "";
			for (var i = this.pos; i < this.expression.length; i++) {
				var c = this.expression.charAt(i);
				if (c.toUpperCase() === c.toLowerCase()) {
					if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
						break;
					}
				}
				str += c;
			}
			if (str.length > 0 && (str in this.ops1)) {
				this.tokenindex = str;
				this.tokenprio = 5;
				this.pos += str.length;
				return true;
			}
			return false;
		},

		isOp2: function () {
			var str = "";
			for (var i = this.pos; i < this.expression.length; i++) {
				var c = this.expression.charAt(i);
				if (c.toUpperCase() === c.toLowerCase()) {
					if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
						break;
					}
				}
				str += c;
			}
			if (str.length > 0 && (str in this.ops2)) {
				this.tokenindex = str;
				this.tokenprio = 5;
				this.pos += str.length;
				return true;
			}
			return false;
		},

		isVar: function () {
			var str = "";
			for (var i = this.pos; i < this.expression.length; i++) {
				var c = this.expression.charAt(i);
				if (c.toUpperCase() === c.toLowerCase()) {
					if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
						break;
					}
				}
				str += c;
			}
			if (str.length > 0) {
				this.tokenindex = str;
				this.tokenprio = 4;
				this.pos += str.length;
				return true;
			}
			return false;
		},

		isComment: function () {
			var code = this.expression.charCodeAt(this.pos - 1);
			if (code === 47 && this.expression.charCodeAt(this.pos) === 42) {
				this.pos = this.expression.indexOf("*/", this.pos) + 2;
				if (this.pos === 1) {
					this.pos = this.expression.length;
				}
				return true;
			}
			return false;
		}
	};

	return Parser;
});
},{}],"utils\\template.js":[function(require,module,exports){
/**
 * A very simple, ERB-style templating. Basically, just as string substitution.
 * The reason to not use default Lo-dash’es `_.template()` implementation
 * is because it fails to run in CSP-enabled environments (Chrome extension, Atom)
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var stringStream = require('../assets/stringStream');
	var utils = require('./common');

	function parseArgs(str) {
		var args = [];
		var stream = stringStream(str);

		while (!stream.eol()) {
			if (stream.peek() == ',') {
				args.push(utils.trim(stream.current()));
				stream.next();
				stream.start = stream.pos;
			}
			stream.next();
		}

		args.push(utils.trim(stream.current()));
		return args.filter(function(a) {
			return !!a;
		});
	}

	function parseFunctionCall(str) {
		var fnName = null, args;
		var stream = stringStream(str);
		while (!stream.eol()) {
			if (stream.peek() == '(') {
				fnName = stream.current();
				stream.start = stream.pos;
				stream.skipToPair('(', ')', true);
				args = stream.current();
				args = parseArgs(args.substring(1, args.length - 1));
				break;
			}

			stream.next();
		}

		return fnName && {
			name: fnName,
			args: args
		};
	}

	function evalArg(arg, context) {
		if (/^['"]/.test(arg)) {
			// plain string
			return arg.replace(/^(['"])(.+?)\1$/, '$2');
		}

		if (!isNaN(+arg)) {
			// a number
			return +arg;
		}

		// otherwise, treat argument as a property name
		if (arg) {
			var parts = arg.split('.');
			var prop = context;
			while (parts.length) {
				prop = prop[parts.shift()];
			}

			return prop;
		}
	}

	function process(template, context) {
		return template.replace(/<%[=\-](.+?)%>/g, function(str, match) {
			match = utils.trim(match);
			var fn = parseFunctionCall(match);
			if (fn) {
				var fnArgs = fn.args.map(function(arg) {
					return evalArg(arg, context);
				});
				return context[fn.name].apply(context, fnArgs);
			}

			return evalArg(match, context);
		});
	}

	return function(template, context) {
		return context ? process(template, context) : function(context) {
			return process(template, context);
		};
	};
});
},{"../assets/stringStream":"assets\\stringStream.js","./common":"utils\\common.js"}],"vendor\\klass.js":[function(require,module,exports){
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	var utils = require('../utils/common');

	/**
	 * Shared empty constructor function to aid in prototype-chain creation.
	 */
	var ctor = function(){};

	/**
	 * Helper function to correctly set up the prototype chain, for subclasses.
	 * Similar to `goog.inherits`, but uses a hash of prototype properties and
	 * class properties to be extended.
	 * Took it from Backbone.
	 * @param {Object} parent
	 * @param {Object} protoProps
	 * @param {Object} staticProps
	 * @returns {Object}
	 */
	function inherits(parent, protoProps, staticProps) {
		var child;

		// The constructor function for the new subclass is either defined by
		// you (the "constructor" property in your `extend` definition), or
		// defaulted by us to simply call the parent's constructor.
		if (protoProps && protoProps.hasOwnProperty('constructor')) {
			child = protoProps.constructor;
		} else {
			child = function() {
				parent.apply(this, arguments);
			};
		}

		// Inherit class (static) properties from parent.
		utils.extend(child, parent);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();

		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps)
			utils.extend(child.prototype, protoProps);

		// Add static properties to the constructor function, if supplied.
		if (staticProps)
			utils.extend(child, staticProps);

		// Correctly set child's `prototype.constructor`.
		child.prototype.constructor = child;

		// Set a convenience property in case the parent's prototype is needed
		// later.
		child.__super__ = parent.prototype;

		return child;
	}

	return {
		/**
		 * The self-propagating extend function for classes.
		 * Took it from Backbone 
		 * @param {Object} protoProps
		 * @param {Object} classProps
		 * @returns {Object}
		 */
		extend: function(protoProps, classProps) {
			var child = inherits(this, protoProps, classProps);
			child.extend = this.extend;
			// a hack required to WSH inherit `toString` method
			if (protoProps.hasOwnProperty('toString'))
				child.prototype.toString = protoProps.toString;
			return child;
		}
	};
});
},{"../utils/common":"utils\\common.js"}],"vendor\\stringScore.js":[function(require,module,exports){
/*!
 * string_score.js: String Scoring Algorithm 0.1.10 
 *
 * http://joshaven.com/string_score
 * https://github.com/joshaven/string_score
 *
 * Copyright (C) 2009-2011 Joshaven Potter <yourtech@gmail.com>
 * Special thanks to all of the contributors listed here https://github.com/joshaven/string_score
 * MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Date: Tue Mar 1 2011
*/

/**
 * Scores a string against another string.
 *  'Hello World'.score('he');     //=> 0.5931818181818181
 *  'Hello World'.score('Hello');  //=> 0.7318181818181818
 */
if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function(require, exports, module) {
	return {
		score: function(string, abbreviation, fuzziness) {
			// If the string is equal to the abbreviation, perfect match.
			  if (string == abbreviation) {return 1;}
			  //if it's not a perfect match and is empty return 0
			  if(abbreviation == "") {return 0;}

			  var total_character_score = 0,
			      abbreviation_length = abbreviation.length,
			      string_length = string.length,
			      start_of_string_bonus,
			      abbreviation_score,
			      fuzzies=1,
			      final_score;
			  
			  // Walk through abbreviation and add up scores.
			  for (var i = 0,
			         character_score/* = 0*/,
			         index_in_string/* = 0*/,
			         c/* = ''*/,
			         index_c_lowercase/* = 0*/,
			         index_c_uppercase/* = 0*/,
			         min_index/* = 0*/;
			     i < abbreviation_length;
			     ++i) {
			    
			    // Find the first case-insensitive match of a character.
			    c = abbreviation.charAt(i);
			    
			    index_c_lowercase = string.indexOf(c.toLowerCase());
			    index_c_uppercase = string.indexOf(c.toUpperCase());
			    min_index = Math.min(index_c_lowercase, index_c_uppercase);
			    index_in_string = (min_index > -1) ? min_index : Math.max(index_c_lowercase, index_c_uppercase);
			    
			    if (index_in_string === -1) { 
			      if (fuzziness) {
			        fuzzies += 1-fuzziness;
			        continue;
			      } else {
			        return 0;
			      }
			    } else {
			      character_score = 0.1;
			    }
			    
			    // Set base score for matching 'c'.
			    
			    // Same case bonus.
			    if (string[index_in_string] === c) { 
			      character_score += 0.1; 
			    }
			    
			    // Consecutive letter & start-of-string Bonus
			    if (index_in_string === 0) {
			      // Increase the score when matching first character of the remainder of the string
			      character_score += 0.6;
			      if (i === 0) {
			        // If match is the first character of the string
			        // & the first character of abbreviation, add a
			        // start-of-string match bonus.
			        start_of_string_bonus = 1; //true;
			      }
			    }
			    else {
			  // Acronym Bonus
			  // Weighing Logic: Typing the first character of an acronym is as if you
			  // preceded it with two perfect character matches.
			  if (string.charAt(index_in_string - 1) === ' ') {
			    character_score += 0.8; // * Math.min(index_in_string, 5); // Cap bonus at 0.4 * 5
			  }
			    }
			    
			    // Left trim the already matched part of the string
			    // (forces sequential matching).
			    string = string.substring(index_in_string + 1, string_length);
			    
			    total_character_score += character_score;
			  } // end of for loop
			  
			  // Uncomment to weigh smaller words higher.
			  // return total_character_score / string_length;
			  
			  abbreviation_score = total_character_score / abbreviation_length;
			  //percentage_of_matched_string = abbreviation_length / string_length;
			  //word_score = abbreviation_score * percentage_of_matched_string;
			  
			  // Reduce penalty for longer strings.
			  //final_score = (word_score + abbreviation_score) / 2;
			  final_score = ((abbreviation_score * (abbreviation_length / string_length)) + abbreviation_score) / 2;
			  
			  final_score = final_score / fuzzies;
			  
			  if (start_of_string_bonus && (final_score + 0.15 < 1)) {
			    final_score += 0.15;
			  }
			  
			  return final_score;
		}
	};
});
},{}]},{},["./lib/emmet.js","./bundles/snippets.js"])("./lib/emmet.js")
});