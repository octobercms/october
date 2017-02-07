/*
 * Template Diff plugin
 *
 * Data attributes:
 * - data-plugin="template-diff" - enables the plugin on an element
 *
 * JavaScript API:
 * $('pre').templateDiff({ option: 'value' })
 *
 * Dependences:
 * - jsdiff (diff.js)
 */

+function ($) { "use strict";

    // TEMPALTE DIFF CLASS DEFINITION
    // ============================

    var TemplateDiff = function(element, options) {
        this.options   = options
        this.$el       = $(element)

        // Init
        this.init()
    }

    TemplateDiff.DEFAULTS = {
        oldFieldName: null,
        newFieldName: null,
        contentTag: '',
        diffType: 'lines' // chars, words, lines
    }

    TemplateDiff.prototype.init = function() {
        var
            oldValue = $('[data-field-name="'+this.options.oldFieldName+'"] .form-control '+this.options.contentTag).html(),
            newValue = $('[data-field-name="'+this.options.newFieldName+'"] .form-control '+this.options.contentTag).html()

        oldValue = $('<div />').html(oldValue).text()
        newValue = $('<div />').html(newValue).text()

        this.diffStrings(oldValue, newValue)
    }

    TemplateDiff.prototype.diffStrings = function(oldValue, newValue) {
        var result = this.$el.get(0)
        var diffType = 'diff' + this.options.diffType[0].toUpperCase() + this.options.diffType.slice(1)
        var diff = JsDiff[diffType](oldValue, newValue)
        var fragment = document.createDocumentFragment();
        for (var i=0; i < diff.length; i++) {

            if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
                var swap = diff[i];
                diff[i] = diff[i + 1];
                diff[i + 1] = swap;
            }

            var node;
            if (diff[i].removed) {
                node = document.createElement('del');
                node.appendChild(document.createTextNode(diff[i].value));
            }
            else if (diff[i].added) {
                node = document.createElement('ins');
                node.appendChild(document.createTextNode(diff[i].value));
            }
            else {
                node = document.createTextNode(diff[i].value);
            }
            fragment.appendChild(node);
        }

        result.textContent = '';
        result.appendChild(fragment);
    }

    // TEMPALTE DIFF PLUGIN DEFINITION
    // ============================

    var old = $.fn.templateDiff

    $.fn.templateDiff = function (option) {
        var args = Array.prototype.slice.call(arguments, 1), result
        this.each(function () {
            var $this   = $(this)
            var data    = $this.data('oc.example')
            var options = $.extend({}, TemplateDiff.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('oc.example', (data = new TemplateDiff(this, options)))
            if (typeof option == 'string') result = data[option].apply(data, args)
            if (typeof result != 'undefined') return false
        })
        
        return result ? result : this
    }

    $.fn.templateDiff.Constructor = TemplateDiff

    // TEMPALTE DIFF NO CONFLICT
    // =================

    $.fn.templateDiff.noConflict = function () {
        $.fn.templateDiff = old
        return this
    }

    // TEMPALTE DIFF DATA-API
    // ===============

    $(document).render(function () {
        $('[data-plugin="template-diff"]').templateDiff()
    });

}(window.jQuery);
