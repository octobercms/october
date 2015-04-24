(function ($) {
    'use strict';

    window.RedactorPlugins = window.RedactorPlugins || {};

    var Cleanup = function (redactor) {
        this.redactor = redactor
        this.init()
    }

    Cleanup.prototype = {

        init: function () {
            this.removeEmptyParagraphs()
        },

        /*
         * Removes empty P tags
         */
        removeEmptyParagraphs: function () {
            this.redactor.$editor
                .find('p')
                .filter(function() { return !$.trim($(this).text()) })
                .remove()
        }

    }

    window.RedactorPlugins.cleanup = function() {
        return {
            init: function () {
                this.cleanup = new Cleanup(this)
            }
        }
    }

}(jQuery));