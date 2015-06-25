if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
    RedactorPlugins.pagelinks = function()
    {
        return {
            init: function()
            {
                if (!this.opts.pageLinksHandler) return

                this.modal.addCallback('link', $.proxy(this.pagelinks.load, this))
            },
            load: function()
            {
                var $select = $('<select id="redactor-page-links" />')
                $('#redactor-modal-link-insert').prepend($select)

                this.pagelinks.storage = {};

                this.$editor.request(this.opts.pageLinksHandler, {
                    success: $.proxy(function(data) {

                        $.each(data.links, $.proxy(function(key, val) {
                            this.pagelinks.storage[key] = val
                            $select.append($('<option>').val(key).html(val.name))
                        }, this))

                        $select.on('change', $.proxy(this.pagelinks.select, this))

                    }, this)
                })
            },
            select: function(e)
            {
                var key = $(e.target).val()
                var name = '', url = ''
                if (key !== 0) {
                    name = this.pagelinks.storage[key].name
                    url = this.pagelinks.storage[key].url
                }

                $('#redactor-link-url').val(url)

                var $el = $('#redactor-link-url-text')
                if ($el.val() === '') {
                    $el.val($.trim($('<span />').html(name).text()))
                }
            }
        };
    };
})(jQuery);