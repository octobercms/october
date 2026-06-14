/* Javascript plotting library for jQuery, version 0.8.2-alpha.

Copyright (c) 2007-2013 IOLA and Ole Laursen.
Licensed under the MIT license.

*/

// first an inline dependency, jquery.colorhelpers.js, we inline it here
// for convenience

/* Plugin for jQuery for working with colors.
 *
 * Version 1.1.
 *
 * Inspiration from jQuery color animation plugin by John Resig.
 *
 * Released under the MIT license by Ole Laursen, October 2009.
 *
 * Examples:
 *
 *   $.color.parse("#fff").scale('rgb', 0.25).add('a', -0.5).toString()
 *   var c = $.color.extract($("#mydiv"), 'background-color');
 *   console.log(c.r, c.g, c.b, c.a);
 *   $.color.make(100, 50, 25, 0.4).toString() // returns "rgba(100,50,25,0.4)"
 *
 * Note that .scale() and .add() return the same modified object
 * instead of making a new one.
 *
 * V. 1.1: Fix error handling so e.g. parsing an empty string does
 * produce a color rather than just crashing.
 */
(function(B){B.color={};B.color.make=function(F,E,C,D){var G={};G.r=F||0;G.g=E||0;G.b=C||0;G.a=D!=null?D:1;G.add=function(J,I){for(var H=0;H<J.length;++H){G[J.charAt(H)]+=I}return G.normalize()};G.scale=function(J,I){for(var H=0;H<J.length;++H){G[J.charAt(H)]*=I}return G.normalize()};G.toString=function(){if(G.a>=1){return"rgb("+[G.r,G.g,G.b].join(",")+")"}else{return"rgba("+[G.r,G.g,G.b,G.a].join(",")+")"}};G.normalize=function(){function H(J,K,I){return K<J?J:(K>I?I:K)}G.r=H(0,parseInt(G.r),255);G.g=H(0,parseInt(G.g),255);G.b=H(0,parseInt(G.b),255);G.a=H(0,G.a,1);return G};G.clone=function(){return B.color.make(G.r,G.b,G.g,G.a)};return G.normalize()};B.color.extract=function(D,C){var E;do{E=D.css(C).toLowerCase();if(E!=""&&E!="transparent"){break}D=D.parent()}while(!B.nodeName(D.get(0),"body"));if(E=="rgba(0, 0, 0, 0)"){E="transparent"}return B.color.parse(E)};B.color.parse=function(F){var E,C=B.color.make;if(E=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(F)){return C(parseInt(E[1],10),parseInt(E[2],10),parseInt(E[3],10))}if(E=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)){return C(parseInt(E[1],10),parseInt(E[2],10),parseInt(E[3],10),parseFloat(E[4]))}if(E=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(F)){return C(parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55)}if(E=/rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(F)){return C(parseFloat(E[1])*2.55,parseFloat(E[2])*2.55,parseFloat(E[3])*2.55,parseFloat(E[4]))}if(E=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(F)){return C(parseInt(E[1],16),parseInt(E[2],16),parseInt(E[3],16))}if(E=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(F)){return C(parseInt(E[1]+E[1],16),parseInt(E[2]+E[2],16),parseInt(E[3]+E[3],16))}var D=B.trim(F).toLowerCase();if(D=="transparent"){return C(255,255,255,0)}else{E=A[D]||[0,0,0];return C(E[0],E[1],E[2])}};var A={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0]}})(jQuery);

// the actual Flot code
(function($) {

	// Cache the prototype hasOwnProperty for faster access

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	///////////////////////////////////////////////////////////////////////////
	// The Canvas object is a wrapper around an HTML5 <canvas> tag.
	//
	// @constructor
	// @param {string} cls List of classes to apply to the canvas.
	// @param {element} container Element onto which to append the canvas.
	//
	// Requiring a container is a little iffy, but unfortunately canvas
	// operations don't work unless the canvas is attached to the DOM.

	function Canvas(cls, container) {

		var element = container.children("." + cls)[0];

		if (element == null) {

			element = document.createElement("canvas");
			element.className = cls;

			$(element).css({ direction: "ltr", position: "absolute", left: 0, top: 0 })
				.appendTo(container);

			// If HTML5 Canvas isn't available, fall back to [Ex|Flash]canvas

			if (!element.getContext) {
				if (window.G_vmlCanvasManager) {
					element = window.G_vmlCanvasManager.initElement(element);
				} else {
					throw new Error("Canvas is not available. If you're using IE with a fall-back such as Excanvas, then there's either a mistake in your conditional include, or the page has no DOCTYPE and is rendering in Quirks Mode.");
				}
			}
		}

		this.element = element;

		var context = this.context = element.getContext("2d");

		// Determine the screen's ratio of physical to device-independent
		// pixels.  This is the ratio between the canvas width that the browser
		// advertises and the number of pixels actually present in that space.

		// The iPhone 4, for example, has a device-independent width of 320px,
		// but its screen is actually 640px wide.  It therefore has a pixel
		// ratio of 2, while most normal devices have a ratio of 1.

		var devicePixelRatio = window.devicePixelRatio || 1,
			backingStoreRatio =
				context.webkitBackingStorePixelRatio ||
				context.mozBackingStorePixelRatio ||
				context.msBackingStorePixelRatio ||
				context.oBackingStorePixelRatio ||
				context.backingStorePixelRatio || 1;

		this.pixelRatio = devicePixelRatio / backingStoreRatio;

		// Size the canvas to match the internal dimensions of its container

		this.resize(container.width(), container.height());

		// Collection of HTML div layers for text overlaid onto the canvas

		this.textContainer = null;
		this.text = {};

		// Cache of text fragments and metrics, so we can avoid expensively
		// re-calculating them when the plot is re-rendered in a loop.

		this._textCache = {};
	}

	// Resizes the canvas to the given dimensions.
	//
	// @param {number} width New width of the canvas, in pixels.
	// @param {number} width New height of the canvas, in pixels.

	Canvas.prototype.resize = function(width, height) {

		if (width <= 0 || height <= 0) {
			throw new Error("Invalid dimensions for plot, width = " + width + ", height = " + height);
		}

		var element = this.element,
			context = this.context,
			pixelRatio = this.pixelRatio;

		// Resize the canvas, increasing its density based on the display's
		// pixel ratio; basically giving it more pixels without increasing the
		// size of its element, to take advantage of the fact that retina
		// displays have that many more pixels in the same advertised space.

		// Resizing should reset the state (excanvas seems to be buggy though)

		if (this.width != width) {
			element.width = width * pixelRatio;
			element.style.width = width + "px";
			this.width = width;
		}

		if (this.height != height) {
			element.height = height * pixelRatio;
			element.style.height = height + "px";
			this.height = height;
		}

		// Save the context, so we can reset in case we get replotted.  The
		// restore ensure that we're really back at the initial state, and
		// should be safe even if we haven't saved the initial state yet.

		context.restore();
		context.save();

		// Scale the coordinate space to match the display density; so even though we
		// may have twice as many pixels, we still want lines and other drawing to
		// appear at the same size; the extra pixels will just make them crisper.

		context.scale(pixelRatio, pixelRatio);
	};

	// Clears the entire canvas area, not including any overlaid HTML text

	Canvas.prototype.clear = function() {
		this.context.clearRect(0, 0, this.width, this.height);
	};

	// Finishes rendering the canvas, including managing the text overlay.

	Canvas.prototype.render = function() {

		var cache = this._textCache;

		// For each text layer, add elements marked as active that haven't
		// already been rendered, and remove those that are no longer active.

		for (var layerKey in cache) {
			if (hasOwnProperty.call(cache, layerKey)) {

				var layer = this.getTextLayer(layerKey),
					layerCache = cache[layerKey];

				layer.hide();

				for (var styleKey in layerCache) {
					if (hasOwnProperty.call(layerCache, styleKey)) {
						var styleCache = layerCache[styleKey];
						for (var key in styleCache) {
							if (hasOwnProperty.call(styleCache, key)) {

								var positions = styleCache[key].positions;

								for (var i = 0, position; position = positions[i]; i++) {
									if (position.active) {
										if (!position.rendered) {
											layer.append(position.element);
											position.rendered = true;
										}
									} else {
										positions.splice(i--, 1);
										if (position.rendered) {
											position.element.detach();
										}
									}
								}

								if (positions.length == 0) {
									delete styleCache[key];
								}
							}
						}
					}
				}

				layer.show();
			}
		}
	};

	// Creates (if necessary) and returns the text overlay container.
	//
	// @param {string} classes String of space-separated CSS classes used to
	//     uniquely identify the text layer.
	// @return {object} The jQuery-wrapped text-layer div.

	Canvas.prototype.getTextLayer = function(classes) {

		var layer = this.text[classes];

		// Create the text layer if it doesn't exist

		if (layer == null) {

			// Create the text layer container, if it doesn't exist

			if (this.textContainer == null) {
				this.textContainer = $("<div class='flot-text'></div>")
					.css({
						position: "absolute",
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						'font-size': "smaller",
						color: "#545454"
					})
					.insertAfter(this.element);
			}

			layer = this.text[classes] = $("<div></div>")
				.addClass(classes)
				.css({
					position: "absolute",
					top: 0,
					left: 0,
					bottom: 0,
					right: 0
				})
				.appendTo(this.textContainer);
		}

		return layer;
	};

	// Creates (if necessary) and returns a text info object.
	//
	// The object looks like this:
	//
	// {
	//     width: Width of the text's wrapper div.
	//     height: Height of the text's wrapper div.
	//     element: The jQuery-wrapped HTML div containing the text.
	//     positions: Array of positions at which this text is drawn.
	// }
	//
	// The positions array contains objects that look like this:
	//
	// {
	//     active: Flag indicating whether the text should be visible.
	//     rendered: Flag indicating whether the text is currently visible.
	//     element: The jQuery-wrapped HTML div containing the text.
	//     x: X coordinate at which to draw the text.
	//     y: Y coordinate at which to draw the text.
	// }
	//
	// Each position after the first receives a clone of the original element.
	//
	// The idea is that that the width, height, and general 'identity' of the
	// text is constant no matter where it is placed; the placements are a
	// secondary property.
	//
	// Canvas maintains a cache of recently-used text info objects; getTextInfo
	// either returns the cached element or creates a new entry.
	//
	// @param {string} layer A string of space-separated CSS classes uniquely
	//     identifying the layer containing this text.
	// @param {string} text Text string to retrieve info for.
	// @param {(string|object)=} font Either a string of space-separated CSS
	//     classes or a font-spec object, defining the text's font and style.
	// @param {number=} angle Angle at which to rotate the text, in degrees.
	//     Angle is currently unused, it will be implemented in the future.
	// @param {number=} width Maximum width of the text before it wraps.
	// @return {object} a text info object.

	Canvas.prototype.getTextInfo = function(layer, text, font, angle, width) {

		var textStyle, layerCache, styleCache, info;

		// Cast the value to a string, in case we were given a number or such

		text = "" + text;

		// If the font is a font-spec object, generate a CSS font definition

		if (typeof font === "object") {
			textStyle = font.style + " " + font.variant + " " + font.weight + " " + font.size + "px/" + font.lineHeight + "px " + font.family;
		} else {
			textStyle = font;
		}

		// Retrieve (or create) the cache for the text's layer and styles

		layerCache = this._textCache[layer];

		if (layerCache == null) {
			layerCache = this._textCache[layer] = {};
		}

		styleCache = layerCache[textStyle];

		if (styleCache == null) {
			styleCache = layerCache[textStyle] = {};
		}

		info = styleCache[text];

		// If we can't find a matching element in our cache, create a new one

		if (info == null) {

			var element = $("<div></div>").html(text)
				.css({
					position: "absolute",
					'max-width': width,
					top: -9999
				})
				.appendTo(this.getTextLayer(layer));

			if (typeof font === "object") {
				element.css({
					font: textStyle,
					color: font.color
				});
			} else if (typeof font === "string") {
				element.addClass(font);
			}

			info = styleCache[text] = {
				width: element.outerWidth(true),
				height: element.outerHeight(true),
				element: element,
				positions: []
			};

			element.detach();
		}

		return info;
	};

	// Adds a text string to the canvas text overlay.
	//
	// The text isn't drawn immediately; it is marked as rendering, which will
	// result in its addition to the canvas on the next render pass.
	//
	// @param {string} layer A string of space-separated CSS classes uniquely
	//     identifying the layer containing this text.
	// @param {number} x X coordinate at which to draw the text.
	// @param {number} y Y coordinate at which to draw the text.
	// @param {string} text Text string to draw.
	// @param {(string|object)=} font Either a string of space-separated CSS
	//     classes or a font-spec object, defining the text's font and style.
	// @param {number=} angle Angle at which to rotate the text, in degrees.
	//     Angle is currently unused, it will be implemented in the future.
	// @param {number=} width Maximum width of the text before it wraps.
	// @param {string=} halign Horizontal alignment of the text; either "left",
	//     "center" or "right".
	// @param {string=} valign Vertical alignment of the text; either "top",
	//     "middle" or "bottom".

	Canvas.prototype.addText = function(layer, x, y, text, font, angle, width, halign, valign) {

		var info = this.getTextInfo(layer, text, font, angle, width),
			positions = info.positions;

		// Tweak the div's position to match the text's alignment

		if (halign == "center") {
			x -= info.width / 2;
		} else if (halign == "right") {
			x -= info.width;
		}

		if (valign == "middle") {
			y -= info.height / 2;
		} else if (valign == "bottom") {
			y -= info.height;
		}

		// Determine whether this text already exists at this position.
		// If so, mark it for inclusion in the next render pass.

		for (var i = 0, position; position = positions[i]; i++) {
			if (position.x == x && position.y == y) {
				position.active = true;
				return;
			}
		}

		// If the text doesn't exist at this position, create a new entry

		// For the very first position we'll re-use the original element,
		// while for subsequent ones we'll clone it.

		position = {
			active: true,
			rendered: false,
			element: positions.length ? info.element.clone() : info.element,
			x: x,
			y: y
		};

		positions.push(position);

		// Move the element to its final position within the container

		position.element.css({
			top: Math.round(y),
			left: Math.round(x),
			'text-align': halign	// In case the text wraps
		});
	};

	// Removes one or more text strings from the canvas text overlay.
	//
	// If no parameters are given, all text within the layer is removed.
	//
	// Note that the text is not immediately removed; it is simply marked as
	// inactive, which will result in its removal on the next render pass.
	// This avoids the performance penalty for 'clear and redraw' behavior,
	// where we potentially get rid of all text on a layer, but will likely
	// add back most or all of it later, as when redrawing axes, for example.
	//
	// @param {string} layer A string of space-separated CSS classes uniquely
	//     identifying the layer containing this text.
	// @param {number=} x X coordinate of the text.
	// @param {number=} y Y coordinate of the text.
	// @param {string=} text Text string to remove.
	// @param {(string|object)=} font Either a string of space-separated CSS
	//     classes or a font-spec object, defining the text's font and style.
	// @param {number=} angle Angle at which the text is rotated, in degrees.
	//     Angle is currently unused, it will be implemented in the future.

	Canvas.prototype.removeText = function(layer, x, y, text, font, angle) {
		if (text == null) {
			var layerCache = this._textCache[layer];
			if (layerCache != null) {
				for (var styleKey in layerCache) {
					if (hasOwnProperty.call(layerCache, styleKey)) {
						var styleCache = layerCache[styleKey];
						for (var key in styleCache) {
							if (hasOwnProperty.call(styleCache, key)) {
								var positions = styleCache[key].positions;
								for (var i = 0, position; position = positions[i]; i++) {
									position.active = false;
								}
							}
						}
					}
				}
			}
		} else {
			var positions = this.getTextInfo(layer, text, font, angle).positions;
			for (var i = 0, position; position = positions[i]; i++) {
				if (position.x == x && position.y == y) {
					position.active = false;
				}
			}
		}
	};

	///////////////////////////////////////////////////////////////////////////
	// The top-level container for the entire plot.

    function Plot(placeholder, data_, options_, plugins) {
        // data is on the form:
        //   [ series1, series2 ... ]
        // where series is either just the data as [ [x1, y1], [x2, y2], ... ]
        // or { data: [ [x1, y1], [x2, y2], ... ], label: "some label", ... }

        var series = [],
            options = {
                // the color theme used for graphs
                colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
                legend: {
                    show: true,
                    noColumns: 1, // number of colums in legend table
                    labelFormatter: null, // fn: string -> string
                    labelBoxBorderColor: "#ccc", // border color for the little label boxes
                    container: null, // container (as jQuery object) to put legend in, null means default on top of graph
                    position: "ne", // position of default legend container within plot
                    margin: 5, // distance from grid edge to default legend container within plot
                    backgroundColor: null, // null means auto-detect
                    backgroundOpacity: 0.85, // set to 0 to avoid background
                    sorted: null    // default to no legend sorting
                },
                xaxis: {
                    show: null, // null = auto-detect, true = always, false = never
                    position: "bottom", // or "top"
                    mode: null, // null or "time"
                    font: null, // null (derived from CSS in placeholder) or object like { size: 11, lineHeight: 13, style: "italic", weight: "bold", family: "sans-serif", variant: "small-caps" }
                    color: null, // base color, labels, ticks
                    tickColor: null, // possibly different color of ticks, e.g. "rgba(0,0,0,0.15)"
                    transform: null, // null or f: number -> number to transform axis
                    inverseTransform: null, // if transform is set, this should be the inverse function
                    min: null, // min. value to show, null means set automatically
                    max: null, // max. value to show, null means set automatically
                    autoscaleMargin: null, // margin in % to add if auto-setting min/max
                    ticks: null, // either [1, 3] or [[1, "a"], 3] or (fn: axis info -> ticks) or app. number of ticks for auto-ticks
                    tickFormatter: null, // fn: number -> string
                    labelWidth: null, // size of tick labels in pixels
                    labelHeight: null,
                    reserveSpace: null, // whether to reserve space even if axis isn't shown
                    tickLength: null, // size in pixels of ticks, or "full" for whole line
                    alignTicksWithAxis: null, // axis number or null for no sync
                    tickDecimals: null, // no. of decimals, null means auto
                    tickSize: null, // number or [number, "unit"]
                    minTickSize: null // number or [number, "unit"]
                },
                yaxis: {
                    autoscaleMargin: 0.02,
                    position: "left" // or "right"
                },
                xaxes: [],
                yaxes: [],
                series: {
                    points: {
                        show: false,
                        radius: 3,
                        lineWidth: 2, // in pixels
                        fill: true,
                        fillColor: "#ffffff",
                        symbol: "circle" // or callback
                    },
                    lines: {
                        // we don't put in show: false so we can see
                        // whether lines were actively disabled
                        lineWidth: 2, // in pixels
                        fill: false,
                        fillColor: null,
                        steps: false
                        // Omit 'zero', so we can later default its value to
                        // match that of the 'fill' option.
                    },
                    bars: {
                        show: false,
                        lineWidth: 2, // in pixels
                        barWidth: 1, // in units of the x axis
                        fill: true,
                        fillColor: null,
                        align: "left", // "left", "right", or "center"
                        horizontal: false,
                        zero: true
                    },
                    shadowSize: 3,
                    highlightColor: null
                },
                grid: {
                    show: true,
                    aboveData: false,
                    color: "#545454", // primary color used for outline and labels
                    backgroundColor: null, // null for transparent, else color
                    borderColor: null, // set if different from the grid color
                    tickColor: null, // color for the ticks, e.g. "rgba(0,0,0,0.15)"
                    margin: 0, // distance from the canvas edge to the grid
                    labelMargin: 5, // in pixels
                    axisMargin: 8, // in pixels
                    borderWidth: 2, // in pixels
                    minBorderMargin: null, // in pixels, null means taken from points radius
                    markings: null, // array of ranges or fn: axes -> array of ranges
                    markingsColor: "#f4f4f4",
                    markingsLineWidth: 2,
                    // interactive stuff
                    clickable: false,
                    hoverable: false,
                    autoHighlight: true, // highlight in case mouse is near
                    mouseActiveRadius: 10 // how far the mouse can be away to activate an item
                },
                interaction: {
                    redrawOverlayInterval: 1000/60 // time between updates, -1 means in same flow
                },
                hooks: {}
            },
        surface = null,     // the canvas for the plot itself
        overlay = null,     // canvas for interactive stuff on top of plot
        eventHolder = null, // jQuery object that events should be bound to
        ctx = null, octx = null,
        xaxes = [], yaxes = [],
        plotOffset = { left: 0, right: 0, top: 0, bottom: 0},
        plotWidth = 0, plotHeight = 0,
        hooks = {
            processOptions: [],
            processRawData: [],
            processDatapoints: [],
            processOffset: [],
            drawBackground: [],
            drawSeries: [],
            draw: [],
            bindEvents: [],
            drawOverlay: [],
            shutdown: []
        },
        plot = this;

        // public functions
        plot.setData = setData;
        plot.setupGrid = setupGrid;
        plot.draw = draw;
        plot.getPlaceholder = function() { return placeholder; };
        plot.getCanvas = function() { return surface.element; };
        plot.getPlotOffset = function() { return plotOffset; };
        plot.width = function () { return plotWidth; };
        plot.height = function () { return plotHeight; };
        plot.offset = function () {
            var o = eventHolder.offset();
            o.left += plotOffset.left;
            o.top += plotOffset.top;
            return o;
        };
        plot.getData = function () { return series; };
        plot.getAxes = function () {
            var res = {}, i;
            $.each(xaxes.concat(yaxes), function (_, axis) {
                if (axis)
                    res[axis.direction + (axis.n != 1 ? axis.n : "") + "axis"] = axis;
            });
            return res;
        };
        plot.getXAxes = function () { return xaxes; };
        plot.getYAxes = function () { return yaxes; };
        plot.c2p = canvasToAxisCoords;
        plot.p2c = axisToCanvasCoords;
        plot.getOptions = function () { return options; };
        plot.highlight = highlight;
        plot.unhighlight = unhighlight;
        plot.triggerRedrawOverlay = triggerRedrawOverlay;
        plot.pointOffset = function(point) {
            return {
                left: parseInt(xaxes[axisNumber(point, "x") - 1].p2c(+point.x) + plotOffset.left, 10),
                top: parseInt(yaxes[axisNumber(point, "y") - 1].p2c(+point.y) + plotOffset.top, 10)
            };
        };
        plot.shutdown = shutdown;
        plot.resize = function () {
        	var width = placeholder.width(),
        		height = placeholder.height();
            surface.resize(width, height);
            overlay.resize(width, height);
        };

        // public attributes
        plot.hooks = hooks;

        // initialize
        initPlugins(plot);
        parseOptions(options_);
        setupCanvases();
        setData(data_);
        setupGrid();
        draw();
        bindEvents();


        function executeHooks(hook, args) {
            args = [plot].concat(args);
            for (var i = 0; i < hook.length; ++i)
                hook[i].apply(this, args);
        }

        function initPlugins() {

            // References to key classes, allowing plugins to modify them

            var classes = {
                Canvas: Canvas
            };

            for (var i = 0; i < plugins.length; ++i) {
                var p = plugins[i];
                p.init(plot, classes);
                if (p.options)
                    $.extend(true, options, p.options);
            }
        }

        function parseOptions(opts) {

            $.extend(true, options, opts);

            // $.extend merges arrays, rather than replacing them.  When less
            // colors are provided than the size of the default palette, we
            // end up with those colors plus the remaining defaults, which is
            // not expected behavior; avoid it by replacing them here.

            if (opts && opts.colors) {
            	options.colors = opts.colors;
            }

            if (options.xaxis.color == null)
                options.xaxis.color = $.color.parse(options.grid.color).scale('a', 0.22).toString();
            if (options.yaxis.color == null)
                options.yaxis.color = $.color.parse(options.grid.color).scale('a', 0.22).toString();

            if (options.xaxis.tickColor == null) // grid.tickColor for back-compatibility
                options.xaxis.tickColor = options.grid.tickColor || options.xaxis.color;
            if (options.yaxis.tickColor == null) // grid.tickColor for back-compatibility
                options.yaxis.tickColor = options.grid.tickColor || options.yaxis.color;

            if (options.grid.borderColor == null)
                options.grid.borderColor = options.grid.color;
            if (options.grid.tickColor == null)
                options.grid.tickColor = $.color.parse(options.grid.color).scale('a', 0.22).toString();

            // Fill in defaults for axis options, including any unspecified
            // font-spec fields, if a font-spec was provided.

            // If no x/y axis options were provided, create one of each anyway,
            // since the rest of the code assumes that they exist.

            var i, axisOptions, axisCount,
                fontDefaults = {
                    style: placeholder.css("font-style"),
                    size: Math.round(0.8 * (+placeholder.css("font-size").replace("px", "") || 13)),
                    variant: placeholder.css("font-variant"),
                    weight: placeholder.css("font-weight"),
                    family: placeholder.css("font-family")
                };

            fontDefaults.lineHeight = fontDefaults.size * 1.15;

            axisCount = options.xaxes.length || 1;
            for (i = 0; i < axisCount; ++i) {

                axisOptions = options.xaxes[i];
                if (axisOptions && !axisOptions.tickColor) {
                    axisOptions.tickColor = axisOptions.color;
                }

                axisOptions = $.extend(true, {}, options.xaxis, axisOptions);
                options.xaxes[i] = axisOptions;

                if (axisOptions.font) {
                    axisOptions.font = $.extend({}, fontDefaults, axisOptions.font);
                    if (!axisOptions.font.color) {
                        axisOptions.font.color = axisOptions.color;
                    }
                }
            }

            axisCount = options.yaxes.length || 1;
            for (i = 0; i < axisCount; ++i) {

                axisOptions = options.yaxes[i];
                if (axisOptions && !axisOptions.tickColor) {
                    axisOptions.tickColor = axisOptions.color;
                }

                axisOptions = $.extend(true, {}, options.yaxis, axisOptions);
                options.yaxes[i] = axisOptions;

                if (axisOptions.font) {
                    axisOptions.font = $.extend({}, fontDefaults, axisOptions.font);
                    if (!axisOptions.font.color) {
                        axisOptions.font.color = axisOptions.color;
                    }
                }
            }

            // backwards compatibility, to be removed in future
            if (options.xaxis.noTicks && options.xaxis.ticks == null)
                options.xaxis.ticks = options.xaxis.noTicks;
            if (options.yaxis.noTicks && options.yaxis.ticks == null)
                options.yaxis.ticks = options.yaxis.noTicks;
            if (options.x2axis) {
                options.xaxes[1] = $.extend(true, {}, options.xaxis, options.x2axis);
                options.xaxes[1].position = "top";
            }
            if (options.y2axis) {
                options.yaxes[1] = $.extend(true, {}, options.yaxis, options.y2axis);
                options.yaxes[1].position = "right";
            }
            if (options.grid.coloredAreas)
                options.grid.markings = options.grid.coloredAreas;
            if (options.grid.coloredAreasColor)
                options.grid.markingsColor = options.grid.coloredAreasColor;
            if (options.lines)
                $.extend(true, options.series.lines, options.lines);
            if (options.points)
                $.extend(true, options.series.points, options.points);
            if (options.bars)
                $.extend(true, options.series.bars, options.bars);
            if (options.shadowSize != null)
                options.series.shadowSize = options.shadowSize;
            if (options.highlightColor != null)
                options.series.highlightColor = options.highlightColor;

            // save options on axes for future reference
            for (i = 0; i < options.xaxes.length; ++i)
                getOrCreateAxis(xaxes, i + 1).options = options.xaxes[i];
            for (i = 0; i < options.yaxes.length; ++i)
                getOrCreateAxis(yaxes, i + 1).options = options.yaxes[i];

            // add hooks from options
            for (var n in hooks)
                if (options.hooks[n] && options.hooks[n].length)
                    hooks[n] = hooks[n].concat(options.hooks[n]);

            executeHooks(hooks.processOptions, [options]);
        }

        function setData(d) {
            series = parseData(d);
            fillInSeriesOptions();
            processData();
        }

        function parseData(d) {
            var res = [];
            for (var i = 0; i < d.length; ++i) {
                var s = $.extend(true, {}, options.series);

                if (d[i].data != null) {
                    s.data = d[i].data; // move the data instead of deep-copy
                    delete d[i].data;

                    $.extend(true, s, d[i]);

                    d[i].data = s.data;
                }
                else
                    s.data = d[i];
                res.push(s);
            }

            return res;
        }

        function axisNumber(obj, coord) {
            var a = obj[coord + "axis"];
            if (typeof a == "object") // if we got a real axis, extract number
                a = a.n;
            if (typeof a != "number")
                a = 1; // default to first axis
            return a;
        }

        function allAxes() {
            // return flat array without annoying null entries
            return $.grep(xaxes.concat(yaxes), function (a) { return a; });
        }

        function canvasToAxisCoords(pos) {
            // return an object with x/y corresponding to all used axes
            var res = {}, i, axis;
            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used)
                    res["x" + axis.n] = axis.c2p(pos.left);
            }

            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used)
                    res["y" + axis.n] = axis.c2p(pos.top);
            }

            if (res.x1 !== undefined)
                res.x = res.x1;
            if (res.y1 !== undefined)
                res.y = res.y1;

            return res;
        }

        function axisToCanvasCoords(pos) {
            // get canvas coords from the first pair of x/y found in pos
            var res = {}, i, axis, key;

            for (i = 0; i < xaxes.length; ++i) {
                axis = xaxes[i];
                if (axis && axis.used) {
                    key = "x" + axis.n;
                    if (pos[key] == null && axis.n == 1)
                        key = "x";

                    if (pos[key] != null) {
                        res.left = axis.p2c(pos[key]);
                        break;
                    }
                }
            }

            for (i = 0; i < yaxes.length; ++i) {
                axis = yaxes[i];
                if (axis && axis.used) {
                    key = "y" + axis.n;
                    if (pos[key] == null && axis.n == 1)
                        key = "y";

                    if (pos[key] != null) {
                        res.top = axis.p2c(pos[key]);
                        break;
                    }
                }
            }

            return res;
        }

        function getOrCreateAxis(axes, number) {
            if (!axes[number - 1])
                axes[number - 1] = {
                    n: number, // save the number for future reference
                    direction: axes == xaxes ? "x" : "y",
                    options: $.extend(true, {}, axes == xaxes ? options.xaxis : options.yaxis)
                };

            return axes[number - 1];
        }

        function fillInSeriesOptions() {

            var neededColors = series.length, maxIndex = -1, i;

            // Subtract the number of series that already have fixed colors or
            // color indexes from the number that we still need to generate.

            for (i = 0; i < series.length; ++i) {
                var sc = series[i].color;
                if (sc != null) {
                    neededColors--;
                    if (typeof sc == "number" && sc > maxIndex) {
                        maxIndex = sc;
                    }
                }
            }

            // If any of the series have fixed color indexes, then we need to
            // generate at least as many colors as the highest index.

            if (neededColors <= maxIndex) {
                neededColors = maxIndex + 1;
            }

            // Generate all the colors, using first the option colors and then
            // variations on those colors once they're exhausted.

            var c, colors = [], colorPool = options.colors,
                colorPoolSize = colorPool.length, variation = 0;

            for (i = 0; i < neededColors; i++) {

                c = $.color.parse(colorPool[i % colorPoolSize] || "#666");

                // Each time we exhaust the colors in the pool we adjust
                // a scaling factor used to produce more variations on
                // those colors. The factor alternates negative/positive
                // to produce lighter/darker colors.

                // Reset the variation after every few cycles, or else
                // it will end up producing only white or black colors.

                if (i % colorPoolSize == 0 && i) {
                    if (variation >= 0) {
                        if (variation < 0.5) {
                            variation = -variation - 0.2;
                        } else variation = 0;
                    } else variation = -variation;
                }

                colors[i] = c.scale('rgb', 1 + variation);
            }

            // Finalize the series options, filling in their colors

            var colori = 0, s;
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                // assign colors
                if (s.color == null) {
                    s.color = colors[colori].toString();
                    ++colori;
                }
                else if (typeof s.color == "number")
                    s.color = colors[s.color].toString();

                // turn on lines automatically in case nothing is set
                if (s.lines.show == null) {
                    var v, show = true;
                    for (v in s)
                        if (s[v] && s[v].show) {
                            show = false;
                            break;
                        }
                    if (show)
                        s.lines.show = true;
                }

                // If nothing was provided for lines.zero, default it to match
                // lines.fill, since areas by default should extend to zero.

                if (s.lines.zero == null) {
                    s.lines.zero = !!s.lines.fill;
                }

                // setup axes
                s.xaxis = getOrCreateAxis(xaxes, axisNumber(s, "x"));
                s.yaxis = getOrCreateAxis(yaxes, axisNumber(s, "y"));
            }
        }

        function processData() {
            var topSentry = Number.POSITIVE_INFINITY,
                bottomSentry = Number.NEGATIVE_INFINITY,
                fakeInfinity = Number.MAX_VALUE,
                i, j, k, m, length,
                s, points, ps, x, y, axis, val, f, p,
                data, format;

            function updateAxis(axis, min, max) {
                if (min < axis.datamin && min != -fakeInfinity)
                    axis.datamin = min;
                if (max > axis.datamax && max != fakeInfinity)
                    axis.datamax = max;
            }

            $.each(allAxes(), function (_, axis) {
                // init axis
                axis.datamin = topSentry;
                axis.datamax = bottomSentry;
                axis.used = false;
            });

            for (i = 0; i < series.length; ++i) {
                s = series[i];
                s.datapoints = { points: [] };

                executeHooks(hooks.processRawData, [ s, s.data, s.datapoints ]);
            }

            // first pass: clean and copy data
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                data = s.data;
                format = s.datapoints.format;

                if (!format) {
                    format = [];
                    // find out how to copy
                    format.push({ x: true, number: true, required: true });
                    format.push({ y: true, number: true, required: true });

                    if (s.bars.show || (s.lines.show && s.lines.fill)) {
                        var autoscale = !!((s.bars.show && s.bars.zero) || (s.lines.show && s.lines.zero));
                        format.push({ y: true, number: true, required: false, defaultValue: 0, autoscale: autoscale });
                        if (s.bars.horizontal) {
                            delete format[format.length - 1].y;
                            format[format.length - 1].x = true;
                        }
                    }

                    s.datapoints.format = format;
                }

                if (s.datapoints.pointsize != null)
                    continue; // already filled in

                s.datapoints.pointsize = format.length;

                ps = s.datapoints.pointsize;
                points = s.datapoints.points;

                var insertSteps = s.lines.show && s.lines.steps;
                s.xaxis.used = s.yaxis.used = true;

                for (j = k = 0; j < data.length; ++j, k += ps) {
                    p = data[j];

                    var nullify = p == null;
                    if (!nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = p[m];
                            f = format[m];

                            if (f) {
                                if (f.number && val != null) {
                                    val = +val; // convert to number
                                    if (isNaN(val))
                                        val = null;
                                    else if (val == Infinity)
                                        val = fakeInfinity;
                                    else if (val == -Infinity)
                                        val = -fakeInfinity;
                                }

                                if (val == null) {
                                    if (f.required)
                                        nullify = true;

                                    if (f.defaultValue != null)
                                        val = f.defaultValue;
                                }
                            }

                            points[k + m] = val;
                        }
                    }

                    if (nullify) {
                        for (m = 0; m < ps; ++m) {
                            val = points[k + m];
                            if (val != null) {
                                f = format[m];
                                // extract min/max info
                                if (f.autoscale) {
                                    if (f.x) {
                                        updateAxis(s.xaxis, val, val);
                                    }
                                    if (f.y) {
                                        updateAxis(s.yaxis, val, val);
                                    }
                                }
                            }
                            points[k + m] = null;
                        }
                    }
                    else {
                        // a little bit of line specific stuff that
                        // perhaps shouldn't be here, but lacking
                        // better means...
                        if (insertSteps && k > 0
                            && points[k - ps] != null
                            && points[k - ps] != points[k]
                            && points[k - ps + 1] != points[k + 1]) {
                            // copy the point to make room for a middle point
                            for (m = 0; m < ps; ++m)
                                points[k + ps + m] = points[k + m];

                            // middle point has same y
                            points[k + 1] = points[k - ps + 1];

                            // we've added a point, better reflect that
                            k += ps;
                        }
                    }
                }
            }

            // give the hooks a chance to run
            for (i = 0; i < series.length; ++i) {
                s = series[i];

                executeHooks(hooks.processDatapoints, [ s, s.datapoints]);
            }

            // second pass: find datamax/datamin for auto-scaling
            for (i = 0; i < series.length; ++i) {
                s = series[i];
                points = s.datapoints.points;
                ps = s.datapoints.pointsize;
                format = s.datapoints.format;

                var xmin = topSentry, ymin = topSentry,
                    xmax = bottomSentry, ymax = bottomSentry;

                for (j = 0; j < points.length; j += ps) {
                    if (points[j] == null)
                        continue;

                    for (m = 0; m < ps; ++m) {
                        val = points[j + m];
                        f = format[m];
                        if (!f || f.autoscale === false || val == fakeInfinity || val == -fakeInfinity)
                            continue;

                        if (f.x) {
                            if (val < xmin)
                                xmin = val;
                            if (val > xmax)
                                xmax = val;
                        }
                        if (f.y) {
                            if (val < ymin)
                                ymin = val;
                            if (val > ymax)
                                ymax = val;
                        }
                    }
                }

                if (s.bars.show) {
                    // make sure we got room for the bar on the dancing floor
                    var delta;

                    switch (s.bars.align) {
                        case "left":
                            delta = 0;
                            break;
                        case "right":
                            delta = -s.bars.barWidth;
                            break;
                        case "center":
                            delta = -s.bars.barWidth / 2;
                            break;
                        default:
                            throw new Error("Invalid bar alignment: " + s.bars.align);
                    }

                    if (s.bars.horizontal) {
                        ymin += delta;
                        ymax += delta + s.bars.barWidth;
                    }
                    else {
                        xmin += delta;
                        xmax += delta + s.bars.barWidth;
                    }
                }

                updateAxis(s.xaxis, xmin, xmax);
                updateAxis(s.yaxis, ymin, ymax);
            }

            $.each(allAxes(), function (_, axis) {
                if (axis.datamin == topSentry)
                    axis.datamin = null;
                if (axis.datamax == bottomSentry)
                    axis.datamax = null;
            });
        }

        function setupCanvases() {

            // Make sure the placeholder is clear of everything except canvases
            // from a previous plot in this container that we'll try to re-use.

            placeholder.css("padding", 0) // padding messes up the positioning
                .children(":not(.flot-base,.flot-overlay)").remove();

            if (placeholder.css("position") == 'static')
                placeholder.css("position", "relative"); // for positioning labels and overlay

            surface = new Canvas("flot-base", placeholder);
            overlay = new Canvas("flot-overlay", placeholder); // overlay canvas for interactive features

            ctx = surface.context;
            octx = overlay.context;

            // define which element we're listening for events on
            eventHolder = $(overlay.element).unbind();

            // If we're re-using a plot object, shut down the old one

            var existing = placeholder.data("plot");

            if (existing) {
                existing.shutdown();
                overlay.clear();
            }

            // save in case we get replotted
            placeholder.data("plot", plot);
        }

        function bindEvents() {
            // bind events
            if (options.grid.hoverable) {
                eventHolder.mousemove(onMouseMove);

                // Use bind, rather than .mouseleave, because we officially
                // still support jQuery 1.2.6, which doesn't define a shortcut
                // for mouseenter or mouseleave.  This was a bug/oversight that
                // was fixed somewhere around 1.3.x.  We can return to using
                // .mouseleave when we drop support for 1.2.6.

                eventHolder.bind("mouseleave", onMouseLeave);
            }

            if (options.grid.clickable)
                eventHolder.click(onClick);

            executeHooks(hooks.bindEvents, [eventHolder]);
        }

        function shutdown() {
            if (redrawTimeout)
                clearTimeout(redrawTimeout);

            eventHolder.unbind("mousemove", onMouseMove);
            eventHolder.unbind("mouseleave", onMouseLeave);
            eventHolder.unbind("click", onClick);

            executeHooks(hooks.shutdown, [eventHolder]);
        }

        function setTransformationHelpers(axis) {
            // set helper functions on the axis, assumes plot area
            // has been computed already

            function identity(x) { return x; }

            var s, m, t = axis.options.transform || identity,
                it = axis.options.inverseTransform;

            // precompute how much the axis is scaling a point
            // in canvas space
            if (axis.direction == "x") {
                s = axis.scale = plotWidth / Math.abs(t(axis.max) - t(axis.min));
                m = Math.min(t(axis.max), t(axis.min));
            }
            else {
                s = axis.scale = plotHeight / Math.abs(t(axis.max) - t(axis.min));
                s = -s;
                m = Math.max(t(axis.max), t(axis.min));
            }

            // data point to canvas coordinate
            if (t == identity) // slight optimization
                axis.p2c = function (p) { return (p - m) * s; };
            else
                axis.p2c = function (p) { return (t(p) - m) * s; };
            // canvas coordinate to data point
            if (!it)
                axis.c2p = function (c) { return m + c / s; };
            else
                axis.c2p = function (c) { return it(m + c / s); };
        }

        function measureTickLabels(axis) {

            var opts = axis.options,
                ticks = axis.ticks || [],
                labelWidth = opts.labelWidth || 0,
                labelHeight = opts.labelHeight || 0,
                maxWidth = labelWidth || axis.direction == "x" ? Math.floor(surface.width / (ticks.length || 1)) : null,
                legacyStyles = axis.direction + "Axis " + axis.direction + axis.n + "Axis",
                layer = "flot-" + axis.direction + "-axis flot-" + axis.direction + axis.n + "-axis " + legacyStyles,
                font = opts.font || "flot-tick-label tickLabel";

            for (var i = 0; i < ticks.length; ++i) {

                var t = ticks[i];

                if (!t.label)
                    continue;

                var info = surface.getTextInfo(layer, t.label, font, null, maxWidth);

                labelWidth = Math.max(labelWidth, info.width);
                labelHeight = Math.max(labelHeight, info.height);
            }

            axis.labelWidth = opts.labelWidth || labelWidth;
            axis.labelHeight = opts.labelHeight || labelHeight;
        }

        function allocateAxisBoxFirstPhase(axis) {
            // find the bounding box of the axis by looking at label
            // widths/heights and ticks, make room by diminishing the
            // plotOffset; this first phase only looks at one
            // dimension per axis, the other dimension depends on the
            // other axes so will have to wait

            var lw = axis.labelWidth,
                lh = axis.labelHeight,
                pos = axis.options.position,
                tickLength = axis.options.tickLength,
                axisMargin = options.grid.axisMargin,
                padding = options.grid.labelMargin,
                all = axis.direction == "x" ? xaxes : yaxes,
                index, innermost;

            // determine axis margin
            var samePosition = $.grep(all, function (a) {
                return a && a.options.position == pos && a.reserveSpace;
            });
            if ($.inArray(axis, samePosition) == samePosition.length - 1)
                axisMargin = 0; // outermost

            // Determine whether the axis is the first (innermost) on its side

            innermost = $.inArray(axis, samePosition) == 0;

            // determine tick length - if we're innermost, we can use "full"

            if (tickLength == null) {
                if (innermost)
                    tickLength = "full";
                else
                    tickLength = 5;
            }

            if (!isNaN(+tickLength))
                padding += +tickLength;

            // compute box
            if (axis.direction == "x") {
                lh += padding;

                if (pos == "bottom") {
                    plotOffset.bottom += lh + axisMargin;
                    axis.box = { top: surface.height - plotOffset.bottom, height: lh };
                }
                else {
                    axis.box = { top: plotOffset.top + axisMargin, height: lh };
                    plotOffset.top += lh + axisMargin;
                }
            }
            else {
                lw += padding;

                if (pos == "left") {
                    axis.box = { left: plotOffset.left + axisMargin, width: lw };
                    plotOffset.left += lw + axisMargin;
                }
                else {
                    plotOffset.right += lw + axisMargin;
                    axis.box = { left: surface.width - plotOffset.right, width: lw };
                }
            }

             // save for future reference
            axis.position = pos;
            axis.tickLength = tickLength;
            axis.box.padding = padding;
            axis.innermost = innermost;
        }

        function allocateAxisBoxSecondPhase(axis) {
            // now that all axis boxes have been placed in one
            // dimension, we can set the remaining dimension coordinates
            if (axis.direction == "x") {
                axis.box.left = plotOffset.left - axis.labelWidth / 2;
                axis.box.width = surface.width - plotOffset.left - plotOffset.right + axis.labelWidth;
            }
            else {
                axis.box.top = plotOffset.top - axis.labelHeight / 2;
                axis.box.height = surface.height - plotOffset.bottom - plotOffset.top + axis.labelHeight;
            }
        }

        function adjustLayoutForThingsStickingOut() {
            // possibly adjust plot offset to ensure everything stays
            // inside the canvas and isn't clipped off

            var minMargin = options.grid.minBorderMargin,
                margins = { x: 0, y: 0 }, i, axis;

            // check stuff from the plot (FIXME: this should just read
            // a value from the series, otherwise it's impossible to
            // customize)
            if (minMargin == null) {
                minMargin = 0;
                for (i = 0; i < series.length; ++i)
                    minMargin = Math.max(minMargin, 2 * (series[i].points.radius + series[i].points.lineWidth/2));
            }

            margins.x = margins.y = Math.ceil(minMargin);

            // check axis labels, note we don't check the actual
            // labels but instead use the overall width/height to not
            // jump as much around with replots
            $.each(allAxes(), function (_, axis) {
                var dir = axis.direction;
                if (axis.reserveSpace)
                    margins[dir] = Math.ceil(Math.max(margins[dir], (dir == "x" ? axis.labelWidth : axis.labelHeight) / 2));
            });

            plotOffset.left = Math.max(margins.x, plotOffset.left);
            plotOffset.right = Math.max(margins.x, plotOffset.right);
            plotOffset.top = Math.max(margins.y, plotOffset.top);
            plotOffset.bottom = Math.max(margins.y, plotOffset.bottom);
        }

        function setupGrid() {
            var i, axes = allAxes(), showGrid = options.grid.show;

            // Initialize the plot's offset from the edge of the canvas

            for (var a in plotOffset) {
                var margin = options.grid.margin || 0;
                plotOffset[a] = typeof margin == "number" ? margin : margin[a] || 0;
            }

            executeHooks(hooks.processOffset, [plotOffset]);

            // If the grid is visible, add its border width to the offset

            for (var a in plotOffset) {
                if(typeof(options.grid.borderWidth) == "object") {
                    plotOffset[a] += showGrid ? options.grid.borderWidth[a] : 0;
                }
                else {
                    plotOffset[a] += showGrid ? options.grid.borderWidth : 0;
                }
            }

            // init axes
            $.each(axes, function (_, axis) {
                axis.show = axis.options.show;
                if (axis.show == null)
                    axis.show = axis.used; // by default an axis is visible if it's got data

                axis.reserveSpace = axis.show || axis.options.reserveSpace;

                setRange(axis);
            });

            if (showGrid) {

                var allocatedAxes = $.grep(axes, function (axis) { return axis.reserveSpace; });

                $.each(allocatedAxes, function (_, axis) {
                    // make the ticks
                    setupTickGeneration(axis);
                    setTicks(axis);
                    snapRangeToTicks(axis, axis.ticks);
                    // find labelWidth/Height for axis
                    measureTickLabels(axis);
                });

                // with all dimensions calculated, we can compute the
                // axis bounding boxes, start from the outside
                // (reverse order)
                for (i = allocatedAxes.length - 1; i >= 0; --i)
                    allocateAxisBoxFirstPhase(allocatedAxes[i]);

                // make sure we've got enough space for things that
                // might stick out
                adjustLayoutForThingsStickingOut();

                $.each(allocatedAxes, function (_, axis) {
                    allocateAxisBoxSecondPhase(axis);
                });
            }

            plotWidth = surface.width - plotOffset.left - plotOffset.right;
            plotHeight = surface.height - plotOffset.bottom - plotOffset.top;

            // now we got the proper plot dimensions, we can compute the scaling
            $.each(axes, function (_, axis) {
                setTransformationHelpers(axis);
            });

            if (showGrid) {
                drawAxisLabels();
            }

            insertLegend();
        }

        function setRange(axis) {
            var opts = axis.options,
                min = +(opts.min != null ? opts.min : axis.datamin),
                max = +(opts.max != null ? opts.max : axis.datamax),
                delta = max - min;

            if (delta == 0.0) {
                // degenerate case
                var widen = max == 0 ? 1 : 0.01;

                if (opts.min == null)
                    min -= widen;
                // always widen max if we couldn't widen min to ensure we
                // don't fall into min == max which doesn't work
                if (opts.max == null || opts.min != null)
                    max += widen;
            }
            else {
                // consider autoscaling
                var margin = opts.autoscaleMargin;
                if (margin != null) {
                    if (opts.min == null) {
                        min -= delta * margin;
                        // make sure we don't go below zero if all values
                        // are positive
                        if (min < 0 && axis.datamin != null && axis.datamin >= 0)
                            min = 0;
                    }
                    if (opts.max == null) {
                        max += delta * margin;
                        if (max > 0 && axis.datamax != null && axis.datamax <= 0)
                            max = 0;
                    }
                }
            }
            axis.min = min;
            axis.max = max;
        }

        function setupTickGeneration(axis) {
            var opts = axis.options;

            // estimate number of ticks
            var noTicks;
            if (typeof opts.ticks == "number" && opts.ticks > 0)
                noTicks = opts.ticks;
            else
                // heuristic based on the model a*sqrt(x) fitted to
                // some data points that seemed reasonable
                noTicks = 0.3 * Math.sqrt(axis.direction == "x" ? surface.width : surface.height);

            var delta = (axis.max - axis.min) / noTicks,
                dec = -Math.floor(Math.log(delta) / Math.LN10),
                maxDec = opts.tickDecimals;

            if (maxDec != null && dec > maxDec) {
                dec = maxDec;
            }

            var magn = Math.pow(10, -dec),
                norm = delta / magn, // norm is between 1.0 and 10.0
                size;

            if (norm < 1.5) {
                size = 1;
            } else if (norm < 3) {
                size = 2;
                // special case for 2.5, requires an extra decimal
                if (norm > 2.25 && (maxDec == null || dec + 1 <= maxDec)) {
                    size = 2.5;
                    ++dec;
                }
            } else if (norm < 7.5) {
                size = 5;
            } else {
                size = 10;
            }

            size *= magn;

            if (opts.minTickSize != null && size < opts.minTickSize) {
                size = opts.minTickSize;
            }

            axis.delta = delta;
            axis.tickDecimals = Math.max(0, maxDec != null ? maxDec : dec);
            axis.tickSize = opts.tickSize || size;

            // Time mode was moved to a plug-in in 0.8, but since so many people use this
            // we'll add an especially friendly make sure they remembered to include it.

            if (opts.mode == "time" && !axis.tickGenerator) {
                throw new Error("Time mode requires the flot.time plugin.");
            }

            // Flot supports base-10 axes; any other mode else is handled by a plug-in,
            // like flot.time.js.

            if (!axis.tickGenerator) {

                axis.tickGenerator = function (axis) {

                    var ticks = [],
                        start = floorInBase(axis.min, axis.tickSize),
                        i = 0,
                        v = Number.NaN,
                        prev;

                    do {
                        prev = v;
                        v = start + i * axis.tickSize;
                        ticks.push(v);
                        ++i;
                    } while (v < axis.max && v != prev);
                    return ticks;
                };

				axis.tickFormatter = function (value, axis) {

					var factor = axis.tickDecimals ? Math.pow(10, axis.tickDecimals) : 1;
					var formatted = "" + Math.round(value * factor) / factor;

					// If tickDecimals was specified, ensure that we have exactly that
					// much precision; otherwise default to the value's own precision.

					if (axis.tickDecimals != null) {
						var decimal = formatted.indexOf(".");
						var precision = decimal == -1 ? 0 : formatted.length - decimal - 1;
						if (precision < axis.tickDecimals) {
							return (precision ? formatted : formatted + ".") + ("" + factor).substr(1, axis.tickDecimals - precision);
						}
					}

                    return formatted;
                };
            }

            if ($.isFunction(opts.tickFormatter))
                axis.tickFormatter = function (v, axis) { return "" + opts.tickFormatter(v, axis); };

            if (opts.alignTicksWithAxis != null) {
                var otherAxis = (axis.direction == "x" ? xaxes : yaxes)[opts.alignTicksWithAxis - 1];
                if (otherAxis && otherAxis.used && otherAxis != axis) {
                    // consider snapping min/max to outermost nice ticks
                    var niceTicks = axis.tickGenerator(axis);
                    if (niceTicks.length > 0) {
                        if (opts.min == null)
                            axis.min = Math.min(axis.min, niceTicks[0]);
                        if (opts.max == null && niceTicks.length > 1)
                            axis.max = Math.max(axis.max, niceTicks[niceTicks.length - 1]);
                    }

                    axis.tickGenerator = function (axis) {
                        // copy ticks, scaled to this axis
                        var ticks = [], v, i;
                        for (i = 0; i < otherAxis.ticks.length; ++i) {
                            v = (otherAxis.ticks[i].v - otherAxis.min) / (otherAxis.max - otherAxis.min);
                            v = axis.min + v * (axis.max - axis.min);
                            ticks.push(v);
                        }
                        return ticks;
                    };

                    // we might need an extra decimal since forced
                    // ticks don't necessarily fit naturally
                    if (!axis.mode && opts.tickDecimals == null) {
                        var extraDec = Math.max(0, -Math.floor(Math.log(axis.delta) / Math.LN10) + 1),
                            ts = axis.tickGenerator(axis);

                        // only proceed if the tick interval rounded
                        // with an extra decimal doesn't give us a
                        // zero at end
                        if (!(ts.length > 1 && /\..*0$/.test((ts[1] - ts[0]).toFixed(extraDec))))
                            axis.tickDecimals = extraDec;
                    }
                }
            }
        }

        function setTicks(axis) {
            var oticks = axis.options.ticks, ticks = [];
            if (oticks == null || (typeof oticks == "number" && oticks > 0))
                ticks = axis.tickGenerator(axis);
            else if (oticks) {
                if ($.isFunction(oticks))
                    // generate the ticks
                    ticks = oticks(axis);
                else
                    ticks = oticks;
            }

            // clean up/labelify the supplied ticks, copy them over
            var i, v;
            axis.ticks = [];
            for (i = 0; i < ticks.length; ++i) {
                var label = null;
                var t = ticks[i];
                if (typeof t == "object") {
                    v = +t[0];
                    if (t.length > 1)
                        label = t[1];
                }
                else
                    v = +t;
                if (label == null)
                    label = axis.tickFormatter(v, axis);
                if (!isNaN(v))
                    axis.ticks.push({ v: v, label: label });
            }
        }

        function snapRangeToTicks(axis, ticks) {
            if (axis.options.autoscaleMargin && ticks.length > 0) {
                // snap to ticks
                if (axis.options.min == null)
                    axis.min = Math.min(axis.min, ticks[0].v);
                if (axis.options.max == null && ticks.length > 1)
                    axis.max = Math.max(axis.max, ticks[ticks.length - 1].v);
            }
        }

        function draw() {

            surface.clear();

            executeHooks(hooks.drawBackground, [ctx]);

            var grid = options.grid;

            // draw background, if any
            if (grid.show && grid.backgroundColor)
                drawBackground();

            if (grid.show && !grid.aboveData) {
                drawGrid();
            }

            for (var i = 0; i < series.length; ++i) {
                executeHooks(hooks.drawSeries, [ctx, series[i]]);
                drawSeries(series[i]);
            }

            executeHooks(hooks.draw, [ctx]);

            if (grid.show && grid.aboveData) {
                drawGrid();
            }

            surface.render();

            // A draw implies that either the axes or data have changed, so we
            // should probably update the overlay highlights as well.

            triggerRedrawOverlay();
        }

        function extractRange(ranges, coord) {
            var axis, from, to, key, axes = allAxes();

            for (var i = 0; i < axes.length; ++i) {
                axis = axes[i];
                if (axis.direction == coord) {
                    key = coord + axis.n + "axis";
                    if (!ranges[key] && axis.n == 1)
                        key = coord + "axis"; // support x1axis as xaxis
                    if (ranges[key]) {
                        from = ranges[key].from;
                        to = ranges[key].to;
                        break;
                    }
                }
            }

            // backwards-compat stuff - to be removed in future
            if (!ranges[key]) {
                axis = coord == "x" ? xaxes[0] : yaxes[0];
                from = ranges[coord + "1"];
                to = ranges[coord + "2"];
            }

            // auto-reverse as an added bonus
            if (from != null && to != null && from > to) {
                var tmp = from;
                from = to;
                to = tmp;
            }

            return { from: from, to: to, axis: axis };
        }

        function drawBackground() {
            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            ctx.fillStyle = getColorOrGradient(options.grid.backgroundColor, plotHeight, 0, "rgba(255, 255, 255, 0)");
            ctx.fillRect(0, 0, plotWidth, plotHeight);
            ctx.restore();
        }

        function drawGrid() {
            var i, axes, bw, bc;

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            // draw markings
            var markings = options.grid.markings;
            if (markings) {
                if ($.isFunction(markings)) {
                    axes = plot.getAxes();
                    // xmin etc. is backwards compatibility, to be
                    // removed in the future
                    axes.xmin = axes.xaxis.min;
                    axes.xmax = axes.xaxis.max;
                    axes.ymin = axes.yaxis.min;
                    axes.ymax = axes.yaxis.max;

                    markings = markings(axes);
                }

                for (i = 0; i < markings.length; ++i) {
                    var m = markings[i],
                        xrange = extractRange(m, "x"),
                        yrange = extractRange(m, "y");

                    // fill in missing
                    if (xrange.from == null)
                        xrange.from = xrange.axis.min;
                    if (xrange.to == null)
                        xrange.to = xrange.axis.max;
                    if (yrange.from == null)
                        yrange.from = yrange.axis.min;
                    if (yrange.to == null)
                        yrange.to = yrange.axis.max;

                    // clip
                    if (xrange.to < xrange.axis.min || xrange.from > xrange.axis.max ||
                        yrange.to < yrange.axis.min || yrange.from > yrange.axis.max)
                        continue;

                    xrange.from = Math.max(xrange.from, xrange.axis.min);
                    xrange.to = Math.min(xrange.to, xrange.axis.max);
                    yrange.from = Math.max(yrange.from, yrange.axis.min);
                    yrange.to = Math.min(yrange.to, yrange.axis.max);

                    if (xrange.from == xrange.to && yrange.from == yrange.to)
                        continue;

                    // then draw
                    xrange.from = xrange.axis.p2c(xrange.from);
                    xrange.to = xrange.axis.p2c(xrange.to);
                    yrange.from = yrange.axis.p2c(yrange.from);
                    yrange.to = yrange.axis.p2c(yrange.to);

                    if (xrange.from == xrange.to || yrange.from == yrange.to) {
                        // draw line
                        ctx.beginPath();
                        ctx.strokeStyle = m.color || options.grid.markingsColor;
                        ctx.lineWidth = m.lineWidth || options.grid.markingsLineWidth;
                        ctx.moveTo(xrange.from, yrange.from);
                        ctx.lineTo(xrange.to, yrange.to);
                        ctx.stroke();
                    }
                    else {
                        // fill area
                        ctx.fillStyle = m.color || options.grid.markingsColor;
                        ctx.fillRect(xrange.from, yrange.to,
                                     xrange.to - xrange.from,
                                     yrange.from - yrange.to);
                    }
                }
            }

            // draw the ticks
            axes = allAxes();
            bw = options.grid.borderWidth;

            for (var j = 0; j < axes.length; ++j) {
                var axis = axes[j], box = axis.box,
                    t = axis.tickLength, x, y, xoff, yoff;
                if (!axis.show || axis.ticks.length == 0)
                    continue;

                ctx.lineWidth = 1;

                // find the edges
                if (axis.direction == "x") {
                    x = 0;
                    if (t == "full")
                        y = (axis.position == "top" ? 0 : plotHeight);
                    else
                        y = box.top - plotOffset.top + (axis.position == "top" ? box.height : 0);
                }
                else {
                    y = 0;
                    if (t == "full")
                        x = (axis.position == "left" ? 0 : plotWidth);
                    else
                        x = box.left - plotOffset.left + (axis.position == "left" ? box.width : 0);
                }

                // draw tick bar
                if (!axis.innermost) {
                    ctx.strokeStyle = axis.options.color;
                    ctx.beginPath();
                    xoff = yoff = 0;
                    if (axis.direction == "x")
                        xoff = plotWidth + 1;
                    else
                        yoff = plotHeight + 1;

                    if (ctx.lineWidth == 1) {
                        if (axis.direction == "x") {
                            y = Math.floor(y) + 0.5;
                        } else {
                            x = Math.floor(x) + 0.5;
                        }
                    }

                    ctx.moveTo(x, y);
                    ctx.lineTo(x + xoff, y + yoff);
                    ctx.stroke();
                }

                // draw ticks

                ctx.strokeStyle = axis.options.tickColor;

                ctx.beginPath();
                for (i = 0; i < axis.ticks.length; ++i) {
                    var v = axis.ticks[i].v;

                    xoff = yoff = 0;

                    if (isNaN(v) || v < axis.min || v > axis.max
                        // skip those lying on the axes if we got a border
                        || (t == "full"
                            && ((typeof bw == "object" && bw[axis.position] > 0) || bw > 0)
                            && (v == axis.min || v == axis.max)))
                        continue;

                    if (axis.direction == "x") {
                        x = axis.p2c(v);
                        yoff = t == "full" ? -plotHeight : t;

                        if (axis.position == "top")
                            yoff = -yoff;
                    }
                    else {
                        y = axis.p2c(v);
                        xoff = t == "full" ? -plotWidth : t;

                        if (axis.position == "left")
                            xoff = -xoff;
                    }

                    if (ctx.lineWidth == 1) {
                        if (axis.direction == "x")
                            x = Math.floor(x) + 0.5;
                        else
                            y = Math.floor(y) + 0.5;
                    }

                    ctx.moveTo(x, y);
                    ctx.lineTo(x + xoff, y + yoff);
                }

                ctx.stroke();
            }


            // draw border
            if (bw) {
                // If either borderWidth or borderColor is an object, then draw the border
                // line by line instead of as one rectangle
                bc = options.grid.borderColor;
                if(typeof bw == "object" || typeof bc == "object") {
                    if (typeof bw !== "object") {
                        bw = {top: bw, right: bw, bottom: bw, left: bw};
                    }
                    if (typeof bc !== "object") {
                        bc = {top: bc, right: bc, bottom: bc, left: bc};
                    }

                    if (bw.top > 0) {
                        ctx.strokeStyle = bc.top;
                        ctx.lineWidth = bw.top;
                        ctx.beginPath();
                        ctx.moveTo(0 - bw.left, 0 - bw.top/2);
                        ctx.lineTo(plotWidth, 0 - bw.top/2);
                        ctx.stroke();
                    }

                    if (bw.right > 0) {
                        ctx.strokeStyle = bc.right;
                        ctx.lineWidth = bw.right;
                        ctx.beginPath();
                        ctx.moveTo(plotWidth + bw.right / 2, 0 - bw.top);
                        ctx.lineTo(plotWidth + bw.right / 2, plotHeight);
                        ctx.stroke();
                    }

                    if (bw.bottom > 0) {
                        ctx.strokeStyle = bc.bottom;
                        ctx.lineWidth = bw.bottom;
                        ctx.beginPath();
                        ctx.moveTo(plotWidth + bw.right, plotHeight + bw.bottom / 2);
                        ctx.lineTo(0, plotHeight + bw.bottom / 2);
                        ctx.stroke();
                    }

                    if (bw.left > 0) {
                        ctx.strokeStyle = bc.left;
                        ctx.lineWidth = bw.left;
                        ctx.beginPath();
                        ctx.moveTo(0 - bw.left/2, plotHeight + bw.bottom);
                        ctx.lineTo(0- bw.left/2, 0);
                        ctx.stroke();
                    }
                }
                else {
                    ctx.lineWidth = bw;
                    ctx.strokeStyle = options.grid.borderColor;
                    ctx.strokeRect(-bw/2, -bw/2, plotWidth + bw, plotHeight + bw);
                }
            }

            ctx.restore();
        }

        function drawAxisLabels() {

            $.each(allAxes(), function (_, axis) {
                if (!axis.show || axis.ticks.length == 0)
                    return;

                var box = axis.box,
                    legacyStyles = axis.direction + "Axis " + axis.direction + axis.n + "Axis",
                    layer = "flot-" + axis.direction + "-axis flot-" + axis.direction + axis.n + "-axis " + legacyStyles,
                    font = axis.options.font || "flot-tick-label tickLabel",
                    tick, x, y, halign, valign;

                surface.removeText(layer);

                for (var i = 0; i < axis.ticks.length; ++i) {

                    tick = axis.ticks[i];
                    if (!tick.label || tick.v < axis.min || tick.v > axis.max)
                        continue;

                    if (axis.direction == "x") {
                        halign = "center";
                        x = plotOffset.left + axis.p2c(tick.v);
                        if (axis.position == "bottom") {
                            y = box.top + box.padding;
                        } else {
                            y = box.top + box.height - box.padding;
                            valign = "bottom";
                        }
                    } else {
                        valign = "middle";
                        y = plotOffset.top + axis.p2c(tick.v);
                        if (axis.position == "left") {
                            x = box.left + box.width - box.padding;
                            halign = "right";
                        } else {
                            x = box.left + box.padding;
                        }
                    }

                    surface.addText(layer, x, y, tick.label, font, null, null, halign, valign);
                }
            });
        }

        function drawSeries(series) {
            if (series.lines.show)
                drawSeriesLines(series);
            if (series.bars.show)
                drawSeriesBars(series);
            if (series.points.show)
                drawSeriesPoints(series);
        }

        function drawSeriesLines(series) {
            function plotLine(datapoints, xoffset, yoffset, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    prevx = null, prevy = null;

                ctx.beginPath();
                for (var i = ps; i < points.length; i += ps) {
                    var x1 = points[i - ps], y1 = points[i - ps + 1],
                        x2 = points[i], y2 = points[i + 1];

                    if (x1 == null || x2 == null)
                        continue;

                    // clip with ymin
                    if (y1 <= y2 && y1 < axisy.min) {
                        if (y2 < axisy.min)
                            continue;   // line segment is outside
                        // compute new intersection point
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    }
                    else if (y2 <= y1 && y2 < axisy.min) {
                        if (y1 < axisy.min)
                            continue;
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }

                    // clip with ymax
                    if (y1 >= y2 && y1 > axisy.max) {
                        if (y2 > axisy.max)
                            continue;
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    }
                    else if (y2 >= y1 && y2 > axisy.max) {
                        if (y1 > axisy.max)
                            continue;
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }

                    // clip with xmin
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    }
                    else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }

                    // clip with xmax
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    }
                    else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }

                    if (x1 != prevx || y1 != prevy)
                        ctx.moveTo(axisx.p2c(x1) + xoffset, axisy.p2c(y1) + yoffset);

                    prevx = x2;
                    prevy = y2;
                    ctx.lineTo(axisx.p2c(x2) + xoffset, axisy.p2c(y2) + yoffset);
                }
                ctx.stroke();
            }

            function plotLineArea(datapoints, axisx, axisy) {
                var points = datapoints.points,
                    ps = datapoints.pointsize,
                    bottom = Math.min(Math.max(0, axisy.min), axisy.max),
                    i = 0, top, areaOpen = false,
                    ypos = 1, segmentStart = 0, segmentEnd = 0;

                // we process each segment in two turns, first forward
                // direction to sketch out top, then once we hit the
                // end we go backwards to sketch the bottom
                while (true) {
                    if (ps > 0 && i > points.length + ps)
                        break;

                    i += ps; // ps is negative if going backwards

                    var x1 = points[i - ps],
                        y1 = points[i - ps + ypos],
                        x2 = points[i], y2 = points[i + ypos];

                    if (areaOpen) {
                        if (ps > 0 && x1 != null && x2 == null) {
                            // at turning point
                            segmentEnd = i;
                            ps = -ps;
                            ypos = 2;
                            continue;
                        }

                        if (ps < 0 && i == segmentStart + ps) {
                            // done with the reverse sweep
                            ctx.fill();
                            areaOpen = false;
                            ps = -ps;
                            ypos = 1;
                            i = segmentStart = segmentEnd + ps;
                            continue;
                        }
                    }

                    if (x1 == null || x2 == null)
                        continue;

                    // clip x values

                    // clip with xmin
                    if (x1 <= x2 && x1 < axisx.min) {
                        if (x2 < axisx.min)
                            continue;
                        y1 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.min;
                    }
                    else if (x2 <= x1 && x2 < axisx.min) {
                        if (x1 < axisx.min)
                            continue;
                        y2 = (axisx.min - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.min;
                    }

                    // clip with xmax
                    if (x1 >= x2 && x1 > axisx.max) {
                        if (x2 > axisx.max)
                            continue;
                        y1 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x1 = axisx.max;
                    }
                    else if (x2 >= x1 && x2 > axisx.max) {
                        if (x1 > axisx.max)
                            continue;
                        y2 = (axisx.max - x1) / (x2 - x1) * (y2 - y1) + y1;
                        x2 = axisx.max;
                    }

                    if (!areaOpen) {
                        // open area
                        ctx.beginPath();
                        ctx.moveTo(axisx.p2c(x1), axisy.p2c(bottom));
                        areaOpen = true;
                    }

                    // now first check the case where both is outside
                    if (y1 >= axisy.max && y2 >= axisy.max) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.max));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.max));
                        continue;
                    }
                    else if (y1 <= axisy.min && y2 <= axisy.min) {
                        ctx.lineTo(axisx.p2c(x1), axisy.p2c(axisy.min));
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(axisy.min));
                        continue;
                    }

                    // else it's a bit more complicated, there might
                    // be a flat maxed out rectangle first, then a
                    // triangular cutout or reverse; to find these
                    // keep track of the current x values
                    var x1old = x1, x2old = x2;

                    // clip the y values, without shortcutting, we
                    // go through all cases in turn

                    // clip with ymin
                    if (y1 <= y2 && y1 < axisy.min && y2 >= axisy.min) {
                        x1 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.min;
                    }
                    else if (y2 <= y1 && y2 < axisy.min && y1 >= axisy.min) {
                        x2 = (axisy.min - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.min;
                    }

                    // clip with ymax
                    if (y1 >= y2 && y1 > axisy.max && y2 <= axisy.max) {
                        x1 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y1 = axisy.max;
                    }
                    else if (y2 >= y1 && y2 > axisy.max && y1 <= axisy.max) {
                        x2 = (axisy.max - y1) / (y2 - y1) * (x2 - x1) + x1;
                        y2 = axisy.max;
                    }

                    // if the x value was changed we got a rectangle
                    // to fill
                    if (x1 != x1old) {
                        ctx.lineTo(axisx.p2c(x1old), axisy.p2c(y1));
                        // it goes to (x1, y1), but we fill that below
                    }

                    // fill triangular section, this sometimes result
                    // in redundant points if (x1, y1) hasn't changed
                    // from previous line to, but we just ignore that
                    ctx.lineTo(axisx.p2c(x1), axisy.p2c(y1));
                    ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));

                    // fill the other rectangle if it's there
                    if (x2 != x2old) {
                        ctx.lineTo(axisx.p2c(x2), axisy.p2c(y2));
                        ctx.lineTo(axisx.p2c(x2old), axisy.p2c(y2));
                    }
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);
            ctx.lineJoin = "round";

            var lw = series.lines.lineWidth,
                sw = series.shadowSize;
            // FIXME: consider another form of shadow when filling is turned on
            if (lw > 0 && sw > 0) {
                // draw shadow as a thick and thin line with transparency
                ctx.lineWidth = sw;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                // position shadow at angle from the mid of line
                var angle = Math.PI/18;
                plotLine(series.datapoints, Math.sin(angle) * (lw/2 + sw/2), Math.cos(angle) * (lw/2 + sw/2), series.xaxis, series.yaxis);
                ctx.lineWidth = sw/2;
                plotLine(series.datapoints, Math.sin(angle) * (lw/2 + sw/4), Math.cos(angle) * (lw/2 + sw/4), series.xaxis, series.yaxis);
            }

            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            var fillStyle = getFillStyle(series.lines, series.color, 0, plotHeight);
            if (fillStyle) {
                ctx.fillStyle = fillStyle;
                plotLineArea(series.datapoints, series.xaxis, series.yaxis);
            }

            if (lw > 0)
                plotLine(series.datapoints, 0, 0, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function drawSeriesPoints(series) {
            function plotPoints(datapoints, radius, fillStyle, offset, shadow, axisx, axisy, symbol) {
                var points = datapoints.points, ps = datapoints.pointsize;

                for (var i = 0; i < points.length; i += ps) {
                    var x = points[i], y = points[i + 1];
                    if (x == null || x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                        continue;

                    ctx.beginPath();
                    x = axisx.p2c(x);
                    y = axisy.p2c(y) + offset;
                    if (symbol == "circle")
                        ctx.arc(x, y, radius, 0, shadow ? Math.PI : Math.PI * 2, false);
                    else
                        symbol(ctx, x, y, radius, shadow);
                    ctx.closePath();

                    if (fillStyle) {
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    ctx.stroke();
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            var lw = series.points.lineWidth,
                sw = series.shadowSize,
                radius = series.points.radius,
                symbol = series.points.symbol;

            // If the user sets the line width to 0, we change it to a very 
            // small value. A line width of 0 seems to force the default of 1.
            // Doing the conditional here allows the shadow setting to still be 
            // optional even with a lineWidth of 0.

            if( lw == 0 )
                lw = 0.0001;

            if (lw > 0 && sw > 0) {
                // draw shadow in two steps
                var w = sw / 2;
                ctx.lineWidth = w;
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                plotPoints(series.datapoints, radius, null, w + w/2, true,
                           series.xaxis, series.yaxis, symbol);

                ctx.strokeStyle = "rgba(0,0,0,0.2)";
                plotPoints(series.datapoints, radius, null, w/2, true,
                           series.xaxis, series.yaxis, symbol);
            }

            ctx.lineWidth = lw;
            ctx.strokeStyle = series.color;
            plotPoints(series.datapoints, radius,
                       getFillStyle(series.points, series.color), 0, false,
                       series.xaxis, series.yaxis, symbol);
            ctx.restore();
        }

        function drawBar(x, y, b, barLeft, barRight, offset, fillStyleCallback, axisx, axisy, c, horizontal, lineWidth) {
            var left, right, bottom, top,
                drawLeft, drawRight, drawTop, drawBottom,
                tmp;

            // in horizontal mode, we start the bar from the left
            // instead of from the bottom so it appears to be
            // horizontal rather than vertical
            if (horizontal) {
                drawBottom = drawRight = drawTop = true;
                drawLeft = false;
                left = b;
                right = x;
                top = y + barLeft;
                bottom = y + barRight;

                // account for negative bars
                if (right < left) {
                    tmp = right;
                    right = left;
                    left = tmp;
                    drawLeft = true;
                    drawRight = false;
                }
            }
            else {
                drawLeft = drawRight = drawTop = true;
                drawBottom = false;
                left = x + barLeft;
                right = x + barRight;
                bottom = b;
                top = y;

                // account for negative bars
                if (top < bottom) {
                    tmp = top;
                    top = bottom;
                    bottom = tmp;
                    drawBottom = true;
                    drawTop = false;
                }
            }

            // clip
            if (right < axisx.min || left > axisx.max ||
                top < axisy.min || bottom > axisy.max)
                return;

            if (left < axisx.min) {
                left = axisx.min;
                drawLeft = false;
            }

            if (right > axisx.max) {
                right = axisx.max;
                drawRight = false;
            }

            if (bottom < axisy.min) {
                bottom = axisy.min;
                drawBottom = false;
            }

            if (top > axisy.max) {
                top = axisy.max;
                drawTop = false;
            }

            left = axisx.p2c(left);
            bottom = axisy.p2c(bottom);
            right = axisx.p2c(right);
            top = axisy.p2c(top);

            // fill the bar
            if (fillStyleCallback) {
                c.beginPath();
                c.moveTo(left, bottom);
                c.lineTo(left, top);
                c.lineTo(right, top);
                c.lineTo(right, bottom);
                c.fillStyle = fillStyleCallback(bottom, top);
                c.fill();
            }

            // draw outline
            if (lineWidth > 0 && (drawLeft || drawRight || drawTop || drawBottom)) {
                c.beginPath();

                // FIXME: inline moveTo is buggy with excanvas
                c.moveTo(left, bottom + offset);
                if (drawLeft)
                    c.lineTo(left, top + offset);
                else
                    c.moveTo(left, top + offset);
                if (drawTop)
                    c.lineTo(right, top + offset);
                else
                    c.moveTo(right, top + offset);
                if (drawRight)
                    c.lineTo(right, bottom + offset);
                else
                    c.moveTo(right, bottom + offset);
                if (drawBottom)
                    c.lineTo(left, bottom + offset);
                else
                    c.moveTo(left, bottom + offset);
                c.stroke();
            }
        }

        function drawSeriesBars(series) {
            function plotBars(datapoints, barLeft, barRight, offset, fillStyleCallback, axisx, axisy) {
                var points = datapoints.points, ps = datapoints.pointsize;

                for (var i = 0; i < points.length; i += ps) {
                    if (points[i] == null)
                        continue;
                    drawBar(points[i], points[i + 1], points[i + 2], barLeft, barRight, offset, fillStyleCallback, axisx, axisy, ctx, series.bars.horizontal, series.bars.lineWidth);
                }
            }

            ctx.save();
            ctx.translate(plotOffset.left, plotOffset.top);

            // FIXME: figure out a way to add shadows (for instance along the right edge)
            ctx.lineWidth = series.bars.lineWidth;
            ctx.strokeStyle = series.color;

            var barLeft;

            switch (series.bars.align) {
                case "left":
                    barLeft = 0;
                    break;
                case "right":
                    barLeft = -series.bars.barWidth;
                    break;
                case "center":
                    barLeft = -series.bars.barWidth / 2;
                    break;
                default:
                    throw new Error("Invalid bar alignment: " + series.bars.align);
            }

            var fillStyleCallback = series.bars.fill ? function (bottom, top) { return getFillStyle(series.bars, series.color, bottom, top); } : null;
            plotBars(series.datapoints, barLeft, barLeft + series.bars.barWidth, 0, fillStyleCallback, series.xaxis, series.yaxis);
            ctx.restore();
        }

        function getFillStyle(filloptions, seriesColor, bottom, top) {
            var fill = filloptions.fill;
            if (!fill)
                return null;

            if (filloptions.fillColor)
                return getColorOrGradient(filloptions.fillColor, bottom, top, seriesColor);

            var c = $.color.parse(seriesColor);
            c.a = typeof fill == "number" ? fill : 0.4;
            c.normalize();
            return c.toString();
        }

        function insertLegend() {

            placeholder.find(".legend").remove();

            if (!options.legend.show)
                return;

            var fragments = [], entries = [], rowStarted = false,
                lf = options.legend.labelFormatter, s, label;

            // Build a list of legend entries, with each having a label and a color

            for (var i = 0; i < series.length; ++i) {
                s = series[i];
                if (s.label) {
                    label = lf ? lf(s.label, s) : s.label;
                    if (label) {
                        entries.push({
                            label: label,
                            color: s.color
                        });
                    }
                }
            }

            // Sort the legend using either the default or a custom comparator

            if (options.legend.sorted) {
                if ($.isFunction(options.legend.sorted)) {
                    entries.sort(options.legend.sorted);
                } else if (options.legend.sorted == "reverse") {
                	entries.reverse();
                } else {
                    var ascending = options.legend.sorted != "descending";
                    entries.sort(function(a, b) {
                        return a.label == b.label ? 0 : (
                            (a.label < b.label) != ascending ? 1 : -1   // Logical XOR
                        );
                    });
                }
            }

            // Generate markup for the list of entries, in their final order

            for (var i = 0; i < entries.length; ++i) {

                var entry = entries[i];

                if (i % options.legend.noColumns == 0) {
                    if (rowStarted)
                        fragments.push('</tr>');
                    fragments.push('<tr>');
                    rowStarted = true;
                }

                fragments.push(
                    '<td class="legendColorBox"><div style="border:1px solid ' + options.legend.labelBoxBorderColor + ';padding:1px"><div style="width:4px;height:0;border:5px solid ' + entry.color + ';overflow:hidden"></div></div></td>' +
                    '<td class="legendLabel">' + entry.label + '</td>'
                );
            }

            if (rowStarted)
                fragments.push('</tr>');

            if (fragments.length == 0)
                return;

            var table = '<table style="font-size:smaller;color:' + options.grid.color + '">' + fragments.join("") + '</table>';
            if (options.legend.container != null)
                $(options.legend.container).html(table);
            else {
                var pos = "",
                    p = options.legend.position,
                    m = options.legend.margin;
                if (m[0] == null)
                    m = [m, m];
                if (p.charAt(0) == "n")
                    pos += 'top:' + (m[1] + plotOffset.top) + 'px;';
                else if (p.charAt(0) == "s")
                    pos += 'bottom:' + (m[1] + plotOffset.bottom) + 'px;';
                if (p.charAt(1) == "e")
                    pos += 'right:' + (m[0] + plotOffset.right) + 'px;';
                else if (p.charAt(1) == "w")
                    pos += 'left:' + (m[0] + plotOffset.left) + 'px;';
                var legend = $('<div class="legend">' + table.replace('style="', 'style="position:absolute;' + pos +';') + '</div>').appendTo(placeholder);
                if (options.legend.backgroundOpacity != 0.0) {
                    // put in the transparent background
                    // separately to avoid blended labels and
                    // label boxes
                    var c = options.legend.backgroundColor;
                    if (c == null) {
                        c = options.grid.backgroundColor;
                        if (c && typeof c == "string")
                            c = $.color.parse(c);
                        else
                            c = $.color.extract(legend, 'background-color');
                        c.a = 1;
                        c = c.toString();
                    }
                    var div = legend.children();
                    $('<div style="position:absolute;width:' + div.width() + 'px;height:' + div.height() + 'px;' + pos +'background-color:' + c + ';"> </div>').prependTo(legend).css('opacity', options.legend.backgroundOpacity);
                }
            }
        }


        // interactive features

        var highlights = [],
            redrawTimeout = null;

        // returns the data item the mouse is over, or null if none is found
        function findNearbyItem(mouseX, mouseY, seriesFilter) {
            var maxDistance = options.grid.mouseActiveRadius,
                smallestDistance = maxDistance * maxDistance + 1,
                item = null, foundPoint = false, i, j, ps;

            for (i = series.length - 1; i >= 0; --i) {
                if (!seriesFilter(series[i]))
                    continue;

                var s = series[i],
                    axisx = s.xaxis,
                    axisy = s.yaxis,
                    points = s.datapoints.points,
                    mx = axisx.c2p(mouseX), // precompute some stuff to make the loop faster
                    my = axisy.c2p(mouseY),
                    maxx = maxDistance / axisx.scale,
                    maxy = maxDistance / axisy.scale;

                ps = s.datapoints.pointsize;
                // with inverse transforms, we can't use the maxx/maxy
                // optimization, sadly
                if (axisx.options.inverseTransform)
                    maxx = Number.MAX_VALUE;
                if (axisy.options.inverseTransform)
                    maxy = Number.MAX_VALUE;

                if (s.lines.show || s.points.show) {
                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j], y = points[j + 1];
                        if (x == null)
                            continue;

                        // For points and lines, the cursor must be within a
                        // certain distance to the data point
                        if (x - mx > maxx || x - mx < -maxx ||
                            y - my > maxy || y - my < -maxy)
                            continue;

                        // We have to calculate distances in pixels, not in
                        // data units, because the scales of the axes may be different
                        var dx = Math.abs(axisx.p2c(x) - mouseX),
                            dy = Math.abs(axisy.p2c(y) - mouseY),
                            dist = dx * dx + dy * dy; // we save the sqrt

                        // use <= to ensure last point takes precedence
                        // (last generally means on top of)
                        if (dist < smallestDistance) {
                            smallestDistance = dist;
                            item = [i, j / ps];
                        }
                    }
                }

                if (s.bars.show && !item) { // no other point can be nearby
                    var barLeft = s.bars.align == "left" ? 0 : -s.bars.barWidth/2,
                        barRight = barLeft + s.bars.barWidth;

                    for (j = 0; j < points.length; j += ps) {
                        var x = points[j], y = points[j + 1], b = points[j + 2];
                        if (x == null)
                            continue;

                        // for a bar graph, the cursor must be inside the bar
                        if (series[i].bars.horizontal ?
                            (mx <= Math.max(b, x) && mx >= Math.min(b, x) &&
                             my >= y + barLeft && my <= y + barRight) :
                            (mx >= x + barLeft && mx <= x + barRight &&
                             my >= Math.min(b, y) && my <= Math.max(b, y)))
                                item = [i, j / ps];
                    }
                }
            }

            if (item) {
                i = item[0];
                j = item[1];
                ps = series[i].datapoints.pointsize;

                return { datapoint: series[i].datapoints.points.slice(j * ps, (j + 1) * ps),
                         dataIndex: j,
                         series: series[i],
                         seriesIndex: i };
            }

            return null;
        }

        function onMouseMove(e) {
            if (options.grid.hoverable)
                triggerClickHoverEvent("plothover", e,
                                       function (s) { return s["hoverable"] != false; });
        }

        function onMouseLeave(e) {
            if (options.grid.hoverable)
                triggerClickHoverEvent("plothover", e,
                                       function (s) { return false; });
        }

        function onClick(e) {
            triggerClickHoverEvent("plotclick", e,
                                   function (s) { return s["clickable"] != false; });
        }

        // trigger click or hover event (they send the same parameters
        // so we share their code)
        function triggerClickHoverEvent(eventname, event, seriesFilter) {
            var offset = eventHolder.offset(),
                canvasX = event.pageX - offset.left - plotOffset.left,
                canvasY = event.pageY - offset.top - plotOffset.top,
            pos = canvasToAxisCoords({ left: canvasX, top: canvasY });

            pos.pageX = event.pageX;
            pos.pageY = event.pageY;

            var item = findNearbyItem(canvasX, canvasY, seriesFilter);

            if (item) {
                // fill in mouse pos for any listeners out there
                item.pageX = parseInt(item.series.xaxis.p2c(item.datapoint[0]) + offset.left + plotOffset.left, 10);
                item.pageY = parseInt(item.series.yaxis.p2c(item.datapoint[1]) + offset.top + plotOffset.top, 10);
            }

            if (options.grid.autoHighlight) {
                // clear auto-highlights
                for (var i = 0; i < highlights.length; ++i) {
                    var h = highlights[i];
                    if (h.auto == eventname &&
                        !(item && h.series == item.series &&
                          h.point[0] == item.datapoint[0] &&
                          h.point[1] == item.datapoint[1]))
                        unhighlight(h.series, h.point);
                }

                if (item)
                    highlight(item.series, item.datapoint, eventname);
            }

            placeholder.trigger(eventname, [ pos, item ]);
        }

        function triggerRedrawOverlay() {
            var t = options.interaction.redrawOverlayInterval;
            if (t == -1) {      // skip event queue
                drawOverlay();
                return;
            }

            if (!redrawTimeout)
                redrawTimeout = setTimeout(drawOverlay, t);
        }

        function drawOverlay() {
            redrawTimeout = null;

            // draw highlights
            octx.save();
            overlay.clear();
            octx.translate(plotOffset.left, plotOffset.top);

            var i, hi;
            for (i = 0; i < highlights.length; ++i) {
                hi = highlights[i];

                if (hi.series.bars.show)
                    drawBarHighlight(hi.series, hi.point);
                else
                    drawPointHighlight(hi.series, hi.point);
            }
            octx.restore();

            executeHooks(hooks.drawOverlay, [octx]);
        }

        function highlight(s, point, auto) {
            if (typeof s == "number")
                s = series[s];

            if (typeof point == "number") {
                var ps = s.datapoints.pointsize;
                point = s.datapoints.points.slice(ps * point, ps * (point + 1));
            }

            var i = indexOfHighlight(s, point);
            if (i == -1) {
                highlights.push({ series: s, point: point, auto: auto });

                triggerRedrawOverlay();
            }
            else if (!auto)
                highlights[i].auto = false;
        }

        function unhighlight(s, point) {
            if (s == null && point == null) {
                highlights = [];
                triggerRedrawOverlay();
                return;
            }

            if (typeof s == "number")
                s = series[s];

            if (typeof point == "number") {
                var ps = s.datapoints.pointsize;
                point = s.datapoints.points.slice(ps * point, ps * (point + 1));
            }

            var i = indexOfHighlight(s, point);
            if (i != -1) {
                highlights.splice(i, 1);

                triggerRedrawOverlay();
            }
        }

        function indexOfHighlight(s, p) {
            for (var i = 0; i < highlights.length; ++i) {
                var h = highlights[i];
                if (h.series == s && h.point[0] == p[0]
                    && h.point[1] == p[1])
                    return i;
            }
            return -1;
        }

        function drawPointHighlight(series, point) {
            var x = point[0], y = point[1],
                axisx = series.xaxis, axisy = series.yaxis,
                highlightColor = (typeof series.highlightColor === "string") ? series.highlightColor : $.color.parse(series.color).scale('a', 0.5).toString();

            if (x < axisx.min || x > axisx.max || y < axisy.min || y > axisy.max)
                return;

            var pointRadius = series.points.radius + series.points.lineWidth / 2;
            octx.lineWidth = pointRadius;
            octx.strokeStyle = highlightColor;
            var radius = 1.5 * pointRadius;
            x = axisx.p2c(x);
            y = axisy.p2c(y);

            octx.beginPath();
            if (series.points.symbol == "circle")
                octx.arc(x, y, radius, 0, 2 * Math.PI, false);
            else
                series.points.symbol(octx, x, y, radius, false);
            octx.closePath();
            octx.stroke();
        }

        function drawBarHighlight(series, point) {
            var highlightColor = (typeof series.highlightColor === "string") ? series.highlightColor : $.color.parse(series.color).scale('a', 0.5).toString(),
                fillStyle = highlightColor,
                barLeft = series.bars.align == "left" ? 0 : -series.bars.barWidth/2;

            octx.lineWidth = series.bars.lineWidth;
            octx.strokeStyle = highlightColor;

            drawBar(point[0], point[1], point[2] || 0, barLeft, barLeft + series.bars.barWidth,
                    0, function () { return fillStyle; }, series.xaxis, series.yaxis, octx, series.bars.horizontal, series.bars.lineWidth);
        }

        function getColorOrGradient(spec, bottom, top, defaultColor) {
            if (typeof spec == "string")
                return spec;
            else {
                // assume this is a gradient spec; IE currently only
                // supports a simple vertical gradient properly, so that's
                // what we support too
                var gradient = ctx.createLinearGradient(0, top, 0, bottom);

                for (var i = 0, l = spec.colors.length; i < l; ++i) {
                    var c = spec.colors[i];
                    if (typeof c != "string") {
                        var co = $.color.parse(defaultColor);
                        if (c.brightness != null)
                            co = co.scale('rgb', c.brightness);
                        if (c.opacity != null)
                            co.a *= c.opacity;
                        c = co.toString();
                    }
                    gradient.addColorStop(i / (l - 1), c);
                }

                return gradient;
            }
        }
    }

    // Add the plot function to the top level of the jQuery object

    $.plot = function(placeholder, data, options) {
        //var t0 = new Date();
        var plot = new Plot($(placeholder), data, options, $.plot.plugins);
        //(window.console ? console.log : alert)("time used (msecs): " + ((new Date()).getTime() - t0.getTime()));
        return plot;
    };

    $.plot.version = "0.8.2-alpha";

    $.plot.plugins = [];

    // Also add the plot function as a chainable property

    $.fn.plot = function(data, options) {
        return this.each(function() {
            $.plot(this, data, options);
        });
    };

    // round to nearby lower multiple of base
    function floorInBase(n, base) {
        return base * Math.floor(n / base);
    }

})(jQuery);

;
/*
 * jquery.flot.tooltip
 * 
 * description: easy-to-use tooltips for Flot charts
 * version: 0.6.1
 * author: Krzysztof Urbas @krzysu [myviews.pl]
 * website: https://github.com/krzysu/flot.tooltip
 * 
 * build on 2013-04-12
 * released under MIT License, 2012
*/ 
(function ($) {

    // plugin options, default values
    var defaultOptions = {
        tooltip: false,
        tooltipOpts: {
            content: "%s | X: %x | Y: %y",
            // allowed templates are:
            // %s -> series label,
            // %x -> X value,
            // %y -> Y value,
            // %x.2 -> precision of X value,
            // %p -> percent
            xDateFormat: null,
            yDateFormat: null,
            shifts: {
                x: 10,
                y: 20
            },
            defaultTheme: true,

            // callbacks
            onHover: function(flotItem, $tooltipEl) {}
        }
    };

    // object
    var FlotTooltip = function(plot) {

        // variables
        this.tipPosition = {x: 0, y: 0};

        this.init(plot);
    };

    // main plugin function
    FlotTooltip.prototype.init = function(plot) {

        var that = this;

        plot.hooks.bindEvents.push(function (plot, eventHolder) {

            // get plot options
            that.plotOptions = plot.getOptions();

            // if not enabled return
            if (that.plotOptions.tooltip === false || typeof that.plotOptions.tooltip === 'undefined') return;

            // shortcut to access tooltip options
            that.tooltipOptions = that.plotOptions.tooltipOpts;

            // create tooltip DOM element
            var $tip = that.getDomElement();

            // bind event
            $( plot.getPlaceholder() ).bind("plothover", function (event, pos, item) {

                if (item) {
                    var tipText;

                    // convert tooltip content template to real tipText
                    tipText = that.stringFormat(that.tooltipOptions.content, item);

                    $tip.html( tipText );
                    that.updateTooltipPosition({ x: pos.pageX, y: pos.pageY });
                    $tip.css({
                            left: that.tipPosition.x + that.tooltipOptions.shifts.x,
                            top: that.tipPosition.y + that.tooltipOptions.shifts.y
                        })
                        .show();

                    // run callback
                    if(typeof that.tooltipOptions.onHover === 'function') {
                        that.tooltipOptions.onHover(item, $tip);
                    }
                }
                else {
                    $tip.hide().html('');
                }
            });

            eventHolder.mousemove( function(e) {
                var pos = {};
                pos.x = e.pageX;
                pos.y = e.pageY;
                that.updateTooltipPosition(pos);
            });
        });
    };

    /**
     * get or create tooltip DOM element
     * @return jQuery object
     */
    FlotTooltip.prototype.getDomElement = function() {
        var $tip;

        if( $('#flotTip').length > 0 ){
            $tip = $('#flotTip');
        }
        else {
            $tip = $('<div />').attr('id', 'flotTip');
            $tip.appendTo('body').hide().css({position: 'absolute'});

            if(this.tooltipOptions.defaultTheme) {
                $tip.css({
                    'background': '#fff',
                    'z-index': '100',
                    'padding': '0.4em 0.6em',
                    'border-radius': '0.5em',
                    'font-size': '0.8em',
                    'border': '1px solid #111',
                    'display': 'inline-block',
                    'white-space': 'nowrap'
                });
            }
        }

        return $tip;
    };

    // as the name says
    FlotTooltip.prototype.updateTooltipPosition = function(pos) {
        var totalTipWidth = $("#flotTip").outerWidth() + this.tooltipOptions.shifts.x;
        var totalTipHeight = $("#flotTip").outerHeight() + this.tooltipOptions.shifts.y;
        if ((pos.x - $(window).scrollLeft()) > ($(window).innerWidth() - totalTipWidth)) {
            pos.x -= totalTipWidth;
        }
        if ((pos.y - $(window).scrollTop()) > ($(window).innerHeight() - totalTipHeight)) {
            pos.y -= totalTipHeight;
        }
        this.tipPosition.x = pos.x;
        this.tipPosition.y = pos.y;
    };

    /**
     * core function, create tooltip content
     * @param  {string} content - template with tooltip content
     * @param  {object} item - Flot item
     * @return {string} real tooltip content for current item
     */
    FlotTooltip.prototype.stringFormat = function(content, item) {

        var percentPattern = /%p\.{0,1}(\d{0,})/;
        var seriesPattern = /%s/;
        var xPattern = /%x\.{0,1}(\d{0,})/;
        var yPattern = /%y\.{0,1}(\d{0,})/;

        // if it is a function callback get the content string
        if( typeof(content) === 'function' ) {
            content = content(item.series.data[item.dataIndex][0], item.series.data[item.dataIndex][1]);
        }

        // percent match for pie charts
        if( typeof (item.series.percent) !== 'undefined' ) {
            content = this.adjustValPrecision(percentPattern, content, item.series.percent);
        }

        // series match
        if( typeof(item.series.label) !== 'undefined' ) {
            content = content.replace(seriesPattern, item.series.label);
        }

        // time mode axes with custom dateFormat
        if(this.isTimeMode('xaxis', item) && this.isXDateFormat(item)) {
            content = content.replace(xPattern, this.timestampToDate(item.series.data[item.dataIndex][0], this.tooltipOptions.xDateFormat));
        }

        if(this.isTimeMode('yaxis', item) && this.isYDateFormat(item)) {
            content = content.replace(yPattern, this.timestampToDate(item.series.data[item.dataIndex][1], this.tooltipOptions.yDateFormat));
        }

        // set precision if defined
        if( typeof item.series.data[item.dataIndex][0] === 'number' ) {
            content = this.adjustValPrecision(xPattern, content, item.series.data[item.dataIndex][0]);
        }
        if( typeof item.series.data[item.dataIndex][1] === 'number' ) {
            content = this.adjustValPrecision(yPattern, content, item.series.data[item.dataIndex][1]);
        }

        // if no value customization, use tickFormatter by default
        if(typeof item.series.xaxis.tickFormatter !== 'undefined') {
            content = content.replace(xPattern, item.series.xaxis.tickFormatter(item.series.data[item.dataIndex][0], item.series.xaxis));
        }
        if(typeof item.series.yaxis.tickFormatter !== 'undefined') {
            content = content.replace(yPattern, item.series.yaxis.tickFormatter(item.series.data[item.dataIndex][1], item.series.yaxis));
        }

        return content;
    };

    // helpers just for readability
    FlotTooltip.prototype.isTimeMode = function(axisName, item) {
        return (typeof item.series[axisName].options.mode !== 'undefined' && item.series[axisName].options.mode === 'time');
    };

    FlotTooltip.prototype.isXDateFormat = function(item) {
        return (typeof this.tooltipOptions.xDateFormat !== 'undefined' && this.tooltipOptions.xDateFormat !== null);
    };

    FlotTooltip.prototype.isYDateFormat = function(item) {
        return (typeof this.tooltipOptions.yDateFormat !== 'undefined' && this.tooltipOptions.yDateFormat !== null);
    };

    //
    FlotTooltip.prototype.timestampToDate = function(tmst, dateFormat) {
        var theDate = new Date(tmst);
        return $.plot.formatDate(theDate, dateFormat);
    };

    //
    FlotTooltip.prototype.adjustValPrecision = function(pattern, content, value) {

        var precision;
        if( content.match(pattern) !== null ) {
            if(RegExp.$1 !== '') {
                precision = RegExp.$1;
                value = value.toFixed(precision);

                // only replace content if precision exists
                content = content.replace(pattern, value);
            }
        }
        return content;
    };

    //
    var init = function(plot) {
      new FlotTooltip(plot);
    };

    // define Flot plugin
    $.plot.plugins.push({
        init: init,
        options: defaultOptions,
        name: 'tooltip',
        version: '0.6.1'
    });

})(jQuery);

;
/* Flot plugin for automatically redrawing plots as the placeholder resizes.

Copyright (c) 2007-2013 IOLA and Ole Laursen.
Licensed under the MIT license.

It works by listening for changes on the placeholder div (through the jQuery
resize event plugin) - if the size changes, it will redraw the plot.

There are no options. If you need to disable the plugin for some plots, you
can just fix the size of their placeholders.

*/

/* Inline dependency:
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

/*
 * The plugin depends on jQuery.Resize plugin https://github.com/cowboy/jquery-resize
 * which causes the memory leaking. The plugin dependency was replaced with the native
 * window.resize event as we don't need the jQuery.Resize functionality anyways.
 * -ab March 1, 2015
 */

// (function($,h,c){var a=$([]),e=$.resize=$.extend($.resize,{}),i,k="setTimeout",j="resize",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);

(function ($) {
    var options = { }; // no options

    function init(plot) {
        function onResize() {
            var placeholder = plot.getPlaceholder();

            // somebody might have hidden us and we can't plot
            // when we don't have the dimensions
            if (placeholder.width() == 0 || placeholder.height() == 0)
                return;

            plot.resize();
            plot.setupGrid();
            plot.draw();
        }
        
        function bindEvents(plot, eventHolder) {
            //plot.getPlaceholder().resize(onResize);

            $(window).bind('resize', onResize)
        }

        function shutdown(plot, eventHolder) {
            //plot.getPlaceholder().unbind("resize", onResize);
            $(window).unbind('resize', onResize)
        }
        
        plot.hooks.bindEvents.push(bindEvents);
        plot.hooks.shutdown.push(shutdown);
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'resize',
        version: '1.0'
    });
})(jQuery);

;
/* Pretty handling of time axes.

Copyright (c) 2007-2013 IOLA and Ole Laursen.
Licensed under the MIT license.

Set axis.mode to "time" to enable. See the section "Time series data" in
API.txt for details.

*/

(function($) {

	var options = {
		xaxis: {
			timezone: null,		// "browser" for local to the client or timezone for timezone-js
			timeformat: null,	// format string to use
			twelveHourClock: false,	// 12 or 24 time in time mode
			monthNames: null	// list of names of months
		}
	};

	// round to nearby lower multiple of base

	function floorInBase(n, base) {
		return base * Math.floor(n / base);
	}

	// Returns a string with the date d formatted according to fmt.
	// A subset of the Open Group's strftime format is supported.

	function formatDate(d, fmt, monthNames, dayNames) {

		if (typeof d.strftime == "function") {
			return d.strftime(fmt);
		}

		var leftPad = function(n, pad) {
			n = "" + n;
			pad = "" + (pad == null ? "0" : pad);
			return n.length == 1 ? pad + n : n;
		};

		var r = [];
		var escape = false;
		var hours = d.getHours();
		var isAM = hours < 12;

		if (monthNames == null) {
			monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		}

		if (dayNames == null) {
			dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		}

		var hours12;

		if (hours > 12) {
			hours12 = hours - 12;
		} else if (hours == 0) {
			hours12 = 12;
		} else {
			hours12 = hours;
		}

		for (var i = 0; i < fmt.length; ++i) {

			var c = fmt.charAt(i);

			if (escape) {
				switch (c) {
					case 'a': c = "" + dayNames[d.getDay()]; break;
					case 'b': c = "" + monthNames[d.getMonth()]; break;
					case 'd': c = leftPad(d.getDate()); break;
					case 'e': c = leftPad(d.getDate(), " "); break;
					case 'h':	// For back-compat with 0.7; remove in 1.0
					case 'H': c = leftPad(hours); break;
					case 'I': c = leftPad(hours12); break;
					case 'l': c = leftPad(hours12, " "); break;
					case 'm': c = leftPad(d.getMonth() + 1); break;
					case 'M': c = leftPad(d.getMinutes()); break;
					// quarters not in Open Group's strftime specification
					case 'q':
						c = "" + (Math.floor(d.getMonth() / 3) + 1); break;
					case 'S': c = leftPad(d.getSeconds()); break;
					case 'y': c = leftPad(d.getFullYear() % 100); break;
					case 'Y': c = "" + d.getFullYear(); break;
					case 'p': c = (isAM) ? ("" + "am") : ("" + "pm"); break;
					case 'P': c = (isAM) ? ("" + "AM") : ("" + "PM"); break;
					case 'w': c = "" + d.getDay(); break;
				}
				r.push(c);
				escape = false;
			} else {
				if (c == "%") {
					escape = true;
				} else {
					r.push(c);
				}
			}
		}

		return r.join("");
	}

	// To have a consistent view of time-based data independent of which time
	// zone the client happens to be in we need a date-like object independent
	// of time zones.  This is done through a wrapper that only calls the UTC
	// versions of the accessor methods.

	function makeUtcWrapper(d) {

		function addProxyMethod(sourceObj, sourceMethod, targetObj, targetMethod) {
			sourceObj[sourceMethod] = function() {
				return targetObj[targetMethod].apply(targetObj, arguments);
			};
		};

		var utc = {
			date: d
		};

		// support strftime, if found

		if (d.strftime != undefined) {
			addProxyMethod(utc, "strftime", d, "strftime");
		}

		addProxyMethod(utc, "getTime", d, "getTime");
		addProxyMethod(utc, "setTime", d, "setTime");

		var props = ["Date", "Day", "FullYear", "Hours", "Milliseconds", "Minutes", "Month", "Seconds"];

		for (var p = 0; p < props.length; p++) {
			addProxyMethod(utc, "get" + props[p], d, "getUTC" + props[p]);
			addProxyMethod(utc, "set" + props[p], d, "setUTC" + props[p]);
		}

		return utc;
	};

	// select time zone strategy.  This returns a date-like object tied to the
	// desired timezone

	function dateGenerator(ts, opts) {
		if (opts.timezone == "browser") {
			return new Date(ts);
		} else if (!opts.timezone || opts.timezone == "utc") {
			return makeUtcWrapper(new Date(ts));
		} else if (typeof timezoneJS != "undefined" && typeof timezoneJS.Date != "undefined") {
			var d = new timezoneJS.Date();
			// timezone-js is fickle, so be sure to set the time zone before
			// setting the time.
			d.setTimezone(opts.timezone);
			d.setTime(ts);
			return d;
		} else {
			return makeUtcWrapper(new Date(ts));
		}
	}
	
	// map of app. size of time units in milliseconds

	var timeUnitSize = {
		"second": 1000,
		"minute": 60 * 1000,
		"hour": 60 * 60 * 1000,
		"day": 24 * 60 * 60 * 1000,
		"month": 30 * 24 * 60 * 60 * 1000,
		"quarter": 3 * 30 * 24 * 60 * 60 * 1000,
		"year": 365.2425 * 24 * 60 * 60 * 1000
	};

	// the allowed tick sizes, after 1 year we use
	// an integer algorithm

	var baseSpec = [
		[1, "second"], [2, "second"], [5, "second"], [10, "second"],
		[30, "second"], 
		[1, "minute"], [2, "minute"], [5, "minute"], [10, "minute"],
		[30, "minute"], 
		[1, "hour"], [2, "hour"], [4, "hour"],
		[8, "hour"], [12, "hour"],
		[1, "day"], [2, "day"], [3, "day"],
		[0.25, "month"], [0.5, "month"], [1, "month"],
		[2, "month"]
	];

	// we don't know which variant(s) we'll need yet, but generating both is
	// cheap

	var specMonths = baseSpec.concat([[3, "month"], [6, "month"],
		[1, "year"]]);
	var specQuarters = baseSpec.concat([[1, "quarter"], [2, "quarter"],
		[1, "year"]]);

	function init(plot) {
		plot.hooks.processOptions.push(function (plot, options) {
			$.each(plot.getAxes(), function(axisName, axis) {

				var opts = axis.options;

				if (opts.mode == "time") {
					axis.tickGenerator = function(axis) {

						var ticks = [];
						var d = dateGenerator(axis.min, opts);
						var minSize = 0;

						// make quarter use a possibility if quarters are
						// mentioned in either of these options

						var spec = (opts.tickSize && opts.tickSize[1] ===
							"quarter") ||
							(opts.minTickSize && opts.minTickSize[1] ===
							"quarter") ? specQuarters : specMonths;

						if (opts.minTickSize != null) {
							if (typeof opts.tickSize == "number") {
								minSize = opts.tickSize;
							} else {
								minSize = opts.minTickSize[0] * timeUnitSize[opts.minTickSize[1]];
							}
						}

						for (var i = 0; i < spec.length - 1; ++i) {
							if (axis.delta < (spec[i][0] * timeUnitSize[spec[i][1]]
											  + spec[i + 1][0] * timeUnitSize[spec[i + 1][1]]) / 2
								&& spec[i][0] * timeUnitSize[spec[i][1]] >= minSize) {
								break;
							}
						}

						var size = spec[i][0];
						var unit = spec[i][1];

						// special-case the possibility of several years

						if (unit == "year") {

							// if given a minTickSize in years, just use it,
							// ensuring that it's an integer

							if (opts.minTickSize != null && opts.minTickSize[1] == "year") {
								size = Math.floor(opts.minTickSize[0]);
							} else {

								var magn = Math.pow(10, Math.floor(Math.log(axis.delta / timeUnitSize.year) / Math.LN10));
								var norm = (axis.delta / timeUnitSize.year) / magn;

								if (norm < 1.5) {
									size = 1;
								} else if (norm < 3) {
									size = 2;
								} else if (norm < 7.5) {
									size = 5;
								} else {
									size = 10;
								}

								size *= magn;
							}

							// minimum size for years is 1

							if (size < 1) {
								size = 1;
							}
						}

						axis.tickSize = opts.tickSize || [size, unit];
						var tickSize = axis.tickSize[0];
						unit = axis.tickSize[1];

						var step = tickSize * timeUnitSize[unit];

						if (unit == "second") {
							d.setSeconds(floorInBase(d.getSeconds(), tickSize));
						} else if (unit == "minute") {
							d.setMinutes(floorInBase(d.getMinutes(), tickSize));
						} else if (unit == "hour") {
							d.setHours(floorInBase(d.getHours(), tickSize));
						} else if (unit == "month") {
							d.setMonth(floorInBase(d.getMonth(), tickSize));
						} else if (unit == "quarter") {
							d.setMonth(3 * floorInBase(d.getMonth() / 3,
								tickSize));
						} else if (unit == "year") {
							d.setFullYear(floorInBase(d.getFullYear(), tickSize));
						}

						// reset smaller components

						d.setMilliseconds(0);

						if (step >= timeUnitSize.minute) {
							d.setSeconds(0);
						}
						if (step >= timeUnitSize.hour) {
							d.setMinutes(0);
						}
						if (step >= timeUnitSize.day) {
							d.setHours(0);
						}
						if (step >= timeUnitSize.day * 4) {
							d.setDate(1);
						}
						if (step >= timeUnitSize.month * 2) {
							d.setMonth(floorInBase(d.getMonth(), 3));
						}
						if (step >= timeUnitSize.quarter * 2) {
							d.setMonth(floorInBase(d.getMonth(), 6));
						}
						if (step >= timeUnitSize.year) {
							d.setMonth(0);
						}

						var carry = 0;
						var v = Number.NaN;
						var prev;

						do {

							prev = v;
							v = d.getTime();
							ticks.push(v);

							if (unit == "month" || unit == "quarter") {
								if (tickSize < 1) {

									// a bit complicated - we'll divide the
									// month/quarter up but we need to take
									// care of fractions so we don't end up in
									// the middle of a day

									d.setDate(1);
									var start = d.getTime();
									d.setMonth(d.getMonth() +
										(unit == "quarter" ? 3 : 1));
									var end = d.getTime();
									d.setTime(v + carry * timeUnitSize.hour + (end - start) * tickSize);
									carry = d.getHours();
									d.setHours(0);
								} else {
									d.setMonth(d.getMonth() +
										tickSize * (unit == "quarter" ? 3 : 1));
								}
							} else if (unit == "year") {
								d.setFullYear(d.getFullYear() + tickSize);
							} else {
								d.setTime(v + step);
							}
						} while (v < axis.max && v != prev);

						return ticks;
					};

					axis.tickFormatter = function (v, axis) {

						var d = dateGenerator(v, axis.options);

						// first check global format

						if (opts.timeformat != null) {
							return formatDate(d, opts.timeformat, opts.monthNames, opts.dayNames);
						}

						// possibly use quarters if quarters are mentioned in
						// any of these places

						var useQuarters = (axis.options.tickSize &&
								axis.options.tickSize[1] == "quarter") ||
							(axis.options.minTickSize &&
								axis.options.minTickSize[1] == "quarter");

						var t = axis.tickSize[0] * timeUnitSize[axis.tickSize[1]];
						var span = axis.max - axis.min;
						var suffix = (opts.twelveHourClock) ? " %p" : "";
						var hourCode = (opts.twelveHourClock) ? "%I" : "%H";
						var fmt;

						if (t < timeUnitSize.minute) {
							fmt = hourCode + ":%M:%S" + suffix;
						} else if (t < timeUnitSize.day) {
							if (span < 2 * timeUnitSize.day) {
								fmt = hourCode + ":%M" + suffix;
							} else {
								fmt = "%b %d " + hourCode + ":%M" + suffix;
							}
						} else if (t < timeUnitSize.month) {
							fmt = "%b %d";
						} else if ((useQuarters && t < timeUnitSize.quarter) ||
							(!useQuarters && t < timeUnitSize.year)) {
							if (span < timeUnitSize.year) {
								fmt = "%b";
							} else {
								fmt = "%b %Y";
							}
						} else if (useQuarters && t < timeUnitSize.year) {
							if (span < timeUnitSize.year) {
								fmt = "Q%q";
							} else {
								fmt = "Q%q %Y";
							}
						} else {
							fmt = "%Y";
						}

						var rt = formatDate(d, fmt, opts.monthNames, opts.dayNames);

						return rt;
					};
				}
			});
		});
	}

	$.plot.plugins.push({
		init: init,
		options: options,
		name: 'time',
		version: '1.0'
	});

	// Time-axis support used to be in Flot core, which exposed the
	// formatDate function on the plot object.  Various plugins depend
	// on the function, so we need to re-expose it here.

	$.plot.formatDate = formatDate;

})(jQuery);

;
/* ===================================================
 *  jquery-sortable.js v0.9.13
 *  http://johnny.github.com/jquery-sortable/
 * ===================================================
 *  Copyright (c) 2012 Jonas von Andrian
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *  * The name of the author may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 *  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * ========================================================== */

!function ( $, window, pluginName, undefined){
  var containerDefaults = {
    // If true, items can be dragged from this container
    drag: true,
    // If true, items can be droped onto this container
    drop: true,
    // Exclude items from being draggable, if the
    // selector matches the item
    exclude: "",
    // If true, search for nested containers within an item.If you nest containers,
    // either the original selector with which you call the plugin must only match the top containers,
    // or you need to specify a group (see the bootstrap nav example)
    nested: true,
    // If true, the items are assumed to be arranged vertically
    vertical: true
  }, // end container defaults
  groupDefaults = {
    // This is executed after the placeholder has been moved.
    // $closestItemOrContainer contains the closest item, the placeholder
    // has been put at or the closest empty Container, the placeholder has
    // been appended to.
    afterMove: function ($placeholder, container, $closestItemOrContainer) {
    },
    // The exact css path between the container and its items, e.g. "> tbody"
    containerPath: "",
    // The css selector of the containers
    containerSelector: "ol, ul",
    // Distance the mouse has to travel to start dragging
    distance: 0,
    // Time in milliseconds after mousedown until dragging should start.
    // This option can be used to prevent unwanted drags when clicking on an element.
    delay: 0,
    // The css selector of the drag handle
    handle: "",
    // The exact css path between the item and its subcontainers.
    // It should only match the immediate items of a container.
    // No item of a subcontainer should be matched. E.g. for ol>div>li the itemPath is "> div"
    itemPath: "",
    // The css selector of the items
    itemSelector: "li",
    // The class given to "body" while an item is being dragged
    bodyClass: "dragging",
    // The class giving to an item while being dragged
    draggedClass: "dragged",
    // Check if the dragged item may be inside the container.
    // Use with care, since the search for a valid container entails a depth first search
    // and may be quite expensive.
    isValidTarget: function ($item, container) {
      return true
    },
    // Executed before onDrop if placeholder is detached.
    // This happens if pullPlaceholder is set to false and the drop occurs outside a container.
    onCancel: function ($item, container, _super, event) {
    },
    // Executed at the beginning of a mouse move event.
    // The Placeholder has not been moved yet.
    onDrag: function ($item, position, _super, event) {
      $item.css(position)
      event.preventDefault()
    },
    // Called after the drag has been started,
    // that is the mouse button is being held down and
    // the mouse is moving.
    // The container is the closest initialized container.
    // Therefore it might not be the container, that actually contains the item.
    onDragStart: function ($item, container, _super, event) {
      $item.css({
        height: $item.outerHeight(),
        width: $item.outerWidth()
      })
      $item.addClass(container.group.options.draggedClass)
      $("body").addClass(container.group.options.bodyClass)
    },
    // Called when the mouse button is being released
    onDrop: function ($item, container, _super, event) {
      $item.removeClass(container.group.options.draggedClass).removeAttr("style")
      $("body").removeClass(container.group.options.bodyClass)
    },
    // Called on mousedown. If falsy value is returned, the dragging will not start.
    // Ignore if element clicked is input, select or textarea
    onMousedown: function ($item, _super, event) {
      if (!event.target.nodeName.match(/^(input|select|textarea)$/i)) {
        if (event.type.match(/^mouse/)) event.preventDefault()
        return true
      }
    },
    // The class of the placeholder (must match placeholder option markup)
    placeholderClass: "placeholder",
    // Template for the placeholder. Can be any valid jQuery input
    // e.g. a string, a DOM element.
    // The placeholder must have the class "placeholder"
    placeholder: '<li class="placeholder"></li>',
    // If true, the position of the placeholder is calculated on every mousemove.
    // If false, it is only calculated when the mouse is above a container.
    pullPlaceholder: true,
    // Specifies serialization of the container group.
    // The pair $parent/$children is either container/items or item/subcontainers.
    serialize: function ($parent, $children, parentIsContainer) {
      var result = $.extend({}, $parent.data())

      if (parentIsContainer) {
        return [$children]
      }
      else if ($children[0]){
        result.children = $children
      }

      delete result.subContainers
      delete result.sortable

      return result
    },
    // Set tolerance while dragging. Positive values decrease sensitivity,
    // negative values increase it.
    tolerance: 0
  }, // end group defaults
  containerGroups = {},
  groupCounter = 0,
  emptyBox = {
    left: 0,
    top: 0,
    bottom: 0,
    right:0
  },
  eventNames = {
    start: "touchstart.sortable mousedown.sortable",
    drop: "touchend.sortable touchcancel.sortable mouseup.sortable",
    drag: "touchmove.sortable mousemove.sortable",
    scroll: "scroll.sortable"
  },
  subContainerKey = "subContainers"

  /*
   * a is Array [left, right, top, bottom]
   * b is array [left, top]
   */
  function d(a,b) {
    var x = Math.max(0, a[0] - b[0], b[0] - a[1]),
    y = Math.max(0, a[2] - b[1], b[1] - a[3])
    return x+y;
  }

  function setDimensions(array, dimensions, tolerance, useOffset) {
    var i = array.length,
    offsetMethod = useOffset ? "offset" : "position"
    tolerance = tolerance || 0

    while(i--){
      var el = array[i].el ? array[i].el : $(array[i]),
      // use fitting method
      pos = el[offsetMethod]()
      pos.left += parseInt(el.css('margin-left'), 10)
      pos.top += parseInt(el.css('margin-top'),10)
      dimensions[i] = [
        pos.left - tolerance,
        pos.left + el.outerWidth() + tolerance,
        pos.top - tolerance,
        pos.top + el.outerHeight() + tolerance
      ]
    }
  }

  function getRelativePosition(pointer, element) {
    var offset = element.offset()
    return {
      left: pointer.left - offset.left,
      top: pointer.top - offset.top
    }
  }

  function sortByDistanceDesc(dimensions, pointer, lastPointer) {
    pointer = [pointer.left, pointer.top]
    lastPointer = lastPointer && [lastPointer.left, lastPointer.top]

    var dim,
    i = dimensions.length,
    distances = []

    while(i--){
      dim = dimensions[i]
      distances[i] = [i,d(dim,pointer), lastPointer && d(dim, lastPointer)]
    }
    distances = distances.sort(function  (a,b) {
      return b[1] - a[1] || b[2] - a[2] || b[0] - a[0]
    })

    // last entry is the closest
    return distances
  }

  function ContainerGroup(options) {
    this.options = $.extend({}, groupDefaults, options)
    this.containers = []

    if(!this.options.rootGroup){
      this.scrollProxy = $.proxy(this.scroll, this)
      this.dragProxy = $.proxy(this.drag, this)
      this.dropProxy = $.proxy(this.drop, this)
      this.placeholder = $(this.options.placeholder)

      if(!options.isValidTarget)
        this.options.isValidTarget = undefined
    }
  }

  ContainerGroup.get = function  (options) {
    if(!containerGroups[options.group]) {
      if(options.group === undefined)
        options.group = groupCounter ++

      containerGroups[options.group] = new ContainerGroup(options)
    }

    return containerGroups[options.group]
  }

  ContainerGroup.prototype = {
    dragInit: function  (e, itemContainer) {
      this.$document = $(itemContainer.el[0].ownerDocument)

      // get item to drag
      var closestItem = $(e.target).closest(this.options.itemSelector);
      // using the length of this item, prevents the plugin from being started if there is no handle being clicked on.
      // this may also be helpful in instantiating multidrag.
      if (closestItem.length) {
        this.item = closestItem;
        this.itemContainer = itemContainer;
        if (this.item.is(this.options.exclude) || !this.options.onMousedown(this.item, groupDefaults.onMousedown, e)) {
          return;
        }
        this.setPointer(e);
        this.toggleListeners('on');
        this.setupDelayTimer();
        this.dragInitDone = true;
      }
    },
    drag: function  (e) {
      if(!this.dragging){
        if(!this.distanceMet(e) || !this.delayMet)
          return

        this.options.onDragStart(this.item, this.itemContainer, groupDefaults.onDragStart, e)
        this.item.before(this.placeholder)
        this.dragging = true
      }

      this.setPointer(e)
      // place item under the cursor
      this.options.onDrag(this.item,
                          getRelativePosition(this.pointer, this.item.offsetParent()),
                          groupDefaults.onDrag,
                          e)

      var p = this.getPointer(e),
      box = this.sameResultBox,
      t = this.options.tolerance

      if(!box || box.top - t > p.top || box.bottom + t < p.top || box.left - t > p.left || box.right + t < p.left)
        if(!this.searchValidTarget()){
          this.placeholder.detach()
          this.lastAppendedItem = undefined
        }
    },
    drop: function  (e) {
      this.toggleListeners('off')

      this.dragInitDone = false

      if(this.dragging){
        // processing Drop, check if placeholder is detached
        if(this.placeholder.closest("html")[0]){
          this.placeholder.before(this.item).detach()
        } else {
          this.options.onCancel(this.item, this.itemContainer, groupDefaults.onCancel, e)
        }
        this.options.onDrop(this.item, this.getContainer(this.item), groupDefaults.onDrop, e)

        // cleanup
        this.clearDimensions()
        this.clearOffsetParent()
        this.lastAppendedItem = this.sameResultBox = undefined
        this.dragging = false
      }
    },
    searchValidTarget: function  (pointer, lastPointer) {
      if(!pointer){
        pointer = this.relativePointer || this.pointer
        lastPointer = this.lastRelativePointer || this.lastPointer
      }

      var distances = sortByDistanceDesc(this.getContainerDimensions(),
                                         pointer,
                                         lastPointer),
      i = distances.length

      while(i--){
        var index = distances[i][0],
        distance = distances[i][1]

        if(!distance || this.options.pullPlaceholder){
          var container = this.containers[index]
          if(!container.disabled){
            if(!this.$getOffsetParent()){
              var offsetParent = container.getItemOffsetParent()
              pointer = getRelativePosition(pointer, offsetParent)
              lastPointer = getRelativePosition(lastPointer, offsetParent)
            }
            if(container.searchValidTarget(pointer, lastPointer))
              return true
          }
        }
      }
      if(this.sameResultBox)
        this.sameResultBox = undefined
    },
    movePlaceholder: function  (container, item, method, sameResultBox) {
      var lastAppendedItem = this.lastAppendedItem
      if(!sameResultBox && lastAppendedItem && lastAppendedItem[0] === item[0])
        return;

      item[method](this.placeholder)
      this.lastAppendedItem = item
      this.sameResultBox = sameResultBox
      this.options.afterMove(this.placeholder, container, item)
    },
    getContainerDimensions: function  () {
      if(!this.containerDimensions)
        setDimensions(this.containers, this.containerDimensions = [], this.options.tolerance, !this.$getOffsetParent())
      return this.containerDimensions
    },
    getContainer: function  (element) {
      return element.closest(this.options.containerSelector).data(pluginName)
    },
    $getOffsetParent: function  () {
      if(this.offsetParent === undefined){
        var i = this.containers.length - 1,
        offsetParent = this.containers[i].getItemOffsetParent()

        if(!this.options.rootGroup){
          while(i--){
            if(offsetParent[0] != this.containers[i].getItemOffsetParent()[0]){
              // If every container has the same offset parent,
              // use position() which is relative to this parent,
              // otherwise use offset()
              // compare #setDimensions
              offsetParent = false
              break;
            }
          }
        }

        this.offsetParent = offsetParent
      }
      return this.offsetParent
    },
    setPointer: function (e) {
      var pointer = this.getPointer(e)

      if(this.$getOffsetParent()){
        var relativePointer = getRelativePosition(pointer, this.$getOffsetParent())
        this.lastRelativePointer = this.relativePointer
        this.relativePointer = relativePointer
      }

      this.lastPointer = this.pointer
      this.pointer = pointer
    },
    distanceMet: function (e) {
      var currentPointer = this.getPointer(e)
      return (Math.max(
        Math.abs(this.pointer.left - currentPointer.left),
        Math.abs(this.pointer.top - currentPointer.top)
      ) >= this.options.distance)
    },
    getPointer: function(e) {
      var o = e.originalEvent,
          t = (e.originalEvent.touches && e.originalEvent.touches[0]) || {}
      return {
        left: e.pageX || o.pageX || t.pageX,
        top: e.pageY || o.pageY || t.pageY
      }
    },
    setupDelayTimer: function () {
      var that = this
      this.delayMet = !this.options.delay

      // init delay timer if needed
      if (!this.delayMet) {
        clearTimeout(this._mouseDelayTimer);
        this._mouseDelayTimer = setTimeout(function() {
          that.delayMet = true
        }, this.options.delay)
      }
    },
    scroll: function  (e) {
      this.clearDimensions()
      this.clearOffsetParent() // TODO is this needed?
    },
    toggleListeners: function (method) {
      var that = this,
      events = ['drag','drop','scroll']

      $.each(events,function  (i,event) {
        that.$document[method](eventNames[event], that[event + 'Proxy'])
      })
    },
    clearOffsetParent: function () {
      this.offsetParent = undefined
    },
    // Recursively clear container and item dimensions
    clearDimensions: function  () {
      this.traverse(function(object){
        object._clearDimensions()
      })
    },
    traverse: function(callback) {
      callback(this)
      var i = this.containers.length
      while(i--){
        this.containers[i].traverse(callback)
      }
    },
    _clearDimensions: function(){
      this.containerDimensions = undefined
    },
    _destroy: function () {
      containerGroups[this.options.group] = undefined
    }
  }

  function Container(element, options) {
    this.el = element
    this.options = $.extend( {}, containerDefaults, options)

    this.group = ContainerGroup.get(this.options)
    this.rootGroup = this.options.rootGroup || this.group
    this.handle = this.rootGroup.options.handle || this.rootGroup.options.itemSelector

    var itemPath = this.rootGroup.options.itemPath
    this.target = itemPath ? this.el.find(itemPath) : this.el

    this.target.on(eventNames.start, this.handle, $.proxy(this.dragInit, this))

    if(this.options.drop)
      this.group.containers.push(this)
  }

  Container.prototype = {
    dragInit: function  (e) {
      var rootGroup = this.rootGroup

      if( !this.disabled &&
          !rootGroup.dragInitDone &&
          this.options.drag &&
          this.isValidDrag(e)) {
        rootGroup.dragInit(e, this)
      }
    },
    isValidDrag: function(e) {
      return e.which == 1 ||
        e.type == "touchstart" && e.originalEvent.touches.length == 1
    },
    searchValidTarget: function  (pointer, lastPointer) {
      var distances = sortByDistanceDesc(this.getItemDimensions(),
                                         pointer,
                                         lastPointer),
      i = distances.length,
      rootGroup = this.rootGroup,
      validTarget = !rootGroup.options.isValidTarget ||
        rootGroup.options.isValidTarget(rootGroup.item, this)

      if(!i && validTarget){
        rootGroup.movePlaceholder(this, this.target, "append")
        return true
      } else
        while(i--){
          var index = distances[i][0],
          distance = distances[i][1]
          if(!distance && this.hasChildGroup(index)){
            var found = this.getContainerGroup(index).searchValidTarget(pointer, lastPointer)
            if(found)
              return true
          }
          else if(validTarget){
            this.movePlaceholder(index, pointer)
            return true
          }
        }
    },
    movePlaceholder: function  (index, pointer) {
      var item = $(this.items[index]),
      dim = this.itemDimensions[index],
      method = "after",
      width = item.outerWidth(),
      height = item.outerHeight(),
      offset = item.offset(),
      sameResultBox = {
        left: offset.left,
        right: offset.left + width,
        top: offset.top,
        bottom: offset.top + height
      }
      if(this.options.vertical){
        var yCenter = (dim[2] + dim[3]) / 2,
        inUpperHalf = pointer.top <= yCenter
        if(inUpperHalf){
          method = "before"
          sameResultBox.bottom -= height / 2
        } else
          sameResultBox.top += height / 2
      } else {
        var xCenter = (dim[0] + dim[1]) / 2,
        inLeftHalf = pointer.left <= xCenter
        if(inLeftHalf){
          method = "before"
          sameResultBox.right -= width / 2
        } else
          sameResultBox.left += width / 2
      }
      if(this.hasChildGroup(index))
        sameResultBox = emptyBox
      this.rootGroup.movePlaceholder(this, item, method, sameResultBox)
    },
    getItemDimensions: function  () {
      if(!this.itemDimensions){
        this.items = this.$getChildren(this.el, "item").filter(
          ":not(." + this.group.options.placeholderClass + ", ." + this.group.options.draggedClass + ")"
        ).get()
        setDimensions(this.items, this.itemDimensions = [], this.options.tolerance)
      }
      return this.itemDimensions
    },
    getItemOffsetParent: function  () {
      var offsetParent,
      el = this.el
      // Since el might be empty we have to check el itself and
      // can not do something like el.children().first().offsetParent()
      if(el.css("position") === "relative" || el.css("position") === "absolute"  || el.css("position") === "fixed")
        offsetParent = el
      else
        offsetParent = el.offsetParent()
      return offsetParent
    },
    hasChildGroup: function (index) {
      return this.options.nested && this.getContainerGroup(index)
    },
    getContainerGroup: function  (index) {
      var childGroup = $.data(this.items[index], subContainerKey)
      if( childGroup === undefined){
        var childContainers = this.$getChildren(this.items[index], "container")
        childGroup = false

        if(childContainers[0]){
          var options = $.extend({}, this.options, {
            rootGroup: this.rootGroup,
            group: groupCounter ++
          })
          childGroup = childContainers[pluginName](options).data(pluginName).group
        }
        $.data(this.items[index], subContainerKey, childGroup)
      }
      return childGroup
    },
    $getChildren: function (parent, type) {
      var options = this.rootGroup.options,
      path = options[type + "Path"],
      selector = options[type + "Selector"]

      parent = $(parent)
      if(path)
        parent = parent.find(path)

      return parent.children(selector)
    },
    _serialize: function (parent, isContainer) {
      var that = this,
      childType = isContainer ? "item" : "container",

      children = this.$getChildren(parent, childType).not(this.options.exclude).map(function () {
        return that._serialize($(this), !isContainer)
      }).get()

      return this.rootGroup.options.serialize(parent, children, isContainer)
    },
    traverse: function(callback) {
      $.each(this.items || [], function(item){
        var group = $.data(this, subContainerKey)
        if(group)
          group.traverse(callback)
      });

      callback(this)
    },
    _clearDimensions: function  () {
      this.itemDimensions = undefined
    },
    _destroy: function() {
      var that = this;

      this.target.off(eventNames.start, this.handle);
      this.el.removeData(pluginName)

      if(this.options.drop)
        this.group.containers = $.grep(this.group.containers, function(val){
          return val != that
        })

      $.each(this.items || [], function(){
        $.removeData(this, subContainerKey)
      })
    }
  }

  var API = {
    enable: function() {
      this.traverse(function(object){
        object.disabled = false
      })
    },
    disable: function (){
      this.traverse(function(object){
        object.disabled = true
      })
    },
    serialize: function () {
      return this._serialize(this.el, true)
    },
    refresh: function() {
      this.traverse(function(object){
        object._clearDimensions()
      })
    },
    destroy: function () {
      this.traverse(function(object){
        object._destroy();
      })
    }
  }

  $.extend(Container.prototype, API)

  /**
   * jQuery API
   *
   * Parameters are
   *   either options on init
   *   or a method name followed by arguments to pass to the method
   */
  $.fn[pluginName] = function(methodOrOptions) {
    var args = Array.prototype.slice.call(arguments, 1)

    return this.map(function(){
      var $t = $(this),
      object = $t.data(pluginName)

      if(object && API[methodOrOptions])
        return API[methodOrOptions].apply(object, args) || this
      else if(!object && (methodOrOptions === undefined ||
                          typeof methodOrOptions === "object"))
        $t.data(pluginName, new Container($t, methodOrOptions))

      return this
    });
  };

}(jQuery, window, 'jqSortable');

;
/*
 * October JavaScript foundation library.
 * 
 * Base class for OctoberCMS back-end classes.
 *
 * The class defines base functionality for dealing with memory management
 * and cleaning up bound (proxied) methods.
 *
 * The base class defines the dispose method that cleans up proxied methods. 
 * If child classes implement their own dispose() method, they should call 
 * the base class dispose method (see the example below).
 *
 * Use the simple parasitic combination inheritance pattern to create child classes:
 * 
 * var Base = $.oc.foundation.base,
 *     BaseProto = Base.prototype
 *
 * var SubClass = function(params) {
 *     // Call the parent constructor
 *     Base.call(this)
 * }
 *
 * SubClass.prototype = Object.create(BaseProto)
 * SubClass.prototype.constructor = SubClass
 *
 * // Child class methods can be defined only after the 
 * // prototype is updated in the two previous lines
 *
 * SubClass.prototype.dispose = function() {
 *     // Call the parent method
 *     BaseProto.dispose.call(this)
 * };
 *
 * See: 
 *
 * - https://developers.google.com/speed/articles/optimizing-javascript
 * - http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
 *
 */
+function ($) { "use strict";
    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.foundation === undefined)
        $.oc.foundation = {}

    $.oc.foundation._proxyCounter = 0

    var Base = function() {
        this.proxiedMethods = {}
    }

    Base.prototype.dispose = function() {
        for (var key in this.proxiedMethods) {
            this.proxiedMethods[key] = null
        }

        this.proxiedMethods = null
    }

    /*
     * Creates a proxied method reference or returns an existing proxied method.
     */
    Base.prototype.proxy = function(method) {
        if (method.ocProxyId === undefined) {
            $.oc.foundation._proxyCounter++
            method.ocProxyId = $.oc.foundation._proxyCounter
        }

        if (this.proxiedMethods[method.ocProxyId] !== undefined)
            return this.proxiedMethods[method.ocProxyId]

        this.proxiedMethods[method.ocProxyId] = method.bind(this)
        return this.proxiedMethods[method.ocProxyId]
    }

    $.oc.foundation.base = Base;
}(window.jQuery);
;
/*
 * October JavaScript foundation library.
 * 
 * Light-weight utility functions for working with DOM elements. The functions
 * work with elements directly, without jQuery, using the native JavaScript and DOM
 * features.
 *
 * Usage examples:
 *
 * $.oc.foundation.element.addClass(myElement, myClass)
 *
 */
+function ($) { "use strict";
    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.foundation === undefined)
        $.oc.foundation = {}

    var Element = {
        hasClass: function(el, className) {
            if (el.classList)
                return el.classList.contains(className);
            
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        },

        addClass: function(el, className) {
            var classes = className.split(' ')

            for (var i = 0, len = classes.length; i < len; i++) {
                var currentClass = classes[i].trim()

                if (this.hasClass(el, currentClass))
                    return

                if (el.classList)
                    el.classList.add(currentClass);
                else
                    el.className += ' ' + currentClass;
            }
        },

        removeClass: function(el, className) {
            if (el.classList)
                el.classList.remove(className);
            else
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },

        toggleClass: function(el, className, add) {
            if (add === undefined) {
                if (this.hasClass(el, className)) {
                    this.removeClass(el, className)
                }
                else {
                    this.addClass(el, className)
                }
            }

            if (add && !this.hasClass(el, className)) {
                this.addClass(el, className)
                return
            }

            if (!add && this.hasClass(el, className)) {
                this.removeClass(el, className)
                return
            }
        },

        /*
         * Returns element absolution position.
         * If the second parameter value is false, the scrolling
         * won't be added to the result (which could improve the performance).
         */
        absolutePosition: function(element, ignoreScrolling) {
            var top = ignoreScrolling === true ? 0 : document.body.scrollTop,
                left = 0

            do {
                top += element.offsetTop || 0;

                if (ignoreScrolling !== true)
                    top -= element.scrollTop || 0

                left += element.offsetLeft || 0
                element = element.offsetParent
            } while(element)

            return {
                top: top,
                left: left
            }
        },

        getCaretPosition: function(input) {
            if (document.selection) { 
               var selection = document.selection.createRange()

               selection.moveStart('character', -input.value.length)
               return selection.text.length
            }

            if (input.selectionStart !== undefined)
               return input.selectionStart

            return 0
        },

        setCaretPosition: function(input, position) {
            if (document.selection) { 
                var range = input.createTextRange()

                setTimeout(function() {
                    // Asynchronous layout update, better performance
                    range.collapse(true)
                    range.moveStart("character", position)
                    range.moveEnd("character", 0)
                    range.select()
                    range = null
                    input = null
                }, 0)
            }

            if (input.selectionStart !== undefined) {
                setTimeout(function() {
                    // Asynchronous layout update
                    input.selectionStart = position
                    input.selectionEnd = position
                    input = null
                }, 0)
            }
        },

        elementContainsPoint: function(element, point) {
            var elementPosition = $.oc.foundation.element.absolutePosition(element),
                elementRight = elementPosition.left + element.offsetWidth,
                elementBottom = elementPosition.top + element.offsetHeight

            return point.x >= elementPosition.left && point.x <= elementRight 
                    && point.y >= elementPosition.top && point.y <= elementBottom
        }
    }

    $.oc.foundation.element = Element;
}(window.jQuery);
;
/*
 * October JavaScript foundation library.
 *
 * Light-weight utility functions for working with native DOM events. The functions
 * work with events directly, without jQuery, using the native JavaScript and DOM
 * features.
 *
 * Usage examples:
 *
 * $.oc.foundation.event.stop(ev)
 *
 */
+function ($) { "use strict";
    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.foundation === undefined)
        $.oc.foundation = {}

    var Event = {
        /*
         * Returns the event target element.
         * If the second argument is provided (string), the function
         * will try to find the first parent with the tag name matching
         * the argument value.
         */
        getTarget: function(ev, tag) {
            var target = ev.target ? ev.target : ev.srcElement;
            if (tag === undefined) {
                return target;
            }

            var tagName = target.tagName;

            while (tagName != tag) {
                target = target.parentNode;
                if (!target) {
                    return null;
                }

                tagName = target.tagName;
            }

            return target;
        },

        stop: function(ev) {
            if (ev.stopPropagation) {
                ev.stopPropagation();
            }
            else {
                ev.cancelBubble = true;
            }

            if (ev.preventDefault) {
                ev.preventDefault();
            }
            else {
                ev.returnValue = false;
            }
        },

        pageCoordinates: function(ev) {
            if (ev.pageX || ev.pageY) {
                return {
                    x: ev.pageX,
                    y: ev.pageY
                };
            }
            else if (ev.clientX || ev.clientY) {
                return {
                    x: (ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft),
                    y: (ev.clientY + document.body.scrollTop + document.documentElement.scrollTop)
                };
            }

            return {
                x: 0,
                y: 0
            };
        }
    }

    $.oc.foundation.event = Event;
}(window.jQuery);
;
/*
 * October JavaScript foundation library.
 *
 * Utility functions for working back-end client-side UI controls.
 *
 * Usage examples:
 *
 * $.oc.foundation.controlUtils.markDisposable(el)
 * $.oc.foundation.controlUtils.disposeControls(container)
 *
 */
+function ($) { "use strict";
    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.foundation === undefined)
        $.oc.foundation = {}

    var ControlUtils = {
        markDisposable: function(el) {
            el.setAttribute('data-disposable', '')
        },

        /*
         * Destroys all disposable controls in a container.
         * The disposable controls should watch the dispose-control
         * event.
         */
        disposeControls: function(container) {
            if (container === document) {
                container = document.documentElement;
            }

            var controls = container.querySelectorAll('[data-disposable]')
            for (var i=0, len=controls.length; i<len; i++) {
                $(controls[i]).triggerHandler('dispose-control')
            }

            if (container.hasAttribute('data-disposable')) {
                $(container).triggerHandler('dispose-control')
            }
        }
    }

    $.oc.foundation.controlUtils = ControlUtils;

    // Automatically dispose controls in an element before the element contents is replaced.
    // The ajaxBeforeReplace event is triggered by the AJAX framework.
    addEventListener('page:before-render', function(ev) {
        $.oc.foundation.controlUtils.disposeControls(ev.target);
    });

    addEventListener('ajax:before-replace', function(ev) {
        $.oc.foundation.controlUtils.disposeControls(ev.target);
    });

}(window.jQuery);

;
/*
 * Drag Value plugin
 *
 * Uses native dragging to allow elements to be dragged in to inputs, textareas, etc
 *
 * Data attributes:
 * - data-control="dragvalue" - enables the plugin on an element
 * - data-text-value="text to include" - text value to include when dragging
 * - data-drag-click="false" - allow click event, tries to cache the last active element
 *                             and insert the text at the current cursor position
 *
 * JavaScript API:
 * $('a#someElement').dragValue({ textValue: 'insert this text' })
 *
 */

+function ($) { "use strict";

    // DRAG VALUE CLASS DEFINITION
    // ============================

    var DragValue = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        // Init
        this.init()
    }

    DragValue.DEFAULTS = {
        dragClick: false
    }

    DragValue.prototype.init = function() {
        this.$el.prop('draggable', true)
        this.textValue = this.$el.data('textValue')

        this.$el.on('dragstart', $.proxy(this.handleDragStart, this))
        this.$el.on('drop', $.proxy(this.handleDrop, this))
        this.$el.on('dragend', $.proxy(this.handleDragEnd, this))

        if (this.options.dragClick) {
            this.$el.on('click', $.proxy(this.handleClick, this))
            this.$el.on('mouseover', $.proxy(this.handleMouseOver, this))
        }
    }

    //
    // Drag events
    //

    DragValue.prototype.handleDragStart = function(event) {
        var e = event.originalEvent
        e.dataTransfer.effectAllowed = 'all'
        e.dataTransfer.setData('text/plain', this.textValue)

        this.$el
            .css({ opacity: 0.5 })
            .addClass('dragvalue-dragging')
    }

    DragValue.prototype.handleDrop = function(event) {
        event.stopPropagation()
        return false
    }

    DragValue.prototype.handleDragEnd = function(event) {
        this.$el
            .css({ opacity: 1 })
            .removeClass('dragvalue-dragging')
    }

    //
    // Click events
    //

    DragValue.prototype.handleMouseOver = function(event) {
        var el = document.activeElement
        if (!el) return

        if (el.isContentEditable || (
            el.tagName.toLowerCase() == 'input' &&
            el.type == 'text' ||
            el.tagName.toLowerCase() == 'textarea'
        )) {
            this.lastElement = el
        }
    }

    DragValue.prototype.handleClick = function(event) {
        if (!this.lastElement) return

        var $el = $(this.lastElement)

        if ($el.hasClass('ace_text-input'))
            return this.handleClickCodeEditor(event, $el)

        if (this.lastElement.isContentEditable)
            return this.handleClickContentEditable()

        this.insertAtCaret(this.lastElement, this.textValue)
    }

    DragValue.prototype.handleClickCodeEditor = function(event, $el) {
        var $editorArea = $el.closest('[data-control=codeeditor]')
        if (!$editorArea.length) return

        $editorArea.codeEditor('getEditorObject').insert(this.textValue)
    }

    DragValue.prototype.handleClickContentEditable = function() {
        var sel, range, html;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode( document.createTextNode(this.textValue) );
            }
        }
        else if (document.selection && document.selection.createRange) {
            document.selection.createRange().text = this.textValue;
        }
    }

    //
    // Helpers
    //

    DragValue.prototype.insertAtCaret = function(el, insertValue) {
        // IE
        if (document.selection) {
            el.focus()
            var sel = document.selection.createRange()
            sel.text = insertValue
            el.focus()
        }
        // Real browsers
        else if (el.selectionStart || el.selectionStart == '0') {
            var startPos = el.selectionStart, endPos = el.selectionEnd, scrollTop = el.scrollTop
            el.value = el.value.substring(0, startPos) + insertValue + el.value.substring(endPos, el.value.length)
            el.focus()
            el.selectionStart = startPos + insertValue.length
            el.selectionEnd = startPos + insertValue.length
            el.scrollTop = scrollTop
        }
        else {
            el.value += insertValue
            el.focus()
        }
    }

    // DRAG VALUE PLUGIN DEFINITION
    // ============================

    var old = $.fn.dragValue

    $.fn.dragValue = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.dragvalue')
            var options = $.extend({}, DragValue.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.dragvalue', (data = new DragValue(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })

        return result ? result : this
    }

    $.fn.dragValue.Constructor = DragValue

    // DRAG VALUE NO CONFLICT
    // =================

    $.fn.dragValue.noConflict = function () {
        $.fn.dragValue = old
        return this
    }

    // DRAG VALUE DATA-API
    // ===============

    $(document).render(function() {
        $('[data-control="dragvalue"]').dragValue()
    });

}(window.jQuery);
;
/*
 * Sortable plugin.
 *
 * Documentation: ../docs/drag-sort.md
 *
 * Require:
 *  - sortable/jquery-sortable
 */

 +function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var Sortable = function (element, options) {
        this.$el = $(element)
        this.options = options || {}
        this.cursorAdjustment = null

        $.oc.foundation.controlUtils.markDisposable(element)
        Base.call(this)
        this.init()
    }

    Sortable.prototype = Object.create(BaseProto)
    Sortable.prototype.constructor = Sortable

    Sortable.prototype.init = function() {
        this.$el.one('dispose-control', this.proxy(this.dispose))

        var
            self = this,
            sortableOverrides = {},
            sortableDefaults = {
                onDragStart: this.proxy(this.onDragStart),
                onDrag: this.proxy(this.onDrag),
                onDrop: this.proxy(this.onDrop)
            }

        /*
         * Override _super object for each option/event
         */
        if (this.options.onDragStart) {
            sortableOverrides.onDragStart = function ($item, container, _super, event) {
                self.options.onDragStart($item, container, sortableDefaults.onDragStart, event)
            }
        }

        if (this.options.onDrag) {
            sortableOverrides.onDrag = function ($item, position, _super, event) {
                self.options.onDrag($item, position, sortableDefaults.onDrag, event)
            }
        }

        if (this.options.onDrop) {
            sortableOverrides.onDrop = function ($item, container, _super, event) {
                self.options.onDrop($item, container, sortableDefaults.onDrop, event)
            }
        }

        this.$el.jqSortable($.extend({}, sortableDefaults, this.options, sortableOverrides))
    }

    Sortable.prototype.dispose = function() {
        this.$el.jqSortable('destroy')
        this.$el.off('dispose-control', this.proxy(this.dispose))
        this.$el.removeData('oc.sortable')
        this.$el = null
        this.options = null
        this.cursorAdjustment = null
        BaseProto.dispose.call(this)
    }

    Sortable.prototype.onDragStart = function ($item, container, _super, event) {
        /*
         * Relative cursor position
         */
        var offset = $item.offset(),
            pointer = container.rootGroup.pointer

        if (pointer) {
            this.cursorAdjustment = {
                left: pointer.left - offset.left,
                top: pointer.top - offset.top
            }
        }
        else {
            this.cursorAdjustment = null
        }

        if (this.options.tweakCursorAdjustment) {
            this.cursorAdjustment = this.options.tweakCursorAdjustment(this.cursorAdjustment)
        }

        $item.css({
            height: $item.height(),
            width: $item.width()
        })

        $item.addClass('dragged')
        $('body').addClass('dragging')
        this.$el.addClass('dragging')

        /*
         * Use animation
         */
        if (this.options.useAnimation) {
            $item.data('oc.animated', true)
        }

        /*
         * Placeholder clone
         */
         if (this.options.usePlaceholderClone) {
            $(container.rootGroup.placeholder).html($item.html())
         }

         if (!this.options.useDraggingClone) {
            $item.hide()
         }
    }

    Sortable.prototype.onDrag = function ($item, position, _super, event) {
        if (this.cursorAdjustment) {
            /*
             * Relative cursor position
             */
            $item.css({
              left: position.left - this.cursorAdjustment.left,
              top: position.top - this.cursorAdjustment.top
            })
        }
        else {
            /*
             * Default behavior
             */
            $item.css(position)
        }
    }

    Sortable.prototype.onDrop = function ($item, container, _super, event) {
        $item.removeClass('dragged').removeAttr('style')
        $('body').removeClass('dragging')
        this.$el.removeClass('dragging')

        if ($item.data('oc.animated')) {
            $item
                .hide()
                .slideDown(200)
        }
    }

    //
    // Proxy API
    //

    Sortable.prototype.enable = function() {
        this.$el.jqSortable('enable')
    }

    Sortable.prototype.disable = function() {
        this.$el.jqSortable('disable')
    }

    Sortable.prototype.refresh = function() {
        this.$el.jqSortable('refresh')
    }

    Sortable.prototype.serialize = function() {
        this.$el.jqSortable('serialize')
    }

    Sortable.prototype.destroy = function() {
        this.dispose()
    }

    // External solution for group persistence
    // See https://github.com/johnny/jquery-sortable/pull/122
    Sortable.prototype.destroyGroup = function() {
        var jqSortable = this.$el.data('jqSortable')
        if (jqSortable.group) {
            jqSortable.group._destroy()
        }
    }

    Sortable.DEFAULTS = {
        useAnimation: false,
        usePlaceholderClone: false,
        useDraggingClone: true,
        tweakCursorAdjustment: null
    }

    // PLUGIN DEFINITION
    // ============================

    var old = $.fn.sortable

    $.fn.sortable = function (option) {
        var args = arguments;

        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.sortable')
            var options = $.extend({}, Sortable.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.sortable', (data = new Sortable(this, options)))
            if (typeof option == 'string') data[option].apply(data, args)
        })
    }

    $.fn.sortable.Constructor = Sortable

    $.fn.sortable.noConflict = function () {
        $.fn.sortable = old
        return this
    }

}(window.jQuery);

;
/*
 * The autcomplete plugin, a forked version of Bootstrap's original typeahead plugin.
 *
 * Data attributes:
 * - data-control="autocomplete" - enables the autocomplete plugin
 *
 * JavaScript API:
 * $('input').autocomplete()
 *
 * Forked by daftspunk:
 *
 * - Source can be an object [{ value: 'something', label: 'Something' }, { value: 'else', label: 'Something Else' }]
 * - Source can also be { something: 'Something', else: 'Else' }
 */

!function($){

    "use strict"; // jshint ;_;


    /* AUTOCOMPLETE PUBLIC CLASS DEFINITION
     * ================================= */

    var Autocomplete = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, $.fn.autocomplete.defaults, options)
        this.matcher = this.options.matcher || this.matcher
        this.sorter = this.options.sorter || this.sorter
        this.highlighter = this.options.highlighter || this.highlighter
        this.updater = this.options.updater || this.updater
        this.source = this.options.source
        this.$menu = $(this.options.menu)
        this.shown = false
        this.listen()
    }

    Autocomplete.prototype = {

        constructor: Autocomplete,

        select: function () {
            var val = this.$menu.find('.active').attr('data-value')
            this.$element
                .val(this.updater(val))
                .change()
            return this.hide()
        },

        updater: function (item) {
            return item
        },

        show: function () {
            var offset = this.options.bodyContainer ? this.$element.offset() : this.$element.position(),
                pos = $.extend({}, offset, {
                height: this.$element[0].offsetHeight
            }),
            cssOptions = {
                top: pos.top + pos.height
                , left: pos.left
            }

            if (this.options.matchWidth) {
                cssOptions.width = this.$element[0].offsetWidth
            }

            this.$menu.css(cssOptions)

            if (this.options.bodyContainer) {
                $(document.body).append(this.$menu)
            }
            else {
                this.$menu.insertAfter(this.$element)
            }

            this.$menu.show()

            this.shown = true
            return this
        },

        hide: function () {
            this.$menu.hide()
            this.shown = false
            return this
        },

        lookup: function (event) {
            var items

            this.query = this.$element.val()

            if (!this.query || this.query.length < this.options.minLength) {
                return this.shown ? this.hide() : this
            }

            items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

            return items ? this.process(items) : this
        },

        itemValue: function (item) {
            if (typeof item === 'object')
                return item.value;

            return item;
        },

        itemLabel: function (item) {
            if (typeof item === 'object')
                return item.label;

            return item;
        },

        itemsToArray: function (items) {
            var newArray = []
            $.each(items, function(value, label){
                newArray.push({ label: label, value: value })
            })
            return newArray
        },

        process: function (items) {
            var that = this

            if (typeof items == 'object')
                items = this.itemsToArray(items)

            items = $.grep(items, function (item) {
                return that.matcher(item)
            })

            items = this.sorter(items)

            if (!items.length) {
                return this.shown ? this.hide() : this
            }

            return this.render(items.slice(0, this.options.items)).show()
        },

        matcher: function (item) {
            return ~this.itemValue(item).toLowerCase().indexOf(this.query.toLowerCase())
        },

        sorter: function (items) {
            var beginswith = [],
                caseSensitive = [],
                caseInsensitive = [],
                item,
                itemValue

            while (item = items.shift()) {
                itemValue = this.itemValue(item)
                if (!itemValue.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
                else if (~itemValue.indexOf(this.query)) caseSensitive.push(item)
                else caseInsensitive.push(item)
            }

            return beginswith.concat(caseSensitive, caseInsensitive)
        },

        highlighter: function (item) {
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
            return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            })
        },

        render: function (items) {
            var that = this

            items = $(items).map(function (i, item) {
                i = $(that.options.item).attr('data-value', that.itemValue(item))
                i.find('a').html(that.highlighter(that.itemLabel(item)))
                return i[0]
            })

            items.first().addClass('active')
            this.$menu.html(items)
            return this
        },

        next: function (event) {
            var active = this.$menu.find('.active').removeClass('active'),
                next = active.next()

            if (!next.length) {
                next = $(this.$menu.find('li')[0])
            }

            next.addClass('active')
        },

        prev: function (event) {
            var active = this.$menu.find('.active').removeClass('active'),
                prev = active.prev()

            if (!prev.length) {
                prev = this.$menu.find('li').last()
            }

            prev.addClass('active')
        },

        listen: function () {
            this.$element
                .on('focus.autocomplete',    $.proxy(this.focus, this))
                .on('blur.autocomplete',     $.proxy(this.blur, this))
                .on('keypress.autocomplete', $.proxy(this.keypress, this))
                .on('keyup.autocomplete',    $.proxy(this.keyup, this))

            if (this.eventSupported('keydown')) {
                this.$element.on('keydown.autocomplete', $.proxy(this.keydown, this))
            }

            this.$menu
                .on('click.autocomplete', $.proxy(this.click, this))
                .on('mouseenter.autocomplete', 'li', $.proxy(this.mouseenter, this))
                .on('mouseleave.autocomplete', 'li', $.proxy(this.mouseleave, this))
        },

        eventSupported: function(eventName) {
            var isSupported = eventName in this.$element
            if (!isSupported) {
                this.$element.setAttribute(eventName, 'return;')
                isSupported = typeof this.$element[eventName] === 'function'
            }
            return isSupported
        },

        move: function (e) {
            if (!this.shown) return

            switch(e.key) {
                case 'Tab':
                case 'Enter':
                case 'Escape':
                    e.preventDefault()
                    break

                case 'ArrowUp':
                    e.preventDefault()
                    this.prev()
                    break

                case 'ArrowDown':
                    e.preventDefault()
                    this.next()
                    break
            }

            e.stopPropagation()
        },

        keydown: function (e) {
            this.suppressKeyPressRepeat = ~$.inArray(e.key, ['ArrowDown','ArrowUp','Tab','Enter','Escape'])
            this.move(e)
        },

        keypress: function (e) {
            if (this.suppressKeyPressRepeat) return
            this.move(e)
        },

        keyup: function (e) {
            switch(e.keyCode) {
                case 40: // down arrow
                case 38: // up arrow
                case 16: // shift
                case 17: // ctrl
                case 18: // alt
                    break

                case 9: // tab
                case 13: // enter
                    if (!this.shown) return
                    this.select()
                    break

                case 27: // escape
                    if (!this.shown) return
                    this.hide()
                    break

                default:
                    this.lookup()
            }

            e.stopPropagation()
            e.preventDefault()
        },

        focus: function (e) {
            this.focused = true
        },

        blur: function (e) {
            this.focused = false
            if (!this.mousedover && this.shown) this.hide()
        },

        click: function (e) {
            e.stopPropagation()
            e.preventDefault()
            this.select()
            this.$element.focus()
        },

        mouseenter: function (e) {
            this.mousedover = true
            this.$menu.find('.active').removeClass('active')
            $(e.currentTarget).addClass('active')
        },

        mouseleave: function (e) {
            this.mousedover = false
            if (!this.focused && this.shown) this.hide()
        },

        destroy: function() {
            this.hide()

            this.$element.removeData('autocomplete')
            this.$menu.remove()

            this.$element.off('.autocomplete')
            this.$menu.off('.autocomplete')

            this.$element = null
            this.$menu = null
        }
    }


    /* AUTOCOMPLETE PLUGIN DEFINITION
     * =========================== */

    var old = $.fn.autocomplete

    $.fn.autocomplete = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('autocomplete')
                , options = typeof option == 'object' && option
            if (!data) $this.data('autocomplete', (data = new Autocomplete(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    $.fn.autocomplete.defaults = {
        source: [],
        items: 8,
        menu: '<ul class="autocomplete dropdown-menu"></ul>',
        item: '<li><a href="#"></a></li>',
        minLength: 1,
        bodyContainer: false
    }

    $.fn.autocomplete.Constructor = Autocomplete


    /* AUTOCOMPLETE NO CONFLICT
     * =================== */

    $.fn.autocomplete.noConflict = function () {
        $.fn.autocomplete = old
        return this
    }


    /* AUTOCOMPLETE DATA-API
     * ================== */

    function paramToObj(name, value) {
        if (value === undefined) value = ''
        if (typeof value == 'object') return value

        try {
            return oc.parseJSON("{" + value + "}")
        }
        catch (e) {
            throw new Error('Error parsing the '+name+' attribute value. '+e)
        }
    }

    $(document).on('focus.autocomplete.data-api', '[data-control="autocomplete"]', function (e) {
        var $this = $(this)
        if ($this.data('autocomplete')) return

        var opts = $this.data()

        if (opts.source) {
            opts.source = paramToObj('data-source', opts.source)
        }

        $this.autocomplete(opts)
    })

}(window.jQuery);


/* =============================================================
 * bootstrap-autocomplete.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#autocomplete
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

;
/*
 * Balloon selector control.
 *
 * Data attributes:
 * - data-control="balloon-selector" - enables the plugin
 *
 */
+function ($) { "use strict";

    var BalloonSelector = function (element, options) {

        this.$el = $(element);
        this.$field = $('input', this.$el);

        this.options = options || {};
        this.allowEmpty = 'selectorAllowEmpty' in this.$el.get(0).dataset;

        var self = this;
        $('li', this.$el).click(function(){
            if (self.$el.hasClass('control-disabled')) {
                return;
            }

            if (self.allowEmpty && $(this).hasClass('active')) {
                $(this).removeClass('active');
                self.$field
                    .val('')
                    .trigger('change');
                return;
            }

            $('li', self.$el).removeClass('active');
            $(this).addClass('active');
            self.$field
                .val($(this).data('value'))
                .trigger('change');
        });

        oc.Events.on(this.$el.get(0), 'trigger:empty', function() {
            $('li', self.$el).removeClass('active');
            self.$field.val('').trigger('change');
        });

        oc.Events.on(this.$el.get(0), 'trigger:fill', function(ev) {
            var fillValue = ev.detail.fillValue;
            $('li', self.$el).removeClass('active');
            $('li[data-value="'+fillValue+'"]', self.$el).addClass('active');
            self.$field.val(fillValue).trigger('change');
        });

        oc.Events.on(this.$el.get(0), 'trigger:disable', function(ev) {
            var status = ev.detail.status;
            self.$field.prop('disabled', status);
        });
    }

    BalloonSelector.DEFAULTS = {}

    // BALLOON SELECTOR PLUGIN DEFINITION
    // ===================================

    var old = $.fn.balloonSelector;

    $.fn.balloonSelector = function (option) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('oc.balloon-selector');
            var options = $.extend({}, BalloonSelector.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('oc.balloon-selector', (data = new BalloonSelector(this, options)));
        });
    }

    $.fn.balloonSelector.Constructor = BalloonSelector;

    // BALLOON SELECTOR NO CONFLICT
    // ===================================

    $.fn.balloonSelector.noConflict = function () {
        $.fn.balloonSelector = old;
        return this;
    }

    // BALLOON SELECTOR DATA-API
    // ===================================

    $(document).on('render', function(){
        $('div[data-control=balloon-selector]').balloonSelector();
    });

}(window.jQuery);

;
/*
 * Callout
 *
 * - Documentation: ../docs/callout.md
 */
+function ($) {
    'use strict';

    // CALLOUT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="callout"]';
    var Callout = function (el) {
        $(el).on('click', dismiss, this.close);
    }

    Callout.prototype.close = function (e) {
        var $this    = $(this);
        var selector = $this.attr('data-target');

        if (!selector) {
            selector = $this.attr('href');
        }

        var $parent = $(selector);

        if (e) {
            e.preventDefault();
        }

        if (!$parent.length) {
            $parent = $this.hasClass('callout') ? $this : $this.parent();
        }

        $parent.trigger(e = $.Event('close.oc.callout'));

        if (e.isDefaultPrevented()) {
            return;
        }

        $parent.removeClass('show');

        function removeElement() {
            $parent.trigger('closed.oc.callout').remove();
        }

        $parent.hasClass('fade')
            ? $parent.one('transitionend', removeElement)
            : removeElement();
    }

    // CALLOUT PLUGIN DEFINITION
    // =======================

    var old = $.fn.callout

    $.fn.callout = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.callout')

            if (!data) $this.data('oc.callout', (data = new Callout(this)))
            if (typeof option == 'string') data[option].call($this)
        })
    }

    $.fn.callout.Constructor = Callout

    // CALLOUT NO CONFLICT
    // =================

    $.fn.callout.noConflict = function () {
        $.fn.callout = old;
        return this;
    }

    // CALLOUT DATA-API
    // ==============

    $(document).on('click.oc.callout.data-api', dismiss, Callout.prototype.close);

}(jQuery);

;
/*
 * Ajax Popup plugin
 *
 * Documentation: ../docs/popup.md
 *
 * Require:
 *  - bootstrap/modal
 */

+function($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    // POPUP CLASS DEFINITION
    // ============================

    var Popup = function(element, options) {
        this.options = options;
        this.$el = $(element);
        this.$container = null;
        this.$modal = null;
        this.$backdrop = null;
        this.isOpen = false;
        this.isLoading = false;
        this.firstDiv = null;
        this.allowHide = true;

        this.$container = this.createPopupContainer()
        this.$content = $('.modal-content:first', this.$container);
        this.$dialog = $('.modal-dialog:first', this.$container);
        this.$modal = this.$container.modal({
            show: false,
            backdrop: false,
            keyboard: this.options.keyboard,
            focus: false
        });

        $.oc.foundation.controlUtils.markDisposable(element);
        Base.call(this);

        this.initEvents();
        this.init();
    }

    Popup.prototype = Object.create(BaseProto)
    Popup.prototype.constructor = Popup

    Popup.DEFAULTS = {
        ajax: null,
        handler: null,
        keyboard: true,
        extraData: {},
        content: null,
        size: null,
        adaptiveHeight: false,
        zIndex: null
    }

    Popup.prototype.init = function() {
        var self = this;

        // Do not allow the same popup to open twice
        if (self.isOpen) {
            return;
        }

        // Show loading panel
        this.setBackdrop(true);

        if (!this.options.content) {
            this.setLoading(true);
        }

        // October AJAX
        if (this.options.handler) {
            this.$el.request(this.options.handler, {
                data: paramToObj('data-extra-data', this.options.extraData),
                success: function(data, statusCode, xhr) {
                    if (data instanceof Blob) {
                        if (self.isLoading) {
                            self.hideLoading();
                        }
                        else {
                            self.hide();
                        }
                        self.triggerEvent('popup:download');
                        this.success(data, statusCode, xhr);
                        return;
                    }

                    this.success(data, statusCode, xhr).done(function() {
                        self.setContent(data.result);
                        $(window).trigger('ajaxUpdateComplete', [this, data, statusCode, xhr]);
                        self.triggerEvent('popupComplete');
                        self.triggerEvent('complete.oc.popup');
                    });
                },
                error: function(data, statusCode, xhr) {
                    this.error(data, statusCode, xhr).done(function() {
                        if (self.isLoading) {
                            self.hideLoading();
                        }
                        else {
                            self.hide();
                        }
                        self.triggerEvent('popupError');
                        self.triggerEvent('error.oc.popup');
                    });
                },
                cancel: function() {
                    if (self.isLoading) {
                        self.hideLoading();
                    }
                    else {
                        self.hide();
                    }
                }
            });

        }
        // Regular AJAX
        else if (this.options.ajax) {
            $.ajax({
                url: this.options.ajax,
                data: paramToObj('data-extra-data', this.options.extraData),
                success: function(data) {
                    self.setContent(data)
                },
                cache: false
            });
        }
        // Specified content
        else if (this.options.content) {
            var content = typeof this.options.content == 'function'
                ? this.options.content.call(this.$el[0], this)
                : this.options.content;

            this.setContent(content);
        }
    }

    Popup.prototype.initEvents = function() {
        var self = this;

        // Duplicate the popup reference on the .control-popup container
        this.$container.data('oc.popup', this);

        // Hook in to BS Modal events
        this.$modal.on('hide.bs.modal', function() {
            self.triggerEvent('hide.oc.popup');
            self.isOpen = false;
            self.setBackdrop(false);
        });

        this.$modal.on('hidden.bs.modal', function() {
            self.triggerEvent('hidden.oc.popup');
            $.oc.foundation.controlUtils.disposeControls(self.$container.get(0));
            self.$container.remove();
            $(document.body).removeClass('modal-open');
            self.dispose();
        });

        this.$modal.on('show.bs.modal', function() {
            self.isOpen = true;
            self.setBackdrop(true);
            $(document.body).addClass('modal-open');
        });

        this.$modal.on('shown.bs.modal', function() {
            self.triggerEvent('shown.oc.popup');
        });

        this.$modal.on('close.oc.popup', function() {
            self.hide();
            return false;
        });

        oc.Events.dispatch('popup:show');
    }

    Popup.prototype.dispose = function() {
        this.$modal.off('hide.bs.modal');
        this.$modal.off('hidden.bs.modal');
        this.$modal.off('show.bs.modal');
        this.$modal.off('shown.bs.modal');
        this.$modal.off('close.oc.popup');

        this.$el.off('dispose-control', this.proxy(this.dispose));
        this.$el.removeData('oc.popup');
        this.$container.removeData('oc.popup');

        this.$container = null;
        this.$content = null;
        this.$dialog = null;
        this.$modal = null;
        this.$el = null;

        // In some cases options could contain callbacks,
        // so it's better to clean them up too.
        this.options = null;

        BaseProto.dispose.call(this);
    }

    Popup.prototype.createPopupContainer = function() {
        var
            modal = $('<div />').prop({
                class: 'control-popup modal fade',
                role: 'dialog',
                tabindex: -1
            }),
            modalDialog = $('<div />').addClass('modal-dialog'),
            modalContent = $('<div />').addClass('modal-content');

        if (this.options.size) {
            modalDialog.addClass('size-' + this.options.size);
        }

        if (this.options.adaptiveHeight) {
            modalDialog.addClass('adaptive-height');
        }

        if (this.options.zIndex !== null) {
            modal.css('z-index', this.options.zIndex + 20);
        }

        return modal.append(modalDialog.append(modalContent));
    }

    Popup.prototype.setContent = function(contents) {
        var contentNode = $(contents);

        // Set the popup size from the inner contents instead
        // of needing it from the calling code
        if (contentNode.data('popup-size')) {
            this.$dialog.addClass('size-' + contentNode.data('popup-size'));
        }
        else {
            var $defaultSize = $('[data-popup-size]', contentNode);
            if ($defaultSize.length > 0) {
                this.$dialog.addClass('size-' + $defaultSize.data('popup-size'));
            }
        }

        this.setLoading(false);
        this.$modal.modal('show');
        this.$content.html(contentNode);
        this.triggerShowEvent();

        // Duplicate the popup object reference on to the first div
        // inside the popup. Eg: $('#firstDiv').popup('hide')
        this.firstDiv = this.$content.find('>div:first');
        if (this.firstDiv.length > 0) {
            this.firstDiv.data('oc.popup', this)
        }

        var $defaultFocus = $('[default-focus],[autofocus]', this.$content);
        if ($defaultFocus.is(":visible")) {
            window.setTimeout(function() {
                $defaultFocus.focus();
                $defaultFocus = null;
            }, 300);
        }
    }

    Popup.prototype.setBackdrop = function(val) {
        if (val && !this.$backdrop) {
            this.$backdrop = $('<div class="popup-backdrop fade" />');

            if (this.options.zIndex !== null) {
                this.$backdrop.css('z-index', this.options.zIndex);
            }

            this.$backdrop.appendTo(document.body);

            this.$backdrop.addClass('show');
            this.$backdrop.append($('<div class="modal-content popup-loading-indicator" />'));
        }
        else if (!val && this.$backdrop) {
            this.$backdrop.remove();
            this.$backdrop = null;
        }
    }

    Popup.prototype.setLoading = function(val) {
        if (!this.$backdrop) {
            return;
        }

        this.isLoading = val;

        if (val) {
            setTimeout(() => {
                if (this.$backdrop) {
                    this.$backdrop.addClass('loading');
                }
            }, 100);
        }
        else {
            setTimeout(() => {
                if (this.$backdrop) {
                    this.$backdrop.removeClass('loading');
                }
            }, 100);
        }
    }

    Popup.prototype.setShake = function() {
        var self = this;

        this.$content.addClass('popup-shaking');

        setTimeout(function() {
            self.$content.removeClass('popup-shaking');
        }, 1000)
    }

    Popup.prototype.hideLoading = function(val) {
        this.setLoading(false);

        // Wait for animations to complete
        var self = this;
        setTimeout(function() { self.setBackdrop(false) }, 250);
        setTimeout(function() { self.hide() }, 300);
    }

    Popup.prototype.triggerEvent = function(eventName, params) {
        if (!params) {
            params = [this.$el, this.$modal];
        }

        var eventObject = jQuery.Event(eventName, { relatedTarget: this.$container.get(0) });

        this.$el.trigger(eventObject, params);

        if (this.firstDiv) {
            this.firstDiv.trigger(eventObject, params);
        }
    }

    Popup.prototype.reload = function() {
        this.init();
    }

    Popup.prototype.show = function() {
        this.$modal.modal('show');
        this.triggerShowEvent();
    }

    Popup.prototype.triggerShowEvent = function() {
        this.$modal.on('click.dismiss.popup', '[data-dismiss="popup"]', $.proxy(this.hide, this));
        this.triggerEvent('popupShow');
        this.triggerEvent('show.oc.popup');

        // Fixes an issue where the Modal makes `position: fixed` elements relative to itself
        // https://github.com/twbs/bootstrap/issues/15856
        this.$dialog.css('transform', 'inherit');
    }

    Popup.prototype.hide = function() {
        if (!this.isOpen) return

        this.triggerEvent('popupHide');
        this.triggerEvent('hide.oc.popup');

        if (this.allowHide) {
            this.$modal.modal('hide');
        }

        // Fixes an issue where the Modal makes `position: fixed` elements relative to itself
        // https://github.com/twbs/bootstrap/issues/15856
        this.$dialog.css('transform', '');
    }

    /*
     * Hide the popup without destroying it,
     * you should call .hide() once finished
     */
    Popup.prototype.visible = function(val) {
        if (val) {
            this.$modal.addClass('show');
        }
        else {
            this.$modal.removeClass('show');
        }

        this.setBackdrop(val);
    }

    Popup.prototype.toggle = function() {
        this.triggerEvent('toggle.oc.popup', [this.$modal]);

        this.$modal.modal('toggle');
    }

    /*
     * Lock the popup from closing
     */
    Popup.prototype.lock = function(val) {
        this.allowHide = !val;
    }

    // POPUP PLUGIN DEFINITION
    // ============================

    var old = $.fn.popup;

    $.fn.popup = function(option) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var $this   = $(this)
            var data    = $this.data('oc.popup')
            var options = $.extend({}, Popup.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.popup', (data = new Popup(this, options)))
            else if (typeof option == 'string') data[option].apply(data, args)
            else data.reload()
        });
    }

    $.fn.popup.Constructor = Popup;

    $.popup = function(option) {
        return $('<a />').popup(option);
    }

    // POPUP NO CONFLICT
    // =================

    $.fn.popup.noConflict = function() {
        $.fn.popup = old;
        return this;
    }

    // POPUP DATA-API
    // ===============

    function paramToObj(name, value) {
        if (value === undefined) value = '';
        if (typeof value == 'object') return value;

        try {
            return oc.parseJSON("{" + value + "}");
        }
        catch (e) {
            throw new Error('Error parsing the '+name+' attribute value. '+e);
        }
    }

    $(document).on('click.oc.popup', '[data-control~="popup"]', function(event) {
        event.preventDefault();

        $(this).popup();
    });

    // Popup loading indicator will only show if the handlers are an exact match.
    $(document)
        // Prevent subsequent requests while loading (mis-doubleclick)
        .on('ajax:setup', '[data-popup-load-indicator]', function(event) {
            if ($(this).data('request') !== event.detail.context.handler) return;
            if (!$(this).closest('.control-popup').hasClass('show')) event.preventDefault();
        })
        // Hide popup during AJAX
        .on('ajax:promise', '[data-popup-load-indicator]', function(event) {
            if ($(this).data('request') !== event.detail.context.handler) return;
            $(this).closest('.control-popup').removeClass('show').popup('setLoading', true);
        })
        // Request failed, show popup again
        .on('ajax:fail', '[data-popup-load-indicator]', function(event) {
            if ($(this).data('request') !== event.detail.context.handler) return;
            $(this).closest('.control-popup').addClass('show').popup('setLoading', false).popup('setShake');
        })
        // Request complete, hide loader
        .on('ajax:done', '[data-popup-load-indicator]', function(event) {
            if ($(this).data('request') !== event.detail.context.handler) return;
            $(this).closest('.control-popup').popup('hideLoading');
        });

    oc.popup = Popup;

    // This function transfers the supplied variables as hidden form inputs,
    // to any popup that is spawned within the supplied container. The spawned
    // popup must contain a form element.
    oc.popup.bindToPopups = (container, vars) => {
        $(container).on('show.oc.popup', function(event, $trigger, $modal){
            var $form = $('form', $modal)
            $.each(vars, function(name, value){
                $form.prepend($('<input />').attr({ type: 'hidden', name: name, value: value }));
            });
        });
    };

    // This will focus the first element if no other autofocus attribute is found,
    // uses a specific delay to account for the CSS animations used by the modal.
    oc.popup.focusFirstInput = (container) => {
        setTimeout(function() {
            var $container = $(container);
            if (!$('[default-focus],[autofocus]', $container).length) {
                $('input.form-control:first', $container).focus();
            }
        }, 310);
    };

}(window.jQuery);

;
+(function($) {
    'use strict';

    class PopupStacker
    {
        constructor() {
            $(document).on('hidden.bs.modal', (ev) => this.onPopupHidden(ev));
            $(document).on('shown.bs.modal', (ev) => this.onPopupShown(ev));
            oc.Events.on(document, 'popup:show', (ev) => this.onPopupShowing(ev));
        }

        onPopupHidden(ev) {
            this.redrawStack();
            this.pullForward();
        }

        onPopupShowing(ev) {
            document.activeElement && document.activeElement.blur();
            this.redrawStack(true);
        }

        onPopupShown(ev) {
            var el = ev.target;

            if (!el.dataset.popupStackId) {
                el.dataset.popupStackId = this.generateUniqueId();
            }

            this.redrawStack();
        }

        pullForward() {
            const el = this.getFirstPopup();
            if (!el) {
                return;
            }

            const content = el.querySelector('.modal-content');
            if (content) {
                content.style.transform = null;
                content.style.transformOrigin = null;
                el.style.zIndex = null;

                // Wait for transition end (.3s)
                setTimeout(() => {
                    if (content) {
                        content.style.transition = null;
                    }
                }, 350);
            }

            const backdrop = el.previousElementSibling;
            if (backdrop && backdrop.classList.contains('popup-backdrop')) {
                backdrop.style.zIndex = null;
            }
        }

        redrawStack(isEarly) {
            let count = 0;

            this.getAllPopups().forEach((el) => {
                count++;

                // Push back popups before a new popup spawns
                let offset = count;
                if (!isEarly) {
                    offset--;

                    if (count === 1) {
                        return;
                    }
                }

                const content = el.querySelector('.modal-content');
                if (content && !content.classList.contains('popup-loading-indicator')) {
                    content.style.transform = `scale(.9) translate(-${2*offset}rem, -${50*offset}px)`;
                    content.style.transformOrigin = 'top left';
                    content.style.transition = 'all .3s';
                    el.style.zIndex = (490 - offset);
                }

                const backdrop = el.previousElementSibling;
                if (backdrop && backdrop.classList.contains('popup-backdrop')) {
                    backdrop.style.zIndex = (490 - offset);
                }
            });
        }

        getFirstPopup() {
            return this.getAllPopups()[0];
        }

        getAllPopups() {
            return Array.from(document.querySelectorAll('.modal.show[data-popup-stack-id]')).reverse();
        }

        generateUniqueId() {
            return "popupid-" + Math.floor(Math.random() * new Date().getTime());
        }
    }

    oc.popupStacker = new PopupStacker();

})($);

;
/*
 * Inspector Surface class.
 *
 * The class creates Inspector user interface and all the editors
 * corresponding to the passed configuration in a specified container
 * element.
 *
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.inspector === undefined)
        $.oc.inspector = {}

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    /**
     * Creates the Inspector surface in a container.
     * - containerElement container DOM element
     * - properties array (array of objects)
     * - values - property values, an object
     * - inspectorUniqueId - a string containing the unique inspector identifier.
     *   The identifier should be a constant for an inspectable element. Use
     *   $.oc.inspector.helpers.generateElementUniqueId(element) to generate a persistent ID
     *   for an element. Use $.oc.inspector.helpers.generateUniqueId() to generate an ID
     *   not associated with an element. Inspector uses the ID for storing configuration
     *   related to an element in the document DOM.
     */
    var Surface = function(containerElement, properties, values, inspectorUniqueId, options, parentSurface, group, propertyName) {
        if (inspectorUniqueId === undefined) {
            throw new Error('Inspector surface unique ID should be defined.')
        }

        this.options = $.extend({}, Surface.DEFAULTS, typeof options == 'object' && options)
        this.rawProperties = properties
        this.parsedProperties = $.oc.inspector.engine.processPropertyGroups(properties)
        this.container = containerElement
        this.inspectorUniqueId = inspectorUniqueId
        this.values = values !== null ? values : {}
        this.originalValues = $.extend(true, {}, this.values) // Clone the values hash
        this.idCounter = 1
        this.popupCounter = 0
        this.parentSurface = parentSurface
        this.propertyName = propertyName

        this.editors = []
        this.externalParameterEditors = []
        this.tableContainer = null
        this.groupManager = null
        this.group = null

        if (group !== undefined) {
            this.group = group
        }

        if (!this.parentSurface) {
            this.groupManager = new $.oc.inspector.groupManager(this.inspectorUniqueId)
        }

        Base.call(this)

        this.init()
    }

    Surface.prototype = Object.create(BaseProto)
    Surface.prototype.constructor = Surface

    Surface.prototype.dispose = function() {
        this.unregisterHandlers()
        this.disposeControls()
        this.disposeEditors()
        this.removeElements()
        this.disposeExternalParameterEditors()

        this.container = null
        this.tableContainer = null
        this.rawProperties = null
        this.parsedProperties = null
        this.editors = null
        this.externalParameterEditors = null
        this.values = null
        this.originalValues = null
        this.options.onChange = null
        this.options.onPopupDisplayed = null
        this.options.onPopupHidden = null
        this.options.onGetInspectableElement = null
        this.parentSurface = null
        this.groupManager = null
        this.group = null

        BaseProto.dispose.call(this)
    }

    // INTERNAL METHODS
    // ============================

    Surface.prototype.init = function() {
        if (this.groupManager && !this.group) {
            this.group = this.groupManager.createGroup('root')
        }

        this.build()

        if (!this.parentSurface) {
            $.oc.foundation.controlUtils.markDisposable(this.tableContainer)
        }

        this.registerHandlers()
    }

    Surface.prototype.registerHandlers = function() {
        if (!this.parentSurface) {
            $(this.tableContainer).one('dispose-control', this.proxy(this.dispose))
            $(this.tableContainer).on('click', 'tr.group, tr.control-group', this.proxy(this.onGroupClick))
            $(this.tableContainer).on('focus-control', this.proxy(this.focusFirstEditor))
        }
    }

    Surface.prototype.unregisterHandlers = function() {
        if (!this.parentSurface) {
            $(this.tableContainer).off('dispose-control', this.proxy(this.dispose))
            $(this.tableContainer).off('click', 'tr.group, tr.control-group', this.proxy(this.onGroupClick))
            $(this.tableContainer).off('focus-control', this.proxy(this.focusFirstEditor))
        }
    }

    Surface.prototype.getEventHandler = function(handler) {
        return $.oc.inspector.helpers.getEventHandler(this.getInspectableElement(), handler);
    }

    //
    // Building
    //

    /**
     * Builds the Inspector table. The markup generated by this method looks
     * like this:
     *
     * <div>
     *     <table>
     *         <tbody>
     *             <tr>
     *                 <th data-property="label">
     *                     <div>
     *                         <div>
     *                             <span class="title-element" title="Label">
     *                                 <a href="javascript:;" class="expandControl expanded" data-group-index="1">Expand/Collapse</a>
     *                                 Label
     *                             </span>
     *                         </div>
     *                     </div>
     *                 </th>
     *                 <td>
     *                     Editor markup
     *                 </td>
     *             </tr>
     *         </tbody>
     *     </table>
     * </div>
     */
    Surface.prototype.build = function() {
        this.tableContainer = document.createElement('div')

        var dataTable = document.createElement('table'),
            tbody = document.createElement('tbody')

        $.oc.foundation.element.addClass(dataTable, 'inspector-fields')
        if (this.parsedProperties.hasGroups) {
            $.oc.foundation.element.addClass(dataTable, 'has-groups')
        }

        var currentGroup = this.group

        for (var i=0, len = this.parsedProperties.properties.length; i < len; i++) {
            var property = this.parsedProperties.properties[i]

            if (property.itemType == 'group') {
                currentGroup = this.getGroupManager().createGroup(property.groupIndex, this.group)
            }
            else {
                if (property.groupIndex === undefined) {
                    currentGroup = this.group
                }
            }

            var row = this.buildRow(property, currentGroup)

            if (property.itemType == 'group') {
                this.applyGroupLevelToRow(row, currentGroup.parentGroup)
            }
            else {
                this.applyGroupLevelToRow(row, currentGroup)
            }

            tbody.appendChild(row)

            // Editor
            //
            this.buildEditor(row, property, dataTable, currentGroup)
        }

        dataTable.appendChild(tbody)
        this.tableContainer.appendChild(dataTable)

        this.container.appendChild(this.tableContainer)

        if (this.options.enableExternalParameterEditor) {
            this.buildExternalParameterEditor(tbody)
        }

        if (!this.parentSurface) {
            this.focusFirstEditor()
        }
    }

    Surface.prototype.moveToContainer = function(newContainer) {
        this.container = newContainer

        this.container.appendChild(this.tableContainer)
    }

    Surface.prototype.buildRow = function(property, group) {
        var row = document.createElement('tr'),
            th = document.createElement('th'),
            titleSpan = document.createElement('span'),
            description = this.buildPropertyDescription(property)

        // Table row
        //
        if (property.property) {
            row.setAttribute('data-property', property.property)
            row.setAttribute('data-property-path', this.getPropertyPath(property.property))
        }

        this.applyGroupIndexAttribute(property, row, group)
        $.oc.foundation.element.addClass(row, this.getRowCssClass(property, group))

        // Property head
        //
        this.applyHeadColspan(th, property)

        titleSpan.setAttribute('class', 'title-element')
        titleSpan.setAttribute('title', this.escapeJavascriptString(property.title))
        this.buildGroupExpandControl(titleSpan, property, false, false, group)

        titleSpan.innerHTML += this.escapeJavascriptString(property.title)

        var outerDiv = document.createElement('div'),
            innerDiv = document.createElement('div')

        innerDiv.appendChild(titleSpan)

        if (description) {
            innerDiv.appendChild(description)
        }

        outerDiv.appendChild(innerDiv)
        th.appendChild(outerDiv)
        row.appendChild(th)

        return row
    }

    Surface.prototype.focusFirstEditor = function() {
        if (this.editors.length == 0) {
            return
        }

        var groupManager = this.getGroupManager();

        for (var i = 0, len = this.editors.length; i < len; i++) {
            var editor = this.editors[i],
                group = editor.parentGroup;

            if (group && !this.groupManager.isGroupExpanded(group) ) {
                continue;
            }

            var externalParameterEditor = this.findExternalParameterEditor(editor.getPropertyName())

            if (externalParameterEditor && externalParameterEditor.isEditorVisible()) {
                externalParameterEditor.focus();
                return;
            }

            editor.focus();
            return;
        }
    }

    Surface.prototype.getRowCssClass = function(property, group) {
        var result = property.itemType

        if (property.itemType == 'property') {
            // result += ' grouped'
            if (group.parentGroup) {
                result += this.getGroupManager().isGroupExpanded(group) ? ' expanded' : ' collapsed'
            }
        }

        if (property.itemType == 'property' && !property.showExternalParam) {
            result += ' no-external-parameter'
        }

        return result
    }

    Surface.prototype.applyHeadColspan = function(th, property) {
        if (property.itemType == 'group') {
            th.setAttribute('colspan',  2)
        }
    }

    Surface.prototype.buildGroupExpandControl = function(titleSpan, property, force, hasChildSurface, group) {
        if (property.itemType !== 'group' && !force) {
            return
        }

        var groupIndex = this.getGroupManager().getGroupIndex(group),
            statusClass = this.getGroupManager().isGroupExpanded(group) ? 'expanded' : '',
            anchor = document.createElement('a')

        anchor.setAttribute('class', 'expandControl ' + statusClass)
        anchor.setAttribute('href', 'javascript:;')
        anchor.innerHTML = '<span>Expand/collapse</span>'

        titleSpan.appendChild(anchor)
    }

    Surface.prototype.buildPropertyDescription = function(property) {
        if (property.description === undefined || property.description === null) {
            return null;
        }

        var span = document.createElement('span');
        span.setAttribute('data-tooltip-text', this.escapeJavascriptString(property.description));
        span.setAttribute('class', 'info icon-info-circle-1 with-tooltip');

        return span;
    }

    Surface.prototype.buildExternalParameterEditor = function(tbody) {
        var rows = tbody.children

        for (var i = 0, len = rows.length; i < len; i++) {
            var row = rows[i],
                property = row.getAttribute('data-property')

            if ($.oc.foundation.element.hasClass(row, 'no-external-parameter') || !property) {
                continue
            }

            var propertyEditor = this.findPropertyEditor(property)
            if (propertyEditor && !propertyEditor.supportsExternalParameterEditor()) {
                continue
            }

            var cell = row.querySelector('td'),
                propertyDefinition = this.findPropertyDefinition(property),
                initialValue = this.getPropertyValue(property)

            if (initialValue === undefined) {
                initialValue = propertyEditor.getUndefinedValue()
            }

            var editor = new $.oc.inspector.externalParameterEditor(this, propertyDefinition, cell, initialValue)

            this.externalParameterEditors.push(editor)
        }
    }

    //
    // Field grouping
    //

    Surface.prototype.applyGroupIndexAttribute = function(property, row, group, isGroupedControl) {
        if (property.itemType == 'group' || isGroupedControl) {
            row.setAttribute('data-group-index', this.getGroupManager().getGroupIndex(group))
            row.setAttribute('data-parent-group-index', this.getGroupManager().getGroupIndex(group.parentGroup))
        }
        else {
            if (group.parentGroup) {
                row.setAttribute('data-parent-group-index', this.getGroupManager().getGroupIndex(group))
            }
        }
    }

    Surface.prototype.applyGroupLevelToRow = function(row, group) {
        if (row.hasAttribute('data-group-level')) {
            return;
        }

        var th = this.getRowHeadElement(row);

        if (th === null) {
            throw new Error('Cannot find TH element for the Inspector row');
        }

        var groupLevel = group.getLevel();

        row.setAttribute('data-group-level', groupLevel)
        th.children[0].style.marginLeft = groupLevel*10 + 'px'
    }

    Surface.prototype.toggleGroup = function(row, forceExpand) {
        var link = row.querySelector('a'),
            groupIndex = row.getAttribute('data-group-index'),
            table = this.getRootTable(),
            groupManager = this.getGroupManager(),
            collapse = true

        if ($.oc.foundation.element.hasClass(link, 'expanded') && !forceExpand) {
            $.oc.foundation.element.removeClass(link, 'expanded')
        }
        else {
            $.oc.foundation.element.addClass(link, 'expanded')
            collapse = false
        }

        var propertyRows = groupManager.findGroupRows(table, groupIndex, !collapse),
            duration = Math.round(50 / propertyRows.length)

        this.expandOrCollapseRows(propertyRows, collapse, duration, forceExpand)
        groupManager.setGroupStatus(groupIndex, !collapse)
    }

    Surface.prototype.expandGroupParents = function(group) {
        var groups = group.getGroupAndAllParents(),
            table = this.getRootTable()

        for (var i = groups.length-1; i >= 0; i--) {
            var row = groups[i].findGroupRow(table)

            if (row) {
                this.toggleGroup(row, true)
            }
        }
    }

    Surface.prototype.expandOrCollapseRows = function(rows, collapse, duration, noAnimation) {
        var row = rows.pop(),
            self = this

        if (row) {
            if (!noAnimation) {
                setTimeout(function toggleRow() {
                    $.oc.foundation.element.toggleClass(row, 'collapsed', collapse)
                    $.oc.foundation.element.toggleClass(row, 'expanded', !collapse)

                    self.expandOrCollapseRows(rows, collapse, duration, noAnimation)
                }, duration)
            }
            else {
                $.oc.foundation.element.toggleClass(row, 'collapsed', collapse)
                $.oc.foundation.element.toggleClass(row, 'expanded', !collapse)

                self.expandOrCollapseRows(rows, collapse, duration, noAnimation)
            }
        }
    }

    Surface.prototype.getGroupManager = function() {
        return this.getRootSurface().groupManager
    }

    //
    // Editors
    //

    Surface.prototype.buildEditor = function(row, property, dataTable, group) {
        if (property.itemType !== 'property') {
            return
        }

        this.validateEditorType(property.type)

        var cell = document.createElement('td'),
            type = property.type

        row.appendChild(cell)

        if (type === undefined) {
            type = 'string'
        }

        var editor = new $.oc.inspector.propertyEditors[type](this, property, cell, group)

        if (editor.isGroupedEditor()) {
            $.oc.foundation.element.addClass(dataTable, 'has-groups')
            $.oc.foundation.element.addClass(row, 'control-group')

            this.applyGroupIndexAttribute(property, row, editor.group, true)
            this.buildGroupExpandControl(row.querySelector('span.title-element'), property, true, editor.hasChildSurface(), editor.group)

            if (cell.children.length == 0) {
                // If the editor hasn't added any elements to the cell,
                // and it's a grouped control, remove the cell and
                // make the group title full-width.
                row.querySelector('th').setAttribute('colspan', 2)
                row.removeChild(cell)
            }
        }

        this.editors.push(editor)
    }

    Surface.prototype.generateSequencedId = function() {
        this.idCounter ++

        return this.inspectorUniqueId + '-' + this.idCounter
    }

    //
    // Internal API for the editors
    //

    Surface.prototype.getPropertyValue = function(property) {
        return this.values[property]
    }

    Surface.prototype.setPropertyValue = function(property, value, supressChangeEvents, forceEditorUpdate) {
        if (value !== undefined) {
            this.values[property] = value
        }
        else {
            if (this.values[property] !== undefined) {
                delete this.values[property]
            }
        }

        if (!supressChangeEvents) {
            if (this.originalValues[property] === undefined || !this.comparePropertyValues(this.originalValues[property], value)) {
                this.markPropertyChanged(property, true)
            }
            else {
                this.markPropertyChanged(property, false)
            }

            var propertyPath = this.getPropertyPath(property)
            this.getRootSurface().notifyEditorsPropertyChanged(propertyPath, value)

            if (this.options.onChange !== null) {
                this.options.onChange(property, value)
            }
        }

        if (forceEditorUpdate) {
            var editor = this.findPropertyEditor(property)
            if (editor) {
                editor.updateDisplayedValue(value)
            }
        }

        return value
    }

    Surface.prototype.notifyEditorsPropertyChanged = function(propertyPath, value) {
        // Editors use this event to watch changes in properties
        // they depend on. All editors should be notified, including
        // editors in nested surfaces. The property name is passed as a
        // path object.property (if the property is nested), so that
        // property depenencies could be defined as
        // ['property', 'object.property']

        for (var i = 0, len = this.editors.length; i < len; i++) {
            var editor = this.editors[i]

            editor.onInspectorPropertyChanged(propertyPath, value)
            editor.notifyChildSurfacesPropertyChanged(propertyPath, value)
        }
    }

    Surface.prototype.makeCellActive = function(cell) {
        var tbody = cell.parentNode.parentNode.parentNode, // cell / row / tbody
            cells = tbody.querySelectorAll('tr td')

        for (var i = 0, len = cells.length; i < len; i++) {
            $.oc.foundation.element.removeClass(cells[i], 'active')
        }

        $.oc.foundation.element.addClass(cell, 'active')
    }

    Surface.prototype.markPropertyChanged = function(property, changed) {
        var propertyPath = this.getPropertyPath(property),
            row = this.tableContainer.querySelector('tr[data-property-path="'+propertyPath+'"]')

        if (changed) {
            $.oc.foundation.element.addClass(row, 'changed')
        }
        else {
            $.oc.foundation.element.removeClass(row, 'changed')
        }
    }

    Surface.prototype.findPropertyEditor = function(property) {
        for (var i = 0, len = this.editors.length; i < len; i++) {
            if (this.editors[i].getPropertyName() == property) {
                return this.editors[i]
            }
        }

        return null
    }

    Surface.prototype.findExternalParameterEditor = function(property) {
        for (var i = 0, len = this.externalParameterEditors.length; i < len; i++) {
            if (this.externalParameterEditors[i].getPropertyName() == property) {
                return this.externalParameterEditors[i]
            }
        }

        return null
    }

    Surface.prototype.findPropertyDefinition = function(property) {
        for (var i=0, len = this.parsedProperties.properties.length; i < len; i++) {
            var definition = this.parsedProperties.properties[i]

            if (definition.property == property) {
                return definition
            }
        }

        return null
    }

    Surface.prototype.validateEditorType = function(type) {
        if (type === undefined) {
            type = 'string'
        }

        if ($.oc.inspector.propertyEditors[type] === undefined) {
            throw new Error('The Inspector editor class "' + type +
                '" is not defined in the $.oc.inspector.propertyEditors namespace.')
        }
    }

    Surface.prototype.popupDisplayed = function() {
        if (this.popupCounter === 0 && this.options.onPopupDisplayed !== null) {
            this.options.onPopupDisplayed()
        }

        this.popupCounter++
    }

    Surface.prototype.popupHidden = function() {
        this.popupCounter--

        if (this.popupCounter < 0) {
            this.popupCounter = 0
        }

        if (this.popupCounter === 0 && this.options.onPopupHidden !== null) {
            this.options.onPopupHidden()
        }
    }

    Surface.prototype.getInspectableElement = function() {
        if (this.options.onGetInspectableElement !== null) {
            return this.options.onGetInspectableElement()
        }
    }

    Surface.prototype.getPropertyPath = function(propertyName) {
        var result = [],
            current = this

        result.push(propertyName)

        while (current) {
            if (current.propertyName) {
                result.push(current.propertyName)
            }

            current = current.parentSurface
        }

        result.reverse()

        return result.join('.')
    }

    Surface.prototype.findDependentProperties = function(propertyName) {
        var dependents = []

        for (var i in this.rawProperties) {
            var property = this.rawProperties[i]

            if (!property.depends) {
                continue
            }

            if (property.depends.indexOf(propertyName) !== -1) {
                dependents.push(property.property)
            }
        }

        return dependents
    }

    //
    // Nested surfaces support
    //

    Surface.prototype.mergeChildSurface = function(surface, mergeAfterRow) {
        var rows = surface.tableContainer.querySelectorAll('table.inspector-fields > tbody > tr')

        surface.tableContainer = this.getRootSurface().tableContainer

        for (var i = rows.length-1; i >= 0; i--) {
            var row = rows[i]

            mergeAfterRow.parentNode.insertBefore(row, mergeAfterRow.nextSibling)
            this.applyGroupLevelToRow(row, surface.group)
        }
    }

    Surface.prototype.getRowHeadElement = function(row) {
        for (var i = row.children.length-1; i >= 0; i--) {
            var element = row.children[i]

            if (element.tagName === 'TH') {
                return element
            }
        }

        return null
    }

    Surface.prototype.getInspectorUniqueId = function() {
        return this.inspectorUniqueId
    }

    Surface.prototype.getRootSurface = function() {
        var current = this

        while (current) {
            if (!current.parentSurface) {
                return current
            }

            current = current.parentSurface
        }
    }

    //
    // Disposing
    //

    Surface.prototype.removeElements = function() {
        if (!this.parentSurface) {
            this.tableContainer.parentNode.removeChild(this.tableContainer);
        }
    }

    Surface.prototype.disposeEditors = function() {
        for (var i = 0, len = this.editors.length; i < len; i++) {
            var editor = this.editors[i]

            editor.dispose()
        }
    }

    Surface.prototype.disposeExternalParameterEditors = function() {
        for (var i = 0, len = this.externalParameterEditors.length; i < len; i++) {
            var editor = this.externalParameterEditors[i]

            editor.dispose()
        }
    }

    Surface.prototype.disposeControls = function() {
        var tooltipControls = this.tableContainer.querySelectorAll('.with-tooltip')

        for (var i = 0, len = tooltipControls.length; i < len; i++) {
            $(tooltipControls[i]).tooltip('dispose');
        }
    }

    //
    // Helpers
    //

    Surface.prototype.escapeJavascriptString = function(str) {
        var div = document.createElement('div')
        div.appendChild(document.createTextNode(str))
        return div.innerHTML
    }

    Surface.prototype.comparePropertyValues = function(oldValue, newValue) {
        if (oldValue === undefined && newValue !== undefined) {
            return false
        }

        if (oldValue !== undefined && newValue === undefined) {
            return false
        }

        if (typeof oldValue == 'object' && typeof newValue == 'object') {
            return JSON.stringify(oldValue) == JSON.stringify(newValue)
        }

        return oldValue == newValue
    }

    Surface.prototype.getRootTable = function() {
        return this.getRootSurface().container.querySelector('table.inspector-fields')
    }

    //
    // External API
    //

    Surface.prototype.getValues = function() {
        var result = {}

        for (var i=0, len = this.parsedProperties.properties.length; i < len; i++) {
            var property = this.parsedProperties.properties[i]

            if (property.itemType !== 'property') {
                continue
            }

            var value = null,
                externalParameterEditor = this.findExternalParameterEditor(property.property)

            if (!externalParameterEditor || !externalParameterEditor.isEditorVisible()) {
                value = this.getPropertyValue(property.property)

                var editor = this.findPropertyEditor(property.property)

                if (value === undefined) {
                    if (editor) {
                        value = editor.getUndefinedValue()
                    }
                    else {
                        value = property.default
                    }
                }

                if (value === $.oc.inspector.removedProperty) {
                    continue
                }

                if (property.ignoreIfEmpty !== undefined && (property.ignoreIfEmpty === true || property.ignoreIfEmpty === "true") && editor) {
                    if (editor.isEmptyValue(value)) {
                        continue
                    }
                }

                if (property.ignoreIfDefault !== undefined && (property.ignoreIfDefault === true || property.ignoreIfDefault === "true") && editor) {
                    if (property.default === undefined) {
                        throw new Error('The ignoreIfDefault feature cannot be used without the default property value.')
                    }

                    if (this.comparePropertyValues(value, property.default)) {
                        continue
                    }
                }
            }
            else {
                value = externalParameterEditor.getValue()
                value = '{{ ' + value + ' }}'
            }

            result[property.property] = value
        }

        return result
    }

    Surface.prototype.getValidValues = function() {
        var allValues = this.getValues(),
            result = {}

        for (var property in allValues) {
            var editor = this.findPropertyEditor(property)

            if (!editor) {
                throw new Error('Cannot find editor for property ' + property)
            }

            var externalEditor = this.findExternalParameterEditor(property)
            if (externalEditor && externalEditor.isEditorVisible() && !externalEditor.validate(true)) {
                result[property] = $.oc.inspector.invalidProperty
                continue
            }

            if (!editor.validate(true)) {
                result[property] = $.oc.inspector.invalidProperty
                continue
            }

            result[property] = allValues[property]
        }

        return result
    }

    Surface.prototype.validate = function(silentMode) {
        this.getGroupManager().unmarkInvalidGroups(this.getRootTable())

        for (var i = 0, len = this.editors.length; i < len; i++) {
            var editor = this.editors[i],
                externalEditor = this.findExternalParameterEditor(editor.propertyDefinition.property)

            if (externalEditor && externalEditor.isEditorVisible()) {
                if (!externalEditor.validate(silentMode)) {
                    if (!silentMode) {
                        editor.markInvalid()
                    }
                    return false
                }
                else {
                    continue
                }
            }

            if (!editor.validate(silentMode)) {
                if (!silentMode) {
                    editor.markInvalid()
                }
                return false
            }
        }

        return true
    }

    Surface.prototype.hasChanges = function(originalValues) {
        var values = originalValues !== undefined ? originalValues : this.originalValues

        return !this.comparePropertyValues(values, this.getValues())
    }

    // EVENT HANDLERS
    //

    Surface.prototype.onGroupClick = function(ev) {
        var row = ev.currentTarget

        this.toggleGroup(row)

        $.oc.foundation.event.stop(ev)
        return false
    }

    // DEFAULT OPTIONS
    // ============================

    Surface.DEFAULTS = {
        enableExternalParameterEditor: false,
        onChange: null,
        onPopupDisplayed: null,
        onPopupHidden: null,
        onGetInspectableElement: null
    }

    // REGISTRATION
    // ============================

    $.oc.inspector.surface = Surface
    $.oc.inspector.removedProperty = {removed: true}
    $.oc.inspector.invalidProperty = {invalid: true}
}(window.jQuery);

;
/*
 * Inspector management functions.
 *
 * Watches inspectable elements clicks and creates Inspector surfaces in popups
 * and containers.
 */
+function ($) { "use strict";
    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var InspectorManager = function() {
        Base.call(this);

        this.init();
    }

    InspectorManager.prototype = Object.create(BaseProto);
    InspectorManager.prototype.constructor = Base;

    InspectorManager.prototype.init = function() {
        $(document).on('click', '[data-inspectable]', this.proxy(this.onInspectableClicked));
    }

    InspectorManager.prototype.getContainerElement = function($element) {
        var $containerHolder = $element.closest('[data-inspector-container]');
        if ($containerHolder.length === 0) {
            return null;
        }

        var $container = $containerHolder.find($containerHolder.data('inspector-container'));
        if ($container.length === 0) {
            throw new Error('Inspector container ' + $containerHolder.data['inspector-container'] + ' element is not found.');
        }

        return $container;
    }

    InspectorManager.prototype.loadElementOptions = function($element) {
        var options = {};

        // Only specific options are allowed, don't load all options with data()
        if ($element.data('inspector-css-class')) {
            options.inspectorCssClass = $element.data('inspector-css-class');
        }

        return options;
    }

    InspectorManager.prototype.createInspectorPopup = function($element, containerSupported) {
        var options = $.extend(this.loadElementOptions($element), {
                containerSupported: containerSupported
            });

        new $.oc.inspector.wrappers.popup($element, null, options);
    }

    InspectorManager.prototype.createInspectorContainer = function($element, $container) {
        var options = $.extend(this.loadElementOptions($element), {
                containerSupported: true,
                container: $container
            });

        new $.oc.inspector.wrappers.container($element, null, options);
    }

    InspectorManager.prototype.switchToPopup = function(wrapper) {
        var options = $.extend(this.loadElementOptions(wrapper.$element), {
                containerSupported: true
            })

        new $.oc.inspector.wrappers.popup(wrapper.$element, wrapper, options)

        wrapper.cleanupAfterSwitch();
        this.setContainerPreference(false);
    }

    InspectorManager.prototype.switchToContainer = function(wrapper) {
        var $container = this.getContainerElement(wrapper.$element),
            options = $.extend(this.loadElementOptions(wrapper.$element), {
                containerSupported: true,
                container: $container
            });

        if (!$container) {
            throw new Error('Cannot switch to container: a container element is not found');
        }

        new $.oc.inspector.wrappers.container(wrapper.$element, wrapper, options);

        wrapper.cleanupAfterSwitch();
        this.setContainerPreference(true);
    }

    InspectorManager.prototype.createInspector = function(element) {
        var $element = $(element);

        if ($element.data('oc.inspectorVisible')) {
            return false;
        }

        var $container = this.getContainerElement($element);

        // If there's no container option, create the Inspector popup
        if (!$container) {
            this.createInspectorPopup($element, false);
        }
        else {
            // If the container is already in use, apply values to the inspectable elements
            if (!this.applyValuesFromContainer($container) || !this.containerHidingAllowed($container)) {
                return;
            }

            // Dispose existing container wrapper, if any
            $.oc.foundation.controlUtils.disposeControls($container.get(0));

            if (!this.getContainerPreference()) {
                // If container is not a preferred option, create Inspector popup
                this.createInspectorPopup($element, true);
            }
            else {
                // Otherwise, create Inspector in the container
                this.createInspectorContainer($element, $container);
            }
        }
    }

    InspectorManager.prototype.getContainerPreference = function() {
        try {
            return localStorage.getItem('oc.inspectorUseContainer') === "true";
        } catch (e) {
            return false;
        }
    }

    InspectorManager.prototype.setContainerPreference = function(value) {
        try {
            localStorage.setItem('oc.inspectorUseContainer', value ? "true" : "false");
        } catch (e) {
            // localStorage not available
        }
    }

    InspectorManager.prototype.applyValuesFromContainer = function($container) {
        var applyEvent = $.Event('apply.oc.inspector');

        $container.trigger(applyEvent);
        return !applyEvent.isDefaultPrevented();
    }

    InspectorManager.prototype.containerHidingAllowed = function($container) {
        var allowedEvent = $.Event('beforeContainerHide.oc.inspector');

        $container.trigger(allowedEvent);
        return !allowedEvent.isDefaultPrevented();
    }

    InspectorManager.prototype.onInspectableClicked = function(ev) {
        var $element = $(ev.currentTarget);

        if (this.createInspector($element) === false) {
            return false;
        }

        ev.stopPropagation();
        return false;
    }

    $.oc.inspector.manager = new InspectorManager();

    $.fn.inspector = function () {
        return this.each(function () {
            $.oc.inspector.manager.createInspector(this);
        })
    }
}(window.jQuery);

;
/*
 * Inspector wrapper base class.
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

    if ($.oc.inspector === undefined)
        $.oc.inspector = {}

    if ($.oc.inspector.wrappers === undefined)
        $.oc.inspector.wrappers = {}

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var BaseWrapper = function($element, sourceWrapper, options) {
        this.$element = $element

        this.options = $.extend({}, BaseWrapper.DEFAULTS, typeof options == 'object' && options)
        this.switched = false
        this.configuration = null

        Base.call(this)

        if (!sourceWrapper) {
            if (!this.triggerShowingAndInit()) {
                // this.init() is called inside triggerShowing()

                return
            }

            this.surface = null
            this.title = null
            this.description = null
        }
        else {
            this.surface = sourceWrapper.surface
            this.title = sourceWrapper.title
            this.description = sourceWrapper.description

            sourceWrapper = null

            this.init()
        }
    }

    BaseWrapper.prototype = Object.create(BaseProto)
    BaseWrapper.prototype.constructor = Base

    BaseWrapper.prototype.dispose = function() {
        if (!this.switched) {
            this.$element.removeClass('inspector-open');
            this.setInspectorVisibleFlag(false);

            this.$element.trigger('hidden.oc.inspector');
        }

        if (this.surface !== null && this.surface.options.onGetInspectableElement === this.proxy(this.onGetInspectableElement)) {
            this.surface.options.onGetInspectableElement = null;
        }

        this.surface = null;
        this.$element = null;
        this.title = null;
        this.description = null;
        this.configuration = null;

        BaseProto.dispose.call(this)
    }

    BaseWrapper.prototype.init = function() {
        // Wrappers can create a new surface or inject an existing
        // surface to the UI they manage.
        //
        // If there is no surface provided in the wrapper constructor,
        // the wrapper first loads the Inspector configuration and values
        // and then calls the createSurfaceAndUi() method with all information
        // required for creating a new Inspector surface and UI.

        if (!this.surface) {
            this.loadConfiguration()
        }
        else {
            this.adoptSurface()
        }

        this.$element.addClass('inspector-open')
        this.$element.trigger('showed.oc.inspector')
    }

    //
    // Helper methods
    //

    BaseWrapper.prototype.getElementValuesInput = function() {
        return this.$element.find('> input[data-inspector-values]')
    }

    BaseWrapper.prototype.normalizePropertyCode = function(code, configuration) {
        var lowerCaseCode = code.toLowerCase()

        for (var index in configuration) {
            var propertyInfo = configuration[index]

            if (propertyInfo.property.toLowerCase() == lowerCaseCode) {
                return propertyInfo.property
            }
        }

        return code
    }

    BaseWrapper.prototype.isExternalParametersEditorEnabled = function() {
        return this.$element.closest('[data-inspector-external-parameters]').length > 0
    }

    BaseWrapper.prototype.initSurface = function(containerElement, properties, values) {
        var options = this.$element.data() || {}

        options.enableExternalParameterEditor = this.isExternalParametersEditorEnabled()
        options.onGetInspectableElement = this.proxy(this.onGetInspectableElement)

        this.surface = new $.oc.inspector.surface(
            containerElement,
            properties,
            values,
            $.oc.inspector.helpers.generateElementUniqueId(this.$element.get(0)),
            options)
    }

    BaseWrapper.prototype.isLiveUpdateEnabled = function() {
        return false
    }

    //
    // Wrapper API
    //

    BaseWrapper.prototype.createSurfaceAndUi = function(properties, values) {

    }

    BaseWrapper.prototype.setInspectorVisibleFlag = function(value) {
        this.$element.data('oc.inspectorVisible', value)
    }

    BaseWrapper.prototype.adoptSurface = function() {
        this.surface.options.onGetInspectableElement = this.proxy(this.onGetInspectableElement)
    }

    BaseWrapper.prototype.cleanupAfterSwitch = function() {
        this.switched = true
        this.dispose()
    }

    //
    // Values
    //

    BaseWrapper.prototype.loadValues = function(configuration) {
        var $valuesField = this.getElementValuesInput();

        if ($valuesField.length > 0) {
            var valuesStr = $.trim($valuesField.val());

            try {
                return valuesStr.length === 0 ? {} : JSON.parse(valuesStr);
            }
            catch (err) {
                throw new Error('Error parsing Inspector field values. ' + err);
            }
        }

        var values = {},
            attributes = this.$element.get(0).attributes;

        for (var i=0, len = attributes.length; i < len; i++) {
            var attribute = attributes[i],
                matches = [];

            if (matches = attribute.name.match(/^data-property-(.*)$/)) {
                // Important - values contained in data-property-xxx attributes are
                // considered strings and only parsed with JSON when they begin with
                // the json: protocol prefix.
                var normalizedPropertyName = this.normalizePropertyCode(matches[1], configuration),
                    attrVal = attribute.value;

                if (attrVal.startsWith('json:')) {
                    try {
                        attrVal = JSON.parse(decodeURIComponent(attrVal.substring(5)));
                    }
                    catch (e) {
                        attrVal = '';
                    }
                }

                values[normalizedPropertyName] = attrVal;
            }
        }

        return values;
    }

    BaseWrapper.prototype.applyValues = function(liveUpdateMode) {
        var $valuesField = this.getElementValuesInput(),
            values = liveUpdateMode
                ? this.surface.getValidValues()
                : this.surface.getValues();

        if (liveUpdateMode) {
            // In the live update mode, when only valid values are applied,
            // we don't want to change all other values (invalid properties).
            var existingValues = this.loadValues(this.configuration);
            for (var property in values) {
                if (values[property] !== $.oc.inspector.invalidProperty) {
                    existingValues[property] = values[property];
                }
            }

            // Properties that use settings like ignoreIfPropertyEmpty could
            // be removed from the list returned by getValidValues(). Removed
            // properties should be removed from the result list.
            var filteredValues = {};

            for (var property in existingValues) {
                if (values.hasOwnProperty(property)) {
                    filteredValues[property] = existingValues[property];
                }
            }

            values = filteredValues;
        }

        if ($valuesField.length > 0) {
            $valuesField.val(JSON.stringify(values));
        }
        else {
            for (var property in values) {
                var value = values[property];

                if (Array.isArray(value) || $.isPlainObject(value)) {
                    value = 'json:' + encodeURIComponent(JSON.stringify(value));
                }

                this.$element.attr('data-property-' + property, value);
            }
        }

        // In the live update mode the livechange event is triggered
        // regardless of whether Surface properties match or don't match
        // the original properties of the inspectable element. Without it
        // there could be undesirable side effects.

        if (liveUpdateMode) {
            this.$element.trigger('livechange');
        }
        else {
            var hasChanges = false;

            if (this.isLiveUpdateEnabled()) {
                var currentValues = this.loadValues(this.configuration);

                // If the Inspector setup supports the live update mode,
                // evaluate changes as a difference between the current element
                // properties and internal properties stored in the Surface.
                // If there is no differences, the properties have already
                // been applied with a preceding live update.
                hasChanges = this.surface.hasChanges(currentValues);
            }
            else {
                hasChanges = this.surface.hasChanges();
            }

            if (hasChanges) {
                this.$element.trigger('change');
            }
        }
    }

    //
    // Configuration
    //

    BaseWrapper.prototype.loadConfiguration = function() {
        var configString = this.$element.data('inspector-config'),
            result = {
                properties: {},
                title: null,
                description: null
            };

        result.title = this.$element.data('inspector-title');
        result.description = this.$element.data('inspector-description');

        if (configString !== undefined) {
            result.properties = this.parseConfiguration(configString);

            this.configurationLoaded(result);
            return;
        }

        var $configurationField = this.$element.find('> input[data-inspector-config]');

        if ($configurationField.length > 0) {
            result.properties = this.parseConfiguration($configurationField.val());
            this.configurationLoaded(result);
            return;
        }

        var $form = this.$element.closest('form'),
            data = this.$element.data(),
            self = this;

        $.oc.stripeLoadIndicator.show();

        $form.request($.oc.inspector.helpers.getEventHandler(this.$element, 'onGetInspectorConfiguration'), {
            data: data
        })
        .done(function inspectorConfigurationRequestDoneClosure(data) {
            self.onConfigurationRequestDone(data, result);
        })
        .fail(function inspectorConfigurationRequestErrorClosure(data) {
            self.$element.trigger('error.oc.inspector');
        })
        .always(function() {
            $.oc.stripeLoadIndicator.hide();
        });
    }

    BaseWrapper.prototype.parseConfiguration = function(configuration) {
        if (!Array.isArray(configuration) && !$.isPlainObject(configuration)) {
            if ($.trim(configuration) === 0) {
                return {};
            }

            try {
               return JSON.parse(configuration);
            }
            catch(err) {
                throw new Error('Error parsing Inspector configuration. ' + err);
            }
        }
        else {
            return configuration;
        }
    }

    BaseWrapper.prototype.configurationLoaded = function(configuration) {
        var values = this.loadValues(configuration.properties);

        this.title = configuration.title;
        this.description = configuration.description;
        this.configuration = configuration;

        this.createSurfaceAndUi(configuration.properties, values);
    }

    BaseWrapper.prototype.onConfigurationRequestDone = function(data, result) {
        result.properties = this.parseConfiguration(data.configuration.properties)

        if (data.configuration.title !== undefined) {
            result.title = data.configuration.title
        }

        if (data.configuration.description !== undefined) {
            result.description = data.configuration.description
        }

        this.configurationLoaded(result)
    }

    //
    // Events
    //

    BaseWrapper.prototype.triggerShowingAndInit = function() {
        var e = $.Event('showing.oc.inspector');

        this.$element.trigger(e, [{callback: this.proxy(this.init)}]);
        if (e.isDefaultPrevented()) {
            this.$element = null;

            return false;
        }

        if (!e.isPropagationStopped()) {
            this.init();
        }
    }

    BaseWrapper.prototype.triggerHiding = function() {
        var hidingEvent = $.Event('hiding.oc.inspector'),
            values = this.surface.getValues()

        this.$element.trigger(hidingEvent, [{values: values}])
        return !hidingEvent.isDefaultPrevented();
    }

    BaseWrapper.prototype.onGetInspectableElement = function() {
        return this.$element;
    }

    BaseWrapper.DEFAULTS = {
        containerSupported: false
    };

    $.oc.inspector.wrappers.base = BaseWrapper;
}(window.jQuery);
;
/*
 * Inspector popup wrapper.
 */
+function ($) { "use strict";

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.inspector.wrappers.base,
        BaseProto = Base.prototype

    var InspectorPopup = function($element, surface, options) {
        this.$popoverContainer = null
        this.popoverObj = null
        this.cleaningUp = false

        Base.call(this, $element, surface, options)
    }

    InspectorPopup.prototype = Object.create(BaseProto)
    InspectorPopup.prototype.constructor = Base

    InspectorPopup.prototype.dispose = function() {
        this.unregisterHandlers();

        this.$popoverContainer = null;
        this.popoverObj = null;

        BaseProto.dispose.call(this);
    }

    InspectorPopup.prototype.createSurfaceAndUi = function(properties, values, title, description) {
        this.showPopover();

        this.initSurface(this.$popoverContainer.find('[data-surface-container]').get(0), properties, values);
        this.repositionPopover();

        this.registerPopupHandlers();
    }

    InspectorPopup.prototype.adoptSurface = function() {
        this.showPopover();

        this.surface.moveToContainer(this.$popoverContainer.find('[data-surface-container]').get(0));
        this.repositionPopover();

        this.registerPopupHandlers();

        BaseProto.adoptSurface.call(this);
    }

    InspectorPopup.prototype.cleanupAfterSwitch = function() {
        this.cleaningUp = true;
        this.switched = true;

        this.forceClose();

        // The parent cleanupAfterSwitch() is not called because
        // disposing happens in onHide() triggered by forceClose()
    }

    InspectorPopup.prototype.getPopoverContents = function() {
        return '<div class="popover-head">                          \
                    <h3 data-inspector-title></h3>                  \
                    <p data-inspector-description></p>              \
                    <button type="button" class="btn-close"         \
                        data-dismiss="popover"                      \
                        aria-hidden="true"></button>                \
                </div>                                              \
                <form autocomplete="off" onsubmit="return false">   \
                    <div data-surface-container></div>              \
                <form>'
    }

    InspectorPopup.prototype.showPopover = function() {
        var offset = this.$element.data('inspector-offset'),
            offsetX = this.$element.data('inspector-offset-x'),
            offsetY = this.$element.data('inspector-offset-y'),
            placement = this.$element.data('inspector-placement'),
            fallbackPlacement = this.$element.data('inspector-fallback-placement');

        if (offset === undefined) {
            offset = 15;
        }

        if (placement === undefined) {
            placement = 'bottom';
        }

        if (fallbackPlacement === undefined) {
            fallbackPlacement = 'bottom';
        }

        this.$element.ocPopover({
            content: this.getPopoverContents(),
            highlightModalTarget: true,
            modal: true,
            placement: placement,
            fallbackPlacement: fallbackPlacement,
            containerClass: 'control-inspector',
            container:  this.$element.data('inspector-container'),
            offset: offset,
            offsetX: offsetX,
            offsetY: offsetY,
            width: 450
        });

        this.setInspectorVisibleFlag(true);

        this.popoverObj = this.$element.data('oc.popover');
        this.$popoverContainer = this.popoverObj.$container;

        this.$popoverContainer.addClass('inspector-temporary-placement');

        if (this.options.inspectorCssClass !== undefined) {
            this.$popoverContainer.addClass(this.options.inspectorCssClass);
        }

        if (this.options.containerSupported) {
            var moveToContainerButton = $('<span class="inspector-move-to-container oc-icon-download">');
            this.$popoverContainer.find('.popover-head').append(moveToContainerButton);
        }

        this.$popoverContainer.find('[data-inspector-title]').text(this.title);
        this.$popoverContainer.find('[data-inspector-description]').text(this.description);
    }

    InspectorPopup.prototype.repositionPopover = function() {
        this.popoverObj.reposition();
        this.$popoverContainer.removeClass('inspector-temporary-placement');
        this.$popoverContainer.find('div[data-surface-container] > div').trigger('focus-control');
    }

    InspectorPopup.prototype.forceClose = function() {
        oc.dispatch('close.oc.popover', { target: this.$popoverContainer.get(0) })
    }

    InspectorPopup.prototype.registerPopupHandlers = function() {
        this.surface.options.onPopupDisplayed = this.proxy(this.onPopupEditorDisplayed)
        this.surface.options.onPopupHidden = this.proxy(this.onPopupEditorHidden)
        this.popoverObj.options.onCheckDocumentClickTarget = this.proxy(this.onCheckDocumentClickTarget)

        this.$element.on('hiding.oc.popover', this.proxy(this.onBeforeHide))
        this.$element.on('hide.oc.popover', this.proxy(this.onHide))
        this.$popoverContainer.on('keydown', this.proxy(this.onPopoverKeyDown))

        if (this.options.containerSupported) {
            this.$popoverContainer.on('click', 'span.inspector-move-to-container', this.proxy(this.onMoveToContainer))
        }
    }

    InspectorPopup.prototype.unregisterHandlers = function() {
        this.popoverObj.options.onCheckDocumentClickTarget = null

        this.$element.off('hiding.oc.popover', this.proxy(this.onBeforeHide))
        this.$element.off('hide.oc.popover', this.proxy(this.onHide))
        this.$popoverContainer.off('keydown', this.proxy(this.onPopoverKeyDown))

        if (this.options.containerSupported) {
            this.$popoverContainer.off('click', 'span.inspector-move-to-container', this.proxy(this.onMoveToContainer))
        }

        this.surface.options.onPopupDisplayed = null
        this.surface.options.onPopupHidden = null
    }

    InspectorPopup.prototype.onBeforeHide = function(ev) {
        if (this.cleaningUp) {
            return
        }

        if (!this.surface.validate()) {
            ev.preventDefault()
            return false
        }

        if (!this.triggerHiding()) {
            ev.preventDefault()
            return false
        }

        this.applyValues()
    }

    InspectorPopup.prototype.onHide = function(ev) {
        this.dispose()
    }

    InspectorPopup.prototype.onPopoverKeyDown = function(ev) {
        if(ev.key === 'Enter') {
            oc.dispatch('close.oc.popover', { target: ev.currentTarget })
        }
    }

    InspectorPopup.prototype.onPopupEditorDisplayed = function() {
        this.popoverObj.options.closeOnPageClick = false
        this.popoverObj.options.closeOnEsc = false
    }

    InspectorPopup.prototype.onPopupEditorHidden = function() {
        this.popoverObj.options.closeOnPageClick = true
        this.popoverObj.options.closeOnEsc = true
    }

    InspectorPopup.prototype.onCheckDocumentClickTarget = function(element) {
        if ($.contains(this.$element, element) || this.$element.get(0) === element) {
            return true
        }
    }

    InspectorPopup.prototype.onMoveToContainer = function() {
        $.oc.inspector.manager.switchToContainer(this)
    }

    $.oc.inspector.wrappers.popup = InspectorPopup
}(window.jQuery);
;
/*
 * Inspector container wrapper.
 */
+function ($) { "use strict";

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.inspector.wrappers.base,
        BaseProto = Base.prototype

    var InspectorContainer = function($element, surface, options) {
        if (!options.container) {
            throw new Error('Cannot create Inspector container wrapper without a container element.')
        }

        this.surfaceContainer = null

        Base.call(this, $element, surface, options)
    }

    InspectorContainer.prototype = Object.create(BaseProto)
    InspectorContainer.prototype.constructor = Base

    InspectorContainer.prototype.init = function() {
        this.registerHandlers()

        BaseProto.init.call(this)
    }

    InspectorContainer.prototype.dispose = function() {
        this.unregisterHandlers()
        this.removeControls()

        this.surfaceContainer = null

        BaseProto.dispose.call(this)
    }

    InspectorContainer.prototype.createSurfaceAndUi = function(properties, values) {
        this.buildUi()

        this.initSurface(this.surfaceContainer, properties, values)

        if (this.isLiveUpdateEnabled()) {
            this.surface.options.onChange = this.proxy(this.onLiveUpdate)
        }
    }

    InspectorContainer.prototype.adoptSurface = function() {
        this.buildUi()

        this.surface.moveToContainer(this.surfaceContainer)

        if (this.isLiveUpdateEnabled()) {
            this.surface.options.onChange = this.proxy(this.onLiveUpdate)
        }

        BaseProto.adoptSurface.call(this)
    }

    InspectorContainer.prototype.buildUi = function() {
        var scrollable = this.isScrollable(),
            head = this.buildHead(),
            layoutElements = this.buildLayout()

        layoutElements.headContainer.appendChild(head)

        if (scrollable) {
            var scrollpad = this.buildScrollpad()

            this.surfaceContainer = scrollpad.container
            layoutElements.bodyContainer.appendChild(scrollpad.scrollpad)

            $(scrollpad.scrollpad).scrollpad()
        }
        else {
            this.surfaceContainer = layoutElements.bodyContainer
        }

        this.setInspectorVisibleFlag(true)
    }

    InspectorContainer.prototype.buildHead = function() {
        var container = document.createElement('div'),
            header = document.createElement('h3'),
            paragraph = document.createElement('p'),
            detachButton = document.createElement('span'),
            closeButton = document.createElement('span')

        container.setAttribute('class', 'inspector-header')
        detachButton.setAttribute('class', 'oc-icon-external-link-square detach')
        closeButton.setAttribute('class', 'close')

        header.textContent = this.title
        paragraph.textContent = this.description
        closeButton.innerHTML = '&times;';

        container.appendChild(header)
        container.appendChild(paragraph)
        container.appendChild(detachButton)
        container.appendChild(closeButton)

        return container
    }

    InspectorContainer.prototype.buildScrollpad = function() {
        var scrollpad = document.createElement('div'),
            scrollWrapper = document.createElement('div'),
            scrollableContainer = document.createElement('div')

        scrollpad.setAttribute('class', 'control-scrollpad')
        scrollpad.setAttribute('data-control', 'scrollpad')
        scrollWrapper.setAttribute('class', 'scroll-wrapper inspector-wrapper')

        scrollpad.appendChild(scrollWrapper)
        scrollWrapper.appendChild(scrollableContainer)

        return {
            scrollpad: scrollpad,
            container: scrollableContainer
        }
    }

    InspectorContainer.prototype.buildLayout = function() {
        var layout = document.createElement('div'),
            headRow = document.createElement('div'),
            bodyRow = document.createElement('div')

        layout.setAttribute('class', 'inspector-layout d-flex flex-column fill-container')
        headRow.setAttribute('class', 'flex-shrink-0')
        bodyRow.setAttribute('class', 'flex-fill position-relative')

        layout.appendChild(headRow)
        layout.appendChild(bodyRow)

        this.options.container.get(0).appendChild(layout)

        $.oc.foundation.controlUtils.markDisposable(layout)
        this.registerLayoutHandlers(layout)
  
        return {
            headContainer: headRow,
            bodyContainer: bodyRow
        }
    }

    InspectorContainer.prototype.validateAndApply = function() {
        if (!this.surface.validate()) {
            return false
        }

        this.applyValues()
        return true
    }

    InspectorContainer.prototype.isScrollable = function() {
        return this.options.container.data('inspector-scrollable') !== undefined
    }

    InspectorContainer.prototype.isLiveUpdateEnabled = function() {
        return this.options.container.data('inspector-live-update') !== undefined
    }

    InspectorContainer.prototype.getLayout = function() {
        return this.options.container.get(0).querySelector('div.inspector-layout')
    }

    InspectorContainer.prototype.registerLayoutHandlers = function(layout) {
        var $layout = $(layout)

        $layout.one('dispose-control', this.proxy(this.dispose))
        $layout.on('click', 'span.close', this.proxy(this.onClose))
        $layout.on('click', 'span.detach', this.proxy(this.onDetach))
    }

    InspectorContainer.prototype.registerHandlers = function() {
        this.options.container.on('apply.oc.inspector', this.proxy(this.onApplyValues))
        this.options.container.on('beforeContainerHide.oc.inspector', this.proxy(this.onBeforeHide))
    }

    InspectorContainer.prototype.unregisterHandlers = function() {
        var $layout = $(this.getLayout())

        this.options.container.off('apply.oc.inspector', this.proxy(this.onApplyValues))
        this.options.container.off('beforeContainerHide.oc.inspector', this.proxy(this.onBeforeHide))

        $layout.off('dispose-control', this.proxy(this.dispose))
        $layout.off('click', 'span.close', this.proxy(this.onClose))
        $layout.off('click', 'span.detach', this.proxy(this.onDetach))

        if (this.surface !== null && this.surface.options.onChange === this.proxy(this.onLiveUpdate)) {
            this.surface.options.onChange = null
        }
    }

    InspectorContainer.prototype.removeControls = function() {
        if (this.isScrollable()) {
            this.options.container.find('.control-scrollpad').scrollpad('dispose')
        }

        var layout = this.getLayout()
        layout.parentNode.removeChild(layout)
    }

    InspectorContainer.prototype.onApplyValues = function(ev) {
        if (!this.validateAndApply()) {
            ev.preventDefault()
            return false
        }
    }

    InspectorContainer.prototype.onBeforeHide = function(ev) {
        if (!this.triggerHiding()) {
            ev.preventDefault()
            return false
        }
    }

    InspectorContainer.prototype.onClose = function(ev) {
        if (!this.validateAndApply()) {
            ev.preventDefault()
            return false
        }

        if (!this.triggerHiding()) {
            ev.preventDefault()
            return false
        }

        this.surface.dispose()

        this.dispose()
    }

    InspectorContainer.prototype.onLiveUpdate = function() {
        this.applyValues(true)
    }

    InspectorContainer.prototype.onDetach = function() {
        $.oc.inspector.manager.switchToPopup(this)
    }

    $.oc.inspector.wrappers.container = InspectorContainer
}(window.jQuery);
;
/*
 * Inspector grouping support.
 *
 */
+function ($) { "use strict";

    // GROUP MANAGER CLASS
    // ============================

    var GroupManager = function(controlId) {
        this.controlId = controlId
        this.rootGroup = null
        this.cachedGroupStatuses = null
    }

    GroupManager.prototype.createGroup = function(groupId, parentGroup) {
        var group = new Group(groupId)

        if (parentGroup) {
            parentGroup.groups.push(group)
            group.parentGroup = parentGroup // Circular reference, but memory leaks are not noticed
        }
        else {
            this.rootGroup = group
        }

        return group
    }

    GroupManager.prototype.getGroupIndex = function(group) {
        return group.getGroupIndex()
    }

    GroupManager.prototype.isParentGroupExpanded = function(group) {
        if (!group.parentGroup) {
            // The root group is always expanded
            return true
        }

        return this.isGroupExpanded(group.parentGroup)
    }

    GroupManager.prototype.isGroupExpanded = function(group) {
        if (!group.parentGroup) {
            // The root group is always expanded
            return true
        }

        var groupIndex = this.getGroupIndex(group),
            statuses = this.readGroupStatuses()

        if (statuses[groupIndex] !== undefined) {
            return statuses[groupIndex]
        }

        return false
    }

    GroupManager.prototype.setGroupStatus = function(groupIndex, expanded) {
        var statuses = this.readGroupStatuses()

        statuses[groupIndex] = expanded

        this.writeGroupStatuses(statuses)
    }

    GroupManager.prototype.readGroupStatuses = function() {
        if (this.cachedGroupStatuses !== null) {
            return this.cachedGroupStatuses
        }

        var statuses = getInspectorGroupStatuses()

        if (statuses[this.controlId] !== undefined) {
            this.cachedGroupStatuses = statuses[this.controlId]
        }
        else {
            this.cachedGroupStatuses = {}
        }

        return this.cachedGroupStatuses
    }

    GroupManager.prototype.writeGroupStatuses = function(updatedStatuses) {
        var statuses = getInspectorGroupStatuses()

        statuses[this.controlId] = updatedStatuses
        setInspectorGroupStatuses(statuses)

        this.cachedGroupStatuses = updatedStatuses
    }

    GroupManager.prototype.findGroupByIndex = function(index) {
        return this.rootGroup.findGroupByIndex(index)
    }

    GroupManager.prototype.findGroupRows = function(table, index, ignoreCollapsedSubgroups) {
        var group = this.findGroupByIndex(index)

        if (!group) {
            throw new Error('Cannot find the requested row group.')
        }

        return group.findGroupRows(table, ignoreCollapsedSubgroups, this)
    }

    GroupManager.prototype.markGroupRowInvalid = function(group, table) {
        var currentGroup = group

        while (currentGroup) {
            var row = currentGroup.findGroupRow(table)
            if (row) {
                $.oc.foundation.element.addClass(row, 'invalid')
            }

            currentGroup = currentGroup.parentGroup
        }
    }

    GroupManager.prototype.unmarkInvalidGroups = function(table) {
        var rows = table.querySelectorAll('tr.invalid')

        for (var i = rows.length-1; i >= 0; i--) {
            $.oc.foundation.element.removeClass(rows[i], 'invalid')
        }
    }

    GroupManager.prototype.isRowVisible = function(table, rowGroupIndex) {
        var group = this.findGroupByIndex(index)

        if (!group) {
            throw new Error('Cannot find the requested row group.')
        }

        var current = group

        while (current) {
            if (!this.isGroupExpanded(current)) {
                return false
            }

            current = current.parentGroup
        }

        return true
    }

    //
    // Internal functions
    //

    function getInspectorGroupStatuses() {
        var statuses = document.body.getAttribute('data-inspector-group-statuses')

        if (statuses !== null) {
            return JSON.parse(statuses)
        }

        return {}
    }

    function setInspectorGroupStatuses(statuses) {
        document.body.setAttribute('data-inspector-group-statuses', JSON.stringify(statuses))
    }

    // GROUP CLASS
    // ============================

    var Group = function(groupId) {
        this.groupId = groupId
        this.parentGroup = null
        this.groupIndex = null

        this.groups = []
    }

    Group.prototype.getGroupIndex = function() {
        if (this.groupIndex !== null) {
            return this.groupIndex
        }

        var result = '',
            current = this

        while (current) {
            if (result.length > 0) {
                result = current.groupId + '-' + result
            }
            else {
                result = String(current.groupId)
            }

            current = current.parentGroup
        }

        this.groupIndex = result

        return result
    }

    Group.prototype.findGroupByIndex = function(index) {
        if (this.getGroupIndex() == index) {
            return this
        }

        for (var i = this.groups.length-1; i >= 0; i--) {
            var groupResult = this.groups[i].findGroupByIndex(index)
            if (groupResult !== null) {
                return groupResult
            }
        }

        return null
    }

    Group.prototype.getLevel = function() {
        var current = this,
            level = -1

        while (current) {
            level++

            current = current.parentGroup
        }

        return level
    }

    Group.prototype.getGroupAndAllParents = function() {
        var current = this,
            result = []

        while (current) {
            result.push(current)

            current = current.parentGroup
        }

        return result
    }

    Group.prototype.findGroupRows = function(table, ignoreCollapsedSubgroups, groupManager) {
        var groupIndex = this.getGroupIndex(),
            rows = table.querySelectorAll('tr[data-parent-group-index="'+groupIndex+'"]'),
            result = Array.prototype.slice.call(rows) // Convert node list to array

        for (var i = 0, len = this.groups.length; i < len; i++) {
            var subgroup = this.groups[i]

            if (ignoreCollapsedSubgroups && !groupManager.isGroupExpanded(subgroup)) {
                continue
            }

            var subgroupRows = subgroup.findGroupRows(table, ignoreCollapsedSubgroups, groupManager)
            for (var j = 0, subgroupLen = subgroupRows.length; j < subgroupLen; j++) {
                result.push(subgroupRows[j])
            }
        }

        return result
    }

    Group.prototype.findGroupRow = function(table) {
        return table.querySelector('tr[data-group-index="'+this.groupIndex+'"]')
    }

    $.oc.inspector.groupManager = GroupManager
}(window.jQuery);
;
/*
 * Inspector engine helpers.
 *
 * The helpers are used mostly by the Inspector Surface.
 *
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.inspector === undefined)
        $.oc.inspector = {}

    $.oc.inspector.engine = {}

    // CLASS DEFINITION
    // ============================

    function findGroup(group, properties) {
        for (var i = 0, len = properties.length; i < len; i++) {
            var property = properties[i]

            if (property.itemType !== undefined && property.itemType == 'group' && property.title == group) {
                return property
            }
        }

        return null
    }

    $.oc.inspector.engine.processPropertyGroups = function(properties) {
        var fields = [],
            result = {
                hasGroups: false,
                properties: []
            },
            groupIndex = 0

        for (var i = 0, len = properties.length; i < len; i++) {
            var property = properties[i]

            if (property['sortOrder'] === undefined) {
                property['sortOrder'] = (i+1)*20
            }
        }

        properties.sort(function(a, b){
            return a['sortOrder'] - b['sortOrder']
        })

        for (var i = 0, len = properties.length; i < len; i++) {
            var property = properties[i]

            property.itemType = 'property'

            if (property.group === undefined) {
                fields.push(property)
            }
            else {
                var group = findGroup(property.group, fields)

                if (!group) {
                    group = {
                        itemType: 'group',
                        title: property.group,
                        properties: [],
                        groupIndex: groupIndex
                    }

                    groupIndex++
                    fields.push(group)
                }

                property.groupIndex = group.groupIndex
                group.properties.push(property)
            }
        }

        for (var i = 0, len = fields.length; i < len; i++) {
            var property = fields[i]

            result.properties.push(property)

            if (property.itemType == 'group') {
                result.hasGroups = true

                for (var j = 0, propertiesLen = property.properties.length; j < propertiesLen; j++) {
                    result.properties.push(property.properties[j])
                }

                delete property.properties
            }
        }

        return result
    }
}(window.jQuery);

;
/*
 * Inspector editor base class.
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

    if ($.oc === undefined) {
        $.oc = {}
    }

    if ($.oc.inspector === undefined) {
        $.oc.inspector = {}
    }

    if ($.oc.inspector.propertyEditors === undefined) {
        $.oc.inspector.propertyEditors = {}
    }

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var BaseEditor = function(inspector, propertyDefinition, containerCell, group) {
        this.inspector = inspector;
        this.propertyDefinition = propertyDefinition;
        this.containerCell = containerCell;
        this.containerRow = containerCell.parentNode;
        this.parentGroup = group;
        // Group created by a grouped editor, for example by the set editor
        this.group = null;
        this.childInspector = null;
        this.validationSet = null;
        this.disposed = false;

        Base.call(this);

        this.init();
    }

    BaseEditor.prototype = Object.create(BaseProto)
    BaseEditor.prototype.constructor = Base

    BaseEditor.prototype.dispose = function() {
        // After this point editors can't rely on any DOM references
        this.disposed = true;

        this.disposeValidation();

        if (this.childInspector) {
            this.childInspector.dispose();
        }

        this.inspector = null;
        this.propertyDefinition = null;
        this.containerCell = null;
        this.containerRow = null;
        this.childInspector = null;
        this.parentGroup = null;
        this.group = null;
        this.validationSet = null;

        BaseProto.dispose.call(this)
    }

    BaseEditor.prototype.init = function() {
        this.build()
        this.registerHandlers()
        this.initValidation()
    }

    BaseEditor.prototype.build = function() {
        return null
    }

    BaseEditor.prototype.isDisposed = function() {
        return this.disposed
    }

    BaseEditor.prototype.registerHandlers = function() {
    }

    BaseEditor.prototype.onInspectorPropertyChanged = function(property, value) {
    }

    BaseEditor.prototype.notifyChildSurfacesPropertyChanged = function(property, value) {
        if (!this.hasChildSurface()) {
            return;
        }

        this.childInspector.notifyEditorsPropertyChanged(property, value)
    }

    BaseEditor.prototype.focus = function() {
    }

    BaseEditor.prototype.hasChildSurface = function() {
        return this.childInspector !== null
    }

    BaseEditor.prototype.getRootSurface = function() {
        return this.inspector.getRootSurface()
    }

    BaseEditor.prototype.getPropertyPath = function() {
        return this.inspector.getPropertyPath(this.propertyDefinition.property)
    }

    /**
     * Updates displayed value in the editor UI. The value is already set
     * in the Inspector and should be loaded from Inspector.
     */
    BaseEditor.prototype.updateDisplayedValue = function(value) {
    }

    BaseEditor.prototype.getPropertyName = function() {
        return this.propertyDefinition.property
    }

    BaseEditor.prototype.getUndefinedValue = function() {
        return this.propertyDefinition.default === undefined ? undefined : this.propertyDefinition.default
    }

    BaseEditor.prototype.throwError = function(errorMessage) {
        throw new Error(errorMessage + ' Property: ' + this.propertyDefinition.property)
    }

    BaseEditor.prototype.getInspectableElement = function() {
        return this.getRootSurface().getInspectableElement()
    }

    BaseEditor.prototype.isEmptyValue = function(value) {
        return value === undefined
            || value === null
            || (typeof value == 'object' && $.isEmptyObject(value) )
            || (typeof value == 'string' && $.trim(value).length === 0)
            || (Object.prototype.toString.call(value) === '[object Array]' && value.length === 0)
    }

    //
    // Validation
    //

    BaseEditor.prototype.initValidation = function() {
        this.validationSet = new $.oc.inspector.validationSet(this.propertyDefinition, this.propertyDefinition.property)
    }

    BaseEditor.prototype.disposeValidation = function() {
        this.validationSet.dispose()
    }

    BaseEditor.prototype.getValueToValidate = function() {
        return this.inspector.getPropertyValue(this.propertyDefinition.property)
    }

    BaseEditor.prototype.validate = function(silentMode) {
        var value = this.getValueToValidate()

        if (value === undefined) {
            value = this.getUndefinedValue()
        }

        var validationResult = this.validationSet.validate(value)
        if (validationResult !== null) {
            if (!silentMode) {
                $.oc.flashMsg({text: validationResult, 'class': 'error', 'interval': 5})
            }
            return false
        }

        return true
    }

    BaseEditor.prototype.markInvalid = function() {
        $.oc.foundation.element.addClass(this.containerRow, 'invalid');
        this.inspector.getGroupManager().markGroupRowInvalid(this.parentGroup, this.inspector.getRootTable());

        this.inspector.getRootSurface().expandGroupParents(this.parentGroup);
        this.focus();
    }

    //
    // External editor
    //

    BaseEditor.prototype.supportsExternalParameterEditor = function() {
        return true
    }

    BaseEditor.prototype.onExternalPropertyEditorHidden = function() {
    }

    //
    // Grouping
    //

    BaseEditor.prototype.isGroupedEditor = function() {
        return false
    }

    BaseEditor.prototype.initControlGroup = function() {
        this.group = this.inspector.getGroupManager().createGroup(this.propertyDefinition.property, this.parentGroup)
    }

    BaseEditor.prototype.createGroupedRow = function(property) {
        var row = this.inspector.buildRow(property, this.group),
            groupedClass = this.inspector.getGroupManager().isGroupExpanded(this.group) ? 'expanded' : 'collapsed'

        this.inspector.applyGroupLevelToRow(row, this.group)

        $.oc.foundation.element.addClass(row, 'property')
        $.oc.foundation.element.addClass(row, groupedClass)
        return row
    }

    $.oc.inspector.propertyEditors.base = BaseEditor
}(window.jQuery);
;
/*
 * Inspector string editor class.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var StringEditor = function(inspector, propertyDefinition, containerCell, group) {
        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    StringEditor.prototype = Object.create(BaseProto)
    StringEditor.prototype.constructor = Base

    StringEditor.prototype.dispose = function() {
        this.unregisterHandlers()

        BaseProto.dispose.call(this)
    }

    StringEditor.prototype.build = function() {
        var editor = document.createElement('input'),
            placeholder = this.propertyDefinition.placeholder !== undefined ? this.propertyDefinition.placeholder : '',
            value = this.inspector.getPropertyValue(this.propertyDefinition.property)

        editor.setAttribute('type', 'text')
        editor.setAttribute('class', 'string-editor')
        editor.setAttribute('placeholder', placeholder)

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        if (value === undefined) {
            value = ''
        }

        editor.value = value

        $.oc.foundation.element.addClass(this.containerCell, 'text')

        this.containerCell.appendChild(editor)
    }

    StringEditor.prototype.updateDisplayedValue = function(value) {
        this.getInput().value = value
    }

    StringEditor.prototype.getInput = function() {
        return this.containerCell.querySelector('input');
    }

    StringEditor.prototype.focus = function() {
        this.getInput().focus({ preventScroll: true });
        this.onInputFocus();
    }

    StringEditor.prototype.registerHandlers = function() {
        var input = this.getInput();

        input.addEventListener('focus', this.proxy(this.onInputFocus));
        input.addEventListener('keyup', this.proxy(this.onInputKeyUp));
    }

    StringEditor.prototype.unregisterHandlers = function() {
        var input = this.getInput();

        input.removeEventListener('focus', this.proxy(this.onInputFocus));
        input.removeEventListener('keyup', this.proxy(this.onInputKeyUp));
    }

    StringEditor.prototype.onInputFocus = function(ev) {
        this.inspector.makeCellActive(this.containerCell);
    }

    StringEditor.prototype.onInputKeyUp = function() {
        var value = $.trim(this.getInput().value);

        this.inspector.setPropertyValue(this.propertyDefinition.property, value);
    }

    StringEditor.prototype.onExternalPropertyEditorHidden = function() {
        this.focus()
    }

    $.oc.inspector.propertyEditors.string = StringEditor
}(window.jQuery);
;
/*
 * Inspector checkbox editor class.
 *
 * This editor is used in $.oc.inspector.propertyEditors.set class.
 * If updates that affect references to this.inspector and propertyDefinition are done,
 * the propertyEditors.set class implementation should be reviewed.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var CheckboxEditor = function(inspector, propertyDefinition, containerCell, group) {
        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    CheckboxEditor.prototype = Object.create(BaseProto)
    CheckboxEditor.prototype.constructor = Base

    CheckboxEditor.prototype.dispose = function() {
        this.unregisterHandlers()

        BaseProto.dispose.call(this)
    }

    CheckboxEditor.prototype.build = function() {
        var editor = document.createElement('input'),
            container = document.createElement('div'),
            value = this.inspector.getPropertyValue(this.propertyDefinition.property),
            label = document.createElement('label'),
            isChecked = false,
            id = this.inspector.generateSequencedId();

        container.setAttribute('tabindex', 0);
        container.setAttribute('class', 'form-check');

        editor.setAttribute('type', 'checkbox');
        editor.setAttribute('value', '1');
        editor.setAttribute('placeholder', 'placeholder');
        editor.setAttribute('id', id);
        editor.setAttribute('class', 'form-check-input');

        container.appendChild(editor);

        if (value === undefined) {
            if (this.propertyDefinition.default !== undefined) {
                isChecked = this.normalizeCheckedValue(this.propertyDefinition.default);
            }
        }
        else {
            isChecked = this.normalizeCheckedValue(value);
        }

        editor.checked = isChecked;

        this.containerCell.appendChild(container);
    }

    CheckboxEditor.prototype.normalizeCheckedValue = function(value) {
         if (value == '0' || value == 'false') {
             return false;
         }

        return value;
    }

    CheckboxEditor.prototype.getInput = function() {
        return this.containerCell.querySelector('input');
    }

    CheckboxEditor.prototype.focus = function() {
        this.getInput().parentNode.focus({ preventScroll: true });
    }

    CheckboxEditor.prototype.updateDisplayedValue = function(value) {
        this.getInput().checked = this.normalizeCheckedValue(value);
    }

    CheckboxEditor.prototype.isEmptyValue = function(value) {
        if (value === 0 || value === '0' || value === 'false') {
            return true;
        }

        return BaseProto.isEmptyValue.call(this, value);
    }

    CheckboxEditor.prototype.registerHandlers = function() {
        var input = this.getInput()

        input.addEventListener('change', this.proxy(this.onInputChange))
    }

    CheckboxEditor.prototype.unregisterHandlers = function() {
        var input = this.getInput()

        input.removeEventListener('change', this.proxy(this.onInputChange))
    }

    CheckboxEditor.prototype.onInputChange = function() {
        var isChecked = this.getInput().checked

        this.inspector.setPropertyValue(this.propertyDefinition.property, isChecked ? 1 : 0)
    }

    $.oc.inspector.propertyEditors.checkbox = CheckboxEditor
}(window.jQuery);
;
/*
 * Inspector checkbox dropdown class.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var DropdownEditor = function(inspector, propertyDefinition, containerCell, group) {
        this.indicatorContainer = null

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    DropdownEditor.prototype = Object.create(BaseProto)
    DropdownEditor.prototype.constructor = Base

    DropdownEditor.prototype.init = function() {
        this.dynamicOptions = this.propertyDefinition.options ? false : true
        this.initialization = false

        BaseProto.init.call(this)
    }

    DropdownEditor.prototype.dispose = function() {
        this.unregisterHandlers()
        this.destroyCustomSelect()

        this.indicatorContainer = null

        BaseProto.dispose.call(this)
    }

    //
    // Building
    //

    DropdownEditor.prototype.build = function() {
        var select = document.createElement('select')

        $.oc.foundation.element.addClass(this.containerCell, 'dropdown')
        $.oc.foundation.element.addClass(select, 'custom-select')

        if (!this.dynamicOptions) {
            this.loadStaticOptions(select)
        }

        this.containerCell.appendChild(select)

        this.initCustomSelect()

        if (this.dynamicOptions) {
           this.loadDynamicOptions(true)
        }
    }

    DropdownEditor.prototype.formatSelectOption = function(state) {
        if (!state.id)
            return state.text; // optgroup

        var option = state.element,
            iconClass = option.getAttribute('data-icon'),
            imageSrc = option.getAttribute('data-image')

        if (iconClass) {
            return '<i class="select-icon '+iconClass+'"></i> ' + state.text
        }

        if (imageSrc) {
            return '<img class="select-image" src="'+imageSrc+'" alt="" /> ' + state.text
        }

        return state.text
    }

    DropdownEditor.prototype.createOption = function(select, title, value) {
        var option = document.createElement('option')

        if (title !== null) {
            if (!Array.isArray(title)) {
                option.textContent = title
            }
            else {
                if (title[1].indexOf('.') !== -1) {
                    option.setAttribute('data-image', title[1])
                }
                else {
                    option.setAttribute('data-icon', title[1])
                }

                option.textContent = title[0]
            }
        }

        if (value !== null) {
            option.value = value
        }

        select.appendChild(option)
    }

    DropdownEditor.prototype.createOptions = function(select, options) {
        for (var value in options) {
            this.createOption(select, options[value], value)
        }
    }

    DropdownEditor.prototype.initCustomSelect = function() {
        var select = this.getSelect()

        var options = {
            dropdownCssClass: 'ocInspectorDropdown'
        }

        if (this.propertyDefinition.emptyOption !== undefined) {
            options.placeholder = this.propertyDefinition.emptyOption
        }

        if (this.propertyDefinition.placeholder !== undefined) {
            options.placeholder = this.propertyDefinition.placeholder
        }

        options.templateResult = this.formatSelectOption
        options.templateSelection = this.formatSelectOption
        options.escapeMarkup = function(m) {
            return m
        }

        $(select).select2(options)

        if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
            this.indicatorContainer = $('.select2-container', this.containerCell)
            this.indicatorContainer.addClass('loading-indicator-container size-small')
        }
    }

    DropdownEditor.prototype.createPlaceholder = function(select) {
        var placeholder = this.propertyDefinition.placeholder || this.propertyDefinition.emptyOption

        var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

        if (placeholder !== undefined && !isTouchDevice) {
            this.createOption(select, null, null)
        }

        if (placeholder !== undefined && isTouchDevice) {
            this.createOption(select, placeholder, null)
        }
    }

    //
    // Helpers
    //

    DropdownEditor.prototype.getSelect = function() {
        return this.containerCell.querySelector('select')
    }

    DropdownEditor.prototype.clearOptions = function(select) {
        while (select.firstChild) {
            select.removeChild(select.firstChild)
        }
    }

    DropdownEditor.prototype.hasOptionValue = function(select, value) {
        var options = select.children

        for (var i = 0, len = options.length; i < len; i++) {
            if (options[i].value == value) {
                return true
            }
        }

        return false
    }

    DropdownEditor.prototype.normalizeValue = function(value) {
        if (!this.propertyDefinition.booleanValues) {
            return value
        }

        var str = String(value)

        if (str.length === 0) {
            return ''
        }

        if (str === 'true') {
            return true
        }

        return false
    }

    //
    // Event handlers
    //

    DropdownEditor.prototype.registerHandlers = function() {
        var select = this.getSelect()

        $(select).on('change', this.proxy(this.onSelectionChange))
    }

    DropdownEditor.prototype.onSelectionChange = function() {
        var select = this.getSelect()

        this.inspector.setPropertyValue(this.propertyDefinition.property, this.normalizeValue(select.value), this.initialization)
    }

    DropdownEditor.prototype.onInspectorPropertyChanged = function(property) {
        if (!this.propertyDefinition.depends || this.propertyDefinition.depends.indexOf(property) === -1) {
            return
        }

        var dependencyValues = this.getDependencyValues()

        if (this.prevDependencyValues === undefined || this.prevDependencyValues != dependencyValues) {
            this.loadDynamicOptions()
        }
    }

    DropdownEditor.prototype.onExternalPropertyEditorHidden = function() {
        if (this.dynamicOptions) {
            this.loadDynamicOptions(false)
        }
    }

    //
    // Editor API methods
    //

    DropdownEditor.prototype.updateDisplayedValue = function(value) {
        var select = this.getSelect()

        select.value = value
    }

    DropdownEditor.prototype.getUndefinedValue = function() {
        // Return default value if the default value is defined
        if (this.propertyDefinition.default !== undefined) {
            return this.propertyDefinition.default
        }

        // Return undefined if there's a placeholder value
        if (this.propertyDefinition.placeholder !== undefined) {
            return undefined
        }

        // Otherwise - return the first value in the list
        var select = this.getSelect()

        if (select) {
            return this.normalizeValue(select.value)
        }

        return undefined
    }

    DropdownEditor.prototype.isEmptyValue = function(value) {
        if (this.propertyDefinition.booleanValues) {
            if (value === '') {
                return true
            }

            return false
        }

        return BaseProto.isEmptyValue.call(this, value)
    }

    //
    // Disposing
    //

    DropdownEditor.prototype.destroyCustomSelect = function() {
        var $select = $(this.getSelect())

        if ($select.data('select2') != null) {
            $select.select2('destroy')
        }
    }

    DropdownEditor.prototype.unregisterHandlers = function() {
        var select = this.getSelect()

        $(select).off('change', this.proxy(this.onSelectionChange))
    }

    //
    // Static options
    //

    DropdownEditor.prototype.loadStaticOptions = function(select) {
        var value = this.inspector.getPropertyValue(this.propertyDefinition.property)

        this.createPlaceholder(select)

        this.createOptions(select, this.propertyDefinition.options)

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        select.value = value
    }

    //
    // Dynamic options
    //

    DropdownEditor.prototype.loadDynamicOptions = function(initialization) {
        var currentValue = this.inspector.getPropertyValue(this.propertyDefinition.property),
            data = this.getRootSurface().getValues(),
            self = this,
            $form = $(this.getSelect()).closest('form'),
            dependents = this.inspector.findDependentProperties(this.propertyDefinition.property)

        if (currentValue === undefined) {
            currentValue = this.propertyDefinition.default
        }

        var callback = function dropdownOptionsRequestDoneClosure(data) {
            self.hideLoadingIndicator();
            self.optionsRequestDone(data, currentValue, true);

            if (dependents.length > 0 && self.inspector) {
                for (var i in dependents) {
                    var editor = self.inspector.findPropertyEditor(dependents[i])
                    if (editor && typeof editor.onInspectorPropertyChanged === 'function') {
                        editor.onInspectorPropertyChanged(self.propertyDefinition.property)
                    }
                }
            }
        }

        if (this.propertyDefinition.depends) {
            this.saveDependencyValues();
        }

        data['inspectorProperty'] = this.getPropertyPath();
        data['inspectorClassName'] = this.inspector.options.inspectorClass;

        this.showLoadingIndicator();

        if (this.triggerGetOptions(data, callback) === false) {
            return;
        }

        $form.request(this.inspector.getEventHandler('onInspectableGetOptions'), {
            data: data,
            progressBar: false
        })
        .done(callback).always(this.proxy(this.hideLoadingIndicator));
    }

    DropdownEditor.prototype.triggerGetOptions = function(values, callback) {
        var $inspectable = this.getInspectableElement()
        if (!$inspectable) {
            return true
        }

        var optionsEvent = $.Event('dropdownoptions.oc.inspector')

        $inspectable.trigger(optionsEvent, [{
            values: values,
            callback: callback,
            property: this.inspector.getPropertyPath(this.propertyDefinition.property),
            propertyDefinition: this.propertyDefinition
        }])

        if (optionsEvent.isDefaultPrevented()) {
            return false
        }

        return true
    }

    DropdownEditor.prototype.saveDependencyValues = function() {
        this.prevDependencyValues = this.getDependencyValues()
    }

    DropdownEditor.prototype.getDependencyValues = function() {
        var result = ''

        for (var i = 0, len = this.propertyDefinition.depends.length; i < len; i++) {
            var property = this.propertyDefinition.depends[i],
                value = this.inspector.getPropertyValue(property)

            if (value === undefined) {
                value = '';
            }

            result += property + ':' + value + '-'
        }

        return result
    }

    DropdownEditor.prototype.showLoadingIndicator = function() {
        if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
            this.indicatorContainer.loadIndicator()
        }
    }

    DropdownEditor.prototype.hideLoadingIndicator = function() {
        if (this.isDisposed()) {
            return
        }

        if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
            this.indicatorContainer.loadIndicator('hide')
            this.indicatorContainer.loadIndicator('destroy')
        }
    }

    DropdownEditor.prototype.optionsRequestDone = function(data, currentValue, initialization) {
        if (this.isDisposed()) {
            // Handle the case when the asynchronous request finishes after
            // the editor is disposed
            return
        }

        var select = this.getSelect()

        // Without destroying and recreating the custom select
        // there could be detached DOM nodes.
        this.destroyCustomSelect()
        this.clearOptions(select)
        this.initCustomSelect()

        this.createPlaceholder(select)

        if (data.options) {
            for (var i = 0, len = data.options.length; i < len; i++) {
               this.createOption(select, data.options[i].title, data.options[i].value)
            }
        }

        if (this.hasOptionValue(select, currentValue)) {
            select.value = currentValue
        }
        else {
            select.selectedIndex = this.propertyDefinition.placeholder === undefined ? 0 : -1
        }

        this.initialization = initialization
        $(select).trigger('change')
        this.initialization = false
    }

    $.oc.inspector.propertyEditors.dropdown = DropdownEditor
}(window.jQuery);

;
/*
 * Base class for Inspector editors that create popups.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var PopupBase = function(inspector, propertyDefinition, containerCell, group) {
        this.popup = null

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    PopupBase.prototype = Object.create(BaseProto)
    PopupBase.prototype.constructor = Base

    PopupBase.prototype.dispose = function() {
        this.unregisterHandlers()
        this.popup = null

        BaseProto.dispose.call(this)
    }

    PopupBase.prototype.build = function() {
        var link = document.createElement('a')

        $.oc.foundation.element.addClass(link, 'trigger')
        link.setAttribute('href', '#')
        this.setLinkText(link)

        $.oc.foundation.element.addClass(this.containerCell, 'trigger-cell')

        this.containerCell.appendChild(link)
    }

    PopupBase.prototype.setLinkText = function(link, value) {
    }

    PopupBase.prototype.getPopupContent = function() {
        return '<form>                                                                                     \
                <div class="modal-header">                                                                 \
                    <h4 class="modal-title">{{property}}</h4>                                              \
                    <button type="button" class="btn-close" data-dismiss="popup"></button>                 \
                </div>                                                                                     \
                <div class="modal-body">                                                                   \
                    <div class="form-group">                                                               \
                    </div>                                                                                 \
                </div>                                                                                     \
                <div class="modal-footer">                                                                 \
                    <button type="submit" class="btn btn-primary">'+oc.lang.get('inspector.ok')+'</button> \
                    <button type="button" class="btn btn-default" data-dismiss="popup">'+oc.lang.get('inspector.cancel')+'</button>  \
                </div>                                                                                     \
            </form>'
    }

    PopupBase.prototype.updateDisplayedValue = function(value) {
        this.setLinkText(this.getLink(), value)
    }

    PopupBase.prototype.registerHandlers = function() {
        var link = this.getLink(),
            $link = $(link)

        link.addEventListener('click', this.proxy(this.onTriggerClick))
        $link.on('shown.oc.popup', this.proxy(this.onPopupShown))
        $link.on('hidden.oc.popup', this.proxy(this.onPopupHidden))
    }

    PopupBase.prototype.unregisterHandlers = function() {
        var link = this.getLink(),
            $link = $(link)

        link.removeEventListener('click', this.proxy(this.onTriggerClick))
        $link.off('shown.oc.popup', this.proxy(this.onPopupShown))
        $link.off('hidden.oc.popup', this.proxy(this.onPopupHidden))
    }

    PopupBase.prototype.getLink = function() {
        return this.containerCell.querySelector('a.trigger')
    }

    PopupBase.prototype.configurePopup = function(popup) {
    }

    PopupBase.prototype.handleSubmit = function($form) {
    }

    PopupBase.prototype.hidePopup = function() {
        $(this.getLink()).popup('hide')
    }

    PopupBase.prototype.onTriggerClick = function(ev) {
        $.oc.foundation.event.stop(ev)

        var content = this.getPopupContent()

        content = content.replace('{{property}}', this.propertyDefinition.title)

        $(ev.target).popup({
            content: content
        })

        return false
    }

    PopupBase.prototype.onPopupShown = function(ev, link, popup) {
        $(popup).on('submit.inspector', 'form', this.proxy(this.onSubmit))

        this.popup = popup.get(0)

        this.configurePopup(popup)

        this.getRootSurface().popupDisplayed()
    }

    PopupBase.prototype.onPopupHidden = function(ev, link, popup) {
        $(popup).off('.inspector', 'form', this.proxy(this.onSubmit))
        this.popup = null

        this.getRootSurface().popupHidden()
    }

    PopupBase.prototype.onSubmit = function(ev) {
        ev.preventDefault()

        if (this.handleSubmit($(ev.target)) === false) {
            return false
        }

        this.setLinkText(this.getLink())
        this.hidePopup()
        return false
    }

    $.oc.inspector.propertyEditors.popupBase = PopupBase
}(window.jQuery);
;
/*
 * Inspector text editor class.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.popupBase,
        BaseProto = Base.prototype

    var TextEditor = function(inspector, propertyDefinition, containerCell, group) {
        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    TextEditor.prototype = Object.create(BaseProto)
    TextEditor.prototype.constructor = Base

    TextEditor.prototype.setLinkText = function(link, value) {
        var value = value !== undefined ? value
                : this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        if (!value) {
            value = this.propertyDefinition.placeholder
            $.oc.foundation.element.addClass(link, 'cell-placeholder')
        }
        else {
            $.oc.foundation.element.removeClass(link, 'cell-placeholder')
        }

        if (typeof value === 'string') {
            value = value.replace(/(?:\r\n|\r|\n)/g, ' ');
            value = $.trim(value)
            value = value.substring(0, 300);
        }

        link.textContent = value
    }

    TextEditor.prototype.getPopupContent = function() {
        return '<form>                                                                                     \
                <div class="modal-header">                                                                 \
                    <h4 class="modal-title">{{property}}</h4>                                              \
                    <button type="button" class="btn-close" data-dismiss="popup"></button>                 \
                </div>                                                                                     \
                <div class="modal-body">                                                                   \
                    <div class="form-group">                                                               \
                        <p class="inspector-field-comment"></p>                                            \
                        <textarea class="form-control size-small field-textarea" name="name"></textarea>   \
                    </div>                                                                                 \
                </div>                                                                                     \
                <div class="modal-footer">                                                                 \
                    <button type="submit" class="btn btn-primary">'+oc.lang.get('inspector.ok')+'</button> \
                    <button type="button" class="btn btn-default" data-dismiss="popup">'+oc.lang.get('inspector.cancel')+'</button> \
                </div>                                                                                     \
            </form>'
    }

    TextEditor.prototype.configureComment = function(popup) {
        if (!this.propertyDefinition.description) {
            return
        }

        var descriptionElement = $(popup).find('p.inspector-field-comment')
        descriptionElement.text(this.propertyDefinition.description)
    }

    TextEditor.prototype.configurePopup = function(popup) {
        var $textarea = $(popup).find('textarea'),
            value = this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (this.propertyDefinition.placeholder) {
            $textarea.attr('placeholder', this.propertyDefinition.placeholder)
        }

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        $textarea.val(value)
        $textarea.focus()

        this.configureComment(popup)
    }

    TextEditor.prototype.handleSubmit = function($form) {
        var $textarea = $form.find('textarea'),
            link = this.getLink(),
            value = $.trim($textarea.val())

        this.inspector.setPropertyValue(this.propertyDefinition.property, value)
    }

    $.oc.inspector.propertyEditors.text = TextEditor
}(window.jQuery);
;
/*
 * Inspector set editor class.
 *
 * This class uses $.oc.inspector.propertyEditors.checkbox editor.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var SetEditor = function(inspector, propertyDefinition, containerCell, group) {
        this.editors = []
        this.loadedItems = null

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    SetEditor.prototype = Object.create(BaseProto)
    SetEditor.prototype.constructor = Base

    SetEditor.prototype.init = function() {
        this.initControlGroup()

        BaseProto.init.call(this)
    }

    SetEditor.prototype.dispose = function() {
        this.disposeEditors()
        this.disposeControls()

        this.editors = null

        BaseProto.dispose.call(this)
    }

    //
    // Building
    //

    SetEditor.prototype.build = function() {
        var link = document.createElement('a')

        $.oc.foundation.element.addClass(link, 'trigger')
        link.setAttribute('href', '#')
        this.setLinkText(link)

        $.oc.foundation.element.addClass(this.containerCell, 'trigger-cell')

        this.containerCell.appendChild(link)

        if (this.propertyDefinition.items !== undefined) {
            this.loadStaticItems()
        }
        else {
            this.loadDynamicItems()
        }
    }

    SetEditor.prototype.loadStaticItems = function() {
        var itemArray = []

        for (var itemValue in this.propertyDefinition.items) {
            itemArray.push({
                value: itemValue,
                title: this.propertyDefinition.items[itemValue]
            })
        }

        for (var i = itemArray.length-1; i >=0; i--) {
            this.buildItemEditor(itemArray[i].value, itemArray[i].title)
        }
    }

    SetEditor.prototype.setLinkText = function(link, value) {
        var value = (value !== undefined && value !== null) ? value
                : this.getNormalizedValue(),
            text = '[ ]'

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        if (value !== undefined && value.length !== undefined && value.length > 0 && typeof value !== 'string') {
            var textValues = []
            for (var i = 0, len = value.length; i < len; i++) {
                textValues.push(this.valueToText(value[i]))
            }

            text = '[' + textValues.join(', ') + ']'
            $.oc.foundation.element.removeClass(link, 'cell-placeholder')
        }
        else {
            text = this.propertyDefinition.placeholder

            if ((typeof text === 'string' && text.length == 0) || text === undefined) {
                text = '[ ]'
            }
            $.oc.foundation.element.addClass(link, 'cell-placeholder')
        }

        link.textContent = text
    }

    SetEditor.prototype.buildItemEditor = function(value, text) {
        var property = {
                title: text,
                itemType: 'property',
                groupIndex: this.group.getGroupIndex()
            },
            newRow = this.createGroupedRow(property),
            currentRow = this.containerCell.parentNode,
            tbody = this.containerCell.parentNode.parentNode, // row / tbody
            cell = document.createElement('td')

        this.buildCheckbox(cell, value, text)

        newRow.appendChild(cell)
        tbody.insertBefore(newRow, currentRow.nextSibling)
    }

    SetEditor.prototype.buildCheckbox = function(cell, value, title) {
        var property = {
                property: value,
                title: title,
                default: this.isCheckedByDefault(value)
            },
            editor = new $.oc.inspector.propertyEditors.checkbox(this, property, cell, this.group)

        this.editors.push[editor]
    }

    SetEditor.prototype.isCheckedByDefault = function(value) {
        if (!this.propertyDefinition.default) {
            return false
        }

        return this.propertyDefinition.default.indexOf(value) > -1
    }

    //
    // Dynamic items
    //

    SetEditor.prototype.showLoadingIndicator = function() {
        $(this.getLink()).loadIndicator()
    }

    SetEditor.prototype.hideLoadingIndicator = function() {
        if (this.isDisposed()) {
            return
        }

        var $link = $(this.getLink())

        $link.loadIndicator('hide')
        $link.loadIndicator('destroy')
    }

    SetEditor.prototype.loadDynamicItems = function() {
        var link = this.getLink(),
            data = this.inspector.getValues(),
            $form = $(link).closest('form');

        $.oc.foundation.element.addClass(link, 'loading-indicator-container size-small');
        this.showLoadingIndicator();

        data['inspectorProperty'] = this.getPropertyPath();
        data['inspectorClassName'] = this.inspector.options.inspectorClass;

        $form.request(this.inspector.getEventHandler('onInspectableGetOptions'), {
            data: data,
            progressBar: false
        })
        .done(this.proxy(this.itemsRequestDone))
        .always(this.proxy(this.hideLoadingIndicator));
    }

    SetEditor.prototype.itemsRequestDone = function(data, currentValue, initialization) {
        if (this.isDisposed()) {
            // Handle the case when the asynchronous request finishes after
            // the editor is disposed
            return
        }

        this.loadedItems = {}

        if (data.options) {
            for (var i = data.options.length-1; i >= 0; i--) {
                this.buildItemEditor(data.options[i].value, data.options[i].title)

                this.loadedItems[data.options[i].value] = data.options[i].title
            }
        }

        this.setLinkText(this.getLink())
    }

    //
    // Helpers
    //

    SetEditor.prototype.getLink = function() {
        return this.containerCell.querySelector('a.trigger')
    }

    SetEditor.prototype.getItemsSource = function() {
        if (this.propertyDefinition.items !== undefined) {
            return this.propertyDefinition.items
        }

        return this.loadedItems
    }

    SetEditor.prototype.valueToText = function(value) {
        var source = this.getItemsSource()

        if (!source) {
            return value
        }

        for (var itemValue in source) {
            if (itemValue == value) {
                return source[itemValue]
            }
        }

        return value
    }

    /*
     * Removes items that don't exist in the defined items from
     * the value.
     */
    SetEditor.prototype.cleanUpValue = function(value) {
        if (!value) {
            return value
        }

        var result = [],
            source = this.getItemsSource()

        for (var i = 0, len = value.length; i < len; i++) {
            var currentValue = value[i]

            if (source[currentValue] !== undefined) {
                result.push(currentValue)
            }
        }

        return result
    }

    SetEditor.prototype.getNormalizedValue = function() {
        var value = this.inspector.getPropertyValue(this.propertyDefinition.property);

        if (value === null) {
            value = undefined;
        }

        if (value === undefined) {
            return value;
        }

        if (value.length === undefined || typeof value === 'string') {
            return undefined;
        }

        return value;
    }

    //
    // Editor API methods
    //

    SetEditor.prototype.supportsExternalParameterEditor = function() {
        return false
    }

    SetEditor.prototype.isGroupedEditor = function() {
        return true
    }

    //
    // Inspector API methods
    //
    // This editor creates checkbox editor and acts as a container Inspector
    // for them. The methods in this section emulate and proxy some functionality
    // of the Inspector.
    //

    SetEditor.prototype.getPropertyValue = function(checkboxValue) {
        // When a checkbox requests the property value, we return
        // TRUE if the checkbox value is listed in the current values of
        // the set.
        // For example, the available set items are [create, update], the
        // current set value is [create] and checkboxValue is "create".
        // The result of the method will be TRUE.

        var value = this.getNormalizedValue();

        if (value === undefined) {
            return this.isCheckedByDefault(checkboxValue);
        }

        if (!value) {
            return false;
        }

        return value.indexOf(checkboxValue) > -1;
    }

    SetEditor.prototype.setPropertyValue = function(checkboxValue, isChecked) {
        // In this method the Set Editor mimics the Surface.
        // It acts as a parent surface for the children checkboxes,
        // watching changes in them and updating the link text.

        var currentValue = this.getNormalizedValue()

        if (currentValue === undefined) {
            currentValue = this.propertyDefinition.default
        }

        if (!currentValue) {
            currentValue = []
        }

        var resultValue = [],
            items = this.getItemsSource()

        for (var itemValue in items) {
            if (itemValue !== checkboxValue) {
                if (currentValue.indexOf(itemValue) !== -1) {
                    resultValue.push(itemValue)
                }
            }
            else {
                if (isChecked) {
                    resultValue.push(itemValue);
                }
            }
        }

        this.inspector.setPropertyValue(this.propertyDefinition.property, this.cleanUpValue(resultValue));
        this.setLinkText(this.getLink());
    }

    SetEditor.prototype.generateSequencedId = function() {
        return this.inspector.generateSequencedId()
    }

    //
    // Disposing
    //

    SetEditor.prototype.disposeEditors = function() {
        for (var i = 0, len = this.editors.length; i < len; i++) {
            var editor = this.editors[i]

            editor.dispose()
        }
    }

    SetEditor.prototype.disposeControls = function() {
        var link = this.getLink()

        if (this.propertyDefinition.items === undefined) {
            $(link).loadIndicator('destroy')
        }

        link.parentNode.removeChild(link)
    }

    $.oc.inspector.propertyEditors.set = SetEditor
}(window.jQuery);
;
/*
 * Inspector object list editor class.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var ObjectListEditor = function(inspector, propertyDefinition, containerCell, group) {
        this.currentRowInspector = null
        this.popup = null

        if (propertyDefinition.titleProperty === undefined) {
            throw new Error('The titleProperty property should be specified in the objectList editor configuration. Property: ' + propertyDefinition.property)
        }

        if (propertyDefinition.itemProperties === undefined) {
            throw new Error('The itemProperties property should be specified in the objectList editor configuration. Property: ' + propertyDefinition.property)
        }

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    ObjectListEditor.prototype = Object.create(BaseProto)
    ObjectListEditor.prototype.constructor = Base

    ObjectListEditor.prototype.init = function() {
        if (this.isKeyValueMode()) {
            var keyProperty = this.getKeyProperty()

            if (!keyProperty) {
                throw new Error('Object list key property ' + this.propertyDefinition.keyProperty
                    + ' is not defined in itemProperties. Property: ' + this.propertyDefinition.property)
            }
        }

        BaseProto.init.call(this)
    }

    ObjectListEditor.prototype.dispose = function() {
        this.unregisterHandlers()
        this.removeControls()

        this.currentRowInspector = null
        this.popup = null

        BaseProto.dispose.call(this)
    }

    ObjectListEditor.prototype.supportsExternalParameterEditor = function() {
        return false
    }

    //
    // Building
    //

    ObjectListEditor.prototype.build = function() {
        var link = document.createElement('a')

        $.oc.foundation.element.addClass(link, 'trigger')
        link.setAttribute('href', '#')
        this.setLinkText(link)

        $.oc.foundation.element.addClass(this.containerCell, 'trigger-cell')

        this.containerCell.appendChild(link)
    }

    ObjectListEditor.prototype.setLinkText = function(link, value) {
        var value = value !== undefined && value !== null ? value
                : this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (value === null) {
            value = undefined
        }

        if (value === undefined) {
            var placeholder = this.propertyDefinition.placeholder

            if (placeholder !== undefined) {
                $.oc.foundation.element.addClass(link, 'cell-placeholder')
                link.textContent = placeholder
            }
            else {
                link.textContent = 'Items: 0'
            }
        }
        else {
            var itemCount = 0

            if (!this.isKeyValueMode()) {
                if (value.length === undefined) {
                    throw new Error('Object list value should be an array. Property: ' + this.propertyDefinition.property)
                }

                itemCount = value.length
            }
            else {
                if (typeof value !== 'object') {
                    throw new Error('Object list value should be an object. Property: ' + this.propertyDefinition.property)
                }

                itemCount = this.getValueKeys(value).length
            }

            $.oc.foundation.element.removeClass(link, 'cell-placeholder')
            link.textContent = 'Items: ' + itemCount
        }
    }

    ObjectListEditor.prototype.getPopupContent = function() {
        return '<form>                                                                                     \
                <div class="modal-header">                                                                 \
                    <h4 class="modal-title">{{property}}</h4>                                              \
                    <button type="button" class="btn-close" data-dismiss="popup"></button>                 \
                </div>                                                                                     \
                <div>                                                                                      \
                    <div class="layout inspector-columns-editor">                                          \
                        <div class="layout-row">                                                           \
                            <div class="layout-cell items-column">                                         \
                                <div class="layout-relative">                                              \
                                    <div class="layout">                                                   \
                                        <div class="layout-row min-size">                                  \
                                            <div class="control-toolbar toolbar-padded">                   \
                                                <div class="toolbar-item">                                 \
                                                    <div class="btn-group">                                \
                                                        <button type="button" class="btn btn-primary       \
                                                            oc-icon-plus"                                  \
                                                            data-cmd="create-item">'+oc.lang.get('inspector.add')+'</button> \
                                                        <button type="button" class="btn btn-default       \
                                                            empty oc-icon-trash"                         \
                                                            data-cmd="delete-item"></button>               \
                                                    </div>                                                 \
                                                </div>                                                     \
                                            </div>                                                         \
                                        </div>                                                             \
                                        <div class="layout-row">                                           \
                                            <div class="layout-cell">                                      \
                                                <div class="layout-relative">                              \
                                                    <div class="layout-absolute">                          \
                                                        <div class="control-scrollpad"                     \
                                                            data-control="scrollpad">                      \
                                                            <div class="scroll-wrapper">                   \
                                                                <table class="table data                   \
                                                                    no-offset-bottom                       \
                                                                    inspector-table-list">                 \
                                                                </table>                                   \
                                                            </div>                                         \
                                                        </div>                                             \
                                                    </div>                                                 \
                                                </div>                                                     \
                                            </div>                                                         \
                                        </div>                                                             \
                                    </div>                                                                 \
                                </div>                                                                     \
                            </div>                                                                         \
                            <div class="layout-cell">                                                      \
                                <div class="layout-relative">                                              \
                                    <div class="layout-absolute">                                          \
                                        <div class="control-scrollpad" data-control="scrollpad">           \
                                            <div class="scroll-wrapper inspector-wrapper">                 \
                                                <div data-inspector-container>                             \
                                                </div>                                                     \
                                            </div>                                                         \
                                        </div>                                                             \
                                    </div>                                                                 \
                                </div>                                                                     \
                            </div>                                                                         \
                        </div>                                                                             \
                    </div>                                                                                 \
                </div>                                                                                     \
                <div class="modal-footer">                                                                 \
                    <button type="submit" class="btn btn-primary">'+oc.lang.get('inspector.ok')+'</button> \
                    <button type="button" class="btn btn-default" data-dismiss="popup">'+oc.lang.get('inspector.cancel')+'</button> \
                </div>                                                                                     \
            </form>';
    }

    ObjectListEditor.prototype.buildPopupContents = function(popup) {
        this.buildItemsTable(popup)
    }

    ObjectListEditor.prototype.buildItemsTable = function(popup) {
        var table = popup.querySelector('table'),
            tbody = document.createElement('tbody'),
            items = this.inspector.getPropertyValue(this.propertyDefinition.property),
            titleProperty = this.propertyDefinition.titleProperty

        if (items === undefined || this.getValueKeys(items).length === 0) {
            var row = this.buildEmptyRow()

            tbody.appendChild(row)
        }
        else {
            var firstRow = undefined

            for (var key in items) {
                var item = items[key],
                    itemInspectorValue = this.addKeyProperty(key, item),
                    itemText = item[titleProperty],
                    row = this.buildTableRow(itemText, 'rowlink')

                row.setAttribute('data-inspector-values', JSON.stringify(itemInspectorValue))
                tbody.appendChild(row)

                if (firstRow === undefined) {
                    firstRow = row
                }
            }
        }

        table.appendChild(tbody)

        if (firstRow !== undefined) {
            this.selectRow(firstRow, true)
        }

        this.updateScrollpads()
    }

    ObjectListEditor.prototype.buildEmptyRow = function() {
        return this.buildTableRow('No items found', 'no-data', 'nolink')
    }

    ObjectListEditor.prototype.removeEmptyRow = function() {
        var tbody = this.getTableBody(),
            row = tbody.querySelector('tr.no-data')

        if (row) {
            tbody.removeChild(row)
        }
    }

    ObjectListEditor.prototype.buildTableRow = function(text, rowClass, cellClass) {
        var row = document.createElement('tr'),
            cell = document.createElement('td')

        cell.textContent = text

        if (rowClass !== undefined) {
            $.oc.foundation.element.addClass(row, rowClass)
        }

        if (cellClass !== undefined) {
            $.oc.foundation.element.addClass(cell, cellClass)
        }

        row.appendChild(cell)
        return row
    }

    ObjectListEditor.prototype.updateScrollpads = function() {
        $('.control-scrollpad', this.popup).scrollpad('update')
    }

    //
    // Built-in Inspector management
    //

    ObjectListEditor.prototype.selectRow = function(row, forceSelect) {
        var tbody = row.parentNode,
            inspectorContainer = this.getInspectorContainer(),
            selectedRow = this.getSelectedRow()

        if (selectedRow === row && !forceSelect) {
            return
        }

        if (selectedRow) {
            if (!this.validateKeyValue()) {
                return
            }

            if (this.currentRowInspector) {
                if (!this.currentRowInspector.validate()) {
                    return
                }
            }

            this.applyDataToRow(selectedRow)
            $.oc.foundation.element.removeClass(selectedRow, 'active')
        }

        this.disposeInspector()

        $.oc.foundation.element.addClass(row, 'active')

        this.createInspectorForRow(row, inspectorContainer)
    }

    ObjectListEditor.prototype.createInspectorForRow = function(row, inspectorContainer) {
        var dataStr = row.getAttribute('data-inspector-values')

        if (dataStr === undefined || typeof dataStr !== 'string') {
            throw new Error('Values not found for the selected row.')
        }

        var properties = this.propertyDefinition.itemProperties,
            values = JSON.parse(dataStr),
            options = {
                enableExternalParameterEditor: false,
                onChange: this.proxy(this.onInspectorDataChange),
                inspectorClass: this.inspector.options.inspectorClass
            }

        this.currentRowInspector = new $.oc.inspector.surface(inspectorContainer, properties, values,
            $.oc.inspector.helpers.generateElementUniqueId(inspectorContainer), options)
    }

    ObjectListEditor.prototype.disposeInspector = function() {
        $.oc.foundation.controlUtils.disposeControls(this.popup.querySelector('[data-inspector-container]'))
        this.currentRowInspector = null
    }

    ObjectListEditor.prototype.applyDataToRow = function(row) {
        if (this.currentRowInspector === null) {
            return
        }

        var data = this.currentRowInspector.getValues()
        row.setAttribute('data-inspector-values', JSON.stringify(data))
    }

    ObjectListEditor.prototype.updateRowText = function(property, value) {
        var selectedRow = this.getSelectedRow()

        if (!selectedRow) {
            throw new Exception('A row is not found for the updated data')
        }

        if (property !== this.propertyDefinition.titleProperty) {
            return
        }

        value = $.trim(value)

        if (value.length === 0) {
            value = '[No title]'
            $.oc.foundation.element.addClass(selectedRow, 'disabled')
        }
        else {
            $.oc.foundation.element.removeClass(selectedRow, 'disabled')
        }

        selectedRow.firstChild.textContent = value
    }

    ObjectListEditor.prototype.getSelectedRow = function() {
        if (!this.popup) {
            throw new Error('Trying to get selected row without a popup reference.')
        }

        var rows = this.getTableBody().children

        for (var i = 0, len = rows.length; i < len; i++) {
            if ($.oc.foundation.element.hasClass(rows[i], 'active')) {
                return rows[i]
            }
        }

        return null
    }

    ObjectListEditor.prototype.createItem = function() {
        var selectedRow = this.getSelectedRow()

        if (selectedRow) {
            if (!this.validateKeyValue()) {
                return
            }

            if (this.currentRowInspector) {
                if (!this.currentRowInspector.validate()) {
                    return
                }
            }

            this.applyDataToRow(selectedRow)
            $.oc.foundation.element.removeClass(selectedRow, 'active')
        }

        this.disposeInspector()

        var title = 'New item',
            row = this.buildTableRow(title, 'rowlink active'),
            tbody = this.getTableBody(),
            data = {}

        data[this.propertyDefinition.titleProperty] = title

        row.setAttribute('data-inspector-values', JSON.stringify(data))
        tbody.appendChild(row)

        this.selectRow(row, true)

        this.removeEmptyRow()
        this.updateScrollpads()
    }

    ObjectListEditor.prototype.deleteItem = function() {
        var selectedRow = this.getSelectedRow()

        if (!selectedRow) {
            return
        }

        var nextRow = selectedRow.nextElementSibling,
            prevRow = selectedRow.previousElementSibling,
            tbody = this.getTableBody()

        this.disposeInspector()
        tbody.removeChild(selectedRow)

        var newSelectedRow = nextRow ? nextRow : prevRow

        if (newSelectedRow) {
            this.selectRow(newSelectedRow)
        }
        else {
            tbody.appendChild(this.buildEmptyRow())
        }

        this.updateScrollpads()
    }

    ObjectListEditor.prototype.applyDataToParentInspector = function() {
        var selectedRow = this.getSelectedRow(),
            tbody = this.getTableBody(),
            dataRows = tbody.querySelectorAll('tr[data-inspector-values]'),
            link = this.getLink(),
            result = this.getEmptyValue()

        if (selectedRow) {
            if (!this.validateKeyValue()) {
                return
            }

            if (this.currentRowInspector) {
                if (!this.currentRowInspector.validate()) {
                    return
                }
            }

            this.applyDataToRow(selectedRow)
        }

        for (var i = 0, len = dataRows.length; i < len; i++) {
            var dataRow = dataRows[i],
                rowData = JSON.parse(dataRow.getAttribute('data-inspector-values'))

            if (!this.isKeyValueMode()) {
                result.push(rowData)
            }
            else {
                var rowKey = rowData[this.propertyDefinition.keyProperty]

                result[rowKey] = this.removeKeyProperty(rowData)
            }
        }

        this.inspector.setPropertyValue(this.propertyDefinition.property, result)
        this.setLinkText(link, result)

        $(link).popup('hide')
        return false
    }

    ObjectListEditor.prototype.validateKeyValue = function() {
        if (!this.isKeyValueMode()) {
            return true
        }

        if (this.currentRowInspector === null) {
            return true
        }

        var data = this.currentRowInspector.getValues(),
            keyProperty = this.propertyDefinition.keyProperty

        if (data[keyProperty] === undefined) {
            throw new Error('Key property ' + keyProperty + ' is not found in the Inspector data. Property: ' + this.propertyDefinition.property)
        }

        var keyPropertyValue = data[keyProperty],
            keyPropertyTitle = this.getKeyProperty().title

        if (typeof keyPropertyValue !== 'string') {
            throw new Error('Key property (' + keyProperty + ') value should be a string. Property: ' + this.propertyDefinition.property)
        }

        if ($.trim(keyPropertyValue).length === 0) {
            $.oc.flashMsg({text: 'The value of key property ' + keyPropertyTitle + ' cannot be empty.', 'class': 'error', 'interval': 3})
            return false
        }

        var selectedRow = this.getSelectedRow(),
            tbody = this.getTableBody(),
            dataRows = tbody.querySelectorAll('tr[data-inspector-values]')

        for (var i = 0, len = dataRows.length; i < len; i++) {
            var dataRow = dataRows[i],
                rowData = JSON.parse(dataRow.getAttribute('data-inspector-values'))

            if (selectedRow == dataRow) {
                continue
            }

            if (rowData[keyProperty] == keyPropertyValue) {
                $.oc.flashMsg({text: 'The value of key property ' + keyPropertyTitle + ' should be unique.', 'class': 'error', 'interval': 3})
                return false
            }
        }

        return true
    }

    //
    // Helpers
    //

    ObjectListEditor.prototype.getLink = function() {
        return this.containerCell.querySelector('a.trigger')
    }

    ObjectListEditor.prototype.getPopupFormElement = function() {
        var form = this.popup.querySelector('form')

        if (!form) {
            this.throwError('Cannot find form element in the popup window.')
        }

        return form
    }

    ObjectListEditor.prototype.getInspectorContainer = function() {
        return this.popup.querySelector('div[data-inspector-container]')
    }

    ObjectListEditor.prototype.getTableBody = function() {
        return this.popup.querySelector('table.inspector-table-list tbody')
    }

    ObjectListEditor.prototype.isKeyValueMode = function() {
        return this.propertyDefinition.keyProperty !== undefined
    }

    ObjectListEditor.prototype.getKeyProperty = function() {
        for (var i = 0, len = this.propertyDefinition.itemProperties.length; i < len; i++) {
            var property = this.propertyDefinition.itemProperties[i]

            if (property.property == this.propertyDefinition.keyProperty) {
                return property
            }
        }
    }

    ObjectListEditor.prototype.getValueKeys = function(value) {
        var result = []

        for (var key in value) {
            result.push(key)
        }

        return result
    }

    ObjectListEditor.prototype.addKeyProperty = function(key, value) {
        if (!this.isKeyValueMode()) {
            return value
        }

        value[this.propertyDefinition.keyProperty] = key

        return value
    }

    ObjectListEditor.prototype.removeKeyProperty = function(value) {
        if (!this.isKeyValueMode()) {
            return value
        }

        var result = value

        if (result[this.propertyDefinition.keyProperty] !== undefined) {
            delete result[this.propertyDefinition.keyProperty]
        }

        return result
    }

    ObjectListEditor.prototype.getEmptyValue = function() {
        if (this.isKeyValueMode()) {
            return {}
        }
        else {
            return []
        }
    }

    //
    // Event handlers
    //

    ObjectListEditor.prototype.registerHandlers = function() {
        var link = this.getLink(),
            $link = $(link)

        link.addEventListener('click', this.proxy(this.onTriggerClick))
        $link.on('shown.oc.popup', this.proxy(this.onPopupShown))
        $link.on('hidden.oc.popup', this.proxy(this.onPopupHidden))
    }

    ObjectListEditor.prototype.unregisterHandlers = function() {
        var link = this.getLink(),
            $link = $(link)

        link.removeEventListener('click', this.proxy(this.onTriggerClick))
        $link.off('shown.oc.popup', this.proxy(this.onPopupShown))
        $link.off('hidden.oc.popup', this.proxy(this.onPopupHidden))
    }

    ObjectListEditor.prototype.onTriggerClick = function(ev) {
        $.oc.foundation.event.stop(ev)

        var content = this.getPopupContent()

        content = content.replace('{{property}}', this.propertyDefinition.title)

        $(ev.target).popup({
            content: content
        })

        return false
    }

    ObjectListEditor.prototype.onPopupShown = function(ev, link, popup) {
        $(popup).on('submit.inspector', 'form', this.proxy(this.onSubmit))
        $(popup).on('click', 'tr.rowlink', this.proxy(this.onRowClick))
        $(popup).on('click.inspector', '[data-cmd]', this.proxy(this.onCommand))

        this.popup = popup.get(0)

        this.buildPopupContents(this.popup)
        this.getRootSurface().popupDisplayed()
    }

    ObjectListEditor.prototype.onPopupHidden = function(ev, link, popup) {
        $(popup).off('.inspector', this.proxy(this.onSubmit))
        $(popup).off('click', 'tr.rowlink', this.proxy(this.onRowClick))
        $(popup).off('click.inspector', '[data-cmd]', this.proxy(this.onCommand))

        this.disposeInspector()
        $.oc.foundation.controlUtils.disposeControls(this.popup)

        this.popup = null
        this.getRootSurface().popupHidden()
    }

    ObjectListEditor.prototype.onSubmit = function(ev) {
        this.applyDataToParentInspector()

        ev.preventDefault()
        return false
    }

    ObjectListEditor.prototype.onRowClick = function(ev) {
        this.selectRow(ev.currentTarget)
    }

    ObjectListEditor.prototype.onInspectorDataChange = function(property, value) {
        this.updateRowText(property, value)
    }

    ObjectListEditor.prototype.onCommand = function(ev) {
        var command = ev.currentTarget.getAttribute('data-cmd')

        switch (command) {
            case 'create-item' :
                this.createItem()
            break;
            case 'delete-item' :
                this.deleteItem()
            break;
        }
    }

    //
    // Disposing
    //

    ObjectListEditor.prototype.removeControls = function() {
        if (this.popup) {
            this.disposeInspector(this.popup)
        }
    }

    $.oc.inspector.propertyEditors.objectList = ObjectListEditor
}(window.jQuery);
;
/*
 * Inspector object editor class.
 *
 * This class uses other editors.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.base,
        BaseProto = Base.prototype

    var ObjectEditor = function(inspector, propertyDefinition, containerCell, group) {
        if (propertyDefinition.properties === undefined) {
            this.throwError('The properties property should be specified in the object editor configuration.')
        }

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    ObjectEditor.prototype = Object.create(BaseProto)
    ObjectEditor.prototype.constructor = Base

    ObjectEditor.prototype.init = function() {
        this.initControlGroup()

        BaseProto.init.call(this)
    }

    //
    // Building
    //

    ObjectEditor.prototype.build = function() {
        var currentRow = this.containerCell.parentNode,
            inspectorContainer = document.createElement('div'),
            options = {
                enableExternalParameterEditor: false,
                onChange: this.proxy(this.onInspectorDataChange),
                inspectorClass: this.inspector.options.inspectorClass
            },
            values = this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (values === undefined) {
            values = {}
        }

        this.childInspector = new $.oc.inspector.surface(inspectorContainer, 
            this.propertyDefinition.properties, 
            values, 
            this.inspector.getInspectorUniqueId() + '-' + this.propertyDefinition.property, 
            options,
            this.inspector,
            this.group,
            this.propertyDefinition.property)

        this.inspector.mergeChildSurface(this.childInspector, currentRow)
    }

    //
    // Helpers
    //

    ObjectEditor.prototype.cleanUpValue = function(value) {
        if (value === undefined || typeof value !== 'object') {
            return undefined
        }

        if (this.propertyDefinition.ignoreIfPropertyEmpty === undefined) {
            return value
        }

        return this.getValueOrRemove(value)
    }

    ObjectEditor.prototype.getValueOrRemove = function(value) {
        if (this.propertyDefinition.ignoreIfPropertyEmpty === undefined) {
            return value
        }

        var targetProperty = this.propertyDefinition.ignoreIfPropertyEmpty,
            targetValue = value[targetProperty]

        if (this.isEmptyValue(targetValue)) {
            return $.oc.inspector.removedProperty
        }

        return value
    }

    //
    // Editor API methods
    //

    ObjectEditor.prototype.supportsExternalParameterEditor = function() {
        return false
    }

    ObjectEditor.prototype.isGroupedEditor = function() {
        return true
    }

    ObjectEditor.prototype.getUndefinedValue = function() {
        var result = {}

        for (var i = 0, len = this.propertyDefinition.properties.length; i < len; i++) {
            var propertyName = this.propertyDefinition.properties[i].property,
                editor = this.childInspector.findPropertyEditor(propertyName)

            if (editor) {
                result[propertyName] = editor.getUndefinedValue()
            }
        }

        return this.getValueOrRemove(result)
    }

    ObjectEditor.prototype.validate = function(silentMode) {
        var values = this.childInspector.getValues()

        if (this.cleanUpValue(values) === $.oc.inspector.removedProperty) {
            // Ignore any validation rules if the object's required 
            // property is empty (ignoreIfPropertyEmpty)

            return true
        }

        return this.childInspector.validate(silentMode)
    }

    //
    // Event handlers
    //

    ObjectEditor.prototype.onInspectorDataChange = function(property, value) {
        var values = this.childInspector.getValues()

        this.inspector.setPropertyValue(this.propertyDefinition.property, this.cleanUpValue(values))
    }

    $.oc.inspector.propertyEditors.object = ObjectEditor
}(window.jQuery);
;
/*
 * Inspector string list editor class.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.text,
        BaseProto = Base.prototype

    var StringListEditor = function(inspector, propertyDefinition, containerCell, group) {
        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    StringListEditor.prototype = Object.create(BaseProto)
    StringListEditor.prototype.constructor = Base

    StringListEditor.prototype.setLinkText = function(link, value) {
        var value = value !== undefined ? value
                : this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        this.checkValueType(value)

        if (!value) {
            value = this.propertyDefinition.placeholder
            $.oc.foundation.element.addClass(link, 'cell-placeholder')

            if (!value) {
                value = '[]'
            }

            link.textContent = value
        }
        else {
            $.oc.foundation.element.removeClass(link, 'cell-placeholder')

            link.textContent = '[' + value.join(', ') + ']'
        }
    }

    StringListEditor.prototype.checkValueType = function(value) {
        if (value && Object.prototype.toString.call(value) !== '[object Array]') {
            this.throwError('The string list value should be an array.')
        }
    }

    StringListEditor.prototype.configurePopup = function(popup) {
        var $textarea = $(popup).find('textarea'),
            value = this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (this.propertyDefinition.placeholder) {
            $textarea.attr('placeholder', this.propertyDefinition.placeholder)
        }

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        this.checkValueType(value)

        if (value && value.length) {
            $textarea.val(value.join('\n'))
        }

        $textarea.focus()

        this.configureComment(popup)
    }

    StringListEditor.prototype.handleSubmit = function($form) {
        var $textarea = $form.find('textarea'),
            link = this.getLink(),
            value = $.trim($textarea.val()),
            arrayValue = [],
            resultValue = []

        if (value.length) {
            value = value.replace(/\r\n/g, '\n')
            arrayValue = value.split('\n')

            for (var i = 0, len = arrayValue.length; i < len; i++) {
                var currentValue = $.trim(arrayValue[i])

                if (currentValue.length > 0) {
                    resultValue.push(currentValue)
                }
            }
        }

        this.inspector.setPropertyValue(this.propertyDefinition.property, resultValue)
    }

    $.oc.inspector.propertyEditors.stringList = StringListEditor
}(window.jQuery);
;
/*
 * Inspector string list with autocompletion editor class.
 *
 * TODO: validation is not implemented in this editor. See the Dictionary editor for reference.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.popupBase,
        BaseProto = Base.prototype

    var StringListAutocomplete = function(inspector, propertyDefinition, containerCell, group) {
        this.items = null

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    StringListAutocomplete.prototype = Object.create(BaseProto)
    StringListAutocomplete.prototype.constructor = Base

    StringListAutocomplete.prototype.dispose = function() {
        BaseProto.dispose.call(this)
    }

    StringListAutocomplete.prototype.init = function() {
        BaseProto.init.call(this)
    }

    StringListAutocomplete.prototype.supportsExternalParameterEditor = function() {
        return false
    }

    StringListAutocomplete.prototype.setLinkText = function(link, value) {
        var value = value !== undefined ? value
                : this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        this.checkValueType(value)

        if (!value) {
            value = this.propertyDefinition.placeholder
            $.oc.foundation.element.addClass(link, 'cell-placeholder')

            if (!value) {
                value = '[]'
            }

            link.textContent = value
        }
        else {
            $.oc.foundation.element.removeClass(link, 'cell-placeholder')

            link.textContent = '[' + value.join(', ') + ']'
        }
    }

    StringListAutocomplete.prototype.checkValueType = function(value) {
        if (value && Object.prototype.toString.call(value) !== '[object Array]') {
            this.throwError('The string list value should be an array.')
        }
    }

    //
    // Popup editor methods
    //

    StringListAutocomplete.prototype.getPopupContent = function() {
        return '<form>                                                                                     \
                <div class="modal-header">                                                                 \
                    <h4 class="modal-title">{{property}}</h4>                                              \
                    <button type="button" class="btn-close" data-dismiss="popup"></button>                 \
                </div>                                                                                     \
                <div class="modal-body">                                                                   \
                    <div class="control-toolbar">                                                          \
                        <div class="toolbar-item">                                                         \
                            <div class="btn-group">                                                        \
                                <button type="button" class="btn btn-primary                               \
                                    oc-icon-plus"                                                          \
                                    data-cmd="create-item">'+oc.lang.get('inspector.add')+'</button>       \
                                <button type="button" class="btn btn-default                               \
                                    empty oc-icon-trash"                                                 \
                                    data-cmd="delete-item"></button>                                       \
                            </div>                                                                         \
                        </div>                                                                             \
                    </div>                                                                                 \
                    <div class="form-group">                                                               \
                        <div class="inspector-dictionary-container">                                       \
                            <div class="values">                                                           \
                                <div class="control-scrollpad"                                             \
                                    data-control="scrollpad">                                              \
                                    <div class="scroll-wrapper">                                           \
                                        <table class="                                                     \
                                            no-offset-bottom                                               \
                                            inspector-dictionary-table">                                   \
                                        </table>                                                           \
                                    </div>                                                                 \
                                </div>                                                                     \
                            </div>                                                                         \
                        </div>                                                                             \
                    </div>                                                                                 \
                </div>                                                                                     \
                <div class="modal-footer">                                                                 \
                    <button type="submit" class="btn btn-primary">'+oc.lang.get('inspector.ok')+'</button> \
                    <button type="button" class="btn btn-default" data-dismiss="popup">'+oc.lang.get('inspector.cancel')+'</button>   \
                </div>                                                                                     \
                </form>'
    }

    StringListAutocomplete.prototype.configurePopup = function(popup) {
        this.initAutocomplete()

        this.buildItemsTable(popup.get(0))

        this.focusFirstInput()
    }

    StringListAutocomplete.prototype.handleSubmit = function($form) {
        return this.applyValues()
    }

    //
    // Building and row management
    //

    StringListAutocomplete.prototype.buildItemsTable = function(popup) {
        var table = popup.querySelector('table.inspector-dictionary-table'),
            tbody = document.createElement('tbody'),
            items = this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (items === undefined) {
            items = this.propertyDefinition.default
        }

        if (items === undefined || this.getValueKeys(items).length === 0) {
            var row = this.buildEmptyRow()

            tbody.appendChild(row)
        }
        else {
            for (var key in items) {
                var row = this.buildTableRow(items[key])

                tbody.appendChild(row)
            }
        }

        table.appendChild(tbody)
        this.updateScrollpads()
    }

    StringListAutocomplete.prototype.buildTableRow = function(value) {
        var row = document.createElement('tr'),
            valueCell = document.createElement('td')

        this.createInput(valueCell, value)

        row.appendChild(valueCell)

        return row
    }

    StringListAutocomplete.prototype.buildEmptyRow = function() {
        return this.buildTableRow(null)
    }

    StringListAutocomplete.prototype.createInput = function(container, value) {
        var input = document.createElement('input'),
            controlContainer = document.createElement('div')

        input.setAttribute('type', 'text')
        input.setAttribute('class', 'form-control')
        input.value = value

        controlContainer.appendChild(input)
        container.appendChild(controlContainer)
    }

    StringListAutocomplete.prototype.setActiveCell = function(input) {
        var activeCells = this.popup.querySelectorAll('td.active')

        for (var i = activeCells.length-1; i >= 0; i--) {
            $.oc.foundation.element.removeClass(activeCells[i], 'active')
        }

        var activeCell = input.parentNode.parentNode // input / div / td
        $.oc.foundation.element.addClass(activeCell, 'active')

        this.buildAutoComplete(input)
    }

    StringListAutocomplete.prototype.createItem = function() {
        var activeRow = this.getActiveRow(),
            newRow = this.buildEmptyRow(),
            tbody = this.getTableBody(),
            nextSibling = activeRow ? activeRow.nextElementSibling : null

        tbody.insertBefore(newRow, nextSibling)

        this.focusAndMakeActive(newRow.querySelector('input'))
        this.updateScrollpads()
    }

    StringListAutocomplete.prototype.deleteItem = function() {
        var activeRow = this.getActiveRow(),
            tbody = this.getTableBody()

        if (!activeRow) {
            return
        }

        var nextRow = activeRow.nextElementSibling,
            prevRow = activeRow.previousElementSibling,
            input = this.getRowInputByIndex(activeRow, 0)

        if (input) {
            this.removeAutocomplete(input)
        }

        tbody.removeChild(activeRow)

        var newSelectedRow = nextRow ? nextRow : prevRow

        if (!newSelectedRow) {
            newSelectedRow = this.buildEmptyRow()
            tbody.appendChild(newSelectedRow)
        }

        this.focusAndMakeActive(newSelectedRow.querySelector('input'))
        this.updateScrollpads()
    }

    StringListAutocomplete.prototype.applyValues = function() {
        var tbody = this.getTableBody(),
            dataRows = tbody.querySelectorAll('tr'),
            link = this.getLink(),
            result = []

        for (var i = 0, len = dataRows.length; i < len; i++) {
            var dataRow = dataRows[i],
                valueInput = this.getRowInputByIndex(dataRow, 0),
                value = $.trim(valueInput.value)

            if (value.length == 0) {
                continue
            }

            result.push(value)
        }

        this.inspector.setPropertyValue(this.propertyDefinition.property, result)
        this.setLinkText(link, result)
    }

    //
    // Helpers
    //

    StringListAutocomplete.prototype.getValueKeys = function(value) {
        var result = []

        for (var key in value) {
            result.push(key)
        }

        return result
    }

    StringListAutocomplete.prototype.getActiveRow = function() {
        var activeCell = this.popup.querySelector('td.active')

        if (!activeCell) {
            return null
        }

        return activeCell.parentNode
    }

    StringListAutocomplete.prototype.getTableBody = function() {
        return this.popup.querySelector('table.inspector-dictionary-table tbody')
    }

    StringListAutocomplete.prototype.updateScrollpads = function() {
        $('.control-scrollpad', this.popup).scrollpad('update')
    }

    StringListAutocomplete.prototype.focusFirstInput = function() {
        var input = this.popup.querySelector('td input')

        if (input) {
            input.focus()
            this.setActiveCell(input)
        }
    }

    StringListAutocomplete.prototype.getEditorCell = function(cell) {
        return cell.parentNode.parentNode // cell / div / td
    }

    StringListAutocomplete.prototype.getEditorRow = function(cell) {
        return cell.parentNode.parentNode.parentNode // cell / div / td / tr
    }

    StringListAutocomplete.prototype.focusAndMakeActive = function(input) {
        input.focus()
        this.setActiveCell(input)
    }

    StringListAutocomplete.prototype.getRowInputByIndex = function(row, index) {
        return row.cells[index].querySelector('input')
    }

    //
    // Navigation
    //

    StringListAutocomplete.prototype.navigateDown = function(ev) {
        var cell = this.getEditorCell(ev.currentTarget),
            row = this.getEditorRow(ev.currentTarget),
            nextRow = row.nextElementSibling

        if (!nextRow) {
            return
        }

        var newActiveEditor = nextRow.cells[cell.cellIndex].querySelector('input')

        this.focusAndMakeActive(newActiveEditor)
    }

    StringListAutocomplete.prototype.navigateUp = function(ev) {
        var cell = this.getEditorCell(ev.currentTarget),
            row = this.getEditorRow(ev.currentTarget),
            prevRow = row.previousElementSibling

        if (!prevRow) {
            return
        }

        var newActiveEditor = prevRow.cells[cell.cellIndex].querySelector('input')

        this.focusAndMakeActive(newActiveEditor)
    }

    //
    // Autocomplete
    //

    StringListAutocomplete.prototype.initAutocomplete = function() {
        if (this.propertyDefinition.items !== undefined) {
            this.items = this.prepareItems(this.propertyDefinition.items)
            this.initializeAutocompleteForCurrentInput()
        }
        else {
            this.loadDynamicItems()
        }
    }

    StringListAutocomplete.prototype.initializeAutocompleteForCurrentInput = function() {
        var activeElement = document.activeElement

        if (!activeElement) {
            return
        }

        var inputs = this.popup.querySelectorAll('td input.form-control')

        if (!inputs) {
            return
        }

        for (var i=inputs.length-1; i>=0; i--) {
            if (inputs[i] === activeElement) {
                this.buildAutoComplete(inputs[i])
                return
            }
        }
    }

    StringListAutocomplete.prototype.buildAutoComplete = function(input) {
        if (this.items === null) {
            return
        }

        $(input).autocomplete({
            source: this.items,
            matchWidth: true,
            menu: '<ul class="autocomplete dropdown-menu inspector-autocomplete"></ul>',
            bodyContainer: true
        })
    }

    StringListAutocomplete.prototype.removeAutocomplete = function(input) {
        var $input = $(input)

        if (!$input.data('autocomplete')) {
            return
        }

        $input.autocomplete('destroy')
    }

    StringListAutocomplete.prototype.prepareItems = function(items) {
        var result = {}

        if (Array.isArray(items)) {
            for (var i = 0, len = items.length; i < len; i++) {
                result[items[i]] = items[i]
            }
        }
        else {
            result = items
        }

        return result
    }

    StringListAutocomplete.prototype.loadDynamicItems = function() {
        if (this.isDisposed()) {
            return;
        }

        var data = this.getRootSurface().getValues(),
            $form = $(this.popup).find('form');

        if (this.triggerGetItems(data) === false) {
            return;
        }

        data['inspectorProperty'] = this.getPropertyPath();
        data['inspectorClassName'] = this.inspector.options.inspectorClass;

        $form.request(this.inspector.getEventHandler('onInspectableGetOptions'), {
            data: data,
            progressBar: false
        })
        .done(this.proxy(this.itemsRequestDone));
    }

    StringListAutocomplete.prototype.triggerGetItems = function(values) {
        var $inspectable = this.getInspectableElement()
        if (!$inspectable) {
            return true
        }

        var itemsEvent = $.Event('autocompleteitems.oc.inspector')

        $inspectable.trigger(itemsEvent, [{
            values: values,
            callback: this.proxy(this.itemsRequestDone),
            property: this.inspector.getPropertyPath(this.propertyDefinition.property),
            propertyDefinition: this.propertyDefinition
        }])

        if (itemsEvent.isDefaultPrevented()) {
            return false
        }

        return true
    }

    StringListAutocomplete.prototype.itemsRequestDone = function(data) {
        if (this.isDisposed()) {
            // Handle the case when the asynchronous request finishes after
            // the editor is disposed
            return
        }

        var loadedItems = {}

        if (data.options) {
            for (var i = data.options.length-1; i >= 0; i--) {
                loadedItems[data.options[i].value] = data.options[i].title
            }
        }

        this.items = this.prepareItems(loadedItems)
        this.initializeAutocompleteForCurrentInput()
    }

    StringListAutocomplete.prototype.removeAutocompleteFromAllRows = function() {
        var inputs = this.popup.querySelector('td input.form-control')

        for (var i=inputs.length-1; i>=0; i--) {
            this.removeAutocomplete(inputs[i])
        }
    }

    //
    // Event handlers
    //

    StringListAutocomplete.prototype.onPopupShown = function(ev, link, popup) {
        BaseProto.onPopupShown.call(this,ev, link, popup)

        popup.on('focus.inspector', 'td input', this.proxy(this.onFocus))
        popup.on('blur.inspector', 'td input', this.proxy(this.onBlur))
        popup.on('keydown.inspector', 'td input', this.proxy(this.onKeyDown))
        popup.on('click.inspector', '[data-cmd]', this.proxy(this.onCommand))
    }

    StringListAutocomplete.prototype.onPopupHidden = function(ev, link, popup) {
        popup.off('.inspector', 'td input')
        popup.off('.inspector', '[data-cmd]', this.proxy(this.onCommand))

        this.removeAutocompleteFromAllRows()
        this.items = null

        BaseProto.onPopupHidden.call(this, ev, link, popup)
    }

    StringListAutocomplete.prototype.onFocus = function(ev) {
        this.setActiveCell(ev.currentTarget)
    }

    StringListAutocomplete.prototype.onBlur = function(ev) {
        if ($(ev.relatedTarget).closest('ul.inspector-autocomplete').length > 0) {
            // Do not close the autocomplete results if a drop-down
            // menu item was clicked
            return
        }

        this.removeAutocomplete(ev.currentTarget)
    }

    StringListAutocomplete.prototype.onCommand = function(ev) {
        var command = ev.currentTarget.getAttribute('data-cmd')

        switch (command) {
            case 'create-item' :
                this.createItem()
            break;
            case 'delete-item' :
                this.deleteItem()
            break;
        }
    }

    StringListAutocomplete.prototype.onKeyDown = function(ev) {
        if (ev.key === 'ArrowDown') {
            return this.navigateDown(ev)
        }
        else if (ev.key === 'ArrowUp') {
            return this.navigateUp(ev)
        }
    }

    $.oc.inspector.propertyEditors.stringListAutocomplete = StringListAutocomplete
}(window.jQuery);
;
/*
 * Inspector dictionary editor class.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.popupBase,
        BaseProto = Base.prototype

    var DictionaryEditor = function(inspector, propertyDefinition, containerCell, group) {
        this.keyValidationSet = null
        this.valueValidationSet = null

        Base.call(this, inspector, propertyDefinition, containerCell, group)
    }

    DictionaryEditor.prototype = Object.create(BaseProto)
    DictionaryEditor.prototype.constructor = Base

    DictionaryEditor.prototype.dispose = function() {
        this.disposeValidators()

        this.keyValidationSet = null
        this.valueValidationSet = null

        BaseProto.dispose.call(this)
    }

    DictionaryEditor.prototype.init = function() {
        this.initValidators()

        BaseProto.init.call(this)
    }

    DictionaryEditor.prototype.supportsExternalParameterEditor = function() {
        return false
    }

    //
    // Popup editor methods
    //

    DictionaryEditor.prototype.setLinkText = function(link, value) {
        var value = value !== undefined ? value
                : this.inspector.getPropertyValue(this.propertyDefinition.property)

        if (value === undefined) {
            value = this.propertyDefinition.default
        }

        if (value === undefined || $.isEmptyObject(value)) {
            var placeholder = this.propertyDefinition.placeholder

            if (placeholder !== undefined) {
                $.oc.foundation.element.addClass(link, 'cell-placeholder')
                link.textContent = placeholder
            }
            else {
                link.textContent = 'Items: 0'
            }
        }
        else {
            if (typeof value !== 'object') {
                this.throwError('Object list value should be an object.')
            }

            var itemCount = this.getValueKeys(value).length

            $.oc.foundation.element.removeClass(link, 'cell-placeholder')
            link.textContent = 'Items: ' + itemCount
        }
    }

    DictionaryEditor.prototype.getPopupContent = function() {
        return '<form>                                                                                      \
                <div class="modal-header">                                                                  \
                    <h4 class="modal-title">{{property}}</h4>                                               \
                    <button type="button" class="btn-close" data-dismiss="popup"></button>                  \
                </div>                                                                                      \
                <div class="modal-body">                                                                    \
                    <div class="control-toolbar">                                                           \
                        <div class="toolbar-item">                                                          \
                            <div class="btn-group">                                                         \
                                <button type="button" class="btn btn-primary                                \
                                    oc-icon-plus"                                                           \
                                    data-cmd="create-item">'+oc.lang.get('inspector.add')+'</button>        \
                                <button type="button" class="btn btn-default                                \
                                    empty oc-icon-trash"                                                  \
                                    data-cmd="delete-item"></button>                                        \
                            </div>                                                                          \
                        </div>                                                                              \
                    </div>                                                                                  \
                    <div class="form-group">                                                                \
                        <div class="inspector-dictionary-container">                                        \
                            <table class="headers">                                                         \
                                <thead>                                                                     \
                                    <tr>                                                                    \
                                        <td>'+oc.lang.get('inspector.key')+'</td>                           \
                                        <td>'+oc.lang.get('inspector.value')+'</td>                         \
                                    </tr>                                                                   \
                                </thead>                                                                    \
                            </table>                                                                        \
                            <div class="values">                                                            \
                                <div class="control-scrollpad"                                              \
                                    data-control="scrollpad">                                               \
                                    <div class="scroll-wrapper">                                            \
                                        <table class="                                                      \
                                            no-offset-bottom                                                \
                                            inspector-dictionary-table">                                    \
                                        </table>                                                            \
                                    </div>                                                                  \
                                </div>                                                                      \
                            </div>                                                                          \
                        </div>                                                                              \
                    </div>                                                                                  \
                </div>                                                                                      \
                <div class="modal-footer">                                                                  \
                    <button type="submit" class="btn btn-primary">'+oc.lang.get('inspector.ok')+'</button>  \
                    <button type="button" class="btn btn-default" data-dismiss="popup">'+oc.lang.get('inspector.cancel')+'</button> \
                </div>                                                                                      \
            </form>'
    }

    DictionaryEditor.prototype.configurePopup = function(popup) {
        this.buildItemsTable(popup.get(0))

        this.focusFirstInput()
    }

    DictionaryEditor.prototype.handleSubmit = function($form) {
        return this.applyValues()
    }

    //
    // Building and row management
    //

    DictionaryEditor.prototype.buildItemsTable = function(popup) {
        var table = popup.querySelector('table.inspector-dictionary-table'),
            tbody = document.createElement('tbody'),
            items = this.inspector.getPropertyValue(this.propertyDefinition.property),
            titleProperty = this.propertyDefinition.titleProperty

        if (items === undefined) {
            items = this.propertyDefinition.default
        }

        if (items === undefined || this.getValueKeys(items).length === 0) {
            var row = this.buildEmptyRow()

            tbody.appendChild(row)
        }
        else {
            for (var key in items) {
                var row = this.buildTableRow(key, items[key])

                tbody.appendChild(row)
            }
        }

        table.appendChild(tbody)
        this.updateScrollpads()
    }

    DictionaryEditor.prototype.buildTableRow = function(key, value) {
        var row = document.createElement('tr'),
            keyCell = document.createElement('td'),
            valueCell = document.createElement('td')

        this.createInput(keyCell, key)
        this.createInput(valueCell, value)

        row.appendChild(keyCell)
        row.appendChild(valueCell)

        return row
    }

    DictionaryEditor.prototype.buildEmptyRow = function() {
        return this.buildTableRow(null, null)
    }

    DictionaryEditor.prototype.createInput = function(container, value) {
        var input = document.createElement('input'),
            controlContainer = document.createElement('div')

        input.setAttribute('type', 'text')
        input.setAttribute('class', 'form-control')
        input.value = value

        controlContainer.appendChild(input)
        container.appendChild(controlContainer)
    }

    DictionaryEditor.prototype.setActiveCell = function(input) {
        var activeCells = this.popup.querySelectorAll('td.active')

        for (var i = activeCells.length-1; i >= 0; i--) {
            $.oc.foundation.element.removeClass(activeCells[i], 'active')
        }

        var activeCell = input.parentNode.parentNode // input / div / td
        $.oc.foundation.element.addClass(activeCell, 'active')
    }

    DictionaryEditor.prototype.createItem = function() {
        var activeRow = this.getActiveRow(),
            newRow = this.buildEmptyRow(),
            tbody = this.getTableBody(),
            nextSibling = activeRow ? activeRow.nextElementSibling : null

        tbody.insertBefore(newRow, nextSibling)

        this.focusAndMakeActive(newRow.querySelector('input'))
        this.updateScrollpads()
    }

    DictionaryEditor.prototype.deleteItem = function() {
        var activeRow = this.getActiveRow(),
            tbody = this.getTableBody()

        if (!activeRow) {
            return
        }

        var nextRow = activeRow.nextElementSibling,
            prevRow = activeRow.previousElementSibling

        tbody.removeChild(activeRow)

        var newSelectedRow = nextRow ? nextRow : prevRow

        if (!newSelectedRow) {
            newSelectedRow = this.buildEmptyRow()
            tbody.appendChild(newSelectedRow)
        }

        this.focusAndMakeActive(newSelectedRow .querySelector('input'))
        this.updateScrollpads()
    }

    DictionaryEditor.prototype.applyValues = function() {
        var tbody = this.getTableBody(),
            dataRows = tbody.querySelectorAll('tr'),
            link = this.getLink(),
            result = {}

        for (var i = 0, len = dataRows.length; i < len; i++) {
            var dataRow = dataRows[i],
                keyInput = this.getRowInputByIndex(dataRow, 0),
                valueInput = this.getRowInputByIndex(dataRow, 1),
                key = $.trim(keyInput.value),
                value = $.trim(valueInput.value)

            if (key.length == 0 && value.length == 0) {
                continue
            }

            if (key.length == 0) {
                $.oc.flashMsg({text: 'The key cannot be empty.', 'class': 'error', 'interval': 3})
                this.focusAndMakeActive(keyInput)
                return false
            }

            if (value.length == 0) {
                $.oc.flashMsg({text: 'The value cannot be empty.', 'class': 'error', 'interval': 3})
                this.focusAndMakeActive(valueInput)
                return false
            }

            if (result[key] !== undefined) {
                $.oc.flashMsg({text: 'Keys should be unique.', 'class': 'error', 'interval': 3})
                this.focusAndMakeActive(keyInput)
                return false
            }

            var validationResult = this.keyValidationSet.validate(key)
            if (validationResult !== null) {
                $.oc.flashMsg({text: validationResult, 'class': 'error', 'interval': 5})
                return false
            }

            validationResult = this.valueValidationSet.validate(value)
            if (validationResult !== null) {
                $.oc.flashMsg({text: validationResult, 'class': 'error', 'interval': 5})
                return false
            }

            result[key] = value
        }

        this.inspector.setPropertyValue(this.propertyDefinition.property, result)
        this.setLinkText(link, result)
    }

    //
    // Helpers
    //

    DictionaryEditor.prototype.getValueKeys = function(value) {
        var result = []

        for (var key in value) {
            result.push(key)
        }

        return result
    }

    DictionaryEditor.prototype.getActiveRow = function() {
        var activeCell = this.popup.querySelector('td.active')

        if (!activeCell) {
            return null
        }

        return activeCell.parentNode
    }

    DictionaryEditor.prototype.getTableBody = function() {
        return this.popup.querySelector('table.inspector-dictionary-table tbody')
    }

    DictionaryEditor.prototype.updateScrollpads = function() {
        $('.control-scrollpad', this.popup).scrollpad('update')
    }

    DictionaryEditor.prototype.focusFirstInput = function() {
        var input = this.popup.querySelector('td input')

        if (input) {
            input.focus()
            this.setActiveCell(input)
        }
    }

    DictionaryEditor.prototype.getEditorCell = function(cell) {
        return cell.parentNode.parentNode // cell / div / td
    }

    DictionaryEditor.prototype.getEditorRow = function(cell) {
        return cell.parentNode.parentNode.parentNode // cell / div / td / tr
    }

    DictionaryEditor.prototype.focusAndMakeActive = function(input) {
        input.focus()
        this.setActiveCell(input)
    }

    DictionaryEditor.prototype.getRowInputByIndex = function(row, index) {
        return row.cells[index].querySelector('input')
    }

    //
    // Navigation
    //

    DictionaryEditor.prototype.navigateDown = function(ev) {
        var cell = this.getEditorCell(ev.currentTarget),
            row = this.getEditorRow(ev.currentTarget),
            nextRow = row.nextElementSibling

        if (!nextRow) {
            return
        }

        var newActiveEditor = nextRow.cells[cell.cellIndex].querySelector('input')

        this.focusAndMakeActive(newActiveEditor)
    }

    DictionaryEditor.prototype.navigateUp = function(ev) {
        var cell = this.getEditorCell(ev.currentTarget),
            row = this.getEditorRow(ev.currentTarget),
            prevRow = row.previousElementSibling

        if (!prevRow) {
            return
        }

        var newActiveEditor = prevRow.cells[cell.cellIndex].querySelector('input')

        this.focusAndMakeActive(newActiveEditor)
    }

    //
    // Validation
    //

    DictionaryEditor.prototype.initValidators = function() {
        this.keyValidationSet = new $.oc.inspector.validationSet({
            validation: this.propertyDefinition.validationKey
        }, this.propertyDefinition.property+'.validationKey')

        this.valueValidationSet = new $.oc.inspector.validationSet({
            validation: this.propertyDefinition.validationValue
        }, this.propertyDefinition.property+'.validationValue')
    }

    DictionaryEditor.prototype.disposeValidators = function() {
        this.keyValidationSet.dispose()
        this.valueValidationSet.dispose()
    }

    //
    // Event handlers
    //

    DictionaryEditor.prototype.onPopupShown = function(ev, link, popup) {
        BaseProto.onPopupShown.call(this,ev, link, popup )

        popup.on('focus.inspector', 'td input', this.proxy(this.onFocus))
        popup.on('keydown.inspector', 'td input', this.proxy(this.onKeyDown))
        popup.on('click.inspector', '[data-cmd]', this.proxy(this.onCommand))
    }

    DictionaryEditor.prototype.onPopupHidden = function(ev, link, popup) {
        popup.off('.inspector', 'td input')
        popup.off('.inspector', '[data-cmd]', this.proxy(this.onCommand))

        BaseProto.onPopupHidden.call(this, ev, link, popup)
    }

    DictionaryEditor.prototype.onFocus = function(ev) {
        this.setActiveCell(ev.currentTarget)
    }

    DictionaryEditor.prototype.onCommand = function(ev) {
        var command = ev.currentTarget.getAttribute('data-cmd')

        switch (command) {
            case 'create-item' :
                this.createItem()
            break;
            case 'delete-item' :
                this.deleteItem()
            break;
        }
    }

    DictionaryEditor.prototype.onKeyDown = function(ev) {
        if (ev.key === 'ArrowDown') {
            return this.navigateDown(ev)
        }
        else if (ev.key === 'ArrowUp') {
            return this.navigateUp(ev)
        }
    }

    $.oc.inspector.propertyEditors.dictionary = DictionaryEditor
}(window.jQuery);
;
/*
 * Inspector autocomplete editor class.
 *
 * Depends on october.autocomplete.js
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.propertyEditors.string,
        BaseProto = Base.prototype;

    var AutocompleteEditor = function(inspector, propertyDefinition, containerCell, group) {
        this.autoUpdateTimeout = null;

        Base.call(this, inspector, propertyDefinition, containerCell, group);
    }

    AutocompleteEditor.prototype = Object.create(BaseProto);
    AutocompleteEditor.prototype.constructor = Base;

    AutocompleteEditor.prototype.dispose = function() {
        this.clearAutoUpdateTimeout();
        this.removeAutocomplete();

        BaseProto.dispose.call(this);
    }

    AutocompleteEditor.prototype.build = function() {
        var container = document.createElement('div'),
            editor = document.createElement('input'),
            placeholder = this.propertyDefinition.placeholder !== undefined ? this.propertyDefinition.placeholder : '',
            value = this.inspector.getPropertyValue(this.propertyDefinition.property);

        editor.setAttribute('type', 'text');
        editor.setAttribute('class', 'string-editor');
        editor.setAttribute('placeholder', placeholder);

        container.setAttribute('class', 'autocomplete-container');

        if (value === undefined) {
            value = this.propertyDefinition.default;
        }

        if (value === undefined) {
            value = '';
        }

        editor.value = value;

        $.oc.foundation.element.addClass(this.containerCell, 'text autocomplete');

        container.appendChild(editor);
        this.containerCell.appendChild(container);

        if (this.propertyDefinition.items !== undefined) {
            this.buildAutoComplete(this.propertyDefinition.items);
        }
        else {
            this.loadDynamicItems();
        }
    }

    AutocompleteEditor.prototype.buildAutoComplete = function(items) {
        var input = this.getInput()

        if (items === undefined) {
            items = [];
        }

        var $input = $(input),
            autocomplete = $input.data('autocomplete')

        if (!autocomplete) {
            $input.autocomplete({
                source: this.prepareItems(items),
                matchWidth: true
            });
        }
        else {
            autocomplete.source = this.prepareItems(items);
        }
    }

    AutocompleteEditor.prototype.removeAutocomplete = function() {
        var input = this.getInput();

        $(input).autocomplete('destroy');
    }

    AutocompleteEditor.prototype.prepareItems = function(items) {
        var result = {};

        if (Array.isArray(items)) {
            for (var i = 0, len = items.length; i < len; i++) {
                result[items[i]] = items[i];
            }
        }
        else {
            result = items;
        }

        return result;
    }

    AutocompleteEditor.prototype.supportsExternalParameterEditor = function() {
        return false;
    }

    AutocompleteEditor.prototype.getContainer = function() {
        return this.getInput().parentNode;
    }

    AutocompleteEditor.prototype.registerHandlers = function() {
        BaseProto.registerHandlers.call(this);

        $(this.getInput()).on('change', this.proxy(this.onInputKeyUp));
    }

    AutocompleteEditor.prototype.unregisterHandlers = function() {
        BaseProto.unregisterHandlers.call(this);

        $(this.getInput()).off('change', this.proxy(this.onInputKeyUp));
    }

    AutocompleteEditor.prototype.saveDependencyValues = function() {
        this.prevDependencyValues = this.getDependencyValues();
    }

    AutocompleteEditor.prototype.getDependencyValues = function() {
        var result = '';

        for (var i = 0, len = this.propertyDefinition.depends.length; i < len; i++) {
            var property = this.propertyDefinition.depends[i],
                value = this.inspector.getPropertyValue(property);

            if (value === undefined) {
                value = '';
            }

            result += property + ':' + value + '-';
        }

        return result;
    }

    AutocompleteEditor.prototype.onInspectorPropertyChanged = function(property) {
        if (!this.propertyDefinition.depends || this.propertyDefinition.depends.indexOf(property) === -1) {
            return;
        }

        this.clearAutoUpdateTimeout();

        if (this.prevDependencyValues === undefined || this.prevDependencyValues != dependencyValues) {
            this.autoUpdateTimeout = setTimeout(this.proxy(this.loadDynamicItems), 200);
        }
    }

    AutocompleteEditor.prototype.clearAutoUpdateTimeout = function() {
        if (this.autoUpdateTimeout !== null) {
            clearTimeout(this.autoUpdateTimeout);
            this.autoUpdateTimeout = null;
        }
    }

    //
    // Dynamic items
    //

    AutocompleteEditor.prototype.showLoadingIndicator = function() {
        $(this.getContainer()).loadIndicator();
    }

    AutocompleteEditor.prototype.hideLoadingIndicator = function() {
        if (this.isDisposed()) {
            return;
        }

        var $container = $(this.getContainer());

        $container.loadIndicator('hide');
        $container.loadIndicator('destroy');

        $container.removeClass('loading-indicator-container');
    }

    AutocompleteEditor.prototype.loadDynamicItems = function() {
        if (this.isDisposed()) {
            return;
        }

        this.clearAutoUpdateTimeout();

        var container = this.getContainer(),
            data = this.getRootSurface().getValues(),
            $form = $(container).closest('form');

        $.oc.foundation.element.addClass(container, 'loading-indicator-container size-small');
        this.showLoadingIndicator();

        if (this.triggerGetItems(data) === false) {
            return;
        }

        data['inspectorProperty'] = this.getPropertyPath();
        data['inspectorClassName'] = this.inspector.options.inspectorClass;

        $form.request(this.inspector.getEventHandler('onInspectableGetOptions'), {
            data: data,
            progressBar: false
        })
        .done(this.proxy(this.itemsRequestDone))
        .always(this.proxy(this.hideLoadingIndicator));
    }

    AutocompleteEditor.prototype.triggerGetItems = function(values) {
        var $inspectable = this.getInspectableElement();
        if (!$inspectable) {
            return true;
        }

        var itemsEvent = $.Event('autocompleteitems.oc.inspector');

        $inspectable.trigger(itemsEvent, [{
            values: values,
            callback: this.proxy(this.itemsRequestDone),
            property: this.inspector.getPropertyPath(this.propertyDefinition.property),
            propertyDefinition: this.propertyDefinition
        }]);

        if (itemsEvent.isDefaultPrevented()) {
            return false;
        }

        return true;
    }

    AutocompleteEditor.prototype.itemsRequestDone = function(data) {
        if (this.isDisposed()) {
            // Handle the case when the asynchronous request finishes after
            // the editor is disposed
            return
        }

        this.hideLoadingIndicator();

        var loadedItems = {};

        if (data.options) {
            for (var i = data.options.length-1; i >= 0; i--) {
                loadedItems[data.options[i].value] = data.options[i].title;
            }
        }

        this.buildAutoComplete(loadedItems);
    }

    $.oc.inspector.propertyEditors.autocomplete = AutocompleteEditor;
}(window.jQuery);

;
/*
 * Inspector helper functions.
 *
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.inspector === undefined)
        $.oc.inspector = {}

    $.oc.inspector.helpers = {}

    $.oc.inspector.helpers.generateElementUniqueId = function(element) {
        if (element.hasAttribute('data-inspector-id')) {
            return element.getAttribute('data-inspector-id');
        }

        var id = $.oc.inspector.helpers.generateUniqueId();
        element.setAttribute('data-inspector-id', id);

        return id;
    }

    $.oc.inspector.helpers.generateUniqueId = function() {
        return "inspectorid-" + Math.floor(Math.random() * new Date().getTime());
    }

    $.oc.inspector.helpers.getEventHandler = function(element, handler) {
        if (element instanceof jQuery){
            element = element.get(0);
        }

        var handlerAlias = element.dataset.inspectorHandlerAlias;
        if (handlerAlias) {
            return handlerAlias + '::' + handler;
        }

        return handler;
    }

}(window.jQuery)
;
/*
 * Inspector validation set class.
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

      if ($.oc.inspector.validators === undefined)
        $.oc.inspector.validators = {}

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var ValidationSet = function(options, propertyName) {
        this.validators = []

        this.options = options
        this.propertyName = propertyName
        Base.call(this)

        this.createValidators()
    }

    ValidationSet.prototype = Object.create(BaseProto)
    ValidationSet.prototype.constructor = Base

    ValidationSet.prototype.dispose = function() {
        this.disposeValidators()
        this.validators = null

        BaseProto.dispose.call(this)
    }

    ValidationSet.prototype.disposeValidators = function() {
        for (var i = 0, len = this.validators.length; i < len; i++) {
            this.validators[i].dispose()
        }
    }

    ValidationSet.prototype.throwError = function(errorMessage) {
        throw new Error(errorMessage + ' Property: ' + this.propertyName)
    }

    ValidationSet.prototype.createValidators = function() {
        // Handle legacy validation syntax properties:
        //
        // - required
        // - validationPattern
        // - validationMessage 

        if ((this.options.required !== undefined ||
            this.options.validationPattern !== undefined ||
            this.options.validationMessage !== undefined) &&
            this.options.validation !== undefined) {
            this.throwError('Legacy and new validation syntax should not be mixed.')
        }

        if (this.options.required !== undefined && this.options.required) {
            var validator = new $.oc.inspector.validators.required({
                message: this.options.validationMessage
            })

            this.validators.push(validator)
        }

        if (this.options.validationPattern !== undefined) {
            var validator = new $.oc.inspector.validators.regex({
                message: this.options.validationMessage,
                pattern: this.options.validationPattern
            })

            this.validators.push(validator)
        }

        //
        // Handle new validation syntax
        //

        if (this.options.validation === undefined) {
            return
        }

        for (var validatorName in this.options.validation) {
            if ($.oc.inspector.validators[validatorName] == undefined) {
                this.throwError('Inspector validator "' + validatorName + '" is not found in the $.oc.inspector.validators namespace.')
            }

            var validator = new $.oc.inspector.validators[validatorName](
                    this.options.validation[validatorName]
                )

            this.validators.push(validator)
        }
    }

    ValidationSet.prototype.validate = function(value) {
        try {
            for (var i = 0, len = this.validators.length; i < len; i++) {
                var validator = this.validators[i],
                    errorMessage = validator.isValid(value)

                if (typeof errorMessage === 'string') {
                    return errorMessage
                }
            }

            return null
        }
        catch (err) {
            this.throwError(err)
        }
    }

    $.oc.inspector.validationSet = ValidationSet
}(window.jQuery);
;
/*
 * Inspector validator base class.
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

    if ($.oc.inspector.validators === undefined)
        $.oc.inspector.validators = {}

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var BaseValidator = function(options) {
        this.options = options
        this.defaultMessage = 'Invalid property value.'

        Base.call(this)
    }

    BaseValidator.prototype = Object.create(BaseProto)
    BaseValidator.prototype.constructor = Base

    BaseValidator.prototype.dispose = function() {
        this.defaultMessage = null

        BaseProto.dispose.call(this)
    }

    BaseValidator.prototype.getMessage = function(defaultMessage) {
        if (this.options.message !== undefined) {
            return this.options.message
        }

        if (defaultMessage !== undefined) {
            return defaultMessage
        }

        return this.defaultMessage
    }

    BaseValidator.prototype.isScalar = function(value) {
        if (value === undefined || value === null) {
            return true
        }

        return !!(typeof value === 'string' || typeof value == 'number' || typeof value == 'boolean');
    }

    BaseValidator.prototype.isValid = function(value) {
        return null
    }

    $.oc.inspector.validators.base = BaseValidator
}(window.jQuery);
;
/*
 * Base class for Inspector numeric validators.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.validators.base,
        BaseProto = Base.prototype

    var BaseNumber = function(options) {
        Base.call(this, options)
    }

    BaseNumber.prototype = Object.create(BaseProto)
    BaseNumber.prototype.constructor = Base

    BaseNumber.prototype.doCommonChecks = function(value) {
       if (this.options.min !== undefined || this.options.max !== undefined) {
            if (this.options.min !== undefined) {
                if (this.options.min.value === undefined) {
                    throw new Error('The min.value parameter is not defined in the Inspector validator configuration')
                }

                if (value < this.options.min.value) {
                    return this.options.min.message !== undefined ?
                        this.options.min.message :
                        "The value should not be less than " + this.options.min.value
                }
            }

            if (this.options.max !== undefined) {
                if (this.options.max.value === undefined) {
                    throw new Error('The max.value parameter is not defined in the table Inspector validator configuration')
                }

                if (value > this.options.max.value) {
                    return this.options.max.message !== undefined ?
                        this.options.max.message :
                        "The value should not be greater than " + this.options.max.value
                }
            }
        }
    }

    $.oc.inspector.validators.baseNumber = BaseNumber
}(window.jQuery);
;
/*
 * Inspector required validator.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.validators.base,
        BaseProto = Base.prototype

    var RequiredValidator = function(options) {
        Base.call(this, options)

        this.defaultMessage = 'The property is required.'
    }

    RequiredValidator.prototype = Object.create(BaseProto)
    RequiredValidator.prototype.constructor = Base

    RequiredValidator.prototype.isValid = function(value) {
        if (value === undefined || value === null) {
            return this.getMessage()
        }

        if (typeof value === 'boolean') {
            return value ? null : this.getMessage()
        }

        if (typeof value === 'object') {
            return !$.isEmptyObject(value) ? null : this.getMessage()
        }

        return $.trim(String(value)).length > 0 ? null : this.getMessage()
    }

    $.oc.inspector.validators.required = RequiredValidator
}(window.jQuery);
;
/*
 * Inspector regex validator.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.validators.base,
        BaseProto = Base.prototype

    var RegexValidator = function(options) {
        Base.call(this, options)
    }

    RegexValidator.prototype = Object.create(BaseProto)
    RegexValidator.prototype.constructor = Base

    RegexValidator.prototype.isValid = function(value) {
        if (this.options.pattern === undefined) {
            this.throwError('The pattern parameter is not defined in the Regex Inspector validator configuration.')
        }

        if (!this.isScalar(value)) {
            this.throwError('The Regex Inspector validator can only be used with string values.')
        }

        if (value === undefined || value === null) {
            return null
        }

        var string = $.trim(String(value))

        if (string.length === 0) {
            return null
        }

        var regexObj = new RegExp(this.options.pattern, this.options.modifiers)

        return regexObj.test(string) ? null : this.getMessage()
    }

    $.oc.inspector.validators.regex = RegexValidator
}(window.jQuery);
;
/*
 * Inspector integer validator.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.validators.baseNumber,
        BaseProto = Base.prototype

    var IntegerValidator = function(options) {
        Base.call(this, options)
    }

    IntegerValidator.prototype = Object.create(BaseProto)
    IntegerValidator.prototype.constructor = Base

    IntegerValidator.prototype.isValid = function(value) {
        if (!this.isScalar(value) || typeof value == 'boolean') {
            this.throwError('The Integer Inspector validator can only be used with string values.')
        }

        if (value === undefined || value === null) {
            return null
        }

        var string = $.trim(String(value))

        if (string.length === 0) {
            return null
        }

        var testResult = this.options.allowNegative ? 
            /^\-?[0-9]*$/.test(string) : 
            /^[0-9]*$/.test(string)

        if (!testResult) {
            var defaultMessage = this.options.allowNegative ?
                'The value should be an integer.' :
                'The value should be a positive integer.';

            return this.getMessage(defaultMessage)
        }

        return this.doCommonChecks(parseInt(string))
    }

    $.oc.inspector.validators.integer = IntegerValidator
}(window.jQuery);
;
/*
 * Inspector float validator.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.validators.baseNumber,
        BaseProto = Base.prototype

    var FloatValidator = function(options) {
        Base.call(this, options)
    }

    FloatValidator.prototype = Object.create(BaseProto)
    FloatValidator.prototype.constructor = Base

    FloatValidator.prototype.isValid = function(value) {
        if (!this.isScalar(value) || typeof value == 'boolean') {
            this.throwError('The Float Inspector validator can only be used with string values.')
        }

        if (value === undefined || value === null) {
            return null
        }

        var string = $.trim(String(value))

        if (string.length === 0) {
            return null
        }

        var testResult = this.options.allowNegative ? 
            /^[-]?([0-9]+\.[0-9]+|[0-9]+)$/.test(string) : 
            /^([0-9]+\.[0-9]+|[0-9]+)$/.test(string)

        if (!testResult) {
            var defaultMessage = this.options.allowNegative ?
                'The value should be a floating point number.' :
                'The value should be a positive floating point number.';

            return this.getMessage(defaultMessage)
        }

        return this.doCommonChecks(parseFloat(string))
    }

    $.oc.inspector.validators.float = FloatValidator
}(window.jQuery);
;
/*
 * Inspector length validator.
 */
+function ($) { "use strict";

    var Base = $.oc.inspector.validators.base,
        BaseProto = Base.prototype

    var LengthValidator = function(options) {
        Base.call(this, options)
    }

    LengthValidator.prototype = Object.create(BaseProto)
    LengthValidator.prototype.constructor = Base

    LengthValidator.prototype.isValid = function(value) {
        if (value === undefined || value === null) {
            return null
        }

        if (typeof value == 'boolean') {
            this.throwError('The Length Inspector validator cannot work with Boolean values.')

        }

        var length = null

        if(Object.prototype.toString.call(value) === '[object Array]' || typeof value === 'string') {
            length = value.length
        }
        else if (typeof value === 'object') {
            length = this.getObjectLength(value)
        }

        if (this.options.min !== undefined || this.options.max !== undefined) {
            if (this.options.min !== undefined) {
                if (this.options.min.value === undefined) {
                    throw new Error('The min.value parameter is not defined in the Length Inspector validator configuration.')
                }

                if (length < this.options.min.value) {
                    return this.options.min.message !== undefined ?
                        this.options.min.message :
                        "The value should not be shorter than " + this.options.min.value
                }
            }

            if (this.options.max !== undefined) {
                if (this.options.max.value === undefined)
                    throw new Error('The max.value parameter is not defined in the Length Inspector validator configuration.')

                if (length > this.options.max.value) {
                    return this.options.max.message !== undefined ?
                        this.options.max.message :
                        "The value should not be longer than " + this.options.max.value
                }
            }
        }
    }

    LengthValidator.prototype.getObjectLength = function(value) {
        var result = 0

        for (var key in value) {
            result++
        }

        return result
    }

    $.oc.inspector.validators.length = LengthValidator
}(window.jQuery);
;
/*
 * External parameter editor for Inspector.
 *
 * The external parameter editor allows to use URL and
 * other external parameters as values for the inspectable
 * properties.
 *
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.inspector === undefined)
        $.oc.inspector = {}

    // CLASS DEFINITION
    // ============================

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var ExternalParameterEditor = function(inspector, propertyDefinition, containerCell, initialValue) {
        this.inspector = inspector
        this.propertyDefinition = propertyDefinition
        this.containerCell = containerCell
        this.initialValue = initialValue

        Base.call(this)

        this.init()
    }

    ExternalParameterEditor.prototype = Object.create(BaseProto)
    ExternalParameterEditor.prototype.constructor = Base

    ExternalParameterEditor.prototype.dispose = function() {
        this.disposeControls()
        this.unregisterHandlers()

        this.inspector = null
        this.propertyDefinition = null
        this.containerCell = null
        this.initialValue = null

        BaseProto.dispose.call(this)
    }

    ExternalParameterEditor.prototype.init = function() {
        this.tooltipText = 'Click to enter the external parameter name to load the property value from'

        this.build()
        this.registerHandlers()
        this.setInitialValue()
    }

    /**
     * Builds the external parameter editor markup:
     *
     * <div class="external-param-editor-container">
     *     <input> <-- original property editing input/markup
     *     <div class="external-editor">
     *         <div class="controls">
     *             <input type="text" tabindex="-1"/>
     *             <a href="#" tabindex="-1">
     *                 <i class="oc-icon-terminal"></i>
     *             </a>
     *         </div>
     *     </div>
     * </div>
     */
    ExternalParameterEditor.prototype.build = function() {
        var container = document.createElement('div'),
            editor = document.createElement('div'),
            controls = document.createElement('div'),
            input = document.createElement('input'),
            link = document.createElement('a'),
            icon = document.createElement('i')

        container.setAttribute('class', 'external-param-editor-container')
        editor.setAttribute('class', 'external-editor')
        controls.setAttribute('class', 'controls')
        input.setAttribute('type', 'text')
        input.setAttribute('tabindex', '-1')

        link.setAttribute('href', '#')
        link.setAttribute('class', 'external-editor-link')
        link.setAttribute('tabindex', '-1')
        link.setAttribute('title', this.tooltipText)
        $(link).tooltip({'container': 'body', delay: 500})

        icon.setAttribute('class', 'oc-icon-terminal')

        link.appendChild(icon)
        controls.appendChild(input)
        controls.appendChild(link)
        editor.appendChild(controls)

        while (this.containerCell.firstChild) {
            var child = this.containerCell.firstChild

            container.appendChild(child)
        }

        container.appendChild(editor)
        this.containerCell.appendChild(container)
    }

    ExternalParameterEditor.prototype.setInitialValue = function() {
        if (!this.initialValue) {
            return
        }

        if (typeof this.initialValue !== 'string') {
            return
        }

        var matches = []
        if (matches = this.initialValue.match(/^\{\{([^\}]+)\}\}$/)) {
            var value = $.trim(matches[1])

            if (value.length > 0) {
                this.showEditor(true)
                this.getInput().value = value
                this.inspector.setPropertyValue(this.propertyDefinition.property, null, true, true)
            }
        }
    }

    ExternalParameterEditor.prototype.showEditor = function(building) {
        var editor = this.getEditor(),
            input = this.getInput(),
            container = this.getContainer(),
            link = this.getLink()

        var position = $(editor).position()

        if (!building) {
            editor.style.right = 0
            editor.style.left = position.left + 'px'
        }
        else {
            editor.style.right = 0
        }

        setTimeout(this.proxy(this.repositionEditor), 0)

        $.oc.foundation.element.addClass(container, 'editor-visible')
        link.setAttribute('data-original-title', 'Click to enter the property value')

        this.toggleEditorVisibility(false)
        input.setAttribute('tabindex', 0)

        if (!building) {
            input.focus()
        }
    }

    ExternalParameterEditor.prototype.repositionEditor = function() {
        this.getEditor().style.left = 0;
        this.containerCell.scrollTop = 0;
    }

    ExternalParameterEditor.prototype.hideEditor = function() {
        var editor = this.getEditor(),
            container = this.getContainer();

        editor.style.left = 'auto';
        editor.style.right = '30px';

        $.oc.foundation.element.removeClass(container, 'editor-visible');
        $.oc.foundation.element.removeClass(this.containerCell, 'active');

        var propertyEditor = this.inspector.findPropertyEditor(this.propertyDefinition.property);

        if (propertyEditor) {
            propertyEditor.onExternalPropertyEditorHidden();
        }
    }

    ExternalParameterEditor.prototype.toggleEditor = function(ev) {
        $.oc.foundation.event.stop(ev);

        var link = this.getLink(),
            container = this.getContainer(),
            editor = this.getEditor();

        $(link).tooltip('hide');

        if (!this.isEditorVisible()) {
            this.showEditor();
            return;
        }

        var left = container.offsetWidth;

        editor.style.left = left + 'px';
        link.setAttribute('data-original-title', this.tooltipText);
        this.getInput().setAttribute('tabindex', '-1');

        this.toggleEditorVisibility(true)

        setTimeout(this.proxy(this.hideEditor), 200)
    }

    ExternalParameterEditor.prototype.toggleEditorVisibility = function(show) {
        var container = this.getContainer(),
            children = container.children,
            height = 0;

        if (!show) {
            height = this.containerCell.getAttribute('data-inspector-cell-height')

            if (!height) {
                height = $(this.containerCell).height()
                this.containerCell.setAttribute('data-inspector-cell-height', height)
            }
        }

        // Fixed value instead of trying to get the container cell height.
        // If the editor is contained in initially hidden editor (collapsed group),
        // the container cell will be unknown.

        height = Math.max(height, 19);

        for (var i = 0, len = children.length; i < len; i++) {
            var element = children[i]

            if ($.oc.foundation.element.hasClass(element, 'external-editor')) {
                continue
            }

            if (show) {
                $.oc.foundation.element.removeClass(element, 'oc-hide');
            }
            else {
                container.style.height = height + 'px'
                $.oc.foundation.element.addClass(element, 'oc-hide');
            }
        }
    }

    ExternalParameterEditor.prototype.focus = function() {
        this.getInput().focus({ preventScroll: true });
    }

    ExternalParameterEditor.prototype.validate = function(silentMode) {
        var value = $.trim(this.getValue());

        if (value.length === 0) {
            if (!silentMode) {
                $.oc.flashMsg({text: 'Please enter the external parameter name.', 'class': 'error', 'interval': 5});
                this.focus();
            }

            return false;
        }

        return true;
    }

    //
    // Event handlers
    //

    ExternalParameterEditor.prototype.registerHandlers = function() {
        var input = this.getInput();

        this.getLink().addEventListener('click', this.proxy(this.toggleEditor));
        input.addEventListener('focus', this.proxy(this.onInputFocus));
        input.addEventListener('change', this.proxy(this.onInputChange));
    }

    ExternalParameterEditor.prototype.onInputFocus = function() {
        this.inspector.makeCellActive(this.containerCell);
    }

    ExternalParameterEditor.prototype.onInputChange = function() {
        this.inspector.markPropertyChanged(this.propertyDefinition.property, true);
    }

    //
    // Disposing
    //

    ExternalParameterEditor.prototype.unregisterHandlers = function() {
        var input = this.getInput()

        this.getLink().removeEventListener('click', this.proxy(this.toggleEditor))
        input.removeEventListener('focus', this.proxy(this.onInputFocus))
        input.removeEventListener('change', this.proxy(this.onInputChange))
    }

    ExternalParameterEditor.prototype.disposeControls = function() {
        $(this.getLink()).tooltip('dispose');
    }

    //
    // Helpers
    //

    ExternalParameterEditor.prototype.getInput = function() {
        return this.containerCell.querySelector('div.external-editor input')
    }

    ExternalParameterEditor.prototype.getValue = function() {
        return this.getInput().value
    }

    ExternalParameterEditor.prototype.getLink = function() {
        return this.containerCell.querySelector('a.external-editor-link')
    }

    ExternalParameterEditor.prototype.getContainer = function() {
        return this.containerCell.querySelector('div.external-param-editor-container')
    }

    ExternalParameterEditor.prototype.getEditor = function() {
        return this.containerCell.querySelector('div.external-editor')
    }

    ExternalParameterEditor.prototype.getPropertyName = function() {
        return this.propertyDefinition.property
    }

    ExternalParameterEditor.prototype.isEditorVisible = function() {
        return $.oc.foundation.element.hasClass(this.getContainer(), 'editor-visible')
    }

    $.oc.inspector.externalParameterEditor = ExternalParameterEditor
}(window.jQuery);
;
/*
 * Bar chart control
 *
 * Data attributes:
 * - data-control="chart-bar" - enables the bar chart control
 * - data-height="200" - optional, height of the graph
 * - data-full-width="1" - optional, determines whether the chart should use the full width of the container
 *
 * JavaScript API:
 * oc.fetchControl(element, 'chart-bar')
 *
 * Dependencies:
 * - Raphael (raphael-min.js)
 */
oc.registerControl('chart-bar', class extends oc.ControlBase {
    init() {
        this.config = Object.assign({
            gap: 2,
            height: undefined,
            fullWidth: undefined
        }, this.config);
    }

    connect() {
        this.$el = $(this.element);
        this.buildChart();
    }

    disconnect() {
        $(window).off('resize', this.proxy(this.onResize));
        this.$el = null;
    }

    isFullWidth() {
        return this.config.fullWidth !== undefined && this.config.fullWidth;
    }

    buildChart() {
        var self = this,
            size = this.size = this.$el.height(),
            values = $.oc.chartUtils.loadListValues($('ul', this.$el)),
            $legend = $.oc.chartUtils.createLegend($('ul', this.$el)),
            indicators = $.oc.chartUtils.initLegendColorIndicators($legend),
            isFullWidth = this.isFullWidth(),
            chartHeight = this.config.height !== undefined ? this.config.height : size,
            chartWidth = isFullWidth ? this.$el.width() : size,
            barWidth = (chartWidth - (values.values.length-1)*this.config.gap)/values.values.length;

        var $canvas = $('<div/>').addClass('canvas').height(chartHeight).width(isFullWidth ? '100%' : chartWidth);
        this.$el.prepend($canvas);
        this.$el.toggleClass('full-width', isFullWidth);

        Raphael($canvas.get(0), isFullWidth ? '100%' : chartWidth, chartHeight, function(){
            self.paper = this;
            self.bars = this.set();

            self.paper.customAttributes.bar = function (start, height) {
                return {
                    path: [
                        ["M", start, chartHeight],
                        ["L", start, chartHeight-height],
                        ["L", start + barWidth, chartHeight-height],
                        ["L", start + barWidth, chartHeight],
                        ["Z"]
                    ]
                };
            };

            // Add bars
            var start = 0;
            $.each(values.values, function(index, valueInfo) {
                var color = valueInfo.color !== undefined ? valueInfo.color : $.oc.chartUtils.getColor(index),
                    path = self.paper.path().attr({"stroke-width": 0}).attr({bar: [start, 0]}).attr({fill: color});

                self.bars.push(path);
                indicators[index].css('background-color', color);
                start += barWidth + self.config.gap;

                path.hover(function(ev){
                    $.oc.chartUtils.showTooltip(ev.pageX, ev.pageY,
                        $.trim($.oc.chartUtils.getLegendLabel($legend, index)) + ': <strong>'+valueInfo.value+'</strong>')
                }, function() {
                    $.oc.chartUtils.hideTooltip()
                });
            });

            // Animate bars
            start = 0;
            $.each(values.values, function(index, valueInfo) {
                var height = (values.max && valueInfo.value) ? chartHeight/values.max * valueInfo.value : 0;

                self.bars[index].animate({bar: [start, height]}, 1000, "bounce");
                start += barWidth + self.config.gap;
            });

            // Update the full-width chart when the window is resized
            if (isFullWidth) {
                $(window).on('resize', self.proxy(self.onResize));
                self._resizeData = { values: values, chartHeight: chartHeight };
            }
        });
    }

    onResize() {
        if (!this._resizeData) {
            return;
        }

        var values = this._resizeData.values,
            chartHeight = this._resizeData.chartHeight,
            chartWidth = this.$el.width(),
            barWidth = (chartWidth - (values.values.length-1)*this.config.gap)/values.values.length;

        var start = 0;
        var self = this;
        $.each(values.values, function(index, valueInfo) {
            var height = (values.max && valueInfo.value) ? chartHeight/values.max * valueInfo.value : 0;

            self.bars[index].animate({bar: [start, height]}, 10, "bounce");
            start += barWidth + self.config.gap;
        });
    }
});

// JQUERY PLUGIN DEFINITION
// ============================

$.fn.barChart = function (option) {
    return this.each(function () {
        oc.observeControl(this, 'chart-bar');
    });
};

;
/*
 * Line chart control
 *
 * Data attributes:
 * - data-control="chart-line" - enables the line chart control
 * - data-reset-zoom-link="#reset-zoom" - specifies a link to reset zoom
 * - data-zoomable - indicates that the chart is zoomable
 * - data-time-mode="weeks" - if the "weeks" value is specified and the xaxis mode is "time", the X axis labels will be displayed as week end dates.
 * - data-chart-options="xaxis: {mode: 'time'}" - specifies the Flot configuration in JSON format. See https://github.com/flot/flot/blob/master/API.md for details.
 *
 * Data sets are defined with the SPAN elements inside the chart element: <span data-chart="dataset" data-set-data="[0,0],[1,19]">
 * Data set elements could contain data attributes with names in the format "data-set-color". The names for the data set
 * attributes are described in the Flot documentation: https://github.com/flot/flot/blob/master/API.md#data-format
 *
 * JavaScript API:
 * oc.fetchControl(element, 'chart-line')
 *
 * Dependencies:
 * - Flot (jquery.flot.js)
 * - Flot Tooltip (jquery.flot.tooltip.js)
 * - Flot Resize (jquery.flot.resize.js)
 * - Flot Time (jquery.flot.time.js)
 */
oc.registerControl('chart-line', class extends oc.ControlBase {
    init() {
        this.config = Object.assign({
            chartOptions: "",
            timeMode: null,
            zoomable: false,
            resetZoomLink: null
        }, this.config);
    }

    connect() {
        this.$el = $(this.element);
        this.fullDataSet = [];
        var isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        var colorBackground = '#fff',
            colorMarkings = 'rgba(0,0,0,0.02)';

        if (isDark) {
            colorBackground = '#1e2227';
            colorMarkings = 'rgba(255,255,255,0.02)';
        }

        // Flot options
        this.chartOptions = {
            xaxis: {
                mode: "time",
                tickLength: 5
            },
            selection: { mode: "x" },
            grid: {
                markingsColor: colorMarkings,
                backgroundColor: { colors: [colorBackground, colorBackground] },
                borderColor: "#7bafcc",
                borderWidth: 0,
                color: colorBackground,
                hoverable: true,
                clickable: true,
                labelMargin: 10
            },
            series: {
                lines: {
                    show: true,
                    fill: true
                },
                points: {
                    show: true
                }
            },
            tooltip: true,
            tooltipOpts: {
                defaultTheme: false,
                content: "%x: <strong>%y</strong>",
                dateFormat: "%y-%0m-%0d",
                shifts: {
                    x: 10,
                    y: 20
                }
            },
            legend: {
                show: true,
                noColumns: 2
            }
        };

        this.defaultDataSetOptions = {
            shadowSize: 0
        };

        var parsedOptions = {};
        try {
            parsedOptions = oc.parseJSON("{" + this.config.chartOptions + "}");
        }
        catch (e) {
            throw new Error('Error parsing the data-chart-options attribute value. '+e);
        }

        this.chartOptions = $.extend({}, this.chartOptions, parsedOptions);

        this.resetZoomLink = $(this.config.resetZoomLink);

        this.$el.trigger('oc.chartLineInit', [this]);

        // Bind events
        if (this.config.resetZoomLink) {
            this.resetZoomLink.on('click', this.proxy(this.clearZoom));
        }

        if (this.config.zoomable) {
            this.$el.on("plotselected", this.proxy(this.onPlotSelected));
        }

        // Markings helper
        if (this.chartOptions.xaxis.mode == "time" && this.config.timeMode == "weeks") {
            this.chartOptions.markings = this.weekendAreas;
        }

        // Process the datasets
        this.initializing = true;
        var self = this;

        this.$el.find('>[data-chart="dataset"]').each(function(){
            var data = $(this).data(),
                processedData = {};

            for (var key in data) {
                var normalizedKey = key.substring(3),
                    value = data[key];

                normalizedKey = normalizedKey.charAt(0).toLowerCase() + normalizedKey.slice(1);
                if (normalizedKey == 'data')
                    value = Array.isArray(value) ? [value] : JSON.parse('['+value+']');

                processedData[normalizedKey] = value;
            }

            self.addDataSet($.extend({}, self.defaultDataSetOptions, processedData));
        });

        // Build chart
        this.initializing = false;
        this.rebuildChart();
    }

    disconnect() {
        if (this.config.resetZoomLink) {
            this.resetZoomLink.off('click', this.proxy(this.clearZoom));
        }

        if (this.config.zoomable) {
            this.$el.off("plotselected", this.proxy(this.onPlotSelected));
        }

        this.resetZoomLink = null;
        this.$el = null;
    }

    onPlotSelected(event, ranges) {
        var newCoords = {
            xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
        };

        $.plot(this.$el, this.fullDataSet, $.extend(true, {}, this.chartOptions, newCoords));
        this.resetZoomLink.show();
    }

    weekendAreas(axes) {
        var markings = [],
            d = new Date(axes.xaxis.min);

        // Go to the first Saturday
        d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 1) % 7));
        d.setUTCSeconds(0);
        d.setUTCMinutes(0);
        d.setUTCHours(0);
        var i = d.getTime();

        do {
            markings.push({ xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } });
            i += 7 * 24 * 60 * 60 * 1000;
        } while (i < axes.xaxis.max);

        return markings;
    }

    addDataSet(dataSet) {
        this.fullDataSet.push(dataSet);

        if (!this.initializing) {
            this.rebuildChart();
        }
    }

    rebuildChart() {
        this.$el.trigger('oc.beforeChartLineRender', [this]);

        $.plot(this.$el, this.fullDataSet, this.chartOptions);
    }

    clearZoom() {
        this.rebuildChart();
        this.resetZoomLink.hide();
    }
});

// JQUERY PLUGIN DEFINITION
// ============================

$.fn.chartLine = function (option) {
    return this.each(function () {
        oc.observeControl(this, 'chart-line');
    });
};

;
/*
 * Goal meter control
 *
 * Applies the goal meter style to a scoreboard item.
 *
 * Data attributes:
 * - data-control="goal-meter" - enables the goal meter control
 * - data-value - sets the value, in percents
 *
 * JavaScript API:
 * oc.fetchControl(element, 'goal-meter')
 */
oc.registerControl('goal-meter', class extends oc.ControlBase {
    init() {
        this.config = Object.assign({
            value: 50
        }, this.config);
    }

    connect() {
        this.$el = $(this.element);
        // Canvas already drawn
        if ($('span.goal-meter-indicator', this.$el).length > 0) {
            return;
        }

        this.$indicatorBar = $('<span />').text(this.config.value + '%');
        this.$indicatorOuter = $('<span />').addClass('goal-meter-indicator').append(this.$indicatorBar);

        $('p', this.$el).first().before(this.$indicatorOuter);

        window.setTimeout(() => {
            this.update(this.config.value);
        }, 200);
    }

    disconnect() {
        this.$indicatorBar = null;
        this.$indicatorOuter = null;
        this.$el = null;
    }

    update(value) {
        this.$indicatorBar.css('height', value + '%');
    }
});

// JQUERY PLUGIN DEFINITION
// ============================

$.fn.goalMeter = function (option) {
    return this.each(function () {
        var instance = oc.observeControl(this, 'goal-meter');
        if (typeof option === 'number' && instance) {
            instance.update(option);
        }
    });
};

;
/*
 * Pie chart control
 *
 * Data attributes:
 * - data-control="chart-pie" - enables the pie chart control
 * - data-size="200" - optional, size of the graph
 * - data-center-text - text to display inside the graph
 *
 * JavaScript API:
 * oc.fetchControl(element, 'chart-pie')
 *
 * Dependencies:
 * - Raphael (raphael-min.js)
 * - October chart utilities (chart.utils.js)
 */
oc.registerControl('chart-pie', class extends oc.ControlBase {
    init() {
        this.config = Object.assign({
            size: undefined,
            centerText: undefined,
            startAngle: 45
        }, this.config);
    }

    connect() {
        this.$el = $(this.element);
        // Canvas already drawn
        if ($('div.canvas', this.$el).length > 0) {
            return;
        }

        this.buildChart();
    }

    disconnect() {
        this.$el = null;
    }

    buildChart() {
        var size = this.size = (this.config.size !== undefined ? this.config.size : this.$el.height()),
            outerRadius = size/2 - 1,
            innerRadius = outerRadius - outerRadius/3.5,
            values = $.oc.chartUtils.loadListValues($('ul', this.$el)),
            $legend = $.oc.chartUtils.createLegend($('ul', this.$el)),
            indicators = $.oc.chartUtils.initLegendColorIndicators($legend),
            self = this;

        var $canvas = $('<div />').addClass('canvas').width(size).height(size);
        this.$el.prepend($canvas);

        // Truncate scoreboard in cases where there are more than 3 items
        $legend.height(size).css('overflow', 'hidden');

        Raphael($canvas.get(0), size, size, function(){
            self.paper = this;
            self.segments = this.set();

            self.paper.customAttributes.segment = function (startAngle, endAngle) {
                var
                    p1 = self.arcCoords(outerRadius, startAngle),
                    p2 = self.arcCoords(outerRadius, endAngle),
                    p3 = self.arcCoords(innerRadius, endAngle),
                    p4 = self.arcCoords(innerRadius, startAngle),
                    flag = (endAngle - startAngle) > 180,
                    path = [
                        ["M", p1.x, p1.y],
                        ["A", outerRadius, outerRadius, 0, +flag, 0, p2.x, p2.y],
                        ["L", p3.x, p3.y],
                        ["A", innerRadius, innerRadius, 0, +flag, 1, p4.x, p4.y],
                        ["Z"]
                    ];

                return {path: path};
            };

            // Draw the background
            self.paper.circle(size/2, size/2, innerRadius + (outerRadius - innerRadius)/2)
                .attr({"stroke-width": outerRadius - innerRadius - 0.5})
                .attr({stroke: $.oc.chartUtils.defaultValueColor});

            // Add segments
            $.each(values.values, function(index, valueInfo) {
                var color = valueInfo.color !== undefined ? valueInfo.color : $.oc.chartUtils.getColor(index),
                    path = self.paper.path().attr({"stroke-width": 0}).attr({segment: [0, 0]}).attr({fill: color})

                self.segments.push(path)
                indicators[index].css('background-color', color)

                path.hover(function(ev){
                    $.oc.chartUtils.showTooltip(ev.pageX, ev.pageY,
                        $.trim($.oc.chartUtils.getLegendLabel($legend, index)) + ': <strong>'+valueInfo.value+'</strong>')
                }, function() {
                    $.oc.chartUtils.hideTooltip()
                })
            });

            // Animate segments
            var start = self.config.startAngle
            $.each(values.values, function(index, valueInfo) {
                var length = (values.total && valueInfo.value) ? 360/values.total * valueInfo.value : 0
                if (length == 360)
                    length--

                self.segments[index].animate({segment: [start, start + length]}, 1000, "bounce")
                start += length
            });
        })

        if (this.config.centerText !== undefined) {
            var $text = $('<span>').addClass('center').html(this.config.centerText);
            $canvas.append($text);
        }
    }

    arcCoords(radius, angle) {
        var
            a = Raphael.rad(angle),
            x = this.size/2 + radius * Math.cos(a),
            y = this.size/2 - radius * Math.sin(a);

        return {'x': x, 'y': y};
    }
});

// JQUERY PLUGIN DEFINITION
// ============================

$.fn.pieChart = function (option) {
    return this.each(function () {
        oc.observeControl(this, 'chart-pie');
    });
};
;
/*
 * October charting utilities.
 */

+function ($) { "use strict";

    var ChartUtils = function() {};

    ChartUtils.prototype.defaultValueColor = '#b8b8b8';

    ChartUtils.prototype.getColor = function(index) {
        var
            colors = [
                '#95b753', '#cc3300', '#e5a91a', '#3366ff', '#ff0f00', '#ff6600',
                '#ff9e01', '#fcd202', '#f8ff01', '#b0de09', '#04d215', '#0d8ecf', '#0d52d1',
                '#2a0cd0', '#8a0ccf', '#cd0d74', '#754deb', '#dddddd', '#999999', '#333333',
                '#000000', '#57032a', '#ca9726', '#990000', '#4b0c25'
            ],
            colorIndex = index % (colors.length-1);

        return colors[colorIndex];
    }

    ChartUtils.prototype.loadListValues = function($list) {
        var result = {
            values: [],
            total: 0,
            max: 0
        };

        $('> li', $list).each(function() {
            var value = $(this).data('value')
                ? parseFloat($(this).data('value'))
                : parseFloat($('span', this).text());

            // Negative values present as positive in charts
            if (value < 0) {
                value = value * -1;
            }

            result.total += value;
            result.values.push({value: value, color: $(this).data('color')});
            result.max = Math.max(result.max, value);
        });

        return result;
    }

    ChartUtils.prototype.getLegendLabel = function($legend, index) {
        return $('tr:eq('+index+') td:eq(1)', $legend).html();
    }

    ChartUtils.prototype.initLegendColorIndicators = function($legend) {
        var indicators = [];

        $('tr > td:first-child', $legend).each(function() {
            var indicator = $('<i></i>');
            $(this).prepend(indicator);
            indicators.push(indicator);
        });

        return indicators;
    }

    ChartUtils.prototype.createLegend = function($list) {
        var
            $legend = $('<div>').addClass('chart-legend'),
            $table = $('<table>')

        $legend.append($table)

        $('> li', $list).each(function() {
            var label = $(this).clone().children().remove().end().html();

            $table.append(
                $('<tr>')
                    .append($('<td class="indicator">'))
                    .append($('<td>').html(label))
                    .append($('<td>').addClass('value').html($('span', this).html()))
            );
        });

        $legend.insertAfter($list);
        $list.remove();

        return $legend;
    }

    ChartUtils.prototype.showTooltip = function(x, y, text) {
        var $tooltip = $('#chart-tooltip');

        if ($tooltip.length) {
            $tooltip.remove();
        }

        $tooltip = $('<div id="chart-tooltip">')
            .html(text)
            .css('visibility', 'hidden');

        x += 10;
        y += 10;

        $(document.body).append($tooltip)
        var tooltipWidth = $tooltip.outerWidth()
        if ((x + tooltipWidth) > $(window).width())
            x = $(window).width() - tooltipWidth - 10;

        $tooltip.css({top: y, left: x, visibility: 'visible'});
    }

    ChartUtils.prototype.hideTooltip = function() {
       $('#chart-tooltip').remove();
    }

    if ($.oc === undefined)
        $.oc = {}

    $.oc.chartUtils = new ChartUtils();
}(window.jQuery);

;
/*
 * The loading indicator.
 * @deprecated this will be removed in the future
 * Consider using data-attach-loading
 *
 * The load indicator DIV is injected inside its container. The container should have
 * the relative position (use the loading-indicator-container class for it).
 *
 * Used with framework.js
 *
 * data-load-indicator="Message" - displays a load indicator with a supplied message, the element
 * must be wrapped in a `<div class="loading-indicator-container"></div>` container.
 *
 * JavaScript API:
 *
 * $('#buttons').loadIndicator({ text: 'Saving...', opaque: true }) - display the indicator in a solid (opaque) state
 * $('#buttons').loadIndicator({ centered: true }) - display the indicator aligned in the center horizontally
 * $('#buttons').loadIndicator({ size: small }) - display the indicator in small size
 * $('#buttons').loadIndicator({ text: 'Saving...' }) - display the indicator in a transparent state
 * $('#buttons').loadIndicator('hide') - display the indicator
 */
+function ($) { "use strict";

    var LoadIndicator = function (element, options) {
        this.$el = $(element);

        this.options = options || {};
        this.tally = 0;
        this.show();
    }

    LoadIndicator.prototype.hide = function() {
        this.tally--;

        if (this.tally <= 0) {
            $('div.loading-indicator', this.$el).remove();
            this.$el.removeClass('in-progress');
        }
    }

    LoadIndicator.prototype.show = function(options) {
        if (options) {
            this.options = options;
        }

        this.hide();

        var indicator = $('<div class="loading-indicator"></div>');
        indicator.append($('<div></div>').text(this.options.text));
        indicator.append($('<span></span>'));
        if (this.options.opaque !== undefined) {
            indicator.addClass('is-opaque');
        }
        if (this.options.centered !== undefined) {
            indicator.addClass('indicator-center');
        }
        if (this.options.size === 'small') {
            indicator.addClass('size-small');
        }

        this.$el.prepend(indicator);
        this.$el.addClass('in-progress');

        this.tally++;
    }

    LoadIndicator.prototype.destroy = function() {
        this.$el.removeData('oc.loadIndicator');
        this.$el = null;
    }

    LoadIndicator.DEFAULTS = {
        text: ''
    }

    // LOADINDICATOR PLUGIN DEFINITION
    // ============================

    var old = $.fn.loadIndicator;

    $.fn.loadIndicator = function (option) {
        var args = arguments;

        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.loadIndicator')
            var options = $.extend({}, LoadIndicator.DEFAULTS, typeof option == 'object' && option)

            if (!data) {
                if (typeof option == 'string') {
                    return;
                }

                $this.data('oc.loadIndicator', (data = new LoadIndicator(this, options)));
            }
            else {
                if (typeof option !== 'string') {
                    data.show(options);
                }
                else {
                    var methodArgs = [];
                    for (var i=1; i<args.length; i++) {
                        methodArgs.push(args[i]);
                    }

                    data[option].apply(data, methodArgs);
                }
            }
        });
    }

    $.fn.loadIndicator.Constructor = LoadIndicator;

    // LOADINDICATOR NO CONFLICT
    // =================

    $.fn.loadIndicator.noConflict = function () {
        $.fn.loadIndicator = old;
        return this;
    }

    // LOADINDICATOR DATA-API
    // ==============

    $(document)
        .on('ajaxPromise', '[data-load-indicator]', function() {
            var
                indicatorContainer = $(this).closest('.loading-indicator-container'),
                loadingText = $(this).data('load-indicator'),
                options = {
                    opaque: $(this).data('load-indicator-opaque'),
                    centered: $(this).data('load-indicator-centered'),
                    size: $(this).data('load-indicator-size')
                };

                if (loadingText) {
                    options.text = loadingText;
                }

            indicatorContainer.loadIndicator(options);
        })
        .on('ajaxFail ajaxDone', '[data-load-indicator]', function() {
            $(this).closest('.loading-indicator-container').loadIndicator('hide');
        });

}(window.jQuery);

;
// Deprecated reference
window.assetManager = oc.AssetManager;
window.ocJSON = oc.parseJSON;

;
/*
 * Checkbox control
 *
 */

(function($) {

    $(document).on('keypress', 'div.custom-checkbox', function(e) {
        if (e.key === '(Space character)' || e.key === 'Spacebar' || e.key === ' ') {
            var $cb = $('input[type=checkbox]', this)

            if ($cb.data('oc-space-timestamp') == e.timeStamp)
                return

            if ($cb.get(0).disabled) {
                return false
            }

            $cb.get(0).checked = !$cb.get(0).checked
            $cb.data('oc-space-timestamp', e.timeStamp)
            $cb.trigger('change')
            return false
        }
    })

    //
    // Intermediate checkboxes
    //

    $(document).render(function() {
        $('div.custom-checkbox.is-indeterminate > input').each(function() {
            var $el = $(this),
                checked = $el.data('checked')

            switch (checked) {

                // Unchecked
                case 1:
                    $el.prop('indeterminate', true)
                    break

                // Checked
                case 2:
                    $el.prop('indeterminate', false)
                    $el.prop('checked', true)
                    break

                // Unchecked
                default:
                    $el.prop('indeterminate', false)
                    $el.prop('checked', false)
            }
        })
    })

    $(document).on('click', 'div.custom-checkbox.is-indeterminate > label', function() {
        var $el = $(this).parent().find('input:first'),
            checked = $el.data('checked')

        if (checked === undefined) {
            checked = $el.is(':checked') ? 1 : 0
        }

        switch (checked) {

            // Unchecked, going indeterminate
            case 0:
                $el.data('checked', 1)
                $el.prop('indeterminate', true)
                break

            // Indeterminate, going checked
            case 1:
                $el.data('checked', 2)
                $el.prop('indeterminate', false)
                $el.prop('checked', true)
                break

            // Checked, going unchecked
            default:
                $el.data('checked', 0)
                $el.prop('indeterminate', false)
                $el.prop('checked', false)
        }

        $el.trigger('change')
        return false
    })

})(jQuery);

;
//
// BS3 adapter
//

$(document).render(function(){
    $('[data-toggle=dropdown]:not([data-bs-toggle])').attr('data-bs-toggle', 'dropdown');
    $('[data-toggle=modal]:not([data-bs-toggle])').attr('data-bs-toggle', 'modal');
    $('[data-dismiss=modal]:not([data-bs-dismiss])').attr('data-bs-dismiss', 'modal');
    $('.fade.in:not(.show)').addClass('show');
});

;
/*
 * Sortable plugin.
 *
 * Status: experimental. The behavior is not perfect, but it's OK in terms of memory
 * usage and disposing.
 *
 * This is a lightweight, October-style implementation of the drag & drop sorting
 * functionality. The plugin uses only HTML5 Drag&Drop feature and completely
 * disposable.
 *
 * During the dragging the plugin creates a placeholder element, which should be
 * styled separately.
 *
 * Draggable elements should be marked with "draggable" HTML5 attribute.
 *
 * Current / planned features:
 *
 * [x] Sorting a single list.
 * [ ] Dragging items between multiple lists.
 * [ ] Sorting nested lists.

 * JAVASCRIPT API
 *
 * $('#list').listSortable({})
 *
 * DATA ATTRIBUTES API
 *
 * In the simplest case the plugin can be initialized like this:
 * <ul data-control="list-sortable">
 *     <li draggable="true">...</li>
 *
 * Multiple lists will not support this option and the plugin should be created
 * and updated by a caller code.
 *
 * Options:
 * - handle: optional selector for a drag handle element. Also available as data-handle attribute.
 * - direction: direction of the list - horizontal or vertical. Also available as data-direction attribute. Default is vertical.
 *
 * Events:
 * - dragged.list.sortable - triggered on a list element after it was moved
 */

+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype,
        listSortableIdCounter = 0,
        elementsIdCounter = 0

    var ListSortable = function (element, options) {
        this.lists = []
        this.options = options
        this.listSortableId = null
        this.lastMousePosition = null

        Base.call(this)

        $.oc.foundation.controlUtils.markDisposable(element)
        this.init()

        this.addList(element)
    }

    ListSortable.prototype = Object.create(BaseProto)
    ListSortable.prototype.constructor = ListSortable

    ListSortable.prototype.init = function () {
        listSortableIdCounter++

        this.listSortableId = 'listsortable/id/' + listSortableIdCounter
    }

    ListSortable.prototype.addList = function(list) {
        this.lists.push(list)
        this.registerListHandlers(list)

        if (this.lists.length == 1) {
            $(list).one('dispose-control', this.proxy(this.dispose))
        }
    }

    //
    // Event management
    //

    ListSortable.prototype.registerListHandlers = function(list) {
        var $list = $(list)

        $list.on('dragstart', '> li', this.proxy(this.onDragStart))
        $list.on('dragover', '> li', this.proxy(this.onDragOver))
        $list.on('dragenter', '> li', this.proxy(this.onDragEnter))
        $list.on('dragleave', '> li', this.proxy(this.onDragLeave))
        $list.on('drop', '> li', this.proxy(this.onDragDrop))
        $list.on('dragend', '> li', this.proxy(this.onDragEnd))
    }

    ListSortable.prototype.unregisterListHandlers = function(list) {
        var $list = $(list)

        $list.off('dragstart', '> li', this.proxy(this.onDragStart))
        $list.off('dragover', '> li', this.proxy(this.onDragOver))
        $list.off('dragenter', '> li', this.proxy(this.onDragEnter))
        $list.off('dragleave', '> li', this.proxy(this.onDragLeave))
        $list.off('drop', '> li', this.proxy(this.onDragDrop))
        $list.off('dragend', '> li', this.proxy(this.onDragEnd))
    }

    ListSortable.prototype.unregisterHandlers = function() {
        $(document).off('dragover', this.proxy(this.onDocumentDragOver))
        $(document).off('mousemove', this.proxy(this.onDocumentMouseMove))
        $(this.lists[0]).off('dispose-control', this.proxy(this.dispose))
    }

    //
    // Disposing
    //

    ListSortable.prototype.unbindLists = function() {
        for (var i=this.lists.length-1; i>0; i--) {
            var list = this.lists[i]

            this.unregisterListHandlers(this.lists[i])
            $(list).removeData('oc.listSortable')
        }
    }

    ListSortable.prototype.dispose = function() {
        this.unbindLists()
        this.unregisterHandlers()

        this.options = null
        this.lists = []

        BaseProto.dispose.call(this)
    }

    //
    // Internal helpers
    //

    ListSortable.prototype.elementBelongsToManagedList = function(element) {
        for (var i=this.lists.length-1; i >= 0; i--) {
            var list = this.lists[i],
                children = [].slice.call(list.children); // Converts HTMLCollection to array

            if (children.indexOf(element) !== -1) {
                return true
            }
        }

        return false
    }

    ListSortable.prototype.isDragStartAllowed = function(element) {
        // TODO: if handle selector is specified - test if
        // the element is a handle.

        return true
    }

    ListSortable.prototype.elementIsPlaceholder = function(element) {
        return element.getAttribute('class') === 'list-sortable-placeholder'
    }

    ListSortable.prototype.getElementSortableId = function(element) {
        if (element.hasAttribute('data-list-sortable-element-id')) {
            return element.getAttribute('data-list-sortable-element-id')
        }

        elementsIdCounter++
        var elementId = elementsIdCounter

        element.setAttribute('data-list-sortable-element-id', elementsIdCounter)

        return elementsIdCounter
    }

    ListSortable.prototype.dataTransferContains = function(ev, element) {
        if (ev.dataTransfer.types.indexOf !== undefined){
            return ev.dataTransfer.types.indexOf(element) >= 0
        }

        return ev.dataTransfer.types.contains(element)
    }

    ListSortable.prototype.isSourceManagedList = function(ev) {
        return this.dataTransferContains(ev, this.listSortableId)
    }

    ListSortable.prototype.removePlaceholders = function() {
        for (var i=this.lists.length-1; i >= 0; i--) {
            var list = this.lists[i],
                placeholders = list.querySelectorAll('.list-sortable-placeholder')

            for (var j=placeholders.length-1; j >= 0; j--) {
                list.removeChild(placeholders[j])
            }
        }
    }

    ListSortable.prototype.createPlaceholder = function(element, ev) {
        var placeholder = document.createElement('li'),
            placement = this.getPlaceholderPlacement(element, ev)

        this.removePlaceholders()

        placeholder.setAttribute('class', 'list-sortable-placeholder')
        placeholder.setAttribute('draggable', true)

        if (placement == 'before') {
            element.parentNode.insertBefore(placeholder, element)
        }
        else {
            element.parentNode.insertBefore(placeholder, element.nextSibling)
        }
    }

    ListSortable.prototype.moveElement = function(target, ev) {
        var list = target.parentNode,
            placeholder = list.querySelector('.list-sortable-placeholder')

        if (!placeholder) {
            return
        }

        var elementId = ev.dataTransfer.getData('listsortable/elementid')
        if (!elementId) {
            return
        }

        var item = this.findDraggedItem(elementId)
        if (!item) {
            return
        }

        placeholder.parentNode.insertBefore(item, placeholder)
        $(item).trigger('dragged.list.sortable')
    }

    ListSortable.prototype.findDraggedItem = function(elementId) {
        for (var i=this.lists.length-1; i >= 0; i--) {
            var list = this.lists[i],
                item = list.querySelector('[data-list-sortable-element-id="'+elementId+'"]')

            if (item) {
                return item
            }
        }

        return null
    }

    ListSortable.prototype.getPlaceholderPlacement = function(hoverElement, ev) {
        var mousePosition = $.oc.foundation.event.pageCoordinates(ev),
            elementPosition = $.oc.foundation.element.absolutePosition(hoverElement)

        if (this.options.direction == 'vertical') {
            var elementCenter = elementPosition.top + hoverElement.offsetHeight/2

            return mousePosition.y <= elementCenter ? 'before' : 'after'
        }
        else {
            var elementCenter = elementPosition.left + hoverElement.offsetWidth/2

            return mousePosition.x <= elementCenter ? 'before' : 'after'
        }
    }

    ListSortable.prototype.lastMousePositionChanged = function(ev) {
        var mousePosition = $.oc.foundation.event.pageCoordinates(ev.originalEvent)

        if (this.lastMousePosition === null || this.lastMousePosition.x != mousePosition.x || this.lastMousePosition.y != mousePosition.y) {
            this.lastMousePosition = mousePosition
            return true
        }

        return false
    }

    ListSortable.prototype.mouseOutsideLists = function(ev) {
        var mousePosition = $.oc.foundation.event.pageCoordinates(ev)

        for (var i=this.lists.length-1; i >= 0; i--) {
            if ($.oc.foundation.element.elementContainsPoint(this.lists[i], mousePosition)) {
                return false
            }
        }

        return true
    }

    ListSortable.prototype.getClosestDraggableParent = function(element) {
        var current = element

        while (current) {
            if (current.tagName === 'LI' && current.hasAttribute('draggable') ) {
                return current
            }

            current = current.parentNode
        }

        return null
    }

    // EVENT HANDLERS
    // ============================

    ListSortable.prototype.onDragStart = function(ev) {
        if (!this.isDragStartAllowed(ev.target)) {
            return
        }

        ev.originalEvent.dataTransfer.effectAllowed = 'move'
        ev.originalEvent.dataTransfer.setData('listsortable/elementid', this.getElementSortableId(ev.target))
        ev.originalEvent.dataTransfer.setData(this.listSortableId, this.listSortableId)

        // The mousemove handler is used to remove the placeholder
        // when the drag is canceled with Escape button. We can't use
        // the dragend for removing the placeholders because dragend
        // is triggered before drop, but we need placeholder to exists
        // in the drop handler.
        //
        // Mouse events are suppressed during the drag and drop operations,
        // so we only need to handle it once (but we still must the handler
        // explicitly).
        $(document).on('mousemove', this.proxy(this.onDocumentMouseMove))

        // The dragover handler is used to hide the placeholder when
        // the mouse is outside of any known list.
        $(document).on('dragover', this.proxy(this.onDocumentDragOver))
    }

    ListSortable.prototype.onDragOver = function(ev) {
        if (!this.isSourceManagedList(ev.originalEvent)) {
            return
        }

        var draggable = this.getClosestDraggableParent(ev.target)
        if (!draggable) {
            return
        }

        if (!this.elementIsPlaceholder(draggable) && this.lastMousePositionChanged(ev)) {
            this.createPlaceholder(draggable, ev.originalEvent)
        }

        ev.stopPropagation()
        ev.preventDefault()
        ev.originalEvent.dataTransfer.dropEffect = 'move'
    }

    ListSortable.prototype.onDragEnter = function(ev) {
        if (!this.isSourceManagedList(ev.originalEvent)) {
            return
        }

        var draggable = this.getClosestDraggableParent(ev.target)
        if (!draggable) {
            return
        }

        if (this.elementIsPlaceholder(draggable)) {
            return
        }

        this.createPlaceholder(draggable, ev.originalEvent)
        ev.stopPropagation()
        ev.preventDefault()
    }

    ListSortable.prototype.onDragLeave = function(ev) {
        if (!this.isSourceManagedList(ev.originalEvent)) {
            return
        }

        ev.stopPropagation()
        ev.preventDefault()
    }

    ListSortable.prototype.onDragDrop = function(ev) {
        if (!this.isSourceManagedList(ev.originalEvent)) {
            return
        }

        var draggable = this.getClosestDraggableParent(ev.target)
        if (!draggable) {
            return
        }

        this.moveElement(draggable, ev.originalEvent)

        this.removePlaceholders()
    }

    ListSortable.prototype.onDragEnd = function(ev) {
        $(document).off('dragover', this.proxy(this.onDocumentDragOver))
    }

    ListSortable.prototype.onDocumentDragOver = function(ev) {
        if (!this.isSourceManagedList(ev.originalEvent)) {
            return
        }

        if (this.mouseOutsideLists(ev.originalEvent)) {
            this.removePlaceholders()
            return
        }
    }

    ListSortable.prototype.onDocumentMouseMove = function(ev) {
        $(document).off('mousemove', this.proxy(this.onDocumentMouseMove))
        this.removePlaceholders()
    }


    // PLUGIN DEFINITION
    // ============================

    ListSortable.DEFAULTS = {
        handle: null,
        direction: 'vertical'
    }

    var old = $.fn.listSortable

    $.fn.listSortable = function (option) {
        var args = arguments

        return this.each(function () {
            var $this = $(this),
                data  = $this.data('oc.listSortable'),
                options = $.extend({}, ListSortable.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) {
                $this.data('oc.listSortable', (data = new ListSortable(this, options)))
            }

            if (typeof option == 'string' && data) {
                if (data[option]) {
                    var methodArguments = Array.prototype.slice.call(args) // Clone the arguments array
                    methodArguments.shift()

                    data[option].apply(data, methodArguments)
                }
            }
        })
    }

    $.fn.listSortable.Constructor = ListSortable

    // LISTSORTABLE NO CONFLICT
    // =================

    $.fn.listSortable.noConflict = function () {
        $.fn.listSortable = old
        return this
    }

    $(document).render(function(){
        $('[data-control=list-sortable]').listSortable()
    })

}(window.jQuery);