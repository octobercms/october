(function ($) {
    // Add an option for your plugin.
    // $.FroalaEditor.DEFAULTS = $.extend($.FroalaEditor.DEFAULTS, {
    //     myOption: false
    // });

    $.FroalaEditor.PLUGINS.figures = function (editor) {

        /**
         * Insert UI Blocks
         */
        function insert($el) {
            var html = $('<div />').append($el.clone()).remove().html()

            editor.html.insert(html)
            editor.selection.restore()
            editor.html.cleanEmptyTags()

            // Clean up wrapping paragraphs or empty paragraphs
            $('figure', editor.$el).each(function() {
                var $this = $(this),
                    $parent = $this.parent('p'),
                    $next = $this.next('p')

                if (!!$parent.length) {
                    $this.unwrap()
                }

                if (!!$next.length && $.trim($next.text()).length == 0) {
                    $next.remove()
                }
            })
        }

        /**
         * Init UI Blocks
         */
        function _initUiBlocks () {
            $('[data-video], [data-audio]', editor.$el).each(function() {
                $(this).attr({
                    'data-ui-block': true,
                    'tabindex': '0'
                })
                this.contentEditable = false
            })
        }

        function _handleUiBlocksKeydown(ev) {
            if (ev.which == 40 || ev.which == 38 || ev.which == 8 || ev.which == 46) {
                var $block = $(editor.selection.element())
                if ($block.is('br')) {
                    $block = $block.parent()
                }

                if (!!$block.length) {
                    switch (ev.which) {
                        case 38:
                            // Up arrow
                            _handleUiBlockCaretIn($block.prev())
                        break
                        case 40:
                            // Down arrow
                            _handleUiBlockCaretIn($block.next())
                        break
                        case 46:
                            // Delete key
                            _handleUiBlockCaretClearEmpty($block.next(), $block)
                        break
                        case 8:
                            // Backspace key
                            _handleUiBlockCaretClearEmpty($block.prev(), $block)
                        break
                    }
                }
            }
        }

        function _handleUiBlockCaretClearEmpty($block, $p) {
            if ($block.attr('data-ui-block') !== undefined && $.trim($p.text()).length == 0) {
                $p.remove()
                _handleUiBlockCaretIn($block)
                editor.undo.saveStep()
            }
        }

        function _handleUiBlockCaretIn($block) {
            if ($block.attr('data-ui-block') !== undefined) {
                $block.focus()
                editor.selection.clear()
                return true
            }

            return false
        }

        function _uiBlockKeyDown(ev, block) {
            if (ev.which == 40 || ev.which == 38 || ev.which == 13 || ev.which == 8 || ev.which == 46) {
                switch (ev.which) {
                    case 40:
                        // Down arrow
                        _focusUiBlockOrText($(block).next(), true)
                    break
                    case 38:
                        // Up arrow
                        _focusUiBlockOrText($(block).prev(), false)
                    break
                    case 13:
                        // Enter key
                        var $paragraph = $('<p><br/></p>')
                        $paragraph.insertAfter(block)
                        editor.selection.setAfter(block)
                        editor.selection.restore()
                        editor.undo.saveStep()
                    break
                    case 8:
                    case 46:
                        // Delete / Backspace key
                        var $nextFocus = $(block).next(),
                            gotoStart = true

                        if ($nextFocus.length == 0) {
                            $nextFocus = $(block).prev()
                            gotoStart = false
                        }

                        _focusUiBlockOrText($nextFocus, gotoStart)

                        $(block).remove()
                        editor.undo.saveStep()
                    break
                }

                ev.preventDefault()
            }
        }

        function _focusUiBlockOrText($block, gotoStart) {
            if (!!$block.length) {
                if (!_handleUiBlockCaretIn($block)) {
                    if (gotoStart) {
                        editor.selection.setAtStart($block.get(0))
                        editor.selection.restore()
                    }
                    else {
                        editor.selection.setAtEnd($block.get(0))
                        editor.selection.restore()
                    }
                }
            }
        }

        /**
         * Keydown
         */
        function _onKeydown (ev) {
            _handleUiBlocksKeydown(ev)

            if (ev.isDefaultPrevented()) {
                return false
            }
        }

        function _onFigureKeydown(ev) {
            if (ev.target && $(ev.target).attr('data-ui-block') !== undefined) {
                _uiBlockKeyDown(ev, ev.target)
            }

            if (ev.isDefaultPrevented()) {
                return false
            }
        }

        /**
         * Sync
         */
        function _onSync(html) {
            var $domTree = $('<div>' + html + '</div>')

            $domTree.find('[data-video], [data-audio]').each(function(){
                $(this).removeAttr('contenteditable data-ui-block tabindex')
            })

            return $domTree.html()
        }

        // The start point for your plugin.
        function _init () {
            editor.events.on('initialized', _initUiBlocks)

            editor.events.on('html.get', _onSync)

            editor.events.on('keydown', _onKeydown)

            editor.events.on('destroy', _destroy, true)

            editor.$el.on('keydown', 'figure', _onFigureKeydown)
        }

        /**
         * Destroy.
         */
        function _destroy () {
            editor.$el.off('keydown', 'figure', _onFigureKeydown)
        }

        return {
            _init: _init,
            insert: insert
        }
    }
})(jQuery);
