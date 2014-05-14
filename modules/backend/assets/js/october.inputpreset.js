/*
 * An input preset converter. 
 *
 * The API allows to convert text entered into an element to an URL or file name value in another input element.
 * 
 * Supported data attributes:
 * - data-input-preset: specifies a CSS selector for a source input element
 * - data-input-preset-closest-parent: optional, specifies a CSS selector for a closest common parent 
 *   for the source and destination input elements.
 * - data-input-preset-type: specifies the conversion type. Supported values are: URL, file.
 *
 * Example: <input type="text" id="name" value=""/>
 *          <input type="text"
 *             data-input-preset="#name" 
 *             data-input-preset-type="file">
 *
 * JavaScript API:
 * $('#filename').inputPreset({inputPreset: '#name', inputPresetType: 'file'})
 */
+function ($) { "use strict";

    var InputPreset = function (element, options) {
        var $el = this.$el = $(element);
        this.options = options || {};
        this.cancelled = false;

        // Do not update the element if it already has a value
        if ($el.val().length)
            return

        var parent = options.inputPresetClosestParent !== undefined ? 
                $el.closest(options.inputPresetClosestParent) :
                undefined,
            self = this;

        this.$src = $(options.inputPreset, parent),
        this.$src.on('keyup', function() {
            if (self.cancelled)
                return;

            $el.val(self.formatValue())
        })

        this.$el.on('change', function() {
            self.cancelled = true
        })
    }

    InputPreset.prototype.formatValue = function() {
        var value = this.$src.val()
                .toLowerCase()
                .replace(/[^\w ]+/g,'')
                .replace(/ +/g,'-');

        if (this.options.inputPresetType == 'url')
            value = '/' + value;

        return value;
    }

    InputPreset.DEFAULTS = {
        inputPreset: '',
        inputPresetType: 'file',
        inputPresetClosestParent: undefined
    }

    // INPUT CONVERTER PLUGIN DEFINITION
    // ============================

    var old = $.fn.inputPreset

    $.fn.inputPreset = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data  = $this.data('oc.inputPreset')
            var options = $.extend({}, InputPreset.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data) $this.data('oc.inputPreset', (data = new InputPreset(this, options)))
        })
      }

    $.fn.inputPreset.Constructor = InputPreset

    // INPUT CONVERTER NO CONFLICT
    // =================

    $.fn.inputPreset.noConflict = function () {
        $.fn.inputPreset = old
        return this
    }

    // INPUT CONVERTER DATA-API
    // ===============

    $(document).render(function(){
        $('[data-input-preset]').inputPreset()
    })
}(window.jQuery);