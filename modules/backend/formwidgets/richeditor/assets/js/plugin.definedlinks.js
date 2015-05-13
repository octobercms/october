if (!RedactorPlugins) var RedactorPlugins = {};

(function($) {

    RedactorPlugins.definedlinks = function() {
        return {
            init: function() {
                if (!this.opts.definedLinks) return;

                this.modal.addCallback('link', $.proxy(this.definedlinks.load, this));

            },
            load: function() {
                var $select = $('<select id="redactor-defined-links" />');
                $('#redactor-modal-link-insert').prepend($select);

                this.definedlinks.storage = {};

                $.getJSON(this.opts.definedLinks, $.proxy(function(data) {
                    $.each(data, $.proxy(function(key, val) {
                        this.definedlinks.storage[key] = val;
                        $select.append($('<option>').val(key).html(val.name));

                    }, this));

                    $select.on('change', $.proxy(this.definedlinks.select, this));

                }, this));

            },
            select: function(e) {
                var key = $(e.target).val();
                var name = '', url = '';
                if (key !== 0)
                {
                    name = this.definedlinks.storage[key].name;
                    url = this.definedlinks.storage[key].url;
                }

                $('#redactor-link-url').val(url);

                var $el = $('#redactor-link-url-text');
                if ($el.val() === '') $el.val(name);
            }
        };
    };
})(jQuery);