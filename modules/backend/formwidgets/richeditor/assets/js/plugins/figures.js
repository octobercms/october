(function ($) {
    // Add an option for your plugin.
    // $.FroalaEditor.DEFAULTS = $.extend($.FroalaEditor.DEFAULTS, {
    //     myOption: false
    // });

    $.FroalaEditor.PLUGINS.figures = function (editor) {

        /**
         * Insert UI Blocks
         */
        function insertElement($el) {
            var html = $('<div />').append($el.clone()).remove().html()

            // Make sure we have focus.
            editor.events.focus(true)
            editor.selection.restore()

            editor.html.insert(html)
            editor.html.cleanEmptyTags()

            // Clean up wrapping paragraphs or empty paragraphs
            $('figure', editor.$el).each(function() {
                var $this = $(this),
                    $parent = $this.parent('p'),
                    $next = $this.next('p')

                // If block is inserted to a paragraph, insert it afterwards.
                if (!!$parent.length) {
                    $this.insertAfter($parent)
                }

                // Inserting a figure tag will put an empty paragraph tag 
                // directly after it, strip these instances out
                if (!!$next.length && $.trim($next.text()).length == 0) {
                    $next.remove()
                }
            })

            editor.undo.saveStep()
        }

        function _makeUiBlockElement() {
            var $node = $('<figure contenteditable="false" tabindex="0" data-ui-block="true">&nbsp;</figure>')

            $node.get(0).contentEditable = false

            return $node
        }

        function insertVideo(url, text) {
            var $node = _makeUiBlockElement()

            $node.attr('data-video', url)
            $node.attr('data-label', text)

            insertElement($node)
        }

        function insertAudio(url, text) {
            var $node = _makeUiBlockElement()

            $node.attr('data-audio', url)
            $node.attr('data-label', text)

            insertElement($node)
        }

        /**
         * Init UI Blocks
         */
        function _initUiBlocks () {
            $('[data-video], [data-audio]', editor.$el).each(function() {
                $(this)
                    .addClass('fr-draggable')
                    .attr({
                        'data-ui-block': 'true',
                        'draggable': 'true',
                        'tabindex': '0'
                    })
                    .html('&nbsp;')

                this.contentEditable = false
            })
        }

        function _handleUiBlocksKeydown(ev) {
            if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp' || ev.key === 'Backspace' || ev.key === 'Delete') {
                var $block = $(editor.selection.element())
                if ($block.is('br')) {
                    $block = $block.parent()
                }

                if (!!$block.length) {
                    switch (ev.key) {
                        case 'ArrowUp':
                            _handleUiBlockCaretIn($block.prev())
                        break
                        case 'ArrowDown':
                            _handleUiBlockCaretIn($block.next())
                        break
                        case 'Delete':
                            _handleUiBlockCaretClearEmpty($block.next(), $block)
                        break
                        case 'Backspace':
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
            if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp' || ev.key === 'Enter' || ev.key === 'Backspace' || ev.key === 'Delete') {
                switch (ev.key) {
                    case 'ArrowDown':
                        _focusUiBlockOrText($(block).next(), true)
                    break
                    case 'ArrowUp':
                        _focusUiBlockOrText($(block).prev(), false)
                    break
                    case 'Enter':
                        var $paragraph = $('<p><br/></p>')
                        $paragraph.insertAfter(block)
                        editor.selection.setAfter(block)
                        editor.selection.restore()
                        editor.undo.saveStep()
                    break
                    case 'Backspace':
                    case 'Delete':
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
                $(this)
                    .removeAttr('contenteditable data-ui-block tabindex draggable')
                    .removeClass('fr-draggable fr-dragging')
            })

            return $domTree.html()
        }

        /**
         * Init.
         */
        function _init () {
            editor.events.on('initialized', _initUiBlocks)

            editor.events.on('html.set', _initUiBlocks)

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
            insert: insertElement,
            insertVideo: insertVideo,
            insertAudio: insertAudio
        }
    }
})(jQuery);
