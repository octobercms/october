//
// Page links
//

var richeditorPageLinksPlugin

function richeditorPageLinksSelectPage($form) {
    richeditorPageLinksPlugin.setLinkValueFromPopup($form)
}

$.FroalaEditor.DEFAULTS = $.extend($.FroalaEditor.DEFAULTS, {
    pageLinksHandler: 'onLoadPageLinksForm'
});

$.FroalaEditor.DEFAULTS.key = 'HHMDUGENKACTMXQL==';

(function ($) {
    $.FroalaEditor.PLUGINS.pageLinks = function (editor) {

        function setLinkValueFromPopup($form) {
            var $select = $('select[name=pagelink]', $form)

            var link = {
                text: $('option:selected', $select).text().trim(),
                href: $select.val()
            }

            // Wait for popup to close
            setTimeout(function() {
                editor.popups.show('link.insert')

                setLinkValue(link)
            }, 300)
        }

        function setLinkValue(link) {
            var $popup = editor.popups.get('link.insert');
            var text_inputs = $popup.find('input.fr-link-attr[type="text"]');
            var check_inputs = $popup.find('input.fr-link-attr[type="checkbox"]');

            var $input;
            var i;
            for (i = 0; i < text_inputs.length; i++) {
                $input = $(text_inputs[i]);
                if (link[$input.attr('name')]) {
                    $input.val(link[$input.attr('name')]);
                }
                else if ($input.attr('name') != 'text') {
                    $input.val('');
                }
            }

            for (i = 0; i < check_inputs.length; i++) {
                $input = $(check_inputs[i]);
                $input.prop('checked', $input.data('checked') == link[$input.attr('name')]);
            }
        }

        function insertLink() {
            richeditorPageLinksPlugin = this

            editor.$el.popup({
                handler: editor.opts.pageLinksHandler
            })
        }

        /**
         * Init.
         */
        function _init () {
        }

        return {
            _init: _init,
            setLinkValueFromPopup: setLinkValueFromPopup,
            setLinkValue: setLinkValue,
            insertLink: insertLink
        }
    }

    $.FE.DEFAULTS.linkInsertButtons = ['linkBack', '|', 'linkPageLinks']

    $.FE.RegisterCommand('linkPageLinks', {
        title: 'Choose Link',
        undo: false,
        focus: false,
        callback: function () {
            this.pageLinks.insertLink()
        },
        plugin: 'pageLinks'
    })

    // Add the font size icon.
    $.FE.DefineIcon('linkPageLinks', {
        NAME: 'search'
    });

})(jQuery);
