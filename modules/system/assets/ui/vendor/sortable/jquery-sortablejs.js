(function (factory) {
	"use strict";
	var sortable,
		jq,
		_this = this
	;

	if (typeof define === "function" && define.amd) {
		try {
			define(["sortablejs", "jquery"], function(Sortable, $) {
				sortable = Sortable;
				jq = $;
				checkErrors();
				factory(Sortable, $);
			});
		} catch(err) {
			checkErrors();
		}
		return;
	} else if (typeof exports === 'object') {
		try {
			sortable = require('sortablejs');
			jq = require('jquery');
		} catch(err) { }
	}

	if (typeof jQuery === 'function' || typeof $ === 'function') {
		jq = jQuery || $;
	}

	if (typeof Sortable !== 'undefined') {
		sortable = Sortable;
	}

	function checkErrors() {
		if (!jq) {
			throw new Error('jQuery is required for jquery-sortablejs');
		}

		if (!sortable) {
			throw new Error('SortableJS is required for jquery-sortablejs (https://github.com/SortableJS/Sortable)');
		}
	}
	checkErrors();
	factory(sortable, jq);
})(function (Sortable, $) {
	"use strict";

	$.fn.sortable = function (options) {
		var retVal,
			args = arguments;

		this.each(function () {
			var $el = $(this),
				sortable = $el.data('sortable');

			if (!sortable && (options instanceof Object || !options)) {
				sortable = new Sortable(this, options);
				$el.data('sortable', sortable);
			} else if (sortable) {
				if (options === 'destroy') {
					sortable.destroy();
					$el.removeData('sortable');
				} else if (options === 'widget') {
					retVal = sortable;
				} else if (typeof sortable[options] === 'function') {
					retVal = sortable[options].apply(sortable, [].slice.call(args, 1));
				} else if (options in sortable.options) {
					retVal = sortable.option.apply(sortable, args);
				}
			}
		});

		return (retVal === void 0) ? this : retVal;
	};
});
